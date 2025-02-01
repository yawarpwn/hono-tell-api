import type { App } from '@/types'
import { Hono } from 'hono'
import { CustomersModel } from '@/models'
//TODO: implment validator
import { validator } from 'hono/validator'
import { STATUS_CODE } from '@/constants'
import { handleError } from '@/utils'

const app = new Hono<App>()

app.get('/', async (c) => {
  const db = c.get('db')
  const ruc = c.req.query('ruc')

  try {
    const todos = await CustomersModel.getAll(db, { ruc })
    return c.json(todos, STATUS_CODE.Ok)
  } catch (error) {
    return handleError(error, c)
  }
})

app.get('/:ruc', async (c) => {
  const db = c.get('db')
  const ruc = c.req.param('ruc')

  try {
    const customer = await CustomersModel.getByRuc(db, ruc)
    return c.json(customer)
  } catch (error) {
    return handleError(error, c)
  }
})

app.post('/', async (c) => {
  const db = c.get('db')
  const dto = await c.req.json()
  try {
    const result = await CustomersModel.create(db, dto)
    return c.json({ ok: true, data: result }, 201)
  } catch (error) {
    return handleError(error, c)
  }
})

app.put('/:id', async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')
  const dto = await c.req.json()
  try {
    const results = await CustomersModel.update(db, id, dto)
    return c.json(results)
  } catch (error) {
    return handleError(error, c)
  }
})

app.delete('/:id', async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')
  try {
    const results = await CustomersModel.delete(db, id)
    return c.json(results)
  } catch (error) {
    return handleError(error, c)
  }
})

export { app as customersRoute }
