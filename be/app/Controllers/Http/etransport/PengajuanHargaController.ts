// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from "@ioc:Adonis/Lucid/Database";
import { getWSA } from "App/Helpers/Wsa";
import Mail from '@ioc:Adonis/Addons/Mail';
import Encryption from '@ioc:Adonis/Core/Encryption';
import { senderMail } from "App/Helpers/mailSender";
import Config from '@ioc:Adonis/Core/Config';
import Env from '@ioc:Adonis/Core/Env';


export default class PengajuanHargaController {
    public async getPengajuanHarga({request, response}) {                  
        var moment = require('moment'); // require
        // return moment().format('LL');
        const page = request.input('page', 1)
        var req = request.input('filter')

        const str = request.input('empid');
        const newNPWP = str.substr(1, 15);

        const getBussinessUnit = await Database                                
                                .from('m_bisnis_unit')                                
                                .select('*')    
        
        const getDataPengajuanHeader = await Database                                
                                .from('pengajuan_header')                                
                                .select('*') 
                                // .where('user_create', request.input('empid')) 
                                .where('user_create', 'like', `%${newNPWP}`)  // Implementasi NPWP 16 digit
                                .orderBy('id_pengajuan_header','desc')
        for(const loopgetDataPengajuanHeader of getDataPengajuanHeader){
            if(loopgetDataPengajuanHeader.tanggal_berlaku_pengajuan){
                loopgetDataPengajuanHeader.tanggal_berlaku_pengajuan = moment(loopgetDataPengajuanHeader.tanggal_berlaku_pengajuan).format('DD-MM-YYYY')
            }
            if(loopgetDataPengajuanHeader.tanggal_berlaku){
                loopgetDataPengajuanHeader.tanggal_berlaku = moment(loopgetDataPengajuanHeader.tanggal_berlaku).format('DD-MM-YYYY')
            }
        }        
                                // .orderBy('id_pengajuan_header','asc')                                                                           
                                // .paginate(page, request.input('rowsPerPage'))     

        const getDataPengajuanDetail = await Database                                
                                .from('pengajuan_detail')                                
                                .select('*') 
                                // .where('user_create', request.input('empid')) 
                                .where('user_create', 'like', `%${newNPWP}`)  // Implementasi NPWP 16 digit
        
        
        for(const loopgetDataPengajuanHeader of getDataPengajuanHeader){
            const cekstatus = await Database
                                .from('log_pengajuan')                                
                                .select('status_pengajuan') 
                                .where('id_pengajuan_header', loopgetDataPengajuanHeader.id_pengajuan_header) 
                                // .where('user_create', loopgetDataPengajuanHeader.user_create) 
                                .orderBy('id_log','desc')
                                .first();
            
            const cekkodetujuan = await Database
                                .from('pengajuan_detail')                                
                                .select('kode_tujuan') 
                                .where('id_pengajuan_header', loopgetDataPengajuanHeader.id_pengajuan_header) 
                                .where('kode_tujuan', 'Kode Data Tujuan Not Found')                                 
                                .first();

            if(cekkodetujuan){  
                loopgetDataPengajuanHeader.status = 'DetailERR';                                 
            }else{
                loopgetDataPengajuanHeader.status = cekstatus.status_pengajuan;            
            }
            
        }

        return {data1:getBussinessUnit, data2:getDataPengajuanHeader, data3:getDataPengajuanDetail}          
    }

    public async getLokasiMuat({ request, response }) {     
          
        let datawsa = [];
        const args = { parDomain: request.input('bussinessunit'),  parFldName:"lokasi_muat", parDBLogical:"qaddb" };
        const qwsa = await getWSA(Env.get('LINK_WSA'), "getDBCMstGenCode", args);        
        const res = qwsa.tt_codemstr.tt_codemstrRow;        

        // let datawsa2 = [];
        // const args2 = { parDomain: request.input('bussinessunit'),  parFldName:"xxakrute_jnskend", parDBLogical:"qaddb" };
        // const qwsa2 = await getWSA(Env.get('LINK_WSA'), "getDBCMstGenCode", args2);        
        // const res2 = qwsa2.tt_codemstr.tt_codemstrRow; 
        
        // const res = await Database                                
        // .from('master_kota')                                
        // .select('*')
        // .where('mkota_domain',request.input('bussinessunit'))
        // .where('mkota_aktif', 'YES')  

        const res2 = await Database                                
        .from('master_kendaraan')                                
        .select('*')
        .where('mkend_domain',request.input('bussinessunit'))
        .where('mkend_aktif', 'YES')  


        let datawsa3 = [];
        const args3 = { parDomain: request.input('bussinessunit'),  parFldName:"xxakrute_wilayah", parDBLogical:"qaddb" };
        const qwsa3 = await getWSA(Env.get('LINK_WSA'), "getDBCMstGenCode", args3);        
        const res3 = qwsa3.tt_codemstr.tt_codemstrRow;         
        
        await Database
                .from('master_region')
                .where('bu_region',  request.input('bussinessunit'))
                .delete()

        res3.forEach(async(data) =>
        {
            const insertregion = await Database
                .insertQuery() // 👈 gives an instance of insert query builder
                .table('master_region')
                .insert(
                    { 
                        kodemstr    : data.kodemstr,
                        descmstr    : data.descmstr,  
                        bu_region   : request.input('bussinessunit'),
                    }
                )       
        });

        return {data1:res, data2:res2, data3:res3,}
    }

    public async getLokasiMuatEDIT({ request, response }) {     
        
        const getbucode = await Database 
                            .from('m_bisnis_unit')                                
                            .select('bu_code_qad')   
                            .where('bu_code_qad', request.input('bussinessunit'))    
                            .first();      
        const getregcode = await Database 
                            .from('master_region')                                
                            .select('*')   
                            .where('descmstr', request.input('region'))    
                            .first();    

        let datawsa = [];
        const args = { parDomain: getbucode.bu_code_qad,  parFldName:"lokasi_muat", parDBLogical:"qaddb" };
        const qwsa = await getWSA(Env.get('LINK_WSA'), "getDBCMstGenCode", args);        
        const res = qwsa.tt_codemstr.tt_codemstrRow;        

        // let datawsa2 = [];
        // const args2 = { parDomain: getbucode.bu_code_qad,  parFldName:"xxakrute_jnskend", parDBLogical:"qaddb" };
        // const qwsa2 = await getWSA(Env.get('LINK_WSA'), "getDBCMstGenCode", args2);        
        // const res2 = qwsa2.tt_codemstr.tt_codemstrRow;

        const res2 = await Database                                
        .from('master_kendaraan')                                
        .select('*')
        .where('mkend_domain',request.input('bussinessunit'))
        .where('mkend_aktif', 'YES')  

        let datawsa3 = [];
        const args3 = { parDomain: getbucode.bu_code_qad,  parFldName:"xxakrute_wilayah", parDBLogical:"qaddb" };
        const qwsa3 = await getWSA(Env.get('LINK_WSA'), "getDBCMstGenCode", args3);        
        const res3 = qwsa3.tt_codemstr.tt_codemstrRow;         
        
        // const res4 = await Database
        // .from('m_region')  
        // .select('kota_region') 
        // .where('bu_region', getbucode.bu_code_qad)
        // .where('region', getregcode.kodemstr)
        // .groupBy('kota_region')
        // .orderBy('kota_region', 'asc');

        const res4 = await Database                                
        .from('master_kota')                                
        .select('*')
        .where('mkota_domain',request.input('bussinessunit'))
        .where('mkota_aktif', 'YES')  
        
        return {data1:res, data2:res2, data3:res3, data4:res4}
    }

