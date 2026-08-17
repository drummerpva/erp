import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'banco' })
export class BankTypeormPersistenceModel {
  @PrimaryGeneratedColumn({ name: 'banco_id' })
  bankId!: number

  @Column('varchar', { name: 'nome' })
  name!: string

  @Column('varchar', { name: 'codigo' })
  code!: string

  @Column('varchar', { name: 'url' })
  url!: string
}
