// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from "@ioc:Adonis/Lucid/Database";
import User from "App/Models/User";
import Hash from '@ioc:Adonis/Core/Hash';
import MasterAplikasi from "App/Models/MasterAplikasi";
import AksesAplikasi from "App/Models/AksesAplikasi";
import Mail from '@ioc:Adonis/Addons/Mail';

export default class OtherController {

    // public function getMenuAkses(Request $r)
    // {

    //     $aksesMenu = AksesMenu::where('empid', $r->empid)->first();
    //     $menu = Menu::select('id', 'name as label', 'link', 'icon')->where('parent', 0)
    //     ->with(['children' => function ($q) {
    //         $q->select('id', 'name as label', 'link', 'icon', 'parent');
    //     }])
    //     ->get();
    //     return $menu;

    //     return response()->json(array('menu' => $menu, 'akses' => !$aksesMenu ? array() :  explode(',', $aksesMenu->menu)));
    // }

    public async getMenuAplikasi({ request, response }) { 
        
        const aksesMenu = await AksesAplikasi
                        .query()
                        // .select('aplikasi_rowid')
                        .where('empid', request.input('empid'))
                        .first();
       
        var str = aksesMenu.aplikasi_rowid; // res.aplikasi_rowid = 0,1
        var strArray = str.split(",");                

        const menu = await MasterAplikasi
            .query()
            .preload('children', (query) => {
                query.select('rowid', 'nama_aplikasi', 'link', 'icon')
                query.orderBy('nama_aplikasi','asc')
            })           
            .where('parent', 0)  
            .orderBy('nama_aplikasi','asc')                      
            
        return response.status(200).json({
            akses: strArray,
            menu: menu,            
            });        
    }

    public async getMenuAplikasiByUser({ request, response }) {  
                               
        const res = await Database.from('akses_aplikasi')
        .select('*')
        .where('empid', request.input('empid'))
        .first();
        
        var approw = res.aplikasi_rowid;
        
        // return approw;
        // return splitString(tempestString, space);            
        
        if(res == null){
            return response.status(406).json({
              message: "Data akses menu belum tersedia",
              status: true,
              data: res,
            });   
        }else{

            var str = res.aplikasi_rowid; // res.aplikasi_rowid = 0,1
            var strArray = str.split(",");
                   

            // const res2 = await Database.from('master_aplikasi')
            // .select('rowid as id', 'nama_aplikasi as label', 'link', 'icon')
            // .where('parent', 0)            
            // .whereIn('rowid', strArray)
            // ;
            // return strArray;
            const res2 = await MasterAplikasi
            .query()
            .preload('children', (query) => {
                query.select('rowid', 'nama_aplikasi', 'link', 'icon')
                query.whereIn('master_aplikasi.rowid', strArray)
                query.orderBy('nama_aplikasi','asc')
            })           
            .where('parent', 0)            
            .whereIn('master_aplikasi.rowid', strArray)

            return res2;
                    
            

            // return Menu::select('id', 'name as label', 'link', 'icon')
            //     ->where('parent', 0)
            //     ->whereIn('id', explode(',', $dataAkses->menu))
            //     ->with(['children' => function ($q) use ($dataAkses) {
            //         $q->select('id', 'name as label', 'link', 'icon', 'parent');
            //         $q->whereIn('id', explode(',', $dataAkses->menu));
            //     }])
            //     ->get();
            // return res2;
            return response.status(200).json({
                message: "Data akses tersedia",
                status: true,
                data: res,
              });  
        }
        
    }

    public async getReminder({ request, response }) {  
        const dayjs = require('dayjs')  
        let apprver;
        const getid = await Database
                        .from('log_approval')       
                        .select('id_rekap_header') 
                        .where('tgl_trans','<' , dayjs().format('YYYY-MM-DD'))
                        // .whereNotNull('approver')
                        .groupBy('id_rekap_header')
        
        for(const loopgetid of getid){
            const res = await Database.from('log_approval')
                        .select('status_rekap')
                        .where('id_rekap_header', loopgetid.id_rekap_header)
                        .where('status_rekap', 'CLOSE')
                        .first();
            if(!res){
                
                const getappr = await Database.from('rekap_pengajuan_header')
                        .select('approver')
                        .where('id_rekap_header', loopgetid.id_rekap_header)
                        .first();
                if(getappr){
                    apprver = getappr.approver;

                    const getemailapprover = await Database.from('approve_harga')
                    .select('email_approve_harga','nama_approve_harga','nik_approve_harga')
                    .where('nik_approve_harga', apprver)
                    .first();
    
                    if(getemailapprover){
                        await Mail.send((message) => {
                        message
                            .from('system@dbc.co.id')
                            // .to(getemailapprover.email_approve_harga)
                            .bcc('Shendy.dewandaru@dbc.co.id')
                            .bcc('rahmat.hamidin@dbc.co.id')
                            .subject('[REMINDER] Notifikasi Approval Pengajuan Harga Transporter')              
                            .htmlView('emails/notifikasi_approval', {
                            user: { fullName: getemailapprover.nama_approve_harga },
                            // url: `http://localhost:8080/#/Autologin/ApprovalHargaTransporter/${getemailapprover.nik_approve_harga}`,
                            url: `http://appproc-test.dbc.co.id/#/Autologin/ApprovalHargaTransporter/${getemailapprover.nik_approve_harga}`,
                            })
                        })
                    }else{
                        await Mail.send((message) => {
                            message
                            .from('system@dbc.co.id')
                            // .to(getemailapprover.email_approve_harga)
                            .bcc('Shendy.dewandaru@dbc.co.id')
                            .bcc('rahmat.hamidin@dbc.co.id')
                            .subject('[REMINDER/NOT FOUND] Notifikasi Approval Pengajuan Harga Transporter')              
                            .htmlView('emails/reminder_gagal', {
                            user: { fullName: '[Reminder] Approver NOT FOUND' },
                            nomorapproval: loopgetid.id_rekap_header,                            
                            })
                        })  
                    }
                }else{
                    apprver = ''
                }                               
            }
        }

        return response.status(200).json({
            message: "Proses Send Selesai",
            status: true,
        });               
    }

    // public function saveAkses(Request $r)
    // {
    //   $cekData = AksesMenu::where('empid', $r->empid)->count();
    //   if ($cekData == 0) {
    //     AksesMenu::create([
    //       'menu' => $r->menu,
    //       'empid' => $r->empid
    //     ]);
    //   } else {
    //     AksesMenu::where('empid', $r->empid)->update([
    //       'menu' => $r->menu
    //     ]);
    //   }
    // }

    public async saveAkses({ request, response }) {  
        // return request;
        const countuser =  await Database
                      .from('akses_aplikasi')
                      .where('empid',  request.input('empid'))
                      .first();
        if(countuser == null){
            await Database
            .insertQuery() // 👈 gives an instance of insert query builder
            .table('akses_aplikasi')
            .insert(
                { aplikasi_rowid:  request.input('menu'), 
                empid:  request.input('empid')
                }
            )
        }else{            
            const update = await Database
            .from('akses_aplikasi')
            .where('empid', request.input('empid'))
            .update(
                { aplikasi_rowid: request.input('menu') }                
            )            
        }
    }           
}
