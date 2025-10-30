<template>
    <q-page class="q-pa-lg">
        <q-card class="my-card">
            <div class="q-gutter-y-md">
            <q-card-section class="q-mx-xs">
                <div class="q-mt-sm q-mb-sm q-mb-md">
                    <!-- <divider title="FORM KONTAK PERSON" /> -->
                    <span class="text-indigo-10 tw-text-xl text-bold">FORM KONTAK PERSON</span>
                </div>
                <!-- <q-btn-group> -->
                    <!-- <q-btn push size="12px" class="q-px-md q-py-xs" color="purple" label="Tambah Data" icon="add" @click="addKontak"/> -->
                <!-- </q-btn-group> -->
            <!-- </q-card-section> -->
            <!-- <q-separator /> -->
            <!-- <q-card-section> -->
                <div class="q-gutter-sm tw-mb-4">
                    <q-btn size="10px" class="q-py-sm" color="purple" label="Tambah" icon="add" :disable="inpKontak" @click="addKontak"/>
                    <q-btn size="10px" class="q-py-sm" color="blue" label="Simpan" icon="save" :disable="!inpKontak" @click="savedKontak"/>
                </div>
                <q-table
                    dense
                    title="List Data"
                    :rows="listKontak"
                    :columns="columns"
                    row-key="name"
                    v-model:pagination="pagination"
           
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
                    <template v-slot:body-cell-no="props">
                        <q-td :props="props">
                            {{ props.rowIndex+1 }}
                        </q-td>
                    </template>

                    <template v-slot:body-cell-details_content_1="props">
                        <q-td :props="props">
                            <q-input v-if="inpKontak" dense outlined v-model="props.row.details_content_1" />
                            <span v-else>{{ props.row.details_content_1 }}</span>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-details_content_2="props">
                        <q-td :props="props">
                            <q-input v-if="inpKontak" dense outlined readonly v-model="props.row.details_content_2" />
                            <span v-else>{{ props.row.details_content_2 }}</span>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-details_content_6="props">
                        <q-td :props="props">
                            <q-select
                                v-if="inpKontak"
                                dense
                                outlined
                                v-model="props.row.details_content_6"
                                use-input
                                emit-value
                                map-options
                                input-debounce="0"
                                option-value="value"
                                option-label="label"
                                :options="listJenisKel"
                                label="Jenis Kelamin"
                            >
                                <template v-slot:no-option>
                                <q-item>
                                    <q-item-section class="text-grey">
                                    No results
                                    </q-item-section>
                                </q-item>
                                </template>
                            </q-select>
                            <span v-else>{{ props.row.details_content_6 }}</span>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-details_content_3="props">
                        <q-td :props="props">
                            <q-input v-if="inpKontak" dense outlined v-model="props.row.details_content_3" />
                            <span v-else>{{ props.row.details_content_3 }}</span>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-details_content_4="props">
                        <q-td :props="props">
                            <q-input v-if="inpKontak" dense outlined v-model="props.row.details_content_4" />
                            <span v-else>{{ props.row.details_content_4 }}</span>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-details_content_5="props">
                        <q-td :props="props">
                            <q-input v-if="inpKontak" dense outlined v-model="props.row.details_content_5" />
                            <span v-else>{{ props.row.details_content_5 }}</span>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-aksi="props">
                        <q-td v-if="!inpKontak" :props="props">
                            <div class="q-gutter-xs">
                                <q-btn
                                    size="9px"
                                    round
                                    color="orange"
                                    icon="edit"
                                    label=""
                                    title="Edit Kontak Person"
                                    @click="editKontak(props.row)"
                                />
                                <q-btn
                                    size="9px"
                                    round
                                    color="negative"
                                    icon="delete"
                                    label=""
                                    title="Hapus Kontak Person"
                                    @click="deleteKontak(props.row)"
                                />
                            </div>
                        </q-td>
                        <q-td v-else></q-td>
                    </template>
                </q-table>
            </q-card-section>   
            </div>        
        </q-card>

        <q-dialog v-model="dialogForm">
            <q-card style="width: 700px; max-width: 80vw;">
                <q-card-section class="text-center">
                    <div class="text-h6">Form Input Data</div>
                    <p>Kontak Person</p>
                </q-card-section>
            <q-separator />
            <Form :validation-schema="schema" @submit="saveKontak" class="q-mt-md">
                <q-card-section style="max-height: 50vh" class="scroll">
                    <div class="row q-col-gutter-md">
                        <div class="col-12 col-md-6">
                            <Field v-model="tmpData.npwp" name="npwp" v-slot="{ errorMessage, value, field }">
                                <q-input dense label="NPWP Perusahaan" autocomplete="off" maxlength="50" readonly outlined type="tel" color="blue" :model-value="value" v-bind="field"
                                :error-message="errorMessage" :error="!!errorMessage" />
                            </Field>
                        </div>
                        <div class="col-12 col-md-6">
                            <Field v-model="tmpData.nama" name="nama" v-slot="{ errorMessage, value, field }">
                                <q-input dense label="Nama Lengkap" autocomplete="off" maxlength="50" outlined type="tel" color="blue" :model-value="value" v-bind="field"
                                :error-message="errorMessage" :error="!!errorMessage" />
                            </Field>
                        </div>
                        <div class="col-12 col-md-6">
                            <Field v-model="tmpData.jabatan" name="jabatan" v-slot="{ errorMessage, value, field }">
                                <q-input dense label="Jabatan" autocomplete="off" maxlength="50" outlined type="tel" color="blue" :model-value="value" v-bind="field" :readonly="updateForm"
                                :error-message="errorMessage" :error="!!errorMessage" />
                            </Field>
                        </div>
                        <div class="col-12 col-md-6">
                            <Field
                                v-model="tmpData.jeniskel"
                                name="jeniskel"
                                v-slot="{ errorMessage, handleChange, value }">
                                <q-select 
                                    dense
                                    outlined
                                    emit-value
                                    map-options
                                    label="Jenis Kelamin"
                                    :model-value="value"
                                    @update:modelValue="handleChange"
                                    input-debounce="0"
                                    color="blue"
                                    option-value="value"
                                    option-label="label"
                                    :options="listJenisKel"
                                    :error-message="errorMessage"
                                    :error="!!errorMessage" 
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
                        <div class="col-12 col-md-6">
                            <Field v-model="tmpData.notelepon" name="notelepon" v-slot="{ errorMessage, value, field }">
                                <q-input dense label="No. Telepon" autocomplete="off" maxlength="50" outlined type="tel" color="blue" :model-value="value" v-bind="field"
                                :error-message="errorMessage" :error="!!errorMessage" />
                            </Field>
                        </div>
                        <div class="col-12 col-md-6">
                            <Field v-model="tmpData.nohp" name="nohp" v-slot="{ errorMessage, value, field }">
                                <q-input dense label="No. HP" autocomplete="off" maxlength="50" outlined type="tel" color="blue" :model-value="value" v-bind="field"
                                :error-message="errorMessage" :error="!!errorMessage" />
                            </Field>
                        </div>
                        <div class="col-12 col-md-6">
                            <Field v-model="tmpData.email" name="email" v-slot="{ errorMessage, value, field }">
                                <q-input dense label="Email" autocomplete="off" maxlength="50" outlined type="tel" color="blue" :model-value="value" v-bind="field"
                                :error-message="errorMessage" :error="!!errorMessage" />
                            </Field>
                        </div>
                    </div>
                </q-card-section>
                <q-separator />
                <q-card-actions align="right">
                    <q-btn size="12px" label="Batal" color="negative" v-close-popup />
                    <q-btn size="12px" label="Simpan" color="orange" type="submit" />
                </q-card-actions>
            </Form>
            </q-card>
        </q-dialog>        
    </q-page>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import axios from "axios";
