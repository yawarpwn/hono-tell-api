import type { App } from '@/types'
import { Hono } from 'hono'
import { LabelsModel } from '@/models'
import { handleError } from '@/utils'
import { zValidator } from '@hono/zod-validator'
import { insertLabelSchema, updateLabelSchema } from '@/dtos'

const app = new Hono<App>()

app.get('/', async (c) => {
  const db = c.get('db')

  try {
    const todos = await LabelsModel.getAll(db)
    return c.json(todos, 200)
  } catch (error) {
    return handleError(error, c)
  }
})

app.get('/:id', async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')

  try {
    const result = await LabelsModel.getById(db, id)
    return c.json(result)
  } catch (error) {
    return handleError(error, c)
  }
})

app.post(
  '/',
  zValidator('json', insertLabelSchema, async (result, c) => {
    if (!result.success) {
      console.log(result.error.errors)
      return c.json({ ok: false, message: 'invalid' }, 400)
    }
  }),
  async (c) => {
    const db = c.get('db')
    const dto = c.req.valid('json')
    try {
      const result = await LabelsModel.create(db, dto)
      return c.json({ ok: true, data: result }, 201)
    } catch (error) {
      return handleError(error, c)
    }
  },
)

app.put(
  '/:id',
  zValidator('json', updateLabelSchema, async (result, c) => {
    if (!result.success) {
      console.log(result.error.errors)
      return c.json({ ok: false, message: 'invalid' }, 400)
    }
  }),
  async (c) => {
    const db = c.get('db')
    const id = c.req.param('id')
    const dto = c.req.valid('json')
    try {
      const results = await LabelsModel.update(db, id, dto)
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
    const results = await LabelsModel.delete(db, id)
    return c.json(results)
  } catch (error) {
    return handleError(error, c)
  }
})

export { app as labelsRoute }
