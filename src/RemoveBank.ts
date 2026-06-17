import { BankDAO } from '@BankDAO.ts'
import { UseCase } from '@UseCase.ts'

export class RemoveBank implements UseCase<
  RemoveBank.Input,
  RemoveBank.Output
> {
  constructor(private bankDao: BankDAO) {}

  async execute(input: RemoveBank.Input): Promise<RemoveBank.Output> {
    await this.bankDao.remove(input.id)
  }
}

export namespace RemoveBank {
  export type Input = {
    id: number
  }
  export type Output = void
}
