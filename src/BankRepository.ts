import { ApplicationError } from '@ApplicationError.ts'
import { Bank } from '@Bank.ts'
import mysqlConnection from 'mysql2/promise'

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
  async save(bank: Bank): Promise<Bank> {
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    )
    const [row] = await connection.query(
      `INSERT INTO banco(CODIGO, NOME, URL) VALUES(?, ?, ?)`,
      [bank.getCode(), bank.getName(), bank.getUrl()],
    )
    const bankId = (row as any).insertId
    connection.pool.end()
    const savedBank = Bank.restore({
      bankId,
      code: bank.getCode(),
      name: bank.getName(),
      url: bank.getUrl(),
    })
    return savedBank
  }

  async list(): Promise<Bank[]> {
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    )
    const [rows] = await connection.query<any[]>(`SELECT * FROM banco`, [])
    connection.pool.end()
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
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    )
    await connection.query(`DELETE FROM banco WHERE BANCO_ID = ? LIMIT 1`, [
      bankId,
    ])
    connection.pool.end()
  }

  async findById(bankId: number): Promise<Bank | undefined> {
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    )
    const [rows] = await connection.query<any[]>(
      `SELECT * FROM banco WHERE BANCO_ID = ? LIMIT 1`,
      [bankId],
    )
    const [firstRow] = rows
    connection.pool.end()
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
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    )
    const [rows] = await connection.query<any[]>(
      `SELECT * FROM banco WHERE CODIGO = ? LIMIT 1`,
      [code],
    )
    const [firstRow] = rows
    connection.pool.end()
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
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    )
    const [rows] = await connection.query<any[]>(
      `SELECT * FROM banco WHERE NOME = ? LIMIT 1`,
      [name],
    )
    const [firstRow] = rows
    connection.pool.end()
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
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    )
    await connection.query(
      `UPDATE banco SET CODIGO = ?, NOME = ?, URL = ? WHERE BANCO_ID = ?`,
      [bank.getCode(), bank.getName(), bank.getUrl(), bank.getBankId()],
    )
    connection.pool.end()
  }
}
