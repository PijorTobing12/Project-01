import Database from "@ioc:Adonis/Lucid/Database";
const dayjs = require('dayjs');
import Mail from '@ioc:Adonis/Addons/Mail';

export default class BoronganController {
    public async getBorongan({ request, response }) {          
        const dayjs = require('dayjs');
        var moment = require('moment'); // require
        let supcode;
        const res = await Database
        .connection('mssql_procsys')
        .from('m_supplier')
        .select('sup_code')
        .where('sup_npwp',  request.input('npwp'))  
        .first();        
        if(res == null){           
            return response.status(406).json({
                message: "Kode Supplier Tidak Ditemukan",
                status: true,
            });            
        }else{
            supcode = res.sup_code;
        }
        // return supcode;
        // supcode = '81000032';
        

        if(request.input('rowsPerPage') == null){
            const res = await Database
                        .connection('mssql_procsys')
                        .from('bupot')
                        .select('*')
                        .select( Database.raw(`CONCAT(bulan_bupot,'/',tahun_bupot) as periode`))
                        .where('npwp', request.input('npwp'));      

            for(const loopres of res){
                loopres.periode = loopres.bulan_bupot + '/' + loopres.tahun_bupot;
            }

            const getbu = await Database
            .connection('mssql_procsys')
            .from('m_bisnit_unit')
            .select('*')
            .where('status', '1')
            .orderBy('bu_name','asc');  

            return {data:res, databu: getbu};     
        }else{   
            // return request;         
            const page = request.input('page', 1)
            var req = request.input('filter')
            var sort = request.input('sortBy')
            var descend = request.input('descending')
            if(descend == 'false'){
                descend = 'desc';
            }else{
                descend = 'asc';
            }

            const res = await Database
                        .connection('mssql_finapp')
                        .from('pekerja_tagihan_header')
                        .join('pekerja_bor_dtl', 'pekerja_tagihan_header.work_header', '=', 'pekerja_bor_dtl.work_header')
                        .join('mst_customer', 'pekerja_bor_dtl.supplier_code', '=', 'mst_customer.recid')
                        .select('pekerja_tagihan_header.work_header', 'pekerja_tagihan_header.depart_name',
                                'pekerja_tagihan_header.hd_title', 'pekerja_tagihan_header.job_name',
                                'pekerja_tagihan_header.hd_periode_start', 'pekerja_tagihan_header.hd_periode_end', 'pekerja_tagihan_header.hd_flag'
                                )
                        // .select( Database.raw(`CONCAT(bulan_bupot,'/',tahun_bupot) as periode`))
                        // .where('domain','2')
                        .where('mst_customer.customercode', supcode)                             
                        .where
                        (
                        (query) => 
                        {
                            if(request.input('filter') != null)
                            {
                            query.where('work_header', 'like', `%${request.input('filter')}%`)
                            query.orWhere('depart_name', 'like', `%${request.input('filter')}%`)
                            query.orWhere('hd_title', 'like', `%${request.input('filter')}%`)
                            query.orWhere('job_name', 'like', `%${request.input('filter')}%`)
                            query.orWhere('hd_periode_start', 'like', `%${request.input('filter')}%`)
                            query.orWhere('hd_periode_end', 'like', `%${request.input('filter')}%`)
                            query.orWhere('hd_flag', 'like', `%${request.input('filter')}%`)
                            }                    
                        }                           
                        ) 
                        .groupBy('pekerja_tagihan_header.work_header', 'pekerja_tagihan_header.depart_name',
                                'pekerja_tagihan_header.hd_title', 'pekerja_tagihan_header.job_name',
                                'pekerja_tagihan_header.hd_periode_start', 'pekerja_tagihan_header.hd_periode_end', 'pekerja_tagihan_header.hd_flag'
                                )      
                        .orderBy(sort,descend)         
                        .paginate(page, request.input('rowsPerPage'))
           
            for(const loopres of res){
                if(loopres.hd_periode_start){
                    loopres.hd_periode_start = moment(loopres.hd_periode_start).format('YYYY-MM-DD')             
                }
                if(loopres.hd_periode_end){
                    loopres.hd_periode_end = moment(loopres.hd_periode_end).format('YYYY-MM-DD')             
                }

                if(loopres.hd_flag){
                    loopres.hd_flag_ori = loopres.hd_flag;
                    if(loopres.hd_flag == '1'){
                        loopres.hd_flag = 'Pending';
                    }else if(loopres.hd_flag == '2'){
                        loopres.hd_flag = 'Check Vendor';
                    }else if(loopres.hd_flag == '3'){
                        loopres.hd_flag = 'Vendor Revisi';
                    }else if(loopres.hd_flag == '4'){
                        loopres.hd_flag = 'Approval';
                    }else if(loopres.hd_flag == '5'){
                        loopres.hd_flag = 'Approval Revisi';
                    }else if(loopres.hd_flag == '6'){
                        loopres.hd_flag = 'Close';
                    }                              
                }
            }
            
            const getdept = await Database
            .connection('mssql_finapp')
            .from('vw_dept_hris')
            .select('*')
            .orderBy('bu_code','asc');

            const getpekerjaan = await Database
            .connection('mssql_finapp')
            .from('m_pekerjaan')
            .select('*')
            .orderBy('job_domain_name','asc');

            const getbu = await Database
            .connection('mssql_procsys')
            .from('m_bisnit_unit')
            .select('*')
            .where('status', '1')
            .orderBy('bu_name','asc');

            return {data:res, databu: getbu, datadept: getdept, datapekerjaan: getpekerjaan};                 
        }        
    }

