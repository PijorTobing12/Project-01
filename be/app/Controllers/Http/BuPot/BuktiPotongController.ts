import Database from "@ioc:Adonis/Lucid/Database";
import BuPot from "App/Models/BuPot";
const ftp = require("basic-ftp");
const dayjs = require('dayjs');
import { downloadFromFTP } from "App/Helpers/downloadFromFTP";
import Application from '@ioc:Adonis/Core/Application';
const os    = require('os');
const path  = require('path');

export default class BuktiPotongController {
    public async getBuktiPotong({ request, response }) {          
        const dayjs = require('dayjs');

        if(request.input('rowsPerPage') == null){
            const res = await Database
                        .connection('mssql_procsys')
                        .from('bupot')
                        .select('*')
                        .select( Database.raw(`CONCAT(bulan_bupot,'/',tahun_bupot) as periode`))
                        .where('npwp', newNPWP);      

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

            const str = request.input('npwp');
            const newNPWP = str.substr(1, 15);
            
            const res = await Database
                        .connection('mssql_procsys')
                        .from('bupot')
                        .select('*')
                        .select( Database.raw(`CONCAT(bulan_bupot,'/',tahun_bupot) as periode`))
                        // .where('npwp', newNPWP)  
                        .where
                        (
                        (query) => 
                        {
                            if(newNPWP != null)
                            {
                            query.where('npwp', 'like', `%${newNPWP}%`)
                            query.orWhere('npwp_15', 'like', `%${newNPWP}%`)
                            }                    
                        }                           
                        )                               
                        .where
                        (
                        (query) => 
                        {
                            if(request.input('filter') != null)
                            {
                            query.where('no_bupot', 'like', `%${request.input('filter')}%`)
                            query.orWhere('npwp', 'like', `%${request.input('filter')}%`)
                            query.orWhere('bulan_bupot', 'like', `%${request.input('filter')}%`)
                            query.orWhere('tahun_bupot', 'like', `%${request.input('filter')}%`)
                            }                    
                        }                           
                        )           
                        .orderBy(sort,descend)         
                        .paginate(page, request.input('rowsPerPage'))
            // return page;
            console.log(page);
            console.log(request.input('rowsPerPage'));
            
            

            const getbu = await Database
            .connection('mssql_procsys')
            .from('m_bisnit_unit')
            .select('*')
            .where('status', '1')
            .orderBy('bu_name','asc');

            return {data:res, databu: getbu};                 
        }        
    }

    public async deleteBuktiPotong({ request, response }) { 
        // return request;
        const res = await Database
        .connection('mssql_procsys')
        .from('bupot')
        .select('*')
        .where('id_bupot',  request.input('id_bupot'))  
        .first();        
        if(res == null){           
            return response.status(406).json({
                message: "Data Tidak Ditemukan",
                status: true,
            });            
        }else{
            await Database
            .connection('mssql_procsys')
            .from('bupot')
            .select('*')
            .where('id_bupot',  request.input('id_bupot'))  
            .delete();
            
            return response.status(200).json({
                message: "Data Berhasil Dihapus",
                status: true,
            });
        }
    }

