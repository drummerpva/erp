import { CreateBank } from '@CreateBank.ts'
import { GetBankById } from '@GetBankById.ts'
import { GetBankList } from '@GetBankList.ts'
import { RemoveBank } from '@RemoveBank.ts'
import { UpdateBank } from '@UpdateBank.ts'

export interface HttpRestServer {
  register(
    method: string,
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
    statusCode: number
    body: any
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
      'get',
      '/banco',
      async (): Promise<HttpRestServer.Response> => {
        const output = await this.getBankList.execute()
        return {
          statusCode: 200,
          body: output,
        }
      },
    )
    this.httpServer.register(
      'get',
      '/banco/:id',
      async (
        request: HttpRestServer.Request,
      ): Promise<HttpRestServer.Response> => {
        const input: GetBankById.Input = {
          id: Number(request.params?.id),
        }
        const output = await this.getBankById.execute(input)
        return {
          statusCode: 200,
          body: output,
        }
      },
    )
    this.httpServer.register(
      'post',
      '/banco',
      async (
        request: HttpRestServer.Request,
      ): Promise<HttpRestServer.Response> => {
        const input: CreateBank.Input = {
          ...request.body,
        }
        const output = await this.createBank.execute(input)
        return {
          statusCode: 201,
          body: output,
        }
      },
    )
    this.httpServer.register(
      'put',
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
      'delete',
      '/banco/:id',
      async (
        request: HttpRestServer.Request,
      ): Promise<HttpRestServer.Response> => {
        const input: RemoveBank.Input = {
          id: Number(request.params.id),
        }
        const output = await this.removeBank.execute(input)
        return {
          statusCode: 200,
          body: output,
        }
      },
    )
  }
}
