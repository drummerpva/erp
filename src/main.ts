import { alterarBanco } from '@alterarBanco.ts'
import { getById, list, remove, save } from '@database.ts'
import cors from 'cors'
import express, { Request, Response } from 'express'

const app = express()
app.use(express.json())
app.use(cors())

app.get('/banco', async (request: Request, response: Response) => {
  const rows = await list()
  const output = rows.map((row) => ({
    id: row.BANCO_ID,
    codigo: row.CODIGO,
    nome: row.NOME,
    url: row.URL,
  }))
  response.status(200).json(output)
})

app.get('/banco/:id', async (request: Request, response: Response) => {
  const bankId = request.params.id
  const row = await getById(Number(bankId))
  if (!row) {
    response.status(404).end()
    return
  }
  const output = {
    id: row.BANCO_ID,
    codigo: row.CODIGO,
    nome: row.NOME,
    url: row.URL,
  }
  response.status(200).json(output)
})

app.post('/banco', async (request: Request, response: Response) => {
  const bankData = request.body
  const bankId = await save(bankData)
  const bank = {
    id: bankId,
    ...bankData,
  }
  response.status(201).json(bank)
})

app.put('/banco/:id', async (request: Request, response: Response) => {
  const bankData = request.body
  const bankId = request.params.id
  const input = {
    id: Number(bankId),
    ...bankData,
  }
  const output = await alterarBanco(input)
  response.status(200).json(output)
})

app.delete('/banco/:id', async (request: Request, response: Response) => {
  const bankId = request.params.id
  await remove(Number(bankId))
  response.status(200).end()
})

app.listen(3001, () => {
  console.log('Server running at http://localhost:3001')
})
