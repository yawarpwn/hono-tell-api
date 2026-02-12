import { zValidator } from '@hono/zod-validator'
import type { App } from '@/types'
import { Hono } from 'hono'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { subscribersTable } from '@/core/db/schemas'
import { Resend } from 'resend'

const subscribeSchema = z.object({
  email: z.string().email(),
})

const app = new Hono<App>()

app.post(
  '/',
  zValidator('json', subscribeSchema, (result, c) => {
    if (!result.success) {
      return c.json({ ok: false, message: 'invalid' }, 400)
    }
  }),
  async (c) => {
    const db = c.get('db')
    try {
      const { email } = c.req.valid('json')
      //Revisar si el correo ya esta suscrito
      const existing = await db
        .select()
        .from(subscribersTable)
        .limit(1)
        .where(eq(subscribersTable.email, email))

      //TODO: Verificar si el correo existe en la vida real con servicios como `kickbox`

      //Guardar en DB si no existe
      if (existing.length === 0) {
        const rows = await db.insert(subscribersTable).values({ email })
        if (!rows.success) throw new Error('Error al suscribirse')
      }

      //Enviar mensaje de bienvenida
      const resend = new Resend(c.env.RESEND_API_KEY)

      await resend.emails.send({
        from: 'Tell Señales <no-reply@tellsenales.com>',
        to: [email],
        subject: 'Gracias por suscribirte',
        html: '<p>¡Bienvenido! Te avisaremos de nuestras ofertas.</p>',
      })

      return c.json({
        ok: true,
        message: 'Suscripción exitosao correctamente',
      })
    } catch (error) {
      console.log(error)
      return c.json(
        {
          ok: false,
          message: 'Error al suscribirse',
        },
        500,
      )
    }
  },
)

export default app
