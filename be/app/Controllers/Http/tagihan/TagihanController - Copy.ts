import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from "@ioc:Adonis/Lucid/Database";
import * as ftp from "basic-ftp";
import Application from '@ioc:Adonis/Core/Application';
const urlDBC = "https://qssiptdldb07.odqad.com:8143/wsa/wsadbc/wsdl?targetURI=urn:services-qad-com:wsadbc:0001";
import { getWSA } from "App/Helpers/Wsa";
import Env from '@ioc:Adonis/Core/Env';
// import Mail from '@ioc:Adonis/Addons/Mail';
// import Encryption from '@ioc:Adonis/Core/Encryption';

export default class TagihanController {

    public async downloadFiles({ request }: HttpContextContract) {
                //FTP
                const client = new ftp.Client();
                client.ftp.verbose = true;            
                await client.access({
                    host: '172.26.0.3',
                    user: 'itsysdev',
                    password: '<DBCsysd3v>',
                    port: 9001,
                });
                
                await client.downloadTo('D:/',`/eReg/tagihan/${request.input('nama_file')}`);        
                client.trackProgress()   
                client.close();
    }

    public async prosestagihan({ request, response }: HttpContextContract) {
        const trans_dtl_inv = await Database.connection("mssql_tagihan")                                
                        .from('trans_details_inv')                                
                        .where('trans_code', request.input('trans_code')) 
                        .count('* as total') 

        if(trans_dtl_inv[0].total == 0){
            return response.status(202).send('Silahkan mengisi data invoice terlebih dahulu');
        } else {
             await Database.connection("mssql_tagihan")
            .rawQuery("sp_invoice 'invoiceproses', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?", [request.input('trans_code'),null, null, null, null, null, null, null, null, null, null, null, null, request.input('empid'),'0', null])
            
            return response.status(202).send('Nomor Tagihan '+ request.input('trans_code') + ' Berhasil Diproses');
        }

        // Send Mail
        // await Mail.sendLater((message) => {
        //     let email = message.from('system@dbc.co.id');
        //     email = email.to('tomi@dbc.co.id');
        //     // email = email.to('lanny@dbc.co.id');
        //     // email = email.to('hanny.fauzia@dbc.co.id');            
        //     // email = email.to(penerima);
            
        //     email = email.subject('Request Ticket')
        //                 .htmlView('emails/notifikasi_proses_tagihan', { 
        //                     penerima: namaPenerima,
        //                     tk_nbr: kode,
        //                     tk_judul: request.input('tk_judul'),
        //                     tk_kategori: request.input('tk_kategori'),
        //                     tk_nama_pembuat: request.input('tk_nama_pembuat'),
        //                     tk_permasalahan: request.input('tk_permasalahan'),
        //                 });
        // });
}

    public async deleteFiles({ request }: HttpContextContract) {

        await Database.connection("mssql_tagihan")
            .from('trans_files')
            .where('trans_dtl_inv', request.input('no_inv'))
            .where('trans_code', request.input('trans_code'))
            .where('files_name', request.input('nama_file'))
            .delete()

        //FTP
        const client = new ftp.Client();
        client.ftp.verbose = true;            
        await client.access({
            host: '172.26.0.3',
            user: 'itsysdev',
            password: '<DBCsysd3v>',
            port: 9001,
        });
        
        await client.remove(`/eReg/tagihan/${request.input('nama_file')}`);        
        client.close();
    }

    public async tambahposimpan ({ request, response }) {
        var moment = require('moment');

        for (var i = 0; i < request.input('po_table').length; i++ ){
            await Database.connection("mssql_tagihan")
                            .table('trans_details_po')
                            .insert({
                                trans_code : request.input('trans_code'),
                                dtl_po : request.input('po_table')[i].po_number,
                                dtl_po_date : request.input('po_table')[i].po_date,
                                dtl_po_curr : 'IDR',
                                dtl_po_tax : (request.input('po_table')[i].ppn == 'Ya' ? 1 : 0),
                                dtl_po_amount : request.input('po_table')[i].po_amount,
                                dtl_no_mrr : request.input('po_table')[i].no_mrr,
                                dtl_date_mrr : request.input('po_table')[i].tgl_mrr,
                                dtl_ttl_mrr : request.input('po_table')[i].mrr_amount,
                                dtl_no_sj : request.input('po_table')[i].no_sj,
                                dtl_site : request.input('po_table')[i].site,
                                dtl_flag : 1,
                                created_date : moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
                            })                    
        }
        
        return response.status(202).send('Data Saved Succesfully');
    }

