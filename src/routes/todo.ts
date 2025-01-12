import { Hono } from "hono";
import type { App } from "@/types";
import { TodoService } from "@/services";
import { validator } from "hono/validator";
import { STATUS_CODE } from "@/constants";

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

todoRoute.put("/:id", async (c) => {
  const db = c.get("db");
  const id = c.req.param("id");
  const results = await TodoService.delete(db, +id);
  return c.json(results);
});

todoRoute.post(
  "/",
  validator("json", (body, c) => {
    if (!body) {
      return c.json({ ok: false, message: "Invalid" });
    }

    return body;
  }),
  async (c) => {
    const db = c.get("db");
    const dto = await c.req.valid("json");
    const result = await TodoService.create(db, dto);
    return c.json({ ok: true, data: result }, STATUS_CODE.Created);
  },
);

todoRoute.delete("/:id", async (c) => {
  const db = c.get("db");
  const id = c.req.param("id");
  const results = await TodoService.delete(db, +id);
  return c.json(results);
});
