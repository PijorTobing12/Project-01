<template>
    <q-page class="q-pa-lg">
        <q-card class="my-card">
            <div class="q-gutter-y-md">
            <q-card-section class="q-mx-xs">
                <div class="q-mt-sm q-mb-sm q-mb-md">
                    <!-- <divider title="FORM REKENING BANK" /> -->
                    <span class="text-indigo-10 tw-text-xl text-bold">DOKUMEN PENANDATANGAN KONTRAK</span>
                </div>
                
                <div class="q-gutter-sm tw-mb-4">
                    <q-btn size="10px" class="q-py-sm" color="purple" label="Tambah Data" icon="add" @click="addPenandaKontrak"/>
                </div>
                <q-table
                    dense
                    title="List Data"
                    :rows="listPenandaKontrak"
                    :columns="columns"
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
                    <template v-slot:body-cell-details_content_7="props">
                        <q-td :props="props">
                            <a v-if="props.row.details_content_7" :href="`${ftp_link}`+props.row.details_content_7+'.pdf'" target="_blank"><span style="color: blue;">{{ props.row.details_content_7 + '.pdf' }}</span></a>
                        </q-td>
                    </template>
                    <template v-slot:body-cell-aksi="props">
                        <q-td :props="props">
                            <div class="q-gutter-xs">
                                <q-btn
                                    size="9px"
                                    round
                                    color="orange"
                                    icon="edit"
                                    label=""
                                    title="Edit Dewan Direksi"
                                    @click="editPenandaKontrak(props.row)"
                                />
                                <q-btn
                                    size="9px"
                                    round
                                    color="negative"
                                    icon="delete"
                                    label=""
                                    title="Hapus Dewan Direksi"
                                    @click="deletePenandaKontrak(props.row)"
                                />
                            </div>
                        </q-td>
                    </template>
                    <template v-slot:body-cell-details_content_10="props">
                        <q-td :props="props">
                            <a :href="`${ftp_link}`+props.row.details_content_10+'.pdf'" v-if="props.row.details_content_10 != null" class="text-light-blue-10" target="_blank">{{ props.row.details_content_10 }}</a>
                        </q-td>
                    </template>
                </q-table>
            </q-card-section>   
            </div>           
        </q-card>

        <q-dialog v-model="dialogForm">
            <q-card style="width: 700px; max-width: 80vw;">
                <q-card-section class="text-center">
                    <div class="text-h6">Form Input Data</div>
                    <p>Penandatangan Kontrak</p>
                </q-card-section>
                <q-separator />
                <Form :validation-schema="schema" @submit="savePenandaKontrak" class="q-mt-md">
                    <q-card-section style="max-height: 70vh" class="scroll">
                        <div class="row q-col-gutter-sm">
                            <div class="col-12 col-md-12">
                                <Field v-model="tmpData.npwp" name="npwp" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="NPWP Perusahaan" autocomplete="off" maxlength="50" readonly outlined type="tel" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <Field v-model="tmpData.namaLengkap" name="namaLengkap" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="Nama Lengkap" outlined autocomplete="off" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <Field v-model="tmpData.nik" name="nik" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="NIK" outlined autocomplete="off" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <Field v-model="tmpData.jabatan" name="jabatan" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="Jabatan" outlined autocomplete="off" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <Field v-model="tmpData.email" name="email" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="Email" outlined type="email" autocomplete="off" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <Field
                                    v-model="tmpData.tglBuat"
                                    name="tglBuat"
                                    v-slot="{ errorMessage, value, field }"
                                >
                                    <q-input                                      
                                        dense
                                        outlined
                                        label="Tanggal Buat"
                                        :model-value="value"
                                        v-bind="field"
                                        :error-message="errorMessage"
                                        :error="!!errorMessage"
                                        mask="####-##-##"
                                        fill-mask="#"
                                    >
                                    <template v-slot:append>
                                        <q-icon name="event" class="cursor-pointer">
                                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                        <q-date v-model="tmpData.tglBuat" mask="YYYY-MM-DD" minimal>
                                            <div class="row items-center justify-end">
                                                <q-btn v-close-popup label="Close" color="primary" flat />
                                            </div>
                                        </q-date>
                                        </q-popup-proxy>
                                        </q-icon>
                                    </template>
                                    </q-input>
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <Field
                                    v-model="tmpData.direksi"
                                    name="direksi"
                                    v-slot="{ errorMessage, handleChange, value }"
                                >
                                    <q-select
                                        style="padding: 0px;"
                                        dense
                                        outlined
                                        label="Direksi"
                                        :model-value="value"
                                        @update:modelValue="handleChange"
                                        emit-value
                                        map-options
                                        input-debounce="0"
                                        option-value="name"
                                        option-label="name"
                                        :options="listDireksi"
                                        :error-message="errorMessage"
                                        :error="!!errorMessage"
                                        @popup-hide="funcDireksi(value)"
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
                                <span class="text-red tw-text-xs">* Jika bukan Direksi wajib melampirkan Surat Kuasa Direktur.</span>
                                <q-file outlined dense bottom-slots v-model="tmpData.file" label="Upload Surat Kuasa" :max-file-size="10000000" accept=".pdf" color="blue" @rejected="rejectFile" counter :model-value="tmpData.file">
                                    <template v-slot:prepend>
                                        <q-icon name="cloud_upload" @click.stop />
                                    </template>
                                    <template v-slot:append>
                                        <q-icon name="close" @click.stop="model = null" class="cursor-pointer" />
                                    </template>
                                    <template v-slot:hint> Field hint </template>
                                </q-file>
                            </div>
                            <div class="col-12 col-md-6">
                                <div class="q-ml-xs q-pt-sm q-pb-xs">
                                    <p v-if="tmpData.file_view != null">Link File : <a :href="`${ftp_link}`+tmpData.file_view+'.pdf'" class="tw-text-xs text-light-blue-10 text-italic" target="_blank">{{ tmpData.file_view }}</a></p>
                                </div>
                            </div>
                        </div>
                    </q-card-section>
                    <q-separator />
                    <q-card-actions align="right">
                        <q-btn size="12px" label="Batal" class="q-px-xs q-py-xs" color="negative" v-close-popup />
                        <q-btn size="12px" label="Simpan" class="q-px-xs q-py-xs" color="orange" type="submit" />
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
    label: "NIK",
    align: "left",
    field: "details_content_2",
    sortable: true,
},
{
    name: "details_content_3",
    required: true,
    label: "Jabatan",
    align: "left",
    field: "details_content_3",
    sortable: true,
},
{
    name: "details_content_4",
    required: true,
    label: "Email",
    align: "left",
    field: "details_content_4",
    sortable: true,
},
{
    name: "details_content_5",
    required: true,
    label: "Tgl. Buat",
    align: "left",
    field: "details_content_5",
    sortable: true,
},
{
    name: "details_content_6",
    required: true,
    label: "Direksi",
    align: "left",
    field: "details_content_6",
    sortable: true,
},
{
    name: "details_content_7",
    required: true,
    label: "Surat Kuasa",
    align: "left",
    field: "details_content_7",
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

const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const listPenandaKontrak = ref([]);
const updateForm = ref(false);
const dialogForm = ref(false);
const ftp_link = import.meta.env.VITE_FTP_LINK;
const listDireksi = ref([
    {
        name: "Yes",
    },
    {
        name: "No",
    },
]);

const pagination = ref({
    sortBy: "details_content_1",
    descending: true,
    page: 1,
    rowsPerPage: 5,
    rowsNumber: 5,
    filter: null,
    from: 0,
});

const tmpData = reactive({
    code: route.params.code,
    bu_id: "",
    npwp: "",
    id: "",
    namaLengkap: "",
    nik: "",
    jabatan: "",
    email: "",
    tglBuat: "",
    direksi: "",
    file: [],
    file_view: "",
});

const schema = yup.object({
    namaLengkap: yup.string().required().nullable(true).label("Nama Lengkap"),
    nik: yup.string().required().nullable(true).label("NIK"),
    jabatan: yup.string().required().nullable(true).label("Jabatan"),
    // nomorrek: yup.number().required().positive().integer().label("No. Rekening").typeError("No. Rekening must be a number type"),
    email: yup.string().required().email().label("Email").typeError("Email is a required field"),
    tglBuat: yup.string().required().label("Tanggal Buat"),
    direksi: yup.string().required().nullable(true).label("Direksi"),
});

const funcDireksi = async (value) => {
    // if (value == "Lembur") {
    //     katLembur.value = true; 
    //     katKomplain.value = false; 
    // } else if (value == "Komplain") {
    //     katLembur.value = false;  
    //     katKomplain.value = true;  
    // } else {
    //     katLembur.value = false;  
    //     katKomplain.value = false;  
    // }
};

const getPenandaKontrak = async () => {
    try {
        $q.loading.show();
        const res = await axios.get("getPenandaKontrak", {
            params: {
                ...pagination.value,
                code: route.params.code,
            },
        });

        listPenandaKontrak.value = res.data.data;
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
    const res = await axios.get("getDataRekeningBank", {
        params: {
            enkrip: route.params.enkrip,
            code: route.params.code,
        },
    });

    tmpData.bu_id = res.data.bu_id;
    tmpData.npwp = res.data.regis_npwp;
    // tmpData.namadalamrek = res.data.regis_name;
}

const addPenandaKontrak = async () => {
    updateForm.value = false;
    dialogForm.value = true;
    reset();
};

const editPenandaKontrak = async (value) => {
    updateForm.value = true;
    dialogForm.value = true;
    tmpData.id = value.sup_dtl_id;
    tmpData.namaLengkap = value.details_content_1;
    tmpData.nik = value.details_content_2;
    tmpData.jabatan = value.details_content_3;
    tmpData.email = value.details_content_4;
    tmpData.tglBuat = value.details_content_5;
    tmpData.direksi = value.details_content_6;
    tmpData.file_view = value.details_content_7;
};

const savePenandaKontrak = async () => {
    if (updateForm.value) {
        try {
            $q.loading.show();
            if(tmpData.direksi == "No" && tmpData.file == '' && tmpData.file_view == null){               
                $q.notify({
                    type: "negative",
                    message: "File upload surat penandatangan kontrak wajib diisi",
                });          
            }
            else{
                const res = await axios.put("savePenandaKontrak/" + tmpData.id, tmpData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                tmpData.file = []; 
                dialogForm.value = false;
                reset();
                // getPenandaKontrak();
                $q.notify({
                    type: "positive",
                    message: "Data berhasil diubah",
                });
                await onRequest({
                    pagination: pagination.value,
                });
            }
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
            if(tmpData.direksi == "No" && tmpData.file == ''){               
                $q.notify({
                    type: "negative",
                    message: "File upload surat penandatangan kontrak wajib diisi",
                });          
            }
            else{
                const res = await axios.post("savePenandaKontrak", tmpData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                tmpData.file = [];  
                dialogForm.value = false;
                reset();
                // getPenandaKontrak();
                $q.notify({
                    type: "positive",
                    message: "Data berhasil disimpan",
                });
                await onRequest({
                    pagination: pagination.value,
                });
                setProgress();
            }
            $q.loading.hide();
        } catch (error) {
            $q.notify({
                type: "negative",
                message: ParseError(error),
            });
        }
    }
};

const deletePenandaKontrak = (value) => {
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
            await axios.delete("delPenandaKontrak/" + value.sup_dtl_id);
            $q.notify({
                type: "positive",
                message: `Data <span class="tw-font-bold">${value.details_content_1}</span> berhasil dihapus`,
                html: true,
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
    });
};

const rejectFile = (err) => {
    console.log(err[0].file);
    if(err[0].file.type != 'application/pdf'){
        $q.notify({
            type: 'negative',
            message: 'Format file upload harus PDF'
        })
    }
    if(err[0].file.size > 10000000){
        $q.notify({
            type: 'negative',
            message: 'Ukuran file maksimal 10 MB'
        })  
    }
}

const onRequest = (props) => {
    const { page, rowsPerPage, sortBy, descending, filter } = props.pagination;
    pagination.value.filter = filter;
    pagination.value.page = page;
    pagination.value.rowsPerPage = rowsPerPage;
    pagination.value.sortBy = sortBy;
    pagination.value.descending = descending;
    getPenandaKontrak();
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

const reset = () => {
    tmpData.id = "";
    tmpData.namaLengkap = "";
    tmpData.nik = "";
    tmpData.jabatan = "";
    tmpData.email = "";
    tmpData.tglBuat = "";
    tmpData.direksi = "";
    tmpData.file = [];
    tmpData.file_view = "";
};

onMounted(() => {
    getData();
    onRequest({
        pagination: pagination.value,
    });
});

window.localStorage.clear();
</script>