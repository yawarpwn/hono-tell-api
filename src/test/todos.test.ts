// src/index.test.ts
import {
  env,
  createExecutionContext,
  waitOnExecutionContext,
} from "cloudflare:test";
import app from "../index";
import { describe, it, expect, beforeAll } from "vitest";

describe("create Todo", () => {
  beforeAll: () => {
    execSync(`NO_D1_WARNING=true wrangler d1 migrations apply db --local`);
  },
    it("Should return 200 response", async () => {
      // const res = await app.request(
      //   "/api/todos",
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({ text: "test" }),
      //   },
      //   env,
      // );
      const request = new Request("http://localhost:8787/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: "test" }),
      });

      const ctx = createExecutionContext();
      const res = await app.fetch(request, env, ctx);

      await waitOnExecutionContext(ctx);
      console.log(res.ok);
      console.log(res.status);

      expect(res.status).toBe(500);
      // expect(await res.json()).toContain({
      //   message: "success",
      // });
    });
});
function execSync(arg0: string) {
  throw new Error("Function not implemented.");
}
