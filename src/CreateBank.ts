import { Bank } from '@Bank.ts'
import { BankRepository } from '@BankRepository.ts'
import { UseCase } from '@UseCase.ts'
import { validateBankCode } from '@validateBankCode.ts'
import { validateBankName } from '@validateBankName.ts'

export class CreateBank implements UseCase<
  CreateBank.Input,
  CreateBank.Output
> {
  constructor(private bankRepository: BankRepository) {}

  async execute(input: CreateBank.Input): Promise<CreateBank.Output> {
    if (!validateBankName(input.nome)) throw new Error('Nome inválido')
    if (!validateBankCode(input.codigo)) throw new Error('Código inválido')
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
