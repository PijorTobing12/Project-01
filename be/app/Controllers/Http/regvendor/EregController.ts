import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from "@ioc:Adonis/Lucid/Database";
import { formatDateTime, dateTime, dateOnly, ucWords } from "App/Helpers/Function";
import SupplierPath from 'App/Models/regvendor/SupplierPath';
import SupplierPathUpd from 'App/Models/regvendor/SupplierPathUpd';

export default class RegisterController {

    public async index({ request, response }: HttpContextContract) {
        let kodeVend = '';
        const supVend = await Database.connection('mssql_procsys').from('m_supplier').select('sup_code_app', 'sup_code').where('sup_npwp', request.input('npwp')).first();
        if (supVend.sup_code) {
            kodeVend = supVend.sup_code;
        } else {
            const vendData = await Database.connection('mssql_procsys').from('vend_data').select('supp_code_app', 'sup_code').where('supp_code_app', supVend.sup_code_app).first();  
            
            kodeVend = vendData.sup_code;
        } 
        
        if (request.input('rowsPerPage') == null || request.input('rowsPerPage') == 0) {
            const res = await Database
                                .connection('mssql_basys')
                                .from('ba_mrrmstr')
                                .innerJoin(
                                  'bisnis_unit',
                                  'ba_mrrmstr.bamrr_domain',
                                  'bisnis_unit.bu_code'
                                )
                                .select('ba_mrrmstr.bamrr_id', 'ba_mrrmstr.bamrr_no', 'ba_mrrmstr.bamrr_tgl', 'ba_mrrmstr.bamrr_no_po', 'ba_mrrmstr.bamrr_supp', 'ba_mrrmstr.bamrr_supp_name', 'bisnis_unit.bu_name')
                                .where('ba_mrrmstr.bamrr_supp', kodeVend)
                                .where('ba_mrrmstr.bamrr_status', 'Finish');     
      
            return response.json(res);  
        } else {
            const page = request.input('page', 1);
            const res = await Database
                            .connection('mssql_basys')
                            .from('ba_mrrmstr')
                            .innerJoin(
                            'bisnis_unit',
                            'ba_mrrmstr.bamrr_domain',
                            'bisnis_unit.bu_code'
                            )
                            .select('ba_mrrmstr.bamrr_id', 'ba_mrrmstr.bamrr_no', 'ba_mrrmstr.bamrr_tgl', 'ba_mrrmstr.bamrr_no_po', 'ba_mrrmstr.bamrr_supp', 'ba_mrrmstr.bamrr_supp_name', 'bisnis_unit.bu_name')
                            .where('ba_mrrmstr.bamrr_supp', kodeVend)
                            .where('ba_mrrmstr.bamrr_status', 'Finish')
                            .where((query) => {
                                if (request.input('filter') != null)
                                {
                                    query.where('ba_mrrmstr.bamrr_no', 'like', `%${request.input('filter')}%`)
                                        .orWhere('ba_mrrmstr.bamrr_tgl', 'like', `%${request.input('filter')}%`)                                        
                                        .orWhere('ba_mrrmstr.bamrr_no_po', 'like', `%${request.input('filter')}%`)
                                        .orWhere('ba_mrrmstr.bamrr_supp_name', 'like', `%${request.input('filter')}%`)                                         
                                        .orWhere('bisnis_unit.bu_name', 'like', `%${request.input('filter')}%`);                                          
                                }
                            })
                            .orderBy(request.input('sortBy'), request.input('descending') == 'false' ? 'asc' : 'desc')
                            .paginate(page, request.input('rowsPerPage'));
                            
        return response.json(res);
        }
    }