import { ParseError } from "./../../../utils";
import { useQuasar } from "quasar";
import { Field, Form } from "vee-validate";
import * as yup from "yup";
import { useRouter, useRoute } from "vue-router";

const columns = [ 
{
    name: "no",
    required: true,
    label: "No",
    align: "left",
    field: "sup_dtl_id",
    sortable: true,
},
{
    name: "details_content_1",
    required: true,
    label: "Nama Lengkap",
    align: "left",
    field: "details_content_1",
    sortable: true,
},
{
    name: "details_content_2",
    required: true,
    label: "Jabatan",
    align: "left",
    field: "details_content_2",
    sortable: true,
},
{
    name: "details_content_6",
    required: true,
    label: "Jenis Kelamin",
    align: "left",
    field: "details_content_6",
    sortable: true,
},
{
    name: "details_content_3",
    required: true,
    label: "No. Telepon",
    align: "left",
    field: "details_content_3",
    sortable: true,
},
{
    name: "details_content_4",
    required: true,
    label: "No. HP",
    align: "left",
    field: "details_content_4",
    sortable: true,
},
{
    name: "details_content_5",
    required: true,
    label: "Email",
    align: "left",
    field: "details_content_5",
    sortable: true,
},
{
    name: "aksi",
    required: true,
    label: "Aksi",
    align: "left",
    field: "aksi",
},  
]

const listJenisKel = ref([
{
    label:'Male',
    value:'Male'
},
{
    label:'Female',
    value:'Female'
}  
])

const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const listKontak = ref([]);
const updateForm = ref(false);
const dialogForm = ref(false);
const inpKontak = ref(true);

