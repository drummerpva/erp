import { DataSource } from 'typeorm'

import { BankTypeormPersistenceModel } from './BankTypeormPersistenceModel.ts'

export const typeormDatasourceFactory = async (
  databaseUrl: string,
): Promise<DataSource> => {
  const dataSource = await new DataSource({
    type: 'mariadb',
    url: databaseUrl,
    entities: [BankTypeormPersistenceModel],
    synchronize: false,
  }).initialize()
  return dataSource
}
