import { ApplicationError } from '@ApplicationError.ts'
import { HttpRestServer } from '@BankRestController.ts'
import { DomainError } from '@DomainError.ts'
import { NotFoundError } from '@NotFoundError.ts'

export class ErrorMapper {
  static async toRestReponse(error: Error): Promise<HttpRestServer.Response> {
    if (error instanceof NotFoundError) {
      return {
        statusCode: HttpRestServer.StatusCode.NotFound,
        body: {
          code: error.code,
          message: error.message,
        },
      }
    }
    if (error instanceof DomainError) {
      return {
        statusCode: HttpRestServer.StatusCode.UnprocessableEntity,
        body: {
          code: error.code,
          message: error.message,
        },
      }
    }
    if (error instanceof ApplicationError) {
      return {
        statusCode: HttpRestServer.StatusCode.UnprocessableEntity,
        body: {
          code: error.code,
          message: error.message,
        },
      }
    }
    return {
      statusCode: HttpRestServer.StatusCode.ServerError,
      body: {
        code: 'SERVER_ERROR',
        message: 'Internal server error',
      },
    }
  }
}
