import { ApplicationError } from '@application/errors/ApplicationError.ts'
import { EventPublisher } from '@application/EventPublisher.ts'
import { BankCreatedEvent } from '@application/events/BankCreatedEvent.ts'
import { AgencyRepository } from '@application/repositories/AgencyRepository.ts'
import { BankRepository } from '@application/repositories/BankRepository.ts'
import { CreateAgency } from '@application/usecases/CreateAgency.ts'
import { Bank } from '@domain/entities/Bank.ts'
import Sinon from 'sinon'

import { AgencyRepositoryFake } from '../../mocks/AgencyRepositoryFake.ts'
import { BankRepositoryFake } from '../../mocks/BankRepositoryFake.ts'

let bankRepository: BankRepository
let agencyRepository: AgencyRepository
let sut: CreateAgency
const eventPublisher: EventPublisher = {
  async publishAll() {},
}

beforeEach(() => {
  bankRepository = new BankRepositoryFake()
  agencyRepository = new AgencyRepositoryFake()
  // getBankByIdUsecase = new GetBankById(bankDao)
  sut = new CreateAgency(bankRepository, agencyRepository, eventPublisher)
})

afterEach(() => {
  Sinon.restore()
})

test.only('Deve criar uma agencia', async () => {
  const fakeCode = `${Math.random()}`.substring(2, 5)
  const bank = Bank.create({
    code: fakeCode,
    name: 'Test name',
    url: 'teste.com',
  })
  const savedBank = await bankRepository.save(bank)
  const inputSut = {
    nome: 'Any name',
    numero: `${Math.random()}`.substring(3, 7),
    digito: `${Math.random()}`.substring(4, 5),
    telefone: '44944332211',
    contato: 'Any contact',
    gerente: 'Any manager',
    observacao: 'Any obs',
    banco: {
      id: savedBank.getBankId(),
    },
  }
  const outputCreate = await sut.execute(inputSut)
  expect(outputCreate.id).toBeTruthy()
  expect(outputCreate.nome).toBe(inputSut.nome)
  expect(outputCreate.numero).toBe(inputSut.numero)
  expect(outputCreate.digito).toBe(inputSut.digito)
  expect(outputCreate.telefone).toBe(inputSut.telefone)
  expect(outputCreate.contato).toBe(inputSut.contato)
  expect(outputCreate.gerente).toBe(inputSut.gerente)
  expect(outputCreate.observacao).toBe(inputSut.observacao)
  expect(outputCreate.banco.id).toBe(savedBank.getBankId())
  expect(outputCreate.banco.nome).toBe(savedBank.getName())
  expect(outputCreate.banco.codigo).toBe(savedBank.getCode())
  expect(outputCreate.banco.url).toBe(savedBank.getUrl())
  const agency = await agencyRepository.findById(outputCreate.id)
  expect(agency?.getBankId()).toBe(savedBank.getBankId())
  expect(agency?.getAgencyId()).toBe(outputCreate.id)
  expect(agency?.getName()).toBe(inputSut.nome)
  expect(agency?.getNumber()).toBe(inputSut.numero)
  expect(agency?.getDigit()).toBe(inputSut.digito)
  expect(agency?.getPhone()).toBe(inputSut.telefone)
  expect(agency?.getContact()).toBe(inputSut.contato)
  expect(agency?.getManager()).toBe(inputSut.gerente)
  expect(agency?.getObs()).toBe(inputSut.observacao)
  await agencyRepository.remove(outputCreate.id)
  await bankRepository.remove(savedBank.getBankId())
})
test('Deve chamar eventPublisher publishAll corretamente', async () => {
  const fakeCode = `${Math.random()}`.substring(3, 6)
  const inputSut = {
    codigo: fakeCode,
    nome: `Test Name`,
    url: 'teste4.com',
  }
  const publishAllSpy = Sinon.spy(eventPublisher, 'publishAll')
  await sut.execute(inputSut)
  expect(publishAllSpy.calledOnce).toBeTruthy()
  expect(
    publishAllSpy.calledWith([Sinon.match.instanceOf(BankCreatedEvent)]),
  ).toBeTruthy()
})
test('Não deve criar um banco com nome inválido', async () => {
  const invalidName = 'abc'
  const inputCreate = {
    codigo: '555',
    nome: invalidName,
    url: 'teste4.com',
  }
  await expect(sut.execute(inputCreate)).rejects.toThrow('Nome inválido')
})
test('Não deve criar um banco com código inválido ', async () => {
  const invalidCode = 'ABC'
  const inputCreate = {
    codigo: invalidCode,
    nome: 'Test Name',
    url: 'teste4.com',
  }
  await expect(sut.execute(inputCreate)).rejects.toThrow('Código inválido')
})
test('Não deve criar um banco com código repetido', async () => {
  const fakeCode = `${Math.random()}`.substring(2, 5)
  const inputCreate = {
    codigo: fakeCode,
    nome: 'Test Name',
    url: 'teste4.com',
  }
  const { id } = await sut.execute(inputCreate)
  await expect(sut.execute(inputCreate)).rejects.toThrow(
    new ApplicationError('Já existe um banco com este código'),
  )
  await bankRepository.remove(id)
})
test('Não deve criar um banco com nome repetido', async () => {
  const fakeName = `Name ${Math.random()}`
  const firstInput = {
    codigo: '123',
    nome: fakeName,
    url: 'teste4.com',
  }
  const { id } = await sut.execute(firstInput)
  const secondInput = {
    codigo: '321',
    nome: firstInput.nome,
    url: firstInput.url,
  }
  await expect(sut.execute(secondInput)).rejects.toThrow(
    new ApplicationError('Já existe um banco com este nome'),
  )
  await bankRepository.remove(id)
})
