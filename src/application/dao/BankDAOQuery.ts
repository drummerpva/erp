export interface BankDAOQuery {
  list(): Promise<BankDAOQuery.BankDTO[]>
}

export namespace BankDAOQuery {
  export type BankDTO = {
    BANCO_ID: number
    CODIGO: string
    NOME: string
    URL: string
  }
}
