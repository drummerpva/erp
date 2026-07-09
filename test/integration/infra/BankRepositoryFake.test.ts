import { Bank } from '@Bank.ts'
import { BankRepository } from '@BankRepository.ts'

import { BankRepositoryFake } from '../../mocks/BankRepositoryFake.ts'

let sut: BankRepository

beforeEach(() => {
  sut = new BankRepositoryFake()
})

test('Deve testar o acesso ao banco', async () => {
  const bank = Bank.create({
    code: '123',
    name: 'nome',
    url: 'url',
  })
  const bankSaved = await sut.save(bank)
  const listBank = await sut.list()
  const exists = listBank.find(
    (bank) => bank.getBankId() === bankSaved.getBankId(),
  )
  expect(exists).toBeTruthy()
  expect(exists?.getCode()).toBe('123')
  expect(exists?.getName()).toBe('nome')
  expect(exists?.getUrl()).toBe('url')
  bankSaved.setCode('321')
  bankSaved.setName('alterado')
  bankSaved.setUrl('alterado')
  await sut.update(bankSaved)
  const bankUpdated = await sut.findById(bankSaved.getBankId())
  expect(bankUpdated).toBeTruthy()
  expect(bankUpdated?.getCode()).toBe('321')
  expect(bankUpdated?.getName()).toBe('alterado')
  expect(bankUpdated?.getUrl()).toBe('alterado')
  await sut.remove(bankSaved.getBankId())
  const bankData = await sut.findById(bankSaved.getBankId())
  expect(bankData).toBeFalsy()
})
test('Deve retornar um banco pelo código', async () => {
  const bank = Bank.create({
    code: '123',
    name: 'nome',
    url: 'url',
  })
  const bankSaved = await sut.save(bank)
  const savedBank = await sut.findByCode('123')
  expect(savedBank).toBeTruthy()
  expect(savedBank!.getBankId()).toBe(bankSaved.getBankId())
  expect(savedBank!.getCode()).toBe('123')
  expect(savedBank!.getName()).toBe('nome')
  expect(savedBank!.getUrl()).toBe('url')
  await sut.remove(bankSaved.getBankId())
})
test('Deve retornar um banco pelo nome', async () => {
  const fakeName = `Name ${Math.random()}`
  const bank = Bank.create({
    code: '123',
    name: fakeName,
    url: 'url',
  })
  const bankSaved = await sut.save(bank)
  const savedBank = await sut.findByName(fakeName)
  expect(savedBank).toBeTruthy()
  expect(savedBank!.getBankId()).toBe(bankSaved.getBankId())
  expect(savedBank!.getCode()).toBe('123')
  expect(savedBank!.getName()).toBe(fakeName)
  expect(savedBank!.getUrl()).toBe('url')
  await sut.remove(bankSaved.getBankId())
})
