import { CreateBank } from '@application/usecases/CreateBank.ts'
import { GetBankById } from '@application/usecases/GetBankById.ts'
import { GetBankList } from '@application/usecases/GetBankList.ts'
import { RemoveBank } from '@application/usecases/RemoveBank.ts'
import { UpdateBank } from '@application/usecases/UpdateBank.ts'
import { BankRestController } from '@infra/controllers/BankRestController.ts'
import { HttpRestServer } from '@infra/http/HttpRestServer.ts'
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
  expect(registerSpy.calledWith('GET', '/banco', Sinon.match.func)).toBeTruthy()
  expect(
    registerSpy.calledWith('GET', '/banco/:id', Sinon.match.func),
  ).toBeTruthy()
  expect(
    registerSpy.calledWith('POST', '/banco', Sinon.match.func),
  ).toBeTruthy()
  expect(
    registerSpy.calledWith('PUT', '/banco/:id', Sinon.match.func),
  ).toBeTruthy()
  expect(
    registerSpy.calledWith('DELETE', '/banco/:id', Sinon.match.func),
  ).toBeTruthy()
})