    public async getEPO({ request, response }: HttpContextContract) {
        let kodeVend = '';
        const supVend = await Database.connection('mssql_procsys').from('m_supplier').select('sup_code_app', 'sup_code').where('sup_npwp', request.input('npwp')).first();
        if (supVend.sup_code) {
            kodeVend = supVend.sup_code;
        } else {
            const vendData = await Database.connection('mssql_procsys').from('vend_data').select('supp_code_app', 'sup_code').where('supp_code_app', supVend.sup_code_app).first();  
            
            kodeVend = vendData.sup_code;
        } 
        
        if (request.input('rowsPerPage') == null || request.input('rowsPerPage') == 0) {
            const res = await Database
                                .connection('mssql_dbMaster')
                                .from('qad_po_mstr')
                                .join(
                                    'dbBASys.dbo.ba_mrrmstr',
                                    'qad_po_mstr.po_vend',
                                    'ba_mrrmstr.bamrr_supp'
                                )
                                .join(
                                    'dbBASys.dbo.bisnis_unit',
                                    'qad_po_mstr.po_domain',
                                    'bisnis_unit.bu_code'
                                )
                                // .select('qad_po_mstr.po_domain', 'qad_po_mstr.po_nbr', 'qad_po_mstr.po_ord_date', 'qad_po_mstr.po_vend', 'ba_mrrmstr.bamrr_supp_name', 'bisnis_unit.bu_name')
                                .distinct('qad_po_mstr.po_domain', 'qad_po_mstr.po_nbr', 'qad_po_mstr.po_ord_date', 'qad_po_mstr.po_vend', 'ba_mrrmstr.bamrr_supp_name', 'bisnis_unit.bu_name')
                                .where('qad_po_mstr.po_vend', kodeVend);     
      
            return response.json(res);  
        } else {
            const page = request.input('page', 1);
            const res = await Database
                                .connection('mssql_dbMaster')
                                .from('qad_po_mstr')
                                .join(
                                    'dbBASys.dbo.ba_mrrmstr',
                                    'qad_po_mstr.po_vend',
                                    'ba_mrrmstr.bamrr_supp'
                                )
                                .join(
                                    'dbBASys.dbo.bisnis_unit',
                                    'qad_po_mstr.po_domain',
                                    'bisnis_unit.bu_code'
                                )
                                // .select('qad_po_mstr.po_domain', 'qad_po_mstr.po_nbr', 'qad_po_mstr.po_ord_date', 'qad_po_mstr.po_vend', 'ba_mrrmstr.bamrr_supp_name', 'bisnis_unit.bu_name')
                                .distinct('qad_po_mstr.po_domain', 'qad_po_mstr.po_nbr', 'qad_po_mstr.po_ord_date', 'qad_po_mstr.po_vend', 'ba_mrrmstr.bamrr_supp_name', 'bisnis_unit.bu_name')
                                .where('qad_po_mstr.po_vend', kodeVend)
                                .where((query) => {
                                    if (request.input('filter') != null)
                                    {
                                      query.where('qad_po_mstr.po_ord_date', 'like', `%${request.input('filter')}%`)
                                            .orWhere('qad_po_mstr.po_nbr', 'like', `%${request.input('filter')}%`)                                        
                                            .orWhere('ba_mrrmstr.bamrr_supp_name', 'like', `%${request.input('filter')}%`)
                                            .orWhere('bisnis_unit.bu_name', 'like', `%${request.input('filter')}%`);                                          
                                    }                    
                                })
                                .orderBy(request.input('sortBy'), request.input('descending') == 'false' ? 'asc' : 'desc')
                                .paginate(page, request.input('rowsPerPage'));     
             
            const total = await Database
                                .connection('mssql_dbMaster')
                                .from('qad_po_mstr')
                                .join(
                                    'dbBASys.dbo.ba_mrrmstr',
                                    'qad_po_mstr.po_vend',
                                    'ba_mrrmstr.bamrr_supp'
                                )
                                .join(
                                    'dbBASys.dbo.bisnis_unit',
                                    'qad_po_mstr.po_domain',
                                    'bisnis_unit.bu_code'
                                )
                                // .select('qad_po_mstr.po_domain', 'qad_po_mstr.po_nbr', 'qad_po_mstr.po_ord_date', 'qad_po_mstr.po_vend', 'ba_mrrmstr.bamrr_supp_name', 'bisnis_unit.bu_name')
                                .distinct('qad_po_mstr.po_domain', 'qad_po_mstr.po_nbr', 'qad_po_mstr.po_ord_date', 'qad_po_mstr.po_vend', 'ba_mrrmstr.bamrr_supp_name', 'bisnis_unit.bu_name')
                                .where('qad_po_mstr.po_vend', kodeVend)
                                .where((query) => {
                                    if (request.input('filter') != null)
                                    {
                                      query.where('qad_po_mstr.po_ord_date', 'like', `%${request.input('filter')}%`)
                                            .orWhere('qad_po_mstr.po_nbr', 'like', `%${request.input('filter')}%`)                                        
                                            .orWhere('ba_mrrmstr.bamrr_supp_name', 'like', `%${request.input('filter')}%`)
                                            .orWhere('bisnis_unit.bu_name', 'like', `%${request.input('filter')}%`);                                          
                                    }                    
                                })
                                .groupBy('qad_po_mstr.po_domain', 'qad_po_mstr.po_nbr', 'qad_po_mstr.po_ord_date', 'qad_po_mstr.po_vend', 'ba_mrrmstr.bamrr_supp_name', 'bisnis_unit.bu_name').count('qad_po_mstr.po_nbr as total');

            // return response.json(res);
            return response.json({
                data: res,
                total: total.length
            });
        }
    }

