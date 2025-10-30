<template>
    <q-page class="q-pa-lg">
        <q-card class="my-card">
            <div class="q-gutter-y-md">
            <q-card-section class="q-mx-xs">
                <div class="q-mt-sm q-mb-sm q-mb-md">
                    <!-- <divider title="FORM NAMA PEJABAT / KUASA PENANDATANGAN FAKTUR PAJAK" /> -->
                    <span class="text-indigo-10 tw-text-xl text-bold">FORM NAMA PEJABAT / KUASA PENANDATANGAN FAKTUR PAJAK</span>
                </div>

                <div class="q-gutter-sm tw-mb-4">
                    <q-btn size="10px" class="q-py-sm" color="purple" label="Tambah Data" icon="add" @click="addNamaPejabat"/>
                    <q-btn size="10px" class="q-py-sm" color="secondary" label="Upload File" icon="list" @click="uploadFile" />
                </div>
                <q-table
                    dense
                    title="List Data"
                    :rows="listNamaPejabat"
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
                    <template v-slot:body-cell-aksi="props">
                        <q-td :props="props">
                            <div class="q-gutter-xs">
                                <q-btn
                                    size="9px"
                                    round
                                    color="orange"
                                    icon="edit"
                                    label=""
                                    title="Edit"
                                    @click="editNamaPejabat(props.row)"
                                />
                                <q-btn
                                    size="9px"
                                    round
                                    color="negative"
                                    icon="delete"
                                    label=""
                                    title="Hapus"
                                    @click="deleteNamaPejabat(props.row)"
                                />
                            </div>
                        </q-td>
                    </template>
                </q-table>
            </q-card-section>   
            </div>               
        </q-card>

        <q-dialog v-model="dialogForm">
            <q-card style="width: 700px; max-width: 80vw;">
                <q-card-section>
                    <div class="text-h6 text-center">Form Tambah Data</div>
                    <p class="text-center">Nama Pejabat / Kuasa Penandatangan Faktur Pajak</p>
                </q-card-section>
                <q-separator />
                <Form :validation-schema="schema" @submit="saveNamaPejabat" class="q-mt-md">
                    <q-card-section style="max-height: 55vh" class="scroll">
                        <div class="row q-col-gutter-sm">
                            <div class="col-12 col-md-6">
                                <Field v-model="tmpData.npwp" name="npwp" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="NPWP Perusahaan" maxlength="16" readonly outlined type="tel" autocomplete="off" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <Field v-model="tmpData.nama" name="nama" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="Nama Lengkap" maxlength="50" outlined type="tel" autocomplete="off" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <Field v-model="tmpData.npwppejabat" name="npwppejabat" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="NPWP" maxlength="16" outlined type="tel" autocomplete="off" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <Field v-model="tmpData.jabatan" name="jabatan" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="Jabatan" maxlength="50" outlined type="tel" autocomplete="off" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                            <Field
                                v-model="tmpData.tglberlaku"
                                name="tglberlaku"
                                v-slot="{ errorMessage, value, field }"
                            >
                                <q-input
                                    dense
                                    outlined
                                    autocomplete="off" 
                                    color="blue"
                                    label="Tanggal Berlaku"
                                    v-bind="field"
                                    :error-message="errorMessage"
                                    :error="!!errorMessage"
                                    mask="##/##/####" 
                                    fill-mask="_"
                                    :model-value="value"
                                >
                                    <template v-slot:append>
                                        <q-icon name="event" class="cursor-pointer">
                                            <q-popup-proxy ref="datePopup" cover transition-show="scale" transition-hide="scale">
                                                <q-date v-model="tmpData.tglberlaku" mask="DD/MM/YYYY" color="blue" @update:model-value="hideDate" :model-value="value" />
                                            </q-popup-proxy>
                                        </q-icon>
                                    </template>
                                </q-input>
                            </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <Field v-model="tmpData.lokasikerja" name="lokasikerja" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="Lokasi Kerja" maxlength="50" outlined type="tel" autocomplete="off" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-12">
                                <Field v-model="tmpData.catatan" name="catatan" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="Catatan" maxlength="" outlined type="textarea" autocomplete="off" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
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

        <q-dialog v-model="dialogUploadForm">
            <q-card style="width: 700px; max-width: 80vw;">
                <q-card-section>
                    <div class="text-h6 text-center">Form List Upload Data</div>
                    <p class="text-center">Nama Pejabat / Kuasa Penandatangan Faktur Pajak</p>
                </q-card-section>
                <q-separator />
                <q-card-section style="max-height: 70vh" class="scroll">
                    <Form @submit="saveFile">
                        <div class="row q-col-gutter-sm q-mb-lg">
                            <div class="col-12 col-md-12">
                                <p class="">Cari File PDF :</p>
                            </div>
                            <div class="col-12 col-md-7">
                                <q-file 
                                    outlined 
                                    dense 
                                    bottom-slots 
                                    v-model="tmpData.file" 
                                    label="Choose File" 
                                    :max-file-size="10000000" 
                                    accept=".pdf" 
                                    color="blue" 
                                    @rejected="rejectFile" 
                                    counter 
                                    :model-value="tmpData.file"
                                >
                                    <template v-slot:prepend>
                                        <q-icon name="cloud_upload" @click.stop />
                                    </template>
                                    <template v-slot:append>
                                        <q-icon name="close" @click.stop="model = null" class="cursor-pointer" />
                                    </template>
                                    <template v-slot:hint> Field hint </template>
                                </q-file>
                            </div>
                            <div class="col-12 col-md-2">
                                <q-btn size="10px" label="Upload" class="q-mt-xs q-py-sm" icon="upload" color="purple" type="submit" />
                            </div>
                        </div>
                    </Form>
                    <q-table
                        dense
                        title="List File yang sudah diupload :"
                        :rows="listFile"
                        :columns="columns2"
                        row-key="name"
                        :filter="pagination.filter"
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
                        <template v-slot:body-cell-aksi="props">
                            <q-td :props="props">
                                <div class="q-gutter-xs">
                                    <q-btn
                                        size="9px"
                                        round
                                        color="negative"
                                        icon="delete"
                                        label=""
                                        title="Hapus File"
                                        @click="deleteFile(props.row)"
                                    />
                                    <q-btn
                                        size="9px"
                                        round
                                        color="deep-orange"
                                        icon="open_in_new"
                                        label=""
                                        title="Tampilkan File"
                                        @click="openFile(props.row)"
                                    />
                                </div>
                            </q-td>
                        </template>                    
                    </q-table>
                </q-card-section>
                <q-separator />
                <q-card-actions align="right">
                    <q-btn size="12px" label="Close" class="q-px-xs q-py-xs" color="negative" v-close-popup />
                </q-card-actions>
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
    label: "NPWP",
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
    label: "Tgl. Berlaku",
    align: "left",
    field: "details_content_4",
    sortable: true,
},
{
    name: "details_content_5",
    required: true,
    label: "Lokasi Kerja",
    align: "left",
    field: "details_content_5",
    sortable: true,
},
{
    name: "details_content_6",
    required: true,
    label: "Catatan",
    align: "left",
    field: "details_content_6",
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

const columns2 = [ 
{
    name: "no",
    required: true,
    label: "No",
    align: "left",
    field: "upload_id",
    sortable: true,
},
{
    name: "details_upload",
    required: true,
    label: "File",
    align: "left",
    field: "details_upload",
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
const listNamaPejabat = ref([]);
const listFile = ref([]);
const datePopup = ref(null);
const dialogForm = ref(false);
const updateForm = ref(false);
const dialogUploadForm = ref(false);

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
    id: "",
    npwp: "",
    nama: "",
    npwppejabat: "",
    jabatan: "",
    tglberlaku: "",
    lokasikerja: "",
    catatan: "",
    file: [],
});

const schema = yup.object({
    nama: yup.string().required().label("Nama Lengkap"),
    npwppejabat: yup.number().required().positive().integer().label("NPWP").typeError("NPWP must be a number type"),
    jabatan: yup.string().required().label("Jabatan"),
    tglberlaku: yup.string().required().label("Tanggal Berlaku"),
    lokasikerja: yup.string().required().label("Lokasi Kerja"),
    catatan: yup.string().required().label("Catatan"),
});

const getNamaPejabat = async () => {
    try {
        $q.loading.show();
        const res = await axios.get("getNamaPejabat", {
            params: {
                ...pagination.value,
                code: route.params.code,
            },
        });

        listNamaPejabat.value = res.data.data;
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
    const res = await axios.get("getDataNamaPejabat", {
        params: {
            enkrip: route.params.enkrip,
            code: route.params.code,
        },
    });

    tmpData.npwp = res.data.regis_npwp;
}

const addNamaPejabat = async () => {
    updateForm.value = false;
    dialogForm.value = true;
    reset();
};

const editNamaPejabat = async (value) => {
    updateForm.value = true;
    dialogForm.value = true;
    tmpData.id = value.sup_dtl_id;
    tmpData.nama = value.details_content_1;
    tmpData.npwppejabat = value.details_content_2;
    tmpData.jabatan = value.details_content_3;
    tmpData.tglberlaku = value.details_content_4;
    tmpData.lokasikerja = value.details_content_5;
    tmpData.catatan = value.details_content_6;
};

const saveNamaPejabat = async () => {
    if (updateForm.value) {
        try {
            await axios.put("saveNamaPejabat/" + tmpData.id, tmpData);
            dialogForm.value = false;
            reset();
            $q.notify({
                type: "positive",
                message: "Data berhasil diubah",
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
    }
    else{
        try {
            $q.loading.show();
            const res = await axios.post("saveNamaPejabat", tmpData);
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

const deleteNamaPejabat = (value) => {
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
            await axios.delete("delNamaPejabat/" + value.sup_dtl_id);
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

const reset = () => {
    tmpData.id = "";
    tmpData.nama = "";
    tmpData.npwppejabat = "";
    tmpData.jabatan = "";
    tmpData.tglberlaku = "";
    tmpData.lokasikerja = "";
    tmpData.catatan = "";
};

const onRequest = (props) => {
    const { page, rowsPerPage, sortBy, descending, filter } = props.pagination;
    pagination.value.filter = filter;
    pagination.value.page = page;
    pagination.value.rowsPerPage = rowsPerPage;
    pagination.value.sortBy = sortBy;
    pagination.value.descending = descending;
    getNamaPejabat();
};

const hideDate = () => {
    datePopup.value.hide()
}

const getDataFile = async () => {
    try {
        const res = await axios.get("getfileNamaPejabat", {
            params: {
                code: route.params.code,
            },
        });

        // console.log(res.data);
        listFile.value = res.data;
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }    
}

const uploadFile = async () => {
    dialogUploadForm.value = true;
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

const saveFile = async () => {
    try {
        $q.loading.show();
        if(tmpData.file == ''){
            $q.notify({
                type: "negative",
                message: "File belum dipilih",
            });          
        }
        else{
            const res = await axios.post("savefileNamaPejabat", tmpData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                params: {
                    code: route.params.code,
                },
            });        

            $q.notify({
                type: "positive",
                message: res.data.message,
            });
            tmpData.file = [];
            getDataFile();
            setProgress();
        }
        $q.loading.hide();
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }
};

const deleteFile = (value) => {
    $q.dialog({
        title: "Konfirmasi",
        message: `Apakah anda yakin hapus file ini ?`,
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
            await axios.delete("delfileNamaPejabat/" + value.upload_id);
            $q.notify({
                type: "positive",
                message: `File berhasil dihapus`,
                html: true,
            });
            getDataFile();
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

const openFile = async (value) => {
    window.open(`${import.meta.env.VITE_FTP_LINK}`+value.details_upload_app+'.pdf', '_blank')
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
    getDataFile();
});

window.localStorage.clear();
</script>