    public async getLokasiTujuan({ request, response }) {  
        let siteregion;

        if(request.input('lokasimuat') == 'Ngoro'){
            siteregion = '10040';
        }else if(request.input('lokasimuat') == 'Cibitung' || 
                request.input('lokasimuat') == 'Cibtiung' ||
                request.input('lokasimuat') == 'DC Tangerang' ||
                request.input('lokasimuat') == 'DC Palembang'
                ){    
            siteregion = '10021';
        }else if(request.input('lokasimuat') == 'Lemah Abang'){
            siteregion = '10023';
        }else if(request.input('lokasimuat') == 'Karawang'){
            siteregion = '10022';
        }else if(request.input('lokasimuat') == 'Gresik'){
            siteregion = '10050';
        }

        const res = await Database
                        .from('m_region')  
                        .select('kota_region') 
                        .where('bu_region', request.input('bussinessunit'))
                        .where('region', request.input('region'))
                        .where('site_region', siteregion)
                        .groupBy('kota_region')
                        .orderBy('kota_region', 'asc');

        // const res = await Database                                
        // .from('master_kota')                                
        // .select('*')
        // .where('mkota_domain',request.input('bussinessunit'))
        // .where('mkota_aktif', 'YES')  

        return {data1:res}
    }

    public async getLokasiTujuanEdit({ request, response }) {  
        // let siteregion;

        if(request.input('lokasimuat') == 'Ngoro'){
            siteregion = '10040';
        }else if(request.input('lokasimuat') == 'Cibitung' || 
                request.input('lokasimuat') == 'Cibtiung' ||
                request.input('lokasimuat') == 'DC Tangerang' ||
                request.input('lokasimuat') == 'DC Palembang'
                ){    
            siteregion = '10021';
        }else if(request.input('lokasimuat') == 'Lemah Abang'){
            siteregion = '10023';
        }else if(request.input('lokasimuat') == 'Karawang'){
            siteregion = '10022';
        }else if(request.input('lokasimuat') == 'Gresik'){
            siteregion = '10050';
        }

        const getheader = await Database
        .from('pengajuan_header')  
        .select('bu_header', 'region_header') 
        .where('id_pengajuan_header', request.input('id'))
        .first();

        let bucode;
        let regioncode;
        if(getheader){
            bucode = getheader.bu_header;
            regioncode = getheader.region_header;
        }

        const res = await Database
                        .from('m_region')  
                        .select('kota_region') 
                        .where('bu_region', bucode)
                        .where('region', regioncode)
                        .where('site_region', siteregion)
                        .groupBy('kota_region')
                        .orderBy('kota_region', 'asc');

        // const res = await Database                                
        // .from('master_kota')                                
        // .select('*')
        // .where('mkota_domain', bucode)
        // .where('mkota_aktif', 'YES')  

        return {data1:res}
    }

    public async getJnsKendaraan({ request, response }) {     
        
        //get jenis kendaraan

        /* 921-WDJR-2312, 20 Maret 2023 */
        let siteregion;
        if(request.input('lokasimuat') == 'Ngoro'){
            siteregion = '10040';
        }else if(request.input('lokasimuat') == 'Cibitung' || 
                request.input('lokasimuat') == 'Cibtiung' ||
                request.input('lokasimuat') == 'DC Tangerang' ||
                request.input('lokasimuat') == 'DC Palembang'
                ){    
            siteregion = '10021';
        }else if(request.input('lokasimuat') == 'Lemah Abang'){
            siteregion = '10023';
        }else if(request.input('lokasimuat') == 'Karawang'){
            siteregion = '10022';
        }else if(request.input('lokasimuat') == 'Gresik'){
            siteregion = '10050';
        }

        const args = { modul: "getJenisKendaraan", 
            domain: request.input('bussinessunit'),             
            inp_lok_muat: siteregion,
            tujuan: request.input('kotatujuan'),
        };
        const qwsa = await getWSA(Env.get('LINK_WSA'), "getDBCAkruteMstr", args);
        let data = qwsa.temp_xxakrute.temp_xxakruteRow;

        const dataKendaraan = []; 
        for (const loopdata of data) { 
            dataKendaraan.push(loopdata.tmp_xxakrute_jnskend);
        }
        
        /* 921-WDJR-2312, 20 Maret 2023 */
        // const dataKendaraan = await Database                                
        // .from('master_kendaraan')                                
        // .select('*')
        // .where('mkend_domain',request.input('bussinessunit'))
        // .where('mkend_aktif', 'YES')  

        return {data:dataKendaraan}
    }