const pagination = ref({
    sortBy: "details_content_1",
    descending: true,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 10,
    filter: null,
    from: 0,
});

const tmpData = reactive({
    code: route.params.code,
    id: "",
    npwp: "",
    nama: "",
    jabatan: "",
    jeniskel: "",
    notelepon: "",
    nohp: "",
    email: ""
});

const rowData = ref([
  {
    "sup_code_app": route.params.code,
    "details_content_1": "",
    "details_content_2": "Sales Officer",
    "details_content_3": "",
    "details_content_4": "",
    "details_content_5": "",
    "details_content_6": ""
  },
  {
    "sup_code_app": route.params.code,
    "details_content_1": "",
    "details_content_2": "Sales Supervisor",
    "details_content_3": "",
    "details_content_4": "",
    "details_content_5": "",
    "details_content_6": ""
  },
  {
    "sup_code_app": route.params.code,
    "details_content_1": "",
    "details_content_2": "Sales Manager",
    "details_content_3": "",
    "details_content_4": "",
    "details_content_5": "",
    "details_content_6": ""
  },
  {
    "sup_code_app": route.params.code,
    "details_content_1": "",
    "details_content_2": "FA Officer",
    "details_content_3": "",
    "details_content_4": "",
    "details_content_5": "",
    "details_content_6": ""
  },
  {
    "sup_code_app": route.params.code,
    "details_content_1": "",
    "details_content_2": "FA Manager",
    "details_content_3": "",
    "details_content_4": "",
    "details_content_5": "",
    "details_content_6": ""
  },
  {
    "sup_code_app": route.params.code,
    "details_content_1": "",
    "details_content_2": "Quality Manager",
    "details_content_3": "",
    "details_content_4": "",
    "details_content_5": "",
    "details_content_6": ""
  }
])

const schema = yup.object({
    nama: yup.string().required().label("Nama Lengkap"),
    jabatan: yup.string().required().label("Jabatan"),
    jeniskel: yup.string().required().label("Jenis Kelamin"),
    notelepon: yup.string().required().label("No. Telepon"),
    nohp: yup.string().required().label("No. HP"),
    email: yup.string().required().email().label("Email"),
});

const getKontak = async () => {
    try {
        $q.loading.show();
        const res = await axios.get("getKontakPerson", {
            params: {
                ...pagination.value,
                code: route.params.code,
            },
        });

        if (res.data.data.length > 0) {
            listKontak.value = res.data.data;
            inpKontak.value = false;
        } else {
            listKontak.value = rowData.value;
            inpKontak.value = true;
        }

        pagination.value.rowsNumber = res.data.meta.total;
        pagination.value.page = res.data.meta.current_page;
        pagination.value.rowsPerPage = res.data.meta.per_page;
        $q.loading.hide();
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }
};

const getData = async () => {
    const res = await axios.get("getDataKontakPerson", {
        params: {
            enkrip: route.params.enkrip,
            code: route.params.code,
        },
    });

    tmpData.npwp = res.data.regis_npwp;
}

const addKontak = async () => {
    updateForm.value = false;
    dialogForm.value = true;
    reset();
};

const savedKontak = async () => {
    // console.log(listKontak.value[0].details_content_1);
    if (listKontak.value[0].details_content_1.trim() == "" || listKontak.value[1].details_content_1.trim() == "" || listKontak.value[2].details_content_1.trim() == "" || listKontak.value[3].details_content_1.trim() == "" || listKontak.value[4].details_content_1.trim() == "" || listKontak.value[5].details_content_1.trim() == "" || listKontak.value[0].details_content_3.trim() == "" || listKontak.value[1].details_content_3.trim() == "" || listKontak.value[2].details_content_3.trim() == "" || listKontak.value[3].details_content_3.trim() == "" || listKontak.value[4].details_content_3.trim() == "" || listKontak.value[5].details_content_3.trim() == "" || listKontak.value[0].details_content_4.trim() == "" || listKontak.value[1].details_content_4.trim() == "" || listKontak.value[2].details_content_4.trim() == "" || listKontak.value[3].details_content_4.trim() == "" || listKontak.value[4].details_content_4.trim() == "" || listKontak.value[5].details_content_4.trim() == "" || listKontak.value[0].details_content_5.trim() == "" || listKontak.value[1].details_content_5.trim() == "" || listKontak.value[2].details_content_5.trim() == "" || listKontak.value[3].details_content_5.trim() == "" || listKontak.value[4].details_content_5.trim() == "" || listKontak.value[5].details_content_5.trim() == "" || listKontak.value[0].details_content_6.trim() == "" || listKontak.value[1].details_content_6.trim() == "" || listKontak.value[2].details_content_6.trim() == "" || listKontak.value[3].details_content_6.trim() == "" || listKontak.value[4].details_content_6.trim() == "" || listKontak.value[5].details_content_6.trim() == "") {
        $q.notify({
            type: "negative",
            message: "Silahkan Lengkapi inputan Kontak Person",
        });    
    } /* else if (!validateEmail(listKontak.value[0].details_content_5.trim()) || !validateEmail(listKontak.value[1].details_content_5.trim()) || !validateEmail(listKontak.value[2].details_content_5.trim()) || !validateEmail(listKontak.value[3].details_content_5.trim()) || !validateEmail(listKontak.value[4].details_content_5.trim()) || !validateEmail(listKontak.value[5].details_content_5.trim())) {
        $q.notify({
            type: "negative",
            message: "Format email tidak sesuai",
        });    
    }*/else {
        try {
            $q.loading.show();
            const res = await axios.post("savedKontakPerson", listKontak.value);
            $q.notify({
                type: "positive",
                message: "Data berhasil disimpan",
            });
            await onRequest({
                pagination: pagination.value,
            });
            setProgress();
            $q.loading.hide();
        } catch (error) {
            $q.notify({
                type: "negative",
                message: ParseError(error),
            });
        }
    }
};

