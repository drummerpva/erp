import { DomainEvent } from './DomainEvent.ts'

export class BankInfoUpdatedEvent implements DomainEvent {
  static readonly EVENT_NAME = 'bank.info-updated'
  readonly eventName = BankInfoUpdatedEvent.EVENT_NAME
  readonly occurredAt: Date
  constructor(readonly payload: DomainEvent.Payload) {
    this.occurredAt = new Date()
  }
}
