import { Bank } from '@Bank.ts'
import { BankRepository } from '@BankRepository.ts'
import { GetBankById } from '@GetBankById.ts'

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
