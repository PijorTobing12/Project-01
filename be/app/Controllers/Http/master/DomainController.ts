// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from "@ioc:Adonis/Lucid/Database";
import Domain from "App/Models/Domain";
const urlDBC = "https://qssiptdldb07.odqad.com:8143/wsa/wsadbc/wsdl?targetURI=urn:services-qad-com:wsadbc:0001";
import { getWSA } from "App/Helpers/Wsa";

export default class DomainController {

    public async getDomain({ request, response }) {  
        const dayjs = require('dayjs')
        let datawsa = [];
        const args = { parDBLogical:"qaddb" };
        const qwsa = await getWSA(urlDBC, "getDBCdomain", args);  
        if(qwsa.tt_domain == null){
            datawsa = [];               
        }else{
            datawsa = qwsa.tt_domain.tt_domainRow;

            await Database            
            .from('domains')
            .delete()
            
            for(const loopdatawsa of datawsa){                
                await Database                
                .insertQuery() // 👈 gives an instance of insert query builder
                .table('domains')
                .insert(
                    {   code        : loopdatawsa.kd_domain, 
                        name        : loopdatawsa.desc_domain,                        
                        created_at  :  dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    }
                )
            }
        }      

        if(request.input('rowsPerPage') == null){
            const res = await Domain
                        .query()
                        .select('code')
            // return response.status(200).json({
            //     message: "success",
            //     status: true,
            //     data: res,
            // });
            return res;
        }else{
            
            const page = request.input('page', 1)
            var req = request.input('filter')
            const res = await Domain
                        .query()                        
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
                        .orderBy('code','asc')                  
                        .paginate(page, request.input('rowsPerPage'))                                  

                        return res;                  
        }        
    }
 

    public async saveDomain({ request, response }) {                   
        const res =   await Database
        .from('domains')
        .where('code',  request.input('domain'))
        .first();        
        if(res == null){
            await Database
            .insertQuery() // 👈 gives an instance of insert query builder
            .table('domains')
            .insert(
              { code:  request.input('domain'), 
                name:  request.input('desc')
              }
            )
            return response.status(200).json({
                message: "success",
                status: true,
            });            
        }else{
            const update = await Database
            .from('domains')
            .where('code', request.input('domain'))
            .update(
                { name: request.input('desc') }                
            )  
            
            return response.status(200).json({
                message: "Data Berhasil Diupdate",
                status: true,
            });
        }
        return 'Shendy Save';
    }

    public async deleteDomain({ request, response }) { 
        
        const res =   await Database
        .from('domains')
        .where('id',  request.input('id'))
        .first();        
        if(res == null){           
            return response.status(406).json({
                message: "Data Tidak Ditemukan",
                status: true,
            });            
        }else{
            await Database
            .from('domains')
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
