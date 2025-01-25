import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { prettyJSON } from 'hono/pretty-json'
import { drizzle } from 'drizzle-orm/d1'
import { customersRoute, quotationsRoute, productsRoute } from './routes'
import { seed } from './utils/seed'
import type { App } from './types'

const app = new Hono<App>()

/**------- Middlewares----- */
app.use(
  '*',
  cors({
    origin: ['https://app.tellsenales.workers.dev'], // Dominio de tu app Remix
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
)
app.use('*', prettyJSON())
app.use('*', async (c, next) => {
  console.log(c.req.method, c.req.url, c.req.header('User-Agent'))
  console.log('HEADERS:', c.req.raw.headers)
  await next()
  console.log(`[${c.req.method}] ${c.req.url} - ${c.res.status}`)
})

// Add X-Response-Time header
app.use('*', async (c, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  c.header('X-Response-Time', `${ms}ms`)
})

//DatabaseMiddleware
app.use('/api/*', async (c, next) => {
  const db = drizzle(c.env.TELLAPP_DB)
  c.set('db', db)
  // await seed(db);
  await next()
})

//Auth Middleware
// app.use(
//   '/api/*',
//   basicAuth({
//     verifyUser(username, password, c) {
//       return username === c.env.USERNAME && password === c.env.PASSWORD
//     },
//   }),
// )

//JWTMiddleware
// app.use("/api/*", (c, next) => {
//   const jwtMiddleware = jwt({ secret: c.env.JWT_SECRET });
//   return jwtMiddleware(c, next);
// });

/**-------Routes----- */

app.get('/', async (c) => {
  return c.json({ message: 'success' })
})

app.route('/api/customers', customersRoute)
app.route('/api/quotations', quotationsRoute)
app.route('/api/products', productsRoute)

app.get('/api/seed', async (c) => {
  const db = c.get('db')
  const info = await seed(db)
  return c.json(info)
})

app.get('/api/test', async (c) => {
  return c.json({ message: 'TESTAPI: success' })
})

// nustom Not Found Message
app.notFound((c) => c.json({ message: 'not found', ok: false }, 404))

// Error handling
// app.onError((err, c) => {
//   console.log(`${err}`);
//   return c.text("custom erorr ", 500);
// });

export default {
  fetch: app.fetch,
  sum: (a: number, b: number) => a + b,
}
