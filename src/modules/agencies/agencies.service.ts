import { eq, desc } from 'drizzle-orm'
import { agenciesTable } from '@/core/db/schemas'
import { HTTPException } from 'hono/http-exception'
import type { CreateAgency, UpdateAgency, Agency } from './agencies.validation'
import type { DB } from '@/types'

export class AgenciesService {
  static async getAll(db: DB) {
    const result = await db.select().from(agenciesTable).orderBy(desc(agenciesTable.updatedAt))
    return {
      items: result,
      meta: {
        totalItems: result.length,
      },
      links: {},
    }
  }

  static async getById(db: DB, id: Agency['id']) {
    const result = await db.select().from(agenciesTable).where(eq(agenciesTable.id, id))
    if (result.length === 0) {
      throw new HTTPException(404, {
        message: `Customer with ruc: ${id} not found`,
      })
    }
    return result[0]
  }

  static async create(db: DB, dto: CreateAgency) {
    const results = await db.insert(agenciesTable).values(dto).returning({ insertedId: agenciesTable.id })

    if (results.length === 0) {
      throw new HTTPException(400, {
        message: 'Failed to create customer',
      })
    }

    const [customer] = results
    return customer
  }

  static async update(db: DB, id: Agency['id'], dto: UpdateAgency) {
    const results = await db.update(agenciesTable).set(dto).where(eq(agenciesTable.id, id)).returning()

    if (results.length === 0) {
      throw new HTTPException(404, {
        message: `Customer with id ${id} not found`,
      })
    }

    return results[0]
  }

  static async delete(db: DB, id: Agency['id']) {
    const results = await db.delete(agenciesTable).where(eq(agenciesTable.id, id)).returning()

    if (results.length === 0) {
      throw new HTTPException(404, {
        message: `Customer with id ${id} not found`,
      })
    }
    return results[0]
  }
}
