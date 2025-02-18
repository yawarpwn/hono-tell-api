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

export async function seed(db: DB, c: Context) {
  await db.delete(productsTable)
  await db.delete(productCategoriesTable)
  await db.delete(usersTable)
  await db.delete(customersTable)
  await db.delete(quotationsTable)
  await db.delete(labelsTable)
  await db.delete(agenciesTable)
  await db.delete(watermarksTable)

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

  //seed Products Categories
  const categoriesToInsert = productCategories.map((category, index) => ({
    id: index + 1,
    name: category,
  }))

  const insertedProductCategories = await db.insert(productCategoriesTable).values(categoriesToInsert)

  //seed Products
  const stmtsProducts = products.map((prod) => {
    return db.insert(productsTable).values({
      id: prod.id,
      description: prod.description,
      code: prod.code,
      unitSize: prod.unit_size,
      categoryId: PRODUCTS_CATEGORIES[prod.category],
      link: prod.link,
      rank: prod.rank,
      price: prod.price,
      cost: prod.cost,
      createdAt: new Date(prod.created_at),
      updatedAt: new Date(prod.updated_at),
    })
  })
  //Seed customers
  const stmts = customers.map((customer) => {
    return db.insert(customersTable).values({
      id: customer.id,
      name: customer.name,
      ruc: customer.ruc,
      email: customer.email,
      address: customer.address,
      phone: customer.phone,
      isRegular: customer.is_regular,
      createdAt: new Date(customer.created_at),
      updatedAt: new Date(customer.updated_at),
    })
  })

  const stmtsQuotations = quotations.map((quotation) => {
    return db.insert(quotationsTable).values({
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
  })

  //seed agencies
  const stmtsAgencies = agencies.map((agency) => {
    return db.insert(agenciesTable).values({
      id: agency.id,
      name: agency.name,
      ruc: agency.ruc,
      phone: agency.phone,
      address: agency.address,
      createdAt: new Date(agency.created_at),
      updatedAt: new Date(agency.updated_at),
    })
  })

  //seed labels
  const stmtsLabels = labels.map((label) => {
    return db.insert(labelsTable).values({
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
  })

  const stmtsWatermarks = watermarks.map((watermark) => {
    return db.insert(watermarksTable).values({
      id: watermark.id,
      format: watermark.format,
      height: watermark.height,
      width: watermark.width,
      publicId: watermark.public_id,
      url: watermark.url,
      createdAt: new Date(watermark.created_at),
      updatedAt: new Date(watermark.updated_at),
    })
  })

  //@ts-ignore
  await db.batch([...stmtsProducts, ...stmtsWatermarks])
  //@ts-ignore
  await db.batch(stmts)
  //@ts-ignore
  await db.batch(stmtsQuotations)
  //@ts-ignore
  await db.batch(stmtsAgencies)
  //@ts-ignore
  await db.batch(stmtsLabels)

  return {
    users: insertedUsers.meta.changes,
    productCategories: insertedProductCategories.meta.changes,
    products: await db.select({ count: count() }).from(productsTable),
    customers: await db.select({ count: count() }).from(customersTable),
    quotations: await db.select({ count: count() }).from(quotationsTable),
    agencies: await db.select({ count: count() }).from(agenciesTable),
    labels: await db.select({ count: count() }).from(labelsTable),
    watermarks: await db.select({ count: count() }).from(watermarksTable),
  }

  // console.log(insertedUsers.meta.changes)
}
