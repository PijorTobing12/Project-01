import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Supplier extends BaseModel {

  static get connection() {
    return 'mssql_procsys'
  }

  static get table() {
    return 'm_supplier'
  }

  @column({ isPrimary: true })
  public sup_npwp: string

  @column()
  public sup_code_app: string

  @column()
  public sup_name: string

  @column()
  public sup_email: string

  @column()
  public sup_date_regis: DateTime

  @column()
  public sup_flag: number

  @column()
  public sup_status: number

  @column()
  public created_by: string

  @column()
  public uuid: string 
}
