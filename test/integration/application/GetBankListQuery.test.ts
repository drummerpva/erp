import { BankRepository } from '@application/repositories/BankRepository.ts'
import { GetBankListQuery } from '@application/usecases/GetBankListQuery.ts'
import { Bank } from '@domain/entities/Bank.ts'
import { MysqlAdapter } from '@external/database/MysqlAdapter.ts'
import { BankDAO } from '@infra/database/DAOs/BankDAO.ts'
import { BankDAOSQL } from '@infra/database/DAOs/BankDAOSQL.ts'
import { DatabaseConnection } from '@infra/database/DatabaseConnection.ts'
import { BankRepositorySQL } from '@infra/database/repositories/BankRepositorySQL.ts'

let bankRepository: BankRepository
let connection: DatabaseConnection
let bankDao: BankDAO
let sut: GetBankListQuery

beforeAll(() => {
  connection = new MysqlAdapter(String(process.env.DATABASE_URL))
  bankRepository = new BankRepositorySQL(connection)
  bankDao = new BankDAOSQL(connection)
  sut = new GetBankListQuery(bankDao)
})

test('Deve retornar a lista de bancos', async () => {
  const bank = Bank.create({
    code: '123',
    name: 'Any name',
    url: 'url',
  })
  const bankSaved = await bankRepository.save(bank)
  const bankId = bankSaved.getBankId()
  const output = await sut.execute()
  expect(output).toBeInstanceOf(Array)
  expect(output.length).toBeGreaterThanOrEqual(1)
  const bankData = output.find((item) => item.id === bankId)
  expect(bankData).toBeTruthy()
  expect(bankData?.id).toBe(bankId)
  expect(bankData?.codigo).toBe(bankSaved.getCode())
  expect(bankData?.nome).toBe(bankSaved.getName())
  expect(bankData?.url).toBe(bankSaved.getUrl())
  await bankRepository.remove(bankId)
})
