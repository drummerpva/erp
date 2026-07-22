import { BankRepositoryDatabase } from '@BankRepository.ts'
import { BankRestController, HttpRestServer } from '@BankRestController.ts'
import { CreateBank } from '@CreateBank.ts'
import { ExpressAdapter } from '@ExpressAdapter.ts'
import { GetBankById } from '@GetBankById.ts'
import { GetBankList } from '@GetBankList.ts'
import { MysqlAdapter } from '@MysqlAdapter.ts'
import { RemoveBank } from '@RemoveBank.ts'
import { UpdateBank } from '@UpdateBank.ts'

const databaseConnection = new MysqlAdapter(String(process.env.DATABASE_URL))
const bankRepository = new BankRepositoryDatabase(databaseConnection)
const httpRestServer: HttpRestServer = new ExpressAdapter()
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