const validateEmail = (email) => {
    return email.toLowerCase().match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const editKontak = async (value) => {
    updateForm.value = true;
    dialogForm.value = true;
    tmpData.id = value.sup_dtl_id;
    tmpData.nama = value.details_content_1;
    tmpData.jabatan = value.details_content_2;
    tmpData.jeniskel = value.details_content_6;
    tmpData.notelepon = value.details_content_3;
    tmpData.nohp = value.details_content_4;
    tmpData.email = value.details_content_5;
};

const saveKontak = async () => {
    if (updateForm.value) {
        try {
            $q.loading.show();
            await axios.put("saveKontakPerson/" + tmpData.id, tmpData);
            dialogForm.value = false;
            reset();
            $q.notify({
                type: "positive",
                message: "Data berhasil diubah",
            });
            await onRequest({
                pagination: pagination.value,
            });
            $q.loading.hide();
        } catch (error) {
            $q.notify({
                type: "negative",
                message: ParseError(error),
            });
        }  
    }
    else{
        try {
            $q.loading.show();
            const res = await axios.post("saveKontakPerson", tmpData);
            dialogForm.value = false;
            reset();
            $q.notify({
                type: "positive",
                message: "Data berhasil disimpan",
            });
            await onRequest({
                pagination: pagination.value,
            });
            setProgress();
            $q.loading.hide();
        } catch (error) {
            $q.notify({
                type: "negative",
                message: ParseError(error),
            });
        }
    }
};

const deleteKontak = (value) => {
    if (listKontak.value.length > 6) {
        $q.dialog({
            title: "Konfirmasi",
            message: `Apakah anda yakin hapus data <span class="tw-font-bold">${value.details_content_1}</span> ?`,
            html: true,
            ok: {
                push: true,
                size: "12px",
                color: "orange",
            },
            cancel: {
                push: true,
                size: "12px",
                color: "negative",
            },
            persistent: true,
        }).onOk(async () => {
            try {
                $q.loading.show();
                await axios.delete("delKontakPerson/" + value.sup_dtl_id);
                $q.notify({
                    type: "positive",
                    message: `Data <span class="tw-font-bold">${value.details_content_1}</span> berhasil dihapus`,
                    html: true,
                });
                await onRequest({
                    pagination: pagination.value,
                });
                getKontak();
                setProgress();
                $q.loading.hide();
            } catch (error) {
                $q.notify({
                    type: "negative",
                    message: ParseError(error),
                });
            }
        });    
    } else {
        $q.notify({
            type: "negative",
            message: "Kontak Person tidak bisa dihapus, minimal 6 Kontak Person",
        });    
    }
};

const reset = () => {
    tmpData.id = "";
    tmpData.nama = "";
    tmpData.jabatan = "";
    tmpData.jeniskel = "";
    tmpData.notelepon = "";
    tmpData.nohp = "";
    tmpData.email = "";
};

const onRequest = (props) => {
    const { page, rowsPerPage, sortBy, descending, filter } = props.pagination;
    pagination.value.filter = filter;
    pagination.value.page = page;
    pagination.value.rowsPerPage = rowsPerPage;
    pagination.value.sortBy = sortBy;
    pagination.value.descending = descending;
    getKontak();
};

const setProgress = async () => {
    const res = await axios.get("getProgressReg", {
        params: {
            code: route.params.code,
        },
    });  

    window.localStorage.setItem("progresReg", res.data.data);
    document.dispatchEvent(new CustomEvent("updateProgress"));
};

onMounted(() => {
    getData();
    onRequest({
        pagination: pagination.value,
    });
});

window.localStorage.clear();
</script>