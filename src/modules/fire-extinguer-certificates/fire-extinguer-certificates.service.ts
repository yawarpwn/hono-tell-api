import type { DB } from '@/types'
import { fireExtinguerCertificatesTable } from '@/core/db/schemas'
import type { InsertFireExtinguerCertificate } from './fire-extinguer-certificates.route'

export class FireExtinguerCertificateService {
  static async getAll(db: DB) {
    const rows = await db.select().from(fireExtinguerCertificatesTable).all()

    return rows
  }

  static async create(db: DB, insertData: InsertFireExtinguerCertificate) {
    return db.insert(fireExtinguerCertificatesTable).values(insertData).returning({ insertedId: fireExtinguerCertificatesTable.id })
  }

  //TODO: implementar actualizacion
  static async update(db: DB) {}
}
