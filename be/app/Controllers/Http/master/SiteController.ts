// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from "@ioc:Adonis/Lucid/Database";
import Site from "App/Models/Site";
const urlDBC = "https://qssiptdldb07.odqad.com:8143/wsa/wsadbc/wsdl?targetURI=urn:services-qad-com:wsadbc:0001";
import { getWSA } from "App/Helpers/Wsa";

export default class SiteController {

    public async getSite({ request, response }) { 

        const dayjs = require('dayjs')
        let datawsa = [];
        const args = { parDomain: request.input('domain'),  parEntity:"", parDBLogical:"qaddb" };
        const qwsa = await getWSA(urlDBC, "getDBCsite", args);                        
        
        if(qwsa.tt_site == null){
            datawsa = [];               
        }else{
            datawsa = qwsa.tt_site.tt_siteRow;

            await Database
            .connection('mssql_dbMaster')
            .from('qad_si_mstr')
            .where('si_domain',  request.input('domain'))
            .delete()

            await Database            
            .from('site')
            .where('domain',  request.input('domain'))
            .delete()

            for(const loopdatawsa of datawsa){
                await Database
                .connection('mssql_dbMaster')
                .insertQuery() // 👈 gives an instance of insert query builder
                .table('qad_si_mstr')
                .insert(
                    {   si_domain   : loopdatawsa.kd_domain, 
                        si_desc     : loopdatawsa.desc_site,
                        si_entity   : loopdatawsa.kd_entity,
                        si_site     : loopdatawsa.kd_site,
                    }
                )

                await Database                
                .insertQuery() // 👈 gives an instance of insert query builder
                .table('site')
                .insert(
                    {   domain      : loopdatawsa.kd_domain, 
                        desc        : loopdatawsa.desc_site,
                        entity      : loopdatawsa.kd_entity,
                        code        : loopdatawsa.kd_site,
                        created_at  :  dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    }
                )
            }
            
        }         
        
        
        if(request.input('rowsPerPage') == null){
            const res = await Site
                        .query()
                        .select('code')
                        .where('domain',request.input('domain'))
            return response.status(200).json({
                message: "success",
                status: true,
                data: res,
            });
        }else{
            
            const page = request.input('page', 1)
            var req = request.input('filter')
            const res = await Site
                        .query()  
                        .where('domain',request.input('domain'))                      
                        .where
                        (
                        (query) => 
                        {
                            if(request.input('filter') != null)
                            {
                            query.where('code', 'like', `%${request.input('filter')}%`)                                               
                            }                    
                        }                           
                        )       
                        .orderBy('desc','asc')                 
                        .paginate(page, request.input('rowsPerPage'))                                  

                        return res;                  
        }        
    }
 

    public async saveSite({ request, response }) {      
                     
        const res =   await Database
        .from('site')
        .where('code',  request.input('site'))
        .where('domain',  request.input('domain'))
        .first();        
        if(res == null){
            await Database
            .insertQuery() // 👈 gives an instance of insert query builder
            .table('Site')
            .insert(
              { domain:  request.input('domain'), 
                code:  request.input('site'),
                desc:  request.input('desc'),
              }
            )
            return response.status(200).json({
                message: "success",
                status: true,
            });            
        }else{
            const update = await Database
            .from('site')
            .where('code', request.input('site'))
            .where('domain', request.input('domain'))
            .update(
                { desc: request.input('desc') }                
            )  
            
            return response.status(200).json({
                message: "Data Berhasil Diupdate",
                status: true,
            });
        }
        return 'Shendy Save';
    }

    public async deleteSite({ request, response }) { 
        
        const res =   await Database
        .from('site')
        .where('id',  request.input('id'))
        .first();        
        if(res == null){           
            return response.status(406).json({
                message: "Data Tidak Ditemukan",
                status: true,
            });            
        }else{
            await Database
            .from('site')
            .where('id',  request.input('id'))
            .delete()
            
            return response.status(200).json({
                message: "Data Berhasil Dihapus",
                status: true,
            });
        }

        return 'Shendy Delete';
    }

}