    public async getDetailListBorongan({ request, response }) {          
        const dayjs = require('dayjs');
        var moment = require('moment'); // require
        let supcode;
        const getsupcode = await Database
        .connection('mssql_procsys')
        .from('m_supplier')
        .select('sup_code')
        .where('sup_npwp',  request.input('empid'))  
        .first();        
        if(getsupcode == null){           
            return response.status(406).json({
                message: "Kode Supplier Tidak Ditemukan",
                status: true,
            });            
        }else{
            supcode = getsupcode.sup_code;
        }



        // supcode = '81000032';

        const getheader = await Database
                    .connection('mssql_finapp')
                    .from('pekerja_tagihan_header')
                    .select('pekerja_tagihan_header.work_header', 'pekerja_tagihan_header.hd_flag',
                            'pekerja_tagihan_header.hd_title', 'pekerja_tagihan_header.job_name',
                            'pekerja_tagihan_header.hd_periode_start', 'pekerja_tagihan_header.hd_periode_end', 
                            'pekerja_tagihan_header.hd_flag', 'pekerja_tagihan_header.timework_desc',
                            'pekerja_tagihan_header.hd_desc'
                            )
                    .where('pekerja_tagihan_header.work_header', request.input('id'));   
        
        for(const loopgetheader of getheader){
            if(loopgetheader.hd_periode_start){
                loopgetheader.hd_periode_start = moment(loopgetheader.hd_periode_start).format('YYYY-MM-DD')             
            }
            if(loopgetheader.hd_periode_end){
                loopgetheader.hd_periode_end = moment(loopgetheader.hd_periode_end).format('YYYY-MM-DD')             
            }
        }

        const getdetail = await Database
                    .connection('mssql_finapp')
                    .from('pekerja_bor_dtl')
                    .join('mst_customer', 'pekerja_bor_dtl.supplier_code', '=', 'mst_customer.recid')
                    .select('work_dtl_bor', 'work_date',
                            'jobdetails_name', 'work_dtl_bor_nilai_1',
                            'work_dtl_bor_nilai_2', 'work_dtl_bor_nilai_3', 'work_dtl_bor_satuan'
                            )
                    .select( Database.raw(`work_dtl_bor_nilai_1 + work_dtl_bor_nilai_2 + work_dtl_bor_nilai_3 as work_dtl_bor_nilai`))
                    .select( Database.raw(`(select top 1 case when log_desc_approve is null then log_desc_revisi else log_desc_approve end from pekerja_log where work_header = ` + request.input('id') + `and app_id = pekerja_bor_dtl.work_dtl_bor order by log_date desc) as log_desc_approve`))
                    .where('pekerja_bor_dtl.work_header', request.input('id'))
                    .where('customercode', supcode);
        let totalqty = 0;
        for(const loopgetdetail of getdetail){
            if(loopgetdetail.work_date){
                loopgetdetail.work_date = moment(loopgetdetail.work_date).format('YYYY-MM-DD')             
            }
            totalqty = totalqty + loopgetdetail.work_dtl_bor_nilai;
        }

        return {header:getheader, detail: getdetail, flag: request.input('hdflagori'), totalqty: totalqty};  
       
    }

