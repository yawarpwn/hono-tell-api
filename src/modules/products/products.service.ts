import { eq, desc } from 'drizzle-orm'
import { productsTable, productCategoriesTable } from '@/core/db/schemas'
import { HTTPException } from 'hono/http-exception'
import type { CreateProduct, UpdateProduct, Product } from './products.validation'
import { insertProductSchema, updateProductSchema } from './products.validation'
import type { DB } from '@/types'

export class ProductsService {
  static async getAll(db: DB) {
    const rows = await db
      .select({
        id: productsTable.id,
        description: productsTable.description,
        code: productsTable.code,
        unitSize: productsTable.unitSize,
        category: productCategoriesTable.name,
        link: productsTable.link,
        rank: productsTable.rank,
        price: productsTable.price,
        cost: productsTable.cost,
        createdAt: productsTable.createdAt,
        updatedAt: productsTable.updatedAt,
        categoryId: productCategoriesTable.id,
      })
      .from(productsTable)
      .limit(1000)
      .orderBy(desc(productsTable.updatedAt))
      .leftJoin(productCategoriesTable, eq(productsTable.categoryId, productCategoriesTable.id))

    return {
      items: rows,
      metadata: {
        totalItems: rows.length,
        // pageSize: pageSize,
        // pageNumber: page,
      },
      links: {},
    }
  }

  static async getById(db: DB, id: Product['id']) {
    const products = await db
      .select({
        id: productsTable.id,
        description: productsTable.description,
        code: productsTable.code,
        unitSize: productsTable.unitSize,
        category: productCategoriesTable.name,
        categoryId: productsTable.categoryId,
        link: productsTable.link,
        rank: productsTable.rank,
        price: productsTable.price,
        cost: productsTable.cost,
        createdAt: productsTable.createdAt,
        updatedAt: productsTable.updatedAt,
      })
      .from(productsTable)
      .where(eq(productsTable.id, id))
      .leftJoin(productCategoriesTable, eq(productsTable.categoryId, productCategoriesTable.id))
    if (products.length === 0) {
      throw new HTTPException(404, {
        message: `product with id ${id} not found`,
      })
    }
    return products[0]
  }

  static async create(db: DB, dto: CreateProduct) {
    const { data, success, error } = insertProductSchema.safeParse(dto)

    if (!success) {
      console.log(error.issues)
      throw new HTTPException(404, {
        message: 'Invalid product',
      })
    }
    const results = await db.insert(productsTable).values(data).returning()

    if (results.length === 0) {
      throw new HTTPException(404, {
        message: 'Failed to create product',
      })
    }

    const [product] = results
    return product
  }

  static async update(db: DB, id: Product['id'], dto: UpdateProduct) {
    const { data, success, error } = updateProductSchema.safeParse(dto)

    if (!success) {
      console.log(error.issues)
      throw new HTTPException(404, {
        message: 'Invalid product',
      })
    }

    if (Object.values(data).length === 0) {
      throw new HTTPException(404, {
        message: 'Invalid product',
      })
    }

    const results = await db.update(productsTable).set(data).where(eq(productsTable.id, id)).returning()

    if (results.length === 0) {
      throw new HTTPException(404, {
        message: `product with id ${id} not found`,
      })
    }

    return results[0]
  }

  static async delete(db: DB, id: Product['id']) {
    const results = await db.delete(productsTable).where(eq(productsTable.id, id)).returning()

    if (results.length === 0) {
      throw new HTTPException(404, {
        message: `product with id ${id} not found`,
      })
    }
    return results[0]
  }
}
