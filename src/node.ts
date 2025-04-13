import fs from 'node:fs/promises'
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

main()
