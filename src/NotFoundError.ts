import { ApplicationError } from '@ApplicationError.ts'

export class NotFoundError extends ApplicationError {
  code = 'NOT_FOUND_ERROR'
  constructor(message: string) {
    super(message)
  }
}
