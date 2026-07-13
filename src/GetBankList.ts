import { BankRepository } from '@BankRepository.ts'
import { UseCase } from '@UseCase.ts'

export class GetBankList implements UseCase<
  GetBankList.Input,
  GetBankList.Output
> {
  constructor(private bankRepository: BankRepository) {}

  async execute(): Promise<GetBankList.Output> {
    const bankList = await this.bankRepository.list()
    const output = bankList.map((bank) => ({
      id: bank.getBankId(),
      codigo: bank.getCode(),
      nome: bank.getName(),
      url: bank.getUrl(),
    }))
    return output
  }
}
export namespace GetBankList {
  export type Input = any
  export type Output = {
    id: number
    codigo: string
    nome: string
    url: string
  }[]
}
