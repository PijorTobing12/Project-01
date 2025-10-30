import Database from "@ioc:Adonis/Lucid/Database";
import model from "App/Models/SuratJalan";
import fs from "fs";
import qr from "qrcode";
import { getWSA } from "App/Helpers/Wsa";
const urlDBC = "https://qssiptdldb07.odqad.com:8143/wsa/wsadbc/wsdl?targetURI=urn:services-qad-com:wsadbc:0001";
const linkedServer = '[DCL-DBSVR-01\\DBDFR].dbcnet2021.dbo'

export default class SuratJalanController {
    public async getBisnisUnit() {
        const getBU = await Database
        .connection('mssql_finapp')
        .rawQuery("SELECT *, bu_alias+' - '+bu_desc as bu_alias_desc FROM mst_businessunit order by bu_alias", [])

        return getBU;
    }

    public async getListSuratJalan({request, response}) {
        let page = request.input('page')
        let rowsPerPage = request.input('rowsPerPage')

        let filter = request.input('filter') == undefined ? '' : request.input('filter')
        // console.log(filter);        

        let domain = request.input('bu') == undefined ? '' : request.input('bu') //request.input('domain') == undefined ? '' : request.input('domain')
        let emp_id = request.input('empid') == undefined ? '' : request.input('empid')
        let ekspedisi = request.input('ekspedisi') == undefined ? '' : request.input('ekspedisi')
        let bu = request.input('bu') == undefined ? '' : request.input('bu')
        let fromDate = request.input('fromDate') == undefined ? '' : request.input('fromDate')
        let toDate = request.input('toDate') == undefined ? '' : request.input('toDate')

        let lastRow = parseInt(rowsPerPage) * parseInt(page)

        let columns = ['tgl', 'no_invoice', 'nopol', 'po_cost', 'no_po_reg', 'domain'];
        let where = '';
        const likes:any[] = [];
        if (filter !== '') {
            for (var i = 0; i < columns.length; i++) {
                let q_split = filter.split(' ');
                q_split.forEach((element: any) => {
                    likes.push(` ${columns[i]} like '%${element}%' `); 
                });
            }
            where += " and ( " + likes.join(' or ') + " ) ";
        }
        where += ekspedisi == '' ? '' : " and nama_ekspedisi like '%" +ekspedisi+ "%'"
        where += fromDate == '' ? "" : " and convert(varchar(10), tgl, 120) >= '" + fromDate + "'" //and convert(varchar(10), tgl, 120) >= '"+date('Y-m-01') + "'" :
        where += toDate == '' ? "" : "  and convert(varchar(10), tgl, 120) <= '"+ toDate +"'" // and convert(varchar(10), tgl, 120) <= '" . date('Y-m-t') . "'" : "

        let sql_eksp_vend = `
            select 
                case 
                when b.sup_code is null then c.sup_code 
                else b.sup_code 
                end sup_code
            from 
                userapp_vend a 
                inner join m_supplier b on
                a.sup_code_app = b.sup_code_app
                left join vend_data c on
                b.sup_code_app = c.supp_code_app
            where 
                a.sup_npwp = ?
        `
        console.log(emp_id);
        
        const getEkspVend = await Database.connection("mssql_procsys")
            .rawQuery(sql_eksp_vend, [emp_id]) //[emp_id] //['814190955322000']
        let sup_code = getEkspVend[0].sup_code
        console.log(sup_code);
        if(domain != ''){
            // Jalankan WSA //
            const args = { parDomain: domain,  kode_ekspedisi: sup_code, tglawal_sj: fromDate, tglakhir_sj: toDate  };
            const qwsa = await getWSA(urlDBC, "getDBCSJInv", args);
            // console.log(qwsa);
            
            if(qwsa.ttinv == null){
                let res = [];               
            }else{
                let res = qwsa.ttinv.ttinvRow
                // console.log(res);
                
                // res.forEach(async element => {
                await Promise.all(res.map(async (element) => {
                    // console.log(element);
                    // const update = await Database.connection("mssql_sj_paperless")
                    //     .from('terima_sj')
                    //     .where('domain', element.pardomain_sj)
                    //     .where('no_sj', element.nosj)
                    //     .update(
                    //         { 
                    //             no_po_reg: element.pod_nbr,
                    //             po_cost: element.pod_pur_cost,
                    //             no_invoice: element.CInvoice
                    //         }
                    //     );   
                    let invoi = element.CInvoice == undefined ? '' : element.CInvoice
                    let update = `
                        update terima_sj set no_po_reg = '`+element.pod_nbr+`', po_cost = '`+element.pod_pur_cost+`', no_invoice = '`+invoi+`' 
                        where domain = '`+element.pardomain_sj+`' and no_sj = '`+element.nosj+`'
                    `
                    const updateSQL = await Database.connection("mssql_sj_paperless").rawQuery(update, [])   
                }))
                    // console.log(element);
                // const update = await Database.connection("mssql_sj_paperless")
                //     .from('terima_sj')
                //     .where('domain', element.pardomain_sj)
                //     .where('no_sj', element.nosj)
                //     .update(
                //         { 
                //             no_po_reg: element.pod_nbr,
                //             po_cost: element.pod_pur_cost,
                //             no_invoice: element.CInvoice
                //         }
                //     );              
            }
        }

        // console.log(getEkspVend[0].sup_code);
        let sqlTotal = `
            select
                domain,
                convert(varchar(10), tgl, 105) tgl, 
                nopol,
                no_po_reg no_po,
                po_cost,
                no_invoice,
				ROW_NUMBER() over (order by convert(varchar(10), tgl, 105), nopol) no
            from 
                terima_sj a
                inner join `+linkedServer+`.user_customer b 
                on  a.kodeagen_dfr = b.bill and 
                    a.kodesub_mu_dfr = b.sub_bill and 
                    a.kodesold_dfr = b.sold and 
                    b.ship like '%' + a.kodeship_dfr + '%' and 
                    b.digital_sj = 1
            where 1=1 
                and a.kode_ekspedisi = '`+sup_code+`'
                and a.domain = '`+domain+`'
                and a.tgl_konfirm is not null
                `+where+`
            group by
                domain,
                convert(varchar(10), tgl, 105), 
                nopol,
                no_po_reg,
                po_cost,
                no_invoice
        `
        const getTotalSJ = await Database.connection("mssql_sj_paperless")
            .rawQuery(sqlTotal, [])


        let sql = `
        select * from (
            select
                domain,
                convert(varchar(10), tgl, 105) tgl, 
                nopol,
                no_po_reg no_po,
                po_cost,
                no_invoice,
				ROW_NUMBER() over (order by convert(varchar(10), tgl, 105), nopol) no
            from 
                terima_sj a
                inner join `+linkedServer+`.user_customer b 
                on  a.kodeagen_dfr = b.bill and 
                    a.kodesub_mu_dfr = b.sub_bill and 
                    a.kodesold_dfr = b.sold and 
                    b.ship like '%' + a.kodeship_dfr + '%' and 
                    b.digital_sj = 1
            where 1=1 
                and a.kode_ekspedisi = '`+sup_code+`'
                and a.domain = '`+domain+`'
                and a.tgl_konfirm is not null
                `+where+`
            group by
                domain,
                convert(varchar(10), tgl, 105), 
                nopol,
                no_po_reg,
                po_cost,
                no_invoice
        ) t
        --where t.no > `+(page-1)*rowsPerPage+` and t.no <= `+lastRow+`
        order by
            t.no_invoice
        ` //" . $linked_dbcnet . "user_customer b
        // console.log(sql)
        const getSJ = await Database.connection("mssql_sj_paperless")
            .rawQuery(sql, [])
        // console.log(getSJ);
        return  {
            data: { 
                data: getSJ, 
                meta: {
                    // total: getSJ.length
                    current_page: 1,
                    first_page: 1,
                    // first_page_url: "/?page=1",
                    last_page: 2,
                    // last_page_url: "/?page=2",
                    // next_page_url: "/?page=2",
                    per_page: rowsPerPage,
                    // previous_page_url: null,
                    total: getTotalSJ.length
                }
            }
        }
    }

