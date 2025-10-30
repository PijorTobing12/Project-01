// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from "@ioc:Adonis/Lucid/Database";
// const urlDBC = "https://qssiptdldb03.odqad.com:8143/wsa/wsadbc/wsdl?targetURI=urn:services-qad-com:wsadbc:0001";
const urlDBC = "https://qssiptdldb07.odqad.com:8143/wsa/wsadbc/wsdl?targetURI=urn:services-qad-com:wsadbc:0001";
import { getWSA } from "App/Helpers/Wsa";
import { schema } from '@ioc:Adonis/Core/Validator'
import fetch from 'node-fetch';

export default class MappingRegionController {

    public async getMappingRegion({ request, response }) {

    

        // const querystring = require('querystring');
        // const { Curl } = require('node-libcurl');
        // const curl = new Curl();
        // /*
        // curl.setOpt('URL', 'www.google.com');
        // curl.setOpt('FOLLOWLOCATION', true);
        // curl.on('end', function (statusCode, data, headers) {
        //     console.info(statusCode);
        //     console.info('---');
        //     console.info(data.length);
        //     console.info('---');
        //     console.info(this.getInfo( 'TOTAL_TIME'));        
        //     this.close();
        // });
        
        // curl.on('error', curl.close.bind(curl));        
        // curl.perform();  
        // return curl;
        // */
        
        
        // let xml = `<?xml version="1.0" encoding="UTF-8"?>
        // <soapenv:Envelope xmlns="urn:schemas-qad-com:xml-services"
        // xmlns:qcom="urn:schemas-qad-com:xml-services:common"
        // xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wsa="http://www.w3.org/2005/08/addressing">
        // <soapenv:Header>
        //     <wsa:Action/>
        //     <wsa:To>urn:services-qad-com:WNRLIVE</wsa:To>
        //     <wsa:MessageID>urn:services-qad-com::WNRLIVE</wsa:MessageID>
        //     <wsa:ReferenceParameters>
        //     <qcom:suppressResponseDetail>true</qcom:suppressResponseDetail>
        //     </wsa:ReferenceParameters>
        //     <wsa:ReplyTo>
        //     <wsa:Address>urn:services-qad-com:</wsa:Address>
        //     </wsa:ReplyTo>
        // </soapenv:Header>
        // <soapenv:Body>
        //     <xxinp_akhrgmstr>
        //     <qcom:dsSessionContext>
        //         <qcom:ttContext>
        //         <qcom:propertyQualifier>QAD</qcom:propertyQualifier>
        //         <qcom:propertyName>domain</qcom:propertyName>
        //         <qcom:propertyValue>100</qcom:propertyValue>
        //         </qcom:ttContext>
        //         <qcom:ttContext>
        //         <qcom:propertyQualifier>QAD</qcom:propertyQualifier>
        //         <qcom:propertyName>scopeTransaction</qcom:propertyName>
        //         <qcom:propertyValue>false</qcom:propertyValue>
        //         </qcom:ttContext>
        //         <qcom:ttContext>
        //         <qcom:propertyQualifier>QAD</qcom:propertyQualifier>
        //         <qcom:propertyName>version</qcom:propertyName>
        //         <qcom:propertyValue>eB_1</qcom:propertyValue>
        //         </qcom:ttContext>
        //         <qcom:ttContext>
        //         <qcom:propertyQualifier>QAD</qcom:propertyQualifier>
        //         <qcom:propertyName>mnemonicsRaw</qcom:propertyName>
        //         <qcom:propertyValue>false</qcom:propertyValue>
        //         </qcom:ttContext>
        //         <qcom:ttContext>
        //         <qcom:propertyQualifier>QAD</qcom:propertyQualifier>
        //         <qcom:propertyName>username</qcom:propertyName>
        //         <qcom:propertyValue>apiqxi</qcom:propertyValue>
        //         </qcom:ttContext>
        //         <qcom:ttContext>
        //         <qcom:propertyQualifier>QAD</qcom:propertyQualifier>
        //         <qcom:propertyName>password</qcom:propertyName>
        //         <qcom:propertyValue>djdev@1234</qcom:propertyValue>
        //         </qcom:ttContext>	
        //         <qcom:ttContext>
        //         <qcom:propertyQualifier>QAD</qcom:propertyQualifier>
        //         <qcom:propertyName>action</qcom:propertyName>
        //         <qcom:propertyValue/>
        //         </qcom:ttContext>
        //         <qcom:ttContext>
        //         <qcom:propertyQualifier>QAD</qcom:propertyQualifier>
        //         <qcom:propertyName>entity</qcom:propertyName>
        //         <qcom:propertyValue/>
        //         </qcom:ttContext>
        //         <qcom:ttContext>
        //         <qcom:propertyQualifier>QAD</qcom:propertyQualifier>
        //         <qcom:propertyName>email</qcom:propertyName>
        //         <qcom:propertyValue/>
        //         </qcom:ttContext>
        //         <qcom:ttContext>
        //         <qcom:propertyQualifier>QAD</qcom:propertyQualifier>
        //         <qcom:propertyName>emailLevel</qcom:propertyName>
        //         <qcom:propertyValue/>
        //         </qcom:ttContext>
        //     </qcom:dsSessionContext>
        //     <dsInp_akhrgmstr>
        //         <inp_akhrgmstr>
        //         <operation>A</operation>
        //         <domain>100</domain>
        //         <harga>902</harga>
        //         <kodeexp>012234530432000</kodeexp>
        //         <rutecode>CB03911CDI</rutecode>
        //         <moddate>2022-10-03</moddate>
        //         <modtime>1664730000</modtime>
        //         <tglakhir>2022-10-02</tglakhir>
        //         <tglstart>2022-10-03</tglstart>
        //         <vuser>DO199778</vuser>
        //         <chr01></chr01>
        //         </inp_akhrgmstr>
        //     </dsInp_akhrgmstr>
        //     </xxinp_akhrgmstr>
        // </soapenv:Body>
        // </soapenv:Envelope>        
        //         `;
        // const close = curl.close.bind(curl);

        // curl.setOpt(Curl.option.HTTPHEADER,
        //     ['SOAPAction:""','Content-Type: text/xml;charset=UTF-8'])

        // curl.setOpt(Curl.option.URL, 'https://qssiptdldb03.odqad.com:8143/qxiqonddb/services/QdocWebService');
        // curl.setOpt(Curl.option.POST, true)
        // curl.setOpt(Curl.option.POSTFIELDS, xml);
        // // curl.setOpt(Curl.option.POSTFIELDS, querystring.stringify({
        // //     xml,
        // // }));

        // curl.on('end', function (statusCode, data, headers) {
        //     console.info(statusCode);
        //     console.info('---');
        //     console.info(data.length);
        //     console.info('---');
        //     console.info(this.getInfo( 'TOTAL_TIME'));            
        //     this.close();
        // });

        // // curl.on('end', close);
        // curl.on('error', close);
        // curl.perform();

        // return curl;
        // return request;
        
        // const fs = require('fs');        
        // let domain = 'WNR';
        // let xml = `<?xml version="1.0" encoding="UTF-8"?>
        // <soapenv:Envelope xmlns="urn:schemas-qad-com:xml-services"
        //   xmlns:qcom="urn:schemas-qad-com:xml-services:common"
        //   xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wsa="http://www.w3.org/2005/08/addressing">
        //   <soapenv:Header>
        //     <wsa:Action/>
        //     <wsa:To>urn:services-qad-com:WNRLIVE</wsa:To>
        //     <wsa:MessageID>urn:services-qad-com::WNRLIVE</wsa:MessageID>
        //     <wsa:ReferenceParameters>
        //       <qcom:suppressResponseDetail>true</qcom:suppressResponseDetail>
        //     </wsa:ReferenceParameters>
        //     <wsa:ReplyTo>
        //       <wsa:Address>urn:services-qad-com:</wsa:Address>
        //     </wsa:ReplyTo>
        //   </soapenv:Header>
        //   <soapenv:Body>
        //     <xxinp_akhrgmstr>
        //       <qcom:dsSessionContext>
        //         <qcom:ttContext>
        //           <qcom:propertyQualifier>QAD</qcom:propertyQualifier>
        //           <qcom:propertyName>domain</qcom:propertyName>
        //           <qcom:propertyValue>100</qcom:propertyValue>
        //         </qcom:ttContext>
        //         <qcom:ttContext>
        //           <qcom:propertyQualifier>QAD</qcom:propertyQualifier>
        //           <qcom:propertyName>scopeTransaction</qcom:propertyName>
        //           <qcom:propertyValue>false</qcom:propertyValue>
        //         </qcom:ttContext>
        //         <qcom:ttContext>
        //           <qcom:propertyQualifier>QAD</qcom:propertyQualifier>
        //           <qcom:propertyName>version</qcom:propertyName>
        //           <qcom:propertyValue>eB_1</qcom:propertyValue>
        //         </qcom:ttContext>
        //         <qcom:ttContext>
        //           <qcom:propertyQualifier>QAD</qcom:propertyQualifier>
        //           <qcom:propertyName>mnemonicsRaw</qcom:propertyName>
        //           <qcom:propertyValue>false</qcom:propertyValue>
        //         </qcom:ttContext>
        //         <qcom:ttContext>
        //           <qcom:propertyQualifier>QAD</qcom:propertyQualifier>
        //           <qcom:propertyName>username</qcom:propertyName>
        //           <qcom:propertyValue>apiqxi</qcom:propertyValue>
        //         </qcom:ttContext>
        //         <qcom:ttContext>
        //           <qcom:propertyQualifier>QAD</qcom:propertyQualifier>
        //           <qcom:propertyName>password</qcom:propertyName>
        //         <qcom:propertyValue>djdev@1234</qcom:propertyValue>
        //         </qcom:ttContext>	
        //         <qcom:ttContext>
        //           <qcom:propertyQualifier>QAD</qcom:propertyQualifier>
        //           <qcom:propertyName>action</qcom:propertyName>
        //           <qcom:propertyValue/>
        //         </qcom:ttContext>
        //         <qcom:ttContext>
        //           <qcom:propertyQualifier>QAD</qcom:propertyQualifier>
        //           <qcom:propertyName>entity</qcom:propertyName>
        //           <qcom:propertyValue/>
        //         </qcom:ttContext>
        //         <qcom:ttContext>
        //           <qcom:propertyQualifier>QAD</qcom:propertyQualifier>
        //           <qcom:propertyName>email</qcom:propertyName>
        //           <qcom:propertyValue/>
        //         </qcom:ttContext>
        //         <qcom:ttContext>
        //           <qcom:propertyQualifier>QAD</qcom:propertyQualifier>
        //           <qcom:propertyName>emailLevel</qcom:propertyName>
        //           <qcom:propertyValue/>
        //         </qcom:ttContext>
        //       </qcom:dsSessionContext>
        //       <dsInp_akhrgmstr>
        //         <inp_akhrgmstr>
        //           <operation>A</operation>
        //           <domain>100</domain>
        //           <harga>11</harga>
        //           <kodeexp>test2</kodeexp>
        //           <rutecode>test2</rutecode>
        //           <moddate>2003-01-31</moddate>
        //           <modtime>999</modtime>
        //           <tglakhir>2003-01-31</tglakhir>
        //           <tglstart>2003-01-31</tglstart>
        //           <vuser>test2</vuser>
        //           <chr01>test2</chr01>
        //         </inp_akhrgmstr>
        //       </dsInp_akhrgmstr>
        //     </xxinp_akhrgmstr>
        //   </soapenv:Body>
        // </soapenv:Envelope>        
        // `;
		
        // // fs.appendFile('tmp/newfile.txt', 'Learn Node FS module', function (err) {
        // fs.writeFile('tmp/newfile.txt', xml, function (err) {
        //     if (err) throw err;
        //     console.log('File is created successfully.');
        // });

        // // return;

        // const Client = require('ssh2-sftp-client');        
        // // return Client;
        // const config = {
        //     // host: 'https://167.3.117.116',
        //     // host: 'https://qssiptdldb03.odqad.com',

        //     host: '167.3.117.116',
        //     port: 22,
        //     username: 'tpuser',
        //     password: 'Cloud@12345',

        //     algorithms: {
        //         kex: [
        //           "diffie-hellman-group1-sha1",
        //           "ecdh-sha2-nistp256",
        //           "ecdh-sha2-nistp384",
        //           "ecdh-sha2-nistp521",
        //           "diffie-hellman-group-exchange-sha256",
        //           "diffie-hellman-group14-sha1"
        //         ],
        //         cipher: [
        //           "3des-cbc",
        //           "aes128-ctr",
        //           "aes192-ctr",
        //           "aes256-ctr",
        //           "aes128-gcm",
        //           "aes128-gcm@openssh.com",
        //           "aes256-gcm",
        //           "aes256-gcm@openssh.com"
        //         ],
        //         serverHostKey: [
        //           "ssh-rsa",
        //           "ecdsa-sha2-nistp256",
        //           "ecdsa-sha2-nistp384",
        //           "ecdsa-sha2-nistp521"
        //         ],
        //         hmac: [
        //           "hmac-sha2-256",
        //           "hmac-sha2-512",
        //           "hmac-sha1"
        //         ]
        //     }

        //     // host: '172.26.0.3',
        //     // port: 9001,
        //     // username: 'itsysdev',
        //     // password: '<DBCsysd3v>',
        //     // connectTimeout: 3600,

        //     // debug: console.log,            
        // }; 

        // let data = fs.createReadStream('tmp/test2.txt');
        // let remote = '/home/tpuser/test2.txt';
        // let newMode = 0o777;  // rw-r-r

        // const sftp = new Client();
        // sftp.connect(config)
        // .then(() => {            
        //     return sftp.put(data, remote);
        //     // return sftp.chmod(remote, newMode);            
        // })
        // .then(() => {            
        //     return sftp.chmod(remote, newMode);         
        // })
        // .then(p => {
        //     console.log(`Remote working directory is ${p}`);
        //     return sftp.end();
        // })
        // .catch(err => {            
        //     console.log(`Error: ${err.message}`); // error message will include 'example-client'
        //     return 'disini';
        // });

        // return 'test';

        // // let Client = require('ssh2-sftp-client');
        // // let sftp = new Client();
        
        // sftp.connect({
        //     host: '167.3.117.116',
        //     // port: '8443',
        //     username: 'tpuser',
        //     password: 'Cloud@12345'
        // })
        // .then(() => {
        //     return 'disini';
        //     return sftp.list('/pathname');
        // }).then(data => {
        //     return 'data';
        //     console.log(data, 'the data info');
        // }).catch(err => {
        //     return 'error';
        //     console.log(err, 'catch error');
        // });

        // return request;

        const getdomain = await Database
                        .from('user')
                        .where('empid',   request.input('empid'))        
                        .first();
        var qdomain = getdomain.domain;
        qdomain = '100';
        qdomain = request.input('domain');
                
        let datawsa2 = [];
        const args = { modul: "getkotaonly", domain:qdomain };
        const qwsa = await getWSA(urlDBC, "getDBCAkruteMstr", args);                
        if(qwsa.temp_xxakrute == null){
            datawsa2 = [];               
        }else{
            datawsa2 = qwsa.temp_xxakrute.temp_xxakruteRow;                              
        }                      
                
        let datawsa3 = [];
        const args2 = { parDomain: qdomain,  parFldName:"xxakrute_wilayah", parDBLogical:"qaddb" };
        const qwsa2 = await getWSA(urlDBC, "getDBCMstGenCode", args2);                        
        if(qwsa2.tt_codemstr == null){
            datawsa3 = [];               
        }else{
            datawsa3 = qwsa2.tt_codemstr.tt_codemstrRow;                     

            await Database
            .from('master_region')
            .where('bu_region',  qdomain)
            .delete()

            for(const loopdatawsa of datawsa3){
                await Database
                .insertQuery() // 👈 gives an instance of insert query builder
                .table('master_region')
                .insert(
                { 
                    kodemstr    :  loopdatawsa.kodemstr, 
                    descmstr    :  loopdatawsa.descmstr,
                    bu_region   :  qdomain,                  
                }
                )
            }
        }

        
        let regionname;
        const getsite = await Database
                        .from('site')
                        .where('domain', qdomain);        

        if(request.input('rowsPerPage') == null){
            
            // const qdata = await MappingRegion
            //             .query()
            //             .select('*')
            const qdata = await Database
                        .from('m_region') 
                        .join('site', 'site.code', '=', 'm_region.site_region')                                               
                        .join('domains', 'domains.code', '=', 'm_region.bu_region')                          
                        .select('m_region.*')             
                        .select('site.desc')   
                        .select('domains.name')
                        .where('bu_region',qdomain)                    
            // return response.status(200).json({
            //     message: "success",
            //     status: true,
            //     data: res,
            // });     
            // return datawsa;
            for(const loopqdata of qdata){
                const getregname = await Database
                        .from('master_region')
                        .where('bu_region',   request.input('domain'))
                        .where('kodemstr',   loopqdata.region)
                        .first(); 
                if(getregname){
                    loopqdata.push(getregname.descmstr)
                }
            }
            return {data1:qdata, data2:datawsa2, data3: datawsa3, data4:getsite}       
            return res;
        }else{                    
            const page = request.input('page')
            var req = request.input('filter')
            const qdata = await 
                        // MasterAplikasi
                        // .query()
                        Database
                        .from('m_region') 
                        .join('site', 'site.code', '=', 'm_region.site_region')                                               
                        .join('domains', 'domains.code', '=', 'm_region.bu_region')  
                        .where('bu_region',qdomain)
                        .where
                        (
                        (query) => 
                        {
                            if(request.input('filter') != null)
                            {
                                query.where('bu_region', 'like', `%${request.input('filter')}%`)
                                query.orWhere('site_region', 'like', `%${request.input('filter')}%`)
                                query.orWhere('kota_region', 'like', `%${request.input('filter')}%`)
                                query.orWhere('region', 'like', `%${request.input('filter')}%`)   
                                query.orWhere('status_region', 'like', `%${request.input('filter')}%`)   
                            }                    
                        }                           
                        )     
                        .select('m_region.*')             
                        .select('site.desc')   
                        .select('domains.name')
                        .orderBy('id_region','desc')    
                        .paginate(page, request.input('rowsPerPage'))                          

            return {data1:qdata, data2:datawsa2, data3: datawsa3, data4:getsite}     
            return res;
        }    
    }

