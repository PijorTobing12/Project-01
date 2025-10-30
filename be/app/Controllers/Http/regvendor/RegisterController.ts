import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import Application from '@ioc:Adonis/Core/Application'
import Database from "@ioc:Adonis/Lucid/Database";
import { getWSA } from "App/Helpers/Wsa";
import { formatDateTime, dateTime, dateOnly, ucWords } from "App/Helpers/Function";
import Mail from '@ioc:Adonis/Addons/Mail';
import RegisVendor from 'App/Models/regvendor/RegisVendor';
import Supplier from 'App/Models/regvendor/Supplier';
import SupplierPath from 'App/Models/regvendor/SupplierPath';
import SupplierPathDet from 'App/Models/regvendor/SupplierPathDet';
import KategoriVend from 'App/Models/regvendor/KategoriVend';
import KategoriSubVend from 'App/Models/regvendor/KategoriSubVend';
import SupplierPathUpload from 'App/Models/regvendor/SupplierPathUpload';
import SupplierPathUpd from 'App/Models/regvendor/SupplierPathUpd';
const dayjs = require('dayjs');
const datetimeNow = dayjs().format('YYYY-MM-DD HH:mm:ss');
const ftp = require("basic-ftp");
import { senderMail } from "App/Helpers/mailSender";
import Config from '@ioc:Adonis/Core/Config'

export default class RegisterController {

    public async getBu({ request, response }) {
        if (request.input('search') == null) {
            const res = await Database.from('m_bisnis_unit').select('bu_id','bu_name').where('status',1).orderBy('bu_id','asc');
            return response.json(res);
        }
        else {
            const res = await Database
                        .from('m_bisnis_unit')
                        .select('bu_id','bu_name')
                        .where('status', 1)
                        .where((query) => {
                            if (request.input('search') != null)
                            {
                              query.where('bu_name', 'like', `%${request.input('search')}%`);                                          
                            }                    
                        })    
                        .orderBy('bu_id','asc');          

            return response.json(res);  
        }
    } 

    public async getKategori({ response }) {
        const res = await KategoriVend
                    .query()
                    .where('status',1)
                    .orderBy('kat_vend_name','asc');

        return response.json(res);
    } 

    public async getKategoriSub({ request, response }) {
        // cek data kategori_vend
        const cekdata = await KategoriVend.query().where('kat_vend_name', request.input('name')).first();

        if(cekdata){
            const res = await KategoriSubVend
                        .query()
                        .where('kat_vend_id', cekdata.kat_vend_id)
                        .orderBy('katsub_vend_name','asc');

            return response.json(res);            
        }
    }     
    
    public async getBank({ request }) {
        const bu_id = request.input('bu_id');

        const res = await Database.from('m_bisnis_unit').select('bu_code_qad').where('bu_id',bu_id).first();
        if(res){
            const domain = res.bu_code_qad;

            // cek WSA getDBCCekVendByNpwp
            let resWsa = [];
            const args = { parDomain: domain, parFldName: "sup_bank" };
            
            let callWsa: any;
            callWsa = await getWSA(Env.get('LINK_WSA'), "getDBCMstGenCode", args);
            resWsa = callWsa.tt_codemstr.tt_codemstrRow;      

            return resWsa;
        }
    } 

    public async getKotaCabang({ request }) {
        const bu_id = request.input('bu_id');

        const res = await Database.from('m_bisnis_unit').select('bu_code_qad').where('bu_id',bu_id).first();
        if(res){
            const domain = res.bu_code_qad;

            // cek WSA getDBCCekVendByNpwp
            let resWsa = [];
            const args = { parDomain: domain, parFldName: "sup_kotarek" };
            
            let callWsa: any;
            callWsa = await getWSA(Env.get('LINK_WSA'), "getDBCMstGenCode", args);
            resWsa = callWsa.tt_codemstr.tt_codemstrRow;      

            return resWsa;        
        }
    }    

    public async validationdata({ request, response }: HttpContextContract) {
        try{
            const sender = await senderMail();
            const mailConfig = Config.get('mail');

            mailConfig.mailers.smtp.host = sender[0].ms_host;
            mailConfig.mailers.smtp.auth.user = sender[0].ms_name;
            mailConfig.mailers.smtp.auth.pass = sender[0].ms_pass;

            let today = new Date().toISOString().slice(0, 10);

            // cek WSA getDBCCekVendByNpwp
            let resWsa = '';
            const args = { xxnpwp: request.input('npwp'), xxnik: "?" };
            let callWsa;
            callWsa = await getWSA(Env.get('LINK_WSA'), "getDBCCekVendByNpwp", args);
            resWsa = callWsa.xxresult;

            if(resWsa){
                return response.status(406).json({
                    message: "NPWP sudah terdaftar",
                    status: true,
                }); 
            }
            else{ 
                // Cek Data Yang sudah berhasil daftar (tabel m_supplier where sup_npwp = npwp)
                const cek_supp = await Supplier.query().where('sup_npwp', request.input('npwp'));

                // Cek Data tabel regis_vendor ? (tabel regis_vendor where regis_npwp = npwp and regis_flag = 1)
                const cek_vend = await RegisVendor
                                    .query()
                                    .where('regis_npwp', request.input('npwp'))
                                    .where('created_date', '>=' ,today)
                                    .where('regis_flag', 1);
                                    
                // Cek Vendor sudah Approve (tabel regis_vendor where regis_npwp = npwp and regis_flag = 2)
                const cek_vend_appr = await RegisVendor
                                    .query()
                                    .where('regis_npwp', request.input('npwp'))
                                    .where('regis_flag', 2); 
                                    
                if(cek_supp.length <= 0) {
                    if(cek_vend_appr.length <= 0) {
                        if(cek_vend.length <= 0) {

                            // hapus data regis_vendor jika ada npwp yang sama
                            await RegisVendor
                                .query()
                                .where('regis_npwp', request.input('npwp'))
                                .where('regis_flag', 1)
                                .delete();

                            // generate regis_code_app
                            const prefix = dayjs().format('YYMM');

                            // cek kode berd.prefix
                            var appCode;
                            const cek_kd = await RegisVendor.query().whereLike('regis_code_app', `${prefix}%`).orderBy('regis_code_app','desc'); 
                            if(cek_kd.length <= 0){
                                appCode = prefix+'0001';
                            }
                            else{
                                appCode = parseInt(cek_kd[0].regis_code_app.substr(4,4)) + 1;
                                if(appCode.toString().length == 1){ appCode = '000'+appCode; }
                                else if(appCode.toString().length == 2){ appCode = '00'+appCode; }
                                else if(appCode.toString().length == 3){ appCode = '0'+appCode; }
                                else if(appCode.toString().length == 4){ appCode = appCode; }

                                appCode = prefix+appCode;
                            }

                            // generate random regis_code_auto
                            const autoCode = Math.floor(Math.random() * Math.pow(10, 6));

                            // cek autoCode
                            const cek_autoCode = await RegisVendor.query().where('regis_code_auto', autoCode);   
                                
                            if(cek_autoCode.length <= 0) {
                                // Insert Data
                                await Database
                                    .connection('mssql_procsys')
                                    .table('regis_vendor')
                                    .insert({
                                        regis_code_auto: autoCode,
                                        regis_code_app: appCode,
                                        regis_npwp: request.input('npwp'),
                                        regis_name: request.input('namavend'),
                                        regis_email: request.input('email'),
                                        regis_phone: '',
                                        bu_id: request.input('bu_id'),
                                        regis_flag: 1,
                                        created_date: dateTime(),
                                    });
                            }
                            else{
                                const autoCode = dayjs().format('DDmmss');

                                // Insert Data
                                await Database
                                    .connection('mssql_procsys')
                                    .table('regis_vendor')
                                    .insert({
                                        regis_code_auto: autoCode,
                                        regis_code_app: appCode,
                                        regis_npwp: request.input('npwp'),
                                        regis_name: request.input('namavend'),
                                        regis_email: request.input('email'),
                                        regis_phone: '',
                                        bu_id: request.input('bu_id'),
                                        regis_flag: 1,
                                        created_date: dateTime(),
                                    });
                            }

                            // ambil nama bu
                            const namabu = await Database.from('m_bisnis_unit').where('bu_id',request.input('bu_id')).first();

                            let footer_bu;
                            if(namabu.bu_code == 'WDJR' || namabu.bu_code == 'WNR'){
                                // footer_bu = 'footer_djm.png';
                                footer_bu = 'rucika-standard.png';
                            }
                            else if(namabu.bu_code == 'DJM' || namabu.bu_code == 'DTU'){
                                // footer_bu = 'footer_djm.png';
                                footer_bu = 'djabesmen.png';
                            }
                            else if(namabu.bu_code == 'RBG'){
                                // footer_bu = 'footer_rbg.png';
                                footer_bu = 'rb-granito.png';
                            }
                            else{
                                footer_bu = 'footer_other.png';
                            }

                            // send email security code
                            await Mail.send((message) => {
                            message
                                .from('system@dbc.co.id', 'Admin Procurement - PT. '+namabu.bu_name+'')
                                .to(request.input('email'), request.input('namavend'))
								// .bcc('faris@dbc.co.id', 'Faris')
                                .bcc('zulvikar.wibowo@dbc.co.id', 'Zulvikar Aji Wibowo')
                                .bcc('robi.pramesti@dbc.co.id', 'Robi Dewi Asih Pramesti')
								// .bcc('fauzi.susanto@dbc.co.id', 'Fauzi Dwi Susanto')
                                .subject('Security Code')              
                                .htmlView('emails/regvendor/notifikasi_register_code', { 
                                    code: autoCode,
                                    nama_bu: namabu.bu_name,
                                    nama_vendor: request.input('namavend'),
                                    link_footer: Env.get('LINK_FRONTEND')+'/mail/'+footer_bu,
                                })
                            });

                            return response.status(200).json({
                                message: "Data berhasil disimpan, silahkan cek security code yang terkirim pada email anda",
                                status: true,
                                npwp: request.input('npwp'),
                            });            
                        }
                        else{
                            return response.status(406).json({
                                message: "NPWP sudah terdaftar",
                                status: true,
                            }); 
                        }
                    }
                    else{
                        return response.status(406).json({
                            message: "NPWP sudah terdaftar",
                            status: true,
                        });                         
                    }
                }
                else{
                    return response.status(406).json({
                        message: "NPWP sudah terdaftar",
                        status: true,
                    }); 
                }        
            }
        } 
        catch (error) {
            console.log(error)
            return response.status(406).json(error);
        }
    }

    public async validationcode({ request, response }: HttpContextContract) {
        const sender = await senderMail();
        const mailConfig = Config.get('mail');

        mailConfig.mailers.smtp.host = sender[0].ms_host;
        mailConfig.mailers.smtp.auth.user = sender[0].ms_name;
        mailConfig.mailers.smtp.auth.pass = sender[0].ms_pass;

        const code = request.input('securitycode');
        const npwp = request.input('npwp');

        // cek jika npwp & code ada + regis_flag = 1
        const cekData = await RegisVendor
                        .query()
                        .where('regis_npwp', npwp)
                        .where('regis_code_auto', code)
                        //.where('created_date', '>=' ,today)
                        .where('regis_flag', 1)
                        .first();         

        if(cekData) {                 
            // cek data m_supp_path berd.sup_code_app & sup_npwp
            const cekSupp = await Supplier
                        .query()
                        .where('sup_code_app', cekData.regis_code_app)
                        .where('sup_npwp', cekData.regis_npwp);

            const dataRegisVend = await RegisVendor
                                .query()
                                .where('regis_code_app', cekData.regis_code_app)
                                .where('regis_npwp', cekData.regis_npwp)
                                .where('regis_code_auto', cekData.regis_code_auto)
                                .first(); 
                                
            if(cekSupp.length <= 0){
                
                if(dataRegisVend){
                      
                    // Insert Data Supplier Path
                    const suppPath = await Database
                        .connection('mssql_procsys')
                        .table('m_supp_path')
                        .insert({
                            sup_code_app: dataRegisVend.regis_code_app,
                            sup_npwp: dataRegisVend.regis_npwp,
                            sup_name: dataRegisVend.regis_name,
                            sup_email: dataRegisVend.regis_email,
                            sup_date_regis: formatDateTime(dataRegisVend.created_date),
                            uuid: dataRegisVend.uuid,
                            sup_flag: 1,
                            sup_status: 1,
                            approval_level: 1,
                            created_by: 'vendor'
                        });
                   
                    // update regis_flag
                    const updateflag = await RegisVendor
                                .query()
                                .where('regis_code_app', cekData.regis_code_app)
                                .where('regis_npwp', cekData.regis_npwp)
                                .where('regis_code_auto', cekData.regis_code_auto)
                                .update({ 
                                    regis_flag: 2
                                });    

                    // ambil nama bu
                    const namabu = await Database.from('m_bisnis_unit').where('bu_id', dataRegisVend.bu_id).first();

                    let footer_bu;
                    if(namabu.bu_code == 'WDJR' || namabu.bu_code == 'WNR'){
                        // footer_bu = 'footer_djm.png';
                        footer_bu = 'rucika-standard.png';
                    }
                    else if(namabu.bu_code == 'DJM' || namabu.bu_code == 'DTU'){
                        // footer_bu = 'footer_djm.png';
                        footer_bu = 'djabesmen.png';
                    }
                    else if(namabu.bu_code == 'RBG'){
                        // footer_bu = 'footer_rbg.png';
                        footer_bu = 'rb-granito.png';
                    }
                    else{
                        footer_bu = 'footer_other.png';
                    }
                    
                    const encript = Buffer.from(dataRegisVend.uuid, 'utf8').toString('base64');  

                    // send email link registrasi
                    await Mail.send((message) => {
                        message
                            .from('system@dbc.co.id', 'Admin Procurement - PT. '+namabu.bu_name+'')
                            .to(dataRegisVend.regis_email, dataRegisVend.regis_name)
							// .bcc('faris@dbc.co.id', 'Faris')
							.bcc('zulvikar.wibowo@dbc.co.id', 'Zulvikar Aji Wibowo')
                            .bcc('robi.pramesti@dbc.co.id', 'Robi Dewi Asih Pramesti')
							// .bcc('fauzi.susanto@dbc.co.id', 'Fauzi Dwi Susanto')
                            .subject('Link Registration Vendor')              
                            .htmlView('emails/regvendor/notifikasi_register_vendor', { 
                                nama_bu: namabu.bu_name,
                                nama_vendor: dataRegisVend.regis_name,
                                    link : process.env.LINK_FRONTEND + "#/register_form/" + 
                                    encript + "/" + 
                                    dataRegisVend.regis_code_app + "/form1",
                                    link_footer: Env.get('LINK_FRONTEND')+'/mail/'+footer_bu,
                            })
                    });                                     
                              
                    return response.status(200).json({
                        message: "Berhasil simpan data, silahkan mengisi kelengkapan data",
                        status: true,
                        uuid: encript,
                        codeapp: dataRegisVend.regis_code_app
                    }); 
                }   
                else{
                    return response.status(406).json({
                        message: "Invalid data",
                        status: true,
                    });                      
                }            
            }   
            else{             
                // if(dataRegisVend){
                //     // update data
                //     const suppPath = await SupplierPath
                //         .query()
                //         .where('regis_code_app', dataRegisVend.regis_code_app)
                //         .where('regis_npwp', dataRegisVend.regis_npwp)
                //         //.where('regis_code_auto', dataRegisVend.regis_code_auto)
                //         .update({ 
                //             sup_name: dataRegisVend.regis_name,
                //             sup_email: dataRegisVend.regis_email,
                //             sup_date_regis: dataRegisVend?.created_date,
                //             uuid: dataRegisVend.uuid,
                //             sup_flag: 1,
                //             sup_status: 1,
                //             approval_level: 1,
                //             created_by: 'vendor'
                //         }); 
                        
                //     return response.created(suppPath);
                // } 
                // else{
                //     return response.status(406).json({
                //         message: "Invalid data",
                //         status: true,
                //     });  
                // }      

                return response.status(406).json({
                    message: "NPWP sudah terdaftar",
                    status: true,
                });  
            }                    
        }
        else{
            return response.status(406).json({
                message: "Invalid data",
                status: true,
            });  
        }
    } 

    public async resendmailcode({ request, response }: HttpContextContract) {
        const sender = await senderMail();
        const mailConfig = Config.get('mail');

        mailConfig.mailers.smtp.host = sender[0].ms_host;
        mailConfig.mailers.smtp.auth.user = sender[0].ms_name;
        mailConfig.mailers.smtp.auth.pass = sender[0].ms_pass;

        const npwp = request.input('npwp');

        // Get data regis_vendor berd.regis_npwp & regis_flag = 1 order by regis_code_app DESC
        const dataRegisVend = await RegisVendor
                            .query()
                            .where('regis_npwp', npwp)
                            .where('regis_flag', 1)
                            .orderBy('regis_code_auto', 'desc').first();
        
        if(dataRegisVend) {
            // ambil nama bu
            const namabu = await Database.from('m_bisnis_unit').where('bu_id',dataRegisVend.bu_id).first();

            let footer_bu;
            if(namabu.bu_code == 'WDJR' || namabu.bu_code == 'WNR'){
                // footer_bu = 'footer_djm.png';
                footer_bu = 'rucika-standard.png';
            }
            else if(namabu.bu_code == 'DJM' || namabu.bu_code == 'DTU'){
                // footer_bu = 'footer_djm.png';
                footer_bu = 'djabesmen.png';
            }
            else if(namabu.bu_code == 'RBG'){
                // footer_bu = 'footer_rbg.png';
                footer_bu = 'rb-granito.png';
            }
            else{
                footer_bu = 'footer_other.png';
            }
            
            // send email security code
            await Mail.send((message) => {
            message
                .from('system@dbc.co.id', 'Admin Procurement - PT. '+namabu.bu_name+'')
                .to(dataRegisVend.regis_email, dataRegisVend.regis_name)
				// .bcc('faris@dbc.co.id', 'Faris')
				.bcc('zulvikar.wibowo@dbc.co.id', 'Zulvikar Aji Wibowo')
                .bcc('robi.pramesti@dbc.co.id', 'Robi Dewi Asih Pramesti')
				// .bcc('fauzi.susanto@dbc.co.id', 'Fauzi Dwi Susanto')
                .subject('Security Code')              
                .htmlView('emails/regvendor/notifikasi_register_code', { 
                    code: dataRegisVend.regis_code_auto,
                    nama_bu: namabu.bu_name,
                    nama_vendor: dataRegisVend.regis_name,
                    link_footer: Env.get('LINK_FRONTEND')+'/mail/'+footer_bu,
                })
            });

            return response.status(200).json({
                message: "Cek email kembali, Security Code sudah dikirim ulang",
                status: true,
            });            
        }
        else{
            return response.status(406).json({
                message: "Invalid data",
                status: true,
            });  
        }       
    }

    public async getProgress({ request, response }: HttpContextContract) {
        const code = request.input('code');

        const data = await SupplierPath
                    .query()
                    .where('sup_code_app', code)
                    .first(); 

        // Count Progress Regis Vendor
        if(data){
            if(data.sup_type_company == '' || data.sup_type_company != 'Keagenan Resmi'){
                const dataProgress = await Database
                                    .connection('mssql_procsys')
                                    .rawQuery(`SELECT [dbprocsys].[dbo].fn_progress_regis('${code}') as total`);

                return response.json({ data: dataProgress[0].total });
            }
            else{
                const dataProgress = await Database
                                    .connection('mssql_procsys')
                                    .rawQuery(`SELECT [dbprocsys].[dbo].fn_progress_regis_trading('${code}') as total`);

                return response.json({ data: dataProgress[0].total });
            }
        }
        else{
            return response.status(406).json({
                message: "Invalid data",
                status: true,
            });             
        }
    }

    public async getDataProfile({ request, response }: HttpContextContract) {
        const enkrip = Buffer.from(request.input('enkrip'), 'base64').toString('ascii');
        const code = request.input('code');

        const data = await SupplierPath
                    .query()
                    .where('sup_code_app', code).first();

        return response.json({ data: data });
    }    

    public async getBuRegVend({ request, response }: HttpContextContract) {
        const code = request.input('code');
        const data = await RegisVendor
                    .query()
                    .where('regis_code_app', code).first();

        if (data) {
            return data.bu_id;    
        } else {
            return "";    
        }
    }    

    public async saveProfile({ params, request, response }: HttpContextContract) {
        try {
            let office_address = '';
            let warehouse_address = '';
            if(request.input('alamatkantor')){
                const office_address_rep = request.input('alamatkantor').replace(/\s\s+/, ' ');
                office_address = office_address_rep.trim();
            }
            if(request.input('alamatpabrik')){
                const warehouse_address_rep = request.input('alamatpabrik').replace(/\s\s+/, ' ');
                warehouse_address = warehouse_address_rep.trim();
            }

            // Update Data Supplier Path
            const UpdSupplierPath = await SupplierPath.findOrFail(params.npwp);
    
            UpdSupplierPath.sup_name = request.input('namavend').replace('&', 'n');
            UpdSupplierPath.sup_email = request.input('emailpers');
            UpdSupplierPath.sup_email2 = request.input('emailpers2');
            UpdSupplierPath.sup_email3 = request.input('emailpers3');
            UpdSupplierPath.sup_website = request.input('webpers');
            UpdSupplierPath.sup_form_company = request.input('bentukPers');
            UpdSupplierPath.sup_comp_other = request.input('bentukPersLain');
            UpdSupplierPath.sup_type_company = request.input('jenisPers');
            UpdSupplierPath.sup_office_address = office_address;
            UpdSupplierPath.sup_office_phone = request.input('noteleponkantor');
            UpdSupplierPath.sup_office_fax = request.input('nofaxkantor');
            UpdSupplierPath.sup_warehouse_address = warehouse_address;
            UpdSupplierPath.sup_warehouse_phone = request.input('noteleponpabrik');
            UpdSupplierPath.sup_warehouse_fax = request.input('nofaxpabrik');
            UpdSupplierPath.sup_cat = request.input('katVend');
            UpdSupplierPath.sup_type = request.input('katsubVend');
            UpdSupplierPath.modified_by = 'Vendor';
            UpdSupplierPath.modified_date = datetimeNow;
            UpdSupplierPath.save();

            // Update Data Regis Vendor
            await RegisVendor
            .query()
            .where('regis_code_app', params.code)
            .update({ 
                regis_name: request.input('namavend'), 
                regis_email: request.input('emailpers')  
            });
            
            return response.status(200).json({
                message: "Berhasil simpan data",
                status: true
            });                
        } 
        catch (error) {
            console.log(error)
            return response.status(406).json(error);
        }
    }    

    public async getKontakPerson({ request }: HttpContextContract) {
        if (request.input('rowsPerPage') == null) {
            const res = await SupplierPathDet.query().where('sup_code_app', request.input('code')).where('details_column', 8).where('details_column_prioritas', 8);
            return res;            
        }
        else {
            var page = request.input('page');
            var sort = request.input('sortBy')
            var descend = request.input('descending')
            if(descend == 'false'){
                descend = 'desc';
            }else{
                descend = 'asc';
            }
            const res = await SupplierPathDet
                        .query()
                        .where('sup_code_app', request.input('code'))
                        .where('details_column', 8)
                        .where('details_column_prioritas', 8)
                        .where((query) => {
                            if (request.input('filter') != null)
                            {
                              query.where('details_content_1', 'like', `%${request.input('filter')}%`)
                                    .orWhere('details_content_2', 'like', `%${request.input('filter')}%`)                                        
                                    .orWhere('details_content_3', 'like', `%${request.input('filter')}%`)
                                    .orWhere('details_content_4', 'like', `%${request.input('filter')}%`)
                                    .orWhere('details_content_5', 'like', `%${request.input('filter')}%`)
                                    .orWhere('details_content_6', 'like', `%${request.input('filter')}%`);                                          
                            }                    
                        })    
                        .orderBy(sort,descend)            
                        .paginate(page, request.input('rowsPerPage'));  

            return res;  
        }
    }

    public async getDataKontakPerson({ request, response }: HttpContextContract) {
        const enkrip = Buffer.from(request.input('enkrip'), 'base64').toString('ascii');
        const code = request.input('code');

        const data = await RegisVendor
                    .query()
                    .where('regis_code_app', code).first(); 

        return response.json(data);
    }

    public async savedKontakPerson({ request, response }: HttpContextContract) {
        try {
            const data =  request.body();
            for(let i in data) {
                let prioritas = 0;
                // cek urutan terakhir
                const Qprioritas = await SupplierPathDet
                                .query()
                                .where('sup_code_app',data[i].sup_code_app)
                                .where('details_column', 8)
                                .where('details_column_prioritas', 8)
                                .orderBy('details_content_prioritas', 'desc')
                                .first();   
                                
                if(Qprioritas){ prioritas = Qprioritas.details_content_prioritas + 1 } else { prioritas = 1 }

                // insert kontak person
                const KontakPerson = await SupplierPathDet.create({
                    sup_code_app: data[i].sup_code_app,
                    details_column: 8,
                    details_column_desc: 'Kontak Person',
                    details_column_prioritas: 8,
                    details_content_prioritas: prioritas,
                    details_content_1: await ucWords(data[i].details_content_1),
                    details_content_2: await ucWords(data[i].details_content_2),
                    details_content_3: data[i].details_content_3,
                    details_content_4: data[i].details_content_4,
                    details_content_5: data[i].details_content_5,
                    details_content_6: data[i].details_content_6,
                    details_flag: 1,
                    details_status: 1,
                    created_by: 'Vendor'
                });
            } 
            
            return response.status(200).json({
                message: "Berhasil simpan data",
                status: true
            });
        } 
        catch (error) {
            console.log(error)
            return response.status(406).json(error);
        }
    }

    public async saveaddKontakPerson({ request, response }: HttpContextContract) {
        try {
            let prioritas = 0;

            // cek urutan terakhir
            const Qprioritas = await SupplierPathDet
                            .query()
                            .where('sup_code_app', request.input('code'))
                            .where('details_column', 8)
                            .where('details_column_prioritas', 8)
                            .orderBy('details_content_prioritas', 'desc')
                            .first();   
                            
            if(Qprioritas){ prioritas = Qprioritas.details_content_prioritas + 1 } else { prioritas = 1 }

            // insert kontak person
            const KontakPerson = await SupplierPathDet.create({
                sup_code_app: request.input('code'),
                details_column: 8,
                details_column_desc: 'Kontak Person',
                details_column_prioritas: 8,
                details_content_prioritas: prioritas,
                details_content_1: await ucWords(request.input('nama')),
                details_content_2: await ucWords(request.input('jabatan')),
                details_content_3: request.input('notelepon'),
                details_content_4: request.input('nohp'),
                details_content_5: request.input('email'),
                details_content_6: request.input('jeniskel'),
                details_flag: 1,
                details_status: 1,
                created_by: 'Vendor'
            });

            if(KontakPerson){
                return response.status(200).json({
                    message: "Berhasil simpan data",
                    status: true
                });
            }
            else{
                return response.status(406).json({
                    message: "Gagal simpan data",
                    status: true
                });
            }
        } 
        catch (error) {
            console.log(error)
            return response.status(406).json(error);
        }
    }
	
