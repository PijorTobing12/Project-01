<template>
  <div class="q-pa-md">
    <q-card>
      <q-card-section>
        <!-- <q-btn-group push>
          <q-btn push color="primary" label="Tambah Data" @click="addNegoHarga" />
        </q-btn-group> -->
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          title="Nego Harga Header"
          
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
              <!-- {{ props}} -->
            <q-td :props="props">
              <!-- {{ props }} -->
              <q-btn-group v-if="props.row.status === 'CLOSE'" push>
                 <q-btn
                  dense
                  color="grey"
                  class="text-weight-regular text-caption"
                  @click=""
                  push
                  label="View"
                  icon="visibility"
                />              
              </q-btn-group>
              <q-btn-group v-if="props.row.status === 'OPEN'" push>
                 <q-btn
                  dense
                  color="secondary"
                  class="text-weight-regular text-caption"
                  @click="viewNegoHarga(props.row)"
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

    <q-dialog v-model="dialogForm"  persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down">
      <q-card>
        <q-card-section>
          <div class="text-h6">Data Detail</div>
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

          <div class="col-12 tw-mt-3">
            <q-markup-table>
              <thead>
                <tr>
                  <th class="text-left">Aksi</th>
                  <th class="text-left">No</th>                  
                  <th class="text-left">Lokasi Muat</th>
                  <th class="text-right">Kota Tujuan</th>
                  <th class="text-right">Jenis Kendaraan</th>
                  <th class="text-right">Fixed/Non Fixed Truck</th>
                  <th class="text-right">Jumlah Arah</th>
                  <th class="text-right">Jumlah Tujuan</th>
                  <th class="text-right">Harga</th>                  
                </tr>
              </thead>
              <tbody>
                <tr v-for="(data, i) in tmpData" :key="i">
                  <template v-if="data.flag != 1">
                    <td class="text-left">
                      <q-btn-group>                        
                        <!-- <q-checkbox v-model="val[i]" @click="deleteTmp(data, i)"/> -->
                        <q-checkbox v-model="val[i]" @click="updStatusDetail(data, i)"/>                        
                        <q-btn square dense color="info" icon="handshake" @click="negoTmp(data, i)" label="Nego" />
                      </q-btn-group>
                    </td>
                    <td class="text-left">{{ i + 1 }}</td>
                    <td class="text-left">{{ data.lokasimuat }}</td>
                    <td class="text-left">{{ data.kotatujuan }}</td>
                    <td class="text-left">{{ data.jeniskendaraan }}</td>
                    <td class="text-left">{{ data.fixnonfix }}</td>
                    <td class="text-left">{{ data.jumlaharah }}</td>
                    <td class="text-left">{{ data.jumlahtujuan }}</td>
                    <td class="text-left">{{ data.harganego }}</td>                    
                  </template>

                </tr>
              </tbody>
            </q-markup-table>
          </div>

        </Form>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn flat label="Back" color="primary" v-close-popup />          
          <!-- <q-btn flat label="Simpan" color="primary" @click="save" /> -->
        </q-card-actions>      
        
      </q-card>
    </q-dialog>   

    <q-dialog v-model="dialogForm_EDIT">
      <q-card>
        <q-card-section>
          <div class="text-h6">Form Nego Harga</div>
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 80vh" class="scroll"> 
        <Form
        :validation-schema="schema1"
        
        class="q-mt-md"
        >             
          <div class="row q-col-gutter-sm">
            <div class="col-6">    
              <Field
                  v-model="tmpForm.lokasimuat"
                  name="lokasimuat"
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
                  option-label="kodemstr"
                  label="Lokasi Muat"
                  :options="listLokasiMuat"     
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

            <div class="col-6">    
              <Field
                  v-model="tmpForm.kotatujuan"
                  name="kotatujuan"
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
                  option-value="kota_region"
                  option-label="kota_region"
                  label="Kota Tujuan"
                  :options="listKotaTujuan"     
                  :error-message="errorMessage"
                  :error="!!errorMessage"    
                  :model-value="value"    
                  readonly   
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

            <div class="col-12">    
              <Field
                  v-model="tmpForm.jeniskendaraan"
                  name="jeniskendaraan"
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
                  option-label="kodemstr"
                  label="Jenis Kendaraan"
                  :options="listJenisKendaraan"     
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

            <div class="col-6">
              <q-input type="number" :readonly="tmpForm.lokasimuat == 'Ngoro' ? true : false" v-model="tmpForm.jumlaharah" dense outlined label="Jumlah Arah" />
            </div>

            <div class="col-6">
              <q-input type="number" :readonly="tmpForm.lokasimuat == 'Ngoro' ? true : false" v-model="tmpForm.jumlahtujuan" dense outlined label="Jumlah Tujuan" />
            </div>
           

            <div class="col-6">    
              <Field
                  v-model="tmpForm.fixnonfix"
                  name="fixnonfix"
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
                  label="Fixed/Non Fixed"
                  :options="listFixNonFix"     
                  :error-message="errorMessage"
                  :error="!!errorMessage"    
                  :model-value="value"   
                  :readonly="tmpForm.lokasimuat != 'Ngoro' ? true : false"    
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
              <!-- <q-input type="number" v-model="tmpForm.harga" dense outlined label="Harga" /> -->
              <!-- <q-input v-model="tmpForm.harga" input-class="text-right" mask="###,###,###,###"  dense outlined label="Harga"/> -->
              <q-input v-model="tmpForm.harga" v-money="money" dense outlined label="Harga (Rp)"/>
            </div>
            <!-- <div>
              <input v-model.lazy="price" v-money="money" />
            </div> -->
            

            <div class="col-12">
                <q-file outlined required dense bottom-slots v-model="tmpForm.buktinego" label="Upload Bukti Nego" counter>
                <template v-slot:prepend>
                    <q-icon name="cloud_upload" @click.stop />
                </template>
                <template v-slot:append>
                    <q-icon name="close" @click.stop="model = null" class="cursor-pointer" />
                </template>
                </q-file>
            </div>

            <div class="col-12" hidden>
                <q-input v-model="tmpForm.DOUser" label="User" />
            </div>  

            <div class="col-12" hidden>
                <q-input v-model="tmpForm.idpengajuandetail" label="idpengajuandetail" />
            </div>           
          </div>
        </Form>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn flat label="Batal" color="primary" v-close-popup />          
          <q-btn flat label="Simpan" color="primary" @click="save" />
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
import * as yup from "yup";

