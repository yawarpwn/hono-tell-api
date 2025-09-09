import type { App } from '@/types'
import { Hono } from 'hono'
import { ProductsService } from './products.service'
import { insertProductSchema } from './products.validation'
import { zValidator } from '@hono/zod-validator'
import { updateProductSchema } from '@/core/dtos'

const app = new Hono<App>()

// Get all products
app.get('/', async (c) => {
  const db = c.get('db')
  const products = await ProductsService.getAll(db)
  return c.json(products, 200)
})

// Get product by id
app.get('/:id', async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')
  const results = await ProductsService.getById(db, id)
  return c.json(results)
})

// Create product route
app.post(
  '/',
  zValidator('json', insertProductSchema, async (result, c) => {
    console.log('create product', await c.req.json())
    if (!result.success) throw result.error
  }),
  async (c) => {
    const db = c.get('db')
    const dto = c.req.valid('json')
    const result = await ProductsService.create(db, dto)
    return c.json(result, 201)
  },
)

// Update product
app.put(
  '/:id',
  zValidator('json', updateProductSchema, (result) => {
    if (!result.success) throw result.error
  }),
  async (c) => {
    const db = c.get('db')
    const id = c.req.param('id')
    const dto = c.req.valid('json')
    const results = await ProductsService.update(db, id, dto)
    return c.json(results)
  },
)

// Delete product
app.delete('/:id', async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')
  const results = await ProductsService.delete(db, id)
  return c.json(results)
})

export default app
