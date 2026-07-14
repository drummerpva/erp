import { BankRepository } from '@BankRepository.ts'
import { UseCase } from '@UseCase.ts'
import { validateBankCode } from '@validateBankCode.ts'
import { validateBankName } from '@validateBankName.ts'

export class UpdateBank implements UseCase<
  UpdateBank.Input,
  UpdateBank.Output
> {
  constructor(private bankRepository: BankRepository) {}

  async execute(input: UpdateBank.Input): Promise<UpdateBank.Output> {
    if (!validateBankName(input.nome)) throw new Error('Nome inválido')
    if (!validateBankCode(input.codigo)) throw new Error('Código inválido')
    const bank = await this.bankRepository.findById(input.id)
    if (!bank) throw new Error('Banco não encontrado')
    if (bank.getCode() !== input.codigo) {
      const alreadyExistsWithCode = await this.bankRepository.findByCode(
        input.codigo,
      )
      if (alreadyExistsWithCode)
        throw new Error(
          'Não é possível alterar o banco para um código já cadastrado',
        )
      bank.setCode(input.codigo)
    }
    if (bank.getName() !== input.nome) {
      const alreadyExistsWithCode = await this.bankRepository.findByName(
        input.nome,
      )
      if (alreadyExistsWithCode)
        throw new Error(
          'Não é possível alterar o banco para um nome já cadastrado',
        )
      bank.setName(input.nome)
    }
    bank.setUrl(input.url)
    await this.bankRepository.update(bank)
    return {
      id: bank.getBankId(),
      codigo: bank.getCode(),
      nome: bank.getName(),
      url: bank.getUrl(),
    }
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