	public async saveaddKontakPersonUpd({ request, response }: HttpContextContract) {
        try {
            const supplier: any = await Supplier.query().where('sup_npwp', request.input('npwp')).first();
            let prioritas = 0;

            // cek urutan terakhir
            const Qprioritas = await SupplierPathDet
                            .query()
                            .where('sup_code_app', supplier.sup_code_app)
                            .where('details_column', 8)
                            .where('details_column_prioritas', 8)
                            .orderBy('details_content_prioritas', 'desc')
                            .first();   
                            
            if(Qprioritas){ prioritas = Qprioritas.details_content_prioritas + 1 } else { prioritas = 1 }

            // insert kontak person
            const KontakPerson = await SupplierPathDet.create({
                sup_code_app: supplier.sup_code_app,
                details_column: 8,
                details_column_desc: 'Kontak Person',
                details_column_prioritas: 8,
                details_content_prioritas: prioritas,
                details_content_1: await ucWords(request.input('nama')),
                details_content_2: await ucWords(request.input('jabatan')),
                details_content_3: request.input('notelepon'),
                details_content_4: request.input('nohp'),
                details_content_5: request.input('email'),
                details_content_6: request.input('jeniskel'),
                details_flag: 1,
                details_status: 1,
                created_by: 'Vendor',
                status_update: 'true'
            });

            if(KontakPerson){
                return response.status(200).json({
                    message: "Berhasil simpan data",
                    status: true
                });
            }
            else{
                return response.status(406).json({
                    message: "Gagal simpan data",
                    status: true
                });
            }
        } 
        catch (error) {
            console.log(error)
            return response.status(406).json(error);
        }
    }

    public async saveupdateKontakPerson({ params, request, response }: HttpContextContract) {
        const KontakPerson = await SupplierPathDet.findOrFail(params.id);
    
        KontakPerson.details_content_1 = request.input('nama');
        KontakPerson.details_content_2 = request.input('jabatan');
        KontakPerson.details_content_3 = request.input('notelepon');
        KontakPerson.details_content_4 = request.input('nohp');
        KontakPerson.details_content_5 = request.input('email');
        KontakPerson.details_content_6 = request.input('jeniskel');
        KontakPerson.modified_by = 'Vendor';
        KontakPerson.modified_date = datetimeNow;
        KontakPerson.save();
    
        return response.status(202).send(KontakPerson);
      }    

    public async delKontakPerson({ params, response }: HttpContextContract) {
        const KontakPerson = await SupplierPathDet
                            .query()
                            .where('sup_dtl_id', params.id)
                            .delete();

        return response.send(KontakPerson);
    }

    public async getDewanDireksi({ request }: HttpContextContract) {
        if (request.input('rowsPerPage') == null) {
            const res = await SupplierPathDet.query().where('sup_code_app', request.input('code')).where('details_column', 9).where('details_column_prioritas', 9);
            return res;            
        }
        else {
            var page = request.input('page');
            var sort = request.input('sortBy')
            var descend = request.input('descending')
            if(descend == 'false'){
                descend = 'desc';
            }else{
                descend = 'asc';
            }
            const res = await SupplierPathDet
                        .query()
                        .where('sup_code_app', request.input('code'))  
                        .where('details_column', 9)
                        .where('details_column_prioritas', 9)
                        .where((query) => {
                            if (request.input('filter') != null)
                            {
                              query.where('details_content_1', 'like', `%${request.input('filter')}%`)
                                    .orWhere('details_content_2', 'like', `%${request.input('filter')}%`)                                        
                                    .orWhere('details_content_3', 'like', `%${request.input('filter')}%`)
                                    .orWhere('details_content_4', 'like', `%${request.input('filter')}%`);                                          
                            }                    
                        })    
                        .orderBy(sort,descend)            
                        .paginate(page, request.input('rowsPerPage'));  

            return res;  
        }
    }

    public async getDataDewanDireksi({ request, response }: HttpContextContract) {
        const enkrip = Buffer.from(request.input('enkrip'), 'base64').toString('ascii');
        const code = request.input('code');

        const data = await RegisVendor
                    .query()
                    .where('regis_code_app', code).first(); 

        return response.json(data);
    }

    public async saveaddDewanDireksi({ request, response }: HttpContextContract) {
        try {
            let prioritas = 0;

            // cek urutan terakhir
            const Qprioritas = await SupplierPathDet
                            .query()
                            .where('sup_code_app', request.input('code'))
                            .where('details_column', 9)
                            .where('details_column_prioritas', 9)
                            .orderBy('details_content_prioritas', 'desc')
                            .first();   
                            
            if(Qprioritas){ prioritas = Qprioritas.details_content_prioritas + 1 } else { prioritas = 1 }

            // insert dewa direksi
            const DewanDireksi = await SupplierPathDet.create({
                sup_code_app: request.input('code'),
                details_column: 9,
                details_column_desc: 'Dewan Direksi',
                details_column_prioritas: 9,
                details_content_prioritas: prioritas,
                details_content_1: await ucWords(request.input('nama')),
                details_content_2: request.input('nik'),
                details_content_3: await ucWords(request.input('jabatan')),
                details_content_4: request.input('email'),
                details_flag: 1,
                details_status: 1,
                created_by: 'Vendor'
            });

            if(DewanDireksi){
                return response.status(200).json({
                    message: "Berhasil simpan data",
                    status: true
                });
            }
            else{
                return response.status(406).json({
                    message: "Gagal simpan data",
                    status: true
                });
            }
        } 
        catch (error) {
            console.log(error)
            return response.status(406).json(error);
        }
    }
    
    public async saveaddDewanDireksiUpd({ request, response }: HttpContextContract) {
        try {
            const supplier: any = await Supplier.query().where('sup_npwp', request.input('npwp')).first();
            let prioritas = 0;

            // cek urutan terakhir
            const Qprioritas = await SupplierPathDet
                            .query()
                            .where('sup_code_app', supplier.sup_code_app)
                            .where('details_column', 9)
                            .where('details_column_prioritas', 9)
                            .orderBy('details_content_prioritas', 'desc')
                            .first();   
                            
            if(Qprioritas){ prioritas = Qprioritas.details_content_prioritas + 1 } else { prioritas = 1 }

            // insert dewa direksi
            const DewanDireksi = await SupplierPathDet.create({
                sup_code_app: supplier.sup_code_app,
                details_column: 9,
                details_column_desc: 'Dewan Direksi',
                details_column_prioritas: 9,
                details_content_prioritas: prioritas,
                details_content_1: await ucWords(request.input('nama')),
                details_content_2: request.input('nik'),
                details_content_3: await ucWords(request.input('jabatan')),
                details_content_4: request.input('email'),
                details_flag: 1,
                details_status: 1,
                created_by: 'Vendor',
                status_update: 'true'
            });

            if(DewanDireksi){
                return response.status(200).json({
                    message: "Berhasil simpan data",
                    status: true
                });
            }
            else{
                return response.status(406).json({
                    message: "Gagal simpan data",
                    status: true
                });
            }
        } 
        catch (error) {
            console.log(error)
            return response.status(406).json(error);
        }
    }
    
    public async saveupdateDewanDireksi({ params, request, response }: HttpContextContract) {
        const DewanDireksi = await SupplierPathDet.findOrFail(params.id);
    
        DewanDireksi.details_content_1 = request.input('nama');
        DewanDireksi.details_content_2 = request.input('nik');
        DewanDireksi.details_content_3 = request.input('jabatan');
        DewanDireksi.details_content_4 = request.input('email');
        DewanDireksi.modified_by = 'Vendor';
        DewanDireksi.modified_date = datetimeNow;
        DewanDireksi.save();
    
        return response.status(202).send(DewanDireksi);
      }    

    public async delDewanDireksi({ params, response }: HttpContextContract) {
        const DewanDireksi = await SupplierPathDet
                            .query()
                            .where('sup_dtl_id', params.id)
                            .delete();

        return response.send(DewanDireksi);
    }

    public async saveAdminUmum({ request, response }: HttpContextContract) {
        const supp_code = request.input('code');
        const last_prefix = Math.floor(Date.now()/1000); // 6 digit

        // cek inputan no dokumen
        let nodok_1, nodok_2, nodok_3, nodok_4, nodok_5, nodok_6, nodok_7, nodok_8, nodok_9, nodok_10, nodok_11;
        (request.input('nodok_1') == null || request.input('nodok_1') == '') ? nodok_1 = '' : nodok_1 = request.input('nodok_1');
        (request.input('nodok_2') == null || request.input('nodok_2') == '') ? nodok_2 = '' : nodok_2 = request.input('nodok_2');
        (request.input('nodok_3') == null || request.input('nodok_3') == '') ? nodok_3 = '' : nodok_3 = request.input('nodok_3');
        (request.input('nodok_4') == null || request.input('nodok_4') == '') ? nodok_4 = '' : nodok_4 = request.input('nodok_4');
        (request.input('nodok_5') == null || request.input('nodok_5') == '') ? nodok_5 = '' : nodok_5 = request.input('nodok_5');
        (request.input('nodok_6') == null || request.input('nodok_6') == '') ? nodok_6 = '' : nodok_6 = request.input('nodok_6');
        (request.input('nodok_7') == null || request.input('nodok_7') == '') ? nodok_7 = '' : nodok_7 = request.input('nodok_7');
        (request.input('nodok_8') == null || request.input('nodok_8') == '') ? nodok_8 = '' : nodok_8 = request.input('nodok_8');
        (request.input('nodok_9') == null || request.input('nodok_9') == '') ? nodok_9 = '' : nodok_9 = request.input('nodok_9');
        (request.input('nodok_10') == null || request.input('nodok_10') == '') ? nodok_10 = '' : nodok_10 = request.input('nodok_10');
        (request.input('nodok_11') == null || request.input('nodok_11') == '') ? nodok_11 = '' : nodok_11 = request.input('nodok_11');

        // cek inputan tgl dikeluarkan
        let tglkeluar_1, tglkeluar_2, tglkeluar_3, tglkeluar_4, tglkeluar_5, tglkeluar_6, tglkeluar_7, tglkeluar_8, tglkeluar_9, tglkeluar_10, tglkeluar_11;
        (request.input('tglkeluar_1') == null || request.input('tglkeluar_1') == '') ? tglkeluar_1 = '' : tglkeluar_1 = request.input('tglkeluar_1');
        (request.input('tglkeluar_2') == null || request.input('tglkeluar_2') == '') ? tglkeluar_2 = '' : tglkeluar_2 = request.input('tglkeluar_2');
        (request.input('tglkeluar_3') == null || request.input('tglkeluar_3') == '') ? tglkeluar_3 = '' : tglkeluar_3 = request.input('tglkeluar_3');
        (request.input('tglkeluar_4') == null || request.input('tglkeluar_4') == '') ? tglkeluar_4 = '' : tglkeluar_4 = request.input('tglkeluar_4');
        (request.input('tglkeluar_5') == null || request.input('tglkeluar_5') == '') ? tglkeluar_5 = '' : tglkeluar_5 = request.input('tglkeluar_5');
        (request.input('tglkeluar_6') == null || request.input('tglkeluar_6') == '') ? tglkeluar_6 = '' : tglkeluar_6 = request.input('tglkeluar_6');
        (request.input('tglkeluar_7') == null || request.input('tglkeluar_7') == '') ? tglkeluar_7 = '' : tglkeluar_7 = request.input('tglkeluar_7');
        (request.input('tglkeluar_8') == null || request.input('tglkeluar_8') == '') ? tglkeluar_8 = '' : tglkeluar_8 = request.input('tglkeluar_8');
        (request.input('tglkeluar_9') == null || request.input('tglkeluar_9') == '') ? tglkeluar_9 = '' : tglkeluar_9 = request.input('tglkeluar_9');
        (request.input('tglkeluar_10') == null || request.input('tglkeluar_10') == '') ? tglkeluar_10 = '' : tglkeluar_10 = request.input('tglkeluar_10');
        (request.input('tglkeluar_11') == null || request.input('tglkeluar_11') == '') ? tglkeluar_11 = '' : tglkeluar_11 = request.input('tglkeluar_11');

        // cek inputan tgl berakhir
        let tglakhir_1, tglakhir_2, tglakhir_3, tglakhir_4, tglakhir_5, tglakhir_6, tglakhir_7, tglakhir_8, tglakhir_9, tglakhir_10, tglakhir_11;
        (request.input('tglakhir_1') == null || request.input('tglakhir_1') == '') ? tglakhir_1 = '' : tglakhir_1 = request.input('tglakhir_1');
        (request.input('tglakhir_2') == null || request.input('tglakhir_2') == '') ? tglakhir_2 = '' : tglakhir_2 = request.input('tglakhir_2');
        (request.input('tglakhir_3') == null || request.input('tglakhir_3') == '') ? tglakhir_3 = '' : tglakhir_3 = request.input('tglakhir_3');
        (request.input('tglakhir_4') == null || request.input('tglakhir_4') == '') ? tglakhir_4 = '' : tglakhir_4 = request.input('tglakhir_4');
        (request.input('tglakhir_5') == null || request.input('tglakhir_5') == '') ? tglakhir_5 = '' : tglakhir_5 = request.input('tglakhir_5');
        (request.input('tglakhir_6') == null || request.input('tglakhir_6') == '') ? tglakhir_6 = '' : tglakhir_6 = request.input('tglakhir_6');
        (request.input('tglakhir_7') == null || request.input('tglakhir_7') == '') ? tglakhir_7 = '' : tglakhir_7 = request.input('tglakhir_7');
        (request.input('tglakhir_8') == null || request.input('tglakhir_8') == '') ? tglakhir_8 = '' : tglakhir_8 = request.input('tglakhir_8');
        (request.input('tglakhir_9') == null || request.input('tglakhir_9') == '') ? tglakhir_9 = '' : tglakhir_9 = request.input('tglakhir_9');
        (request.input('tglakhir_10') == null || request.input('tglakhir_10') == '') ? tglakhir_10 = '' : tglakhir_10 = request.input('tglakhir_10');
        (request.input('tglakhir_11') == null || request.input('tglakhir_11') == '') ? tglakhir_11 = '' : tglakhir_11 = request.input('tglakhir_11');

        // return response.json(tglkeluar_1 +" "+tglkeluar_2);

        // cek data
        const cek_supp = await SupplierPathDet.query().where('sup_code_app', supp_code).where('details_column', 10).first();
        
        let namaFile1_ex, namaFile2_ex, namaFile3_ex, namaFile4_ex, namaFile5_ex, namaFile6_ex, namaFile7_ex, namaFile8_ex, namaFile9_ex, namaFile10_ex, namaFile11_ex;
        if(cek_supp){
            namaFile1_ex = cek_supp.details_content_1.split('>>')[3];
            namaFile2_ex = cek_supp.details_content_2.split('>>')[3];
            namaFile3_ex = cek_supp.details_content_3.split('>>')[3];
            namaFile4_ex = cek_supp.details_content_4.split('>>')[3];
            namaFile5_ex = cek_supp.details_content_5.split('>>')[3];
            namaFile6_ex = cek_supp.details_content_6.split('>>')[3];
            namaFile7_ex = cek_supp.details_content_7.split('>>')[3];
            namaFile8_ex = cek_supp.details_content_8.split('>>')[3];
            namaFile9_ex = cek_supp.details_content_9.split('>>')[3];
            namaFile10_ex = cek_supp.details_content_10.split('>>')[3];
            namaFile11_ex = cek_supp.details_content_11.split('>>')[3];
        }

        // Open FTP
        const client = new ftp.Client();
        client.ftp.verbose = true; 
        try {           
            await client.access({
                host: Env.get('FTP_HOST'),
                user: Env.get('FTP_USERNAME'),
                password: Env.get('FTP_PASSWORD'),
                port: Env.get('FTP_PORT'),
            });
        }
        catch(err) {
            console.log(err)
        }
        
        // cek upload file 1
        const file1 = request.file('file_1');
        let nmfile_1_noex = "";
        let nmfile_1 = "";
        let nmfile_1_db = "";
        let nmfile_1_upl = "";
        if(file1) {       
            nmfile_1_noex = file1.clientName.substring(0, file1.clientName.lastIndexOf('.'));
            nmfile_1 = file1.clientName;
            nmfile_1_db = supp_code + "_" + nmfile_1_noex + "_" + last_prefix;
            nmfile_1_upl = nmfile_1_db + ".pdf";
            
            // upload lokal
            await file1.move(Application.publicPath('file'), { name: nmfile_1_upl });
            
            // upload FTP
            await client.uploadFrom(Application.publicPath(`file/${nmfile_1_upl}`), `/${Env.get('FTP_PATH')}/${nmfile_1_upl}`); 

            if(namaFile1_ex){
                // delete data file di FTP & update data lama
                await client.remove(`/${Env.get('FTP_PATH')}/${namaFile1_ex}.pdf`);
                await SupplierPathUpload
                    .query()
                    .where('sup_code_app', supp_code)
                    .where('details_column', 10)
                    .where('details_upload_app', namaFile1_ex)
                    .update({ 
                        details_upload_app: nmfile_1_db,
                        details_upload: nmfile_1
                    });                                 
            }
            else{
                // insert data upload
                await SupplierPathUpload.create({
                    sup_code_app: supp_code,
                    details_column: 10,
                    details_upload_app: nmfile_1_db,
                    details_upload: nmfile_1,
                    created_by: 'Vendor'
                });
            }
        }
        else{
            (namaFile1_ex) ? nmfile_1_db = namaFile1_ex : nmfile_1_db = "";
        }

        // cek upload file 2
        const file2 = request.file('file_2');
        let nmfile_2_noex = "";
        let nmfile_2 = "";
        let nmfile_2_db = "";
        let nmfile_2_upl = "";
        if(file2) {       
            nmfile_2_noex = file2.clientName.substring(0, file2.clientName.lastIndexOf('.'));
            nmfile_2 = file2.clientName;
            nmfile_2_db = supp_code + "_" + nmfile_2_noex + "_" + last_prefix;
            nmfile_2_upl = nmfile_2_db + ".pdf";
            
            // upload lokal
            await file2.move(Application.publicPath('file'), { name: nmfile_2_upl });
            
            // upload FTP
            await client.uploadFrom(Application.publicPath(`file/${nmfile_2_upl}`), `/${Env.get('FTP_PATH')}/${nmfile_2_upl}`); 

            if(namaFile2_ex){
                // delete data file di FTP & update data lama
                await client.remove(`/${Env.get('FTP_PATH')}/${namaFile2_ex}.pdf`);
                await SupplierPathUpload
                    .query()
                    .where('sup_code_app', supp_code)
                    .where('details_column', 10)
                    .where('details_upload_app', namaFile2_ex)
                    .update({ 
                        details_upload_app: nmfile_2_db,
                        details_upload: nmfile_2
                    });                                 
            }
            else{
                // insert data upload
                await SupplierPathUpload.create({
                    sup_code_app: supp_code,
                    details_column: 10,
                    details_upload_app: nmfile_2_db,
                    details_upload: nmfile_2,
                    created_by: 'Vendor'
                });
            }
        }
        else{
            (namaFile2_ex) ? nmfile_2_db = namaFile2_ex : nmfile_2_db = "";
        }

        // cek upload file 3
        const file3 = request.file('file_3');
        let nmfile_3_noex = "";
        let nmfile_3 = "";
        let nmfile_3_db = "";
        let nmfile_3_upl = "";
        if(file3) {       
            nmfile_3_noex = file3.clientName.substring(0, file3.clientName.lastIndexOf('.'));
            nmfile_3 = file3.clientName;
            nmfile_3_db = supp_code + "_" + nmfile_3_noex + "_" + last_prefix;
            nmfile_3_upl = nmfile_3_db + ".pdf";
            
            // upload lokal
            await file3.move(Application.publicPath('file'), { name: nmfile_3_upl });
            
            // upload FTP
            await client.uploadFrom(Application.publicPath(`file/${nmfile_3_upl}`), `/${Env.get('FTP_PATH')}/${nmfile_3_upl}`); 

            if(namaFile3_ex){
                // delete data file di FTP & update data lama
                await client.remove(`/${Env.get('FTP_PATH')}/${namaFile3_ex}.pdf`);
                await SupplierPathUpload
                    .query()
                    .where('sup_code_app', supp_code)
                    .where('details_column', 10)
                    .where('details_upload_app', namaFile3_ex)
                    .update({ 
                        details_upload_app: nmfile_3_db,
                        details_upload: nmfile_3
                    });                                 
            }
            else{
                // insert data upload
                await SupplierPathUpload.create({
                    sup_code_app: supp_code,
                    details_column: 10,
                    details_upload_app: nmfile_3_db,
                    details_upload: nmfile_3,
                    created_by: 'Vendor'
                });
            }
        }
        else{
            (namaFile3_ex) ? nmfile_3_db = namaFile3_ex : nmfile_3_db = "";
        }

        // cek upload file 4
        const file4 = request.file('file_4');
        let nmfile_4_noex = "";
        let nmfile_4 = "";
        let nmfile_4_db = "";
        let nmfile_4_upl = "";
        if(file4) {       
            nmfile_4_noex = file4.clientName.substring(0, file4.clientName.lastIndexOf('.'));
            nmfile_4 = file4.clientName;
            nmfile_4_db = supp_code + "_" + nmfile_4_noex + "_" + last_prefix;
            nmfile_4_upl = nmfile_4_db + ".pdf";
            
            // upload lokal
            await file4.move(Application.publicPath('file'), { name: nmfile_4_upl });
            
            // upload FTP
            await client.uploadFrom(Application.publicPath(`file/${nmfile_4_upl}`), `/${Env.get('FTP_PATH')}/${nmfile_4_upl}`); 

            if(namaFile4_ex){
                // delete data file di FTP & update data lama
                await client.remove(`/${Env.get('FTP_PATH')}/${namaFile4_ex}.pdf`);
                await SupplierPathUpload
                    .query()
                    .where('sup_code_app', supp_code)
                    .where('details_column', 10)
                    .where('details_upload_app', namaFile4_ex)
                    .update({ 
                        details_upload_app: nmfile_4_db,
                        details_upload: nmfile_4
                    });                                 
            }
            else{
                // insert data upload
                await SupplierPathUpload.create({
                    sup_code_app: supp_code,
                    details_column: 10,
                    details_upload_app: nmfile_4_db,
                    details_upload: nmfile_4,
                    created_by: 'Vendor'
                });
            }
        }
        else{
            (namaFile4_ex) ? nmfile_4_db = namaFile4_ex : nmfile_4_db = "";
        }

        // cek upload file 5
        const file5 = request.file('file_5');
        let nmfile_5_noex = "";
        let nmfile_5 = "";
        let nmfile_5_db = "";
        let nmfile_5_upl = "";
        if(file5) {       
            nmfile_5_noex = file5.clientName.substring(0, file5.clientName.lastIndexOf('.'));
            nmfile_5 = file5.clientName;
            nmfile_5_db = supp_code + "_" + nmfile_5_noex + "_" + last_prefix;
            nmfile_5_upl = nmfile_5_db + ".pdf";
            
            // upload lokal
            await file5.move(Application.publicPath('file'), { name: nmfile_5_upl });
            
            // upload FTP
            await client.uploadFrom(Application.publicPath(`file/${nmfile_5_upl}`), `/${Env.get('FTP_PATH')}/${nmfile_5_upl}`); 

            if(namaFile5_ex){
                // delete data file di FTP & update data lama
                await client.remove(`/${Env.get('FTP_PATH')}/${namaFile5_ex}.pdf`);
                await SupplierPathUpload
                    .query()
                    .where('sup_code_app', supp_code)
                    .where('details_column', 10)
                    .where('details_upload_app', namaFile5_ex)
                    .update({ 
                        details_upload_app: nmfile_5_db,
                        details_upload: nmfile_5
                    });                                 
            }
            else{
                // insert data upload
                await SupplierPathUpload.create({
                    sup_code_app: supp_code,
                    details_column: 10,
                    details_upload_app: nmfile_5_db,
                    details_upload: nmfile_5,
                    created_by: 'Vendor'
                });
            }
        }
        else{
            (namaFile5_ex) ? nmfile_5_db = namaFile5_ex : nmfile_5_db = "";
        }

        // cek upload file 6
        const file6 = request.file('file_6');
        let nmfile_6_noex = "";
        let nmfile_6 = "";
        let nmfile_6_db = "";
        let nmfile_6_upl = "";
        if(file6) {       
            nmfile_6_noex = file6.clientName.substring(0, file6.clientName.lastIndexOf('.'));
            nmfile_6 = file6.clientName;
            nmfile_6_db = supp_code + "_" + nmfile_6_noex + "_" + last_prefix;
            nmfile_6_upl = nmfile_6_db + ".pdf";
            
            // upload lokal
            await file6.move(Application.publicPath('file'), { name: nmfile_6_upl });
            
            // upload FTP
            await client.uploadFrom(Application.publicPath(`file/${nmfile_6_upl}`), `/${Env.get('FTP_PATH')}/${nmfile_6_upl}`); 

            if(namaFile6_ex){
                // delete data file di FTP & update data lama
                await client.remove(`/${Env.get('FTP_PATH')}/${namaFile6_ex}.pdf`);
                await SupplierPathUpload
                    .query()
                    .where('sup_code_app', supp_code)
                    .where('details_column', 10)
                    .where('details_upload_app', namaFile6_ex)
                    .update({ 
                        details_upload_app: nmfile_6_db,
                        details_upload: nmfile_6
                    });                                 
            }
            else{
                // insert data upload
                await SupplierPathUpload.create({
                    sup_code_app: supp_code,
                    details_column: 10,
                    details_upload_app: nmfile_6_db,
                    details_upload: nmfile_6,
                    created_by: 'Vendor'
                });
            }
        }
        else{
            (namaFile6_ex) ? nmfile_6_db = namaFile6_ex : nmfile_6_db = "";
        }

        // cek upload file 7
        const file7 = request.file('file_7');
        let nmfile_7_noex = "";
        let nmfile_7 = "";
        let nmfile_7_db = "";
        let nmfile_7_upl = "";
        if(file7) {       
            nmfile_7_noex = file7.clientName.substring(0, file7.clientName.lastIndexOf('.'));
            nmfile_7 = file7.clientName;
            nmfile_7_db = supp_code + "_" + nmfile_7_noex + "_" + last_prefix;
            nmfile_7_upl = nmfile_7_db + ".pdf";
            
            // upload lokal
            await file7.move(Application.publicPath('file'), { name: nmfile_7_upl });
            
            // upload FTP
            await client.uploadFrom(Application.publicPath(`file/${nmfile_7_upl}`), `/${Env.get('FTP_PATH')}/${nmfile_7_upl}`); 

            if(namaFile7_ex){
                // delete data file di FTP & update data lama
                await client.remove(`/${Env.get('FTP_PATH')}/${namaFile7_ex}.pdf`);
                await SupplierPathUpload
                    .query()
                    .where('sup_code_app', supp_code)
                    .where('details_column', 10)
                    .where('details_upload_app', namaFile7_ex)
                    .update({ 
                        details_upload_app: nmfile_7_db,
                        details_upload: nmfile_7
                    });                                 
            }
            else{
                // insert data upload
                await SupplierPathUpload.create({
                    sup_code_app: supp_code,
                    details_column: 10,
                    details_upload_app: nmfile_7_db,
                    details_upload: nmfile_7,
                    created_by: 'Vendor'
                });
            }
        }
        else{
            (namaFile7_ex) ? nmfile_7_db = namaFile7_ex : nmfile_7_db = "";
        }

        // cek upload file 8
        const file8 = request.file('file_8');
        let nmfile_8_noex = "";
        let nmfile_8 = "";
        let nmfile_8_db = "";
        let nmfile_8_upl = "";
        if(file8) {       
            nmfile_8_noex = file8.clientName.substring(0, file8.clientName.lastIndexOf('.'));
            nmfile_8 = file8.clientName;
            nmfile_8_db = supp_code + "_" + nmfile_8_noex + "_" + last_prefix;
            nmfile_8_upl = nmfile_8_db + ".pdf";
            
            // upload lokal
            await file8.move(Application.publicPath('file'), { name: nmfile_8_upl });
            
            // upload FTP
            await client.uploadFrom(Application.publicPath(`file/${nmfile_8_upl}`), `/${Env.get('FTP_PATH')}/${nmfile_8_upl}`); 

            if(namaFile8_ex){
                // delete data file di FTP & update data lama
                await client.remove(`/${Env.get('FTP_PATH')}/${namaFile8_ex}.pdf`);
                await SupplierPathUpload
                    .query()
                    .where('sup_code_app', supp_code)
                    .where('details_column', 10)
                    .where('details_upload_app', namaFile8_ex)
                    .update({ 
                        details_upload_app: nmfile_8_db,
                        details_upload: nmfile_8
                    });                                 
            }
            else{
                // insert data upload
                await SupplierPathUpload.create({
                    sup_code_app: supp_code,
                    details_column: 10,
                    details_upload_app: nmfile_8_db,
                    details_upload: nmfile_8,
                    created_by: 'Vendor'
                });
            }
        }
        else{
            (namaFile8_ex) ? nmfile_8_db = namaFile8_ex : nmfile_8_db = "";
        }

        // cek upload file 9
        const file9 = request.file('file_9');
        let nmfile_9_noex = "";
        let nmfile_9 = "";
        let nmfile_9_db = "";
        let nmfile_9_upl = "";
        if(file9) {       
            nmfile_9_noex = file9.clientName.substring(0, file9.clientName.lastIndexOf('.'));
            nmfile_9 = file9.clientName;
            nmfile_9_db = supp_code + "_" + nmfile_9_noex + "_" + last_prefix;
            nmfile_9_upl = nmfile_9_db + ".pdf";
            
            // upload lokal
            await file9.move(Application.publicPath('file'), { name: nmfile_9_upl });
            
            // upload FTP
            await client.uploadFrom(Application.publicPath(`file/${nmfile_9_upl}`), `/${Env.get('FTP_PATH')}/${nmfile_9_upl}`); 

            if(namaFile9_ex){
                // delete data file di FTP & update data lama
                await client.remove(`/${Env.get('FTP_PATH')}/${namaFile9_ex}.pdf`);
                await SupplierPathUpload
                    .query()
                    .where('sup_code_app', supp_code)
                    .where('details_column', 10)
                    .where('details_upload_app', namaFile9_ex)
                    .update({ 
                        details_upload_app: nmfile_9_db,
                        details_upload: nmfile_9
                    });                                 
            }
            else{
                // insert data upload
                await SupplierPathUpload.create({
                    sup_code_app: supp_code,
                    details_column: 10,
                    details_upload_app: nmfile_9_db,
                    details_upload: nmfile_9,
                    created_by: 'Vendor'
                });
            }
        }
        else{
            (namaFile9_ex) ? nmfile_9_db = namaFile9_ex : nmfile_9_db = "";
        }

        // cek upload file 10
        const file10 = request.file('file_10');
        let nmfile_10_noex = "";
        let nmfile_10 = "";
        let nmfile_10_db = "";
        let nmfile_10_upl = "";
        if(file10) {       
            nmfile_10_noex = file10.clientName.substring(0, file10.clientName.lastIndexOf('.'));
            nmfile_10 = file10.clientName;
            nmfile_10_db = supp_code + "_" + nmfile_10_noex + "_" + last_prefix;
            nmfile_10_upl = nmfile_10_db + ".pdf";
            
            // upload lokal
            await file10.move(Application.publicPath('file'), { name: nmfile_10_upl });
            
            // upload FTP
            await client.uploadFrom(Application.publicPath(`file/${nmfile_10_upl}`), `/${Env.get('FTP_PATH')}/${nmfile_10_upl}`); 

            if(namaFile10_ex){
                // delete data file di FTP & update data lama
                await client.remove(`/${Env.get('FTP_PATH')}/${namaFile10_ex}.pdf`);
                await SupplierPathUpload
                    .query()
                    .where('sup_code_app', supp_code)
                    .where('details_column', 10)
                    .where('details_upload_app', namaFile10_ex)
                    .update({ 
                        details_upload_app: nmfile_10_db,
                        details_upload: nmfile_10
                    });                                 
            }
            else{
                // insert data upload
                await SupplierPathUpload.create({
                    sup_code_app: supp_code,
                    details_column: 10,
                    details_upload_app: nmfile_10_db,
                    details_upload: nmfile_10,
                    created_by: 'Vendor'
                });
            }
        }
        else{
            (namaFile10_ex) ? nmfile_10_db = namaFile10_ex : nmfile_10_db = "";
        }

        // cek upload file 11
        const file11 = request.file('file_11');
        let nmfile_11_noex = "";
        let nmfile_11 = "";
        let nmfile_11_db = "";
        let nmfile_11_upl = "";
        if(file11) {       
            nmfile_11_noex = file11.clientName.substring(0, file11.clientName.lastIndexOf('.'));
            nmfile_11 = file11.clientName;
            nmfile_11_db = supp_code + "_" + nmfile_11_noex + "_" + last_prefix;
            nmfile_11_upl = nmfile_11_db + ".pdf";
            
            // upload lokal
            await file11.move(Application.publicPath('file'), { name: nmfile_11_upl });
            
            // upload FTP
            await client.uploadFrom(Application.publicPath(`file/${nmfile_11_upl}`), `/${Env.get('FTP_PATH')}/${nmfile_11_upl}`); 

            if(namaFile11_ex){
                // delete data file di FTP & update data lama
                await client.remove(`/${Env.get('FTP_PATH')}/${namaFile11_ex}.pdf`);
                await SupplierPathUpload
                    .query()
                    .where('sup_code_app', supp_code)
                    .where('details_column', 10)
                    .where('details_upload_app', namaFile11_ex)
                    .update({ 
                        details_upload_app: nmfile_11_db,
                        details_upload: nmfile_11
                    });                                 
            }
            else{
                // insert data upload
                await SupplierPathUpload.create({
                    sup_code_app: supp_code,
                    details_column: 10,
                    details_upload_app: nmfile_11_db,
                    details_upload: nmfile_11,
                    created_by: 'Vendor'
                });
            }
        }
        else{
            (namaFile11_ex) ? nmfile_11_db = namaFile11_ex : nmfile_11_db = "";
        }

        // Close FTP
        client.close();

        // cek data SupplierPathDet
        const cekData1 = await SupplierPathDet
                        .query()
                        .where('sup_code_app', supp_code)
                        .where('details_column', 10)
                        .where('details_column_prioritas', 10)
                        .first();        

        if(cekData1){
            // Update Kelengkapan Administrasi Umum
            const updAdminUmum = await SupplierPathDet
                                .query()
                                .where('sup_code_app', supp_code)
                                .where('details_column', 10)
                                .where('details_column_prioritas', 10)
                                .update({ 
                                    details_content_1: nodok_1 + '>>' + tglkeluar_1 + '>>' + tglakhir_1 + '>>' + nmfile_1_db,
                                    details_content_2: nodok_2 + '>>' + tglkeluar_2 + '>>' + tglakhir_2 + '>>' + nmfile_2_db,
                                    details_content_3: nodok_3 + '>>' + tglkeluar_3 + '>>' + tglakhir_3 + '>>' + nmfile_3_db,
                                    details_content_4: nodok_4 + '>>' + tglkeluar_4 + '>>' + tglakhir_4 + '>>' + nmfile_4_db,
                                    details_content_5: nodok_5 + '>>' + tglkeluar_5 + '>>' + tglakhir_5 + '>>' + nmfile_5_db,
                                    details_content_6: nodok_6 + '>>' + tglkeluar_6 + '>>' + tglakhir_6 + '>>' + nmfile_6_db,
                                    details_content_7: nodok_7 + '>>' + tglkeluar_7 + '>>' + tglakhir_7 + '>>' + nmfile_7_db,
                                    details_content_8: nodok_8 + '>>' + tglkeluar_8 + '>>' + tglakhir_8 + '>>' + nmfile_8_db,
                                    details_content_9: nodok_9 + '>>' + tglkeluar_9 + '>>' + tglakhir_9 + '>>' + nmfile_9_db,
                                    details_content_10: nodok_10 + '>>' + tglkeluar_10 + '>>' + tglakhir_10 + '>>' + nmfile_10_db,
                                    details_content_11: nodok_11 + '>>' + tglkeluar_11 + '>>' + tglakhir_11 + '>>' + nmfile_11_db,
                                    modified_by: 'Vendor',
                                    modified_date: datetimeNow,
                                    status_update: 1
                                });  
                                
            if(updAdminUmum){
                return response.status(200).json({
                    message: "Berhasil ubah data",
                    status: true
                });
            }
            else{
                return response.status(406).json({
                    message: "Gagal ubah data",
                    status: true
                });
            }                                
        }
        else{
            // Insert Kelengkapan Administrasi Umum
            const insAdminUmum = await SupplierPathDet.create({
                sup_code_app: request.input('code'),
                details_column: 10,
                details_column_desc: 'Kelengkapan Administrasi Umum',
                details_column_prioritas: 10,
                details_content_prioritas: 1,
                details_content_1: nodok_1 + '>>' + tglkeluar_1 + '>>' + tglakhir_1 + '>>' + nmfile_1_db,
                details_content_2: nodok_2 + '>>' + tglkeluar_2 + '>>' + tglakhir_2 + '>>' + nmfile_2_db,
                details_content_3: nodok_3 + '>>' + tglkeluar_3 + '>>' + tglakhir_3 + '>>' + nmfile_3_db,
                details_content_4: nodok_4 + '>>' + tglkeluar_4 + '>>' + tglakhir_4 + '>>' + nmfile_4_db,
                details_content_5: nodok_5 + '>>' + tglkeluar_5 + '>>' + tglakhir_5 + '>>' + nmfile_5_db,
                details_content_6: nodok_6 + '>>' + tglkeluar_6 + '>>' + tglakhir_6 + '>>' + nmfile_6_db,
                details_content_7: nodok_7 + '>>' + tglkeluar_7 + '>>' + tglakhir_7 + '>>' + nmfile_7_db,
                details_content_8: nodok_8 + '>>' + tglkeluar_8 + '>>' + tglakhir_8 + '>>' + nmfile_8_db,
                details_content_9: nodok_9 + '>>' + tglkeluar_9 + '>>' + tglakhir_9 + '>>' + nmfile_9_db,
                details_content_10: nodok_10 + '>>' + tglkeluar_10 + '>>' + tglakhir_10 + '>>' + nmfile_10_db,
                details_content_11: nodok_11 + '>>' + tglkeluar_11 + '>>' + tglakhir_11 + '>>' + nmfile_11_db,
                details_flag: 1,
                details_status: 1,
                created_by: 'Vendor'
            });

            if(insAdminUmum){
                return response.status(200).json({
                    message: "Berhasil simpan data",
                    status: true
                });
            }
            else{
                return response.status(406).json({
                    message: "Gagal simpan data",
                    status: true
                });
            }
        }
    }   

