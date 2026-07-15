import { Bank } from '@Bank.ts'
import { DomainError } from '@DomainError.ts'

test('Deve criar um banco', () => {
  const instance = Bank.create({
    name: 'Any Name',
    code: '123',
    url: 'url',
  })
  expect(instance).toBeTruthy()
  expect(instance.getBankId()).toBeDefined()
  expect(instance.getName()).toBe('Any Name')
  expect(instance.getCode()).toBe('123')
  expect(instance.getUrl()).toBe('url')
})
test('Deve restaurar um banco', () => {
  const instance = Bank.restore({
    bankId: 1,
    name: 'Any Name',
    code: '123',
    url: 'url',
  })
  expect(instance).toBeTruthy()
  expect(instance.getBankId()).toBe(1)
  expect(instance.getName()).toBe('Any Name')
  expect(instance.getCode()).toBe('123')
  expect(instance.getUrl()).toBe('url')
})
test('Deve alterar propriedades do banco', () => {
  const instance = Bank.restore({
    bankId: 1,
    name: 'Any Name',
    code: '123',
    url: 'url',
  })
  instance.changeCode('321')
  instance.changeName('Other Name')
  instance.setUrl('other_url')
  expect(instance).toBeTruthy()
  expect(instance.getName()).toBe('Other Name')
  expect(instance.getCode()).toBe('321')
  expect(instance.getUrl()).toBe('other_url')
})
test('Não deve criar um banco com nome inválido', () => {
  const invalidName = 'abc'
  expect(() =>
    Bank.create({
      name: invalidName,
      code: '123',
      url: 'url',
    }),
  ).toThrow(new DomainError('Nome inválido'))
})
test('Não deve criar um banco com código inválido', () => {
  const invalidCode = 'abc'
  expect(() =>
    Bank.create({
      name: 'Banco Test',
      code: invalidCode,
      url: 'url',
    }),
  ).toThrow(new DomainError('Código inválido'))
})
test('Não deve mudar o nome se ele for inválido', () => {
  const instance = Bank.create({
    code: '123',
    name: 'Test Name',
    url: 'any_url',
  })
  const invalidName = 'abc'
  expect(() => instance.changeName(invalidName)).toThrow(
    new DomainError('Nome inválido'),
  )
})
test('Não deve mudar o código se ele for inválido', () => {
  const instance = Bank.create({
    code: '123',
    name: 'Test Name',
    url: 'any_url',
  })
  const invalidCode = 'abc'
  expect(() => instance.changeCode(invalidCode)).toThrow(
    new DomainError('Código inválido'),
  )
})