    public async getFilEPO({ request, response }: HttpContextContract) {
        let kodeVend = '';
        const supVend = await Database.connection('mssql_procsys').from('m_supplier').select('sup_code_app', 'sup_code').where('sup_npwp', request.input('npwp')).first();
        if (supVend.sup_code) {
            kodeVend = supVend.sup_code;
        } else {
            const vendData = await Database.connection('mssql_procsys').from('vend_data').select('supp_code_app', 'sup_code').where('supp_code_app', supVend.sup_code_app).first();  
            
            kodeVend = vendData.sup_code;
        }

        const page = request.input('page', 1);
        const res = await Database
                            .connection('mssql_dbMaster')
                            .from('qad_po_mstr')
                            .join(
                                'dbBASys.dbo.ba_mrrmstr',
                                'qad_po_mstr.po_vend',
                                'ba_mrrmstr.bamrr_supp'
                            )
                            .join(
                                'dbBASys.dbo.bisnis_unit',
                                'qad_po_mstr.po_domain',
                                'bisnis_unit.bu_code'
                            )
                            // .select('qad_po_mstr.po_domain', 'qad_po_mstr.po_nbr', 'qad_po_mstr.po_ord_date', 'qad_po_mstr.po_vend', 'ba_mrrmstr.bamrr_supp_name', 'bisnis_unit.bu_name')
                            .distinct('qad_po_mstr.po_domain', 'qad_po_mstr.po_nbr', 'qad_po_mstr.po_ord_date', 'qad_po_mstr.po_vend', 'ba_mrrmstr.bamrr_supp_name', 'bisnis_unit.bu_name')
                            .where('qad_po_mstr.po_vend', kodeVend)
                            .where((query) => {
                                if (request.input('filter') != null)
                                {
                                  query.where('qad_po_mstr.po_ord_date', 'like', `%${request.input('filter')}%`)
                                        .orWhere('qad_po_mstr.po_nbr', 'like', `%${request.input('filter')}%`)                                        
                                        .orWhere('ba_mrrmstr.bamrr_supp_name', 'like', `%${request.input('filter')}%`)
                                        .orWhere('bisnis_unit.bu_name', 'like', `%${request.input('filter')}%`);                                          
                                }                    
                            })
                            .where((query) => { 
                                if (request.input('bu_code') != "")
                                {
                                    query.where('qad_po_mstr.po_domain', request.input('bu_code'));
                                }
        
                                if (request.input('no_po') != "")
                                {
                                    query.where('qad_po_mstr.po_nbr', request.input('no_po'));
                                }
        
                                if (request.input('tgl_from') != "" && request.input('tgl_to') != "")
                                {
                                    query.whereBetween('qad_po_mstr.po_ord_date', [`${request.input('tgl_from')}`, `${request.input('tgl_to')}`]);                                               
                                }
                            })
                            .orderBy(request.input('sortBy'), request.input('descending') == 'false' ? 'asc' : 'desc')
                            .paginate(page, request.input('rowsPerPage'));    
        // return res;
        const total = await Database
                                .connection('mssql_dbMaster')
                                .from('qad_po_mstr')
                                .join(
                                    'dbBASys.dbo.ba_mrrmstr',
                                    'qad_po_mstr.po_vend',
                                    'ba_mrrmstr.bamrr_supp'
                                )
                                .join(
                                    'dbBASys.dbo.bisnis_unit',
                                    'qad_po_mstr.po_domain',
                                    'bisnis_unit.bu_code'
                                )
                                // .select('qad_po_mstr.po_domain', 'qad_po_mstr.po_nbr', 'qad_po_mstr.po_ord_date', 'qad_po_mstr.po_vend', 'ba_mrrmstr.bamrr_supp_name', 'bisnis_unit.bu_name')
                                .distinct('qad_po_mstr.po_domain', 'qad_po_mstr.po_nbr', 'qad_po_mstr.po_ord_date', 'qad_po_mstr.po_vend', 'ba_mrrmstr.bamrr_supp_name', 'bisnis_unit.bu_name')
                                .where('qad_po_mstr.po_vend', kodeVend)
                                .where((query) => {
                                    if (request.input('filter') != null)
                                    {
                                      query.where('qad_po_mstr.po_ord_date', 'like', `%${request.input('filter')}%`)
                                            .orWhere('qad_po_mstr.po_nbr', 'like', `%${request.input('filter')}%`)                                        
                                            .orWhere('ba_mrrmstr.bamrr_supp_name', 'like', `%${request.input('filter')}%`)
                                            .orWhere('bisnis_unit.bu_name', 'like', `%${request.input('filter')}%`);                                          
                                    }                    
                                })
                                .where((query) => { 
                                    if (request.input('bu_code') != "")
                                    {
                                        query.where('qad_po_mstr.po_domain', request.input('bu_code'));
                                    }
            
                                    if (request.input('no_po') != "")
                                    {
                                        query.where('qad_po_mstr.po_nbr', request.input('no_po'));
                                    }
            
                                    if (request.input('tgl_from') != "" && request.input('tgl_to') != "")
                                    {
                                        query.whereBetween('qad_po_mstr.po_ord_date', [`${request.input('tgl_from')}`, `${request.input('tgl_to')}`]);                                               
                                    }
                                })
                                .groupBy('qad_po_mstr.po_domain', 'qad_po_mstr.po_nbr', 'qad_po_mstr.po_ord_date', 'qad_po_mstr.po_vend', 'ba_mrrmstr.bamrr_supp_name', 'bisnis_unit.bu_name').count('qad_po_mstr.po_nbr as total');

        return response.json({
            data: res,
            total: total.length
        });
    }