    public async tambahtagihansimpan ({ request, response }) {
        var moment = require('moment');

        const Vendor = await Database.connection("mssql_tagihan")
        .rawQuery(" select case when a.sup_code is null then b.sup_code else a.sup_code end sup_code, a.sup_name from m_supplier a left join vend_data b on a.sup_code_app = b.supp_code_app where a.sup_npwp = ?", [request.input('empid')])

        
        const trans_code = await Database.connection("mssql_finsys")
        .rawQuery("select top 1 trans_code from (select top 1 a.trans_code, b.bu_alias as domain from trans_header a, mst_businessunit b where a.bu_id = b.bu_id and b.bu_alias = ? order by trans_code union all select top 1 trans_code,bu_domain as domain from "+Env.get('DBFINSYS')+".[dbo].[trans_header] where bu_domain = ? order by trans_code desc) b order by trans_code desc" , [request.input('domain'),request.input('domain')])

        const BU = await Database.connection("mssql_finsys")
        .rawQuery("select * from mst_businessunit where bu_alias = ?" , [request.input('domain')])

        var date_2_digit =  moment(new Date()).format("YYMM")
		// let yearnow = moment(new Date()).format("YY")

        let NoTrans = ''
        let header_code = ''

        if(trans_code.length > 0) {
            if(trans_code[0].trans_code.substr(3,4) === date_2_digit){
                let count_hasil_query = trans_code[0].trans_code
                let count_tampung = parseInt(count_hasil_query.substr(7,6)) + 1
                let num = count_tampung

                switch(num.toString().length) {
                    case 1:
                        NoTrans = date_2_digit+"00"+num
                    break;
                    case 2:
                        NoTrans = date_2_digit+"0"+num
                    break;
                    case 3:
                        NoTrans = date_2_digit+num
                    break;
                    default:
                        NoTrans = num.toString()
                  }

                header_code = NoTrans
            } else {  header_code = date_2_digit+"001" }
        } else {
            header_code = date_2_digit+"001"
        }

        let header_code_final = request.input('domain')+header_code

        if(request.input('po_table').length > 0) {
            const result = await Database.connection("mssql_tagihan")
            .rawQuery("sp_tagihan 'tagihanbaru1', ? , ? , ? , ? , ?, ?", [request.input('po_number'), header_code_final , Vendor[0].sup_code ,request.input('domain'), BU[0].bu_desc, request.input('empid')])
            
            for (var i = 0; i < request.input('po_table').length; i++ ){
                await Database.connection("mssql_tagihan")
                                .table('trans_details_po')
                                .insert({
                                    trans_code : header_code_final,
                                    dtl_po : request.input('po_table')[i].po_number,
                                    dtl_po_date : request.input('po_table')[i].po_date,
                                    dtl_po_curr : 'IDR',
                                    dtl_po_tax : (request.input('po_table')[i].ppn == 'Ya' ? 1 : 0),
                                    dtl_po_amount : request.input('po_table')[i].po_amount,
                                    dtl_no_mrr : request.input('po_table')[i].no_mrr,
                                    dtl_date_mrr : request.input('po_table')[i].tgl_mrr,
                                    dtl_ttl_mrr : request.input('po_table')[i].mrr_amount,
                                    dtl_no_sj : request.input('po_table')[i].no_sj,
                                    dtl_site : request.input('po_table')[i].site,
                                    dtl_flag : 1,
                                    created_date : moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
                                })                    
            }
            
            return response.status(202).send(result);
            
        } else {
            return response.status(202).send('Pilihlah Data MRR terlebih dahulu');
        }

        
    }

