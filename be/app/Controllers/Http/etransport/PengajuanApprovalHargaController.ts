// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from "@ioc:Adonis/Lucid/Database";
const urlDBC = "https://qssiptdldb07.odqad.com:8143/wsa/wsadbc/wsdl?targetURI=urn:services-qad-com:wsadbc:0001";
import { getWSA } from "App/Helpers/Wsa";
import Mail from '@ioc:Adonis/Addons/Mail';
import Encryption from '@ioc:Adonis/Core/Encryption';

export default class PengajuanApprovalHargaController {

    public async getPengajuanApprovalHarga({request, response}) {   
        var moment = require('moment'); // require

        const datauser = await Database
        .from('user')
        .where('empid', request.input('empid'))        
        .first(); 

        datauser.domain = '100';
        datauser.domain = request.input('domain');

        var res = [];
        const args = { parDomain: datauser.domain,  parFldName:"xxakrute_wilayah", parDBLogical:"qaddb" };
        const qwsa = await getWSA(urlDBC, "getDBCMstGenCode", args);
        if(qwsa.tt_codemstr == null){
            res = [];               
        }else{
            res = qwsa.tt_codemstr.tt_codemstrRow;               
        }

        var siteapprover
        const ceksiteapprover = await Database
        .from('approve_harga')
        // .where('DO_approve_harga',   request.input('DOUser'))        
        .where('DO_approve_harga',   request.input('empid'))        
        .first(); 
        if(ceksiteapprover){
            siteapprover = ceksiteapprover.siteqad_approve_harga;   
        }else{
            siteapprover = 0;   
        }
        
        
        const getlevel1 = await Database
        .from('approve_harga')                
        .where('bu_approve_harga', datauser.domain)               
        .where('siteqad_approve_harga', siteapprover)
        .where('level_approve_harga', '1')
        .first();   
        if(getlevel1){
            var level1 = getlevel1.DO_approve_harga;
        }else{
            var level1 = null;
        }
                
        const getlevel2 = await Database
        .from('approve_harga')                
        .where('bu_approve_harga', datauser.domain)  
        .where('siteqad_approve_harga', siteapprover)             
        .where('level_approve_harga', '2')
        .first();   

        if(getlevel2){
            var level2 = getlevel2.DO_approve_harga;
        }else{
            var level2 = null;
        }        
        
        const getdata = await Database        
        .from('rekap_pengajuan_header')                           
        .select('rekap_pengajuan_header.*')
        .where('bu_rekap', datauser.domain)               
        .where('rekap_pengajuan_header.user_create', level1)        
        .orWhere('rekap_pengajuan_header.user_create', level2)
        .orderBy('id_rekap_header','desc')
        // .where('rekap_pengajuan_header.user_create', 'DO164647')        

        for (const element of getdata) {
            const getstatus = await Database        
                        .from('log_approval')                               
                        .select('status_rekap')
                        .where('id_rekap_header', element.id_rekap_header)               
                        .orderBy('id_log','desc')
                        .first()  
            if(getstatus){
                element.status = getstatus.status_rekap;   
            }else{
                element.status = '';   
            }
            if(element.tgl_pengajuan){
                element.tgl_pengajuan = moment(element.tgl_pengajuan).format('DD-MM-YYYY')
            }
            
        }        
                                                                           
        return {data1:res, data2:getdata}          
    }

