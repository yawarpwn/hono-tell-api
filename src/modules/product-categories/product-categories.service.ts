import { productCategoriesTable } from '@/db/schemas'
import { HTTPException } from 'hono/http-exception'
import type { DB } from '@/types'

export class ProductCategoriesService {
  static async getAll(db: DB) {
    const productCategories = await db.select().from(productCategoriesTable)

    if (productCategories.length === 0) {
      throw new HTTPException(404, {
        message: 'Product categories not found',
      })
    }
    return {
      items: productCategories,
      meta: {
        totalItems: productCategories.length,
      },
      links: {},
    }
  }
}
