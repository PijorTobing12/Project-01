import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class SupplierPathDet extends BaseModel {

  static get connection() {
    return 'mssql_procsys'
  }

  static get table() {
    return 'm_supp_dtl_path'
  }

  @column({ isPrimary: true })
  public sup_dtl_id: number

  @column()
  public sup_code_app: string

  @column()
  public sup_code: string

  @column()
  public details_column: number

  @column()
  public details_column_desc: string

  @column()
  public details_column_prioritas: number

  @column()
  public details_content_prioritas: number

  @column()
  public details_content_1: string

  @column()
  public details_content_2: string

  @column()
  public details_content_3: string

  @column()
  public details_content_4: string

  @column()
  public details_content_5: string

  @column()
  public details_content_6: string

  @column()
  public details_content_7: string

  @column()
  public details_content_8: string

  @column()
  public details_content_9: string

  @column()
  public details_content_10: string

  @column()
  public details_content_11: string

  @column()
  public details_flag: number

  @column()
  public details_status: number 

  @column()
  public created_by: string

  @column.date()
  public created_date: DateTime 

  @column()
  public modified_by: string

  @column.date()
  public modified_date: DateTime   

  @column()
  public status_update: string

  @column()
  public active: string 
}
