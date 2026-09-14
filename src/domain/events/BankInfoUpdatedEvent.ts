import { DomainEvent } from './DomainEvent.ts'

export class BankInfoUpdatedEvent implements DomainEvent {
  readonly eventName = 'bank.info-updated'
  readonly occurredAt: Date
  constructor(readonly payload: DomainEvent.Payload) {
    this.occurredAt = new Date()
  }
}
