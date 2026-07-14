import { validateBankName } from '@validateBankName.ts'

test.each(['', undefined, null, 'Test'])(
  "Deve retornar false se o nome '%s' for inválido",
  (invalidName: any) => {
    const isValid = validateBankName(invalidName)
    expect(isValid).toBe(false)
  },
)
test('Deve retornar true se o nome for valido', () => {
  const validName = 'Banco Test'
  const isValid = validateBankName(validName)
  expect(isValid).toBe(true)
})
