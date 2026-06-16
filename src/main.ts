import { BankDAODatabase } from '@BankDAO.ts'
import { CreateBank } from '@CreateBank.ts'
import { GetBankById } from '@GetBankById.ts'
import { GetBankList } from '@GetBankList.ts'
import { RemoveBank } from '@RemoveBank.ts'
import { UpdateBank } from '@UpdateBank.ts'
import cors from 'cors'
import express, { Request, Response } from 'express'

const app = express()
app.use(express.json())
app.use(cors())

const bankDao = new BankDAODatabase()

app.get('/banco', async (request: Request, response: Response) => {
  const usecase = new GetBankList(bankDao)
  const output = await usecase.execute()
  response.status(200).json(output)
})

app.get('/banco/:id', async (request: Request, response: Response) => {
  const bankId = request.params.id
  const usecase = new GetBankById(bankDao)
  const input = {
    id: bankId,
  }
  const output = await usecase.execute(input)
  if (!output) {
    return response.status(404).end()
  }
  response.status(200).json(output)
})

app.post('/banco', async (request: Request, response: Response) => {
  const input = request.body
  const usecase = new CreateBank(bankDao)
  const output = await usecase.execute(input)
  response.status(201).json(output)
})

app.put('/banco/:id', async (request: Request, response: Response) => {
  const bankData = request.body
  const bankId = request.params.id
  const usecase = new UpdateBank(bankDao)
  const input = {
    id: Number(bankId),
    ...bankData,
  }
  const output = await usecase.execute(input)
  response.status(200).json(output)
})

app.delete('/banco/:id', async (request: Request, response: Response) => {
  const bankId = request.params.id
  const usecase = new RemoveBank(bankDao)
  const input = {
    id: bankId,
  }
  await usecase.execute(input)
  response.status(200).end()
})

app.listen(3001, () => {
  console.log('Server running at http://localhost:3001')
})
