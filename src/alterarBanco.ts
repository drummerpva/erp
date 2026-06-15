import { BankDAO } from '@BankDAO.ts'

export const alterarBanco = async (input: any) => {
  const bankDao = new BankDAO()
  const row = await bankDao.getById(Number(input.id))
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
  await bankDao.update(bankUpdated)
  return bankUpdated
}
