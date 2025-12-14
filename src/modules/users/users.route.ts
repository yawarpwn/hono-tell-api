import type { App } from '@/types'
import { Hono } from 'hono'
import { UsersService } from './users.service'

const app = new Hono<App>()

// app.get('/', async (c) => {
//   const db = c.get('db')
//
//   try {
//     const todos = await AgenciesService.getAll(db)
//     return c.json(todos, 200)
//   } catch (error) {
//     return handleError(error, c)
//   }
// })

//Obtener usuario
app.get('/:id', async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')

  const user = await UsersService.getById(db, id)
  return c.json(user, 200)
})

// app.post(
//   '/',
//   zValidator('json', insertAgencySchema, async (result, c) => {
//     if (!result.success) return c.json({ ok: false, message: 'invalid' }, 400)
//   }),
//   async (c) => {
//     const db = c.get('db')
//     const dto = c.req.valid('json')
//     const results = await AgenciesService.create(db, dto)
//     return c.json(results, 201)
//   },
// )
//
// app.put(
//   '/:id',
//   zValidator('json', updateAgencySchema, async (result, c) => {
//     if (!result.success) return c.json({ ok: false, message: 'invalid' }, 400)
//   }),
//   async (c) => {
//     const db = c.get('db')
//     const id = c.req.param('id')
//     const dto = await c.req.json()
//     const results = await AgenciesService.update(db, id, dto)
//     return c.json(results, 200)
//   },
// )
//
// app.delete('/:id', async (c) => {
//   const db = c.get('db')
//   const id = c.req.param('id')
//   const results = await AgenciesService.delete(db, id)
//   return c.json(results, 200)
// })

export default app