    public async getBoronganWithFilter({ request, response }) {          
        const dayjs = require('dayjs');
        var moment = require('moment'); // require
        // return request;  
        let supcode;    
        const res0 = await Database
        .connection('mssql_procsys')
        .from('m_supplier')
        .select('sup_code')
        .where('sup_npwp',  request.input('npwp'))  
        .first();        
        if(res0 == null){           
            return response.status(406).json({
                message: "Kode Supplier Tidak Ditemukan",
                status: true,
            });            
        }else{
            supcode = res0.sup_code;
        }

        // supcode = '81000032';
        
        let tgl1 = request.input('periodeawal');
        let tgl2 = request.input('periodeakhir');
        tgl1 = tgl1;
        tgl2 = tgl2;

               
        const page = request.input('page', 1)
        var req = request.input('filter')
        var sort = request.input('sortBy')
        var descend = request.input('descending')
        if(descend == 'false'){
            descend = 'desc';
        }else{
            descend = 'asc';
        }

        let res:any = [];
        if(request.input('dept.dept_id') == null && request.input('pekerjaan') == null){
            res = await Database
                    .connection('mssql_finapp')
                    .from('pekerja_tagihan_header')
                    .join('pekerja_bor_dtl', 'pekerja_tagihan_header.work_header', '=', 'pekerja_bor_dtl.work_header')
                    .join('mst_customer', 'pekerja_bor_dtl.supplier_code', '=', 'mst_customer.recid')
                    .select('pekerja_tagihan_header.work_header', 'pekerja_tagihan_header.depart_name',
                            'pekerja_tagihan_header.hd_title', 'pekerja_tagihan_header.job_name',
                            'pekerja_tagihan_header.hd_periode_start', 'pekerja_tagihan_header.hd_periode_end', 'pekerja_tagihan_header.hd_flag'
                            )
                    .where('mst_customer.customercode', supcode)                                                
                    .where('pekerja_tagihan_header.hd_periode_start', '>=', tgl1)   
                    .where('pekerja_tagihan_header.hd_periode_end', '<=', tgl2)  
                    .groupBy('pekerja_tagihan_header.work_header', 'pekerja_tagihan_header.depart_name',
                            'pekerja_tagihan_header.hd_title', 'pekerja_tagihan_header.job_name',
                            'pekerja_tagihan_header.hd_periode_start', 'pekerja_tagihan_header.hd_periode_end', 'pekerja_tagihan_header.hd_flag'
                            )      
        }else if(request.input('dept.dept_id') != null && request.input('pekerjaan') == null){
            res = await Database
            .connection('mssql_finapp')
            .from('pekerja_tagihan_header')
            .join('pekerja_bor_dtl', 'pekerja_tagihan_header.work_header', '=', 'pekerja_bor_dtl.work_header')
            .join('mst_customer', 'pekerja_bor_dtl.supplier_code', '=', 'mst_customer.recid')
            .select('pekerja_tagihan_header.work_header', 'pekerja_tagihan_header.depart_name',
                    'pekerja_tagihan_header.hd_title', 'pekerja_tagihan_header.job_name',
                    'pekerja_tagihan_header.hd_periode_start', 'pekerja_tagihan_header.hd_periode_end', 'pekerja_tagihan_header.hd_flag'
                    )
            .where('mst_customer.customercode', supcode) 
            .where('depart_code', request.input('dept.dept_id'))                                               
            .where('pekerja_tagihan_header.hd_periode_start', '>=', tgl1)   
            .where('pekerja_tagihan_header.hd_periode_end', '<=', tgl2)  
            .groupBy('pekerja_tagihan_header.work_header', 'pekerja_tagihan_header.depart_name',
                    'pekerja_tagihan_header.hd_title', 'pekerja_tagihan_header.job_name',
                    'pekerja_tagihan_header.hd_periode_start', 'pekerja_tagihan_header.hd_periode_end', 'pekerja_tagihan_header.hd_flag'
                    )      
        }else if(request.input('dept.dept_id') == null && request.input('pekerjaan') != null){
            res = await Database
            .connection('mssql_finapp')
            .from('pekerja_tagihan_header')
            .join('pekerja_bor_dtl', 'pekerja_tagihan_header.work_header', '=', 'pekerja_bor_dtl.work_header')
            .join('mst_customer', 'pekerja_bor_dtl.supplier_code', '=', 'mst_customer.recid')
            .select('pekerja_tagihan_header.work_header', 'pekerja_tagihan_header.depart_name',
                    'pekerja_tagihan_header.hd_title', 'pekerja_tagihan_header.job_name',
                    'pekerja_tagihan_header.hd_periode_start', 'pekerja_tagihan_header.hd_periode_end', 'pekerja_tagihan_header.hd_flag'
                    )
            .where('mst_customer.customercode', supcode) 
            .where('job_id', request.input('pekerjaan'))                                               
            .where('pekerja_tagihan_header.hd_periode_start', '>=', tgl1)   
            .where('pekerja_tagihan_header.hd_periode_end', '<=', tgl2)  
            .groupBy('pekerja_tagihan_header.work_header', 'pekerja_tagihan_header.depart_name',
                    'pekerja_tagihan_header.hd_title', 'pekerja_tagihan_header.job_name',
                    'pekerja_tagihan_header.hd_periode_start', 'pekerja_tagihan_header.hd_periode_end', 'pekerja_tagihan_header.hd_flag'
                    )      
        }else{
            res = await Database
            .connection('mssql_finapp')
            .from('pekerja_tagihan_header')
            .join('pekerja_bor_dtl', 'pekerja_tagihan_header.work_header', '=', 'pekerja_bor_dtl.work_header')
            .join('mst_customer', 'pekerja_bor_dtl.supplier_code', '=', 'mst_customer.recid')
            .select('pekerja_tagihan_header.work_header', 'pekerja_tagihan_header.depart_name',
                    'pekerja_tagihan_header.hd_title', 'pekerja_tagihan_header.job_name',
                    'pekerja_tagihan_header.hd_periode_start', 'pekerja_tagihan_header.hd_periode_end', 'pekerja_tagihan_header.hd_flag'
                    )
            .where('mst_customer.customercode', supcode) 
            .where('depart_code', request.input('dept.dept_id'))    
            .where('job_id', request.input('pekerjaan'))                                               
            .where('pekerja_tagihan_header.hd_periode_start', '>=', tgl1)   
            .where('pekerja_tagihan_header.hd_periode_end', '<=', tgl2)  
            .groupBy('pekerja_tagihan_header.work_header', 'pekerja_tagihan_header.depart_name',
                    'pekerja_tagihan_header.hd_title', 'pekerja_tagihan_header.job_name',
                    'pekerja_tagihan_header.hd_periode_start', 'pekerja_tagihan_header.hd_periode_end', 'pekerja_tagihan_header.hd_flag'
                    )        
        }
       
        
        let jumdata = 0;
        for(const loopres of res){
            jumdata = jumdata + 1;
            if(loopres.hd_periode_start){
                loopres.hd_periode_start = moment(loopres.hd_periode_start).format('YYYY-MM-DD')             
            }
            if(loopres.hd_periode_end){
                loopres.hd_periode_end = moment(loopres.hd_periode_end).format('YYYY-MM-DD')             
            }

            if(loopres.hd_flag){
                loopres.hd_flag_ori = loopres.hd_flag;
                if(loopres.hd_flag == '1'){
                    loopres.hd_flag = 'Pending';
                }else if(loopres.hd_flag == '2'){
                    loopres.hd_flag = 'Check Vendor';
                }else if(loopres.hd_flag == '3'){
                    loopres.hd_flag = 'Vendor Revisi';
                }else if(loopres.hd_flag == '4'){
                    loopres.hd_flag = 'Approval';
                }else if(loopres.hd_flag == '5'){
                    loopres.hd_flag = 'Approval Revisi';
                }else if(loopres.hd_flag == '6'){
                    loopres.hd_flag = 'Close';
                }                              
            }
        }
        
        const getdept = await Database
        .connection('mssql_finapp')
        .from('vw_dept_hris')
        .select('*')
        .orderBy('bu_code','asc');

        const getpekerjaan = await Database
        .connection('mssql_finapp')
        .from('m_pekerjaan')
        .select('*')
        .orderBy('job_domain_name','asc');

        const getbu = await Database
        .connection('mssql_procsys')
        .from('m_bisnit_unit')
        .select('*')
        .where('status', '1')
        .orderBy('bu_name','asc');

        return {data:res, databu: getbu, datadept: getdept, datapekerjaan: getpekerjaan, jumdata: jumdata};                 
     
    }

