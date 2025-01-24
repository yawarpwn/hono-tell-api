import type { App } from '@/types'
import { Hono } from 'hono'
import { QuotationsModel } from '@/models'
import { validator } from 'hono/validator'
import { STATUS_CODE } from '@/constants'

const app = new Hono<App>()

app.get('/', async (c) => {
  const db = c.get('db')
  const todos = await QuotationsModel.getAll(db)
  return c.json(todos, STATUS_CODE.Ok)
})

app.get('/:number', async (c) => {
  const db = c.get('db')
  const number = c.req.param('number')
  const results = await QuotationsModel.getByNumber(db, Number(number))
  return c.json(results)
})

app.post('/', async (c) => {
  const db = c.get('db')
  const dto = await c.req.json()
  const result = await QuotationsModel.create(db, dto)
  return c.json({ ok: true, data: result }, STATUS_CODE.Created)
})

app.put('/:id', async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')
  const dto = await c.req.json()
  const results = await QuotationsModel.update(db, id, dto)
  return c.json(results)
})

app.delete('/:number', async (c) => {
  const db = c.get('db')
  const quotationNumber = c.req.param('number')
  const results = await QuotationsModel.delete(db, Number(quotationNumber))
  return c.json(results)
})

export { app as quotationsRoute }
