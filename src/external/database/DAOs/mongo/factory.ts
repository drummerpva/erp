import { MongoClient } from 'mongodb'

export const mongoDatasourceFactory = async (databaseUrl: string) => {
  const dataSource = new MongoClient(databaseUrl)
  await dataSource.connect()
  return dataSource
}
