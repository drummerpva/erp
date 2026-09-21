import { EventPublisher } from '@application/EventPublisher.ts'
import { Event } from '@domain/events/Event.ts'

import { Queue } from './Queue.ts'

export class EventPublisherQueue implements EventPublisher {
  constructor(private queue: Queue) {}
  async publishAll(events: Event[]): Promise<void> {
    for (const event of events) {
      const payload = {
        occurredAt: event.occurredAt,
        payload: event.payload,
      }
      await this.queue.publish(event.eventName, payload)
    }
  }
}
