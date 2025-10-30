import Database from "@ioc:Adonis/Lucid/Database";
import User from "App/Models/User";
import Menu from "App/Models/Menu";
import MasterAplikasi from "App/Models/MasterAplikasi";
import Hash from '@ioc:Adonis/Core/Hash';
import Hris from "App/Models/Hris";
import UserDomain from "App/Models/UserDomain";
import PortalPolicy from "App/Models/PortalPolicy";
import Mail from '@ioc:Adonis/Addons/Mail';
import Encryption from '@ioc:Adonis/Core/Encryption'

export default class VendorController {
      public async loginvendor({ request, response }) {                 
        // const res = await User.select('*').where('nik', request.input('nik')).first();
        const res = await User
                    .query()
                    .preload('domains')
                    .select('*').where('nik', request.input('npwp')).first();
                    
        // return res2;
        if(res == null){
          return response.status(406).json({
            message: "NPWP Tidak Ditemukan",
            status: true,
            data: res,
          });   
        }else{
          if (await Hash.verify(res.password, request.input('pass'))) {
            // verified
            return response.status(200).json({
              message: "success",
              status: true,
              data: res,
            });
          }else{
            return response.status(406).json({
              message: "Password Salah",
              status: true,
              data: res,
            }); 
          }
        }
        return res;
  
        return request.ip();
        return request.body.nik + '' + 'shendy';
        
        // selecting table returns the query builder instance as well
        Database
        .from('user')
        .select('*')
        ;
        return Database.from('user');
        
        // const res = await User.all();
        // return response.status(200).json({
        //   message: "success",
        //   status: true,
        //   data: res,
        // });
         
      }
      
      public async forgotPassword({ request, response }) {   
        const dayjs = require('dayjs');

        const res = await User
                    .query()
                    .select('*').where('nik', request.input('nik')).first();

        if(!res){
          return response.status(406).json({
            message: "NPWP Tidak Ditemukan",
            status: true,
            data: res,
          });   
        }else{
          const link = Encryption.encrypt(res.empid,'5mins')
          // const link = Encryption.encrypt(res.empid)

          await Database
          .insertQuery() // 👈 gives an instance of insert query builder
          .table('log_forgotpassword')
          .insert(
            { 
              npwp: request.input('nik'), 
              res_id: res.id,
              nama_penerima: res.email,
              email_penerima: res.nama,
              entrydate: dayjs().format('YYYY-MM-DD'),              
            }
          ) 

          // return res.email + res.nama;

          await Mail.send((message) => {
          message
              .from('autosys@dbc.co.id')
              .to(res.email)
              .bcc('shendy.dewandaru@dbc.co.id')
              .subject('Update Password Portal Vendor')              
              .htmlView('emails/update_password', {
                  user: { fullName: res.nama },
                  link: `https://app-vend.dbc.co.id/#/update_password/${link}`,
              })
          })
        }           
      }

      public async get_security_control({ request, response }) {
        const npwp = Encryption.decrypt(request.input('npwp'))
        if(npwp == '' || npwp == null){
          return response.status(406).json({
            message: "Link Expired",
          }); 
        }else{
          return await PortalPolicy.all();
        }         
      }

