import { ApplicationError } from '@application/errors/ApplicationError.ts'
import { BankDAO } from '@infra/database/DAOs/BankDAO.ts'
import { eq } from 'drizzle-orm'
import { MySql2Database } from 'drizzle-orm/mysql2'

import { bankDrizzlePersistenceModel } from './schema.ts'

export class BankDAODrizzle implements BankDAO {
  constructor(private dataSource: MySql2Database) {}
  async save(dto: BankDAO.SaveDTO): Promise<number> {
    const [bankInsertedModel] = await this.dataSource
      .insert(bankDrizzlePersistenceModel)
      .values({
        code: dto.codigo,
        name: dto.nome,
        url: dto.url,
      })
      .$returningId()
    return bankInsertedModel.bankId
  }

  async list(): Promise<BankDAO.BankDTO[]> {
    const bankModelList = await this.dataSource
      .select()
      .from(bankDrizzlePersistenceModel)
    return bankModelList.map((bankModel) => ({
      BANCO_ID: bankModel.bankId,
      CODIGO: bankModel.code!,
      NOME: bankModel.name!,
      URL: bankModel.url!,
    }))
  }

  async remove(bankId: number): Promise<void> {
    if (isNaN(bankId))
      throw new ApplicationError('ID do Banco informado é inválido')
    await this.dataSource
      .delete(bankDrizzlePersistenceModel)
      .where(eq(bankDrizzlePersistenceModel.bankId, bankId))
  }

  async getById(bankId: number): Promise<BankDAO.BankDTO | undefined> {
    const [bankModel] = await this.dataSource
      .select()
      .from(bankDrizzlePersistenceModel)
      .where(eq(bankDrizzlePersistenceModel.bankId, bankId))
    if (!bankModel) return
    return {
      BANCO_ID: bankModel.bankId,
      CODIGO: bankModel.code!,
      NOME: bankModel.name!,
      URL: bankModel.url!,
    }
  }

  async getByCode(code: string): Promise<BankDAO.BankDTO | undefined> {
    const [bankModel] = await this.dataSource
      .select()
      .from(bankDrizzlePersistenceModel)
      .where(eq(bankDrizzlePersistenceModel.code, code))
    if (!bankModel) return
    return {
      BANCO_ID: bankModel.bankId,
      CODIGO: bankModel.code!,
      NOME: bankModel.name!,
      URL: bankModel.url!,
    }
  }

  async getByName(name: string): Promise<BankDAO.BankDTO | undefined> {
    const [bankModel] = await this.dataSource
      .select()
      .from(bankDrizzlePersistenceModel)
      .where(eq(bankDrizzlePersistenceModel.name, name))
    if (!bankModel) return
    return {
      BANCO_ID: bankModel.bankId,
      CODIGO: bankModel.code!,
      NOME: bankModel.name!,
      URL: bankModel.url!,
    }
  }

  async update(dto: BankDAO.UpdateDTO): Promise<void> {
    await this.dataSource
      .update(bankDrizzlePersistenceModel)
      .set({
        name: dto.nome,
        code: dto.codigo,
        url: dto.url,
      })
      .where(eq(bankDrizzlePersistenceModel.bankId, dto.id))
  }
}
