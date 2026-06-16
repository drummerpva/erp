import { BankDAO } from '@BankDAO.ts'
import { GetBankList } from '@GetBankList.ts'

import { BankDAOFake } from '../../mocks/BankDAOFake.ts'

let bankDao: BankDAO
let sut: GetBankList

beforeAll(() => {
  bankDao = new BankDAOFake()
  sut = new GetBankList(bankDao)
})

test('Deve retornar a lista de bancos (GET /banco)', async () => {
  const inputCreate = {
    codigo: '559',
    nome: `Test List`,
    url: 'teste_list.com',
  }
  const bankId = await bankDao.save(inputCreate)
  const output = await sut.execute()
  expect(output).toBeInstanceOf(Array)
  expect(output.length).toBeGreaterThanOrEqual(1)
  const bankData = output.find((item) => item.id === bankId)
  expect(bankData).toBeTruthy()
  expect(bankData.id).toBe(bankId)
  expect(bankData.codigo).toBe(inputCreate.codigo)
  expect(bankData.nome).toBe(inputCreate.nome)
  expect(bankData.url).toBe(inputCreate.url)
  await bankDao.remove(bankId)
})
