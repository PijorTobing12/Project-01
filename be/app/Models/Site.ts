import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Site extends BaseModel {
  public static table = 'site'

  @column({ isPrimary: true })
  public id: number

  @column()
  public domain: string

  @column()
  public code: string

  @column()
  public desc: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
