import fs from 'node:fs/promises'
import dotenv from 'dotenv'
dotenv.config({ path: '.dev.vars' })
import postgres from 'postgres'
//TODO:

const TELL_API_KEY = process.env.TELL_API_KEY!
async function main() {
  fetch('https://api.tellsignals.workers.dev/api/quotations', {
    headers: {
      'TEll-API-KEY': TELL_API_KEY,
    },
  })
    .then((res) => res.json())
    .then((quotations) => {
      fs.writeFile('muckup/quotations.json', JSON.stringify(quotations))
      console.log('success quos')
    })

  const endpoints = ['products', 'customers', 'agencies', 'labels', 'watermarks']
  //
  const promises = endpoints.map((endpoint) => {
    return fetch(`https://api.tellsignals.workers.dev/api/${endpoint}`, {
      headers: {
        'TEll-API-KEY': TELL_API_KEY,
      },
    }).then((res) => res.json())
  })

  try {
    const [products, customers, agencies, labels, watermarks] = await Promise.all(promises)
    await fs.writeFile('muckup/customers.json', JSON.stringify(customers))
    console.log('muckup/customers.json')
    await fs.writeFile('muckup/agencies.json', JSON.stringify(agencies))
    console.log('muckup/agencies.json')
    await fs.writeFile('muckup/labels.json', JSON.stringify(labels))
    console.log('muckup/labels.json')
    await fs.writeFile('muckup/products.json', JSON.stringify(products))
    console.log('muckup/products.json')
    await fs.writeFile('muckup/watermarks.json', JSON.stringify(watermarks))
    console.log('all success')
  } catch (error) {
    console.log('Error -----')
    console.log(error)
  }
}

// id: "6634efab-317e-4aec-b9de-7e8282c20bf8",
// created_at: 2024-03-06T02:48:04.449Z,
// title: "Salida sola",
// width: "350",
// height: "234",
// category: "decorativas",
// url: "https://res.cloudinary.com/tellsenales-cloud/image/upload/v1709693283/signals/fiqskdia79lquw5uzf3l.webp",
// format: "webp",
// public_id: "signals/fiqskdia79lquw5uzf3l",
// code: "DC-AL-11",
// updated_at: 2024-03-11T02:30:54.327Z,
// description: null,
async function getSignals() {
  const sql = postgres(process.env.POSTGRES_URL!)
  const rows = await sql`select * from signals`
  await fs.writeFile('muckup/signals.json', JSON.stringify(rows))
  console.log('muckup/signals.json')
  sql.end()
}
getSignals()

// main()