    public async savePengajuanHarga({ request, response }) {  
        
        const dayjs = require('dayjs')       
        
        const str = request.input('DOUser');
        const newNPWP = str.substr(1, 15);

        const getbuname = await Database 
                            .from('m_bisnis_unit')                                
                            .select('*')   
                            .where('bu_code_qad', request.input('bussinessunit'))    
                            .first();      
        const getregname = await Database 
                            .from('master_region')                                
                            .select('*')   
                            .where('kodemstr', request.input('region'))     
                            .first();    
        const getexpname = await Database 
                            .from('user')                                
                            .select('*')   
                            // .where('empid', request.input('DOUser'))
                            // .where('empid', 'like', `%${request.input('DOUser')}`)  // Implementasi NPWP 16 digit 
                            .where('empid', 'like', `%${newNPWP}`)  // Implementasi NPWP 16 digit 
                            .first();       
        
        
        await Database
        .insertQuery() // 👈 gives an instance of insert query builder
        .table('pengajuan_header')
        .insert(
          { 
            kode_expedisi               :  request.input('DOUser'),
            bu_header                   :  request.input('bussinessunit'),
            region_header               :  request.input('region'),
            kategori_header             :  request.input('kategori'),
            tanggal_berlaku_pengajuan   :  request.input('tgl_berlaku'),
            // tanggal_berlaku             :  request.input('tgl_berlaku'),
            tanggal_selesai             :  null,
            user_create                 :  request.input('DOUser'),
            date_create                 :  dayjs().format('YYYY-MM-DD HH:mm:ss'),
            bu_name                     :  getbuname.bu_name,
            region_name                 :  getregname.descmstr,
            expedisi_name               :  getexpname.nama,
          }
        )        
        
        const getheaderid = await Database
                        .from('pengajuan_header')
                        .where('user_create',   request.input('DOUser'))    
                        .orderBy('id_pengajuan_header', 'desc')    
                        .first(); 
        if(getheaderid != null){  
            const headerid = getheaderid.id_pengajuan_header;
        }
         
        let vlokasimuat = null;
        
        request.input('detail').forEach(async(datadetail) =>
            {   
                let qwsa = [];                
                if(datadetail.lokasimuat == 'Ngoro'){
                    //get teritori --> Auto di script WSA

                    //get kodetujuan
                    const args = { modul: "getkodetujuan", 
                                    domain:getbuname.bu_code_qad, 
                                    inp_lok_muat:"Ngoro", 
                                    tujuan: datadetail.kotatujuan,
                                    jnskend:datadetail.jeniskendaraan, 
                                    jmlarah:datadetail.jumlaharah,
                                    jmltempat:datadetail.jumlahtujuan,
                                    fixnonfix:datadetail.fixnonfix,
                                };
                    qwsa = await getWSA(Env.get('LINK_WSA'), "getDBCAkruteMstr", args);
                    if(qwsa.temp_xxakrute == null){
                        var kodetujuan = 'Kode Data Tujuan Not Found';               
                    }else{
                        let data = qwsa.temp_xxakrute.temp_xxakruteRow;   
                        var kodetujuan = data[0].tmp_xxakrute_code;              
                    }

                    vlokasimuat = '10040';
                    
                }else if(datadetail.lokasimuat == 'Cibitung' || datadetail.lokasimuat == 'Cibtiung'){
                    //get kodetujuan
                    const args = { modul: "getkodetujuan", 
                                    domain:getbuname.bu_code_qad, 
                                    inp_lok_muat:"Cibitung", 
                                    tujuan: datadetail.kotatujuan,
                                    jnskend:datadetail.jeniskendaraan, 
                                    jmlarah:datadetail.jumlaharah,
                                    jmltempat:datadetail.jumlahtujuan,
                                    fixnonfix:datadetail.fixnonfix,
                                };
                    qwsa = await getWSA(Env.get('LINK_WSA'), "getDBCAkruteMstr", args);
                    if(qwsa.temp_xxakrute == null){
                        var kodetujuan = 'Kode Data Tujuan Not Found';               
                    }else{
                        let data = qwsa.temp_xxakrute.temp_xxakruteRow;   
                        var kodetujuan = data[0].tmp_xxakrute_code;              
                    }

                    vlokasimuat = '10021';

                }else if(datadetail.lokasimuat == 'Lemah Abang'){
                    //get kodetujuan
                    const args = { modul: "getkodetujuan", 
                                    domain:getbuname.bu_code_qad, 
                                    inp_lok_muat:"Lemah Abang", 
                                    tujuan: datadetail.kotatujuan,
                                    jnskend:datadetail.jeniskendaraan, 
                                    jmlarah:datadetail.jumlaharah,
                                    jmltempat:datadetail.jumlahtujuan,
                                    fixnonfix:datadetail.fixnonfix,
                                };
                    qwsa = await getWSA(Env.get('LINK_WSA'), "getDBCAkruteMstr", args);
                    if(qwsa.temp_xxakrute == null){
                        var kodetujuan = 'Kode Data Tujuan Not Found';             
                    }else{
                        let data = qwsa.temp_xxakrute.temp_xxakruteRow;   
                        var kodetujuan = data[0].tmp_xxakrute_code;              
                    }

                    vlokasimuat = '10023';

                }else if(datadetail.lokasimuat == 'Karawang'){
                    //get kodetujuan
                    const args = { modul: "getkodetujuan", 
                                    domain:getbuname.bu_code_qad, 
                                    inp_lok_muat:"Karawang", 
                                    tujuan: datadetail.kotatujuan,
                                    jnskend:datadetail.jeniskendaraan, 
                                    jmlarah:datadetail.jumlaharah,
                                    jmltempat:datadetail.jumlahtujuan,
                                    fixnonfix:datadetail.fixnonfix,
                                };
                    qwsa = await getWSA(Env.get('LINK_WSA'), "getDBCAkruteMstr", args);
                    if(qwsa.temp_xxakrute == null){
                        var kodetujuan = 'Kode Data Tujuan Not Found';              
                    }else{
                        let data = qwsa.temp_xxakrute.temp_xxakruteRow;   
                        var kodetujuan = data[0].tmp_xxakrute_code;              
                    }

                    vlokasimuat = '10022';

                }else if(datadetail.lokasimuat == 'DC Tangerang'){
                    //get kodetujuan
                    const args = { modul: "getkodetujuan", 
                                    domain:getbuname.bu_code_qad, 
                                    inp_lok_muat:"DC Tangerang", 
                                    tujuan: datadetail.kotatujuan,
                                    jnskend:datadetail.jeniskendaraan, 
                                    jmlarah:datadetail.jumlaharah,
                                    jmltempat:datadetail.jumlahtujuan,
                                    fixnonfix:datadetail.fixnonfix,
                                };
                    qwsa = await getWSA(Env.get('LINK_WSA'), "getDBCAkruteMstr", args);
                    if(qwsa.temp_xxakrute == null){
                        var kodetujuan = 'Kode Data Tujuan Not Found';               
                    }else{
                        let data = qwsa.temp_xxakrute.temp_xxakruteRow;   
                        var kodetujuan = data[0].tmp_xxakrute_code;              
                    }

                    vlokasimuat = '10021';

                }else if(datadetail.lokasimuat == 'DC Palembang'){
                    //get kodetujuan
                    const args = { modul: "getkodetujuan", 
                                    domain:getbuname.bu_code_qad, 
                                    inp_lok_muat:"DC Palembang", 
                                    tujuan: datadetail.kotatujuan,
                                    jnskend:datadetail.jeniskendaraan, 
                                    jmlarah:datadetail.jumlaharah,
                                    jmltempat:datadetail.jumlahtujuan,
                                    fixnonfix:datadetail.fixnonfix,
                                };
                    qwsa = await getWSA(Env.get('LINK_WSA'), "getDBCAkruteMstr", args);
                    if(qwsa.temp_xxakrute == null){
                        var kodetujuan = 'Kode Data Tujuan Not Found';               
                    }else{
                        let data = qwsa.temp_xxakrute.temp_xxakruteRow;   
                        var kodetujuan = data[0].tmp_xxakrute_code;              
                    }

                    vlokasimuat = '10021';

                }else if(datadetail.lokasimuat == 'Gresik'){
                    //get kodetujuan
                    console.log(datadetail.kotatujuan + datadetail.jeniskendaraan + datadetail.jumlaharah + datadetail.jumlahtujuan + datadetail.fixnonfix);
                    
                    const args = { modul: "getkodetujuan", 
                                    domain:getbuname.bu_code_qad, 
                                    inp_lok_muat:"Gresik", 
                                    tujuan: datadetail.kotatujuan,
                                    jnskend:datadetail.jeniskendaraan, 
                                    jmlarah:datadetail.jumlaharah,
                                    jmltempat:datadetail.jumlahtujuan,
                                    fixnonfix:datadetail.fixnonfix,
                                };
                    qwsa = await getWSA(Env.get('LINK_WSA'), "getDBCAkruteMstr", args);
                    if(qwsa.temp_xxakrute == null){
                        var kodetujuan = 'Kode Data Tujuan Not Found';               
                    }else{
                        let data = qwsa.temp_xxakrute.temp_xxakruteRow;   
                        var kodetujuan = data[0].tmp_xxakrute_code;              
                    }

                    vlokasimuat = '10050';
                }
                
                
                /* 29 Mei 2024, dicancel karena informasi user akan go live di bulan juli */
                // // 921-WDJR-2312
                // let muat1;
                // if(datadetail.lokasimuat == 'Ngoro'){
                //     muat1 = 'N';
                //     vlokasimuat = '10040';
                // }else if(datadetail.lokasimuat == 'Cibitung' || datadetail.lokasimuat == 'Cibtiung'){
                //     muat1 = 'C';
                //     vlokasimuat = '10021';
                // }else if(datadetail.lokasimuat == 'Lemah Abang'){
                //     muat1 = 'L';
                //     vlokasimuat = '10023';
                // }else if(datadetail.lokasimuat == 'Karawang'){
                //     muat1 = 'K';
                //     vlokasimuat = '10022';
                // }else if(datadetail.lokasimuat == 'DC Tangerang'){    
                //     muat1 = 'T';
                //     vlokasimuat = '10021';
                // }else if(datadetail.lokasimuat == 'DC Palembang'){
                //     muat1 = 'P';
                //     vlokasimuat = '10021';
                // }else if(datadetail.lokasimuat == 'DC Kutorejo'){
                //     muat1 = 'R';
                //     vlokasimuat = '10021';
                // }else if(datadetail.lokasimuat == 'DC Medan'){
                //     muat1 = 'M';
                //     vlokasimuat = '10021';
                // }else if(datadetail.lokasimuat == 'Gresik'){
                //     muat1 = 'G';
                //     vlokasimuat = '10050';
                // }
                
                // if(datadetail.jumlahlokasimuat == 1){
                //     datadetail.lokasimuat2 = datadetail.lokasimuat;
                // }

                // let muat2;
                // if(datadetail.lokasimuat2 == 'Ngoro'){
                //     muat2 = 'N';
                // }else if(datadetail.lokasimuat2 == 'Cibitung' || datadetail.lokasimuat2 == 'Cibtiung'){
                //     muat2 = 'C';
                // }else if(datadetail.lokasimuat2 == 'Lemah Abang'){
                //     muat2 = 'L';
                // }else if(datadetail.lokasimuat2 == 'Karawang'){
                //     muat2 = 'K';
                // }else if(datadetail.lokasimuat2 == 'DC Tangerang'){    
                //     muat2 = 'T';
                // }else if(datadetail.lokasimuat2 == 'DC Palembang'){
                //     muat2 = 'P';
                // }else if(datadetail.lokasimuat2 == 'DC Kutorejo'){
                //     muat2 = 'R';
                // }else if(datadetail.lokasimuat2 == 'DC Medan'){
                //     muat2 = 'M';
                // }else if(datadetail.lokasimuat2 == 'Gresik'){
                //     muat2 = 'G';
                // }

                // let kodeKota;
                // const getKodeKota = await Database 
                // .from('master_kota')                                
                // .select('*')   
                // .where('mkota_domain', request.input('bussinessunit'))
                // .where('mkota_nama', datadetail.kotatujuan)    
                // .first();  
                // if(getKodeKota){
                //     kodeKota = getKodeKota.mkota_kode
                // }   
                
                // let kodeKendaraan;
                // const getKodeKendaraan = await Database 
                // .from('master_kendaraan')                                
                // .select('*')   
                // .where('mkend_domain', request.input('bussinessunit'))
                // .where('mkend_nama', datadetail.jeniskendaraan)    
                // .first();  
                // if(getKodeKendaraan){
                //     kodeKendaraan = getKodeKendaraan.mkend_kode
                // } 


                // var kodetujuan = muat1 + muat2 + kodeKota + datadetail.jumlaharah + datadetail.jumlahtujuan + kodeKendaraan;

                // /*
                // const res = qwsa.temp_xxakrute.temp_xxakruteRow;
                // if(res){
                //     let dataKode = [];
                //     res.forEach(async(data) =>
                //     {                            
                //         dataKode.push(data.tmp_xxakrute_code);                     
                //     });
                    
                //     if(dataKode.includes(kodetujuan)){
                //         kodetujuan = kodetujuan;                 
                //     }else{ 
                //         kodetujuan = 'Kode Data Tujuan Not Found';                                    
                //     }
                // }else{
                //     kodetujuan = 'Kode Data Tujuan Not Found';
                // }
                // */
                
                // const args = { modul: "getkodetujuan", 
                //     domain:getbuname.bu_code_qad, 
                //     inp_lok_muat:"cekkodetujuannew", 
                //     tujuan: kodetujuan,
                //     jnskend:vlokasimuat,
                //     // kodeTujuan: kodetujuan,
                //     // siteInput: vlokasimuat,
                // };

                // // console.log(args);
                
                // const qwsa = await getWSA(Env.get('LINK_WSA'), "getDBCAkruteMstr", args);
                // // console.log(qwsa.temp_xxakrute.temp_xxakruteRow);

                
                // if(qwsa.temp_xxakrute == null){
                //     var kodetujuan = 'Kode Data Tujuan Not Found';               
                // }else{
                //     let data = qwsa.temp_xxakrute.temp_xxakruteRow;   
                //     var kodetujuan = data[0].tmp_xxakrute_code;   
                    
                //     if(kodetujuan == 'NOT FOUND'){
                //         kodetujuan = 'Kode Data Tujuan Not Found'; 
                //     }else{
                //         kodetujuan = muat1 + muat2 + kodeKota + datadetail.jumlaharah + datadetail.jumlahtujuan + kodeKendaraan;
                //     }
                // }

                // console.log(kodetujuan);                
                // return;
                           
                let hargafix = datadetail.harga.toString().replaceAll('.', '');
                
                const insertdetail = await Database
                .insertQuery() // 👈 gives an instance of insert query builder
                .table('pengajuan_detail')
                .insert(
                    { 
                        id_pengajuan_header         :  getheaderid.id_pengajuan_header,
                        tanggal_berlaku_pengajuan   :  request.input('tgl_berlaku'),
                        // tanggal_berlaku             :  request.input('tgl_berlaku'),
                        tanggal_selesai             :  null,
                        kode_tujuan                 :  kodetujuan,
                        lokasi_muat                 :  datadetail.lokasimuat,
                        lokasi_muat2                :  datadetail.lokasimuat2,
                        kota_detail                 :  datadetail.kotatujuan,
                        jns_kendaraan_detail        :  datadetail.jeniskendaraan,
                        jml_arah_detail             :  datadetail.jumlaharah,
                        jml_tempat_detail           :  datadetail.jumlahtujuan,
                        fixed_detail                :  datadetail.fixnonfix,
                        // harga_detail                :  datadetail.harga, 
                        // harga_detail                :  datadetail.harga.replace('.', ''),
                        harga_detail                :  hargafix,
                        status_detail               :  'YES',
                        peringkat_detail            :  null,
                        user_create                 :  request.input('DOUser'),
                        date_create                 :  dayjs().format('YYYY-MM-DD HH:mm:ss'),
                        site_lokasi_muat            :  vlokasimuat,
                    }
                )       
                
                const getdetailid = await Database
                        .from('pengajuan_detail')
                        .where('user_create',   request.input('DOUser'))    
                        .where('lokasi_muat',   datadetail.lokasimuat)  
                        .where('kota_detail',   datadetail.kotatujuan)  
                        .where('jns_kendaraan_detail',   datadetail.jeniskendaraan)  
                        .where('jml_arah_detail',   datadetail.jumlaharah)  
                        .where('jml_tempat_detail',   datadetail.jumlahtujuan)  
                        .orderBy('id_pengajuan_detail', 'desc')                     
                        .first();                 

                const insertnegoharga = await Database
                .insertQuery() // 👈 gives an instance of insert query builder
                .table('nego_harga')
                .insert(
                    { 
                        id_pengajuan_detail         :  getdetailid.id_pengajuan_detail,
                        // harga_nego                  :  datadetail.harga,
                        // harga_nego                  :  datadetail.harga.replace('.', ''),
                        harga_nego                  :  hargafix,
                        bukti_nego                  :  null,                       
                        user_create                 :  request.input('DOUser'),
                        date_create                 :  dayjs().format('YYYY-MM-DD HH:mm:ss'),
                        flag                        :  'New',
                        id_pengajuan_header         :  getheaderid.id_pengajuan_header,
                    }
                ) 
            }            
        )
        
        const insertlog_pengajuan = await Database
        .insertQuery() // 👈 gives an instance of insert query builder
        .table('log_pengajuan')
        .insert(
            { 
                id_pengajuan_header :  getheaderid.id_pengajuan_header,
                level_pengajuan     :  0,
                status_pengajuan    :  'Draf',                       
                keterangan          :  null, 
                tgl_trans           :  dayjs().format('YYYY-MM-DD HH:mm:ss'), 
                user_create         :  request.input('DOUser'),                
            }
        )    

        return response.status(200).json({
            message: "Data Berhasil Ditambahkan",
            status: true,
        });            
    }

