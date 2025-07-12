import type { App } from '@/types'
import { Hono } from 'hono'
import { WatermarksModel } from '@/models'
import { handleError } from '@/utils'
import { zValidator } from '@hono/zod-validator'
import { insertWatermarkSchema, updateWatermarkSchema } from '@/dtos'
// import { getClient } from '@/lib/cloudinary'

export const watermarksRoute = new Hono<App>()

watermarksRoute.get('/', async (c) => {
  const db = c.get('db')

  try {
    const results = await WatermarksModel.getAll(db)
    return c.json(results, 200)
  } catch (error) {
    return handleError(error, c)
  }
})

watermarksRoute.get('/:id', async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')

  try {
    const result = await WatermarksModel.getById(db, id)
    return c.json(result)
  } catch (error) {
    return handleError(error, c)
  }
})

watermarksRoute.post(
  '/',
  // zValidator('json', insertWatermarkSchema, async (result, c) => {
  //   if (!result.success) return c.json({ ok: false, message: 'invalid' }, 400)
  // }),
  async (c) => {
    try {
      const formdata = await c.req.formData()
      const files = formdata.getAll('files[]') as File[]

      const db = c.get('db')

      for (const file of files) {
        const response = await WatermarksModel.uploadImage(file, c.env.CLOUDINARY_API_SECRET)
        const result = await WatermarksModel.create(db, {
          url: response.secure_url,
          width: response.width,
          height: response.height,
          format: response.format,
          publicId: response.public_id,
        })

        console.log({ result })
      }
      return c.json({ message: `inserted ${files.length} images success` }, 201)
    } catch (error) {
      return handleError(error, c)
    }
  },
)

watermarksRoute.put(
  '/:id',
  zValidator('json', updateWatermarkSchema, async (result, c) => {
    if (!result.success) return c.json({ ok: false, message: 'invalid' }, 400)
  }),
  async (c) => {
    const db = c.get('db')
    const id = c.req.param('id')
    const data = await c.req.json()
    try {
      const results = await WatermarksModel.update(db, id, data)
      return c.json(results)
    } catch (error) {
      return handleError(error, c)
    }
  },
)

watermarksRoute.delete('/:id', async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')
  try {
    const watermark = await WatermarksModel.getById(db, id)
    const result = await WatermarksModel.destroyImage(watermark.publicId, c.env.CLOUDINARY_API_SECRET)
    // return c.json({ result })
    const results = await WatermarksModel.delete(db, id)
    return c.json(results)
  } catch (error) {
    return handleError(error, c)
  }
})
