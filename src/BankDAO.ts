import mysqlConnection from 'mysql2/promise'

export interface BankDAO {
  save(dto: BankDAO.SaveDTO): Promise<number>
  list(): Promise<BankDAO.BankDTO[]>
  remove(bankId: number): Promise<void>
  getById(bankId: number): Promise<BankDAO.BankDTO | undefined>
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
    const [row] = await connection.query(
      `INSERT INTO BANCO(CODIGO, NOME, URL) VALUES(?, ?, ?)`,
      [dto.codigo, dto.nome, dto.url],
    )
    const bankId = (row as any).insertId
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
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    )
    await connection.query(`DELETE FROM BANCO WHERE BANCO_ID = ? LIMIT 1`, [
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

  async update(dto: BankDAO.UpdateDTO) {
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    )
    await connection.query(
      `UPDATE BANCO SET CODIGO = ?, NOME = ?, URL = ? WHERE BANCO_ID = ?`,
      [dto.codigo, dto.nome, dto.url, dto.id],
    )
    connection.pool.end()
  }
}
