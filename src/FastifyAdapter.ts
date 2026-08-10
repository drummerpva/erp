import { ErrorMapper } from '@ErrorMapper.ts'
import fastifyCors from '@fastify/cors'
import { HttpRestServer } from '@HttpRestServer.ts'
import fastify, { FastifyInstance } from 'fastify'

export class FastifyAdapter implements HttpRestServer {
  private app: FastifyInstance
  constructor() {
    this.app = fastify()
    this.app.register(fastifyCors, {
      origin: true,
      methods: [...HttpRestServer.AcceptedMethodsList],
    })
  }

  register(
    method: HttpRestServer.AcceptedMethods,
    url: string,
    callback: (
      request: HttpRestServer.Request,
    ) => Promise<HttpRestServer.Response>,
  ): void {
    this.app.route({
      method,
      url,
      handler: async (request, reply) => {
        const input: HttpRestServer.Request = {
          params: request.params,
          body: request.body,
        }
        try {
          const output = await callback(input)
          reply.status(output.statusCode).send(output.body)
        } catch (error: any) {
          const appResponse = await ErrorMapper.toRestReponse(error)
          reply.status(appResponse.statusCode).send(appResponse.body)
        }
      },
    })
  }

  listen(port: number): void {
    this.app.listen({ port }, () => {
      console.log(`Server running with fastity at http://localhost:${port}`)
    })
  }
}
