// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from "@ioc:Adonis/Lucid/Database";
import MasterAplikasi from "App/Models/MasterAplikasi";

export default class MenuController {
    public async getMenu({ request, response }) {  

        if(request.input('rowsPerPage') == null){
            
            const res = await MasterAplikasi
                        .query()
                        .select('*')
                        .where('type','SubAplikasi')
            // return response.status(200).json({
            //     message: "success",
            //     status: true,
            //     data: res,
            // });            
            return res;
        }else{                        
            const page = request.input('page')
            var req = request.input('filter')
            const res = await 
                        // MasterAplikasi
                        // .query()
                        Database
                        .from('master_aplikasi')
                        .join('master_aplikasi as ma', 'master_aplikasi.parent', '=', 'ma.rowid')
                        // .join(
                        //    'master_aplikasi as ma','master_aplikasi.parent','ma.rowid' 
                        // )   
                        .select( 'master_aplikasi.*', 'ma.nama_aplikasi as namaaplikasi')                   
                        .where
                        (
                        (query) => 
                        {
                            if(request.input('filter') != null)
                            {
                            query.where('master_aplikasi.nama_aplikasi', 'like', `%${request.input('filter')}%`)                                                                           
                            }else{
                            query.where('master_aplikasi.type','SubAplikasi')
                            }                    
                        }                           
                        )              
                        .orderBy('nama_aplikasi','asc')          
                        .paginate(page, request.input('rowsPerPage')) 
                        
            // return res;
            // return res
            const dataparent = await MasterAplikasi
                            .query()
                            .select('nama_aplikasi','rowid')
                            .where('type','Aplikasi')
            return {data1:res, data2:dataparent}
            // return res;
            // return {data:res, data2:dataparent}
            // return view('dataforeach'=>$dataforeach, 'dataforeach1'=>$dataforeach1, 'string1'=>string1 )     
            return {data1:res, data2:dataparent}
            return [res, dataparent];                  
        }    
        
        
    }

    public async saveMenu({ request, response }) {
        // id: null, aplikasi: 6, icon: "home", menu: "Lokasi"           
        if(request.input('id') == null){
            const res =   await Database
            .from('master_aplikasi')
            .where('parent',  request.input('aplikasi'))
            .where('type',  'subaplikasi')
            .where('nama_aplikasi',  request.input('menu'))        
            .first();        
            if(res == null){
                await Database
                .insertQuery() // 👈 gives an instance of insert query builder
                .table('master_aplikasi')
                .insert(
                  { nama_aplikasi:  request.input('menu'), 
                    link:  request.input('menu'),
                    icon:  request.input('icon'),
                    type:  'subaplikasi',
                    parent:  request.input('aplikasi'),
                  }
                )
                return response.status(200).json({
                    message: "success",
                    status: true,
                });                      
            }else{
                return response.status(406).json({
                    message: "Data Sudah Ada",
                    status: true,
                });          
            }           
        }else{
            
            const update = await Database
            .from('master_aplikasi')
            .where('rowid',  request.input('id'))            
            .update(
                { 
                    icon: request.input('icon'),
                    nama_aplikasi: request.input('menu') ,
                    link:  request.input('menu'),                    
                    type:  'subaplikasi',
                    parent:  request.input('aplikasi'), 
                }                
            )  
            
            return response.status(200).json({
                message: "Data Berhasil Diupdate",
                status: true,
            });
        }
        
        // const res =   await Database
        // .from('master_aplikasi')
        // .where('parent',  request.input('aplikasi'))
        // .where('type',  'subaplikasi')
        // .where('nama_aplikasi',  request.input('menu'))        
        // .first();        
        // if(res == null){
        //     // return 'insert';
           
        // }else{
           
        // }
    }

    public async deleteMenu({ request, response }) { 
        // return request;
        const res =   await Database
        .from('master_aplikasi')
        .where('rowid',  request.input('rowid'))
        .first();        
        if(res == null){           
            return response.status(406).json({
                message: "Data Tidak Ditemukan",
                status: true,
            });            
        }else{
            await Database
            .from('master_aplikasi')
            .where('rowid',  request.input('rowid'))
            .delete()
            
            return response.status(200).json({
                message: "Data Berhasil Dihapus",
                status: true,
            });
        }

        return 'Shendy Delete';
    }
}
