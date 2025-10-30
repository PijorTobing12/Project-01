// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from "@ioc:Adonis/Lucid/Database";
const urlDBC = "https://qssiptdldb07.odqad.com:8143/wsa/wsadbc/wsdl?targetURI=urn:services-qad-com:wsadbc:0001";
import { getWSA } from "App/Helpers/Wsa";
import Mail from '@ioc:Adonis/Addons/Mail';
import Encryption from '@ioc:Adonis/Core/Encryption';

export default class ApprovalHargaTransporterController {

    public async getApprovalHargaTransporter({request, response}) {    
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
        .where('DOApprover',  request.input('empid'))   
        .orderBy('id_rekap_header','desc')
        
        for(const loopgetdata of getdata){
            if(loopgetdata.tgl_pengajuan){
                loopgetdata.tgl_pengajuan = moment(loopgetdata.tgl_pengajuan).format('DD-MM-YYYY')             
            }
        }
                                                                           
        return {data2:getdata}          
    }

    public async prosesApprovalHargaTransporter({request, response}) {                     
        // return request;
        let title = [];        
        title.push({ title: "Tujuan", no: "Tujuan" });

        const qdata = await Database
        .from('rekap_pengajuan_det2')        
        .select('kode_exp','expedisi_name')                                                    
        .where('rekap_pengajuan_det2.id_rekap_header', request.input('id_rekap_header'))   
        .groupBy('kode_exp','expedisi_name')
        
        // console.log(qdata)
        for (const loopqdata of qdata) { // looping data header
            title.push({ title: "History Harga", no: "History Harga"});
            title.push({ title: "Stuff", no: "Stuff"});
            title.push({ title: "Deal Baru Harga Penawaran", no: "Deal Baru Harga Penawaran"});
            title.push({ title: "Deal Baru Harga Nego", no: "Deal Baru Harga Nego"});
            title.push({ title: "Deal Baru Stuff", no: "Deal Baru Stuff"});
            title.push({ title: "Naik Turun", no: "Naik Turun"});
            title.push({ title: "Kendaraan", no: "Kendaraan"});
            console.log(loopqdata.kode_exp)
        }

        let detexp = [];          
        detexp.push({ detexp: "History Harga", no: "History Harga"});
        detexp.push({ detexp: "Stuff", no: "Stuff"});
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
        // return qdatadet;
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
                    .select('*')
                    .where('id_rekap_det1',   loopqdatadet.id_rekap_det1)        
                    .where('kode_exp',  loopqdata.kode_exp)          
                    .first();
                    // console.log(loopqdatadet.id_rekap_det1 + '* '+ loopqdata.kode_exp)
                    // return getdatadealbaru;
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
                                console.log(request.input('bu_rekap') + '*' + loopqdata.kode_exp + '*' + getdatadealbaru2.kode_tujuan)  
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
                    else if (loopdetexp.detexp == "Stuff") {
                        // tmpdata = 'Nilai Stuff' + iteratorexp.kode_expedisi;
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
        // return tmpArray1;

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
        
        return {kodeekspedisi:qdata, 
                header:title, 
                detail:tmpArray1, 
                keterangan:vketerangan, 
                idheader:request.input('id_rekap_header')}
    }

    public async approveApprovalHargaTransporter({request, response}) {    
        
        const connectionTester = require('connection-tester');                    
        const dayjs     = require('dayjs')         
        let today       = dayjs().format('YYYY-MM-DD');                                
        const fs        = require('fs');                
        const Client    = require('ssh2-sftp-client');   

        const config = {
            host: '167.3.117.116',
            port: 22,
            username: 'tpuser',
            password: 'Cloud@12345',

            algorithms: {
                kex: [
                  "diffie-hellman-group1-sha1",
                  "ecdh-sha2-nistp256",
                  "ecdh-sha2-nistp384",
                  "ecdh-sha2-nistp521",
                  "diffie-hellman-group-exchange-sha256",
                  "diffie-hellman-group14-sha1"
                ],
                cipher: [
                  "3des-cbc",
                  "aes128-ctr",
                  "aes192-ctr",
                  "aes256-ctr",
                  "aes128-gcm",
                  "aes128-gcm@openssh.com",
                  "aes256-gcm",
                  "aes256-gcm@openssh.com"
                ],
                serverHostKey: [
                  "ssh-rsa",
                  "ecdsa-sha2-nistp256",
                  "ecdsa-sha2-nistp384",
                  "ecdsa-sha2-nistp521"
                ],
                hmac: [
                  "hmac-sha2-256",
                  "hmac-sha2-512",
                  "hmac-sha1"
                ]
            }         
        }; 
        
        let newMode = 0o777;   
        
        const ceksiteapprover = await Database
        .from('approve_harga')
        .where('DO_approve_harga',   request.input('DOUser'))        
        .first(); 
        let siteapprover = ceksiteapprover.siteqad_approve_harga;   
                        
        const getdataheader = await Database
        .from('rekap_pengajuan_header')        
        .select('*')                                                    
        .where('id_rekap_header', request.input('idrekapheader'))  
        .first()
        var buheader = null;
        if(getdataheader){
            buheader = getdataheader.bu_rekap;
        }else{
            buheader = null;
        }

        const gethighrank = await Database
        .from('approve_harga')        
        .select('*')                                                    
        .where('bu_approve_harga', getdataheader.bu_rekap)           
        .where('siteqad_approve_harga', siteapprover)
        .orderBy([
            {
                column: 'level_approve_harga',
                order: 'desc',
            },                   
        ])
        .first()

        const cekrankuser = await Database
        .from('approve_harga')        
        .select('*')                                                    
        .where('bu_approve_harga', getdataheader.bu_rekap)
        .where('DO_approve_harga', request.input('DOUser'))
        .orderBy([
            {
                column: 'level_approve_harga',
                order: 'desc',
            },                   
        ])
        .first()        

        let rankuser = cekrankuser.level_approve_harga;
        let highrank = gethighrank.level_approve_harga;

        if (rankuser != highrank){
            //Akan mengupdate tabel rekap_pengajuan_header field approver menjadi NIK PIC Approval Harga Level selanjutnya
            const getnextrank = await Database
                .from('approve_harga')        
                .select('*')                                                    
                .where('bu_approve_harga', getdataheader.bu_rekap) 
                .where('siteqad_approve_harga', siteapprover)               
                .where('level_approve_harga','>',rankuser)
                .orderBy([
                    {
                        column: 'level_approve_harga',
                        order: 'asc',
                    },                   
                ])
                .first()

                const queryupdate = await Database
                .from('rekap_pengajuan_header')
                .where('id_rekap_header', request.input('idrekapheader'))
                .update(
                    {                       
                        approver    : getnextrank.nik_approve_harga,                                
                        DOApprover  : getnextrank.DO_approve_harga, 
                    }
                )
                        
            let nextrank = getnextrank.level_approve_harga;
            
            //Menambah data Tabel log_approval sesuai id_rekap_header
            const insertlogapproval_part_appr = await Database
            .insertQuery() // 👈 gives an instance of insert query builder
            .table('log_approval')
            .insert(
                {                 
                    id_rekap_header : request.input('idrekapheader'),
                    level_rekap     : cekrankuser.level_approve_harga,     
                    status_rekap    : 'Partial_Approve',
                    keterangan      : null,
                    tgl_trans       : dayjs().format('YYYY-MM-DD HH:mm:ss'),          
                    user_create     : request.input('DOUser'),                
                }
            ) 

            //Email ke next Rank
            await Mail.send((message) => {
            message
                .from('system@dbc.co.id')
                .to(getnextrank.email_approve_harga)
                .bcc('Shendy.dewandaru@dbc.co.id')
                .bcc('rahmat.hamidin@dbc.co.id')
                .subject('Notifikasi Approval Pengajuan Harga Transporter')              
                .htmlView('emails/notifikasi_approval', {
                user: { fullName: getnextrank.nama_approve_harga },
                // datadetail: getdatadetail,
                // harganego: request.input('harga'),
                // url: 'https://your-app.com/verification-url',
                })
            })

            return response.status(200).json({
                message: "Data Berhasil Diproses Ke Level Approver Selanjutnya",
                status: true,
            });
            
        }else{
            const statuscon_awal = connectionTester.test('167.3.117.116', 22);
            if(statuscon_awal.success != true){
                return response.status(406).json({
                    message: "Koneksi ke QAD Gagal",
                    status: true,
                });
            }            
           
            //update data tabel xxakhrg_mstr (QAD)
            //Menambah data pada tabel xxakhrg_mstr (QAD),
            const statuscon = connectionTester.test('167.3.117.116', 22);
            if(statuscon.success == true){
                // 'inbound';             
                const getidrek2 = await Database        
                        .from('rekap_pengajuan_det2')                           
                        .select('*')
                        .where('id_rekap_header', request.input('idrekapheader'))   
                for(const loopgetidrek2 of getidrek2){
                    console.log(loopgetidrek2.id_pengajuan_detail)
                    const getidpengdet = await Database        
                        .from('pengajuan_detail')                           
                        .select('*')
                        .where('id_pengajuan_detail', loopgetidrek2.id_pengajuan_detail)  
                        .first()
                    if(getidpengdet){
        
                        let tglapprove  = dayjs().format('YYYY-MM-DD');
        
                        let tglpengajuan= dayjs(getidpengdet.tanggal_berlaku_pengajuan).format('YYYY-MM-DD');
                        let xxakhrgend; let xxakhrgstart;                
                        if(tglapprove > tglpengajuan){                       
                            xxakhrgend      =  (dayjs(tglapprove).subtract(1, 'day')).format('YYYY-MM-DD')
                            xxakhrgstart    =   dayjs(tglapprove).format('YYYY-MM-DD');
                        }else{                                        
                            xxakhrgend      =  (dayjs(tglpengajuan).subtract(1, 'day')).format('YYYY-MM-DD')
                            xxakhrgstart    =   dayjs(tglpengajuan).format('YYYY-MM-DD');
                        }                                
        
                        let xml = `<?xml version="1.0" encoding="UTF-8"?>
                                    <soapenv:Envelope xmlns="urn:schemas-qad-com:xml-services"
                                    xmlns:qcom="urn:schemas-qad-com:xml-services:common"
                                    xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wsa="http://www.w3.org/2005/08/addressing">
                                    <soapenv:Header>
                                        <wsa:Action/>
                                        <wsa:To>urn:services-qad-com:WNRLIVE</wsa:To>
                                        <wsa:MessageID>urn:services-qad-com::WNRLIVE</wsa:MessageID>
                                        <wsa:ReferenceParameters>
                                        <qcom:suppressResponseDetail>true</qcom:suppressResponseDetail>
                                        </wsa:ReferenceParameters>
                                        <wsa:ReplyTo>
                                        <wsa:Address>urn:services-qad-com:</wsa:Address>
                                        </wsa:ReplyTo>
                                    </soapenv:Header>
                                    <soapenv:Body>
                                        <xxinp_akhrgmstr>
                                        <qcom:dsSessionContext>
                                            <qcom:ttContext>
                                            <qcom:propertyQualifier>QAD</qcom:propertyQualifier>
                                            <qcom:propertyName>domain</qcom:propertyName>
                                            <qcom:propertyValue>` + getdataheader.bu_rekap + `</qcom:propertyValue>
                                            </qcom:ttContext>
                                            <qcom:ttContext>
                                            <qcom:propertyQualifier>QAD</qcom:propertyQualifier>
                                            <qcom:propertyName>scopeTransaction</qcom:propertyName>
                                            <qcom:propertyValue>false</qcom:propertyValue>
                                            </qcom:ttContext>
                                            <qcom:ttContext>
                                            <qcom:propertyQualifier>QAD</qcom:propertyQualifier>
                                            <qcom:propertyName>version</qcom:propertyName>
                                            <qcom:propertyValue>eB_1</qcom:propertyValue>
                                            </qcom:ttContext>
                                            <qcom:ttContext>
                                            <qcom:propertyQualifier>QAD</qcom:propertyQualifier>
                                            <qcom:propertyName>mnemonicsRaw</qcom:propertyName>
                                            <qcom:propertyValue>false</qcom:propertyValue>
                                            </qcom:ttContext>
                                            <qcom:ttContext>
                                            <qcom:propertyQualifier>QAD</qcom:propertyQualifier>
                                            <qcom:propertyName>username</qcom:propertyName>
                                            <qcom:propertyValue>apiqxi</qcom:propertyValue>
                                            </qcom:ttContext>
                                            <qcom:ttContext>
                                            <qcom:propertyQualifier>QAD</qcom:propertyQualifier>
                                            <qcom:propertyName>password</qcom:propertyName>
                                            <qcom:propertyValue>djdev@1234</qcom:propertyValue>
                                            </qcom:ttContext>	
                                            <qcom:ttContext>
                                            <qcom:propertyQualifier>QAD</qcom:propertyQualifier>
                                            <qcom:propertyName>action</qcom:propertyName>
                                            <qcom:propertyValue/>
                                            </qcom:ttContext>
                                            <qcom:ttContext>
                                            <qcom:propertyQualifier>QAD</qcom:propertyQualifier>
                                            <qcom:propertyName>entity</qcom:propertyName>
                                            <qcom:propertyValue/>
                                            </qcom:ttContext>
                                            <qcom:ttContext>
                                            <qcom:propertyQualifier>QAD</qcom:propertyQualifier>
                                            <qcom:propertyName>email</qcom:propertyName>
                                            <qcom:propertyValue/>
                                            </qcom:ttContext>
                                            <qcom:ttContext>
                                            <qcom:propertyQualifier>QAD</qcom:propertyQualifier>
                                            <qcom:propertyName>emailLevel</qcom:propertyName>
                                            <qcom:propertyValue/>
                                            </qcom:ttContext>
                                        </qcom:dsSessionContext>
                                        <dsInp_akhrgmstr>
                                            <inp_akhrgmstr>
                                            <operation>A</operation>
                                            <domain>` + getdataheader.bu_rekap + `</domain>
                                            <harga>` + loopgetidrek2.nego_harga + `</harga>
                                            <kodeexp>` + loopgetidrek2.kode_exp + `</kodeexp>
                                            <rutecode>` + getidpengdet.kode_tujuan + `</rutecode>
                                            <moddate>` + dayjs().format('YYYY-MM-DD') + `</moddate>
                                            <modtime>` + dayjs(today).unix() + `</modtime>
                                            <tglakhir>` + xxakhrgend + `</tglakhir>
                                            <tglstart>` + xxakhrgstart + `</tglstart>
                                            <vuser>`+ request.input('DOUser') + `</vuser>
                                            <chr01>`+ loopgetidrek2.peringkat_rekap_detail + `</chr01>
                                            </inp_akhrgmstr>
                                        </dsInp_akhrgmstr>
                                        </xxinp_akhrgmstr>
                                    </soapenv:Body>
                                    </soapenv:Envelope>        
                                    `;
                                    
                        // fs.appendFile('tmp/newfile.txt', 'Learn Node FS module', function (err) {
                        let namafile    = 'tmp/etransport_' + request.input('idrekapheader') + '_' + loopgetidrek2.id_rekap_det2 + '.req';
                        // let namafile_backup = 'tmp/backup/etransport_' + request.input('idrekapheader') + '_' + loopgetidrek2.id_rekap_det2 + '.req';
                        let namafile2   = 'etransport_' + request.input('idrekapheader') + '_' + loopgetidrek2.id_rekap_det2 + '.req';
                        fs.writeFile(namafile, xml, function (err) {
                            if (err) throw err;
                            console.log('File is created successfully.');
                        });
        
                        // fs.writeFile(namafile_backup, xml, function (err) {
                        //     if (err) throw err;
                        //     console.log('File Backup is created successfully.');
                        // });
        
                        let data = fs.createReadStream(namafile);
                        // let remote = '/home/tpuser/' + namafile2;
                        let remote = '/qond/apps/tomcat_qx/webapps/qxiqonddb/qxtendQueues/qdocqueue/requests/' + namafile2;
        
                        const sftp = new Client();
                        sftp.connect(config)
                        .then(() => {            
                            return sftp.put(data, remote);
                            // return sftp.chmod(remote, newMode);            
                        })
                        .then(() => {            
                            return sftp.chmod(remote, newMode);         
                        })
                        .then(p => {
                            console.log(`Remote working directory is ${p}`);
                            return sftp.end();
                        })
                        .catch(err => {            
                            console.log(`Error: ${err.message}`); // error message will include 'example-client'
                            return response.status(406).json({
                                message: "SFTP Gagal",
                                status: true,
                            });
                            return 'disini';
                        });                
                    }
                }

                //update tabel rekap_pengajuan_header field approver menjadi “CLOSE”
                const queryupdate0 = await Database
                .from('rekap_pengajuan_header')
                .where('id_rekap_header', request.input('idrekapheader'))
                .update(
                    {                       
                        approver        : 'CLOSE',
                        DOApprover      : 'CLOSE',
                    }
                )

                //Menambah data Tabel log_approval sesuai id_rekap_header
                const insertlogapproval_fullappr = await Database
                .insertQuery() // 👈 gives an instance of insert query builder
                .table('log_approval')
                .insert(
                    {                 
                        id_rekap_header : request.input('idrekapheader'),
                        level_rekap     : cekrankuser.level_approve_harga,     
                        status_rekap    : 'Full_Approve',
                        keterangan      : null,
                        tgl_trans       : dayjs().format('YYYY-MM-DD HH:mm:ss'),          
                        user_create     : request.input('DOUser'),                
                    }
                ) 

                //Get ID pengajuan header based on idrekapheader
                const getdatapengheader = await Database
                .from('pengajuan_header')
                .where('id_pengajuan_header', request.input('idrekapheader'))
                for(const loopgetdatapengheader of getdatapengheader){
                    //update tabel log_pengajuan field status pengajuan menjadi “Full_Approve"
                    const queryupdate1 = await Database
                    .from('log_pengajuan')
                    .where('id_pengajuan_header', loopgetdatapengheader.id_pengajuan_header)
                    .where('level_pengajuan', '1')
                    .where('status_pengajuan', 'Send')
                    .update(
                        {                       
                            status_pengajuan    : 'Full_Approve'                            
                        }
                    )
                }
                

                //Mengirim email pemberitahuan Full Approve ke semua PIC Approval sebelumnya dan juga ke semua vendor.
                const getdataapprover = await Database        
                .from('Approve_harga')                           
                .select('*')
                .where('bu_approve_harga', getdataheader.bu_rekap)    
                .where('siteqad_approve_harga', siteapprover)                    
                for (const loopgetdataapprover of getdataapprover) {

                    await Mail.send((message) => {
                    message
                        .from('system@dbc.co.id')
                        .to(loopgetdataapprover.email_approve_harga)
                        .bcc('Shendy.dewandaru@dbc.co.id')
                        .bcc('rahmat.hamidin@dbc.co.id')
                        .subject('Notifikasi Full Approved Pengajuan Harga Transporter')              
                        .htmlView('emails/notifikasi_full_approve', {
                        user: { fullName: loopgetdataapprover.nama_approve_harga },                    
                        nomorrekap: getdataheader.no_rekap_header,
                        // datadetail: getdatadetail,
                        // harganego: request.input('harga'),
                        // url: 'https://your-app.com/verification-url',
                        })
                    })

                    console.log(loopgetdataapprover.level_approve_harga)
                }

                const getdatavendor = await Database        
                    .from('rekap_pengajuan_det2')                           
                    .select('kode_exp')
                    .where('id_rekap_header', request.input('idrekapheader'))   
                    .groupBy('kode_exp')
                for (const loopgetdatavendor of getdatavendor) {
                    let varcekheader = 0;
                    const q1 = await Database        
                            .from('rekap_pengajuan_det2')                           
                            .select('id_pengajuan_detail')
                            .where('id_rekap_header', request.input('idrekapheader'))   
                            .where('kode_exp', loopgetdatavendor.kode_exp)  
                    for(const loopq1 of q1 ){                    
                        const q2 = await Database        
                            .from('pengajuan_detail')                           
                            .select('id_pengajuan_header')
                            .where('id_pengajuan_detail', loopq1.id_pengajuan_detail)   
                            .first()
                        if(q2){
                            let idpengheader = q2.id_pengajuan_header;

                            if(idpengheader != varcekheader){
                                console.log('Email ke vendor' + idpengheader + ' ' + varcekheader)

                                const queryupdate1 = await Database
                                .from('log_pengajuan')
                                .where('id_pengajuan_header', idpengheader)
                                .where('level_pengajuan', '1')
                                .where('status_pengajuan', 'Send')
                                .update(
                                    {                       
                                        status_pengajuan    : 'Full_Approve'                            
                                    }
                                )

                                const getemailvend = await Database
                                            .from('user')        
                                            .select('email', 'nama')                                                    
                                            .where('empid', loopgetdatavendor.kode_exp)  
                                            .first()

                                await Mail.send((message) => {
                                message
                                    .from('system@dbc.co.id')
                                    .to(getemailvend.email)
                                    .bcc('Shendy.dewandaru@dbc.co.id')
                                    .bcc('rahmat.hamidin@dbc.co.id')
                                    .subject('Notifikasi Full Approved Pengajuan Harga Transporter')              
                                    .htmlView('emails/notifikasi_full_approve_vendor', {
                                    user: { fullName: getemailvend.nama },                    
                                    nomorpengajuan: q2.id_pengajuan_header,
                                    // datadetail: getdatadetail,
                                    // harganego: request.input('harga'),
                                    // url: 'https://your-app.com/verification-url',
                                    })
                                })
                                varcekheader = idpengheader;
                            }
                        }                    
                    }                                     
                }

                return response.status(200).json({
                    message: "Data Berhasil DiProses",
                    status: true,
                });
            }else{
                // 'notinbound';
                return response.status(406).json({
                    message: "Koneksi ke QAD Gagal",
                    status: true,
                });
            }      
        }    
        // return request;
    }

    public async saveRejectApprovalHargaTransporter({request, response}){   
        
        const ceksiteapprover = await Database
        .from('approve_harga')
        .where('DO_approve_harga', request.input('DOUser'))        
        .first(); 
        console.log(ceksiteapprover);
        let siteapprover = ceksiteapprover.siteqad_approve_harga;   
        console.log(request.input('DOUser'))
        console.log(siteapprover)


        const dayjs = require('dayjs') 
        const getdataheader = await Database
        .from('rekap_pengajuan_header')        
        .select('*')                                                    
        .where('id_rekap_header', request.input('idrekapheader'))  
        .first()
        var buheader = null;
        if(getdataheader){
            buheader = getdataheader.bu_rekap;
        }else{
            buheader = null;
        }

        const getlevel1 = await Database
        .from('approve_harga')                
        .where('bu_approve_harga', getdataheader.bu_rekap)  
        .where('siteqad_approve_harga', siteapprover)                
        .where('level_approve_harga', '1')
        .first();   
        console.log(siteapprover);
        var level1 = getlevel1.DO_approve_harga;

        const queryupdate0 = await Database
        .from('rekap_pengajuan_header')
        .where('id_rekap_header', request.input('idrekapheader'))
        .update(
            {                       
                approver            : getlevel1.nik_approve_harga,
                DOApprover          : getlevel1.DO_approve_harga,
            }
        )

        //Menambah data Tabel log_approval sesuai id_rekap_header
        const insertlogapproval_draf = await Database
        .insertQuery() // 👈 gives an instance of insert query builder
        .table('log_approval')
        .insert(
            {                 
                id_rekap_header : request.input('idrekapheader'),
                level_rekap     : '1',     
                status_rekap    : 'Draf',
                keterangan      : request.input('ketreject'),
                tgl_trans       : dayjs().format('YYYY-MM-DD HH:mm:ss'),          
                user_create     : request.input('DOUser'),                
            }
        ) 

        const cekrankuser = await Database
        .from('approve_harga')        
        .select('*')                                                    
        .where('bu_approve_harga', getdataheader.bu_rekap)
        .where('DO_approve_harga', request.input('DOUser'))
        .orderBy([
            {
                column: 'level_approve_harga',
                order: 'desc',
            },                   
        ])
        .first()        

        let rankuser = cekrankuser.level_approve_harga;

        //Menambah data Tabel log_approval sesuai id_rekap_header
        const insertlogapproval = await Database
        .insertQuery() // 👈 gives an instance of insert query builder
        .table('log_approval')
        .insert(
            {                 
                id_rekap_header : request.input('idrekapheader'),
                level_rekap     : cekrankuser.level_approve_harga,     
                status_rekap    : 'Reject',
                keterangan      : request.input('ketreject'),
                tgl_trans       : dayjs().format('YYYY-MM-DD HH:mm:ss'),          
                user_create     : request.input('DOUser'),                
            }
        ) 
        
        return response.status(200).json({
            message: "Data Berhasil Direject",
            status: true,
        });

        return request;
    }
    

}