    public async getListDetailSuratJalan({request, response}) {
        // console.log(request.input('param'));
        let params = atob(request.input('param')).split('|')
        console.log(params);
        // let domain = request.input('domain') == undefined ? '' : request.input('domain')
        // let nopol = request.input('nopol') == undefined ? '' : request.input('nopol')
        // let tgl = request.input('tgl') == undefined ? '' : request.input('tgl')

        let domain = params[0] == undefined ? '' : params[0]
        let nopol = params[1] == undefined ? '' : params[1]
        let tgl = params[2] == undefined ? '' : params[2]

        let sql = `
            select
                b.no_sj,
                b.nama_barang,
                b.qty,
                b.satuan,
                b.tonase,
                c.jenis_komplain,
                c.path_foto,
                ROW_NUMBER() over (order by b.no_sj, b.nama_barang) no
            from
                terima_sj a 
                left join sj_detail b on a.domain = b.domain and a.no_sj = b.no_sj
                left join sj_detail_komplain c on b.domain = c.domain and b.no_sj = c.no_sj and b.kode_barang = c.kode_barang 
                inner join  `+linkedServer+`.user_customer d
                on  a.kodeagen_dfr = d.bill and 
                    a.kodesub_mu_dfr = d.sub_bill and 
                    a.kodesold_dfr = d.sold and 
                    d.ship like '%' + a.kodeship_dfr + '%' and 
                    d.digital_sj = 1
            where
                a.domain = '`+domain+`' and
                a.nopol = '`+nopol+`' and
                a.tgl_konfirm is not null and
                convert(varchar(10), a.tgl, 120) = '`+tgl+`'
        ` //" . $linked_dbcnet . "user_customer d
        // console.log(sql)
        const getDetailSJ = await Database.connection("mssql_sj_paperless")
            .rawQuery(sql, [])

        return getDetailSJ
    }

