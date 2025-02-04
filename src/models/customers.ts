import { eq, and, type SQL, ilike, like } from 'drizzle-orm'
import { customersTable } from '@/db/schemas'
import { HTTPException } from 'hono/http-exception'
import type { CreateCustomerDto, UpdateCustomerDto, CustomerDto } from '@/types'
import { insertQuotationSchema, updateCustomerSchema } from '@/dtos'
import type { DB } from '@/types'
import { STATUS_CODE } from '@/constants'

export class CustomersModel {
  static async getAll(db: DB, { page = 1, pageSize = 2, ruc = '' }) {
    const customers = await db.select().from(customersTable)
    // .where(name ? like(customersTable.name, `%${}%`) : undefined)
    // .limit(pageSize)
    // .offset((page - 1) * pageSize)

    if (customers.length === 0) {
      throw new HTTPException(404, {
        message: 'Customers not found',
      })
    }
    return {
      items: customers,
      meta: {
        totalItems: customers.length,
      },
      links: {},
    }
  }

  static async getByRuc(db: DB, ruc: CustomerDto['ruc']) {
    const customers = await db.select().from(customersTable).where(eq(customersTable.ruc, ruc))
    if (customers.length === 0) {
      throw new HTTPException(404, {
        message: `Customer with ruc: ${ruc} not found`,
      })
    }
    return customers[0]
  }

  static async create(db: DB, dto: CreateCustomerDto) {
    const { data, success, error } = insertQuotationSchema.safeParse(dto)

    if (!success) {
      console.log(error.errors)
      throw new HTTPException(STATUS_CODE.BadRequest, {
        message: 'Invalid customer',
      })
    }

    const results = await db.insert(customersTable).values(data).returning({ insertedId: customersTable.id })

    if (results.length === 0) {
      throw new HTTPException(STATUS_CODE.BadRequest, {
        message: 'Failed to create customer',
      })
    }

    const [customer] = results
    return customer
  }

  static async update(db: DB, id: CustomerDto['id'], dto: UpdateCustomerDto) {
    const { data, success, error } = updateCustomerSchema.safeParse(dto)

    if (!success) {
      console.log(error.errors)
      throw new HTTPException(STATUS_CODE.BadRequest, {
        message: 'Invalid customer',
      })
    }

    if (Object.values(data).length === 0) {
      throw new HTTPException(STATUS_CODE.BadRequest, {
        message: 'Invalid customer',
      })
    }

    const results = await db.update(customersTable).set(data).where(eq(customersTable.id, id)).returning()

    if (results.length === 0) {
      throw new HTTPException(STATUS_CODE.NotFound, {
        message: `Customer with id ${id} not found`,
      })
    }

    return results[0]
  }

  static async delete(db: DB, id: CustomerDto['id']) {
    const results = await db.delete(customersTable).where(eq(customersTable.id, id)).returning()

    if (results.length === 0) {
      throw new HTTPException(STATUS_CODE.NotFound, {
        message: `Customer with id ${id} not found`,
      })
    }
    return results[0]
  }
}
