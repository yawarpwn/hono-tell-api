import type { App } from '@/types'
import { Hono } from 'hono'
import { WatermarksService } from './watermarks.service'
import { zValidator } from '@hono/zod-validator'
import { updateWatermarkSchema } from './watermarks.validation'

export const app = new Hono<App>()

app.get('/', async (c) => {
  const db = c.get('db')

  const results = await WatermarksService.getAll(db)
  return c.json(results, 200)
})

app.get('/:id', async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')

  const result = await WatermarksService.getById(db, id)
  return c.json(result)
})

app.post(
  '/',
  // zValidator('json', insertWatermarkSchema, async (result, c) => {
  //   if (!result.success) return c.json({ ok: false, message: 'invalid' }, 400)
  // }),
  async (c) => {
    const formdata = await c.req.formData()
    const files = formdata.getAll('files[]') as File[]
    const title = formdata.get('title') as string
    const isFavorite = Boolean(formdata.get('isFavorite'))
    const categoryId = Number(formdata.get('categoryId')) || 1
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
    await WatermarksService.update(db, id, data)
    return c.json({
      ok: true,
      message: 'Watermark updated successfully',
    })
  },
)

app.delete('/:id', async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')
  const watermark = await WatermarksService.getById(db, id)
  await WatermarksService.destroyImage(watermark.publicId, c.env.CLOUDINARY_API_SECRET)
  await WatermarksService.delete(db, id)
  return c.json({
    ok: true,
    message: `Photo with id ${id} deleted successfully`,
  })
})

export default app
