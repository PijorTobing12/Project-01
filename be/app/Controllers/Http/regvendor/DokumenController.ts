import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import Env from '@ioc:Adonis/Core/Env'
import { getWSA } from "App/Helpers/Wsa";
import SupplierPath from 'App/Models/regvendor/SupplierPath';
import SupplierPathDet from 'App/Models/regvendor/SupplierPathDet';
import SupplierPathUpload from 'App/Models/regvendor/SupplierPathUpload';
import RegisVendor from 'App/Models/regvendor/RegisVendor';
const dayjs = require('dayjs');
const datetimeNow = dayjs().format('YYYY-MM-DD HH:mm:ss');

export default class DokumenController {

    public async getKontakPerson({ request, response }: HttpContextContract) {
        // cek data
        const cekdata = await SupplierPath
                        .query()
                        .where('sup_npwp', request.input('npwp'))
                        // .where('sup_flag', 3)
                        .first();
        if(cekdata){
            const res = await SupplierPathDet.query().where('sup_code_app', cekdata.sup_code_app).where('details_column', 8).where('details_column_prioritas', 8).where('active','true');
            return res; 
        }
    }  

    public async getCountKonPerson({ request, response }: HttpContextContract) {
        const res = await Database.connection('mssql_procsys').from('m_supp_dtl_path').where('sup_code_app', request.input('sup_code_app')).where('details_column', 8).where('active','true').count('m_supp_dtl_path.sup_code_app as total');
        return res[0].total; 
    }  
	
    public async nonActive({ request, response }: HttpContextContract) {
        // Update m_supp_dtl_path
        const updSupDtl = await Database                            
                                .connection('mssql_procsys')
                                .from('m_supp_dtl_path')
                                .where('sup_dtl_id', request.input('sup_dtl_id'))
                                .where('sup_code_app', request.input('sup_code_app'))
                                .update({ 
                                    active: 'false',
                                    modified_by: 'Vendor',
                                    modified_date: datetimeNow,
                                });

        return response.json(updSupDtl);

    }
	
    public async getDewanDireksi({ request, response }: HttpContextContract) {
        // cek data
        const cekdata = await SupplierPath
                        .query()
                        .where('sup_npwp', request.input('npwp'))
                        // .where('sup_flag', 3)
                        .first();
        if(cekdata){
            const res = await SupplierPathDet.query().where('sup_code_app', cekdata.sup_code_app).where('details_column', 9).where('details_column_prioritas', 9).where('active','true');
            return res; 
        }
    } 

