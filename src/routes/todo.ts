import type { App } from '@/types'
import { Hono } from 'hono'
import { TodoModel } from '@/models'
import { validator } from 'hono/validator'
import { STATUS_CODE } from '@/constants'

export const todoRoute = new Hono<App>()

const jsonValidator = validator('json', (body, c) => {
  if (!body) {
    return c.json({ ok: false, message: 'Invalid' })
  }

  return body
})

todoRoute.get('/', async (c) => {
  const db = c.get('db')
  const todos = await TodoModel.getAll(db)
  return c.json(todos)
})

todoRoute.get('/:id', async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')
  const results = await TodoModel.getById(db, +id)
  return c.json(results)
})

todoRoute.put('/:id', async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')
  const results = await TodoModel.delete(db, +id)
  return c.json(results)
})

todoRoute.post('/', jsonValidator, async (c) => {
  const db = c.get('db')
  const dto = await c.req.valid('json')
  const result = await TodoModel.create(db, dto)
  return c.json({ ok: true, data: result }, STATUS_CODE.Created)
})

todoRoute.delete('/:id', async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')
  const results = await TodoModel.delete(db, +id)
  return c.json(results)
})
