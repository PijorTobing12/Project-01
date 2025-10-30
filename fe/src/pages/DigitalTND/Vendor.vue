<template>
  <div class="q-pa-md">
    <q-card>
      <q-card-section>
         <div class="text-h6">List Project</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-table
          class="users-table"
          :columns="columns"
          :rows="listChecklist"
          row-key="id"
          v-model:pagination="pagination"
          :loading="loading"
          :filter="pagination.filter"
          @request="onRequest"
          binary-state-sort
        >
         <template v-slot:top-left>
             <q-select
              borderless
              dense
              debounce="300"
              v-model="pagination.rowsPerPage"
              :options="[5,10,25,50,100,200]"
            >
              <template v-slot:before>
                <q-icon name="reorder">
                   <q-tooltip :class="'tw-bg-black/90'">
                    Rows per page
                  </q-tooltip>
                </q-icon>
              </template>
            </q-select>             
        </template>
        <template v-slot:top-right> 
            <q-input class="q-pl-sm"
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
                <q-btn 
                  dense
                  color="light-blue-9"
                   class="text-weight-regular text-caption tw-mr-1"
                  @click="editChecklist(props.row)"
                  push
                  icon="edit_square"
                >
                  <q-tooltip :class="'tw-bg-black/90'">
                    Edit
                  </q-tooltip>
                </q-btn>
                <q-btn 
                  dense
                  color="green-10"
                  class="text-weight-regular text-caption tw-mr-1"
                  @click="prosesKirim(props.row)"
                  push
                  icon="mail"
                >
                    <q-tooltip :class="'tw-bg-black/90'">
                        Send
                    </q-tooltip>
                </q-btn>
            </q-td>
        </template>
        </q-table>
      </q-card-section>
    </q-card>    
  </div>
  <Vendor v-if="dialogForm" :dialog="dialogForm" :data="tmpForm" @close="refreshData"></Vendor>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
// import { api } from "src/boot/axios";
import axios from "axios";
import { ParseError, excelDownload, suppCode } from "/src/utils";
import { useQuasar,Loading,QSpinnerCube } from "quasar";
import dayjs from 'dayjs';
import * as yup from "yup";
import Vendor from "./../../components/DigitalTND/Vendor.vue";

const columns = [
  {
    name: "tch_nodoc",
    required: true,
    label: "Form Motivasi",
    align: "left",
    field: "tch_nodoc",
    sortable: true,
  },
  {
    name: "tch_project",
    required: true,
    label: "Project",
    align: "left",
    field: "tch_project",
    sortable: true,
  },
  {
    name: "created_at",
    required: true,
    label: "Tanggal",
    align: "left",
    format: (val, row) => dayjs(row.created_at).format("DD-MM-YYYY"),
    sortable: true,
  },
  {
    name: "tma_code",
    required: true,
    label: "Area",
    align: "left",
    field: "tma_code",
    sortable: true,
  },
  {
    name: "user_name",
    required: true,
    label: "Created By",
    align: "left",
    field: "user_name",
    sortable: true,
  },
  {
    name: "tch_status",
    required: true,
    label: "Status",
    align: "left",
    field: "tch_status",
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
const listChecklist = ref([]);
const loading = ref(false);
const dialogForm = ref(false);
const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10,
  filter: null,
  jenis:'vendor',
  empid:suppCode(),
});

const tmpForm = reactive({
  id: null,
  nodoc:null,
  domain:null,
  pic_tnd:null,
  area:null,
  project:null,
  add:null,
  jenis:null,
  view:null,
  update:null,
  approve:null,
  close:true,
  status:null,
  key:null,
});

const getChecklist = async () => {
  try {
    loading.value = true;
     if (pagination.value.rowsPerPage == 'All')
     pagination.value.rowsPerPage = pagination.value.rowsNumber;
    const res = await axios.get(`${import.meta.env.VITE_TND}tnd_ba_vendor_checklist`, {
      params: pagination.value,
    });
    // listChecklist.value = res.data.data;
    if (typeof res.data.data === "undefined") {
      listChecklist.value = res.data;
    } else {
      listChecklist.value = res.data.data;
    }

    pagination.value.rowsNumber = res.data.pagination.total;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    $q.notify({
      type: "negative",
      message: error,
    });
  }
};