    public async getBuktiPotongWithFilter({ request, response }) {          
        const dayjs = require('dayjs');

        const str = request.input('npwp');
        const newNPWP = str.substr(1, 15);
        
        let res: any[];
        if(request.input('bu') == null && request.input('bulan') == null && request.input('tahun') == null){
            res = await Database
                        .connection('mssql_procsys')
                        .from('bupot')
                        .select('*')
                        .select( Database.raw(`CONCAT(bulan_bupot,'/',tahun_bupot) as periode`))
                         // .where('npwp', newNPWP)  
                        .where
                        (
                        (query) => 
                        {
                            if(newNPWP != null)
                            {
                            query.where('npwp', 'like', `%${newNPWP}%`)
                            query.orWhere('npwp_15', 'like', `%${newNPWP}%`)
                            }                    
                        }                           
                        );  
        }else if(request.input('bu') != null && request.input('bulan') == null && request.input('tahun') == null){
            res = await Database
                        .connection('mssql_procsys')
                        .from('bupot')
                        .select('*')
                        .select( Database.raw(`CONCAT(bulan_bupot,'/',tahun_bupot) as periode`))
                        .where('bu_id', request.input('bu'))
                         // .where('npwp', newNPWP)  
                        .where
                        ((query) => 
                        {
                            if(newNPWP != null)
                            {
                            query.where('npwp', 'like', `%${newNPWP}%`)
                            query.orWhere('npwp_15', 'like', `%${newNPWP}%`)
                            }                    
                        });  
        }else if(request.input('bu') == null && request.input('bulan') != null && request.input('tahun') != null){
             res = await Database
                        .connection('mssql_procsys')
                        .from('bupot')
                        .select('*')
                        .select( Database.raw(`CONCAT(bulan_bupot,'/',tahun_bupot) as periode`))
                         // .where('npwp', newNPWP)  
                         .where
                         ((query) => 
                         {
                             if(newNPWP != null)
                             {
                             query.where('npwp', 'like', `%${newNPWP}%`)
                             query.orWhere('npwp_15', 'like', `%${newNPWP}%`)
                             }                    
                         })
                        .where('bulan_bupot', request.input('bulan'))
                        .where('tahun_bupot', request.input('tahun'));  
        }else if(request.input('bu') != null && request.input('bulan') != null && request.input('tahun') == null){
            res = await Database
                       .connection('mssql_procsys')
                       .from('bupot')
                       .select('*')
                       .select( Database.raw(`CONCAT(bulan_bupot,'/',tahun_bupot) as periode`))
                        // .where('npwp', newNPWP)  
                        .where
                        ((query) => 
                        {
                            if(newNPWP != null)
                            {
                            query.where('npwp', 'like', `%${newNPWP}%`)
                            query.orWhere('npwp_15', 'like', `%${newNPWP}%`)
                            }                    
                        })
                       .where('bulan_bupot', request.input('bulan'));  
        }else if(request.input('bu') != null && request.input('bulan') == null && request.input('tahun') != null){
            res = await Database
                       .connection('mssql_procsys')
                       .from('bupot')
                       .select('*')
                       .select( Database.raw(`CONCAT(bulan_bupot,'/',tahun_bupot) as periode`))
                        // .where('npwp', newNPWP)  
                        .where
                        ((query) => 
                        {
                            if(newNPWP != null)
                            {
                            query.where('npwp', 'like', `%${newNPWP}%`)
                            query.orWhere('npwp_15', 'like', `%${newNPWP}%`)
                            }                    
                        })
                       .where('bu_id', request.input('bu'))
                       .where('tahun_bupot', request.input('tahun'));  
        }else if(request.input('bu') == null && request.input('bulan') != null && request.input('tahun') == null){
            res = await Database
                       .connection('mssql_procsys')
                       .from('bupot')
                       .select('*')
                       .select( Database.raw(`CONCAT(bulan_bupot,'/',tahun_bupot) as periode`))
                       .where
                       ((query) => 
                       {
                           if(newNPWP != null)
                           {
                           query.where('npwp', 'like', `%${newNPWP}%`)
                           query.orWhere('npwp_15', 'like', `%${newNPWP}%`)
                           }                    
                       })
                       .where('bulan_bupot', request.input('bulan'));  
        }
        else{
            res = await Database
                        .connection('mssql_procsys')
                        .from('bupot')
                        .select('*')
                        .select( Database.raw(`CONCAT(bulan_bupot,'/',tahun_bupot) as periode`))
                        .where('bu_id', request.input('bu'))
                        .where
                        ((query) => 
                        {
                            if(newNPWP != null)
                            {
                            query.where('npwp', 'like', `%${newNPWP}%`)
                            query.orWhere('npwp_15', 'like', `%${newNPWP}%`)
                            }                    
                        })
                        .where('bulan_bupot', request.input('bulan'))
                        .where('tahun_bupot', request.input('tahun'));  
        }

        let jumdata = 0;
        for(const loopres of res){
            jumdata++;
        }

        return {data:res, jumdata: jumdata};  
    }


