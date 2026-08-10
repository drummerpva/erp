import { ApplicationError } from '@application/errors/ApplicationError.ts'
import { BankRepository } from '@application/repositories/BankRepository.ts'
import { Bank } from '@domain/entities/Bank.ts'
import { DatabaseConnection } from '@infra/database/DatabaseConnection.ts'

export class BankRepositorySQL implements BankRepository {
  constructor(private databaseConnection: DatabaseConnection) {}
  async save(bank: Bank): Promise<Bank> {
    const [row] = await this.databaseConnection.query(
      `INSERT INTO banco(CODIGO, NOME, URL) VALUES(?, ?, ?) RETURNING *`,
      [bank.getCode(), bank.getName(), bank.getUrl()],
    )
    const bankId = row.banco_id
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
        bankId: row.banco_id,
        code: row.codigo,
        name: row.nome,
        url: row.url,
      })
      bankList.push(bank)
    }
    return bankList
  }

  async remove(bankId: number) {
    if (isNaN(bankId))
      throw new ApplicationError('ID do Banco informado é inválido')
    await this.databaseConnection.query(
      `DELETE FROM banco WHERE BANCO_ID = ?`,
      [bankId],
    )
  }

  async findById(bankId: number): Promise<Bank | undefined> {
    const [firstRow] = await this.databaseConnection.query(
      `SELECT * FROM banco WHERE BANCO_ID = ?`,
      [bankId],
    )
    if (!firstRow) return
    const bank = Bank.restore({
      bankId: firstRow.banco_id,
      code: firstRow.codigo,
      name: firstRow.nome,
      url: firstRow.url,
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
      bankId: firstRow.banco_id,
      code: firstRow.codigo,
      name: firstRow.nome,
      url: firstRow.url,
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
      bankId: firstRow.banco_id,
      code: firstRow.codigo,
      name: firstRow.nome,
      url: firstRow.url,
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