    public async getExEPO({ request, response }: HttpContextContract) {
        let kodeVend = '';
        const supVend = await Database.connection('mssql_procsys').from('m_supplier').select('sup_code_app', 'sup_code').where('sup_npwp', request.input('npwp')).first();
        if (supVend.sup_code) {
            kodeVend = supVend.sup_code;
        } else {
            const vendData = await Database.connection('mssql_procsys').from('vend_data').select('supp_code_app', 'sup_code').where('supp_code_app', supVend.sup_code_app).first();  
            
            kodeVend = vendData.sup_code;
        }

        const res = await Database
                            .connection('mssql_dbMaster')
                            .from('qad_po_mstr')
                            .join(
                                'dbBASys.dbo.ba_mrrmstr',
                                'qad_po_mstr.po_vend',
                                'ba_mrrmstr.bamrr_supp'
                            )
                            .join(
                                'dbBASys.dbo.bisnis_unit',
                                'qad_po_mstr.po_domain',
                                'bisnis_unit.bu_code'
                            )
                            // .select('qad_po_mstr.po_domain', 'qad_po_mstr.po_nbr', 'qad_po_mstr.po_ord_date', 'qad_po_mstr.po_vend', 'ba_mrrmstr.bamrr_supp_name', 'bisnis_unit.bu_name')
                            .distinct('qad_po_mstr.po_domain', 'qad_po_mstr.po_nbr', 'qad_po_mstr.po_ord_date', 'qad_po_mstr.po_vend', 'ba_mrrmstr.bamrr_supp_name', 'bisnis_unit.bu_name')
                            .where('qad_po_mstr.po_vend', kodeVend)
                            .where((query) => { 
                                if (request.input('bu_code') != "")
                                {
                                    query.where('qad_po_mstr.po_domain', request.input('bu_code'));
                                }
        
                                if (request.input('no_po') != "")
                                {
                                    query.where('qad_po_mstr.po_nbr', request.input('no_po'));
                                }
        
                                if (request.input('tgl_from') != "" && request.input('tgl_to') != "")
                                {
                                    query.whereBetween('qad_po_mstr.po_ord_date', [`${request.input('tgl_from')}`, `${request.input('tgl_to')}`]);                                               
                                }
                            });    
        return res;
        // const total = await Database
        //                         .connection('mssql_dbMaster')
        //                         .from('qad_po_mstr')
        //                         .join(
        //                             'dbBASys.dbo.ba_mrrmstr',
        //                             'qad_po_mstr.po_vend',
        //                             'ba_mrrmstr.bamrr_supp'
        //                         )
        //                         .join(
        //                             'dbBASys.dbo.bisnis_unit',
        //                             'qad_po_mstr.po_domain',
        //                             'bisnis_unit.bu_code'
        //                         )
        //                         // .select('qad_po_mstr.po_domain', 'qad_po_mstr.po_nbr', 'qad_po_mstr.po_ord_date', 'qad_po_mstr.po_vend', 'ba_mrrmstr.bamrr_supp_name', 'bisnis_unit.bu_name')
        //                         .distinct('qad_po_mstr.po_domain', 'qad_po_mstr.po_nbr', 'qad_po_mstr.po_ord_date', 'qad_po_mstr.po_vend', 'ba_mrrmstr.bamrr_supp_name', 'bisnis_unit.bu_name')
        //                         .where('qad_po_mstr.po_vend', kodeVend)
        //                         .where((query) => { 
        //                             if (request.input('bu_code') != "")
        //                             {
        //                                 query.where('qad_po_mstr.po_domain', request.input('bu_code'));
        //                             }
            
        //                             if (request.input('no_po') != "")
        //                             {
        //                                 query.where('qad_po_mstr.po_nbr', request.input('no_po'));
        //                             }
            
        //                             if (request.input('tgl_from') != "" && request.input('tgl_to') != "")
        //                             {
        //                                 query.whereBetween('qad_po_mstr.po_ord_date', [`${request.input('tgl_from')}`, `${request.input('tgl_to')}`]);                                               
        //                             }
        //                         })
        //                         .groupBy('qad_po_mstr.po_domain', 'qad_po_mstr.po_nbr', 'qad_po_mstr.po_ord_date', 'qad_po_mstr.po_vend', 'ba_mrrmstr.bamrr_supp_name', 'bisnis_unit.bu_name').count('qad_po_mstr.po_nbr as total');

        // return response.json({
        //     data: res,
        //     total: total.length
        // });
    }