    public async getBuktiPotong2({ request, response }) {
        let filename;
        let nomorbupot;
        let npwp;
        let suppcode;
        let file = request.input('file');

        filename    = request.input('file');
        nomorbupot  = filename.split("_")[0];
        npwp        = filename.split("_")[1];

        const getsuppcode = await Database
        .connection('mssql_procsys')
        .from('m_supplier')
        .select('*')
        .where('sup_npwp', npwp)
        .first();
        if(getsuppcode){
            suppcode = getsuppcode.sup_code_app;
        }else{
            suppcode = null;
        }
        
        const insert = await Database
        .connection('mssql_procsys')
        .table('log_bupot')
        .insert({
            npwp            : npwp,
            no_bupot        : nomorbupot,
            sup_code_app    : suppcode,
            download_date   : dayjs().format('YYYY-MM-DD HH:mm:ss'),
        })
        
        const tempImage = path.join(os.tmpdir(), file);
        await downloadFromFTP(file, response, tempImage);
        response.download(tempImage, true);
    };
    
    public async downloadFile(file, res) {


        // const fs = require('fs');
        // const https = require('https');
        // const path = require('path');
        // const os = require('os');

        // const filename = request.input('file');
        // const tempImage = path.join(os.tmpdir(), filename);

        // await https.get(`https://fileserp.dbc.co.id/eReg/bupot/${file}`, (response) => {
        //     response.pipe(fs.createWriteStream(tempImage));
        //     response.on('end', () => {
        //         response.download(tempImage, filename);
        //     });
        // });
        return 'https://fileserp.dbc.co.id/eReg/'+ res.input('file'); 
        return 'https://fileserp.dbc.co.id/eReg/bupot/'+ res.input('file'); 
        return request;      
        const dayjs = require('dayjs');

        let buid;
        const getbuid = await Database
        .connection('mssql_procsys')
        .from('m_bisnit_unit')
        .select('bu_id')
        .where('bu_code_qad', request.input('domain'))
        .first();   
        if(getbuid){
            buid = getbuid.bu_id;
        }else{
            return response.status(406).json({
                message: "Bisnis Unit Belum Terdaftar",
                status: true,
                data: '-',
            });
        }

        if(request.input('rowsPerPage') == null){
            const res = await Database
                        .connection('mssql_procsys')
                        .from('bupot')
                        .select('*')
                        .where('bu_id', buid);      

            for(const loopres of res){
                loopres.periode = loopres.bulan_bupot + '/' + loopres.tahun_bupot;
            }

            return res;
        }else{            
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
                        .connection('mssql_procsys')
                        .from('bupot')
                        .select('*')
                        .where('bu_id', buid)                                      
                        .where
                        (
                        (query) => 
                        {
                            if(request.input('filter') != null)
                            {
                            query.where('no_bupot', 'like', `%${request.input('filter')}%`)
                            query.orWhere('npwp', 'like', `%${request.input('filter')}%`)
                            query.orWhere('bulan_bupot', 'like', `%${request.input('filter')}%`)
                            query.orWhere('tahun_bupot', 'like', `%${request.input('filter')}%`)
                            }                    
                        }                           
                        )           
                        .orderBy(sort,descend)         
                        .paginate(page, request.input('rowsPerPage'))                                  
            
            for(const loopres of res){
                loopres.periode = loopres.bulan_bupot + '/' + loopres.tahun_bupot;
            }

            return res;                  
        }        
    }
      
