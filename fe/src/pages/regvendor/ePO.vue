<template>
  <div class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-12">
            <span style="font-size: 25px;">List e-PO</span>
          </div>
          <div class="col-12 col-md-6">
            <q-select
                style="width:100%; padding: 0px;"
                dense
                outlined
                label="Bisinis Unit"
                v-model="tmpForm.bu_code"
                emit-value
                map-options
                input-debounce="0"
                option-value="bu_code"
                option-label="bu_name"
                :options="listBu"
            >
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
            <q-select
                style="width:100%; padding: 0px;"
                dense
                use-input
                outlined
                label="No. PO"
                v-model="tmpForm.no_po"
                emit-value
                map-options
                input-debounce="0"
                option-value="po_nbr"
                option-label="po_nbr"
                :options="listPO"
                @filter="filterFn"
            >
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
            <q-input
                style="width:100%; padding: 0px;"
                dense
                outlined
                autocomplete="off"
                label="Tgl. PO Dari"
                v-model="tmpForm.tgl_from"
                mask="####-##-##"
                fill-mask="#"
            >
            <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="datePopup" cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="tmpForm.tgl_from" mask="YYYY-MM-DD" @update:model-value="hideDate" minimal />
                </q-popup-proxy>
                </q-icon>
            </template>
            </q-input>
          </div>
          <div class="col-12 col-md-6">
            <q-input
                style="width:100%; padding: 0px;"
                dense
                outlined
                autocomplete="off"
                label="Tgl. PO Ke"
                v-model="tmpForm.tgl_to"
                mask="####-##-##"
                fill-mask="#"
            >
            <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="datePopup" cover transition-show="scale" transition-hide="scale">
                <q-date v-model="tmpForm.tgl_to" mask="YYYY-MM-DD" @update:model-value="hideDate" minimal />
                </q-popup-proxy>
                </q-icon>
            </template>
            </q-input>
          </div>            
          <div class="col-12 col-md-12">
            <q-btn
                unelevated
                rounded
                size="md"
                color="positive"
                label="Excel"
                type="button"
                @click="downloadExcel"
                class="tw-mr-2"
            />
            <q-btn
                unelevated
                rounded
                size="md"
                color="blue"
                label="Proses"
                type="button"
                @click="getFilEPO"
            />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          title="List Data"
          :rows="listEPO"
          :columns="columns"
          row-key="id"
          v-model:pagination="pagination"
          :loading="loading"
          :filter="pagination.filter"
          @request="onRequest"
          binary-state-sort
        >
          <template v-slot:top-right>
              <q-input borderless dense debounce="300" v-model="pagination.filter" placeholder="Search" color="blue" :model-value="pagination.filter">
                  <template v-slot:append>
                      <q-icon name="search" />
                  </template>
              </q-input>
          </template>

          <template v-slot:body-cell-aksi="props">
            <q-td :props="props">
              <!-- <a :href="`${ftp_link}`+props.row.details_upload_app+'.pdf'" target="_blank"><span style="color: blue;">Download File</span></a> -->
              <a :href="`${posys_link}popdf?page=${props.row.po_nbr}&domain=${props.row.po_domain}`" target="_blank"><span style="color: blue;">View</span></a>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import dayjs from "dayjs";
import { useRouter } from "vue-router";
import axios from "axios";
import { ParseError, domain, role, empid, excelDownload } from "./../../utils";
import { useQuasar } from "quasar";
import { Buffer } from 'buffer';

const basys_link = import.meta.env.VITE_BA_SYS;
const posys_link = import.meta.env.VITE_EPO_SYS;

