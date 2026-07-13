import { Bank } from '@Bank.ts'
import { BankRepository } from '@BankRepository.ts'
import { UpdateBank } from '@UpdateBank.ts'

import { BankRepositoryFake } from '../../mocks/BankRepositoryFake.ts'

let bankRepository: BankRepository
let sut: UpdateBank

beforeAll(() => {
  bankRepository = new BankRepositoryFake()
  sut = new UpdateBank(bankRepository)
})

test('Deve alterar um banco', async () => {
  const bank = Bank.create({
    code: 'AAA',
    name: 'Any name',
    url: 'url',
  })
  const bankSaved = await bankRepository.save(bank)
  const bankId = bankSaved.getBankId()
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
  const bankUpdated = await bankRepository.findById(bankId)
  expect(bankUpdated).toBeTruthy()
  expect(bankUpdated?.getBankId()).toBe(bankId)
  expect(bankUpdated?.getCode()).toBe(inputUpdate.codigo)
  expect(bankUpdated?.getName()).toBe(inputUpdate.nome)
  expect(bankUpdated?.getUrl()).toBe(inputUpdate.url)
  await bankRepository.remove(bankId)
})
test.each([null, undefined, '', 'Test'])(
  'Não deve alterar um banco com nome inválido %s',
  async (rawName: any) => {
    const bank = Bank.create({
      code: 'AAA',
      name: 'Any name',
      url: 'url',
    })
    const bankSaved = await bankRepository.save(bank)
    const bankId = bankSaved.getBankId()
    const inputUpdate = {
      id: bankId,
      codigo: '553',
      nome: rawName,
      url: 'teste4.changed.com',
    }
    await expect(sut.execute(inputUpdate)).rejects.toThrow('Nome inválido')
    await bankRepository.remove(bankId)
  },
)
test.each(['', undefined, null, 'Test', '1', '01', 'ABC'])(
  'Não deve alterar um banco com código inválido %s',
  async (invalidCode: any) => {
    const bank = Bank.create({
      code: 'AAA',
      name: 'Any name',
      url: 'url',
    })
    const bankSaved = await bankRepository.save(bank)
    const bankId = bankSaved.getBankId()
    const inputUpdate = {
      id: bankId,
      codigo: invalidCode,
      nome: 'Test Name',
      url: 'teste4.changed.com',
    }
    await expect(sut.execute(inputUpdate)).rejects.toThrow('Código inválido')
    await bankRepository.remove(bankId)
  },
)
test('Não deve alterar um banco inexistente', async () => {
  const inputUpdate = {
    id: 9_999_999,
    codigo: '555',
    nome: 'Test Name',
    url: 'teste4.changed.com',
  }
  await expect(sut.execute(inputUpdate)).rejects.toThrow('Banco não encontrado')
})
test('Não deve alterar um banco para um código já existente', async () => {
  const firstBank = Bank.create({
    code: '553',
    name: 'Test Name',
    url: 'teste4.com',
  })
  const firstBankSaved = await bankRepository.save(firstBank)
  const firstBankId = firstBankSaved.getBankId()
  const secondBank = Bank.create({
    code: '554',
    name: 'Test Name',
    url: 'teste4.com',
  })
  const secondBankSaved = await bankRepository.save(secondBank)
  const secondBankId = secondBankSaved.getBankId()
  const inputUpdate = {
    id: firstBankId,
    codigo: '554',
    nome: 'Test Name Changed',
    url: 'teste4.changed.com',
  }
  await expect(sut.execute(inputUpdate)).rejects.toThrow(
    'Não é possível alterar o banco para um código já cadastrado',
  )

  await bankRepository.remove(firstBankId)
  await bankRepository.remove(secondBankId)
})
test('Não deve alterar um banco para um nome já existente', async () => {
  const firstBank = Bank.create({
    code: '553',
    name: 'Test Name',
    url: 'teste4.com',
  })
  const firstBankSaved = await bankRepository.save(firstBank)
  const firstBankId = firstBankSaved.getBankId()
  const secondBank = Bank.create({
    code: '553',
    name: 'Test Name Changed',
    url: 'teste4.com',
  })
  const secondBankSaved = await bankRepository.save(secondBank)
  const secondBankId = secondBankSaved.getBankId()
  const inputUpdate = {
    id: firstBankId,
    codigo: firstBankSaved.getCode(),
    nome: secondBankSaved.getName(),
    url: 'teste4.changed.com',
  }
  await expect(sut.execute(inputUpdate)).rejects.toThrow(
    'Não é possível alterar o banco para um nome já cadastrado',
  )

  await bankRepository.remove(firstBankId)
  await bankRepository.remove(secondBankId)
})
