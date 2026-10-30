import { setTimeout as sleep } from 'node:timers/promises'

import { RabbitMQueueAdapter } from '@external/queue/RabbitMQueueAdapter.ts'
import { Queue } from '@infra/Queue.ts'

let sut: Queue

beforeAll(async () => {
  sut = new RabbitMQueueAdapter(String(process.env.RABBIT_URL))
  await sut.connect()
})
afterAll(async () => {
  await sut.disconnect()
})

test('Deve publicar e consumir uma mensagem', async () => {
  let counter = 0
  let payloadReceived: any = null
  const eventName = `any.event.${Math.random()}`
  await sut.consume(eventName, async (payload: any) => {
    counter++
    payloadReceived = payload
  })
  const payloadDummy = {
    id: '123',
  }
  await sut.publish(eventName, payloadDummy)
  await sleep(100)
  expect(counter).toBe(1)
  expect(payloadReceived.id).toBe(payloadDummy.id)
})