    public async generatePengajuanApproval({request, response}) {          
        const datauser = await Database
        .from('user')
        .where('empid',   request.input('DOUser'))        
        .first(); 

        const ceksiteapprover = await Database
        .from('approve_harga')
        .where('DO_approve_harga',   request.input('DOUser'))        
        .first(); 
        let siteapprover = ceksiteapprover.siteqad_approve_harga;        

        datauser.domain = '100';
        datauser.domain = request.input('domain');

        let title = [];        
        title.push({ title: "Tujuan", no: "Tujuan" });

        const kodeekspedisi = await Database
                    .from('pengajuan_header')
                    .join('pengajuan_detail', 'pengajuan_detail.id_pengajuan_header', '=', 'pengajuan_header.id_pengajuan_header')
                    .join('log_pengajuan', 'log_pengajuan.id_pengajuan_header', '=', 'pengajuan_header.id_pengajuan_header')
                    .select('pengajuan_header.kode_expedisi', 'pengajuan_header.expedisi_name')                                                    
                    .where('pengajuan_header.bu_header', datauser.domain) 
                    .where('pengajuan_header.region_header', request.input('region')) 
                    .where('pengajuan_header.kategori_header', request.input('kategori')) 
                    .where('pengajuan_detail.status_detail', 'YES') 
                    .where('pengajuan_detail.site_lokasi_muat', siteapprover)                     
                    .where('log_pengajuan.status_pengajuan', 'Send') 
                    .groupBy('pengajuan_header.kode_expedisi','pengajuan_header.expedisi_name')  
        // return kodeekspedisi;
        // return kodeekspedisi;
        for (const iterator of kodeekspedisi) {
            title.push({ title: "History Harga", no: "History Harga"});
            title.push({ title: "History Stuff", no: "History Stuff"});
            title.push({ title: "Deal Baru Harga Penawaran", no: "Deal Baru Harga Penawaran"});
            title.push({ title: "Deal Baru Harga Nego", no: "Deal Baru Harga Nego"});
            title.push({ title: "Deal Stuff", no: "Deal Stuff"});
            title.push({ title: "Naik Turun", no: "Naik Turun"});
            title.push({ title: "Kendaraan", no: "Kendaraan"});
            // title.push({ title: "KodeExpedisi", no: iterator.kode_expedisi});
        }
        

        let detexp = [];  
        detexp.push({ detexp: "Tujuan", no: "Tujuan" });  
        detexp.push({ detexp: "History Harga", no: "History Harga"});
        detexp.push({ detexp: "History Stuff", no: "History Stuff"});
        detexp.push({ detexp: "Deal Baru Harga Penawaran", no: "Deal Baru Harga Penawaran"});
        detexp.push({ detexp: "Deal Baru Harga Nego", no: "Deal Baru Harga Nego"});
        detexp.push({ detexp: "Deal Stuff", no: "Deal Stuff"});
        detexp.push({ detexp: "Naik Turun", no: "Naik Turun"});
        detexp.push({ detexp: "Kendaraan", no: "Kendaraan"});    

        const qdata = await Database
                    .from('pengajuan_header')
                    .join('pengajuan_detail', 'pengajuan_detail.id_pengajuan_header', '=', 'pengajuan_header.id_pengajuan_header')
                    .join('log_pengajuan', 'log_pengajuan.id_pengajuan_header', '=', 'pengajuan_header.id_pengajuan_header')
                    .select('pengajuan_detail.kota_detail', 'pengajuan_detail.lokasi_muat','pengajuan_detail.jns_kendaraan_detail')                                                    
                    .where('pengajuan_header.bu_header', datauser.domain) 
                    .where('pengajuan_header.region_header', request.input('region')) 
                    .where('pengajuan_header.kategori_header', request.input('kategori')) 
                    // .where('pengajuan_header.region_header', '10') 
                    // .where('pengajuan_header.kategori_header', 'Darat') 
                    .where('pengajuan_detail.status_detail', 'YES') 
                    .where('pengajuan_detail.site_lokasi_muat', siteapprover)  
                    .where('log_pengajuan.status_pengajuan', 'Send') 
                    .groupBy('pengajuan_detail.kota_detail', 'pengajuan_detail.lokasi_muat','pengajuan_detail.jns_kendaraan_detail')                                                            
        let tmpArray1 = [];
        var vlokasi;
        var vekspedisi;     

        for (const iterator of qdata) { // looping kota tujuan
            let tmpArray = [];
            vlokasi = 0;
            const kodeekspedisi = await Database
            .from('pengajuan_header')
            .join('pengajuan_detail', 'pengajuan_detail.id_pengajuan_header', '=', 'pengajuan_header.id_pengajuan_header')
            .join('log_pengajuan', 'log_pengajuan.id_pengajuan_header', '=', 'pengajuan_header.id_pengajuan_header')
            .select('pengajuan_header.kode_expedisi')                                                      
            .where('pengajuan_header.bu_header', datauser.domain) 
            .where('pengajuan_header.region_header', request.input('region')) 
            .where('pengajuan_header.kategori_header', request.input('kategori')) 
            // .where('pengajuan_header.region_header', '10') 
            // .where('pengajuan_header.kategori_header', 'Darat') 
            .where('pengajuan_detail.status_detail', 'YES') 
            .where('log_pengajuan.status_pengajuan', 'Send') 
            .groupBy('pengajuan_header.kode_expedisi')    

            vekspedisi = 1;
            for (const iteratorexp of kodeekspedisi) { //looping ekspedisi                                
                for (const iterator1 of detexp) { // looping data header
                    let tmpdata = null;                                     
                    const gethistharga = await Database
                                .from('pengajuan_header')
                                .join('pengajuan_detail', 'pengajuan_detail.id_pengajuan_header', '=', 'pengajuan_header.id_pengajuan_header')
                                .join('log_pengajuan', 'log_pengajuan.id_pengajuan_header', '=', 'pengajuan_header.id_pengajuan_header')
                                .select('pengajuan_detail.harga_detail', 'pengajuan_detail.tanggal_berlaku','pengajuan_detail.kode_tujuan')    
                                .where('lokasi_muat',   iterator.lokasi_muat)        
                                .where('kota_detail',   iterator.kota_detail)        
                                .where('jns_kendaraan_detail', iterator.jns_kendaraan_detail)        
                                .where('kode_expedisi',   iteratorexp.kode_expedisi)                                        
                                .where('pengajuan_detail.tanggal_selesai', null)                                
                                .where('log_pengajuan.status_pengajuan', 'Full_Approve') 
                                .first(); 
                    var historyharga;
                    var historystuff;
                    if(gethistharga){ 
                        historyharga = gethistharga.harga_detail 
                        historystuff = gethistharga.tanggal_berlaku 
                    }else{                                                                            
                        historyharga = 0 
                        historystuff = '';
                    }
                    // console.log(gethistharga);

                    const getdatadealbaru = await Database
                    .from('pengajuan_header')
                    .join('pengajuan_detail', 'pengajuan_detail.id_pengajuan_header', '=', 'pengajuan_header.id_pengajuan_header')                    
                    .select('pengajuan_detail.harga_detail', 'pengajuan_detail.tanggal_berlaku', 'pengajuan_detail.id_pengajuan_detail', 'pengajuan_detail.jns_kendaraan_detail', 'pengajuan_detail.kode_tujuan')    
                    // .where('id_pengajuan_header', '')                    
                    .where('lokasi_muat',   iterator.lokasi_muat)
                    .where('kota_detail',   iterator.kota_detail)        
                    .where('jns_kendaraan_detail', iterator.jns_kendaraan_detail)        
                    .where('kode_expedisi',   iteratorexp.kode_expedisi)  
                    .where('pengajuan_detail.status_detail', 'YES') 
                    .orderBy('pengajuan_detail.id_pengajuan_detail','desc')                                  
                    .first(); 
                    // console.log(getdatadealbaru);
                    var hargapenawaran;
                    var iddetail;
                    var tglstuff;
                    var kendaraan;
                    if(getdatadealbaru){ 
                        hargapenawaran = getdatadealbaru.harga_detail
                        iddetail = getdatadealbaru.id_pengajuan_detail
                        tglstuff = getdatadealbaru.tanggal_berlaku
                        kendaraan = getdatadealbaru.jns_kendaraan_detail  
                        
                        if(historystuff == '' && historyharga == 0){                         
                            let datawsa = [];
                            const args = { modul: 'getharga', 
                                            domain: datauser.domain,  
                                            expedisi: iteratorexp.kode_expedisi, 
                                            kodetujuan: getdatadealbaru.kode_tujuan };
                            const qwsa = await getWSA(urlDBC, "getDBCAkhrgMstr", args);                            
                            if(qwsa.temp_xxakhrg == null){
                                datawsa = [];               
                            }else{
                                datawsa = qwsa.temp_xxakhrg.temp_xxakhrgRow;
                                historystuff = datawsa[0].tmp_xxakhrg_start;
                                historyharga = datawsa[0].tmp_xxakhrg_hrg;
                            }  
                        }
                    }else{
                        hargapenawaran = 0
                        iddetail = 0
                        tglstuff = ''
                        kendaraan = ''
                    }                    

                    const getdatanego = await Database
                    .from('nego_harga')                    
                    .where('id_pengajuan_detail',  iddetail)        
                    .where('flag',   'New')                            
                    .first(); 
                    var harganego;
                    if(getdatanego){
                        harganego = getdatanego.harga_nego
                    }else{
                        harganego = 0;
                    }
                    
                    // console.log(vlokasi);
                    // console.log(iterator1)
                    if (iterator1.detexp == "Tujuan") {                        
                        // tmpdata = historyharga + iterator.lokasi_muat + iterator.kota_detail + iterator.jns_kendaraan_detail;                        
                        if(vlokasi == 0 && vekspedisi == 1){
                            tmpdata = iterator.kota_detail;
                            vlokasi = 1;
                            vekspedisi = vekspedisi + 1;
                        }
                    }                    

                    if (iterator1.detexp == "History Harga") {                        
                        // tmpdata = iterator.kota_detail;
                        tmpdata = historyharga;
                    }
                    else if (iterator1.detexp == "History Stuff") {
                        // tmpdata = 'Nilai History Stuff' + iteratorexp.kode_expedisi;
                        tmpdata = historystuff;
                    }                     
                    else if (iterator1.detexp == "Deal Baru Harga Penawaran") {
                        // tmpdata = 'Harga Penawaran' + iteratorexp.kode_expedisi;
                        tmpdata = hargapenawaran;
                    }  
                    else if (iterator1.detexp == "Deal Baru Harga Nego") {
                        // tmpdata = 'Harga Nego' + iteratorexp.kode_expedisi;
                        tmpdata = harganego;
                    }    
                    else if (iterator1.detexp == "Deal Stuff") {
                        // tmpdata = 'Stuff' + iteratorexp.kode_expedisi;
                        tmpdata = tglstuff;
                    }     
                    else if (iterator1.detexp == "Naik Turun") {
                        // tmpdata = 'Naik Turun' + iteratorexp.kode_expedisi;
                        tmpdata = harganego - historyharga;
                    }                    
                    else if (iterator1.detexp == "Kendaraan") {
                        // tmpdata = 'Kendaraan' + iteratorexp.kode_expedisi;
                        tmpdata = kendaraan;
                    }     
                    tmpArray.push(tmpdata);
                }          
            }
            
            var tmpArrayNonNull = tmpArray.filter(function (e) {return e != null;});
            // console.log(tmpArrayNonNull);
            tmpArray1.push(tmpArrayNonNull);
        }  
        // return tmpArray1; 
        
        
        var tmpArrayfin1 = [];
        var tmpArrayfin2 = [];
        for (const loopkodeekspedisi of kodeekspedisi) {  
            tmpArrayfin1 = []            
            // tmpArrayfin1.push(loopkodeekspedisi.kode_expedisi)
            const getname = await Database                                         
                        .from('user')
                        .where('empid', loopkodeekspedisi.kode_expedisi)   
                        .first() 
            if(getname){
                tmpArrayfin1.push(getname.nama)
            }
            tmpArrayfin2.push(tmpArrayfin1);
        }    
        // return kodeekspedisi;

        var moment = require('moment'); // require
        // var i = 0;
        // for(const looptmpArray1 of tmpArray1){
        //     i++;
        // }
        // var qexp = 0;
        // for(const loopqdata of qdata){
        //     qexp++;
        // }

        // var dt = 2;
        // for (let x = 0; x < i; x++) {
        //     dt = 2;
        //     for(let y = 0; y < qexp; y++){
        //         if(tmpArray1[x][dt] != ''){
        //             tmpArray1[x][dt] = moment(tmpArray1[x][dt]).format('DD-MM-YYYY')    
        //             console.log(x + '*' + dt);          
        //         } 
        //         console.log(x + '*' + y + '*' + dt);  
        //         dt = dt + 3;                
        //     }                        
        // }

        // var moment = require('moment'); // require
        var i = 0;
        var i2 = 0;
        for(const looptmpArray1 of tmpArray1){
            i++;
            i2++;
        }
        var qexp = 0;
        var qexp2= 0;
        for(const loopqdata of qdata){
            qexp++;
            qexp2++;
        }
        

        var dt = 2;
        var yy = 0;
        for (let x = 0; x < i; x++) {            
            yy = 0;
            console.log(x);
            for(let y = 0; y < qexp; y++){ 
                // yy = y; 
                console.log(x + '* y = ' + y + ' yy = '+ yy)      
                if(yy == y){
                    for(let z = 1; z <= 2; z++){                    
                        if(z == 1){             
                            dt = 2;           
                        }
                        if(z == 2){
                            dt = dt + 3;                        
                        }
                        if(tmpArray1[x][dt] != ''){
                            tmpArray1[x][dt] = moment(tmpArray1[x][dt]).format('DD-MM-YYYY')                                
                        } 
                        console.log('Row ' + x + ' Exp: ' + y + ' Edit Tgl :' + z + ' Kolom Nomor: ' + dt);
                    }
                }else{
                    dt = dt + 4;
                    for(let z = 1; z <= 2; z++){                    
                        if(z == 2){
                            dt = dt + 3;                        
                        }
                        if(tmpArray1[x][dt] != ''){
                            tmpArray1[x][dt] = moment(tmpArray1[x][dt]).format('DD-MM-YYYY')                                
                        } 
                        console.log('Row ' + x + ' Exp: ' + y + ' Edit Tgl :' + z + ' Kolom Nomor: ' + dt);
                    } 
                }                                
            }              
        }  
        
        var nb = 1;
        var bb = 0;
        for (let a = 0; a < i2; a++) {    
            bb = 0;
            for(let b = 0; b < qexp2; b++){     
                if(bb == b){
                    for(let c = 1; c <= 4; c++){                    
                        if(c == 1){             
                            nb = 1;           
                        }
                        if(c == 2){
                            nb = nb + 2;                        
                        }
                        if(c == 3){
                            nb = nb + 1;                        
                        }
                        if(c == 4){
                            nb = nb + 2;                        
                        }
                        if(tmpArray1[a][nb] != ''){                             
                            tmpArray1[a][nb] = (new Intl.NumberFormat('en-CA', {style:'decimal'}).format(tmpArray1[a][nb]));                            
                        } 
                        // console.log('Row ' + x + ' Exp: ' + y + ' Edit Tgl :' + z + ' Kolom Nomor: ' + dt);
                    }
                }else{
                    nb = nb + 2;
                    for(let c = 1; c <= 4; c++){                    
                        if(c == 2){
                            nb = nb + 2;                        
                        }
                        if(c == 3){
                            nb = nb + 1;                        
                        }
                        if(c == 4){
                            nb = nb + 2;                        
                        }
                        if(tmpArray1[a][nb] != ''){
                            // tmpArray1[a][nb] = moment(tmpArray1[a][nb]).format('DD-MM-YYYY')  
                            tmpArray1[a][nb] = (new Intl.NumberFormat('en-CA', {style:'decimal'}).format(tmpArray1[a][nb]));                               
                        } 
                        // console.log('Row ' + x + ' Exp: ' + y + ' Edit Tgl :' + z + ' Kolom Nomor: ' + dt);
                    } 
                }    
                        
            }
            
        }


        return {data1:qdata, kodeekspedisi:kodeekspedisi, header:title, detail:tmpArray1}
    }


