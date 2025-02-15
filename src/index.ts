import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { prettyJSON } from 'hono/pretty-json'
import { drizzle } from 'drizzle-orm/d1'
import { customersRoute, quotationsRoute, productsRoute, authRoute, agenciesRoute, labelsRoute } from './routes'
import type { App } from './types'
import { seedProducts } from './utils/seed-products'
import { seedCustomers } from './utils/seed-customers'
import { seedAgencies } from './utils/seed-agencies'
import { seed } from './utils/seed'
import { seedQuotations } from './utils/seed-quotations'
import { productCategoriesRoute } from './routes/product-categories'

const app = new Hono<App>()

/**------- Middlewares----- */
app.use(
  '*',
  cors({
    credentials: true,
    origin: 'http://localhost:5173',
  }),
)
app.use('*', prettyJSON())

// Add X-Response-Time header
app.use('*', async (c, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  c.header('X-Response-Time', `${ms}ms`)
})

app.use('*', async (c, next) => {
  console.log(`${c.req.method}:${c.req.url}`)
  await next()
  console.log(`${c.res.statusText}`)
})

//DatabaseMiddleware
app.use('/api/*', async (c, next) => {
  const db = drizzle(c.env.DB)
  c.set('db', db)
  // await seed(db);
  await next()
})

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
app.route('/api/product-categories', productCategoriesRoute)
app.route('/api/agencies', agenciesRoute)
app.route('/api/labels', labelsRoute)

//seed
app.route('/api/auth', authRoute)
app.get('/api/seed-customers', async (c) => {
  return c.json(await seedCustomers(c.get('db'), c.env.POSTGRES_URL))
})
app.get('/api/seed-products', async (c) => {
  return c.json(await seedProducts(c.get('db'), c))
})
app.get('/api/seed-agencies', async (c) => {
  return c.json(await seedAgencies(c.get('db'), c.env.POSTGRES_URL))
})
app.get('/api/seed-quotations', async (c) => {
  return c.json(await seedQuotations(c.get('db'), c.env.POSTGRES_URL))
})
app.get('/api/seed', async (c) => {
  return c.json(await seed(c.get('db')))
})

// nustom Not Found Message
app.notFound((c) =>
  c.json(
    {
      message: 'ENOENT: Endpoint Not Found',
      ok: false,
      statusCode: 404,
    },
    404,
  ),
)

// Error handling
// app.onError((err, c) => {
//   console.log(`${err}`);
//   return c.text("custom erorr ", 500);
// });

export default app
