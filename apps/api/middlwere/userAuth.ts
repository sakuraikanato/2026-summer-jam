import { createMiddleware } from 'hono/factory'
import { auth, AuthVariables } from '../lib/auth';

export const userAuth = createMiddleware<{ Variables: AuthVariables }>(
  async (c, next) => {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    })

    console.log(session)

    if (!session) {
      return c.json({ success: false, message: 'Unauthorized' }, 401)
    }

    c.set('user', session.user)
    c.set('session', session.session)
    return await next()
  }
)