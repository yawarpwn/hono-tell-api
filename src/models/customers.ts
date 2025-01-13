import { eq, and, type SQL } from 'drizzle-orm'
import { customersTable } from '@/db/schemas'
import { HTTPException } from 'hono/http-exception'
import type { CreateCustomerDto, UpdateCustomerDto, CustomerDto } from '@/dtos'
import { InsertCustomerSchema, UpdateCustomerSchema } from '@/dtos'
import type { DB } from '@/types'
import { STATUS_CODE } from '@/constants'

export class CustomersModel {
  static async getAll(db: DB) {
    const customers = await db.select().from(customersTable)
    return customers
  }

  static async getById(db: DB, id: CustomerDto['id']) {
    const customers = await db
      .select()
      .from(customersTable)
      .where(eq(customersTable.id, id))
    if (customers.length === 0) {
      throw new HTTPException(STATUS_CODE.NotFound, {
        message: `Customer with id ${id} not found`,
      })
    }
    return customers[0]
  }

  static async create(db: DB, dto: CreateCustomerDto) {
    const { data, error } = InsertCustomerSchema.safeParse(dto)

    if (error) {
      throw new HTTPException(STATUS_CODE.BadRequest, {
        message: 'Invalid customer',
      })
    }

    const id = crypto.randomUUID()

    const results = await db
      .insert(customersTable)
      .values({ ...data, id })
      .returning({ insertedId: customersTable.id })

    if (results.length === 0) {
      throw new HTTPException(STATUS_CODE.BadRequest, {
        message: 'Failed to create customer',
      })
    }

    const [customer] = results
    return customer
  }

  static async update(db: DB, id: CustomerDto['id'], dto: UpdateCustomerDto) {
    const { data, error } = UpdateCustomerSchema.safeParse(dto)

    if (error) {
      throw new HTTPException(STATUS_CODE.BadRequest, {
        message: 'Invalid customer',
      })
    }

    if (Object.values(data).length === 0) {
      throw new HTTPException(STATUS_CODE.BadRequest, {
        message: 'Invalid customer',
      })
    }

    const results = await db
      .update(customersTable)
      .set(data)
      .where(eq(customersTable.id, id))
      .returning()

    if (results.length === 0) {
      throw new HTTPException(STATUS_CODE.NotFound, {
        message: `Customer with id ${id} not found`,
      })
    }

    return results[0]
  }

  static async delete(db: DB, id: CustomerDto['id']) {
    const results = await db
      .delete(customersTable)
      .where(eq(customersTable.id, id))
      .returning()

    if (results.length === 0) {
      throw new HTTPException(STATUS_CODE.NotFound, {
        message: `Customer with id ${id} not found`,
      })
    }
    return results[0]
  }
}
