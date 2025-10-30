import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class KategoriVend extends BaseModel {

  static get connection() {
    return 'mssql_procsys'
  }

  static get table() {
    return 'm_kategori_vend'
  }

  @column({ isPrimary: true })
  public kat_vend_id: number

  @column()
  public kat_vend_name: string

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
