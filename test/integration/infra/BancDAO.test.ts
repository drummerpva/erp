import { BankDAO } from '@BankDAO.ts'

let bankDao: BankDAO

beforeAll(() => {
  bankDao = new BankDAO()
})

test.only('Deve testar o acesso ao banco', async () => {
  const bankId = await bankDao.save({
    codigo: '123',
    nome: 'nome',
    url: 'url',
  })
  const listBank = await bankDao.list()
  const exists = listBank.find((bankData) => bankData.BANCO_ID === bankId)
  expect(exists).toBeTruthy()
  expect(exists.CODIGO).toBe('123')
  expect(exists.NOME).toBe('nome')
  expect(exists.URL).toBe('url')
  await bankDao.update({
    id: bankId,
    codigo: '321',
    nome: 'alterado',
    url: 'alterado',
  })
  const bankUpdated = await bankDao.getById(bankId)
  expect(bankUpdated).toBeTruthy()
  expect(bankUpdated.CODIGO).toBe('321')
  expect(bankUpdated.NOME).toBe('alterado')
  expect(bankUpdated.URL).toBe('alterado')
  await bankDao.remove(bankId)
  const bankData = await bankDao.getById(bankId)
  expect(bankData).toBeFalsy()
})
