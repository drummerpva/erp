import { ApplicationError } from '@application/errors/ApplicationError.ts'
import { BankDAO } from '@infra/database/DAOs/BankDAO.ts'
import { DataSource, Repository } from 'typeorm'

import { BankTypeormPersistenceModel } from './BankTypeormPersistenceModel.ts'

export class BankDAOTypeorm implements BankDAO {
  private respository: Repository<BankTypeormPersistenceModel>
  constructor(datasource: DataSource) {
    this.respository = datasource.getRepository(BankTypeormPersistenceModel)
  }

  async save(dto: BankDAO.SaveDTO): Promise<number> {
    const bankModel = new BankTypeormPersistenceModel()
    bankModel.code = dto.codigo
    bankModel.name = dto.nome
    bankModel.url = dto.url
    const savedBankModel = await this.respository.save(bankModel)
    return savedBankModel.bankId
  }

  async list(): Promise<BankDAO.BankDTO[]> {
    const bankModelList = await this.respository.find()
    return bankModelList.map((bankModel) => ({
      BANCO_ID: bankModel.bankId,
      CODIGO: bankModel.code,
      NOME: bankModel.name,
      URL: bankModel.url,
    }))
  }

  async remove(bankId: number): Promise<void> {
    if (isNaN(bankId))
      throw new ApplicationError('ID do Banco informado é inválido')
    await this.respository.delete({
      bankId,
    })
  }

  async getById(bankId: number): Promise<BankDAO.BankDTO | undefined> {
    const bankModel = await this.respository.findOne({
      where: {
        bankId,
      },
    })
    if (!bankModel) return
    return {
      BANCO_ID: bankModel.bankId,
      CODIGO: bankModel.code,
      NOME: bankModel.name,
      URL: bankModel.url,
    }
  }

  async getByCode(code: string): Promise<BankDAO.BankDTO | undefined> {
    const bankModel = await this.respository.findOne({
      where: {
        code,
      },
    })
    if (!bankModel) return
    return {
      BANCO_ID: bankModel.bankId,
      CODIGO: bankModel.code,
      NOME: bankModel.name,
      URL: bankModel.url,
    }
  }

  async getByName(name: string): Promise<BankDAO.BankDTO | undefined> {
    const bankModel = await this.respository.findOne({
      where: {
        name,
      },
    })
    if (!bankModel) return
    return {
      BANCO_ID: bankModel.bankId,
      CODIGO: bankModel.code,
      NOME: bankModel.name,
      URL: bankModel.url,
    }
  }

  async update(dto: BankDAO.UpdateDTO): Promise<void> {
    const bankModel = new BankTypeormPersistenceModel()
    bankModel.bankId = dto.id
    bankModel.code = dto.codigo
    bankModel.name = dto.nome
    bankModel.url = dto.url
    await this.respository.save(bankModel)
  }
}