    public async tambahinvoicesimpan({ request, response }: HttpContextContract) {
        var moment = require('moment');

        var dpp = request.input('dpp').replaceAll('.','').replaceAll(',','.')
        var pph_amt = request.input('pph_amt').replaceAll('.','').replaceAll(',','.')
        var ppn_amt = request.input('ppn_amt').replaceAll('.','').replaceAll(',','.')
        var subtotal = request.input('subtotal').replaceAll('.','').replaceAll(',','.')
        var final_amt = request.input('final_amt').replaceAll('.','').replaceAll(',','.')
        var ppn = (request.input('ppn') === '0.11') ? 11 : 10

        const save = await Database.connection("mssql_tagihan")
        .rawQuery("sp_invoice ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?" , [request.input('action'),request.input('trans_code'), request.input('no_po'), request.input('no_inv'), request.input('tgl_inv'),request.input('no_faktur'),request.input('curr'),dpp, ppn_amt ,request.input('pajak_jenis'), pph_amt, subtotal,final_amt, request.input('keterangan'), null, ppn , request.input('no_inv_old') ])

        if(save[0].msg === 'Data Saved Successfully') {

        const invoice =  await Database.connection("mssql_tagihan")
                        .from('trans_details_inv')
                        .select('trans_dtl_inv')
                        .where('trans_code', request.input('trans_code'))
                        .where('dtl_inv_no', request.input('no_inv'))
                        .orderBy('created_date', 'desc')
                        .limit(1)

        var trans_dtl_po = request.input('mrr').split(",");
        for (var i = 0; i < trans_dtl_po.length; i++ ){
            const dtl_po =  await Database.connection("mssql_tagihan")
                        .from('trans_details_po')
                        .select('*')
                        .where('trans_code', request.input('trans_code'))
                        .where('trans_dtl_po', trans_dtl_po[i])
                        .limit(1)

            
            await Database.connection("mssql_tagihan")
                            .table('trans_details_sj')
                            .insert({
                                trans_code    : request.input('trans_code'),
                                trans_dtl_inv : invoice[0].trans_dtl_inv,
                                trans_dtl_po  : trans_dtl_po[i],
                                dtl_inv_no    : request.input('no_inv'),
                                dtl_inv_po    : dtl_po[0].dtl_po,
                                dtl_no_mrr    : dtl_po[0].dtl_no_mrr,
                                dtl_date_mrr  : dtl_po[0].dtl_date_mrr,
                                dtl_ttl_mrr   : dtl_po[0].dtl_ttl_mrr,
                                dtl_no_sj     : dtl_po[0].dtl_no_sj,
                                dtl_po_tax    : dtl_po[0].dtl_po_tax,
                            })                    
        }

        // FTP
        //Upload File PO
        for(var i = 0 ; i < 3; i++) {
            const fileAttach = request.file('file_po_'+i+'')
            let nama_file = "";
            if (fileAttach) {
                nama_file = '5_po_'+Date.now()+'^^'+fileAttach.clientName;
                await fileAttach.move(Application.publicPath('file'), { name: nama_file });
        
                //FTP
                const client = new ftp.Client();
                client.ftp.verbose = true;            
                await client.access({
                    host: '172.26.0.3',
                    user: 'itsysdev',
                    password: '<DBCsysd3v>',
                    port: 9001,
                });
                
                await client.uploadFrom(Application.publicPath(`file/${nama_file}`), `/eReg/tagihan/${nama_file}`);           
                client.close();

                await Database.connection("mssql_tagihan")   
                            .table('trans_files')
                            .returning('trans_code')
                            .insert({
                                trans_code : request.input('trans_code'),
                                trans_dtl_inv : request.input('no_inv'),
                                files_support :'PO Fully Aprroved by Vendor',
                                files_name : nama_file,
                                files_type : nama_file.split('.').pop(),
                                created_date : moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
                            })
            }
        }

        //Upload File Kwitansi
        for(var i = 0 ; i < 3; i++) {
            const fileAttach = request.file('file_inv_'+i+'')
            let nama_file = "";
            if (fileAttach) {
                nama_file = '1_inv_'+Date.now()+'^^'+fileAttach.clientName;
                await fileAttach.move(Application.publicPath('file'), { name: nama_file });
        
                //FTP
                const client = new ftp.Client();
                client.ftp.verbose = true;            
                await client.access({
                    host: '172.26.0.3',
                    user: 'itsysdev',
                    password: '<DBCsysd3v>',
                    port: 9001,
                });
                
                await client.uploadFrom(Application.publicPath(`file/${nama_file}`), `/eReg/tagihan/${nama_file}`);            
                client.close();

                await Database.connection("mssql_tagihan")   
                            .table('trans_files')
                            .returning('trans_code')
                            .insert({
                                trans_code : request.input('trans_code'),
                                trans_dtl_inv : request.input('no_inv'),
                                files_support :'Invoice & Kwitansi',
                                files_name : nama_file,
                                files_type : nama_file.split('.').pop(),
                                created_date : moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
                            })
            }
        }

         //Upload Faktur Pajak
         for(var i = 0 ; i < 3; i++) {
            const fileAttach = request.file('file_fp_'+i+'')
            let nama_file = "";
            if (fileAttach) {
                nama_file = '2_faktur_'+Date.now()+'^^'+fileAttach.clientName;
                await fileAttach.move(Application.publicPath('file'), { name: nama_file });
        
                //FTP
                const client = new ftp.Client();
                client.ftp.verbose = true;            
                await client.access({
                    host: '172.26.0.3',
                    user: 'itsysdev',
                    password: '<DBCsysd3v>',
                    port: 9001,
                });
                
                await client.uploadFrom(Application.publicPath(`file/${nama_file}`), `/eReg/tagihan/${nama_file}`);            
                client.close();

                await Database.connection("mssql_tagihan")   
                            .table('trans_files')
                            .returning('trans_code')
                            .insert({
                                trans_code : request.input('trans_code'),
                                trans_dtl_inv : request.input('no_inv'),
                                files_support :'Faktur Pajak (Otomatis apabila PPN)',
                                files_name : nama_file,
                                files_type : nama_file.split('.').pop(),
                                created_date : moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
                            })
            }
        }

        //Upload SJ / BA
        for(var i = 0 ; i < 3; i++) {
            const fileAttach = request.file('file_sj_'+i+'')
            let nama_file = "";
            if (fileAttach) {
                nama_file = '3_sj_'+Date.now()+'^^'+fileAttach.clientName;
                await fileAttach.move(Application.publicPath('file'), { name: nama_file });
        
                //FTP
                const client = new ftp.Client();
                client.ftp.verbose = true;            
                await client.access({
                    host: '172.26.0.3',
                    user: 'itsysdev',
                    password: '<DBCsysd3v>',
                    port: 9001,
                });
                
                await client.uploadFrom(Application.publicPath(`file/${nama_file}`), `/eReg/tagihan/${nama_file}`);            
                client.close();

                await Database.connection("mssql_tagihan")   
                                .table('trans_files')
                                .returning('trans_code')
                                .insert({
                                    trans_code : request.input('trans_code'),
                                    trans_dtl_inv : request.input('no_inv'),
                                    files_support :'Surat Jalan / Berita Acara',
                                    files_name : nama_file,
                                    files_type : nama_file.split('.').pop(),
                                    created_date : moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
                                })
            }
        }

        //Upload SJ / BA
        for(var i = 0 ; i < 3; i++) {
            const fileAttach = request.file('file_mrr_'+i+'')
            let nama_file = "";
            if (fileAttach) {
                nama_file = '4_mrr_'+Date.now()+'^^'+fileAttach.clientName;
                await fileAttach.move(Application.publicPath('file'), { name: nama_file });
        
                //FTP
                const client = new ftp.Client();
                client.ftp.verbose = true;            
                await client.access({
                    host: '172.26.0.3',
                    user: 'itsysdev',
                    password: '<DBCsysd3v>',
                    port: 9001,
                });
                
                await client.uploadFrom(Application.publicPath(`file/${nama_file}`), `/eReg/tagihan/${nama_file}`);            
                client.close();

                await Database.connection("mssql_tagihan")   
                                .table('trans_files')
                                .returning('trans_code')
                                .insert({
                                    trans_code : request.input('trans_code'),
                                    trans_dtl_inv : request.input('no_inv'),
                                    files_support :'MRR Pink',
                                    files_name : nama_file,
                                    files_type : nama_file.split('.').pop(),
                                    created_date : moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
                                })
            }
        }
            return response.status(202).send('Data Saved Succesfully');
        } // end if save tagihan 

        else {
            return response.status(202).send(save[0].msg);
        }
    
    }

