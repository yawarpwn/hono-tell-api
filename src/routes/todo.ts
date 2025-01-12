import { Hono } from "hono";
import type { App } from "@/types";
import { TodoService } from "@/services";
import { validator } from "hono/validator";

export const todoRoute = new Hono<App>();

todoRoute.get("/", async (c) => {
  const db = c.get("db");
  const todos = await TodoService.getAll(db);
  return c.json(todos);
});

todoRoute.get("/:id", async (c) => {
  const db = c.get("db");
  const id = c.req.param("id");
  const results = await TodoService.getById(db, +id);
  return c.json(results);
});

// todoRoute.put("/:id", async (c) => {
//   const db = c.get("db");
//   const id = c.req.param("id");
//   const dto = c.req.valid("json");
//   const results = await TodoService.update(db, +id, dto);
//   return c.json(results);
// });

todoRoute.post(
  "/",
  validator("json", (value, c) => {
    const body = value["body"];

    if (!body || body !== typeof "string") {
      return c.json({ ok: false, message: "Invalid" });
    }

    return body;
  }),
  async (c) => {
    const db = c.get("db");
    const dto = await c.req.valid("json");
    const result = await TodoService.create(db, dto);
    console.log({ result });
    return c.json({ ok: true, data: result });
  },
);

todoRoute.delete("/:id", async (c) => {
  const db = c.get("db");
  const id = c.req.param("id");
  const results = await TodoService.delete(db, +id);
  return c.json(results);
});