    public async printSJ({request, response}) {
        // console.log(request.requestData.code);
        let p = atob(request.requestData.code).split('|')
        console.log(p);
        let params = JSON.parse(p[0])
        // console.log(params);

        // params.forEach(async element =>  {
        //     console.log(element);
        //     let domain = element.domain;
        //     let nopol = element.nopol;
        //     let tgl = element.tgl;
        //     // let t = (element.tgl).split('-');
        //     // let tgl = t[2]+''+t[1]+''+t[0]
            
        //     let sql = `
        //         select
        //             distinct a.no_sj
        //         from 
        //             terima_sj a
        //         inner join [DCL-DBSVR-01\\DBDFR].dbcnet2021.dbo.user_customer b
        //             on  a.kodeagen_dfr = b.bill and 
        //                 a.kodesub_mu_dfr = b.sub_bill and 
        //                 a.kodesold_dfr = b.sold and 
        //                 b.ship like '%' + a.kodeship_dfr + '%' and 
        //                 b.digital_sj = 1
        //         where
        //             a.domain = '`+domain+`' and
        //             a.nopol = '`+nopol+`' and
        //             a.tgl_konfirm is not null and
        //             convert(varchar(10), a.tgl, 105) = '`+tgl+`'
        //     `
        //     const terima_sj_by_nopol = await Database.connection("mssql_sj_paperless").rawQuery(sql, [])
        //     // terima_sj_by_nopol.forEach(async element2 =>  {
        //     //     let sql2 = `
        //     //         select * from terima_sj 
        //     //         where domain = '`+domain+`' and no_sj = '`+element2.no_sj+`'
        //     //     `
        //     //     const terima_sj = await Database.connection("mssql_sj_paperless").rawQuery(sql2, [])
        //     //     console.log(terima_sj_by_nopol);
        //     //     console.log(terima_sj);

        //     //     let qrString = element2.no_sj + '/' + domain
        //     // })
        //     let sql2 = `
        //         select * from terima_sj 
        //         where domain = '`+domain+`' and no_sj in (
        //             select
        //                 distinct a.no_sj
        //             from 
        //                 terima_sj a
        //             inner join [DCL-DBSVR-01\\DBDFR].dbcnet2021.dbo.user_customer b
        //                 on  a.kodeagen_dfr = b.bill and 
        //                     a.kodesub_mu_dfr = b.sub_bill and 
        //                     a.kodesold_dfr = b.sold and 
        //                     b.ship like '%' + a.kodeship_dfr + '%' and 
        //                     b.digital_sj = 1
        //             where
        //                 a.domain = '`+domain+`' and
        //                 a.nopol = '`+nopol+`' and
        //                 a.tgl_konfirm is not null and
        //                 convert(varchar(10), a.tgl, 105) = '`+tgl+`'
        //         )
        //     `
        //     const terima_sj = await Database.connection("mssql_sj_paperless").rawQuery(sql2, [])
        //     // console.log(terima_sj_by_nopol);
        //     // console.log(terima_sj);
        //     let filename = './sj.pdf'
        //     let parameter = {
        //         'filename': filename,
        //         'listSJ': terima_sj_by_nopol,
        //         'dataSJ': terima_sj
        //     }
        //     // const apiCall = () => {
        //         // return new Promise((resolve, reject) => {
        //         return await new Promise((resolve, reject) => {
        //             model.createPDF(parameter, async function (err, res) {
        //                 console.log(res.filename);                    
        //                 resolve(res);
        //             })
        //         }).then((body) => {
        //             // do your things here
        //             console.log(body);
        //             // response.send('e')
        //             let datas = fs.readFileSync(filename);
        //             response.type('application/pdf')
        //             response.header('content-type', 'application/pdf')
        //             response.header('content-length', Buffer.byteLength(datas))
        //             // console.log('This is a buffer:', Buffer.byteLength(buffer));
        //             // console.log(datas);
        //             response.send(datas)
        //         })
        //         .catch((err) => console.log(err));            
        //     // }
        //     // console.log(datas);
        // });
        let arrListSJ = new Array()
        let arrDataSJ = new Array()
        let arrDetailSJ = new Array()
        let arrQRS = new Array()
        let arrTtdSJ = new Array()
        let arrDataRekap = new Array()
        await Promise.all(params.map(async (element) => {
            try {
                let domain = element.domain;
                let nopol = element.nopol;
                let tgl = element.tgl;
                // let t = (element.tgl).split('-');
                // let tgl = t[2]+''+t[1]+''+t[0]
                
                let sql = `
                    select
                        distinct a.no_sj
                    from 
                        terima_sj a
                    inner join `+linkedServer+`.user_customer b
                        on  a.kodeagen_dfr = b.bill and 
                            a.kodesub_mu_dfr = b.sub_bill and 
                            a.kodesold_dfr = b.sold and 
                            b.ship like '%' + a.kodeship_dfr + '%' and 
                            b.digital_sj = 1
                    where
                        a.domain = '`+domain+`' and
                        a.nopol = '`+nopol+`' and
                        a.tgl_konfirm is not null and
                        convert(varchar(10), a.tgl, 105) = '`+tgl+`'
                `
                // console.log(sql);
                
                const terima_sj_by_nopol = await Database.connection("mssql_sj_paperless").rawQuery(sql, [])
                arrListSJ.push(terima_sj_by_nopol)

                let qrs = new Array()
                let arrSJ = new Array()
                // await terima_sj_by_nopol.forEach( async element2 =>  {
                //     // let sql2 = `
                //     //     select * from terima_sj 
                //     //     where domain = '`+domain+`' and no_sj = '`+element2.no_sj+`'
                //     // `
                //     // const terima_sj = await Database.connection("mssql_sj_paperless").rawQuery(sql2, [])
                //     // console.log(terima_sj_by_nopol);
                //     // console.log(terima_sj);

                //     let qrString = element2.no_sj + '/' + domain
                //     const qrImage = await qr.toDataURL(qrString);
                //     qrs.push({
                //         'no_sj': element2.no_sj,
                //         'domain': domain,
                //         'qrcode': qrImage
                //     })
                // })
                await Promise.all(terima_sj_by_nopol.map(async (element2) => {
                    try {
                        let qrString = element2.no_sj + '/' + domain
                        const qrImage = await qr.toDataURL(qrString);
                        qrs.push({
                            'no_sj': element2.no_sj,
                            'domain': domain,
                            'qrcode': qrImage
                        })

                        arrSJ.push(element2.no_sj)
                    } catch (error) {
                      console.log('error'+ error);
                    }
                }))

                arrQRS.push(qrs)
                // console.log(qrs);
                
                // const qrImage = await qr.toDataURL('Hi testing QR code');
                let sql2 = `
                    select *, convert(varchar(10), tgl, 120) tgl_conv, convert(varchar(8), tgl, 108) as jam_conv
                    from terima_sj 
                    where domain = '`+domain+`' and no_sj in (
                        select
                            distinct a.no_sj
                        from 
                            terima_sj a
                        inner join `+linkedServer+`.user_customer b
                            on  a.kodeagen_dfr = b.bill and 
                                a.kodesub_mu_dfr = b.sub_bill and 
                                a.kodesold_dfr = b.sold and 
                                b.ship like '%' + a.kodeship_dfr + '%' and 
                                b.digital_sj = 1
                        where
                            a.domain = '`+domain+`' and
                            a.nopol = '`+nopol+`' and
                            a.tgl_konfirm is not null and
                            convert(varchar(10), a.tgl, 105) = '`+tgl+`'
                    )
                `
                const terima_sj = await Database.connection("mssql_sj_paperless").rawQuery(sql2, [])

                arrDataSJ.push(terima_sj)

                let sql3 = `
                    select 
                        a.no_sj,
                        b.kode_barang,
                        b.nama_barang,
                        b.qty,
                        b.satuan,
                        b.tonase,
                        b.nama_satuan,
                        a.sopir,
                        a.nama_penerima,
                        a.tgl_konfirm
                    from 
                        terima_sj a
                        inner join `+linkedServer+`.user_customer c
                        on  a.kodeagen_dfr = c.bill and 
                            a.kodesub_mu_dfr = c.sub_bill and 
                            a.kodesold_dfr = c.sold and 
                            c.ship like '%' + a.kodeship_dfr + '%' and 
                            c.digital_sj = 1,
                        sj_detail b
                    where
                        a.no_sj = b.no_sj and
                        a.domain = b.domain and
                        a.tgl_konfirm is not null and
                        a.domain = '`+domain+`' and
                        a.no_sj in (
                            select
                                distinct a.no_sj
                            from 
                                terima_sj a
                            inner join `+linkedServer+`.user_customer b
                                on  a.kodeagen_dfr = b.bill and 
                                    a.kodesub_mu_dfr = b.sub_bill and 
                                    a.kodesold_dfr = b.sold and 
                                    b.ship like '%' + a.kodeship_dfr + '%' and 
                                    b.digital_sj = 1
                            where
                                a.domain = '`+domain+`' and
                                a.nopol = '`+nopol+`' and
                                a.tgl_konfirm is not null and
                                convert(varchar(10), a.tgl, 105) = '`+tgl+`'
                        )
                `
                const data_sj = await Database.connection("mssql_sj_paperless").rawQuery(sql3, [])
                arrDetailSJ.push(data_sj)

                let ttdSJ = new Array()
                await Promise.all(terima_sj.map(async (element3) => {
                    try {
                        // console.log(element3);                        
                        let sql4 = `
                            select *
                            from 
                                master_ttdsj
                            where
                                site = '`+element3.site+`' 
                                and tgl_start <= '`+element3.tgl_conv+`'
                                and shift_fr <= '`+element3.jam_conv+`'  
                                and shift_to >= '`+element3.jam_conv+`'
                            order by
                                tgl_start desc,
                                shift_fr desc
                        `
                        const data_ttdSJ = await Database.connection("mssql_qadweb").rawQuery(sql4, [])
                        ttdSJ.push({
                            'no_sj': element3.no_sj,
                            'ttdSJ': data_ttdSJ,
                        })
                    } catch (error) {
                      console.log('error'+ error);
                    }
                }))
                arrTtdSJ.push(ttdSJ)

                let sql5 = `
                    select
                        a.tgl_sj,
                        convert(varchar(10), a.tgl_sj, 120) tgl_sj_conv,
                        a.nopol,
                        a.no_po_reg no_po,
                        isnull(a.po_cost, 0) po_cost,
                        a.no_sj,
                        b.nama_barang,
                        b.qty,
                        b.satuan,
                        isnull(b.tonase, 0) tonase,
                        a.ket,
                        jenis_komplain,
                        path_foto
                    from 
                        terima_sj a
                        inner join `+linkedServer+`.user_customer d
                        on  a.kodeagen_dfr = d.bill and 
                            a.kodesub_mu_dfr = d.sub_bill and 
                            a.kodesold_dfr = d.sold and 
                            d.ship like '%' + a.kodeship_dfr + '%' and 
                            d.digital_sj = 1,
                        sj_detail b
                        left join sj_detail_komplain c
                        on b.domain = c.domain and b.no_sj = c.no_sj and b.kode_barang = c.kode_barang 
                    where
                        a.domain = b.domain and
                        a.no_sj = b.no_sj and
                        a.tgl_konfirm is not null and
                        a.domain = '`+domain+`' and
                        a.no_sj in ('`+arrSJ.join("','")+`')
                    order by
                        tgl_sj,
                        nopol
                `
                // console.log(sql5);
                
                const data_rekap = await Database.connection("mssql_sj_paperless").rawQuery(sql5, [])
                arrDataRekap.push(data_rekap)
                // console.log(data_rekap);
                // console.log(terima_sj_by_nopol);
                // console.log(terima_sj);
                // let filename = './sj.pdf'
                // let parameter = {
                //     'filename': filename,
                //     'listSJ': arrListSJ, //terima_sj_by_nopol,
                //     'dataSJ': arrDataSJ, //terima_sj,
                //     'qrcode': arrQRS, //qrs,
                //     'detailSJ': arrDetailSJ, //data_sj,
                //     'ttdSJ': arrTtdSJ, //ttdSJ,
                //     'dataRekap': arrDataRekap,//data_rekap
                // }
                // // const apiCall = () => {
                //     // return new Promise((resolve, reject) => {
                //     return await new Promise((resolve, reject) => {
                //         model.createPDF(parameter, async function (err, res) {
                //             console.log(res.filename);                    
                //             resolve(res);
                //         })
                //     }).then((body) => {
                //         // do your things here
                //         console.log(body);
                //         // response.send('e')
                //         let datas = fs.readFileSync(filename);
                //         response.type('application/pdf')
                //         response.header('content-type', 'application/pdf')
                //         response.header('content-length', Buffer.byteLength(datas))
                //         // console.log('This is a buffer:', Buffer.byteLength(buffer));
                //         // console.log(datas);
                //         response.send(datas)
                //     })
                //     .catch((err) => console.log(err));            
                // // }
                // // console.log(datas);
            } catch (error) {
              console.log('error'+ error);
            }
        }))
        // console.log(parameter);
        let filename = './resources/files/sj-'+p[1]+'.pdf'
        let parameter = {
            'filename': filename,
            'listSJ': arrListSJ, //terima_sj_by_nopol,
            'dataSJ': arrDataSJ, //terima_sj,
            'qrcode': arrQRS, //qrs,
            'detailSJ': arrDetailSJ, //data_sj,
            'ttdSJ': arrTtdSJ, //ttdSJ,
            'dataRekap': arrDataRekap,//data_rekap
        }
        // const apiCall = () => {
            // return new Promise((resolve, reject) => {
            return await new Promise((resolve, reject) => {
                model.createPDF(parameter, async function (err, res) {
                    console.log(res.filename);                    
                    resolve(res);
                })
            }).then((body) => {
                // do your things here
                console.log(body);
                // response.send('e')
                let datas = fs.readFileSync(filename);
                response.type('application/pdf')
                response.header('content-type', 'application/pdf')
                response.header('content-length', Buffer.byteLength(datas))
                // console.log('This is a buffer:', Buffer.byteLength(buffer));
                // console.log(datas);
                response.send(datas)
            })
            .catch((err) => console.log(err));            
        // }
        // console.log(datas);
        

        // let filename = './sj.pdf'
        // let parameter = {
        //     'filename': filename,
        //     'listSJ': '',
        //     'dataSJ': ''
        // }
        // // const apiCall = () => {
        // // return new Promise((resolve, reject) => {
        //     return await new Promise((resolve, reject) => {
        //         model.createPDF(parameter, async function (err, res) {
        //             console.log(res.filename);                    
        //             resolve(res);
        //         })
        //     }).then((body) => {
        //         // do your things here
        //         console.log(body);
        //         // response.send('e')
        //         let datas = fs.readFileSync(filename);
        //         response.type('application/pdf')
        //         response.header('content-type', 'application/pdf')
        //         response.header('content-length', Buffer.byteLength(datas))
        //         // console.log('This is a buffer:', Buffer.byteLength(buffer));
        //         // console.log(datas);
        //         response.send(datas)
        //     })
        //     .catch((err) => console.log(err));            
        // // }
        // let filename = './sj.pdf'
        // // response.implicitEnd = false
        // // model.createPDF(filename, async function (err, res) {
        // //     console.log(res);
        // //     // let datas = fs.readFileSync(filename);
        // //     // response.type('application/pdf')
        // //     // response.header('content-type', 'application/pdf')
        // //     // response.header('content-length', Buffer.byteLength(datas))
        // //     // console.log('This is a buffer:', Buffer.byteLength(buffer));
        // //     // console.log(datas);
        // //     // response.send(datas)
        // // })
        // // const apiCall = () => {
        //     // return new Promise((resolve, reject) => {
        //     return new Promise((resolve, reject) => {
        //         model.createPDF(filename, async function (err, res) {
        //             console.log(res.filename);                    
        //             resolve(res);
        //         })
        //     }).then((body) => {
        //         // do your things here
        //         console.log(body);
        //         // response.send('e')
        //         let datas = fs.readFileSync(filename);
        //         response.type('application/pdf')
        //         response.header('content-type', 'application/pdf')
        //         response.header('content-length', Buffer.byteLength(datas))
        //         // console.log('This is a buffer:', Buffer.byteLength(buffer));
        //         // console.log(datas);
        //         response.send(datas)
        //     })
        //     .catch((err) => console.log(err));            
        // // }
        // // console.log(datas);        
        
        // return response.send('')
        // console.log(resp);
        
        // response.send('datas')
        // response.send (res)
        // console.log('Print SJ');
        // await ejs.renderFile(path.join(__dirname, './../../../../resources/views/ejs/', "surat_jalan.ejs"), {students: []}, async (err, data) => {
        //     if (err) {
        //         response.send(err);
        //     } else {
            // let filename = 'sj.pdf'
            // let html = path.join(__dirname, './../../../../resources/views/ejs/', "surat_jalan.ejs")
            //     let options = {
            //         format: "A4",
            //         orientation: "portrait",
            //         border: "5mm",
            //         header: {
            //             height: "5mm",
            //             contents: '<div id="pageHeader" style="text-align: center;"></div>'
            //         },
            //         footer: {
            //             height: "20mm",
            //             contents: {
            //                 first: '', //Cover page
            //                 2: 'Second page', // Any page number is working. 1-based index
            //                 default: '<span style="color: #444; font-size: 12px;">{{page}}</span>/<span style="color: #444; font-size: 12px;">{{pages}}</span>', // fallback value
            //                 last: '' //Last Page
            //             }
            //         }
            //     };

            //     const bitmap = fs.readFileSync(__dirname+ "./../../../../resources/assets/logo.png"); 
            //     const logo = bitmap.toString('base64');

            //     let data = {
            //         logo: logo,
            //         // logo_appv: logo_appv,
            //         // // users: users,
            //         // header: dataHeader,
            //         // detail: dataDetail,
            //         // totalVol: totalVol,
            //         // totalPrice: formatNum({prefix: '', suffix: '', round: '0'})(totalPrice), 
            //         // totalHargaJualStd: formatNum({prefix: '', suffix: '', round: '0'})(totalHargaJualStd),
            //         // totalHargaJualReq: formatNum({prefix: '', suffix: '', round: '0'})(totalHargaJualReq),
            //         // totalSelisih: formatNum({prefix: '', suffix: '', round: '0'})(totalSelisih),
            //         // approval: dataApproval,
            //         // total_approval: total_approval
            //     }
            //     const ejsData = ejs.render(html, data);

            //     const pdf = await htmlPDF.create(ejsData, options).toFile(filename, function (err, res) {
            //         if (err) {
            //             response.send(err);
            //         } else {
            //             // console.log(res);
            //             // var datas = fs.readFileSync('./'+filename);
            //             // response.header('content-type', 'application/pdf')
            //             // response.header('content-length', Buffer.byteLength(datas))
            //             // response.send(datas)
            //             // response.send("File created successfully");
            //             // response.type('pdf');
            //             // stream.pipe(response);

            //             // let datas = fs.readFileSync('./report.pdf');
            //             // response.header('content-type', 'application/pdf')
            //             // response.header('content-length', Buffer.byteLength(datas))
            //             // // console.log('This is a buffer:', Buffer.byteLength(buffer));
            //             // // response.send(stream.pipe())
            //             // // stream.pipe(response)
            //             // // response.send(fs.createReadStream("./report.pdf"))
            //             // console.log(datas);
                        
            //             // response.send(datas);
            //             // response.send('cret')
            //             // this.showSJ(res)
            //             return res
            //         }
            //     });
                // console.log(pdf);
                // this.showSJ({'':'','':''})
                
                // await htmlPDF.create(data, options).toBuffer(function(err, buffer){
                //     // console.log('This is a buffer:', stream);
                //     // const readableStream = fs.createReadStream(stream.path);
                //     // console.log(readableStream);
                //     var data = fs.readFileSync('./report.pdf');
                //     response.header('content-type', 'application/pdf')
                //     response.header('content-length', Buffer.byteLength(data))
                //     // console.log('This is a buffer:', Buffer.byteLength(buffer));
                //     // response.send(stream.pipe())
                //     // stream.pipe(response)
                //     // response.send(fs.createReadStream("./report.pdf"))
                //     console.log(data);
                    
                //     response.send(data);
                //     // const r = fs.createReadStream("report.pdf").pipe(stream)
                // });
                // var datas = fs.readFileSync('./report.pdf');
                // response.header('content-type', 'application/pdf')
                // response.header('content-length', Buffer.byteLength(datas))
                // // console.log('This is a buffer:', Buffer.byteLength(buffer));
                // // response.send(stream.pipe())
                // // stream.pipe(response)
                // // response.send(fs.createReadStream("./report.pdf"))
                // console.log(datas);
                
                // response.send(datas);
            // }
        // })
    }

    // public showSJ({request, response}) {
    //     console.log('res');        
    // }
}
