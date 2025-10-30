<template>
  <div class="q-pa-md">
      <q-card>
        <q-separator />
        <q-card-section style="max-height: 50vh" class="scroll">
          <div class="row q-col-gutter-sm">
            <div class="col-6" hidden>    
              <q-input v-model="tmpForm.npwp" dense outlined label="NPWP" readonly=""/>
            </div>

            <div class="col-12 col-md-6">
              <q-select dense outlined v-model="tmpForm.dept" use-input emit-value map-options input-debounce="0"
                  option-value="depart_id" 
                  :option-label="option => `${option.bu_code} - ${option.div_name} - ${option.dept_name}`"
                  label="Pilih Department" :options="listDept"
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
            <div class="col-12 col-md-6">
              <q-select dense outlined v-model="tmpForm.pekerjaan" use-input emit-value map-options input-debounce="0"
                  option-value="job_id" 
                  :option-label="option => `${option.job_domain_name} - ${option.job_site_name} - ${option.job_desc}`"
                  label="Pilih Pekerjaan" :options="listPekerjaan"
                  @filter="filterFunction2">
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
                <q-input label="From" outlined dense v-model="tmpForm.periodeawal">
                <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="tmpForm.periodeawal" mask="YYYY-MM-DD" @update:model-value="hideDate">
                        </q-date>
                    </q-popup-proxy>
                    </q-icon>
                </template>
                </q-input>
            </div>
            <div class="col-12 col-md-6">
                <q-input label="To" outlined dense v-model="tmpForm.periodeakhir">
                <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="tmpForm.periodeakhir" mask="YYYY-MM-DD" @update:model-value="hideDate">
                        </q-date>
                    </q-popup-proxy>
                    </q-icon>
                </template>
                </q-input>
            </div>
          </div>
        </q-card-section>
        <!-- <q-separator /> -->
        <q-card-actions align="left">
          <q-btn-group push>
            <q-btn push icon="search" color="blue" label="Filter" @click="getBoronganWithFilter" />
          </q-btn-group> | 
          <q-btn-group push>
            <q-btn push icon="close" color="red" label="Reset" @click="resetFilter" />
          </q-btn-group> | 
          <q-btn-group push>
            <q-btn push icon="download" color="green" label="Download" @click="getReportingWithFilter2" />
          </q-btn-group>
        </q-card-actions>
      </q-card>
    <q-card>

      <q-separator />

      <q-card-section>
        <q-table title="List Borongan" :rows="listBorongan" :columns="columns" row-key="id" v-model:pagination="pagination"
          :loading="loading" :filter="pagination.filter" @request="onRequest" binary-state-sort>
          <template v-slot:top-right>
            <q-input borderless dense debounce="300" v-model="pagination.filter" placeholder="Search">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
          <template v-slot:body-cell-aksi="props">
            <q-td :props="props">
              <!-- {{ props }} -->
              <q-btn-group push>
                <q-btn-group v-if="props.row.hd_flag === 'Check Vendor'" push>  
                  <q-btn dense color="green" class="text-weight-regular text-caption" @click="editListBorongan(props.row)" push
                  label="Edit" icon="edit" />
                </q-btn-group>
                <q-btn-group v-if="props.row.hd_flag !== 'Check Vendor'" push>  
                  <q-btn dense color="blue" class="text-weight-regular text-caption" @click="editListBorongan(props.row)"
                  push label="Preview" icon="search" />
                </q-btn-group>
                
                
              </q-btn-group>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

      <table class="tw-min-w-full" border="2" border-collapse: collapse hidden>
        <thead>
          <tr>
            <th colspan="6">
              List Data Tagihan Borongan
            </th>
          </tr>
          <tr>
            <th>No</th>
            <th>Department</th>
            <th>Judul Tagihan</th>
            <th>Pekerjaan</th>
            <th>Periode Awal</th>
            <th>Periode Akhir</th>
          </tr>
        </thead>

        <tbody class="tw-bg-white">
          <tr v-for="(data, i) in listBorongan" :key="i">
            <td>{{ i + 1 }}</td>
            <td>{{ data.depart_name }}</td>
            <td>{{ data.hd_title }}</td>
            <td>{{ data.job_name }}</td>
            <td>{{ data.hd_periode_start }}</td>
            <td>{{ data.hd_periode_end }}</td>
          </tr>
        </tbody>
      </table>

    <q-dialog v-model="dialogFormEdit" persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down">
      <q-card>
        <q-card-section>
          <div class="text-h6">Pekerjaan Borongan Harian</div>
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 80vh" class="scroll"> 
        <Form class="q-mt-md">             
          <div class="row q-col-gutter-sm">
            <div class="col-6" hidden>    
              <q-input v-model="tmpForm.id" dense outlined label="Work Header" readonly=""/>
            </div>
            <div class="col-6">    
              <q-input v-model="tmpForm.judultagihan" dense outlined label="Judul Tagihan" readonly=""/>
            </div>
            <div class="col-6">    
              <q-input v-model="tmpForm.pekerjaanheader" dense outlined label="Pekerjaan" readonly=""/>
            </div>

            <div class="col-6">
              <q-input label="Periode Awal" outlined dense v-model="tmpForm.periodeawal" readonly>
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="tmpForm.periodeawal" mask="YYYY-MM-DD">
                        <div class="row items-center justify-end q-gutter-sm">
                          <q-btn label="Cancel" color="primary" flat v-close-popup />
                          <q-btn label="OK" color="primary" flat v-close-popup />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>

            <div class="col-6">
              <q-input label="Periode Akhir" outlined dense v-model="tmpForm.periodeakhir" readonly>
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="tmpForm.periodeakhir" mask="YYYY-MM-DD">
                        <div class="row items-center justify-end q-gutter-sm">
                          <q-btn label="Cancel" color="primary" flat v-close-popup />
                          <q-btn label="OK" color="primary" flat v-close-popup />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>

            <div class="col-6">    
              <q-input v-model="tmpForm.jamkerja" dense outlined label="Jam Kerja" readonly=""/>
            </div>


            <div class="col-6">    
              <q-input v-model="tmpForm.keterangan" dense outlined label="Keterangan" readonly=""/>
            </div>


            <!-- <div class="col-6" hidden>
              <q-input type="number" v-model="tmpForm.id" dense outlined label="ID" />
            </div>                         -->
            

            <div class="col-12">
              <div class="tw-w-full tw-border-b-2 tw-border-black"></div>
            </div>
            <div class="col-12">
              <divider title="Detail" />
            </div>

            <div class="col-6" hidden>    
            </div>
          </div>

          <div class="col-12 tw-mt-3">
            <q-markup-table>
              <thead>
                <tr>
                  <th class="text-left">No</th>
                  <th class="text-left">Tanggal</th>
                  <th class="text-left">Detail Pekerjaan</th>
                  <th class="text-left">Shift 1</th>
                  <th class="text-left">Shift 2</th>
                  <th class="text-left">Shift 3</th>
                  <th class="text-left">Total Berat</th>
                  <th class="text-left">Satuan</th>
                  <th class="text-left">Feedback Vendor</th>
                  <!-- <th class="text-right">Aksi</th> -->
                </tr>
              </thead>
              <tbody>
                <tr v-for="(data, i) in tmpData" :key="i">
                  <template v-if="data.flag != 1">
                    <td class="text-left">{{ i + 1 }}</td>
                    <td class="text-left">{{ data.work_date }}</td>
                    <td class="text-left">{{ data.jobdetails_name }}</td>
                    <td class="text-left">{{ data.work_dtl_bor_nilai_1 }}</td>
                    <td class="text-left">{{ data.work_dtl_bor_nilai_2 }}</td>
                    <td class="text-left">{{ data.work_dtl_bor_nilai_3 }}</td>
                    <td class="text-left">{{ data.work_dtl_bor_nilai }}</td>
                    <td class="text-left">{{ data.work_dtl_bor_satuan }}</td>
                    <td class="text-left">
                      <!-- {{ data.log_desc_approve }} -->
                      <!-- <q-input v-model="tmpForm[data.log_desc_approve]" dense  outlined />  -->
                      <!-- <q-input v-model="tmpForm[data.work_dtl_bor]" dense  outlined /> {{data.log_desc_approve}}  -->
                      <q-input v-model="data.log_desc_approve" dense  outlined />

                    </td>
                    <td class="text-left">
                      <!-- <q-btn-group>
                        <q-btn square dense color="negative" icon="delete" @click="deleteTmp(data, i)" />
                        <q-btn square dense color="info" icon="edit" @click="editTmp(data, i)" />
                      </q-btn-group> -->
                    </td>
                  </template>

                </tr>
                <tr>
                  <td class="text-left"></td>
                  <td class="text-left" colspan="5"><b>Total</b></td>
                  <td class="text-left"><b>{{ totalqty }}</b></td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>

        </Form>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">

          <!-- <q-btn flat label="Batal" color="primary" v-close-popup />   -->
          <q-btn dense color="red" class="text-weight-regular text-caption" label="Batal" icon="close" v-close-popup />   
          <template v-if="hdflagori === '2'">  
            <q-btn dense color="orange" class="text-weight-regular text-caption" @click="revisiListBorongan()" push
            label="Revisi" icon="edit" />
            <q-btn dense color="blue" class="text-weight-regular text-caption" @click="saveListBorongan()" push
            label="Simpan" icon="save" />
            <q-btn dense color="green" class="text-weight-regular text-caption" @click="approveListBorongan()" push
            label="Approve" icon="check" />
          </template>     
          <!-- <q-btn flat label="Simpan" color="primary" @click="saveedit" /> -->
        </q-card-actions>      
        
      </q-card>
    </q-dialog>

  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import axios from "axios";
