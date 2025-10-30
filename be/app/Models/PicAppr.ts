import { DateTime } from 'luxon'
import { BaseModel, column,hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import UserLogin from 'App/Models/UserLogin'
export default class PicAppr extends BaseModel {
  static get connection() {
    return 'mssql_hris_ext'
  }
  static get table() {
    return 'mstr_employee'
  }
  @column()
  public id: string

  @column()
  public nik: string

  @column()
  public nama: string

  @column()
  public email: string

  @column()
  public id_div: string

  @column()
  public id_dept: string

  @column()
  public status: string

  // @column.dateTime({ autoCreate: true })
  // public createdAt: DateTime

  // @column.dateTime({ autoCreate: true, autoUpdate: true })
  // public updatedAt: DateTime

  @hasMany(() => UserLogin, {
    foreignKey: 'Emp_Id', // userLogin
    localKey: 'id', // mstremployee
  })
  public PICApprAll: HasMany<typeof UserLogin>


}
