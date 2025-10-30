import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from "@ioc:Adonis/Lucid/Database";
import { formatDateTime, dateTime, dateOnly, ucWords } from "App/Helpers/Function";
import SupplierPath from 'App/Models/regvendor/SupplierPath';
import SupplierPathUpd from 'App/Models/regvendor/SupplierPathUpd';

export default class RegisterController {

    public async getProfile({ request, response }: HttpContextContract) {
        const npwp = request.input('npwp');

        const res = await SupplierPath
                    .query()
                    .where('sup_npwp', npwp).first(); 

        // Check Data Supplier Path Update
        const cekData = await SupplierPathUpd
                        .query()
                        .where('sup_npwp', npwp)
                        // .where('sup_flag', 3)
                        .where('sup_status_prog', 1)
                        .first(); 

        if(cekData){
            return response.json({ data1: res, data2: cekData });
        }
        else{
            const dataSupp = await SupplierPath
                        .query()
                        .where('sup_npwp', npwp).first(); 

            return response.json({ data1: res, data2: dataSupp });
        }
    }  

    public async saveUpdateProfile({ request, response }: HttpContextContract) {
        const code = request.input('code');
        const npwp = request.input('npwp');

        // Check Data Supplier Path
        const cek_supp = await SupplierPath
                        .query()
                        .where('sup_code_app', code)
                        .where('sup_npwp', npwp)
                        .orderBy('created_date', 'desc').first();
                        
        if(cek_supp){
            // Check Data Supplier Path Upd
            const cek_supp_upd = await SupplierPathUpd
                                .query()
                                .where('sup_code_app', code)
                                .where('sup_npwp', npwp)
                                .orderBy('created_date', 'desc')
                                .first();

            let sup_name;
            let sup_cat, sup_type, sup_email, sup_email2, sup_email3, sup_website, sup_form_company, sup_type_company, sup_office_address, sup_office_phone, sup_office_fax, sup_comp_other;
            let sup_warehouse_address, sup_warehouse_phone, sup_warehouse_fax;

            (request.input('namavend') == null || request.input('namavend') == '') ? sup_name = cek_supp.sup_name : sup_name = request.input('namavend').replace('&', 'n');
            (request.input('katVend') == null || request.input('katVend') == '') ? sup_cat = cek_supp.sup_cat : sup_cat = request.input('katVend');
            (request.input('katsubVend') == null || request.input('katsubVend') == '') ? sup_type = cek_supp.sup_type : sup_type = request.input('katsubVend');
            
            (request.input('emailpers') == null || request.input('emailpers') == '') ? sup_email = cek_supp.sup_email : sup_email = request.input('emailpers');
            (request.input('emailpers2') == null || request.input('emailpers2') == '') ? sup_email2 = '' : sup_email2 = request.input('emailpers2');
            (request.input('emailpers3') == null || request.input('emailpers3') == '') ? sup_email3 = '' : sup_email3 = request.input('emailpers3');
            (request.input('webpers') == null || request.input('webpers') == '') ? sup_website = '' : sup_website = request.input('webpers');
            (request.input('bentukPers') == null || request.input('bentukPers') == '') ? sup_form_company = cek_supp.sup_form_company : sup_form_company = request.input('bentukPers');
            (request.input('bentukPersLain') == null || request.input('bentukPersLain') == '') ? sup_comp_other = '' : sup_comp_other = request.input('bentukPersLain');
            (request.input('jenisPers') == null || request.input('jenisPers') == '') ? sup_type_company = cek_supp.sup_type_company : sup_type_company = request.input('jenisPers');
            (request.input('alamatkantor') == null || request.input('alamatkantor') == '') ? sup_office_address = cek_supp.sup_office_address : sup_office_address = request.input('alamatkantor');
            (request.input('noteleponkantor') == null || request.input('noteleponkantor') == '') ? sup_office_phone = cek_supp.sup_office_phone : sup_office_phone = request.input('noteleponkantor');
            (request.input('nofaxkantor') == null || request.input('nofaxkantor') == '') ? sup_office_fax = '' : sup_office_fax = request.input('nofaxkantor');
            (request.input('alamatpabrik') == null || request.input('alamatpabrik') == '') ? sup_warehouse_address = '' : sup_warehouse_address = request.input('alamatpabrik');
            (request.input('noteleponpabrik') == null || request.input('noteleponpabrik') == '') ? sup_warehouse_phone = '' : sup_warehouse_phone = request.input('noteleponpabrik');
            (request.input('nofaxpabrik') == null || request.input('nofaxpabrik') == '') ? sup_warehouse_fax = '' : sup_warehouse_fax = request.input('nofaxpabrik');
            
            const office_address_rep = sup_office_address.replace(/\s\s+/, ' ');
            const office_address = office_address_rep.trim();

            let warehouse_address_rep = "";
            if (sup_warehouse_address != "" || sup_warehouse_address != null) {
                warehouse_address_rep = sup_warehouse_address.replace(/\s\s+/, ' ');
            }
            
            const warehouse_address = warehouse_address_rep.trim();
            
            if(cek_supp_upd) {
                // cek flag
                if(cek_supp_upd.sup_flag != 2){
                     // Update Data Supplier Path Upd
                    const UpdSupplierPathUpd = await Database
                        .connection('mssql_procsys')
                        .from('m_supp_path_upd')
                        .where('sup_code_app', code)
                        .where('sup_npwp', npwp)
                        .update({
                            sup_name: sup_name, 
                            sup_cat: sup_cat,
                            sup_type: sup_type,
                            sup_email: sup_email,
                            sup_email2: sup_email2,
                            sup_email3: sup_email3,
                            sup_website: sup_website,
                            sup_date_regis: formatDateTime(cek_supp.sup_date_regis),
                            sup_form_company: sup_form_company,
                            sup_comp_other: sup_comp_other,
                            sup_type_company: sup_type_company,
                            sup_office_address: office_address,
                            sup_office_phone: sup_office_phone,
                            sup_office_fax: sup_office_fax,
                            sup_warehouse_address: warehouse_address,
                            sup_warehouse_phone: sup_warehouse_phone,
                            sup_warehouse_fax: sup_warehouse_fax,
                            sup_flag: 1,
                            sup_status_prog: 1,
                            sup_status: 1,
                            uuid: cek_supp.uuid,
                            modified_by: 'vendor',
                            modified_date: dateTime(),
                            approval_level: 1
                        });

                    if(UpdSupplierPathUpd){
                        // return response.status(200).json({
                        //     message: "Berhasil Update Profile",
                        //     status: true
                        // });
                        return response.json('sukses');
                    }
                    else{
                        // return response.status(406).json({
                        //     message: "Gagal Update Profile",
                        //     status: true
                        // });
                        return response.json('gagal');
                    }
                }
                else{
                    // return response.status(406).json({
                    //     message: "Update kelengkapan dokumen sebelumnya sedang dalam proses approval",
                    //     status: true
                    // }); 
                    return response.json('progress');                 
                }
            }
            else{
                // Insert Data Supplier Path Upd
                const InsSupplierPathUpd = await Database
                    .connection('mssql_procsys')
                    .table('m_supp_path_upd')
                    .insert({
                        sup_code_app: code,
                        sup_npwp: npwp,
                        sup_name: sup_name,
                        sup_cat: sup_cat,
                        sup_type: sup_type,
                        sup_email: sup_email,
                        sup_email2: sup_email2,
                        sup_email3: sup_email3,
                        sup_website: sup_website,
                        sup_date_regis: formatDateTime(cek_supp.sup_date_regis),
                        sup_form_company: sup_form_company,
                        sup_comp_other: sup_comp_other,
                        sup_type_company: sup_type_company,
                        sup_office_address: office_address,
                        sup_office_phone: sup_office_phone,
                        sup_office_fax: sup_office_fax,
                        sup_warehouse_address: warehouse_address,
                        sup_warehouse_phone: sup_warehouse_phone,
                        sup_warehouse_fax: sup_warehouse_fax,
                        sup_flag: 1,
                        sup_status_prog: 1,
                        sup_status: 1,
                        uuid: cek_supp.uuid,
                        created_by: 'vendor',
                        created_date: dateTime(),
                        approval_level: 1
                    });

                if(InsSupplierPathUpd){
                    // return response.status(200).json({
                    //     message: "Berhasil Update Profile",
                    //     status: true
                    // });
                    return response.json('sukses');
                }
                else{
                    // return response.status(406).json({
                    //     message: "Gagal Update Profile",
                    //     status: true
                    // });
                    return response.json('gagal');
                }
            }
        }
        else{
            // return response.status(406).json({
            //     message: "Invalid data",
            //     status: true,
            // }); 
            return response.json('invalid');
        }
    }

}