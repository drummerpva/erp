import { validateBankCode } from '@validateBankCode.ts'
import { validateBankName } from '@validateBankName.ts'

export class Bank {
  private constructor(
    private bankId: number,
    private name: string,
    private code: string,
    private url: string,
  ) {
    if (!validateBankName(name)) throw new Error('Nome inválido')
    if (!validateBankCode(code)) throw new Error('Código inválido')
  }

  static create({ code, name, url }: Bank.CreateParams): Bank {
    return new Bank(0, name, code, url)
  }

  static restore({ bankId, code, name, url }: Bank.RestoreParams): Bank {
    return new Bank(bankId, name, code, url)
  }

  getBankId() {
    return this.bankId
  }

  getName() {
    return this.name
  }

  getCode() {
    return this.code
  }

  getUrl() {
    return this.url
  }

  changeCode(code: string) {
    if (!validateBankCode(code)) throw new Error('Código inválido')
    this.code = code
  }

  changeName(name: string) {
    if (!validateBankName(name)) throw new Error('Nome inválido')
    this.name = name
  }

  setUrl(url: string) {
    this.url = url
  }
}

export namespace Bank {
  export type RestoreParams = {
    bankId: number
    name: string
    code: string
    url: string
  }
  export type CreateParams = {
    name: string
    code: string
    url: string
  }
}