    public async deletePO({request, response}) {   

        const deletedata = await Database.connection("mssql_tagihan")
        .rawQuery("sp_po 'pohapus', ?, ?, ? , ?", [request.input('trans_code'), request.input('dtl_po').dtl_po, null, request.input('dtl_po').dtl_no_mrr]);

        return response.status(202).send(deletedata);
    }  

    public async deleteInvoice({request, response}) {   

        const getFiles = await Database.connection("mssql_tagihan")                                
                                .from('trans_files')                                
                                .where('trans_dtl_inv', request.input('dtl_inv_no')) 
                                .select('*') 
            
        for(const file of getFiles){
            if(file.files_name){
                const client = new ftp.Client();
                client.ftp.verbose = true;            
                await client.access({
                    host: '172.26.0.3',
                    user: 'itsysdev',
                    password: '<DBCsysd3v>',
                    port: 9001,
                });
                
                await client.remove(`/eReg/tagihan/${file.files_name}`);        
                client.close();
            }
        }  
        await Database.connection("mssql_tagihan")
        .rawQuery("sp_invoice 'invoicehapus', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?", [request.input('trans_code'), request.input('dtl_inv_po'), request.input('dtl_inv_no'), null, null, null, null, null, null, null, null, null, null, null, 0, null]);

        return response.status(202).send('Data Delete Succesfully');
    }   
    
    public async deleteTagihan({request, response}) {   

        const getFiles = await Database.connection("mssql_tagihan")                                
                                .from('trans_files')                                
                                .where('trans_code', request.input('trans_code')) 
                                .select('*') 
            
        for(const file of getFiles){
            if(file.files_name){
                const client = new ftp.Client();
                client.ftp.verbose = true;            
                await client.access({
                    host: '172.26.0.3',
                    user: 'itsysdev',
                    password: '<DBCsysd3v>',
                    port: 9001,
                });
                
                await client.remove(`/eReg/tagihan/${file.files_name}`);        
                client.close();
            }
        }  
        await Database.connection("mssql_tagihan")
        .rawQuery("sp_tagihan 'tagihanhapus', ?, ? , ?", [null, request.input('trans_code'), null]);

        return response.status(202).send('Data Delete Succesfully');
    }       

