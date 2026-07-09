import { BankDAO } from '@BankDAO.ts'
import { BankRepository } from '@BankRepository.ts'
import { CreateBank } from '@CreateBank.ts'

import { BankDAOFake } from '../../mocks/BankDAOFake.ts'
import { BankRepositoryFake } from '../../mocks/BankRepositoryFake.ts'

let bankDao: BankDAO
// let getBankByIdUsecase: GetBankById
let bankRepository: BankRepository
let sut: CreateBank

beforeEach(() => {
  bankDao = new BankDAOFake()
  bankRepository = new BankRepositoryFake()
  // getBankByIdUsecase = new GetBankById(bankDao)
  sut = new CreateBank(bankRepository)
})

test('Deve criar um banco', async () => {
  const fakeCode = `${Math.random()}`.substring(2, 5)
  const inputSut = {
    codigo: fakeCode,
    nome: `Test Name`,
    url: 'teste4.com',
  }
  const outputCreate = await sut.execute(inputSut)
  expect(outputCreate.id).toBeTruthy()
  expect(outputCreate.codigo).toBe(inputSut.codigo)
  expect(outputCreate.nome).toBe(inputSut.nome)
  expect(outputCreate.url).toBe(inputSut.url)
  // const inputGet = {
  //   id: outputCreate.id,
  // }
  // const outputGet = await getBankByIdUsecase.execute(inputGet)
  const bank = await bankRepository.findById(outputCreate.id)
  expect(bank?.getBankId()).toBe(outputCreate.id)
  expect(bank?.getCode()).toBe(inputSut.codigo)
  expect(bank?.getName()).toBe(inputSut.nome)
  expect(bank?.getUrl()).toBe(inputSut.url)
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
test('Não deve criar um banco com código repetido', async () => {
  const fakeCode = `${Math.random()}`.substring(2, 5)
  const inputCreate = {
    codigo: fakeCode,
    nome: 'Test Name',
    url: 'teste4.com',
  }
  const { id } = await sut.execute(inputCreate)
  await expect(sut.execute(inputCreate)).rejects.toThrow(
    'Já existe um banco com este código',
  )
  await bankDao.remove(id)
})
test('Não deve criar um banco com nome repetido', async () => {
  const fakeName = `Name ${Math.random()}`
  const firstInput = {
    codigo: '123',
    nome: fakeName,
    url: 'teste4.com',
  }
  const { id } = await sut.execute(firstInput)
  const secondInput = {
    codigo: '321',
    nome: firstInput.nome,
    url: firstInput.url,
  }
  await expect(sut.execute(secondInput)).rejects.toThrow(
    'Já existe um banco com este nome',
  )
  await bankDao.remove(id)
})
