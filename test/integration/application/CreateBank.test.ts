import { BankDAO } from '@BankDAO.ts'
import { CreateBank } from '@CreateBank.ts'
import { GetBankById } from '@GetBankById.ts'

import { BankDAOFake } from '../../mocks/BankDAOFake.ts'

let bankDao: BankDAO
let getBankByIdUsecase: GetBankById
let sut: CreateBank

beforeAll(() => {
  bankDao = new BankDAOFake()
  getBankByIdUsecase = new GetBankById(bankDao)
  sut = new CreateBank(bankDao)
})

test('Deve criar um banco', async () => {
  const inputSut = {
    codigo: '555',
    nome: `Test Name`,
    url: 'teste4.com',
  }
  const outputCreate = await sut.execute(inputSut)
  expect(outputCreate.id).toBeTruthy()
  expect(outputCreate.codigo).toBe(inputSut.codigo)
  expect(outputCreate.nome).toBe(inputSut.nome)
  expect(outputCreate.url).toBe(inputSut.url)
  const inputGet = {
    id: outputCreate.id,
  }
  const outputGet = await getBankByIdUsecase.execute(inputGet)
  expect(outputGet?.id).toBe(outputCreate.id)
  expect(outputGet?.codigo).toBe(inputSut.codigo)
  expect(outputGet?.nome).toBe(inputSut.nome)
  expect(outputGet?.url).toBe(inputSut.url)
  await bankDao.remove(outputCreate.id)
})
test.each(['', undefined, null, 'Test'])(
  'Não deve criar um banco com nome inválido %s',
  async (rawName: any) => {
    const inputCreate = {
      codigo: '555',
      nome: rawName,
      url: 'teste4.com',
    }
    await expect(sut.execute(inputCreate)).rejects.toThrow('Nome inválido')
  },
)
test.each(['', undefined, null, 'Test', '1', '01', 'ABC'])(
  'Não deve criar um banco com código inválido %s',
  async (invalidCode: any) => {
    const inputCreate = {
      codigo: invalidCode,
      nome: 'Test Name',
      url: 'teste4.com',
    }
    await expect(sut.execute(inputCreate)).rejects.toThrow('Código inválido')
  },
)
