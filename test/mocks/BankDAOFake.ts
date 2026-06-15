import { BankDAO } from '@BankDAO.ts'

export class BankDAOFake implements BankDAO {
  private bankList: any[]
  constructor() {
    this.bankList = []
  }

  async save(dto: any): Promise<number> {
    const newId = this.bankList.length + 1
    this.bankList.push({ BANCO_ID: newId, ...dto })
    return newId
  }

  async list(): Promise<any[]> {
    return this.bankList
  }

  async remove(bankId: number): Promise<void> {
    this.bankList = this.bankList.filter(
      (bankData) => bankData.BANCO_ID !== bankId,
    )
  }

  async getById(bankId: number): Promise<any> {
    return this.bankList.find((bankData) => bankData.BANCO_ID === bankId)
  }

  async update(dto: any): Promise<void> {
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
