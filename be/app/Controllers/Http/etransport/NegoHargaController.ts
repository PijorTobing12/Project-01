// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from "@ioc:Adonis/Lucid/Database";
const urlDBC = "https://qssiptdldb07.odqad.com:8143/wsa/wsadbc/wsdl?targetURI=urn:services-qad-com:wsadbc:0001";
import { getWSA } from "App/Helpers/Wsa";
import { DateTime } from 'luxon';
import Mail from '@ioc:Adonis/Addons/Mail';

export default class NegoHargaController {

    public async getNegoHarga({request, response}) {     
        var moment = require('moment'); // require      
        const datauser = await Database
        .from('user')
        .where('empid',   request.input('empid'))        
        .first(); 

        datauser.domain = '100';
        datauser.domain = request.input('domain');


        const ceksiteapprover = await Database
        .from('approve_harga')
        .where('DO_approve_harga',   request.input('empid'))        
        .first(); 
        let siteapprover = ceksiteapprover.siteqad_approve_harga;
        console.log(siteapprover);

        const qdata = await Database
        .from('pengajuan_header')
        .join('log_pengajuan', 'log_pengajuan.id_pengajuan_header', '=', 'pengajuan_header.id_pengajuan_header')
        .select('pengajuan_header.*')
        .where('pengajuan_header.bu_header', datauser.domain)               
        .where('log_pengajuan.status_pengajuan', 'Send')   
        .orderBy('id_log', 'desc')      
        // console.log(qdata);        
        for(const loopqdata of qdata){
            if(loopqdata.tanggal_berlaku_pengajuan){
                loopqdata.tanggal_berlaku_pengajuan = moment(loopqdata.tanggal_berlaku_pengajuan).format('DD-MM-YYYY')
            }
            if(loopqdata.tanggal_berlaku){
                loopqdata.tanggal_berlaku = moment(loopqdata.tanggal_berlaku).format('DD-MM-YYYY')               
            }

            const qdatadet = await Database
                .from('pengajuan_detail')                
                .select('pengajuan_detail.id_pengajuan_detail')
                .where('id_pengajuan_header', loopqdata.id_pengajuan_header) 
                .where('pengajuan_detail.site_lokasi_muat', siteapprover)  
            
            for(const loopqdatadet of qdatadet){               
                const cekrekdet2 = await Database
                .from('rekap_pengajuan_det2')                
                .select('id_rekap_det1')
                .where('id_pengajuan_detail', loopqdatadet.id_pengajuan_detail) 
                .first()
                if(cekrekdet2){
                    const cekrekdet1 = await Database
                    .from('rekap_pengajuan_det1')                
                    .select('id_rekap_header')
                    .where('id_rekap_det1', cekrekdet2.id_rekap_det1) 
                    .first()
                    if(cekrekdet1){
                        const ceklog = await Database
                        .from('log_approval')                
                        .select('id_log')
                        .where('id_rekap_header', cekrekdet1.id_rekap_header) 
                        .where('level_rekap', '1') 
                        .where('status_rekap', 'Send') 
                        .first()
                        if(ceklog){
                            loopqdata.status = 'CLOSE';
                        }else{
                            loopqdata.status = 'OPEN';
                        }
                    }
                }else{
                    loopqdata.status = 'OPEN';
                }
            }
        }


        // for(const loopqdata of qdata){
        //     loopqdata.status = 'OPEN';
        //     const qdatadet = await Database
        //         .from('pengajuan_detail')                
        //         .select('pengajuan_detail.id_pengajuan_detail')
        //         .where('id_pengajuan_header', loopqdata.id_pengajuan_header)                               
        //     for(const loopqdatadet of qdatadet){
        //         // console.log(loopqdatadet.id_pengajuan_detail)

        //         const qdatadet2 = await Database
        //         .from('rekap_pengajuan_det2')                
        //         .select('*')
        //         .where('id_pengajuan_detail', loopqdatadet.id_pengajuan_detail)  
        //         .first();
        //         if(qdatadet2){
        //             // console.log(qdatadet2.id_rekap_det2); 
        //             // loopqdata.status = 'CLOSE';
        //         }else{
        //             // loopqdata.status = 'OPEN';
        //         }
                
        //     }
        // }
        // return qdata;
        
        var res = [];
        const args = { parDomain: datauser.domain,  parFldName:"lokasi_muat", parDBLogical:"qaddb" };
        const qwsa = await getWSA(urlDBC, "getDBCMstGenCode", args);
        if(qwsa.tt_codemstr == null){
            res = [];               
        }else{
            res = qwsa.tt_codemstr.tt_codemstrRow;               
        }
        
        
        var res2 = [];
        const args2 = { parDomain: datauser.domain,  parFldName:"xxakrute_jnskend", parDBLogical:"qaddb" };
        const qwsa2 = await getWSA(urlDBC, "getDBCMstGenCode", args2); 
        if(qwsa2.tt_codemstr == null){
            res2 = [];               
        }else{
            res2 = qwsa2.tt_codemstr.tt_codemstrRow;               
        }             

        // var res3 = [];
        // const args3 = { parDomain: datauser.domain,  parFldName:"xxakrute_wilayah", parDBLogical:"qaddb" };
        // const qwsa3 = await getWSA(urlDBC, "getDBCMstGenCode", args3); 
        // if(qwsa3.tt_codemstr == null){
        //     res3 = [];               
        // }else{
        //     res3 = qwsa3.tt_codemstr.tt_codemstrRow;               
        // }       

        
        return {data1:qdata, 
            data2:res, 
            data3:res2, 
            // data4:res3,
            }           
    }

