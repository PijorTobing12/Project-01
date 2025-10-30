import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import UserDomain from 'App/Models/UserDomain'

export default class User extends BaseModel {
  public static table = 'user'

  @column({ isPrimary: true })
  public id: number

  @column()
  public empid: string

  @column()
  public nama: string

  @column()
  public email: string

  @column()
  public password: string

  @column()
  public domain: string

  @column()
  public nik: string

  @column()
  public role: string

  @column()
  public user_failure_login: string

  @column()
  public user_duedate_pass: string


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => UserDomain, {
    foreignKey: 'empid', // userdomain
    localKey: 'empid', // user
  })
  public domains: HasMany<typeof UserDomain>

  
}
