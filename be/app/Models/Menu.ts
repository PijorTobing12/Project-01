import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import MasterAplikasi from 'App/Models/MasterAplikasi'

export default class Menu extends BaseModel {

  public static table = 'menu'

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public link: string

  @column()
  public icon: string

  @column()
  public parent: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
