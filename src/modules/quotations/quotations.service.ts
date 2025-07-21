import { eq, like, desc, count } from 'drizzle-orm'
import { quotationsTable, customersTable } from '@/core/db/schemas'
import { HTTPException } from 'hono/http-exception'
import type { CreateQuotation, UpdateQuotation, Quotation } from './quotations.validation'
import { insertQuotationSchema, updateQuotationSchema } from './quotations.validation'
import type { DB } from '@/types'
import { CustomersService } from '@/modules/customers/customers.service'

export class QuotationsService {
  static async getAll(db: DB, { page = 1, limit, q }: any) {
    const search = (query: string | undefined) => {
      if (!query) return undefined

      if (query.length === 11 && !Number.isNaN(Number(query))) {
        return eq(customersTable.ruc, query)
      }
      const isNumber = !Number.isNaN(Number(query))
      if (isNumber) {
        const queryNumber = Number(query)
        return eq(quotationsTable.number, queryNumber)
      }
      return like(customersTable.name, `%${query}%`)
    }

    let query = db
      .select({
        id: quotationsTable.id,
        number: quotationsTable.number,
        deadline: quotationsTable.deadline,
        credit: quotationsTable.credit,
        includeIgv: quotationsTable.includeIgv,
        isPaymentPending: quotationsTable.isPaymentPending,
        observations: quotationsTable.observations,
        validityDays: quotationsTable.validityDays,
        standardTerms: quotationsTable.standardTerms,
        items: quotationsTable.items,
        createdAt: quotationsTable.createdAt,
        updatedAt: quotationsTable.updatedAt,
        customerId: customersTable.id,
        customer: {
          id: customersTable.id,
          name: customersTable.name,
          ruc: customersTable.ruc,
          phone: customersTable.phone,
          address: customersTable.address,
          email: customersTable.email,
          isRegular: customersTable.isRegular,
          createdAt: customersTable.createdAt,
          updatedAt: customersTable.updatedAt,
        },
      })
      .from(quotationsTable)
      .leftJoin(customersTable, eq(quotationsTable.customerId, customersTable.id))
      .where(search(q))
      // .where(query ? eq(quotationsTable.number, 7050) : undefined)
      .orderBy(desc(quotationsTable.updatedAt))
    if (limit !== undefined) {
      //@ts-ignore
      query = query.limit(limit).offset((page - 1) * limit)
    }

    const quotations = await query

    const rows = await db
      .select({ total: count(quotationsTable.id) })
      .from(quotationsTable)
      .leftJoin(customersTable, eq(quotationsTable.customerId, customersTable.id))
      .where(search(q))

    return {
      items: quotations,
      meta: {
        totalItems: rows[0].total,
      },
      links: {},
    }
  }

  static async getById(db: DB, id: Quotation['id']) {
    const quotations = await db
      .select({
        id: quotationsTable.id,
        number: quotationsTable.number,
        deadline: quotationsTable.deadline,
        credit: quotationsTable.credit,
        includeIgv: quotationsTable.includeIgv,
        isPaymentPending: quotationsTable.isPaymentPending,
        observations: quotationsTable.observations,
        validityDays: quotationsTable.validityDays,
        items: quotationsTable.items,
        createdAt: quotationsTable.createdAt,
        updatedAt: quotationsTable.updatedAt,
        standardTerms: quotationsTable.standardTerms,
        customer: {
          id: customersTable.id,
          name: customersTable.name,
          ruc: customersTable.ruc,
          phone: customersTable.phone,
          address: customersTable.address,
          email: customersTable.email,
          isRegular: customersTable.isRegular,
          createdAt: customersTable.createdAt,
          updatedAt: customersTable.updatedAt,
        },
      })
      .from(quotationsTable)
      .where(eq(quotationsTable.id, id))
      .leftJoin(customersTable, eq(quotationsTable.customerId, customersTable.id))
    if (quotations.length === 0) {
      throw new HTTPException(404, {
        message: `Cotizacion con id ${id},No encontrada`,
      })
    }
    return quotations[0]
  }

