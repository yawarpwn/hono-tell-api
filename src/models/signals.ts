import { signalsTable, signalCategoriesTable } from '@/db/schemas'
import type { CreateSignalDto, DB, UpdateSignalDto } from '@/types'
import { desc, eq } from 'drizzle-orm'
import { HTTPException } from 'hono/http-exception'

export class SignalsModel {
  static async getAll(db: DB) {
    try {
      const rows = await db
        .select({
          id: signalsTable.id,
          title: signalsTable.title,
          code: signalsTable.code,
          publicId: signalsTable.publicId,
          categoryId: signalCategoriesTable.id,
          category: signalCategoriesTable.name,
          url: signalsTable.url,
          width: signalsTable.width,
          height: signalsTable.height,
          format: signalsTable.format,
          createdAt: signalsTable.createdAt,
          updatedAt: signalsTable.updatedAt,
          description: signalsTable.description,
        })
        .from(signalsTable)
        .leftJoin(signalCategoriesTable, eq(signalsTable.categoryId, signalCategoriesTable.id))
        .orderBy(desc(signalsTable.updatedAt))

      return {
        items: rows,
        meta: {
          totalItems: rows.length,
        },
        links: {},
      }
    } catch (error) {
      throw new HTTPException(500, {
        message: 'error getting signals',
      })
    }
  }

  static async getById(db: DB, id: string) {
    try {
      const rows = await db.select().from(signalsTable).where(eq(signalsTable.id, id))

      return rows[0]
    } catch (error) {
      throw new HTTPException(500, {
        message: 'error getting signals',
      })
    }
  }

  //
  static async create(db: DB, values: CreateSignalDto) {
    console.log({ values })
    try {
      const rows = await db.insert(signalsTable).values(values).returning()
      return rows[0]
    } catch (error) {
      console.log(error)
      throw new HTTPException(500, {
        message: 'error creating signal',
      })
    }
  }
  //
  static async update(db: DB, values: UpdateSignalDto, id: string) {
    try {
      const rows = await db
        .update(signalsTable)
        .set({
          ...values,
          updatedAt: new Date(),
        })
        .where(eq(signalsTable.id, id))
        .returning()
      return {
        data: { id: rows[0].id },
        error: null,
      }
    } catch (error) {
      throw new HTTPException(500, {
        message: 'error updating signal',
      })
    }
  }
  //
  static async delete(db: DB, id: string) {
    try {
      const rows = await db.delete(signalsTable).where(eq(signalsTable.id, id)).returning()
    } catch (error) {
      throw new HTTPException(500, {
        message: 'error deleting signal',
      })
    }
  }
}