      public async updatePassword({ request, response }) { 
        
        const dayjs = require('dayjs')  
        const npwp = Encryption.decrypt(request.input('npwp'))
        const getlogpass = await Database                                         
                          .from('log_pass')
                          .where('empid', npwp)
        const getlogpass2 = [];
        for(const loopgetlogpass of getlogpass){
          getlogpass2.push(Encryption.decrypt(loopgetlogpass.pass))
        }

        if (getlogpass2.includes(request.input('pass2'))){
          return response.status(406).json({
            message: 'Password tersebut sudah pernah digunakan, mohon gunakan password lain.',
          }); 
        }

        const due = await PortalPolicy
                    .query()
                    .select('expired_pass');
        const queryupdate = await Database
        .from('user')
        .where('empid', npwp)
        .update(
            {                             
              password            : await Hash.make(request.input('pass2')),
              user_duedate_pass   : dayjs().add(due[0].expired_pass, 'day').format('YYYY-MM-DD'),
              user_failure_login  : 0,
              updated_at          : dayjs().format('YYYY-MM-DD'),
            }
        )

        await Database
        .insertQuery() // 👈 gives an instance of insert query builder
        .table('log_pass')
        .insert(
          { empid: npwp, 
            pass: Encryption.encrypt(request.input('pass2')),
            created_at: dayjs().format('YYYY-MM-DD'),
            updated_at: dayjs().format('YYYY-MM-DD'),
          }
        )
      }

      public async getUser({ request, response }) {
        if(request.input('rowsPerPage') == null){
          const res = await User.all();
          return response.status(200).json({
            message: "success",
            status: true,
            data: res,
          });
        }else{
          const page = request.input('page', 1)
          var req = request.input('filter')
          const res = await User
                    .query()
                    .preload('domains')
                    .where
                    (
                      (query) => 
                      {
                        if(request.input('filter') != null)
                        {
                          query.where('nama', 'like', `%${request.input('filter')}%`)
                          query.orWhere('nik', 'like', `%${request.input('filter')}%`)
                          query.orWhere('empid', 'like', `%${request.input('filter')}%`)
                          query.orWhere('email', 'like', `%${request.input('filter')}%`)                        
                        }                    
                      }                           
                    )                  
                    .paginate(page, request.input('rowsPerPage'))                                  
  
                    return res;                  
        }        
      }
  
      public async getHrisByNIK({ request, response }) {  
        
        const res = await Hris                  
                    .query()
                    .select('Emp_Id','user_name','user_newid','user_email','user_id','bu_id')
                    .where('user_newid', request.input('nik'))
                    .first();
        if(res == null){
          return response.status(406).json({
            message: "NIK tidak terdaftar di system HRIS",
            status: true,
            data: res,
          }); 
        }else{
          return res;
        }                      
      }
  
      public async saveUser({ request, response }) {      
        
        const res =   await Database
                      .from('user_domain')
                      .where('empid',  request.input('empid'))
                      .first();
        if(res != null){
          await Database
            .from('user_domain')
            .where('empid',  request.input('empid'))
            .delete()
            // return 'ada data';
        }else{
          // return 'kosong';
        }
        
        const cekuser =   await Database
                      .from('user')
                      .where('empid',  request.input('empid'))
                      .first();
        if(cekuser != null){
          await Database
          .from('user')
          .where('empid',  request.input('empid'))
          .delete()
        }else{
  
        }
  
        await Database
        .insertQuery() // 👈 gives an instance of insert query builder
        .table('user')
        .insert(
          { nama:  request.input('nama'), 
            email:  request.input('email'),
            nik:  request.input('nik'),
            empid:  request.input('empid'),
            role:  request.input('role'),
            password: await Hash.make(request.input('pass')) ,
            domain:  request.input('domain')[0],
          }
        )
  
        for(const val of request.input('domain')) {
          const user = await UserDomain.create({
            empid: request.input('empid'),
            domain: val
          })
        }      
      }
  
      public async deleteUser({ request, response }) {     
        const cekuser =   await Database
                      .from('user')
                      .where('empid',  request.input('empid'))
                      .first();
        if(cekuser != null){
          await Database
          .from('user')
          .where('empid',  request.input('empid'))
          .delete()
  
          await Database
          .from('user_domain')
          .where('empid',  request.input('empid'))
          .delete()
  
          const res = await User.all();
          return response.status(200).json({
            message: "success",
            status: true,
          });
        }else{
          return response.status(406).json({
            message: "Data tidak tersedia",
            status: true,
            // data: res,
          });  
        }       
      }   
}