    public async getAdminUmum({ params }: HttpContextContract) {
        const supp_code = params.code;
        const column = params.column;

        const cek_supp = await SupplierPathDet.query().where('sup_code_app', supp_code).where('details_column', column).first();
        
        if(cek_supp){
            var str1 = cek_supp.details_content_1.split('>>');
            var str2 = cek_supp.details_content_2.split('>>');
            var str3 = cek_supp.details_content_3.split('>>');
            var str4 = cek_supp.details_content_4.split('>>');
            var str5 = cek_supp.details_content_5.split('>>');
            var str6 = cek_supp.details_content_6.split('>>');
            var str7 = cek_supp.details_content_7.split('>>');
            var str8 = cek_supp.details_content_8.split('>>');
            var str9 = cek_supp.details_content_9.split('>>');
            var str10 = cek_supp.details_content_10.split('>>');
            var str11 = cek_supp.details_content_11.split('>>');

            let data1 = [{ dok: str1[0] }, { tglkeluar: str1[1] }, { tglakhir: str1[2] }, { file: (str1[3]) ? str1[3]+'.pdf' : '' }];
            let data2 = [{ dok: str2[0] }, { tglkeluar: str2[1] }, { tglakhir: str2[2] }, { file: (str2[3]) ? str2[3]+'.pdf' : '' }];
            let data3 = [{ dok: str3[0] }, { tglkeluar: str3[1] }, { tglakhir: str3[2] }, { file: (str3[3]) ? str3[3]+'.pdf' : '' }];
            let data4 = [{ dok: str4[0] }, { tglkeluar: str4[1] }, { tglakhir: str4[2] }, { file: (str4[3]) ? str4[3]+'.pdf' : '' }];
            let data5 = [{ dok: str5[0] }, { tglkeluar: str5[1] }, { tglakhir: str5[2] }, { file: (str5[3]) ? str5[3]+'.pdf' : '' }];
            let data6 = [{ dok: str6[0] }, { tglkeluar: str6[1] }, { tglakhir: str6[2] }, { file: (str6[3]) ? str6[3]+'.pdf' : '' }];
            let data7 = [{ dok: str7[0] }, { tglkeluar: str7[1] }, { tglakhir: str7[2] }, { file: (str7[3]) ? str7[3]+'.pdf' : '' }];
            let data8 = [{ dok: str8[0] }, { tglkeluar: str8[1] }, { tglakhir: str8[2] }, { file: (str8[3]) ? str8[3]+'.pdf' : '' }];
            let data9 = [{ dok: str9[0] }, { tglkeluar: str9[1] }, { tglakhir: str9[2] }, { file: (str9[3]) ? str9[3]+'.pdf' : '' }];
            let data10 = [{ dok: str10[0] }, { tglkeluar: str10[1] }, { tglakhir: str10[2] }, { file: (str10[3]) ? str10[3]+'.pdf' : '' }];
            let data11 = [{ dok: str11[0] }, { tglkeluar: str11[1] }, { tglakhir: str11[2] }, { file: (str11[3]) ? str11[3]+'.pdf' : '' }];

            return { 
                data1: data1,
                data2: data2,
                data3: data3,
                data4: data4,
                data5: data5,
                data6: data6,
                data7: data7,
                data8: data8,
                data9: data9,
                data10: data10,
                data11: data11
            };
        }
    }

	public async saveAdminUmumUpd({ request, response }: HttpContextContract) {
        const supplier: any = await Supplier.query().where('sup_npwp', request.input('npwp')).first();
        const supp_code = supplier.sup_code_app;
        const last_prefix = Math.floor(Date.now()/1000); // 6 digit

        // cek inputan no dokumen
        let nodok;
        (request.input('nodok') == null || request.input('nodok') == '') ? nodok = '' : nodok = request.input('nodok');

        // cek inputan tgl dikeluarkan
        let tglkeluar;
        (request.input('tglkeluar') == null || request.input('tglkeluar') == '') ? tglkeluar = '' : tglkeluar = request.input('tglkeluar');

        // cek inputan tgl berakhir
        let tglakhir;
        (request.input('tglakhir') == null || request.input('tglakhir') == '') ? tglakhir = '' : tglakhir = request.input('tglakhir');

        // Open FTP
        const client = new ftp.Client();
        client.ftp.verbose = true; 
        try {           
            await client.access({
                host: Env.get('FTP_HOST'),
                user: Env.get('FTP_USERNAME'),
                password: Env.get('FTP_PASSWORD'),
                port: Env.get('FTP_PORT'),
            });
        }
        catch(err) {
            console.log(err)
        }

        const cek_supp = await SupplierPathDet.query().where('sup_code_app', supp_code).where('details_column', 10).where('status_update', 'true').where('active', 'true').first();

        if(!cek_supp){
            // Update Kelengkapan Administrasi Umum
            const updAdminUmum = await SupplierPathDet
                                .query()
                                .where('sup_code_app', supp_code)
                                .where('details_column', 10)
                                .where('details_column_prioritas', 10)
                                .update({
                                    active: 'false',
                                    modified_by: 'Vendor',
                                    modified_date: datetimeNow,
                                }); 

            if (updAdminUmum) {
                // Upload file
                const file = request.file('file');
                let nmfile_noex = "";
                let nmfile = "";
                let nmfile_db = "";
                let nmfile_upl = "";
                if(file) {       
                    nmfile_noex = file.clientName.substring(0, file.clientName.lastIndexOf('.'));
                    nmfile = file.clientName;
                    nmfile_db = supp_code + "_" + nmfile_noex + "_" + last_prefix;
                    nmfile_upl = nmfile_db + ".pdf";
                    
                    // upload lokal
                    await file.move(Application.publicPath('file'), { name: nmfile_upl });
                    
                    // upload FTP
                    await client.uploadFrom(Application.publicPath(`file/${nmfile_upl}`), `/${Env.get('FTP_PATH')}/${nmfile_upl}`);

                    // Close FTP
                    client.close();

                    // insert data supplier upload
                    const insFile = await SupplierPathUpload.create({
                        sup_code_app: supp_code,
                        details_column: 10,
                        details_upload_app: nmfile_db,
                        details_upload: nmfile,
                        created_by: 'Vendor'
                    });

                    if(insFile){
                        // function escapeHtml(raw) {
                        //     return raw.replace(/[&<>"'` !@$%()=+{}[\]]/g, function onReplace(match) {
                        //         return '&#' + match.charCodeAt(0) + ';';
                        //     });
                        // }
                        // return escapeHtml(nodok);

                        // nodok
                        // .replace(/&/g, "&amp;")
                        // .replace(/</g, "&lt;")
                        // .replace(/>/g, "&gt;")
                        // .replace(/"/g, "&quot;")
                        // .replace(/'/g, "&#039;");

                        // cek urutan terakhir
                        let prioritas = 0;
                        const Qprioritas = await SupplierPathDet
                                        .query()
                                        .where('sup_code_app', supp_code)
                                        .where('details_column', 10)
                                        .where('details_column_prioritas', 10)
                                        .orderBy('details_content_prioritas', 'desc')
                                        .first();   
                                        
                        if(Qprioritas){ prioritas = Qprioritas.details_content_prioritas + 1 } else { prioritas = 1 }

                        // Insert Kelengkapan Administrasi Umum
                        let admSuccess = false;
                        const bagian = request.input('bagian');
                        switch (parseInt(bagian)) {
                            case 1:
                                await SupplierPathDet.create({
                                    sup_code_app: supp_code,
                                    details_column: 10,
                                    details_column_desc: 'Kelengkapan Administrasi Umum',
                                    details_column_prioritas: 10,
                                    details_content_prioritas: prioritas,
                                    details_content_1: nodok+ '>>' + tglkeluar+ '>>' + tglakhir+ '>>' + nmfile_db,
                                    details_flag: 1,
                                    details_status: 1,
                                    created_by: 'Vendor',
                                    status_update: 'true'
                                });
                                admSuccess = true;
                                break;
                            case 2:
                                await SupplierPathDet.create({
                                    sup_code_app: supp_code,
                                    details_column: 10,
                                    details_column_desc: 'Kelengkapan Administrasi Umum',
                                    details_column_prioritas: 10,
                                    details_content_prioritas: prioritas,
                                    details_content_2: nodok+ '>>' + tglkeluar+ '>>' + tglakhir+ '>>' + nmfile_db,
                                    details_flag: 1,
                                    details_status: 1,
                                    created_by: 'Vendor',
                                    status_update: 'true'
                                });
                                admSuccess = true;
                                break;
                            case 3:
                                await SupplierPathDet.create({
                                    sup_code_app: supp_code,
                                    details_column: 10,
                                    details_column_desc: 'Kelengkapan Administrasi Umum',
                                    details_column_prioritas: 10,
                                    details_content_prioritas: prioritas,
                                    details_content_3: nodok+ '>>' + tglkeluar+ '>>' + tglakhir+ '>>' + nmfile_db,
                                    details_flag: 1,
                                    details_status: 1,
                                    created_by: 'Vendor',
                                    status_update: 'true'
                                });
                                admSuccess = true;
                                break;
                            case 4:
                                await SupplierPathDet.create({
                                    sup_code_app: supp_code,
                                    details_column: 10,
                                    details_column_desc: 'Kelengkapan Administrasi Umum',
                                    details_column_prioritas: 10,
                                    details_content_prioritas: prioritas,
                                    details_content_4: nodok+ '>>' + tglkeluar+ '>>' + tglakhir+ '>>' + nmfile_db,
                                    details_flag: 1,
                                    details_status: 1,
                                    created_by: 'Vendor',
                                    status_update: 'true'
                                });
                                admSuccess = true;
                                break;
                            case 5:
                                await SupplierPathDet.create({
                                    sup_code_app: supp_code,
                                    details_column: 10,
                                    details_column_desc: 'Kelengkapan Administrasi Umum',
                                    details_column_prioritas: 10,
                                    details_content_prioritas: prioritas,
                                    details_content_5: nodok+ '>>' + tglkeluar+ '>>' + tglakhir+ '>>' + nmfile_db,
                                    details_flag: 1,
                                    details_status: 1,
                                    created_by: 'Vendor',
                                    status_update: 'true'
                                });
                                admSuccess = true;
                                break;
                            case 6:
                                await SupplierPathDet.create({
                                    sup_code_app: supp_code,
                                    details_column: 10,
                                    details_column_desc: 'Kelengkapan Administrasi Umum',
                                    details_column_prioritas: 10,
                                    details_content_prioritas: prioritas,
                                    details_content_6: nodok+ '>>' + tglkeluar+ '>>' + tglakhir+ '>>' + nmfile_db,
                                    details_flag: 1,
                                    details_status: 1,
                                    created_by: 'Vendor',
                                    status_update: 'true'
                                });
                                admSuccess = true;
                                break;
                            case 7:
                                await SupplierPathDet.create({
                                    sup_code_app: supp_code,
                                    details_column: 10,
                                    details_column_desc: 'Kelengkapan Administrasi Umum',
                                    details_column_prioritas: 10,
                                    details_content_prioritas: prioritas,
                                    details_content_7: nodok+ '>>' + tglkeluar+ '>>' + tglakhir+ '>>' + nmfile_db,
                                    details_flag: 1,
                                    details_status: 1,
                                    created_by: 'Vendor',
                                    status_update: 'true'
                                });
                                admSuccess = true;
                                break;
                            case 8:
                                await SupplierPathDet.create({
                                    sup_code_app: supp_code,
                                    details_column: 10,
                                    details_column_desc: 'Kelengkapan Administrasi Umum',
                                    details_column_prioritas: 10,
                                    details_content_prioritas: prioritas,
                                    details_content_8: nodok+ '>>' + tglkeluar+ '>>' + tglakhir+ '>>' + nmfile_db,
                                    details_flag: 1,
                                    details_status: 1,
                                    created_by: 'Vendor',
                                    status_update: 'true'
                                });
                                admSuccess = true;
                                break;
                            case 9:
                                await SupplierPathDet.create({
                                    sup_code_app: supp_code,
                                    details_column: 10,
                                    details_column_desc: 'Kelengkapan Administrasi Umum',
                                    details_column_prioritas: 10,
                                    details_content_prioritas: prioritas,
                                    details_content_9: nodok+ '>>' + tglkeluar+ '>>' + tglakhir+ '>>' + nmfile_db,
                                    details_flag: 1,
                                    details_status: 1,
                                    created_by: 'Vendor',
                                    status_update: 'true'
                                });
                                admSuccess = true;
                                break;
                            case 10:
                                await SupplierPathDet.create({
                                    sup_code_app: supp_code,
                                    details_column: 10,
                                    details_column_desc: 'Kelengkapan Administrasi Umum',
                                    details_column_prioritas: 10,
                                    details_content_prioritas: prioritas,
                                    details_content_10: nodok+ '>>' + tglkeluar+ '>>' + tglakhir+ '>>' + nmfile_db,
                                    details_flag: 1,
                                    details_status: 1,
                                    created_by: 'Vendor',
                                    status_update: 'true'
                                });
                                admSuccess = true;
                                break;
                            case 11:
                                await SupplierPathDet.create({
                                    sup_code_app: supp_code,
                                    details_column: 10,
                                    details_column_desc: 'Kelengkapan Administrasi Umum',
                                    details_column_prioritas: 10,
                                    details_content_prioritas: prioritas,
                                    details_content_11: nodok+ '>>' + tglkeluar+ '>>' + tglakhir+ '>>' + nmfile_db,
                                    details_flag: 1,
                                    details_status: 1,
                                    created_by: 'Vendor',
                                    status_update: 'true'
                                });
                                admSuccess = true;
                                break;
                        }
                        
                        if (admSuccess) {
                            return response.status(200).json({
                                message: "Berhasil simpan data",
                                status: true
                            });
                        } else {
                            return response.status(406).json({
                                message: "Gagal simpan data m_supp_dtl_path",
                                status: true
                            });
                        }
                    }
                    else{
                        return response.status(406).json({
                            message: "Gagal insert data upload m_supp_upload_path",
                            status: true
                        });
                    }
                } else {
                    return response.status(406).json({
                        message: "Tidak ada file upload data",
                        status: true
                    });
                }
            } else {
                return response.status(406).json({
                    message: "Gagal update data SupplierPathDet",
                    status: true
                });
            }                    
        } else {
            // Upload file
            const file = request.file('file');
            let nmfile_noex = "";
            let nmfile = "";
            let nmfile_db = "";
            let nmfile_upl = "";
            if(file) {       
                nmfile_noex = file.clientName.substring(0, file.clientName.lastIndexOf('.'));
                nmfile = file.clientName;
                nmfile_db = supp_code + "_" + nmfile_noex + "_" + last_prefix;
                nmfile_upl = nmfile_db + ".pdf";
                
                // upload lokal
                await file.move(Application.publicPath('file'), { name: nmfile_upl });
                
                // upload FTP
                await client.uploadFrom(Application.publicPath(`file/${nmfile_upl}`), `/${Env.get('FTP_PATH')}/${nmfile_upl}`);

                // Close FTP
                client.close();

                // insert data supplier upload
                const insFile = await SupplierPathUpload.create({
                    sup_code_app: supp_code,
                    details_column: 10,
                    details_upload_app: nmfile_db,
                    details_upload: nmfile,
                    created_by: 'Vendor'
                });

                if(insFile){
                    // function escapeHtml(raw) {
                    //     return raw.replace(/[&<>"'` !@$%()=+{}[\]]/g, function onReplace(match) {
                    //         return '&#' + match.charCodeAt(0) + ';';
                    //     });
                    // }
                    // return escapeHtml(nodok);

                    // nodok
                    // .replace(/&/g, "&amp;")
                    // .replace(/</g, "&lt;")
                    // .replace(/>/g, "&gt;")
                    // .replace(/"/g, "&quot;")
                    // .replace(/'/g, "&#039;");

                    // cek urutan terakhir
                    let prioritas = 0;
                    const Qprioritas = await SupplierPathDet
                                    .query()
                                    .where('sup_code_app', supp_code)
                                    .where('details_column', 10)
                                    .where('details_column_prioritas', 10)
                                    .orderBy('details_content_prioritas', 'desc')
                                    .first();   
                                    
                    if(Qprioritas){ prioritas = Qprioritas.details_content_prioritas + 1 } else { prioritas = 1 }

                    // Insert Kelengkapan Administrasi Umum
                    let admSuccess = false;
                    const bagian = request.input('bagian');
                    switch (parseInt(bagian)) {
                        case 1:
                            await SupplierPathDet
                                .query()
                                .where('sup_code_app', supp_code)
                                .where('details_column', 10)
                                .where('details_column_prioritas', 10)
                                .where('status_update', 'true')
                                .where('active', 'true')
                                .update({
                                    details_content_1: nodok+ '>>' + tglkeluar+ '>>' + tglakhir+ '>>' + nmfile_db,
                                    modified_by: 'Vendor',
                                    modified_date: datetimeNow,
                                });
                            admSuccess = true;
                            break;
                        case 2:
                            await SupplierPathDet
                                .query()
                                .where('sup_code_app', supp_code)
                                .where('details_column', 10)
                                .where('details_column_prioritas', 10)
                                .where('status_update', 'true')
                                .where('active', 'true')
                                .update({
                                    details_content_2: nodok+ '>>' + tglkeluar+ '>>' + tglakhir+ '>>' + nmfile_db,
                                    modified_by: 'Vendor',
                                    modified_date: datetimeNow,
                                });
                            admSuccess = true;
                            break;
                        case 3:
                            await SupplierPathDet
                                .query()
                                .where('sup_code_app', supp_code)
                                .where('details_column', 10)
                                .where('details_column_prioritas', 10)
                                .where('status_update', 'true')
                                .where('active', 'true')
                                .update({
                                    details_content_3: nodok+ '>>' + tglkeluar+ '>>' + tglakhir+ '>>' + nmfile_db,
                                    modified_by: 'Vendor',
                                    modified_date: datetimeNow,
                                });
                            admSuccess = true;
                            break;
                        case 4:
                            await SupplierPathDet
                                .query()
                                .where('sup_code_app', supp_code)
                                .where('details_column', 10)
                                .where('details_column_prioritas', 10)
                                .where('status_update', 'true')
                                .where('active', 'true')
                                .update({
                                    details_content_4: nodok+ '>>' + tglkeluar+ '>>' + tglakhir+ '>>' + nmfile_db,
                                    modified_by: 'Vendor',
                                    modified_date: datetimeNow,
                                });
                            admSuccess = true;
                            break;
                        case 5:
                            await SupplierPathDet
                                .query()
                                .where('sup_code_app', supp_code)
                                .where('details_column', 10)
                                .where('details_column_prioritas', 10)
                                .where('status_update', 'true')
                                .where('active', 'true')
                                .update({
                                    details_content_5: nodok+ '>>' + tglkeluar+ '>>' + tglakhir+ '>>' + nmfile_db,
                                    modified_by: 'Vendor',
                                    modified_date: datetimeNow,
                                });
                            admSuccess = true;
                            break;
                        case 6:
                            await SupplierPathDet
                                .query()
                                .where('sup_code_app', supp_code)
                                .where('details_column', 10)
                                .where('details_column_prioritas', 10)
                                .where('status_update', 'true')
                                .where('active', 'true')
                                .update({
                                    details_content_6: nodok+ '>>' + tglkeluar+ '>>' + tglakhir+ '>>' + nmfile_db,
                                    modified_by: 'Vendor',
                                    modified_date: datetimeNow,
                                });
                            admSuccess = true;
                            break;
                        case 7:
                            await SupplierPathDet
                                .query()
                                .where('sup_code_app', supp_code)
                                .where('details_column', 10)
                                .where('details_column_prioritas', 10)
                                .where('status_update', 'true')
                                .where('active', 'true')
                                .update({
                                    details_content_7: nodok+ '>>' + tglkeluar+ '>>' + tglakhir+ '>>' + nmfile_db,
                                    modified_by: 'Vendor',
                                    modified_date: datetimeNow,
                                });
                            admSuccess = true;
                            break;
                        case 8:
                            await SupplierPathDet
                                .query()
                                .where('sup_code_app', supp_code)
                                .where('details_column', 10)
                                .where('details_column_prioritas', 10)
                                .where('status_update', 'true')
                                .where('active', 'true')
                                .update({
                                    details_content_8: nodok+ '>>' + tglkeluar+ '>>' + tglakhir+ '>>' + nmfile_db,
                                    modified_by: 'Vendor',
                                    modified_date: datetimeNow,
                                });
                            admSuccess = true;
                            break;
                        case 9:
                            await SupplierPathDet
                                .query()
                                .where('sup_code_app', supp_code)
                                .where('details_column', 10)
                                .where('details_column_prioritas', 10)
                                .where('status_update', 'true')
                                .where('active', 'true')
                                .update({
                                    details_content_9: nodok+ '>>' + tglkeluar+ '>>' + tglakhir+ '>>' + nmfile_db,
                                    modified_by: 'Vendor',
                                    modified_date: datetimeNow,
                                });
                            admSuccess = true;
                            break;
                        case 10:
                            await SupplierPathDet
                                .query()
                                .where('sup_code_app', supp_code)
                                .where('details_column', 10)
                                .where('details_column_prioritas', 10)
                                .where('status_update', 'true')
                                .where('active', 'true')
                                .update({
                                    details_content_10: nodok+ '>>' + tglkeluar+ '>>' + tglakhir+ '>>' + nmfile_db,
                                    modified_by: 'Vendor',
                                    modified_date: datetimeNow,
                                });
                            admSuccess = true;
                            break;
                        case 11:
                            await SupplierPathDet
                                .query()
                                .where('sup_code_app', supp_code)
                                .where('details_column', 10)
                                .where('details_column_prioritas', 10)
                                .where('status_update', 'true')
                                .where('active', 'true')
                                .update({
                                    details_content_11: nodok+ '>>' + tglkeluar+ '>>' + tglakhir+ '>>' + nmfile_db,
                                    modified_by: 'Vendor',
                                    modified_date: datetimeNow,
                                });
                            admSuccess = true;
                            break;
                    }
                    
                    if (admSuccess) {
                        return response.status(200).json({
                            message: "Berhasil simpan data",
                            status: true
                        });
                    } else {
                        return response.status(406).json({
                            message: "Gagal simpan data m_supp_dtl_path",
                            status: true
                        });
                    }
                }
                else{
                    return response.status(406).json({
                        message: "Gagal insert data upload m_supp_upload_path",
                        status: true
                    });
                }
            } else {
                return response.status(406).json({
                    message: "Tidak ada file upload data",
                    status: true
                });
            }
        }
    }   

