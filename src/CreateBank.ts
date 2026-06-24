import { BankDAO } from '@BankDAO.ts'
import { UseCase } from '@UseCase.ts'

export class CreateBank implements UseCase<
  CreateBank.Input,
  CreateBank.Output
> {
  constructor(private bankDao: BankDAO) {}

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
    const alreadyExistsWithCode = await this.bankDao.getByCode(input.codigo)
    if (alreadyExistsWithCode)
      throw new Error('Já existe um banco com este código')
    const bankId = await this.bankDao.save(input)
    const output = {
      id: bankId,
      ...input,
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
