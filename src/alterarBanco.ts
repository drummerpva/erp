import { getById, update } from '@database.ts'

export const alterarBanco = async (input: any) => {
  const row = await getById(Number(input.id))
  const output = {
    id: row.BANCO_ID,
    codigo: row.CODIGO,
    nome: row.NOME,
    url: row.URL,
  }
  const bankUpdated = {
    ...output,
    ...input,
  }
  await update(bankUpdated)
  return bankUpdated
}