    public async saveListBorongan({ request, response }) { 

        let supcode;
        const getsupcode = await Database
        .connection('mssql_procsys')
        .from('m_supplier')
        .select('sup_code')
        .where('sup_npwp',  request.input('npwp'))  
        .first();        
        if(getsupcode == null){           
            return response.status(406).json({
                message: "Kode Supplier Tidak Ditemukan",
                status: true,
            });            
        }else{
            supcode = getsupcode.sup_code;
        }

        // supcode = '81000032';

        const insert = await Database
        .connection('mssql_finapp')
        .table('pekerja_log')
        .insert({
            work_header     : request.input('idheader'),
            log_input       : 'Borongan',
            log_role        : 'Vendor',
            log_approval    : supcode,
            app_id          : request.input('work_dtl_bor'),
            log_level       : 1,
            log_date        : dayjs().format('YYYY-MM-DD HH:mm:ss'),
            log_flag        : 2,
            log_desc_approve: request.input('log_desc_approve'),
        })
    }

    public async revisiListBorongan({ request, response }) { 

        let supcode;
        const getsupcode = await Database
        .connection('mssql_procsys')
        .from('m_supplier')
        .select('sup_code')
        .where('sup_npwp',  request.input('npwp'))  
        .first();        
        if(getsupcode == null){           
            return response.status(406).json({
                message: "Kode Supplier Tidak Ditemukan",
                status: true,
            });            
        }else{
            supcode = getsupcode.sup_code;
        }

        // supcode = '81000032';

        const update = await Database
        .connection('mssql_finapp')
        .from('pekerja_tagihan_header')
        .where('work_header',  request.input('idheader'))            
        .update(
            {   hd_flag:  3, 
                hd_approval_vendor:  0,
            }                
        )  

        const insert = await Database
        .connection('mssql_finapp')
        .table('pekerja_log')
        .insert({
            work_header     : request.input('idheader'),
            log_input       : 'Borongan',
            log_role        : 'Vendor',
            log_approval    : supcode,
            app_id          : request.input('work_dtl_bor'),
            log_level       : 1,
            log_date        : dayjs().format('YYYY-MM-DD HH:mm:ss'),
            log_flag        : 3,
            log_desc_revisi : request.input('log_desc_approve'),
        })
    }