    public async getAdminUmum({ request }: HttpContextContract) {
        // cek data
        const cekdata = await SupplierPath
                        .query()
                        .where('sup_npwp', request.input('npwp'))
                        // .where('sup_flag', 3)
                        .first();

        if(cekdata){
            const cek_supp = await SupplierPathDet.query().where('sup_code_app', cekdata.sup_code_app).where('details_column', 10).where('details_column_prioritas', 10).where('active','true').first();
        
            if(cek_supp){
                let str1,str2,str3,str4,str5,str6,str7,str8,str9,str10,str11;
                (cek_supp.details_content_1 == null) ? str1 = '' : str1 = cek_supp.details_content_1.split('>>');
                (cek_supp.details_content_2 == null) ? str2 = '' : str2 = cek_supp.details_content_2.split('>>');
                (cek_supp.details_content_3 == null) ? str3 = '' : str3 = cek_supp.details_content_3.split('>>');
                (cek_supp.details_content_4 == null) ? str4 = '' : str4 = cek_supp.details_content_4.split('>>');
                (cek_supp.details_content_5 == null) ? str5 = '' : str5 = cek_supp.details_content_5.split('>>');
                (cek_supp.details_content_6 == null) ? str6 = '' : str6 = cek_supp.details_content_6.split('>>');
                (cek_supp.details_content_7 == null) ? str7 = '' : str7 = cek_supp.details_content_7.split('>>');
                (cek_supp.details_content_8 == null) ? str8 = '' : str8 = cek_supp.details_content_8.split('>>');
                (cek_supp.details_content_9 == null) ? str9 = '' : str9 = cek_supp.details_content_9.split('>>');
                (cek_supp.details_content_10 == null) ? str10 = '' : str10 = cek_supp.details_content_10.split('>>');
                (cek_supp.details_content_11 == null) ? str11 = '' : str11 = cek_supp.details_content_11.split('>>');

                let data1 = [{ dok: str1[0] }, { tglkeluar: str1[1] }, { tglakhir: str1[2] }, { file: (str1[3]) ? str1[3]+'.pdf' : '' }];
                let data2 = [{ dok: str2[0] }, { tglkeluar: str2[1] }, { tglakhir: str2[2] }, { file: (str2[3]) ? str2[3]+'.pdf' : '' }];
                let data3 = [{ dok: str3[0] }, { tglkeluar: str3[1] }, { tglakhir: str3[2] }, { file: (str3[3]) ? str3[3]+'.pdf' : '' }];
                let data4 = [{ dok: str4[0] }, { tglkeluar: str4[1] }, { tglakhir: str4[2] }, { file: (str4[3]) ? str4[3]+'.pdf' : '' }];
                let data5 = [{ dok: str5[0] }, { tglkeluar: str5[1] }, { tglakhir: str5[2] }, { file: (str5[3]) ? str5[3]+'.pdf' : '' }];
                let data6 = [{ dok: str6[0] }, { tglkeluar: str6[1] }, { tglakhir: str6[2] }, { file: (str6[3]) ? str6[3]+'.pdf' : '' }];
                let data7 = [{ dok: str7[0] }, { tglkeluar: str7[1] }, { tglakhir: str7[2] }, { file: (str7[3]) ? str7[3]+'.pdf' : '' }];
                let data8 = [{ dok: str8[0] }, { tglkeluar: str8[1] }, { tglakhir: str8[2] }, { file: (str8[3]) ? str8[3]+'.pdf' : '' }];
                let data9 = [{ dok: str9[0] }, { tglkeluar: str9[1] }, { tglakhir: str9[2] }, { file: (str9[3]) ? str9[3]+'.pdf' : '' }];
                let data10 = [{ dok: str10[0] }, { tglkeluar: str10[1] }, { tglakhir: str10[2] }, { file: (str10[3]) ? str10[3]+'.pdf' : '' }];
                let data11 = [{ dok: str11[0] }, { tglkeluar: str11[1] }, { tglakhir: str11[2] }, { file: (str11[3]) ? str11[3]+'.pdf' : '' }];

                return { 
                    data1: data1,
                    data2: data2,
                    data3: data3,
                    data4: data4,
                    data5: data5,
                    data6: data6,
                    data7: data7,
                    data8: data8,
                    data9: data9,
                    data10: data10,
                    data11: data11
                };
            } 
        }   
    }
	