    public async savePengajuanApprovalHarga({request, response}) {
        
       

        const ceksiteapprover = await Database
        .from('approve_harga')
        .where('DO_approve_harga',   request.input('DOUser'))        
        .first(); 
        let siteapprover = ceksiteapprover.siteqad_approve_harga;         

        await Database
        .from('temp_rekap_pengajuan_det2')        
        .where('temp_user_create', request.input('DOUser'))        
        .delete()

        const dayjs = require('dayjs')  
          
        const datauser = await Database
        .from('user')
        .where('empid', request.input('DOUser'))        
        .first(); 

        datauser.domain = '100';
        datauser.domain = request.input('domain');

        const qdatax = await Database
        .from('pengajuan_header')
        .join('pengajuan_detail', 'pengajuan_detail.id_pengajuan_header', '=', 'pengajuan_header.id_pengajuan_header')
        .join('log_pengajuan', 'log_pengajuan.id_pengajuan_header', '=', 'pengajuan_header.id_pengajuan_header')
        .select('*')                                                    
        .where('pengajuan_header.bu_header', datauser.domain) 
        .where('pengajuan_header.region_header', request.input('region')) 
        .where('pengajuan_header.kategori_header', request.input('kategori')) 
        // .where('pengajuan_header.region_header', '10') 
        // .where('pengajuan_header.kategori_header', 'Darat') 
        .where('pengajuan_detail.site_lokasi_muat', siteapprover)  
        .where('pengajuan_detail.status_detail', 'YES') 
        .where('log_pengajuan.status_pengajuan', 'Send')         
        // .groupBy('pengajuan_detail.kota_detail', 'pengajuan_detail.lokasi_muat','pengajuan_detail.jns_kendaraan_detail')
        for(const loopqdatax of qdatax){
            if(loopqdatax.kode_tujuan == 'Kode Data Tujuan Not Found'){
                return response.status(406).json({
                    message: "Kode Tujuan Tidak Ditemukan untuk Pengajuan Expedisi " + loopqdatax.expedisi_name + " Ke Lokasi " + loopqdatax.kota_detail + " dengan Kendaraan " + loopqdatax.jns_kendaraan_detail,
                    status: true,
                });
            }
        }        

        const ceknumb = await Database
        .from('autonumber')
        .where('bu', datauser.domain)        
        .first(); 
        if(ceknumb){
            const getlastnumb = await Database
                            .from('autonumber')
                            .where('bu', datauser.domain)
                            .orderBy('rowid','desc')
                            .first();

            var lastnumb = getlastnumb.seq.toString();
        }else{
            const insertrekappengajuanheader = await Database
            .insertQuery() // 👈 gives an instance of insert query builder
            .table('autonumber')
            .insert(
                {                 
                    bu          : datauser.domain,
                    seq         : 1,     
                    last_mod    : dayjs().format('YYYY-MM-DD HH:mm:ss'),              
                }
            )   
            var lastnumb = '1';
        }

        const queryupdate = await Database
        .from('autonumber')
        .where('bu', datauser.domain)
        .update(
            {                       
                seq               :  parseInt(lastnumb) + 1,                                
                last_mod          :  dayjs().format('YYYY-MM-DD HH:mm:ss'),
            }
        )
        

        const apprlv2 = await Database
                        .from('approve_harga')
                        .where('bu_approve_harga', datauser.domain)
                        .where('siteqad_approve_harga', siteapprover)        
                        .where('level_approve_harga', '2')        
                        .first(); 
        if(apprlv2){
            var approverlv2 = apprlv2.nik_approve_harga;
            var vDOApprover = apprlv2.DO_approve_harga;
        }else{
            var approverlv2 = null;
            var vDOApprover = null;
        }

        const getregiondesc = await Database
                        .from('master_region')
                        .where('kodemstr', request.input('region'))        
                        .where('bu_region', datauser.domain)                                       
                        .first();         
        const insertrekappengajuanheader = await Database
        .insertQuery() // 👈 gives an instance of insert query builder
        .table('rekap_pengajuan_header')
        .insert(
            {                 
                no_rekap_header : datauser.domain + dayjs().format('YY') + lastnumb.padStart(4, '0') ,
                tgl_pengajuan   : dayjs().format('YYYY-MM-DD'),     
                bu_rekap        : datauser.domain,
                region_rekap    : request.input('region'),
                kategori_rekap  : request.input('kategori'),
                keterangan      : request.input('keterangan'),
                // approver        : approverlv2,
                user_create     : request.input('DOUser'),
                date_create     : dayjs().format('YYYY-MM-DD HH:mm:ss'),                
                region_desc     : getregiondesc.descmstr,
                // DOApprover      : vDOApprover,
            }
        ) 
        
        const getheaderid = await Database
        .from('rekap_pengajuan_header')
        .where('no_rekap_header', datauser.domain + dayjs().format('YY') + lastnumb.padStart(4, '0'))        
        .first(); 

        let idheader = getheaderid.id_rekap_header
        
        const qdata = await Database
        .from('pengajuan_header')
        .join('pengajuan_detail', 'pengajuan_detail.id_pengajuan_header', '=', 'pengajuan_header.id_pengajuan_header')
        .join('log_pengajuan', 'log_pengajuan.id_pengajuan_header', '=', 'pengajuan_header.id_pengajuan_header')
        .select('pengajuan_detail.kota_detail', 'pengajuan_detail.lokasi_muat','pengajuan_detail.jns_kendaraan_detail')                                                    
        .where('pengajuan_header.bu_header', datauser.domain) 
        .where('pengajuan_header.region_header', request.input('region')) 
        .where('pengajuan_header.kategori_header', request.input('kategori')) 
        // .where('pengajuan_header.region_header', '10') 
        // .where('pengajuan_header.kategori_header', 'Darat') 
        .where('pengajuan_detail.site_lokasi_muat', siteapprover)  
        .where('pengajuan_detail.status_detail', 'YES') 
        .where('log_pengajuan.status_pengajuan', 'Send')         
        .groupBy('pengajuan_detail.kota_detail', 'pengajuan_detail.lokasi_muat','pengajuan_detail.jns_kendaraan_detail')
        
        for (const iterator of qdata) { // looping kota tujuan            

            const insertrekappengajuandet1 = await Database
            .insertQuery() // 👈 gives an instance of insert query builder
            .table('rekap_pengajuan_det1')
            .insert(
                {                 
                    id_rekap_header             : idheader,
                    lokasi_muat_rekap_detail    : iterator.lokasi_muat,     
                    tujuan_rekap_detail         : iterator.kota_detail,
                    jns_kendaraan_rekap_detail  : iterator.jns_kendaraan_detail,
                    user_create     :  request.input('DOUser'),
                    date_create     :  dayjs().format('YYYY-MM-DD HH:mm:ss'),                
                }
            ) 

            const getdet1id = await Database
            .from('rekap_pengajuan_det1')
            .where('lokasi_muat_rekap_detail', iterator.lokasi_muat)  
            .where('tujuan_rekap_detail', iterator.kota_detail)  
            .where('jns_kendaraan_rekap_detail', iterator.jns_kendaraan_detail)  
            .where('id_rekap_header', idheader)
            .orderBy('id_rekap_det1', 'desc')      
            .first(); 
    
            let iddet1 = getdet1id.id_rekap_det1

            const kodeekspedisi = await Database
            .from('pengajuan_header')
            .join('pengajuan_detail', 'pengajuan_detail.id_pengajuan_header', '=', 'pengajuan_header.id_pengajuan_header')
            .join('log_pengajuan', 'log_pengajuan.id_pengajuan_header', '=', 'pengajuan_header.id_pengajuan_header')
            // .select('pengajuan_header.kode_expedisi', 'pengajuan_header.id_pengajuan_header') 
            .select('pengajuan_header.kode_expedisi')                                                      
            .where('pengajuan_header.bu_header', datauser.domain) 
            .where('pengajuan_header.region_header', request.input('region')) 
            .where('pengajuan_header.kategori_header', request.input('kategori')) 
            // .where('pengajuan_header.region_header', '10') 
            // .where('pengajuan_header.kategori_header', 'Darat') 
            .where('pengajuan_detail.status_detail', 'YES') 
            .where('log_pengajuan.status_pengajuan', 'Send') 
            // .groupBy('pengajuan_header.kode_expedisi', 'pengajuan_header.id_pengajuan_header')
            .groupBy('pengajuan_header.kode_expedisi')            
            for (const iteratorexp of kodeekspedisi) { //looping ekspedisi     
                console.log(kodeekspedisi);     
                const getfortemp = await Database
                .from('pengajuan_header')
                .join('pengajuan_detail', 'pengajuan_detail.id_pengajuan_header', '=', 'pengajuan_header.id_pengajuan_header')
                .join('log_pengajuan', 'log_pengajuan.id_pengajuan_header', '=', 'pengajuan_header.id_pengajuan_header')
                .select('*')    
                .where('lokasi_muat',   iterator.lokasi_muat)        
                .where('kota_detail',   iterator.kota_detail)        
                .where('jns_kendaraan_detail', iterator.jns_kendaraan_detail)        
                .where('kode_expedisi',   iteratorexp.kode_expedisi)                                                                                     
                .where('log_pengajuan.status_pengajuan', 'Send')
                .where('pengajuan_detail.status_detail', 'YES')  
                .orderBy('id_pengajuan_detail','desc')
                .first(); 
                var iddetailsend;
                if(getfortemp){
                    iddetailsend = getfortemp.id_pengajuan_detail
                }else{
                    iddetailsend = null
                }
                console.log(iddetailsend);

                // console.log(iterator.lokasi_muat + iterator.kota_detail + iterator.jns_kendaraan_detail + iteratorexp.kode_expedisi + getfortemp);
                const getfortemp2 = await Database
                .from('pengajuan_header')
                .join('pengajuan_detail', 'pengajuan_detail.id_pengajuan_header', '=', 'pengajuan_header.id_pengajuan_header')
                .join('log_pengajuan', 'log_pengajuan.id_pengajuan_header', '=', 'pengajuan_header.id_pengajuan_header')
                .select('*')    
                .where('lokasi_muat',   iterator.lokasi_muat)        
                .where('kota_detail',   iterator.kota_detail)        
                .where('jns_kendaraan_detail', iterator.jns_kendaraan_detail)        
                .where('kode_expedisi',   iteratorexp.kode_expedisi)                                                                                     
                .where('log_pengajuan.status_pengajuan', 'Full_Approve') 
                .first(); 

                var iddetailfullapp;
                if(getfortemp2){
                    iddetailfullapp = getfortemp2.id_pengajuan_detail
                }else{
                    iddetailfullapp = null
                }

                const getdatanego = await Database
                .from('nego_harga')                    
                .where('id_pengajuan_detail',  iddetailsend)        
                .where('flag',   'New')                            
                .first();  
                var idnego;
                var harganego;
                if(getdatanego){
                    idnego = getdatanego.id_nego;
                    harganego = getdatanego.harga_nego;
                }else{
                    idnego = null;
                    harganego = 0;
                }
                
                const getexpname = await Database                                         
                        .from('user')
                        .where('empid', iteratorexp.kode_expedisi)   
                        .first() 
                let expname = getexpname.nama;

                if(iddetailsend != null){
                    const inserttemprekappengajuandet2 = await Database
                    .insertQuery() // 👈 gives an instance of insert query builder
                    .table('rekap_pengajuan_det2')
                    .insert(
                        {                                         
                            id_rekap_det1           : iddet1,     
                            id_pengajuan_detail     : iddetailsend,
                            id_pengajuan_detail_bef : iddetailfullapp,
                            id_nego                 : idnego,
                            id_rekap_header         : idheader,   
                            // temp_peringkat_rekap_detail  :,
                            nego_harga     : harganego,
                            kode_exp       : iteratorexp.kode_expedisi,
                            user_create    : request.input('DOUser'), 
                            expedisi_name  : expname,                       
                            
                        }
                    ) 
                }
                
            }
        }
        
        const cekdatatemp2 = await Database
        .from('rekap_pengajuan_det2')        
        .select('id_rekap_det1')    
        .where('user_create', request.input('DOUser'))
        .groupBy('id_rekap_det1')    
        
        for (const iteratorx of cekdatatemp2) { 
            var peringkat = 0;
            const cekdatatemp3 = await Database
                .from('rekap_pengajuan_det2')        
                .select('*')    
                .where('user_create', request.input('DOUser'))
                .where('id_rekap_det1', iteratorx.id_rekap_det1)
                .orderBy([
                    {
                      column: 'nego_harga',
                      order: 'asc',
                    },
                    {
                      column: 'kode_exp',
                      order: 'asc',
                    }
                ])
            
                peringkat = 1;
                for (const iteratorcekdatatemp3 of cekdatatemp3) { 
                    const update = await Database
                        .from('rekap_pengajuan_det2')
                        .where('id_rekap_det2', iteratorcekdatatemp3.id_rekap_det2)
                        .update(
                            { peringkat_rekap_detail: peringkat }                
                        )  
                    peringkat++
                }

        }


       

        const insertlogapproval = await Database
        .insertQuery() // 👈 gives an instance of insert query builder
        .table('log_approval')
        .insert(
            {                 
                id_rekap_header : idheader,
                level_rekap     : 0,     
                status_rekap    : 'Draf',
                keterangan      : null,
                tgl_trans       : dayjs().format('YYYY-MM-DD HH:mm:ss'),          
                user_create     : request.input('DOUser'),                
            }
        ) 

        
        return response.status(200).json({
            message: "Data Berhasil Digenerate",
            status: true,
        });
             
    }

