import { eq, and, type SQL, ilike, like, asc, desc } from 'drizzle-orm'
import { quotationsTable, customersTable } from '@/db/schemas'
import { HTTPException } from 'hono/http-exception'
import type { CreateQuotationDto, UpdateQuotationDto, QuotationDto, CreateCustomerDto } from '@/types'
import { InsertQuotationSchema, UpdateQuotationSchema } from '@/dtos'
import type { DB } from '@/types'
import { STATUS_CODE } from '@/constants'
import { CustomersModel } from '@/models/customers'

export class QuotationsModel {
  static async getAll(db: DB) {
    const quotations = await db
      .select({
        id: quotationsTable.id,
        number: quotationsTable.number,
        deadline: quotationsTable.deadline,
        credit: quotationsTable.credit,
        includeIgv: quotationsTable.includeIgv,
        isPaymentPending: quotationsTable.isPaymentPending,
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
      .limit(2000)
      .orderBy(desc(quotationsTable.updatedAt))
    return {
      items: quotations,
      meta: {
        totalItems: quotations.length,
      },
      links: {},
    }
  }

  static async getById(db: DB, id: QuotationDto['id']) {
    const quotations = await db
      .select({
        id: quotationsTable.id,
        number: quotationsTable.number,
        deadline: quotationsTable.deadline,
        credit: quotationsTable.credit,
        includeIgv: quotationsTable.includeIgv,
        isPaymentPending: quotationsTable.isPaymentPending,
        items: quotationsTable.items,
        createdAt: quotationsTable.createdAt,
        updatedAt: quotationsTable.updatedAt,
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
      throw new HTTPException(STATUS_CODE.NotFound, {
        message: `Cotizacion con id ${id},No encontrada`,
      })
    }
    return quotations[0]
  }

  static async getByNumber(db: DB, quotationNumber: QuotationDto['number']) {
    const quotations = await db
      .select({
        id: quotationsTable.id,
        number: quotationsTable.number,
        deadline: quotationsTable.deadline,
        credit: quotationsTable.credit,
        includeIgv: quotationsTable.includeIgv,
        isPaymentPending: quotationsTable.isPaymentPending,
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
      throw new HTTPException(STATUS_CODE.NotFound, {
        message: `Cotización con Numero: ${quotationNumber}, No encontrada`,
      })
    }
    return quotations[0]
  }

  static async create(db: DB, dto: CreateQuotationDto & { customer: CreateCustomerDto }) {
    let customerId = dto.customerId

    if (!dto.customerId) {
      if (dto?.customer?.name && dto?.customer?.ruc) {
        CustomersModel.create(db, dto.customer)
          .then((data) => {
            customerId = data.insertedId
          })
          .catch((err) => {
            console.log(err)
            throw new HTTPException(400, {
              message: 'Error creando el cliente',
            })
          })
      }
    }

    const { data, success, error } = InsertQuotationSchema.safeParse({
      ...dto,
      customerId,
    })

    if (!success) {
      console.log(error.errors)
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
      throw new HTTPException(STATUS_CODE.BadRequest, {
        message: 'Failed to create quotation',
      })
    }

    const [quotation] = results
    console.log({ quotation })
    return quotation
  }

  static async update(db: DB, id: QuotationDto['id'], dto: UpdateQuotationDto) {
    const { data, success, error } = UpdateQuotationSchema.safeParse(dto)

    if (!success) {
      console.log(error.errors)
      throw new HTTPException(STATUS_CODE.BadRequest, {
        message: 'Invalid quotation',
      })
    }

    if (Object.values(data).length === 0) {
      throw new HTTPException(STATUS_CODE.BadRequest, {
        message: 'Invalid quotation',
      })
    }

    const results = await db.update(quotationsTable).set(data).where(eq(quotationsTable.id, id)).returning()

    if (results.length === 0) {
      throw new HTTPException(STATUS_CODE.NotFound, {
        message: `quotation with id ${id} not found`,
      })
    }

    return results[0]
  }

  static async delete(db: DB, quotationNumber: QuotationDto['number']) {
    const results = await db.delete(quotationsTable).where(eq(quotationsTable.number, quotationNumber)).returning()

    if (results.length === 0) {
      throw new HTTPException(STATUS_CODE.NotFound, {
        message: `quotation with id ${quotationNumber} not found`,
      })
    }
    return results[0]
  }
}
