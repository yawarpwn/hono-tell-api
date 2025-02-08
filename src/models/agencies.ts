import { eq, and, type SQL, ilike, like, desc } from 'drizzle-orm'
import { agenciesTable } from '@/db/schemas'
import { HTTPException } from 'hono/http-exception'
import type { CreateAgencyDto, UpdateAgencyDto, AgencyDto } from '@/types'
import type { DB } from '@/types'
import { STATUS_CODE } from '@/constants'

export class AgenciesModel {
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

  static async getById(db: DB, id: AgencyDto['id']) {
    const result = await db.select().from(agenciesTable).where(eq(agenciesTable.id, id))
    if (result.length === 0) {
      throw new HTTPException(404, {
        message: `Customer with ruc: ${id} not found`,
      })
    }
    return result[0]
  }

  static async create(db: DB, dto: CreateAgencyDto) {
    const results = await db.insert(agenciesTable).values(dto).returning({ insertedId: agenciesTable.id })

    if (results.length === 0) {
      throw new HTTPException(STATUS_CODE.BadRequest, {
        message: 'Failed to create customer',
      })
    }

    const [customer] = results
    return customer
  }

  static async update(db: DB, id: AgencyDto['id'], dto: UpdateAgencyDto) {
    const results = await db.update(agenciesTable).set(dto).where(eq(agenciesTable.id, id)).returning()

    if (results.length === 0) {
      throw new HTTPException(STATUS_CODE.NotFound, {
        message: `Customer with id ${id} not found`,
      })
    }

    return results[0]
  }

  static async delete(db: DB, id: AgencyDto['id']) {
    const results = await db.delete(agenciesTable).where(eq(agenciesTable.id, id)).returning()

    if (results.length === 0) {
      throw new HTTPException(STATUS_CODE.NotFound, {
        message: `Customer with id ${id} not found`,
      })
    }
    return results[0]
  }
}