    public async saveEditPengajuanHarga({ request, response }) {  
        
        const dayjs = require('dayjs')   
        
        const getbuname = await Database 
                            .from('m_bisnis_unit')                                
                            .select('*')   
                            .where('bu_code_qad', request.input('buheader'))    
                            .first();      
        const getregname = await Database 
                            .from('master_region')                                
                            .select('*')   
                            .where('kodemstr', request.input('region'))    
                            .first();      
        let idpengajuanheader = request.input('id');

        const getpengdet = await Database 
                            .from('pengajuan_detail')                                
                            .select('*')   
                            .where('id_pengajuan_header',  idpengajuanheader)
                            .first();      
        let tglbp = getpengdet.tanggal_berlaku_pengajuan;
        let tglb  = getpengdet.tanggal_berlaku;
        
        
        await Database
        .from('pengajuan_detail')
        .where('id_pengajuan_header',  idpengajuanheader)
        .delete()

        let vlokasimuat = null;
        
        request.input('detail').forEach(async(datadetail) =>
            {   
                let qwsa = [];

                if(datadetail.lokasimuat == 'Ngoro'){
                    //get teritori --> Auto di script WSA

                    //get kodetujuan
                    const args = { modul: "getkodetujuan", 
                                    domain:getbuname.bu_code_qad, 
                                    inp_lok_muat:"Ngoro", 
                                    tujuan: datadetail.kotatujuan,
                                    jnskend:datadetail.jeniskendaraan, 
                                    jmlarah:datadetail.jumlaharah,
                                    jmltempat:datadetail.jumlahtujuan,
                                    fixnonfix:datadetail.fixnonfix,
                                };
                    qwsa = await getWSA(Env.get('LINK_WSA'), "getDBCAkruteMstr", args);
                    if(qwsa.temp_xxakrute == null){
                        var kodetujuan = 'Kode Data Tujuan Not Found';               
                    }else{
                        let data = qwsa.temp_xxakrute.temp_xxakruteRow;   
                        var kodetujuan = data[0].tmp_xxakrute_code;              
                    }

                    vlokasimuat = '10040';
                    
                }else if(datadetail.lokasimuat == 'Cibitung' || datadetail.lokasimuat == 'Cibtiung'){
                    //get kodetujuan
                    const args = { modul: "getkodetujuan", 
                                    domain:getbuname.bu_code_qad, 
                                    inp_lok_muat:"Cibitung", 
                                    tujuan: datadetail.kotatujuan,
                                    jnskend:datadetail.jeniskendaraan, 
                                    jmlarah:datadetail.jumlaharah,
                                    jmltempat:datadetail.jumlahtujuan,
                                    fixnonfix:datadetail.fixnonfix,
                                };
                    qwsa = await getWSA(Env.get('LINK_WSA'), "getDBCAkruteMstr", args);
                    if(qwsa.temp_xxakrute == null){
                        var kodetujuan = 'Kode Data Tujuan Not Found';               
                    }else{
                        let data = qwsa.temp_xxakrute.temp_xxakruteRow;   
                        var kodetujuan = data[0].tmp_xxakrute_code;              
                    }

                    vlokasimuat = '10021';

                }else if(datadetail.lokasimuat == 'Lemah Abang'){
                    //get kodetujuan
                    const args = { modul: "getkodetujuan", 
                                    domain:getbuname.bu_code_qad, 
                                    inp_lok_muat:"Lemah Abang", 
                                    tujuan: datadetail.kotatujuan,
                                    jnskend:datadetail.jeniskendaraan, 
                                    jmlarah:datadetail.jumlaharah,
                                    jmltempat:datadetail.jumlahtujuan,
                                    fixnonfix:datadetail.fixnonfix,
                                };
                    qwsa = await getWSA(Env.get('LINK_WSA'), "getDBCAkruteMstr", args);
                    if(qwsa.temp_xxakrute == null){
                        var kodetujuan = 'Kode Data Tujuan Not Found';             
                    }else{
                        let data = qwsa.temp_xxakrute.temp_xxakruteRow;   
                        var kodetujuan = data[0].tmp_xxakrute_code;              
                    }

                    vlokasimuat = '10023';

                }else if(datadetail.lokasimuat == 'Karawang'){
                    //get kodetujuan
                    const args = { modul: "getkodetujuan", 
                                    domain:getbuname.bu_code_qad, 
                                    inp_lok_muat:"Karawang", 
                                    tujuan: datadetail.kotatujuan,
                                    jnskend:datadetail.jeniskendaraan, 
                                    jmlarah:datadetail.jumlaharah,
                                    jmltempat:datadetail.jumlahtujuan,
                                    fixnonfix:datadetail.fixnonfix,
                                };
                    qwsa = await getWSA(Env.get('LINK_WSA'), "getDBCAkruteMstr", args);
                    if(qwsa.temp_xxakrute == null){
                        var kodetujuan = 'Kode Data Tujuan Not Found';              
                    }else{
                        let data = qwsa.temp_xxakrute.temp_xxakruteRow;   
                        var kodetujuan = data[0].tmp_xxakrute_code;              
                    }

                    vlokasimuat = '10022';

                }else if(datadetail.lokasimuat == 'DC Tangerang'){
                    //get kodetujuan
                    const args = { modul: "getkodetujuan", 
                                    domain:getbuname.bu_code_qad, 
                                    inp_lok_muat:"DC Tangerang", 
                                    tujuan: datadetail.kotatujuan,
                                    jnskend:datadetail.jeniskendaraan, 
                                    jmlarah:datadetail.jumlaharah,
                                    jmltempat:datadetail.jumlahtujuan,
                                    fixnonfix:datadetail.fixnonfix,
                                };
                    qwsa = await getWSA(Env.get('LINK_WSA'), "getDBCAkruteMstr", args);
                    if(qwsa.temp_xxakrute == null){
                        var kodetujuan = 'Kode Data Tujuan Not Found';               
                    }else{
                        let data = qwsa.temp_xxakrute.temp_xxakruteRow;   
                        var kodetujuan = data[0].tmp_xxakrute_code;              
                    }

                    vlokasimuat = '10021';

                }else if(datadetail.lokasimuat == 'DC Palembang'){
                    //get kodetujuan
                    const args = { modul: "getkodetujuan", 
                                    domain:getbuname.bu_code_qad, 
                                    inp_lok_muat:"DC Palembang", 
                                    tujuan: datadetail.kotatujuan,
                                    jnskend:datadetail.jeniskendaraan, 
                                    jmlarah:datadetail.jumlaharah,
                                    jmltempat:datadetail.jumlahtujuan,
                                    fixnonfix:datadetail.fixnonfix,
                                };
                    qwsa = await getWSA(Env.get('LINK_WSA'), "getDBCAkruteMstr", args);
                    if(qwsa.temp_xxakrute == null){
                        var kodetujuan = 'Kode Data Tujuan Not Found';               
                    }else{
                        let data = qwsa.temp_xxakrute.temp_xxakruteRow;   
                        var kodetujuan = data[0].tmp_xxakrute_code;              
                    }

                    vlokasimuat = '10021';

                }else if(datadetail.lokasimuat == 'Gresik'){
                    //get kodetujuan
                    console.log(datadetail.kotatujuan + datadetail.jeniskendaraan + datadetail.jumlaharah + datadetail.jumlahtujuan + datadetail.fixnonfix);
                    
                    const args = { modul: "getkodetujuan", 
                                    domain:getbuname.bu_code_qad, 
                                    inp_lok_muat:"Gresik", 
                                    tujuan: datadetail.kotatujuan,
                                    jnskend:datadetail.jeniskendaraan, 
                                    jmlarah:datadetail.jumlaharah,
                                    jmltempat:datadetail.jumlahtujuan,
                                    fixnonfix:datadetail.fixnonfix,
                                };
                    qwsa = await getWSA(Env.get('LINK_WSA'), "getDBCAkruteMstr", args);
                    if(qwsa.temp_xxakrute == null){
                        var kodetujuan = 'Kode Data Tujuan Not Found';               
                    }else{
                        let data = qwsa.temp_xxakrute.temp_xxakruteRow;   
                        var kodetujuan = data[0].tmp_xxakrute_code;              
                    }

                    vlokasimuat = '10050';
                }
                
                // if(datadetail.lokasimuat == 'Ngoro'){
                //     //get teritori --> Auto di script WSA

                //     //get kodetujuan
                //     const args = { modul: "getkodetujuan", 
                //                     domain:getbuname.bu_code_qad, 
                //                     inp_lok_muat:"Ngoro", 
                //                     tujuan: datadetail.kotatujuan,
                //                     jnskend:datadetail.jeniskendaraan, 
                //                     jmlarah:datadetail.jumlaharah,
                //                     jmltempat:datadetail.jumlahtujuan,
                //                     fixnonfix:datadetail.fixnonfix,
                //                 };
                //     qwsa = await getWSA(Env.get('LINK_WSA'), "getDBCAkruteMstr", args);
                //     /* if(qwsa.temp_xxakrute == null){
                //         var kodetujuan = 'Kode Data Tujuan Not Found';               
                //     }else{
                //         let data = qwsa.temp_xxakrute.temp_xxakruteRow;   
                //         var kodetujuan = data[0].tmp_xxakrute_code;              
                //     }
                //     */

                //     vlokasimuat = '10040';
                    
                // }else if(datadetail.lokasimuat == 'Cibitung' || datadetail.lokasimuat == 'Cibtiung'){
                //     //get kodetujuan
                //     const args = { modul: "getkodetujuan", 
                //                     domain:getbuname.bu_code_qad, 
                //                     inp_lok_muat:"Cibitung", 
                //                     tujuan: datadetail.kotatujuan,
                //                     jnskend:datadetail.jeniskendaraan, 
                //                     jmlarah:datadetail.jumlaharah,
                //                     jmltempat:datadetail.jumlahtujuan,
                //                     fixnonfix:datadetail.fixnonfix,
                //                 };
                //     qwsa = await getWSA(Env.get('LINK_WSA'), "getDBCAkruteMstr", args);
                //     /* if(qwsa.temp_xxakrute == null){
                //         var kodetujuan = 'Kode Data Tujuan Not Found';               
                //     }else{
                //         let data = qwsa.temp_xxakrute.temp_xxakruteRow;   
                //         var kodetujuan = data[0].tmp_xxakrute_code;              
                //     }
                //     */

                //     vlokasimuat = '10021';

                // }else if(datadetail.lokasimuat == 'Lemah Abang'){
                //     //get kodetujuan
                //     const args = { modul: "getkodetujuan", 
                //                     domain:getbuname.bu_code_qad, 
                //                     inp_lok_muat:"Lemah Abang", 
                //                     tujuan: datadetail.kotatujuan,
                //                     jnskend:datadetail.jeniskendaraan, 
                //                     jmlarah:datadetail.jumlaharah,
                //                     jmltempat:datadetail.jumlahtujuan,
                //                     fixnonfix:datadetail.fixnonfix,
                //                 };
                //     qwsa = await getWSA(Env.get('LINK_WSA'), "getDBCAkruteMstr", args);
                //     /* if(qwsa.temp_xxakrute == null){
                //         var kodetujuan = 'Kode Data Tujuan Not Found';             
                //     }else{
                //         let data = qwsa.temp_xxakrute.temp_xxakruteRow;   
                //         var kodetujuan = data[0].tmp_xxakrute_code;              
                //     }
                //     */

                //     vlokasimuat = '10023';

                // }else if(datadetail.lokasimuat == 'Karawang'){
                //     //get kodetujuan
                //     const args = { modul: "getkodetujuan", 
                //                     domain:getbuname.bu_code_qad, 
                //                     inp_lok_muat:"Karawang", 
                //                     tujuan: datadetail.kotatujuan,
                //                     jnskend:datadetail.jeniskendaraan, 
                //                     jmlarah:datadetail.jumlaharah,
                //                     jmltempat:datadetail.jumlahtujuan,
                //                     fixnonfix:datadetail.fixnonfix,
                //                 };
                //     qwsa = await getWSA(Env.get('LINK_WSA'), "getDBCAkruteMstr", args);
                //     /* if(qwsa.temp_xxakrute == null){
                //         var kodetujuan = 'Kode Data Tujuan Not Found';              
                //     }else{
                //         let data = qwsa.temp_xxakrute.temp_xxakruteRow;   
                //         var kodetujuan = data[0].tmp_xxakrute_code;              
                //     }
                //     */

                //     vlokasimuat = '10022';

                // }else if(datadetail.lokasimuat == 'DC Tangerang'){
                //     //get kodetujuan
                //     const args = { modul: "getkodetujuan", 
                //                     domain:getbuname.bu_code_qad, 
                //                     inp_lok_muat:"DC Tangerang", 
                //                     tujuan: datadetail.kotatujuan,
                //                     jnskend:datadetail.jeniskendaraan, 
                //                     jmlarah:datadetail.jumlaharah,
                //                     jmltempat:datadetail.jumlahtujuan,
                //                     fixnonfix:datadetail.fixnonfix,
                //                 };
                //     qwsa = await getWSA(Env.get('LINK_WSA'), "getDBCAkruteMstr", args);
                //     /* if(qwsa.temp_xxakrute == null){
                //         var kodetujuan = 'Kode Data Tujuan Not Found';               
                //     }else{
                //         let data = qwsa.temp_xxakrute.temp_xxakruteRow;   
                //         var kodetujuan = data[0].tmp_xxakrute_code;              
                //     }
                //     */

                //     vlokasimuat = '10021';

                // }else if(datadetail.lokasimuat == 'DC Palembang'){
                //     //get kodetujuan
                //     const args = { modul: "getkodetujuan", 
                //                     domain:getbuname.bu_code_qad, 
                //                     inp_lok_muat:"DC Palembang", 
                //                     tujuan: datadetail.kotatujuan,
                //                     jnskend:datadetail.jeniskendaraan, 
                //                     jmlarah:datadetail.jumlaharah,
                //                     jmltempat:datadetail.jumlahtujuan,
                //                     fixnonfix:datadetail.fixnonfix,
                //                 };
                //     qwsa = await getWSA(Env.get('LINK_WSA'), "getDBCAkruteMstr", args);
                //     /* if(qwsa.temp_xxakrute == null){
                //         var kodetujuan = 'Kode Data Tujuan Not Found';               
                //     }else{
                //         let data = qwsa.temp_xxakrute.temp_xxakruteRow;   
                //         var kodetujuan = data[0].tmp_xxakrute_code;              
                //     }
                //     */

                //     vlokasimuat = '10021';

                // } else if(datadetail.lokasimuat == 'Gresik'){
                //     //get kodetujuan
                //     const args = { modul: "getkodetujuan", 
                //                     domain:getbuname.bu_code_qad, 
                //                     inp_lok_muat:"Gresik", 
                //                     tujuan: datadetail.kotatujuan,
                //                     jnskend:datadetail.jeniskendaraan, 
                //                     jmlarah:datadetail.jumlaharah,
                //                     jmltempat:datadetail.jumlahtujuan,
                //                     fixnonfix:datadetail.fixnonfix,
                //                 };
                //     qwsa = await getWSA(Env.get('LINK_WSA'), "getDBCAkruteMstr", args);
                //     /* if(qwsa.temp_xxakrute == null){
                //         var kodetujuan = 'Kode Data Tujuan Not Found';               
                //     }else{
                //         let data = qwsa.temp_xxakrute.temp_xxakruteRow;   
                //         var kodetujuan = data[0].tmp_xxakrute_code;              
                //     }
                //     */

                //     vlokasimuat = '10050';

                // } 

                /*
                // 921-WDJR-2312
                let muat1;
                if(datadetail.lokasimuat == 'Ngoro'){
                    muat1 = 'N';
                    vlokasimuat = '10040';
                }else if(datadetail.lokasimuat == 'Cibitung' || datadetail.lokasimuat == 'Cibtiung'){
                    muat1 = 'C';
                    vlokasimuat = '10021';
                }else if(datadetail.lokasimuat == 'Lemah Abang'){
                    muat1 = 'L';
                    vlokasimuat = '10023';
                }else if(datadetail.lokasimuat == 'Karawang'){
                    muat1 = 'K';
                    vlokasimuat = '10022';
                }else if(datadetail.lokasimuat == 'DC Tangerang'){    
                    muat1 = 'T';
                    vlokasimuat = '10021';
                }else if(datadetail.lokasimuat == 'DC Palembang'){
                    muat1 = 'P';
                    vlokasimuat = '10021';
                }else if(datadetail.lokasimuat == 'DC Kutorejo'){
                    muat1 = 'R';
                    vlokasimuat = '10021';
                }else if(datadetail.lokasimuat == 'DC Medan'){
                    muat1 = 'M';
                    vlokasimuat = '10021';
                }else if(datadetail.lokasimuat == 'Gresik'){
                    muat1 = 'G';
                    vlokasimuat = '10050';
                }
                
                if(datadetail.jumlahlokasimuat == 1){
                    datadetail.lokasimuat2 = datadetail.lokasimuat;
                }

                let muat2;
                if(datadetail.lokasimuat2 == 'Ngoro'){
                    muat2 = 'N';
                }else if(datadetail.lokasimuat2 == 'Cibitung' || datadetail.lokasimuat2 == 'Cibtiung'){
                    muat2 = 'C';
                }else if(datadetail.lokasimuat2 == 'Lemah Abang'){
                    muat2 = 'L';
                }else if(datadetail.lokasimuat2 == 'Karawang'){
                    muat2 = 'K';
                }else if(datadetail.lokasimuat2 == 'DC Tangerang'){    
                    muat2 = 'T';
                }else if(datadetail.lokasimuat2 == 'DC Palembang'){
                    muat2 = 'P';
                }else if(datadetail.lokasimuat2 == 'DC Kutorejo'){
                    muat2 = 'R';
                }else if(datadetail.lokasimuat2 == 'DC Medan'){
                    muat2 = 'M';
                }else if(datadetail.lokasimuat2 == 'Gresik'){
                    muat2 = 'G';
                }

                let kodeKota;
                const getKodeKota = await Database 
                .from('master_kota')                                
                .select('*')   
                .where('mkota_domain', request.input('buheader'))
                .where('mkota_nama', datadetail.kotatujuan)    
                .first();  
                if(getKodeKota){
                    kodeKota = getKodeKota.mkota_kode
                }   
                
                let kodeKendaraan;
                const getKodeKendaraan = await Database 
                .from('master_kendaraan')                                
                .select('*')   
                .where('mkend_domain', request.input('buheader'))
                .where('mkend_nama', datadetail.jeniskendaraan)    
                .first();  
                if(getKodeKendaraan){
                    kodeKendaraan = getKodeKendaraan.mkend_kode
                } 


                var kodetujuan = muat1 + muat2 + kodeKota + datadetail.jumlaharah + datadetail.jumlahtujuan + kodeKendaraan;

                const res = qwsa.temp_xxakrute.temp_xxakruteRow;
                if(res){
                    let dataKode = [];
                    res.forEach(async(data) =>
                    {                            
                        dataKode.push(data.tmp_xxakrute_code);                     
                    });
                    
                    if(dataKode.includes(kodetujuan)){
                        kodetujuan = kodetujuan;                 
                    }else{ 
                        kodetujuan = 'Kode Data Tujuan Not Found';                                    
                    }
                }else{
                    kodetujuan = 'Kode Data Tujuan Not Found';
                }
                */
                
                let hargafix = datadetail.harga.toString().replaceAll('.', '');

                const insertdetail = await Database
                .insertQuery() // 👈 gives an instance of insert query builder
                .table('pengajuan_detail')
                .insert(
                    { 
                        id_pengajuan_header         :  idpengajuanheader,
                        tanggal_berlaku_pengajuan   :  tglbp,
                        // tanggal_berlaku             :  tglb,
                        tanggal_selesai             :  null,
                        kode_tujuan                 :  kodetujuan,
                        lokasi_muat                 :  datadetail.lokasimuat,
                        lokasi_muat2                :  datadetail.lokasimuat2,
                        kota_detail                 :  datadetail.kotatujuan,
                        jns_kendaraan_detail        :  datadetail.jeniskendaraan,
                        jml_arah_detail             :  datadetail.jumlaharah,
                        jml_tempat_detail           :  datadetail.jumlahtujuan,
                        fixed_detail                :  datadetail.fixnonfix,
                        // harga_detail                :  datadetail.harga,
                        // harga_detail                :  datadetail.harga.toString().replace('.', ''),
                        harga_detail                :  hargafix,                        
                        status_detail               :  'YES',
                        peringkat_detail            :  null,
                        user_create                 :  request.input('DOUser'),
                        date_create                 :  dayjs().format('YYYY-MM-DD HH:mm:ss'),
                        site_lokasi_muat            :  vlokasimuat,
                    }
                )                
                
                const getdetailid = await Database
                        .from('pengajuan_detail')
                        .where('user_create',   request.input('DOUser'))    
                        .where('lokasi_muat',   datadetail.lokasimuat)  
                        .where('kota_detail',   datadetail.kotatujuan)  
                        .where('jns_kendaraan_detail',   datadetail.jeniskendaraan)  
                        .where('jml_arah_detail',   datadetail.jumlaharah)  
                        .where('jml_tempat_detail',   datadetail.jumlahtujuan)  
                        .orderBy('id_pengajuan_detail', 'desc')    
                        .first();                 

                const insertnegoharga = await Database
                .insertQuery() // 👈 gives an instance of insert query builder
                .table('nego_harga')
                .insert(
                    { 
                        id_pengajuan_detail         :  getdetailid.id_pengajuan_detail,
                        // harga_nego                  :  datadetail.harga,
                        // harga_nego                  :  datadetail.harga.toString().replace('.', ''),
                        harga_nego                  :  hargafix,
                        // harga_nego                  :  datadetail.harga,
                        bukti_nego                  :  null,                       
                        user_create                 :  request.input('DOUser'),
                        date_create                 :  dayjs().format('YYYY-MM-DD HH:mm:ss'),
                        flag                        :  'New',
                        id_pengajuan_header         :  idpengajuanheader,
                    }
                ) 
                // console.log(insertnegoharga);
            }            
        )
        
        const insertlog_pengajuan = await Database
        .insertQuery() // 👈 gives an instance of insert query builder
        .table('log_pengajuan')
        .insert(
            { 
                id_pengajuan_header :  idpengajuanheader,
                level_pengajuan     :  0,
                status_pengajuan    :  'Draf',                       
                keterangan          :  null, 
                tgl_trans           :  dayjs().format('YYYY-MM-DD HH:mm:ss'), 
                user_create         :  request.input('DOUser'),                
            }
        )    

        return response.status(200).json({
            message: "Data Berhasil Diupdate",
            status: true,
        });            


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
        var moment = require('moment'); // require
        const res =   await Database
                    .from('pengajuan_detail')
                    .where('id_pengajuan_header',  request.input('id'))   
                    
        for(const loopres of res){
            if(loopres.tanggal_berlaku_pengajuan){
                loopres.tanggal_berlaku_pengajuan = moment(loopres.tanggal_berlaku_pengajuan).format('DD-MM-YYYY')
            }
        } 
        console.log(res);
              
        return res;
    }

