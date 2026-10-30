import { ApplicationError } from '@application/errors/ApplicationError.ts'
import { BankDAOTypeorm } from '@external/database/DAOs/typeorm/BankDAOTypeorm.ts'
import { typeormDatasourceFactory } from '@external/database/DAOs/typeorm/factory.ts'
import { MysqlAdapter } from '@external/database/MysqlAdapter.ts'
import { BankDAO } from '@infra/database/DAOs/BankDAO.ts'
import { DatabaseConnection } from '@infra/database/DatabaseConnection.ts'
import { DataSource } from 'typeorm'

let sut: BankDAO
let connection: DatabaseConnection
let datasource: DataSource

beforeAll(async () => {
  connection = new MysqlAdapter(String(process.env.DATABASE_URL))
  datasource = await typeormDatasourceFactory(String(process.env.DATABASE_URL))
  sut = new BankDAOTypeorm(datasource)
})
afterAll(async () => {
  await connection.close()
  await datasource.destroy()
})

test('Deve testar o acesso ao banco', async () => {
  const bankId = await sut.save({
    codigo: '123',
    nome: 'Test Bank',
    url: 'url',
  })
  const listBank = await sut.list()
  const exists = listBank.find((bankData) => bankData.BANCO_ID === bankId)
  expect(exists).toBeTruthy()
  expect(exists!.CODIGO).toBe('123')
  expect(exists!.NOME).toBe('Test Bank')
  expect(exists!.URL).toBe('url')
  await sut.update({
    id: bankId,
    codigo: '321',
    nome: 'Test Bank Updated',
    url: 'alterado',
  })
  const bankUpdated = await sut.getById(bankId)
  expect(bankUpdated).toBeTruthy()
  expect(bankUpdated!.CODIGO).toBe('321')
  expect(bankUpdated!.NOME).toBe('Test Bank Updated')
  expect(bankUpdated!.URL).toBe('alterado')
  await sut.remove(bankId)
  const bankData = await sut.getById(bankId)
  expect(bankData).toBeFalsy()
})
test('Deve retornar um banco pelo código', async () => {
  const fakeCode = `${Math.random()}`.substring(2, 5)
  await connection.query(`DELETE FROM banco WHERE CODIGO = ? `, [fakeCode])
  const bankId = await sut.save({
    codigo: fakeCode,
    nome: 'Test Bank',
    url: 'url',
  })
  const savedBank = await sut.getByCode(fakeCode)
  expect(savedBank).toBeTruthy()
  expect(savedBank!.BANCO_ID).toBe(bankId)
  expect(savedBank!.CODIGO).toBe(fakeCode)
  expect(savedBank!.NOME).toBe('Test Bank')
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
test('Deve lançar um erro se o bankId não for um número ao remover um banco ', async () => {
  await expect(sut.remove('asd' as any)).rejects.toThrow(
    new ApplicationError('ID do Banco informado é inválido'),
  )
})
