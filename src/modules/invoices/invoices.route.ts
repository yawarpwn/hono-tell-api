import type { App } from '@/types'
import { Hono } from 'hono'
import { XMLParser } from 'fast-xml-parser'
import { xml } from './xml'
import { InvoicesService } from './invoices.service'
import z from 'zod'
import { zValidator } from '@hono/zod-validator'

const invoiceItemSchema = z.object({
  price: z.number().positive(),
  qty: z.number().positive(),
  description: z.string(),
  unitSize: z.string(),
})

const createInvoiceSchema = z.object({
  items: z.array(invoiceItemSchema),
  customer: z.object({
    companyName: z.string(),
    documentNumber: z.string(),
    address: z.string(),
  }),
  issueDate: z.string(),
  expirationDate: z.string(),
})

export type CreateInvoice = z.infer<typeof createInvoiceSchema>
export type InvoiceItem = z.infer<typeof invoiceItemSchema>

const app = new Hono<App>()

// Obtner facturas
app.get('/', async (c) => {
  const db = c.get('db')
  try {
    const invoices = await InvoicesService.getAll(db)
    return c.json(invoices)
  } catch (error) {
    return c.json({
      ok: false,
      message: 'Error al obtener las facturas',
    })
  }
})

// Get by invoice by id
app.get('/:id', async (c) => {
  return c.json({
    message: 'Get by invoice by id',
  })
})

// Create factura
app.post(
  '/',
  //Valida el body de la factura
  zValidator('json', createInvoiceSchema, (result, c) => {
    if (!result.success) {
      console.log(result.error.flatten().fieldErrors)
      return c.json(result.error, 400)
    }
  }),
  async (c) => {
    const db = c.get('db')
    try {
      const invoiceData = c.req.valid('json')

      // Generar la factura con api externa
      const { xml, hash } = await InvoicesService.generateInvoice(invoiceData)

      // Guardar el xml, hash en la base de datos
      await InvoicesService.create(db, { xml, hash })

      // Retornar un mensaje al cliente
      return c.json({ ok: true, message: 'Factura creada exitosamente' })
    } catch (error) {
      console.log(error)
      return c.json({
        ok: false,
        error: 'Error al crear la factura',
      })
    }
  },
)

export default app
