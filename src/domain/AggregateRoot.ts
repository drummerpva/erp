import { DomainEvent } from './events/DomainEvent.ts'

export abstract class AggregateRoot {
  private events: DomainEvent[] = []
  protected registerEvent(event: any) {
    this.events.push(event)
  }

  protected registerEventOnce(newEvent: DomainEvent) {
    const exists = this.events.find(
      (event) => event.eventName === newEvent.eventName,
    )
    if (exists) return
    this.events.push(newEvent)
  }

  getDomainEvents() {
    return this.events
  }
}
