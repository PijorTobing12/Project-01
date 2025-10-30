<template>
    <div class="q-pa-md">
        <q-card>
            <q-separator />
  
                <q-card-section>
                    <div class="row q-col-gutter-md tw-mb-5">
                        <div class="col-12 col-md-12">
                            <div class="row q-col-gutter-md">
                                <div class="col-12 col-md-6">
                                    <q-input type="text" v-model="tempForm.ekspedisi" dense outlined label="Nama Ekspedisi" />
                                </div>
                                <div class="col-12 col-md-6">
                                    <q-select dense outlined v-model="tempForm.bu" clearable emit-value map-options input-debounce="0"
                                        option-value="bu_alias" option-label="bu_alias_desc" label="Pilih Perusahaan" :options="listBU">
                                        <!-- @filter="filterFn" -->
                                        <template v-slot:no-option>
                                            <q-item>
                                                <q-item-section class="text-grey">
                                                    No results
                                                </q-item-section>
                                            </q-item>
                                        </template>
                                    </q-select>
                                </div>
                                <div class="col-12 col-md-6">
                                    <q-input label="Tanggal Kirim Awal" outlined dense v-model="tempForm.fromDate">
                                        <template v-slot:append>
                                            <q-icon name="event" class="cursor-pointer">
                                                <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                                                    <q-date v-model="tempForm.fromDate" mask="YYYY-MM-DD" @update:model-value="changeFromDate">
                                                    </q-date>
                                                </q-popup-proxy>
                                            </q-icon>
                                        </template>
                                    </q-input>
                                </div>
                                <div class="col-12 col-md-6">
                                    <q-input label="Tanggal Kirim Akhir" outlined dense v-model="tempForm.toDate">
                                        <template v-slot:append>
                                            <q-icon name="event" class="cursor-pointer">
                                                <q-popup-proxy ref="qDateProxyTo" cover transition-show="scale" transition-hide="scale">
                                                    <q-date v-model="tempForm.toDate" mask="YYYY-MM-DD" @update:model-value="changeToDate">
                                                    </q-date>
                                                </q-popup-proxy>
                                            </q-icon>
                                        </template>
                                    </q-input>
                                </div>
                                <div class="col-12">
                                    <q-btn-group push>
                                        <!-- <q-btn push color="green" label="Tambah Tagihan" @click="addPengajuanHarga" /> -->
                                        <q-btn push color="green" label="Filter Data" @click="getListSuratJalan" icon="filter_alt"/>
                                        <q-btn push style="background-color: #1976d2; color:aliceblue" label="Unduh Data" @click="download_pdf" icon="file_download" />
                                    </q-btn-group>
                                </div>
                            </div>
                        </div>
                    </div>
                </q-card-section>
                <!-- TABLE -->
                <q-card-section>
                    <q-table 
                        title="List Surat Jalan" 
                        :columns="columns" 
                        :rows="listDataTable" 
                        row-key="no" 
                        v-model:pagination="pagination" 
                        :loading="loading" 
                        :filter="pagination.filter" 
                        @request="onRequest" 
                        selection="multiple" 
                        v-model:selected="selected" 
                        binary-state-sort>
                        <template v-slot:top-right>
                            <q-input borderless dense debounce="300" v-model="pagination.filter" placeholder="Search">
                                <template v-slot:append>
                                <q-icon name="search" />
                                </template>
                            </q-input>
                        </template>
                        <template v-slot:body-cell-aksi="props">
                            <q-td :props="props">
                                <q-btn-group push>
                                    <q-btn dense color="info" class="text-weight-regular text-caption"
                                    @click="detail(props.row)" push icon="add" />
                                    <!-- router.push(`/shipment/details/${props.row.domain}/${props.row.nopol}/${props.row.tgl}`) -->
                                    <!-- label="Detail" -->
                                </q-btn-group>
                
                                <!-- <q-btn-group v-if="props.row.trans_flag_desc === 'Revisi Finance'" push>
                                    <q-btn dense color="grey" class="text-weight-regular text-caption" @click="router.push(`/tagihanedit/${props.row.trans_code}`)" push label="Edit"
                                        icon="edit" />
                                </q-btn-group>
                
                                <q-btn-group v-if="props.row.trans_flag_desc === 'Tagihan Pending'" push>
                                    <q-btn dense color="grey" class="text-weight-regular text-caption" @click="router.push(`/tagihanedit/${props.row.trans_code}`)" push label="Edit"
                                        icon="edit" />
                                    <q-btn dense color="negative" class="text-weight-regular text-caption"
                                        @click="deleteTagihan(props.row)" push label="Hapus" icon="delete" />
                                </q-btn-group> -->
                            </q-td>
                        </template>
                        <template v-slot:body-cell-po_cost="props">
                            <q-td class="text-right" v-if="props.row.no_invoice == ''">
                                {{ (props.row.po_cost).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                            </q-td>
                            <q-td class="text-center" style="color:red" v-if="props.row.no_invoice != ''">
                                {{ (props.row.po_cost.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })) }}
                            </q-td>
                        </template>
                        <template v-slot:body-cell-no_po="props">
                            <q-td class="text-center" v-if="props.row.no_invoice == ''">
                                {{ props.row.no_po }}
                            </q-td>
                            <q-td class="text-center" style="color:red" v-if="props.row.no_invoice != ''">
                                {{ props.row.no_po }}
                            </q-td>
                        </template>
                        <template v-slot:body-cell-print="props">
                            <q-td :props="props">
                                <q-btn-group v-if="props.row.trans_flag_desc === 'Approve Finance'" push>
                                <q-btn dense color="warning" class="text-weight-regular text-caption"
                                    @click="redirect(props.row)" push label="Print" icon="print" />
                                </q-btn-group>
                            </q-td>
                        </template>
                    </q-table>
                </q-card-section>
        </q-card>
  
      <q-dialog v-model="dialogForm" persistent :maximized="maximizedToggle" transition-show="slide-up"
        transition-hide="slide-down">
        <q-card>
          <q-card-section>
            <div class="text-h6">Buat Tagihan Baru</div>
          </q-card-section>
          <q-separator />
          <q-card-section style="max-height: 80vh" class="scroll">
            <Form :validation-schema="schema1" @submit="savePICApproval" class="q-mt-md">
              <div class="row q-col-gutter-sm">
                <div class="col-6">
                  <Field v-model="tmpForm.bussinessunit" name="bussinessunit"
                    v-slot="{ errorMessage, value, field }">
                    <q-select dense outlined emit-value map-options
                      input-debounce="0" option-value="bu_alias" option-label="desc_text" label="Pilih Perusahaan"
                      :options="listBU" :error-message="errorMessage" :error="!!errorMessage" :model-value="value" v-bind="field" 
                      @update:model-value="getPO(tmpForm.bussinessunit)">
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            No results
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </Field>
                </div>
  
                <div class="col-6">
                  <!-- <Field v-model="tmpForm.po_number" name="po_number"
                    v-slot="{ errorMessage, value, field }">
                    <q-select dense outlined emit-value map-options
                      input-debounce="0" option-value="po_number" option-label="desc_text" label="Pilih PO"
                      :options="listPO2" :error-message="errorMessage" :error="!!errorMessage" :model-value="value" v-bind="field" 
                      @update:model-value="getPOMrr(tmpForm)">
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            No results
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </Field> -->
                  <q-select dense outlined v-model="tmpForm.po_number" clearable emit-value map-options input-debounce="0" use-input 
                    option-value="po_number" option-label="desc_text" label="Pilih PO" :options="listPO2"
                    @filter="filterFnPO" @update:model-value="getPOMrr(tmpForm)">
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No results
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
  
                <!-- <div class="col-12 tw-mt-3">
                    <q-table title="List PO" :columns="columnspo" :rows="listMrrPO2" row-key="no_mrr"
                    v-model:paginationpo="paginationpo2" :loading="loading" :filter="paginationpo2.filter" @request="onRequest"
                    :selected-rows-label="getSelectedString"
                    selection="multiple"
                    v-model:selected="selected"
                    binary-state-sort>
                    <template v-slot:top-right>
                        <q-input borderless dense debounce="300" v-model="paginationpo2.filter" placeholder="Search">
                        <template v-slot:append>
                            <q-icon name="search" />
                        </template>
                        </q-input>
                    </template>
                    <template v-slot:body-cell-action="props">
                        <q-td :props="props">
                        <q-btn-group push>
                            <q-btn dense color="info" class="text-weight-regular text-caption" 
                            @click="redirect2(props.row)" push label="Detail" icon="visibility" />
                        </q-btn-group>
                        </q-td>
                    </template>
                    </q-table>
                </div> -->
  
              </div>
  
             
  
            </Form>
          </q-card-section>
          <q-separator />
          <q-card-actions align="right">
            <q-btn  dense label="Batal" color="red" v-close-popup push  @click="reset" />
            <q-btn dense  label="Simpan" color="primary" push @click="saveTagihan" />
          </q-card-actions>
  
        </q-card>
      </q-dialog>
    </div>
  </template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import axios from "axios";
