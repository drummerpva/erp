import { ApplicationError } from '@ApplicationError.ts'
import { DatabaseConnection } from '@DatabaseConnection.ts'

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
  constructor(private connection: DatabaseConnection) {}
  async save(dto: BankDAO.SaveDTO): Promise<number> {
    const [row] = await this.connection.query(
      `INSERT INTO banco(CODIGO, NOME, URL) VALUES(?, ?, ?) RETURNING *`,
      [dto.codigo, dto.nome, dto.url],
    )
    const bankId = row.BANCO_ID
    return bankId
  }

  async list(): Promise<BankDAO.BankDTO[]> {
    const rows = await this.connection.query(`SELECT * FROM banco`, [])
    return rows
  }

  async remove(bankId: number) {
    if (isNaN(bankId))
      throw new ApplicationError('ID do Banco informado é inválido')
    await this.connection.query(
      `DELETE FROM banco WHERE BANCO_ID = ? LIMIT 1`,
      [bankId],
    )
  }

  async getById(bankId: number): Promise<BankDAO.BankDTO> {
    const [firstRow] = await this.connection.query(
      `SELECT * FROM banco WHERE BANCO_ID = ? LIMIT 1`,
      [bankId],
    )
    return firstRow
  }

  async getByCode(code: string): Promise<BankDAO.BankDTO> {
    const [firstRow] = await this.connection.query(
      `SELECT * FROM banco WHERE CODIGO = ? LIMIT 1`,
      [code],
    )
    return firstRow
  }

  async getByName(name: string): Promise<BankDAO.BankDTO> {
    const [firstRow] = await this.connection.query(
      `SELECT * FROM banco WHERE NOME = ? LIMIT 1`,
      [name],
    )
    return firstRow
  }

  async update(dto: BankDAO.UpdateDTO) {
    await this.connection.query(
      `UPDATE banco SET CODIGO = ?, NOME = ?, URL = ? WHERE BANCO_ID = ?`,
      [dto.codigo, dto.nome, dto.url, dto.id],
    )
  }
}
