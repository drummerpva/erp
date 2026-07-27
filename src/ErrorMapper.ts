import { ApplicationError } from '@ApplicationError.ts'
import { HttpRestServer } from '@BankRestController.ts'
import { DomainError } from '@DomainError.ts'
import { NotFoundError } from '@NotFoundError.ts'

export class ErrorMapper {
  static async toRestReponse(error: Error): Promise<HttpRestServer.Response> {
    if (error instanceof NotFoundError) {
      return {
        statusCode: 404,
        body: {
          code: error.code,
          message: error.message,
        },
      }
    }
    if (error instanceof DomainError) {
      return {
        statusCode: 422,
        body: {
          code: error.code,
          message: error.message,
        },
      }
    }
    if (error instanceof ApplicationError) {
      return {
        statusCode: 422,
        body: {
          code: error.code,
          message: error.message,
        },
      }
    }
    return {
      statusCode: 500,
      body: {
        code: 'SERVER_ERROR',
        message: 'Internal server error',
      },
    }
  }
}