    public async saveUploadVend({ request, response }: HttpContextContract) {
        const supplier: any = await Supplier.query().where('sup_npwp', request.input('npwp')).first();
        const supp_code = supplier.sup_code_app;
        const last_prefix = Math.floor(Date.now()/1000); // 6 digit

        // Open FTP
        const client = new ftp.Client();
        client.ftp.verbose = true; 
        try {           
            await client.access({
                host: Env.get('FTP_HOST'),
                user: Env.get('FTP_USERNAME'),
                password: Env.get('FTP_PASSWORD'),
                port: Env.get('FTP_PORT'),
            });
        }
        catch(err) {
            console.log(err)
        }

        // Upload file
        const file = request.file('file');
        let nmfile_noex = "";
        let nmfile = "";
        let nmfile_db = "";
        let nmfile_upl = "";
        if (file) {       
            nmfile_noex = file.clientName.substring(0, file.clientName.lastIndexOf('.'));
            nmfile = file.clientName;
            nmfile_db = supp_code + "_" + request.input('details_column') + "_" + last_prefix;
            nmfile_upl = nmfile_db + ".pdf";
            
            // upload lokal
            await file.move(Application.publicPath('file'), { name: nmfile_upl });
            
            // upload FTP
            await client.uploadFrom(Application.publicPath(`file/${nmfile_upl}`), `/${Env.get('FTP_PATH')}/${nmfile_upl}`);

            // Close FTP
            client.close();

            // insert data supplier upload
            const insFile = await SupplierPathUpload.create({
                sup_code_app: supp_code,
                details_column: parseInt(request.input('details_column')),
                details_upload_app: nmfile_db,
                details_upload: nmfile,
                created_by: 'Vendor'
            });

            if (insFile) {
                return response.status(200).json({
                    message: "Berhasil simpan data",
                    status: true
                });
            } else {
                return response.status(406).json({
                    message: "Gagal simpan data m_supp_upload_path",
                    status: true
                });
            }
        }    
    }   

    public async saveComProUpd({ request, response }: HttpContextContract) {
        const supplier: any = await Supplier.query().where('sup_npwp', request.input('npwp')).first();
        const supp_code = supplier.sup_code_app;

        const last_prefix = dayjs().format('YYMMDD_HHmmss');

        // Open FTP
        const client = new ftp.Client();
        client.ftp.verbose = true; 
        try {           
            await client.access({
                host: Env.get('FTP_HOST'),
                user: Env.get('FTP_USERNAME'),
                password: Env.get('FTP_PASSWORD'),
                port: Env.get('FTP_PORT'),
            });
        }
        catch(err) {
            console.log(err)
        }

        // cek upload file
        const file = request.file('file');
        let nmfile = "";
        let nmfile_db = "";
        let nmfile_upl = "";
        if(file) { 
            nmfile = file.clientName;
            nmfile_db = supp_code + "_22_" + last_prefix;
            nmfile_upl = nmfile_db + ".pdf";
            
            // cek urutan terakhir
            let prioritas = 0;
            const Qprioritas = await SupplierPathDet
                            .query()
                            .where('sup_code_app', supp_code)
                            .where('details_column', 22)
                            .where('details_column_prioritas', 22)
                            .orderBy('details_content_prioritas', 'desc')
                            .first();
                            
            if(Qprioritas){ prioritas = Qprioritas.details_content_prioritas + 1 } else { prioritas = 1 }
                        
            // insert Pakta Integritas
            const companyProfile = await SupplierPathDet.create({
                sup_code_app: supp_code,
                details_column: 22,
                details_column_desc: 'Company Profile',
                details_column_prioritas: 22,
                details_content_prioritas: prioritas,
                details_content_1: nmfile_db,
                details_flag: 1,
                details_status: 1,
                created_by: 'Vendor',
                status_update: 'true'
            });
            
            // upload lokal
            await file.move(Application.publicPath('file'), { name: nmfile_upl });
            
            // upload FTP
            await client.uploadFrom(Application.publicPath(`file/${nmfile_upl}`), `/${Env.get('FTP_PATH')}/${nmfile_upl}`); 

            // insert data supplier upload
            const insFile = await SupplierPathUpload.create({
                sup_code_app: supp_code,
                details_column: 22,
                details_upload_app: nmfile_db,
                details_upload: nmfile,
                created_by: 'Vendor'
            });

            if(insFile){
                return response.status(200).json({
                    message: "Berhasil upload file",
                    status: true
                });
            }
            else{
                return response.status(406).json({
                    message: "Gagal upload data",
                    status: true
                });
            }
        }    
        
        // Close FTP
        client.close();     
    }

    public async saveTranspUpd({ request, response }: HttpContextContract) {
        const supplier: any = await Supplier.query().where('sup_npwp', request.input('npwp')).first();
        const supp_code = supplier.sup_code_app;
        const last_prefix = Math.floor(Date.now()/1000); // 6 digit

        // Open FTP
        const client = new ftp.Client();
        client.ftp.verbose = true; 
        try {           
            await client.access({
                host: Env.get('FTP_HOST'),
                user: Env.get('FTP_USERNAME'),
                password: Env.get('FTP_PASSWORD'),
                port: Env.get('FTP_PORT'),
            });
        }
        catch(err) {
            console.log(err)
        }

        // Upload file
        const file = request.file('file');
        let nmfile_noex = "";
        let nmfile = "";
        let nmfile_db = "";
        let nmfile_upl = "";
        if (file) {       
            nmfile_noex = file.clientName.substring(0, file.clientName.lastIndexOf('.'));
            nmfile = file.clientName;
            nmfile_db = supp_code + "_" + nmfile_noex + "_" + last_prefix;
            nmfile_upl = nmfile_db + ".pdf";
            
            // upload lokal
            await file.move(Application.publicPath('file'), { name: nmfile_upl });
            
            // upload FTP
            await client.uploadFrom(Application.publicPath(`file/${nmfile_upl}`), `/${Env.get('FTP_PATH')}/${nmfile_upl}`);

            // Close FTP
            client.close();

            // insert data supplier upload
            const insFile = await SupplierPathUpload.create({
                sup_code_app: supp_code,
                details_column: parseInt(request.input('details_column')),
                details_upload_app: nmfile_db,
                details_upload: nmfile,
                created_by: 'Vendor'
            });

            if (insFile) {
                return response.status(200).json({
                    message: "Berhasil simpan data",
                    status: true
                });
            } else {
                return response.status(406).json({
                    message: "Gagal simpan data m_supp_upload_path",
                    status: true
                });
            }
        }    
    }
	
	public async getSupplierDetPath({ params }: HttpContextContract) {
        const supp_code = params.code;
        const column = params.column;

        const cek_supp = await SupplierPathDet.query().where('sup_code_app', supp_code).where('details_column', column).first();
        
        if(cek_supp){
            var str1 = cek_supp.details_content_1.split('>>');
            var str2 = cek_supp.details_content_2.split('>>');
            var str3 = cek_supp.details_content_3.split('>>');
            var str4 = cek_supp.details_content_4.split('>>');
            var str5 = cek_supp.details_content_5.split('>>');
            var str6 = cek_supp.details_content_6.split('>>');
            var str7 = cek_supp.details_content_7.split('>>');
            var str8 = cek_supp.details_content_8.split('>>');
            var str9 = cek_supp.details_content_9.split('>>');
            var str10 = cek_supp.details_content_10.split('>>');
            var str11 = cek_supp.details_content_11.split('>>');

            let data1 = [{ dok: str1[0] }, { tglkeluar: str1[1] }, { tglakhir: str1[2] }, { file: (str1[3]) ? str1[3]+'.pdf' : '' }];
            let data2 = [{ dok: str2[0] }, { tglkeluar: str2[1] }, { tglakhir: str2[2] }, { file: (str2[3]) ? str2[3]+'.pdf' : '' }];
            let data3 = [{ dok: str3[0] }, { tglkeluar: str3[1] }, { tglakhir: str3[2] }, { file: (str3[3]) ? str3[3]+'.pdf' : '' }];
            let data4 = [{ dok: str4[0] }, { tglkeluar: str4[1] }, { tglakhir: str4[2] }, { file: (str4[3]) ? str4[3]+'.pdf' : '' }];
            let data5 = [{ dok: str5[0] }, { tglkeluar: str5[1] }, { tglakhir: str5[2] }, { file: (str5[3]) ? str5[3]+'.pdf' : '' }];
            let data6 = [{ dok: str6[0] }, { tglkeluar: str6[1] }, { tglakhir: str6[2] }, { file: (str6[3]) ? str6[3]+'.pdf' : '' }];
            let data7 = [{ dok: str7[0] }, { tglkeluar: str7[1] }, { tglakhir: str7[2] }, { file: (str7[3]) ? str7[3]+'.pdf' : '' }];
            let data8 = [{ dok: str8[0] }, { tglkeluar: str8[1] }, { tglakhir: str8[2] }, { file: (str8[3]) ? str8[3]+'.pdf' : '' }];
            let data9 = [{ dok: str9[0] }, { tglkeluar: str9[1] }, { tglakhir: str9[2] }, { file: (str9[3]) ? str9[3]+'.pdf' : '' }];
            let data10 = [{ dok: str10[0] }, { tglkeluar: str10[1] }, { tglakhir: str10[2] }, { file: (str10[3]) ? str10[3]+'.pdf' : '' }];
            let data11 = [{ dok: str11[0] }, { tglkeluar: str11[1] }, { tglakhir: str11[2] }, { file: (str11[3]) ? str11[3]+'.pdf' : '' }];

            return { 
                data1: data1,
                data2: data2,
                data3: data3,
                data4: data4,
                data5: data5,
                data6: data6,
                data7: data7,
                data8: data8,
                data9: data9,
                data10: data10,
                data11: data11
            };
        }
    }

    public async getVendorTransporter({ request }: HttpContextContract) {
        if (request.input('rowsPerPage') == null) {
            const res = await SupplierPathUpload.query().where('sup_code_app', request.input('code')).where('details_column', 11);
            return res;            
        }
        else {
            var page = request.input('page');
            var sort = request.input('sortBy')
            var descend = request.input('descending')
            if(descend == 'false'){
                descend = 'desc';
            }else{
                descend = 'asc';
            }
            const res = await SupplierPathUpload
                        .query()
                        .where('sup_code_app', request.input('code'))  
                        .where('details_column', 11)
                        .where((query) => {
                            if (request.input('filter') != null)
                            {
                              query.where('details_upload_app', 'like', `%${request.input('filter')}%`)
                                    .orWhere('details_upload', 'like', `%${request.input('filter')}%`);                                          
                            }                    
                        })    
                        .orderBy(sort,descend)            
                        .paginate(page, request.input('rowsPerPage'));  

            return res;  
        }
    }

    public async saveVendorTransporter({ request, response }: HttpContextContract) {
        const supp_code = request.input('code');
        const last_prefix = dayjs().format('YYMMDD_HHmmss');

        // Open FTP
        const client = new ftp.Client();
        client.ftp.verbose = true; 
        try {           
            await client.access({
                host: Env.get('FTP_HOST'),
                user: Env.get('FTP_USERNAME'),
                password: Env.get('FTP_PASSWORD'),
                port: Env.get('FTP_PORT'),
            });
        }
        catch(err) {
            console.log(err)
        }

        // cek upload file
        const file = request.file('file');
        let nmfile = "";
        let nmfile_db = "";
        let nmfile_upl = "";
        if(file) {       
            nmfile = file.clientName;
            nmfile_db = supp_code + "_11_" + last_prefix;
            nmfile_upl = nmfile_db + ".pdf";
            
            // cek urutan terakhir
            let prioritas = 0;
            const Qprioritas = await SupplierPathDet
                            .query()
                            .where('sup_code_app', supp_code)
                            .where('details_column', 11)
                            .where('details_column_prioritas', 11)
                            .orderBy('details_content_prioritas', 'desc')
                            .first();   
                            
            if(Qprioritas){ prioritas = Qprioritas.details_content_prioritas + 1 } else { prioritas = 1 }

            // insert Kelengkapan tambahan untuk Vendor Transporter
            const VendorTransporter = await SupplierPathDet.create({
                sup_code_app: request.input('code'),
                details_column: 11,
                details_column_desc: 'Kelengkapan tambahan untuk Vendor Transporter',
                details_column_prioritas: 11,
                details_content_prioritas: prioritas,
                details_content_1: nmfile_db,
                details_flag: 1,
                details_status: 1,
                created_by: 'Vendor'
            });

            // upload lokal
            await file.move(Application.publicPath('file'), { name: nmfile_upl });
            
            // upload FTP
            await client.uploadFrom(Application.publicPath(`file/${nmfile_upl}`), `/${Env.get('FTP_PATH')}/${nmfile_upl}`); 

            // insert data supplier upload
            const insFile = await SupplierPathUpload.create({
                sup_code_app: supp_code,
                details_column: 11,
                details_upload_app: nmfile_db,
                details_upload: nmfile,
                created_by: 'Vendor'
            });

            if(insFile){
                return response.status(200).json({
                    message: "Berhasil upload file",
                    status: true
                });
            }
            else{
                return response.status(406).json({
                    message: "Gagal upload data",
                    status: true
                });
            }            
        }    
        
        // Close FTP
        client.close();        
    }

    public async delVendorTransporter({ params, response }: HttpContextContract) {
        // cek data upload
        const cekData = await SupplierPathUpload.query().where('upload_id', params.id).first();

        if(cekData){
            // Open FTP
            const client = new ftp.Client();
            client.ftp.verbose = true; 
            try {           
                await client.access({
                    host: Env.get('FTP_HOST'),
                    user: Env.get('FTP_USERNAME'),
                    password: Env.get('FTP_PASSWORD'),
                    port: Env.get('FTP_PORT'),
                });
            }
            catch(err) {
                console.log(err)
            }

            // delete data file di FTP & update data lama
            await client.remove(`/${Env.get('FTP_PATH')}/${cekData.details_upload_app}.pdf`);
        
            // Close FTP
            client.close();    

            // delete data supplier detail
            const VendorTransporterDet = await SupplierPathDet
                                        .query()
                                        .where('sup_code_app', cekData.sup_code_app)
                                        .where('details_column', cekData.details_column)
                                        .where('details_content_1', cekData.details_upload_app)
                                        .delete();            

            // delete data supplier upload
            const VendorTransporterUpl = await SupplierPathUpload
                                        .query()
                                        .where('upload_id', params.id)
                                        .delete();

            return response.send(VendorTransporterUpl);
        }
        else{
            return response.status(406).json({
                message: "Invalid data",
                status: true,
            });  
        }
    }

	public async delVendorTransporterUpd({ params, response }: HttpContextContract) {
        // cek data upload
        const cekData = await SupplierPathUpload.query().where('upload_id', params.id).first();

        if(cekData){
            // Open FTP
            const client = new ftp.Client();
            client.ftp.verbose = true; 
            try {           
                await client.access({
                    host: Env.get('FTP_HOST'),
                    user: Env.get('FTP_USERNAME'),
                    password: Env.get('FTP_PASSWORD'),
                    port: Env.get('FTP_PORT'),
                });
            }
            catch(err) {
                console.log(err)
            }

            // delete data file di FTP & update data lama
            await client.remove(`/${Env.get('FTP_PATH')}/${cekData.details_upload_app}.pdf`);
        
            // Close FTP
            client.close();    

            // delete data supplier upload
            const VendorTransporterUpl = await SupplierPathUpload
                                        .query()
                                        .where('upload_id', params.id)
                                        .delete();

            return response.send(VendorTransporterUpl);
        }
        else{
            return response.status(406).json({
                message: "Invalid data",
                status: true,
            });  
        }
    }
	
    public async saveVendorAgenResmi({ request, response }: HttpContextContract) {
        const supp_code = request.input('code');
        
        // cek inputan
        let nodok, tglkeluar, tglakhir;
        (request.input('nodok') == null || request.input('nodok') == '') ? nodok = '' : nodok = request.input('nodok');
        (request.input('tglkeluar') == null || request.input('tglkeluar') == '') ? tglkeluar = '' : tglkeluar = request.input('tglkeluar');
        (request.input('tglakhir') == null || request.input('tglakhir') == '') ? tglakhir = '' : tglakhir = request.input('tglakhir');
    
        // cek data SupplierPathDet
        const cekData1 = await SupplierPathDet
                        .query()
                        .where('sup_code_app', supp_code)
                        .where('details_column', 12)
                        .where('details_column_prioritas', 12)
                        .first();        

        if(cekData1){
            // Update Kelengkapan tambahan untuk Vendor Keagenan Resmi
            const updVendorAgenResmi = await SupplierPathDet
                                    .query()
                                    .where('sup_code_app', supp_code)
                                    .where('details_column', 12)
                                    .where('details_column_prioritas', 12)
                                    .update({ 
                                        details_content_1: nodok + ';' + tglkeluar + ';' + tglakhir,
                                        modified_by: 'Vendor',
                                        modified_date: datetimeNow,
                                        status_update: 1
                                    });  
                                
            if(updVendorAgenResmi){
                return response.status(200).json({
                    message: "Berhasil ubah data",
                    status: true
                });
            }
            else{
                return response.status(406).json({
                    message: "Gagal ubah data",
                    status: true
                });
            }                                
        }
        else{
            // Insert Kelengkapan tambahan untuk Vendor Keagenan Resmi
            const insVendorAgenResmi = await SupplierPathDet.create({
                sup_code_app: request.input('code'),
                details_column: 12,
                details_column_desc: 'Kelengkapan tambahan untuk Vendor Keagenan Resmi',
                details_column_prioritas: 12,
                details_content_prioritas: 1,
                details_content_1: nodok + ';' + tglkeluar + ';' + tglakhir,
                details_flag: 1,
                details_status: 1,
                created_by: 'Vendor'
            });

            if(insVendorAgenResmi){
                return response.status(200).json({
                    message: "Berhasil simpan data",
                    status: true
                });
            }
            else{
                return response.status(406).json({
                    message: "Gagal simpan data",
                    status: true
                });
            }
        }        
    }
	
	public async saveElekUpd({ request, response }: HttpContextContract) {
        const supplier: any = await Supplier.query().where('sup_npwp', request.input('npwp')).first();
        const supp_code = supplier.sup_code_app;
        
        // cek inputan
        let nodok, tglkeluar, tglakhir, nodok2, tglkeluar2, tglakhir2;
        (request.input('nodok_1_kontraktor') == null || request.input('nodok_1_kontraktor') == '') ? nodok = '' : nodok = request.input('nodok_1_kontraktor');
        (request.input('tglkeluar_1_kontraktor') == null || request.input('tglkeluar_1_kontraktor') == '') ? tglkeluar = '' : tglkeluar = request.input('tglkeluar_1_kontraktor');
        (request.input('tglakhir_1_kontraktor') == null || request.input('tglakhir_1_kontraktor') == '') ? tglakhir = '' : tglakhir = request.input('tglakhir_1_kontraktor');

        (request.input('nodok_2_kontraktor') == null || request.input('nodok_2_kontraktor') == '') ? nodok2 = '' : nodok2 = request.input('nodok_2_kontraktor');
        (request.input('tglkeluar_2_kontraktor') == null || request.input('tglkeluar_2_kontraktor') == '') ? tglkeluar2 = '' : tglkeluar2 = request.input('tglkeluar_2_kontraktor');
        (request.input('tglakhir_2_kontraktor') == null || request.input('tglakhir_2_kontraktor') == '') ? tglakhir2 = '' : tglakhir2 = request.input('tglakhir_2_kontraktor');
    
        // cek data SupplierPathDet
        const cekData = await SupplierPathDet
                        .query()
                        .where('sup_code_app', supp_code)
                        .where('details_column', 13)
                        .where('details_column_prioritas', 13)
                        .first();        

        if(cekData){
            // Update Kelengkapan tambahan untuk Vendor Keagenan Resmi
            const updVendorElek = await SupplierPathDet
                                    .query()
                                    .where('sup_code_app', supp_code)
                                    .where('details_column', 13)
                                    .where('details_column_prioritas', 13)
                                    .update({ 
                                        details_content_1: nodok + ';' + tglkeluar + ';' + tglakhir,
                                        details_content_2: nodok2 + ';' + tglkeluar2 + ';' + tglakhir2,
                                        modified_by: 'Vendor',
                                        modified_date: datetimeNow
                                    });  
                                
            if(updVendorElek){
                return response.status(200).json({
                    message: "Berhasil ubah data",
                    status: true
                });
            }
            else{
                return response.status(406).json({
                    message: "Gagal ubah data",
                    status: true
                });
            }                                
        }
        else{
            // Insert Kelengkapan tambahan untuk Vendor Keagenan Resmi
            const insVendorElek = await SupplierPathDet.create({
                sup_code_app: supp_code,
                details_column: 13,
                details_column_desc: 'Kelengkapan tambahan untuk Kontraktor Sipil/Eleketrikal',
                details_column_prioritas: 13,
                details_content_prioritas: 1,
                details_content_1: nodok + ';' + tglkeluar + ';' + tglakhir,
                details_content_2: nodok2 + ';' + tglkeluar2 + ';' + tglakhir2,
                details_flag: 1,
                details_status: 1,
                created_by: 'Vendor',
                status_update: 'true'
            });

            if(insVendorElek){
                return response.status(200).json({
                    message: "Berhasil simpan data",
                    status: true
                });
            }
            else{
                return response.status(406).json({
                    message: "Gagal simpan data",
                    status: true
                });
            }
        }        
    }    