import { ParseError, excelDownload, domain, role, empid, nik, dateOnly } from "./../../utils";
import { useQuasar } from "quasar";
import * as XLSX from "xlsx";

const columns = [
  {
    name: "depart_name",
    required: true,
    label: "Department",
    align: "left",
    field: "depart_name",
    sortable: true,
  },
  {
    name: "hd_title",
    required: true,
    label: "Judul Tagihan",
    align: "left",
    field: "hd_title",
    sortable: true,
  },
  {
    name: "job_name",
    required: true,
    label: "Pekerjaan",
    align: "left",
    field: "job_name",
    sortable: true,
  },
  {
    name: "hd_periode_start",
    required: true,
    label: "Periode Awal",
    align: "left",
    field: "hd_periode_start",
    sortable: true,
  },
  {
    name: "hd_periode_end",
    required: true,
    label: "Periode Akhir",
    align: "left",
    field: "hd_periode_end",
    sortable: true,
  },
  {
    name: "hd_flag",
    required: true,
    label: "Status",
    align: "left",
    field: "hd_flag",
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

const $q = useQuasar();
const listBorongan = ref([]);
const maximizedToggle = ref(true);
const loading = ref(false);
const dialogForm = ref(false);
const dialogFormEdit = ref(false);
const dialogAkses = ref(false);
const pagination = ref({
  sortBy: "work_header",
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10,
  filter: null,
  domain: domain(),
  npwp: nik(),
});
const tmpForm = reactive({
  id: null,
  domain        : domain(),
  judultagihan  : null,
  pekerjaan     : null,
  pekerjaanheader: null,
  periodeawal   : dateOnly(),
  periodeakhir  : dateOnly(),
  jamkerja      : null,
  keterangan    : null,
  npwp          : empid(),
  dept          : null,
});
const tmpData = ref([]);
const hdflagori = ref([]);
const listDept = ref([]);
const listPekerjaan = ref([]);
const totalqty = ref([]);

const getBorongan = async () => {
  try {
    loading.value = true;
    const res = await axios.get("getBorongan", {
      params: pagination.value,
    });
    listBorongan.value = res.data.data.data;
    listDept.value      = res.data.datadept;
    listPekerjaan.value = res.data.datapekerjaan;
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

const editListBorongan = async (value) => {
  try {    
    // $q.loading.show();
    // console.log('shendy');

    const res = await axios.get("getDetailListBorongan", {
        params: {
            id: value.work_header,                
            empid: empid(),
            hdflagori: value.hd_flag_ori
        },
    });   
    
    tmpForm.judultagihan  = res.data.header[0].hd_title;
    tmpForm.pekerjaanheader     = res.data.header[0].job_name; 
    tmpForm.periodeawal   = res.data.header[0].hd_periode_start;
    tmpForm.periodeakhir  = res.data.header[0].hd_periode_end;
    tmpForm.jamkerja      = res.data.header[0].timework_desc;
    tmpForm.keterangan    = res.data.header[0].hd_desc;
    tmpForm.id            = res.data.header[0].work_header;

    hdflagori.value = res.data.flag;
    totalqty.value  = res.data.totalqty;
    // console.log(res.data.detail);
    
    tmpData.value = [];
    res.data.detail.forEach(element => {
    tmpData.value.push({
        id                  : element.work_dtl_bor,
        jobdetails_name     : element.jobdetails_name,
        log_desc_approve    : element.log_desc_approve,
        work_date           : element.work_date,
        work_dtl_bor_nilai  : element.work_dtl_bor_nilai,
        work_dtl_bor_nilai_1: element.work_dtl_bor_nilai_1,
        work_dtl_bor_nilai_2: element.work_dtl_bor_nilai_2,      
        work_dtl_bor_nilai_3: element.work_dtl_bor_nilai_3,  
        work_dtl_bor_satuan : element.work_dtl_bor_satuan,
        work_dtl_bor        : element.work_dtl_bor,
        idheader            : value.work_header,
        npwp                : empid(),
        
      })
    });

    dialogFormEdit.value = true;

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

const filterFunction = async (val, update) => {
  if (val === '') {
      update(() => {
        getBorongan();  
      })
  }
  // console.log(val);
  update(() => {
      // console.log(val);
      const neddle = val.toLowerCase();
      listDept.value = listDept.value.filter(option => {
          return option.dept_name.toLowerCase().includes(neddle)
          // console.log(option.sup_name);
      }) 
  })
}

const filterFunction2 = async (val, update) => {
  if (val === '') {
      update(() => {
        getBorongan();  
      })
  }
  // console.log(val);
  update(() => {
      // console.log(val);
      const neddle = val.toLowerCase();
      listPekerjaan.value = listPekerjaan.value.filter(option => {
          return option.job_desc.toLowerCase().includes(neddle)
          // console.log(option.sup_name);
      }) 
  })
}


const resetFilter = async () => {
  reset();
  getBorongan();
};

const getBoronganWithFilter = async () => {
  try {
    
    const res = await axios.post("getBoronganWithFilter", tmpForm);
    // const res = await axios.post("getBoronganWithFilter", {
    //   // params: pagination.value,
    //   // params: {
    //   //       pagination: pagination.value,                
    //   //       empid: empid(),
    //   //       hdflagori: value.hd_flag_ori
    //   //   },
    //   // params: pagination.value,
    //   // empid: empid(),
    //   // tmpForm: tmpForm.value,
    // });
    // console.log(res.data.data);
    listBorongan.value = res.data.data;
    listDept.value      = res.data.datadept;
    listPekerjaan.value = res.data.datapekerjaan;
    pagination.value.rowsNumber = res.data.jumdata;

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

      const res = await axios.post("getBoronganWithFilter", tmpForm);
      listBorongan.value = res.data.data;

      const wb = XLSX.utils.table_to_book(document.getElementsByTagName("TABLE")[1])
      XLSX.writeFile(wb, "List Data Tagihan Borongan.xlsx");

      $q.notify({
        type: "positive",
        message: "Proses Download Selesai",
      });
      return;
    } catch (error) {
      loading.value = false;
      $q.notify({
        type: "negative",
        message: ParseError(error),
      });
    }
  };


const saveListBorongan = async () => {
  try {
    tmpData.value.forEach(async(element) => {
      await axios.post("saveListBorongan", element);
    });
  
    dialogFormEdit.value = false;
    // reset();
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


const revisiListBorongan = async () => {
  try {
    $q.loading.show();
    tmpData.value.forEach(async(element) => {
      await axios.post("revisiListBorongan", element);
    });

    await sendEmailRev();
    
    dialogFormEdit.value = false;
    // reset();
    $q.notify({
      type: "positive",
      message: "Data berhasil direvisi",
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

const sendEmailRev = async () => {
  await axios.post("sendEmailRevBorongan", tmpForm);
}

const sendEmailApprove = async () => {
  await axios.post("sendEmailApproveBorongan", tmpForm);
}

const approveListBorongan = async (value) => {
  $q.dialog({
    title: "Konfirmasi",
    message: `Anda yakin akan dilakukan proses approve untuk data ini? <span class="tw-font-bold"></span>`,
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
      tmpData.value.forEach(async(element) => {
        await axios.post("approveListBorongan", element);
      });
      // return;
      await sendEmailApprove();

      dialogFormEdit.value = false;
      $q.notify({
        type: "positive",
        message: "Data berhasil diApprove",
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
  });
};



const reset = () => {
  // tmpForm.npwp = null;
  tmpForm.dept          = null;
  tmpForm.pekerjaan     = null;
  tmpForm.periodeawal   = dateOnly(),
  tmpForm.periodeakhir  = dateOnly(),
  tmpForm.id = null;
};

const onRequest = (props) => {
  const { page, rowsPerPage, sortBy, descending, filter } = props.pagination;
  pagination.value.filter = filter;
  pagination.value.page = page;
  pagination.value.rowsPerPage = rowsPerPage;
  pagination.value.sortBy = sortBy;
  pagination.value.descending = descending;
  getBorongan();
};

onMounted(() => {
  onRequest({
    pagination: pagination.value,
  });
});

document.addEventListener("etrasn_setdomain", () => {
  pagination.value.domain = domain();
  getBorongan();
});
</script>