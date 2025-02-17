import type { App } from '@/types'
import { Hono } from 'hono'
import { CustomersModel } from '@/models'
import { handleError } from '@/utils'
import { HTTPException } from 'hono/http-exception'

const app = new Hono<App>()

app.get('/', async (c) => {
  const db = c.get('db')
  const ruc = c.req.query('ruc')

  try {
    const todos = await CustomersModel.getAll(db, { ruc })
    return c.json(todos, 200)
  } catch (error) {
    return handleError(error, c)
  }
})

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
        const customerFromDb = await CustomersModel.getByRuc(db, dniRuc)
        return c.json(customerFromDb, 200)
      } catch (error) {
        //buscar por ruc en sunat
        const customerFromSunat = await CustomersModel.getByRucFromSunat(dniRuc)
        return c.json(customerFromSunat, 200)
      }
    }

    if (dniRuc.length === 8) {
      console.log('search by dni in sunat')
      //buscar por dni en sunat
      const customerFromSunat = await CustomersModel.getByDniFromSunat(dniRuc)
      return c.json(customerFromSunat, 200)
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
    const customer = await CustomersModel.getByRuc(db, ruc)
    return c.json(customer)
  } catch (error) {
    return handleError(error, c)
  }
})

app.get('/:id', async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')

  try {
    const customer = await CustomersModel.getById(db, id)
    return c.json(customer)
  } catch (error) {
    return handleError(error, c)
  }
})

app.post('/', async (c) => {
  const db = c.get('db')
  const dto = await c.req.json()
  try {
    const result = await CustomersModel.create(db, dto)
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
    const results = await CustomersModel.update(db, id, dto)
    return c.json(results)
  } catch (error) {
    return handleError(error, c)
  }
})

app.delete('/:id', async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')
  try {
    const results = await CustomersModel.delete(db, id)
    return c.json(results)
  } catch (error) {
    return handleError(error, c)
  }
})

export { app as customersRoute }
