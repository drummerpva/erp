import { BankDAOSQL } from '@BankDAO.ts'
import { BankRepositoryDatabase } from '@BankRepositoryDatabase.ts'
import { BankRestController } from '@BankRestController.ts'
import { CreateBank } from '@CreateBank.ts'
import { FastifyAdapter } from '@FastifyAdapter.ts'
import { GetBankById } from '@GetBankById.ts'
import { GetBankList } from '@GetBankList.ts'
import { MysqlAdapter } from '@MysqlAdapter.ts'
import { RemoveBank } from '@RemoveBank.ts'
import { UpdateBank } from '@UpdateBank.ts'

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