    public async getDetailNegoHarga({request, response}) 
    {   
        const ceksiteapprover = await Database
        .from('approve_harga')
        .where('DO_approve_harga',   request.input('empid'))        
        .first(); 
        let siteapprover = ceksiteapprover.siteqad_approve_harga;
        console.log(siteapprover);
        console.log(request.input('id'));
        const qdata = await Database        
                .from('pengajuan_detail')                        
                .join('nego_harga', 'nego_harga.id_pengajuan_detail', '=', 'pengajuan_detail.id_pengajuan_detail')                      
                .select('pengajuan_detail.*', 'nego_harga.harga_nego')
                .where('pengajuan_detail.id_pengajuan_header', request.input('id'))
                .where('pengajuan_detail.site_lokasi_muat', siteapprover)              
                .where('nego_harga.flag', 'New') 
        return {data1:qdata,}         
                   
    }

    public async saveNegoHarga({ request, response }) {           
        const dayjs = require('dayjs')  
        const inpfile = request.file('buktinego')        
        await inpfile.moveToDisk('./NegoHarga/')

        const fileName = inpfile.fileName;

        // console.log(fileName);
        // return request;
        const queryupdatenego = await Database
        .from('nego_harga')
        .where('id_pengajuan_detail', request.input('idpengajuandetail'))
        .update(
            { 
                flag    :  'Old',                                
            }
        )

        const insertnegoharga = await Database
        .insertQuery() // 👈 gives an instance of insert query builder
        .table('nego_harga')
        .insert(
            { 
                id_pengajuan_detail         :  request.input('idpengajuandetail'),
                harga_nego                  :  request.input('harga').replace('.', ''),
                bukti_nego                  :  inpfile.fileName,                       
                user_create                 :  request.input('DOUser'),
                date_create                 :  dayjs().format('YYYY-MM-DD HH:mm:ss'),
                flag                        :  'New',
            }
        ) 

        const getidheader = await Database
                                .from('pengajuan_detail')
                                .where('id_pengajuan_detail',   request.input('idpengajuandetail'))        
                                .first(); 
        
        const getkodeexp = await Database
                                .from('pengajuan_header')
                                .where('id_pengajuan_header',   getidheader.id_pengajuan_header)        
                                .first(); 

        
        if(request.input('lokasimuat') == 'Ngoro'){
            //get teritori --> Auto di script WSA

            //get kodetujuan
            const args = { modul: "getkodetujuan", 
                            domain:getkodeexp.bu_header, 
                            inp_lok_muat:"Ngoro", 
                            tujuan: getidheader.kota_detail,
                            jnskend:request.input('jeniskendaraan'), 
                            jmlarah:request.input('jumlaharah'),
                            jmltempat:request.input('jumlahtujuan'),
                        };
            const qwsa = await getWSA(urlDBC, "getDBCAkruteMstr", args);
            if(qwsa.temp_xxakrute == null){
                var kodetujuan = 'Kode Data Tujuan Not Found';               
            }else{
                let data = qwsa.temp_xxakrute.temp_xxakruteRow;   
                var kodetujuan = data[0].tmp_xxakrute_code;              
            }            
            
        }else if(request.input('lokasimuat') == 'Cibitung' || request.input('lokasimuat') == 'Cibtiung'){
            //get kodetujuan
            const args = { modul: "getkodetujuan", 
                            domain:getkodeexp.bu_header, 
                            inp_lok_muat:"Cibitung", 
                            tujuan: getidheader.kota_detail,
                            jnskend:request.input('jeniskendaraan'), 
                            jmlarah:request.input('jumlaharah'),
                            jmltempat:request.input('jumlahtujuan'),
                        };
            const qwsa = await getWSA(urlDBC, "getDBCAkruteMstr", args);
            if(qwsa.temp_xxakrute == null){
                var kodetujuan = 'Kode Data Tujuan Not Found';               
            }else{
                let data = qwsa.temp_xxakrute.temp_xxakruteRow;   
                var kodetujuan = data[0].tmp_xxakrute_code;              
            }            

        }else if(request.input('lokasimuat') == 'Lemah Abang'){
            //get kodetujuan
            const args = { modul: "getkodetujuan", 
                            domain:getkodeexp.bu_header, 
                            inp_lok_muat:"Lemah Abang", 
                            tujuan: getidheader.kota_detail,
                            jnskend:request.input('jeniskendaraan'), 
                            jmlarah:request.input('jumlaharah'),
                            jmltempat:request.input('jumlahtujuan'),
                        };
            const qwsa = await getWSA(urlDBC, "getDBCAkruteMstr", args);
            if(qwsa.temp_xxakrute == null){
                var kodetujuan = 'Kode Data Tujuan Not Found';             
            }else{
                let data = qwsa.temp_xxakrute.temp_xxakruteRow;   
                var kodetujuan = data[0].tmp_xxakrute_code;              
            }            

        }else if(request.input('lokasimuat') == 'Karawang'){
            //get kodetujuan
            const args = { modul: "getkodetujuan", 
                            domain:getkodeexp.bu_header, 
                            inp_lok_muat:"Karawang", 
                            tujuan: getidheader.kota_detail,
                            jnskend:request.input('jeniskendaraan'), 
                            jmlarah:request.input('jumlaharah'),
                            jmltempat:request.input('jumlahtujuan'),
                        };
            const qwsa = await getWSA(urlDBC, "getDBCAkruteMstr", args);
            if(qwsa.temp_xxakrute == null){
                var kodetujuan = 'Kode Data Tujuan Not Found';              
            }else{
                let data = qwsa.temp_xxakrute.temp_xxakruteRow;   
                var kodetujuan = data[0].tmp_xxakrute_code;              
            }            

        }else if(request.input('lokasimuat') == 'DC Tangerang'){
            //get kodetujuan
            const args = { modul: "getkodetujuan", 
                            domain:getkodeexp.bu_header, 
                            inp_lok_muat:"DC Tangerang", 
                            tujuan: getidheader.kota_detail,
                            jnskend:request.input('jeniskendaraan'), 
                            jmlarah:request.input('jumlaharah'),
                            jmltempat:request.input('jumlahtujuan'),
                        };
            const qwsa = await getWSA(urlDBC, "getDBCAkruteMstr", args);
            if(qwsa.temp_xxakrute == null){
                var kodetujuan = 'Kode Data Tujuan Not Found';               
            }else{
                let data = qwsa.temp_xxakrute.temp_xxakruteRow;   
                var kodetujuan = data[0].tmp_xxakrute_code;              
            }            

        }else if(request.input('lokasimuat') == 'DC Palembang'){
            //get kodetujuan
            const args = { modul: "getkodetujuan", 
                            domain:getkodeexp.bu_header, 
                            inp_lok_muat:"DC Palembang", 
                            tujuan: getidheader.kota_detail,
                            jnskend:request.input('jeniskendaraan'), 
                            jmlarah:request.input('jumlaharah'),
                            jmltempat:request.input('jumlahtujuan'),
                        };
            const qwsa = await getWSA(urlDBC, "getDBCAkruteMstr", args);
            if(qwsa.temp_xxakrute == null){
                var kodetujuan = 'Kode Data Tujuan Not Found';               
            }else{
                let data = qwsa.temp_xxakrute.temp_xxakruteRow;   
                var kodetujuan = data[0].tmp_xxakrute_code;              
            }            

        }

        const queryupdate = await Database
        .from('pengajuan_detail')
        .where('id_pengajuan_detail', request.input('idpengajuandetail'))
        .update(
            { 
                lokasi_muat                 :  request.input('lokasimuat'),          
                kode_tujuan                 :  kodetujuan,      
                jns_kendaraan_detail        :  request.input('jeniskendaraan'),
                jml_arah_detail             :  request.input('jumlaharah'),
                jml_tempat_detail           :  request.input('jumlahtujuan'),
                fixed_detail                :  request.input('fixnonfix'),                
                status_detail               :  'YES',
                peringkat_detail            :  null,
                user_update                 :  request.input('DOUser'),
                date_update                 :  dayjs().format('YYYY-MM-DD HH:mm:ss'),
            }
        )                
        
        const getemailexp = await Database
                                .from('user')
                                .where('empid',   getkodeexp.kode_expedisi)        
                                .first(); 
        
        const getdatadetail = await Database
                                .from('pengajuan_detail')       
                                .where('id_pengajuan_detail', request.input('idpengajuandetail'))

        // Send Email ke Vendor  
        await Mail.send((message) => {
        message
            .from('system@dbc.co.id')
            .to(getemailexp.email)
            .bcc('Shendy.dewandaru@dbc.co.id')
            .bcc('rahmat.hamidin@dbc.co.id')
            .subject('Notifikasi Perubahan Harga Pengajuan Harga Transporter')              
            .htmlView('emails/Perubahan_Harga', {
            // user: { fullName: 'Some Name' },
            datadetail: getdatadetail,
            harganego: request.input('harga'),
            // url: 'https://your-app.com/verification-url',
            })
        })
        
        return response.status(200).json({
            message: "Data Nego berhasil dikirim ke Vendor",
            status: true,
        });     
    }

