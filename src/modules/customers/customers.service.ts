import { asc, count, desc, eq, ilike, like, or, sql } from 'drizzle-orm'
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
  static async getAll(db: DB, queryParms: CustomerQueryParams) {
    const { onlyRegular, page, limit, search, sortBy, sortOrder } = queryParms

    console.log({ onlyRegular, page, limit, search, sortBy, sortOrder })

    // Construir condicion where
    let whereCodition = []

    if (onlyRegular) {
      whereCodition.push(eq(customersTable.isRegular, true))
    }

    if (search) {
      whereCodition.push(or(like(customersTable.name, `%${search}%`), like(customersTable.ruc, `%${search}%`)))
    }

    // Cambiar codicion
    const whereClause =
      whereCodition.length > 0
        ? sql`${whereCodition.reduce((acc, codition, index) => (index === 0 ? codition : sql`${acc} AND ${codition}`))}`
        : undefined

    // Configurar ordenamiento
    const orderClause = sortOrder === 'asc' ? asc(customersTable[sortBy]) : desc(customersTable[sortBy])

    // Obtener total de registros
    const [totalResult] = await db.select({ count: count() }).from(customersTable).where(whereClause)

    const total = totalResult.count

    // Calcular offset
    const offset = (page - 1) * limit

    // Obtener registros paginados
    const customers = await db.select().from(customersTable).where(whereClause).orderBy(orderClause).limit(limit).offset(offset)

    // Calcular informacion de paginacion
    const totalPages = Math.ceil(total / limit)

    return {
      data: customers,
      pagintation: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        pasPrevPages: page > 1,
      },
    }
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
