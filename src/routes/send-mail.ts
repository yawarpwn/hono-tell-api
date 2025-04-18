import type { App } from '@/types'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { Resend } from 'resend'
import { z } from 'zod'

export const sendMailRoute = new Hono<App>()

const emailSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  ruc: z.string().nullish(),
  phone: z.string().nullish(),
  message: z.string(),
})

type EmailSchema = z.infer<typeof emailSchema>
export function EmailTemplate({ email, name, message, phone, ruc }: EmailSchema) {
  return `
<div className="container">
<div className="header">
<h1>Nuevo Mensaje de Contacto</h1>
<p>Has recibido un nuevo mensaje desde tu página web.</p>
</div>
<div className="content">
<p>
<span className="label font-bold ">Nombre:</span> ${name}
</p>
<p>
<span className="label font-bold ">Ruc:</span> ${ruc ?? ''}
</p>
<p>
<span className="label font-bold">Correo Electrónico:</span> ${email}
</p>
<p>
<span className="label font-bold">Teléfono:</span> ${phone ?? ''}
</p>
<p>
<span className="label font-bold">Mensaje:</span>
</p>
<p>${message}</p>
</div>
</div>
`
}

sendMailRoute.post(
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
    const { name, email, message, ruc } = c.req.valid('json')

    try {
      const { data, error } = await resend.emails.send({
        from: `${name} <ventas@tellsenales.com>`,
        to: ['tellsenales@gmail.com'],
        subject: 'Cliente desde la WEB',
        html: EmailTemplate({ email, name, message, ruc, phone: undefined }),
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