	public async getAdminUmumUpd({ request }: HttpContextContract) {
        // cek data
        const cekdata = await SupplierPath
                        .query()
                        .where('sup_npwp', request.input('npwp'))
                        // .where('sup_flag', 3)
                        .first();

        if(cekdata){
            const cek_supp = await SupplierPathDet.query().where('sup_code_app', cekdata.sup_code_app).where('details_column', 10).where('details_column_prioritas', 10).where('active', 'true').first();
        
            if(cek_supp){
                var str1 = cek_supp.details_content_1 ? cek_supp.details_content_1.split('>>') : [];
                var str2 = cek_supp.details_content_2 ? cek_supp.details_content_2.split('>>') : [];
                var str3 = cek_supp.details_content_3 ? cek_supp.details_content_3.split('>>') : [];
                var str4 = cek_supp.details_content_4 ? cek_supp.details_content_4.split('>>') : [];
                var str5 = cek_supp.details_content_5 ? cek_supp.details_content_5.split('>>') : [];
                var str6 = cek_supp.details_content_6 ? cek_supp.details_content_6.split('>>') : [];
                var str7 = cek_supp.details_content_7 ? cek_supp.details_content_7.split('>>') : [];
                var str8 = cek_supp.details_content_8 ? cek_supp.details_content_8.split('>>') : [];
                var str9 = cek_supp.details_content_9 ? cek_supp.details_content_9.split('>>') : [];
                var str10 = cek_supp.details_content_10 ? cek_supp.details_content_10.split('>>') : [];
                var str11 = cek_supp.details_content_11 ? cek_supp.details_content_11.split('>>') : [];

                let data1 = [{ dok: str1[0] }, { tglkeluar: str1[1] }, { tglakhir: str1[2] }, { file: (str1[3]) ? str1[3]+'.pdf' : '' }];
                let data2 = [{ dok: str2[0] }, { tglkeluar: str2[1] }, { tglakhir: str2[2] }, { file: (str2[3]) ? str2[3]+'.pdf' : '' }];
                let data3 = [{ dok: str3[0] }, { tglkeluar: str3[1] }, { tglakhir: str3[2] }, { file: (str3[3]) ? str3[3]+'.pdf' : '' }];
                let data4 = [{ dok: str4[0] }, { tglkeluar: str4[1] }, { tglakhir: str4[2] }, { file: (str4[3]) ? str4[3]+'.pdf' : '' }];
                let data5 = [{ dok: str5[0] }, { tglkeluar: str5[1] }, { tglakhir: str5[2] }, { file: (str5[3]) ? str5[3]+'.pdf' : '' }];
                let data6 = [{ dok: str6[0] }, { tglkeluar: str6[1] }, { tglakhir: str6[2] }, { file: (str6[3]) ? str6[3]+'.pdf' : '' }];
                let data7 = [{ dok: str7[0] }, { tglkeluar: str7[1] }, { tglakhir: str7[2] }, { file: (str7[3]) ? str7[3]+'.pdf' : '' }];
                let data8 = [{ dok: str8[0] }, { tglkeluar: str8[1] }, { tglakhir: str8[2] }, { file: (str8[3]) ? str8[3]+'.pdf' : '' }];
                let data9 = [{ dok: str9[0] }, { tglkeluar: str9[1] }, { tglakhir: str9[2] }, { file: (str9[3]) ? str9[3]+'.pdf' : '' }];
                let data10 = [{ dok: str10[0] }, { tglkeluar: str10[1] }, { tglakhir: str10[2] }, { file: (str10[3]) ? str10[3]+'.pdf' : '' }];
                let data11 = [{ dok: str11[0] }, { tglkeluar: str11[1] }, { tglakhir: str11[2] }, { file: (str11[3]) ? str11[3]+'.pdf' : '' }];

                return { 
                    data1: data1,
                    data2: data2,
                    data3: data3,
                    data4: data4,
                    data5: data5,
                    data6: data6,
                    data7: data7,
                    data8: data8,
                    data9: data9,
                    data10: data10,
                    data11: data11
                };
            } 
        }   
    }

    public async getVendAdmUmum({ request, response }: HttpContextContract) {
        // cek data
        const cekdata = await SupplierPath
                        .query()
                        .where('sup_npwp', request.input('npwp'))
                        // .where('sup_flag', 3)
                        .first();

        if(cekdata){
            const cek_supp = await SupplierPathDet.query().where('sup_code_app', cekdata.sup_code_app).where('details_column', 10).where('details_column_prioritas', 10).first();
        
            if(cek_supp){
                const dataSupp = await SupplierPathDet.query().where('sup_code_app', cekdata.sup_code_app).where('details_column', 10).where('details_column_prioritas', 10);
                let dataArr = Array();
                let str;
                let namaDok;
                for (let data of dataSupp) {
                    const bagian = request.input('bagian');
                    if (parseInt(bagian) === 1) {
                        namaDok = "Akte Pendirian Perusahaan";
                        str = data.details_content_1 ? data.details_content_1.split('>>') : [];    
                    } else if (parseInt(bagian) === 2) {
                        namaDok = "Akte Perubahan Terakhir";
                        str = data.details_content_2 ? data.details_content_2.split('>>') : [];    
                    } else if (parseInt(bagian) === 3) {
                        namaDok = "Surat Izin Usaha (SIUP)";
                        str = data.details_content_3 ? data.details_content_3.split('>>') : [];    
                    } else if (parseInt(bagian) === 4) {
                        namaDok = "Nomor Induk Berusaha (NIB)";
                        str = data.details_content_4 ? data.details_content_4.split('>>') : [];    
                    } else if (parseInt(bagian) === 5) {
                        namaDok = "Tanda Daftar Perusahaan (TDP)";
                        str = data.details_content_5 ? data.details_content_5.split('>>') : [];   
                    } else if (parseInt(bagian) === 6) {
                        namaDok = "Surat Keterangan Domisili Perusahaan (SKDP)";
                        str = data.details_content_6 ? data.details_content_6.split('>>') : [];    
                    } else if (parseInt(bagian) === 7) {
                        namaDok = "Nomor Pokok Wajib Pajak (NPWP)";
                        str = data.details_content_7 ? data.details_content_7.split('>>') : [];   
                    } else if (parseInt(bagian) === 8) {
                        namaDok = "Surat Keterangan Terdaftar (SKT)";
                        str = data.details_content_8 ? data.details_content_8.split('>>') : [];   
                    } else if (parseInt(bagian) === 9) {
                        namaDok = "Surat Pengukuhan Pengusaha Kena Pajak (PKP)";
                        str = data.details_content_9 ? data.details_content_9.split('>>') : [];    
                    } else if (parseInt(bagian) === 10) {
                        namaDok = "Daftar Pemilik Saham";
                        str = data.details_content_10 ? data.details_content_10.split('>>') : [];    
                    } else if (parseInt(bagian) === 11) {
                        namaDok = "Struktur Organisasi";
                        str = data.details_content_11 ? data.details_content_11.split('>>') : [];   
                    }
                    
                    if (str[0]) {
                        dataArr.push({
                            namaDok: namaDok,
                            dok: str[0],
                            tglkeluar: str[1],
                            tglakhir: str[2],
                            file: (str[3]) ? str[3]+'.pdf' : '',
                            statusUpdate: data.status_update,
                            active: data.active
                        });    
                    } 
                }
                return dataArr;
            } 
            // const cek_supp = await SupplierPathDet.query().where('sup_code_app', cekdata.sup_code_app).where('details_column', 10).where('details_column_prioritas', 10);
            // return response.json(cek_supp);
        }   
    }

