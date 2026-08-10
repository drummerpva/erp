import { ExpectedError } from '@domain/errrors/ExpectedError.ts'

export class ApplicationError extends ExpectedError {
  code = 'APPLICATION_ERROR'
  constructor(message: string) {
    super(message)
  }
}
