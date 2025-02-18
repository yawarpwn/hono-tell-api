import type { App } from '@/types'
import { Hono } from 'hono'
import { WatermarksModel } from '@/models'
import { handleError } from '@/utils'
import { zValidator } from '@hono/zod-validator'
import { insertWatermarkSchema, updateWatermarkSchema } from '@/dtos'

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
  zValidator('json', insertWatermarkSchema, async (result, c) => {
    if (!result.success) return c.json({ ok: false, message: 'invalid' }, 400)
  }),
  async (c) => {
    const db = c.get('db')
    const data = c.req.valid('json')
    try {
      const result = await WatermarksModel.create(db, data)
      return c.json({ ok: true, data: result }, 201)
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
    const results = await WatermarksModel.delete(db, id)
    return c.json(results)
  } catch (error) {
    return handleError(error, c)
  }
})
