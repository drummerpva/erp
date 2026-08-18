import { ApplicationError } from '@application/errors/ApplicationError.ts'
import { NotFoundError } from '@application/errors/NotFoundError.ts'
import { DomainError } from '@domain/errors/DomainError.ts'
import { HttpRestServer } from '@infra/http/HttpRestServer.ts'

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
