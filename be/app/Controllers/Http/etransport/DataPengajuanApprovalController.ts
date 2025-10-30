import Database from "@ioc:Adonis/Lucid/Database";
const urlDBC = "https://qssiptdldb07.odqad.com:8143/wsa/wsadbc/wsdl?targetURI=urn:services-qad-com:wsadbc:0001";
import { getWSA } from "App/Helpers/Wsa";
import { senderMail } from "App/Helpers/mailSender";
import Config from '@ioc:Adonis/Core/Config'

export default class DataPengajuanApprovalController {
    public async getDataPengajuanApproval({request, response}) {            
        var moment = require('moment'); // require     
        const datauser = await Database
        .from('user')
        .where('empid', request.input('empid'))        
        .first(); 

        datauser.domain = '100';    
        datauser.domain = request.input('domain');  
        
        const getdata = await Database        
        .from('rekap_pengajuan_header')                           
        .select('rekap_pengajuan_header.*')        
        .where('bu_rekap', datauser.domain) 
        .orderBy('id_rekap_header', 'desc') 
        
        for(const loopgetdata of getdata){
            if(loopgetdata.tgl_pengajuan){
                loopgetdata.tgl_pengajuan = moment(loopgetdata.tgl_pengajuan).format('DD-MM-YYYY')             
            }

            const getstatus = await Database        
                        .from('log_approval')                               
                        .select('status_rekap')
                        .where('id_rekap_header', loopgetdata.id_rekap_header)               
                        .orderBy('id_log','desc')
                        .first()  
            if(getstatus){
                loopgetdata.status = getstatus.status_rekap;   
            }else{
                loopgetdata.status = '';   
            }
        }
                                                                           
        return {data2:getdata}          
    }