    public async saveAgenUpd({ request, response }: HttpContextContract) {
        const supplier: any = await Supplier.query().where('sup_npwp', request.input('npwp')).first();
        const supp_code = supplier.sup_code_app;
        
        // cek inputan
        let nodok, tglkeluar, tglakhir;
        (request.input('nodok_1_agen') == null || request.input('nodok_1_agen') == '') ? nodok = '' : nodok = request.input('nodok_1_agen');
        (request.input('tglkeluar_1_agen') == null || request.input('tglkeluar_1_agen') == '') ? tglkeluar = '' : tglkeluar = request.input('tglkeluar_1_agen');
        (request.input('tglakhir_1_agen') == null || request.input('tglakhir_1_agen') == '') ? tglakhir = '' : tglakhir = request.input('tglakhir_1_agen');
    
        // cek data SupplierPathDet
        const cekData1 = await SupplierPathDet
                        .query()
                        .where('sup_code_app', supp_code)
                        .where('details_column', 12)
                        .where('details_column_prioritas', 12)
                        .first();        

        if(cekData1){
            // Update Kelengkapan tambahan untuk Vendor Keagenan Resmi
            const updVendorAgenResmi = await SupplierPathDet
                                    .query()
                                    .where('sup_code_app', supp_code)
                                    .where('details_column', 12)
                                    .where('details_column_prioritas', 12)
                                    .update({ 
                                        details_content_1: nodok + ';' + tglkeluar + ';' + tglakhir,
                                        modified_by: 'Vendor',
                                        modified_date: datetimeNow
                                    });  
                                
            if(updVendorAgenResmi){
                return response.status(200).json({
                    message: "Berhasil ubah data",
                    status: true
                });
            }
            else{
                return response.status(406).json({
                    message: "Gagal ubah data",
                    status: true
                });
            }                                
        }
        else{
            // Insert Kelengkapan tambahan untuk Vendor Keagenan Resmi
            const insVendorAgenResmi = await SupplierPathDet.create({
                sup_code_app: supp_code,
                details_column: 12,
                details_column_desc: 'Kelengkapan tambahan untuk Vendor Keagenan Resmi',
                details_column_prioritas: 12,
                details_content_prioritas: 1,
                details_content_1: nodok + ';' + tglkeluar + ';' + tglakhir,
                details_flag: 1,
                details_status: 1,
                created_by: 'Vendor',
                status_update: 'true'
            });

            if(insVendorAgenResmi){
                return response.status(200).json({
                    message: "Berhasil simpan data",
                    status: true
                });
            }
            else{
                return response.status(406).json({
                    message: "Gagal simpan data",
                    status: true
                });
            }
        }        
    }

    public async savefileVendorAgenResmi({ request, response }: HttpContextContract) {
        const supp_code = request.input('code');
        const last_prefix = dayjs().format('YYMMDD_HHmmss');

        // Open FTP
        const client = new ftp.Client();
        client.ftp.verbose = true; 
        try {           
            await client.access({
                host: Env.get('FTP_HOST'),
                user: Env.get('FTP_USERNAME'),
                password: Env.get('FTP_PASSWORD'),
                port: Env.get('FTP_PORT'),
            });
        }
        catch(err) {
            console.log(err)
        }

        // cek upload file
        const file = request.file('file');
        let nmfile = "";
        let nmfile_db = "";
        let nmfile_upl = "";
        if(file) {       
            nmfile = file.clientName;
            nmfile_db = supp_code + "_12_" + last_prefix;
            nmfile_upl = nmfile_db + ".pdf";
            
            // upload lokal
            await file.move(Application.publicPath('file'), { name: nmfile_upl });
            
            // upload FTP
            await client.uploadFrom(Application.publicPath(`file/${nmfile_upl}`), `/${Env.get('FTP_PATH')}/${nmfile_upl}`); 

            // insert data upload
            const insFile = await SupplierPathUpload.create({
                sup_code_app: supp_code,
                details_column: 12,
                details_upload_app: nmfile_db,
                details_upload: nmfile,
                created_by: 'Vendor'
            });

            if(insFile){
                return response.status(200).json({
                    message: "Berhasil upload file",
                    status: true
                });
            }
            else{
                return response.status(406).json({
                    message: "Gagal upload data",
                    status: true
                });
            }            
        }    
        
        // Close FTP
        client.close();        
    }

    public async getVendorAgenResmi({ params }: HttpContextContract) {
        const supp_code = params.code;
        const column = params.column;

        const cek_supp = await SupplierPathDet.query().where('sup_code_app', supp_code).where('details_column', column).first();
        
        if(cek_supp){
            var str1 = cek_supp.details_content_1.split(';');

            let data1 = [{ dok: str1[0] }, { tglkeluar: str1[1] }, { tglakhir: str1[2] }];

            return { 
                data1: data1
            };
        }
    }

    public async getfileVendorAgenResmi({ request }: HttpContextContract) {
        const res = await SupplierPathUpload.query().where('sup_code_app', request.input('code')).where('details_column', 12);
        return res;            
    }

    public async delfileVendorAgenResmi({ params, response }: HttpContextContract) {
        // cek data
        const cekData = await SupplierPathUpload.query().where('upload_id', params.id).first();

        if(cekData){
            // Open FTP
            const client = new ftp.Client();
            client.ftp.verbose = true; 
            try {           
                await client.access({
                    host: Env.get('FTP_HOST'),
                    user: Env.get('FTP_USERNAME'),
                    password: Env.get('FTP_PASSWORD'),
                    port: Env.get('FTP_PORT'),
                });
            }
            catch(err) {
                console.log(err)
            }

            // delete data file di FTP & update data lama
            await client.remove(`/${Env.get('FTP_PATH')}/${cekData.details_upload_app}.pdf`);
        
            // Close FTP
            client.close();    

            const delFile = await SupplierPathUpload
                            .query()
                            .where('upload_id', params.id)
                            .delete();

            return response.send(delFile);
        }
        else{
            return response.status(406).json({
                message: "Invalid data",
                status: true,
            });  
        }
    }

    public async saveKontraktorSipil({ request, response }: HttpContextContract) {
        const supp_code = request.input('code');
        
        // cek inputan
        let nodok_1, tglkeluar_1, tglakhir_1, nodok_2, tglkeluar_2, tglakhir_2;
        (request.input('nodok_1') == null || request.input('nodok_1') == '') ? nodok_1 = '' : nodok_1 = request.input('nodok_1');
        (request.input('tglkeluar_1') == null || request.input('tglkeluar_1') == '') ? tglkeluar_1 = '' : tglkeluar_1 = request.input('tglkeluar_1');
        (request.input('tglakhir_1') == null || request.input('tglakhir_1') == '') ? tglakhir_1 = '' : tglakhir_1 = request.input('tglakhir_1');
        (request.input('nodok_2') == null || request.input('nodok_2') == '') ? nodok_2 = '' : nodok_2 = request.input('nodok_2');
        (request.input('tglkeluar_2') == null || request.input('tglkeluar_2') == '') ? tglkeluar_2 = '' : tglkeluar_2 = request.input('tglkeluar_2');
        (request.input('tglakhir_2') == null || request.input('tglakhir_2') == '') ? tglakhir_2 = '' : tglakhir_2 = request.input('tglakhir_2');
		
        // cek data SupplierPathDet
        const cekData1 = await SupplierPathDet
                        .query()
                        .where('sup_code_app', supp_code)
                        .where('details_column', 13)
                        .where('details_column_prioritas', 13)
                        .first();        

        if(cekData1){
            // Update Kelengkapan tambahan untuk Kontraktor Sipil/Eleketrikal
            const updKontraktorSipil = await SupplierPathDet
                                    .query()
                                    .where('sup_code_app', supp_code)
                                    .where('details_column', 13)
                                    .where('details_column_prioritas', 13)
                                    .update({ 
                                        details_content_1: nodok_1 + ';' + tglkeluar_1 + ';' + tglakhir_1,
										details_content_2: nodok_2 + ';' + tglkeluar_2 + ';' + tglakhir_2,
                                        modified_by: 'Vendor',
                                        modified_date: datetimeNow,
                                        status_update: 1
                                    });  
                                
            if(updKontraktorSipil){
                return response.status(200).json({
                    message: "Berhasil ubah data",
                    status: true
                });
            }
            else{
                return response.status(406).json({
                    message: "Gagal ubah data",
                    status: true
                });
            }                                
        }
        else{
            // Insert Kelengkapan tambahan untuk Vendor Keagenan Resmi
            const insKontraktorSipil = await SupplierPathDet.create({
                sup_code_app: request.input('code'),
                details_column: 13,
                details_column_desc: 'Kelengkapan tambahan untuk Kontraktor Sipil/Elektrikal',
                details_column_prioritas: 13,
                details_content_prioritas: 1,
                details_content_1: nodok_1 + ';' + tglkeluar_1 + ';' + tglakhir_1,
				details_content_2: nodok_2 + ';' + tglkeluar_2 + ';' + tglakhir_2,
                details_flag: 1,
                details_status: 1,
                created_by: 'Vendor'
            });

            if(insKontraktorSipil){
                return response.status(200).json({
                    message: "Berhasil simpan data",
                    status: true
                });
            }
            else{
                return response.status(406).json({
                    message: "Gagal simpan data",
                    status: true
                });
            }
        }        
    }

    public async savefileKontraktorSipil({ request, response }: HttpContextContract) {
        const supp_code = request.input('code');
        const last_prefix = dayjs().format('YYMMDD_HHmmss');

        // Open FTP
        const client = new ftp.Client();
        client.ftp.verbose = true; 
        try {           
            await client.access({
                host: Env.get('FTP_HOST'),
                user: Env.get('FTP_USERNAME'),
                password: Env.get('FTP_PASSWORD'),
                port: Env.get('FTP_PORT'),
            });
        }
        catch(err) {
            console.log(err)
        }

        // cek upload file
        const file = request.file('file');
        let nmfile = "";
        let nmfile_db = "";
        let nmfile_upl = "";
        if(file) {       
            nmfile = file.clientName;
            nmfile_db = supp_code + "_13_" + last_prefix;
            nmfile_upl = nmfile_db + ".pdf";
            
            // upload lokal
            await file.move(Application.publicPath('file'), { name: nmfile_upl });
            
            // upload FTP
            await client.uploadFrom(Application.publicPath(`file/${nmfile_upl}`), `/${Env.get('FTP_PATH')}/${nmfile_upl}`); 

            // insert data upload
            const insFile = await SupplierPathUpload.create({
                sup_code_app: supp_code,
                details_column: 13,
                details_upload_app: nmfile_db,
                details_upload: nmfile,
                created_by: 'Vendor'
            });

            if(insFile){
                return response.status(200).json({
                    message: "Berhasil upload file",
                    status: true
                });
            }
            else{
                return response.status(406).json({
                    message: "Gagal upload data",
                    status: true
                });
            }            
        }    
        
        // Close FTP
        client.close();        
    }

    public async getKontraktorSipil({ params }: HttpContextContract) {
        const supp_code = params.code;
        const column = params.column;

        const cek_supp = await SupplierPathDet.query().where('sup_code_app', supp_code).where('details_column', column).first();
        
        if(cek_supp){
            var str1 = cek_supp.details_content_1.split(';');
			var str2 = cek_supp.details_content_2.split(';');

            let data1 = [{ dok: str1[0] }, { tglkeluar: str1[1] }, { tglakhir: str1[2] }];
			let data2 = [{ dok: str2[0] }, { tglkeluar: str2[1] }, { tglakhir: str2[2] }];

            return { 
                data1: data1,
				data2: data2
            };
        }
    }

    public async getfileKontraktorSipil({ request }: HttpContextContract) {
        const res = await SupplierPathUpload.query().where('sup_code_app', request.input('code')).where('details_column', 13);
        return res;            
    }

    public async delfileKontraktorSipil({ params, response }: HttpContextContract) {
        // cek data
        const cekData = await SupplierPathUpload.query().where('upload_id', params.id).first();

        if(cekData){
            // Open FTP
            const client = new ftp.Client();
            client.ftp.verbose = true; 
            try {           
                await client.access({
                    host: Env.get('FTP_HOST'),
                    user: Env.get('FTP_USERNAME'),
                    password: Env.get('FTP_PASSWORD'),
                    port: Env.get('FTP_PORT'),
                });
            }
            catch(err) {
                console.log(err)
            }

            // delete data file di FTP & update data lama
            await client.remove(`/${Env.get('FTP_PATH')}/${cekData.details_upload_app}.pdf`);
        
            // Close FTP
            client.close();    

            const delFile = await SupplierPathUpload
                            .query()
                            .where('upload_id', params.id)
                            .delete();

            return response.send(delFile);
        }
        else{
            return response.status(406).json({
                message: "Invalid data",
                status: true,
            });  
        }
    }

    public async getGroupPers({ request }: HttpContextContract) {
        if (request.input('rowsPerPage') == null) {
            const res = await SupplierPathDet.query().where('sup_code_app', request.input('code')).where('details_column', 15).where('details_column_prioritas', 15);
            return res;            
        }
        else {
            var page = request.input('page');
            var sort = request.input('sortBy')
            var descend = request.input('descending')
            if(descend == 'false'){
                descend = 'desc';
            }else{
                descend = 'asc';
            }
            const res = await SupplierPathDet
                        .query()
                        .where('sup_code_app', request.input('code'))
                        .where('details_column', 15)
                        .where('details_column_prioritas', 15)
                        .where((query) => {
                            if (request.input('filter') != null)
                            {
                              query.where('details_content_1', 'like', `%${request.input('filter')}%`)
                                    .orWhere('details_content_2', 'like', `%${request.input('filter')}%`)                                        
                                    .orWhere('details_content_3', 'like', `%${request.input('filter')}%`)
                                    .orWhere('details_content_4', 'like', `%${request.input('filter')}%`)
                                    .orWhere('details_content_5', 'like', `%${request.input('filter')}%`)
                                    .orWhere('details_content_6', 'like', `%${request.input('filter')}%`)
									.orWhere('details_content_7', 'like', `%${request.input('filter')}%`);                                          
                            }                    
                        })    
                        .orderBy(sort,descend)            
                        .paginate(page, request.input('rowsPerPage'));  

            return res;  
        }
    }

    public async getDataGroupPers({ request, response }: HttpContextContract) {
        const enkrip = Buffer.from(request.input('enkrip'), 'base64').toString('ascii');
        const code = request.input('code');

        const data = await RegisVendor
                    .query()
                    .where('regis_code_app', code).first(); 

        return response.json(data);
    }
	
	public async saveaddGroupPersUpd({ request, response }: HttpContextContract) {
        try {
            const cekdata = await SupplierPath
                            .query()
                            .where('sup_npwp', request.input('npwp'))
                            .first();
            if(cekdata){
                const supp_code = cekdata.sup_code_app;
                
                let alamat1, alamat2, alamat3;
                const countAlamat = request.input('alamat').toString().length;          
                if(countAlamat <= 50){
                    alamat1 = request.input('alamat').substr(0,50);
                    alamat2 = ''; 
                    alamat3 = '';
                } else if(countAlamat <= 50){
                    alamat1 = request.input('alamat').substr(0,50);
                    alamat2 = request.input('alamat').substr(51,100);
                    alamat3 = '';
                } else {
                    alamat1 = request.input('alamat').substr(0,50);
                    alamat2 = request.input('alamat').substr(51,100); 
                    alamat3 = request.input('alamat').substr(101,150);
                }

                // cek urutan terakhir
                let prioritas = 0;
                const Qprioritas = await SupplierPathDet
                                .query()
                                .where('sup_code_app', supp_code)
                                .where('details_column', 15)
                                .where('details_column_prioritas', 15)
                                .orderBy('details_content_prioritas', 'desc')
                                .first();   
                                
                if(Qprioritas){ prioritas = Qprioritas.details_content_prioritas + 1 } else { prioritas = 1 }

                // insert Group / Anak Perusahaan
                const GroupPers = await SupplierPathDet.create({
                    sup_code_app: supp_code,
                    details_column: 15,
                    details_column_desc: 'Group/Anak Perusahaan',
                    details_column_prioritas: 15,
                    details_content_prioritas: prioritas,
                    details_content_1: await ucWords(request.input('nama')),
                    details_content_2: request.input('sektorbisnis'),
                    details_content_3: request.input('kontakperson'),
                    details_content_4: request.input('telepon'),
                    details_content_5: request.input('fax'),
                    details_content_6: alamat1,
                    details_content_7: alamat2,
                    details_content_8: alamat3,
                    details_flag: 1,
                    details_status: 1,
                    created_by: 'Vendor',
                    status_update: 'true'
                });

                if(GroupPers){
                    return response.status(200).json({
                        message: "Berhasil simpan data",
                        status: true
                    });
                }
                else{
                    return response.status(406).json({
                        message: "Gagal simpan data",
                        status: true
                    });
                }
            }    
        } 
        catch (error) {
            console.log(error)
            return response.status(406).json(error);
        }
    }

    public async saveaddGroupPers({ request, response }: HttpContextContract) {
        try {
            const supp_code = request.input('code');
            
            let alamat1, alamat2, alamat3;
            const countAlamat = request.input('alamat').toString().length;          
            if(countAlamat <= 50){
                alamat1 = request.input('alamat').substr(0,50);
                alamat2 = ''; 
                alamat3 = '';
            } else if(countAlamat <= 50){
                alamat1 = request.input('alamat').substr(0,50);
                alamat2 = request.input('alamat').substr(51,100);
                alamat3 = '';
            } else {
                alamat1 = request.input('alamat').substr(0,50);
                alamat2 = request.input('alamat').substr(51,100); 
                alamat3 = request.input('alamat').substr(101,150);
            }

            // cek urutan terakhir
            let prioritas = 0;
            const Qprioritas = await SupplierPathDet
                            .query()
                            .where('sup_code_app', supp_code)
                            .where('details_column', 15)
                            .where('details_column_prioritas', 15)
                            .orderBy('details_content_prioritas', 'desc')
                            .first();   
                            
            if(Qprioritas){ prioritas = Qprioritas.details_content_prioritas + 1 } else { prioritas = 1 }

            // insert Group / Anak Perusahaan
            const GroupPers = await SupplierPathDet.create({
                sup_code_app: supp_code,
                details_column: 15,
                details_column_desc: 'Group/Anak Perusahaan',
                details_column_prioritas: 15,
                details_content_prioritas: prioritas,
                details_content_1: await ucWords(request.input('nama')),
                details_content_2: request.input('sektorbisnis'),
                details_content_3: request.input('kontakperson'),
                details_content_4: request.input('telepon'),
                details_content_5: request.input('fax'),
                details_content_6: alamat1,
				details_content_7: alamat2,
				details_content_8: alamat3,
                details_flag: 1,
                details_status: 1,
                created_by: 'Vendor'
            });

            if(GroupPers){
                return response.status(200).json({
                    message: "Berhasil simpan data",
                    status: true
                });
            }
            else{
                return response.status(406).json({
                    message: "Gagal simpan data",
                    status: true
                });
            }
        } 
        catch (error) {
            console.log(error)
            return response.status(406).json(error);
        }
    }

    public async saveupdateGroupPers({ params, request, response }: HttpContextContract) {
        const GroupPers = await SupplierPathDet.findOrFail(params.id);

        let alamat1, alamat2, alamat3;
        const countAlamat = request.input('alamat').toString().length;          
        if(countAlamat <= 50){
            alamat1 = request.input('alamat').substr(0,50);
            alamat2 = ''; 
            alamat3 = '';
        } else if(countAlamat <= 50){
            alamat1 = request.input('alamat').substr(0,50);
            alamat2 = request.input('alamat').substr(51,100);
            alamat3 = '';
        } else {
            alamat1 = request.input('alamat').substr(0,50);
            alamat2 = request.input('alamat').substr(51,100); 
            alamat3 = request.input('alamat').substr(101,150);
        }
    
        GroupPers.details_content_1 = await ucWords(request.input('nama'));
        GroupPers.details_content_2 = request.input('sektorbisnis');
        GroupPers.details_content_3 = request.input('kontakperson');
        GroupPers.details_content_4 = request.input('telepon');
        GroupPers.details_content_5 = request.input('fax');
        GroupPers.details_content_6 = alamat1;
		GroupPers.details_content_7 = alamat2;
		GroupPers.details_content_8 = alamat3;
        GroupPers.modified_by = 'Vendor';
        GroupPers.modified_date = datetimeNow;
        GroupPers.save();
    
        return response.status(202).send(GroupPers);
    }    

    public async delGroupPers({ params, response }: HttpContextContract) {
        const GroupPers = await SupplierPathDet
                            .query()
                            .where('sup_dtl_id', params.id)
                            .delete();

        return response.send(GroupPers);
    }

    public async getNamaPejabat({ request }: HttpContextContract) {
        if (request.input('rowsPerPage') == null) {
            const res = await SupplierPathDet.query().where('sup_code_app', request.input('code')).where('details_column', 15).where('details_column_prioritas', 16);
            return res;            
        }
        else {
            var page = request.input('page');
            var sort = request.input('sortBy')
            var descend = request.input('descending')
            if(descend == 'false'){
                descend = 'desc';
            }else{
                descend = 'asc';
            }
            const res = await SupplierPathDet
                        .query()
                        .where('sup_code_app', request.input('code'))
                        .where('details_column', 16)
                        .where('details_column_prioritas', 16)
                        .where((query) => {
                            if (request.input('filter') != null)
                            {
                              query.where('details_content_1', 'like', `%${request.input('filter')}%`)
                                    .orWhere('details_content_2', 'like', `%${request.input('filter')}%`)                                        
                                    .orWhere('details_content_3', 'like', `%${request.input('filter')}%`)
                                    .orWhere('details_content_4', 'like', `%${request.input('filter')}%`)
                                    .orWhere('details_content_5', 'like', `%${request.input('filter')}%`)
                                    .orWhere('details_content_6', 'like', `%${request.input('filter')}%`);                                          
                            }                    
                        })    
                        .orderBy(sort,descend)            
                        .paginate(page, request.input('rowsPerPage'));  

            return res;  
        }
    }

    public async getDataNamaPejabat({ request, response }: HttpContextContract) {
        const enkrip = Buffer.from(request.input('enkrip'), 'base64').toString('ascii');
        const code = request.input('code');

        const data = await RegisVendor
                    .query()
                    .where('regis_code_app', code).first(); 

        return response.json(data);
    }
	
	public async saveaddNamaPejabatUpd({ request, response }: HttpContextContract) {
        try {
            const cekdata = await SupplierPath
                            .query()
                            .where('sup_npwp', request.input('npwp'))
                            .first();
            if(cekdata){
                const supp_code = cekdata.sup_code_app;
                let prioritas = 0;

                // cek urutan terakhir
                const Qprioritas = await SupplierPathDet
                                .query()
                                .where('sup_code_app', supp_code)
                                .where('details_column', 16)
                                .where('details_column_prioritas', 16)
                                .orderBy('details_content_prioritas', 'desc')
                                .first();   
                                
                if(Qprioritas){ prioritas = Qprioritas.details_content_prioritas + 1 } else { prioritas = 1 }

                // insert Nama Pejabat / Kuasa Penandatanganan Faktur Pajak
                const NamaPejabat = await SupplierPathDet.create({
                    sup_code_app: supp_code,
                    details_column: 16,
                    details_column_desc: 'Kuasa Penandatangan Faktur Pajak',
                    details_column_prioritas: 16,
                    details_content_prioritas: prioritas,
                    details_content_1: await ucWords(request.input('nama')),
                    details_content_2: request.input('npwppejabat'),
                    details_content_3: request.input('jabatan'),
                    details_content_4: request.input('tglberlaku'),
                    details_content_5: request.input('lokasikerja'),
                    details_content_6: request.input('catatan'),
                    details_flag: 1,
                    details_status: 1,
                    created_by: 'Vendor',
                    status_update: 'true'
                });

                if(NamaPejabat){
                    return response.status(200).json({
                        message: "Berhasil simpan data",
                        status: true
                    });
                }
                else{
                    return response.status(406).json({
                        message: "Gagal simpan data",
                        status: true
                    });
                }
            }    
        } 
        catch (error) {
            console.log(error)
            return response.status(406).json(error);
        }
    }

    public async saveaddNamaPejabat({ request, response }: HttpContextContract) {
        try {
            let prioritas = 0;

            // cek urutan terakhir
            const Qprioritas = await SupplierPathDet
                            .query()
                            .where('sup_code_app', request.input('code'))
                            .where('details_column', 16)
                            .where('details_column_prioritas', 16)
                            .orderBy('details_content_prioritas', 'desc')
                            .first();   
                            
            if(Qprioritas){ prioritas = Qprioritas.details_content_prioritas + 1 } else { prioritas = 1 }

            // insert Nama Pejabat / Kuasa Penandatanganan Faktur Pajak
            const NamaPejabat = await SupplierPathDet.create({
                sup_code_app: request.input('code'),
                details_column: 16,
                details_column_desc: 'Kuasa Penandatangan Faktur Pajak',
                details_column_prioritas: 16,
                details_content_prioritas: prioritas,
                details_content_1: await ucWords(request.input('nama')),
                details_content_2: request.input('npwppejabat'),
                details_content_3: request.input('jabatan'),
                details_content_4: request.input('tglberlaku'),
                details_content_5: request.input('lokasikerja'),
                details_content_6: request.input('catatan'),
                details_flag: 1,
                details_status: 1,
                created_by: 'Vendor'
            });

            if(NamaPejabat){
                return response.status(200).json({
                    message: "Berhasil simpan data",
                    status: true
                });
            }
            else{
                return response.status(406).json({
                    message: "Gagal simpan data",
                    status: true
                });
            }
        } 
        catch (error) {
            console.log(error)
            return response.status(406).json(error);
        }
    }

