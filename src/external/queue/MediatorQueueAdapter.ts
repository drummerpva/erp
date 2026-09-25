import { Queue } from '@infra/Queue.ts'

export class MediatorQueueAdapter implements Queue {
  handlers: MediatorQueueAdapter.Handler[] = []
  async publish(eventName: string, payload: any): Promise<void> {
    for (const handler of this.handlers) {
      if (handler.key !== eventName) continue
      await handler.callback(payload)
    }
  }

  async consume(eventName: string, callback: Function): Promise<void> {
    const handler = {
      key: eventName,
      callback,
    }
    this.handlers.push(handler)
  }
}

export namespace MediatorQueueAdapter {
  export type Handler = {
    key: string
    callback: Function
  }
}
