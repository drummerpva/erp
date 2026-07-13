import { Bank } from '@Bank.ts'
import { BankRepository } from '@BankRepository.ts'
import { GetBankList } from '@GetBankList.ts'

import { BankRepositoryFake } from '../../mocks/BankRepositoryFake.ts'

let bankRepository: BankRepository
let sut: GetBankList

beforeAll(() => {
  bankRepository = new BankRepositoryFake()
  sut = new GetBankList(bankRepository)
})

test('Deve retornar a lista de bancos', async () => {
  const bank = Bank.create({
    code: 'AAA',
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
