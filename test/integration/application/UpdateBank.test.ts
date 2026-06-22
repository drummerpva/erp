import { BankDAO } from '@BankDAO.ts'
import { UpdateBank } from '@UpdateBank.ts'

import { BankDAOFake } from '../../mocks/BankDAOFake.ts'

let bankDAO: BankDAO
let sut: UpdateBank

beforeAll(() => {
  bankDAO = new BankDAOFake()
  // bankDAO = new BankDAODatabase()
  sut = new UpdateBank(bankDAO)
})

test('Deve alterar um banco', async () => {
  const inputCreate = {
    codigo: '553',
    nome: `Test Name`,
    url: 'teste4.com',
  }
  const bankId = await bankDAO.save(inputCreate)
  const inputUpdate = {
    id: bankId,
    codigo: '553',
    nome: 'Test Name Changed',
    url: 'teste4.changed.com',
  }
  const outputUpdate = await sut.execute(inputUpdate)
  expect(outputUpdate.id).toBe(bankId)
  expect(outputUpdate.codigo).toBe(inputUpdate.codigo)
  expect(outputUpdate.nome).toBe(inputUpdate.nome)
  expect(outputUpdate.url).toBe(inputUpdate.url)
  const outputGet = await bankDAO.getById(bankId)
  expect(outputGet).toBeTruthy()
  expect(outputGet?.BANCO_ID).toBe(bankId)
  expect(outputGet?.CODIGO).toBe(inputUpdate.codigo)
  expect(outputGet?.NOME).toBe(inputUpdate.nome)
  expect(outputGet?.URL).toBe(inputUpdate.url)
  await bankDAO.remove(bankId)
})
test.each([null, undefined, '', 'Test'])(
  'Não deve alterar um banco com nome inválido %s',
  async (rawName: any) => {
    const inputCreate = {
      codigo: '553',
      nome: `Test Name`,
      url: 'teste4.com',
    }
    const bankId = await bankDAO.save(inputCreate)
    const inputUpdate = {
      id: bankId,
      codigo: '553',
      nome: rawName,
      url: 'teste4.changed.com',
    }
    await expect(sut.execute(inputUpdate)).rejects.toThrow('Nome inválido')
    await bankDAO.remove(bankId)
  },
)
