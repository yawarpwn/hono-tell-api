import * as schemas from './db/schemas/index'
import { Miniflare } from 'miniflare'
import { drizzle } from 'drizzle-orm/d1'
import * as wrangler from 'wrangler'
import { faker } from '@faker-js/faker'
import type { InsertCustomer, InsertQuotation } from './types'

async function main() {
  // const company: InsertCustomer = {
  //   id: faker.string.uuid(),
  //   ruc: faker.string.numeric({ length: 11 }),
  //   isRegular: faker.datatype.boolean(),
  //   name: faker.company.name(),
  //   phone: faker.phone.number(),
  //   createAt: faker.date.past(),
  //   updatedAt: faker.date.soon(),
  // }
  //
  // const quotation: InsertQuotation = {
  //   id: faker.string.uuid(),
  //   number: faker.number.int({ max: 8000 }),
  //   deadline: faker.number.int(15),
  //   credit: faker.number.int(30),
  //   includeIgv: faker.datatype.boolean(),
  //   customerId: company.id,
  //   isPaymentPending: faker.datatype.boolean(),
  //   createAt: faker.date.past(),
  //   updatedAt: faker.date.soon(),
  // }

  const fakeProducts = Array.from({ length: 10 }).map((_, index) => ({
    description: faker.commerce.productDescription(),
    code: 'Fhp40-' + index,
    unitSize: 'und',
    categoryId: 10,
    price: Number(faker.commerce.price()),
    cost: Number(faker.commerce.price()),
    link: faker.internet.url(),
  }))
  console.log(fakeProducts)
}

main()
