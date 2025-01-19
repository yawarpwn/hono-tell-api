import type { ItemQuotation, ProductCategory } from '@/types'
import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text, real, blob } from 'drizzle-orm/sqlite-core'
import { productCategories } from '@/constants'

const userRoles = ['admin', 'user'] as const
export const usersTable = sqliteTable('users', {
  id: integer().primaryKey({ autoIncrement: true }),
  email: text().notNull().unique(),
  password: text().notNull(),
  role: text({ enum: userRoles }).notNull().default('user'),
})

export const customersTable = sqliteTable('customers', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull().unique(),
  ruc: text('ruc').notNull().unique(),
  phone: text('phone'),
  address: text('address'),
  email: text('email').unique(),
  isRegular: integer('is_regular', { mode: 'boolean' }).default(false),
  createdAt: integer('create_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$onUpdate(() => new Date()),
})

export const quotationsTable = sqliteTable('quotations', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  number: integer('number').notNull().unique(),
  deadline: integer('deadline').notNull(),
  credit: integer('credit'),
  includeIgv: integer('include_igv', { mode: 'boolean' }).default(false),
  customerId: text('customer_id').references(() => customersTable.id, {
    onDelete: 'set null',
    onUpdate: 'no action',
  }),
  isPaymentPending: integer('is_payment_pending', { mode: 'boolean' }).default(false),
  items: text('items', { mode: 'json' }).$type<ItemQuotation[]>().notNull(),
  createdAt: integer('create_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$onUpdate(() => new Date()),
})

export const productsTable = sqliteTable('products', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  description: text('description').notNull(),
  code: text('code').unique().notNull(),
  unitSize: text('unit_size').notNull(),
  categoryId: integer('category_id')
    .references(() => productCategoriesTable.id)
    .notNull(),
  link: text('link'),
  rank: real('rank').default(0).notNull(),
  price: real('price').notNull(), //must be 1, 2,  0.5, 5.5
  cost: real('cost').notNull(), //must be 1, 2, 0.5. 55
  createdAt: integer('create_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$onUpdate(() => new Date()),
})

// const userRoles = ['admin', 'user'] as const

export const productCategoriesTable = sqliteTable('product_categories', {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text({ enum: productCategories }).notNull(),
  createdAt: integer('create_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
})
