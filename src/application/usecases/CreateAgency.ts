import { EventPublisher } from '@application/EventPublisher.ts'
import { AgencyRepository } from '@application/repositories/AgencyRepository.ts'
import { BankRepository } from '@application/repositories/BankRepository.ts'
import { Agency } from '@domain/entities/Agency.ts'

import { UseCase } from './UseCase.ts'

export class CreateAgency implements UseCase<
  CreateAgency.Input,
  CreateAgency.Output
> {
  constructor(
    private bankRepository: BankRepository,
    private agencyRepository: AgencyRepository,
    private eventPulisher: EventPublisher,
  ) {}

  async execute(input: CreateAgency.Input): Promise<CreateAgency.Output> {
    const agency = Agency.create({
      name: input.nome,
      number: input.numero,
      digit: input.digito,
      phone: input.telefone,
      contact: input.contato,
      manager: input.gerente,
      obs: input.observacao,
      bankId: input.banco.id,
    })
    const savedAgency = await this.agencyRepository.save(agency)
    const bank = await this.bankRepository.findById(savedAgency.getBankId())
    return {
      id: savedAgency.getAgencyId(),
      nome: savedAgency.getName(),
      numero: savedAgency.getNumber(),
      digito: savedAgency.getDigit(),
      telefone: savedAgency.getPhone(),
      contato: savedAgency.getContact(),
      gerente: savedAgency.getManager(),
      observacao: savedAgency.getObs(),
      banco: {
        id: savedAgency.getBankId(),
        codigo: bank!.getCode(),
        nome: bank!.getName(),
        url: bank!.getUrl(),
      },
    }
  }
}

export namespace CreateAgency {
  export type Input = {
    nome: string
    numero: string
    digito: string
    telefone: string
    contato: string
    gerente: string
    observacao: string
    banco: {
      id: number
    }
  }

  export type Output = {
    id: number
    nome: string
    numero: string
    digito: string
    telefone: string
    gerente: string
    contato: string
    observacao: string
    banco: BankDTO
  }
  type BankDTO = {
    id: number
    nome: string
    codigo: string
    url: string
  }
}
