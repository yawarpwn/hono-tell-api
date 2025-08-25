import type { DB } from '@/types'
import { fireExtinguerCertificatesTable } from '@/core/db/schemas'
import type { InsertFireExtinguerCertificate } from './fire-extinguer-certificates.route'
import { eq } from 'drizzle-orm'

export class FireExtinguerCertificateService {
  static async getAll(db: DB) {
    const rows = await db.select().from(fireExtinguerCertificatesTable).all()

    return rows
  }

  static async getById(db: DB, id: string) {
    const rows = await db.select().from(fireExtinguerCertificatesTable).where(eq(fireExtinguerCertificatesTable.id, id))
    console.log({ rows, id })
    return rows[0]
  }

  static async create(db: DB, insertData: InsertFireExtinguerCertificate) {
    return db.insert(fireExtinguerCertificatesTable).values(insertData).returning({ insertedId: fireExtinguerCertificatesTable.id })
  }

  //TODO: implementar actualizacion
  static async update(db: DB) {}

  static async delete(db: DB, id: string) {
    const rows = await db
      .delete(fireExtinguerCertificatesTable)
      .where(eq(fireExtinguerCertificatesTable.id, id))
      .returning({ deletedId: fireExtinguerCertificatesTable.id })

    return rows[0]
  }
}
