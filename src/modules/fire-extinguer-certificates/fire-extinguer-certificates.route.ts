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
        success: true,
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
      const result = await FireExtinguerCertificateService.create(db, data)
      return c.json({ ok: true, data: result }, 201)
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

export default app