    public async getFilEMRR({ request }: HttpContextContract) {
        let kodeVend = '';
        const supVend = await Database.connection('mssql_procsys').from('m_supplier').select('sup_code_app', 'sup_code').where('sup_npwp', request.input('npwp')).first();
        if (supVend.sup_code) {
            kodeVend = supVend.sup_code;
        } else {
            const vendData = await Database.connection('mssql_procsys').from('vend_data').select('supp_code_app', 'sup_code').where('supp_code_app', supVend.sup_code_app).first();  
            
            kodeVend = vendData.sup_code;
        }

        const page = request.input('page', 1);
        const res = await Database
                        .connection('mssql_basys')
                        .from('ba_mrrmstr')
                        .innerJoin(
                        'bisnis_unit',
                        'ba_mrrmstr.bamrr_domain',
                        'bisnis_unit.bu_code'
                        )
                        .select('ba_mrrmstr.bamrr_id', 'ba_mrrmstr.bamrr_no', 'ba_mrrmstr.bamrr_tgl', 'ba_mrrmstr.bamrr_no_po', 'ba_mrrmstr.bamrr_supp', 'ba_mrrmstr.bamrr_supp_name', 'bisnis_unit.bu_name')
                        .where('ba_mrrmstr.bamrr_supp', kodeVend)
                        .where('ba_mrrmstr.bamrr_status', 'Finish')
                        .where((query) => {
                            if (request.input('filter') != null)
                            {
                                query.where('ba_mrrmstr.bamrr_no', 'like', `%${request.input('filter')}%`)
                                    .orWhere('ba_mrrmstr.bamrr_tgl', 'like', `%${request.input('filter')}%`)                                        
                                    .orWhere('ba_mrrmstr.bamrr_no_po', 'like', `%${request.input('filter')}%`)
                                    .orWhere('ba_mrrmstr.bamrr_supp_name', 'like', `%${request.input('filter')}%`)                                         
                                    .orWhere('bisnis_unit.bu_name', 'like', `%${request.input('filter')}%`);                                          
                            }
                        })
                        .where((query) => { 
                            if (request.input('bu_code') != "")
                            {
                                query.where('ba_mrrmstr.bamrr_domain', request.input('bu_code'));
                            }
    
                            if (request.input('no_po') != "")
                            {
                                query.where('ba_mrrmstr.bamrr_no_po', request.input('no_po'));
                            }
    
                            if (request.input('tgl_from') != "" && request.input('tgl_to') != "")
                            {
                                query.whereBetween('ba_mrrmstr.bamrr_tgl', [`${request.input('tgl_from')}`, `${request.input('tgl_to')}`]);                                               
                            }
                        })
                        .orderBy(request.input('sortBy'), request.input('descending') == 'false' ? 'asc' : 'desc')
                        .paginate(page, request.input('rowsPerPage'));    
        return res;
    }

