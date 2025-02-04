import { eq, and, type SQL, ilike, like, asc, desc } from 'drizzle-orm'
import { productsTable, productCategoriesTable } from '@/db/schemas'
import { HTTPException } from 'hono/http-exception'
import type { CreateProductDto, UpdateProductDto, ProductDto } from '@/types'
import { insertProductSchema, updateProductSchema } from '@/dtos'
import type { DB } from '@/types'
import { STATUS_CODE } from '@/constants'

export class ProductsModel {
  static async getAll(db: DB) {
    const products = await db
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
      })
      .from(productsTable)
      .limit(1000)
      .orderBy(desc(productsTable.updatedAt))
      .leftJoin(productCategoriesTable, eq(productsTable.categoryId, productCategoriesTable.id))
    return {
      items: products,
      meta: {
        totalItems: products.length,
      },
      links: {},
    }
  }

  static async getById(db: DB, id: ProductDto['id']) {
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
      throw new HTTPException(STATUS_CODE.NotFound, {
        message: `product with id ${id} not found`,
      })
    }
    return products[0]
  }

  static async create(db: DB, dto: CreateProductDto) {
    const { data, success, error } = insertProductSchema.safeParse(dto)

    if (!success) {
      console.log(error.errors)
      throw new HTTPException(STATUS_CODE.BadRequest, {
        message: 'Invalid product',
      })
    }
    const results = await db.insert(productsTable).values(data).returning()

    if (results.length === 0) {
      throw new HTTPException(STATUS_CODE.BadRequest, {
        message: 'Failed to create product',
      })
    }

    const [product] = results
    return product
  }

  static async update(db: DB, id: ProductDto['id'], dto: UpdateProductDto) {
    const { data, success, error } = updateProductSchema.safeParse(dto)

    if (!success) {
      console.log(error.errors)
      throw new HTTPException(STATUS_CODE.BadRequest, {
        message: 'Invalid product',
      })
    }

    if (Object.values(data).length === 0) {
      throw new HTTPException(STATUS_CODE.BadRequest, {
        message: 'Invalid product',
      })
    }

    const results = await db.update(productsTable).set(data).where(eq(productsTable.id, id)).returning()

    if (results.length === 0) {
      throw new HTTPException(STATUS_CODE.NotFound, {
        message: `product with id ${id} not found`,
      })
    }

    return results[0]
  }

  static async delete(db: DB, id: ProductDto['id']) {
    const results = await db.delete(productsTable).where(eq(productsTable.id, id)).returning()

    if (results.length === 0) {
      throw new HTTPException(STATUS_CODE.NotFound, {
        message: `product with id ${id} not found`,
      })
    }
    return results[0]
  }
}
