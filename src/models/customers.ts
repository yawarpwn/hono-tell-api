import { eq, and, type SQL, ilike, like } from 'drizzle-orm'
import { customersTable } from '@/db/schemas'
import { HTTPException } from 'hono/http-exception'
import type { CreateCustomerDto, UpdateCustomerDto, CustomerDto } from '@/types'
import { InsertCustomerSchema, UpdateCustomerSchema } from '@/dtos'
import type { DB } from '@/types'
import { STATUS_CODE } from '@/constants'

export class CustomersModel {
  static async getAll(db: DB, { page = 1, pageSize = 2, name = '' }) {
    const customers = await db
      .select()
      .from(customersTable)
      .where(name ? like(customersTable.name, `%${name}%`) : undefined)
    // .limit(pageSize)
    // .offset((page - 1) * pageSize)
    return customers
  }

  static async getById(db: DB, id: CustomerDto['id']) {
    const customers = await db.select().from(customersTable).where(eq(customersTable.id, id))
    if (customers.length === 0) {
      throw new HTTPException(STATUS_CODE.NotFound, {
        message: `Customer with id ${id} not found`,
      })
    }
    return customers[0]
  }

  static async create(db: DB, dto: CreateCustomerDto) {
    const { data, success, error } = InsertCustomerSchema.safeParse(dto)

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
    const { data, success, error } = UpdateCustomerSchema.safeParse(dto)

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
