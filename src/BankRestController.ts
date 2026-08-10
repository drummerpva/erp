import { CreateBank } from '@CreateBank.ts'
import { GetBankById } from '@GetBankById.ts'
import { GetBankList } from '@GetBankList.ts'
import { HttpRestServer } from '@HttpRestServer.ts'
import { RemoveBank } from '@RemoveBank.ts'
import { UpdateBank } from '@UpdateBank.ts'

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
