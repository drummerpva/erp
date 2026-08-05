import { ApplicationError } from '@ApplicationError.ts'
import { Bank } from '@Bank.ts'
import { BankDAO } from '@BankDAO.ts'
import { BankRepository } from '@BankRepository.ts'

export class BankRepositoryDatabase implements BankRepository {
  constructor(private bankDao: BankDAO) {}
  async save(bank: Bank): Promise<Bank> {
    const bankId = await this.bankDao.save({
      codigo: bank.getCode(),
      nome: bank.getName(),
      url: bank.getUrl(),
    })
    const savedBank = Bank.restore({
      bankId,
      code: bank.getCode(),
      name: bank.getName(),
      url: bank.getUrl(),
    })
    return savedBank
  }

  async list(): Promise<Bank[]> {
    const rows = await this.bankDao.list()
    const bankList: Bank[] = []
    for (const row of rows) {
      const bank = Bank.restore({
        bankId: row.BANCO_ID,
        code: row.CODIGO,
        name: row.NOME,
        url: row.URL,
      })
      bankList.push(bank)
    }
    return bankList
  }

  async remove(bankId: number): Promise<void> {
    if (isNaN(bankId))
      throw new ApplicationError('ID do Banco informado é inválido')
    await this.bankDao.remove(bankId)
  }

  async findById(bankId: number): Promise<Bank | undefined> {
    const firstRow = await this.bankDao.getById(bankId)
    if (!firstRow) return
    const bank = Bank.restore({
      bankId: firstRow.BANCO_ID,
      code: firstRow.CODIGO,
      name: firstRow.NOME,
      url: firstRow.URL,
    })
    return bank
  }

  async findByCode(code: string): Promise<Bank | undefined> {
    const firstRow = await this.bankDao.getByCode(code)
    if (!firstRow) return
    const bank = Bank.restore({
      bankId: firstRow.BANCO_ID,
      code: firstRow.CODIGO,
      name: firstRow.NOME,
      url: firstRow.URL,
    })
    return bank
  }

  async findByName(name: string): Promise<Bank | undefined> {
    const firstRow = await this.bankDao.getByName(name)
    if (!firstRow) return
    const bank = Bank.restore({
      bankId: firstRow.BANCO_ID,
      code: firstRow.CODIGO,
      name: firstRow.NOME,
      url: firstRow.URL,
    })
    return bank
  }

  async update(bank: Bank): Promise<void> {
    await this.bankDao.update({
      id: bank.getBankId(),
      codigo: bank.getCode(),
      nome: bank.getName(),
      url: bank.getUrl(),
    })
  }
}