    public async getListTagihan({request, response}) {                  
        var moment = require('moment'); // require
        // const page = request.input('page', 1)
        // var req = request.input('filter')

        const getBussinessUnit = await Database.connection("mssql_finsys")                                
                                .from('mst_businessunit')                                
                                .where('bu_status', 1) 
                                .select('*') 
                                .select(
                                    Database.raw("bu_alias + ' - ' + bu_desc as desc_text")
                                )
        
        const getStatusTagihan = await Database.connection("mssql_tagihan")                                
                                .from('trans_header')                                
                                .distinct('trans_flag_desc', 'trans_flag')    

        const getDataPengajuanHeader = await Database.connection("mssql_tagihan")                                 
                                .from('trans_header')                                
                                .select('*') 
                                // .where('user_create', request.input('empid')) 
                                .where((query) =>{
                                        if(request.input('trans_flag') != null && request.input('trans_flag') != '')
                                        {
                                            query.where('trans_flag', '=', `${request.input('trans_flag')}`)
                                        }
                                        if(request.input('tt_no') != null && request.input('tt_no') != '')
                                        {
                                            query.where('trans_tandaterima', 'like', `${request.input('tt_no')}%`)
                                        }
                                        if(request.input('trans_code') != null && request.input('trans_code') != '')
                                        {
                                            query.where('trans_code', '=', `${request.input('trans_code')}`)
                                        }
                                        if(request.input('trans_code') != null && request.input('trans_code') != '')
                                        {
                                            query.where('trans_code', '=', `${request.input('trans_code')}`)
                                        }
                                        if(request.input('target_to') != null && request.input('target_to') != '')
                                        {
                                            query.whereRaw('convert(varchar(10), created_date, 23) = ?', [request.input('target_to')])
                                        }
                                 })
                                .where('created_by', request.input('empid')) 
                                .orderBy('trans_code','desc')

        let where_q = ''
        if(request.input('trans_flag') != null && request.input('trans_flag') != '')
        {
            where_q += " and trans_flag = '" + request.input('trans_flag') + "'";
        }
        if(request.input('tt_no') != null && request.input('tt_no') != '')
        {
            where_q += " and trans_tandaterima like '" + request.input('tt_no') + "%'";
        }
        if(request.input('trans_code') != null && request.input('trans_code') != '')
        {
            where_q += " and a.trans_code = '" + request.input('trans_code') + "'";
        }
        if(request.input('inv_no') != null && request.input('inv_no') != '')
        {
            where_q += " and dtl_inv_no = '" + request.input('inv_no') + "'";
        }
        if(request.input('po_no') != null && request.input('po_no') != '')
        {
            where_q += " and dtl_po = '" + request.input('po_no') + "'";
        }
        if(request.input('target_to') != null && request.input('target_to') != '')
        {
            where_q += " and convert(varchar(10), a.created_date, 23) = '" + request.input('target_to') + "'";
        }
        

        const getTagihan = await Database.connection("mssql_tagihan")
        .rawQuery("select trans_flag_desc, trans_code, bu_name, trans_tandaterima, trans_due_date, sum(convert(float, dtl_inv_finaltotal)) dtl_inv_finaltotal,   FORMAT(sum(dtl_inv_finaltotal), 'N', 'de-de') as dtl_inv_finaltotal_format, created_date, trans_tandaterima_src from (  select trans_flag_desc,  a.trans_code, c.dtl_inv_no,bu_name, substring(isnull(trans_tandaterima, '-'), 0, 11) trans_tandaterima, convert(varchar(10), a.trans_due_date, 23) trans_due_date, dtl_inv_finaltotal, convert(varchar(10), a.created_date, 23) created_date, trans_tandaterima trans_tandaterima_src from trans_header a left join trans_details_po b  on a.trans_code = b.trans_code left join trans_details_inv c on a.trans_code = c.trans_code and b.dtl_po = c.dtl_inv_po where created_by = ? "+where_q+" group by trans_flag_desc,a.trans_code, c.dtl_inv_no, bu_name, isnull(trans_tandaterima, '-'), convert(varchar(10), a.trans_due_date, 23),dtl_inv_finaltotal,a.created_date,trans_tandaterima) d group by trans_flag_desc,trans_code,bu_name, trans_tandaterima,trans_due_date,created_date,trans_tandaterima_src", [request.input('empid')])
        // .rawQuery("select distinct trans_flag_desc from trans_header")

        for(const loopgetDataPengajuanHeader of getDataPengajuanHeader){
            if(loopgetDataPengajuanHeader.created_date){
                loopgetDataPengajuanHeader.created_date = moment(loopgetDataPengajuanHeader.created_date).format('YYYY-MM-DD')
            }
            if(loopgetDataPengajuanHeader.trans_tandaterima){
                loopgetDataPengajuanHeader.trans_tandaterima = loopgetDataPengajuanHeader.trans_tandaterima.substr(0,9)
            }
        }        

        const getVendor = await Database.connection("mssql_tagihan")
        .rawQuery(" select case when a.sup_code is null then b.sup_code else a.sup_code end sup_code, a.sup_name from m_supplier a left join vend_data b on a.sup_code_app = b.supp_code_app where a.sup_npwp = ?", [request.input('empid')])

        return {data1:getBussinessUnit, data2:getTagihan, data3: getStatusTagihan, data4: getVendor}          
    }

    public async getTagihan({ request }) {  
        var moment = require('moment');           
        const res = await Database.connection("mssql_tagihan")  
                        .from('trans_header')  
                        .select('*') 
                        .where('trans_code', request.input('trans_code'));
        
        for(const r of res){
            if(r.created_date){
               r.created_date = moment(r.created_date).format('YYYY-MM-DD')
            }
        } 

        
        const history = await Database.connection("mssql_finsys")
        .rawQuery("SELECT * FROM [dbo].[get_history_tagihan] (?) order by history_datetime", [request.input('trans_code')])
 

        return {data1:res, data2: history}
    }

