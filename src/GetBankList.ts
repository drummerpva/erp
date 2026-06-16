import { BankDAO } from '@BankDAO.ts'

export class GetBankList {
  constructor(private bankDao: BankDAO) {}

  async execute(): Promise<any> {
    const rows = await this.bankDao.list()
    const output = rows.map((row) => ({
      id: row.BANCO_ID,
      codigo: row.CODIGO,
      nome: row.NOME,
      url: row.URL,
    }))
    return output
  }
}
