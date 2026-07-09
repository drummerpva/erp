import { Bank } from '@Bank.ts'
import { BankRepository } from '@BankRepository.ts'

export class BankRepositoryFake implements BankRepository {
  private bankList: Bank[] = []
  async save(bank: Bank): Promise<Bank> {
    const bankId = this.bankList.length + 1
    const newBank = Bank.restore({
      code: bank.getCode(),
      name: bank.getName(),
      url: bank.getUrl(),
      bankId,
    })
    this.bankList.push(newBank)
    return newBank
  }

  async list(): Promise<Bank[]> {
    return this.bankList
  }

  async remove(bankId: number): Promise<void> {
    this.bankList = this.bankList.filter((bank) => bank.getBankId() !== bankId)
  }

  async findById(bankId: number): Promise<Bank | undefined> {
    return this.bankList.find((bank) => bank.getBankId() === bankId)
  }

  async findByCode(code: string): Promise<Bank | undefined> {
    return this.bankList.find((bank) => bank.getCode() === code)
  }

  async findByName(name: string): Promise<Bank | undefined> {
    return this.bankList.find((bank) => bank.getName() === name)
  }

  async update(bankUpdated: Bank): Promise<void> {
    this.bankList = this.bankList.map((bank) => {
      if (bank.getBankId() === bankUpdated.getBankId()) {
        return Bank.restore({
          bankId: bank.getBankId(),
          code: bankUpdated.getCode(),
          name: bankUpdated.getName(),
          url: bankUpdated.getUrl(),
        })
      }
      return bank
    })
  }
}
