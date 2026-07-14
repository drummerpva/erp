import { Bank } from '@Bank.ts'

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
  instance.setCode('321')
  instance.setName('Other Name')
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
  ).toThrow('Nome inválido')
})
test('Não deve criar um banco com código inválido', () => {
  const invalidCode = 'abc'
  expect(() =>
    Bank.create({
      name: 'Banco Test',
      code: invalidCode,
      url: 'url',
    }),
  ).toThrow('Código inválido')
})