import { ParseError, domain, empid } from "./../../utils";
import { useQuasar } from "quasar";
import { Field, Form } from "vee-validate";
import * as yup from "yup";
import { IMaskDirective } from 'vue-imask';
import { VMoney } from 'v-money';
import { useRouter, useRoute } from "vue-router";
import * as dayjs from "dayjs";

const env = import.meta.env;

const money = {
  decimal: ',',
  thousands: '.',
  // prefix: 'Rp ',
  precision: 0,
  masked: false /* doesn't work with directive */
}
const columns = [
  {
    name: "no",
    required: true,
    label: "No",
    align: "center",
    field: "no",
    sortable: true,
  },
  {
    name: "aksi",
    required: true,
    label: "",
    align: "left",
    field: "aksi",
  },
  {
    name: "tgl",
    required: true,
    label: "Tgl. SJ",
    align: "left",
    field: "tgl",
    sortable: true,
  },
  {
    name: "no_invoice",
    required: true,
    label: "No. Invoice",
    align: "left",
    field: "no_invoice",
    sortable: true,
  },
  {
    name: "nopol",
    required: true,
    label: "Nopol",
    align: "left",
    field: "nopol",
    sortable: true,
  },
  {
    name: "po_cost",
    required: true,
    label: "Rupiah",
    align: "center",
    field: "po_cost",
    format: val => parseFloat(val).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), //style:"currency", currency:"IDR"
    sortable: true,
  },    
  {
    name: "no_po",
    required: true,
    label: "PO Number",
    align: "center",
    field: "no_po",
    // format: val => dayjs(`${val}`).format("YYYY-MM-DD"),
    sortable: true,
  },
  {
    name: "domain",
    required: true,
    label: "Domain",
    align: "center",
    field: "domain",
    sortable: true,
  },
