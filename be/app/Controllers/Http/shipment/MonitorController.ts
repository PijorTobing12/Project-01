import Database from "@ioc:Adonis/Lucid/Database";
import Env from '@ioc:Adonis/Core/Env';

export default class MonitorController {

    public async getMSupplier({request, response}) {   
        
        const m_supplier = await Database.connection("mssql_tagihan").rawQuery(`
            select 
                case when a.sup_code is null then b.sup_code else a.sup_code end sup_code, 
                a.sup_name,
                a.sup_office_address,
                a.sup_office_phone 
            from 
                m_supplier a 
                left join vend_data b on a.sup_code_app = b.supp_code_app 
            where 
                a.sup_npwp = ?`, 
            [request.input('empid')]
        );

        return {m_supplier: m_supplier}          
    }

    public async getMonitor({request, response}) {   
        
        var moment = require('moment');
        // console.log(moment(new Date()).endOf('month').format('YYYY-MM-DD')); return false;

        var where = '';
		where += request.requestData.kode_kirim !== undefined ? " and (a.kode_kirim like '%" + request.requestData.kode_kirim + "%' or ad_name like '%" + request.requestData.kode_kirim + "%')" : "";
        where += request.requestData.date_start === undefined ? " and convert(varchar(10), tanggal_target, 120) >= '" + moment(new Date()).startOf('month').format("YYYY-MM-DD") + "'" : " and convert(varchar(10), tanggal_target, 120) >= '" + request.requestData.date_start + "'";
        where += request.requestData.date_end === undefined ? " and convert(varchar(10), tanggal_target, 120) <= '" + moment(new Date()).endOf('month').format('YYYY-MM-DD') + "'" : " and convert(varchar(10), tanggal_target, 120) <= '" + request.requestData.date_end + "'";
        
        const m_supplier = await Database.connection("mssql_tagihan").rawQuery(`
            select 
                case when a.sup_code is null then b.sup_code else a.sup_code end sup_code, 
                a.sup_name
            from 
                m_supplier a 
                left join vend_data b on a.sup_code_app = b.supp_code_app 
            where 
                a.sup_npwp = ?`, 
            [request.input('empid')]
        );
        var sup_code = m_supplier[0].sup_code;

        var db_dbcnet_host = Env.envCache.DB_DBCNET_HOST;
        var db_wh_wdjr_host = Env.envCache.DB_WH_WDJR_HOST;
        var db_wh_wtur_host = Env.envCache.DB_WH_WTUR_HOST;
        var db_wh_wtur_database = Env.envCache.DB_WH_WTUR_DATABASE;
        var db_wh_wdjr_database = Env.envCache.DB_WH_WDJR_DATABASE;
        var db_dbcnet_instance = Env.envCache.DB_DBCNET_INSTANCE;
        var db_wh_wdjr_instance = Env.envCache.DB_WH_WDJR_INSTANCE;
        var db_wh_wtur_instance = Env.envCache.DB_WH_WTUR_INSTANCE;

        var linked_wdjr = db_wh_wdjr_host + '\\' + db_wh_wdjr_instance == db_dbcnet_host + '\\' + db_dbcnet_instance ? '' : '[' + db_wh_wdjr_host + (db_wh_wdjr_instance == '' ? '' : '\\' + db_wh_wdjr_instance) + '].';
        var linked_wtur = db_wh_wtur_host + '\\' + db_wh_wtur_instance == db_dbcnet_host + '\\' + db_dbcnet_instance ? '' : '[' + db_wh_wtur_host + (db_wh_wtur_instance == '' ? '' : '\\' + db_wh_wtur_instance) + '].'; 

        var sql = `
            select 
                a.*,
                '[' + a.kode_kirim + '] - ' + a.ad_name ship,
                case when a.site = 'Ngoro' then
                case when (select id_kedatangan from ` + linked_wtur + db_wh_wtur_database + `.dbo.kedatangan where id_kedatangan = a.no_pol + '_' + a.no_urut_visual + '_' + a.no_urut_pesan) is not null then 'Ya'
                else 'Tidak' end
                else
                case when (select id_kedatangan from ` + linked_wdjr + db_wh_wdjr_database + `.dbo.kedatangan where id_kedatangan = a.no_pol + '_' + a.no_urut_visual + '_' + a.no_urut_pesan) is not null then 'Ya'
                else 'Tidak' end
                end tgl_konfirmasi_driver_src,
                'truk_red.png' truk_red,
                'truk_green.png' truk_green
            from 
                viscon a
                left join ` + linked_wtur + db_wh_wdjr_database + `.dbo.HEADER_VISUAL b on 
                    a.no_urut_pesan = b.NO_URUT_PESAN 
                    and a.no_urut_visual = b.NO_URUT_VISUAL 
                left join ` + linked_wdjr + db_wh_wtur_database + `.dbo.HEADER_VISUAL c on 
                    a.no_urut_pesan = c.NO_URUT_PESAN 
                    and a.no_urut_visual = c.NO_URUT_VISUAL
            where
                a.kode_ekspedisi = ?
                and a.no_urut_visual is not null
                and case when a.site = 'Ngoro' then c.FLAG else b.FLAG end <> 0
				` + where + `
        `;

        // console.log(sql); return false;

        const viscon = await Database.connection("mssql_dbcnet")
        .rawQuery(sql, [sup_code])
        // .rawQuery(sql, ['81000032'])
        // .rawQuery(sql, ['81020012'])

        // console.log(viscon); return false;

        return {viscon: viscon, total: viscon.length}          
    }

