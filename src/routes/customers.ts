import type { App } from '@/types'
import { Hono } from 'hono'
import { CustomersModel } from '@/models'
import { validator } from 'hono/validator'
import { STATUS_CODE } from '@/constants'
import { HTTPException } from 'hono/http-exception'

const app = new Hono<App>()

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
  const ruc = c.req.query('ruc')

  try {
    const todos = await CustomersModel.getAll(db, { ruc })
    return c.json(todos, STATUS_CODE.Ok)
  } catch (error) {
    if (error instanceof HTTPException) {
      return c.json({ ok: false, message: error.message, statusCode: error.status }, error.status)
    }

    console.log('ERROR: ', error)
    return c.json(
      {
        ok: false,
        message: 'Error Desconocido',
        statusCode: STATUS_CODE.ServerError,
      },
      STATUS_CODE.BadRequest,
    )
  }
})

app.get('/:ruc', async (c) => {
  const db = c.get('db')
  const ruc = c.req.param('ruc')

  try {
    const customer = await CustomersModel.getByRuc(db, ruc)
    return c.json(customer)
  } catch (error) {
    if (error instanceof HTTPException) {
      return c.json({
        ok: false,
        message: error.message,
        statusCode: error.status,
      })
    }
    console.log('ERROR: ', error)
    return c.json({
      ok: false,
      message: 'Error Desconocido',
      statusCode: 500,
    })
  }
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
