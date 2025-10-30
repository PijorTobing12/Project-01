import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class SupplierPathUpload extends BaseModel {

  static get connection() {
    return 'mssql_procsys'
  }

  static get table() {
    return 'm_supp_upload_path'
  }

  @column({ isPrimary: true })
  public upload_id: number

  @column()
  public sup_code_app: string

  @column()
  public details_column: number

  @column()
  public details_upload_app: string

  @column()
  public details_upload: string
  
  @column()
  public created_by: string

  @column.date()
  public created_date: DateTime 
}
