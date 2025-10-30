<template>
  <div class="q-pa-md">
    <q-card>
      <q-card-section>
        <q-btn-group push>
          <q-btn push color="primary" label="Tambah Data" @click="addPICApproval" />
        </q-btn-group>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          title="PIC Approval Harga Transporter"
          :rows="listPICApproval"
          :columns="columns"
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
              <q-btn-group push>
                <q-btn
                  dense
                  color="warning"
                  class="text-weight-regular text-caption"
                  @click="editPICApproval(props.row)"
                  push
                  label="Edit"
                  icon="edit"
                />
                <q-btn
                  dense
                  color="negative"
                  class="text-weight-regular text-caption"
                  @click="deletePICApproval(props.row)"
                  push
                  label="Hapus"
                  icon="delete"
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
          <div class="text-h6">Form PIC Approval</div>
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 80vh" class="scroll">
        <Form
        :validation-schema="schema1"
        @submit="savePICApproval"
        class="q-mt-md"
        >             
          <div class="row q-col-gutter-sm">
            <div class="col-6">    
              <Field
                  v-model="tmpForm.site"
                  name="site"
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
                  label="Pilih Site"
                  :options="listSite"     
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
                  v-model="tmpForm.level"
                  name="level"
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
                  label="Pilih Level"                
                  :options="listLevel"
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
  
            <div class="col-12">            
              <q-input v-model="tmpForm.keterangan" dense outlined label="Keterangan" req />
            </div>
  
            <div class="col-12">
              <Field
                  v-model="tmpForm.nik"
                  name="nik"
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
                  option-value="nik"
                  option-label="nik"
                  label="NIK"                
                  :options="listUser"
                  :error-message="errorMessage"
                  :error="!!errorMessage"    
                  :model-value="value"  
                  @blur="getHrisByNIK"
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
              <q-input v-model="tmpForm.nama" dense outlined label="Nama" req />
            </div>

            <div class="col-12">
              <q-input v-model="tmpForm.email" dense outlined label="Email" req />
            </div>

            <div class="col-12">
              <q-input v-model="tmpForm.posisi" dense outlined label="Posisi" req readonly />
            </div>

            <div class="col-12" hidden>
                <q-input v-model="tmpForm.DOUser" label="User" />
            </div>

            <!-- <div class="col-12">
                <q-checkbox right checked v-model="tmpForm.aktif" label="Aktif" />
            </div>            -->

            <div class="col-12 tw-pt-5" align="right">
                <q-btn
                  unelevated
                  rounded
                  v-close-popup
                  color="warning"
                  label="Cancel"                  
                />
                <q-btn
                  unelevated
                  rounded
                  color="primary"
                  label="Simpan"
                  type="submit"
                />
            </div>

          </div>

        </Form>
        </q-card-section>
        <q-separator />
        <!-- <q-card-actions align="right"> -->
          <!-- <q-btn flat label="Batal" color="primary" v-close-popup /> -->
          <!-- <q-btn flat label="Simpan" color="primary" @click="saveMappingRegion" /> -->
        <!-- </q-card-actions> -->
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogForm_EDIT">
      <q-card>
        <q-card-section>
          <div class="text-h6">Form PIC Approval</div>
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 80vh" class="scroll">
        <Form
        :validation-schema="schema1"
        @submit="saveEditPICApproval"
        class="q-mt-md"
        >             
          <div class="row q-col-gutter-sm">
            <div class="col-6">    
              <Field
                  v-model="tmpForm.site"
                  name="site"
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
                  label="Pilih Site"
                  :options="listSite"     
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
                  v-model="tmpForm.level"
                  name="level"
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
                  label="Pilih Level"                
                  :options="listLevel"
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
  
            <div class="col-12">            
              <q-input v-model="tmpForm.keterangan" dense outlined label="Keterangan" req />
            </div>
  
            <div class="col-12">
              <Field
                  v-model="tmpForm.nik"
                  name="nik"
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
                  option-value="nik"
                  option-label="nik"
                  label="NIK"                
                  :options="listUser"
                  :error-message="errorMessage"
                  :error="!!errorMessage"    
                  :model-value="value"  
                  @blur="getHrisByNIK"
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
              <q-input v-model="tmpForm.nama" dense outlined label="Nama" req />
            </div>

            <div class="col-12">
              <q-input v-model="tmpForm.email" dense outlined label="Email" req />
            </div>

            <div class="col-12">
              <q-input v-model="tmpForm.posisi" dense outlined label="Posisi" req readonly />
            </div>

            <div class="col-12" hidden>
                <q-input v-model="tmpForm.DOUser" label="User" />
            </div>

            <!-- <div class="col-12">
                <q-checkbox right checked v-model="tmpForm.aktif" label="Aktif" />
            </div>            -->

            <div class="col-12 tw-pt-5" align="right">
                <q-btn
                  unelevated
                  rounded
                  v-close-popup
                  color="warning"
                  label="Cancel"                  
                />
                <q-btn
                  unelevated
                  rounded
                  color="primary"
                  label="Simpan"
                  type="submit"
                />
            </div>

          </div>

        </Form>
        </q-card-section>
        <q-separator />
        <!-- <q-card-actions align="right"> -->
          <!-- <q-btn flat label="Batal" color="primary" v-close-popup /> -->
          <!-- <q-btn flat label="Simpan" color="primary" @click="saveMappingRegion" /> -->
        <!-- </q-card-actions> -->
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

