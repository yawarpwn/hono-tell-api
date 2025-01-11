import { usersTable, todosTable } from "@/db/schemas";
import { HTTPException } from "hono/http-exception";
import type { CreateTodoDto } from "@/dtos";
import type { DB } from "@/types";

export class TodoService {
  static async getAll(db: DB) {
    const todos = await db.select().from(todosTable);
    return todos;
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
}
