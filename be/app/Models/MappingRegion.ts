import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class MappingRegion extends BaseModel {

  static get connection() {
    return 'mssql'
  }

  static get table() {
    return 'm_region'
  }

  @column({ isPrimary: true })
  public rowid: number

  @column()
  public bu_region: string

  @column()
  public site_region: string

  @column()
  public kota_region: string

  @column()
  public region: string

  @column()
  public status_region: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
