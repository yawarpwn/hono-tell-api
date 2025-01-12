import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { drizzle } from "drizzle-orm/d1";
import * as schemas from "./db/schemas";
import type { App } from "./types";
import { todoRoute } from "./routes/todo";
import { seed } from "./utils/seed";
import { basicAuth } from "hono/basic-auth";

const app = new Hono<App>();

app.use("*", cors());
app.use("*", prettyJSON());

//DatabaseMiddleware
app.use("/api/*", async (c, next) => {
  const db = drizzle(c.env.DB_TELL, { schema: schemas });
  c.set("db", db);
  await seed(db);
  await next();
});

//JWTMiddleware
// app.use("/api/*", (c, next) => {
//   const jwtMiddleware = jwt({ secret: c.env.JWT_SECRET });
//   return jwtMiddleware(c, next);
// });

app.get("/api/auth", async (c) => {
  return c.json({ ok: true, message: "success" });
});

app.get("/api/users", async (c) => {
  const db = c.get("db");
  const users = await db.select().from(schemas.usersTable);
  return c.json(users);
});

app.route("/api/todos", todoRoute);

app.notFound((c) => c.json({ message: "not found", ok: false }, 404));

export default app;
