import { QuotationsService } from './quotations.service'
import { insertQuotationSchema, updateQuotationSchema } from './quotations.validation'
import type { App } from '@/types'
import { handleError } from '@/core/utils'
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { quotationQueryParamsSchema } from './quotations.validation'

const app = new Hono<App>()

// Obtener todas las cotizaciones
app.get(
  '/',
  zValidator('query', quotationQueryParamsSchema, (result) => {
    if (!result.success) {
      throw result.error
    }
  }),
  async (c) => {
    const db = c.get('db')
    const queryParams = c.req.valid('query')

    const result = await QuotationsService.getAll(db, queryParams)
    return c.json(result, 200)
  },
)

// Obtener por número de cotización
app.get('/:number', async (c) => {
  const db = c.get('db')
  const number = c.req.param('number')
  const results = await QuotationsService.getByNumber(db, Number(number))
  return c.json(results)
})

// Ruta para crear `Quotation`
app.post(
  '/',
  zValidator('json', insertQuotationSchema, (result) => {
    if (!result.success) {
      throw result.error
    }
  }),
  async (c) => {
    const db = c.get('db')
    const data = c.req.valid('json')
    const result = await QuotationsService.create(db, data)
    return c.json(result, 200)
  },
)

// Update `Quotation` Route
app.put(
  '/:number',
  zValidator('json', updateQuotationSchema, (result) => {
    if (!result.success) {
      throw result.error
    }
  }),
  async (c) => {
    const db = c.get('db')
    const quotationNumber = Number(c.req.param('number'))

    const data = c.req.valid('json')
    const results = await QuotationsService.update(db, quotationNumber, data)
    return c.json(results)
  },
)

// Delete `Customer` Route
app.delete('/:number', async (c) => {
  const db = c.get('db')
  const quotationNumber = c.req.param('number')
  try {
    const results = await QuotationsService.delete(db, Number(quotationNumber))
    return c.json(results)
  } catch (error) {
    return handleError(error, c)
  }
})

export default app
