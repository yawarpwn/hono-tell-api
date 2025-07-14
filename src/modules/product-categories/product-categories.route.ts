import type { App } from '@/types'
import { Hono } from 'hono'
import { ProductCategoriesService } from './product-categories.service'
import { handleError } from '@/core/utils'

const app = new Hono<App>()

app.get('/', async (c) => {
  const db = c.get('db')
  try {
    const productCategories = await ProductCategoriesService.getAll(db)
    return c.json(productCategories, 200)
  } catch (error) {
    return handleError(error, c)
  }
})

// app.get('/:id', async (c) => {
//   const db = c.get('db')
//   const id = c.req.param('id')
//   try {
//     const results = await ProductsService.getById(db, id)
//     return c.json(results)
//   } catch (error) {
//     return handleError(error, c)
//   }
// })
//
export default app
