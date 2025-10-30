import Database from "@ioc:Adonis/Lucid/Database";
const ftp = require("basic-ftp");
const dayjs = require('dayjs');

export default class UploadBuPotController {
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
                let to   = "./eReg/bupot/" + filename;
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

}