    public async saveupdateNamaPejabat({ params, request, response }: HttpContextContract) {
        const NamaPejabat = await SupplierPathDet.findOrFail(params.id);
    
        NamaPejabat.details_content_1 = request.input('nama');
        NamaPejabat.details_content_2 = request.input('npwppejabat');
        NamaPejabat.details_content_3 = request.input('jabatan');
        NamaPejabat.details_content_4 = request.input('tglberlaku');
        NamaPejabat.details_content_5 = request.input('lokasikerja');
        NamaPejabat.details_content_6 = request.input('catatan');
        NamaPejabat.modified_by = 'Vendor';
        NamaPejabat.modified_date = datetimeNow;
        NamaPejabat.save();
    
        return response.status(202).send(NamaPejabat);
    }    

    public async delNamaPejabat({ params, response }: HttpContextContract) {
        const NamaPejabat = await SupplierPathDet
                            .query()
                            .where('sup_dtl_id', params.id)
                            .delete();

        return response.send(NamaPejabat);
    }

    public async savefileNamaPejabat({ request, response }: HttpContextContract) {
        const supp_code = request.input('code');
        const last_prefix = dayjs().format('YYMMDD_HHmmss');

        // Open FTP
        const client = new ftp.Client();
        client.ftp.verbose = true; 
        try {           
            await client.access({
                host: Env.get('FTP_HOST'),
                user: Env.get('FTP_USERNAME'),
                password: Env.get('FTP_PASSWORD'),
                port: Env.get('FTP_PORT'),
            });
        }
        catch(err) {
            console.log(err)
        }

        // cek upload file
        const file = request.file('file');
        let nmfile = "";
        let nmfile_db = "";
        let nmfile_upl = "";
        if(file) {       
            nmfile = file.clientName;
            nmfile_db = supp_code + "_16_" + last_prefix;
            nmfile_upl = nmfile_db + ".pdf";
            
            // upload lokal
            await file.move(Application.publicPath('file'), { name: nmfile_upl });
            
            // upload FTP
            await client.uploadFrom(Application.publicPath(`file/${nmfile_upl}`), `/${Env.get('FTP_PATH')}/${nmfile_upl}`); 

            // cek data di FTP sesuai nama file
            // kalau ketemua baru insert, kalau enggak brarti gagal

            // insert data upload
            const insFile = await SupplierPathUpload.create({
                sup_code_app: supp_code,
                details_column: 16,
                details_upload_app: nmfile_db,
                details_upload: nmfile,
                created_by: 'Vendor'
            });

            if(insFile){
                return response.status(200).json({
                    message: "Berhasil upload file",
                    status: true
                });
            }
            else{
                return response.status(406).json({
                    message: "Gagal upload data",
                    status: true
                });
            }            
        }    
        
        // Close FTP
        client.close();        
    }

    public async getfileNamaPejabat({ request }: HttpContextContract) {
        const res = await SupplierPathUpload.query().where('sup_code_app', request.input('code')).where('details_column', 16);
        return res;            
    }

    public async delfileNamaPejabat({ params, response }: HttpContextContract) {
        // cek data
        const cekData = await SupplierPathUpload.query().where('upload_id', params.id).first();

        if(cekData){
            // Open FTP
            const client = new ftp.Client();
            client.ftp.verbose = true; 
            try {           
                await client.access({
                    host: Env.get('FTP_HOST'),
                    user: Env.get('FTP_USERNAME'),
                    password: Env.get('FTP_PASSWORD'),
                    port: Env.get('FTP_PORT'),
                });
            }
            catch(err) {
                console.log(err)
            }

            // delete data file di FTP & update data lama
            await client.remove(`/${Env.get('FTP_PATH')}/${cekData.details_upload_app}.pdf`);
        
            // Close FTP
            client.close();    

            const delFile = await SupplierPathUpload
                            .query()
                            .where('upload_id', params.id)
                            .delete();

            return response.send(delFile);
        }
        else{
            return response.status(406).json({
                message: "Invalid data",
                status: true,
            });  
        }
    }

    public async saveQualityEnvironment({ request, response }: HttpContextContract) {
        try {
            const supp_code = request.input('code');

            const cek_supp = await SupplierPathDet.query().where('sup_code_app', supp_code).where('details_column', 17).first();
            if(!cek_supp){           
                // insert Quality and Environment
                const QualityEnv = await SupplierPathDet.create({
                    sup_code_app: supp_code,
                    details_column: 17,
                    details_column_desc: 'Quality and Environment',
                    details_column_prioritas: 17,
                    details_content_prioritas: 1,
                    details_content_1: request.input('status_1')+';'+request.input('versi_1'),
                    details_content_2: request.input('status_2')+';'+request.input('versi_2'),
                    details_content_3: request.input('status_3')+';'+request.input('versi_3'),
                    details_content_4: request.input('status_4'),
                    details_content_5: request.input('status_5'),
                    details_flag: 1,
                    details_status: 1,
                    created_by: 'Vendor'
                });

                if(QualityEnv){
                    return response.status(200).json({
                        message: "Berhasil simpan data",
                        status: true
                    });
                }
                else{
                    return response.status(406).json({
                        message: "Gagal simpan data",
                        status: true
                    });
                }
            }
            else{
                // update Quality and Environment
                const QualityEnv = await SupplierPathDet
                                .query()
                                .where('sup_code_app', supp_code)
                                .where('details_column', 17)
                                .where('details_content_prioritas', 1)
                                .update({ 
                                    details_content_1: request.input('status_1')+';'+request.input('versi_1'),
                                    details_content_2: request.input('status_2')+';'+request.input('versi_2'),
                                    details_content_3: request.input('status_3')+';'+request.input('versi_3'),
                                    details_content_4: request.input('status_4'),
                                    details_content_5: request.input('status_5')
                                });   

                if(QualityEnv){
                    return response.status(200).json({
                        message: "Berhasil update data",
                        status: true
                    });
                }
                else{
                    return response.status(406).json({
                        message: "Gagal update data",
                        status: true
                    });
                }
            }
        } 
        catch (error) {
            console.log(error)
            return response.status(406).json(error);
        }
    }
	
	public async saveQualityEnvUpd({ request, response }: HttpContextContract) {
        try {
            // cek data
            const cekdata = await SupplierPath
            .query()
            .where('sup_npwp', request.input('npwp'))
            .first();

            if(cekdata){
            const supp_code = cekdata.sup_code_app;
                const cek_supp = await SupplierPathDet.query().where('sup_code_app', supp_code).where('details_column', 17).where('status_update', 'true').where('active', 'true').first();
                if(!cek_supp){           
                    // insert Quality and Environment
                    const QualityEnv = await SupplierPathDet.create({
                        sup_code_app: supp_code,
                        details_column: 17,
                        details_column_desc: 'Quality and Environment',
                        details_column_prioritas: 17,
                        details_content_prioritas: 1,
                        details_content_1: request.input('status_1')+';'+request.input('versi_1'),
                        details_content_2: request.input('status_2')+';'+request.input('versi_2'),
                        details_content_3: request.input('status_3')+';'+request.input('versi_3'),
                        details_content_4: request.input('status_4'),
                        details_content_5: request.input('status_5'),
                        details_flag: 1,
                        details_status: 1,
                        created_by: 'Vendor',
                        status_update: 'true'
                    });

                    if(QualityEnv){
                        return response.status(200).json({
                            message: "Berhasil simpan data",
                            status: true
                        });
                    }
                    else{
                        return response.status(406).json({
                            message: "Gagal simpan data",
                            status: true
                        });
                    }
                }
                else{
                    // update Quality and Environment
                    const QualityEnv = await SupplierPathDet
                                    .query()
                                    .where('sup_code_app', supp_code)
                                    .where('details_column', 17)
                                    .where('status_update', 'true')
                                    .where('active', 'true')
                                    .update({ 
                                        details_content_1: request.input('status_1')+';'+request.input('versi_1'),
                                        details_content_2: request.input('status_2')+';'+request.input('versi_2'),
                                        details_content_3: request.input('status_3')+';'+request.input('versi_3'),
                                        details_content_4: request.input('status_4'),
                                        details_content_5: request.input('status_5'),
                                        modified_by: 'Vendor',
                                        modified_date: datetimeNow,
                                    });   

                    if(QualityEnv){
                        return response.status(200).json({
                            message: "Berhasil update data",
                            status: true
                        });
                    }
                    else{
                        return response.status(406).json({
                            message: "Gagal update data",
                            status: true
                        });
                    }
                }
            }    
        } 
        catch (error) {
            console.log(error)
            return response.status(406).json(error);
        }
    }

    public async sendChangeDataEreg({ request, response }: HttpContextContract) {
        try {
            const sender = await senderMail();
            const mailConfig = Config.get('mail');

            mailConfig.mailers.smtp.host = sender[0].ms_host;
            mailConfig.mailers.smtp.auth.user = sender[0].ms_name;
            mailConfig.mailers.smtp.auth.pass = sender[0].ms_pass;

            // cek data m_supp-path
            const cekSupPath = await SupplierPath
            .query()
            .where('sup_npwp', request.input('npwp'))
            .orderBy('created_date', 'desc')
            .first();

            if (cekSupPath) {
                const supp_code = cekSupPath.sup_code_app;
                
                // cek data m_supp_path_upd
                const cekSupPathUpd = await SupplierPathUpd
                .query()
                .where('sup_code_app', supp_code)
                .orderBy('created_date', 'desc')
                .first();

                if (cekSupPathUpd) {
                    // cek data m_supp_path_upd Flag 1
                    const cekSupPathUpdFlag = await SupplierPathUpd
                    .query()
                    .where('sup_code_app', supp_code)
                    .where('sup_flag', 1)
                    .orderBy('created_date', 'desc')
                    .first();

                    if (cekSupPathUpdFlag) {
                        // Update Data
                        const updSupPath = await SupplierPathUpd
                                    .query()
                                    .where('sup_code_app', supp_code)
                                    .update({ 
                                        sup_flag: 2,
                                        close_regis_date: datetimeNow,
                                        approval_level: 1,
                                        sup_status_prog: 0
                                    });  
                                
                        if(updSupPath){
                            // update m_supp_dtl_path
                            const SupDtlPath = await SupplierPathDet
                            .query()
                            .where('sup_code_app', supp_code)
                            .where('status_update', 'true')
                            .update({
                                status_update: 'false',
                                modified_by: 'Vendor',
                                modified_date: datetimeNow,
                            });

                            if(SupDtlPath){
                                const regisVend: any = await RegisVendor
                                                                .query()
                                                                .where('regis_code_app', supp_code)
                                                                .first();

                                // Send Mail
                                // Next Approver
                                const nextApp = await Database.connection('mssql_procsys').from('m_approval').where('approval_level', 1).where('bu_id', regisVend.bu_id).where('status', 1).first();
                                const detNextApp = await Database.from('user').where('empid', nextApp.log_id).first();

                                await Mail.sendLater((message) => {
                                    let email = message.from('system@dbc.co.id');
									email = email.to(detNextApp.email);
                                    // email = email.bcc('faris@dbc.co.id', 'Faris');
                                    email = email.bcc('zulvikar.wibowo@dbc.co.id', 'Zulvikar Aji Wibowo');
                                    email = email.bcc('robi.pramesti@dbc.co.id', 'Robi Dewi Asih Pramesti');
									// email = email.bcc('fauzi.susanto@dbc.co.id', 'Fauzi Dwi Susanto');									                                    
				
                                    email = email.subject('Update Data Vendor Successfully')
                                                .htmlView('emails/send_change_vendor', { 
                                                    nmCompany: cekSupPathUpdFlag.sup_name,
                                                    supCat: cekSupPath.sup_cat
                                                });
                                });

                                return response.status(200).json({
                                    message: "Berhasil kirim perubahan data",
                                    status: true
                                });
                            }
                            else{
                                return response.status(406).json({
                                    message: "Gagal update data m_supp_dtl_path",
                                    status: true
                                });
                            }
                        }
                    } else {
                        // cek data m_supp-path
                        const cekSupPathDet = await SupplierPathDet
                        .query()
                        .where('sup_code_app', supp_code)
                        .where('status_update', 'true')
                        .first();

                        if (!cekSupPathDet) {
                            return response.status(406).json({
                                message: "data tidak ditemukan pada table m_supp_dtl_path",
                                status: true
                            });
                        }   
                    }
                } else {
                    // cek data m_supp-path
                    const cekSupPathDet = await SupplierPathDet
                    .query()
                    .where('sup_code_app', supp_code)
                    .where('status_update', 'true')
                    .first();

                    if (cekSupPathDet) {
                        // Insert Data Supplier Path Upd
                        const InsSupplierPathUpd = await SupplierPathUpd.create({
                            sup_code_app: cekSupPath.sup_code_app,
                            sup_npwp: cekSupPath.sup_npwp,
                            sup_name: cekSupPath.sup_name,
                            sup_cat: cekSupPath.sup_cat,
                            sup_type: cekSupPath.sup_type,
                            sup_email: cekSupPath.sup_email,
                            sup_website: cekSupPath.sup_website,
                            sup_date_regis: dayjs(cekSupPath.sup_date_regis).format("YYYY-MM-DD HH:mm"),
                            sup_form_company: cekSupPath.sup_form_company,
                            sup_type_company: cekSupPath.sup_type_company,
                            sup_office_address: cekSupPath.sup_office_address.replace(/\s\s+/, ' '),
                            sup_office_phone: cekSupPath.sup_office_phone,
                            sup_office_fax: cekSupPath.sup_office_fax,
                            sup_warehouse_address: cekSupPath.sup_warehouse_address.replace(/\s\s+/, ' '),
                            sup_warehouse_phone: cekSupPath.sup_warehouse_phone,
                            sup_warehouse_fax: cekSupPath.sup_warehouse_fax,
                            sup_flag: 2,
                            sup_status_prog: 0,
                            sup_status: 1,
                            uuid: cekSupPath.uuid,
                            created_by: 'vendor',
                            created_date: datetimeNow,
                            close_regis_date: datetimeNow,
                            approval_level: 1
                        }); 

                        if(InsSupplierPathUpd){
                            // update m_supp_dtl_path
                            const SupPathDtl = await SupplierPathDet
                            .query()
                            .where('sup_code_app', supp_code)
                            .where('status_update', 'true')
                            .update({
                                status_update: 'false',
                                modified_by: 'Vendor',
                                modified_date: datetimeNow,
                            });

                            if(SupPathDtl){
                                const regisVend: any = await RegisVendor
                                                                .query()
                                                                .where('regis_code_app', supp_code)
                                                                .first();

                                // Send Mail
                                // Next Approver
                                const nextApp = await Database.connection('mssql_procsys').from('m_approval').where('approval_level', 1).where('bu_id', regisVend.bu_id).where('status', 1).first();
                                const detNextApp = await Database.from('user').where('empid', nextApp.log_id).first();

                                await Mail.sendLater((message) => {
                                    let email = message.from('system@dbc.co.id');
									email = email.to(detNextApp.email);
                                    // email = email.bcc('faris@dbc.co.id', 'Faris');
                                    email = email.bcc('zulvikar.wibowo@dbc.co.id', 'Zulvikar Aji Wibowo');
                                    email = email.bcc('robi.pramesti@dbc.co.id', 'Robi Dewi Asih Pramesti');
									// email = email.bcc('fauzi.susanto@dbc.co.id', 'Fauzi Dwi Susanto');
                                    
                                    email = email.subject('Update Data Vendor Successfully')
                                                .htmlView('emails/send_change_vendor', { 
                                                    nmCompany: cekSupPath.sup_name,
                                                    supCat: cekSupPath.sup_cat
                                                });
                                });

                                return response.status(200).json({
                                    message: "Berhasil kirim perubahan data",
                                    status: true
                                });
                            }
                            else{
                                return response.status(406).json({
                                    message: "Gagal update data m_supp_dtl_path",
                                    status: true
                                });
                            }
                        }
                        else{
                            return response.status(406).json({
                                message: "Gagal Insert data table SupplierPathUpd",
                                status: true
                            });
                        }
                    } else {
                        return response.status(406).json({
                            message: "data tidak ditemukan pada table m_supp_dtl_path",
                            status: true
                        });
                    }
                }
            }    
        } 
        catch (error) {
            console.log(error)
            return response.status(406).json(error);
        }
    }

    public async getQualityEnvironment({ params }: HttpContextContract) {
        const supp_code = params.code;
        const column = params.column;

        const cek_supp = await SupplierPathDet.query().where('sup_code_app', supp_code).where('details_column', column).first();
        
        if(cek_supp){
            var str1 = cek_supp.details_content_1.split(';');
            var str2 = cek_supp.details_content_2.split(';');
            var str3 = cek_supp.details_content_3.split(';');
            var str4 = cek_supp.details_content_4.split(';');
            var str5 = cek_supp.details_content_5.split(';');

            return { 
                data1: str1,
                data2: str2,
                data3: str3,
                data4: str4,
                data5: str5
            };
        }
    }

    public async savefileQualityEnvironment({ request, response }: HttpContextContract) {
        const supp_code = request.input('code');
        const last_prefix = dayjs().format('YYMMDD_HHmmss');

        // Open FTP
        const client = new ftp.Client();
        client.ftp.verbose = true; 
        try {           
            await client.access({
                host: Env.get('FTP_HOST'),
                user: Env.get('FTP_USERNAME'),
                password: Env.get('FTP_PASSWORD'),
                port: Env.get('FTP_PORT'),
            });
        }
        catch(err) {
            console.log(err)
        }

        // cek upload file
        const file = request.file('file');
        let nmfile = "";
        let nmfile_db = "";
        let nmfile_upl = "";
        if(file) {       
            nmfile = file.clientName;
            nmfile_db = supp_code + "_17_" + last_prefix;
            nmfile_upl = nmfile_db + ".pdf";
            
            // upload lokal
            await file.move(Application.publicPath('file'), { name: nmfile_upl });
            
            // upload FTP
            await client.uploadFrom(Application.publicPath(`file/${nmfile_upl}`), `/${Env.get('FTP_PATH')}/${nmfile_upl}`); 

            // cek data di FTP sesuai nama file
            // kalau ketemua baru insert, kalau enggak brarti gagal

            // insert data upload
            const insFile = await SupplierPathUpload.create({
                sup_code_app: supp_code,
                details_column: 17,
                details_upload_app: nmfile_db,
                details_upload: nmfile,
                created_by: 'Vendor'
            });

            if(insFile){
                return response.status(200).json({
                    message: "Berhasil upload file",
                    status: true
                });
            }
            else{
                return response.status(406).json({
                    message: "Gagal upload data",
                    status: true
                });
            }            
        }    
        
        // Close FTP
        client.close();        
    }

    public async getfileQualityEnvironment({ request }: HttpContextContract) {
        const res = await SupplierPathUpload.query().where('sup_code_app', request.input('code')).where('details_column', 17);
        return res;            
    }

    public async delfileQualityEnvironment({ params, response }: HttpContextContract) {
        // cek data
        const cekData = await SupplierPathUpload.query().where('upload_id', params.id).first();

        if(cekData){
            // Open FTP
            const client = new ftp.Client();
            client.ftp.verbose = true; 
            try {           
                await client.access({
                    host: Env.get('FTP_HOST'),
                    user: Env.get('FTP_USERNAME'),
                    password: Env.get('FTP_PASSWORD'),
                    port: Env.get('FTP_PORT'),
                });
            }
            catch(err) {
                console.log(err)
            }

            // delete data file di FTP & update data lama
            await client.remove(`/${Env.get('FTP_PATH')}/${cekData.details_upload_app}.pdf`);
        
            // Close FTP
            client.close();    

            const delFile = await SupplierPathUpload
                            .query()
                            .where('upload_id', params.id)
                            .delete();

            return response.send(delFile);
        }
        else{
            return response.status(406).json({
                message: "Invalid data",
                status: true,
            });  
        }
    }
        
    public async getScopeKerja({ request }: HttpContextContract) {
        const res = await SupplierPathDet.query().where('sup_code_app', request.input('code')).where('details_column', 23).where('details_column_prioritas', 23).where('active','true').first();
        if (res) {
            return res.details_content_1;
        } else {
            return "";   
        }
        
    }
        
    public async getCompanyProfile({ request }: HttpContextContract) {
        if (request.input('rowsPerPage') == null) {
            const res = await SupplierPathUpload.query().where('sup_code_app', request.input('code')).where('details_column', 22);
            return res;            
        }
        else {
            var page = request.input('page');
            var sort = request.input('sortBy')
            var descend = request.input('descending')
            if(descend == 'false'){
                descend = 'desc';
            }else{
                descend = 'asc';
            }
            const res = await SupplierPathUpload
                        .query()
                        .where('sup_code_app', request.input('code'))  
                        .where('details_column', 22)
                        .where((query) => {
                            if (request.input('filter') != null)
                            {
                              query.where('details_upload_app', 'like', `%${request.input('filter')}%`)
                                    .orWhere('details_upload', 'like', `%${request.input('filter')}%`);                                          
                            }                    
                        })    
                        .orderBy(sort,descend)            
                        .paginate(page, request.input('rowsPerPage'));  

            return res;  
        }
    }
        
    public async getPaktaIntegritas({ request }: HttpContextContract) {
        if (request.input('rowsPerPage') == null) {
            const res = await SupplierPathUpload.query().where('sup_code_app', request.input('code')).where('details_column', 20);
            return res;            
        }
        else {
            var page = request.input('page');
            var sort = request.input('sortBy')
            var descend = request.input('descending')
            if(descend == 'false'){
                descend = 'desc';
            }else{
                descend = 'asc';
            }
            const res = await SupplierPathUpload
                        .query()
                        .where('sup_code_app', request.input('code'))  
                        .where('details_column', 20)
                        .where((query) => {
                            if (request.input('filter') != null)
                            {
                              query.where('details_upload_app', 'like', `%${request.input('filter')}%`)
                                    .orWhere('details_upload', 'like', `%${request.input('filter')}%`);                                          
                            }                    
                        })    
                        .orderBy(sort,descend)            
                        .paginate(page, request.input('rowsPerPage'));  

            return res;  
        }
    }

    public async saveScopeKerja({ request, response }: HttpContextContract) {
        const cek_supp = await SupplierPathDet.query().where('sup_code_app', request.input('code')).where('details_column', 23).where('details_column_prioritas', 23).first();

        if(!cek_supp){
            // insert Pakta Integritas
            const scopeKerja = await SupplierPathDet.create({
                sup_code_app: request.input('code'),
                details_column: 23,
                details_column_desc: 'Scope Pekerjaan',
                details_column_prioritas: 23,
                details_content_prioritas: 1,
                details_content_1: request.input('scope'),
                details_flag: 1,
                details_status: 1,
                created_by: 'Vendor'
            });
            
            return response.status(200).json({
                message: "Berhasil insert data",
                status: true
            });
        } else {
            const scopeKerjaUpd = await SupplierPathDet
                                .query()
                                .where('sup_code_app', request.input('code'))
                                .where('details_column', 23)
                                .where('details_column_prioritas', 23)
                                .update({
                                    details_content_1: request.input('scope'),
                                });  
                                
            // return response.status(202).send(scopeKerjaUpd);
            return response.status(202).json({
                message: "Berhasil update data",
                status: true
            });
        }    
    }

    public async saveScopeKerjaUpd({ request, response }: HttpContextContract) {
        // cek data
        const cekdata = await SupplierPath
                        .query()
                        .where('sup_npwp', request.input('npwp'))
                        .first();
        if(cekdata){
            const cek_supp = await SupplierPathDet.query().where('sup_code_app', cekdata.sup_code_app).where('details_column', 23).where('details_column_prioritas', 23).where('status_update', 'true').where('active', 'true').first();

            if(!cek_supp){
                // insert Pakta Integritas
                const scopeKerjaUpd = await SupplierPathDet.create({
                    sup_code_app: cekdata.sup_code_app,
                    details_column: 23,
                    details_column_desc: 'Scope Pekerjaan',
                    details_column_prioritas: 23,
                    details_content_prioritas: 1,
                    details_content_1: request.input('scope'),
                    details_flag: 1,
                    details_status: 1,
                    created_by: 'Vendor',
                    status_update: 'true'
                });
                
                return response.status(200).json({
                    message: "Berhasil insert data",
                    status: true
                });
            } else {
                const scopeKerjaUpd = await SupplierPathDet
                                    .query()
                                    .where('sup_code_app', cekdata.sup_code_app)
                                    .where('details_column', 23)
                                    .where('details_column_prioritas', 23)
                                    .where('status_update', 'true')
                                    .where('active', 'true')
                                    .update({
                                        details_content_1: request.input('scope'),
                                    });  
                                    
                // return response.status(202).send(scopeKerjaUpd);
                return response.status(202).json({
                    message: "Berhasil update data",
                    status: true
                });
            }
        }    
    }

    public async delScopeKerja({ request, response }: HttpContextContract) {
       
        // delete data supplier detail
        const scopeKerja = await SupplierPathDet
                        .query()
                        .where('sup_code_app', request.input('code'))
                        .where('details_column', 23)
                        .where('details_column_prioritas', 23)
                        .delete();
        
        return response.status(200).json({
            message: "Berhasil hapus data",
            status: true
        });
    }

    public async saveCompanyProfile({ request, response }: HttpContextContract) {
        const supp_code = request.input('code');
        const last_prefix = dayjs().format('YYMMDD_HHmmss');

        // Open FTP
        const client = new ftp.Client();
        client.ftp.verbose = true; 
        try {           
            await client.access({
                host: Env.get('FTP_HOST'),
                user: Env.get('FTP_USERNAME'),
                password: Env.get('FTP_PASSWORD'),
                port: Env.get('FTP_PORT'),
            });
        }
        catch(err) {
            console.log(err)
        }

        // cek upload file
        const file = request.file('file');
        let nmfile = "";
        let nmfile_db = "";
        let nmfile_upl = "";
        if(file) { 
            nmfile = file.clientName;
            nmfile_db = supp_code + "_22_" + last_prefix;
            nmfile_upl = nmfile_db + ".pdf";
            
            // cek urutan terakhir
            let prioritas = 0;
            const Qprioritas = await SupplierPathDet
                            .query()
                            .where('sup_code_app', supp_code)
                            .where('details_column', 22)
                            .where('details_column_prioritas', 22)
                            .orderBy('details_content_prioritas', 'desc')
                            .first();
                            
            if(Qprioritas){ prioritas = Qprioritas.details_content_prioritas + 1 } else { prioritas = 1 }
                        
            // insert Pakta Integritas
            const companyProfile = await SupplierPathDet.create({
                sup_code_app: request.input('code'),
                details_column: 22,
                details_column_desc: 'Company Profile',
                details_column_prioritas: 22,
                details_content_prioritas: prioritas,
                details_content_1: nmfile_db,
                details_flag: 1,
                details_status: 1,
                created_by: 'Vendor'
            });
            
            // upload lokal
            await file.move(Application.publicPath('file'), { name: nmfile_upl });
            
            // upload FTP
            await client.uploadFrom(Application.publicPath(`file/${nmfile_upl}`), `/${Env.get('FTP_PATH')}/${nmfile_upl}`); 

            // insert data supplier upload
            const insFile = await SupplierPathUpload.create({
                sup_code_app: supp_code,
                details_column: 22,
                details_upload_app: nmfile_db,
                details_upload: nmfile,
                created_by: 'Vendor'
            });

            if(insFile){
                return response.status(200).json({
                    message: "Berhasil upload file",
                    status: true
                });
            }
            else{
                return response.status(406).json({
                    message: "Gagal upload data",
                    status: true
                });
            }            
        }    
        
        // Close FTP
        client.close();        
    }

