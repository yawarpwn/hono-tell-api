import { drizzle } from "drizzle-orm/d1";
import * as schema from "./db/schemas";

export interface Env {
  DB_TELL: D1Database;
}

export default {
  async fetch(request: Request, env: Env) {
    const db = drizzle(env.DB_TELL, { schema });
    try {
    } catch (error) {}
    const result = await db.select().from(schema.usersTable).all();
    return Response.json({ mee: "meee" });
  },
};
