import type { DB, InsertCustomer, InsertQuotation } from '@/types'
import { usersTable, customersTable, quotationsTable, productCategoriesTable, productsTable } from '@/db/schemas'
import { productCategories } from '@/constants'
import products from '../../muckup/products.json'
import bcryp from 'bcryptjs'
import { count } from 'drizzle-orm'

const PRODUCTS_CATEGORIES = {
  'cintas seguridad': 1,
  obras: 2,
  'proteccion vial': 3,
  fotoluminiscente: 4,
  seguridad: 5,
  viales: 6,
  viniles: 7,
  'lucha contra incendio': 8,
  'articulos seguridad': 9,
  epp: 10,
  servicio: 11,
  'ropa seguridad': 12,
  convencionales: 13,
  acrilicos: 14,
} as const

export async function seedProducts(db: DB, postgresURl: string) {
  await db.delete(productsTable)
  await db.delete(productCategoriesTable)
  await db.delete(usersTable)

  const insertedUsers = await db.insert(usersTable).values([
    {
      email: 'neyda.mili11@gmail.com',
      password: await bcryp.hash('ney123456', 10),
      role: 'user',
    },
    {
      email: 'tellsenales@gmail.com',
      password: await bcryp.hash('tell123456', 10),
      role: 'admin',
    },
  ])

  const categoriesToInsert = productCategories.map((category, index) => ({
    id: index + 1,
    name: category,
  }))

  const insertedProductCategories = await db.insert(productCategoriesTable).values(categoriesToInsert)

  for (const product of products) {
    fetch('https://api.tellsignals.workers.dev/api/products', {
      method: 'POST',
      body: JSON.stringify(product),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    // await db.insert(productsTable).values({
    //   id: product.id,
    //   description: product.description,
    //   code: product.code,
    //   unitSize: product.unit_size,
    //   categoryId: PRODUCTS_CATEGORIES[product.category],
    //   link: product.link,
    //   rank: product.rank,
    //   price: product.price,
    //   cost: product.cost,
    //   createdAt: new Date(product.created_at),
    //   updatedAt: new Date(product.updated_at),
    // })
    console.log('product inserted: ', product.id)
  }

  return {
    productCategories: insertedProductCategories.meta.changes,
    products: await db.select({ count: count() }).from(productsTable),
    users: insertedUsers.meta.changes,
  }
  // console.log(insertedUsers.meta.changes)
}
