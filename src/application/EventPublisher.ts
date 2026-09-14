import { Event } from '../domain/events/Event.ts'
export interface EventPublisher {
  publishAll(events: Event[]): Promise<void>
}
