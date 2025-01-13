import { sql, relations } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

const userRoles = ['admin', 'user'] as const
export const usersTable = sqliteTable('users', {
  id: integer().primaryKey({ autoIncrement: true }),
  email: text().notNull().unique(),
  password: text().notNull(),
  role: text({ enum: userRoles }).notNull().default('user'),
})

const InserUser = usersTable.$inferInsert
const InsertUserResult = usersTable.$inferSelect

export const todosTable = sqliteTable('todos', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  complete: integer({ mode: 'boolean' }).default(false),
  text: text().notNull(),
  createAt: integer('create_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
})

export const customersTable = sqliteTable('customers', {
  id: text('id').primaryKey().notNull(),
  name: text('name').notNull().unique(),
  ruc: text('ruc').notNull().unique(),
  phone: text('phone'),
  address: text('address'),
  email: text('email').unique(),
  isRegular: integer('is_regular', { mode: 'boolean' })
    .notNull()
    .default(false),
  createAt: integer('create_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
})

export const quotationsTable = sqliteTable('quotations', {
  id: text('id').primaryKey().notNull(),
  number: integer('number').notNull().unique(),
  deadline: integer('deadline').notNull(),
  credit: integer('credit'),
  includeIgv: integer('include_igv', { mode: 'boolean' })
    .default(false)
    .notNull(),
  customerId: text('customer_id').references(() => customersTable.id, {
    onDelete: 'set null',
    onUpdate: 'no action',
  }),
  isPaymentPending: integer('is_payment_pending', { mode: 'boolean' })
    .default(false)
    .notNull(),
  // items: text('items').$type<QuotationItem[]>().notNull(),
  createAt: integer('create_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
})
