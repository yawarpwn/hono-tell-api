import type { App } from '@/types'
import { Hono } from 'hono'
import { AgenciesService } from './agencies.service'
import { handleError } from '@/utils'
import { zValidator } from '@hono/zod-validator'
import { insertAgencySchema, updateAgencySchema } from './agencies.validation'

const app = new Hono<App>()

app.get('/', async (c) => {
  const db = c.get('db')

  try {
    const todos = await AgenciesService.getAll(db)
    return c.json(todos, 200)
  } catch (error) {
    return handleError(error, c)
  }
})

app.get('/:id', async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')

  try {
    const result = await AgenciesService.getById(db, id)
    return c.json(result)
  } catch (error) {
    return handleError(error, c)
  }
})

app.post(
  '/',
  zValidator('json', insertAgencySchema, async (result, c) => {
    if (!result.success) return c.json({ ok: false, message: 'invalid' }, 400)
  }),
  async (c) => {
    const db = c.get('db')
    const dto = c.req.valid('json')
    try {
      const result = await AgenciesService.create(db, dto)
      return c.json({ ok: true, data: result }, 201)
    } catch (error) {
      return handleError(error, c)
    }
  },
)

app.put(
  '/:id',
  zValidator('json', updateAgencySchema, async (result, c) => {
    if (!result.success) return c.json({ ok: false, message: 'invalid' }, 400)
  }),
  async (c) => {
    const db = c.get('db')
    const id = c.req.param('id')
    const dto = await c.req.json()
    try {
      const results = await AgenciesService.update(db, id, dto)
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
    const results = await AgenciesService.delete(db, id)
    return c.json(results)
  } catch (error) {
    return handleError(error, c)
  }
})

export default app