    public async getDetailInv({ request }) {  
        var moment = require('moment');           
        const inv = await Database.connection("mssql_tagihan")  
                        .from('trans_details_inv')  
                        .select('*') 
                        .where('dtl_inv_no', request.input('no_inv'))
                        .where('trans_code', request.input('trans_code'))
                        .limit(1)
                        
        
        for(const r of inv){
            if(r.dtl_inv_date){
               r.dtl_inv_date = moment(r.dtl_inv_date).format('YYYY-MM-DD')
            }
            if(r.dtl_inv_ppn_pct){
                r.dtl_inv_ppn_pct = (r.dtl_inv_ppn_pct === 10) ? '0.1' : '0.11'
             }
        } 

        const sj = await Database.connection("mssql_tagihan")  
                    .from('trans_details_sj')  
                    .select('*') 
                    .select(
                        Database.raw("'No. MRR : ' + dtl_no_mrr + ' - Amount : ' + dtl_ttl_mrr + ' - No. Sj : ' + isnull(dtl_no_sj,'-') as desc_text")
                      )
                    .where('dtl_inv_no', request.input('no_inv'))
                    .where('trans_code', request.input('trans_code'))

        const po = await Database.connection("mssql_tagihan")  
                    .from('trans_details_inv')  
                    .distinct('dtl_inv_po') 
                    .where('dtl_inv_no', request.input('no_inv'))
                    .where('trans_code', request.input('trans_code'))

        return {data1:inv, data2: sj, data3: po }
    }

    public async getTagihanPO({ request }) {             
        const res = await Database.connection("mssql_tagihan")
        .rawQuery("select dtl_po,dtl_site,convert(varchar(10), dtl_po_date, 23) dtl_po_date,case when dtl_po_tax = 0 then 'Tidak' else 'Ya' end dtl_po_tax, dtl_po_amount, dtl_no_mrr, dtl_date_mrr,sum(convert(float, dtl_ttl_mrr)) dtl_ttl_mrr, bu_domain,trans_flag_desc, b.dtl_flag from trans_header a, trans_details_po b where a.trans_code = b.trans_code and a.trans_code = ? group by dtl_po,dtl_site,convert(varchar(10), dtl_po_date, 23),dtl_po_tax,dtl_po_amount,dtl_no_mrr,dtl_date_mrr,bu_domain,trans_flag_desc,b.dtl_flag", [request.input('trans_code')])

        return {data1:res}
    }

    public async getInvPO({ request }) {             
        const res = await Database.connection("mssql_tagihan")  
                        .from('trans_details_po')  
                        .select('dtl_po') 
                        .where('trans_code', request.input('trans_code'))
                        .groupBy('dtl_po');

        const res2 = await Database.connection("mssql_finsys")  
                        .from('mst_pajak_jenis')  
                        .join('mst_pajak', 'mst_pajak.pajak_id', '=', 'mst_pajak_jenis.pajak_id')
                        .select('*') 
                        .select(
                            Database.raw("pajak_pasal + ' - ' + pajak_jenis_nama + ' ('+ cast(cast(pajak_jenis_tarif_npwp as float)*100 as varchar(7)) +'%)' as desc_text")
                          )

        return {data1:res, data2:res2}
    }

      public async getPajakJenisFilter({ request }) {             
        const res = await Database.connection("mssql_finsys")  
                        .from('mst_pajak_jenis')  
                        .join('mst_pajak', 'mst_pajak.pajak_id', '=', 'mst_pajak_jenis.pajak_id')
                        .orWhere((query) => {
                            query
                              .where('pajak_jenis_nama', 'like', '%'+request.input('search')+'%')
                          })
                          .orWhere((query) => {
                            query
                              .where('pajak_pasal', 'like', '%'+request.input('search')+'%')
                          })
                        .select('*') 
                        .select(
                            Database.raw("pajak_pasal + ' - ' + pajak_jenis_nama + ' ('+ cast(cast(pajak_jenis_tarif_npwp as float)*100 as varchar(7)) +'%)' as desc_text")
                          )

        return {data:res}
    }


