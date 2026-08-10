import { CreateBank } from '@application/usecases/CreateBank.ts'
import { GetBankById } from '@application/usecases/GetBankById.ts'
import { GetBankList } from '@application/usecases/GetBankList.ts'
import { RemoveBank } from '@application/usecases/RemoveBank.ts'
import { UpdateBank } from '@application/usecases/UpdateBank.ts'
import { HttpRestServer } from '@infra/http/HttpRestServer.ts'

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
