import { Agency } from '@domain/entities/Agency.ts'

test('Deve criar uma agencia', () => {
  const instance = Agency.create({
    name: 'Any Name',
    number: '1234',
    digit: '1',
    phone: '44944332211',
    contact: 'Any Contact',
    manager: 'Any Manager',
    obs: 'Any Obs',
    bankId: 123,
  })
  expect(instance).toBeTruthy()
  expect(instance).toBeInstanceOf(Agency)
  expect(instance.getAgencyId()).toBe(0)
  expect(instance.getName()).toBe('Any Name')
  expect(instance.getNumber()).toBe('1234')
  expect(instance.getDigit()).toBe('1')
  expect(instance.getPhone()).toBe('44944332211')
  expect(instance.getContact()).toBe('Any Contact')
  expect(instance.getManager()).toBe('Any Manager')
  expect(instance.getObs()).toBe('Any Obs')
  expect(instance.getBankId()).toBe(123)
})
test('Deve restaurar uma agencia', () => {
  const instance = Agency.restore({
    agencyId: 321,
    name: 'Any Name',
    number: '1234',
    digit: '1',
    phone: '44944332211',
    contact: 'Any Contact',
    manager: 'Any Manager',
    obs: 'Any Obs',
    bankId: 123,
  })
  expect(instance).toBeTruthy()
  expect(instance).toBeInstanceOf(Agency)
  expect(instance.getAgencyId()).toBe(321)
  expect(instance.getName()).toBe('Any Name')
  expect(instance.getNumber()).toBe('1234')
  expect(instance.getDigit()).toBe('1')
  expect(instance.getPhone()).toBe('44944332211')
  expect(instance.getContact()).toBe('Any Contact')
  expect(instance.getManager()).toBe('Any Manager')
  expect(instance.getObs()).toBe('Any Obs')
  expect(instance.getBankId()).toBe(123)
})
