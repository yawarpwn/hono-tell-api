import { DrizzleError } from 'drizzle-orm'
import type { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'

export function handleError(error: unknown, c: Context) {
  if (error instanceof HTTPException) {
    console.log('HTTPException Error', error)
    return c.json({ ok: false, message: error.message, statusCode: error.status }, error.status)
  }

  if (error instanceof DrizzleError) {
    console.log('DRIZZLE ERROR: ', error)
    return c.json({ ok: false, message: error.message, statusCode: 400 }, 400)
  }

  console.log('ERROR: ', error)
  return c.json(
    {
      ok: false,
      message: 'Error Desconocido',
      statusCode: 500,
    },
    500,
  )
}