  static async getByNumber(db: DB, quotationNumber: Quotation['number']) {
    const quotations = await db
      .select({
        id: quotationsTable.id,
        number: quotationsTable.number,
        deadline: quotationsTable.deadline,
        credit: quotationsTable.credit,
        includeIgv: quotationsTable.includeIgv,
        isPaymentPending: quotationsTable.isPaymentPending,
        observations: quotationsTable.observations,
        validityDays: quotationsTable.validityDays,
        standardTerms: quotationsTable.standardTerms,
        items: quotationsTable.items,
        customerId: customersTable.id,
        customer: {
          id: customersTable.id,
          name: customersTable.name,
          ruc: customersTable.ruc,
          phone: customersTable.phone,
          address: customersTable.address,
          email: customersTable.email,
          isRegular: customersTable.isRegular,
          createdAt: customersTable.createdAt,
          updatedAt: customersTable.updatedAt,
        },
        createdAt: quotationsTable.createdAt,
        updatedAt: quotationsTable.updatedAt,
      })
      .from(quotationsTable)
      .where(eq(quotationsTable.number, quotationNumber))
      .leftJoin(customersTable, eq(quotationsTable.customerId, customersTable.id))
    if (quotations.length === 0) {
      throw new HTTPException(404, {
        message: `Cotización con Numero: ${quotationNumber}, No encontrada`,
      })
    }
    return quotations[0]
  }

  static async create(db: DB, dto: CreateQuotation) {
    let customerId = dto.customerId

    if (!dto.customerId && dto.customer?.name && dto.customer?.ruc) {
      console.log('insert new customer to db')
      const { insertedId } = await CustomersService.create(db, {
        name: dto.customer.name,
        ruc: dto.customer.ruc,
        isRegular: false,
      })
      customerId = insertedId
    }

    const { data, success, error } = insertQuotationSchema.safeParse({
      ...dto,
      customerId,
    })

    if (!success) {
      console.log(error.issues)
      throw new HTTPException(400, {
        message: 'Invalid quotation',
      })
    }

    let lastQuotationNumber = 0

    const quotations = await db
      .select({ lastQuotationNumber: quotationsTable.number })
      .from(quotationsTable)
      .orderBy(desc(quotationsTable.number))
      .limit(1)

    if (quotations.length > 0) {
      lastQuotationNumber = quotations[0].lastQuotationNumber
    }

    const results = await db
      .insert(quotationsTable)
      .values({ ...data, number: lastQuotationNumber + 1 || 0 })
      .returning({
        insertedId: quotationsTable.id,
        insertedNumber: quotationsTable.number,
      })

    if (results.length === 0) {
      throw new HTTPException(400, {
        message: 'Failed to create quotation',
      })
    }

    const [quotation] = results
    console.log({ quotation })
    return quotation
  }

  static async update(db: DB, id: Quotation['id'], quotationData: UpdateQuotation) {
    const { data, success, error } = updateQuotationSchema.safeParse(quotationData)

    if (!success) {
      console.log(error.issues)
      throw new HTTPException(400, {
        message: 'Invalid quotation',
      })
    }

    if (Object.values(data).length === 0) {
      throw new HTTPException(400, {
        message: 'Invalid quotation',
      })
    }

    let customerId = quotationData.customerId

    if (!quotationData.customerId) {
      if (quotationData.customer?.name && quotationData?.customer?.ruc) {
        console.log('update  new customer to db')
        const { insertedId } = await CustomersService.create(db, {
          name: quotationData.customer.name,
          ruc: quotationData.customer.ruc,
          isRegular: quotationData.customer.isRegular,
        })
        customerId = insertedId
      }
    }

    const results = await db
      .update(quotationsTable)
      .set({
        ...data,
        customerId,
      })
      .where(eq(quotationsTable.id, id))
      .returning()

    if (results.length === 0) {
      throw new HTTPException(404, {
        message: `quotation with id ${id} not found`,
      })
    }

    return results[0]
  }

  static async delete(db: DB, quotationNumber: Quotation['number']) {
    const results = await db.delete(quotationsTable).where(eq(quotationsTable.number, quotationNumber)).returning()

    if (results.length === 0) {
      throw new HTTPException(404, {
        message: `quotation with id ${quotationNumber} not found`,
      })
    }
    return results[0]
  }
}