    public async saveUploadBuPot({ request, response }) {  
        let filename;
        let file;    
        let nomorbupot;
        let npwp;
        let buid;
        // return request;
        const getbuid = await Database
        .connection('mssql_procsys')
        .from('m_bisnit_unit')
        .select('bu_id')
        .where('bu_code_qad', request.input('domain'))
        .first();   
        if(getbuid){
            buid = getbuid.bu_id;
        }else{
            return response.status(406).json({
                message: "Bisnis Unit Belum Terdaftar",
                status: true,
                data: '-',
            });
        }

        for (let i = 1; i <= request.input('jumlah'); i++) {
            file = 'file' + i;
            filename    = request.file(file).clientName;
            nomorbupot  = filename.split("_")[0];
            npwp        = filename.split("_")[1];

            await request.file(file).moveToDisk('./BuPot/', {
                name: filename,
                contentType: 'image/jpg'
            })

            const client = new ftp.Client()
            client.ftp.verbose = true
            try {
                await client.access({
                    host: "172.26.0.3",
                    user: "itsysdev",
                    password: "<DBCsysd3v>",
                    port:9001,
                    // secure: true
                })            
                let from = "./tmp/uploads/BuPot/" + filename;
                let to   = "./eReg/" + filename;
                // let to   = "./eReg/" + filename;
                await client.uploadFrom(from, to)                           
            }
                catch(err) {
                console.log('error FTP bro')
                console.log(err)
                return response.status(406).json({
                    message: "Simpan File Bukti Potong Gagal",
                    status: true,
                });
            }
            client.close()


            const insert = await Database
            .connection('mssql_procsys')
            .table('bupot')
            .insert({
                bu_id: buid,
                no_bupot: nomorbupot,
                npwp: npwp,
                bulan_bupot: request.input('bulan'),
                tahun_bupot: request.input('tahun'),
                file_name: filename,
                created_date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                userid: request.input('empid'),
            })

            // console.log(nomorbupot);
            // console.log(npwp);
            // console.log(request.input('domain'));
            // console.log(buid);
        }

        return response.status(200).json({
            message: "Data Berhasil Disimpan",
            status: true,
        });     
 
    }

    public async getListVendor() {
        const getvendor = await Database
        .connection('mssql_procsys')
        .from('m_supplier')
        .select('*')
        .where('sup_flag', '1')
        .where('sup_status', '1')
        .whereNot('sup_npwp', '')
        .whereNot('sup_name', '')
        .orderBy('sup_name', 'asc')

        return getvendor;
    }

    public async getMonitoringBuPot({ request, response }) {          
        const dayjs = require('dayjs');
        var moment = require('moment'); // require   

        const getvendor = await Database
        .connection('mssql_procsys')
        .from('m_supplier')
        .select('*')
        .where('sup_flag', '1')
        .where('sup_status', '1')
        .whereNot('sup_npwp', '')
        .whereNot('sup_name', '')
        .orderBy('sup_name', 'asc')

        let buid;
        const getbuid = await Database
        .connection('mssql_procsys')
        .from('m_bisnit_unit')
        .select('bu_id')
        .where('bu_code_qad', request.input('domain'))
        .first();   
        if(getbuid){
            buid = getbuid.bu_id;
        }else{
            return response.status(406).json({
                message: "Bisnis Unit Belum Terdaftar",
                status: true,
                data: '-',
            });
        }

        if(request.input('rowsPerPage') == null){
            const res = await Database
            .connection('mssql_procsys')
            .from('bupot')
            .leftJoin('log_bupot', 'log_bupot.no_bupot', '=', 'bupot.no_bupot')
            .join('m_supplier', 'm_supplier.sup_npwp', '=', 'bupot.npwp')
            .select('bupot.npwp', 'bupot.no_bupot', 'm_supplier.sup_name')
            .select( Database.raw(`MAX(convert(date, bupot.created_date, 103)) as tgl_up`))
            .select( Database.raw(`MAX(log_bupot.download_date) as tgl_down`))
            .where('bupot.bu_id', buid)     ;      

            return {datavendor:getvendor, data: res};  
        }else{          
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
            .connection('mssql_procsys')
            .from('bupot')
            .leftJoin('log_bupot', 'log_bupot.no_bupot', '=', 'bupot.no_bupot')
            .join('m_supplier', 'm_supplier.sup_npwp', '=', 'bupot.npwp')
            .select('bupot.npwp', 'bupot.no_bupot', 'm_supplier.sup_name')
            .select( Database.raw(`MAX(convert(date, bupot.created_date, 103)) as tgl_up`))
            .select( Database.raw(`MAX(log_bupot.download_date) as tgl_down`))
            .where('bupot.bu_id', buid)                                      
            .where
            (
            (query) => 
            {
                if(request.input('filter') != null)
                {
                query.where('bupot.no_bupot', 'like', `%${request.input('filter')}%`)
                query.orWhere('bupot.npwp', 'like', `%${request.input('filter')}%`)
                query.orWhere('bupot.npwp_15', 'like', `%${request.input('filter')}%`)
                query.orWhere('m_supplier.sup_name', 'like', `%${request.input('filter')}%`)
                query.orWhere('bupot.created_date', 'like', `%${request.input('filter')}%`)
                query.orWhere('log_bupot.download_date', 'like', `%${request.input('filter')}%`)
                }                    
            }                           
            )
            .groupBy('bupot.npwp', 'bupot.no_bupot', 'm_supplier.sup_name')           
            .orderBy(sort,descend)         
            .paginate(page, request.input('rowsPerPage'))   
            // return res;

            for(const loopres of res){
                if(loopres.tgl_up){
                    loopres.tgl_up = moment(loopres.tgl_up).format('YYYY-MM-DD')             
                }
                if(loopres.tgl_down){
                    loopres.tgl_down = moment(loopres.tgl_down).format('YYYY-MM-DD')             
                }
            }
            return {datavendor:getvendor, data: res};                   
        }        
    }

