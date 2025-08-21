import type { App } from '@/types'
import { Hono } from 'hono'
import { XMLParser } from 'fast-xml-parser'
const parser = new XMLParser()
import { xml } from './xml'
import { InvoicesService } from './invoices.service'

const app = new Hono<App>()

// Obtner facturas
app.get('/', (c) => {
  const data = InvoicesService.extractDataFromXml(xml)
  const invoice = InvoicesService.extractInvoiceData(data)

  return c.json(invoice)
})

// Get by invoice by id
app.get('/:id', async (c) => {
  return c.json({
    message: 'Get by invoice by id',
  })
})

// Create factura
app.post('/', async (c) => {
  const quotation = {
    id: '6c0f9bf7-b7e1-4240-9d08-e7689ba215de',
    number: 8791,
    deadline: 7,
    credit: null,
    includeIgv: true,
    isPaymentPending: false,
    observations: '',
    validityDays: 15,
    standardTerms: ['DESIGNS_APPROVAL', 'WARRANTY_3M'],
    paymentCodition: 'FULL_PREPAYMENT',
    items: [
      {
        id: '1afdb45e-15ff-4353-84ab-b79344da9412',
        price: 118,
        qty: 2,
        cost: 131,
        link: 'https://tellsenales.com/seguridad/senal-preventiva-en-fibra-de-vidrio-4mm-con-lamina-reflectiva-hip/',
        unitSize: '60x60cm',
        description:
          'Señal Vial Preventiva ( P-33B, P-15, P-10A ) LÁMINA: Retroreflectiva 3M tipo IV Prismático de Alta Intensidad (HIP) Código 3931 ( Amarillo ) PANEL: Fibra de vidrio 4mm - platina embebida de 1.5 pulg. IMPRESIÓN: Tinta HP Latex "Authorized 3M-Traffic Edition" LAMINADO: Película 3M ElectroCut 1170C',
      },
      {
        id: '8e0db726-1edc-415e-a52a-f49d8eb08b4f',
        price: 250,
        qty: 44,
        cost: 165,
        link: 'https://tellsenales.com/seguridad/senal-preventiva-en-fibra-de-vidrio-4mm-con-lamina-reflectiva-hip/',
        unitSize: '60x60cm',
        description:
          'Señal Vial Preventiva (P-48 ) LÁMINA: Retroreflectiva 3M tipo XI Grado Diamante (DG3) Código 4083 ( Verde Amarillo Fluorescente ) PANEL: Fibra de vidrio 4mm - platina embebida de 1 .5 pulg. IMPRESIÓN: Tinta HP Latex "Authorized 3M-Traffic Edition" LAMINADO: Película 3M ElectroCut 1170C',
      },
      {
        id: 'fe615671-ebf4-4b7c-8f94-e992d558ce6d',
        price: 400,
        qty: 32,
        cost: 240,
        link: 'https://tellsenales.com/seguridad/senal-preventiva-en-fibra-de-vidrio-4mm-con-lamina-reflectiva-hip/',
        unitSize: 'und',
        description:
          'Señal Ciclovia ( P-46B ) LÁMINA: Retroreflectiva 3M tipo XI Grado Diamante (DG3) Código 4083 ( Verde Amarillo Fluorescente ) PANEL: Fibra de vidrio 4mm - platina embebida de 1 .5 pulg. IMPRESIÓN: Tinta HP Latex "Authorized 3M-Traffic Edition" LAMINADO: Película 3M ElectroCut 1170C ( Consta de 2 señales 60x60cm y 40x40cm )',
      },
      {
        id: '56ec0ed3-b7f9-4ebc-a964-a150eaeb1949',
        price: 480,
        qty: 2,
        cost: 425,
        link: 'https://tellsenales.com/seguridad/senal-preventiva-con-lamina-de-alta-intensidad-hip-y-soporte-sustrato-de/',
        unitSize: '80x80cm',
        description:
          'Señal Vial Preventiva ( P-49 ) LÁMINA: Retroreflectiva 3M tipo XI Grado Diamante (DG3) Código 4083 ( Verde Amarillo Fluorescente ) PANEL: Sustrato de aluminio compuesto 4mm IMPRESIÓN: Tinta HP Latex "Authorized 3M-Traffic Edition" LAMINADO: Película 3M ElectroCut 1170C',
      },
      {
        id: 'a97a2c61-a8d5-4d62-bc36-e9b986843964',
        price: 185,
        qty: 26,
        cost: 131,
        unitSize: '60x60cm',
        description:
          'Señal Vial Reguladora ( R-1 ) LÁMINA: Retroreflectiva 3M tipo IV Prismático de Alta Intensidad (HIP) Código 3930 ( Blanco ) PANEL: Fibra de vidrio 4mm - platina embebida de 1.5 pulg. IMPRESIÓN: Tinta HP Latex "Authorized 3M-Traffic Edition" LAMINADO: Película 3M ElectroCut 1170C',
      },
      {
        id: 'f868b27f-15e8-453a-8834-6363ca882c2e',
        price: 260,
        qty: 31,
        cost: 210,
        link: 'https://tellsenales.com/seguridad/senal-reguladora-en-fibra-de-vidrio-4mm-con-lamina-reflectiva-hip/',
        unitSize: '60x90cm',
        description:
          'Señal Vial Reguladora ( R-30 ) LÁMINA: Retroreflectiva 3M tipo IV Prismático de Alta Intensidad (HIP) Código 3930 ( Blanco ) PANEL: Fibra de vidrio 4mm - platina embebida de 1.5 pulg. IMPRESIÓN: Tinta HP Latex "Authorized 3M-Traffic Edition" LAMINADO: Película 3M ElectroCut 1170C',
      },
      {
        id: '613929f7-7a42-4f8e-9e1d-9d8a5a3fe258',
        price: 435,
        qty: 12,
        cost: 210,
        link: 'https://tellsenales.com/seguridad/senal-reguladora-en-fibra-de-vidrio-4mm-con-lamina-reflectiva-hip/',
        unitSize: '90x90cm',
        description:
          'Señal Vial Informativa ( I-6) LÁMINA: Retroreflectiva 3M tipo IV Prismático de Alta Intensidad (HIP) Código 3930 ( Blanco ) PANEL: Fibra de vidrio 4mm - platina embebida de 1.5 pulg. IMPRESIÓN: Tinta HP Latex "Authorized 3M-Traffic Edition" LAMINADO: Película 3M ElectroCut 1170C',
      },
      {
        id: 'a44b7308-4574-4f72-be7b-6780aa9d95a5',
        price: 155,
        qty: 80,
        cost: 210,
        link: 'https://tellsenales.com/seguridad/senal-reguladora-en-fibra-de-vidrio-4mm-con-lamina-reflectiva-hip/',
        unitSize: '90x30cm',
        description:
          'Señal Vial Informativa ( Calles ) LÁMINA: Retroreflectiva 3M tipo IV Prismático de Alta Intensidad (HIP) Código 3930 ( Blanco ) PANEL: Fibra de vidrio 4mm - platina embebida de 1.5 pulg. IMPRESIÓN: Tinta HP Latex "Authorized 3M-Traffic Edition" LAMINADO: Película 3M ElectroCut 1170C',
      },
    ],
    customerId: '01d06597-e131-4a5a-8b6a-2bbafe33ef96',
    customer: {
      id: '01d06597-e131-4a5a-8b6a-2bbafe33ef96',
      name: 'CONSORCIO PERLA DEL CHIRA',
      ruc: '20613659766',
      phone: null,
      address: 'BL. 2A NRO. 301 DPTO. 301 C.H. UNIDAD VECINAL PIURA PIURA PIURA',
      email: null,
      isRegular: false,
      createdAt: '2025-08-20T22:27:58.000Z',
      updatedAt: '2025-08-20T22:27:58.000Z',
    },
    createdAt: '2025-08-20T22:27:58.000Z',
    updatedAt: '2025-08-20T22:27:58.000Z',
  }

  try {
    const data = await InvoicesService.generateInvoice(quotation)
    return c.json(data)
  } catch (error) {
    console.log(error)
    return c.json({
      ok: false,
      message: 'Error al crear la factura',
    })
  }
})

export default app