    public async savePaktaIntegritas({ request, response }: HttpContextContract) {
        const supp_code = request.input('code');
        const last_prefix = dayjs().format('YYMMDD_HHmmss');

        // Open FTP
        const client = new ftp.Client();
        client.ftp.verbose = true; 
        try {           
            await client.access({
                host: Env.get('FTP_HOST'),
                user: Env.get('FTP_USERNAME'),
                password: Env.get('FTP_PASSWORD'),
                port: Env.get('FTP_PORT'),
            });
        }
        catch(err) {
            console.log(err)
        }

        // cek upload file
        const file = request.file('file');
        let nmfile = "";
        let nmfile_db = "";
        let nmfile_upl = "";
        if(file) { 
            nmfile = file.clientName;
            nmfile_db = supp_code + "_20_" + last_prefix;
            nmfile_upl = nmfile_db + ".pdf";
            
            // cek urutan terakhir
            let prioritas = 0;
            const Qprioritas = await SupplierPathDet
                            .query()
                            .where('sup_code_app', supp_code)
                            .where('details_column', 20)
                            .where('details_column_prioritas', 20)
                            .orderBy('details_content_prioritas', 'desc')
                            .first();   
                            
            if(Qprioritas){ prioritas = Qprioritas.details_content_prioritas + 1 } else { prioritas = 1 }
                        
            // insert Pakta Integritas
            const PaktaIntegritas = await SupplierPathDet.create({
                sup_code_app: request.input('code'),
                details_column: 20,
                details_column_desc: 'Pakta Integritas',
                details_column_prioritas: 20,
                details_content_prioritas: prioritas,
                details_content_1: nmfile_db,
                details_flag: 1,
                details_status: 1,
                created_by: 'Vendor'
            });
            
            // upload lokal
            await file.move(Application.publicPath('file'), { name: nmfile_upl });
            
            // upload FTP
            await client.uploadFrom(Application.publicPath(`file/${nmfile_upl}`), `/${Env.get('FTP_PATH')}/${nmfile_upl}`); 

            // insert data supplier upload
            const insFile = await SupplierPathUpload.create({
                sup_code_app: supp_code,
                details_column: 20,
                details_upload_app: nmfile_db,
                details_upload: nmfile,
                created_by: 'Vendor'
            });

            if(insFile){
                return response.status(200).json({
                    message: "Berhasil upload file",
                    status: true
                });
            }
            else{
                return response.status(406).json({
                    message: "Gagal upload data",
                    status: true
                });
            }            
        }    
        
        // Close FTP
        client.close();        
    }

    public async delCompanyProfile({ params, response }: HttpContextContract) {
        // cek data upload
        const cekData = await SupplierPathUpload.query().where('upload_id', params.id).first();

        if(cekData){
            // Open FTP
            const client = new ftp.Client();
            client.ftp.verbose = true; 
            try {           
                await client.access({
                    host: Env.get('FTP_HOST'),
                    user: Env.get('FTP_USERNAME'),
                    password: Env.get('FTP_PASSWORD'),
                    port: Env.get('FTP_PORT'),
                });
            }
            catch(err) {
                console.log(err)
            }

            // delete data file di FTP & update data lama
            await client.remove(`/${Env.get('FTP_PATH')}/${cekData.details_upload_app}.pdf`);
        
            // Close FTP
            client.close();    

            // delete data supplier detail
            const companyProfileDet = await SupplierPathDet
                            .query()
                            .where('sup_code_app', cekData.sup_code_app)
                            .where('details_column', cekData.details_column)
                            .where('details_content_1', cekData.details_upload_app)
                            .delete();

            // delete data supplier upload
            const companyProfileUpl = await SupplierPathUpload
                                .query()
                                .where('upload_id', params.id)
                                .delete();

            return response.send(companyProfileUpl);
        }
        else{
            return response.status(406).json({
                message: "Invalid data",
                status: true,
            });  
        }
    }

    public async delPaktaIntegritas({ params, response }: HttpContextContract) {
        // cek data upload
        const cekData = await SupplierPathUpload.query().where('upload_id', params.id).first();

        if(cekData){
            // Open FTP
            const client = new ftp.Client();
            client.ftp.verbose = true; 
            try {           
                await client.access({
                    host: Env.get('FTP_HOST'),
                    user: Env.get('FTP_USERNAME'),
                    password: Env.get('FTP_PASSWORD'),
                    port: Env.get('FTP_PORT'),
                });
            }
            catch(err) {
                console.log(err)
            }

            // delete data file di FTP & update data lama
            await client.remove(`/${Env.get('FTP_PATH')}/${cekData.details_upload_app}.pdf`);
        
            // Close FTP
            client.close();    

            // delete data supplier detail
            const PaktaIntegritasDet = await SupplierPathDet
                            .query()
                            .where('sup_code_app', cekData.sup_code_app)
                            .where('details_column', cekData.details_column)
                            .where('details_content_1', cekData.details_upload_app)
                            .delete();

            // delete data supplier upload
            const PaktaIntegritasUpl = await SupplierPathUpload
                                .query()
                                .where('upload_id', params.id)
                                .delete();

            return response.send(PaktaIntegritasUpl);
        }
        else{
            return response.status(406).json({
                message: "Invalid data",
                status: true,
            });  
        }
    }

    public async getPengalamanPerusahaan({ request }: HttpContextContract) {
        if (request.input('rowsPerPage') == null) {
            const res = await SupplierPathDet.query().where('sup_code_app', request.input('code')).where('details_column', 18).where('details_column_prioritas', 18);
            return res;            
        }
        else {
            var page = request.input('page');
            var sort = request.input('sortBy')
            var descend = request.input('descending')
            if(descend == 'false'){
                descend = 'desc';
            }else{
                descend = 'asc';
            }
            const res = await SupplierPathDet
                        .query()
                        .where('sup_code_app', request.input('code'))
                        .where('details_column', 18)
                        .where('details_column_prioritas', 18)
                        .where((query) => {
                            if (request.input('filter') != null)
                            {
                              query.where('details_content_1', 'like', `%${request.input('filter')}%`)
                                    .orWhere('details_content_2', 'like', `%${request.input('filter')}%`)                                        
                                    .orWhere('details_content_3', 'like', `%${request.input('filter')}%`)
                                    .orWhere('details_content_4', 'like', `%${request.input('filter')}%`);                                          
                            }                    
                        })    
                        .orderBy(sort,descend)            
                        .paginate(page, request.input('rowsPerPage'));  

            return res;  
        }
    }

    public async getDataPengalamanPerusahaan({ request, response }: HttpContextContract) {
        const enkrip = Buffer.from(request.input('enkrip'), 'base64').toString('ascii');
        const code = request.input('code');

        const data = await RegisVendor
                    .query()
                    .where('regis_code_app', code).first(); 

        return response.json(data);
    }
	
	public async savePengPerUpd({ request, response }: HttpContextContract) {
        try {
            const cekdata = await SupplierPath
                            .query()
                            .where('sup_npwp', request.input('npwp'))
                            .first();
            if(cekdata){
                const supp_code = cekdata.sup_code_app;
                let prioritas = 0;

                // cek urutan terakhir
                const Qprioritas = await SupplierPathDet
                                .query()
                                .where('sup_code_app', supp_code)
                                .where('details_column', 18)
                                .where('details_column_prioritas', 18)
                                .orderBy('details_content_prioritas', 'desc')
                                .first();   
                                
                if(Qprioritas){ prioritas = Qprioritas.details_content_prioritas + 1 } else { prioritas = 1 }

                // insert Nama Pejabat / Kuasa Penandatanganan Faktur Pajak
                const NamaPejabat = await SupplierPathDet.create({
                    sup_code_app: supp_code,
                    details_column: 18,
                    details_column_desc: 'Pengalaman Perusahaan',
                    details_column_prioritas: 18,
                    details_content_prioritas: prioritas,
                    details_content_1: await ucWords(request.input('ketpekerjaan')),
                    details_content_2: request.input('lokasi'),
                    details_content_3: await ucWords(request.input('namapelanggan')),
                    details_content_4: request.input('nilaikontrak'),
                    details_flag: 1,
                    details_status: 1,
                    created_by: 'Vendor',
                    status_update: 'true'
                });

                if(NamaPejabat){
                    return response.status(200).json({
                        message: "Berhasil simpan data",
                        status: true
                    });
                }
                else{
                    return response.status(406).json({
                        message: "Gagal simpan data",
                        status: true
                    });
                }
            }    
        } 
        catch (error) {
            console.log(error)
            return response.status(406).json(error);
        }
    }

    public async saveaddPengalamanPerusahaan({ request, response }: HttpContextContract) {
        try {
            let prioritas = 0;

            // cek urutan terakhir
            const Qprioritas = await SupplierPathDet
                            .query()
                            .where('sup_code_app', request.input('code'))
                            .where('details_column', 18)
                            .where('details_column_prioritas', 18)
                            .orderBy('details_content_prioritas', 'desc')
                            .first();   
                            
            if(Qprioritas){ prioritas = Qprioritas.details_content_prioritas + 1 } else { prioritas = 1 }

            // insert Nama Pejabat / Kuasa Penandatanganan Faktur Pajak
            const NamaPejabat = await SupplierPathDet.create({
                sup_code_app: request.input('code'),
                details_column: 18,
                details_column_desc: 'Pengalaman Perusahaan',
                details_column_prioritas: 18,
                details_content_prioritas: prioritas,
                details_content_1: await ucWords(request.input('ketpekerjaan')),
                details_content_2: request.input('lokasi'),
                details_content_3: await ucWords(request.input('namapelanggan')),
                details_content_4: request.input('nilaikontrak'),
                details_flag: 1,
                details_status: 1,
                created_by: 'Vendor'
            });

            if(NamaPejabat){
                return response.status(200).json({
                    message: "Berhasil simpan data",
                    status: true
                });
            }
            else{
                return response.status(406).json({
                    message: "Gagal simpan data",
                    status: true
                });
            }
        } 
        catch (error) {
            console.log(error)
            return response.status(406).json(error);
        }
    }

    public async saveupdatePengalamanPerusahaan({ params, request, response }: HttpContextContract) {
        const PengalamanPers = await SupplierPathDet.findOrFail(params.id);
    
        PengalamanPers.details_content_1 = request.input('ketpekerjaan');
        PengalamanPers.details_content_2 = request.input('lokasi');
        PengalamanPers.details_content_3 = request.input('namapelanggan');
        PengalamanPers.details_content_4 = request.input('nilaikontrak');
        PengalamanPers.modified_by = 'Vendor';
        PengalamanPers.modified_date = datetimeNow;
        PengalamanPers.save();
    
        return response.status(202).send(PengalamanPers);
    }    

    public async delPengalamanPerusahaan({ params, response }: HttpContextContract) {
        const PengalamanPers = await SupplierPathDet
                            .query()
                            .where('sup_dtl_id', params.id)
                            .delete();

        return response.send(PengalamanPers);
    }

    public async savefilePengalamanPerusahaan({ request, response }: HttpContextContract) {
        const supp_code = request.input('code');
        const last_prefix = dayjs().format('YYMMDD_HHmmss');

        // Open FTP
        const client = new ftp.Client();
        client.ftp.verbose = true; 
        try {           
            await client.access({
                host: Env.get('FTP_HOST'),
                user: Env.get('FTP_USERNAME'),
                password: Env.get('FTP_PASSWORD'),
                port: Env.get('FTP_PORT'),
            });
        }
        catch(err) {
            console.log(err)
        }

        // cek upload file
        const file = request.file('file');
        let nmfile = "";
        let nmfile_db = "";
        let nmfile_upl = "";
        if(file) {       
            nmfile = file.clientName;
            nmfile_db = supp_code + "_18_" + last_prefix;
            nmfile_upl = nmfile_db + ".pdf";
            
            // upload lokal
            await file.move(Application.publicPath('file'), { name: nmfile_upl });
            
            // upload FTP
            await client.uploadFrom(Application.publicPath(`file/${nmfile_upl}`), `/${Env.get('FTP_PATH')}/${nmfile_upl}`); 

            // insert data upload
            const insFile = await SupplierPathUpload.create({
                sup_code_app: supp_code,
                details_column: 18,
                details_upload_app: nmfile_db,
                details_upload: nmfile,
                created_by: 'Vendor'
            });

            if(insFile){
                return response.status(200).json({
                    message: "Berhasil upload file",
                    status: true
                });
            }
            else{
                return response.status(406).json({
                    message: "Gagal upload data",
                    status: true
                });
            }            
        }    
        
        // Close FTP
        client.close();        
    }

    public async getfilePengalamanPerusahaan({ request }: HttpContextContract) {
        const res = await SupplierPathUpload.query().where('sup_code_app', request.input('code')).where('details_column', 18);
        return res;            
    }

    public async delfilePengalamanPerusahaan({ params, response }: HttpContextContract) {
        // cek data
        const cekData = await SupplierPathUpload.query().where('upload_id', params.id).first();

        if(cekData){
            // Open FTP
            const client = new ftp.Client();
            client.ftp.verbose = true; 
            try {           
                await client.access({
                    host: Env.get('FTP_HOST'),
                    user: Env.get('FTP_USERNAME'),
                    password: Env.get('FTP_PASSWORD'),
                    port: Env.get('FTP_PORT'),
                });
            }
            catch(err) {
                console.log(err)
            }

            // delete data file di FTP & update data lama
            await client.remove(`/${Env.get('FTP_PATH')}/${cekData.details_upload_app}.pdf`);
        
            // Close FTP
            client.close();    

            const delFile = await SupplierPathUpload
                            .query()
                            .where('upload_id', params.id)
                            .delete();

            return response.send(delFile);
        }
        else{
            return response.status(406).json({
                message: "Invalid data",
                status: true,
            });  
        }
    }

    public async getPenandaKontrak({ request }: HttpContextContract) {
        if (request.input('rowsPerPage') == null) {
            const res = await SupplierPathDet.query().where('sup_code_app', request.input('code')).where('details_column', 21).where('details_column_prioritas', 21);
            return res;            
        }
        else {
            var page = request.input('page');
            var sort = request.input('sortBy')
            var descend = request.input('descending')
            if(descend == 'false'){
                descend = 'desc';
            }else{
                descend = 'asc';
            }
            const res = await SupplierPathDet
                        .query()
                        .where('sup_code_app', request.input('code'))  
                        .where('details_column', 21)
                        .where('details_column_prioritas', 21)
                        .where((query) => {
                            if (request.input('filter') != null)
                            {
                              query.where('details_content_1', 'like', `%${request.input('filter')}%`)
                                    .orWhere('details_content_2', 'like', `%${request.input('filter')}%`)                                        
                                    .orWhere('details_content_3', 'like', `%${request.input('filter')}%`)
                                    .orWhere('details_content_4', 'like', `%${request.input('filter')}%`)
                                    .orWhere('details_content_5', 'like', `%${request.input('filter')}%`)
                                    .orWhere('details_content_6', 'like', `%${request.input('filter')}%`)
                                    .orWhere('details_content_7', 'like', `%${request.input('filter')}%`);                                          
                            }                    
                        })    
                        .orderBy(sort,descend)            
                        .paginate(page, request.input('rowsPerPage'));  

            return res;  
        }
    }

    public async getRekeningBank({ request }: HttpContextContract) {
        if (request.input('rowsPerPage') == null) {
            const res = await SupplierPathDet.query().where('sup_code_app', request.input('code')).where('details_column', 14).where('details_column_prioritas', 14);
            return res;            
        }
        else {
            var page = request.input('page');
            var sort = request.input('sortBy')
            var descend = request.input('descending')
            if(descend == 'false'){
                descend = 'desc';
            }else{
                descend = 'asc';
            }
            const res = await SupplierPathDet
                        .query()
                        .where('sup_code_app', request.input('code'))  
                        .where('details_column', 14)
                        .where('details_column_prioritas', 14)
                        .where((query) => {
                            if (request.input('filter') != null)
                            {
                              query.where('details_content_1', 'like', `%${request.input('filter')}%`)
                                    .orWhere('details_content_2', 'like', `%${request.input('filter')}%`)                                        
                                    .orWhere('details_content_3', 'like', `%${request.input('filter')}%`)
                                    .orWhere('details_content_4', 'like', `%${request.input('filter')}%`)
                                    .orWhere('details_content_5', 'like', `%${request.input('filter')}%`)
                                    .orWhere('details_content_6', 'like', `%${request.input('filter')}%`)
                                    .orWhere('details_content_7', 'like', `%${request.input('filter')}%`)
                                    .orWhere('details_content_8', 'like', `%${request.input('filter')}%`)
                                    .orWhere('details_content_9', 'like', `%${request.input('filter')}%`)
                                    .orWhere('details_content_10', 'like', `%${request.input('filter')}%`);                                          
                            }                    
                        })    
                        .orderBy(sort,descend)            
                        .paginate(page, request.input('rowsPerPage'));  

            return res;  
        }
    }

    public async getDataRekeningBank({ request, response }: HttpContextContract) {
        const enkrip = Buffer.from(request.input('enkrip'), 'base64').toString('ascii');
        const code = request.input('code');

        const data = await RegisVendor
                    .query()
                    .where('regis_code_app', code).first(); 

        /*const data = await SupplierPath
                    .query()
                    .where('sup_code_app', code).first();*/

        return response.json(data);
    }

	public async getRegisVend({ request, response }: HttpContextContract) {
        // cek data
        const cekdata = await SupplierPath
                        .query()
                        .where('sup_npwp', request.input('npwp'))
                        .first();
        if(cekdata){

            const data = await RegisVendor
                        .query()
                        .where('regis_code_app', cekdata.sup_code_app).first();

            return response.json(data);
        }    
    }

    public async saveaddRekeningBank({ request, response }: HttpContextContract) {
        try {
            const supp_code = request.input('code');
            const last_prefix = dayjs().format('YYMMDD_HHmmss');
            // const last_prefix = Math.floor(Date.now()/1000); // 6 digit

            // cek inputan file
            //let file;
            //(request.input('file') == null || request.input('file') == '') ? file = '' : file = request.input('file');

            let alamat1, alamat2, alamat3;
            const countAlamat = request.input('alamatrek').toString().length;          
            if(countAlamat <= 50){
                alamat1 = request.input('alamatrek').substr(0,50);
                alamat2 = ''; 
                alamat3 = '';
            } else if(countAlamat <= 50){
                alamat1 = request.input('alamatrek').substr(0,50);
                alamat2 = request.input('alamatrek').substr(51,100);
                alamat3 = '';
            } else {
                alamat1 = request.input('alamatrek').substr(0,50);
                alamat2 = request.input('alamatrek').substr(51,100); 
                alamat3 = request.input('alamatrek').substr(101,150);
            }

            // Open FTP
            const client = new ftp.Client();
            client.ftp.verbose = true; 
            try {           
                await client.access({
                    host: Env.get('FTP_HOST'),
                    user: Env.get('FTP_USERNAME'),
                    password: Env.get('FTP_PASSWORD'),
                    port: Env.get('FTP_PORT'),
                });
            }
            catch(err) {
                console.log(err)
            }
            
            // cek upload file
            const file = request.file('file');
            let nmfile = "";
            let nmfile_db = "";
            let nmfile_upl = "";
            if(file) {       
                nmfile = file.clientName;
                nmfile_db = supp_code + "_14_" + last_prefix;
                nmfile_upl = nmfile_db + ".pdf";
                
                // upload lokal
                await file.move(Application.publicPath('file'), { name: nmfile_upl });
                
                // upload FTP
                await client.uploadFrom(Application.publicPath(`file/${nmfile_upl}`), `/${Env.get('FTP_PATH')}/${nmfile_upl}`); 

                // if(namaFile_ex){
                //     // delete data file di FTP & update data lama
                //     await client.remove(`/${Env.get('FTP_PATH')}/${namaFile_ex}.pdf`);
                //     await SupplierPathUpload
                //         .query()
                //         .where('sup_code_app', supp_code)
                //         .where('details_column', 10)
                //         .where('details_upload_app', namaFile_ex)
                //         .update({ 
                //             details_upload_app: nmfile_db,
                //             details_upload: nmfile
                //         });                                 
                // }
                // else{
                    // insert data upload
                    /*await SupplierPathUpload.create({
                        sup_code_app: supp_code,
                        details_column: 14,
                        details_upload_app: nmfile_db,
                        details_upload: nmfile,
                        created_by: 'Vendor'
                    });*/
                // }
            }
            // else{
            //     (namaFile1_ex) ? nmfile_1_db = namaFile1_ex : nmfile_1_db = "";
            // }            

            // Close FTP
            client.close();     

            // cek urutan terakhir
            let prioritas = 0;
            const Qprioritas = await SupplierPathDet
                            .query()
                            .where('sup_code_app', request.input('code'))
                            .where('details_column', 14)
                            .where('details_column_prioritas', 14)
                            .orderBy('details_content_prioritas', 'desc')
                            .first();   
                            
            if(Qprioritas){ prioritas = Qprioritas.details_content_prioritas + 1 } else { prioritas = 1 }

            // insert Rekening Bank
            const RekeningBank = await SupplierPathDet.create({
                sup_code_app: request.input('code'),
                sup_code: request.input('swiftcode'),
                details_column: 14,
                details_column_desc: 'Rekening Bank',
                details_column_prioritas: 14,
                details_content_prioritas: prioritas,
                // details_content_1: await ucWords(request.input('namabank')),
                details_content_1: request.input('namabank'),
                details_content_2: alamat1,
                details_content_3: request.input('nomorrek'),
                // details_content_4: await ucWords(request.input('namapemilikrek')),
                details_content_4: request.input('namapemilikrek'),
                details_content_5: request.input('matauang').toUpperCase(),
                details_content_6: alamat2,
                details_content_7: alamat3,
                details_content_8: request.input('kotacab'),
                details_content_9: request.input('namadalamrek'),
                details_content_10: nmfile_db,
                details_content_11: request.input('top'),
                details_flag: 1,
                details_status: 1,
                created_by: 'Vendor'
            });

            if(RekeningBank){
                return response.status(200).json({
                    message: "Berhasil simpan data",
                    status: true
                });
            }
            else{
                return response.status(406).json({
                    message: "Gagal simpan data",
                    status: true
                });
            }
        } 
        catch (error) {
            console.log(error)
            return response.status(406).json(error);
        }
    }

    public async saveaddPenandaKontrak({ request, response }: HttpContextContract) {
        try {
            const supp_code = request.input('code');
            const last_prefix = dayjs().format('YYMMDD_HHmmss');

            // Open FTP
            const client = new ftp.Client();
            client.ftp.verbose = true; 
            try {           
                await client.access({
                    host: Env.get('FTP_HOST'),
                    user: Env.get('FTP_USERNAME'),
                    password: Env.get('FTP_PASSWORD'),
                    port: Env.get('FTP_PORT'),
                });
            }
            catch(err) {
                console.log(err)
            }
            
            // cek upload file
            const file = request.file('file');
            let nmfile = "";
            let nmfile_db = "";
            let nmfile_upl = "";
            if(file) {       
                nmfile = file.clientName;
                nmfile_db = supp_code + "_21_" + last_prefix;
                nmfile_upl = nmfile_db + ".pdf";
                
                // upload lokal
                await file.move(Application.publicPath('file'), { name: nmfile_upl });
                
                // upload FTP
                await client.uploadFrom(Application.publicPath(`file/${nmfile_upl}`), `/${Env.get('FTP_PATH')}/${nmfile_upl}`);                
            }     

            // Close FTP
            client.close();     

            // cek urutan terakhir
            let prioritas = 0;
            const Qprioritas = await SupplierPathDet
                            .query()
                            .where('sup_code_app', request.input('code'))
                            .where('details_column', 21)
                            .where('details_column_prioritas', 21)
                            .orderBy('details_content_prioritas', 'desc')
                            .first();   
                            
            if(Qprioritas){ prioritas = Qprioritas.details_content_prioritas + 1 } else { prioritas = 1 }

            // insert Penandatangan Kontrak
            const penandaKontrak = await SupplierPathDet.create({
                sup_code_app: request.input('code'),
                details_column: 21,
                details_column_desc: 'Penandatangan Kontrak',
                details_column_prioritas: 21,
                details_content_prioritas: prioritas,
                details_content_1: request.input('namaLengkap'),
                details_content_2: request.input('nik'),
                details_content_3: request.input('jabatan'),
                details_content_4: request.input('email'),
                details_content_5: request.input('tglBuat'),
                details_content_6: request.input('direksi'),
                details_content_7: nmfile_db,
                details_flag: 1,
                details_status: 1,
                created_by: 'Vendor'
            });

            if(penandaKontrak){
                return response.status(200).json({
                    message: "Berhasil simpan data",
                    status: true
                });
            }
            else{
                return response.status(406).json({
                    message: "Gagal simpan data",
                    status: true
                });
            }
        } 
        catch (error) {
            console.log(error)
            return response.status(406).json(error);
        }
    }
	
