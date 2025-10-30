import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class PortalPolicy extends BaseModel {

  static get connection() {
    return 'mssql_portal'
  }

  static get table() {
    return 'ptl_policy'
  }

  @column()
  public min_length_pass: string

  @column()
  public min_uppercase: string

  @column()
  public min_lowercase: string

  @column()
  public min_numeric: string

  @column()
  public expired_pass: string

  @column()
  public min_reuse_change_pass: string

  @column()
  public max_access_failure: string

  @column()
  public min_symbol: string
  

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
