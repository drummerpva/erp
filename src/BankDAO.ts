import mysqlConnection from 'mysql2/promise'

export class BankDAO {
  async save(dto: any) {
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

  async list() {
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

  async getById(bankId: number) {
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

  async update(dto: any) {
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
