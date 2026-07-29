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
    const bankId = row.banco_id
    return bankId
  }

  async list(): Promise<BankDAO.BankDTO[]> {
    const rows = await this.connection.query(`SELECT * FROM banco`, [])
    return rows.map((row) => ({
      BANCO_ID: row.banco_id,
      CODIGO: row.codigo,
      NOME: row.nome,
      URL: row.url,
    }))
  }

  async remove(bankId: number) {
    if (isNaN(bankId))
      throw new ApplicationError('ID do Banco informado é inválido')
    await this.connection.query(`DELETE FROM banco WHERE BANCO_ID = ?`, [
      bankId,
    ])
  }

  async getById(bankId: number): Promise<BankDAO.BankDTO | undefined> {
    const [firstRow] = await this.connection.query(
      `SELECT * FROM banco WHERE BANCO_ID = ?`,
      [bankId],
    )
    if (!firstRow) return
    return {
      BANCO_ID: firstRow.banco_id,
      CODIGO: firstRow.codigo,
      NOME: firstRow.nome,
      URL: firstRow.url,
    }
  }

  async getByCode(code: string): Promise<BankDAO.BankDTO | undefined> {
    const [firstRow] = await this.connection.query(
      `SELECT * FROM banco WHERE CODIGO = ? LIMIT 1`,
      [code],
    )
    if (!firstRow) return
    return {
      BANCO_ID: firstRow.banco_id,
      CODIGO: firstRow.codigo,
      NOME: firstRow.nome,
      URL: firstRow.url,
    }
  }

  async getByName(name: string): Promise<BankDAO.BankDTO | undefined> {
    const [firstRow] = await this.connection.query(
      `SELECT * FROM banco WHERE NOME = ? LIMIT 1`,
      [name],
    )
    if (!firstRow) return
    return {
      BANCO_ID: firstRow.banco_id,
      CODIGO: firstRow.codigo,
      NOME: firstRow.nome,
      URL: firstRow.url,
    }
  }

  async update(dto: BankDAO.UpdateDTO) {
    await this.connection.query(
      `UPDATE banco SET CODIGO = ?, NOME = ?, URL = ? WHERE BANCO_ID = ?`,
      [dto.codigo, dto.nome, dto.url, dto.id],
    )
  }
}
