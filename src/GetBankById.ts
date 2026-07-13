import { BankRepository } from '@BankRepository.ts'
import { UseCase } from '@UseCase.ts'

export class GetBankById implements UseCase<
  GetBankById.Input,
  GetBankById.Output
> {
  constructor(private bankRepository: BankRepository) {}

  async execute(input: GetBankById.Input): Promise<GetBankById.Output> {
    const bank = await this.bankRepository.findById(input.id)
    if (!bank) {
      return undefined
    }
    const output = {
      id: bank.getBankId(),
      codigo: bank.getCode(),
      nome: bank.getName(),
      url: bank.getUrl(),
    }
    return output
  }
}

export namespace GetBankById {
  export type Input = {
    id: number
  }
  export type Output =
    | {
        id: number
        codigo: string
        nome: string
        url: string
      }
    | undefined
}
