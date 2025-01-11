import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", {
  id: int().primaryKey({ autoIncrement: true }),
  email: text().notNull().unique(),
  password: text().notNull(),
});

export const todosTable = sqliteTable("todo", {
  id: int({ mode: "number" }).primaryKey({ autoIncrement: true }),
  complete: int({ mode: "boolean" }).default(false),
  text: text().notNull(),
  createAt: text().default(sql`(CURRENT_DATE)`),
});
