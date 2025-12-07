import type { App } from '@/types'
import { Hono } from 'hono'
import { LabelsService } from './labels.service'
import { zValidator } from '@hono/zod-validator'
import { insertLabelSchema, updateLabelSchema } from './labels.validation'

const app = new Hono<App>()

app.get('/', async (c) => {
  const db = c.get('db')

  const todos = await LabelsService.getAll(db)
  return c.json(todos, 200)
})

app.get('/:id', async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')

  const result = await LabelsService.getById(db, id)
  return c.json(result, 200)
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
    const results = await LabelsService.create(db, dto)
    return c.json(results, 201)
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
    const results = await LabelsService.update(db, id, dto)
    return c.json(results, 200)
  },
)

app.delete('/:id', async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')
  const results = await LabelsService.delete(db, id)
  return c.json(results, 200)
})

export default app
