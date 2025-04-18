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
  signalsTable,
  signalCategoriesTable,
} from '@/db/schemas'
import { productCategories, signalCategories } from '@/constants'
import { count } from 'drizzle-orm'
import products from '../../muckup/products.json'
import customers from '../../muckup/customers.json'
import agencies from '../../muckup/agencies.json'
import labels from '../../muckup/labels.json'
import quotations from '../../muckup/quotations.json'
import watermarks from '../../muckup/watermarks.json'
import signals from '../../muckup/signals.json'

export async function seed(db: DB) {
  // await db.delete(productsTable)
  // await db.delete(productCategoriesTable)
  // await db.delete(customersTable)
  // await db.delete(quotationsTable)
  // await db.delete(labelsTable)
  // await db.delete(agenciesTable)
  // await db.delete(watermarksTable)
  await db.delete(signalsTable)
  await db.delete(signalCategoriesTable)

  //seed Products Categories
  // const categoriesToInsert = productCategories.map((category, index) => ({
  //   id: index + 1,
  //   name: category,
  // }))

  //seed signal Categories
  //
  const signalCategoriesToInsert = signalCategories.map((category, index) => ({
    id: index + 1,
    name: category,
  }))

  console.log({ signalCategoriesToInsert })

  //  const signalCategories = {
  //   viales: 1,
  //   seguridad: 2,
  //   decorativas: 3,
  //   obras: 4,
  //   fotoluminicentes: 5,
  // };

  // const insertedProductCategories = await db.insert(productCategoriesTable).values(categoriesToInsert)
  const insertedSignalCategories = await db.insert(signalCategoriesTable).values(signalCategoriesToInsert)

  const stmtsSignals = signals.map((signal) => {
    return db.insert(signalsTable).values({
      id: signal.id,
      title: signal.title,
      code: signal.code,
      format: signal.format,
      publicId: signal.public_id,
      url: signal.url,
      height: signal.height,
      width: signal.width,
      categoryId: signalCategoriesToInsert.find((cat) => cat.name === signal.category)?.id || 1,
      description: signal.description,
      createdAt: new Date(signal.created_at),
      updatedAt: new Date(signal.updated_at),
    })
  })

  /*
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
  */

  /*
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
*/
  await db.batch(stmtsSignals)
  return {
    signalCategories: insertedSignalCategories.meta.changes,
    signals: insertedSignalCategories.meta.changes,
    // productCategories: insertedProductCategories.meta.changes,
    // products: await db.select({ count: count() }).from(productsTable),
    // customers: await db.select({ count: count() }).from(customersTable),
    // quotations: await db.select({ count: count() }).from(quotationsTable),
    // agencies: await db.select({ count: count() }).from(agenciesTable),
    // labels: await db.select({ count: count() }).from(labelsTable),
    // watermarks: await db.select({ count: count() }).from(watermarksTable),
  }
}
