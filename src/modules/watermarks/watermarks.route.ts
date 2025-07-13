import type { App } from '@/types'
import { Hono } from 'hono'
import { WatermarksService } from './watermarks.service'
import { handleError } from '@/core/utils'
import { zValidator } from '@hono/zod-validator'
import { insertWatermarkSchema, updateWatermarkSchema } from './watermarks.validation'
// import { getClient } from '@/lib/cloudinary'

export const app = new Hono<App>()

app.get('/', async (c) => {
  const db = c.get('db')

  try {
    const results = await WatermarksService.getAll(db)
    return c.json(results, 200)
  } catch (error) {
    return handleError(error, c)
  }
})

app.get('/:id', async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')

  try {
    const result = await WatermarksService.getById(db, id)
    return c.json(result)
  } catch (error) {
    return handleError(error, c)
  }
})

app.post(
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
        const response = await WatermarksService.uploadImage(file, c.env.CLOUDINARY_API_SECRET)
        const result = await WatermarksService.create(db, {
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

app.put(
  '/:id',
  zValidator('json', updateWatermarkSchema, async (result, c) => {
    if (!result.success) return c.json({ ok: false, message: 'invalid' }, 400)
  }),
  async (c) => {
    const db = c.get('db')
    const id = c.req.param('id')
    const data = await c.req.json()
    try {
      const results = await WatermarksService.update(db, id, data)
      return c.json(results)
    } catch (error) {
      return handleError(error, c)
    }
  },
)

app.delete('/:id', async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')
  try {
    const watermark = await WatermarksService.getById(db, id)
    const result = await WatermarksService.destroyImage(watermark.publicId, c.env.CLOUDINARY_API_SECRET)
    // return c.json({ result })
    const results = await WatermarksService.delete(db, id)
    return c.json(results)
  } catch (error) {
    return handleError(error, c)
  }
})

export default app