    public async deletePengajuanApprovalHarga({request, response}) {

        await Database
            .from('rekap_pengajuan_header')
            .where('id_rekap_header',  request.input('id_rekap_header'))
            .delete()
        
        const getdatadet1 = await Database        
            .from('rekap_pengajuan_det1')                  
            .select('*')
            .where('id_rekap_header', request.input('id_rekap_header'))  
                    
        for (const iterator of getdatadet1) {
            await Database
            .from('rekap_pengajuan_det2')
            .where('id_rekap_det1', iterator.id_rekap_det1)
            .delete()            
        }

        await Database
            .from('rekap_pengajuan_det1')
            .where('id_rekap_header',  request.input('id_rekap_header'))
            .delete()
        
        await Database
            .from('log_approval')
            .where('id_rekap_header',  request.input('id_rekap_header'))
            .delete()
           
        return response.status(200).json({
            message: "Data Berhasil Dihapus",
            status: true,
        });

    }

    public async viewPengajuanApprovalHarga({request, response}) {
        // let number = 1234567.89;

        
        // console.group(number);
        // console.log(new Intl.NumberFormat('en-CA', {style:'decimal'}).format(number));
        // return 
        // return currency(1);
        
        var moment = require('moment'); // require

        let title = [];        
        title.push({ title: "Tujuan", no: "Tujuan" });

        const qdata = await Database
        .from('rekap_pengajuan_det2')        
        .select('kode_exp', 'expedisi_name')                                                    
        .where('rekap_pengajuan_det2.id_rekap_header', request.input('id_rekap_header'))   
        .groupBy('kode_exp', 'expedisi_name')

        // console.log(qdata)
        for (const loopqdata of qdata) { // looping data header
            title.push({ title: "History Harga", no: "History Harga"});
            title.push({ title: "History Stuff", no: "History Stuff"});
            title.push({ title: "Deal Baru Harga Penawaran", no: "Deal Baru Harga Penawaran"});
            title.push({ title: "Deal Baru Harga Nego", no: "Deal Baru Harga Nego"});
            title.push({ title: "Deal Stuff", no: "Deal Stuff"});
            title.push({ title: "Naik Turun", no: "Naik Turun"});
            title.push({ title: "Kendaraan", no: "Kendaraan"});
            // console.log(loopqdata.kode_exp)
        }

        let detexp = [];          
        detexp.push({ detexp: "History Harga", no: "History Harga"});
        detexp.push({ detexp: "History Stuff", no: "History Stuff"});
        detexp.push({ detexp: "Deal Baru Harga Penawaran", no: "Deal Baru Harga Penawaran"});
        detexp.push({ detexp: "Deal Baru Harga Nego", no: "Deal Baru Harga Nego"});
        detexp.push({ detexp: "Deal Stuff", no: "Deal Stuff"});
        detexp.push({ detexp: "Naik Turun", no: "Naik Turun"});
        detexp.push({ detexp: "Kendaraan", no: "Kendaraan"});  


        let tmpArray1 = [];
        const qdatadet = await Database
        .from('rekap_pengajuan_det1')        
        .select('*')                                                    
        .where('rekap_pengajuan_det1.id_rekap_header', request.input('id_rekap_header'))   

        for (const loopqdatadet of qdatadet) {
            let tmpArray = [];
            let tmpdata = null;  
            tmpdata = loopqdatadet.tujuan_rekap_detail;
            tmpArray.push(tmpdata);

            for (const loopqdata of qdata) { // looping data header
                for(const loopdetexp of detexp){


                    // const gethistharga = await Database
                    //             .from('pengajuan_header')
                    //             .join('pengajuan_detail', 'pengajuan_detail.id_pengajuan_header', '=', 'pengajuan_header.id_pengajuan_header')
                    //             .join('log_pengajuan', 'log_pengajuan.id_pengajuan_header', '=', 'pengajuan_header.id_pengajuan_header')
                    //             .select('pengajuan_detail.harga_detail', 'pengajuan_detail.tanggal_berlaku')    
                    //             .where('lokasi_muat',   loopqdatadet.lokasi_muat_rekap_detail)        
                    //             .where('kota_detail',   loopqdatadet.tujuan_rekap_detail)        
                    //             .where('jns_kendaraan_detail', loopqdatadet.jns_kendaraan_rekap_detail)        
                    //             .where('kode_expedisi',   loopqdata.kode_exp)                                        
                    //             .where('pengajuan_detail.tanggal_selesai', null)                                
                    //             .where('log_pengajuan.status_pengajuan', 'Full_Approve') 
                    //             .first(); 
                    const gethistharga = await Database
                    .from('rekap_pengajuan_det2')
                    .select('id_pengajuan_detail_bef')
                    .where('id_rekap_det1',   loopqdatadet.id_rekap_det1)        
                    .where('kode_exp',  loopqdata.kode_exp)          
                    .first();
                    var historyharga;
                    var historystuff;
                    var idbefore
                    if(gethistharga){ 
                        idbefore = gethistharga.id_pengajuan_detail_bef;

                        const getdataidbef = await Database
                        .from('pengajuan_detail')                        
                        .select('*')                            
                        .where('id_pengajuan_detail',   idbefore) 
                        .first()                               
                        if(getdataidbef){
                            historyharga = getdataidbef.harga_detail;
                            historystuff = getdataidbef.tanggal_berlaku; 
                        }else{
                            historyharga = 0;
                            historystuff = ''; 
                        }
                    }else{ 
                        historyharga = 0 
                        historystuff = '';
                    }

                    const getdatadealbaru = await Database
                    .from('rekap_pengajuan_det2')
                    .select('id_pengajuan_detail')
                    .where('id_rekap_det1',   loopqdatadet.id_rekap_det1)        
                    .where('kode_exp',  loopqdata.kode_exp)          
                    .first();
                    var hargapenawaran;
                    var iddetail;
                    var tglstuff;
                    var kendaraan;
                    if(getdatadealbaru){ 

                        const getdatadealbaru2 = await Database
                        .from('pengajuan_detail')                        
                        .select('*')                            
                        .where('id_pengajuan_detail',   getdatadealbaru.id_pengajuan_detail) 
                        .first()   
                        if(getdatadealbaru2){
                            hargapenawaran = getdatadealbaru2.harga_detail
                            tglstuff = getdatadealbaru2.tanggal_berlaku
                            kendaraan = getdatadealbaru2.jns_kendaraan_detail

                            if(historystuff == '' && historyharga == 0){                         
                                let datawsa = [];
                                const args = { modul: 'getharga', 
                                                domain: request.input('bu_rekap'),  
                                                expedisi: loopqdata.kode_exp, 
                                                kodetujuan: getdatadealbaru2.kode_tujuan };
                                const qwsa = await getWSA(urlDBC, "getDBCAkhrgMstr", args);                            
                                if(qwsa.temp_xxakhrg == null){
                                    datawsa = [];               
                                }else{
                                    datawsa = qwsa.temp_xxakhrg.temp_xxakhrgRow;
                                    historystuff = datawsa[0].tmp_xxakhrg_start;
                                    historyharga = datawsa[0].tmp_xxakhrg_hrg;
                                }  
                            }
                        }else{
                            hargapenawaran = 0
                            tglstuff = ''
                            kendaraan = ''
                        }
                    }else{
                        hargapenawaran = 0                        
                        tglstuff = ''
                        kendaraan = ''
                    }


                    const getnegohargaforview = await Database
                    .from('rekap_pengajuan_det2')                    
                    .select('nego_harga')    
                    .where('id_rekap_det1',   loopqdatadet.id_rekap_det1)              
                    .where('kode_exp',   loopqdata.kode_exp)                                       
                    .first(); 

                    var negoharga;
                    if(getnegohargaforview){
                        negoharga = getnegohargaforview.nego_harga
                    }else{
                        negoharga = 0;
                    }

                    if (loopdetexp.detexp == "History Harga") {                        
                        // tmpdata = iterator.kota_detail;
                        tmpdata = historyharga;
                    }
                    else if (loopdetexp.detexp == "History Stuff") {
                        // tmpdata = 'Nilai History Stuff' + iteratorexp.kode_expedisi;
                        tmpdata = historystuff;
                    }                     
                    else if (loopdetexp.detexp == "Deal Baru Harga Penawaran") {
                        // tmpdata = 'Harga Penawaran' + iteratorexp.kode_expedisi;
                        tmpdata = hargapenawaran;
                    }  
                    else if (loopdetexp.detexp == "Deal Baru Harga Nego") {
                        // tmpdata = 'Harga Nego' + iteratorexp.kode_expedisi;
                        tmpdata = negoharga;
                    }    
                    else if (loopdetexp.detexp == "Deal Stuff") {
                        // tmpdata = 'Stuff' + iteratorexp.kode_expedisi;
                        tmpdata = tglstuff;
                    }     
                    else if (loopdetexp.detexp == "Naik Turun") {
                        // tmpdata = 'Naik Turun' + iteratorexp.kode_expedisi;
                        tmpdata = negoharga - historyharga;
                    }                    
                    else if (loopdetexp.detexp == "Kendaraan") {
                        // tmpdata = 'Kendaraan' + iteratorexp.kode_expedisi;
                        tmpdata = kendaraan;
                    }     
                    tmpArray.push(tmpdata);
                }
            }
            tmpArray1.push(tmpArray);
        }

        // var tmpArrayfin1 = [];
        // var tmpArrayfin2 = [];
        // for (const loopqdata of qdata) {  
        //     tmpArrayfin1 = []            
        //     // tmpArrayfin1.push(loopkodeekspedisi.kode_expedisi)
        //     const getname = await Database                                         
        //                 .from('user')
        //                 .where('empid', loopqdata.kode_exp)   
        //                 .first() 
        //     if(getname){
        //         tmpArrayfin1.push(getname.nama)
        //     }
        //     tmpArrayfin2.push(tmpArrayfin1);
        // }    

        var i = 0;
        var i2 = 0;
        for(const looptmpArray1 of tmpArray1){
            i++;
            i2++;
        }
        var qexp = 0;
        var qexp2= 0;
        for(const loopqdata of qdata){
            qexp++;
            qexp2++;
        }

        // var currency = require('currency'); // require

        // console.log( currency(tmpArray1[1][3], { separator: ',' }).format() );
        // return;

        var dt = 2;
        var yy = 0;
        for (let x = 0; x < i; x++) {            
            yy = 0;
            console.log(x);
            for(let y = 0; y < qexp; y++){ 
                // yy = y; 
                console.log(x + '* y = ' + y + ' yy = '+ yy)      
                if(yy == y){
                    for(let z = 1; z <= 2; z++){                    
                        if(z == 1){             
                            dt = 2;           
                        }
                        if(z == 2){
                            dt = dt + 3;                        
                        }
                        if(tmpArray1[x][dt] != ''){
                            tmpArray1[x][dt] = moment(tmpArray1[x][dt]).format('DD-MM-YYYY')                                
                        } 
                        console.log('Row ' + x + ' Exp: ' + y + ' Edit Tgl :' + z + ' Kolom Nomor: ' + dt);
                    }
                }else{
                    dt = dt + 4;
                    for(let z = 1; z <= 2; z++){                    
                        if(z == 2){
                            dt = dt + 3;                        
                        }
                        if(tmpArray1[x][dt] != ''){
                            tmpArray1[x][dt] = moment(tmpArray1[x][dt]).format('DD-MM-YYYY')                                
                        } 
                        console.log('Row ' + x + ' Exp: ' + y + ' Edit Tgl :' + z + ' Kolom Nomor: ' + dt);
                    } 
                }                                
            }              
        }   

        var nb = 1;
        var bb = 0;
        for (let a = 0; a < i2; a++) {    
            bb = 0;
            for(let b = 0; b < qexp2; b++){     
                if(bb == b){
                    for(let c = 1; c <= 4; c++){                    
                        if(c == 1){             
                            nb = 1;           
                        }
                        if(c == 2){
                            nb = nb + 2;                        
                        }
                        if(c == 3){
                            nb = nb + 1;                        
                        }
                        if(c == 4){
                            nb = nb + 2;                        
                        }
                        if(tmpArray1[a][nb] != ''){                             
                            tmpArray1[a][nb] = (new Intl.NumberFormat('en-CA', {style:'decimal'}).format(tmpArray1[a][nb]));                            
                        } 
                        // console.log('Row ' + x + ' Exp: ' + y + ' Edit Tgl :' + z + ' Kolom Nomor: ' + dt);
                    }
                }else{
                    nb = nb + 2;
                    for(let c = 1; c <= 4; c++){                    
                        if(c == 2){
                            nb = nb + 2;                        
                        }
                        if(c == 3){
                            nb = nb + 1;                        
                        }
                        if(c == 4){
                            nb = nb + 2;                        
                        }
                        if(tmpArray1[a][nb] != ''){
                            // tmpArray1[a][nb] = moment(tmpArray1[a][nb]).format('DD-MM-YYYY')  
                            tmpArray1[a][nb] = (new Intl.NumberFormat('en-CA', {style:'decimal'}).format(tmpArray1[a][nb]));                               
                        } 
                        // console.log('Row ' + x + ' Exp: ' + y + ' Edit Tgl :' + z + ' Kolom Nomor: ' + dt);
                    } 
                }    
                        
            }
            
        }
        
        var vketerangan  = null;
        const getketerangan = await Database
        .from('rekap_pengajuan_header')        
        .select('keterangan')                                                    
        .where('id_rekap_header', request.input('id_rekap_header'))  
        .first()
        if(getketerangan){
            vketerangan = getketerangan.keterangan;
        }else{
            vketerangan = null;
        }      
        
        return {kodeekspedisi:qdata, header:title, detail:tmpArray1, keterangan:vketerangan}
    }