    public async getPO({ request }) {             
        const res = await Database.connection("mssql_tagihan")
        // .rawQuery("select case when b.sup_code is null then c.sup_code else b.sup_code end sup_code from userapp_vend a inner join m_supplier b on a.sup_code_app = b.sup_code_app left join vend_data c on b.sup_code_app = c.supp_code_app where a.sup_npwp = ?", [request.input('empid')])
        .rawQuery("select * from m_supplier where sup_npwp = ?", [request.input('empid')])

        const args3 = { parDomain: request.input('domain'),  parVendor: res[0].sup_code};
        const qwsa3 = await getWSA(urlDBC, "getDBCPONoInv", args3);  
        
        try {

            const res_wsa = qwsa3.tt_po.tt_poRow;     
    
            let where = request.input('site') == 'single' ? " and a.trans_code = '"+request.input('trans_code')+"'" : '';
    
            const po_ereg = await Database.connection("mssql_tagihan")
            .rawQuery("select distinct dtl_po, dtl_no_mrr, dtl_site from trans_details_po a, trans_header b where  a.trans_code = b.trans_code and b.bu_domain = ?  and b.vendor_code = ? "+ where +"", [request.input('domain'), res[0].sup_code])
    
            const mrr_trans = Array()
            const po_trans = Array()
            let ereg_site = ''
            for (var i = 0; i < po_ereg.length; i++ ){
                po_trans.push(po_ereg[i].dtl_po)
                mrr_trans.push(po_ereg[i].dtl_no_mrr)
            }
           
            if(mrr_trans.length > 0) { ereg_site = po_ereg[0].dtl_site }
    
            const temp = Array()
            const result = Array()
    
            for (var i = 0; i < res_wsa.length; i++ ){
                ereg_site = (ereg_site === null || ereg_site === '') ? res_wsa[i].site : ereg_site
                if(mrr_trans.includes(res_wsa[i].nomormrr) === false && (temp.includes(res_wsa[i].nomorpo) === false) && (request.input('site') == 'multiple' || res_wsa[i].site == ereg_site) && (res_wsa[i].site !== null || res_wsa[i].site !== '') ) {
                    temp.push(res_wsa[i].nomorpo)
                    result.push({ 'po_number' : res_wsa[i].nomorpo, 'site': res_wsa[i].site, 'desc_text': res_wsa[i].nomorpo + ' - '+ res_wsa[i].site })
                }
            }

            return {data: result}

        } catch(e){
            return {data: []}
        }
    }

    public async getPOFilter({ request }) {             
        const res = await Database.connection("mssql_tagihan")
        // .rawQuery("select case when b.sup_code is null then c.sup_code else b.sup_code end sup_code from userapp_vend a inner join m_supplier b on a.sup_code_app = b.sup_code_app left join vend_data c on b.sup_code_app = c.supp_code_app where a.sup_npwp = ?", [request.input('empid')])
        .rawQuery("select * from m_supplier where sup_npwp = ?", [request.input('empid')])

        const args3 = { parDomain: request.input('domain'),  parVendor:res[0].sup_code};
        const qwsa3 = await getWSA(urlDBC, "getDBCPONoInv", args3); 
        
        try {
            const res_wsa = qwsa3.tt_po.tt_poRow;

            let where = request.input('site') == 'single' ? " and a.trans_code = '" + request.input('trans_code') + "'" : '';

            const po_ereg = await Database.connection("mssql_tagihan")
                .rawQuery("select distinct dtl_po, dtl_no_mrr, dtl_site from trans_details_po a, trans_header b where  a.trans_code = b.trans_code and b.bu_domain = ?  and b.vendor_code = ? " + where + "", [request.input('domain'), res[0].sup_code])

            const mrr_trans = Array()
            const po_trans = Array()
            let ereg_site = ''
            for (var i = 0; i < po_ereg.length; i++) {
                po_trans.push(po_ereg[i].dtl_po)
                mrr_trans.push(po_ereg[i].dtl_no_mrr)
            }
       
            if (mrr_trans.length > 0) { ereg_site = po_ereg[0].dtl_site }

            const temp = Array()
            const result = Array()

            for (var i = 0; i < res_wsa.length; i++) {
                ereg_site = (ereg_site === null || ereg_site === '') ? res_wsa[i].site : ereg_site
                if (mrr_trans.includes(res_wsa[i].nomormrr) === false && (temp.includes(res_wsa[i].nomorpo) === false) && (request.input('site') == 'multiple' || res_wsa[i].site == ereg_site) && (res_wsa[i].site !== null || res_wsa[i].site !== '')) {
                    temp.push(res_wsa[i].nomorpo)
                    if (res_wsa[i].nomorpo.includes(request.input('search').toUpperCase()) === true || res_wsa[i].site.includes(request.input('search').toUpperCase()) === true) {
                        result.push({ 'po_number': res_wsa[i].nomorpo, 'site': res_wsa[i].site, 'desc_text': res_wsa[i].nomorpo + ' - ' + res_wsa[i].site })
                    }
                }
            }

            // return {data1:res, data2: res_wsa, data3: result}
            return { data: result }
        }  catch(e){
            return {data: []}
        }
    }

