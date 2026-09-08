import { BankCode } from '@domain/entities/BankCode.ts'
import { DomainError } from '@domain/errors/DomainError.ts'

test.each(['', undefined, null, 'Test', '1', '01', 'ABC'])(
  "Deve lançar um erro se o codigo '%s' for inválido",
  (invalidCode: any) => {
    expect(() => new BankCode(invalidCode)).toThrow(
      new DomainError('Código inválido'),
    )
  },
)
test('Deve instanciar a classe se o codigo é válido', () => {
  const validCode = '123'
  const instance = new BankCode(validCode)
  expect(instance).toBeTruthy()
  expect(instance.getValue()).toBe(validCode)
})
