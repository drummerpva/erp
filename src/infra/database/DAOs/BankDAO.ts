export interface BankDAO {
  save(dto: BankDAO.SaveDTO): Promise<number>
  list(): Promise<BankDAO.BankDTO[]>
  remove(bankId: number): Promise<void>
  removeByCode(code: string): Promise<void>
  removeByName(name: string): Promise<void>
  getById(bankId: number): Promise<BankDAO.BankDTO | undefined>
  getByCode(code: string): Promise<BankDAO.BankDTO | undefined>
  getByName(name: string): Promise<BankDAO.BankDTO | undefined>
  update(dto: BankDAO.UpdateDTO): Promise<void>
}
export namespace BankDAO {
  export type SaveDTO = {
    codigo: string
    nome: string
    url: string
  }
  export type UpdateDTO = {
    id: number
    codigo: string
    nome: string
    url: string
  }
  export type BankDTO = {
    BANCO_ID: number
    CODIGO: string
    NOME: string
    URL: string
  }
}