const money = {
        decimal: ',',
        thousands: '.',
        // prefix: 'Rp ',
        precision: 0,
        masked: false /* doesn't work with directive */
}
// export default {
//   data () {
//     return {      
//       money: {
//         decimal: ',',
//         thousands: '.',
//         prefix: 'Rp ',
//         precision: 0,
//         masked: false /* doesn't work with directive */
//       }
//     }
//   },
//   directives: {money: VMoney}
// }

const columns = [
     {
      name: "aksi",
      required: true,
      label: "Aksi",
      align: "left",
      field: "aksi",
    },
    {
      name: "expedisi_name",
      required: true,
      label: "Expedisi",
      align: "left",
      field: "expedisi_name",
      sortable: true,
    },
    {
      name: "bu_header",
      required: true,
      label: "Business Unit",
      align: "left",
      field: "bu_name",
      sortable: true,
    },
    {
      name: "tanggal_berlaku_pengajuan",
      required: true,
      label: "Tanggal Pengajuan",
      align: "left",
      field: "tanggal_berlaku_pengajuan",
      sortable: true,
    },
    {
      name: "tanggal_berlaku",
      required: true,
      label: "Tanggal Berlaku",
      align: "left",
      field: "tanggal_berlaku",
      sortable: true,
    },
    {
      name: "region_header",
      required: true,
      label: "Region",
      align: "left",
      field: "region_name",
      sortable: true,
    },
    {
      name: "kategori_header",
      required: true,
      label: "Kategori (Darat/Laut)",
      align: "left",
      field: "kategori_header",
      sortable: true,
    },       
   
];
const $q = useQuasar();
const listDataHeader = ref([]);
const listDataDetail = ref([]);
const listBU = ref([]);
const listFixNonFix = ref(["Fixed","Non Fixed"]);
const listLokasiMuat = ref([]);
const listUser = ref([]);
const listKotaTujuan = ref([]);
const listJenisKendaraan = ref([]);
const tmpData = ref([]);

const right = ref(false);

const loading = ref(false);
const dialogForm = ref(false);
const dialogForm_EDIT = ref(false);
const maximizedToggle = ref(true);
// const val = ref([]);

const group= ref([]);
const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10,
  filter: null,
  domain: domain(),
});

