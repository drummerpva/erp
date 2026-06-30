import { BankDAO } from '@BankDAO.ts'
import { UseCase } from '@UseCase.ts'

export class UpdateBank implements UseCase<
  UpdateBank.Input,
  UpdateBank.Output
> {
  constructor(private bankDao: BankDAO) {}

  async execute(input: UpdateBank.Input): Promise<UpdateBank.Output> {
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
    const row = await this.bankDao.getById(input.id)
    if (!row) throw new Error('Banco não encontrado')
    if (row.CODIGO !== input.codigo) {
      const alreadyExistsWithCode = await this.bankDao.getByCode(input.codigo)
      if (alreadyExistsWithCode)
        throw new Error(
          'Não é possível alterar o banco para um código já cadastrado',
        )
    }
    if (row.NOME !== input.nome) {
      const alreadyExistsWithCode = await this.bankDao.getByName(input.nome)
      if (alreadyExistsWithCode)
        throw new Error(
          'Não é possível alterar o banco para um nome já cadastrado',
        )
    }

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
