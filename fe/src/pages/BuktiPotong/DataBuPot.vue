<template>
  <div class="q-pa-md">
      <q-card>
        <q-separator />
        <q-card-section style="max-height: 50vh" class="scroll">
          <div class="row q-col-gutter-sm">
              <div class="col-12">
                <q-select dense outlined v-model="tmpForm.bu" use-input emit-value map-options input-debounce="0"
                    option-value="bu_id" 
                    :option-label="option => `${option.bu_name}`"
                    label="Pilih Bisnis Unit" :options="listBU"
                    @filter="filterFunction">
                    <template v-slot:no-option>
                    <q-item>
                        <q-item-section class="text-grey">
                        No results
                        </q-item-section>
                    </q-item>
                    </template>
                </q-select>
              </div>
              <div class="col-6">
                <q-select dense outlined v-model="tmpForm.bulan" use-input emit-value map-options input-debounce="0"
                  option-value="value" option-label="desc" label="Pilih Bulan" :options="listBulan">
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No results
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <div class="col-6">
                <q-select dense outlined v-model="tmpForm.tahun" use-input emit-value map-options input-debounce="0"
                  option-value="value" option-label="desc" label="Pilih Tahun" :options="listTahun">
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No results
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
          </div>
        </q-card-section>
        <!-- <q-separator /> -->
        <q-card-actions align="left">
          <q-btn-group push>
            <q-btn push icon="search" color="blue" label="Filter" @click="getBuktiPotongWithFilter" />
          </q-btn-group> | 
          <q-btn-group push>
            <q-btn push icon="close" color="red" label="Reset" @click="resetFilter" />
          </q-btn-group> | 
          <q-btn-group push>
            <q-btn push icon="download" color="green" label="Download" @click="getReportingWithFilter2" />
            <!-- <a href="/images/myw3schoolsimage.jpg" download>Download</a> -->
          </q-btn-group>
        </q-card-actions>
      </q-card>
    <q-card>

      <q-separator />

      <q-card-section>
        <q-table title="List Bukti Potong" :rows="listBuktiPotong" :columns="columns" row-key="id" v-model:pagination="pagination"
          :loading="loading" :filter="pagination.filter" @request="onRequest" binary-state-sort>
          <template v-slot:top-right>
            <q-input borderless dense debounce="300" v-model="pagination.filter" placeholder="Search">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
            <!-- <q-btn-group push>
                <q-btn dense color="grey" class="text-weight-regular text-caption" @click="print(props.row.file_name)" push
                label="Print" icon="print" />
            </q-btn-group> -->
          </template>
          <template v-slot:body-cell-aksi="props">
            <q-td :props="props">
              <!-- {{ props }} -->
              <q-btn-group push>
                <q-btn dense color="green" class="text-weight-regular text-caption" @click="downloadBupot(props.row.file_name)" push
                  label="Download" icon="download" />
              </q-btn-group>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import axios from "axios";
import { ParseError, excelDownload, domain, role, empid } from "../../utils";
import { useQuasar } from "quasar";

const columns = [
  {
    name: "no_bupot",
    required: true,
    label: "No. Bukti Potong",
    align: "left",
    field: "no_bupot",
    sortable: true,
  },
  {
    name: "npwp",
    required: true,
    label: "NPWP",
    align: "left",
    field: "npwp",
    sortable: true,
  },
  {
    name: "periode",
    required: true,
    label: "Bulan Bukti Potong",
    align: "left",
    field: "periode",
    sortable: true,
  },
  {
    name: "aksi",
    required: true,
    label: "Aksi",
    align: "center",
    field: "aksi",
  },
];

const listBulan = ref([
  { value: "01", desc: "01" },
  { value: "02", desc: "02" },
  { value: "03", desc: "03" },
  { value: "04", desc: "04" },
  { value: "05", desc: "05" },
  { value: "06", desc: "06" },
  { value: "07", desc: "07" },
  { value: "08", desc: "08" },
  { value: "09", desc: "09" },
  { value: "10", desc: "10" },
  { value: "11", desc: "11" },
  { value: "12", desc: "12" },
]);

const listTahun = ref([
  { value: "2021", desc: "2021" },
  { value: "2022", desc: "2022" },
  { value: "2023", desc: "2023" },
  { value: "2024", desc: "2024" },
  { value: "2025", desc: "2025" },
  { value: "2026", desc: "2026" },
  { value: "2027", desc: "2027" },
  { value: "2028", desc: "2028" },
  { value: "2029", desc: "2029" },
  { value: "2030", desc: "2030" },
  { value: "2031", desc: "2031" },
  { value: "2032", desc: "2032" },
  { value: "2033", desc: "2033" },
  { value: "2034", desc: "2034" },
]);

