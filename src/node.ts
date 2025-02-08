import { updateQuotationSchema } from './dtos/index'
import postgres from 'postgres'
import fs from 'node:fs/promises'

async function main() {
  const sql = postgres('postgresql://postgres.mluiozpgwvyzpnbzfkwm:TM6kufzgaKXH6Gnl@aws-0-us-east-1.pooler.supabase.com:6543/postgres')
  const products = await sql`select * from _products`
  const quotations = await sql`select * from _quotations`
  const customers = await sql`select * from _customers`
  const agencies = await sql`select * from _agencies`
  const labels = await sql`select * from _labels`

  await fs.writeFile('muckup/quotations.json', JSON.stringify(quotations))
  console.log('muckup/quotations.json')
  await fs.writeFile('muckup/customers.json', JSON.stringify(customers))
  console.log('muckup/customers.json')
  await fs.writeFile('muckup/agencies.json', JSON.stringify(agencies))
  console.log('muckup/agencies.json')
  await fs.writeFile('muckup/labels.json', JSON.stringify(labels))
  console.log('muckup/labels.json')
  await fs.writeFile('muckup/products.json', JSON.stringify(products))
  console.log('muckup/products.json')
  sql.end()
}

main()
