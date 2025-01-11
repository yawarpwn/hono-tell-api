import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { basicAuth } from "hono/basic-auth";

type Bindings = {
  PASSWORD: string;
  JWT_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings }>();

//private paths
app.use("/api/*", (c, next) => {
  const jwtMiddleware = jwt({ secret: c.env.JWT_SECRET });
  return jwtMiddleware(c, next);
});

app.get("/api", (c) => c.text("star api"));

app.notFound((c) => c.json({ message: "not found", ok: false }, 404));

export default app;