    public async getMonitoringBuPotWithFilter({ request, response }) {          
        const dayjs = require('dayjs');
        var moment = require('moment'); // require   

        let buid;
        const getbuid = await Database
        .connection('mssql_procsys')
        .from('m_bisnit_unit')
        .select('bu_id')
        .where('bu_code_qad', request.input('domain'))
        .first();   
        if(getbuid){
            buid = getbuid.bu_id;
        }else{
            return response.status(406).json({
                message: "Bisnis Unit Belum Terdaftar",
                status: true,
                data: '-',
            });
        }

        let npwp = request.input('vendor');
        let tgl1 = request.input('tgl1');
        let tgl2 = request.input('tgl2');
        // npwp = '754848711426000';
        // tgl1 = '2022-02-14';
        // tgl2 = '2023-02-14';

        const res = await Database
            .connection('mssql_procsys')
            .from('bupot')
            .leftJoin('log_bupot', 'log_bupot.no_bupot', '=', 'bupot.no_bupot')
            .join('m_supplier', 'm_supplier.sup_npwp', '=', 'bupot.npwp')
            .select('bupot.npwp', 'bupot.no_bupot', 'm_supplier.sup_name')
            .select( Database.raw(`MAX(convert(date, bupot.created_date, 103)) as tgl_up`))
            .select( Database.raw(`MAX(log_bupot.download_date) as tgl_down`))
            .where('bupot.bu_id', buid)   
            // .where('bupot.npwp', npwp)
            .where
            ((query) => 
            {
                if(npwp != null)
                {
                query.where('bupot.npwp', 'like', `%${npwp}%`)
                query.orWhere('bupot.npwp_15', 'like', `%${npwp}%`)
                }                    
            })
            .where('bupot.created_date', '>=', tgl1)   
            .where('bupot.created_date', '<=', tgl2)                                  
            .groupBy('bupot.npwp', 'bupot.no_bupot', 'm_supplier.sup_name')       

        for(const loopres of res){
            if(loopres.tgl_up){
                loopres.tgl_up = moment(loopres.tgl_up).format('DD-MM-YYYY')             
            }
            if(loopres.tgl_down){
                loopres.tgl_down = moment(loopres.tgl_down).format('DD-MM-YYYY')             
            }
        }

        return {data:res};
        return res;
       

        // const res = await Database
        //                 .connection('mssql_procsys')
        //                 .from('bupot')
        //                 .select('*')
        //                 .where('bu_id', buid)
        //                 .where('npwp', request.input('vendor'))
        //                 .where('bulan_bupot', request.input('tgl1'))
        //                 .where('tahun_bupot', request.input('tgl1'));  
        // let jumdata = 0;
        // for(const loopres of res){
        //     jumdata++;
        //     loopres.periode = loopres.bulan_bupot + '/' + loopres.tahun_bupot;
        // }

        return {data:res, jumdata: jumdata};  
    }

}
