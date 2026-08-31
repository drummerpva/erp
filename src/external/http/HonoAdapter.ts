import { serve, ServerType } from '@hono/node-server'
import { ErrorMapper } from '@infra/ErrorMapper.ts'
import { HttpRestServer } from '@infra/http/HttpRestServer.ts'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

export class HonoAdapter implements HttpRestServer {
  private app: Hono
  private serverInstance?: ServerType
  constructor() {
    this.app = new Hono()
    this.app.use('*', cors())
  }

  register(
    method: HttpRestServer.AcceptedMethods,
    url: string,
    callback: (
      request: HttpRestServer.Request,
    ) => Promise<HttpRestServer.Response>,
  ): void {
    this.app.on(method, url, async (context) => {
      let body: any = null
      const rawBody = await context.req.text()
      if (rawBody.length) {
        body = JSON.parse(rawBody)
      }
      const input: HttpRestServer.Request = {
        params: context.req.param(),
        body,
      }
      try {
        const output = await callback(input)
        return context.json(output.body, output.statusCode)
      } catch (error: any) {
        const appResponse = await ErrorMapper.toRestReponse(error)
        return context.json(appResponse.body, appResponse.statusCode)
      }
    })
  }

  listen(port: number): void {
    if (this.serverInstance) return
    const server = serve({
      fetch: this.app.fetch,
      port,
    })
    console.log(`Server running with Hono at http://localhost:${port}`)
    this.serverInstance = server
  }

  async close(): Promise<void> {
    if (!this.serverInstance) return
    await new Promise<void>((resolve) => {
      this.serverInstance?.close(() => {
        resolve()
      })
    })
    this.serverInstance = undefined
  }
}
