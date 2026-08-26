import { ApplicationError } from '@application/errors/ApplicationError.ts'
import { BankDAO } from '@infra/database/DAOs/BankDAO.ts'
import { Collection, MongoClient } from 'mongodb'

import { BankMongoPersistenceModel } from './persistenceModels.ts'

export class BankDAOMongo implements BankDAO {
  private collection: Collection<BankMongoPersistenceModel>
  constructor(mongoClient: MongoClient) {
    this.collection = mongoClient
      .db()
      .collection<BankMongoPersistenceModel>('banco')
  }

  async save(dto: BankDAO.SaveDTO): Promise<number> {
    const lastBank = await this.collection.findOne(
      {},
      {
        sort: { _id: -1 },
      },
    )
    const bancoId = (lastBank?._id ?? 0) + 1
    await this.collection.insertOne({
      _id: bancoId,
      codigo: dto.codigo,
      nome: dto.nome,
      url: dto.url,
    })
    return bancoId
  }

  async list(): Promise<BankDAO.BankDTO[]> {
    const bankModelList = await this.collection.find({}).toArray()
    return bankModelList.map((bankModel) => ({
      BANCO_ID: bankModel._id,
      CODIGO: bankModel.codigo,
      NOME: bankModel.nome,
      URL: bankModel.url,
    }))
  }

  async remove(bankId: number): Promise<void> {
    if (isNaN(bankId))
      throw new ApplicationError('ID do Banco informado é inválido')
    await this.collection.deleteOne({
      _id: bankId,
    })
  }

  async removeByCode(code: string): Promise<void> {
    await this.collection.deleteOne({
      codigo: code,
    })
  }

  async removeByName(name: string): Promise<void> {
    await this.collection.deleteOne({
      nome: name,
    })
  }

  async getById(bankId: number): Promise<BankDAO.BankDTO | undefined> {
    const bankModel = await this.collection.findOne({
      _id: bankId,
    })
    if (!bankModel) return
    return {
      BANCO_ID: bankModel._id,
      CODIGO: bankModel.codigo,
      NOME: bankModel.nome,
      URL: bankModel.url,
    }
  }

  async getByCode(code: string): Promise<BankDAO.BankDTO | undefined> {
    const bankModel = await this.collection.findOne({
      codigo: code,
    })
    if (!bankModel) return
    return {
      BANCO_ID: bankModel._id,
      CODIGO: bankModel.codigo,
      NOME: bankModel.nome,
      URL: bankModel.url,
    }
  }

  async getByName(name: string): Promise<BankDAO.BankDTO | undefined> {
    const bankModel = await this.collection.findOne({
      nome: name,
    })
    if (!bankModel) return
    return {
      BANCO_ID: bankModel._id,
      CODIGO: bankModel.codigo,
      NOME: bankModel.nome,
      URL: bankModel.url,
    }
  }

  async update(dto: BankDAO.UpdateDTO): Promise<void> {
    await this.collection.updateOne(
      {
        _id: dto.id,
      },
      {
        $set: {
          codigo: dto.codigo,
          nome: dto.nome,
          url: dto.url,
        },
      },
    )
  }
}
