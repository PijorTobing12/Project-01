// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Database from "@ioc:Adonis/Lucid/Database";
import User from "App/Models/User";
import Hash from "@ioc:Adonis/Core/Hash";
import Hris from "App/Models/Hris";
import UserDomain from "App/Models/UserDomain";
import dayjs from "dayjs";
import jwt from "jsonwebtoken";

export default class UserController {
  public async login({ request, response, auth }) {
    const res = await User.query()
      .preload("domains")
      .select("*")
      .where("nik", request.input("nik"))
      .first();

    const { nik, pass } = request.body();

    if (res == null) {
      return response.status(406).json({
        message: "NIK Tidak Ditemukan",
        status: true,
        data: res,
      });
    } else {
      if (res.user_failure_login > 4) {
        const queryupdate = await Database.from("user")
          .where("empid", nik)
          .update({
            user_failure_login: res.user_failure_login + 1,
          });

        return response.status(406).json({
          message:
            "Anda telah salah memasukan password sebanyak " +
            (res.user_failure_login + 1) +
            " kali. Silahkan Reset Password",
        });
      }

      if (await Hash.verify(res.password, request.input("pass"))) {
        if (
          dayjs().format("YYYY-MM-DD") <
          dayjs(res.user_duedate_pass).format("YYYY-MM-DD")
        ) {
          const token = await auth.attempt(nik, pass);

          let dtVend = await Database.connection("mssql_procsys")
            .from("m_supplier")
            .select("sup_code")
            .where("sup_npwp", res.nik)
            .first();

          let token1 = jwt.sign(
            { empid: res.$attributes.empid },
            "DbcTokenAppDev@2023"
          );

          await Database.table("log_akses").insert({
            nik: request.input("nik"),
            tanggal: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            status: "login",
            keterangan: "user",
            ip: "",
            nama_url: request.header("origin"),
          });

          return response.status(200).json({
            message: "success",
            status: true,
            data: res,
            token: token.token,
            vend: dtVend.sup_code,
            token1: token1,
          });
        } else {
          return response.status(406).json({
            message: "Password Sudah Expired, Silahkan Reset Password",
          });
        }
      } else {
        const queryupdate = await Database.from("user")
          .where("empid", nik)
          .update({
            user_failure_login: res.user_failure_login + 1,
          });

        return response.status(406).json({
          message: "Password Salah",
        });
      }
    }
  }

  public async refresh_token({ request, response, auth }) {
    const getpass = await Database.from("user")
      .select("*")
      .where("empid", request.input("empid"))
      .first();
    let pass = getpass.password;

    const res = await User.query()
      .preload("domains")
      .select("*")
      .where("nik", request.input("nik"))
      .first();

    const { nik } = request.body();
    const token = await auth.attempt(nik, pass);

    if (res == null) {
      return response.status(406).json({
        message: "NIK Tidak Ditemukan",
        status: true,
        data: res,
      });
    } else {
      if (await Hash.verify(res.password, request.input("pass"))) {
        // verified
        return response.status(200).json({
          message: "success",
          status: true,
          data: res,
          token: token.token,
        });
      } else {
        return response.status(406).json({
          message: "Password Salah",
          status: true,
          data: res,
        });
      }
    }
  }

  public async autologin({ request, response, auth, setRequestHeader }) {
    const res = await User.query()
      .preload("domains")
      .select("*")
      .where("nik", request.input("nik"))
      .first();
    // return res;

    if (res == null) {
      return response.status(406).json({
        message: "NIK Tidak Ditemukan",
        status: true,
        data: res,
      });
    } else {
      return response.status(200).json({
        message: "success",
        status: true,
        data: res,
      });
    }
  }

