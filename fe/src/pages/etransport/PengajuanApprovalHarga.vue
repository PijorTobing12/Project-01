<template>
  <div class="q-pa-md">
    <q-card>
      <q-card-section>
        <q-btn-group push>
          <q-btn push color="primary" label="Tambah Data" @click="addPengajuanApproveHarga" />
        </q-btn-group>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          title="Pengajuan Approval Harga Transporter"
          
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
              
              <q-btn-group v-if="props.row.status === 'Draf' || props.row.status === 'Reject'" push>
                 <q-btn
                  dense
                  color="positive"
                  class="text-weight-regular text-caption text-color=black"
                  @click="sendPengajuanApprovalHarga(props.row)"
                  push
                  label="Send"
                  icon="send"
                />
                 <q-btn
                  dense
                  color="negative"
                  class="text-weight-regular text-caption"
                  @click="deletePengajuanApprovalHarga(props.row)"
                  push
                  label="Hapus"
                  icon="delete"
                />
                 <q-btn
                  dense
                  color="info"
                  class="text-weight-regular text-caption"
                  @click="viewPengajuanApprovalHarga(props.row)"
                  push
                  label="View"
                  icon="visibility"
                />
                <q-btn
                  dense
                  color="accent"
                  class="text-weight-regular text-caption"
                  @click="regeneratePengajuanApprovalHarga(props.row)"
                  push
                  label="Regenerate"
                  icon="cached"
                />               
              </q-btn-group>
              <q-btn-group v-if="props.row.status === 'Send' || 
                                 props.row.status === 'Partial_Approve'  || 
                                 props.row.status === 'Full_Approve' ||
                                 props.row.status.includes('Regenerate')
                                 " push>
                 <q-btn
                  dense
                  color="grey"
                  class="text-weight-regular text-caption"
                  @click=""
                  push
                  label="Send"
                  icon="send"
                />
                 <q-btn
                  dense
                  color="grey"
                  class="text-weight-regular text-caption"
                  @click=""
                  push
                  label="Hapus"
                  icon="delete"
                />
                <q-btn
                  dense
                  color="info"
                  class="text-weight-regular text-caption"
                  @click="viewPengajuanApprovalHarga(props.row)"
                  push
                  label="View"
                  icon="visibility"
                />
                <q-btn
                  dense
                  color="grey"
                  class="text-weight-regular text-caption"
                  @click=""
                  push
                  label="Regenerate"
                  icon="cached"
                />               
              </q-btn-group>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <q-dialog v-model="dialogForm">
      <q-card>
        <q-card-section>
          <div class="text-h6">Form Pengajuan Approval Harga</div>
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 80vh" class="scroll"> 
        <Form
        :validation-schema="schema1"
        :loading="loadingadd"
        @submit="savePICApproval"
        class="q-mt-md"
        >             
          <div class="row q-col-gutter-sm">
            <div class="col-6">    
              <Field
                  v-model="tmpForm.region"
                  name="region"
                  v-slot="{ errorMessage, handleChange, value }"
              >           
                <q-select
                  @update:modelValue="handleChange"
                  dense
                  outlined                
                  use-input
                  emit-value
                  map-options
                  input-debounce="0"
                  option-value="kodemstr"
                  option-label="descmstr"
                  label="Pilih Region"
                  :options="listRegion"     
                  :error-message="errorMessage"
                  :error="!!errorMessage"    
                  :model-value="value"  
                  @blur="getKotaTujuan"      
                >
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
              <Field
                  v-model="tmpForm.kategori"
                  name="kategori"
                  v-slot="{ errorMessage, handleChange, value }"
              >           
                <q-select
                  @update:modelValue="handleChange"
                  dense
                  outlined                
                  use-input
                  emit-value
                  map-options
                  input-debounce="0"
                  option-value="desc"
                  option-label="desc"
                  label="Darat/Laut"
                  :options="listDaratLaut"     
                  :error-message="errorMessage"
                  :error="!!errorMessage"    
                  :model-value="value"       
                >
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

            <div class="col-12" hidden>
                <q-input v-model="tmpForm.DOUser" label="User" />
            </div>
          </div>

        </Form>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn flat label="Batal" color="primary" v-close-popup />          
          <q-btn flat label="Generate" color="primary" @click="generate" />
        </q-card-actions>      
        
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogFormGenerate"  persistent
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

          <table class="table-auto"  border="2" border-collapse: collapse>
            <thead>
              <tr>
                <th
                  class="tw-w-auto tw-px-6 tw-py-4 tw-text-xs tw-font-semibold tw-leading-4 tw-tracking-wider tw-text-left tw-text-gray-500 tw-uppercase tw-border-b tw-border-gray-200 tw-bg-gray-50">
                </th>
                <th class="tw-w-auto tw-px-6 tw-py-4 tw-text-xs tw-font-semibold tw-leading-4 tw-tracking-wider tw-text-center tw-text-gray-500 tw-uppercase tw-border-b tw-border-gray-200 tw-bg-gray-50"
                    colspan="7"  v-for="(data, i) in tmpDataKodeExp" :key="i">
                    {{ data.expedisi_name }}
                </th>  
              </tr>
              <!-- <tr>
                <th
                  class="tw-px-6 tw-py-4 tw-text-xs tw-font-semibold tw-leading-4 tw-tracking-wider tw-text-left tw-text-gray-500 tw-uppercase tw-border-b tw-border-gray-200 tw-bg-gray-50">
                </th>
                <th class="tw-px-6 tw-py-4 tw-text-xs tw-font-semibold tw-leading-4 tw-tracking-wider tw-text-center tw-text-gray-500 tw-uppercase tw-border-b tw-border-gray-200 tw-bg-gray-50"
                    colspan="7"  v-for="(data, i) in tmpDataKodeExp" :key="i">
                    {{ data.kodeexp }}{{ i }}
                </th>  
              </tr> -->
              <tr>
                <th v-for="(data, i) in titleReport" :key="i"
                  class="tw-w-auto tw-px-6 tw-py-4 tw-text-xs tw-font-semibold tw-leading-4 tw-tracking-wider tw-text-center tw-text-gray-500 tw-uppercase tw-border-b tw-border-gray-200 tw-bg-gray-50">
                  {{ data.no }}</th>
              </tr>
            </thead>

            <tbody class="tw-bg-white">
              <tr v-for="(data, i) in listData" :key="i">
                <td v-for="(data1, i1) in data" :key="i1"
                  class="tw-w-auto tw-px-6 tw-py-2 tw-whitespace-no-wrap tw-border-b tw-border-gray-200">
                  <div class="tw-text-sm tw-leading-5 tw-text-gray-500">{{ data1 }}</div>
                </td>
              </tr>
            </tbody>
          </table>

          
          <div class="col-12" hidden>
            <q-input type="text" autogrow dense outlined label="Region"
              v-model="tmpForm.region" />
          </div>
          <div class="col-12" hidden>
            <q-input type="text" autogrow dense outlined label="Kategori"
              v-model="tmpForm.kategori" />
          </div>
          <div class="col-12">
            <q-input type="textarea" autogrow dense outlined label="Keterangan"
              v-model="tmpForm.keterangan" />
          </div>

        </Form>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn flat label="Back" color="primary" v-close-popup />          
          <q-btn flat label="Simpan" color="primary" @click="save" />
        </q-card-actions>      
        
      </q-card>
    </q-dialog>   

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
                  class="tw-w-auto tw-px-6 tw-py-4 tw-text-xs tw-font-semibold tw-leading-4 tw-tracking-wider tw-text-left tw-text-gray-500 tw-uppercase tw-border-b tw-border-gray-200 tw-bg-gray-50">
                </th>
                <th class="tw-w-auto tw-px-6 tw-py-4 tw-text-xs tw-font-semibold tw-leading-4 tw-tracking-wider tw-text-center tw-text-gray-500 tw-uppercase tw-border-b tw-border-gray-200 tw-bg-gray-50"
                    colspan="7"  v-for="(data, i) in tmpDataKodeExp" :key="i">
                    {{ data.expedisi_name }}
                </th>  
              </tr>
              <tr>
                <th v-for="(data, i) in titleReport" :key="i"
                  class="tw-w-auto tw-px-6 tw-py-4 tw-text-xs tw-font-semibold tw-leading-4 tw-tracking-wider tw-text-left tw-text-gray-500 tw-uppercase tw-border-b tw-border-gray-200 tw-bg-gray-50">
                  {{ data.no }}</th>
              </tr>
            </thead>

            <tbody class="tw-bg-white">
              <tr v-for="(data, i) in listData" :key="i">
                <td v-for="(data1, i1) in data" :key="i1"
                  class="tw-w-auto tw-px-6 tw-py-2 tw-whitespace-no-wrap tw-border-b tw-border-gray-200">
                  <div class="tw-text-sm tw-leading-5 tw-text-gray-500">{{ data1 }}</div>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="col-12">
            <q-input type="textarea" autogrow dense outlined label="Keterangan" readonly
              v-model="tmpForm.keterangan" />
          </div>
          <!-- <div class="col-12">
            <q-input type="text" autogrow dense outlined label="Region"
              v-model="tmpForm.region" />
          </div>
          <div class="col-12">
            <q-input type="text" autogrow dense outlined label="Kategori"
              v-model="tmpForm.kategori" />
          </div>
          <div class="col-12">
            <q-input type="textarea" autogrow dense outlined label="Keterangan"
              v-model="tmpForm.keterangan" />
          </div> -->

        </Form>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn flat label="Back" color="primary" v-close-popup />          
          <!-- <q-btn flat label="Simpan" color="primary" @click="save" /> -->
        </q-card-actions>      
        
      </q-card>
    </q-dialog>  

    <q-dialog v-model="dialogFormReGenerate"  persistent
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
                  class="tw-w-auto tw-px-6 tw-py-4 tw-text-xs tw-font-semibold tw-leading-4 tw-tracking-wider tw-text-left tw-text-gray-500 tw-uppercase tw-border-b tw-border-gray-200 tw-bg-gray-50">
                </th>
                <th class="tw-w-auto tw-px-6 tw-py-4 tw-text-xs tw-font-semibold tw-leading-4 tw-tracking-wider tw-text-center tw-text-gray-500 tw-uppercase tw-border-b tw-border-gray-200 tw-bg-gray-50"
                    colspan="7"  v-for="(data, i) in tmpDataKodeExp" :key="i">
                    {{ data.expedisi_name }}
                </th>  
              </tr>
              <!-- <tr>
                <th
                  class="tw-px-6 tw-py-4 tw-text-xs tw-font-semibold tw-leading-4 tw-tracking-wider tw-text-left tw-text-gray-500 tw-uppercase tw-border-b tw-border-gray-200 tw-bg-gray-50">
                </th>
                <th class="tw-px-6 tw-py-4 tw-text-xs tw-font-semibold tw-leading-4 tw-tracking-wider tw-text-center tw-text-gray-500 tw-uppercase tw-border-b tw-border-gray-200 tw-bg-gray-50"
                    colspan="7"  v-for="(data, i) in tmpDataKodeExp" :key="i">
                    {{ data.kodeexp }}{{ i }}
                </th>  
              </tr> -->
              <tr>
                <th v-for="(data, i) in titleReport" :key="i"
                  class="tw-w-auto tw-px-6 tw-py-4 tw-text-xs tw-font-semibold tw-leading-4 tw-tracking-wider tw-text-left tw-text-gray-500 tw-uppercase tw-border-b tw-border-gray-200 tw-bg-gray-50">
                  {{ data.no }}</th>
              </tr>
            </thead>

            <tbody class="tw-bg-white">
              <tr v-for="(data, i) in listData" :key="i">
                <td v-for="(data1, i1) in data" :key="i1"
                  class="tw-w-auto tw-px-6 tw-py-2 tw-whitespace-no-wrap tw-border-b tw-border-gray-200">
                  <div class="tw-w-auto tw-text-sm tw-leading-5 tw-text-gray-500">{{ data1 }}</div>
                </td>
              </tr>
            </tbody>
          </table>

          
          <div class="col-12" hidden>
            <q-input type="text" autogrow dense outlined label="Region"
              v-model="tmpForm.region" />
          </div>
          <div class="col-12" hidden>
            <q-input type="text" autogrow dense outlined label="Kategori"
              v-model="tmpForm.kategori" />
          </div>
          <div class="col-12" hidden>
            <q-input type="text" autogrow dense outlined label="ID"
              v-model="tmpForm.idrekapheader" />
          </div>
          <div class="col-12">
            <q-input type="textarea" autogrow dense outlined label="Keterangan"
              v-model="tmpForm.keterangan" />
          </div>

        </Form>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn flat label="Back" color="primary" v-close-popup />          
          <q-btn flat label="Simpan" color="primary" @click="saveRegenerate" />
        </q-card-actions>      
        
      </q-card>
    </q-dialog> 

    
    
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
// import { api } from "src/boot/axios";
import axios from "axios";
import { ParseError, excelDownload, domain, role, empid, dateOnly,
  dateTime,
  formatDate,
  formatDateStandar,
  formatDateTime } from "/src/utils";
