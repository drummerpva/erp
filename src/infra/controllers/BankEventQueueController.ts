import { BankCreatedEvent } from '@application/events/BankCreatedEvent.ts'
import { BankInfoUpdatedEvent } from '@domain/events/BankInfoUpdatedEvent.ts'
import { Queue } from '@infra/Queue.ts'

export class BankEventQueueController {
  constructor(queue: Queue) {
    console.log(`Bank Event Queue is running...`)
    queue.consume(BankCreatedEvent.EVENT_NAME, async (payload: any) => {
      // chamar usecase
      console.log(BankCreatedEvent.EVENT_NAME, { payload })
    })
    queue.consume(BankInfoUpdatedEvent.EVENT_NAME, async (payload: any) => {
      // chamar usecase
      console.log(BankInfoUpdatedEvent.EVENT_NAME, { payload })
    })
  }
}