    public async getAdminSJ({request}) {   
        
        var db_dbcnet_host = Env.envCache.DB_DBCNET_HOST;
        var db_dbcnet_instance = Env.envCache.DB_DBCNET_INSTANCE;
        var db_sj_paperless_host = Env.envCache.DB_SJ_PAPERLESS_HOST;
        var db_sj_paperless_instance = Env.envCache.DB_SJ_PAPERLESS_INSTANCE;
        var db_sj_paperless_database = Env.envCache.DB_SJ_PAPERLESS_DATABASE;
        var linked_sj_paperless = db_sj_paperless_host + '\\' + db_sj_paperless_instance == db_dbcnet_host + '\\' + db_dbcnet_instance ? '' : '[' + db_sj_paperless_host + '\\' + db_sj_paperless_instance +  '].';

        var sql = `
            select *
            from
            ` + linked_sj_paperless + db_sj_paperless_database + `.dbo.terima_sj
            where
                replace(nopol, ' ', '') like '%` + request.requestData.no_pol + `%'
                and tgl = '` + request.requestData.tanggal_target + `'
                and kode_ship_to = '` + request.requestData.kode_kirim + `'
        `;

        // console.log(sql); return false;

        const admin = await Database.connection("mssql_dbcnet")
        /*
        .rawQuery(sql, [
            request.requestData.no_pol,
            request.requestData.tanggal_target,
            request.requestData.kode_kirim
        ])
        */
        .rawQuery(sql)

        // console.log(admin); return false;

        return {admin: admin}          
    }

    public async getAdminSJDetail({request}) {   

        var where = '';
        if (request.requestData.no_sj != '') { where = ` and d.no_sj = '` + request.requestData.no_sj + `' `; }

        var db_dbcnet_host = Env.envCache.DB_DBCNET_HOST;
        var db_dbcnet_instance = Env.envCache.DB_DBCNET_INSTANCE;
        var db_sj_paperless_host = Env.envCache.DB_SJ_PAPERLESS_HOST;
        var db_sj_paperless_instance = Env.envCache.DB_SJ_PAPERLESS_INSTANCE;
        var db_sj_paperless_database = Env.envCache.DB_SJ_PAPERLESS_DATABASE;
        var linked_sj_paperless = db_sj_paperless_host + '\\' + db_sj_paperless_instance == db_dbcnet_host + '\\' + db_dbcnet_instance ? '' : '[' + db_sj_paperless_host + '\\' + db_sj_paperless_instance +  '].';

        var sql = `
            select distinct d.*
            from
                ` + linked_sj_paperless + db_sj_paperless_database + `.dbo.sj_detail d,
                ` + linked_sj_paperless + db_sj_paperless_database + `.dbo.terima_sj h
            where
                d.bu_code = h.bu_code
                and d.no_sj = h.no_sj
                and replace(h.nopol,' ','') like '` + request.requestData.no_pol + `%'
                and convert(varchar(10), h.tgl, 120) = '` + request.requestData.tanggal_target + `'
                and h.kode_ship_to = '` + request.requestData.kode_kirim + `'
                ` + where + `
        `;

        // console.log(sql); return false;

        const SJDetail = await Database.connection("mssql_dbcnet")
        .rawQuery(sql)

        // console.log(SJDetail); return false;

        return {SJDetail: SJDetail}          
    }

