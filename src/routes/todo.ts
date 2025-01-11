import { Hono } from "hono";
import type { App } from "@/types";
import { TodoService } from "@/services";

export const todoRoute = new Hono<App>();

todoRoute.get("/", async (c) => {
  const db = c.get("db");
  const todos = await TodoService.getAll(db);
  return c.json(todos);
});

todoRoute.post("/", async (c) => {
  const db = c.get("db");
  const dto = await c.req.json();
  const result = TodoService.create(db, dto);
  return c.json(result);
});
