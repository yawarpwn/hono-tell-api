import type { App } from '@/types'
import { Hono } from 'hono'
import { QuotationsModel } from '@/models'
import { STATUS_CODE } from '@/constants'
import { handleError } from '@/utils'
import { getCookie } from 'hono/cookie'

const app = new Hono<App>()

app.get('/', async (c) => {
  const db = c.get('db')

  try {
    const todos = await QuotationsModel.getAll(db)
    return c.json(todos, STATUS_CODE.Ok)
  } catch (error) {
    return handleError(error, c)
  }
})

app.get('/:number', async (c) => {
  const db = c.get('db')
  const number = c.req.param('number')
  try {
    const results = await QuotationsModel.getByNumber(db, Number(number))
    return c.json(results)
  } catch (error) {
    return handleError(error, c)
  }
})

app.post('/', async (c) => {
  const db = c.get('db')
  const dto = await c.req.json()
  try {
    const result = await QuotationsModel.create(db, dto)
    return c.json(result, STATUS_CODE.Created)
  } catch (error) {
    return handleError(error, c)
  }
})

app.put('/:id', async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')

  try {
    const dto = await c.req.json()
    const results = await QuotationsModel.update(db, id, dto)
    return c.json(results)
  } catch (error) {
    return handleError(error, c)
  }
})

app.delete('/:number', async (c) => {
  const db = c.get('db')
  const quotationNumber = c.req.param('number')
  try {
    const results = await QuotationsModel.delete(db, Number(quotationNumber))
    return c.json(results)
  } catch (error) {
    return handleError(error, c)
  }
})

export { app as quotationsRoute }
