import type { DB, InsertCustomer, InsertQuotation } from '@/types'
import { usersTable, customersTable, quotationsTable, productCategoriesTable, productsTable } from '@/db/schemas'
import { count } from 'drizzle-orm'
import customers from '../../muckup/customers.json'

export async function seedCustomers(db: DB, postgresUrl: string) {
  await db.delete(customersTable)

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

  await db.batch(stmts)

  //seed quotations

  return {
    customers: await db.select({ count: count() }).from(customersTable),
  }
  // console.log(insertedUsers.meta.changes)
}
