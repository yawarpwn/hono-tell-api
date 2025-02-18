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

watermarksRoute.post('/', async (c) => {
  const db = c.get('db')
  const buffer = await c.req.arrayBuffer()
  // const formData = await c.req.formData()
  // const file = formData.get('files[]') as File
  //
  // const cloudinaryClient = getClient(c.env.CLOUDINARY_API_SECRET)

  // await WatermarksModel.uploadToCloudinary(file, cloudinaryClient)
  // try {
  //   const result = await WatermarksModel.create(db, data)
  //   return c.json({ ok: true, data: result }, 201)
  // } catch (error) {
  //   return handleError(error, c)
  // }
  return c.json({ succes: 'true' })
})

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
    const results = await WatermarksModel.delete(db, id)
    return c.json(results)
  } catch (error) {
    return handleError(error, c)
  }
})
