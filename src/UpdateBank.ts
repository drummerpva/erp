import { BankDAO } from '@BankDAO.ts'
import { UseCase } from '@UseCase.ts'

export class UpdateBank implements UseCase<
  UpdateBank.Input,
  UpdateBank.Output
> {
  constructor(private bankDao: BankDAO) {}

  async execute(input: UpdateBank.Input): Promise<UpdateBank.Output> {
    const row = await this.bankDao.getById(input.id)
    const output = {
      id: row?.BANCO_ID,
      codigo: row?.CODIGO,
      nome: row?.NOME,
      url: row?.URL,
    }
    const bankUpdated = {
      ...output,
      ...input,
    }
    await this.bankDao.update(bankUpdated)
    return bankUpdated
  }
}

export namespace UpdateBank {
  export type Input = {
    id: number
    codigo: string
    nome: string
    url: string
  }
  export type Output = {
    id: number
    codigo: string
    nome: string
    url: string
  }
}
