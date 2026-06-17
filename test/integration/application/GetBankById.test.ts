import { BankDAO } from '@BankDAO.ts'
import { GetBankById } from '@GetBankById.ts'

import { BankDAOFake } from '../../mocks/BankDAOFake.ts'

let bankDao: BankDAO
let sut: GetBankById

beforeAll(() => {
  bankDao = new BankDAOFake()
  sut = new GetBankById(bankDao)
})

test('Deve retornar um banco pelo ID', async () => {
  const inputCreate = {
    codigo: '559',
    nome: `Test get one`,
    url: 'teste_one.com',
  }
  const bankId = await bankDao.save(inputCreate)
  const inputSut = {
    id: bankId,
  }
  const output = await sut.execute(inputSut)
  expect(output?.id).toBe(bankId)
  expect(output?.codigo).toBe(inputCreate.codigo)
  expect(output?.nome).toBe(inputCreate.nome)
  expect(output?.url).toBe(inputCreate.url)
  await bankDao.remove(bankId)
})