    public async getExEMRR({ request }: HttpContextContract) {
        let kodeVend = '';
        const supVend = await Database.connection('mssql_procsys').from('m_supplier').select('sup_code_app', 'sup_code').where('sup_npwp', request.input('npwp')).first();
        if (supVend.sup_code) {
            kodeVend = supVend.sup_code;
        } else {
            const vendData = await Database.connection('mssql_procsys').from('vend_data').select('supp_code_app', 'sup_code').where('supp_code_app', supVend.sup_code_app).first();  
            
            kodeVend = vendData.sup_code;
        }

        const res = await Database
                        .connection('mssql_basys')
                        .from('ba_mrrmstr')
                        .innerJoin(
                        'bisnis_unit',
                        'ba_mrrmstr.bamrr_domain',
                        'bisnis_unit.bu_code'
                        )
                        .select('ba_mrrmstr.bamrr_id', 'ba_mrrmstr.bamrr_no', 'ba_mrrmstr.bamrr_tgl', 'ba_mrrmstr.bamrr_no_po', 'ba_mrrmstr.bamrr_supp', 'ba_mrrmstr.bamrr_supp_name', 'bisnis_unit.bu_name')
                        .where('ba_mrrmstr.bamrr_supp', kodeVend)
                        .where('ba_mrrmstr.bamrr_status', 'Finish')
                        .where((query) => { 
                            if (request.input('bu_code') != "")
                            {
                                query.where('ba_mrrmstr.bamrr_domain', request.input('bu_code'));
                            }
    
                            if (request.input('no_po') != "")
                            {
                                query.where('ba_mrrmstr.bamrr_no_po', request.input('no_po'));
                            }
    
                            if (request.input('tgl_from') != "" && request.input('tgl_to') != "")
                            {
                                query.whereBetween('ba_mrrmstr.bamrr_tgl', [`${request.input('tgl_from')}`, `${request.input('tgl_to')}`]);                                               
                            }
                        });    
        return res;
    }

