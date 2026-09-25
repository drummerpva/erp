import { MediatorQueueAdapter } from '@external/queue/MediatorQueueAdapter.ts'
import Sinon from 'sinon'

let sut: MediatorQueueAdapter

beforeEach(() => {
  sut = new MediatorQueueAdapter()
})
afterEach(() => {
  Sinon.restore()
})

test('Deve salvar os handlers ao registar um consumidor', async () => {
  const callbackDummy = () => {}
  const eventDummy = 'any_name'
  await sut.consume(eventDummy, callbackDummy)
  await sut.consume(eventDummy, callbackDummy)
  expect(sut.handlers).toHaveLength(2)
  const [first] = sut.handlers
  expect(first.key).toBe(eventDummy)
  expect(first.callback).toBeInstanceOf(Function)
})
test('Deve chamar os handlers ao publicar', async () => {
  const callbackSpy = Sinon.spy()
  const eventDummy = 'any_name'
  await sut.consume(eventDummy, callbackSpy)
  await sut.consume(eventDummy, callbackSpy)
  await sut.consume('other_name', callbackSpy)
  const payloadDummy = 'payload'
  await sut.publish(eventDummy, payloadDummy)
  expect(callbackSpy.calledTwice).toBeTruthy()
  expect(callbackSpy.calledWith(payloadDummy)).toBeTruthy()
})
