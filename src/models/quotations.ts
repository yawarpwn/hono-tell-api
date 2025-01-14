import { eq, and, type SQL, ilike, like, asc, desc } from 'drizzle-orm'
import { quotationsTable, customersTable } from '@/db/schemas'
import { HTTPException } from 'hono/http-exception'
import type { CreateQuotationDto, UpdateQuotationDto, QuotationDto } from '@/types'
import { InsertQuotationSchema, UpdateQuotationSchema } from '@/dtos'
import type { DB } from '@/types'
import { STATUS_CODE } from '@/constants'

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
    return quotations
  }

  static async getById(db: DB, id: QuotationDto['id']) {
    const quotations = await db.select().from(quotationsTable).where(eq(quotationsTable.id, id))
    if (quotations.length === 0) {
      throw new HTTPException(STATUS_CODE.NotFound, {
        message: `quotation with id ${id} not found`,
      })
    }
    return quotations[0]
  }

  static async create(db: DB, dto: CreateQuotationDto) {
    const { data, success } = InsertQuotationSchema.safeParse(dto)

    if (!success) {
      throw new HTTPException(STATUS_CODE.BadRequest, {
        message: 'Invalid quotation',
      })
    }

    const id = crypto.randomUUID()

    const results = await db
      .insert(quotationsTable)
      .values({
        ...data,
        id,
        items: [
          {
            id: 'adad',
            price: 10,
            cost: 5,
            qty: 1,
            link: 'https://google.com',
            unit_size: 'und',
            description: 'product prueba llll',
          },
          {
            id: 'azzzdad',
            price: 10,
            cost: 5,
            qty: 1,
            link: 'https://google.com',
            unit_size: 'und',
            description: 'product prueba llll',
          },
        ],
      })
      .returning({ insertedId: quotationsTable.id })

    if (results.length === 0) {
      throw new HTTPException(STATUS_CODE.BadRequest, {
        message: 'Failed to create quotation',
      })
    }

    const [quotation] = results
    return quotation
  }

  static async update(db: DB, id: QuotationDto['id'], dto: UpdateQuotationDto) {
    const { data, success } = UpdateQuotationSchema.safeParse(dto)

    if (!success) {
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

  static async delete(db: DB, id: QuotationDto['id']) {
    const results = await db.delete(quotationsTable).where(eq(quotationsTable.id, id)).returning()

    if (results.length === 0) {
      throw new HTTPException(STATUS_CODE.NotFound, {
        message: `quotation with id ${id} not found`,
      })
    }
    return results[0]
  }
}
