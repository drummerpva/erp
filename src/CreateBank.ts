import { BankDAO } from '@BankDAO.ts'

export class CreateBank {
  constructor(private bankDao: BankDAO) {}

  async execute(input: any): Promise<any> {
    const bankId = await this.bankDao.save(input)
    const output = {
      id: bankId,
      ...input,
    }
    return output
  }
}