    public async saveLog({ request, response }: HttpContextContract) {
        try {
            // Insert regis_vendor
            const currentdate = new Date(); 
            let month = '' + (currentdate.getMonth() + 1);
            let day = '' + currentdate.getDate();

            if (month.length < 2) 
            month = '0' + month;
            if (day.length < 2) 
            day = '0' + day;

            const datetime = currentdate.getFullYear() + "-" + month + "-" + day + " " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();

            await Database
            .connection('mssql_procsys')
            .table('log_akses')
            .returning('id')
            .insert({
                nik: request.input('nik'),
                empid: request.input('empid'),
                tanggal: datetime,
                status: request.input('status'),
                keterangan: request.input('remark'),
                ip:  request.input('ip'),
                nama_url: request.input('nama_url'),
            });
            
            return response.json({
            status: 'positive',
            pesan: 'Log Tersimpan'
            });
        } catch (error) {
            return response.json(error);
        }
    }

    public async getAppBu({ response }: HttpContextContract) {
        const res = await Database.connection('mssql_basys').from('bisnis_unit').select('bu_code', 'bu_name').whereNotIn('bu_code', ['800', '110']).orderBy('bu_name', 'asc');
        return response.json(res);
    }

    public async getPoMrr({ request, response }: HttpContextContract) {
        let kodeVend = '';
        const supVend = await Database.connection('mssql_procsys').from('m_supplier').select('sup_code_app', 'sup_code').where('sup_npwp', request.input('npwp')).first();
        if (supVend.sup_code) {
            kodeVend = supVend.sup_code;
        } else {
            const vendData = await Database.connection('mssql_procsys').from('vend_data').select('supp_code_app', 'sup_code').where('supp_code_app', supVend.sup_code_app).first();  
            
            kodeVend = vendData.sup_code;
        }

        const res = await Database.connection('mssql_basys').from('ba_mrrmstr').where('bamrr_supp', kodeVend).where('bamrr_status', 'Finish').distinct('bamrr_no_po').orderBy('bamrr_no_po', 'asc');
        return response.json(res);  
    }

    public async getPoMst({ request, response }: HttpContextContract) {
        let kodeVend = '';
        const supVend = await Database.connection('mssql_procsys').from('m_supplier').select('sup_code_app', 'sup_code').where('sup_npwp', request.input('npwp')).first();
        if (supVend.sup_code) {
            kodeVend = supVend.sup_code;
        } else {
            const vendData = await Database.connection('mssql_procsys').from('vend_data').select('supp_code_app', 'sup_code').where('supp_code_app', supVend.sup_code_app).first();  
            
            kodeVend = vendData.sup_code;
        }

        const res = await Database.connection('mssql_dbMaster').from('qad_po_mstr').where('po_vend', kodeVend).distinct('po_nbr').orderBy('po_nbr', 'asc');
        return response.json(res);  
    }
}