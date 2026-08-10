import { ApplicationError } from '@application/errors/ApplicationError.ts'
import { NotFoundError } from '@application/errors/NotFoundError.ts'
import { DomainError } from '@domain/errrors/DomainError.ts'
import { ErrorMapper } from '@infra/ErrorMapper.ts'

test('Deve retornar 404 quando tivermos um NotFoundError', async () => {
  const error = new NotFoundError('Algo falhou')
  const appResponse = await ErrorMapper.toRestReponse(error)
  expect(appResponse.statusCode).toBe(404)
  expect(appResponse.body.code).toBe('NOT_FOUND_ERROR')
  expect(appResponse.body.message).toBe('Algo falhou')
})
test('Deve retornar 422 quando tivermos um DomainError', async () => {
  const error = new DomainError('Algo falhou')
  const appResponse = await ErrorMapper.toRestReponse(error)
  expect(appResponse.statusCode).toBe(422)
  expect(appResponse.body.code).toBe('DOMAIN_ERROR')
  expect(appResponse.body.message).toBe('Algo falhou')
})
test('Deve retornar 422 quando tivermos um Application', async () => {
  const error = new ApplicationError('Algo falhou')
  const appResponse = await ErrorMapper.toRestReponse(error)
  expect(appResponse.statusCode).toBe(422)
  expect(appResponse.body.code).toBe('APPLICATION_ERROR')
  expect(appResponse.body.message).toBe('Algo falhou')
})
test('Deve retornar 500 quando tivermos um erro não esperado', async () => {
  const error = new Error('Algo falhou')
  const appResponse = await ErrorMapper.toRestReponse(error)
  expect(appResponse.statusCode).toBe(500)
  expect(appResponse.body.code).toBe('SERVER_ERROR')
  expect(appResponse.body.message).toBe('Internal server error')
})
