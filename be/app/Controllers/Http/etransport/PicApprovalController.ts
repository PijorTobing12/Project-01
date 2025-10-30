// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from "@ioc:Adonis/Lucid/Database";
import PicAppr from "App/Models/PicAppr";
import UserLogin from "App/Models/UserLogin";

export default class PicApprovalController {

    public async getPICApproval({ request, response }) {
        
        // const qUserLogin = await UserLogin
        //                 .query() 
        //                 .select('*') 
        //                 .where('Emp_Id', request.input('empid'))   
        //                 .first();
        // var bu_desc = qUserLogin.bu_id;
        // bu_desc = 'WDJR';

        const getbu = await Database
                        .from('m_bisnis_unit')
                        .select('bu_code') 
                        .where('bu_code_qad', request.input('domain'))   
                        .first();
        var bu_desc = getbu.bu_code;
        
        
        const qdata3 = await Database
                    .connection('mssql_hris_ext')
                    // .table('mstr_employee')
                    .from('mstr_employee')
                    .join('v_user_login', 'v_user_login.Emp_Id', '=', 'mstr_employee.id')
                    .select('mstr_employee.*')
                    .where('v_user_login.bu_id', bu_desc)
                    .where('status', 'ACTIVE')
                    .where('id_div', '4693')
                    .where((query) => 
                    {                      
                        query.where('id_dept', '4697')
                        query.orWhere('id_dept', '')                                                 
                    }                           
        )      
    
        const qdata2 = await Database
                        .from('site')
                        .where('domain', request.input('domain'));  

        if(request.input('rowsPerPage') == null){            
            const qdata = await Database
                        .from('approve_harga')  
                        .where('bu_approve_harga', request.input('domain'))                    
            return {data1:qdata, data2:qdata2, data3:qdata3}                 
        }else{   
            
            const page = request.input('page', 1)
            var req = request.input('filter')
            const qdata = await 
                        Database
                        .from('approve_harga') 
                        .where('bu_approve_harga', request.input('domain')) 
                        .where
                        (
                        (query) => 
                        {
                            if(request.input('filter') != null)
                            {
                                query.where('bu_approve_harga', 'like', `%${request.input('filter')}%`)
                                query.orWhere('site_approve_harga', 'like', `%${request.input('filter')}%`)
                                query.orWhere('level_approve_harga', 'like', `%${request.input('filter')}%`)
                                query.orWhere('ket_approve_harga', 'like', `%${request.input('filter')}%`)   
                                query.orWhere('nik_approve_harga', 'like', `%${request.input('filter')}%`)   
                            }                    
                        }                           
                        )                              
                        .select('approve_harga.*')  
                        .orderBy('nik_approve_harga','asc')                                         
                        .paginate(page, request.input('rowsPerPage'))  

            for (const loopqdata of qdata){
                const cekaktif = await Database
                    .connection('mssql_hris_ext')
                    // .table('mstr_employee')
                    .from('mstr_employee')                   
                    .where('id', loopqdata.DO_approve_harga)
                    .first()               
                if(cekaktif){
                    loopqdata.status = cekaktif.status;
                }else{
                    loopqdata.status = '-';
                }                
            }

            for(const loopqdata of qdata){
                const getbuname =   await Database
                                    .from('m_bisnis_unit')
                                    .where('bu_code_qad',  loopqdata.bu_approve_harga)  
                                    .first(); 
                if(getbuname){
                    loopqdata.buname = getbuname.bu_name;
                }else{
                    loopqdata.buname = loopqdata.bu_approve_harga;
                }
            }
            // return qdata;
                        
            return {data1:qdata, data2:qdata2, data3:qdata3}                 
        }    
    }

    public async savePICApproval({ request, response }) {  
        // return request;
        const dayjs = require('dayjs')  
        var varaktif = '';
        if(request.input('aktif') == true){
            varaktif = 'Aktif';
        }else{
            varaktif = 'Non Aktif';
        }   

        let siteqad = null;
        const getsitecode =   await Database
        .from('site')
        .where('desc',  request.input('site'))  
        .first(); 
        if(getsitecode){
            siteqad = getsitecode.code;
        }else{
            siteqad = '';
        }
        
        const datauser = await Database
                        .from('user')
                        .where('empid',   request.input('DOUser'))        
                        .first(); 

        const res =   await Database
        .from('approve_harga')
        .where('bu_approve_harga',  request.input('domain'))  
        .where('site_approve_harga', request.input('site'))  
        .where('level_approve_harga', request.input('level'))  
        .where('nik_approve_harga', request.input('nik'))  
        .first();  
             
        if(res == null){                                
            await Database
            .insertQuery() // 👈 gives an instance of insert query builder
            .table('approve_harga')
            .insert(
              { 
                bu_approve_harga        :  request.input('domain'),
                site_approve_harga      :  request.input('site'),
                siteqad_approve_harga   :  siteqad,
                level_approve_harga     :  request.input('level'),
                ket_approve_harga       :  request.input('keterangan'),
                nik_approve_harga       :  request.input('nik'),
                nama_approve_harga      :  request.input('nama'),
                email_approve_harga     :  request.input('email'),
                DO_approve_harga        :  request.input('empid'),
                user_create     :  request.input('DOUser'),
                date_create     :  dayjs().format('YYYY-MM-DD HH:mm:ss'),
                posisi_approve_harga    :  request.input('posisi'),
              }
            )
            return response.status(200).json({
                message: "Data Berhasil Ditambahkan",
                status: true,
            });            
        }else{
            // return 'ada data';
            const update = await Database
            .from('approve_harga')
            .where('bu_approve_harga',  request.input('domain'))  
            .where('site_approve_harga', request.input('site'))  
            .where('level_approve_harga', request.input('level'))  
            .where('nik_approve_harga', request.input('nik'))            
            .update(
                {   
                    site_approve_harga      :  request.input('site'),
                    siteqad_approve_harga   :  siteqad,
                    level_approve_harga     :  request.input('level'),
                    ket_approve_harga       :  request.input('keterangan'),
                    nik_approve_harga       :  request.input('nik'),
                    nama_approve_harga      :  request.input('nama'),
                    email_approve_harga     :  request.input('email'),   
                    DO_approve_harga        :  request.input('empid'),             
                    user_update     :  request.input('DOUser'),
                    date_update     :  dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    posisi_approve_harga    :  request.input('posisi'),
                }                
            )  
            
            return response.status(200).json({
                message: "Data Berhasil Diupdate",
                status: true,
            });
        }
        return 'Shendy Save';
    }

