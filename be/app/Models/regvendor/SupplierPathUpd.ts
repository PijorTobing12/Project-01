import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class SupplierPathUpd extends BaseModel {

  static get connection() {
    return 'mssql_procsys'
  }

  static get table() {
    return 'm_supp_path_upd'
  }

  @column({ isPrimary: true })
  public sup_npwp: string

  @column()
  public sup_id: number

  @column()
  public sup_code_app: string

  @column()
  public sup_code: string

  @column()
  public sup_name: string

  @column()
  public sup_cat: string

  @column()
  public sup_type: string

  @column()
  public sup_email: string

  @column()
  public sup_email2: string

  @column()
  public sup_email3: string

  @column()
  public sup_website: string

  @column()
  public sup_date_regis: DateTime

  @column()
  public sup_date_approve: Date

  @column()
  public sup_form_company: string

  @column()
  public sup_type_company: string

  @column()
  public sup_office_address: string

  @column()
  public sup_office_phone: string

  @column()
  public sup_office_fax: string

  @column()
  public sup_warehouse_address: string

  @column()
  public sup_warehouse_phone: string

  @column()
  public sup_warehouse_fax: string

  @column()
  public sup_flag: number

  @column()
  public sup_status_prog: number

  @column()
  public sup_status: number

  @column()
  public uuid: string 

  @column()
  public created_by: string

  @column.date()
  public created_date: DateTime 

  @column()
  public modified_by: string

  @column.date()
  public modified_date: DateTime   

  @column()
  public close_regis_date: DateTime

  @column()
  public approval_level: number 
  
  @column()
  public sup_comp_other: string
}
