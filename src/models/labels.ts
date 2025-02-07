import { eq, and, type SQL, ilike, like } from 'drizzle-orm'
import { labelsTable } from '@/db/schemas'
import { HTTPException } from 'hono/http-exception'
import type { CreateLabelDto, UpdateLabelDto, LabelDto } from '@/types'
import type { DB } from '@/types'
import { STATUS_CODE } from '@/constants'

export class LabelsModel {
  static async getAll(db: DB) {
    const customers = await db.select().from(labelsTable)
    return {
      items: customers,
      meta: {
        totalItems: customers.length,
      },
      links: {},
    }
  }

  static async getById(db: DB, id: LabelDto['id']) {
    const customers = await db.select().from(labelsTable).where(eq(labelsTable.id, id))
    if (customers.length === 0) {
      throw new HTTPException(404, {
        message: `Customer with ruc: ${id} not found`,
      })
    }
    return customers[0]
  }

  static async create(db: DB, dto: CreateLabelDto) {
    const results = await db.insert(labelsTable).values(dto).returning({ insertedId: labelsTable.id })

    if (results.length === 0) {
      throw new HTTPException(STATUS_CODE.BadRequest, {
        message: 'Failed to create customer',
      })
    }

    const [customer] = results
    return customer
  }

  static async update(db: DB, id: LabelDto['id'], dto: UpdateLabelDto) {
    const results = await db.update(labelsTable).set(dto).where(eq(labelsTable.id, id)).returning()

    if (results.length === 0) {
      throw new HTTPException(STATUS_CODE.NotFound, {
        message: `Customer with id ${id} not found`,
      })
    }

    return results[0]
  }

  static async delete(db: DB, id: LabelDto['id']) {
    const results = await db.delete(labelsTable).where(eq(labelsTable.id, id)).returning()

    if (results.length === 0) {
      throw new HTTPException(STATUS_CODE.NotFound, {
        message: `Customer with id ${id} not found`,
      })
    }
    return results[0]
  }
}
