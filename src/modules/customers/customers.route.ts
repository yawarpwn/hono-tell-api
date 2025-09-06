import type { App } from '@/types'
import { Hono } from 'hono'
import { CustomersService } from './customers.service'
import { HTTPException } from 'hono/http-exception'
import { zValidator } from '@hono/zod-validator'
import { insertCustomerSchema, updateCustomerSchema, customerQueryParamsSchema } from './customers.validation'

const app = new Hono<App>()

// Get all customers Route
app.get(
  '/',
  zValidator('query', customerQueryParamsSchema, (result) => {
    if (!result.success) {
      throw result.error
    }
  }),
  async (c) => {
    const db = c.get('db')
    const { onlyRegular } = c.req.valid('query')

    const customers = await CustomersService.getAll(db, { onlyRegular })
    return c.json(customers, 200)
  },
)

// Get customer by dni/ruc
app.get('/search/:dniruc', async (c) => {
  const db = c.get('db')
  const dniRuc = c.req.param('dniruc')

  // Buscar en base de datos si existe el cliente
  if (!dniRuc)
    throw new HTTPException(400, {
      message: 'dni/Ruc is invalid',
    })

  if (dniRuc.length === 11) {
    // buscar por ruc en base de datos
    const customerFromDb = await CustomersService.getByRuc(db, dniRuc)

    if (!customerFromDb) {
      // buscar por ruc en api sunat
      const customerFromSunat = await CustomersService.getByRucFromSunat(dniRuc)
      return c.json({ ...customerFromSunat, isRegular: false }, 200)
    }

    return c.json(customerFromDb, 200)
  }

  if (dniRuc.length === 8) {
    // buscar por dni en sunat
    const customerFromSunat = await CustomersService.getByDniFromSunat(dniRuc)
    return c.json({ ...customerFromSunat, isRegular: false }, 200)
  }

  throw new HTTPException(400, {
    message: 'ruc must be 11 digits or dni must be 8 digits',
  })
})

// Get Customer by ruc route
app.get('/ruc/:ruc', async (c) => {
  const db = c.get('db')
  const ruc = c.req.param('ruc')

  const customer = await CustomersService.getByRuc(db, ruc)
  return c.json(customer)
})

// Get Customer by id route
app.get('/:id', async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')

  const customer = await CustomersService.getById(db, id)
  return c.json(customer, 200)
})

// Create Customer route
app.post(
  '/',
  zValidator('json', insertCustomerSchema, (result) => {
    if (!result.success) throw result.error
  }),
  async (c) => {
    const db = c.get('db')
    const data = c.req.valid('json')
    const result = await CustomersService.create(db, data)
    return c.json(result, 201)
  },
)

// Update Customer Route
app.put(
  '/:id',
  zValidator('json', updateCustomerSchema, (result) => {
    if (!result.success) throw result.error
  }),
  async (c) => {
    const db = c.get('db')
    const id = c.req.param('id')
    const dto = c.req.valid('json')
    const result = await CustomersService.update(db, id, dto)
    return c.json(result, 200)
  },
)

// Delete Customer Route
app.delete('/:id', async (c) => {
  const id = c.req.param('id')
  const db = c.get('db')
  const results = await CustomersService.delete(db, id)
  return c.json(results, 200)
})

export default app
