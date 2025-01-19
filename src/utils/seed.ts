import type { DB, InsertCustomer, InsertQuotation } from '@/types'
import { usersTable, customersTable, quotationsTable, productCategoriesTable, productsTable } from '@/db/schemas'
import { usersData } from '@/db/dataset'
import { productCategories } from '@/constants'
import bcryp from 'bcryptjs'
import { faker } from '@faker-js/faker'

export async function seed(db: DB) {
  await db.delete(usersTable)
  await db.delete(customersTable)
  await db.delete(quotationsTable)
  await db.delete(productsTable)
  await db.delete(productCategoriesTable)

  const mappedUsers = usersData.map((user) => ({
    ...user,
    password: bcryp.hashSync(user.password, 10),
  }))

  const fakeCustomers: InsertCustomer[] = Array.from({ length: 10 }).map(() => ({
    id: faker.string.uuid(),
    ruc: faker.string.numeric({ length: 11 }),
    isRegular: faker.datatype.boolean(),
    name: faker.company.name(),
    createAt: faker.date.past(),
    updatedAt: faker.date.soon(),
  }))

  const fakeQuotations = Array.from({ length: 10 }).map(() => ({
    id: faker.string.uuid(),
    number: faker.number.int(8000),
    deadline: faker.number.int(15),
    credit: faker.number.int(30),
    includeIgv: faker.datatype.boolean(),
    customerId: fakeCustomers[Math.floor(Math.random() * fakeCustomers.length)].id,
    isPaymentPending: faker.datatype.boolean(),
    createAt: faker.date.past(),
    updatedAt: faker.date.soon(),
    items: Array.from({ length: 3 }).map(() => ({
      id: crypto.randomUUID(),
      description: faker.commerce.productDescription(),
      price: Number(faker.commerce.price()),
      cost: Number(faker.commerce.price()),
      link: faker.internet.url(),
      qty: 10,
      code: 'FHP50x50',
      unitSize: 'und',
    })),
  }))

  const categoriesToInsert = productCategories.map((category, index) => ({
    id: index + 1,
    name: category,
  }))

  const fakeProducts = Array.from({ length: 20 }).map(() => ({
    description: faker.commerce.productDescription(),
    code: faker.commerce.product(),
    unitSize: 'und',
    categoryId: categoriesToInsert[Math.floor(Math.random() * categoriesToInsert.length + 1)].id,
    price: Number(faker.commerce.price()),
    cost: Number(faker.commerce.price()),
    link: faker.internet.url(),
  }))

  const insertedUsers = await db.insert(usersTable).values(mappedUsers)
  const insertedCustomers = await db.insert(customersTable).values(fakeCustomers)
  const insertedQuotations = await db.insert(quotationsTable).values(fakeQuotations)
  const insertedProductCategories = await db.insert(productCategoriesTable).values(categoriesToInsert)
  const insertedProducts = await db.insert(productsTable).values(fakeProducts)

  // const quos = await db.select().from(quotationsTable)

  return {
    customers: insertedCustomers.meta.changes,
    quotations: insertedQuotations.meta.changes,
    productCategories: insertedProductCategories.meta.changes,
    products: insertedProducts.meta.changes,
    users: insertedUsers.meta.changes,
  }
  // console.log(insertedUsers.meta.changes)
}
