import type { App } from '@/types'
import { Hono } from 'hono'
import { ProductsModel } from '@/models'
import { STATUS_CODE } from '@/constants'
import { handleError } from '@/utils'

const app = new Hono<App>()

app.get('/', async (c) => {
  const db = c.get('db')
  try {
    const todos = await ProductsModel.getAll(db)
    return c.json(todos, STATUS_CODE.Ok)
  } catch (error) {
    return handleError(error, c)
  }
})

app.get('/:id', async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')
  try {
    const results = await ProductsModel.getById(db, id)
    return c.json(results)
  } catch (error) {
    return handleError(error, c)
  }
})

app.post('/', async (c) => {
  const db = c.get('db')
  const dto = await c.req.json()
  try {
    const result = await ProductsModel.create(db, dto)
    return c.json(result, 201)
  } catch (error) {
    return handleError(error, c)
  }
})

app.put('/:id', async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')
  const dto = await c.req.json()
  try {
    const results = await ProductsModel.update(db, id, dto)
    return c.json(results)
  } catch (error) {
    return handleError(error, c)
  }
})

app.delete('/:id', async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')
  try {
    const results = await ProductsModel.delete(db, id)
    return c.json(results)
  } catch (error) {
    return handleError(error, c)
  }
})

export { app as productsRoute }