    public async sendPengajuanHarga({ request, response }) {     
        const sender = await senderMail();
        const mailConfig = Config.get('mail');

        mailConfig.mailers.smtp.host = sender[0].ms_host;
        mailConfig.mailers.smtp.auth.user = sender[0].ms_name;
        mailConfig.mailers.smtp.auth.pass = sender[0].ms_pass;
             
        const getbuname =   await Database
                        .from('m_bisnis_unit')
                        .where('bu_code_qad',  request.input('bu_header'))  
                        .first()

        let site = null;
        const getdatadetail =  await Database
                        .from('pengajuan_detail')
                        .where('id_pengajuan_header',  request.input('id_pengajuan_header'))  
        for (const loopgetdatadetail of getdatadetail){
            if(loopgetdatadetail.lokasi_muat == 'Ngoro'){
                site = '10040';
            }else if(loopgetdatadetail.lokasi_muat == 'Cibitung' || loopgetdatadetail.lokasi_muat == 'DC Tangerang' || loopgetdatadetail.lokasi_muat == 'DC Palembang'){
                site = '10021';
            }else if(loopgetdatadetail.lokasi_muat == 'Lemah Abang'){
                site = '10023';
            }else if(loopgetdatadetail.lokasi_muat == 'Karawang'){
                site = '10022';
            }else if(loopgetdatadetail.lokasi_muat == 'Gresik'){
                site = '10050';
            }else{
                site = '0';
            }

            const ceklevel =   await Database
                        .from('approve_harga')
                        .where('bu_approve_harga',  request.input('bu_header'))  
                        .where('siteqad_approve_harga', site)  
                        .where('level_approve_harga',  '1')  
                        .first()
            if(ceklevel == null){
                // return 'NULL';
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
                        .where('v_user_login.bu_id', getbuname.bu_code)
                        .where('status', 'ACTIVE')
                        .where('id_div', '4693')
                        .where('id_dept', '')
                        .first();   
                        if(qdata3){

                            let mailto;
                            if(Env.get('NODE_ENV') == 'production'){
                                mailto = qdata3.email;
                            }else{
                                mailto = Env.get('EMAIL_DUMMY');                                
                            }

                            await Mail.send((message) => {
                            message
                                .from('system@dbc.co.id')
                                // .to(qdata3.email)
                                .to(mailto)
                                .bcc('Shendy.dewandaru@dbc.co.id')
                                .bcc('rahmat.hamidin@dbc.co.id')
                                .subject('Notifikasi PIC Approval Belum Terdaftar')              
                                .htmlView('emails/notifikasi_approval_no_pic', {
                                    user: { fullName: qdata3.nama },
                                    email: { email: qdata3.email},
                                    data:{
                                        userforlogin: qdata3.id,
                                        nikuserforlogin: qdata3.nik,
                                        modul: 'PICApproval',
                                    },                                
                                    // url: `http://localhost:8080/#/Autologin/${qdata3.nik}`,
                                    // url: `http://localhost:8080/#/Autologin/PICApproval/${qdata3.nik}`,
                                    // url: `https://app-proc.dbc.co.id/#/Autologin/PICApproval/${qdata3.nik}`,
                                    url: `${Env.get('LINK_FRONTEND_PROC')}#/Autologin/PICApproval/${qdata3.nik}`,
                                    // url: `${Env.get('LINK_FRONTEND')}register_form/${uuidVend}/${dataVend.sup_code_app}/form1`;
                                })
                            })
                        }else{
                            // // Jika Tidak ada Div Headnya
                            let mailto;
                            if(Env.get('NODE_ENV') == 'production'){
                                mailto = qdata3.email;
                            }else{
                                mailto = Env.get('EMAIL_DUMMY');                                
                            }

                            await Mail.send((message) => {
                            message
                                .from('system@dbc.co.id')
                                // .to(qdata3.email)
                                .to(mailto)                                .bcc('Shendy.dewandaru@dbc.co.id')
                                .bcc('rahmat.hamidin@dbc.co.id')
                                .subject('[Div Head Not Found] Notifikasi PIC Approval Belum Terdaftar')              
                                .htmlView('emails/notifikasi_approval_no_pic', {
                                user: { fullName: '[DIV HEAD NOT FOUND]' },
                                // url: 'http://localhost:8080/#/PICApproval',
                                // url: 'https://app-proc.dbc.co.id/#/PICApproval',
                                url: `${Env.get('LINK_FRONTEND_PROC')}#/PICApproval`,
                                })
                            })
                        }               
                        
                    return response.status(406).json({
                        message: "PIC Approval Belum Ada, Silahkan Hubungi Tim Purchasing Terkait",
                        status: true,
                    });     
                }else{
                    // Misal level terendah adalah 3, maka Informasi ke level 3, bahwa level 1 dan 2 tidak ada   
                    let mailto;
                    if(Env.get('NODE_ENV') == 'production'){
                        mailto = ceklevelterendah.email;
                    }else{
                        mailto = Env.get('EMAIL_DUMMY');                                
                    }
                    
                    await Mail.send((message) => {
                        message
                        .from('system@dbc.co.id')
                        // .to(ceklevelterendah.email)
                        .to(mailto)
                        .bcc('Shendy.dewandaru@dbc.co.id')
                        .bcc('rahmat.hamidin@dbc.co.id')
                        .subject('Notifikasi PIC Approval Level 1 Belum Terdaftar')              
                        .htmlView('emails/notifikasi_approval_no_level1', {
                        user: { fullName: ceklevelterendah.nama_approve_harga },
                        // url: `http://localhost:8080/#/Autologin/PICApproval/${ceklevelterendah.nik_approve_harga}`,
                        // url: `https://app-proc.dbc.co.id/#/Autologin/PICApproval/${ceklevelterendah.nik_approve_harga}`,
                        url: `${Env.get('LINK_FRONTEND_PROC')}#/Autologin/PICApproval/${ceklevelterendah.nik_approve_harga}`,                     
                        })
                    })

                    return response.status(406).json({
                        message: "PIC Approval Belum Lengkap, Silahkan Hubungi Tim Purchasing Terkait",
                        status: true,
                    }); 
                }
                
            }else{
                
                const encryptedID = Encryption.encrypt(request.input('id_pengajuan_header'))            
                var decryptedID = Encryption.decrypt(encryptedID)  

                const str = request.input('kode_expedisi');
                const newNPWP = str.substr(1, 15);

                const getvendname =   await Database
                            .from('user')
                            // .where('empid',  request.input('kode_expedisi'))
                            // .where('empid', 'like', `%${request.input('kode_expedisi')}`)  // Implementasi NPWP 16 digit 
                            .where('empid', 'like', `%${newNPWP}`)  // Implementasi NPWP 16 digit 
                            // .where('site_approve_harga',  request.input(''))  
                            .first()
                

                // Kirim email Ke Approval Level 1
                let mailto;
                if(Env.get('NODE_ENV') == 'production'){
                    mailto = ceklevel.email_approve_harga;
                }else{
                    mailto = Env.get('EMAIL_DUMMY');                                
                }
 
                await Mail.send((message) => {
                message
                    .from('system@dbc.co.id')
                    .to(mailto)   
                    .bcc('Shendy.dewandaru@dbc.co.id')
                    .bcc('rahmat.hamidin@dbc.co.id')
                    .subject('Notifikasi Pengajuan Harga Transporter dari Vendor')
                    .htmlView('emails/pengajuan_fr_vendor', {
                        user: { fullName: ceklevel.nama_approve_harga },
                        namavendor: getvendname.nama,
                        regionname: request.input('region_name'),
                        kategoriheader: request.input('kategori_header')
                    })
                })
            }
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
        
        return response.status(200).json({
            message: "Data Request Berhasil Diajukan",
            status: true,
        });        
    }

}
