import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { drizzle } from "drizzle-orm/d1";
import * as schemas from "./db/schemas";
import type { App } from "./types";
import { todoRoute } from "./routes/todo";
import { basicAuth } from "hono/basic-auth";

const app = new Hono<App>();

app.use("*", cors());
app.use("*", prettyJSON());

//DatabaseMiddleware
app.use("/api/*", async (c, next) => {
  const db = drizzle(c.env.DB_TELL, { schema: schemas });
  c.set("db", db);
  await next();
});

//JWTMiddleware
// app.use("/api/*", (c, next) => {
//   const jwtMiddleware = jwt({ secret: c.env.JWT_SECRET });
//   return jwtMiddleware(c, next);
// });

app.get("/api/auth", async (c) => {
  console.log("in /api/auth success");
  const db = c.get("db");
  await db.insert(schemas.usersTable).values({
    email: "neyda@uii.com",
    password: "123456",
  });
  const result = await db.select().from(schemas.usersTable).all();
  console.log(result);

  return c.json(result);
});

app.route("/api/todos", todoRoute);

app.notFound((c) => c.json({ message: "not found", ok: false }, 404));

export default app;
