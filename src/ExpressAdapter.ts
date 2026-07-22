import { ApplicationError } from '@ApplicationError.ts'
import { HttpRestServer } from '@BankRestController.ts'
import { DomainError } from '@DomainError.ts'
import { ExpectedError } from '@ExpectedError.ts'
import { NotFoundError } from '@NotFoundError.ts'
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
        if (!(error instanceof ExpectedError)) {
          return response.status(500).json({
            code: 'SERVER_ERROR',
            message: 'Internal server error',
          })
        }
        if (error instanceof NotFoundError) {
          return response.status(404).json({
            code: error.code,
            message: error.message,
          })
        }
        if (error instanceof DomainError) {
          return response.status(422).json({
            message: error.message,
            code: error.code,
          })
        }
        if (error instanceof ApplicationError) {
          return response.status(422).json({
            code: error.code,
            message: error.message,
          })
        }
        return response.status(500).json({
          code: 'SERVER_ERROR',
          message: 'Internal server error',
        })
      }
    })
  }

  listen(port: number): void {
    this.server.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`)
    })
  }
}
