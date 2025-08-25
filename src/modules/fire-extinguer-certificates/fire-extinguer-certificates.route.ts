import type { App } from '@/types'
import { Hono } from 'hono'
import { handleError } from '@/core/utils'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

import { FireExtinguerCertificateService } from './fire-extinguer-certificates.service'
const insertfireExtinguerCertificateSchema = z.object({
  emissionDate: z.string(),
  type: z.enum(['PQS', 'CO2']),
  capacity: z.string(),
  serie: z.string(),
  ruc: z.string().nullish(),
  companyName: z.string().nullish(),
  address: z.string().nullish(),
  model: z.enum(['Nacional', 'Importado']),
})
export type InsertFireExtinguerCertificate = z.infer<typeof insertfireExtinguerCertificateSchema>

const app = new Hono<App>()

//Get all
app.get('/', async (c) => {
  const db = c.get('db')

  try {
    const data = await FireExtinguerCertificateService.getAll(db)
    return c.json(
      {
        ok: true,
        data,
      },
      200,
    )
  } catch (error) {
    return handleError(error, c)
  }
})

//get by id
app.get('/:id', async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')

  if (!id) {
    return c.json({ ok: false, message: 'id is required' }, 400)
  }

  try {
    const data = await FireExtinguerCertificateService.getById(db, id)
    return c.json(
      {
        ok: true,
        data,
      },
      200,
    )
  } catch (error) {
    return handleError(error, c)
  }
})

//Create Certificado
app.post(
  '/',
  zValidator('json', insertfireExtinguerCertificateSchema, (result, c) => {
    if (!result.success) {
      return handleError(result.error, c)
    }
  }),
  async (c) => {
    const db = c.get('db')
    const data = c.req.valid('json')
    try {
      await FireExtinguerCertificateService.create(db, data)
      return c.json({ ok: true, message: 'Certificado creado exitosamente' }, 201)
    } catch (error) {
      return handleError(error, c)
    }
  },
)

//TODO: implementar actualizacion
app.put('/:id', async (c) => {
  return c.json({
    todo: true,
  })
})

app.delete('/:id', async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')
  try {
    const { deletedId } = await FireExtinguerCertificateService.delete(db, id)
    return c.json({
      ok: true,
      deletedId,
    })
  } catch (error) {
    return handleError(error, c)
  }
})

export default app
