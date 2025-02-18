import { eq, and, type SQL, ilike, like, desc } from 'drizzle-orm'
import { watermarksTable } from '@/db/schemas'
import { HTTPException } from 'hono/http-exception'
import type { CreateWatermarkDto, UpdateWatermarkDto, WatermarkDto } from '@/types'
import type { DB } from '@/types'
import { v2 } from 'cloudinary'

type UploadResponse = {
  url: string
  width: string
  height: string
  format: string
  publicId: string
}
export class WatermarksModel {
  static async getAll(db: DB) {
    const rows = await db.select().from(watermarksTable).orderBy(desc(watermarksTable.updatedAt))
    const mappedRows = rows.map((row) => ({
      ...row,
      thumbUrl: row.url.replace(/upload/, 'upload/c_thumb,w_200'),
    }))

    return {
      items: mappedRows,
      meta: {
        totalItems: rows.length,
      },
      links: {},
    }
  }

  static async getById(db: DB, id: WatermarkDto['id']) {
    const [row] = await db.select().from(watermarksTable).where(eq(watermarksTable.id, id))
    if (!row) {
      throw new HTTPException(404, {
        message: `Watermk with ruc: ${id} not found`,
      })
    }

    return {
      ...row,
      thumbUrl: row.url.replace(/upload/, 'upload/c_thumb,w_200'),
    }
  }

  static async uploadToCloudinary(photos: File, client: typeof v2): Promise<UploadResponse[]> {
    if (!photos) {
      throw new HTTPException(400, {
        message: 'No photos provided',
      })
    }
    try {
      const buffer = await photos.arrayBuffer()
      console.log(buffer)
    } catch (error) {
      console.log(error)
    }

    const res: UploadResponse[] = []
    // for (const photo of photos) {
    //   // Guardar la imagen procesada en el sistema de archivos
    //   try {
    //     const res = await uploadStream(watermarkedImage, {
    //       folder: 'watermarked',
    //       category: 'watermarked',
    //     })
    //
    //     res.push({
    //       url: res.secure_url,
    //       width: res.width,
    //       height: res.height,
    //       format: res.format,
    //       publicId: res.public_id,
    //     })
    //   } catch (error) {
    //     console.log(error)
    //     throw new HTTPException(500, {
    //       message: 'Failed to upload image',
    //     })
    //   }
    // }
    return res

    // Devolver las rutas de las imágenes procesadas como respuesta JSON
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