    public async getVendorTransporter({ request }: HttpContextContract) {
        // cek data
        const cekdata = await SupplierPath
                        .query()
                        .where('sup_npwp', request.input('npwp'))
                        // .where('sup_flag', 3)
                        .first();

        if(cekdata){
            // const res = await SupplierPathDet.query().where('sup_code_app', cekdata.sup_code_app).where('details_column', 11).where('details_column_prioritas', 11);
            // return res; 

            const res = await SupplierPathUpload.query().where('sup_code_app', cekdata.sup_code_app).where('details_column', 11);
            return res;
        }
    }
	
	public async getVendDataUpload({ request }: HttpContextContract) {
        // cek data
        const cekdata = await SupplierPath
                        .query()
                        .where('sup_npwp', request.input('npwp'))
                        .first();

        if(cekdata){
            const res = await SupplierPathUpload.query().where('sup_code_app', cekdata.sup_code_app).where('details_column', parseInt(request.input('details_column')));
            return res;
        }
    }

    public async getVendorAgenResmi({ request }: HttpContextContract) {
        // cek data
        const cekdata = await SupplierPath
                        .query()
                        .where('sup_npwp', request.input('npwp'))
                        // .where('sup_flag', 3)
                        .first();

        if(cekdata){
            const cek_supp = await SupplierPathDet.query().where('sup_code_app', cekdata.sup_code_app).where('details_column', 12).where('details_column_prioritas', 12).where('active','true').first();
            
            if(cek_supp){
                var str1 = cek_supp.details_content_1.split(';');

                let data1 = [{ dok: str1[0] }, { tglkeluar: str1[1] }, { tglakhir: str1[2] }];
    
                return { 
                    data1: data1
                };
            }
        }
    }

    public async getKontraktorSipil({ request }: HttpContextContract) {
        // cek data
        const cekdata = await SupplierPath
                        .query()
                        .where('sup_npwp', request.input('npwp'))
                        // .where('sup_flag', 3)
                        .first();

        if(cekdata){
            const cek_supp = await SupplierPathDet.query().where('sup_code_app', cekdata.sup_code_app).where('details_column', 13).where('details_column_prioritas', 13).where('active','true').first();
            
            if(cek_supp){
                var str1 = cek_supp.details_content_1.split(';');
                var str2 = cek_supp.details_content_2.split(';');

                let data1 = [{ dok: str1[0] }, { tglkeluar: str1[1] }, { tglakhir: str1[2] }];
                let data2 = [{ dok: str2[0] }, { tglkeluar: str2[1] }, { tglakhir: str2[2] }];

                return { 
                    data1: data1,
                    data2: data2
                };
            }
        }
    }

