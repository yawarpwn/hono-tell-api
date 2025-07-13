import type { App } from '@/types'
import { Hono } from 'hono'
import { SignalsService } from './signals.service'
import { handleError } from '@/core/utils'
import { destroyImage, uploadImage } from '@/lib/cloudinary'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

const app = new Hono<App>()

const signalSchema = z.object({
  title: z.string(),
  code: z.string(),
  description: z.string().optional().nullable(),
  categoryId: z.coerce.number(),
  file: z.any(),
})

app.get('/', async (c) => {
  const db = c.get('db')

  try {
    const results = await SignalsService.getAll(db)
    return c.json(results, 200)
  } catch (error) {
    return handleError(error, c)
  }
})

// signalsRoute.get('/:id', async (c) => {
//   const db = c.get('db')
//   const id = c.req.param('id')
//
//   try {
//     const result = await WatermarksModel.getById(db, id)
//     return c.json(result)
//   } catch (error) {
//     return handleError(error, c)
//   }
// })
//
// 'files[]' => '',
//   'unitSize' => 'numero de pruebita',
//   'code' => 'fhp40',
//   'description' => 'und',
//   'categoryId' => '2',
//   'id' => '',
//   'file' => File {
//     name: 'kit2-main.jpg',
//     lastModified: 1745024146740,
//     size: 273266,
//     type: 'image/jpeg'
//   }
app.post('/', zValidator('form', signalSchema), async (c) => {
  try {
    const data = c.req.valid('form')
    const db = c.get('db')

    //Subir la foto a cloudinary
    const res = await uploadImage(c.env.CLOUDINARY_API_SECRET, data.file, {
      transformation: 'c_limit,w_500,h_500',
      folder: 'signals',
    })

    //Guardar en la base de datos
    await SignalsService.create(db, {
      title: data.title,
      code: data.code,
      description: data.description,
      categoryId: data.categoryId,
      format: res.format,
      height: Number(res.height),
      width: Number(res.width),
      url: res.secure_url,
      publicId: res.public_id,
    })

    console.log(res)
    return c.json({
      succes: 'true',
    })
  } catch (error) {
    return handleError(error, c)
  }
})

app.put('/:id', zValidator('form', signalSchema), async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')
  const data = c.req.valid('form')

  try {
    let uploadedResponse
    if (data.file) {
      //borrar foto antigua
      const signal = await SignalsService.getById(db, id)
      await destroyImage(signal.publicId, c.env.CLOUDINARY_API_SECRET)

      //Subir la nueva foto
      const res = await uploadImage(c.env.CLOUDINARY_API_SECRET, data.file, {
        transformation: 'c_limit,w_500,h_500',
        folder: 'signals',
      })

      uploadedResponse = res
    }

    const results = await SignalsService.update(
      db,
      {
        ...data,
        ...(uploadedResponse && {
          format: uploadedResponse.format,
          height: uploadedResponse.height,
          width: uploadedResponse.width,
          url: uploadedResponse.secure_url,
          publicId: uploadedResponse.public_id,
        }),
      },
      id,
    )
    return c.json(results)
  } catch (error) {
    return handleError(error, c)
  }
})
//
app.delete('/:id', async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')
  try {
    // enocntrar la señál a borrar
    const watermark = await SignalsService.getById(db, id)
    //Borrar foto en cloudinary
    const result = await destroyImage(watermark.publicId, c.env.CLOUDINARY_API_SECRET)
    console.log(result)
    //borrar la señal
    await SignalsService.delete(db, id)
    return c.json({
      message: `Se ha borrado la señal ${id} con exito`,
    })
  } catch (error) {
    return handleError(error, c)
  }
})

export default app
