import { AgencyRepository } from '@application/repositories/AgencyRepository.ts'
import { Agency } from '@domain/entities/Agency.ts'

import { AgencyRepositoryFake } from '../../mocks/AgencyRepositoryFake.ts'

let sut: AgencyRepository

beforeEach(() => {
  sut = new AgencyRepositoryFake()
})

test('Deve salvar uma agência corretamente', async () => {
  const agency = Agency.create({
    name: 'Any Name',
    number: '1234',
    digit: '1',
    phone: '44944332211',
    contact: 'Any Contact',
    manager: 'Any Manager',
    obs: 'Any Obs',
    bankId: 123,
  })
  const createdAgency = await sut.save(agency)
  expect(createdAgency).toBeTruthy()
  expect(createdAgency).toBeInstanceOf(Agency)
  expect(createdAgency.getAgencyId()).toBeTruthy()
  expect(createdAgency.getName()).toBe(agency.getName())
  expect(createdAgency.getNumber()).toBe(agency.getNumber())
  expect(createdAgency.getDigit()).toBe(agency.getDigit())
  expect(createdAgency.getPhone()).toBe(agency.getPhone())
  expect(createdAgency.getContact()).toBe(agency.getContact())
  expect(createdAgency.getManager()).toBe(agency.getManager())
  expect(createdAgency.getObs()).toBe(agency.getObs())
  expect(createdAgency.getBankId()).toBe(agency.getBankId())
  const savedAgency = await sut.findById(createdAgency.getAgencyId())
  expect(savedAgency).toBeTruthy()
  expect(savedAgency.getAgencyId()).toBe(createdAgency.getAgencyId())
  await sut.remove(createdAgency.getAgencyId())
})
test('Deve buscar uma agência por ID corretamente', async () => {
  const agency = Agency.create({
    name: 'Any Name',
    number: '1234',
    digit: '1',
    phone: '44944332211',
    contact: 'Any Contact',
    manager: 'Any Manager',
    obs: 'Any Obs',
    bankId: 123,
  })
  const createdAgency = await sut.save(agency)
  expect(createdAgency).toBeTruthy()
  const savedAgency = await sut.findById(createdAgency.getAgencyId())
  expect(savedAgency).toBeInstanceOf(Agency)
  expect(savedAgency.getAgencyId()).toBe(createdAgency.getAgencyId())
  expect(savedAgency.getName()).toBe(agency.getName())
  expect(savedAgency.getNumber()).toBe(agency.getNumber())
  expect(savedAgency.getDigit()).toBe(agency.getDigit())
  expect(savedAgency.getPhone()).toBe(agency.getPhone())
  expect(savedAgency.getContact()).toBe(agency.getContact())
  expect(savedAgency.getManager()).toBe(agency.getManager())
  expect(savedAgency.getObs()).toBe(agency.getObs())
  expect(savedAgency.getBankId()).toBe(agency.getBankId())
  await sut.remove(createdAgency.getAgencyId())
})
test('Deve remover uma agência por ID corretamente', async () => {
  const agency = Agency.create({
    name: 'Any Name',
    number: '1234',
    digit: '1',
    phone: '44944332211',
    contact: 'Any Contact',
    manager: 'Any Manager',
    obs: 'Any Obs',
    bankId: 123,
  })
  const createdAgency = await sut.save(agency)
  expect(createdAgency).toBeTruthy()
  await sut.remove(createdAgency.getAgencyId())
  const savedAgency = await sut.findById(createdAgency.getAgencyId())
  expect(savedAgency).toBeFalsy()
})
