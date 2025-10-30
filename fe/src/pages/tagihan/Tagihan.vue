<template>
  <div class="q-pa-md">
    <q-card>
      <q-separator />

      <q-card-section>
        <div class="row q-col-gutter-md tw-mb-5">
          <div class="col-12 col-md-12">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-select dense outlined v-model="pagination.trans_flag" clearable emit-value map-options input-debounce="0"
                  option-value="trans_flag" option-label="trans_flag_desc" label="Status Tagihan" :options="listDataDetail"
                  @filter="filterFn">
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No results
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <div class="col-12 col-md-4">
                <q-input type="text" v-model="pagination.trans_code" dense outlined label="No. Tagihan" />
              </div>
              <div class="col-12 col-md-4">
                <q-input type="text" v-model="pagination.tt_no" dense outlined label="No. Tanda Terima" />
              </div>
              <div class="col-12 col-md-4">
                <q-input type="text" v-model="pagination.po_no" dense outlined label="No. PO" />
              </div>
              <div class="col-12 col-md-4">
                <q-input type="text" v-model="pagination.inv_no" dense outlined label="No. Invoice" />
              </div>
              <div class="col-12 col-md-4">
                <q-input label="Tanggal Buat" outlined dense v-model="pagination.target_to">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="pagination.target_to" mask="YYYY-MM-DD" @update:model-value="hideDate">
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-12">
                <q-btn-group push>
                  <q-btn push color="green" label="Tambah Tagihan" @click="addPengajuanHarga" />
                  <q-btn push color="primary" label="Filter Data" @click="getListTagihan" />
                </q-btn-group>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <q-table title="List Tagihan" :columns="columns" :rows="listDataHeader" row-key="id"
          v-model:pagination="pagination" :loading="loading" :filter="pagination.filter" @request="onRequest"
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
              <!-- {{ props }} -->
              <!-- {{props.row.status }} -->
              <q-btn-group v-if="props.row.trans_flag_desc === 'Check Finance' || props.row.trans_flag_desc === 'Approve Finance' || props.row.trans_flag_desc === 'Revisi AP'" push>
                <q-btn dense color="info" class="text-weight-regular text-caption"
                @click="router.push(`/tagihanedit/${props.row.trans_code}`)" push label="Preview" icon="visibility" />
              </q-btn-group>

              <q-btn-group v-if="props.row.trans_flag_desc === 'Revisi Finance'" push>
                <q-btn dense color="grey" class="text-weight-regular text-caption" @click="router.push(`/tagihanedit/${props.row.trans_code}`)" push label="Edit"
                  icon="edit" />
              </q-btn-group>

              <q-btn-group v-if="props.row.trans_flag_desc === 'Tagihan Pending'" push>
                <q-btn dense color="grey" class="text-weight-regular text-caption" @click="router.push(`/tagihanedit/${props.row.trans_code}`)" push label="Edit"
                  icon="edit" />
                <q-btn dense color="negative" class="text-weight-regular text-caption"
                  @click="deleteTagihan(props.row)" push label="Hapus" icon="delete" />
              </q-btn-group>
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

              <div class="col-12 tw-mt-3">
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
                    <!-- {{ props }} -->
                    <!-- {{props.row.status }} -->
                    <q-btn-group push>
                      <q-btn dense color="info" class="text-weight-regular text-caption" 
                        @click="redirect2(props.row)" push label="Detail" icon="visibility" />
                    </q-btn-group>
                  </q-td>
                </template>
              </q-table>
            </div>

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
import dayjs from "dayjs";


const money = {
  decimal: ',',
  thousands: '.',
  // prefix: 'Rp ',
  precision: 0,
  masked: false /* doesn't work with directive */
}



