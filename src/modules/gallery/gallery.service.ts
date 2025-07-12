import { galleryTable } from '@/db/schemas'

import type { DrizzleD1Database } from 'drizzle-orm/d1'

export class GalleryService {
  static getAll(db: DrizzleD1Database) {
    const rows = db.select().from(galleryTable)
    return rows
  }

  static async getById(db: DrizzleD1Database, id: string) {}

  static async delete(db: DrizzleD1Database, id: string) {}

  static async update(db: DrizzleD1Database, id: string) {}

  static async create(db: DrizzleD1Database, id: string) {}
}
