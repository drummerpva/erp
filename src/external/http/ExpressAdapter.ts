import { Server } from 'node:http'

import { ErrorMapper } from '@infra/ErrorMapper.ts'
import { HttpRestServer } from '@infra/http/HttpRestServer.ts'
import cors from 'cors'
import express, { Express, json, Request, Response } from 'express'

export class ExpressAdapter implements HttpRestServer {
  private server: Express
  private serverInstance?: Server
  constructor() {
    this.server = express()
    this.server.use(json())
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
    this.serverInstance = this.server.listen(port, () => {
      console.log(`Server running with express at http://localhost:${port}`)
    })
  }

  async close(): Promise<void> {
    if (!this.serverInstance) return
    await new Promise((resolve, reject) => {
      this.serverInstance!.close((error) => {
        if (error) return reject(error)
        resolve(null)
      })
    })
    this.serverInstance = undefined
  }
}
