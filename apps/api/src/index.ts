import { Hono } from 'hono'
import { cors } from 'hono/cors'

const port = Number(process.env.API_PORT);

const app = new Hono()

.use("*", cors({
  origin: process.env.FRONT_URL ?? "http://localhost:3000"
}))
.get('/', (c) => {
  return c.text('Hello Hono!')
})

export type AppType = typeof app
export default {
  port: port,
  fetch: app.fetch,
}
