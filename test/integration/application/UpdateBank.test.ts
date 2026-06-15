import { BankDAO } from '@BankDAO.ts'
import { UpdateBank } from '@UpdateBank.ts'
import Sinon from 'sinon'

let bankDAO: BankDAO
let sut: UpdateBank

beforeAll(() => {
  bankDAO = new BankDAO()
  sut = new UpdateBank(bankDAO)
})
afterEach(() => {
  Sinon.restore()
})

test('Deve alterar um banco', async () => {
  const inputCreate = {
    codigo: '553',
    nome: `Test Name`,
    url: 'teste4.com',
  }
  const bankIdTest = 1
  Sinon.stub(bankDAO, 'save').resolves(bankIdTest)
  const bankId = await bankDAO.save(inputCreate)
  const inputUpdate = {
    id: bankId,
    codigo: '553',
    nome: 'Test Name Changed',
    url: 'teste4.changed.com',
  }
  const getByIdStub = Sinon.stub(bankDAO, 'getById').resolves({
    BANCO_ID: bankIdTest,
    NOME: '',
    CODIGO: '',
    URL: '',
  })
  Sinon.stub(bankDAO, 'update').resolves()
  const outputUpdate = await sut.execute(inputUpdate)
  expect(outputUpdate.id).toBe(bankId)
  expect(outputUpdate.codigo).toBe(inputUpdate.codigo)
  expect(outputUpdate.nome).toBe(inputUpdate.nome)
  expect(outputUpdate.url).toBe(inputUpdate.url)
  getByIdStub.resolves({
    BANCO_ID: bankId,
    CODIGO: '553',
    NOME: 'Test Name Changed',
    URL: 'teste4.changed.com',
  })
  const outputGet = await bankDAO.getById(bankId)
  expect(outputGet).toBeTruthy()
  expect(outputGet.BANCO_ID).toBe(bankId)
  expect(outputGet.CODIGO).toBe(inputUpdate.codigo)
  expect(outputGet.NOME).toBe(inputUpdate.nome)
  expect(outputGet.URL).toBe(inputUpdate.url)
  Sinon.stub(bankDAO, 'remove').resolves()
  await bankDAO.remove(bankId)
})
