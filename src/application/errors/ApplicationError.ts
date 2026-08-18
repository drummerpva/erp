import { ExpectedError } from '@domain/errors/ExpectedError.ts'

export class ApplicationError extends ExpectedError {
  code = 'APPLICATION_ERROR'
  constructor(message: string) {
    super(message)
  }
}