const addCheckList = () => {
  dialogForm.value = true;
  tmpForm.id = null;
  tmpForm.nodoc = null;
  tmpForm.add = true;
  tmpForm.update = false;
  tmpForm.view = false;
  tmpForm.approve = false;
  tmpForm.close = false;
  tmpForm.key = null;
};

const editChecklist = (value) => {
  dialogForm.value = true;
  tmpForm.id = value.tch_id;
  tmpForm.nodoc = value.tch_nodoc;
  tmpForm.area = value.tma_code;
  tmpForm.add = false;
  tmpForm.update = true;
  tmpForm.view = false;
  tmpForm.approve = false;
  tmpForm.close = true;
  tmpForm.key = value.random_key;
};

const prosesKirim = async (value) => {
  $q.dialog({
    title: 'Kirim Pengajuan',
    message: `Apakah anda yakin untuk melakukan approval <span class="text-bold">${value.tch_project}</span>?`,
    html: true,
    class:`bg-light-blue-2 text-semibold`,
    ok: {
          push: true,
          color:"blue-6"
        },
    cancel: {
      push: true,
      color: 'red-7'
    },
    persistent: true,
  }).onOk(async () => {
    try {
      // await api.post("deleteMotivasi", value);
      // const res = await api.delete("domains/" + value.id);
      // console.log(res.data);
      let dataForm= {
        id:value.tch_id,
        key:value.random_key,
        empid:suppCode(),
      };
      Loading.show({
        spinner: QSpinnerCube,
        color:"primary"
        // other props
      });
      const res = await axios.post(`${import.meta.env.VITE_TND}tnd_genlog_ba_checklist`, dataForm);
      Loading.hide();
      if (res.data.message == 'sukses'){
        await validasiToken(value);
      }
    } catch (error) {
     //console.log(error);
      Loading.hide();
      $q.notify({
        type: "negative",
        message: ParseError(error),
      }); 
    }
  });
};

const validasiToken = async (value) => {
    try {
      // await api.post("deleteMotivasi", value);
      // const res = await api.delete("domains/" + value.id);
      // console.log(res.data);
      let dataForm= {
        id:value.tch_id,
        key:value.random_key,
        empid:suppCode(),
      };
      Loading.show({
        spinner: QSpinnerCube,
        color:"primary"
        // other props
      });
      const res = await axios.post(`${import.meta.env.VITE_TND}tnd_token_ba_checklist`, dataForm);
      Loading.hide();
      if(res.data.message == 'sukses'){
        await sendPengajuan(value);
      }
    } catch (error) {
     //console.log(error);
       $q.notify({
        type: "negative",
        message: ParseError(error),
      }); 
    }
};

const sendPengajuan = async (value) => {
    try {
      // await api.post("deleteMotivasi", value);
      // const res = await api.delete("domains/" + value.id);
      // console.log(res.data);
      let dataForm= {
        id:value.tch_id,
        key:value.random_key,
        empid:suppCode(),
      };
      Loading.show({
        spinner: QSpinnerCube,
        color:"primary"
        // other props
      });
      await axios.post(`${import.meta.env.VITE_TND}tnd_send_ba_checklist`, dataForm);
      Loading.hide();
      $q.notify({
        type: "positive",
        message: `Data berhasil dilakukan proses`,
        html: true,
      });
      // await getTimeline();
      await onRequest({
        pagination: pagination.value,
      });
    } catch (error) {
     //console.log(error);
       $q.notify({
        type: "negative",
        message: ParseError(error),
      }); 
    }
};

const onRequest = (props) => {
  const { page, rowsPerPage, sortBy, descending, filter } = props.pagination;
  pagination.value.filter = filter;
  pagination.value.page = page;
  pagination.value.rowsPerPage = rowsPerPage;
  pagination.value.sortBy = sortBy;
  pagination.value.descending = descending;
  getChecklist();
  
};

const refreshData = async () => {
 dialogForm.value = false;
 getChecklist();
}


onMounted(() => {
  onRequest({
    pagination: pagination.value,
  });
});

</script>