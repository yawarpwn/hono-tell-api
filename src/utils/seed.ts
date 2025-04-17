import type { DB, InsertCustomer, InsertQuotation } from '@/types'
import {
  usersTable,
  customersTable,
  quotationsTable,
  productCategoriesTable,
  productsTable,
  agenciesTable,
  watermarksTable,
  labelsTable,
} from '@/db/schemas'
import { productCategories } from '@/constants'
import bcryp from 'bcryptjs'
import { count } from 'drizzle-orm'
import products from '../../muckup/products.json'
import customers from '../../muckup/customers.json'
import agencies from '../../muckup/agencies.json'
import labels from '../../muckup/labels.json'
import quotations from '../../muckup/quotations.json'
import watermarks from '../../muckup/watermarks.json'

export async function seed(db: DB) {
  await db.delete(productsTable)
  await db.delete(productCategoriesTable)
  await db.delete(customersTable)
  await db.delete(quotationsTable)
  await db.delete(labelsTable)
  await db.delete(agenciesTable)
  await db.delete(watermarksTable)

  //seed Products Categories
  const categoriesToInsert = productCategories.map((category, index) => ({
    id: index + 1,
    name: category,
  }))

  const insertedProductCategories = await db.insert(productCategoriesTable).values(categoriesToInsert)

  //seed Products
  const stmtsProducts = products.items.map((prod) => {
    return db.insert(productsTable).values({
      ...prod,
      createdAt: new Date(prod.createdAt),
      updatedAt: new Date(prod.updatedAt),
    })
  })
  //Seed customers
  const stmtsCustomers = customers.items.map((customer) => {
    return db.insert(customersTable).values({
      ...customer,
      createdAt: new Date(customer.createdAt),
      updatedAt: new Date(customer.updatedAt),
    })
  })

  const stmtsQuotations = quotations.items.map((quotation) => {
    return db.insert(quotationsTable).values({
      ...quotation,
      createdAt: new Date(quotation.createdAt),
      updatedAt: new Date(quotation.updatedAt),
    })
  })

  //seed agencies
  const stmtsAgencies = agencies.items.map((agency) => {
    return db.insert(agenciesTable).values({
      ...agency,
      createdAt: new Date(agency.createdAt),
      updatedAt: new Date(agency.updatedAt),
    })
  })

  //seed labels
  const stmtsLabels = labels.items.map((label) => {
    return db.insert(labelsTable).values({
      ...label,
      createdAt: new Date(label.createdAt),
      updatedAt: new Date(label.updatedAt),
    })
  })

  const stmtsWatermarks = watermarks.items.map((watermark) => {
    return db.insert(watermarksTable).values({
      ...watermark,
      createdAt: new Date(watermark.createdAt),
      updatedAt: new Date(watermark.updatedAt),
    })
  })

  //@ts-ignore
  await db.batch([...stmtsProducts, ...stmtsWatermarks])
  //@ts-ignore
  await db.batch(stmtsCustomers)
  //@ts-ignore
  await db.batch(stmtsQuotations)
  //@ts-ignore
  await db.batch(stmtsAgencies)
  //@ts-ignore
  await db.batch(stmtsLabels)

  return {
    productCategories: insertedProductCategories.meta.changes,
    products: await db.select({ count: count() }).from(productsTable),
    customers: await db.select({ count: count() }).from(customersTable),
    quotations: await db.select({ count: count() }).from(quotationsTable),
    agencies: await db.select({ count: count() }).from(agenciesTable),
    labels: await db.select({ count: count() }).from(labelsTable),
    watermarks: await db.select({ count: count() }).from(watermarksTable),
  }
}
