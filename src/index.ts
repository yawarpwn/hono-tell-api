import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { drizzle } from "drizzle-orm/d1";
import * as schemas from "./db/schemas";
import type { App } from "./types";
import { todoRoute } from "./routes/todo";
// import { seed } from "./utils/seed";
import { basicAuth } from "hono/basic-auth";

const app = new Hono<App>();

app.use("*", cors());
app.use("*", prettyJSON());

//DatabaseMiddleware
app.use("/api/*", async (c, next) => {
  const db = drizzle(c.env.TELLAPP_DB, { schema: schemas });
  c.set("db", db);
  // await seed(db);
  await next();
});

app.get("/", async (c) => {
  return c.json({ message: "success" });
});

//JWTMiddleware
// app.use("/api/*", (c, next) => {
//   const jwtMiddleware = jwt({ secret: c.env.JWT_SECRET });
//   return jwtMiddleware(c, next);
// });

app.route("/api/todos", todoRoute);

app.notFound((c) => c.json({ message: "not found", ok: false }, 404));

export default app;
