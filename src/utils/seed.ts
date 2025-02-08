import type { DB, InsertCustomer, InsertQuotation } from '@/types'
import {
  usersTable,
  customersTable,
  quotationsTable,
  productCategoriesTable,
  productsTable,
  agenciesTable,
  labelsTable,
} from '@/db/schemas'
import { productCategories } from '@/constants'
import bcryp from 'bcryptjs'
import { count } from 'drizzle-orm'
import productsJson from '../../muckup/products.json'
import customerJson from '../../muckup/customers.json'
import agenciesJson from '../../muckup/agencies.json'
import labelsJson from '../../muckup/labels.json'
import quotationsJson from '../../muckup/quotations.json'

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
  await db.delete(productsTable)
  await db.delete(productCategoriesTable)
  await db.delete(usersTable)
  await db.delete(customersTable)
  await db.delete(quotationsTable)
  await db.delete(labelsTable)
  await db.delete(agenciesTable)

  //Seed users
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

  //Seed product Categories
  const categoriesToInsert = productCategories.map((category, index) => ({
    id: index + 1,
    name: category,
  }))

  const insertedProductCategories = await db.insert(productCategoriesTable).values(categoriesToInsert)

  //Seed Customers
  for (const customer of customerJson) {
    await db.insert(customersTable).values({
      id: customer.id,
      name: customer.name,
      ruc: customer.ruc.toString(),
      phone: null,
      address: customer.address,
      email: null,
      isRegular: customer.is_regular,
      createdAt: new Date(customer.created_at),
      updatedAt: new Date(customer.updated_at),
    })

    console.log('seed: ', customer.name)
  }

  //Seed Products
  for (const product of productsJson) {
    await db.insert(productsTable).values({
      id: product.id,
      description: product.description,
      code: product.code,
      unitSize: product.unit_size,
      categoryId: PRODUCTS_CATEGORIES[product.category],
      link: product.link,
      rank: product.rank,
      price: product.price,
      cost: product.cost,
      createdAt: new Date(product.created_at),
      updatedAt: new Date(product.updated_at),
    })
    console.log('product inserted: ', product.id)
  }

  //seed Agencies
  for (const agency of agenciesJson) {
    await db.insert(agenciesTable).values({
      id: agency.id,
      name: agency.name,
      ruc: agency.ruc,
      phone: agency.phone,
      address: agency.address,
      createdAt: new Date(agency.created_at),
      updatedAt: new Date(agency.updated_at),
    })
    console.log(`inserted agencies ${agency.id} success`)
  }

  //Seed labels
  for (const label of labelsJson) {
    await db.insert(labelsTable).values({
      id: label.id,
      recipient: label.recipient,
      destination: label.destination,
      dniRuc: label.dni_ruc,
      phone: label.phone,
      address: label.address,
      observations: label.observations,
      agencyId: label.agency_id,
      createdAt: new Date(label.created_at),
      updatedAt: new Date(label.updated_at),
    })
    console.log(`inserted labels ${label.id} success`)
  }

  //Seed quotations
  for (const quotation of quotationsJson) {
    await db.insert(quotationsTable).values({
      id: quotation.id,
      number: quotation.number,
      deadline: quotation.deadline,
      credit: quotation.credit,
      includeIgv: quotation.include_igv,
      customerId: quotation.customer_id,
      isPaymentPending: quotation.is_payment_pending,
      items: JSON.parse(quotation.items).map((item) => ({
        id: item.id,
        qty: item.qty,
        cost: item.cost,
        price: item.price,
        unitSize: item.unit_size,
        description: item.description,
      })),
      createdAt: new Date(quotation.created_at),
      updatedAt: new Date(quotation.updated_at),
    })

    console.log('seed quotation: ', quotation.number)
  }

  return {
    productCategories: insertedProductCategories.meta.changes,
    products: await db.select({ count: count() }).from(productsTable),
    users: insertedUsers.meta.changes,
  }
  // console.log(insertedUsers.meta.changes)
}
