import { BankDAO } from '@BankDAO.ts'

export class UpdateBank {
  constructor(private bankDao: BankDAO) {}

  async execute(input: any) {
    const row = await this.bankDao.getById(Number(input.id))
    const output = {
      id: row.BANCO_ID,
      codigo: row.CODIGO,
      nome: row.NOME,
      url: row.URL,
    }
    const bankUpdated = {
      ...output,
      ...input,
    }
    await this.bankDao.update(bankUpdated)
    return bankUpdated
  }
}
