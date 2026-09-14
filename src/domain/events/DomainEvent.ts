import { Event } from './Event.ts'
export interface DomainEvent extends Event<DomainEvent.Payload> {}

export namespace DomainEvent {
  export type Payload = {
    aggregateId: number
  }
}
