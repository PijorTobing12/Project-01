import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class UserDomain extends BaseModel {
  public static table = 'user_domain'

  // @column({ isPrimary: true })
  // public id: number

  @column()
  public empid: string

  @column()
  public domain: string

  // @column.dateTime({ autoCreate: true })
  // public created_at: DateTime

  // @column.dateTime({ autoCreate: true, autoUpdate: true })
  // public updated_at: DateTime

  
}
