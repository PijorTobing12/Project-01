<template>
  <div class="q-pa-md">
    <q-card>
      <q-card-section>
        <!-- <q-btn-group push>
          <q-btn push color="primary" label="Tambah Data" @click="addPengajuanApproveHarga" />
        </q-btn-group> -->
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          title="Data Pengajuan Approval"
          
          :columns="columns"
          :rows="listDataHeader"
          row-key="id"
          v-model:pagination="pagination"
          :loading="loading"
          :filter="pagination.filter"
          @request="onRequest"
          binary-state-sort
        >
          <template v-slot:top-right>
            <q-input
              borderless
              dense
              debounce="300"
              v-model="pagination.filter"
              placeholder="Search"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
          <template v-slot:body-cell-aksi="props">              
            <q-td :props="props">
              <!-- {{ props.row.status_rekap }} -->
              
              <q-btn-group push>
                  <q-btn
                  dense
                  color="info"
                  class="text-weight-regular text-caption"
                  @click="viewDataPengajuanApproval(props.row)"
                  push
                  label="View"
                  icon="visibility"                
                />             
              </q-btn-group>            
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>  

    <q-dialog v-model="dialogFormView"  persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down">
      <q-card>
        <q-card-section>
          <div class="text-h6">Rekap Pengajuan Harga</div>
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 80vh" class="scroll"> 
        <Form
        :validation-schema="schema1"        
        class="q-mt-md"
        >             
          <div class="row q-col-gutter-sm">            
            <div class="col-12" hidden>
                <q-input v-model="tmpForm.DOUser" label="User" />
            </div>            
          </div>

          <table class="tw-min-w-full" border="2" border-collapse: collapse>
            <thead>
              <tr>
                <th
                  class="tw-px-6 tw-py-4 tw-text-xs tw-font-semibold tw-leading-4 tw-tracking-wider tw-text-left tw-text-gray-500 tw-uppercase tw-border-b tw-border-gray-200 tw-bg-gray-50">
                </th>
                <th class="tw-px-6 tw-py-4 tw-text-xs tw-font-semibold tw-leading-4 tw-tracking-wider tw-text-center tw-text-gray-500 tw-uppercase tw-border-b tw-border-gray-200 tw-bg-gray-50"
                    colspan="7"  v-for="(data, i) in tmpDataKodeExp" :key="i">
                    {{ data.expedisi_name }}
                </th>  
                <th class="tw-px-6 tw-py-4 tw-text-xs tw-font-semibold tw-leading-4 tw-tracking-wider tw-text-center tw-text-gray-500 tw-uppercase tw-border-b tw-border-gray-200 tw-bg-gray-50"
                    rowspan="2">
                    Rekomendasi Vendor
                </th> 
              </tr>
              <tr>
                <th v-for="(data, i) in titleReport" :key="i"
                  class="tw-px-6 tw-py-4 tw-text-xs tw-font-semibold tw-leading-4 tw-tracking-wider tw-text-left tw-text-gray-500 tw-uppercase tw-border-b tw-border-gray-200 tw-bg-gray-50">
                  {{ data.no }}</th>
              </tr>
            </thead>

            <tbody class="tw-bg-white">
              <tr v-for="(data, i) in listData" :key="i">
                <td v-for="(data1, i1) in data" :key="i1"
                  class="tw-px-6 tw-py-2 tw-whitespace-no-wrap tw-border-b tw-border-gray-200">
                  <div class="tw-text-sm tw-leading-5 tw-text-gray-500">{{ data1 }}</div>
                </td>
              </tr>
              <tr>
                <td>Keterangan</td>
                <td colspan="3">{{ tmpForm.keterangan }}</td>
              </tr>
            </tbody>

            

            <tr border="2" border-collapse: collapse>
              <th align="center">Diajukan</th>
              <th align="center" colspan="2">Diperiksa</th>                
              <th align="center">Disetujui</th>
            </tr>

            <tr border="2" border-collapse: collapse style="height:200px">
                <td v-for="(dataaprvr, i) in listDataApprover" :key="i"><b><i>{{dataaprvr}}</i></b></td>
            </tr>
            <tr border="2" border-collapse: collapse>
                <td  v-for="(datakrywn, i) in listDataKrywn" :key="i">{{datakrywn}}</td>                 
            </tr>
            <tr border="2" border-collapse: collapse>
                <td v-for="(datajbt, i) in listDataJbt" :key="i">{{datajbt}}</td>                    
            </tr>
            <tr border="2" border-collapse: collapse>
                <td>PIC Approval Level 1</td>
                <td>PIC Approval Level 2</td>
                <td>PIC Approval Level 3</td>
                <td>PIC Approval Level 4</td>
            </tr>

          </table>

         
          <!-- <div class="col-12">
            <q-input type="text" autogrow dense outlined label="Region"
              v-model="tmpForm.region" />
          </div>
          <div class="col-12">
            <q-input type="text" autogrow dense outlined label="Kategori"
              v-model="tmpForm.kategori" />
          </div> -->
          <!-- <div class="col-12">
            <q-input type="textarea" autogrow dense outlined label="Keterangan" readonly
              v-model="tmpForm.keterangan" />
          </div>
          <div class="col-12">
            <q-input type="textarea" autogrow dense outlined label="ID Header" readonly
              v-model="tmpForm.idrekapheader" />
          </div> -->

          <!-- <table>
            <thead>
            <tr>
                <th align="center">Diajukan</th>
                <th align="center" colspan="2">Diperiksa</th>                
                <th align="center">Disetujui</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td v-for="(dataaprvr, i) in listDataApprover" :key="i"><b><i>{{dataaprvr}}</i></b></td>
            </tr>
            <tr>
                <td  v-for="(datakrywn, i) in listDataKrywn" :key="i">{{datakrywn}}</td>                 
            </tr>
            <tr>
                <td v-for="(datajbt, i) in listDataJbt" :key="i">{{datajbt}}</td>                    
            </tr>
            <tr>
                <td>PIC Approval Level 1</td>
                <td>PIC Approval Level 2</td>
                <td>PIC Approval Level 3</td>
                <td>PIC Approval Level 4</td>
            </tr>
            </tbody>
          </table> -->

        </Form>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn flat label="Back" color="primary" v-close-popup />       
          <q-btn flat label="Download (Excel)" color="primary" @click="downloadexcel" />
        </q-card-actions>      
        
      </q-card>
    </q-dialog>    

    <q-dialog v-model="dialogFormReject">
      <q-card>
        <q-card-section>
          <div class="text-h6">Form Reject</div>
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 50vh" class="scroll">
          <div class="row q-col-gutter-sm">
            <div class="col-12">
              <q-input
                type="textarea"
                v-model="tmpForm.ketreject"
                autogrow
                dense
                outlined
                label="Keterangan Reject"                                
              />
            </div>           
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn flat label="Batal" color="primary" v-close-popup />
          <q-btn flat label="Reject" color="primary" @click="saveReject" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