const $q = useQuasar();
const listBuktiPotong = ref([]);

const loading = ref(false);
const dialogForm = ref(false);
const dialogAkses = ref(false);
const listBU = ref([]);
const tmpForm = reactive({
  id: null,
  bulan: null,
  tahun: null,
  npwp: null,
  domain: domain(),
  npwp:empid(),
});
const pagination = ref({
  sortBy: "id_bupot",
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10,
  filter: null,
  domain: domain(),
  npwp:empid(),
  bulan: null,
  tahun:null,
  bu:tmpForm.bu,
});


const getBuktiPotong = async () => {
  try {
    loading.value = true;
    // console.log(pagination.value);
    // console.log('shendy');

    const res = await axios.get("getBuktiPotong", {
      params: pagination.value,
    });

    listBuktiPotong.value = res.data.data.data;
    listBU.value          = res.data.databu;
    pagination.value.rowsNumber = res.data.data.meta.total;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const downloadBupot = async (file) => {
  window.open(`https://fileserp.dbc.co.id/eReg/${file}`, '_blank')
  
  // tmpForm.file = file;
  // const res = await axios.get("getBuktiPotong2", {
  //   params: tmpForm,
  //   responseType: 'blob',
  //   file: file
  // });

  // const url = window.URL.createObjectURL(new Blob([res.data]));
  // const link = document.createElement('a');
  // link.href = url;
  // link.setAttribute('download', file);
  // document.body.appendChild(link);
  // link.click();

};



const resetFilter = async () => {
  reset();
  pagination.value.rowsPerPage = 10;
  onRequest({
    pagination: pagination.value,
  });
  // getBuktiPotong();
};

const getBuktiPotongWithFilter = async () => {
  try {

    // if(tmpForm.bulan != undefined || tmpForm.tahun != undefined){
    //   if(tmpForm.bulan == undefined || tmpForm.tahun == undefined){ 
    //     $q.notify({
    //       type: "negative",
    //       message: 'Bulan/Tahun Tidak Boleh Kosong',
    //     });
    //     $q.loading.hide();
    //     return;
    //   }
    // }

    const res = await axios.post("getBuktiPotongWithFilter", tmpForm);

    listBuktiPotong.value = res.data.data;
    pagination.value.rowsNumber = res.data.jumdata;
    pagination.value.rowsPerPage =  res.data.jumdata;

    // console.log(res.data.data);
    // roleuser.value = res.data.role;
    // listInspection.value = res.data.data;            
    // listMesin.value      = res.data.datamesin; 
    // listMstFormInsp.value= res.data.datamstforminsp;
    // tmpForm.location.value = location();   
    // pagination.value.rowsNumber = res.data.data.meta.total;
    // loading.value = false;
  } catch (error) {
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getReportingWithFilter2 = async () => {
  try {
    
    // if(tmpForm.npwp == undefined){
    //    $q.notify({
    //     type: "negative",
    //     message: 'NPWP Tidak Boleh Kosong',
    //   });
    //   $q.loading.hide();
    //   return;
    // }

    // if(tmpForm.bulan == undefined || tmpForm.tahun == undefined){
    //    $q.notify({
    //     type: "negative",
    //     message: 'Bulan/Tahun Tidak Boleh Kosong',
    //   });
    //   $q.loading.hide();
    //   return;
    // }

    const res = await axios.post("getBuktiPotongWithFilter", tmpForm);

    res.data.data.forEach((element,index) => {    
        // console.log(element.file_name); 
        downloadBupot(element.file_name);
    });

    listBuktiPotong.value = res.data.data;
    pagination.value.rowsNumber = res.data.jumdata;
    pagination.value.rowsPerPage =  res.data.jumdata;
  } catch (error) {
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};


const saveMenu = async () => {
  try {
    await axios.post("saveMenu", tmpForm);
    dialogForm.value = false;
    reset();
    $q.notify({
      type: "positive",
      message: "Data berhasil disimpan",
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

const reset = () => {
  tmpForm.bu = null;
  tmpForm.bulan = null;
  tmpForm.tahun = null;
  tmpForm.id = null;
};

const onRequest = (props) => {
  const { page, rowsPerPage, sortBy, descending, filter } = props.pagination;
  pagination.value.filter = filter;
  pagination.value.page = page;
  pagination.value.rowsPerPage = rowsPerPage;
  pagination.value.sortBy = sortBy;
  pagination.value.descending = descending;
  getBuktiPotong();
};

onMounted(() => {
  onRequest({
    pagination: pagination.value,
  });
});

document.addEventListener("etrasn_setdomain", () => {
  pagination.value.domain = domain();
  getBuktiPotong();
});
</script>