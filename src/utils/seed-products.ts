import type { DB, InsertCustomer, InsertQuotation } from '@/types'
import { usersTable, customersTable, quotationsTable, productCategoriesTable, productsTable } from '@/db/schemas'
import { productCategories } from '@/constants'
import products from '../../muckup/products.json'
import bcryp from 'bcryptjs'
import { count } from 'drizzle-orm'
import type { Context } from 'hono'

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

export async function seedProducts(db: DB, c: Context) {
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

  const stmts = products.map((prod) => {
    return c.env.DB.prepare(
      'INSERT INTO products (id, description, code, unit_size, category_id, link, rank, price, cost, created_at, updated_at) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    ).bind(
      prod.id,
      prod.description,
      prod.code,
      prod.unit_size,
      PRODUCTS_CATEGORIES[prod.category],
      prod.link,
      prod.rank,
      prod.price,
      prod.cost,
      Math.floor(new Date(prod.created_at).getTime() / 1000),
      Math.floor(new Date(prod.updated_at).getTime() / 1000),
    )
  })

  await c.env.DB.batch(stmts)
  console.log('success products Batch inserted')

  return {
    productCategories: insertedProductCategories.meta.changes,
    products: await db.select({ count: count() }).from(productsTable),
    users: insertedUsers.meta.changes,
  }
  // console.log(insertedUsers.meta.changes)
}
