import { ApplicationError } from '@ApplicationError.ts'
import mysqlConnection from 'mysql2/promise'

export interface BankDAO {
  save(dto: BankDAO.SaveDTO): Promise<number>
  list(): Promise<BankDAO.BankDTO[]>
  remove(bankId: number): Promise<void>
  getById(bankId: number): Promise<BankDAO.BankDTO | undefined>
  getByCode(code: string): Promise<BankDAO.BankDTO | undefined>
  getByName(code: string): Promise<BankDAO.BankDTO | undefined>
  update(dto: BankDAO.UpdateDTO): Promise<void>
}
export namespace BankDAO {
  export type SaveDTO = {
    codigo: string
    nome: string
    url: string
  }
  export type UpdateDTO = {
    id: number
    codigo: string
    nome: string
    url: string
  }
  export type BankDTO = {
    BANCO_ID: number
    CODIGO: string
    NOME: string
    URL: string
  }
}

export class BankDAODatabase implements BankDAO {
  async save(dto: BankDAO.SaveDTO): Promise<number> {
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    )
    const [rows] = await connection.query<any[]>(
      `INSERT INTO banco(CODIGO, NOME, URL) VALUES(?, ?, ?) RETURNING *`,
      [dto.codigo, dto.nome, dto.url],
    )
    const [row] = rows
    const bankId = row.BANCO_ID
    connection.pool.end()
    return bankId
  }

  async list(): Promise<BankDAO.BankDTO[]> {
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    )
    const [rows] = await connection.query<any[]>(`SELECT * FROM banco`, [])
    connection.pool.end()
    return rows
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

  async getById(bankId: number): Promise<BankDAO.BankDTO> {
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    )
    const [rows] = await connection.query<any[]>(
      `SELECT * FROM banco WHERE BANCO_ID = ? LIMIT 1`,
      [bankId],
    )
    const [firstRow] = rows
    connection.pool.end()
    return firstRow
  }

  async getByCode(code: string): Promise<BankDAO.BankDTO> {
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    )
    const [rows] = await connection.query<any[]>(
      `SELECT * FROM banco WHERE CODIGO = ? LIMIT 1`,
      [code],
    )
    const [firstRow] = rows
    connection.pool.end()
    return firstRow
  }

  async getByName(name: string): Promise<BankDAO.BankDTO> {
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    )
    const [rows] = await connection.query<any[]>(
      `SELECT * FROM banco WHERE NOME = ? LIMIT 1`,
      [name],
    )
    const [firstRow] = rows
    connection.pool.end()
    return firstRow
  }

  async update(dto: BankDAO.UpdateDTO) {
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    )
    await connection.query(
      `UPDATE banco SET CODIGO = ?, NOME = ?, URL = ? WHERE BANCO_ID = ?`,
      [dto.codigo, dto.nome, dto.url, dto.id],
    )
    connection.pool.end()
  }
}
