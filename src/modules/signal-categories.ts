import type { App } from '@/types'
import { Hono } from 'hono'
import { signalCategoriesTable } from '@/db/schemas'
import { handleError } from '@/utils'

export const signalCategoriesRoute = new Hono<App>()

signalCategoriesRoute.get('/', async (c) => {
  const db = c.get('db')
  try {
    const rows = await db.select().from(signalCategoriesTable)
    return c.json({
      items: rows,
      meta: {
        totalItems: rows.length,
      },
      links: {},
    })
  } catch (error) {
    return handleError(error, c)
  }
})
