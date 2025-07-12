import type { App } from '@/types'
import { Hono } from 'hono'
import { ProductCategoriesModel } from '@/models'
import { STATUS_CODE } from '@/constants'
import { handleError } from '@/utils'

const app = new Hono<App>()

app.get('/', async (c) => {
  const db = c.get('db')
  try {
    const todos = await ProductCategoriesModel.getAll(db)
    return c.json(todos, STATUS_CODE.Ok)
  } catch (error) {
    return handleError(error, c)
  }
})

export { app as productCategoriesRoute }