const columns = [
  {
    name: "po_ord_date",
    required: true,
    label: "Tgl. PO",
    align: "left",
    field: "po_ord_date",
    format: val => dayjs(`${val}`).format("YYYY-MM-DD"),
    sortable: true,
  },
  {
    name: "po_nbr",
    required: true,
    label: "No. PO",
    align: "left",
    field: "po_nbr",
    sortable: true,
  },
  {
    name: "bamrr_supp_name",
    required: true,
    label: "Nama Vendor",
    align: "left",
    field: "bamrr_supp_name",
    sortable: true,
  },
  {
    name: "bu_name",
    required: true,
    label: "Bisnis Unit",
    align: "left",
    field: "bu_name",
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
const router = useRouter();
const listEPO = ref([]);
const listEmpApp = ref([]);
const listBu = ref([]);
const listPO = ref([]);
const loading = ref(false);
const hideBottom = ref(false);
const datePopup = ref(null);

const pagination = ref({
  sortBy: "po_ord_date",
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
  filter: null,
  domain: domain(),
});

const filbu_code = ref("");
const filtgl_from = ref("");
const filtgl_to = ref("");
const fil_no_po = ref("");

const tmpForm = reactive({
  bu_code: "",
  tgl_from: "",
  tgl_to: "",
  no_po: "",
});

const getEPO = async () => {
  try {
    loading.value = true;

    const res = await axios.get("getEPO", {
      // params: pagination.value,
      params: {
        filter: pagination.value.filter,
        page: pagination.value.page,
        rowsPerPage: pagination.value.rowsPerPage,
        sortBy: pagination.value.sortBy,
        descending: pagination.value.descending,
        rowsNumber: pagination.value.rowsNumber,
        npwp: empid(),
        domain: domain(),
      },
    });
    
    // if (typeof res.data.data === "undefined") {
    //   listEPO.value = res.data;
    // } else {
    //   listEPO.value = res.data.data;
    // }

    listEPO.value = res.data.data.data;
    pagination.value.page = res.data.data.meta.current_page;
    pagination.value.rowsPerPage = res.data.data.meta.per_page;
    pagination.value.rowsNumber = res.data.total;
    // pagination.value.rowsNumber = res.data.meta.total;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getFilEPO = async (values, actions) => {
    try {
      loading.value = true;

      let fil_from = "";
      let fil_to = "";
      if (tmpForm.tgl_from === '####-##-##' && tmpForm.tgl_to === '####-##-##') {
        fil_from = "";
        fil_to = "";
      } else {
        fil_from = tmpForm.tgl_from;
        fil_to = tmpForm.tgl_to;
      }

      if (!hideBottom.value) {
        filbu_code.value = tmpForm.bu_code;
        filtgl_from.value = fil_from;
        filtgl_to.value = fil_to;
        fil_no_po.value = tmpForm.no_po; 
      }      

      const res = await axios.get("getFilEPO", {
        // params: pagination.value,
        params: {
          filter: pagination.value.filter,
          page: pagination.value.page,
          rowsPerPage: pagination.value.rowsPerPage,
          sortBy: pagination.value.sortBy,
          descending: pagination.value.descending,
          rowsNumber: pagination.value.rowsNumber,
          npwp: empid(),
          bu_code: filbu_code.value,
          no_po: fil_no_po.value,
          tgl_from: filtgl_from.value,
          tgl_to: filtgl_to.value,
        },
      });
      
      // if (typeof res.data.data === "undefined") {
      //   listEPO.value = res.data;
      // } else {
      //   listEPO.value = res.data.data;
      // }
      
      listEPO.value = res.data.data.data;
      pagination.value.page = res.data.data.meta.current_page;
      pagination.value.rowsPerPage = res.data.data.meta.per_page;
      pagination.value.rowsNumber = res.data.total;
      loading.value = false;
      reset();
      hideBottom.value = true;
    } catch (error) {
        $q.loading.hide();
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }
};

const getPageFilEPO = async (values, actions) => {
    try {
      loading.value = true;

      const res = await axios.get("getFilEPO", {
        // params: pagination.value,
        params: {
          filter: pagination.value.filter,
          page: pagination.value.page,
          rowsPerPage: pagination.value.rowsPerPage,
          sortBy: pagination.value.sortBy,
          descending: pagination.value.descending,
          rowsNumber: pagination.value.rowsNumber,
          npwp: empid(),
          bu_code: filbu_code.value,
          no_po: fil_no_po.value,
          tgl_from: filtgl_from.value,
          tgl_to: filtgl_to.value,
        },
      });
      
      listEPO.value = res.data.data.data;
      pagination.value.page = res.data.data.meta.current_page;
      pagination.value.rowsPerPage = res.data.data.meta.per_page;
      pagination.value.rowsNumber = res.data.total;
      loading.value = false;
    } catch (error) {
        $q.loading.hide();
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }
};

const downloadExcel = async () => {
  try {
    loading.value = true;
    const res = await axios.get("getExEPO", {
      // params: pagination.value,
      params: {
        npwp: empid(),
        bu_code: filbu_code.value,
        no_po: fil_no_po.value,
        tgl_from: filtgl_from.value,
        tgl_to: filtgl_to.value,
      },
    });

    let data = [];
    let i = 1;
    for (const iterator of res.data) {
      data.push({
        No: i++,
        Tgl_PO: iterator.po_ord_date != null ? dayjs(`${iterator.po_ord_date}`).format("YYYY-MM-DD") : '',
        No_PO: iterator.po_nbr,
        Nama_Vendor: iterator.bamrr_supp_name,
        Bisnis_Unit: iterator.bu_name,
        // Tgl_Verifikasi_Selesai: iterator.tk_tgl_verifikasi_pengerjaan != null ? dayjs(`${iterator.tk_tgl_verifikasi_pengerjaan}`).format("YYYY-MM-DD") : '',
        // Tgl_Analisa: iterator.tk_tgl_analisa != null ? dayjs(`${iterator.tk_tgl_analisa}`).format("YYYY-MM-DD") : '',
      });
    }
    await excelDownload(data, "ePO");
    loading.value = false;

    // reset value param filter
    filbu_code.value = ""; 
    filtgl_from.value = "";
    filtgl_to.value = "";
    fil_no_po.value = "";
  } catch (error) {
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getAppBu = async () => {
  try {
    const res = await axios.get("getAppBu");
    listBu.value = res.data;
  } catch (error) {
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getPO = async () => {
  try {
    // const res = await axios.get("getPoMrr");
    const res = await axios.get("getPoMst", {
      params: {
        npwp: empid(),
      },
    });
    listPO.value = res.data;
  } catch (error) {
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const filterFn = async (val, update) => {
    if (val === '') {
        update(() => {
          getPO();  
        })
    }

    update(() => {
        const neddle = val.toLowerCase();
        listPO.value = listPO.value.filter(option => {
            return option.po_nbr.toLowerCase().includes(neddle)
        }) 
    })
}

const reset = () => {
  tmpForm.bu_code = '';
  tmpForm.no_po = '';
  tmpForm.tgl_from = '';
  tmpForm.tgl_to = '';
};

const onRequest = (props) => {
  const { page, rowsPerPage, sortBy, descending, filter } = props.pagination;
  pagination.value.filter = filter;
  pagination.value.page = page;
  pagination.value.rowsPerPage = rowsPerPage;
  pagination.value.sortBy = sortBy;
  pagination.value.descending = descending;

  if (hideBottom.value) {
    // getPageFilEPO();  
    getFilEPO();  
  } else {
    getEPO();  
  }
  
  // hideBottom.value = false;
};

const hideDate = () => {
  datePopup.value.hide()
}

onMounted(() => {
  getAppBu();
  getPO();
  onRequest({
    pagination: pagination.value,
  });
});
</script>