import type { App } from '@/types'
import { Hono } from 'hono'
import { CustomersService } from './customers.service'
import { handleError } from '@/utils'
import { HTTPException } from 'hono/http-exception'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

const customerQueryParamsSchema = z.object({
  onlyRegular: z
    .string()
    .transform((str) => str === 'true')
    .default('false'),
})

export type CustomerQueryParams = z.infer<typeof customerQueryParamsSchema>

const app = new Hono<App>()

app.get(
  '/',
  zValidator('query', customerQueryParamsSchema, (result, c) => {
    if (!result.success) {
      return c.json({
        message: 'Invalid query params',
      })
    }
  }),
  async (c) => {
    const db = c.get('db')
    const { onlyRegular } = c.req.valid('query')

    try {
      const customers = await CustomersService.getAll(db, { onlyRegular })
      return c.json(customers, 200)
    } catch (error) {
      return handleError(error, c)
    }
  },
)

app.get('/search/:dniruc', async (c) => {
  const db = c.get('db')
  const dniRuc = c.req.param('dniruc')

  //Buscar en base de datos si existe el cliente

  try {
    if (!dniRuc)
      throw new HTTPException(400, {
        message: 'dni/Ruc is invalid',
      })

    if (dniRuc.length === 11) {
      try {
        //buscar por ruc en base de datos
        const customerFromDb = await CustomersService.getByRuc(db, dniRuc)
        return c.json(
          {
            id: customerFromDb.id,
            name: customerFromDb.name,
            ruc: customerFromDb.ruc,
            isRegular: customerFromDb.isRegular,
            address: customerFromDb.address,
          },
          200,
        )
      } catch (error) {
        //buscar por ruc en sunat
        const customerFromSunat = await CustomersService.getByRucFromSunat(dniRuc)
        return c.json({ ...customerFromSunat, isRegular: false }, 200)
      }
    }

    if (dniRuc.length === 8) {
      //buscar por dni en sunat
      const customerFromSunat = await CustomersService.getByDniFromSunat(dniRuc)
      return c.json({ ...customerFromSunat, isRegular: false }, 200)
    }

    return c.json(
      {
        message: 'dni/ruc not found',
      },
      400,
    )
  } catch (error) {
    return handleError(error, c)
  }
})

app.get('/ruc/:ruc', async (c) => {
  const db = c.get('db')
  const ruc = c.req.param('ruc')

  try {
    const customer = await CustomersService.getByRuc(db, ruc)
    return c.json(customer)
  } catch (error) {
    return handleError(error, c)
  }
})

app.get('/:id', async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')

  try {
    const customer = await CustomersService.getById(db, id)
    return c.json(customer)
  } catch (error) {
    return handleError(error, c)
  }
})

app.post('/', async (c) => {
  const db = c.get('db')
  const dto = await c.req.json()
  try {
    const result = await CustomersService.create(db, dto)
    return c.json({ ok: true, data: result }, 201)
  } catch (error) {
    return handleError(error, c)
  }
})

app.put('/:id', async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')
  const dto = await c.req.json()
  try {
    const results = await CustomersService.update(db, id, dto)
    return c.json(results)
  } catch (error) {
    return handleError(error, c)
  }
})

app.delete('/:id', async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')
  try {
    const results = await CustomersService.delete(db, id)
    return c.json(results)
  } catch (error) {
    return handleError(error, c)
  }
})

export default app
