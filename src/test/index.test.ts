// src/index.test.ts
import { env } from "cloudflare:test";
import app from "./index";
import { describe, it, expect } from "vitest";

describe("index", () => {
  it("Should return 200 response", async () => {
    const res = await app.request("/", {}, env);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      message: "success",
    });
  });
});

describe("not found", () => {
  it("should return 404 response", async () => {
    const res = await app.request("/lzuu");

    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ message: "not found", ok: false });
  });
});
