import type { DB, InsertCustomer, InsertQuotation } from '@/types'
import { usersTable, customersTable, quotationsTable, productCategoriesTable, productsTable } from '@/db/schemas'
import { usersData } from '@/db/dataset'
import { productCategories } from '@/constants'
import bcryp from 'bcryptjs'
import productsJson from '../../muckup/_products_rows.json'
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

export async function seedProducts(db: DB) {
  await db.delete(productsTable)
  await db.delete(productCategoriesTable)

  const categoriesToInsert = productCategories.map((category, index) => ({
    id: index + 1,
    name: category,
  }))

  const insertedProductCategories = await db.insert(productCategoriesTable).values(categoriesToInsert)

  for (const product of productsJson) {
    await db.insert(productsTable).values({
      id: product.id,
      description: product.description,
      code: product.code[0],
      unitSize: product.unit_size,
      categoryId: PRODUCTS_CATEGORIES[product.category],
      link: product.link,
      rank: product.rank,
      price: product.price,
      cost: product.cost,
      createdAt: new Date(product.created_at),
      updatedAt: new Date(product.updated_at),
    })
  }

  return {
    productCategories: insertedProductCategories.meta.changes,
    products: await db.select({ count: count() }).from(productsTable),
  }
  // console.log(insertedUsers.meta.changes)
}
