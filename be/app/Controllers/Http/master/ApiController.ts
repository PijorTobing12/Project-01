// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from "@ioc:Adonis/Lucid/Database";
import User from "App/Models/User";

export default class ApiController {
  public async getUser({ request, response }) {
    const res = await User.all();
    return response.status(200).json({
      message: "success",
      status: true,
      data: res,
    });
  }   

  public async getUser1({ request, response }) {
    const res = await Database.query().from("user").select("*");
    return response.status(200).json({
      message: "success",
      status: true,
      data: res,
    });
  }
}
