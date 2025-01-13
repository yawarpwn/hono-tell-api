import * as schemas from "./db/schemas/index";
import { drizzle } from "drizzle-orm/d1";
import * as wrangler from "wrangler";

async function main() {
  const worker = await wrangler.unstable_dev("src/index.ts", {
    experimental: {
      disableExperimentalWarning: true,
    },
  });
  console.log(worker);
  // console.log(schemas);
  // drizzle(schemas);
}
main();
