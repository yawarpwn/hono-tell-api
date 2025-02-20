import { eq, and, type SQL, ilike, like, desc } from 'drizzle-orm'
import { watermarksTable } from '@/db/schemas'
import { HTTPException } from 'hono/http-exception'
import type { CreateWatermarkDto, UpdateWatermarkDto, WatermarkDto } from '@/types'
import type { DB } from '@/types'
import { v2 } from 'cloudinary'
import { getSignature } from '@/lib/cloudinary'
import { API_REST_CLOUDINARY } from '@/constants'

type UploadResponse = {
  secure_url: string
  width: string
  height: string
  format: string
  public_id: string
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

  static async create(db: DB, data: CreateWatermarkDto) {
    const rows = await db.insert(watermarksTable).values(data).returning({ insertedId: watermarksTable.id })

    if (rows.length === 0) {
      throw new HTTPException(400, {
        message: 'Failed to create customer',
      })
    }

    const [customer] = rows
    return customer
  }

  static async uploadImage(file: File, apiSecret: string) {
    const transformation = 'c_limit,w_1000,h_1000'
    const format = 'webp'
    const folder = 'watermarked'

    const { timestamp, apiKey, signature, cloudName } = getSignature(apiSecret, {
      transformation,
      format,
      folder,
    })

    const formData = new FormData()
    formData.append('file', file)
    formData.append('signature', signature)
    formData.append('timestamp', timestamp)
    formData.append('api_key', apiKey)
    formData.append('folder', 'watermarked')
    formData.append('transformation', transformation)
    formData.append('format', format)
    // formData.append('eager', eager)

    return fetch(`${API_REST_CLOUDINARY}/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    }).then((res) => {
      console.log(res)
      // if (!res.ok) throw new Error('Network response was not ok')
      return res.json<UploadResponse>()
    })
  }

  static async destroyImage(publicId: string, apiSecret: string) {
    const { cloudName, apiKey, signature, timestamp } = getSignature(apiSecret, {
      public_id: publicId,
    })
    const url = `${API_REST_CLOUDINARY}/${cloudName}/image/destroy`

    const formdata = new FormData()
    formdata.append('public_id', publicId)
    formdata.append('signature', signature)
    formdata.append('api_key', apiKey)
    formdata.append('timestamp', timestamp)

    console.log(Object.fromEntries(formdata))

    return fetch(url, {
      method: 'POST',
      body: formdata,
      redirect: 'follow',
    })
      .then((response) => response.text())
      .then((result) => console.log(result))
    // .catch((error) => console.error(error))
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