const save = async () => {  
  try {
    $q.loading.show();
    if(tmpForm.buktinego == undefined){
       $q.notify({
        type: "negative",
        message: 'Bukti Nego Belum Diupload',
      });
      $q.loading.hide();
      return;
    }

    let formData = new FormData();
    for (let key in tmpForm) {
      formData.append(key, tmpForm[key]);
    }    
    
    const res = await axios.post("saveNegoHarga", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    

    // dialogForm.value = false;
    dialogForm_EDIT.value = false;
    dialogForm.value = false;
    // reset();    

    $q.notify({
      type: "positive",
      message: res.data.message,
    });
        
    // await viewNegoHarga();
    // await getNegoHarga();

    $q.loading.hide();
  } catch (error) {
    $q.loading.hide();
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  } 
}

const schema1 = yup.object({
    site: yup.string().required().label("Site")
                 .typeError("Site Tidak Boleh Kosong"),
    level: yup.string().required().label("Level")
                 .typeError("Level Tidak Boleh Kosong"),
    nik: yup.string().required().label("NIK")
                 .typeError("NIK Tidak Boleh Kosong"),
});

const tmpForm = reactive({    
  bussinessunit : null,
  region        : null,
  kategori      : null,
  tgl_berlaku   : null,
  lokasimuat    : null,
  kotatujuan    : null,
  jeniskendaraan: null,
  jumlaharah    :1,
  jumlahtujuan  :1,
  fixnonfix     : 'Non Fixed',
  harga         : 0,
  buktinego     : [],


  DOUser: empid(),  
});

const getNegoHarga = async () => {
  try {
    loading.value = true;        
    const res = await axios.get("getNegoHarga", {
      params: pagination.value,      
    //   params: {
    //     params: pagination.value,
    //     empid: empid(),
    //   },
    });               
    listDataHeader.value    = res.data.data1;      
    listLokasiMuat.value      = res.data.data2;    
    listJenisKendaraan.value  = res.data.data3;       

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

const val = ref([]);
const viewNegoHarga = async (value) => {
    // console.log(value);        
    const res = await axios.get("getDetailNegoHarga", {
        params: {
            id: value.id_pengajuan_header,                
            empid: empid(),  
            chkbox: value.val,  
        },
    });   
    dialogForm.value = true;
    reset();  
    val.value = []
    res.data.data1.forEach((element,index) => {
        // console.log(element);
        // console.log(index)
        if(element.status_detail == 'YES'){
          val.value.push(true)
        }else{
          val.value.push(false)
        }
        
        console.log(val)
        console.log(element.status_detail)
        
        tmpData.value.push({
          id: element.id,
          flag: 3,
          lokasimuat: element.lokasi_muat,
          kotatujuan: element.kota_detail,
          jeniskendaraan: element.jns_kendaraan_detail,
          jumlaharah: element.jml_arah_detail,
          jumlahtujuan: element.jml_tempat_detail,
          fixnonfix: element.fixed_detail,
          harga: element.harga_detail,      
          harganego: element.harga_nego,      
          idpengajuandetail: element.id_pengajuan_detail,   
                    
        })
    });
};

const updStatusDetail = async (value) => {    
    try {           
      const res = await axios.get("updStatusDetail", {
        params: {
            idpengajuandetail: value.idpengajuandetail,                
            chkbox: value.val,  
        },
      });   
    
      $q.notify({
        type: "positive",
        message: res.data.message,
      });

      await onRequest({
        pagination: pagination.value,
      });
    } catch (error) {
      $q.notify({
        type: "negative",
        message: ParseError(error),
      });
    } 
};

const negoTmp = (data, index) => {
    console.log(data.kota_detail);
    tmpForm.kotatujuan = data.kotatujuan
    tmpForm.lokasimuat    = data.lokasimuat
    tmpForm.kotatujuan    = data.kotatujuan
    tmpForm.jeniskendaraan = data.jeniskendaraan
    tmpForm.jumlaharah    = data.jumlaharah
    tmpForm.jumlahtujuan  = data.jumlahtujuan
    tmpForm.fixnonfix     = data.fixnonfix
    tmpForm.harga         = data.harga
    tmpForm.buktinego     = data.buktinego
    tmpForm.idpengajuandetail = data.idpengajuandetail
    tmpForm.index         = index
    dialogForm_EDIT.value = true
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
  tmpForm.buktinego       = null;
  tmpForm.idpengajuandetail = null;
  tmpForm.DOUser          = empid();

  tmpForm.id = null;  
  tmpForm.index = null;
  tmpData.value = [];
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
  getNegoHarga();  
  // console.log(empid());
};

const onRequest2 = (props) => {
  getDetailNegoHarga();  
};

onMounted(() => {
  onRequest({
    pagination: pagination.value,
  });
});

document.addEventListener("etrasn_setdomain",() =>{     
  pagination.value.domain = domain();
  getNegoHarga();  
});
</script>