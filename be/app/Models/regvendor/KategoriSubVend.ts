import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class KategoriSubVend extends BaseModel {

  static get connection() {
    return 'mssql_procsys'
  }

  static get table() {
    return 'm_kategorisub_vend'
  }

  @column({ isPrimary: true })
  public katsub_vend_id: number

  @column()
  public katsub_vend_name: string

  @column()
  public kat_vend_id: number

  @column()
  public status: number

  @column()
  public created_by: string

  @column.date()
  public created_date: DateTime 

  @column()
  public modified_by: string

  @column.date()
  public modified_date: DateTime 
  
}
