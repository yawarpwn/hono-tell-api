import type { DB, InsertCustomer, InsertQuotation } from '@/types'
import { usersTable, customersTable, quotationsTable, productCategoriesTable, productsTable } from '@/db/schemas'
import { usersData } from '@/db/dataset'
import { productCategories } from '@/constants'
import bcryp from 'bcryptjs'
import { faker } from '@faker-js/faker'
import productsJson from '../../muckup/_products_rows.json'
import customersJson from '../../muckup/_customers_rows.json'
import quotationsJson from '../../muckup/_quotations_rows.json'

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

export async function seed(db: DB) {
  console.log('SEED Route')
  await db.delete(usersTable)
  await db.delete(customersTable)
  await db.delete(quotationsTable)
  await db.delete(productsTable)
  await db.delete(productCategoriesTable)

  const mappedUsers = usersData.map((user) => ({
    ...user,
    password: bcryp.hashSync(user.password, 10),
  }))

  const categoriesToInsert = productCategories.map((category, index) => ({
    id: index + 1,
    name: category,
  }))

  const insertedUsers = await db.insert(usersTable).values(mappedUsers)
  const insertedProductCategories = await db.insert(productCategoriesTable).values(categoriesToInsert)

  //Seed products
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
    console.log('seed product')
  }

  //Seed Customers
  for (const customer of customersJson) {
    await db.insert(customersTable).values({
      id: customer.id,
      name: customer.name,
      ruc: customer.ruc,
      phone: null,
      address: customer.address,
      email: null,
      isRegular: customer.is_regular,
      createdAt: new Date(customer.created_at),
      updatedAt: new Date(customer.updated_at),
    })

    console.log('seed customer')
  }

  //seed quotations
  for (const quotation of quotationsJson) {
    const items = JSON.parse(quotation.items)
    const itemsMapped = items.map((item) => ({
      ...item,
      unitSize: item.unit_size,
    }))
    await db.insert(quotationsTable).values({
      id: quotation.id,
      number: quotation.number,
      deadline: quotation.deadline,
      credit: quotation.credit,
      includeIgv: quotation.include_igv,
      customerId: quotation.customer_id,
      isPaymentPending: quotation.is_payment_pending,
      items: itemsMapped,
      createdAt: new Date(quotation.created_at),
      updatedAt: new Date(quotation.updated_at),
    })
    console.log('seed quotations')
  }

  return {
    productCategories: insertedProductCategories.meta.changes,
    // products: insertedProducts.meta.changes,
    users: insertedUsers.meta.changes,
  }
  // console.log(insertedUsers.meta.changes)
}