    public async getBank({ request }) {
        const cekdata = await SupplierPath
                        .query()
                        .where('sup_npwp', request.input('npwp'))
                        // .where('sup_flag', 3)
                        .first();
        if(cekdata){
            const regVend: any = await RegisVendor
                        .query()
                        .where('regis_code_app', cekdata.sup_code_app)
                        .first();

            const mbu = await Database.from('m_bisnis_unit').select('bu_code_qad').where('bu_id', regVend.bu_id).first();

            // cek WSA getDBCCekVendByNpwp
            let resWsa = [];
            const args = { parDomain: mbu.bu_code_qad, parFldName: "sup_bank" };
            
            let callWsa: any;
            callWsa = await getWSA(Env.get('LINK_WSA'), "getDBCMstGenCode", args);
            resWsa = callWsa.tt_codemstr.tt_codemstrRow;      

            return resWsa;
        }    
    } 

    public async getKotaCabang({ request }) {
        const cekdata = await SupplierPath
                        .query()
                        .where('sup_npwp', request.input('npwp'))
                        // .where('sup_flag', 3)
                        .first();
        if(cekdata){
            const regVend: any = await RegisVendor
                        .query()
                        .where('regis_code_app', cekdata.sup_code_app)
                        .first();

            const mbu = await Database.from('m_bisnis_unit').select('bu_code_qad').where('bu_id', regVend.bu_id).first();

            // cek WSA getDBCCekVendByNpwp
            let resWsa = [];
            const args = { parDomain: mbu.bu_code_qad, parFldName: "sup_kotarek" };
            
            let callWsa: any;
            callWsa = await getWSA(Env.get('LINK_WSA'), "getDBCMstGenCode", args);
            resWsa = callWsa.tt_codemstr.tt_codemstrRow;      

            return resWsa;
        }    
    }

    public async getRekeningBank({ request, response }: HttpContextContract) {
        // cek data
        const cekdata = await SupplierPath
                        .query()
                        .where('sup_npwp', request.input('npwp'))
                        // .where('sup_flag', 3)
                        .first();
        if(cekdata){
            const res = await SupplierPathDet.query().where('sup_code_app', cekdata.sup_code_app).where('details_column', 14).where('details_column_prioritas', 14).where('active','true');
            return res; 
        }
    }
        
    public async getScopeKerjaUpd({ request }: HttpContextContract) {
        // cek data
        const cekdata = await SupplierPath
                        .query()
                        .where('sup_npwp', request.input('npwp'))
                        .first();
        if(cekdata){
            const res = await SupplierPathDet.query().where('sup_code_app', cekdata.sup_code_app).where('details_column', 23).where('details_column_prioritas', 23).where('status_update', 'true').where('active', 'true').first();
            if (res) {
                return res.details_content_1;
            } else {
                const resReg: any = await SupplierPathDet.query().where('sup_code_app', cekdata.sup_code_app).where('details_column', 23).where('details_column_prioritas', 23).whereNull('status_update').where('active', 'true').first();
                
                return resReg.details_content_1;   
            }
        }
    }

    public async getScopeKerjaDok({ request }: HttpContextContract) {
        const cekdata = await SupplierPath
                .query()
                .where('sup_npwp', request.input('npwp'))
                .first();
        if(cekdata){
            const res = await SupplierPathDet.query().where('sup_code_app', cekdata.sup_code_app).where('details_column', 23).where('details_column_prioritas', 23).where('active','true').first();
            if (res) {
                return res.details_content_1;
            } else {
                return "";   
            }
        }
    }

    public async getGroupPerusahaan({ request, response }: HttpContextContract) {
        // cek data
        const cekdata = await SupplierPath
                        .query()
                        .where('sup_npwp', request.input('npwp'))
                        // .where('sup_flag', 3)
                        .first();
        if(cekdata){
            const res = await SupplierPathDet.query().where('sup_code_app', cekdata.sup_code_app).where('details_column', 15).where('details_column_prioritas', 15).where('active','true');
            return res; 
        }
    } 

    public async getPenandaKontrak({ request, response }: HttpContextContract) {
        // cek data
        const cekdata = await SupplierPath
                        .query()
                        .where('sup_npwp', request.input('npwp'))
                        // .where('sup_flag', 3)
                        .first();
        if(cekdata){
            const res = await SupplierPathDet.query().where('sup_code_app', cekdata.sup_code_app).where('details_column', 21).where('details_column_prioritas', 21).where('active','true');
            return res; 
        }
    } 

