import { STATUS_CODE } from '@/constants'
import { QuotationsModel } from '@/models'
import type { App } from '@/types'
import { handleError } from '@/utils'
import rescueJson from '../../muckup/rescues.json'
import { Hono } from 'hono'
import { getCookie } from 'hono/cookie'

const app = new Hono<App>()

import { quotationsTable } from '@/db/schemas'
import { zValidator } from '@hono/zod-validator'
import { between, desc, eq, asc, gt } from 'drizzle-orm'
import { z } from 'zod'

const querySchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  q: z.string().optional(),
})

export type QueryQuotations = z.infer<typeof querySchema>

app.get(
  '/',
  zValidator('query', querySchema, (result, c) => {
    if (!result.success) {
      return c.json({
        message: 'Invalid query params',
      })
    }
  }),
  async (c) => {
    const db = c.get('db')
    const { page, limit, q } = c.req.valid('query')

    try {
      const result = await QuotationsModel.getAll(db, {
        page,
        limit,
        q,
      })
      return c.json(result, STATUS_CODE.Ok)
    } catch (error) {
      return handleError(error, c)
    }
  },
)

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

app.get('/super/rescue', async (c) => {
  const db = c.get('db')

  for (const quotation of rescueJson) {
    const rows = await db.insert(quotationsTable).values({
      ...quotation,
      updatedAt: new Date(quotation.updatedAt),
      createdAt: new Date(quotation.updatedAt),
    })
    console.log(rows)
  }

  return c.json({ succes: 'true' })
})

export { app as quotationsRoute }
