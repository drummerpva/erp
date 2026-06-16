import { BankDAO } from '@BankDAO.ts'
import { RemoveBank } from '@RemoveBank.ts'

import { BankDAOFake } from '../../mocks/BankDAOFake.ts'

let bankDao: BankDAO
let sut: RemoveBank

beforeAll(() => {
  bankDao = new BankDAOFake()
  sut = new RemoveBank(bankDao)
})

test('Deve deletar um banco', async () => {
  const inputCreate = {
    codigo: '551',
    nome: `Test Name Delete`,
    url: 'teste_delete.com',
  }
  const bankId = await bankDao.save(inputCreate)
  const inputSut = {
    id: bankId,
  }
  await sut.execute(inputSut)
  const existsBank = await bankDao.getById(bankId)
  expect(existsBank).toBeFalsy()
})
