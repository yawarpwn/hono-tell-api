import { eq, and, desc, type SQL, ilike, like } from 'drizzle-orm'
import { labelsTable, agenciesTable } from '@/core/db/schemas'
import { HTTPException } from 'hono/http-exception'
import type { CreateLabel, UpdateLabel, Label } from './labels.validation'
import type { DB } from '@/types'

export class LabelsService {
  static async getAll(db: DB) {
    const labels = await db
      .select({
        id: labelsTable.id,
        recipient: labelsTable.recipient,
        destination: labelsTable.destination,
        address: labelsTable.address,
        dniRuc: labelsTable.dniRuc,
        phone: labelsTable.phone,
        observations: labelsTable.observations,
        agencyId: labelsTable.agencyId,
        updatedAt: labelsTable.updatedAt,
        createdAt: labelsTable.createdAt,
        agency: {
          name: agenciesTable.name,
          address: agenciesTable.address,
          phone: agenciesTable.phone,
          ruc: agenciesTable.ruc,
        },
      })
      .from(labelsTable)
      .leftJoin(agenciesTable, eq(labelsTable.agencyId, agenciesTable.id))
      .orderBy(desc(labelsTable.updatedAt))
    return {
      items: labels,
      meta: {
        totalItems: labels.length,
      },
      links: {},
    }
  }

  static async getById(db: DB, id: Label['id']) {
    const labels = await db
      .select({
        id: labelsTable.id,
        recipient: labelsTable.recipient,
        destination: labelsTable.destination,
        address: labelsTable.address,
        dniRuc: labelsTable.dniRuc,
        phone: labelsTable.phone,
        observations: labelsTable.observations,
        agencyId: labelsTable.agencyId,
        updatedAt: labelsTable.updatedAt,
        createdAt: labelsTable.createdAt,
        agency: {
          name: agenciesTable.name,
          address: agenciesTable.address,
          phone: agenciesTable.phone,
          ruc: agenciesTable.ruc,
        },
      })
      .from(labelsTable)
      .leftJoin(agenciesTable, eq(labelsTable.agencyId, agenciesTable.id))
      .where(eq(labelsTable.id, id))
    if (labels.length === 0) {
      throw new HTTPException(404, {
        message: `Customer with ruc: ${id} not found`,
      })
    }
    return labels[0]
  }

  static async create(db: DB, dto: CreateLabel) {
    const results = await db.insert(labelsTable).values(dto).returning({ insertedId: labelsTable.id })

    if (results.length === 0) {
      throw new HTTPException(400, {
        message: 'Failed to create customer',
      })
    }

    const [customer] = results
    return customer
  }

  static async update(db: DB, id: Label['id'], dto: UpdateLabel) {
    const results = await db.update(labelsTable).set(dto).where(eq(labelsTable.id, id)).returning()

    if (results.length === 0) {
      throw new HTTPException(404, {
        message: `Customer with id ${id} not found`,
      })
    }

    return results[0]
  }

  static async delete(db: DB, id: Label['id']) {
    const results = await db.delete(labelsTable).where(eq(labelsTable.id, id)).returning()

    if (results.length === 0) {
      throw new HTTPException(404, {
        message: `Customer with id ${id} not found`,
      })
    }
    return results[0]
  }
}