    public async saveMappingRegion({ request, response }) { 
        // return request;
        const dayjs = require('dayjs')  
            
        var varaktif = '';
        if(request.input('aktif') == true){
            varaktif = 'Aktif';
        }else{
            varaktif = 'Non Aktif';
        }   
        
        let regionname;
        const getregname = await Database
                        .from('master_region')
                        .where('bu_region', request.input('domain'))
                        .where('kodemstr', request.input('region'))
                        .first(); 
        if(getregname){
            regionname = getregname.descmstr;
        }else{
            regionname = null;
        }

        const datauser = await Database
                        .from('user')
                        .where('empid',   request.input('DOUser'))        
                        .first(); 

        const res =   await Database
        .from('m_region')
        .where('kota_region',  request.input('kotatujuan'))        
        // .where('region',  request.input('region'))  
        .where('site_region',  request.input('site'))          
        .where('bu_region', request.input('domain'))  
        .first();  
        
        if(res == null){                    
            await Database
            .insertQuery() // 👈 gives an instance of insert query builder
            .table('m_region')
            .insert(
              { kota_region     :  request.input('kotatujuan'), 
                region          :  request.input('region'),
                status_region   :  varaktif,
                bu_region       :  request.input('domain'),
                site_region     :  request.input('site'),
                user_create     :  request.input('DOUser'),
                date_create     :  dayjs().format('YYYY-MM-DD HH:mm:ss'),
                region_name     :  regionname
              }
            )
            
            return response.status(200).json({
                message: "Data Berhasil Ditambahkan",
                status: true,
            });            
        }else{

            return response.status(406).json({
                message: "Kota Tujuan Sudah Ada",
                status: true,
            });  

            // return 'ada data';
            const update = await Database
            .from('m_region')
            .where('kota_region', request.input('kotatujuan'))   
            // .where('region',  request.input('region'))  
            .where('site_region',  request.input('site'))  
            .where('bu_region', request.input('domain'))            
            .update(
                {   
                    region          :  request.input('region'),
                    region_name     :  regionname,
                    status_region   :  varaktif,
                    site_region     :  request.input('site'),
                    bu_region       :  request.input('domain'),
                    user_update     :  request.input('DOUser'),
                    date_update     :  dayjs().format('YYYY-MM-DD HH:mm:ss'),
                }                
            )  
            
            return response.status(200).json({
                message: "Data Berhasil Diupdate",
                status: true,
            });
        }
        return 'Shendy Save';
    }

