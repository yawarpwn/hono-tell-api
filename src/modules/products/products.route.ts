import type { App } from '@/types'
import { Hono } from 'hono'
import { ProductsService } from './products.service'
import { handleError } from '@/core/utils'

const app = new Hono<App>()

// Get all products
app.get('/', async (c) => {
  const db = c.get('db')
  try {
    const products = await ProductsService.getAll(db)
    return c.json(products, 200)
  } catch (error) {
    return handleError(error, c)
  }
})

// Get product by id
app.get('/:id', async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')
  try {
    const results = await ProductsService.getById(db, id)
    return c.json(results)
  } catch (error) {
    return handleError(error, c)
  }
})

// Create product route
app.post('/', async (c) => {
  const db = c.get('db')
  const dto = await c.req.json()
  try {
    const result = await ProductsService.create(db, dto)
    return c.json(result, 201)
  } catch (error) {
    return handleError(error, c)
  }
})

// Update product
app.put('/:id', async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')
  const dto = await c.req.json()
  try {
    const results = await ProductsService.update(db, id, dto)
    return c.json(results)
  } catch (error) {
    return handleError(error, c)
  }
})

// Delete product
app.delete('/:id', async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')
  try {
    const results = await ProductsService.delete(db, id)
    return c.json(results)
  } catch (error) {
    return handleError(error, c)
  }
})

export default app