    public async getPOMrr({ request }) {      
        var moment = require('moment');

        const res = await Database.connection("mssql_tagihan")
        // .rawQuery("select case when b.sup_code is null then c.sup_code else b.sup_code end sup_code from userapp_vend a inner join m_supplier b on a.sup_code_app = b.sup_code_app left join vend_data c on b.sup_code_app = c.supp_code_app where  a.sup_npwp = ?", [request.input('empid')])
        .rawQuery("select * from m_supplier where sup_npwp = ?", [request.input('empid')])

        const args3 = { parDomain: request.input('domain'),  parVendor: res[0].sup_code}
        const qwsa3 = await getWSA(urlDBC, "getDBCPONoInv", args3)

        try {
            const res_wsa = qwsa3.tt_po.tt_poRow
        
            const po_ereg = await Database.connection("mssql_tagihan")
                .rawQuery("select distinct dtl_no_mrr from trans_details_po a, trans_header b where  a.trans_code = b.trans_code and b.bu_domain = ?  and b.vendor_code = ?", [request.input('domain'), res[0].sup_code])

            const mrr_trans = Array()
            for (var i = 0; i < po_ereg.length; i++) {
                mrr_trans.push(po_ereg[i].dtl_no_mrr)
            }

            // const rows = Array()
            // let found = false
            const result = Array()

            for (var i = 0; i < res_wsa.length; i++) {
                if (request.input('po_number') === res_wsa[i].nomorpo && (mrr_trans.includes(res_wsa[i].nomormrr) === false)) {
                    let ppn = (res_wsa[i] === true) ? 'Ya' : 'Tidak'
                    let amt_po = (res_wsa[i].amountpo === null) ? '0' : res_wsa[i].amountpo
                    result.push({ 'po_number': res_wsa[i].nomorpo, 'domain': request.input('domain'), 'po_date': moment(res_wsa[i].po_date).format("YYYY-MM-DD"), 'ppn': ppn, 'po_amount': amt_po, 'no_mrr': res_wsa[i].nomormrr, 'tgl_mrr': moment(res_wsa[i].tglmrr).format("YYYY-MM-DD"), 'mrr_amount': res_wsa[i].amountamrr, 'no_sj': res_wsa[i].SJ, 'site': res_wsa[i].site })
                }
            }

            const result_total_amt = result.reduce((acc, cur) => {
                const found = acc.find(val => val.no_mrr === cur.no_mrr)
                if (found) {
                    found.mrr_amount += Number(cur.mrr_amount)
                }
                else {
                    acc.push({ ...cur, mrr_amount: Number(cur.mrr_amount) })
                }
                return acc
            }, [])
        

       
            return { data: result_total_amt }
        } catch(e){
            return {data: []}
        }
    }

    public async getdetailPO({ request }) {             
        const res = await Database.connection("mssql_tagihan")  
                        .from('v_inv_mrr')  
                        .select('trans_dtl_po', 'dtl_no_mrr', 'dtl_ttl_mrr', 'dtl_no_sj','desc_text') 
                        .where('trans_code', request.input('trans_code'))
                        .whereIn('dtl_po', request.input('po_number'));

        return {data1:res}
    }

    public async getdetailPOEdit({ request }) {             
        const res = await Database.connection("mssql_tagihan")  
                        .from('trans_details_po')  
                        .select('trans_dtl_po', 'dtl_no_mrr', 'dtl_ttl_mrr', 'dtl_no_sj') 
                        .select(
                            Database.raw("'No. MRR : ' + dtl_no_mrr + ' - Amount : ' + dtl_ttl_mrr + ' - No. Sj : ' + isnull(dtl_no_sj,'-') as desc_text")
                          )
                        .where('trans_code', request.input('trans_code'))
                        .whereIn('dtl_po', request.input('po_number'));

        return {data1:res}
    }

    public async getFiles({ request }) {             
        const res = await Database.connection("mssql_tagihan")  
                        .from('trans_files')  
                        .select('*') 
                        .where('trans_code', request.input('trans_code'))
                        .where('trans_dtl_inv', request.input('no_inv'))
                        .where('files_support', request.input('files_support'))

        return { data1:res }
    }

    public async getdppPO({ request }) {             
        const res = await Database.connection("mssql_tagihan")  
                        .from('trans_details_po')  
                        .select('dtl_po_curr', 'dtl_po_tax') 
                        .select(
                            Database
                              .raw('sum(convert(money, dtl_ttl_mrr)) dtl_ttl_mrr'
                                )
                          )
                        .where('trans_code', request.input('trans_code'))
                        .whereIn('dtl_po', request.input('po_number'))
                        .whereIn('trans_dtl_po', request.input('trans_dtl_po'))
                        .groupBy('dtl_po_curr','dtl_po_tax');

        return {data1:res}
    }

    public async getTagihanInv({ request }) {             
        const res = await Database.connection("mssql_tagihan")  
                        .from('trans_details_inv')  
                        .select('*') 
                        .where('trans_code', request.input('trans_code'));
        return {data1:res}
    }

    public async getPajakJenis({ request }) {             
        const res = await Database.connection("mssql_finsys")  
                        .from('mst_pajak_jenis')  
                        .join('mst_pajak', 'mst_pajak.pajak_id', '=', 'mst_pajak_jenis.pajak_id')
                        .select('*') 
                        .where('pajak_jenis_id', request.input('pajak_jenis_id'));

        return {data1:res}
    }

}
