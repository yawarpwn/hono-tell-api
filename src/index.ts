import { Hono } from 'hono'
import type { App } from './types'
import { cors } from 'hono/cors'
import { prettyJSON } from 'hono/pretty-json'
import { drizzle } from 'drizzle-orm/d1'

// Routes import
import gallery from '@/modules/gallery/gallery.route'
import customers from '@/modules/customers/customers.route'
import quotations from '@/modules/quotations/quotations.route'
import products from '@/modules/products/products.route'
import productCategories from '@/modules/product-categories/product-categories.route'
import labels from '@/modules/labels/labels.route'
import agencies from '@/modules/agencies/agencies.route'
import watermarks from '@/modules/watermarks/watermarks.route'
import auth from '@/modules/auth/auth.route'
import signals from '@/modules/signals/signals.route'
import signalCategories from '@/modules/signal-categories/signal-categories.route'

import sendMail from '@/modules/send-mail/send-mail.route'
import suscribe from '@/modules/suscribe/suscribe.route'

const app = new Hono<App>()

/**--------------------------------Middlewares---------------------------------------- */

// const ALLOWED_ORIGINS = ['http://localhost:5173', 'https://app.tellsenales.workers.dev']

app.use('*', cors())
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
  const now = Date.now()
  await next()
  c.header('X-Response-Time', `${Date.now() - now}ms`)
  console.log(`${c.res.statusText}`)
})

//DatabaseMiddleware
app.use('/v2/api/*', async (c, next) => {
  const db = drizzle(c.env.DB)
  c.set('db', db)
  await next()
})

app.use('/v2/auth/*', async (c, next) => {
  const db = drizzle(c.env.DB)
  c.set('db', db)
  await next()
})

app.use('/subscribe/*', async (c, next) => {
  const db = drizzle(c.env.DB)
  c.set('db', db)
  await next()
})

// JWTMiddleware
app.use('/v2/api/*', async (c, next) => {
  const apiKey = c.req.header('TELL-API-KEY')
  if (apiKey !== c.env.TELL_API_KEY) {
    return c.json(
      {
        message: 'Unauthorized',
      },
      401,
    )
  }

  await next()
  // const jwtMiddleware = jwt({ secret: c.env.JWT_SECRET })
  // return jwtMiddleware(c, next)
})

//-------------------------------------Routes---------------------------- //

app.get('/', async (c) => {
  return c.json({ message: 'api is running' })
})

// Routes
app.route('/v2/api/apigallery', gallery)
app.route('/v2/api/quotations', quotations)
app.route('/v2/api/customers', customers)
app.route('/v2/api/products', products)
app.route('/v2/api/product-categories', productCategories)
app.route('/v2/api/labels', labels)
app.route('/v2/api/agencies', agencies)
app.route('/v2/api/watermarks', watermarks)
app.route('/v2/api/signals', signals)
app.route('/v2/api/signal-categories', signalCategories)

app.route('/send-mail', sendMail)
app.route('/suscribe', suscribe)

app.route('/v2/auth', auth)

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