const columns = [
    {
      name: "buname",
      required: true,
      label: "Business Unit",
      align: "left",
      field: "buname",
      sortable: true,
    },
    {
      name: "site_approve_harga",
      required: true,
      label: "Site",
      align: "left",
      field: "site_approve_harga",
      sortable: true,
    },
    {
      name: "level_approve_harga",
      required: true,
      label: "Level",
      align: "left",
      field: "level_approve_harga",
      sortable: true,
    },
    {
      name: "ket_approve_harga",
      required: true,
      label: "Keterangan",
      align: "left",
      field: "ket_approve_harga",
      sortable: true,
    },
    {
      name: "nik_approve_harga",
      required: true,
      label: "NIK",
      align: "left",
      field: "nik_approve_harga",
      sortable: true,
    },
    {
      name: "nama_approve_harga",
      required: true,
      label: "Nama",
      align: "left",
      field: "nama_approve_harga",
      sortable: true,
    },
     {
      name: "email_approve_harga",
      required: true,
      label: "Email",
      align: "left",
      field: "email_approve_harga",
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
      name: "aksi",
      required: true,
      label: "Aksi",
      align: "left",
      field: "aksi",
    },
];
const $q = useQuasar();
const listPICApproval = ref([]);
const listLevel = ref(["1","2","3","4","5","6","7","8","9","10"]);
const listNIK = ref([]);
const listUser = ref([]);
const listSite = ref([]);

const right = ref(false);

const loading = ref(false);
const dialogForm = ref(false);
const dialogForm_EDIT = ref(false);
const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10,
  filter: null,
  domain: domain(),
});

const schema1 = yup.object({
    site: yup.string().required().label("Site")
                 .typeError("Site Tidak Boleh Kosong"),
    level: yup.string().required().label("Level")
                 .typeError("Level Tidak Boleh Kosong"),
    nik: yup.string().required().label("NIK")
                 .typeError("NIK Tidak Boleh Kosong"),
});

const tmpForm = reactive({    
  site  : null,
  level : null,
  keterangan : null,
  nik : null,
  nama : null,
  email : null,
  posisi : null,
  DOUser: empid(),  
  domain: domain(),
});

const getPICApproval = async () => {
  try {
    loading.value = true;    
    console.log(pagination.value);
    const res = await axios.get("getPICApproval", {
      params: pagination.value,      
    //   params: {
    //     params: pagination.value,
    //     empid: empid(),
    //   },
    });    
    listPICApproval.value = res.data.data1.data;    
    listSite.value = res.data.data2;
    listUser.value = res.data.data3;  
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

const getHrisByNIK = async () => {
  try {
    $q.loading.show();
    const res = await axios.get("getHrisByNIK", {
      params: {
        nik: tmpForm.nik,
      },
    });
    console.log(res.data.data.user_name)
    
    tmpForm.nama = res.data.data.user_name;
    tmpForm.email = res.data.data.user_email;
    tmpForm.posisi = res.data.posisi;
    tmpForm.empid = res.data.data.emp_id;
    $q.loading.hide();
  } catch (error) {
    $q.loading.hide();
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const addPICApproval = async () => {
  dialogForm.value = true;
  reset();
};

const editPICApproval = (value) => {  
  // console.log(value);
  dialogForm_EDIT.value = true;
  tmpForm.site        = value.site_approve_harga;
  tmpForm.level       = value.level_approve_harga;  
  tmpForm.keterangan  = value.ket_approve_harga;  
  tmpForm.nik         = value.nik_approve_harga;  
  tmpForm.nama      = value.nama_approve_harga;  
  tmpForm.email     = value.email_approve_harga;  
  tmpForm.DOUser    = empid();
  tmpForm.id        = value.id_approve_harga;  
};

const deletePICApproval = async (value) => {
  $q.dialog({
    title: "Konfirmasi",
    // message: `Apakah anda yakin ingin menghapus  <span class="tw-font-bold">${value.kota_region}</span>`,
    message: `Apakah anda yakin ingin menghapus data ini?`,
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
      await axios.post("deletePICApproval", value);
      $q.notify({
        type: "positive",
        // message: `Menu <span class="tw-font-bold">${value.kota_region}</span> berhasil dihapus`,
        message: `Data berhasil dihapus`,
        html: true,
      });
      await getPICApproval();
    } catch (error) {
      $q.notify({
        type: "negative",
        message: ParseError(error),
      });
    }
  });
};

const savePICApproval = async () => {
  try {
    const res = await axios.post("savePICApproval", tmpForm);
    dialogForm.value = false;
    reset();    

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

const saveEditPICApproval = async () => {
  try {
    
    const res = await axios.post("saveEditPICApproval", tmpForm);
    dialogForm_EDIT.value = false;
    reset();
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

const reset = () => {
  tmpForm.site = null;
  tmpForm.level = null;
  tmpForm.keterangan = null;
  tmpForm.nik = null;
  tmpForm.nama = null;
  tmpForm.email = null;
  tmpForm.aktif = null;
  tmpForm.posisi = null;
  // tmpForm.DOUser = null;
  tmpForm.id = null;  
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
  getPICApproval();
  // console.log(empid());
};

onMounted(() => {
  onRequest({
    pagination: pagination.value,
  });
});

document.addEventListener("etrasn_setdomain",() =>{     
  pagination.value.domain = domain();
  getPICApproval();  
});
</script>