import { BankCode } from './BankCode.ts'
import { BankName } from './BankName.ts'

export class Bank {
  private code: BankCode
  private name: BankName
  private constructor(
    private bankId: number,
    name: string,
    code: string,
    private url: string,
  ) {
    this.name = new BankName(name)
    this.code = new BankCode(code)
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
    return this.name.getValue()
  }

  getCode() {
    return this.code.getValue()
  }

  getUrl() {
    return this.url
  }

  changeCode(code: string) {
    this.code = new BankCode(code)
  }

  changeName(name: string) {
    this.name = new BankName(name)
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