    public async updStatusDetail({ request, response }) { 
        // return request.input('idpengajuandetail');
        const dayjs = require('dayjs')  
        const getstatus = await Database 
                            .from('pengajuan_detail')                                
                            .select('status_detail')   
                            .where('id_pengajuan_detail', request.input('idpengajuandetail'))  
                            .first(); 
        

        if(getstatus.status_detail == 'YES'){
            var stat = 'NO';
        }else{
            var stat = 'YES';
        }

        const queryupdate = await Database
        .from('pengajuan_detail')
        .where('id_pengajuan_detail', request.input('idpengajuandetail'))
        .update(
            {                       
                status_detail               :  stat,                
                user_update                 :  request.input('DOUser'),
                date_update                 :  dayjs().format('YYYY-MM-DD HH:mm:ss'),
            }
        )
        return response.status(200).json({
            message: "Status Detail Berhasil Dirubah",
            status: true,
        });    
    }

    public async saveEditPengajuanHarga({ request, response }) { 
        // return request;
        
        const datauser = await Database
                        .from('user')
                        .where('empid',   request.input('DOUser'))        
                        .first(); 

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
                bu_approve_harga        :  datauser.domain,
                site_approve_harga      :  request.input('site'),
                level_approve_harga     :  request.input('level'),
                ket_approve_harga       :  request.input('keterangan'),
                nik_approve_harga       :  request.input('nik'),
                nama_approve_harga      :  request.input('nama'),
                email_approve_harga     :  request.input('email'),
                user_create     :  request.input('DOUser'),
                date_create     :  new Date().toLocaleString('en-GB', { timeZone: 'UTC' }),
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
                    bu_approve_harga        :  datauser.domain,
                    site_approve_harga      :  request.input('site'),
                    level_approve_harga     :  request.input('level'),
                    ket_approve_harga       :  request.input('keterangan'),
                    nik_approve_harga       :  request.input('nik'),
                    nama_approve_harga      :  request.input('nama'),
                    email_approve_harga     :  request.input('email'),
                    user_update     :  request.input('DOUser'),
                    date_update     :  new Date().toLocaleString('en-GB', { timeZone: 'UTC' }),
                }                
            )  
            
            return response.status(200).json({
                message: "Data Berhasil Diupdate",
                status: true,
            });
        }
        return 'Shendy Save';
    }

    public async deletePengajuanHarga({ request, response }) { 
        // return request;
        const res =   await Database
        .from('pengajuan_header')
        .where('id_pengajuan_header',  request.input('id_pengajuan_header'))
        .first();        
        if(res == null){           
            return response.status(406).json({
                message: "Data Tidak Ditemukan",
                status: true,
            });            
        }else{
            await Database
            .from('pengajuan_header')
            .where('id_pengajuan_header',  request.input('id_pengajuan_header'))
            .delete()

            await Database
            .from('pengajuan_detail')
            .where('id_pengajuan_header',  request.input('id_pengajuan_header'))
            .delete()
            
            return response.status(200).json({
                message: "Data Berhasil Dihapus",
                status: true,
            });
        }        
        
        

        

        return 'Shendy Delete';
    }

    public async getDetailPengajuan({ request, response }) { 

        const res =   await Database
                    .from('pengajuan_detail')
                    .where('id_pengajuan_header',  request.input('id'))                    
        return res;
    }

    public async sendPengajuanHarga({ request, response }) { 
        
        const ceklevel =   await Database
                        .from('approve_harga')
                        .where('bu_approve_harga',  request.input('bu_header'))  
                        // .where('site_approve_harga',  request.input(''))  
                        .where('level_approve_harga',  '1')  
                        .first()
        if(ceklevel == null){
            const ceklevelterendah =   await Database
                        .from('approve_harga')
                        .where('bu_approve_harga',  request.input('bu_header'))  
                        // .where('site_approve_harga',  request.input(''))     
                        .orderBy('level_approve_harga', 'asc')                     
                        .first()
            if(ceklevelterendah == null){
                // Email ke Div Head
                const qdata3 = await Database
                    .connection('mssql_hris_ext')
                    // .table('mstr_employee')
                    .from('mstr_employee')
                    .join('v_user_login', 'v_user_login.Emp_Id', '=', 'mstr_employee.id')
                    .select('mstr_employee.*')
                    .where('v_user_login.bu_id', bu_desc)
                    .where('status', 'ACTIVE')
                    .where('id_div', '4693')
                    .where('id_dept', '')
                    .first();                   
                    // NOTE: Pada script ini, bu_id pada v_user_login adalah (WDJR/ DJM/ RBG), 
                    //       sementara data yang diinput dari menu menu pengajuan harga
                    //        adalah ('Wavin Duta Jaya Rucika'/ 'Djabesmen'/ 100 / 200)
            }else{
                // Misal level terendah adalah 3, maka Informasi ke level 3, bahwa level 1 dan 2 tidak ada
            }
        }else{
            // Kirim email Ke Approval Level 1
            
        }

        const dayjs = require('dayjs')  

        const insertlog_pengajuan = await Database
        .insertQuery() // 👈 gives an instance of insert query builder
        .table('log_pengajuan')
        .insert(
            { 
                id_pengajuan_header :  request.input('id_pengajuan_header'),
                level_pengajuan     :  1,
                status_pengajuan    :  'Send',                       
                keterangan          :  null, 
                tgl_trans           :  dayjs().format('YYYY-MM-DD HH:mm:ss'), 
                user_create         :  request.input('DOUser'),                
            }
        )  
        

        return request;
    }


}
