import type { XmlInvoice, Invoice } from '@/types'
export function extractInvoiceData(xmlObject: XmlInvoice) {
  const invoice = xmlObject.Invoice

  // Extraer fechas y correlativo
  const issueDate = invoice['cbc:IssueDate']
  const issueTime = invoice['cbc:IssueTime']
  const fechaEmision = `${issueDate}T${issueTime}-05:00`
  const fecVencimiento = `${invoice['cbc:DueDate']}T${issueTime}-05:00`
  const correlativo = invoice['cbc:ID'].split('-')[1]

  // Extraer montos
  const taxTotal = invoice['cac:TaxTotal']
  const monetaryTotal = invoice['cac:LegalMonetaryTotal']

  const mtoIGV = taxTotal['cbc:TaxAmount']
  const operacionGravada = monetaryTotal['cbc:LineExtensionAmount']
  const total = monetaryTotal['cbc:PayableAmount']

  // Extraer datos del cliente
  const customerParty = invoice['cac:AccountingCustomerParty']['cac:Party']
  const client = {
    tipoDoc: '6',
    numDoc: parseInt(customerParty['cac:PartyIdentification']['cbc:ID']),
    rznSocial: customerParty['cac:PartyLegalEntity']['cbc:RegistrationName'],
    address: {
      direccion: customerParty['cac:PartyLegalEntity']['cac:RegistrationAddress']['cac:AddressLine']['cbc:Line'],
      provincia: null,
      departamento: null,
      distrito: null,
      ubigueo: null,
    },
  }

  // Extraer detalles de items
  function getDetails(items: XmlInvoice['Invoice']['cac:InvoiceLine']) {
    return items.map((item, index) => ({
      codProducto: null,
      unidad: 'NIU',
      descripcion: item['cac:Item']['cbc:Description'],
      cantidad: item['cbc:InvoicedQuantity'],
      mtoValorUnitario: item['cac:Price']['cbc:PriceAmount'],
      mtoValorVenta: item['cbc:LineExtensionAmount'],
      mtoBaseIgv: item['cac:TaxTotal']['cac:TaxSubtotal']['cbc:TaxableAmount'],
      porcentajeIgv: item['cac:TaxTotal']['cac:TaxSubtotal']['cac:TaxCategory']['cbc:Percent'],
      igv: item['cac:TaxTotal']['cbc:TaxAmount'],
      tipAfeIgv: item['cac:TaxTotal']['cac:TaxSubtotal']['cac:TaxCategory']['cbc:TaxExemptionReasonCode'],
      totalImpuestos: item['cac:TaxTotal']['cbc:TaxAmount'],
      mtoPrecioUnitario: item['cac:PricingReference']['cac:AlternativeConditionPrice']['cbc:PriceAmount'],
    }))
  }

  // Función para convertir número a letras (necesitarías implementarla o usar una librería)
  function numberToLetters(number: any) {
    // Aquí implementarías la conversión de número a letras
    // Por ahora devolvemos el valor que viene en el XML
    return invoice['cbc:Note']
  }

  // Construir el objeto final
  return {
    ublVersion: invoice['cbc:UBLVersionID'].toString(),
    fecVencimiento,
    tipoOperacion: '0101',
    tipoDoc: '01',
    serie: 'F001',
    correlativo,
    fechaEmision,
    formaPago: {
      moneda: invoice['cbc:DocumentCurrencyCode'],
      tipo: invoice['cac:PaymentTerms']['cbc:PaymentMeansID'],
    },
    tipoMoneda: invoice['cbc:DocumentCurrencyCode'],
    client,
    company: {
      ruc: parseInt(invoice['cac:AccountingSupplierParty']['cac:Party']['cac:PartyIdentification']['cbc:ID']),
      razonSocial: invoice['cac:AccountingSupplierParty']['cac:Party']['cac:PartyLegalEntity']['cbc:RegistrationName'],
      nombreComercial: null,
      address: {
        direccion:
          invoice['cac:AccountingSupplierParty']['cac:Party']['cac:PartyLegalEntity']['cac:RegistrationAddress']['cac:AddressLine'][
            'cbc:Line'
          ],
        provincia: invoice['cac:AccountingSupplierParty']['cac:Party']['cac:PartyLegalEntity']['cac:RegistrationAddress']['cbc:CityName'],
        departamento:
          invoice['cac:AccountingSupplierParty']['cac:Party']['cac:PartyLegalEntity']['cac:RegistrationAddress']['cbc:CountrySubentity'],
        distrito: invoice['cac:AccountingSupplierParty']['cac:Party']['cac:PartyLegalEntity']['cac:RegistrationAddress']['cbc:District'],
        ubigueo:
          invoice['cac:AccountingSupplierParty']['cac:Party']['cac:PartyLegalEntity']['cac:RegistrationAddress']['cbc:ID'].toString(),
      },
    },
    mtoOperGravadas: operacionGravada,
    mtoOperExoneradas: 0,
    mtoIGV,
    totalImpuestos: mtoIGV,
    valorVenta: operacionGravada,
    subTotal: total,
    mtoImpVenta: total,
    details: getDetails(invoice['cac:InvoiceLine']),
    legends: [
      {
        code: '1000',
        value: numberToLetters(total),
      },
    ],
  }
}
