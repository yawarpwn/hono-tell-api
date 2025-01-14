import type { DB, InsertCustomer, InsertQuotation } from '@/types'
import { usersTable, customersTable, quotationsTable } from '@/db/schemas'
import { usersData } from '@/db/dataset'
import bcryp from 'bcryptjs'
import { faker } from '@faker-js/faker'

export async function seed(db: DB) {
  await db.delete(usersTable)
  await db.delete(customersTable)
  await db.delete(quotationsTable)

  const mappedUsers = usersData.map((user) => ({
    ...user,
    password: bcryp.hashSync(user.password, 10),
  }))

  const company: InsertCustomer = {
    id: faker.string.uuid(),
    ruc: faker.string.numeric({ length: 11 }),
    isRegular: faker.datatype.boolean(),
    name: faker.company.name(),
    phone: faker.phone.number(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.soon(),
  }

  const quotation: InsertQuotation = {
    id: faker.string.uuid(),
    number: faker.number.int({ max: 8000 }),
    deadline: faker.number.int(15),
    credit: faker.number.int(30),
    includeIgv: faker.datatype.boolean(),
    customerId: company.id,
    isPaymentPending: faker.datatype.boolean(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.soon(),
  }
  const fakeCustomers: InsertCustomer[] = Array.from({ length: 10 }).map(() => ({
    id: faker.string.uuid(),
    ruc: faker.string.numeric({ length: 11 }),
    isRegular: faker.datatype.boolean(),
    name: faker.company.name(),
    phone: faker.phone.number({ style: 'national' }),
    createAt: faker.date.past(),
    updatedAt: faker.date.soon(),
  }))

  const fakeQuotations: InsertQuotation[] = Array.from({ length: 10 }).map(() => ({
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
      description: faker.commerce.productDescription(),
      code: faker.commerce.product(),
      unitSize: 'und',
      price: faker.commerce.price(),
      cost: faker.commerce.price(),
      link: faker.internet.url(),
    })),
  }))

  const insertedUsers = await db.insert(usersTable).values(mappedUsers)
  const insertedCustomers = await db.insert(customersTable).values(fakeCustomers)
  const insertedQuotations = await db.insert(quotationsTable).values(fakeQuotations)

  // const quos = await db.select().from(quotationsTable)

  // console.log('data seeded')
  // console.log(quos)
  return {
    customers: insertedCustomers.meta.changes,
    quotations: insertedQuotations.meta.changes,
    users: insertedUsers.meta.changes,
  }
  // console.log(insertedUsers.meta.changes)
}
