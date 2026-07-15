import { ExpectedError } from '@ExpectedError.ts'

export class DomainError extends ExpectedError {
  readonly code = 'DOMAIN_ERROR'
  constructor(message: string) {
    super(message)
  }
}
