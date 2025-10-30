<template>
  <div class="q-pa-md">
    <q-card>
      <q-card-section>
        <q-btn-group push>
          <q-btn push color="primary" label="Tambah Data" @click="addMappingRegion" />
        </q-btn-group>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          title="Data Mapping Region"
          :rows="listMappingRegion"
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
                  @click="editMappingRegion(props.row)"
                  push
                  label="Edit"
                  icon="edit"
                />
                <q-btn
                  dense
                  color="negative"
                  class="text-weight-regular text-caption"
                  @click="deleteMappingRegion(props.row)"
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
          <div class="text-h6">Form Mapping Region</div>
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 60vh" class="scroll">
        <Form
        :validation-schema="schema1"
        @submit="saveMappingRegion"
        class="q-mt-md"
        >             
          <div class="row q-col-gutter-sm">
            <div class="col-12">    
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
                option-value="tmp_xxakrute_tujuan"
                option-label="tmp_xxakrute_tujuan"
                label="Pilih Kota Tujuan"                
                :options="listKota"     
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
                label="Region"                
                :options="listRegion"    
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
                option-value="code"
                option-label="desc"
                label="Site"
                v-bind="field"
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

            <div class="col-12">
                <q-input v-model="tmpForm.domain" label="domain" />
            </div>

            <div class="col-12" hidden>
                <q-input v-model="tmpForm.DOUser" label="User" />
            </div>

            <div class="col-12">
                <q-checkbox right checked v-model="tmpForm.aktif" label="Aktif" />
            </div>

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
          <div class="text-h6">Form Edit Mapping Region</div>
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 50vh" class="scroll">
          <div class="row q-col-gutter-sm">
            <div class="col-12">
              <q-select
                dense
                outlined
                v-model="tmpForm.kotatujuan"
                use-input
                emit-value
                map-options
                input-debounce="0"
                option-value="tmp_xxakrute_tujuan"
                option-label="tmp_xxakrute_tujuan"
                label="Pilih Kota Tujuan"
                :options="listKota"
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
            </div>

            <div class="col-12">
              <q-select
                dense
                outlined
                v-model="tmpForm.region"
                use-input
                emit-value
                map-options
                input-debounce="0"
                option-value="kodemstr"
                option-label="descmstr"
                label="Region"
                :options="listRegion"
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

            <div class="col-12">
              <q-select
                dense
                outlined
                v-model="tmpForm.site"
                use-input
                emit-value
                map-options
                input-debounce="0"
                option-value="code"
                option-label="desc"
                label="Site"
                :options="listSite"
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

            <div class="col-12" hidden>
                <q-input v-model="tmpForm.DOUser" label="User" />
            </div>

            <div class="col-12">
                <q-checkbox right v-model="tmpForm.aktif" label="Aktif" />
            </div>

          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn flat label="Batal" color="primary" v-close-popup />
          <q-btn flat label="Simpan" color="primary" @click="saveEditMappingRegion" />
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

const columns = [
  {
    name: "bu_region",
    required: true,
    label: "Business Unit",
    align: "left",
    field: "name",
    sortable: true,
  },
  {
    name: "site_region",
    required: true,
    label: "Site",
    align: "left",
    field: "desc",
    sortable: true,
  },
  {
    name: "kota_region",
    required: true,
    label: "Kota Tujuan",
    align: "left",
    field: "kota_region",
    sortable: true,
  },
  {
    name: "region_name",
    required: true,
    label: "Region",
    align: "left",
    field: "region_name",
    sortable: true,
  },
  {
    name: "status_region",
    required: true,
    label: "Aktif",
    align: "left",
    field: "status_region",
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
const listMappingRegion = ref([]);
// const listKota = ref(["Kota1","Kota2","Kota3"]);
// const listRegion = ref(["Region1","Region2","Region3"]);
const listKota = ref([]);
const listRegion = ref([]);
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
    kotatujuan: yup.string().required().label("Kota Tujuan")
                 .typeError("Kota Tujuan Tidak Boleh Kosong"),
    region: yup.string().required().label("Region")
                 .typeError("Region Tidak Boleh Kosong"),
    site: yup.string().required().label("Site")
                 .typeError("Site Tidak Boleh Kosong"),
});

const tmpForm = reactive({
  id: null,
  kotatujuan: null,
  region: null,
  aktif: null,
  site:null,
  DOUser: empid(), 
  domain: domain(), 
});

const getMappingRegion = async () => {
  try {
    loading.value = true;    
    // console.log(pagination.value);
    // console.log(domain())
    const res = await axios.get("getMappingRegion", {
      params: pagination.value,      
    //   params: {
    //     params: pagination.value,
    //     empid: empid(),
    //   },
    });    
    listMappingRegion.value = res.data.data1.data;    
    listKota.value = res.data.data2;   
    listRegion.value = res.data.data3;
    listSite.value = res.data.data4;
    tmpForm.domain = domain();

    // console.log(res.data.data2);
    // console.log(res.data.data3);
    console.log(res.data.data1.meta);
    pagination.value.rowsNumber = res.data.data1.meta.total;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const addMappingRegion = async () => {
  dialogForm.value = true;
  reset();
};

const editMappingRegion = (value) => {  
  dialogForm_EDIT.value = true;
  tmpForm.kotatujuan = value.kota_region;
  tmpForm.region    = value.region;  
  if(value.status_region == 'Aktif'){
      tmpForm.aktif = ref(true)
  }else{
      tmpForm.aktif = ref(false)
  }
  tmpForm.DOUser    = empid();
  tmpForm.id        = value.id_region;
  tmpForm.site      = value.site_region;
};

const deleteMappingRegion = async (value) => {
  $q.dialog({
    title: "Konfirmasi",
    message: `Apakah anda yakin ingin menghapus Mapping Region Kota <span class="tw-font-bold">${value.kota_region}</span>`,
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
      await axios.post("deleteMappingRegion", value);
      $q.notify({
        type: "positive",
        message: `Menu <span class="tw-font-bold">${value.kota_region}</span> berhasil dihapus`,
        html: true,
      });
      await getMappingRegion();
    } catch (error) {
      $q.notify({
        type: "negative",
        message: ParseError(error),
      });
    }
  });
};

const saveMappingRegion = async () => {
  try {
    $q.loading.show();
    console.log(domain());
    const res = await axios.post("saveMappingRegion", tmpForm);
    dialogForm.value = false;
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
};

const saveEditMappingRegion = async () => {
  try {
    $q.loading.show();
    const res = await axios.post("saveEditMappingRegion", tmpForm);
    dialogForm_EDIT.value = false;
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
};

const reset = () => {
  tmpForm.kotatujuan = null;
  tmpForm.region = null;
  tmpForm.aktif = null;
  tmpForm.id = null;
  tmpForm.site = null;
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
  getMappingRegion();
};

onMounted(() => {
  onRequest({
    pagination: pagination.value,
  });
});

document.addEventListener("etrasn_setdomain",() =>{     
  console.log(domain());
  pagination.value.domain = domain();
  getMappingRegion();  
});
</script>