    public async viewDataPengajuanApproval({request, response}) {          
        
        // const ceksiteapprover = await Database
        // .from('approve_harga')
        // .where('DO_approve_harga', request.input('DOApprover'))        
        // .first(); 
        // let siteapprover = ceksiteapprover.siteqad_approve_harga;   

        
        // let tmpArrayfin1 = [];
        // let tmpArrayfin2 = [];
        // const qappr = await Database
        // .from('approve_harga')        
        // .select('*')                                                    
        // .where('bu_approve_harga', request.input('bu_rekap'))   
        // .where('siteqad_approve_harga', siteapprover)   
        // .where('level_approve_harga', '<=','4')   
        // .orderBy('level_approve_harga', 'asc')
        // for(const loopqappr of qappr){
        //     let tmpdata = null;             
        //     tmpArrayfin1.push(loopqappr.nama_approve_harga);
        //     // console.log(loopqappr.level_approve_harga + ' ' + loopqappr.nama_approve_harga)
        // }
        // tmpArrayfin2.push(tmpArrayfin1);

        // tmpArrayfin1 = [];
        // for(const loopqappr of qappr){
        //     var jabatan  = null;
        //     const qdata3 = await Database
        //                 .connection('mssql_hris_ext')                        
        //                 .from('mstr_employee')
        //                 .where('id', loopqappr.DO_approve_harga)   
        //                 .first() 
        //     if(qdata3){
        //         jabatan = qdata3.jabatan
        //     }else{
        //         jabatan = 'Not Found'
        //     }
        //     tmpArrayfin1.push(jabatan);       
        // }
        // tmpArrayfin2.push(tmpArrayfin1);

        // return tmpArrayfin2;

        
        // return tmpArrayfin1;
        // return tmpArrayfin2;

        let title = [];        
        title.push({ title: "Tujuan", no: "Tujuan" });

        const qdata = await Database
        .from('rekap_pengajuan_det2')        
        .select('kode_exp','expedisi_name')                                                    
        .where('rekap_pengajuan_det2.id_rekap_header', request.input('id_rekap_header'))   
        .groupBy('kode_exp', 'expedisi_name')
        
        // console.log(qdata)
        for (const loopqdata of qdata) { // looping data header
            title.push({ title: "History Harga", no: "History Harga"});
            title.push({ title: "History Stuff", no: "History Stuff"});
            title.push({ title: "Deal Baru Harga Penawaran", no: "Deal Baru Harga Penawaran"});
            title.push({ title: "Deal Baru Harga Nego", no: "Deal Baru Harga Nego"});
            title.push({ title: "Deal Baru Stuff", no: "Deal Baru Stuff"});
            title.push({ title: "Naik Turun", no: "Naik Turun"});
            title.push({ title: "Kendaraan", no: "Kendaraan"});
            // console.log(loopqdata.kode_exp)
        }

        let detexp = [];          
        detexp.push({ detexp: "History Harga", no: "History Harga"});
        detexp.push({ detexp: "History Stuff", no: "History Stuff"});
        detexp.push({ detexp: "Deal Baru Harga Penawaran", no: "Deal Baru Harga Penawaran"});
        detexp.push({ detexp: "Deal Baru Harga Nego", no: "Deal Baru Harga Nego"});
        detexp.push({ detexp: "Deal Baru Stuff", no: "Deal Baru Stuff"});
        detexp.push({ detexp: "Naik Turun", no: "Naik Turun"});
        detexp.push({ detexp: "Kendaraan", no: "Kendaraan"});  
        // detexp.push({ detexp: "Rem", no: "Kendaraan"}); 


        let tmpArray1 = [];
        let tmprank1 = null;  
        const qdatadet = await Database
        .from('rekap_pengajuan_det1')        
        .select('*')                                                    
        .where('rekap_pengajuan_det1.id_rekap_header', request.input('id_rekap_header'))   
        
        for (const loopqdatadet of qdatadet) {
            let tmpArray = [];
            let tmpdata = null; 
            let arraybaris = [];             
            tmpdata = loopqdatadet.tujuan_rekap_detail;
            tmpArray.push(tmpdata);

            for (const loopqdata of qdata) { // looping data header
                for(const loopdetexp of detexp){                 
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
                                // console.log(request.input('bu_rekap') + '*' + loopqdata.kode_exp + '*' + getdatadealbaru2.kode_tujuan)  
                                // console.log(qwsa);
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
                    else if (loopdetexp.detexp == "Deal Baru Stuff") {
                        // tmpdata = 'Harga Stuff' + iteratorexp.kode_expedisi;
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
            
            const det2 = await Database
            .from('rekap_pengajuan_det2')        
            .select('id_rekap_det1','peringkat_rekap_detail', 'kode_exp', 'expedisi_name')                                                    
            .where('rekap_pengajuan_det2.id_rekap_header', request.input('id_rekap_header'))   
            .where('rekap_pengajuan_det2.id_rekap_det1', loopqdatadet.id_rekap_det1) 
            .orderBy([
                {
                    column: 'peringkat_rekap_detail',
                    order: 'asc',
                },                   
            ])
            
            let tmprank2 = [];
            for(const loopdet2 of det2){   
                         
                tmprank1 = ' Peringkat ' + loopdet2.peringkat_rekap_detail + ' : ' + loopdet2.expedisi_name;                
                tmprank2.push(tmprank1);
            }
            let stringrank = tmprank2.toString();   
            tmpArray.push(stringrank)
            
            tmpArray1.push(tmpArray);
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
        
        let siteapprover;
        const ceksiteapprover = await Database
        .from('approve_harga')
        .where('DO_approve_harga', request.input('DOApprover'))        
        .first(); 
        if(ceksiteapprover){
            siteapprover = ceksiteapprover.siteqad_approve_harga;   
        }else{
            const ceklastappr = await Database                                          
            .from('log_approval')
            .where('id_rekap_header', request.input('id_rekap_header'))   
            .orderBy('id_log','desc')                       
            .first() 
            if(ceklastappr){
                let lastappr = ceklastappr.user_create

                const ceksiteapprover = await Database
                .from('approve_harga')
                .where('DO_approve_harga', lastappr)        
                .first(); 
                if(ceksiteapprover){
                    siteapprover = ceksiteapprover.siteqad_approve_harga;   
                }
            }else{
                siteapprover = '-';
            }
        }
        
        // return siteapprover;
        
        let tmpArrayfin1 = [];
        let tmpArrayfin2 = [];
        const qappr = await Database
        .from('approve_harga')        
        .select('*')                                                    
        .where('bu_approve_harga', request.input('bu_rekap'))   
        .where('siteqad_approve_harga', siteapprover)   
        .where('level_approve_harga', '<=','4')   
        .orderBy('level_approve_harga', 'asc')
        for(const loopqappr of qappr){
            let tmpdata = null;             
            tmpArrayfin1.push(loopqappr.nama_approve_harga);
            // console.log(loopqappr.level_approve_harga + ' ' + loopqappr.nama_approve_harga)
        }
        tmpArrayfin2.push(tmpArrayfin1);

        tmpArrayfin1 = [];
        for(const loopqappr of qappr){
            var jabatan  = null;
            const qdata3 = await Database
                        .connection('mssql_hris_ext')                        
                        .from('mstr_employee')
                        .where('id', loopqappr.DO_approve_harga)   
                        .first() 
            if(qdata3){
                jabatan = qdata3.jabatan
            }else{
                jabatan = 'Not Found'
            }
            tmpArrayfin1.push(jabatan);       
        }
        tmpArrayfin2.push(tmpArrayfin1);

        tmpArrayfin1 = [];
        for(const loopqappr of qappr){
            let tmpdata = null;             
            tmpArrayfin1.push(loopqappr.level_approve_harga);            
        }
        tmpArrayfin2.push(tmpArrayfin1);

        // tmpArrayfin1 = [];
        // for(const loopqappr of qappr){
        //     var dataappr  = null;
        //     const cekappr = await Database                                          
        //                 .from('log_approval')
        //                 .where('id_rekap_header', request.input('id_rekap_header'))   
        //                 .where('level_rekap',loopqappr.level_approve_harga)
        //                 .orderBy('id_log','desc')
        //                 .first() 
        //     if(cekappr){
        //         dataappr = cekappr.status_rekap
        //     }else{
        //         dataappr = '-'
        //     }
        //     tmpArrayfin1.push(dataappr); 
        // }
        // tmpArrayfin2.push(tmpArrayfin1);
        


        tmpArrayfin1 = [];
        const cekhighapprlog = await Database                                          
                        .from('log_approval')
                        .where('id_rekap_header', request.input('id_rekap_header'))   
                        // .where('id_rekap_header', '1000') 
                        .orderBy('level_rekap', 'desc')
                        .first() 
        if(cekhighapprlog){   
                     
            const ceklastlog = await Database                                          
                            .from('log_approval')
                            .where('id_rekap_header', request.input('id_rekap_header'))   
                            .where('level_rekap', cekhighapprlog.level_rekap)
                            .first() 
            if(ceklastlog != null){
                if(ceklastlog.status_rekap == 'Reject'){
                    for(const loopqappr of qappr){
                        var dataappr  = null;
                        const cekappr = await Database                                          
                                    .from('log_approval')
                                    .where('id_rekap_header', request.input('id_rekap_header'))   
                                    .where('level_rekap',loopqappr.level_approve_harga)
                                    .where('id_log','>',ceklastlog.id_log)                            
                                    .first() 
                        if(cekappr){
                            dataappr = cekappr.status_rekap
                        }else{
                            dataappr = '-'
                        }
                        tmpArrayfin1.push(dataappr); 
                    }
                }else{                
                    for(const loopqappr of qappr){
                        var dataappr  = null;
                        const cekappr = await Database                                          
                                    .from('log_approval')
                                    .where('id_rekap_header', request.input('id_rekap_header'))   
                                    .where('level_rekap',loopqappr.level_approve_harga)                                                    
                                    .first() 
                        if(cekappr){                        
                            if(cekappr.status_rekap == 'Send' || cekappr.status_rekap == 'Partial_Approve'){
                                cekappr.status_rekap = 'Approve';
                            }
                            dataappr = cekappr.status_rekap
                        }else{
                            dataappr = '-'
                        }
                        tmpArrayfin1.push(dataappr); 
                    }
                }

            }else{            
                for(const loopqappr of qappr){
                    var dataappr  = null;
                    const cekappr = await Database                                          
                                .from('log_approval')
                                .where('id_rekap_header', request.input('id_rekap_header'))   
                                .where('level_rekap',loopqappr.level_approve_harga)                                                    
                                .first() 
                    if(cekappr){
                        if(cekappr.status_rekap == 'Send' || cekappr.status_rekap == 'Partial_Approve'){
                            cekappr.status_rekap = 'Approve';
                        }
                        dataappr = cekappr.status_rekap
                    }else{
                        dataappr = '-'
                    }
                    tmpArrayfin1.push(dataappr); 
                }
            }   
            tmpArrayfin2.push(tmpArrayfin1);
        }else{
            for(const loopqappr of qappr){
                var dataappr  = '-';
                tmpArrayfin1.push(dataappr); 
            }
            tmpArrayfin2.push(tmpArrayfin1);
        }       
        
        console.log(tmpArray1);

        var moment = require('moment'); // require

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

        // console.log(tmpArray1);
        // console.log(i);
        // console.log(qexp);        

        var dt = 2;
        var yy = 0;
        for (let x = 0; x < i; x++) {            
            yy = 0;
            // console.log(x);
            for(let y = 0; y < qexp; y++){ 
                // yy = y; 
                // console.log(x + '* y = ' + y + ' yy = '+ yy)      
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
                        // console.log('Row ' + x + ' Exp: ' + y + ' Edit Tgl :' + z + ' Kolom Nomor: ' + dt);
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
                        // console.log('Row ' + x + ' Exp: ' + y + ' Edit Tgl :' + z + ' Kolom Nomor: ' + dt);
                    } 
                }                                
            }              
        }

        var nb = 1;
        var bb = 0;
        for (let a = 0; a < i2; a++) {    
            bb = 0;
            for(let b = 0; b < qexp2; b++){     
                // if(bb == b){
                //     nb = 1;
                //     console.log('Row ' + a + ' Kolom Nomor: ' + nb);
                //     tmpArray1[a][nb] = (new Intl.NumberFormat('en-CA', {style:'decimal'}).format(tmpArray1[a][nb]));
                //     nb = nb + 2;
                //     console.log('Row ' + a + ' Kolom Nomor: ' + nb);
                //     nb = nb + 1;
                //     console.log('Row ' + a + ' Kolom Nomor: ' + nb);
                //     nb = nb + 2; 
                //     console.log('Row ' + a + ' Kolom Nomor: ' + nb);      
                // }
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
        // return tmpArrayfin2;

        // return tmpArray1;
        return {kodeekspedisi:qdata, 
                header:title, 
                detail:tmpArray1, 
                keterangan:vketerangan, 
                idheader:request.input('id_rekap_header'),
                dataaprvr: tmpArrayfin2[3],
                datakrywn: tmpArrayfin2[0],
                datajbt: tmpArrayfin2[1],
            }
    }

    public async downloadexcelDataPengajuanApproval({request, response}) {                                             
        
        let title = [];        
        title.push("Tujuan");

        const qdata = await Database
        .from('rekap_pengajuan_det2')        
        .select('kode_exp')                                                    
        .where('rekap_pengajuan_det2.id_rekap_header', request.input('idrekapheader'))   
        .groupBy('kode_exp')
        
        // console.log(qdata)
        for (const loopqdata of qdata) { // looping data header
            title.push("History Harga");
            title.push("History Stuff");
            title.push("Deal Baru Harga Penawaran");
            title.push("Deal Baru Harga Nego");
            title.push("Deal Baru Stuff");
            title.push("Naik Turun");
            title.push("Kendaraan");
        } 
        title.push("Rekomendasi Vendor");       

        let detexp = [];          
        detexp.push({ detexp: "History Harga", no: "History Harga"});
        detexp.push({ detexp: "History Stuff", no: "History Stuff"});
        detexp.push({ detexp: "Deal Baru Harga Penawaran", no: "Deal Baru Harga Penawaran"});
        detexp.push({ detexp: "Deal Baru Harga Nego", no: "Deal Baru Harga Nego"});
        detexp.push({ detexp: "Deal Baru Stuff", no: "Deal Baru Stuff"});
        detexp.push({ detexp: "Naik Turun", no: "Naik Turun"});
        detexp.push({ detexp: "Kendaraan", no: "Kendaraan"});  
        // detexp.push({ detexp: "Rem", no: "Kendaraan"}); 


        let tmpArray1 = [];
        let tmprank1 = null;  
        const qdatadet = await Database
        .from('rekap_pengajuan_det1')        
        .select('*')                                                    
        .where('rekap_pengajuan_det1.id_rekap_header', request.input('idrekapheader'))   
        
        for (const loopqdatadet of qdatadet) {
            let tmpArray = [];
            let tmpdata = null; 
            let arraybaris = [];             
            tmpdata = loopqdatadet.tujuan_rekap_detail;
            tmpArray.push(tmpdata);

            for (const loopqdata of qdata) { // looping data header
                for(const loopdetexp of detexp){                 
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
                    else if (loopdetexp.detexp == "Deal Baru Stuff") {
                        // tmpdata = 'Harga Stuff' + iteratorexp.kode_expedisi;
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
            
            const det2 = await Database
            .from('rekap_pengajuan_det2')        
            .select('id_rekap_det1','peringkat_rekap_detail', 'kode_exp')                                                    
            .where('rekap_pengajuan_det2.id_rekap_header', request.input('idrekapheader'))   
            .where('rekap_pengajuan_det2.id_rekap_det1', loopqdatadet.id_rekap_det1) 
            .orderBy([
                {
                    column: 'peringkat_rekap_detail',
                    order: 'asc',
                },                   
            ])
            
            let tmprank2 = [];
            for(const loopdet2 of det2){   
                         
                tmprank1 = ' Peringkat ' + loopdet2.peringkat_rekap_detail + ' : ' + loopdet2.kode_exp;                
                tmprank2.push(tmprank1);
            }
            let stringrank = tmprank2.toString();   
            tmpArray.push(stringrank)
            
            tmpArray1.push(tmpArray);
        }

        var vketerangan  = null;
        const getketerangan = await Database
        .from('rekap_pengajuan_header')        
        .select('keterangan')                                                    
        .where('id_rekap_header', request.input('idrekapheader'))  
        .first()
        if(getketerangan){
            vketerangan = getketerangan.keterangan;
        }else{
            vketerangan = null;
        }        


        
        let tmpArrayfin1 = [];
        let tmpArrayfin2 = [];
        const qappr = await Database
        .from('approve_harga')        
        .select('*')                                                    
        .where('bu_approve_harga', '100')   
        .where('level_approve_harga', '<=','4')   
        for(const loopqappr of qappr){
            let tmpdata = null;             
            tmpArrayfin1.push(loopqappr.nama_approve_harga);
            // console.log(loopqappr.level_approve_harga + ' ' + loopqappr.nama_approve_harga)
        }
        tmpArrayfin2.push(tmpArrayfin1);

        tmpArrayfin1 = [];
        for(const loopqappr of qappr){
            var jabatan  = null;
            const qdata3 = await Database
                        .connection('mssql_hris_ext')                        
                        .from('mstr_employee')
                        .where('id', loopqappr.DO_approve_harga)   
                        .first() 
            if(qdata3){
                jabatan = qdata3.jabatan
            }else{
                jabatan = 'Not Found'
            }
            tmpArrayfin1.push(jabatan);       
        }
        tmpArrayfin2.push(tmpArrayfin1);

        tmpArrayfin1 = [];
        for(const loopqappr of qappr){
            let tmpdata = null;             
            tmpArrayfin1.push(loopqappr.level_approve_harga);            
        }
        tmpArrayfin2.push(tmpArrayfin1);

        tmpArrayfin1 = [];
        for(const loopqappr of qappr){
            var dataappr  = null;
            const cekappr = await Database                                          
                        .from('log_approval')
                        .where('id_rekap_header', request.input('idrekapheader'))   
                        .where('level_rekap',loopqappr.level_approve_harga)
                        .orderBy('id_log','desc')
                        .first() 
            if(cekappr){
                dataappr = cekappr.status_rekap
            }else{
                dataappr = '-'
            }
            tmpArrayfin1.push(dataappr); 
        }
        tmpArrayfin2.push(tmpArrayfin1);
        


        // return tmpArray1;
        return {kodeekspedisi:qdata, 
                header:title, 
                detail:tmpArray1, 
                keterangan:vketerangan, 
                idheader:request.input('idrekapheader'),
                dataaprvr: tmpArrayfin2[3],
                datakrywn: tmpArrayfin2[0],
                datajbt: tmpArrayfin2[1],
            }
    }
    
}
