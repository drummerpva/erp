import { NotFoundError } from '@application/errors/NotFoundError.ts'
import { BankRepository } from '@application/repositories/BankRepository.ts'
import { GetBankById } from '@application/usecases/GetBankById.ts'
import { Bank } from '@domain/entities/Bank.ts'

import { BankRepositoryFake } from '../../mocks/BankRepositoryFake.ts'

let bankRepository: BankRepository
let sut: GetBankById

beforeAll(() => {
  bankRepository = new BankRepositoryFake()
  sut = new GetBankById(bankRepository)
})

test('Deve retornar um banco pelo ID', async () => {
  const bank = Bank.create({
    code: '123',
    name: 'Any name',
    url: 'url',
  })
  const bankSaved = await bankRepository.save(bank)
  const bankId = bankSaved.getBankId()
  const inputSut = {
    id: bankId,
  }
  const output = await sut.execute(inputSut)
  expect(output?.id).toBe(bankId)
  expect(output?.codigo).toBe(bankSaved.getCode())
  expect(output?.nome).toBe(bankSaved.getName())
  expect(output?.url).toBe(bankSaved.getUrl())
  await bankRepository.remove(bankId)
})
test('Deve lançar um erro se o banco não for encontrado', async () => {
  const bankId = 8_732_211
  const inputSut = {
    id: bankId,
  }
  await expect(sut.execute(inputSut)).rejects.toThrow(
    new NotFoundError('Banco não encontrado'),
  )
})