const columns = [
  {
    name: "trans_flag_desc",
    required: true,
    label: "Status Tagihan",
    align: "left",
    field: "trans_flag_desc",
    sortable: true,
  },
  {
    name: "trans_code",
    required: true,
    label: "No. Tagihan",
    align: "left",
    field: "trans_code",
    sortable: true,
  },
  {
    name: "bu_name",
    required: true,
    label: "Perusahaan",
    align: "left",
    field: "bu_name",
    sortable: true,
  },
  {
    name: "trans_tandaterima",
    required: true,
    label: "No. Tanda Terima",
    align: "left",
    field: "trans_tandaterima",
    sortable: true,
  },
  {
    name: "created_date",
    required: true,
    label: "Tanggal Buat",
    align: "left",
    field: "created_date",
    format: val => dayjs(`${val}`).format("YYYY-MM-DD"),
    sortable: true,
  },    
  {
    name: "trans_due_date",
    required: true,
    label: "Jatuh Tempo",
    align: "left",
    field: "trans_due_date",
    // format: val => dayjs(`${val}`).format("YYYY-MM-DD"),
    sortable: true,
  },
  {
    name: "dtl_inv_finaltotal_format",
    required: true,
    label: "Nominal",
    align: "right",
    field: "dtl_inv_finaltotal_format",
    sortable: true,
  },
  {
    name: "aksi",
    required: true,
    label: "Action",
    align: "left",
    field: "aksi",
  },
  {
    name: "print",
    required: true,
    label: "Print",
    align: "left",
    field: "print",
  },
];

const columnspo = [
  {
    name: "po_number",
    required: true,
    label: "PO Number",
    align: "left",
    field: "po_number",
    sortable: true,
  },
  {
    name: "po_date",
    required: true,
    label: "Order Date",
    align: "left",
    field: "po_date",
    sortable: true,
  },
  {
    name: "ppn",
    required: true,
    label: "PPN",
    align: "left",
    field: "ppn",
    sortable: true,
  },
  {
    name: "po_amount",
    required: true,
    label: "PO Amount",
    align: "right",
    field: "po_amount",
    format: val => parseFloat(val).toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    sortable: true,
  },
  {
    name: "no_mrr",
    required: true,
    label: "No. MRR",
    align: "left",
    field: "no_mrr",
    sortable: true,
  },
  {
    name: "tgl_mrr",
    required: true,
    label: "Tgl. Mrr",
    align: "left",
    field: "tgl_mrr",
    sortable: true,
  },
  {
    name: "mrr_amount",
    required: true,
    label: "Ttl Mrr Amount",
    align: "right",
    field: "mrr_amount",
    format: val => parseFloat(val).toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    sortable: true,
  },
  {
    name: "no_sj",
    required: true,
    label: "No. SJ",
    align: "left",
    field: "no_sj",
    sortable: true,
  },
  {
    name: "action",
    required: true,
    label: "Action",
    align: "left",
    field: "action",
  },
];

const $q = useQuasar();
const listDataHeader = ref([]);
const listDataDetail = ref([]);
const listBU = ref([]);
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
  trans_flag: null,
  trans_code: null,
  // created_date: dateOnly(),
  po_no: null,
  inv_no: null,
  tt_no: null,
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

const GiveitDisable = ref(false);

const getSelectedString = () => {
        return selected.value.length === 0 ? '' : `${selected.value.length} record${selected.value.length > 1 ? 's' : ''} selected`
}