    public async regeneratePengajuanApprovalHarga({request, response}) {          
        
        var moment = require('moment'); // require

        const datauser = await Database
        .from('user')
        .where('empid',   request.input('user_create'))        
        .first(); 

        const ceksiteapprover = await Database
        .from('approve_harga')
        .where('DO_approve_harga',   request.input('user_create'))        
        .first(); 
        let siteapprover = ceksiteapprover.siteqad_approve_harga;

        datauser.domain = '100';
        datauser.domain = request.input('bu_rekap');
        
        let title = [];        
        title.push({ title: "Tujuan", no: "Tujuan" });

        const kodeekspedisi = await Database
                    .from('pengajuan_header')
                    .join('pengajuan_detail', 'pengajuan_detail.id_pengajuan_header', '=', 'pengajuan_header.id_pengajuan_header')
                    .join('log_pengajuan', 'log_pengajuan.id_pengajuan_header', '=', 'pengajuan_header.id_pengajuan_header')
                    .select('pengajuan_header.kode_expedisi', 'pengajuan_header.expedisi_name')                                                    
                    .where('pengajuan_header.bu_header', datauser.domain) 
                    .where('pengajuan_header.region_header', request.input('region_rekap')) 
                    .where('pengajuan_header.kategori_header', request.input('kategori_rekap')) 
                    // .where('pengajuan_header.region_header', '10') 
                    // .where('pengajuan_header.kategori_header', 'Darat') 
                    .where('pengajuan_detail.status_detail', 'YES') 
                    .where('pengajuan_detail.site_lokasi_muat', siteapprover)    
                    .where('log_pengajuan.status_pengajuan', 'Send') 
                    .groupBy('pengajuan_header.kode_expedisi', 'pengajuan_header.expedisi_name')      
                    // return 'disini';  
        for (const iterator of kodeekspedisi) {
            title.push({ title: "History Harga", no: "History Harga"});
            title.push({ title: "History Stuff", no: "History Stuff"});
            title.push({ title: "Deal Baru Harga Penawaran", no: "Deal Baru Harga Penawaran"});
            title.push({ title: "Deal Baru Harga Nego", no: "Deal Baru Harga Nego"});
            title.push({ title: "Deal Stuff", no: "Deal Stuff"});
            title.push({ title: "Naik Turun", no: "Naik Turun"});
            title.push({ title: "Kendaraan", no: "Kendaraan"});
            // title.push({ title: "KodeExpedisi", no: iterator.kode_expedisi});
        }

        let detexp = [];  
        detexp.push({ detexp: "Tujuan", no: "Tujuan" });  
        detexp.push({ detexp: "History Harga", no: "History Harga"});
        detexp.push({ detexp: "History Stuff", no: "History Stuff"});
        detexp.push({ detexp: "Deal Baru Harga Penawaran", no: "Deal Baru Harga Penawaran"});
        detexp.push({ detexp: "Deal Baru Harga Nego", no: "Deal Baru Harga Nego"});
        detexp.push({ detexp: "Deal Stuff", no: "Deal Stuff"});
        detexp.push({ detexp: "Naik Turun", no: "Naik Turun"});
        detexp.push({ detexp: "Kendaraan", no: "Kendaraan"});    

        const qdata = await Database
                    .from('pengajuan_header')
                    .join('pengajuan_detail', 'pengajuan_detail.id_pengajuan_header', '=', 'pengajuan_header.id_pengajuan_header')
                    .join('log_pengajuan', 'log_pengajuan.id_pengajuan_header', '=', 'pengajuan_header.id_pengajuan_header')
                    .select('pengajuan_detail.kota_detail', 'pengajuan_detail.lokasi_muat','pengajuan_detail.jns_kendaraan_detail')                                                    
                    .where('pengajuan_header.bu_header', datauser.domain) 
                    .where('pengajuan_header.region_header', request.input('region_rekap')) 
                    .where('pengajuan_header.kategori_header', request.input('kategori_rekap')) 
                    .where('pengajuan_detail.site_lokasi_muat', siteapprover)    
                    .where('pengajuan_detail.status_detail', 'YES') 
                    .where('log_pengajuan.status_pengajuan', 'Send') 
                    .groupBy('pengajuan_detail.kota_detail', 'pengajuan_detail.lokasi_muat','pengajuan_detail.jns_kendaraan_detail')                                                    

        let tmpArray1 = [];
        var vlokasi;
        var vekspedisi;
        
        for (const iterator of qdata) { // looping kota tujuan
            let tmpArray = [];
            vlokasi = 0;
            const kodeekspedisi = await Database
            .from('pengajuan_header')
            .join('pengajuan_detail', 'pengajuan_detail.id_pengajuan_header', '=', 'pengajuan_header.id_pengajuan_header')
            .join('log_pengajuan', 'log_pengajuan.id_pengajuan_header', '=', 'pengajuan_header.id_pengajuan_header')
            .select('pengajuan_header.kode_expedisi')                                                      
            .where('pengajuan_header.bu_header', datauser.domain) 
            .where('pengajuan_header.region_header', request.input('region_rekap')) 
            .where('pengajuan_header.kategori_header', request.input('kategori_rekap')) 
            .where('pengajuan_detail.status_detail', 'YES') 
            .where('log_pengajuan.status_pengajuan', 'Send') 
            .groupBy('pengajuan_header.kode_expedisi')    
            vekspedisi = 1;
            for (const iteratorexp of kodeekspedisi) { //looping ekspedisi                                
                for (const iterator1 of detexp) { // looping data header
                    let tmpdata = null;                                     
                    const gethistharga = await Database
                                .from('pengajuan_header')
                                .join('pengajuan_detail', 'pengajuan_detail.id_pengajuan_header', '=', 'pengajuan_header.id_pengajuan_header')
                                .join('log_pengajuan', 'log_pengajuan.id_pengajuan_header', '=', 'pengajuan_header.id_pengajuan_header')
                                .select('pengajuan_detail.harga_detail', 'pengajuan_detail.tanggal_berlaku')    
                                .where('lokasi_muat',   iterator.lokasi_muat)        
                                .where('kota_detail',   iterator.kota_detail)        
                                .where('jns_kendaraan_detail', iterator.jns_kendaraan_detail)        
                                .where('kode_expedisi',   iteratorexp.kode_expedisi)                                        
                                .where('pengajuan_detail.tanggal_selesai', null)                                
                                .where('log_pengajuan.status_pengajuan', 'Full_Approve') 
                                .first(); 
                    var historyharga;
                    var historystuff;
                    if(gethistharga){ 
                        historyharga = gethistharga.harga_detail 
                        historystuff = gethistharga.tanggal_berlaku 
                    }else{ 
                        historyharga = 0 
                        historystuff = '';
                    }

                    const getdatadealbaru = await Database
                    .from('pengajuan_header')
                    .join('pengajuan_detail', 'pengajuan_detail.id_pengajuan_header', '=', 'pengajuan_header.id_pengajuan_header')                    
                    .select('pengajuan_detail.harga_detail', 'pengajuan_detail.tanggal_berlaku', 'pengajuan_detail.id_pengajuan_detail', 'pengajuan_detail.jns_kendaraan_detail', 'pengajuan_detail.kode_tujuan')    
                    .where('lokasi_muat',   iterator.lokasi_muat)        
                    .where('kota_detail',   iterator.kota_detail)        
                    .where('jns_kendaraan_detail', iterator.jns_kendaraan_detail)        
                    .where('kode_expedisi',   iteratorexp.kode_expedisi)  
                    .where('pengajuan_detail.status_detail', 'YES') 
                    
                    
                    .orderBy('id_pengajuan_detail','desc')
                    .first(); 
                    var hargapenawaran;
                    var iddetail;
                    var tglstuff;
                    var kendaraan;
                    if(getdatadealbaru){ 
                        hargapenawaran = getdatadealbaru.harga_detail
                        iddetail = getdatadealbaru.id_pengajuan_detail
                        tglstuff = getdatadealbaru.tanggal_berlaku
                        kendaraan = getdatadealbaru.jns_kendaraan_detail

                        if(historystuff == '' && historyharga == 0){                         
                            let datawsa = [];
                            const args = { modul: 'getharga', 
                                            domain: datauser.domain,  
                                            expedisi: iteratorexp.kode_expedisi, 
                                            kodetujuan: getdatadealbaru.kode_tujuan };
                            const qwsa = await getWSA(urlDBC, "getDBCAkhrgMstr", args);  
                            console.log(datauser.domain + '*' + iteratorexp.kode_expedisi + '*' + getdatadealbaru.kode_tujuan)  
                            console.log(qwsa);
                            if(qwsa.temp_xxakhrg == null){
                                datawsa = [];               
                            }else{
                                datawsa = qwsa.temp_xxakhrg.temp_xxakhrgRow;
                                historystuff = datawsa[0].tmp_xxakhrg_start;
                                historyharga = datawsa[0].tmp_xxakhrg_hrg;
                            }  
                        }
                    }else{
                        hargapenawaran = 0
                        iddetail = 0
                        tglstuff = ''
                        kendaraan = ''
                    }

                    const getdatanego = await Database
                    .from('nego_harga')                    
                    .where('id_pengajuan_detail',  iddetail)        
                    .where('flag',   'New')                            
                    .first(); 
                    var harganego;
                    if(getdatanego){
                        harganego = getdatanego.harga_nego
                    }else{
                        harganego = 0;
                    }
                    
                    // console.log(vlokasi);
                    // console.log(iterator1)
                    if (iterator1.detexp == "Tujuan") {                        
                        // tmpdata = historyharga + iterator.lokasi_muat + iterator.kota_detail + iterator.jns_kendaraan_detail;                        
                        if(vlokasi == 0 && vekspedisi == 1){
                            tmpdata = iterator.kota_detail;
                            vlokasi = 1;
                            vekspedisi = vekspedisi + 1;
                        }
                    }                    

                    if (iterator1.detexp == "History Harga") {                        
                        // tmpdata = iterator.kota_detail;
                        tmpdata = historyharga;
                    }
                    else if (iterator1.detexp == "History Stuff") {
                        // tmpdata = 'Nilai History Stuff' + iteratorexp.kode_expedisi;
                        tmpdata = historystuff;
                    }                     
                    else if (iterator1.detexp == "Deal Baru Harga Penawaran") {
                        // tmpdata = 'Harga Penawaran' + iteratorexp.kode_expedisi;
                        tmpdata = hargapenawaran;
                    }  
                    else if (iterator1.detexp == "Deal Baru Harga Nego") {
                        // tmpdata = 'Harga Nego' + iteratorexp.kode_expedisi;
                        tmpdata = harganego;
                    }    
                    else if (iterator1.detexp == "Deal Stuff") {
                        // tmpdata = 'Stuff' + iteratorexp.kode_expedisi;
                        tmpdata = tglstuff;
                    }     
                    else if (iterator1.detexp == "Naik Turun") {
                        // tmpdata = 'Naik Turun' + iteratorexp.kode_expedisi;
                        tmpdata = harganego - historyharga;
                    }                    
                    else if (iterator1.detexp == "Kendaraan") {
                        // tmpdata = 'Kendaraan' + iteratorexp.kode_expedisi;
                        tmpdata = kendaraan;
                    }     
                    tmpArray.push(tmpdata);
                }          
            }
            
            var tmpArrayNonNull = tmpArray.filter(function (e) {return e != null;});
            // console.log(tmpArrayNonNull);
            tmpArray1.push(tmpArrayNonNull);
        }   

 
        var i = 0;
        var i2 = 0;
        for(const looptmpArray1 of tmpArray1){
            i++;
            i2++;
        }
        var qexp = 0;
        var qexp2= 0;
        for(const loopqdata of qdata){
            qexp++;
            qexp2++;
        }

        var dt = 2;
        var yy = 0;
        for (let x = 0; x < i; x++) {            
            yy = 0;
            console.log(x);
            for(let y = 0; y < qexp; y++){ 
                // yy = y; 
                console.log(x + '* y = ' + y + ' yy = '+ yy)      
                if(yy == y){
                    for(let z = 1; z <= 2; z++){                    
                        if(z == 1){             
                            dt = 2;           
                        }
                        if(z == 2){
                            dt = dt + 3;                        
                        }
                        if(tmpArray1[x][dt] != ''){
                            tmpArray1[x][dt] = moment(tmpArray1[x][dt]).format('DD-MM-YYYY')                                
                        } 
                        console.log('Row ' + x + ' Exp: ' + y + ' Edit Tgl :' + z + ' Kolom Nomor: ' + dt);
                    }
                }else{
                    dt = dt + 4;
                    for(let z = 1; z <= 2; z++){                    
                        if(z == 2){
                            dt = dt + 3;                        
                        }
                        if(tmpArray1[x][dt] != ''){
                            tmpArray1[x][dt] = moment(tmpArray1[x][dt]).format('DD-MM-YYYY')                                
                        } 
                        console.log('Row ' + x + ' Exp: ' + y + ' Edit Tgl :' + z + ' Kolom Nomor: ' + dt);
                    } 
                }                                
            }              
        }  
        
        var nb = 1;
        var bb = 0;
        for (let a = 0; a < i2; a++) {    
            bb = 0;
            for(let b = 0; b < qexp2; b++){     
                if(bb == b){
                    for(let c = 1; c <= 4; c++){                    
                        if(c == 1){             
                            nb = 1;           
                        }
                        if(c == 2){
                            nb = nb + 2;                        
                        }
                        if(c == 3){
                            nb = nb + 1;                        
                        }
                        if(c == 4){
                            nb = nb + 2;                        
                        }
                        if(tmpArray1[a][nb] != ''){                             
                            tmpArray1[a][nb] = (new Intl.NumberFormat('en-CA', {style:'decimal'}).format(tmpArray1[a][nb]));                            
                        } 
                        // console.log('Row ' + x + ' Exp: ' + y + ' Edit Tgl :' + z + ' Kolom Nomor: ' + dt);
                    }
                }else{
                    nb = nb + 2;
                    for(let c = 1; c <= 4; c++){                    
                        if(c == 2){
                            nb = nb + 2;                        
                        }
                        if(c == 3){
                            nb = nb + 1;                        
                        }
                        if(c == 4){
                            nb = nb + 2;                        
                        }
                        if(tmpArray1[a][nb] != ''){
                            // tmpArray1[a][nb] = moment(tmpArray1[a][nb]).format('DD-MM-YYYY')  
                            tmpArray1[a][nb] = (new Intl.NumberFormat('en-CA', {style:'decimal'}).format(tmpArray1[a][nb]));                               
                        } 
                        // console.log('Row ' + x + ' Exp: ' + y + ' Edit Tgl :' + z + ' Kolom Nomor: ' + dt);
                    } 
                }    
                        
            }
            
        }
                                        
        return {data1:qdata, kodeekspedisi:kodeekspedisi, header:title, detail:tmpArray1}
    }

