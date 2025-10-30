import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'

export default class MasterAplikasi extends BaseModel {
  public static table = 'master_aplikasi'

  @column({ isPrimary: true })
  public rowid: number

  @column()
  public nama_aplikasi: string

  @column()
  public link: string

  @column()
  public icon: string

  @column()
  public parent: number

  @column()
  public type: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => MasterAplikasi, {
    foreignKey: 'parent', // Master Aplikasi
    localKey: 'rowid', // Master Aplikasi
  })
  public children: HasMany<typeof MasterAplikasi>
}
