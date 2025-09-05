import { DrizzleError } from 'drizzle-orm'
import type { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { ZodError } from 'zod'
export * from './numbers-to-letters'
export * from './format-date-to-local'
export * from './extract-data-from-xml'
export * from './extract-invoice-data'

export function handleError(error: unknown, c: Context) {
  if (error instanceof ZodError) {
    return c.json({
      ok: false,
      message: JSON.stringify(error.flatten().fieldErrors),
      statusCode: 400,
    })
  }

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

export function handleSqlError(err: unknown) {
  if (err instanceof Error) {
    throw new HTTPException(400, {
      message: err.message,
    })
  }
  // if (err instanceof Error && err.message.includes('UNIQUE constraint failed')) {
  //   throw new HTTPException(400, {
  //     message: `UNIQUE Key violation`,
  //   })
  // }
  throw err
}