    public async saveRegeneratePengajuanApprovalHarga({request, response}) {      
                  
        const ceksiteapprover = await Database
        .from('approve_harga')
        .where('DO_approve_harga',   request.input('DOUser'))        
        .first(); 
        let siteapprover = ceksiteapprover.siteqad_approve_harga;


        // await Database
        //     .from('rekap_pengajuan_header')
        //     .where('id_rekap_header',  request.input('idrekapheader'))
        //     .delete()
        
        // const getdatadet1 = await Database        
        //     .from('rekap_pengajuan_det1')                  
        //     .select('*')
        //     .where('id_rekap_header', request.input('idrekapheader'))  
                    
        // for (const iterator of getdatadet1) {
        //     await Database
        //     .from('rekap_pengajuan_det2')
        //     .where('id_rekap_det1', iterator.id_rekap_det1)
        //     .delete()            
        // }

        // await Database
        //     .from('rekap_pengajuan_det1')
        //     .where('id_rekap_header',  request.input('idrekapheader'))
        //     .delete()
        
        // await Database
        //     .from('log_approval')
        //     .where('id_rekap_header',  request.input('idrekapheader'))
        //     .delete()

        // await Database
        // .from('temp_rekap_pengajuan_det2')        
        // .where('temp_user_create', request.input('DOUser'))        
        // .delete()

        const dayjs = require('dayjs')  
          
        const datauser = await Database
        .from('user')
        .where('empid', request.input('DOUser'))        
        .first(); 

        datauser.domain = '100';
        datauser.domain = request.input('domain');

        const ceknumb = await Database
        .from('autonumber')
        .where('bu', datauser.domain)        
        .first(); 
        if(ceknumb){
            const getlastnumb = await Database
                            .from('autonumber')
                            .where('bu', datauser.domain)
                            .orderBy('rowid','desc')
                            .first();

            var lastnumb = getlastnumb.seq.toString();
        }else{
            const insertrekappengajuanheader = await Database
            .insertQuery() // 👈 gives an instance of insert query builder
            .table('autonumber')
            .insert(
                {                 
                    bu          : datauser.domain,
                    seq         : 1,     
                    last_mod    : dayjs().format('YYYY-MM-DD HH:mm:ss'),              
                }
            )   
            var lastnumb = '1';
        }

        const queryupdate = await Database
        .from('autonumber')
        .where('bu', datauser.domain)
        .update(
            {                       
                seq               :  parseInt(lastnumb) + 1,                                
                last_mod          :  dayjs().format('YYYY-MM-DD HH:mm:ss'),
            }
        )                

        const apprlv2 = await Database
                        .from('approve_harga')
                        .where('bu_approve_harga', datauser.domain)        
                        .where('level_approve_harga', '2')        
                        .first(); 
        if(apprlv2){
            var approverlv2 = apprlv2.nik_approve_harga;
            var vDOApprover = apprlv2.DO_approve_harga;
        }else{
            var approverlv2 = null;
            var vDOApprover = null;
        }

        const getregiondesc = await Database
                        .from('master_region')
                        .where('kodemstr', request.input('region'))        
                        .where('bu_region', datauser.domain)                                       
                        .first(); 
        
        const insertrekappengajuanheader = await Database
        .insertQuery() // 👈 gives an instance of insert query builder
        .table('rekap_pengajuan_header')
        .insert(
            {                 
                no_rekap_header : datauser.domain + dayjs().format('YY') + lastnumb.padStart(4, '0') ,
                tgl_pengajuan   : dayjs().format('YYYY-MM-DD'),     
                bu_rekap        : datauser.domain,
                region_rekap    : request.input('region'),
                kategori_rekap  : request.input('kategori'),
                keterangan      : request.input('keterangan'),
                // approver        : approverlv2,
                user_create     : request.input('DOUser'),
                date_create     : dayjs().format('YYYY-MM-DD HH:mm:ss'),                
                region_desc     : getregiondesc.descmstr,   
                // DOApprover      : vDOApprover,
            }
        ) 


        
        const getheaderid = await Database
        .from('rekap_pengajuan_header')
        .where('no_rekap_header', datauser.domain + dayjs().format('YY') + lastnumb.padStart(4, '0'))        
        .first(); 

        let idheader = getheaderid.id_rekap_header
        
        const qdata = await Database
        .from('pengajuan_header')
        .join('pengajuan_detail', 'pengajuan_detail.id_pengajuan_header', '=', 'pengajuan_header.id_pengajuan_header')
        .join('log_pengajuan', 'log_pengajuan.id_pengajuan_header', '=', 'pengajuan_header.id_pengajuan_header')
        .select('pengajuan_detail.kota_detail', 'pengajuan_detail.lokasi_muat','pengajuan_detail.jns_kendaraan_detail')                                                    
        .where('pengajuan_header.bu_header', datauser.domain) 
        .where('pengajuan_header.region_header', request.input('region')) 
        .where('pengajuan_header.kategori_header', request.input('kategori')) 
        // .where('pengajuan_header.region_header', '10') 
        // .where('pengajuan_header.kategori_header', 'Darat') 
        .where('pengajuan_detail.site_lokasi_muat', siteapprover)  
        .where('pengajuan_detail.status_detail', 'YES') 
        .where('log_pengajuan.status_pengajuan', 'Send') 
        .groupBy('pengajuan_detail.kota_detail', 'pengajuan_detail.lokasi_muat','pengajuan_detail.jns_kendaraan_detail')                                                    
        for (const iterator of qdata) { // looping kota tujuan            

            const insertrekappengajuandet1 = await Database
            .insertQuery() // 👈 gives an instance of insert query builder
            .table('rekap_pengajuan_det1')
            .insert(
                {                 
                    id_rekap_header             : idheader,
                    lokasi_muat_rekap_detail    : iterator.lokasi_muat,     
                    tujuan_rekap_detail         : iterator.kota_detail,
                    jns_kendaraan_rekap_detail  : iterator.jns_kendaraan_detail,
                    user_create     :  request.input('DOUser'),
                    date_create     :  dayjs().format('YYYY-MM-DD HH:mm:ss'),                
                }
            ) 

            const getdet1id = await Database
            .from('rekap_pengajuan_det1')
            .where('lokasi_muat_rekap_detail', iterator.lokasi_muat)  
            .where('tujuan_rekap_detail', iterator.kota_detail)  
            .where('jns_kendaraan_rekap_detail', iterator.jns_kendaraan_detail)  
            .where('id_rekap_header', idheader)
            .orderBy('id_rekap_det1', 'desc')      
            .first(); 
    
            let iddet1 = getdet1id.id_rekap_det1

            const kodeekspedisi = await Database
            .from('pengajuan_header')
            .join('pengajuan_detail', 'pengajuan_detail.id_pengajuan_header', '=', 'pengajuan_header.id_pengajuan_header')
            .join('log_pengajuan', 'log_pengajuan.id_pengajuan_header', '=', 'pengajuan_header.id_pengajuan_header')
            .select('pengajuan_header.kode_expedisi', 'pengajuan_header.id_pengajuan_header')                                                      
            .where('pengajuan_header.bu_header', datauser.domain) 
            .where('pengajuan_header.region_header', request.input('region')) 
            .where('pengajuan_header.kategori_header', request.input('kategori')) 
            // .where('pengajuan_header.region_header', '10') 
            // .where('pengajuan_header.kategori_header', 'Darat') 
            .where('pengajuan_detail.status_detail', 'YES') 
            .where('log_pengajuan.status_pengajuan', 'Send') 
            .groupBy('pengajuan_header.kode_expedisi', 'pengajuan_header.id_pengajuan_header')
            
            for (const iteratorexp of kodeekspedisi) { //looping ekspedisi          
                const getfortemp = await Database
                .from('pengajuan_header')
                .join('pengajuan_detail', 'pengajuan_detail.id_pengajuan_header', '=', 'pengajuan_header.id_pengajuan_header')
                .join('log_pengajuan', 'log_pengajuan.id_pengajuan_header', '=', 'pengajuan_header.id_pengajuan_header')
                .select('*')    
                .where('lokasi_muat',   iterator.lokasi_muat)        
                .where('kota_detail',   iterator.kota_detail)        
                .where('jns_kendaraan_detail', iterator.jns_kendaraan_detail)        
                .where('kode_expedisi',   iteratorexp.kode_expedisi)                                                                                     
                .where('log_pengajuan.status_pengajuan', 'Send') 
                .where('pengajuan_detail.status_detail', 'YES') 
                .orderBy('id_pengajuan_detail','desc')
                .first(); 
                var iddetailsend;
                if(getfortemp){
                    iddetailsend = getfortemp.id_pengajuan_detail
                }else{
                    iddetailsend = null
                }

                // console.log(iterator.lokasi_muat + iterator.kota_detail + iterator.jns_kendaraan_detail + iteratorexp.kode_expedisi + getfortemp);
                const getfortemp2 = await Database
                .from('pengajuan_header')
                .join('pengajuan_detail', 'pengajuan_detail.id_pengajuan_header', '=', 'pengajuan_header.id_pengajuan_header')
                .join('log_pengajuan', 'log_pengajuan.id_pengajuan_header', '=', 'pengajuan_header.id_pengajuan_header')
                .select('*')    
                .where('lokasi_muat',   iterator.lokasi_muat)        
                .where('kota_detail',   iterator.kota_detail)        
                .where('jns_kendaraan_detail', iterator.jns_kendaraan_detail)        
                .where('kode_expedisi',   iteratorexp.kode_expedisi)                                                                                     
                .where('log_pengajuan.status_pengajuan', 'Full_Approve') 
                .first(); 

                var iddetailfullapp;
                if(getfortemp2){
                    iddetailfullapp = getfortemp2.id_pengajuan_detail
                }else{
                    iddetailfullapp = null
                }

                const getdatanego = await Database
                .from('nego_harga')                    
                .where('id_pengajuan_detail',  iddetailsend)        
                .where('flag',   'New')                            
                .first();  
                var idnego;
                var harganego;
                if(getdatanego){
                    idnego = getdatanego.id_nego;
                    harganego = getdatanego.harga_nego;
                }else{
                    idnego = null;
                    harganego = 0;
                }

                const getexpname = await Database                                         
                        .from('user')
                        .where('empid', iteratorexp.kode_expedisi)   
                        .first() 
                let expname = getexpname.nama;

                if(iddetailsend != null){
                    const cekrekappengjdet2 = await Database                                         
                        .from('rekap_pengajuan_det2')
                        .where('id_rekap_det1', iddet1)
                        .where('id_pengajuan_detail', iddetailsend)
                        .first() 
                    if(cekrekappengjdet2){
                        // Incase 1 vendor ada 2 pengajuan detail yang sama dengan nomor header yang beda, 
                        // maka yang diinsert sebagai rekap hanya ada 1
                    }else{
                        const inserttemprekappengajuandet2 = await Database
                        .insertQuery() // 👈 gives an instance of insert query builder
                        .table('rekap_pengajuan_det2')
                        .insert(
                            {                                         
                                id_rekap_det1           : iddet1,     
                                id_pengajuan_detail     : iddetailsend,
                                id_pengajuan_detail_bef : iddetailfullapp,
                                id_nego                 : idnego,
                                id_rekap_header         : idheader,   
                                // temp_peringkat_rekap_detail  :,
                                nego_harga     : harganego,
                                kode_exp       : iteratorexp.kode_expedisi,
                                user_create    : request.input('DOUser'),   
                                expedisi_name  : expname,                       
                                
                            }
                        ) 
                    }

                    
                }
                
            }
        }
        
        const cekdatatemp2 = await Database
        .from('rekap_pengajuan_det2')        
        .select('id_rekap_det1')    
        .where('user_create', request.input('DOUser'))
        .groupBy('id_rekap_det1')    
        
        for (const iteratorx of cekdatatemp2) { 
            var peringkat = 0;
            const cekdatatemp3 = await Database
                .from('rekap_pengajuan_det2')        
                .select('*')    
                .where('user_create', request.input('DOUser'))
                .where('id_rekap_det1', iteratorx.id_rekap_det1)
                .orderBy([
                    {
                      column: 'nego_harga',
                      order: 'asc',
                    },
                    {
                      column: 'kode_exp',
                      order: 'asc',
                    }
                ])
            
                peringkat = 1;
                for (const iteratorcekdatatemp3 of cekdatatemp3) { 
                    const update = await Database
                        .from('rekap_pengajuan_det2')
                        .where('id_rekap_det2', iteratorcekdatatemp3.id_rekap_det2)
                        .update(
                            { peringkat_rekap_detail: peringkat }                
                        )  
                    peringkat++
                }

        }


       

        const insertlogapproval = await Database
        .insertQuery() // 👈 gives an instance of insert query builder
        .table('log_approval')
        .insert(
            {                 
                id_rekap_header : idheader,
                level_rekap     : 0,     
                status_rekap    : 'Draf',
                keterangan      : null,
                tgl_trans       : dayjs().format('YYYY-MM-DD HH:mm:ss'),          
                user_create     : request.input('DOUser'),                
            }
        ) 
        

        // Delete Old Data
        const update = await Database
        .from('rekap_pengajuan_header')
        .where('id_rekap_header', request.input('idrekapheader'))
        .update(
            { approver: 'Regenerate ke nomor: ' +  datauser.domain + dayjs().format('YY') + lastnumb.padStart(4, '0') }                
        )     
        
        const insertlogapproval2 = await Database
        .insertQuery() // 👈 gives an instance of insert query builder
        .table('log_approval')
        .insert(
            {                 
                id_rekap_header : request.input('idrekapheader'),
                level_rekap     : 0,     
                status_rekap    : 'Regenerate ke nomor: ' +  datauser.domain + dayjs().format('YY') + lastnumb.padStart(4, '0'),
                keterangan      : null,
                tgl_trans       : dayjs().format('YYYY-MM-DD HH:mm:ss'),          
                user_create     : request.input('DOUser'),                
            }
        ) 
        
        return response.status(200).json({
            message: "Proses ReGenerate Selesai",
            status: true,
        });  
             
    }

