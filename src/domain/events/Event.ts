export interface Event<EventPayload = any> {
  eventName: string
  occurredAt: Date
  payload: EventPayload
}
