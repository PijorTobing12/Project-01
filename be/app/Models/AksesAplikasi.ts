import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class AksesAplikasi extends BaseModel {
  public static table = 'akses_aplikasi'
  @column({ isPrimary: true })
  public id: number

  @column()
  public empid: string

  @column()
  public aplikasi_rowid: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
