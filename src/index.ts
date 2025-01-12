import { Hono } from "hono";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { drizzle } from "drizzle-orm/d1";
import * as schemas from "./db/schemas";
import type { App } from "./types";
import { todoRoute } from "./routes/todo";
// import { seed } from "./utils/seed";
import { basicAuth } from "hono/basic-auth";

const app = new Hono<App>();

/**------- Middlewares----- */
app.use("*", cors());
app.use("*", prettyJSON());

// Add X-Response-Time header
app.use("*", async (c, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  c.header("X-Response-Time", `${ms}ms`);
});

//DatabaseMiddleware
app.use("/api/*", async (c, next) => {
  const db = drizzle(c.env.TELLAPP_DB, { schema: schemas });
  c.set("db", db);
  // await seed(db);
  await next();
});

//Auth Middleware
app.use(
  "/api/*",
  basicAuth({
    verifyUser(username, password, c) {
      return username === c.env.USERNAME && password === c.env.PASSWORD;
    },
  }),
);

//JWTMiddleware
// app.use("/api/*", (c, next) => {
//   const jwtMiddleware = jwt({ secret: c.env.JWT_SECRET });
//   return jwtMiddleware(c, next);
// });

/**-------Routes----- */

app.get("/", async (c) => {
  return c.json({ message: "success" });
});

app.route("/api/todos", todoRoute);

// Custom Not Found Message
app.notFound((c) => c.json({ message: "not found", ok: false }, 404));

// Error handling
// app.onError((err, c) => {
//   console.log(`${err}`);
//   return c.text("custom erorr ", 500);
// });

export default app;
