import { AgencyRepository } from '@application/repositories/AgencyRepository.ts'
import { Agency } from '@domain/entities/Agency.ts'

export class AgencyRepositoryFake implements AgencyRepository {
  private agencies: Agency[]
  constructor() {
    this.agencies = []
  }

  async save(agency: Agency): Promise<Agency> {
    const newId = this.agencies.length + 1
    const newAgency = Agency.restore({
      agencyId: newId,
      name: agency.getName(),
      number: agency.getNumber(),
      digit: agency.getDigit(),
      phone: agency.getPhone(),
      contact: agency.getContact(),
      manager: agency.getManager(),
      obs: agency.getObs(),
      bankId: agency.getBankId(),
    })
    this.agencies.push(newAgency)
    return newAgency
  }

  async list(): Promise<Agency[]> {
    throw new Error('Method not implemented.')
  }

  async remove(agencyId: number): Promise<void> {
    this.agencies = this.agencies.filter(
      (agency) => agency.getAgencyId() !== agencyId,
    )
  }

  async findById(agencyId: number): Promise<Agency | undefined> {
    const agency = this.agencies.find(
      (agency) => agency.getAgencyId() === agencyId,
    )
    if (!agency) return
    return agency
  }

  async update(): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
