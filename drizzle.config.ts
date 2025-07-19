import 'dotenv/config'
import type { Config } from 'drizzle-kit'

export default {
  schema: './src/core/db/schemas.ts',
  out: './migrations',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: '8822126d2aafa667c35b5849162bbb3b',

    // @ts-expect-error - no use node
    databaseId: process.env.CLOUDFLARE_DATABASE_ID,
    // @ts-expect-error - no use node
    token: process.env.CLOUDFLARE_D1_TOKEN,
  },
} satisfies Config
