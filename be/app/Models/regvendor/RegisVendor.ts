import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
//import { column, beforeSave, BaseModel, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'

export default class RegisVendor extends BaseModel {

  static get connection() {
    return 'mssql_procsys'
  }

  static get table() {
    return 'regis_vendor'
  }
  // public static table = 'user_hris_new'

  @column({ isPrimary: true })
  public regis_code_auto: number

  @column()
  public regis_code_app: string

  @column()
  public regis_npwp: string

  @column()
  public regis_name: string

  @column()
  public regis_email: string

  @column()
  public regis_phone: string

  @column.date()
  public created_date: DateTime 

  @column()
  public bu_id: number     
  
  @column()
  public regis_flag: number  

  @column()
  public uuid: string  
}
