<template>
  <div class="q-pa-md">
    <q-btn-group push class="tw-mt-10 tw-mb-5">
      <q-btn push label="Filter" icon="filter_list" color="primary" @click="dialogFilter = true" />
    </q-btn-group>
    <q-table class="users-table" title="Monitoring RFQ" :rows="listData" :columns="columns" row-key="id"
      v-model:pagination="pagination" :loading="loading" :filter="pagination.filter" @request="onRequest"
      binary-state-sort>
      <!-- <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="pagination.filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template> -->
      <template v-slot:body-cell-no="props">
        <q-td :props="props">
          <p class="tw-font-semibold">{{
            props.pageIndex + 1
          }}</p>
        </q-td>
      </template>
      <template v-slot:body-cell-rfqh_code="props">
        <q-td :props="props">
          <p class="tw-font-bold tw-text-orange-600 tw-cursor-pointer" @click="detailRfq(props.row)">{{
            props.row.rfqh_code
          }}</p>
        </q-td>
      </template>
      <template v-slot:body-cell-rfqh_status="props">
        <q-td :props="props">
          <q-chip v-if="props.row.rfqh_status == 'Draft'" color="blue" text-color="white" dense
            :label="props.row.rfqh_status" />
          <q-chip v-if="props.row.rfqh_status == 'In Progress'" color="orange" text-color="white" dense
            :label="props.row.rfqh_status" />
          <q-chip v-if="props.row.rfqh_status == 'Close'" color="green" text-color="white" dense
            :label="props.row.rfqh_status" />
          <q-chip v-if="props.row.rfqh_status == 'Reject'" color="red" text-color="white" dense
            :label="props.row.rfqh_status" />
          <q-chip v-if="props.row.rfqh_status == 'Proses Nego'" color="purple" text-color="white" dense
            :label="props.row.rfqh_status" />
        </q-td>
      </template>
      <template v-slot:body-cell-rfqs_flag="props">
        <q-td :props="props">
          <q-chip v-if="props.row.rfqs_flag == '1'" color="blue" text-color="white" dense label="Open" />
          <q-chip v-if="props.row.rfqs_flag == '2'" color="green" text-color="white" dense label="Close" />
        </q-td>
      </template>
      <template v-slot:body-cell-aksi="props">
        <q-td :props="props">
          <q-btn-group push>
            <q-btn dense color="warning" class="text-weight-regular text-caption" @click="edit(props.row)" push
              label="Edit" icon="edit" />
          </q-btn-group>
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="dialogFormRQ">
      <q-card>
        <q-card-section>
          <div class="text-h6">Pilih Vendor</div>
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 50vh" class="scroll">
          <div class="row q-col-gutter-sm">
            <div class="col-12">
              <q-input v-model="tmpForm.kat_vend" dense outlined label="Kategori Vendor" disable />
            </div>
            <div class="col-12">
              <q-input v-model="tmpForm.duedate_penawaran" type="date" dense outlined label="Duedate Penawaran" />
            </div>
            <div class="col-12">
              <q-select dense outlined v-model="tmpForm.vendor[0]" use-input emit-value map-options input-debounce="0"
                option-value="sup_code" option-label="sup_name" label="Pilih Vendor 1" :options="listVendor">
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="col-12">
              <q-select dense outlined v-model="tmpForm.vendor[1]" use-input emit-value map-options input-debounce="0"
                option-value="sup_code" option-label="sup_name" label="Pilih Vendor 2" :options="listVendor">
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="col-12">
              <q-select dense outlined v-model="tmpForm.vendor[2]" use-input emit-value map-options input-debounce="0"
                option-value="sup_code" option-label="sup_name" label="Pilih Vendor 3" :options="listVendor">
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="col-12">
              <q-select dense outlined v-model="tmpForm.vendor[3]" use-input emit-value map-options input-debounce="0"
                option-value="sup_code" option-label="sup_name" label="Pilih Vendor 4" :options="listVendor">
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="col-12">
              <q-select dense outlined v-model="tmpForm.vendor[4]" use-input emit-value map-options input-debounce="0"
                option-value="sup_code" option-label="sup_name" label="Pilih Vendor 5" :options="listVendor">
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <!-- <div class="col-12">
              <q-btn size="small" icon="add" color="primary" @click="addTmpMail" />
            </div> -->
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn flat label="Batal" color="primary" v-close-popup />
          <q-btn flat label="Simpan" color="primary" @click="saveRQ" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogFilter" persistent>
      <q-card style="width: 800px">
        <q-card-section>
          <div class="text-h6">Filter Data</div>
        </q-card-section>

        <q-card-section class="scroll">
          <div class="row q-col-gutter-sm">
            <!-- <div class="col-6">
              <q-input outlined dense v-model="tmpFilter.tgl_from" type="date" label="Tgl Buat" />
            </div>
            <div class="col-6">
              <q-input outlined dense v-model="tmpFilter.tgl_to" type="date" label="To" />
            </div> -->
            <div class="col-6">
              <q-input outlined dense v-model="tmpFilter.no_rfq" label="No RFQ" clearable />
            </div>
            <div class="col-6">
              <q-select outlined v-model="tmpFilter.type" dense emit-value clearable
                :options="[{ label: 'Repeat', value: 'Repeat' }, { label: 'Sipil', value: 'Sipil' }, { label: 'Normal', value: 'Normal' }, { label: 'NonSipil', value: 'NonSipil' }, { label: 'Split', value: 'Split' }]"
                label="Type" />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn color="primary" label="Search" class="full-width" icon="filter_list" @click="getData" />
          <q-btn flat color="primary" class="full-width tw-mt-2" label="Close" @click="dialogFilter = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <DetailRfqNormal v-if="dialogRfqNormal" :dialog="dialogRfqNormal" :data="tmpData" @close="dialogRfqNormal = false"
      @setData="refreshData"></DetailRfqNormal>
    <DetailRfqNonSipil v-if="dialogRfqNonSipil" :dialog="dialogRfqNonSipil" :data="tmpData"
      @close="dialogRfqNonSipil = false" @setData="refreshData"></DetailRfqNonSipil>
    <DetailRfqSipil v-if="dialogRfqSipil" :dialog="dialogRfqSipil" :data="tmpData" @close="dialogRfqSipil = false"
      @setData="refreshData"></DetailRfqSipil>
    <DetailRfqSplit v-if="dialogRfqSplit" :dialog="dialogRfqSplit" :data="tmpData" @close="dialogRfqSplit = false"
      @setData="refreshData"></DetailRfqSplit>
    <DetailRfqRepeat v-if="dialogRfqRepeat" :dialog="dialogRfqRepeat" :data="tmpData" @close="dialogRfqRepeat = false"
      @setData="refreshData"></DetailRfqRepeat>

  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import axios from "axios";
