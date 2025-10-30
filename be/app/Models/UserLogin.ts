import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class UserLogin extends BaseModel {

  static get connection() {
    return 'mssql_hris_ext'
  }

  static get table() {
    return 'v_user_login'
  }

  @column()
  public Emp_Id: string

  @column()
  public bu_id: string
  

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
