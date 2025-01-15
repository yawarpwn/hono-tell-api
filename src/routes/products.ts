import type { App } from '@/types'
import { Hono } from 'hono'
import { ProductsModel } from '@/models'
import { STATUS_CODE } from '@/constants'

const app = new Hono<App>()

app.get('/', async (c) => {
  const db = c.get('db')
  const todos = await ProductsModel.getAll(db)
  return c.json(todos, STATUS_CODE.Ok)
})

app.get('/:id', async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')
  const results = await ProductsModel.getById(db, id)
  return c.json(results)
})

app.post('/', async (c) => {
  const db = c.get('db')
  const dto = await c.req.json()
  const result = await ProductsModel.create(db, dto)
  return c.json({ ok: true, data: result }, STATUS_CODE.Created)
})

app.put('/:id', async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')
  const dto = await c.req.json()
  const results = await ProductsModel.update(db, id, dto)
  return c.json(results)
})

app.delete('/:id', async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')
  const results = await ProductsModel.delete(db, id)
  return c.json(results)
})

export { app as productsRoute }
