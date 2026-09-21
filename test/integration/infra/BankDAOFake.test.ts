import { BankDAO } from '@infra/database/DAOs/BankDAO.ts'

import { BankDAOFake } from '../../mocks/BankDAOFake.ts'

let sut: BankDAO

beforeEach(() => {
  sut = new BankDAOFake()
})

test('Deve testar o acesso ao banco', async () => {
  const bankId = await sut.save({
    codigo: '123',
    nome: 'nome',
    url: 'url',
  })
  const listBank = await sut.list()
  const exists = listBank.find((bankData) => bankData.BANCO_ID === bankId)
  expect(exists).toBeTruthy()
  expect(exists?.CODIGO).toBe('123')
  expect(exists?.NOME).toBe('nome')
  expect(exists?.URL).toBe('url')
  await sut.update({
    id: bankId,
    codigo: '321',
    nome: 'alterado',
    url: 'alterado',
  })
  const bankUpdated = await sut.getById(bankId)
  expect(bankUpdated).toBeTruthy()
  expect(bankUpdated?.CODIGO).toBe('321')
  expect(bankUpdated?.NOME).toBe('alterado')
  expect(bankUpdated?.URL).toBe('alterado')
  await sut.remove(bankId)
  const bankData = await sut.getById(bankId)
  expect(bankData).toBeFalsy()
})
test('Deve retornar um banco pelo código', async () => {
  const bankId = await sut.save({
    codigo: '123',
    nome: 'nome',
    url: 'url',
  })
  const savedBank = await sut.getByCode('123')
  expect(savedBank).toBeTruthy()
  expect(savedBank!.BANCO_ID).toBe(bankId)
  expect(savedBank!.CODIGO).toBe('123')
  expect(savedBank!.NOME).toBe('nome')
  expect(savedBank!.URL).toBe('url')
  await sut.remove(bankId)
})
test('Deve retornar um banco pelo nome', async () => {
  const fakeName = `Name ${Math.random()}`
  const bankId = await sut.save({
    codigo: '123',
    nome: fakeName,
    url: 'url',
  })
  const savedBank = await sut.getByName(fakeName)
  expect(savedBank).toBeTruthy()
  expect(savedBank!.BANCO_ID).toBe(bankId)
  expect(savedBank!.CODIGO).toBe('123')
  expect(savedBank!.NOME).toBe(fakeName)
  expect(savedBank!.URL).toBe('url')
  await sut.remove(bankId)
})
test('Deve remover um banco pelo código', async () => {
  const fakeCode = `${Math.random()}`.substring(2, 5)
  await sut.save({
    codigo: fakeCode,
    nome: 'Test Bank',
    url: 'url',
  })
  await sut.removeByCode(fakeCode)
  const savedBank = await sut.getByCode(fakeCode)
  expect(savedBank).toBeFalsy()
})
test('Deve remover um banco pelo nome', async () => {
  const fakeName = `Name ${Math.random()}`
  const fakeCode = `${Math.random()}`.substring(2, 5)
  await sut.save({
    codigo: fakeCode,
    nome: fakeName,
    url: 'url',
  })
  await sut.removeByName(fakeName)
  const savedBank = await sut.getByName(fakeName)
  expect(savedBank).toBeFalsy()
})
