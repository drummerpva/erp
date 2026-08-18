import { ApplicationError } from '@application/errors/ApplicationError.ts'
import { BankDAO } from '@infra/database/DAOs/BankDAO.ts'

import { PrismaClient } from './generated/client.ts'

export class BankDAOPrisma implements BankDAO {
  constructor(private prismaClient: PrismaClient) {}
  async save(dto: BankDAO.SaveDTO): Promise<number> {
    const savedBankModel =
      await this.prismaClient.bankPrismaPersistenceModel.create({
        data: {
          name: dto.nome,
          code: dto.codigo,
          url: dto.url,
        },
      })
    return savedBankModel.bankId
  }

  async list(): Promise<BankDAO.BankDTO[]> {
    const bankModelList =
      await this.prismaClient.bankPrismaPersistenceModel.findMany()
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
    await this.prismaClient.bankPrismaPersistenceModel.delete({
      where: {
        bankId,
      },
    })
  }

  async getById(bankId: number): Promise<BankDAO.BankDTO | undefined> {
    const bankModel =
      await this.prismaClient.bankPrismaPersistenceModel.findFirst({
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
    const bankModel =
      await this.prismaClient.bankPrismaPersistenceModel.findFirst({
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
    const bankModel =
      await this.prismaClient.bankPrismaPersistenceModel.findFirst({
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
    await this.prismaClient.bankPrismaPersistenceModel.update({
      data: {
        code: dto.codigo,
        name: dto.nome,
        url: dto.url,
      },
      where: {
        bankId: dto.id,
      },
    })
  }
}
