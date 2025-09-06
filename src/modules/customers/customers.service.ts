import { eq } from 'drizzle-orm'
import { customersTable } from '@/core/db/schemas'
import { HTTPException } from 'hono/http-exception'
import type { DB } from '@/types'
import type { Customer, CreateCustomer, UpdateCustomer, CustomerQueryParams } from './customers.validation'
import { getCustomerByDni, getCustomerByRuc } from '@/lib/sunat'

//TODO: implement type CustomerQueryParams
// import type { CustomerQueryParams } from '@/routes'

type Company = {
  ruc: string
  name: string
  address: string
}

export class CustomersService {
  static async getAll(db: DB, { onlyRegular }: CustomerQueryParams) {
    const rows = await db
      .select()
      .from(customersTable)
      .where(onlyRegular ? eq(customersTable.isRegular, true) : undefined)
    // .limit(pageSize)
    // .offset((page - 1) * pageSize)
    return rows
  }

  static async getByRucFromSunat(ruc: string): Promise<Company> {
    return getCustomerByRuc(ruc)
  }

  static async getByDniFromSunat(dni: string): Promise<Company> {
    return getCustomerByDni(dni)
  }

  static async getByRuc(db: DB, ruc: Customer['ruc']) {
    const customers = await db.select().from(customersTable).where(eq(customersTable.ruc, ruc))

    if (customers.length === 0) {
      return null
    }

    return customers[0]
  }

  static async getById(db: DB, id: Customer['id']) {
    const customers = await db.select().from(customersTable).where(eq(customersTable.id, id))

    if (customers.length === 0) {
      throw new HTTPException(404, {
        message: `Customer with id: ${id} not found`,
      })
    }
    return customers[0]
  }

  static async create(db: DB, customerToCreate: CreateCustomer) {
    const results = await db.insert(customersTable).values(customerToCreate).returning()
    return results[0]
  }

  static async update(db: DB, id: Customer['id'], customerToUpdate: UpdateCustomer) {
    const results = await db.update(customersTable).set(customerToUpdate).where(eq(customersTable.id, id)).returning()

    if (results.length === 0) {
      throw new HTTPException(404, {
        message: `Customer with id ${id} not found`,
      })
    }

    return results[0]
  }

  static async delete(db: DB, id: Customer['id']) {
    const results = await db.delete(customersTable).where(eq(customersTable.id, id)).returning()

    if (results.length === 0) {
      throw new HTTPException(404, {
        message: `Customer with id ${id} not found`,
      })
    }

    return results[0]
  }
}
