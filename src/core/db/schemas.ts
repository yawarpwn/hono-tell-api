import type { ItemQuotation } from '@/types'
import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text, real } from 'drizzle-orm/sqlite-core'
import { productCategories, signalCategories, galleryCategories } from '@/core/constants'

const userRoles = ['admin', 'user'] as const
export const usersTable = sqliteTable('users', {
  id: text()
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
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
  isRegular: integer('is_regular', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$onUpdate(() => new Date()),
})

export const agenciesTable = sqliteTable('agencies', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull().unique(),
  ruc: text('ruc').notNull().unique(),
  phone: text('phone'),
  address: text('address'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$onUpdate(() => new Date()),
})

export const labelsTable = sqliteTable('labels', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  recipient: text('recipient').notNull(),
  destination: text('destination').notNull(),
  dniRuc: text('dni_ruc').notNull(),
  phone: text('phone'),
  address: text('address'),
  observations: text('observations'),
  agencyId: text('agency_id').references(() => agenciesTable.id, {
    onDelete: 'set null',
    onUpdate: 'no action',
  }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$onUpdate(() => new Date()),
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
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$onUpdate(() => new Date()),
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
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$onUpdate(() => new Date()),
})

export const productCategoriesTable = sqliteTable('product_categories', {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text({ enum: productCategories }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
})

export const watermarksTable = sqliteTable('watermarks', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  width: integer('width').notNull(),
  height: integer('height').notNull(),
  url: text('url').notNull(),
  publicId: text('public_id').notNull(),
  format: text('format').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$onUpdate(() => new Date()),
})

export const subscribersTable = sqliteTable('subscribers', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
})

export const signalCategoriesTable = sqliteTable('signal_category', {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text({ enum: signalCategories }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
})

export const signalsTable = sqliteTable('signals', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  code: text('code').notNull(),
  width: integer('width').notNull(),
  height: integer('height').notNull(),
  url: text('url').notNull(),
  publicId: text('public_id').notNull(),
  categoryId: integer('category_id')
    .references(() => signalCategoriesTable.id)
    .notNull(),
  description: text('description'),
  format: text('format').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$onUpdate(() => new Date()),
})

export const galleryCategoriesTable = sqliteTable('gallery_category', {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text({ enum: galleryCategories }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
})

export const galleryTable = sqliteTable('gallery', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  width: integer('width').notNull(),
  height: integer('height').notNull(),
  url: text('url').notNull(),
  publicId: text('public_id').notNull(),
  categoryId: integer('category_id')
    .references(() => galleryCategoriesTable.id)
    .notNull(),
  format: text('format').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$onUpdate(() => new Date()),
})
