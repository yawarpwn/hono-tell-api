import type { App } from '@/types'
import { Hono } from 'hono'
import { SignalsModel } from '@/models'
import { handleError } from '@/utils'
import { destroyImage } from '@/lib/cloudinary'
// import { zValidator } from '@hono/zod-validator'
// import { insertWatermarkSchema, updateWatermarkSchema } from '@/dtos'
// import { getClient } from '@/lib/cloudinary'

export const signalsRoute = new Hono<App>()

signalsRoute.get('/', async (c) => {
  const db = c.get('db')

  try {
    const results = await SignalsModel.getAll(db)
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
// signalsRoute.post(
//   '/',
//   // zValidator('json', insertWatermarkSchema, async (result, c) => {
//   //   if (!result.success) return c.json({ ok: false, message: 'invalid' }, 400)
//   // }),
//   async (c) => {
//     try {
//       const formdata = await c.req.formData()
//       const files = formdata.getAll('files[]') as File[]
//
//       const db = c.get('db')
//
//       for (const file of files) {
//         const response = await WatermarksModel.uploadImage(file, c.env.CLOUDINARY_API_SECRET)
//         const result = await WatermarksModel.create(db, {
//           url: response.secure_url,
//           width: response.width,
//           height: response.height,
//           format: response.format,
//           publicId: response.public_id,
//         })
//
//         console.log({ result })
//       }
//       return c.json({ message: `inserted ${files.length} images success` }, 201)
//     } catch (error) {
//       return handleError(error, c)
//     }
//   },
// )
//
// signalsRoute.put(
//   '/:id',
//   zValidator('json', updateWatermarkSchema, async (result, c) => {
//     if (!result.success) return c.json({ ok: false, message: 'invalid' }, 400)
//   }),
//   async (c) => {
//     const db = c.get('db')
//     const id = c.req.param('id')
//     const data = await c.req.json()
//     try {
//       const results = await WatermarksModel.update(db, id, data)
//       return c.json(results)
//     } catch (error) {
//       return handleError(error, c)
//     }
//   },
// )
//
signalsRoute.delete('/:id', async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')
  try {
    // enocntrar la señál a borrar
    const watermark = await SignalsModel.getById(db, id)
    //Borrar foto en cloudinary
    const result = await destroyImage(watermark.publicId, c.env.CLOUDINARY_API_SECRET)
    console.log(result)
    //borrar la señal
    await SignalsModel.delete(db, id)
    return c.json({
      message: `Se ha borrado la señal ${id} con exito`,
    })
  } catch (error) {
    return handleError(error, c)
  }
})