import { useQuasar } from "quasar";
import { Field, Form } from "vee-validate";
import * as yup from "yup";

const columns = [
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
    {
      name: "aksi",
      required: true,
      label: "Aksi",
      align: "left",
      field: "aksi",
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

const right = ref(false);

const loading = ref(false);
const loadingadd = ref(false);
const dialogForm = ref(false);
const dialogFormGenerate = ref(false);
const dialogFormReGenerate = ref(false);
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

const tmpForm = reactive({    
  bussinessunit : null,
  region        : null,
  kategori      : null,
  DOUser: empid(),  
  domain: domain(),
});

const getPengajuanApprovalHarga = async () => {
  try {
    loading.value = true;    
    // console.log(pagination.value);
    const res = await axios.get("getPengajuanApprovalHarga", {
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

const addPengajuanApproveHarga = async () => {
  dialogForm.value = true;
  reset();
};


const generate = async () => {
    try {
    $q.loading.show();
    const res = await axios.post("generatePengajuanApproval", tmpForm);
    res.data.data1.forEach((element,index) => {  
        // console.log(element);
        tmpData.value.push({
          id: element.id,
          flag: 3,
          kotatujuan: element.kota_detail,                    
        })
    });

    // res.data.kodeekspedisi.forEach((element2,index) => {   
    //     console.log(element2);     
    //     tmpDataKodeExp.value.push({
    //       kodeexp: element2.kode_expedisi,                    
    //     })
    // });

    tmpDataKodeExp.value = res.data.kodeekspedisi
    console.log(tmpDataKodeExp);
    listKotaTujuan.value = res.data.data1
    listData.value = res.data.detail
    titleReport.value = res.data.header


    dialogFormGenerate.value = true;
    // dialogForm.value = false;
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
};

const save = async () => {  
  try {
    $q.loading.show();
    const res = await axios.post("savePengajuanApprovalHarga", tmpForm);
    
    dialogFormGenerate.value = false;
    dialogForm.value = false;
    // dialogForm_EDIT.value = false;
    reset();    

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


const saveRegenerate = async () => {  
  try {
    $q.loading.show();
    const res = await axios.post("saveRegeneratePengajuanApprovalHarga", tmpForm);
    
    // dialogForm.value = false;
    // dialogForm_EDIT.value = false;
    // reset(); 
    dialogFormReGenerate.value = false;   

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

const deletePengajuanApprovalHarga = async (value) => {
  $q.dialog({
    title: "Konfirmasi",
    message: `Apakah Anda yakin ingin menghapus data ini?`,
    html: true,
    ok: {
      push: true,
    },
    cancel: {
      push: true,
      color: "negative",
    },
    persistent: true,
  }).onOk(async () => {
    try {
      $q.loading.show();
      await axios.post("deletePengajuanApprovalHarga", value);
      $q.notify({
        type: "positive",
        message: `Data berhasil dihapus`,
        html: true,
      });
      await getPengajuanApprovalHarga();
      $q.loading.hide();
    } catch (error) {
      $q.loading.hide();
      $q.notify({
        type: "negative",
        message: ParseError(error),
      });
    }
  });
};


const viewPengajuanApprovalHarga = async (value) => {
  try {  
    $q.loading.show();  
    const res = await axios.post("viewPengajuanApprovalHarga", value);

    // res.data.kodeekspedisi.forEach((element2,index) => {   
    //     console.log(element2);     
    //     tmpDataKodeExp.value.push({
    //       kodeexp: element2.kode_exp,                    
    //     })
    // });
    tmpForm.keterangan = res.data.keterangan
    tmpDataKodeExp.value = res.data.kodeekspedisi
    listData.value = res.data.detail
    titleReport.value = res.data.header

    dialogFormView.value = true;

    $q.notify({
      type: "positive",
      message: `View Data`,
      html: true,
    });
    $q.loading.hide();
    // await getPengajuanApprovalHarga();
  } catch (error) {
    $q.loading.hide();
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }  
};

const regeneratePengajuanApprovalHarga = async (value) => {
    try {
    $q.loading.show(); 
    loadingadd.value = true;
    // console.log(value);
    // return;
    const res = await axios.post("regeneratePengajuanApprovalHarga", value);
    res.data.data1.forEach((element,index) => {  
        // console.log(element);
        tmpData.value.push({
          id: element.id,
          flag: 3,
          kotatujuan: element.kota_detail,                    
        })
    });

    // res.data.kodeekspedisi.forEach((element2,index) => {   
    //     console.log(element2);     
    //     tmpDataKodeExp.value.push({
    //       kodeexp: element2.kode_expedisi,                    
    //     })
    // });

    tmpDataKodeExp.value = res.data.kodeekspedisi

    listKotaTujuan.value  = res.data.data1
    listData.value        = res.data.detail
    titleReport.value     = res.data.header
    tmpForm.region        = value.region_rekap;
    tmpForm.kategori      = value.kategori_rekap;
    tmpForm.idrekapheader = value.id_rekap_header;

    dialogFormReGenerate.value = true;
    // dialogForm.value = false;
    // reset();    

    $q.notify({
      type: "positive",
      // message: res.data.message,
      message: "Proses Regenerate Berhasil",
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
};

const editPengajuanHarga = async (value) => {  
  reset()  
  await getPengajuanApprovalHarga()
  tmpForm.id = value.id_pengajuan_header
  tmpForm.bussinessunit = value.bu_name
  tmpForm.tgl_berlaku   = value.tanggal_berlaku  
  tmpForm.region        = value.region_name
  tmpForm.kategori      = value.kategori_header
  tmpForm.buheader      = value.bu_header

  await getDetailPengajuan()
  dialogForm_EDIT.value = true
}


const sendPengajuanApprovalHarga = async (value) => {      
    try {
     $q.loading.show();
    // const res = await axios.post("sendPengajuanApprovalHarga", value);

    const res = await axios.post("sendPengajuanApprovalHarga", {
      // params: pagination.value,      
      data: {
        params: value,
        empid: empid(),
      },
    });   

    // dialogForm.value = false;
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
  pagination.value.domain = domain();
  getPengajuanApprovalHarga();
  // console.log(empid());
};

onMounted(() => {
  onRequest({
    pagination: pagination.value,
  });
});

document.addEventListener("etrasn_setdomain",() =>{     
  pagination.value.domain = domain();
  getPengajuanApprovalHarga();  
});
</script>