  public async getUser({ request, response }) {
    if (request.input("rowsPerPage") == null) {
      const res = await User.all();
      return response.status(200).json({
        message: "success",
        status: true,
        data: res,
      });
    } else {
      // return request;
      const page = request.input("page");
      var req = request.input("filter");
      const res = await User.query()
        .preload("domains")
        .where((query) => {
          if (request.input("filter") != null) {
            query.where("nama", "like", `%${request.input("filter")}%`);
            query.orWhere("nik", "like", `%${request.input("filter")}%`);
            query.orWhere("empid", "like", `%${request.input("filter")}%`);
            query.orWhere("email", "like", `%${request.input("filter")}%`);
          }
        })
        .orderBy("nama", "asc")
        .paginate(page, request.input("rowsPerPage"));

      return res;
    }
  }

  public async getHrisByNIK({ request, response }) {
    const res = await Hris.query()
      .select(
        "Emp_Id",
        "user_name",
        "user_newid",
        "user_email",
        "user_id",
        "bu_id"
      )
      .where("user_newid", request.input("nik"))
      .first();
    if (res == null) {
      return response.status(406).json({
        message: "NIK tidak terdaftar di system HRIS",
        status: true,
        data: res,
      });
    } else {
      let posisi;
      const qdata3 = await Database.connection("mssql_hris_ext")
        .from("mstr_employee")
        .where("id", res.Emp_Id)
        .first();
      if (qdata3) {
        posisi = qdata3.jabatan;
      } else {
        posisi = "Posisi Not Found";
      }
      // return res;
      return { data: res, posisi: posisi };
      return res;
    }
  }

  public async getHrisByNIKuser({ request, response }) {
    const res = await Hris.query()
      .select(
        "Emp_Id",
        "user_name",
        "user_newid",
        "user_email",
        "user_id",
        "bu_id"
      )
      .where("user_newid", request.input("nik"))
      .first();
    if (res == null) {
      return response.status(406).json({
        message: "NIK tidak terdaftar di system HRIS",
        status: true,
        data: res,
      });
    } else {
      let posisi;
      const qdata3 = await Database.connection("mssql_hris_ext")
        .from("mstr_employee")
        .where("id", res.Emp_Id)
        .first();
      if (qdata3) {
        posisi = qdata3.jabatan;
      } else {
        posisi = "Posisi Not Found";
      }
      // return res;
      // return {data:res, posisi:posisi}
      return res;
    }
  }

  public async saveUser({ request, response }) {
    const res = await Database.from("user_domain")
      .where("empid", request.input("empid"))
      .first();
    if (res != null) {
      await Database.from("user_domain")
        .where("empid", request.input("empid"))
        .delete();
      // return 'ada data';
    } else {
      // return 'kosong';
    }

    const cekuser = await Database.from("user")
      .where("empid", request.input("empid"))
      .first();
    if (cekuser != null) {
      await Database.from("user")
        .where("empid", request.input("empid"))
        .delete();
    } else {
    }

    await Database.insertQuery() // 👈 gives an instance of insert query builder
      .table("user")
      .insert({
        nama: request.input("nama"),
        email: request.input("email"),
        nik: request.input("nik"),
        empid: request.input("empid"),
        role: request.input("role"),
        password: await Hash.make(request.input("pass")),
        domain: request.input("domain")[0],
      });

    await Database.insertQuery() // 👈 gives an instance of insert query builder
      .table("akses_aplikasi")
      .insert({
        empid: request.input("empid"),
        aplikasi_rowid: "0",
      });

    for (const val of request.input("domain")) {
      const user = await UserDomain.create({
        empid: request.input("empid"),
        domain: val,
      });
    }
  }

  public async deleteUser({ request, response }) {
    const cekuser = await Database.from("user")
      .where("empid", request.input("empid"))
      .first();
    if (cekuser != null) {
      await Database.from("user")
        .where("empid", request.input("empid"))
        .delete();

      await Database.from("user_domain")
        .where("empid", request.input("empid"))
        .delete();

      const res = await User.all();
      return response.status(200).json({
        message: "success",
        status: true,
      });
    } else {
      return response.status(406).json({
        message: "Data tidak tersedia",
        status: true,
        // data: res,
      });
    }
  }
}
