import { BankDAO } from '@BankDAO.ts'

export class GetBankById {
  constructor(private bankDao: BankDAO) {}

  async execute(input: any): Promise<any> {
    const row = await this.bankDao.getById(Number(input.id))
    if (!row) {
      return undefined
    }
    const output = {
      id: row.BANCO_ID,
      codigo: row.CODIGO,
      nome: row.NOME,
      url: row.URL,
    }
    return output
  }
}
