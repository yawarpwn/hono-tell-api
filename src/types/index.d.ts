import * as schemas from "../db/schemas";

import type { DrizzleD1Database } from "drizzle-orm/d1";

type Bindings = {
  PASSWORD: string;
  JWT_SECRET: string;
  DB_TELL: D1Database;
};

type Variables = {
  mam: number;
  db: DrizzleD1Database<typeof schema>;
};

type App = {
  Bindings: Bindings;
  Variables: Variables;
};
