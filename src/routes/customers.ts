import type { App } from '@/types'
import { Hono } from 'hono'
import { CustomersModel } from '@/models'
import { validator } from 'hono/validator'
import { STATUS_CODE } from '@/constants'

const app = new Hono<App>()

//TODO: implement robust json validator
const jsonValidator = validator('json', (body, c) => {
  if (typeof body !== 'object' || !body) {
    return c.json({ ok: false, message: 'Invalid' })
  }

  if (Object.values(body).length === 0) {
    return c.json({ ok: false, message: 'Invalid sin contenido' })
  }

  return body
})

app.get('/', async (c) => {
  const db = c.get('db')
  const todos = await CustomersModel.getAll(db)
  return c.json(todos, STATUS_CODE.Ok)
})

app.get('/:id', async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')
  const results = await CustomersModel.getById(db, id)
  return c.json(results)
})

app.post('/', jsonValidator, async (c) => {
  const db = c.get('db')
  const dto = await c.req.valid('json')
  const result = await CustomersModel.create(db, dto)
  return c.json({ ok: true, data: result }, STATUS_CODE.Created)
})

app.put('/:id', jsonValidator, async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')
  const dto = await c.req.valid('json')
  const results = await CustomersModel.update(db, id, dto)
  return c.json(results)
})

app.delete('/:id', async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')
  const results = await CustomersModel.delete(db, id)
  return c.json(results)
})

export { app as customersRoute }