	public async saveaddRekeningBankUpd({ request, response }: HttpContextContract) {
        try {
            const cekdata = await SupplierPath
                            .query()
                            .where('sup_npwp', request.input('npwp'))
                            // .where('sup_flag', 3)
                            .first();
            if(cekdata){
                const supp_code = cekdata.sup_code_app;
                const last_prefix = dayjs().format('YYMMDD_HHmmss');

                let alamat1, alamat2, alamat3;
                const countAlamat = request.input('alamatrek').toString().length;          
                if(countAlamat <= 50){
                    alamat1 = request.input('alamatrek').substr(0,50);
                    alamat2 = ''; 
                    alamat3 = '';
                } else if(countAlamat <= 50){
                    alamat1 = request.input('alamatrek').substr(0,50);
                    alamat2 = request.input('alamatrek').substr(51,100);
                    alamat3 = '';
                } else {
                    alamat1 = request.input('alamatrek').substr(0,50);
                    alamat2 = request.input('alamatrek').substr(51,100); 
                    alamat3 = request.input('alamatrek').substr(101,150);
                }

                // Open FTP
                const client = new ftp.Client();
                client.ftp.verbose = true; 
                try {           
                    await client.access({
                        host: Env.get('FTP_HOST'),
                        user: Env.get('FTP_USERNAME'),
                        password: Env.get('FTP_PASSWORD'),
                        port: Env.get('FTP_PORT'),
                    });
                }
                catch(err) {
                    console.log(err)
                }

                const cek_supp = await SupplierPathDet.query().where('sup_code_app', supp_code).where('details_column', 14).where('status_update', 'true').where('active', 'true').first();

                if(!cek_supp){
                    // cek urutan terakhir
                    let prioritas = 0;
                    const Qprioritas = await SupplierPathDet
                                    .query()
                                    .where('sup_code_app', supp_code)
                                    .where('details_column', 14)
                                    .where('details_column_prioritas', 14)
                                    .orderBy('details_content_prioritas', 'desc')
                                    .first();   
                                    
                    if(Qprioritas){ prioritas = Qprioritas.details_content_prioritas + 1 } else { prioritas = 1 }

                    // cek upload file
                    const file = request.file('file');
                    let nmfile = "";
                    let nmfile_db = "";
                    let nmfile_upl = "";
                    if(file) {       
                        nmfile = file.clientName;
                        nmfile_db = supp_code + "_14_" + last_prefix;
                        nmfile_upl = nmfile_db + ".pdf";
                        
                        // upload lokal
                        await file.move(Application.publicPath('file'), { name: nmfile_upl });
                        
                        // upload FTP
                        await client.uploadFrom(Application.publicPath(`file/${nmfile_upl}`), `/${Env.get('FTP_PATH')}/${nmfile_upl}`); 
                                                
                        // Close FTP
                        client.close();
                        
                        // insert data upload
                        const insFile = await SupplierPathUpload.create({
                            sup_code_app: supp_code,
                            details_column: 14,
                            details_upload_app: nmfile_db,
                            details_upload: nmfile,
                            created_by: 'Vendor'
                        });
            
                        if(insFile){
                            // insert Rekening Bank
                            const RekeningBank = await SupplierPathDet.create({
                                sup_code_app: supp_code,
                                sup_code: request.input('swiftcode'),
                                details_column: 14,
                                details_column_desc: 'Rekening Bank',
                                details_column_prioritas: 14,
                                details_content_prioritas: prioritas,
                                details_content_1: request.input('namabank'),
                                details_content_2: alamat1,
                                details_content_3: request.input('nomorrek'),
                                details_content_4: request.input('namapemilikrek'),
                                details_content_5: request.input('matauang').toUpperCase(),
                                details_content_6: alamat2,
                                details_content_7: alamat3,
                                details_content_8: request.input('kotacab'),
                                details_content_9: request.input('namadalamrek'),
                                details_content_10: nmfile_db,
                                details_content_11: request.input('top'),
                                details_flag: 1,
                                details_status: 1,
                                created_by: 'Vendor',
                                status_update: 'true'
                            });

                            if(RekeningBank){
                                return response.status(200).json({
                                    message: "Berhasil simpan data",
                                    status: true
                                });
                            }
                            else{
                                return response.status(406).json({
                                    message: "Gagal simpan data",
                                    status: true
                                });
                            }
                        }
                        else{
                            return response.status(406).json({
                                message: "Gagal upload data",
                                status: true
                            });
                        }
                    } else {
                        // insert Rekening Bank
                        const RekeningBank = await SupplierPathDet.create({
                            sup_code_app: supp_code,
                            sup_code: request.input('swiftcode'),
                            details_column: 14,
                            details_column_desc: 'Rekening Bank',
                            details_column_prioritas: 14,
                            details_content_prioritas: prioritas,
                            details_content_1: request.input('namabank'),
                            details_content_2: alamat1,
                            details_content_3: request.input('nomorrek'),
                            details_content_4: request.input('namapemilikrek'),
                            details_content_5: request.input('matauang').toUpperCase(),
                            details_content_6: alamat2,
                            details_content_7: alamat3,
                            details_content_8: request.input('kotacab'),
                            details_content_9: request.input('namadalamrek'),
                            details_content_11: request.input('top'),
                            details_flag: 1,
                            details_status: 1,
                            created_by: 'Vendor',
                            status_update: 'true'
                        });

                        if(RekeningBank){
                            return response.status(200).json({
                                message: "Berhasil simpan data",
                                status: true
                            });
                        }
                        else{
                            return response.status(406).json({
                                message: "Gagal simpan data",
                                status: true
                            });
                        }
                    }
                } else {
                    // cek upload file
                    const file = request.file('file');
                    let nmfile = "";
                    let nmfile_db = "";
                    let nmfile_upl = "";
                    if(file) {
                        if (cek_supp.details_content_10) {
                            // delete data file di FTP & update data lama
                            await client.remove(`/${Env.get('FTP_PATH')}/${cek_supp.details_content_10}.pdf`);

                            await SupplierPathUpload
                                .query()
                                .where('sup_code_app', cek_supp.sup_code_app)
                                .where('details_upload_app', cek_supp.details_content_10)
                                .delete();
                            // end delete data file di FTP & update data lama
                        }                        

                        nmfile = file.clientName;
                        nmfile_db = supp_code + "_14_" + last_prefix;
                        nmfile_upl = nmfile_db + ".pdf";
                        
                        // upload lokal
                        await file.move(Application.publicPath('file'), { name: nmfile_upl });
                        
                        // upload FTP
                        await client.uploadFrom(Application.publicPath(`file/${nmfile_upl}`), `/${Env.get('FTP_PATH')}/${nmfile_upl}`); 
                        
                        // Close FTP
                        client.close();
                        
                        // insert data upload
                        const insFile = await SupplierPathUpload.create({
                            sup_code_app: supp_code,
                            details_column: 14,
                            details_upload_app: nmfile_db,
                            details_upload: nmfile,
                            created_by: 'Vendor'
                        });
            
                        if(insFile){
                            // update Rekening Bank
                            const RekeningBank = await SupplierPathDet
                            .query()
                            .where('sup_code_app', supp_code)
                            .where('details_column', 14)
                            .where('details_column_prioritas', 14)
                            .where('status_update', 'true')
                            .where('active', 'true')
                            .update({
                                sup_code: request.input('swiftcode'),
                                details_content_1: request.input('namabank'),
                                details_content_2: alamat1,
                                details_content_3: request.input('nomorrek'),
                                details_content_4: request.input('namapemilikrek'),
                                details_content_5: request.input('matauang').toUpperCase(),
                                details_content_6: alamat2,
                                details_content_7: alamat3,
                                details_content_8: request.input('kotacab'),
                                details_content_9: request.input('namadalamrek'),
                                details_content_10: nmfile_db,
                                details_content_11: request.input('top'),
                                modified_by: 'Vendor',
                                modified_date: datetimeNow,
                            });

                            if(RekeningBank){
                                return response.status(200).json({
                                    message: "Berhasil update data",
                                    status: true
                                });
                            }
                            else{
                                return response.status(406).json({
                                    message: "Gagal update data",
                                    status: true
                                });
                            }
                        }
                        else{
                            return response.status(406).json({
                                message: "Gagal upload data",
                                status: true
                            });
                        }
                    } else {
                        // update Rekening Bank
                        const RekeningBank = await SupplierPathDet
                        .query()
                        .where('sup_code_app', supp_code)
                        .where('details_column', 14)
                        .where('details_column_prioritas', 14)
                        .where('status_update', 'true')
                        .where('active', 'true')
                        .update({
                            sup_code: request.input('swiftcode'),
                            details_content_1: request.input('namabank'),
                            details_content_2: alamat1,
                            details_content_3: request.input('nomorrek'),
                            details_content_4: request.input('namapemilikrek'),
                            details_content_5: request.input('matauang').toUpperCase(),
                            details_content_6: alamat2,
                            details_content_7: alamat3,
                            details_content_8: request.input('kotacab'),
                            details_content_9: request.input('namadalamrek'),
                            details_content_11: request.input('top'),
                            modified_by: 'Vendor',
                            modified_date: datetimeNow,
                        });

                        if(RekeningBank){
                            return response.status(200).json({
                                message: "Berhasil update data",
                                status: true
                            });
                        }
                        else{
                            return response.status(406).json({
                                message: "Gagal update data",
                                status: true
                            });
                        }
                    }
                }
            }    
        } 
        catch (error) {
            console.log(error)
            return response.status(406).json(error);
        }
    }
	
	public async saveaddPenandaKontrakUpd({ request, response }: HttpContextContract) {
        try {
            const cekdata = await SupplierPath
                            .query()
                            .where('sup_npwp', request.input('npwp'))
                            .first();
            if(cekdata){
                const supp_code = cekdata.sup_code_app;
                const last_prefix = dayjs().format('YYMMDD_HHmmss');

                // Open FTP
                const client = new ftp.Client();
                client.ftp.verbose = true; 
                try {           
                    await client.access({
                        host: Env.get('FTP_HOST'),
                        user: Env.get('FTP_USERNAME'),
                        password: Env.get('FTP_PASSWORD'),
                        port: Env.get('FTP_PORT'),
                    });
                }
                catch(err) {
                    console.log(err)
                }

                // cek upload file
                const file = request.file('file');
                let nmfile = "";
                let nmfile_db = "";
                let nmfile_upl = "";
                if(file) {       
                    nmfile = file.clientName;
                    nmfile_db = supp_code + "_21_" + last_prefix;
                    nmfile_upl = nmfile_db + ".pdf";
                    
                    // upload lokal
                    await file.move(Application.publicPath('file'), { name: nmfile_upl });
                    
                    // upload FTP
                    await client.uploadFrom(Application.publicPath(`file/${nmfile_upl}`), `/${Env.get('FTP_PATH')}/${nmfile_upl}`);
                } 

                // Close FTP
                client.close();

                // cek urutan terakhir
                let prioritas = 0;
                const Qprioritas = await SupplierPathDet
                                .query()
                                .where('sup_code_app', supp_code)
                                .where('details_column', 21)
                                .where('details_column_prioritas', 21)
                                .orderBy('details_content_prioritas', 'desc')
                                .first();   
                                
                if(Qprioritas){ prioritas = Qprioritas.details_content_prioritas + 1 } else { prioritas = 1 }

                // insert Penandatangan Kontrak
                const penandaKontrak = await SupplierPathDet.create({
                    sup_code_app: supp_code,
                    details_column: 21,
                    details_column_desc: 'Penandatangan Kontrak',
                    details_column_prioritas: 21,
                    details_content_prioritas: prioritas,
                    details_content_1: request.input('namaLengkap'),
                    details_content_2: request.input('nik'),
                    details_content_3: request.input('jabatan'),
                    details_content_4: request.input('email'),
                    details_content_5: request.input('tglBuat'),
                    details_content_6: request.input('direksi'),
                    details_content_7: nmfile_db,
                    details_flag: 1,
                    details_status: 1,
                    created_by: 'Vendor',
                    status_update: 'true'
                });

                if(penandaKontrak){
                    return response.status(200).json({
                        message: "Berhasil simpan data",
                        status: true
                    });
                }
                else{
                    return response.status(406).json({
                        message: "Gagal simpan data",
                        status: true
                    });
                }
                
            }    
        } 
        catch (error) {
            console.log(error)
            return response.status(406).json(error);
        }
    }

    public async saveupdatePenandaKontrak({ params, request, response }: HttpContextContract) {
        const penandaKontrak = await SupplierPathDet.findOrFail(params.id);

        const supp_code = request.input('code');
        const last_prefix = dayjs().format('YYMMDD_HHmmss');

        // Open FTP
        const client = new ftp.Client();
        client.ftp.verbose = true; 
        try {           
            await client.access({
                host: Env.get('FTP_HOST'),
                user: Env.get('FTP_USERNAME'),
                password: Env.get('FTP_PASSWORD'),
                port: Env.get('FTP_PORT'),
            });
        }
        catch(err) {
            console.log(err)
        }
        
        // cek upload file
        const file = request.file('file');
        let nmfile = "";
        let nmfile_db = "";
        let nmfile_upl = "";
        if(file) {       
            nmfile = file.clientName;
            nmfile_db = supp_code + "_21_" + last_prefix;
            nmfile_upl = nmfile_db + ".pdf";
          
            // delete data file di FTP & update data lama
            if (penandaKontrak.details_content_7) {
                await client.remove(`/${Env.get('FTP_PATH')}/${penandaKontrak.details_content_7}.pdf`);    
            }
            
            // upload lokal
            await file.move(Application.publicPath('file'), { name: nmfile_upl });
            
            // upload FTP
            await client.uploadFrom(Application.publicPath(`file/${nmfile_upl}`), `/${Env.get('FTP_PATH')}/${nmfile_upl}`);                
        } else {
            nmfile_db = penandaKontrak.details_content_7;
        }     

        // Close FTP
        client.close();
                
        penandaKontrak.details_content_1 = request.input('namaLengkap');
        penandaKontrak.details_content_2 = request.input('nik');
        penandaKontrak.details_content_3 = request.input('jabatan');
        penandaKontrak.details_content_4 = request.input('email');
        penandaKontrak.details_content_5 = request.input('tglBuat');
        penandaKontrak.details_content_6 = request.input('direksi');;
        penandaKontrak.details_content_7 = nmfile_db;
        penandaKontrak.modified_by = 'Vendor';
        penandaKontrak.modified_date = datetimeNow;
        penandaKontrak.save();
    
        return response.status(202).send(penandaKontrak);
    }    

    public async saveupdateRekeningBank({ params, request, response }: HttpContextContract) {
        const RekeningBank = await SupplierPathDet.findOrFail(params.id);

        const supp_code = request.input('code');
        const last_prefix = dayjs().format('YYMMDD_HHmmss');

        // Open FTP
        const client = new ftp.Client();
        client.ftp.verbose = true; 
        try {           
            await client.access({
                host: Env.get('FTP_HOST'),
                user: Env.get('FTP_USERNAME'),
                password: Env.get('FTP_PASSWORD'),
                port: Env.get('FTP_PORT'),
            });
        }
        catch(err) {
            console.log(err)
        }
        
        // cek upload file
        const file = request.file('file');
        let nmfile = "";
        let nmfile_db = "";
        let nmfile_upl = "";
        if(file) {       
            nmfile = file.clientName;
            nmfile_db = supp_code + "_14_" + last_prefix;
            nmfile_upl = nmfile_db + ".pdf";
          
            // delete data file di FTP & update data lama
            if (RekeningBank.details_content_10) {
                await client.remove(`/${Env.get('FTP_PATH')}/${RekeningBank.details_content_10}.pdf`);    
            }
            
            // upload lokal
            await file.move(Application.publicPath('file'), { name: nmfile_upl });
            
            // upload FTP
            await client.uploadFrom(Application.publicPath(`file/${nmfile_upl}`), `/${Env.get('FTP_PATH')}/${nmfile_upl}`);                
        } else {
            nmfile_db = RekeningBank.details_content_10;
        }     

        // Close FTP
        client.close();
    
        let alamat1, alamat2, alamat3;
        const countAlamat = request.input('alamatrek').toString().length;          
        if(countAlamat <= 50){
            alamat1 = request.input('alamatrek').substr(0,50);
            alamat2 = ''; 
            alamat3 = '';
        } else if(countAlamat <= 50){
            alamat1 = request.input('alamatrek').substr(0,50);
            alamat2 = request.input('alamatrek').substr(51,100);
            alamat3 = '';
        } else {
            alamat1 = request.input('alamatrek').substr(0,50);
            alamat2 = request.input('alamatrek').substr(51,100); 
            alamat3 = request.input('alamatrek').substr(101,150);
        }

        // RekeningBank.details_content_1 = await ucWords(request.input('namabank'));        
        RekeningBank.sup_code = request.input('swiftcode');
        RekeningBank.details_content_1 = request.input('namabank');
        RekeningBank.details_content_2 = alamat1;
        RekeningBank.details_content_3 = request.input('nomorrek');
        // RekeningBank.details_content_4 = await ucWords(request.input('namapemilikrek'));
        RekeningBank.details_content_4 = request.input('namapemilikrek');
        RekeningBank.details_content_5 = request.input('matauang').toUpperCase();
        RekeningBank.details_content_6 = alamat2;
        RekeningBank.details_content_7 = alamat3;
        RekeningBank.details_content_8 = request.input('kotacab');
        RekeningBank.details_content_9 = request.input('namadalamrek');
        RekeningBank.details_content_10 = nmfile_db;
        RekeningBank.details_content_11 = request.input('top');
        RekeningBank.modified_by = 'Vendor';
        RekeningBank.modified_date = datetimeNow;
        RekeningBank.save();
    
        return response.status(202).send(RekeningBank);
    }    

    public async delPenandaKontrak({ params, response }: HttpContextContract) {
        // cek data
        const cekData = await SupplierPathDet.query().where('sup_dtl_id', params.id).first();
        // return cekData;

        if(cekData){
            // cek jika terdapat file
            if(cekData.details_content_7 != ''){
                // Open FTP
                const client = new ftp.Client();
                client.ftp.verbose = true; 
                try {           
                    await client.access({
                        host: Env.get('FTP_HOST'),
                        user: Env.get('FTP_USERNAME'),
                        password: Env.get('FTP_PASSWORD'),
                        port: Env.get('FTP_PORT'),
                    });
                }
                catch(err) {
                    console.log(err)
                }
                
                // delete data file di FTP & update data lama
                await client.remove(`/${Env.get('FTP_PATH')}/${cekData.details_content_7}.pdf`);
            
                // Close FTP
                client.close();
            }

            const delData = await SupplierPathDet
                            .query()
                            .where('sup_dtl_id', params.id)
                            .delete();

            return response.send(delData);            
        }
        else{
            return response.status(406).json({
                message: "Invalid data",
                status: true,
            });  
        }
    }

    public async delRekeningBank({ params, response }: HttpContextContract) {
        // cek data
        const cekData = await SupplierPathDet.query().where('sup_dtl_id', params.id).first();
        // return cekData;

        if(cekData){
            // cek jika terdapat file
            if(cekData.details_content_10 != ''){
                // Open FTP
                const client = new ftp.Client();
                client.ftp.verbose = true; 
                try {           
                    await client.access({
                        host: Env.get('FTP_HOST'),
                        user: Env.get('FTP_USERNAME'),
                        password: Env.get('FTP_PASSWORD'),
                        port: Env.get('FTP_PORT'),
                    });
                }
                catch(err) {
                    console.log(err)
                }
                
                // delete data file di FTP & update data lama
                await client.remove(`/${Env.get('FTP_PATH')}/${cekData.details_content_10}.pdf`);
            
                // Close FTP
                client.close();   
                
                const delFile = await SupplierPathUpload
                                .query()
                                .where('sup_code_app', cekData.sup_code_app)
                                .where('details_upload_app', cekData.details_content_10)
                                .delete();
            }

            const delData = await SupplierPathDet
                            .query()
                            .where('sup_dtl_id', params.id)
                            .delete();

            return response.send(delData);            
        }
        else{
            return response.status(406).json({
                message: "Invalid data",
                status: true,
            });  
        }
    }

    public async savefileRekeningBank({ request, response }: HttpContextContract) {
        const supp_code = request.input('code');
        const last_prefix = dayjs().format('YYMMDD_HHmmss');

        // Open FTP
        const client = new ftp.Client();
        client.ftp.verbose = true; 
        try {           
            await client.access({
                host: Env.get('FTP_HOST'),
                user: Env.get('FTP_USERNAME'),
                password: Env.get('FTP_PASSWORD'),
                port: Env.get('FTP_PORT'),
            });
        }
        catch(err) {
            console.log(err)
        }

        // cek upload file
        const file = request.file('file');
        let nmfile = "";
        let nmfile_db = "";
        let nmfile_upl = "";
        if(file) {       
            nmfile = file.clientName;
            nmfile_db = supp_code + "_14_" + last_prefix;
            nmfile_upl = nmfile_db + ".pdf";
            
            // upload lokal
            await file.move(Application.publicPath('file'), { name: nmfile_upl });
            
            // upload FTP
            await client.uploadFrom(Application.publicPath(`file/${nmfile_upl}`), `/${Env.get('FTP_PATH')}/${nmfile_upl}`); 

            // insert data upload
            const insFile = await SupplierPathUpload.create({
                sup_code_app: supp_code,
                details_column: 14,
                details_upload_app: nmfile_db,
                details_upload: nmfile,
                created_by: 'Vendor'
            });

            if(insFile){
                return response.status(200).json({
                    message: "Berhasil upload file",
                    status: true
                });
            }
            else{
                return response.status(406).json({
                    message: "Gagal upload data",
                    status: true
                });
            }            
        }    
        
        // Close FTP
        client.close();        
    }

    public async getfileRekeningBank({ request }: HttpContextContract) {
        const res = await SupplierPathUpload.query().where('sup_code_app', request.input('code')).where('details_column', 14);
        return res;            
    }

    public async delfileRekeningBank({ params, response }: HttpContextContract) {
        // cek data
        const cekData = await SupplierPathUpload.query().where('upload_id', params.id).first();

        if(cekData){
            // Open FTP
            const client = new ftp.Client();
            client.ftp.verbose = true; 
            try {           
                await client.access({
                    host: Env.get('FTP_HOST'),
                    user: Env.get('FTP_USERNAME'),
                    password: Env.get('FTP_PASSWORD'),
                    port: Env.get('FTP_PORT'),
                });
            }
            catch(err) {
                console.log(err)
            }

            // delete data file di FTP & update data lama
            await client.remove(`/${Env.get('FTP_PATH')}/${cekData.details_upload_app}.pdf`);
        
            // Close FTP
            client.close();    

            const delFile = await SupplierPathUpload
                            .query()
                            .where('upload_id', params.id)
                            .delete();

            return response.send(delFile);
        }
        else{
            return response.status(406).json({
                message: "Invalid data",
                status: true,
            });  
        }
    }

    public async cekLinkRegisVendor({ request }: HttpContextContract) {
        const uuid = Buffer.from(request.input('link_encrypt'), 'base64').toString('ascii');
        const code_app = request.input('link_code');

        const cek_supp = await RegisVendor.query().where('uuid', uuid).where('regis_code_app', code_app).first();

        // cek kombinasi data encrypt dan code
        if(cek_supp) {
            // cek jika link sesuai namun status registrasi sudah masuk ke Proc
            const cekSuppPath = await SupplierPath
                                .query()
                                .where('sup_code_app', cek_supp.regis_code_app)
                                .where('sup_npwp', cek_supp.regis_npwp)
                                .where('sup_flag','>=', 2)
                                .where('approval_level','>=', 1)
                                .where('sup_status_prog','>=', 0)
                                .first(); 
            if(cekSuppPath){
                var status = 0;
            }
            else{
                var status = 1;
            }
        }
        else{
            var status = 0;
        }

        return status;
    } 

    public async saveRegistrasi({ request, response }: HttpContextContract) {
        const sender = await senderMail();
        const mailConfig = Config.get('mail');

        mailConfig.mailers.smtp.host = sender[0].ms_host;
        mailConfig.mailers.smtp.auth.user = sender[0].ms_name;
        mailConfig.mailers.smtp.auth.pass = sender[0].ms_pass;

        const supp_code = request.input('code');

        // cek data
        const cekData = await RegisVendor
                    .query()
                    .where('regis_code_app', supp_code)
                    // .where('regis_flag', 1)
                    .orderBy('regis_code_auto', 'desc')
                    .first(); 

        if(cekData) { 
            // cek data m_supp_path berd.sup_code_app & sup_npwp
            const cekSuppPath = await SupplierPath
                                .query()
                                .where('sup_code_app', cekData.regis_code_app)
                                .where('sup_npwp', cekData.regis_npwp)
                                .first();  

            if(cekSuppPath){
                // cek isian kategori & sub kategori
                if(cekSuppPath.sup_cat != '' && cekSuppPath.sup_type != ''){
                  
                    const cekApproval = await Database
                                    .connection('mssql_procsys')
                                    .from('m_approval')
                                    .select('*')
                                    .where('m_approval.bu_id', request.input('bu_id'))
                                    .where('m_approval.approval_level', 1)
                                    .where('m_approval.status', 1)
                                    .first();

                    if(cekApproval){
                        // ambil email user
                        const cekEmail = await Database
                                            .from('user')        
                                            .select('nama','email')                                                    
                                            .where('empid', cekApproval.log_id)
                                            .first();             
                        
                        if(cekEmail){
                            // ambil nama bu
                            const namabu = await Database.from('m_bisnis_unit').where('bu_id',request.input('bu_id')).first();
                               
                            let footer_bu;
                            if(namabu.bu_code == 'WDJR' || namabu.bu_code == 'WNR'){
                                // footer_bu = 'footer_djm.png';
                                footer_bu = 'rucika-standard.png';
                            }
                            else if(namabu.bu_code == 'DJM' || namabu.bu_code == 'DTU'){
                                // footer_bu = 'footer_djm.png';
                                footer_bu = 'djabesmen.png';
                            }
                            else if(namabu.bu_code == 'RBG'){
                                // footer_bu = 'footer_rbg.png';
                                footer_bu = 'rb-granito.png';
                            }
                            else{
                                footer_bu = 'footer_other.png';
                            }

                            // send email registrasi
                            await Mail.send((message) => {
                            message
                                .from('system@dbc.co.id', 'Admin Procurement - PT. '+namabu.bu_name+'')
                                .to(cekEmail.email,cekEmail.nama)
								// .bcc('faris@dbc.co.id', 'Faris')
                                .bcc('zulvikar.wibowo@dbc.co.id', 'Zulvikar Aji Wibowo')
                                .bcc('robi.pramesti@dbc.co.id', 'Robi Dewi Asih Pramesti')
								// .bcc('fauzi.susanto@dbc.co.id', 'Fauzi Dwi Susanto')
                                .subject('Vendor Registration Successfully')              
                                .htmlView('emails/regvendor/notifikasi_register_final', { 
                                    nama_bu: namabu.bu_name,
                                    nama_vendor: cekSuppPath.sup_name,
                                    kategori_vendor: cekSuppPath.sup_cat,
                                    link_footer: Env.get('LINK_FRONTEND')+'/mail/'+footer_bu,
                                })
                            });

                            // Update Data Supplier Path
                            const updateSupp = await SupplierPath
                                            .query()
                                            .where('sup_code_app', cekSuppPath.sup_code_app)
                                            .where('sup_npwp', cekSuppPath.sup_npwp)
                                            .update({ 
                                                sup_flag: 2,
                                                close_regis_date: datetimeNow,
                                                approval_level: 1,
                                                sup_status_prog: 0
                                            });

                            // update regis_flag
                            const updateRegVend = await RegisVendor
                                                .query()
                                                .where('regis_code_app', cekSuppPath.sup_code_app)
                                                .where('regis_npwp', cekSuppPath.sup_npwp)
                                                .update({ 
                                                    bu_id: request.input('bu_id')
                                                });
                            
                            return response.status(200).json({
                                message: "Berhasil, terima kasih sudah melakukan registrasi",
                                status: true,
                            }); 
                        }
                        else{
                            return response.status(406).json({
                                message: "User approval belum terdaftar",
                                status: true,
                            }); 
                        }
                    }
                    else{
                        return response.status(406).json({
                            message: "Level approval belum terdaftar",
                            status: true,
                        }); 
                    }
                }
                else{
                    return response.status(406).json({
                        message: "Gagal, mohon lengkapi data profile",
                        status: true,
                    });  
                }
            }
            else{
                return response.status(406).json({
                    message: "Invalid data",
                    status: true,
                }); 
            }
        }
        else{
            return response.status(406).json({
                message: "Invalid data",
                status: true,
            }); 
        }       
    }

}