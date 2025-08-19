import type { App } from '@/types'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { Resend } from 'resend'
import { z } from 'zod'

const app = new Hono<App>()

const emailSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  ruc: z.string().nullish(),
  phone: z.string().nullable().optional(),
  message: z.string(),
})

type EmailSchema = z.infer<typeof emailSchema>
export function EmailTemplate({ email, name, message, phone, ruc }: EmailSchema) {
  console.log({ phone, email, name, message, ruc })
  return `
<body style="font-family: Arial, sans-serif; background-color: #f4f4f9; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px;">
    <div style="background-color: #222; color: #ffffff; padding: 20px; text-align: center;">
      <h1 style="font-size: 24px; margin: 0; font-weight: bold;">Nuevo Mensaje de Contacto</h1>
      <p style="font-size: 14px; margin: 8px 0 0; opacity: 0.9;">Hemos recibido una nueva solicitud desde tu sitio web.</p>
    </div>
    <div style="padding: 20px; color: #333333;">
      <p style="margin: 0 0 12px;">
        <span style="font-weight: bold; color: #222;">Nombre:</span>  ${name}
      </p>
      <p style="margin: 0 0 12px;">
        <span style="font-weight: bold; color: #222;">RUC:</span> ${ruc}
      </p>
      <p style="margin: 0 0 12px;">
        <span style="font-weight: bold; color: #222;">Correo Electrónico:</span> ${email} 
      </p>
      <p style="margin: 0 0 12px;">
        <span style="font-weight: bold; color: #222;">Teléfono:</span> +51 ${phone} 
      </p>
      <p style="margin: 0 0 12px;">
        <span style="font-weight: bold; color: #222;">Mensaje:</span>
      </p>
      <p style="margin: 0 0 20px; padding-left: 15px; border-left: 4px solid #222; font-style: italic;">
      ${message}
      </p>
      <a href="mailto:${email}" style="display: inline-block; padding: 10px 20px; background-color: #222; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">Responder al Cliente</a>
    </div>
    <div style="background-color: #f4f4f9; padding: 15px; text-align: center; font-size: 12px; color: #666666; border-top: 1px solid #e0e0e0;">
      <p style="margin: 0;">Este mensaje fue enviado desde tu sitio web <a href="https://tellsenales.com.pe/" style="color: #222; text-decoration: underline;">tellsenales.com.pe</a>.</p>
    </div>
  </div>
</body>
`
}

app.post(
  '/',
  zValidator('json', emailSchema, async (result, c) => {
    if (!result.success) {
      return c.json({
        message: 'invalid',
      })
    }
  }),
  async (c) => {
    const resend = new Resend(c.env.RESEND_API_KEY)
    const { name, email, message, ruc, phone } = c.req.valid('json')

    try {
      const { data, error } = await resend.emails.send({
        from: `${name} <ventas@tellsenales.com>`,
        to: ['ventas@tellsenales.com.pe'],
        subject: `Solicito Cotización - ${name} - ${ruc}`,
        html: EmailTemplate({ email, name, message, ruc, phone }),
      })

      if (error) {
        return Response.json(
          {
            error,
          },
          {
            status: 500,
          },
        )
      }

      console.log(data)
      return Response.json({
        data,
      })
    } catch (error) {
      console.log(error)
      return Response.json(
        { error },
        {
          status: 500,
        },
      )
    }
  },
)

export default app