//   {
//     name: "print",
//     required: true,
//     label: "Print",
//     align: "left",
//     field: "print",
//   },
];
// const columnspo = [
//   {
//     name: "po_number",
//     required: true,
//     label: "PO Number",
//     align: "left",
//     field: "po_number",
//     sortable: true,
//   },
//   {
//     name: "po_date",
//     required: true,
//     label: "Order Date",
//     align: "left",
//     field: "po_date",
//     sortable: true,
//   },
//   {
//     name: "ppn",
//     required: true,
//     label: "PPN",
//     align: "left",
//     field: "ppn",
//     sortable: true,
//   },
//   {
//     name: "po_amount",
//     required: true,
//     label: "PO Amount",
//     align: "right",
//     field: "po_amount",
//     format: val => parseFloat(val).toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
//     sortable: true,
//   },
//   {
//     name: "no_mrr",
//     required: true,
//     label: "No. MRR",
//     align: "left",
//     field: "no_mrr",
//     sortable: true,
//   },
//   {
//     name: "tgl_mrr",
//     required: true,
//     label: "Tgl. Mrr",
//     align: "left",
//     field: "tgl_mrr",
//     sortable: true,
//   },
//   {
//     name: "mrr_amount",
//     required: true,
//     label: "Ttl Mrr Amount",
//     align: "right",
//     field: "mrr_amount",
//     format: val => parseFloat(val).toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
//     sortable: true,
//   },
//   {
//     name: "no_sj",
//     required: true,
//     label: "No. SJ",
//     align: "left",
//     field: "no_sj",
//     sortable: true,
//   },
//   {
//     name: "action",
//     required: true,
//     label: "Action",
//     align: "left",
//     field: "action",
//   },
// ];

const $q = useQuasar();
const listBU = ref([]);
const getDateNowFrom = ref([])
const getDateNowTo = ref([])
const listDataTable = ref([])
const cekDataTable = ref([])