// import { api } from "src/boot/axios";
import axios from "axios";
import { ParseError, excelDownload, domain, role, empid } from "/src/utils";
import { useQuasar } from "quasar";
import { Field, Form } from "vee-validate";

import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
var XLSX = require("xlsx");

const columns = [
     {
      name: "aksi",
      required: true,
      label: "Aksi",
      align: "left",
      field: "aksi",
    },
    {
      name: "no_rekap_header",
      required: true,
      label: "No Pengajuan",
      align: "left",
      field: "no_rekap_header",
      sortable: true,
    },
    {
      name: "tgl_pengajuan",
      required: true,
      label: "Tanggal Pengajuan",
      align: "left",
      field: "tgl_pengajuan",
      sortable: true,
    },
    {
      name: "region_desc",
      required: true,
      label: "Region",
      align: "left",
      field: "region_desc",
      sortable: true,
    },
    {
      name: "status",
      required: true,
      label: "Status",
      align: "left",
      field: "status",
      sortable: true,
    },  
    {
      name: "kategori_rekap",
      required: true,
      label: "Kategori (Darat/Laut)",
      align: "left",
      field: "kategori_rekap",
      sortable: true,
    },   
   
];

const $q = useQuasar();
const listDataHeader = ref([]);
const listDataDetail = ref([]);
const listBU = ref([]);
const listDaratLaut = ref(["Darat","Laut"]);
const listFixNonFix = ref(["Fixed","Non Fixed"]);
const listRegion = ref([]);
const listLokasiMuat = ref([]);
const listUser = ref([]);
const listKotaTujuan = ref([]);
const listJenisKendaraan = ref([]);
const listData = ref([]);
const titleReport = ref([]);
const tmpData = ref([]);
const tmpDataKodeExp = ref([]);
const listDataApprover = ref([]);
const listDataKrywn = ref([]);
const listDataJbt = ref([]);

const right = ref(false);

const loading = ref(false);
const loadingadd = ref(false);
const dialogFormReject = ref(false);
const dialogFormView = ref(false);
const dialogForm_EDIT = ref(false);
const maximizedToggle = ref(true);
const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10,
  filter: null,
  domain: domain(),
});

