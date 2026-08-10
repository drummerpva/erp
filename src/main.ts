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