    public async getNamaPejabat({ request, response }: HttpContextContract) {
        // cek data
        const cekdata = await SupplierPath
                        .query()
                        .where('sup_npwp', request.input('npwp'))
                        // .where('sup_flag', 3)
                        .first();
        if(cekdata){
            const res = await SupplierPathDet.query().where('sup_code_app', cekdata.sup_code_app).where('details_column', 16).where('details_column_prioritas', 16).where('active','true');
            return res; 
        }
    } 

    public async getQualityEnvironment({ request }: HttpContextContract) {
        // cek data
        const cekdata = await SupplierPath
                        .query()
                        .where('sup_npwp', request.input('npwp'))
                        // .where('sup_flag', 3)
                        .first();

        if(cekdata){
            const cek_supp = await SupplierPathDet.query().where('sup_code_app', cekdata.sup_code_app).where('details_column', 17).where('details_column_prioritas', 17).where('active','true').first();
            
            if(cek_supp){
                var str1 = cek_supp.details_content_1.split(';');
                var str2 = cek_supp.details_content_2.split(';');
                var str3 = cek_supp.details_content_3.split(';');
                var str4 = cek_supp.details_content_4.split(';');
                var str5 = cek_supp.details_content_5.split(';');

                return { 
                    data1: str1,
                    data2: str2,
                    data3: str3,
                    data4: str4,
                    data5: str5
                };
            }
        }
    }

	public async getQualityEnvironmentUpd({ request }: HttpContextContract) {
        // cek data
        const cekdata = await SupplierPath
                        .query()
                        .where('sup_npwp', request.input('npwp'))
                        .first();

        if(cekdata){
            const cek_supp = await SupplierPathDet.query().where('sup_code_app', cekdata.sup_code_app).where('details_column', 17).where('details_column_prioritas', 17).orderBy('sup_dtl_id', 'asc').first();
            
            if(cek_supp){
                var str1 = cek_supp.details_content_1 ? cek_supp.details_content_1.split(';') : "";
                var str2 = cek_supp.details_content_2 ? cek_supp.details_content_2.split(';') : "";
                var str3 = cek_supp.details_content_3 ? cek_supp.details_content_3.split(';') : "";
                var str4 = cek_supp.details_content_4 ? cek_supp.details_content_4.split(';') : "";
                var str5 = cek_supp.details_content_5 ? cek_supp.details_content_5.split(';') : "";

                return { 
                    data1: str1,
                    data2: str2,
                    data3: str3,
                    data4: str4,
                    data5: str5
                };
            }
        }
    }    

    public async getQualityEnvUpd({ request }: HttpContextContract) {
        // cek data
        const cekdata = await SupplierPath
                        .query()
                        .where('sup_npwp', request.input('npwp'))
                        .first();

        if(cekdata){
            const cek_supp = await SupplierPathDet.query().where('sup_code_app', cekdata.sup_code_app).where('details_column', 17).where('details_column_prioritas', 17).where('status_update', 'true').where('active', 'true').first();
            
            if(cek_supp){
                var str1 = cek_supp.details_content_1 ? cek_supp.details_content_1.split(';') : "";
                var str2 = cek_supp.details_content_2 ? cek_supp.details_content_2.split(';') : "";
                var str3 = cek_supp.details_content_3 ? cek_supp.details_content_3.split(';') : "";
                var str4 = cek_supp.details_content_4 ? cek_supp.details_content_4.split(';') : "";
                var str5 = cek_supp.details_content_5 ? cek_supp.details_content_5.split(';') : "";

                return { 
                    data1: str1,
                    data2: str2,
                    data3: str3,
                    data4: str4,
                    data5: str5
                };
            }
        }
    }

    public async getPaktaIntegritas({ request }: HttpContextContract) {
        // cek data
        const cekdata = await SupplierPath
                        .query()
                        .where('sup_npwp', request.input('npwp'))
                        // .where('sup_flag', 3)
                        .first();

        if(cekdata){
            // const res = await SupplierPathDet.query().where('sup_code_app', cekdata.sup_code_app).where('details_column', 20).where('details_column_prioritas', 20);
            // return res; 

            const res = await SupplierPathUpload.query().where('sup_code_app', cekdata.sup_code_app).where('details_column', 20);
            return res;
        }
    }
        
