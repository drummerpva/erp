import { ErrorMapper } from '@ErrorMapper.ts'
import { HttpRestServer } from '@HttpRestServer.ts'
import cors from 'cors'
import express, { Express, Request, Response } from 'express'

export class ExpressAdapter implements HttpRestServer {
  private server: Express
  constructor() {
    this.server = express()
    this.server.use(express.json())
    this.server.use(cors())
  }

  register(
    method: HttpRestServer.AcceptedMethods,
    url: string,
    callback: (
      request: HttpRestServer.Request,
    ) => Promise<HttpRestServer.Response>,
  ): void {
    const normalizedMethod = method.toLocaleLowerCase()
    this.server[normalizedMethod](
      url,
      async (request: Request, response: Response) => {
        const input: HttpRestServer.Request = {
          params: request.params,
          body: request.body,
        }
        try {
          const output = await callback(input)
          return response.status(output.statusCode).json(output.body)
        } catch (error: any) {
          const appResponse = await ErrorMapper.toRestReponse(error)
          return response.status(appResponse.statusCode).json(appResponse.body)
        }
      },
    )
  }

  listen(port: number): void {
    this.server.listen(port, () => {
      console.log(`Server running with express at http://localhost:${port}`)
    })
  }
}
