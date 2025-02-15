import type { DB, InsertCustomer, InsertQuotation } from '@/types'
import { usersTable, customersTable, quotationsTable, productCategoriesTable, productsTable } from '@/db/schemas'
import { count } from 'drizzle-orm'
import quotations from '../../muckup/quotations.json'

export async function seedQuotations(db: DB, postgresUrl: string) {
  await db.delete(quotationsTable)
  // {
  //    id: '92f9740e-5f0c-489c-a662-f5efaf2fd193',
  //    number: 5406,
  //    deadline: 2,
  //    credit: null,
  //    include_igv: true,
  //    customer_id: 'd8461a39-0fec-4d24-b20e-519e54ef332d',
  //    items: '[{"id":"e12d244b-1728-4956-af7d-e0a1d0a88290","qty":1,"cost":100,"price":"165","unit_size":"und","description":"Juego de Plantilla 25cm de alto - Alfabeto en aluminio [ A - Z]"},{"id":"dded9d4c-477e-4cee-8fb9-a2e0fe0f4f84","qty":1,"cost":60,"price":"95","unit_size":"und","description":"Juego de Plantilla 25cm de alto - Números en aluminio [ 0 - 9 ] "},{"id":"b6b4517c-47d3-48ea-b842-dfa9c30e05c8","qty":1,"cost":20,"price":50,"unit_size":"und","description":"Juego de Plantilla  5cm de alto -  Números en aluminio  [ 0 - 9 ] "},{"id":"53c13c9a-32dc-46c1-a2c4-2479072f57e5","qty":1,"cost":20,"price":80,"unit_size":"und","description":"Juego de Plantilla  5cm de alto - alfabeto en aluminio  [ A - z] "}]',
  //    created_at: 2024-05-23T21:44:31.495Z,
  //    updated_at: 2024-05-23T22:01:34.229Z,
  //    is_payment_pending: false
  //  },
  const stmts = quotations.map((quotation) => {
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

  await db.batch(stmts)

  return {
    customers: await db.select({ count: count() }).from(quotationsTable),
  }
  // console.log(insertedUsers.meta.changes)
}