    public async getCompanyProfileUpd({ request }: HttpContextContract) {
        const cekdata = await SupplierPath
                                .query()
                                .where('sup_npwp', request.input('npwp'))
                                .first();

        if(cekdata){
            const res = await SupplierPathUpload
                        .query()
                        .where('sup_code_app', cekdata.sup_code_app)  
                        .where('details_column', 22);  

            return res;  
        }
    }

    public async getPengalamanPers({ request, response }: HttpContextContract) {
        // cek data
        const cekdata = await SupplierPath
                        .query()
                        .where('sup_npwp', request.input('npwp'))
                        // .where('sup_flag', 3)
                        .first();
        if(cekdata){
            const res = await SupplierPathDet.query().where('sup_code_app', cekdata.sup_code_app).where('details_column', 18).where('details_column_prioritas', 18).where('active','true');
            return res; 
        }
    } 

    public async getFileVendorAgenResmi({ request }: HttpContextContract) {
        // cek data
        const cekdata = await SupplierPath
                        .query()
                        .where('sup_npwp', request.input('npwp'))
                        // .where('sup_flag', 3)
                        .first();

        if(cekdata){
            // const res = await SupplierPathDet.query().where('sup_code_app', cekdata.sup_code_app).where('details_column', 12).where('details_column_prioritas', 12);
            // return res; 

            const res = await SupplierPathUpload.query().where('sup_code_app', cekdata.sup_code_app).where('details_column', 12);
            return res;
        }
    }

    public async getFileKontraktorSipil({ request }: HttpContextContract) {
        // cek data
        const cekdata = await SupplierPath
                        .query()
                        .where('sup_npwp', request.input('npwp'))
                        // .where('sup_flag', 3)
                        .first();

        if(cekdata){
            // const res = await SupplierPathDet.query().where('sup_code_app', cekdata.sup_code_app).where('details_column', 13).where('details_column_prioritas', 13);
            // return res; 

            const res = await SupplierPathUpload.query().where('sup_code_app', cekdata.sup_code_app).where('details_column', 13);
            return res;
        }
    }

    public async getFileRekeningBank({ request }: HttpContextContract) {
        // cek data
        const cekdata = await SupplierPath
                        .query()
                        .where('sup_npwp', request.input('npwp'))
                        // .where('sup_flag', 3)
                        .first();

        if(cekdata){
            // const res = await SupplierPathDet.query().where('sup_code_app', cekdata.sup_code_app).where('details_column', 14).where('details_column_prioritas', 14);
            // return res; 

            const res = await SupplierPathUpload.query().where('sup_code_app', cekdata.sup_code_app).where('details_column', 14);
            return res;
        }
    }    

    public async getFileNamaPejabat({ request }: HttpContextContract) {
        // cek data
        const cekdata = await SupplierPath
                        .query()
                        .where('sup_npwp', request.input('npwp'))
                        // .where('sup_flag', 3)
                        .first();

        if(cekdata){
            // const res = await SupplierPathDet.query().where('sup_code_app', cekdata.sup_code_app).where('details_column', 16).where('details_column_prioritas', 16);
            // return res; 

            const res = await SupplierPathUpload.query().where('sup_code_app', cekdata.sup_code_app).where('details_column', 16);
            return res;
        }
    } 

    public async getFileQualityEnvironment({ request }: HttpContextContract) {
        // cek data
        const cekdata = await SupplierPath
                        .query()
                        .where('sup_npwp', request.input('npwp'))
                        // .where('sup_flag', 3)
                        .first();

        if(cekdata){
            // const res = await SupplierPathDet.query().where('sup_code_app', cekdata.sup_code_app).where('details_column', 17).where('details_column_prioritas', 17);
            // return res; 

            const res = await SupplierPathUpload.query().where('sup_code_app', cekdata.sup_code_app).where('details_column', 17);
            return res;
        }
    }

    public async getFilePengalamanPers({ request }: HttpContextContract) {
        // cek data
        const cekdata = await SupplierPath
                        .query()
                        .where('sup_npwp', request.input('npwp'))
                        // .where('sup_flag', 3)
                        .first();

        if(cekdata){
            // const res = await SupplierPathDet.query().where('sup_code_app', cekdata.sup_code_app).where('details_column', 18).where('details_column_prioritas', 18);
            // return res; 

            const res = await SupplierPathUpload.query().where('sup_code_app', cekdata.sup_code_app).where('details_column', 18);
            return res;
        }
    }
}