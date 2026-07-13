import { BankDAODatabase } from '@BankDAO.ts'
import { BankRepositoryDatabase } from '@BankRepository.ts'
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
const bankRepository = new BankRepositoryDatabase()

app.get('/banco', async (request: Request, response: Response) => {
  const usecase = new GetBankList(bankRepository)
  const output = await usecase.execute()
  response.status(200).json(output)
})

app.get('/banco/:id', async (request: Request, response: Response) => {
  const bankId = Number(request.params.id)
  const usecase = new GetBankById(bankRepository)
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
  const usecase = new CreateBank(bankRepository)
  try {
    const output = await usecase.execute(input)
    return response.status(201).json(output)
  } catch (error: any) {
    return response.status(422).json({
      message: error?.message,
    })
  }
})

app.put('/banco/:id', async (request: Request, response: Response) => {
  const bankData = request.body
  const bankId = request.params.id
  const usecase = new UpdateBank(bankDao)
  const input = {
    id: Number(bankId),
    ...bankData,
  }
  try {
    const output = await usecase.execute(input)
    return response.status(200).json(output)
  } catch (error: any) {
    if (error?.message === 'Banco não encontrado') {
      return response.status(404).json({
        message: error?.message,
      })
    }
    return response.status(422).json({
      message: error?.message,
    })
  }
})

app.delete('/banco/:id', async (request: Request, response: Response) => {
  const bankId = Number(request.params.id)
  const usecase = new RemoveBank(bankDao)
  const input = {
    id: bankId,
  }
  try {
    await usecase.execute(input)
    return response.status(200).end()
  } catch (error: any) {
    response.status(422).json({
      message: error?.message ?? '',
    })
  }
})

app.listen(3001, () => {
  console.log('Server running at http://localhost:3001')
})