const saveTagihan = async () => {
  try {
    $q.loading.show();
    const res = await axios.post("tambahtagihansimpan", {
          empid : tmpForm.DOUser,
          po_table : selected.value,
          domain : tmpForm.bussinessunit,
          po_number : tmpForm.po_number
    });
    dialogForm.value = false;
    getListTagihan();
    listMrrPO2.value = []

    if(res.data[0].msg === "Data Saved Successfully") {
      $q.notify({
        type: "positive",
        message: "Data Tagihan Berhasil Disimpan",
      });
      router.push('/tagihanedit/'+res.data[0].val)
    } else {
      $q.notify({
        type: "negative",
        message: res.data,
      });
    }
    
    $q.loading.hide();
  } catch (error) {
    $q.loading.hide();
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
}


const redirect = (data) => {
  let codeget = btoa(DataVendor[0].sup_name + 'L' + data.trans_due_date) + ':' + btoa(DataVendor[0].sup_code) + ':' + btoa(data.trans_tandaterima_src)
  let code = codeget + '&val=' + btoa(DataVendor[0].sup_name) + '&val2=' + data.dtl_inv_finaltotal + '&val3=0'

  let routeData = import.meta.env.VITE_FINSYS_LINK+'print_ttfa?code='+code  
  window.open(routeData, '_blank', 'noreferrer')
}
const redirect2 = (data) => {
  let routeData = import.meta.env.VITE_EPO_LINK+'#/podetail_pdf/'+data.domain+'/'+data.po_number
  window.open(routeData, '_blank', 'noreferrer');
};

const filterFnPO = async (val, update, abort) => {
  update(async () => {
    search.value = val;
    await getPOFilter();
  });
};

const getPOFilter = async (data) => {
  try {
    loading.value = true;
    // console.log(listTagihan.value.bu_domain)
    const res = await axios.get("getPOFilter", {
        params: {
          site : 'multiple',
          domain : tmpForm.bussinessunit,
          empid :  tmpForm.DOUser,
          search : search.value
        },
    });
    listPO2.value = res.data.data
    loading.value = false;
  } catch (error) {
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
}

const getPO = async (data) => {
  try {
    loading.value = true;
    const res = await axios.get("getPO", {
        params: {
          site : 'multiple',
          domain : data,
          empid : tmpForm.DOUser,
        },
    });
    listPO2.value = res.data.data
    loading.value = false;
  } catch (error) {
    loading.value = false;
    listPO2.value = [];
    listMrrPO2.value = [];
    tmpForm.po_number = '';
    $q.notify({
      type: "negative",
      message: "PO tidak tersedia pada perusahaan ini",
    });
  }
};

const getPOMrr = async (data) => {
  try {
    loading.value = true;
    const res = await axios.get("getPOMrr", {
        params: {
          po_number: data.po_number,
          empid : data.DOUser,
          domain : data.bussinessunit
        },
    });
    selected.value = [];
    listMrrPO2.value = res.data.data;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    listMrrPO2.value = null
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const save = async () => {

  if (tmpData.value.length == 0) {
    alert('data detail belum di isi')
    return;
  }
  tmpForm.detail = tmpData.value

  try {
    $q.loading.show();
    const res = await axios.post("savePengajuanHarga", tmpForm);
    dialogForm.value = false;
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

const tmpForm = reactive({
  bussinessunit: null,
  po_number: null,
  DOUser: empid(),
});

const getListTagihan = async () => {
  try {
    loading.value = true;
    const res = await axios.get("getListTagihan", {
      params: pagination.value,
      //   params: {
      //     params: pagination.value,
      //     empid: empid(),
      //   },
    });
    listBU.value = res.data.data1;
    listDataHeader.value = res.data.data2;
    listDataDetail.value = res.data.data3;
    DataVendor.push(res.data.data4[0]);
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

const addPengajuanHarga = async () => {
  dialogForm.value = true;
  reset();
};

const deleteTagihan = async (value) => {
  $q.dialog({
    title: "Konfirmasi",
    // message: `Apakah anda yakin ingin menghapus  <span class="tw-font-bold">${value.kota_region}</span>`,
    message: `Apakah anda yakin ingin menghapus data tagihan ini?`,
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
      await axios.post("deleteTagihan", value);
      $q.notify({
        type: "positive",
        // message: `Menu <span class="tw-font-bold">${value.kota_region}</span> berhasil dihapus`,
        message: `Data Tagihan Berhasil Dihapus`,
        html: true,
      });
      await getListTagihan();
    } catch (error) {
      $q.notify({
        type: "negative",
        message: ParseError(error),
      });
    }
  });
};

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
  getListTagihan();
  // console.log(empid());
};

onMounted(() => {
  onRequest({
    pagination: pagination.value,
  });
});

document.addEventListener("etrasn_setdomain", () => {
  pagination.value.domain = domain();
  getListTagihan();
});

</script>