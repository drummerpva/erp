import { HttpRestServer } from '@BankRestController.ts'
import { ErrorMapper } from '@ErrorMapper.ts'
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
    method: string,
    url: string,
    callback: (
      request: HttpRestServer.Request,
    ) => Promise<HttpRestServer.Response>,
  ): void {
    this.server[method](url, async (request: Request, response: Response) => {
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
    })
  }

  listen(port: number): void {
    this.server.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`)
    })
  }
}
