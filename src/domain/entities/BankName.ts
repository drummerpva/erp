import { DomainError } from '@domain/errors/DomainError.ts'

export class BankName {
  constructor(private value: string) {
    if (!this.validateBankName(value)) throw new DomainError('Nome inválido')
  }

  private validateBankName(name: string): boolean {
    if (!name) return false
    if (!name.match(/^.+\s.+$/)) return false
    return true
  }

  getValue() {
    return this.value
  }
}
