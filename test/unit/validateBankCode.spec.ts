import { validateBankCode } from '@validateBankCode.ts'

test.each(['', undefined, null, 'Test', '1', '01', 'ABC'])(
  "Deve retornar falso se o codigo '%s' for inválido",
  (invalidCode: any) => {
    const isValid = validateBankCode(invalidCode)
    expect(isValid).toBe(false)
  },
)
test('Deve retornar verdadeiro se o codigo válido', () => {
  const validCode = '123'
  const isValid = validateBankCode(validCode)
  expect(isValid).toBe(true)
})
