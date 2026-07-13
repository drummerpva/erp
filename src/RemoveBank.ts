import { BankRepository } from '@BankRepository.ts'
import { UseCase } from '@UseCase.ts'

export class RemoveBank implements UseCase<
  RemoveBank.Input,
  RemoveBank.Output
> {
  constructor(private bankRepository: BankRepository) {}

  async execute(input: RemoveBank.Input): Promise<RemoveBank.Output> {
    await this.bankRepository.remove(input.id)
  }
}

export namespace RemoveBank {
  export type Input = {
    id: number
  }
  export type Output = void
}