    public async saveEditMappingRegion({ request, response }) { 
        
        const dayjs = require('dayjs')  
        var varaktif = '';
        if(request.input('aktif') == true){
            varaktif = 'Aktif';
        }else{
            varaktif = 'Non Aktif';
        }   

        // return varaktif;
        let regionname;
        const getregname = await Database
                        .from('master_region')
                        .where('bu_region', request.input('domain'))
                        .where('kodemstr', request.input('region'))
                        .first(); 
        if(getregname){
            regionname = getregname.descmstr;
        }else{
            regionname = null;
        }

        const datauser = await Database
                        .from('user')
                        .where('empid',   request.input('DOUser'))        
                        .first(); 

        const res =   await Database
        .from('m_region')
        .where('kota_region',  request.input('kotatujuan'))                
        .where('region',  request.input('region'))
        .where('site_region',  request.input('site'))          
        .where('bu_region', request.input('domain'))  
        // .where('id_region',  request.input('id'))        
        .first();        
        if(res == null){                    
            await Database
            .insertQuery() // 👈 gives an instance of insert query builder
            .table('m_region')
            .insert(
              { kota_region     :  request.input('kotatujuan'), 
                region          :  request.input('region'),
                status_region   :  varaktif,
                bu_region       :  request.input('domain'),
                site_region     :  request.input('site'),
                user_create     :  request.input('DOUser'),
                date_create     :  dayjs().format('YYYY-MM-DD HH:mm:ss'),
                region_name     : regionname,
              }
            )
            return response.status(200).json({
                message: "success",
                status: true,
            });            
        }else{
            return response.status(406).json({
                message: "Kota Tujuan Sudah Ada",
                status: true,
            });  
            
            const update = await Database
            .from('m_region')
            .where('id_region', request.input('id'))            
            .update(
                {   
                    status_region   :  varaktif,
                    bu_region       :  request.input('domain'),
                    site_region     :  request.input('site'),
                    user_update     :  request.input('DOUser'),
                    date_update     :  dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    region          :  request.input('region'),
                    region_name     :  regionname,
                }                
            )  
            
            return response.status(200).json({
                message: "Data Berhasil Diupdate",
                status: true,
            });
        }        
    }

    public async deleteMappingRegion({ request, response }) { 
        // return request;
        const res =   await Database
        .from('m_region')
        .where('id_region',  request.input('id_region'))
        .first();        
        if(res == null){           
            return response.status(406).json({
                message: "Data Tidak Ditemukan",
                status: true,
            });            
        }else{
            await Database
            .from('m_region')
            .where('id_region',  request.input('id_region'))
            .delete()
            
            return response.status(200).json({
                message: "Data Berhasil Dihapus",
                status: true,
            });
        }

        return 'Shendy Delete';
    }
}


