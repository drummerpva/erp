import cors from 'cors'
import express, { Request, Response } from 'express'
import mysqlConnection from 'mysql2/promise'

const app = express()
app.use(express.json())
app.use(cors())

app.get('/banco', async (request: Request, response: Response) => {
  const connection = mysqlConnection.createPool(
    String(process.env.DATABASE_URL),
  )
  const [rows] = await connection.query(`SELECT * FROM banco`, [])
  const output = (rows as any[]).map((row) => ({
    id: row.BANCO_ID,
    codigo: row.CODIGO,
    nome: row.NOME,
    url: row.URL,
  }))
  response.status(200).json(output)
  connection.pool.end()
})

app.get('/banco/:id', async (request: Request, response: Response) => {
  const connection = mysqlConnection.createPool(
    String(process.env.DATABASE_URL),
  )
  const bankId = request.params.id
  const [rows] = await connection.query(
    `SELECT * FROM banco WHERE BANCO_ID = ? LIMIT 1`,
    [bankId],
  )
  const output = (rows as any[]).map((row) => ({
    id: row.BANCO_ID,
    codigo: row.CODIGO,
    nome: row.NOME,
    url: row.URL,
  }))
  const [firstRow] = output
  if (!firstRow) {
    response.status(404).end()
    connection.pool.end()
    return
  }
  response.status(200).json(firstRow)
  connection.pool.end()
})

app.post('/banco', async (request: Request, response: Response) => {
  const bankData = request.body
  const connection = mysqlConnection.createPool(
    String(process.env.DATABASE_URL),
  )
  const [row] = await connection.query(
    `INSERT INTO BANCO(CODIGO, NOME, URL) VALUES(?, ?, ?)`,
    [bankData.codigo, bankData.nome, bankData.url],
  )
  const bankId = (row as any).insertId
  const bank = {
    id: bankId,
    ...bankData,
  }
  response.status(201).json(bank)
  connection.pool.end()
})

app.put('/banco/:id', async (request: Request, response: Response) => {
  const bankData = request.body
  const connection = mysqlConnection.createPool(
    String(process.env.DATABASE_URL),
  )
  const bankId = request.params.id
  const [rows] = await connection.query(
    `SELECT * FROM BANCO WHERE BANCO_ID = ? LIMIT 1`,
    [bankId],
  )
  const output = (rows as any[]).map((row) => ({
    id: row.BANCO_ID,
    codigo: row.CODIGO,
    nome: row.NOME,
    url: row.URL,
  }))
  let [firstRow] = output
  firstRow = {
    ...firstRow,
    ...bankData,
  }
  await connection.query(
    `UPDATE BANCO SET CODIGO = ?, NOME = ?, URL = ? WHERE BANCO_ID = ?`,
    [firstRow.codigo, firstRow.nome, firstRow.url, bankId],
  )
  response.status(200).json(firstRow)
  connection.pool.end()
})

app.delete('/banco/:id', async (request: Request, response: Response) => {
  const connection = mysqlConnection.createPool(
    String(process.env.DATABASE_URL),
  )
  const bankId = request.params.id
  await connection.query(`DELETE FROM BANCO WHERE BANCO_ID = ? LIMIT 1`, [
    bankId,
  ])
  response.status(200).end()
  connection.pool.end()
})

app.listen(3001, () => {
  console.log('Server running at http://localhost:3001')
})
