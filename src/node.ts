import { updateQuotationSchema } from './dtos/index'
import postgres from 'postgres'
import fs from 'node:fs/promises'

// async function main() {
//   const sql = postgres('postgresql://postgres.mluiozpgwvyzpnbzfkwm:TM6kufzgaKXH6Gnl@aws-0-us-east-1.pooler.supabase.com:6543/postgres')
//   const products = await sql`select * from _products`
//   const quotations = await sql`select * from _quotations`
//   const customers = await sql`select * from _customers`
//   const agencies = await sql`select * from _agencies`
//   const labels = await sql`select * from _labels`
//   const watermarks = await sql`select * from watermark`
//
//   await fs.writeFile('muckup/quotations.json', JSON.stringify(quotations))
//   console.log('muckup/quotations.json')
//   await fs.writeFile('muckup/customers.json', JSON.stringify(customers))
//   console.log('muckup/customers.json')
//   await fs.writeFile('muckup/agencies.json', JSON.stringify(agencies))
//   console.log('muckup/agencies.json')
//   await fs.writeFile('muckup/labels.json', JSON.stringify(labels))
//   console.log('muckup/labels.json')
//   await fs.writeFile('muckup/products.json', JSON.stringify(products))
//   console.log('muckup/products.json')
//   await fs.writeFile('muckup/watermarks.json', JSON.stringify(watermarks))
//   console.log('muckup/watermarks.json')
//   sql.end()
// }

async function main() {
  const res = await fetch('https://api.tellsignals.workers.dev/api/quotations?limit=40', {
    headers: {
      'TELL-API-KEY': 'kakapichipoto',
    },
  })
  const data = await res.json()
  const filtered = data.items.filter((q) => q.number > 7279)
  await fs.writeFile('muckup/rescues.json', JSON.stringify(filtered))
  console.log('muckup/rescues.json')
}
main()
