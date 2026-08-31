import { CreateBank } from '@application/usecases/CreateBank.ts'
import { GetBankById } from '@application/usecases/GetBankById.ts'
import { GetBankList } from '@application/usecases/GetBankList.ts'
import { RemoveBank } from '@application/usecases/RemoveBank.ts'
import { UpdateBank } from '@application/usecases/UpdateBank.ts'
import { MysqlAdapter } from '@external/database/MysqlAdapter.ts'
import { FastifyAdapter } from '@external/http/FastifyAdapter.ts'
import { BankRestController } from '@infra/controllers/BankRestController.ts'
import { BankDAOSQL } from '@infra/database/DAOs/BankDAOSQL.ts'
import { BankRepositoryDatabase } from '@infra/database/repositories/BankRepositoryDatabase.ts'

const databaseConnection = new MysqlAdapter(String(process.env.DATABASE_URL))
// const dataSource = await typeormDatasourceFactory(
//   String(process.env.DATABASE_URL),
// )
// const bankDAO = new BankDAOTypeorm(dataSource)
// const dataSource = await prismaDatasourceFactory(
//   String(process.env.DATABASE_URL),
// )
// const bankDAO = new BankDAOPrisma(dataSource)
// const dataSource = await drizzleDatasourceFactory(
//   String(process.env.DATABASE_URL),
// )
// const bankDAO = new BankDAODrizzle(dataSource)
// const dataSource = await mongoDatasourceFactory(
//   String(process.env.DATABASE_URL_MONGO),
// )
// const bankDAO = new BankDAOMongo(dataSource)
const bankDAO = new BankDAOSQL(databaseConnection)
// const databaseConnection = new PgPromiseAdapter(
//   String(process.env.DATABASE_URL_PG),
// )
// const databaseConnection = new SQLiteAdapter(
//   String(process.env.DATABASE_FILENAME),
// )
// const bankRepository = new BankRepositorySQL(databaseConnection)
const bankRepository = new BankRepositoryDatabase(bankDAO)
// const httpRestServer = new ExpressAdapter()
const httpRestServer = new FastifyAdapter()
// const httpRestServer = new HonoAdapter()
const getBankList = new GetBankList(bankRepository)
const getBankById = new GetBankById(bankRepository)
const createBank = new CreateBank(bankRepository)
const updateBank = new UpdateBank(bankRepository)
const removeBank = new RemoveBank(bankRepository)
new BankRestController(
  httpRestServer,
  getBankList,
  getBankById,
  createBank,
  updateBank,
  removeBank,
)
httpRestServer.listen(3001)

let shuttingDown = false
const gracefullShutdown = async () => {
  if (shuttingDown) return
  shuttingDown = true
  try {
    await httpRestServer.close()
    await databaseConnection.close()
    // await dataSource?.destroy()
    // await dataSource?.$disconnect()
    // await dataSource?.close()
    console.log('Application terminated')
  } catch (error: any) {
    console.log(
      `Error on shutdown application: ${error.message}, stack: ${error.stack}`,
    )
  }
}

process.on('SIGTERM', gracefullShutdown)
process.on('SIGINT', gracefullShutdown)
