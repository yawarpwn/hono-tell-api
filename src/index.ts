import { Hono } from 'hono'

// import types
import type { App } from './types'

// Routes import
import customers from '@/modules/customers/customers.route'
import quotations from '@/modules/quotations/quotations.route'
import products from '@/modules/products/products.route'
import productCategories from '@/modules/product-categories/product-categories.route'
import labels from '@/modules/labels/labels.route'
import agencies from '@/modules/agencies/agencies.route'
import watermarks from '@/modules/watermarks/watermarks.route'
import auth from '@/modules/auth/auth.route'
import signals from '@/modules/signals/signals.route'
import users from '@/modules/users/users.route'
import signalCategories from '@/modules/signal-categories/signal-categories.route'
import fireExtinguerCertificates from '@/modules/fire-extinguer-certificates/fire-extinguer-certificates.route'
import invoices from '@/modules/invoices/invoices.route'
import sendMail from '@/modules/send-mail/send-mail.route'
import suscribe from '@/modules/suscribe.route'

import z from 'zod'

// import errors
import { DatabaseError } from './core/errors'
import { HTTPException } from 'hono/http-exception'

// import middlewares
import { authMiddleware, databaseMiddleware } from './core/middlewares'
import { cors } from 'hono/cors'
import { prettyJSON } from 'hono/pretty-json'

const app = new Hono<App>()

/**--------------------------------Middlewares---------------------------------------- */

// const ALLOWED_ORIGINS = ['http://localhost:5173', 'https://app.tellsenales.workers.dev']
app.use('*', cors())
app.use('*', prettyJSON())
app.use('/v2/*', databaseMiddleware)
app.use('/v2/api/*', authMiddleware)

//---------------------------------------Routes---------------------------- //

// Ruta raiz
app.get('/', async (c) => {
  return c.json({ message: 'api is running' })
})

// Routes protegidas
app.route('/v2/api/quotations', quotations)
app.route('/v2/api/invoices', invoices)
app.route('/v2/api/customers', customers)
app.route('/v2/api/products', products)
app.route('/v2/api/product-categories', productCategories)
app.route('/v2/api/labels', labels)
app.route('/v2/api/agencies', agencies)
app.route('/v2/api/watermarks', watermarks)
app.route('/v2/api/signals', signals)
app.route('/v2/api/signal-categories', signalCategories)
app.route('/v2/api/fire-extinguer-certificates', fireExtinguerCertificates)
app.route('/v2/api/users', users)

// Routas publicas
app.route('/send-mail', sendMail)
app.route('/suscribe', suscribe)
app.route('/v2/auth', auth)

//--------------------------------------- Errors ---------------------------- //
// custom Not Found Message
app.notFound((c) =>
  c.json(
    {
      success: false,
      message: 'Ruta no encontrada',
    },
    404,
  ),
)

//  Manejo de errores
app.onError((err, c) => {
  console.log('Error: ', err)
  if (err instanceof z.ZodError) {
    return c.json(
      {
        success: false,
        message: 'Datos de entrada inválidos',
        details: err.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      },
      400,
    )
  }

  if (err instanceof HTTPException) {
    return c.json(
      {
        success: false,
        message: err.message,
      },
      err.status,
    )
  }

  if (err instanceof DatabaseError) {
    return c.json(
      {
        success: false,
        message: err.message,
      },
      400,
    )
  }

  if (err instanceof Error) {
    return c.json(
      {
        success: false,
        message: err.message,
      },
      500,
    )
  }

  return c.json(
    {
      success: false,
      error: 'Error interno del servidor',
    },
    500,
  )
})

export default app
