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

//Get `Quotation` by number Route
app.get('/:number', async (c) => {
  const db = c.get('db')
  const number = c.req.param('number')
  try {
    const results = await QuotationsService.getByNumber(db, Number(number))
    return c.json(results)
  } catch (error) {
    return handleError(error, c)
  }
})

// Create `Quotation` Route
app.post(
  '/',
  zValidator('json', insertQuotationSchema, (result, c) => {
    if (!result.success) {
      return handleError(result.error, c)
    }
  }),
  async (c) => {
    const db = c.get('db')
    const data = c.req.valid('json')
    console.log(data)
    try {
      const result = await QuotationsService.create(db, data)
      return c.json(result, 200)
    } catch (error) {
      return handleError(error, c)
    }
  },
)

// Update `Quotation` Route
app.put(
  '/:id',
  zValidator('json', updateQuotationSchema, (result, c) => {
    if (!result.success) {
      return handleError(result.error, c)
    }
  }),
  async (c) => {
    const db = c.get('db')
    const id = c.req.param('id')

    try {
      const data = c.req.valid('json')
      console.log('quotation update data: ', data)
      const results = await QuotationsService.update(db, id, data)
      return c.json(results)
    } catch (error) {
      return handleError(error, c)
    }
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
