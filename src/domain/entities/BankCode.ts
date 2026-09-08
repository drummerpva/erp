import { DomainError } from '@domain/errors/DomainError.ts'

export class BankCode {
  constructor(private value: string) {
    if (!this.validateBankCode(value)) throw new DomainError('Código inválido')
  }

  private validateBankCode(code: string): boolean {
    if (!code) return false
    if (code.length !== 3) return false
    if (code.replace(/\D/g, '').length !== 3) return false
    return true
  }

  getValue() {
    return this.value
  }
}
