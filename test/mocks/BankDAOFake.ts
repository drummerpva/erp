import { BankDAO } from '@BankDAO.ts'

export class BankDAOFake implements BankDAO {
  private bankList: BankDAO.BankDTO[]
  constructor() {
    this.bankList = []
  }

  async save(dto: BankDAO.SaveDTO): Promise<number> {
    const newId = this.bankList.length + 1
    this.bankList.push({
      BANCO_ID: newId,
      CODIGO: dto.codigo,
      NOME: dto.nome,
      URL: dto.url,
    })
    return newId
  }

  async list(): Promise<BankDAO.BankDTO[]> {
    return this.bankList
  }

  async remove(bankId: number): Promise<void> {
    this.bankList = this.bankList.filter(
      (bankData) => bankData.BANCO_ID !== bankId,
    )
  }

  async getById(bankId: number): Promise<BankDAO.BankDTO | undefined> {
    return this.bankList.find((bankData) => bankData.BANCO_ID === bankId)
  }

  async getByCode(code: string): Promise<BankDAO.BankDTO | undefined> {
    return this.bankList.find((bankData) => bankData.CODIGO === code)
  }

  async update(dto: BankDAO.UpdateDTO): Promise<void> {
    this.bankList = this.bankList.map((bankData) => {
      if (bankData.BANCO_ID === dto.id) {
        return {
          BANCO_ID: dto.id,
          CODIGO: dto.codigo ?? bankData.CODIGO,
          NOME: dto.nome ?? bankData.NOME,
          URL: dto.url ?? bankData.URL,
        }
      }
      return bankData
    })
  }
}