    public async saveEditPICApproval({ request, response }) {         
        const dayjs = require('dayjs')  
        
        const datauser = await Database
                        .from('user')
                        .where('empid',   request.input('DOUser'))        
                        .first(); 

        let siteqad = null;
        const getsitecode =   await Database
        .from('site')
        .where('desc',  request.input('site'))  
        .first(); 
        if(getsitecode){
            siteqad = getsitecode.code;
        }else{
            siteqad = '';
        }

        const res =   await Database
        .from('approve_harga')
        .where('id_approve_harga',  request.input('id'))        
        .first();        
        if(res == null){                    

            await Database
            .insertQuery() // 👈 gives an instance of insert query builder
            .table('approve_harga')
            .insert(
              { 
                bu_approve_harga        :  request.input('domain'),
                site_approve_harga      :  request.input('site'),
                siteqad_approve_harga   :  siteqad,
                level_approve_harga     :  request.input('level'),
                ket_approve_harga       :  request.input('keterangan'),
                nik_approve_harga       :  request.input('nik'),
                nama_approve_harga      :  request.input('nama'),
                email_approve_harga     :  request.input('email'),
                DO_approve_harga        :  request.input('empid'),
                user_create     :  request.input('DOUser'),
                date_create     :  dayjs().format('YYYY-MM-DD HH:mm:ss'),
                posisi_approve_harga    :  request.input('posisi'),
              }
            )
            return response.status(200).json({
                message: "success",
                status: true,
            });            
        }else{
            const update = await Database
            .from('approve_harga')
            .where('id_approve_harga',  request.input('id'))          
            .update(
                {   
                    bu_approve_harga        :  request.input('domain'),
                    site_approve_harga      :  request.input('site'),
                    siteqad_approve_harga   :  siteqad,
                    level_approve_harga     :  request.input('level'),
                    ket_approve_harga       :  request.input('keterangan'),
                    nik_approve_harga       :  request.input('nik'),
                    nama_approve_harga      :  request.input('nama'),
                    email_approve_harga     :  request.input('email'),
                    DO_approve_harga        :  request.input('empid'),
                    user_update     :  request.input('DOUser'),
                    date_update     :  dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    posisi_approve_harga    :  request.input('posisi'),
                }                
            )  
            
            return response.status(200).json({
                message: "Data Berhasil Diupdate",
                status: true,
            });
        }
        return 'Shendy Save';
    }

    public async deletePICApproval({ request, response }) { 
        // return request;

        const cek =   await Database
        .from('approve_harga')
        .where('id_approve_harga',  request.input('id_approve_harga'))
        .first();
        var site    = cek.site_approve_harga;
        var domain  = cek.bu_approve_harga;
        var level   = cek.level_approve_harga;

        const ceklevel =   await Database
        .from('approve_harga')
        .where('site_approve_harga',  site)
        .where('bu_approve_harga',  domain)
        .where('level_approve_harga', '>' ,level)
        .first();
        if(ceklevel){
            return response.status(406).json({
                message: "Data Tidak Bisa Dihapus, Hapus Level Tertinggi Terlebih Dahulu",
                status: true,
            }); 
        }else{
            const res =   await Database
            .from('approve_harga')
            .where('id_approve_harga',  request.input('id_approve_harga'))
            .first();        
            if(res == null){           
                return response.status(406).json({
                    message: "Data Tidak Ditemukan",
                    status: true,
                });            
            }else{
                await Database
                .from('approve_harga')
                .where('id_approve_harga',  request.input('id_approve_harga'))
                .delete()
                
                return response.status(200).json({
                    message: "Data Berhasil Dihapus",
                    status: true,
                });
            }
        }
        return 'Shendy Delete';
    }

}
