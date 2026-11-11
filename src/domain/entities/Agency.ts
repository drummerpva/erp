import { AggregateRoot } from '@domain/AggregateRoot.ts'

export class Agency extends AggregateRoot {
  private constructor(
    private agencyId: number,
    private name: string,
    private number: string,
    private digit: string,
    private phone: string,
    private contact: string,
    private manager: string,
    private obs: string,
    private bankId: number,
  ) {
    super()
  }

  getAgencyId() {
    return this.agencyId
  }

  getName() {
    return this.name
  }

  getNumber() {
    return this.number
  }

  getDigit() {
    return this.digit
  }

  getPhone() {
    return this.phone
  }

  getContact() {
    return this.contact
  }

  getManager() {
    return this.manager
  }

  getObs() {
    return this.obs
  }

  getBankId() {
    return this.bankId
  }

  static create({
    name,
    number,
    digit,
    phone,
    contact,
    manager,
    obs,
    bankId,
  }: Agency.CreateParams): Agency {
    return new Agency(
      0,
      name,
      number,
      digit,
      phone,
      contact,
      manager,
      obs,
      bankId,
    )
  }

  static restore({
    agencyId,
    name,
    number,
    digit,
    phone,
    contact,
    manager,
    obs,
    bankId,
  }: Agency.RestoreParams): Agency {
    return new Agency(
      agencyId,
      name,
      number,
      digit,
      phone,
      contact,
      manager,
      obs,
      bankId,
    )
  }
}

export namespace Agency {
  export type CreateParams = {
    name: string
    number: string
    digit: string
    phone: string
    contact: string
    manager: string
    obs: string
    bankId: number
  }
  export type RestoreParams = {
    agencyId: number
    name: string
    number: string
    digit: string
    phone: string
    contact: string
    manager: string
    obs: string
    bankId: number
  }
}
