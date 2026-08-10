import { Bank } from '@Bank.ts'

export interface BankRepository {
  save(bank: Bank): Promise<Bank>
  list(): Promise<Bank[]>
  remove(bankId: number): Promise<void>
  findById(bankId: number): Promise<Bank | undefined>
  findByCode(code: string): Promise<Bank | undefined>
  findByName(code: string): Promise<Bank | undefined>
  update(bank: Bank): Promise<void>
}
