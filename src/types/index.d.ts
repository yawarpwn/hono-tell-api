import * as schemas from "../db/schemas";

import type { DrizzleD1Database } from "drizzle-orm/d1";

export type DB = DrizzleD1Database<typeof schema>;

type Bindings = {
  PASSWORD: string;
  JWT_SECRET: string;
  DB_TELL: D1Database;
};

type Variables = {
  mam: number;
  db: DB;
};

type App = {
  Bindings: Bindings;
  Variables: Variables;
};