    public async sendPengajuanApprovalHarga({request, response}) {
        // return request.input('data.params.id_rekap_header');
        
        const dayjs = require('dayjs')  

        const datauser = await Database
        .from('user')
        .where('empid', request.input('data.empid'))        
        .first(); 

        const ceksiteapprover = await Database
        .from('approve_harga')
        .where('DO_approve_harga',  request.input('data.empid'))        
        .first(); 
        let siteapprover = ceksiteapprover.siteqad_approve_harga;

        datauser.domain = '100';
        datauser.domain = request.input('bu_rekap');

        const getlevel2 = await Database
        .from('approve_harga')                             
        .where('bu_approve_harga', request.input('data.params.bu_rekap')) 
        .where('siteqad_approve_harga',siteapprover)
        .where('level_approve_harga', '2')
        .first(); 

        if(getlevel2){            
            // Kirim Email ke approval Level 2
            await Mail.send((message) => {
            message
                .from('system@dbc.co.id')
                .to(getlevel2.email_approve_harga)
                .bcc('Shendy.dewandaru@dbc.co.id')
                .bcc('rahmat.hamidin@dbc.co.id')
                .subject('Notifikasi Approval Pengajuan Harga Transporter')              
                .htmlView('emails/notifikasi_approval', {
                user: { fullName: getlevel2.nama_approve_harga },
                // datadetail: getdatadetail,
                // harganego: request.input('harga'),
                // url: 'https://your-app.com/verification-url',
                // url: `http://localhost:8080/#/Autologin/ApprovalHargaTransporter/${getlevel2.nik_approve_harga}`,
                url: `https://app-proc.dbc.co.id/#/Autologin/ApprovalHargaTransporter/${getlevel2.nik_approve_harga}`,
                })
            })

            const insertlogapproval = await Database
            .insertQuery() // 👈 gives an instance of insert query builder
            .table('log_approval')
            .insert(
                {                 
                    id_rekap_header : request.input('data.params.id_rekap_header'),
                    level_rekap     : 1,     
                    status_rekap    : 'Send',
                    keterangan      : null,
                    tgl_trans       : dayjs().format('YYYY-MM-DD HH:mm:ss'),          
                    user_create     : request.input('data.empid'),                
                }
            ) 

            const queryupdate = await Database
            .from('rekap_pengajuan_header')
            .where('id_rekap_header', request.input('data.params.id_rekap_header'))
            .update(
                {                       
                    approver    : getlevel2.nik_approve_harga,  
                    DOApprover  : getlevel2.DO_approve_harga                              
                }
            )

            return response.status(200).json({
                message: "Proses Send Selesai",
                status: true,
            });  
        }else{
            return response.status(406).json({
                message: "PIC Level 2 belum terdaftar",
                status: true,
            });   
        }

        return getlevel2;

        return request;

    }

}
