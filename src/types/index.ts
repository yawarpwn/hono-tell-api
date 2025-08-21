import type { DrizzleD1Database } from 'drizzle-orm/d1'
import type * as schema from '@/core/db/schemas'
export { XmlInvoice } from './xml.d'

export type DB = DrizzleD1Database<typeof schema>

type Bindings = {
  POSTGRES_URL: string
  JWT_SECRET: string
  TELL_API_KEY: string
  RESEND_API_KEY: string
  CLOUDINARY_API_SECRET: string
  DB: D1Database
}

type Variables = {
  db: DB
  MY_VAR: string
}

export type App = {
  Bindings: Bindings
  Variables: Variables
}

//  Invoice
export interface Invoice {
  ublVersion: string
  fecVencimiento: string
  tipoOperacion: string
  tipoDoc: string
  serie: string
  correlativo: string
  fechaEmision: string
  formaPago: FormaPago
  tipoMoneda: string
  client: Client
  company: Company
  mtoOperGravadas: number
  mtoOperExoneradas: number
  mtoIGV: number
  totalImpuestos: number
  valorVenta: number
  subTotal: number
  mtoImpVenta: number
  details: Detail[]
  legends: Legend[]
}

export interface FormaPago {
  moneda: string
  tipo: string
}

export interface Client {
  tipoDoc: string
  numDoc: number
  rznSocial: string
  address: Address
}

export interface Company {
  ruc: number
  razonSocial: string
  nombreComercial: string | null
  address: Address
}

export interface Address {
  direccion: string
  provincia: string | null
  departamento: string | null
  distrito: string | null
  ubigueo: string | null
}

export interface Detail {
  codProducto: string | null
  unidad: string
  descripcion: string
  cantidad: number
  mtoValorUnitario: number
  mtoValorVenta: number
  mtoBaseIgv: number
  porcentajeIgv: number
  igv: number
  tipAfeIgv: number
  totalImpuestos: number
  mtoPrecioUnitario: number
}

export interface Legend {
  code: string
  value: string
}
