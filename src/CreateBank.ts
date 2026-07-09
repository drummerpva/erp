import { Bank } from '@Bank.ts'
import { BankRepository } from '@BankRepository.ts'
import { UseCase } from '@UseCase.ts'

export class CreateBank implements UseCase<
  CreateBank.Input,
  CreateBank.Output
> {
  constructor(private bankRepository: BankRepository) {}

  async execute(input: CreateBank.Input): Promise<CreateBank.Output> {
    if (!input.nome || !input.nome.match(/^.+\s.+$/)) {
      throw new Error('Nome inválido')
    }
    if (
      !input.codigo ||
      input.codigo.length !== 3 ||
      input.codigo.replace(/\D/g, '').length !== 3
    ) {
      throw new Error('Código inválido')
    }
    const alreadyExistsWithCode = await this.bankRepository.findByCode(
      input.codigo,
    )
    if (alreadyExistsWithCode)
      throw new Error('Já existe um banco com este código')
    const alreadyExistsWithName = await this.bankRepository.findByName(
      input.nome,
    )
    if (alreadyExistsWithName)
      throw new Error('Já existe um banco com este nome')
    const bank = Bank.create({
      code: input.codigo,
      name: input.nome,
      url: input.url,
    })
    const savedBank = await this.bankRepository.save(bank)
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
