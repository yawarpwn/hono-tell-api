import { Hono } from 'hono'
import type { App } from '@/types'
import { GalleryService } from './gallery.service'

const app = new Hono<App>()

app.get('/', async (c) => {
  const photos = await GalleryService.getAll(c.get('db'))
  console.log(photos)
  return c.json(photos)
})

export default app
