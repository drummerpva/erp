import { BankRestController, HttpRestServer } from '@BankRestController.ts'
import { CreateBank } from '@CreateBank.ts'
import { GetBankById } from '@GetBankById.ts'
import { GetBankList } from '@GetBankList.ts'
import { RemoveBank } from '@RemoveBank.ts'
import { UpdateBank } from '@UpdateBank.ts'
import Sinon from 'sinon'

const httpRestServer: HttpRestServer = {
  listen() {},
  register() {},
}

test('Deve chamar o httpRestServer corretamente', () => {
  const registerSpy = Sinon.spy(httpRestServer, 'register')
  new BankRestController(
    httpRestServer,
    {} as GetBankList,
    {} as GetBankById,
    {} as CreateBank,
    {} as UpdateBank,
    {} as RemoveBank,
  )
  expect(registerSpy.called).toBeTruthy()
  expect(registerSpy.calledWith('get', '/banco', Sinon.match.func)).toBeTruthy()
  expect(
    registerSpy.calledWith('get', '/banco/:id', Sinon.match.func),
  ).toBeTruthy()
  expect(
    registerSpy.calledWith('post', '/banco', Sinon.match.func),
  ).toBeTruthy()
  expect(
    registerSpy.calledWith('put', '/banco/:id', Sinon.match.func),
  ).toBeTruthy()
  expect(
    registerSpy.calledWith('delete', '/banco/:id', Sinon.match.func),
  ).toBeTruthy()
})
