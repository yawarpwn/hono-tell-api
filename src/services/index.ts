import { eq, and, type SQL } from "drizzle-orm";
import { usersTable, todosTable } from "@/db/schemas";
import { HTTPException } from "hono/http-exception";
import type { CreateTodoDto, UpdateTodoDto } from "@/dtos";
import type { DB } from "@/types";

export class TodoService {
  static async getAll(db: DB) {
    const todos = await db.select().from(todosTable);
    return todos;
  }

  static async getById(db: DB, id: number) {
    // const todo = await db.query.todos.findMany();
    const todos = await db
      .select()
      .from(todosTable)
      .where(eq(todosTable.id, id));
    if (todos.length === 0) {
      throw new HTTPException(400, { message: `todo with id ${id} not found` });
    }
    return todos[0];
  }

  static async create(db: DB, dto: CreateTodoDto) {
    const results = await db
      .insert(todosTable)
      .values({ ...dto })
      .returning({ insertedId: todosTable.id });

    if (results.length === 0) {
      throw new HTTPException(400, { message: "Failed to create todo" });
    }

    const [todo] = results;
    return todo;
  }

  static async update(db: DB, id: number, dto: UpdateTodoDto) {
    const results = await db
      .update(todosTable)
      .set(dto)
      .where(eq(todosTable.id, id))
      .returning();

    if (results.length === 0) {
      throw new HTTPException(400, { message: `todo with id ${id} not found` });
    }

    return results[0];
  }

  static async delete(db: DB, id: number) {
    const results = await db
      .delete(todosTable)
      .where(eq(todosTable.id, id))
      .returning();

    if (results.length === 0) {
      throw new HTTPException(400, { message: `todo with id ${id} not found` });
    }
    return results[0];
  }
}
