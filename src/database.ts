import mysqlConnection from 'mysql2/promise'
export const save = async (dto: any) => {
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

export const list = async () => {
  const connection = mysqlConnection.createPool(
    String(process.env.DATABASE_URL),
  )
  const [rows] = await connection.query<any[]>(`SELECT * FROM banco`, [])
  connection.pool.end()
  return rows
}

export const remove = async (bankId: number) => {
  const connection = mysqlConnection.createPool(
    String(process.env.DATABASE_URL),
  )
  await connection.query(`DELETE FROM BANCO WHERE BANCO_ID = ? LIMIT 1`, [
    bankId,
  ])
  connection.pool.end()
}

export const getById = async (bankId: number) => {
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

export const update = async (dto: any) => {
  const connection = mysqlConnection.createPool(
    String(process.env.DATABASE_URL),
  )
  await connection.query(
    `UPDATE BANCO SET CODIGO = ?, NOME = ?, URL = ? WHERE BANCO_ID = ?`,
    [dto.codigo, dto.nome, dto.url, dto.id],
  )
  connection.pool.end()
}
