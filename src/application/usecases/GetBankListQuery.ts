import { BankDAOQuery } from '@application/dao/BankDAOQuery.ts'

import { UseCase } from './UseCase.ts'

export class GetBankListQuery implements UseCase<
  GetBankListQuery.Input,
  GetBankListQuery.Output
> {
  constructor(private bankDao: BankDAOQuery) {}

  async execute(): Promise<GetBankListQuery.Output> {
    const rows = await this.bankDao.list()
    return rows.map((row) => ({
      id: row.BANCO_ID,
      codigo: row.CODIGO,
      nome: row.NOME,
      url: row.URL,
    }))
  }
}

export namespace GetBankListQuery {
  export type Input = any
  export type Output = {
    id: number
    codigo: string
    nome: string
    url: string
  }[]
}