const getDataPengajuanApproval = async () => {    
  try {
    loading.value = true;      
    const res = await axios.get("getDataPengajuanApproval", {
      params: pagination.value,      
    //   params: {
    //     params: pagination.value,
    //     empid: empid(),
    //   },
    });        
    listRegion.value = res.data.data1;   
    listDataHeader.value = res.data.data2;
    pagination.value.rowsNumber = res.data.total;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const reject = async () => {
  console.log(tmpForm);
  dialogFormReject.value = true;
  reset();
};

const tmpForm = reactive({    
  bussinessunit : null,
  region        : null,
  kategori      : null,
  ketreject     : null,    
  DOUser: empid(),  
});

const viewDataPengajuanApproval = async (value) => {
  try {    
    $q.loading.show();
    const res = await axios.post("viewDataPengajuanApproval", value);

    // res.data.kodeekspedisi.forEach((element2,index) => {   
    //     // console.log(element2);     
    //     tmpDataKodeExp.value.push({
    //       kodeexp: element2.kode_exp,                    
    //     })
    // });

    tmpForm.keterangan = res.data.keterangan
    tmpForm.idrekapheader = res.data.idheader
    tmpDataKodeExp.value = res.data.kodeekspedisi
    listData.value = res.data.detail
    titleReport.value = res.data.header
    listDataKrywn.value = res.data.datakrywn
    listDataJbt.value = res.data.datajbt
    listDataApprover.value = res.data.dataaprvr

    dialogFormView.value = true;

    $q.notify({
      type: "positive",
      message: `View Data`,
      html: true,
    });
    // await getPengajuanApprovalHarga();
    $q.loading.hide();
  } catch (error) {
    $q.loading.hide();
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }  
};

const downloadexcel = () => {
  const wb = XLSX.utils.table_to_book(document.getElementsByTagName("TABLE")[1])
  XLSX.writeFile(wb, "Rekap Pengajuan Harga.xlsx");
  console.log(wb);
//   writeFileXLSX(wb, "laporanRekap.xlsx");
}

const downloadexcel2 = async () => {  
  try {
    $q.loading.show();
    const res = await axios.post("downloadexcelDataPengajuanApproval", tmpForm);         
    const fname = 'TEST';
    const lname = 'Download PDF';

      res.data.detail.forEach((element2,index) => {   
        console.log(element2);           
      });

      let fLen = res.data.detail.length;
      console.log(fLen);


    // console.log(res.data.header);
    var documentDefinition = {
        pageOrientation: 'landscape', 
            
        content: [
            // `Hello ${fname} ${lname}`,
            // 'Nice to meet you!'
            	{text: 'Rekap Pengajuan Harga', 
                style: 'header'},              
              {
                style: 'tableExample',
                dontBreakRows: true,   
                table: {
                  body: [                    
                    res.data.header,
                    res.data.detail[0],                   
                    // ['Column 1', 'Column 2', 'Column 3'],
                    // ['One value goes here', 'Another one here', 'OK?']
                  ]
                }
              },
            
        ],
        pageBreak: 'before',   
    };

    // pdfMake.createPdf(docDefinition).download('file.pdf', function (){
    //             alert('your pdf is done');
    //         });
    pdfMake.createPdf(documentDefinition).open();
    // const pdfDoc = pdfMake.createPdf(documentDefinition);
    // pdfDoc.getBase64((data)=>{
    //     res.writeHead(200, 
    //     {
    //         'Content-Type': 'application/pdf',
    //         'Content-Disposition':'attachment;filename="filename.pdf"'
    //     });

    //     const download = Buffer.from(data.toString('utf-8'), 'base64');
    //     res.end(download);
    // });
    
    // dialogForm.value = false;
    // dialogForm_EDIT.value = false;
    // reset();    

    $q.notify({
      type: "positive",
      message: res.data.message,
    });

    await onRequest({
      pagination: pagination.value,
    });
    $q.loading.hide();
  } catch (error) {
    $q.loading.hide();
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  } 
}


const reset = () => {
  tmpForm.bussinessunit   = null;
  tmpForm.region          = null;
  tmpForm.kategori        = null;
  tmpForm.tgl_berlaku     = null;
  tmpForm.lokasimuat      = null;
  tmpForm.kotatujuan      = null;
  tmpForm.jeniskendaraan  = null;
  tmpForm.jumlaharah      = null;
  tmpForm.jumlahtujuan    = null;
  tmpForm.fixnonfix       = null;
  tmpForm.harga           = null;
  tmpForm.DOUser          = empid();

  tmpForm.id = null;  
  tmpForm.index = null;
  tmpData.value = [];
  tmpDataKodeExp.value = [];
};

const onRequest = (props) => {
  const { page, rowsPerPage, sortBy, descending, filter } = props.pagination;
  pagination.value.filter = filter;
  pagination.value.page = page;
  pagination.value.rowsPerPage = rowsPerPage;
  pagination.value.sortBy = sortBy;
  pagination.value.descending = descending;
  pagination.value.empid = empid();
  getDataPengajuanApproval();
  // console.log(empid());
};

onMounted(() => {
  onRequest({
    pagination: pagination.value,
  });
});

document.addEventListener("etrasn_setdomain",() =>{     
  pagination.value.domain = domain();
  getDataPengajuanApproval();  
});
</script>