    public async getAdminMuat({request}) {   

        var db_dbcnet_host = Env.envCache.DB_DBCNET_HOST;
        var db_wh_wdjr_host = Env.envCache.DB_WH_WDJR_HOST;
        var db_wh_wtur_host = Env.envCache.DB_WH_WTUR_HOST;
        var db_dbcnet_instance = Env.envCache.DB_DBCNET_INSTANCE;
        var db_wh_wtur_database = Env.envCache.DB_WH_WTUR_DATABASE;
        var db_wh_wdjr_database = Env.envCache.DB_WH_WDJR_DATABASE;
        var db_wh_wdjr_instance = Env.envCache.DB_WH_WDJR_INSTANCE;
        var db_wh_wtur_instance = Env.envCache.DB_WH_WTUR_INSTANCE;
        var db_qaddbc_host = Env.envCache.DB_QADDBC_HOST;
        var db_qaddbc_instance = Env.envCache.DB_QADDBC_INSTANCE;
        var db_qaddbc_database = Env.envCache.DB_QADDBC_DATABASE;

        var linked_wdjr = db_wh_wdjr_host + '\\' + db_wh_wdjr_instance == db_dbcnet_host + '\\' + db_dbcnet_instance ? '' : '[' + db_wh_wdjr_host + (db_wh_wdjr_instance == '' ? '' : '\\' + db_wh_wdjr_instance) + '].';
        var linked_wtur = db_wh_wtur_host + '\\' + db_wh_wtur_instance == db_dbcnet_host + '\\' + db_dbcnet_instance ? '' : '[' + db_wh_wtur_host + (db_wh_wtur_instance == '' ? '' : '\\' + db_wh_wtur_instance) + '].'; 
        var linked_qaddbc = db_qaddbc_host + '\\' + db_qaddbc_instance == db_dbcnet_host + '\\' + db_dbcnet_instance ? '' : '[' + db_qaddbc_host + '\\' + db_qaddbc_instance +  '].';

        var sql = `
            select
                no_nesting, nopps,
                line, no_so, kode_barang,
                qty, kode_kirim,
                (select top 1 pt_desc1 from ` + linked_qaddbc + db_qaddbc_database + `.dbo.pt_mstr where pt_part = p.kode_barang) + ' ' +
                (select top 1 pt_desc2 from ` + linked_qaddbc + db_qaddbc_database + `.dbo.pt_mstr where pt_part = p.kode_barang) nama_barang
            from
                ` + linked_wdjr + db_wh_wdjr_database + `.dbo.qad_penyerahan_pps p
            where
                no_urut_pemesanan = ?
            order by
                no_so, line
        `;

        // console.log(sql); return false;

        const adminMuat = await Database.connection("mssql_dbcnet")
        .rawQuery(sql, [request.requestData.visual_no])

        // console.log(adminMuat); return false;

        return {adminMuat: adminMuat}          
    }

    public async getAdminMuatNgoro({request}) {   

        var db_dbcnet_host = Env.envCache.DB_DBCNET_HOST;
        var db_wh_wdjr_host = Env.envCache.DB_WH_WDJR_HOST;
        var db_wh_wtur_host = Env.envCache.DB_WH_WTUR_HOST;
        var db_dbcnet_instance = Env.envCache.DB_DBCNET_INSTANCE;
        var db_wh_wtur_database = Env.envCache.DB_WH_WTUR_DATABASE;
        var db_wh_wdjr_database = Env.envCache.DB_WH_WDJR_DATABASE;
        var db_wh_wdjr_instance = Env.envCache.DB_WH_WDJR_INSTANCE;
        var db_wh_wtur_instance = Env.envCache.DB_WH_WTUR_INSTANCE;
        var db_qaddbc_host = Env.envCache.DB_QADDBC_HOST;
        var db_qaddbc_instance = Env.envCache.DB_QADDBC_INSTANCE;
        var db_qaddbc_database = Env.envCache.DB_QADDBC_DATABASE;

        var linked_wdjr = db_wh_wdjr_host + '\\' + db_wh_wdjr_instance == db_dbcnet_host + '\\' + db_dbcnet_instance ? '' : '[' + db_wh_wdjr_host + (db_wh_wdjr_instance == '' ? '' : '\\' + db_wh_wdjr_instance) + '].';
        var linked_wtur = db_wh_wtur_host + '\\' + db_wh_wtur_instance == db_dbcnet_host + '\\' + db_dbcnet_instance ? '' : '[' + db_wh_wtur_host + (db_wh_wtur_instance == '' ? '' : '\\' + db_wh_wtur_instance) + '].'; 
        var linked_qaddbc = db_qaddbc_host + '\\' + db_qaddbc_instance == db_dbcnet_host + '\\' + db_dbcnet_instance ? '' : '[' + db_qaddbc_host + '\\' + db_qaddbc_instance +  '].';

        var sql = `
            select
                kode_kirim, no_so nomor_so,
                line, kode_barang kode_item,
                qty jumlah,
                (select top 1 pt_desc1 from ` + linked_qaddbc + db_qaddbc_database + `.dbo.pt_mstr where pt_part = p.kode_barang) + ' ' +
                (select top 1 pt_desc2 from ` + linked_qaddbc + db_qaddbc_database + `.dbo.pt_mstr where pt_part = p.kode_barang) nama_barang
            from
                ` + linked_wdjr + db_wh_wdjr_database + `.dbo.qad_penyerahan_pps p
            where
                no_urut_pemesanan = ?
            order by
                no_so, line
        `;

        // console.log(sql); return false;

        const adminMuatNgoro = await Database.connection("mssql_dbcnet")
        .rawQuery(sql, [request.requestData.visual_no])

        // console.log(adminMuatNgoro); return false;

        return {adminMuatNgoro: adminMuatNgoro}           
    }

}
