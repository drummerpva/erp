import { Bank } from '@Bank.ts'
import { BankRepository, BankRepositoryDatabase } from '@BankRepository.ts'
import mysqlConnection from 'mysql2/promise'

let sut: BankRepository
const connection = mysqlConnection.createPool(String(process.env.DATABASE_URL))

beforeAll(() => {
  sut = new BankRepositoryDatabase()
})
afterAll(() => {
  connection.pool.end()
})

test('Deve testar o acesso ao banco', async () => {
  const bank = Bank.create({
    code: '123',
    name: 'Test Bank',
    url: 'url',
  })
  const bankSaved = await sut.save(bank)
  const bankId = bankSaved.getBankId()
  const listBank = await sut.list()
  const exists = listBank.find((bank) => bank.getBankId() === bankId)
  expect(exists).toBeTruthy()
  expect(exists!.getCode()).toBe('123')
  expect(exists!.getName()).toBe('Test Bank')
  expect(exists!.getUrl()).toBe('url')
  bankSaved.changeCode('321')
  bankSaved.changeName('Test Bank Updated')
  bankSaved.setUrl('alterado')
  await sut.update(bankSaved)
  const bankUpdated = await sut.findById(bankId)
  expect(bankUpdated).toBeTruthy()
  expect(bankUpdated!.getCode()).toBe('321')
  expect(bankUpdated!.getName()).toBe('Test Bank Updated')
  expect(bankUpdated!.getUrl()).toBe('alterado')
  await sut.remove(bankId)
  const bankData = await sut.findById(bankId)
  expect(bankData).toBeFalsy()
})
test('Deve retornar um banco pelo código', async () => {
  const fakeCode = `${Math.random()}`.substring(2, 5)
  await connection.query(`DELETE FROM banco WHERE CODIGO = ? `, [fakeCode])
  const bank = Bank.create({
    code: fakeCode,
    name: 'Test Bank',
    url: 'url',
  })
  const bankSaved = await sut.save(bank)
  const bankId = bankSaved.getBankId()
  const savedBank = await sut.findByCode(fakeCode)
  expect(savedBank).toBeTruthy()
  expect(savedBank!.getBankId()).toBe(bankId)
  expect(savedBank!.getCode()).toBe(fakeCode)
  expect(savedBank!.getName()).toBe('Test Bank')
  expect(savedBank!.getUrl()).toBe('url')
  await sut.remove(bankId)
})
test('Deve retornar um banco pelo nome', async () => {
  const fakeName = `Name ${Math.random()}`
  const bank = Bank.create({
    code: '123',
    name: fakeName,
    url: 'url',
  })
  const bankSaved = await sut.save(bank)
  const bankId = bankSaved.getBankId()
  const savedBank = await sut.findByName(fakeName)
  expect(savedBank).toBeTruthy()
  expect(savedBank!.getBankId()).toBe(bankId)
  expect(savedBank!.getCode()).toBe('123')
  expect(savedBank!.getName()).toBe(fakeName)
  expect(savedBank!.getUrl()).toBe('url')
  await sut.remove(bankId)
})
test('Deve lançar um erro se o bankId não for um número ao remover um banco ', async () => {
  await expect(sut.remove('asd' as any)).rejects.toThrow(
    'ID do Banco informado é inválido',
  )
})
