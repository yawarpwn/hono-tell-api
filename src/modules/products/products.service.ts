import { eq, desc } from 'drizzle-orm'
import { productsTable, productCategoriesTable } from '@/core/db/schemas'
import { HTTPException } from 'hono/http-exception'
import type { CreateProduct, UpdateProduct, Product } from './products.validation'
import type { DB } from '@/types'

export class ProductsService {
  static async getAll(db: DB) {
    const rows = await db.select().from(productsTable).orderBy(desc(productsTable.updatedAt))
    return rows
  }

  static async getById(db: DB, id: Product['id']) {
    const products = await db.select().from(productsTable).where(eq(productsTable.id, id))

    if (products.length === 0) {
      throw new HTTPException(404, {
        message: `product with id ${id} not found`,
      })
    }
    return products[0]
  }

  static async create(db: DB, newCustomer: CreateProduct) {
    const rows = await db.insert(productsTable).values(newCustomer).returning()
    console.log('inserting product service, ', { rows })

    if (rows.length === 0) {
      throw new HTTPException(404, {
        message: 'Failed to create product',
      })
    }

    return rows[0]
  }

  static async update(db: DB, id: Product['id'], updateCustomer: UpdateProduct) {
    const rows = await db.update(productsTable).set(updateCustomer).where(eq(productsTable.id, id)).returning()

    if (rows.length === 0) {
      throw new HTTPException(404, {
        message: `product with id ${id} not found`,
      })
    }

    return rows[0]
  }

  static async delete(db: DB, id: Product['id']) {
    const rows = await db.delete(productsTable).where(eq(productsTable.id, id)).returning()

    if (rows.length === 0) {
      throw new HTTPException(404, {
        message: `product with id ${id} not found`,
      })
    }
    return rows[0]
  }
}