import { ParseError, domain, empid, hasDuplicate, dateOnly, npwp, formatDate, suppCode, } from "./../../utils";
import { useQuasar } from "quasar";
import DetailRfqNormal from "./../../components/DetailRfqNormal.vue";
import DetailRfqNonSipil from "./../../components/DetailRfqNonSipil.vue";
import DetailRfqSipil from "./../../components/DetailRfqSipil.vue";
import DetailRfqSplit from "./../../components/DetailRfqSplit.vue";
import DetailRfqRepeat from "./../../components/DetailRfqRepeat.vue";

const columns = ref([
  {
    name: "no",
    required: true,
    label: "No",
    align: "left",
    field: "no",
    sortable: false,
    sort: true,
  },
  {
    name: "rfqh_code",
    required: true,
    label: "No RFQ",
    align: "left",
    field: "rfqh_code",
    sortable: false,
    sort: true,
  },
  {
    name: "tgl_buat",
    required: true,
    label: "Tgl Buat",
    align: "left",
    field: "tgl_buat",
    sortable: false,
    sort: true,
    format: (val, row) => `${formatDate(val)}`,

  },
  {
    name: "jumlah_item",
    required: true,
    label: "Jumlah Item",
    align: "left",
    field: "jumlah_item",
    sortable: false,
    sort: true,
  },
  {
    name: "rfqh_type",
    required: true,
    label: "Type",
    align: "left",
    field: "rfqh_type",
    sortable: false,
    sort: true,
  },
  {
    name: "rfqh_status",
    required: true,
    label: "Status RFQ",
    align: "left",
    field: "rfqh_status",
    sortable: false,
    sort: true,
  },
  {
    name: "pic_pricing_name",
    required: true,
    label: "PIC Princing",
    align: "left",
    field: "pic_pricing_name",
  },
  {
    name: "rfqs_flag",
    required: true,
    label: "Status Proses",
    align: "left",
    field: "rfqs_flag",
  },

]);
const $q = useQuasar();
const listData = ref([]);
const listVendor = ref([]);
const tmpMail = ref([])
const loading = ref(false);
const dialogFormRQ = ref(false);
const dialogRfqNormal = ref(false);
const dialogRfqNonSipil = ref(false);
const dialogRfqSipil = ref(false);
const dialogRfqSplit = ref(false);
const dialogRfqRepeat = ref(false);
const dialogFilter = ref(false);
const dialogPrintPraRo = ref(false);
const tmpFilter = ref({
  no_rfq: null,
  type: null,
  status: null,
  tgl_from: dateOnly(),
  tgl_to: dateOnly(),
});
const selected = ref([])
const tmpData = ref({});
const tmpSort = ref([
  {
    field: 'trh_depart_ro',
    value: 'asc',
  },
  {
    field: 'rqm_req_date',
    value: 'asc',
  }
]);
const tmpForm = reactive({
  domain: domain(),
  empid: empid(),
  kat_vend: null,
  duedate_penawaran: dateOnly(),
  vendor: [],
  ro: [],
});
const pagination = ref({
  sortBy: "rfqh_code",
  descending: false,
  page: 1,
  rowsPerPage: 5,
  rowsNumber: 10,
  filter: null,
  npwp: npwp(),
});

