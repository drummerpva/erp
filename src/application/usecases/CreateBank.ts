import { ApplicationError } from '@application/errors/ApplicationError.ts'
import { EventPublisher } from '@application/EventPublisher.ts'
import { BankCreatedEvent } from '@application/events/BankCreatedEvent.ts'
import { BankRepository } from '@application/repositories/BankRepository.ts'
import { UseCase } from '@application/usecases/UseCase.ts'
import { Bank } from '@domain/entities/Bank.ts'

export class CreateBank implements UseCase<
  CreateBank.Input,
  CreateBank.Output
> {
  constructor(
    private bankRepository: BankRepository,
    private eventPublisher: EventPublisher,
  ) {}

  async execute(input: CreateBank.Input): Promise<CreateBank.Output> {
    const bank = Bank.create({
      code: input.codigo,
      name: input.nome,
      url: input.url,
    })
    const alreadyExistsWithCode = await this.bankRepository.findByCode(
      input.codigo,
    )
    if (alreadyExistsWithCode)
      throw new ApplicationError('Já existe um banco com este código')
    const alreadyExistsWithName = await this.bankRepository.findByName(
      input.nome,
    )
    if (alreadyExistsWithName)
      throw new ApplicationError('Já existe um banco com este nome')
    const savedBank = await this.bankRepository.save(bank)
    const applicationEvent = new BankCreatedEvent({
      bankId: savedBank.getBankId(),
    })
    await this.eventPublisher.publishAll([applicationEvent])
    const output = {
      id: savedBank.getBankId(),
      codigo: savedBank.getCode(),
      nome: savedBank.getName(),
      url: savedBank.getUrl(),
    }
    return output
  }
}

export namespace CreateBank {
  export type Input = {
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
