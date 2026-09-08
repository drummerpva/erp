import { BankName } from '@domain/entities/BankName.ts'
import { DomainError } from '@domain/errors/DomainError.ts'

test.each(['', undefined, null, 'Test'])(
  "Deve lançar erro se o nome '%s' for inválido",
  (invalidName: any) => {
    expect(() => new BankName(invalidName)).toThrow(
      new DomainError('Nome inválido'),
    )
  },
)
test('Deve retornar true se o nome for valido', () => {
  const validName = 'Banco Test'
  const instance = new BankName(validName)
  expect(instance).toBeTruthy()
  expect(instance.getValue()).toBe(validName)
})
