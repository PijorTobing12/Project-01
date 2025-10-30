import { BaseModel, column,hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import ejs from "ejs";
import htmlPDF from "html-pdf";
// import path from "path";
import fs from "fs";
import qr from "qrcode";

export default class SuratJalan extends BaseModel {
    
    static async createPDF (params, response) {
        // console.log(params.detailSJ);
        let filename = params.filename
        // let html = path.join(__dirname, './../../resources/views/ejs/', "surat_jalan.ejs")
        var html = fs.readFileSync(__dirname+"./../../resources/views/ejs/surat_jalan.ejs", "utf8")
        let options = {
            format: "A4",
            orientation: "portrait",
            border: "5mm",
            header: {
                height: "0mm",
                contents: '<div id="pageHeader" style="text-align: center;"></div>'
            },
            footer: {
                height: "5mm",
                contents: {
                    first: '', //Cover page
                    // 2: 'Second page', // Any page number is working. 1-based index
                    default: '<span style="color: #444; font-size: 12px;">{{page}}</span>/<span style="color: #444; font-size: 12px;">{{pages}}</span>', // fallback value
                    last: '', //Last Page
                    pages: '{{pages}}'
                }
            }
        };

        const bitmap = fs.readFileSync(__dirname+ "/../../resources/assets/logo.png"); 
        const logo = bitmap.toString('base64');

        const bitmap_ekspedisi = fs.readFileSync(__dirname+ "/../../resources/assets/ekspedisi-signed.png"); 
        const logo_ekspedisi = bitmap_ekspedisi.toString('base64');
        const bitmap_penerima = fs.readFileSync(__dirname+ "/../../resources/assets/penerima-signed.png"); 
        const logo_penerima = bitmap_penerima.toString('base64');

        const bmp_foot_left = fs.readFileSync(__dirname+ "/../../resources/assets/footer-left.png"); 
        const logo_left = bmp_foot_left.toString('base64');
        const bmp_foot_center = fs.readFileSync(__dirname+ "/../../resources/assets/footer-center.png"); 
        const logo_center = bmp_foot_center.toString('base64');
        const bmp_foot_right = fs.readFileSync(__dirname+ "/../../resources/assets/footer-right.png"); 
        const logo_right = bmp_foot_right.toString('base64');
        const bmp_footer = fs.readFileSync(__dirname+ "/../../resources/assets/footer.png"); 
        const logo_footer = bmp_footer.toString('base64');

        // // const optsQR = {
        // //     errorCorrectionLevel: 'H',
        // //     type: 'svg',
        // //     quality: 0.95,
        // //     width: 5,
        // //     height: 5,
        // //     // margin: 1,
        // //     color: {
        // //      dark: '#208698',
        // //      light: '#FFF',
        // //     },
        // // }
           
        // // const qrImage = await qr.toString('Hi testing QR code', optsQR)
        // const qrImage = await qr.toDataURL('Hi testing QR code');
        // // console.log(qrImage);
        // OLAH DATA //
        // console.log(params.listSJ);
        let listSJ = params.listSJ
        let dataSJ = params.dataSJ
        let detailSJ = params.detailSJ
        let colabsH = new Array()
        let colabsD = new Array()
        // listSJ.forEach(element1 => {
        //     element1.forEach(element11 => {
        //         // console.log(element11);
        //         colabs.push(element11)
        //     })            
        // });
        // for (let l1 = 0; l1 < listSJ.length; l1++) {
        //     const element1 = listSJ[l1];
        //     for (let l11 = 0; l11 < element1.length; l11++) {
        //         const element11 = element1[l11];
        //         // console.log(element11);
                for (let l2 = 0; l2 < dataSJ.length; l2++) {
                    const element2 = dataSJ[l2];
                    for (let l3 = 0; l3 < element2.length; l3++) {
                        const element3 = element2[l3];
                        for (let l4 = 0; l4 < detailSJ.length; l4++) {
                            const element4 = detailSJ[l4];
                            for (let l5 = 0; l5 < element4.length; l5++) {
                                const element5 = element4[l5];
                                if(element3.no_sj == element5.no_sj){
                                    // console.log(element3);                                    
                                    if(colabsH.indexOf(element3) == -1)
                                    {  
                                        // element found
                                        colabsH.push(element3)
                                    }
                                    colabsD.push(element5)
                                }
                            }
                        }
                        // if(element22.no_sj == element11.no_sj){
                        //     console.log(element22);
                        // }
                    }                    
                    // console.log(element2);
                }
        //         // colabs.push(element11)
        //     }
        // }
        // console.log(colabsH);
        let colabsQR = new Array()
        for (let l2 = 0; l2 < dataSJ.length; l2++) {
            const element2 = dataSJ[l2];
            for (let l3 = 0; l3 < element2.length; l3++) {
                const element3 = element2[l3];
                for (let l4 = 0; l4 < params.qrcode.length; l4++) {
                    const element4 = params.qrcode[l4];
                    for (let l5 = 0; l5 < element4.length; l5++) {
                        const element5 = element4[l5];
                        if(element3.no_sj == element5.no_sj){
                            // console.log(element5);
                            // if(colabsH.indexOf(element3) == -1)
                            // {  
                            //     colabsH.push(element3)
                            // }
                            colabsQR.push(element5)
                        }
                    }
                }
            }
        }

        let colabsTTD = new Array()
        for (let l2 = 0; l2 < dataSJ.length; l2++) {
            const element2 = dataSJ[l2];
            for (let l3 = 0; l3 < element2.length; l3++) {
                const element3 = element2[l3];
                for (let l4 = 0; l4 < params.ttdSJ.length; l4++) {
                    const element4 = params.ttdSJ[l4];
                    for (let l5 = 0; l5 < element4.length; l5++) {
                        const element5 = element4[l5];
                        if(element3.no_sj == element5.no_sj){
                            // console.log(element5);
                            // if(colabsH.indexOf(element3) == -1)
                            // {  
                            //     colabsH.push(element3)
                            // }
                            colabsTTD.push(element5)
                        }
                    }
                }
            }
        }
        // console.log(colabsTTD);
        
        

        let data = {
            logo: logo,
            logo_ekspedisi: logo_ekspedisi,
            logo_penerima: logo_penerima,
            logo_left: logo_left,
            logo_center: logo_center,
            logo_right: logo_right,
            logo_footer: logo_footer,
            // qrcode: qrImage,
            tes: 'ANC',
            listSJ: params.listSJ,
            dataSJ: colabsH, //params.dataSJ,
            qrcode: colabsQR, //params.qrcode,
            detailSJ: colabsD, //params.detailSJ,
            ttdSJ: colabsTTD, //params.ttdSJ,
            dataRekap: params.dataRekap
            // page: '{{ page }}',
            // pages: options.footer.contents.pages
            // logo_appv: logo_appv,
            // // users: users,
            // header: dataHeader,
            // detail: dataDetail,
            // totalVol: totalVol,
            // totalPrice: formatNum({prefix: '', suffix: '', round: '0'})(totalPrice), 
            // totalHargaJualStd: formatNum({prefix: '', suffix: '', round: '0'})(totalHargaJualStd),
            // totalHargaJualReq: formatNum({prefix: '', suffix: '', round: '0'})(totalHargaJualReq),
            // totalSelisih: formatNum({prefix: '', suffix: '', round: '0'})(totalSelisih),
            // approval: dataApproval,
            // total_approval: total_approval
        }
        // console.log(data);
        
        const ejsData = ejs.render(html, data);

        htmlPDF.create(ejsData, options).toFile(filename, function (err, res) {
            if (err) {
                // response.send(err);
                // console.log(err);
                response(null, err)
            } else {
                // console.log(res);
                // var datas = fs.readFileSync('./'+filename);
                // response.header('content-type', 'application/pdf')
                // response.header('content-length', Buffer.byteLength(datas))
                // response.send(datas)
                // response.send("File created successfully");
                // response.type('pdf');
                // stream.pipe(response);

                // let datas = fs.readFileSync('./report.pdf');
                // response.header('content-type', 'application/pdf')
                // response.header('content-length', Buffer.byteLength(datas))
                // // console.log('This is a buffer:', Buffer.byteLength(buffer));
                // // response.send(stream.pipe())
                // // stream.pipe(response)
                // // response.send(fs.createReadStream("./report.pdf"))
                // console.log(datas);
                
                // response.send(datas);
                // response.send('cret')
                // this.showSJ(res)
                // return res
                response(null, res)
                // return 'abc'
            }
        });
        // console.log(resp);        
        // return 'nbv'
    }
}