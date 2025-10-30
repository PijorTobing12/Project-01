// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from "@ioc:Adonis/Lucid/Database";
import MasterAplikasi from "App/Models/MasterAplikasi";

export default class AplikasiController {
    public async getAplikasi({ request, response }) {  
        if(request.input('rowsPerPage') == null){
            
            const res = await MasterAplikasi
                        .query()
                        .select('*')
                        .where('type','Aplikasi')
            // return response.status(200).json({
            //     message: "success",
            //     status: true,
            //     data: res,
            // });            
            return res;
        }else{                        
            const page = request.input('page', 1)
            var req = request.input('filter')
            const res = await MasterAplikasi
                        .query()                        
                        .where
                        (
                        (query) => 
                        {
                            if(request.input('filter') != null)
                            {
                            query.where('nama_aplikasi', 'like', `%${request.input('filter')}%`)                                                                           
                            }else{
                            query.where('type','Aplikasi')
                            }                    
                        }                           
                        )        
                        .orderBy('nama_aplikasi','asc')                                                                           
                        .paginate(page, request.input('rowsPerPage'))                                  

                        return res;                  
        }        
    }

    public async saveAplikasi({ request, response }) {  

        const res =   await Database
        .from('master_aplikasi')        
        .where('nama_aplikasi',  request.input('aplikasi'))
        .where('type', 'Aplikasi')
        .first();         
        if(res == null){            
            await Database
            .insertQuery() // 👈 gives an instance of insert query builder
            .table('master_aplikasi')
            .insert(
              { nama_aplikasi:  request.input('aplikasi'), 
                link:  '#',
                icon:  request.input('icon'),
                type:  'Aplikasi',
                parent:  0,
              }
            )
            return response.status(200).json({
                message: "success",
                status: true,
            });            
        }else{            
            const update = await Database
            .from('master_aplikasi')
            .where('rowid',  request.input('id'))            
            .update(
                {   nama_aplikasi:  request.input('aplikasi'), 
                    link:  '#',
                    icon:  request.input('icon'),
                    type:  'Aplikasi',
                    parent:  0,
                }                
            )  
            
            return response.status(200).json({
                message: "Data Berhasil Diupdate",
                status: true,
            });
        }
    }

    public async deleteAplikasi({ request, response }) { 
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
