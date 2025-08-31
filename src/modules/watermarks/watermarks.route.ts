import type { App } from '@/types'
import { Hono } from 'hono'
import { WatermarksService } from './watermarks.service'
import { handleError } from '@/core/utils'
import { zValidator } from '@hono/zod-validator'
import { updateWatermarkSchema } from './watermarks.validation'
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
      const title = formdata.get('title') as string
      const isFavorite = Boolean(formdata.get('isFavorite'))
      const categoryId = Number(formdata.get('categoryId'))
      const db = c.get('db')

      for (const file of files) {
        const response = await WatermarksService.uploadImage(file, c.env.CLOUDINARY_API_SECRET)
        const result = await WatermarksService.create(db, {
          url: response.secure_url,
          width: response.width,
          height: response.height,
          format: response.format,
          publicId: response.public_id,
          title: title,
          isFavorite: isFavorite,
          categoryId: categoryId,
        })

        console.log({ 'cloudflare result': result })
      }
      return c.json({ ok: true, message: `inserted ${files.length} images success` }, 201)
    } catch (error) {
      return handleError(error, c)
    }
  },
)

app.put(
  '/:id',
  zValidator('json', updateWatermarkSchema, async (result, c) => {
    if (!result.success) {
      return c.json({ ok: false, message: 'invalid schema' }, 400)
    }
  }),
  async (c) => {
    const db = c.get('db')
    const id = c.req.param('id')
    const data = await c.req.json()
    try {
      await WatermarksService.update(db, id, data)
      return c.json({
        ok: true,
        message: 'Watermark updated successfully',
      })
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
    await WatermarksService.destroyImage(watermark.publicId, c.env.CLOUDINARY_API_SECRET)
    const results = await WatermarksService.delete(db, id)
    return c.json({
      ok: true,
      message: `Photo with id ${id} deleted successfully`,
    })
  } catch (error) {
    return handleError(error, c)
  }
})

export default app