    public async sendEmailRevBorongan({ request, response }) { 

        let createdby;
        let deptname;
        let jobname;
        let periodeawal;
        let periodeakhir;
        let hddesc;
        const getdataheader = await Database
        .connection('mssql_finapp')
        .from('pekerja_tagihan_header')
        .select('*')
        .where('work_header',  request.input('id'))  
        .first(); 
        if(getdataheader == null){           
            return response.status(406).json({
                message: "Creator Tidak Ditemukan",
                status: true,
            });            
        }else{
            createdby   = getdataheader.created_by;
            deptname    = getdataheader.depart_name;
            jobname     = getdataheader.job_name;
            periodeawal = getdataheader.hd_periode_start;
            periodeakhir= getdataheader.hd_periode_end;
            hddesc      = getdataheader.hd_desc;
        }   

        let creatorname;
        let creatoremail;
        const getusercreator = await Database
        .connection('mssql_finapp')
        .from('mst_user')
        .select('*')
        .where('user_name',  createdby)  
        .first();        
        if(getusercreator == null){           
            return response.status(406).json({
                message: "User Create Tidak Ditemukan",
                status: true,
            });            
        }else{
            creatorname = getusercreator.Name_User;
            creatoremail = getusercreator.Email_User;
        }

        let supname;
        const getsupname = await Database
        .connection('mssql_procsys')
        .from('m_supplier')
        .select('sup_name')
        .where('sup_npwp',  request.input('npwp'))  
        .first();        
        if(getsupname == null){           
            return response.status(406).json({
                message: "Kode Supplier Tidak Ditemukan",
                status: true,
            });            
        }else{
            supname = getsupname.sup_name;
        }

        var moment      = require('moment'); // require
        periodeawal     = moment(periodeawal).format('YYYY-MM-DD');
        periodeakhir    = moment(periodeakhir).format('YYYY-MM-DD');       

        await Mail.send((message) => {
        message
            .from('autosys@dbc.co.id')
            .to(creatoremail)
            // .to('agust@dbc.co.id')
            // .bcc('riki@dbc.co.id')
            .bcc('asrul@dbc.co.id')
            .bcc('shendy.dewandaru@dbc.co.id')
            .subject('Revisi Data Tagihan')              
            .htmlView('emails/Borongan/revisi_borongan', {                   
                creatorname: creatorname,
                supname: supname,
                deptname: deptname,
                jobname: jobname,
                periodeawal: periodeawal,
                periodeakhir: periodeakhir,
                hddesc: hddesc,
            })
        })
    }