const getData = async () => {
  try {
    loading.value = true;
    const res = await axios.get(`${import.meta.env.VITE_API_ETENDER}listMonitoringRfqVend`, {
      params: { ...pagination.value, ...tmpFilter.value, ...{ sort: tmpSort.value, vend: suppCode() } },
    });
    listData.value = res.data.data;
    pagination.value.rowsNumber = res.data.total;
    loading.value = false;
    dialogFilter.value = false
  } catch (error) {
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const edit = (value) => {
  tmpForm.id = value.sup_id
  tmpForm.kode = value.sup_code
  tmpMail.value = []
  let tMail = value.sup_email.split(';')
  for (const iterator of tMail) {
    tmpMail.value.push(iterator)
  }
  dialogForm.value = true
}

const setDataFilter = async (value) => {
  pagination.value.domain = value.filter.bu
  tmpFilter.value = value.filter
  tmpSort.value = value.sort
  await getData()
  dialogFilter.value = false
}

const onRequest = (props) => {
  const { page, rowsPerPage, sortBy, descending, filter } = props.pagination;
  pagination.value.filter = filter;
  pagination.value.page = page;
  pagination.value.rowsPerPage = rowsPerPage;
  pagination.value.sortBy = sortBy;
  pagination.value.descending = descending;
  getData();
};

const detailRfq = async (value) => {
  tmpData.value = value
  if (value.rfqh_type === "Normal") {
    dialogRfqNormal.value = true
  }
  else if (value.rfqh_type === "NonSipil") {
    dialogRfqNonSipil.value = true
  }
  else if (value.rfqh_type === "Sipil") {
    dialogRfqSipil.value = true
  }
  else if (value.rfqh_type === "Split") {
    dialogRfqSplit.value = true
  }
  else if (value.rfqh_type === "Repeat") {
    dialogRfqRepeat.value = true
  }
}

const getListVendor = async () => {
  try {
    loading.value = true;
    const res = await axios.get(`${import.meta.env.VITE_API_ETENDER}listVendor`, {
      params: {
        domain: domain(),
        rowsPerPage: 100,
        page: 1
      },
    });
    listVendor.value = res.data.data
    loading.value = false;
  } catch (error) {
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const addRQ = async () => {
  if (selected.value.length === 0) {
    $q.notify({
      type: "negative",
      message: 'Silakan pilih RO terlebih dahulu',
    });
    return;
  }
  dialogFormRQ.value = true
  await getListVendor()
}

const reset = () => {
  tmpForm.domain = domain()
  tmpForm.empid = empid()
  tmpForm.kat_vend = null
  tmpForm.duedate_penawaran = dateOnly()
  tmpForm.vendor = []
  tmpForm.ro = []

}

const saveRQ = async () => {
  tmpForm.ro = selected.value
  let duplicate = await hasDuplicate(tmpForm.vendor)
  if (duplicate) {
    $q.notify({
      type: "negative",
      message: 'Terdapat duplikasi data vendor, silakan di cek kembali',
    });
    return;
  }
  await axios.post(`${import.meta.env.VITE_API_ETENDER}saveRQ`, tmpForm)
  dialogFormRQ.value = false
  await getData()
  reset()
}

const refreshData = async () => {
  await getData()
  dialogRfqNormal.value = false
  dialogRfqNonSipil.value = false
  dialogRfqSipil.value = false
  dialogRfqSplit.value = false
  dialogRfqRepeat.value = false
}

document.addEventListener("etrasn_setdomain", () => {
  pagination.value.domain = domain();
  getData();
});

onMounted(() => {
  onRequest({
    pagination: pagination.value,
  });
});
</script>