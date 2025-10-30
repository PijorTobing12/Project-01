import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Hris extends BaseModel {

  static get connection() {
    return 'mssql_hris'
  }

  static get table() {
    return 'user_hris_new'
  }
  // public static table = 'user_hris_new'

  // @column({ isPrimary: true })
  // public Emp_Id: string

  @column()
  public user_name: string

  @column()
  public user_newid: string

  @column()
  public user_email: string

  @column()
  public user_id: string

  @column()
  public bu_id: string     
  
  @column()
  public user_pass: string  
  
  

  @column()
  public Emp_Id: string  
  

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