    public async approveListBorongan({ request, response }) { 

        let supcode;
        const getsupcode = await Database
        .connection('mssql_procsys')
        .from('m_supplier')
        .select('sup_code')
        .where('sup_npwp',  request.input('npwp'))  
        .first();        
        if(getsupcode == null){           
            return response.status(406).json({
                message: "Kode Supplier Tidak Ditemukan",
                status: true,
            });            
        }else{
            supcode = getsupcode.sup_code;
        }

        // supcode = '81000032';

        let createdby;
        let deptname;
        let jobname;
        let periodeawal;
        let periodeakhir;
        let hddesc;
        let deptcode;
        // return request;
        const getdataheader = await Database
        .connection('mssql_finapp')
        .from('pekerja_tagihan_header')
        .select('*')
        .where('work_header',  request.input('idheader'))  
        .first(); 
        if(getdataheader == null){           
            return response.status(406).json({
                message: "Creator Tidak Ditemukan",
                status: true,
            });            
        }else{
            createdby   = getdataheader.created_by;
            deptname    = getdataheader.depart_name;
            jobname     = getdataheader.job_name;
            periodeawal = getdataheader.hd_periode_start;
            periodeakhir= getdataheader.hd_periode_end;
            hddesc      = getdataheader.hd_desc;
            deptcode    = getdataheader.depart_code;
        }   

        const getadmapproval = await Database
        .connection('mssql_finapp')
        .from('m_admin_approval')
        .select('*')
        .where('app_depart_code',  deptcode)  
        .first(); 
        if(getadmapproval == null){           
            return response.status(406).json({
                message: "Gagal memproses data, tidak ada data approval",
                status: true,
            });            
        }  

        let levelapproval;
        const getadmapproval2 = await Database
        .connection('mssql_finapp')
        .from('m_admin_approval')
        .select('*')
        .where('app_depart_code',  deptcode)  
        .orderBy('app_level','asc')
        .first(); 
        if(getadmapproval2){           
            levelapproval = getadmapproval2.app_level;
        } 

        const update = await Database
        .connection('mssql_finapp')
        .from('pekerja_tagihan_header')
        .where('work_header',  request.input('idheader'))            
        .update(
            {   hd_flag:  4, 
                hd_approval_vendor:  1,
                hd_level_approval: levelapproval,
            }                
        )  

        const insert = await Database
        .connection('mssql_finapp')
        .table('pekerja_log')
        .insert({
            work_header     : request.input('idheader'),
            log_input       : 'Borongan',
            log_role        : 'Vendor',
            log_approval    : supcode,
            app_id          : request.input('work_dtl_bor'),
            log_level       : levelapproval,
            log_date        : dayjs().format('YYYY-MM-DD HH:mm:ss'),
            log_flag        : 4,
            log_desc_approve : request.input('log_desc_approve'),
        })
    }

