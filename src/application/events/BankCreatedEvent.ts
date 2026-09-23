import { ApplicationEvent } from './ApplicationEvent.ts'

export class BankCreatedEvent implements ApplicationEvent {
  static EVENT_NAME = 'bank.created'
  readonly eventName = BankCreatedEvent.EVENT_NAME
  readonly occurredAt: Date
  constructor(readonly payload: BankCreatedEvent.Payload) {
    this.occurredAt = new Date()
  }
}

export namespace BankCreatedEvent {
  export type Payload = {
    bankId: number
  }
}
