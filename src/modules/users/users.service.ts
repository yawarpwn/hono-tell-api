import { eq, desc } from 'drizzle-orm'
import { usersTable } from '@/core/db/schemas'
import { HTTPException } from 'hono/http-exception'
import { User } from './users.validation'
import type { DB } from '@/types'

export class UsersService {
  // static async getAll(db: DB) {
  //   const result = await db.select().from(agenciesTable).orderBy(desc(agenciesTable.updatedAt))
  //   return {
  //     items: result,
  //     meta: {
  //       totalItems: result.length,
  //     },
  //     links: {},
  //   }
  // }

  /**
   * Obtener usuario por `id`
   */
  static async getById(db: DB, id: string): Promise<User | null> {
    const users = await db.select().from(usersTable).where(eq(usersTable.id, id))
    if (users.length === 0) {
      console.log(`[USERS]: Usuario con Id: ${id} no encontrado`)
      return null
      // throw new HTTPException(404, {
      //   message: `Usuario con Id: ${id} no encontrado`,
      // })
    }
    return users[0]
  }

  // static async create(db: DB, dto: CreateAgency) {
  //   const results = await db.insert(agenciesTable).values(dto).returning({ insertedId: agenciesTable.id })
  //
  //   if (results.length === 0) {
  //     throw new HTTPException(400, {
  //       message: 'Failed to create customer',
  //     })
  //   }
  //
  //   const [customer] = results
  //   return customer
  // }
  //
  // static async update(db: DB, id: Agency['id'], dto: UpdateAgency) {
  //   const results = await db.update(agenciesTable).set(dto).where(eq(agenciesTable.id, id)).returning()
  //
  //   if (results.length === 0) {
  //     throw new HTTPException(404, {
  //       message: `Customer with id ${id} not found`,
  //     })
  //   }
  //
  //   return results[0]
  // }
  //
  // static async delete(db: DB, id: Agency['id']) {
  //   const results = await db.delete(agenciesTable).where(eq(agenciesTable.id, id)).returning()
  //
  //   if (results.length === 0) {
  //     throw new HTTPException(404, {
  //       message: `Customer with id ${id} not found`,
  //     })
  //   }
  //   return results[0]
  // }
}