    public async sendEmailApproveBorongan({ request, response }) { 

        let createdby;
        let deptname;
        let jobname;
        let periodeawal;
        let periodeakhir;
        let hddesc;
        let deptcode;
        const getdataheader = await Database
        .connection('mssql_finapp')
        .from('pekerja_tagihan_header')
        .select('*')
        .where('work_header',  request.input('id'))  
        .first(); 
        if(getdataheader == null){           
            return response.status(406).json({
                message: "Creator Tidak Ditemukan",
                status: true,
            });            
        }else{
            createdby   = getdataheader.created_by;
            deptname    = getdataheader.depart_name;
            jobname     = getdataheader.job_name;
            periodeawal = getdataheader.hd_periode_start;
            periodeakhir= getdataheader.hd_periode_end;
            hddesc      = getdataheader.hd_desc;
            deptcode    = getdataheader.depart_code;
        }   

        let levelapproval;
        let rowiduser;
        const getadmapproval2 = await Database
        .connection('mssql_finapp')
        .from('m_admin_approval')
        .select('*')
        .where('app_depart_code',  deptcode)  
        .orderBy('app_level','asc')
        .first(); 
        if(getadmapproval2){           
            levelapproval   = getadmapproval2.app_level;
            rowiduser       = getadmapproval2.userlogin;
        }

        let levelapprovalname;
        let levelapprovalemail;
        const getuserapproval = await Database
        .connection('mssql_finapp')
        .from('mst_user')
        .select('*')
        .where('code_user',  rowiduser)  
        .first();        
        if(getuserapproval == null){           
            return response.status(406).json({
                message: "User Create Tidak Ditemukan",
                status: true,
            });            
        }else{
            levelapprovalname   = getuserapproval.Name_User;
            levelapprovalemail  = getuserapproval.Email_User;
        }

        let supname;
        const getsupname = await Database
        .connection('mssql_procsys')
        .from('m_supplier')
        .select('sup_name')
        .where('sup_npwp',  request.input('npwp'))  
        .first();        
        if(getsupname == null){           
            return response.status(406).json({
                message: "Kode Supplier Tidak Ditemukan",
                status: true,
            });            
        }else{
            supname = getsupname.sup_name;
        }

        var moment      = require('moment'); // require
        periodeawal     = moment(periodeawal).format('YYYY-MM-DD');
        periodeakhir    = moment(periodeakhir).format('YYYY-MM-DD');       

        await Mail.send((message) => {
        message
            .from('autosys@dbc.co.id')
            .to(levelapprovalemail)
            // .to('agust@dbc.co.id')
            // .to('denty@rucika.co.id')
            // .bcc('riki@dbc.co.id')            
            .bcc('asrul@dbc.co.id')
            .bcc('shendy.dewandaru@dbc.co.id')
            .subject('Approval Data Tagihan')              
            .htmlView('emails/Borongan/approve_borongan', {                   
                approvalname: levelapprovalname,
                supname: supname,
                deptname: deptname,
                jobname: jobname,
                periodeawal: periodeawal,
                periodeakhir: periodeakhir,
                hddesc: hddesc,
            })
        })
    }



}
