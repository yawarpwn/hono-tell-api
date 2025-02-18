import { eq, and, type SQL, ilike, like } from 'drizzle-orm'
import { watermarksTable } from '@/db/schemas'
import { HTTPException } from 'hono/http-exception'
import type { CreateWatermarkDto, UpdateWatermarkDto, WatermarkDto } from '@/types'
import type { DB } from '@/types'

export class WatermarksModel {
  static async getAll(db: DB) {
    const customers = await db.select().from(watermarksTable)

    return {
      items: customers,
      meta: {
        totalItems: customers.length,
      },
      links: {},
    }
  }

  static async getById(db: DB, id: WatermarkDto['id']) {
    const customers = await db.select().from(watermarksTable).where(eq(watermarksTable.id, id))
    if (customers.length === 0) {
      throw new HTTPException(404, {
        message: `Watermk with ruc: ${id} not found`,
      })
    }
    return customers[0]
  }

  static async create(db: DB, data: CreateWatermarkDto) {
    const results = await db.insert(watermarksTable).values(data).returning({ insertedId: watermarksTable.id })

    if (results.length === 0) {
      throw new HTTPException(400, {
        message: 'Failed to create customer',
      })
    }

    const [customer] = results
    return customer
  }

  static async update(db: DB, id: WatermarkDto['id'], data: UpdateWatermarkDto) {
    const results = await db.update(watermarksTable).set(data).where(eq(watermarksTable.id, id)).returning()

    if (results.length === 0) {
      throw new HTTPException(404, {
        message: `Watermk with id ${id} not found`,
      })
    }

    return results[0]
  }

  static async delete(db: DB, id: WatermarkDto['id']) {
    const results = await db.delete(watermarksTable).where(eq(watermarksTable.id, id)).returning()

    if (results.length === 0) {
      throw new HTTPException(404, {
        message: `Watermk with id ${id} not found`,
      })
    }
    return results[0]
  }
}