const listDataHeader = ref([]);
// const listDataDetail = ref([]);
// const listDataBU = ref([]);

const listPO2 = ref([]);
const listMrrPO2 = ref([]);
const tmpData = ref([]);
const router = useRouter();
const selected = ref([]);
const DataVendor = Array();
const search = ref(null)
// const deffix= ref('Non Fixed');
// const defjumarah = ref('1');
// const defjumtujuan = ref('1');
const right = ref(false);
const loading = ref(false);
const dialogForm = ref(false);
const maximizedToggle = ref(true);
const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10,
  filter: null,
  domain: domain(),
  bu: null,
//   trans_code: null,
  // created_date: dateOnly(),
//   po_no: null,
//   inv_no: null,
//   tt_no: null,
});
const paginationpo2 = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10,
  filter: null,
  domain: domain(),
  trans_flag: null,
});

const tempForm = reactive({
    ekspedisi: null,
    bu: null,
    fromDate: getDateNowFrom,
    toDate: getDateNowTo
});

const getComboBU = async () => {
  try {
    loading.value = true;
    const res = await axios.get("getBisnisUnit", {});
    listBU.value = res.data
    loading.value = false;
  } catch (error) {
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getListSuratJalan = async () => {
  try {
    if(tempForm.fromDate == ''){
        $q.notify({
            type: "negative",
            message: "Tanggal Kirim Awal harus diisi!",
        });
    }
    else if(tempForm.toDate == ''){
        $q.notify({
            type: "negative",
            message: "Tanggal Kirim Akhir harus diisi!",
        });
    }
    else{
        loading.value = true;
        pagination.value.ekspedisi = tempForm.ekspedisi;
        pagination.value.bu = tempForm.bu;
        pagination.value.fromDate = tempForm.fromDate;
        pagination.value.toDate = tempForm.toDate;
        const res = await axios.get("getListSuratJalan", {
        params: pagination.value,
        //   params: {
        //     params: pagination.value,
        //     empid: empid(),
        //   },
        });
        // Digunakan untuk search load per page //
        // cekDataTable.value = res.data.length
        // listDataTable.value = res.data.data.data
        // // pagination.value.rowsNumber = undefined
        // pagination.value.rowsNumber = res.data.data.meta.total

        // Digunakan untuk search load all page //
        cekDataTable.value = res.data.length
        listDataTable.value = res.data.data.data
        pagination.value.rowsNumber = undefined

        loading.value = false;
    }    
  } catch (error) {
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const download_pdf = async () => {
    try {
        // alert(listDataTable)
        console.log(selected.value.length);
        let ekspedisi = tempForm.ekspedisi;
        let bu = tempForm.bu;
        let fromDate = tempForm.fromDate;
        let toDate = tempForm.toDate;
        if(tempForm.fromDate == ''){
            $q.notify({
                type: "negative",
                message: "Tanggal Kirim Awal harus diisi!",
            });
        }
        else if(tempForm.toDate == ''){
            $q.notify({
                type: "negative",
                message: "Tanggal Kirim Akhir harus diisi!",
            });
        }
        else{
            if(selected.value.length > 0){
                // alert('Download PDF '+fromDate)
                let enc = btoa(JSON.stringify(selected.value)+'|'+empid())
                // let routeData = import.meta.env.VITE_API+'printSJ?code='+JSON.stringify(selected.value)
                let routeData = import.meta.env.VITE_API+'/printSJ?code='+enc
                window.open(routeData, '_blank', 'noreferrer')
                // let parameter = selected.value
                // console.log(parameter);
                // const res = await axios.post("confirmPrint", {
                //     params: parameter,
                // });
            }
            else{
                loading.value = false;
                $q.notify({
                    type: "negative",
                    message: "Pilih data yang akan diunduh!",
                });
            }            
        }
    } catch (error) {
        loading.value = false;
        $q.notify({
        type: "negative",
        message: ParseError(error),
        });
    }
    
}

const changeFromDate =  async () => {
    // console.log(tempForm.toDate);
    // this.$refs.qDateProxy.hide();
    // await this.$nextTick(function () {
        // console.log(this.$refs.qDateProxy)
        // this.$refs.qDateProxy.hide()
        // console.log(this.$refs);
        if(tempForm.toDate < tempForm.fromDate){
            tempForm.toDate = tempForm.fromDate
        }
    // })
}

const changeToDate = async () => {
    // console.log(tempForm.fromDate);
    if(tempForm.toDate < tempForm.fromDate){
        tempForm.fromDate = tempForm.toDate
    }
}

const getDateNow = () => {
    var date = new Date().toJSON().slice(0,10)//.replace(/-/g,'/');
    getDateNowFrom.value = date
    getDateNowTo.value = date
}

// const tmpForm = reactive({
//   id: null,
//   bulan: null,
//   tahun: null,
//   npwp: null,
//   domain: domain(),
// });
const GiveitDisable = ref(false);
const getSelectedString = () => {
        return selected.value.length === 0 ? '' : `${selected.value.length} record${selected.value.length > 1 ? 's' : ''} selected`
}
// const saveTagihan = async () => {
//   try {
//     $q.loading.show();
//     const res = await axios.post("tambahtagihansimpan", {
//           empid : tmpForm.DOUser,
//           po_table : selected.value,
//           domain : tmpForm.bussinessunit,
//           po_number : tmpForm.po_number
//     });
//     dialogForm.value = false;
//     getListTagihan();
//     listMrrPO2.value = []
//     if(res.data[0].msg === "Data Saved Successfully") {
//       $q.notify({
//         type: "positive",
//         message: "Data Tagihan Berhasil Disimpan",
//       });
//       router.push('/tagihanedit/'+res.data[0].val)
//     } else {
//       $q.notify({
//         type: "negative",
//         message: res.data,
//       });
//     }
    
//     $q.loading.hide();
//   } catch (error) {
//     $q.loading.hide();
//     $q.notify({
//       type: "negative",
//       message: ParseError(error),
//     });
//   }
// }
const detail = (params) => {
    let domain = params.domain
    let nopol = params.nopol
    let d = params.tgl.split('-')
    let tgl = new Date(d[2]+'-'+d[1]+'-'+d[0]).toJSON().slice(0,10)
    
    let enc = btoa(domain+'|'+nopol+'|'+tgl)

    // window.open(env.VITE_THISAPPS+'#/SJ/shipment/details/'+domain+'/'+nopol+'/'+tgl, '_blank', 'noreferrer')
    window.open(env.VITE_THISAPPS+'#/surat-jalan/list-surat-jalan/shipment/details/'+nopol+'/'+enc, '_blank', 'noreferrer')
}

// const redirect = (data) => {
//   let codeget = btoa(DataVendor[0].sup_name + 'L' + data.trans_due_date) + ':' + btoa(DataVendor[0].sup_code) + ':' + btoa(data.trans_tandaterima_src)
//   let code = codeget + '&val=' + btoa(DataVendor[0].sup_name) + '&val2=' + data.dtl_inv_finaltotal + '&val3=0'
//   let routeData = import.meta.env.VITE_FINSYS_LINK+'print_ttfa?code='+code  
//   window.open(routeData, '_blank', 'noreferrer')
// }
// const redirect2 = (data) => {
//   let routeData = import.meta.env.VITE_EPO_LINK+'#/podetail_pdf/'+data.domain+'/'+data.po_number
//   window.open(routeData, '_blank', 'noreferrer');
// };
// const filterFnPO = async (val, update, abort) => {
//   update(async () => {
//     search.value = val;
//     await getPOFilter();
//   });
// };
// const getPOFilter = async (data) => {
//   try {
//     loading.value = true;
//     // console.log(listTagihan.value.bu_domain)
//     const res = await axios.get("getPOFilter", {
//         params: {
//           site : 'multiple',
//           domain : tmpForm.bussinessunit,
//           empid :  tmpForm.DOUser,
//           search : search.value
//         },
//     });
//     listPO2.value = res.data.data
//     loading.value = false;
//   } catch (error) {
//     loading.value = false;
//     $q.notify({
//       type: "negative",
//       message: ParseError(error),
//     });
//   }
// }
// const getPO = async (data) => {
//   try {
//     loading.value = true;
//     const res = await axios.get("getPO", {
//         params: {
//           site : 'multiple',
//           domain : data,
//           empid : tmpForm.DOUser,
//         },
//     });
//     listPO2.value = res.data.data
//     loading.value = false;
//   } catch (error) {
//     loading.value = false;
//     listPO2.value = [];
//     listMrrPO2.value = [];
//     tmpForm.po_number = '';
//     $q.notify({
//       type: "negative",
//       message: "PO tidak tersedia pada perusahaan ini",
//     });
//   }
// };
// const getPOMrr = async (data) => {
//   try {
//     loading.value = true;
//     const res = await axios.get("getPOMrr", {
//         params: {
//           po_number: data.po_number,
//           empid : data.DOUser,
//           domain : data.bussinessunit
//         },
//     });
//     selected.value = [];
//     listMrrPO2.value = res.data.data;
//     loading.value = false;
//   } catch (error) {
//     loading.value = false;
//     listMrrPO2.value = null
//     $q.notify({
//       type: "negative",
//       message: ParseError(error),
//     });
//   }
// };
// const save = async () => {
//   if (tmpData.value.length == 0) {
//     alert('data detail belum di isi')
//     return;
//   }
//   tmpForm.detail = tmpData.value
//   try {
//     $q.loading.show();
//     const res = await axios.post("savePengajuanHarga", tmpForm);
//     dialogForm.value = false;
//     // reset();    
//     $q.notify({
//       type: "positive",
//       message: res.data.message,
//     });
//     await onRequest({
//       pagination: pagination.value,
//     });
//     $q.loading.hide();
//   } catch (error) {
//     $q.loading.hide();
//     $q.notify({
//       type: "negative",
//       message: ParseError(error),
//     });
//   }
// }
// const getListTagihan = async () => {
//   try {
//     loading.value = true;
//     const res = await axios.get("getBisnisUnit", {
//     //   params: pagination.value,
//       //   params: {
//       //     params: pagination.value,
//       //     empid: empid(),
//       //   },
//     });
//     // listBU.value = res
//     // listDataHeader.value = res.data.data2;
//     // listDataDetail.value = res.data.data3;
//     listDataBU.value = res
//     // DataVendor.push(res.data.data4[0]);
//     // pagination.value.rowsNumber = res.total;
//     loading.value = false;
//   } catch (error) {
//     loading.value = false;
//     $q.notify({
//       type: "negative",
//       message: ParseError(error),
//     });
//   }
// };
// const addPengajuanHarga = async () => {
//   dialogForm.value = true;
//   reset();
// };
// const deleteTagihan = async (value) => {
//   $q.dialog({
//     title: "Konfirmasi",
//     // message: `Apakah anda yakin ingin menghapus  <span class="tw-font-bold">${value.kota_region}</span>`,
//     message: `Apakah anda yakin ingin menghapus data tagihan ini?`,
//     html: true,
//     ok: {
//       push: true,
//     },
//     cancel: {
//       push: true,
//       color: "negative",
//     },
//     persistent: true,
//   }).onOk(async () => {
//     try {
//       await axios.post("deleteTagihan", value);
//       $q.notify({
//         type: "positive",
//         // message: `Menu <span class="tw-font-bold">${value.kota_region}</span> berhasil dihapus`,
//         message: `Data Tagihan Berhasil Dihapus`,
//         html: true,
//       });
//       await getListTagihan();
//     } catch (error) {
//       $q.notify({
//         type: "negative",
//         message: ParseError(error),
//       });
//     }
//   });
// };
const reset = () => {
  tmpForm.bussinessunit = null;
  tmpForm.DOUser = empid();
  GiveitDisable.value = false;
  tmpForm.po_number = null;
  listMrrPO2.value = []
};
const onRequest = (props) => {
  const { page, rowsPerPage, sortBy, descending, filter } = props.pagination;
  pagination.value.filter = filter;
  pagination.value.page = page;
  pagination.value.rowsPerPage = rowsPerPage;
  pagination.value.sortBy = sortBy;
  pagination.value.descending = descending;
  pagination.value.empid = empid();
//   getListSuratJalan()
//   getComboBU();
//   getDateNow();
//   getListTagihan();
  // console.log(empid());
};
onMounted(() => {
    getComboBU();
    getDateNow();
    onRequest({
        pagination: pagination.value,
    });
});
document.addEventListener("etrasn_setdomain", () => {
    pagination.value.domain = domain();
//   getListTagihan();
    getListSuratJalan()
});
</script>