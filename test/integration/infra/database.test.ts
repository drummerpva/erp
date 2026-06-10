import { getById, list, remove, save, update } from '@database.ts'

test('Deve testar o acesso ao banco', async () => {
  const bankId = await save({
    codigo: '123',
    nome: 'nome',
    url: 'url',
  })
  const listBank = await list()
  const exists = listBank.find((bankData) => bankData.BANCO_ID === bankId)
  expect(exists).toBeTruthy()
  expect(exists.CODIGO).toBe('123')
  expect(exists.NOME).toBe('nome')
  expect(exists.URL).toBe('url')
  await update({
    id: bankId,
    codigo: '321',
    nome: 'alterado',
    url: 'alterado',
  })
  const bankUpdated = await getById(bankId)
  expect(bankUpdated).toBeTruthy()
  expect(bankUpdated.CODIGO).toBe('321')
  expect(bankUpdated.NOME).toBe('alterado')
  expect(bankUpdated.URL).toBe('alterado')
  await remove(bankId)
  const bankData = await getById(bankId)
  expect(bankData).toBeFalsy()
})
