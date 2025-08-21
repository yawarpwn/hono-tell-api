import { Invoice, XmlInvoice } from '@/types'
import { Quotation } from '../quotations/quotations.validation'
import { numberToLetters, formatDateToLocal, extractDataFromXml, extractInvoiceData } from '@/core/utils'

type SunatResponse = {
  xml: string
  hash: string
  sunatResponse: {
    success: boolean
    cdrZip: string
    cdrResponse: {
      id: string
      code: string
      description: string
      notes: string[]
    }
  }
}

const TOKEN_APISPERU =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VybmFtZSI6InRlbGxzZW5hbGVzIiwiY29tcGFueSI6IjIwNjEwOTk5OTk5IiwiaWF0IjoxNzU0NTg3ODgwLCJleHAiOjgwNjE3ODc4ODB9.ASw5D2fmDUZNS90y7N6wyDR2hWxS2v749U6I5w0XKjfRGYccqENRMtSrAMUi8vb3QxkL1k-8N4EPb670GMRbAibFb79UFzKnrZdkh2--BJOOkQtIwiRNi5OdG3CI2usA5HcSxswjYh-CTNEdsrU02rUn93FcRTHbmcu7BRoyRr8PjCKVmsee8ozW0-ZbNxpv5beyHURMowEcsi9-98RAXgx4gd_AUpBTiAKgtxWMfq3FM5o1EOW0cv9cBfSbYi8aBkuBZTjFRTtU9tUM2lN42DSTVpwLaKgXUUCLQwuYpmiArs8ubQLoAICWVPJ9UtO6nu90OjtuwqqDjFYP-NInfAqmwTsfM3HiPmtBPlDd5ZwFHIBGtkgT9pF4dumuj3JvjQrwnvOGpAgB2u9q8xooOM5AP1H8MQkqnKNFTQO-jbknvLM11K3zH3puHppPKIHPfwBe1t5abpD2XAcBycV8PZDKuxHjGnmFPIKOnMVqzhGC0fXZgI9CZRnJ4TK5MTFRWBpPQDSMX3grMvfE2RLKh_z8uzxgPrlS8E2YS6xsBvyd6NWAA4wLbEGRfK5Zk9bgv2IJQaKywYiNiSKoFtaTXNhdXSydQRpsk9-tG_-hoSE-R8c1Mlk2hbW8juEMQsdO7urVPqjAETLPycUL9UHdmoebP41kd1t-ZCks_EtT4DY'
const APISPERU_URL = 'https://facturacion.apisperu.com/api/v1/invoice/send'

type InvoceData = {
  ruc: string
  razonSocial: string
  serie: string
  correlativo: string
  fechaEmision: string
}

function calcTaxes(items: Quotation['items']) {
  // Calcular el total (suma de precio * cantidad de todos los items)
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0)

  // Calcular operación gravada (total sin IGV)
  const operacionGravada = total / 1.18

  // Calcular IGV (18% del total sin IGV)
  const igv = operacionGravada * 0.18

  return {
    subTotal: Math.round(operacionGravada * 10000) / 10000, // Redondear a 4 decimales
    igv: Math.round(igv * 10000) / 10000, // Redondear a 4 decimales
    total: Math.round(total * 10000) / 10000, // Redondear a 4 decimales
  }
}

const fixDigits = (num: number) => parseFloat(num.toFixed(4))

function getDetails(items: Quotation['items']) {
  return items.map((item) => {
    const mtoValorUnitario = fixDigits(item.price / 1.18)
    const igv = fixDigits(mtoValorUnitario * 0.18)
    const mtoValorVenta = fixDigits(mtoValorUnitario * item.qty)
    return {
      codProducto: null,
      unidad: 'NIU',
      descripcion: item.description,
      cantidad: item.qty,
      mtoValorUnitario,
      mtoValorVenta,
      mtoBaseIgv: mtoValorVenta,
      porcentajeIgv: 18,
      igv: fixDigits(igv * item.qty),
      tipAfeIgv: 10,
      totalImpuestos: fixDigits(igv * item.qty),
      mtoPrecioUnitario: item.price,
    }
  })
}
export class InvoicesService {
  /**
   * Genera el XML de una factura electrónica simple.
   * En una aplicación real, este módulo sería mucho más complejo y tomaría
   * los datos de la factura como parámetros.
   */
  static createInvoiceXML(invoiceData: InvoceData) {}

  static extractDataFromXml(xml: string) {
    return extractDataFromXml(xml)
  }

  static extractInvoiceData(xmlObject: XmlInvoice) {
    return extractInvoiceData(xmlObject)
  }

  static async generateInvoice(quotation: Quotation) {
    const client = {
      tipoDoc: '6',
      numDoc: Number(quotation.customer.ruc),
      rznSocial: quotation.customer.name,
      address: {
        direccion: quotation.customer?.address,
        provincia: null,
        departamento: null,
        distrito: null,
        ubigueo: null,
      },
    }
    const clientExample = {
      tipoDoc: '6',
      numDoc: 20000000002,
      rznSocial: 'Cliente',
      address: {
        direccion: 'Direccion cliente',
        provincia: 'LIMA',
        departamento: 'LIMA',
        distrito: 'LIMA',
        ubigueo: '150101',
      },
    }

    const fechaEmision = formatDateToLocal(new Date().toISOString())
    const fecVencimiento = fechaEmision
    const correlativo = '01'

    const { igv, subTotal: operacionGravada, total } = calcTaxes(quotation.items)

    const invoice = {
      ublVersion: '2.1',
      fecVencimiento,
      tipoOperacion: '0101',
      tipoDoc: '01',
      serie: 'F001',
      correlativo,
      fechaEmision,
      formaPago: {
        moneda: 'PEN',
        tipo: 'Contado',
      },
      tipoMoneda: 'PEN',
      client,
      company: {
        ruc: 20610999999,
        razonSocial: 'TELL SEÑALES SOCIEDAD ANONIMA CERRADA',
        nombreComercial: null,
        address: {
          direccion: 'AV. MAQUINARIAS NRO. 325',
          provincia: 'CALLAO',
          departamento: 'CALLAO',
          distrito: 'CARMEN DE LA LEGUA REYNOSO',
          ubigueo: '070103',
        },
      },
      mtoOperGravadas: operacionGravada,
      mtoOperExoneradas: 0,
      mtoIGV: igv,
      totalImpuestos: igv,
      valorVenta: operacionGravada,
      subTotal: total,
      mtoImpVenta: total,
      details: getDetails(quotation.items),
      legends: [
        {
          code: '1000',
          value: numberToLetters(total),
        },
      ],
    }

    const res = await fetch(APISPERU_URL, {
      method: 'POST',
      body: JSON.stringify(invoice),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKEN_APISPERU}`,
      },
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.error)
    }

    const data = (await res.json()) as SunatResponse

    return data
  }
}
