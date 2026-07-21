import { ApplicationError } from '@ApplicationError.ts'
import { Bank } from '@Bank.ts'
import { DatabaseConnection } from '@DatabaseConnection.ts'

export interface BankRepository {
  save(bank: Bank): Promise<Bank>
  list(): Promise<Bank[]>
  remove(bankId: number): Promise<void>
  findById(bankId: number): Promise<Bank | undefined>
  findByCode(code: string): Promise<Bank | undefined>
  findByName(code: string): Promise<Bank | undefined>
  update(bank: Bank): Promise<void>
}

export class BankRepositoryDatabase implements BankRepository {
  constructor(private databaseConnection: DatabaseConnection) {}
  async save(bank: Bank): Promise<Bank> {
    const [row] = await this.databaseConnection.query(
      `INSERT INTO banco(CODIGO, NOME, URL) VALUES(?, ?, ?) RETURNING *`,
      [bank.getCode(), bank.getName(), bank.getUrl()],
    )
    const bankId = row.BANCO_ID
    const savedBank = Bank.restore({
      bankId,
      code: bank.getCode(),
      name: bank.getName(),
      url: bank.getUrl(),
    })
    return savedBank
  }

  async list(): Promise<Bank[]> {
    const rows = await this.databaseConnection.query(`SELECT * FROM banco`, [])
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

  async remove(bankId: number) {
    if (isNaN(bankId))
      throw new ApplicationError('ID do Banco informado é inválido')
    await this.databaseConnection.query(
      `DELETE FROM banco WHERE BANCO_ID = ? LIMIT 1`,
      [bankId],
    )
  }

  async findById(bankId: number): Promise<Bank | undefined> {
    const [firstRow] = await this.databaseConnection.query(
      `SELECT * FROM banco WHERE BANCO_ID = ? LIMIT 1`,
      [bankId],
    )
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
    const [firstRow] = await this.databaseConnection.query(
      `SELECT * FROM banco WHERE CODIGO = ? LIMIT 1`,
      [code],
    )
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
    const [firstRow] = await this.databaseConnection.query(
      `SELECT * FROM banco WHERE NOME = ? LIMIT 1`,
      [name],
    )
    if (!firstRow) return
    const bank = Bank.restore({
      bankId: firstRow.BANCO_ID,
      code: firstRow.CODIGO,
      name: firstRow.NOME,
      url: firstRow.URL,
    })
    return bank
  }

  async update(bank: Bank) {
    await this.databaseConnection.query(
      `UPDATE banco SET CODIGO = ?, NOME = ?, URL = ? WHERE BANCO_ID = ?`,
      [bank.getCode(), bank.getName(), bank.getUrl(), bank.getBankId()],
    )
  }
}
