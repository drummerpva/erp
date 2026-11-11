export interface AgencyRepository {
  save(agency: Agency): Promise<Agency>
  list(): Promise<Agency[]>
  remove(agencyId: number): Promise<void>
  findById(agencyId: number): Promise<Agency | undefined>
  update(agency: Agency): Promise<void>
}
