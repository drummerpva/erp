import { CreateBank } from '@CreateBank.ts'
import { GetBankById } from '@GetBankById.ts'
import { GetBankList } from '@GetBankList.ts'
import { RemoveBank } from '@RemoveBank.ts'
import { UpdateBank } from '@UpdateBank.ts'

export interface HttpRestServer {
  register(
    method: HttpRestServer.AcceptedMethods,
    url: string,
    callback: (
      request: HttpRestServer.Request,
    ) => Promise<HttpRestServer.Response>,
  ): void
  listen(port: number): void
}
export namespace HttpRestServer {
  export type Request = {
    params?: any
    body?: any
  }
  export type Response = {
    statusCode: HttpRestServer.StatusCode
    body: any
  }
  export const AcceptedMethodsList = ['GET', 'POST', 'PUT', 'DELETE'] as const
  export type AcceptedMethods = (typeof AcceptedMethodsList)[number]
  export enum StatusCode {
    Ok = 200,
    Created = 201,
    BadRequest = 400,
    NotFound = 404,
    UnprocessableEntity = 422,
  }
}

export class BankRestController {
  constructor(
    private httpServer: HttpRestServer,
    private getBankList: GetBankList,
    private getBankById: GetBankById,
    private createBank: CreateBank,
    private updateBank: UpdateBank,
    private removeBank: RemoveBank,
  ) {
    this.httpServer.register(
      'GET',
      '/banco',
      async (): Promise<HttpRestServer.Response> => {
        const output = await this.getBankList.execute()
        return {
          statusCode: HttpRestServer.StatusCode.Ok,
          body: output,
        }
      },
    )
    this.httpServer.register(
      'GET',
      '/banco/:id',
      async (
        request: HttpRestServer.Request,
      ): Promise<HttpRestServer.Response> => {
        const input: GetBankById.Input = {
          id: Number(request.params?.id),
        }
        const output = await this.getBankById.execute(input)
        return {
          statusCode: HttpRestServer.StatusCode.Ok,
          body: output,
        }
      },
    )
    this.httpServer.register(
      'POST',
      '/banco',
      async (
        request: HttpRestServer.Request,
      ): Promise<HttpRestServer.Response> => {
        const input: CreateBank.Input = {
          ...request.body,
        }
        const output = await this.createBank.execute(input)
        return {
          statusCode: HttpRestServer.StatusCode.Created,
          body: output,
        }
      },
    )
    this.httpServer.register(
      'PUT',
      '/banco/:id',
      async (
        request: HttpRestServer.Request,
      ): Promise<HttpRestServer.Response> => {
        const input: UpdateBank.Input = {
          id: Number(request.params.id),
          ...request.body,
        }
        const output = await this.updateBank.execute(input)
        return {
          statusCode: 200,
          body: output,
        }
      },
    )
    this.httpServer.register(
      'DELETE',
      '/banco/:id',
      async (
        request: HttpRestServer.Request,
      ): Promise<HttpRestServer.Response> => {
        const input: RemoveBank.Input = {
          id: Number(request.params.id),
        }
        const output = await this.removeBank.execute(input)
        return {
          statusCode: HttpRestServer.StatusCode.Ok,
          body: output,
        }
      },
    )
  }
}
