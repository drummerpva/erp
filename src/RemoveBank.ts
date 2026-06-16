import { BankDAO } from '@BankDAO.ts'

export class RemoveBank {
  constructor(private bankDao: BankDAO) {}

  async execute(input: any): Promise<any> {
    await this.bankDao.remove(Number(input.id))
  }
}
