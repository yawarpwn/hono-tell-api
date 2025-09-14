import { eq, like, desc, count, or, sql, SQL } from 'drizzle-orm'
import { quotationsTable, customersTable } from '@/core/db/schemas'
import { HTTPException } from 'hono/http-exception'
import type { CreateQuotation, UpdateQuotation, Quotation } from './quotations.validation'
import { type QuotationQueryParams } from './quotations.validation'
import type { DB } from '@/types'

export class QuotationsService {
  static async getAll(db: DB, queryParams: QuotationQueryParams) {
    const { page, limit, query } = queryParams

    console.log({ page, limit, query })

    // Construir condicion where
    let whereCondition: SQL | undefined

    // En caso de buscar por query
    if (query) {
      const num = parseInt(query)
      if (Number.isNaN(num)) {
        // Buscar por Nombre
        whereCondition = like(customersTable.name, `%${query}%`)
      } else if (num.toString().length === 11) {
        // buscar por ruc
        whereCondition = eq(customersTable.ruc, query)
      } else {
        // buscar por  numero de cotizacion
        whereCondition = eq(quotationsTable.number, num)
      }
    }
    // TODO: implement filters

    const whereClause = whereCondition

    // Obtener el total de cotizaciones con la clausula where
    const [totalResult] = await db
      .select({ count: count() })
      .from(quotationsTable)
      .leftJoin(customersTable, eq(quotationsTable.customerId, customersTable.id))
      .where(whereClause)

    const total = totalResult.count

    const offset = (page - 1) * limit

    // Obtener cotizaciones paginadas
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
        createdAt: quotationsTable.createdAt,
        updatedAt: quotationsTable.updatedAt,
        customerId: customersTable.id,
        paymentCodition: quotationsTable.paymentCodition,
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
      .where(whereClause)
      .orderBy(desc(quotationsTable.updatedAt))
      .limit(limit)
      .offset(offset)
      .all()

    const totalPages = Math.ceil(total / limit)

    return {
      data: quotations,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
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
        paymentCodition: quotationsTable.paymentCodition,
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
        paymentCodition: quotationsTable.paymentCodition,
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

  static async create(db: DB, newQuotation: CreateQuotation) {
    let lastQuotationNumber = 0

    // Obtener el ultimo numero de cotizacion existente
    const quotations = await db
      .select({ lastQuotationNumber: quotationsTable.number })
      .from(quotationsTable)
      .orderBy(desc(quotationsTable.number))
      .limit(1)

    // Si existen cotizaciones, obtener el ultimo numero
    if (quotations.length > 0) {
      lastQuotationNumber = quotations[0].lastQuotationNumber
    }

    const rows = await db
      .insert(quotationsTable)
      .values({
        ...newQuotation,
        number: lastQuotationNumber + 1,
      })
      .returning()

    return rows[0]
  }

  static async update(db: DB, quotationNumber: Quotation['number'], quotationToUpdate: UpdateQuotation) {
    const results = await db.update(quotationsTable).set(quotationToUpdate).where(eq(quotationsTable.number, quotationNumber)).returning()

    if (results.length === 0) {
      throw new HTTPException(404, {
        message: `quotation ${quotationNumber} not found`,
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
