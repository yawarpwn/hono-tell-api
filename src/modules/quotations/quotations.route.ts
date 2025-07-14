import { QuotationsService } from './quotations.service'
import { insertQuotationSchema, updateQuotationSchema } from './quotations.validation'
import type { App } from '@/types'
import { handleError } from '@/core/utils'
import { Hono } from 'hono'

const app = new Hono<App>()

import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

const querySchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  q: z.string().optional(),
})

export type QueryQuotations = z.infer<typeof querySchema>

//Get `Customers` Route
app.get(
  '/',
  zValidator('query', querySchema, (result, c) => {
    if (!result.success) {
      return c.json({
        ok: false,
        message: 'Invalid query params',
        statusCode: 400,
      })
    }
  }),
  async (c) => {
    const db = c.get('db')
    const { page, limit, q } = c.req.valid('query')

    console.log('page', page)
    console.log('limit', limit)
    console.log('q', q)

    try {
      const result = await QuotationsService.getAll(db, {
        page,
        limit,
        q,
      })
      return c.json(result, 200)
    } catch (error) {
      return handleError(error, c)
    }
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
app.put('/:id', async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')

  try {
    const dto = await c.req.json()
    const results = await QuotationsService.update(db, id, dto)
    return c.json(results)
  } catch (error) {
    return handleError(error, c)
  }
})

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
