import { BankRepository } from '@application/repositories/BankRepository.ts'
import { RemoveBank } from '@application/usecases/RemoveBank.ts'
import { Bank } from '@domain/entities/Bank.ts'

import { BankRepositoryFake } from '../../mocks/BankRepositoryFake.ts'

let bankRepository: BankRepository
let sut: RemoveBank

beforeAll(() => {
  bankRepository = new BankRepositoryFake()
  sut = new RemoveBank(bankRepository)
})

test('Deve deletar um banco', async () => {
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
  await sut.execute(inputSut)
  const existsBank = await bankRepository.findById(bankId)
  expect(existsBank).toBeFalsy()
})
