import { XMLParser } from 'fast-xml-parser'
import type { XmlInvoice } from '@/types'

export function extractDataFromXml(xml: string) {
  const parser = new XMLParser()

  const data = parser.parse(xml) as XmlInvoice
  return data
}
