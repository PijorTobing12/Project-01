<template>
    <q-page class="q-pa-lg">
        <q-card class="my-card">
            <div class="q-gutter-y-md">
            <q-card-section class="q-mx-xs">
                <div class="q-mt-sm q-mb-sm q-mb-md">
                    <!-- <divider title="FORM REKENING BANK" /> -->
                    <span class="text-indigo-10 tw-text-xl text-bold">FORM REKENING BANK</span>
                </div>
                
                <div class="q-gutter-sm tw-mb-4">
                    <q-btn size="10px" class="q-py-sm" color="purple" label="Tambah Data" icon="add" @click="addRekeningBank"/>
                    <q-btn size="10px" class="q-py-sm" color="secondary" label="Upload File" icon="list" @click="uploadFile" />
                </div>
                <q-table
                    dense
                    title="List Data"
                    :rows="listRekeningBank"
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
                                    @click="editRekeningBank(props.row)"
                                />
                                <q-btn
                                    size="9px"
                                    round
                                    color="negative"
                                    icon="delete"
                                    label=""
                                    title="Hapus Dewan Direksi"
                                    @click="deleteRekeningBank(props.row)"
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
                    <p>Rekening Bank</p>
                </q-card-section>
                <q-separator />
                <Form :validation-schema="schema" @submit="saveRekeningBank" class="q-mt-md">
                    <q-card-section style="max-height: 70vh" class="scroll">
                        <div class="row q-col-gutter-sm">
                            <div class="col-12 col-md-12">
                                <Field v-model="tmpData.npwp" name="npwp" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="NPWP Perusahaan" autocomplete="off" maxlength="50" readonly outlined type="tel" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <Field
                                    v-model="tmpData.namabank"
                                    name="namabank"
                                    v-slot="{ errorMessage, handleChange, value }"
                                >
                                    <q-select 
                                        dense
                                        outlined
                                        clearable
                                        use-input 
                                        emit-value
                                        map-options
                                        label="Nama Bank"
                                        :model-value="value"
                                        @update:modelValue="handleChange"
                                        input-debounce="0"
                                        color="blue"
                                        option-value="kodemstr"
                                        option-label="kodemstr"
                                        :options="listBank"   
                                        :display-value="value ? value.label : ''"
                                        :error-message="errorMessage"
                                        :error="!!errorMessage"
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
                                </Field> 
                            </div>
                            <div class="col-12 col-md-6">
                                <Field
                                    v-model="tmpData.kotacab"
                                    name="kotacab"
                                    v-slot="{ errorMessage, handleChange, value }"
                                >
                                    <q-select 
                                        dense
                                        outlined
                                        clearable
                                        use-input 
                                        emit-value
                                        map-options
                                        label="Kota/Cabang"
                                        :model-value="value"
                                        @update:modelValue="handleChange"
                                        input-debounce="0"
                                        color="blue"
                                        option-value="kodemstr"
                                        option-label="kodemstr"
                                        :options="listKotaCab"   
                                        :display-value="value ? value.label : ''"
                                        :error-message="errorMessage"
                                        :error="!!errorMessage"
                                        @filter="filterFn2"
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
                                <Field v-model="tmpData.nomorrek" name="nomorrek" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="No. Rekening / IBAN" maxlength="15" outlined type="tel" autocomplete="off" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <Field v-model="tmpData.namadalamrek" name="namadalamrek" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="Nama Dalam Rekening" readonly outlined type="tel" autocomplete="off" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <Field v-model="tmpData.namapemilikrek" name="namapemilikrek" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="Nama Pemilik Rekening" maxlength="50" outlined type="tel" autocomplete="off" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <Field v-model="tmpData.matauang" name="matauang" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="Mata Uang" maxlength="5" outlined type="tel" autocomplete="off" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <Field v-model="tmpData.top" name="top" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="Term of Payment" maxlength="40" outlined autocomplete="off" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <Field v-model="tmpData.swiftcode" name="swiftcode" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="Swift Code" maxlength="40" outlined autocomplete="off" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <span class="text-red tw-text-xs">* Jika nama dalam Rek. berbeda dengan Pemilik</span>
                                <q-file outlined dense bottom-slots v-model="tmpData.file" label="Upload Surat Pernyataan" :max-file-size="10000000" accept=".pdf" color="blue" @rejected="rejectFile" counter :model-value="tmpData.file">
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
                            <div class="col-12 col-md-12">
                                <Field v-model="tmpData.alamatrek" name="alamatrek" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="Alamat Pemilik Rekening" maxlength="150" outlined type="textarea" autocomplete="off" color="blue" :model-value="value" v-bind="field"
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
                    <p class="text-center">Buku Rekening Bank</p>
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
                                    label="Cari File PDF" 
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
    label: "Nama Bank",
    align: "left",
    field: "details_content_1",
    sortable: true,
},
{
    name: "details_content_8",
    required: true,
    label: "Kota/Cabang",
    align: "left",
    field: "details_content_8",
    sortable: true,
},
{
    name: "details_content_2",
    required: true,
    label: "Alamat",
    align: "left",
    field: row => row.details_content_2+row.details_content_6+row.details_content_7,
    sortable: true,
},
{
    name: "details_content_3",
    required: true,
    label: "No. Rekening / IBAN",
    align: "left",
    field: "details_content_3",
    sortable: true,
},
{
    name: "details_content_9",
    required: true,
    label: "Nama Dalam Rekening",
    align: "left",
    field: "details_content_9",
    sortable: true,
},
{
    name: "details_content_4",
    required: true,
    label: "Nama Pemilik",
    align: "left",
    field: "details_content_4",
    sortable: true,
},
{
    name: "details_content_5",
    required: true,
    label: "Mata Uang",
    align: "left",
    field: "details_content_5",
    sortable: true,
},
{
    name: "details_content_10",
    required: true,
    label: "Data Upload",
    align: "left",
    field: "details_content_10",
    sortable: true,
},
{
    name: "details_content_11",
    required: true,
    label: "TOP",
    align: "left",
    field: "details_content_11",
    sortable: true,
},
{
    name: "sup_code",
    required: true,
    label: "Swift Code",
    align: "left",
    field: "sup_code",
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
const listRekeningBank = ref([]);
const listFile = ref([]);
const updateForm = ref(false);
const dialogForm = ref(false);
const dialogUploadForm = ref(false);
const ftp_link = import.meta.env.VITE_FTP_LINK;

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
    namabank: "",
    kotacab: "",
    nomorrek: "",
    namadalamrek: "",
    namapemilikrek: "",
    matauang: "",
    top: "",
    swiftcode: "",
    alamatrek: "",
    file: [],
    file_view: "",
});

const schema = yup.object({
    // namabank: yup.string().required().label("Nama Bank"),
    namabank: yup.string().required().nullable(true).label("Nama Bank"),
    // kotacab: yup.string().required().label("Kota/Cabang"),
    kotacab: yup.string().required().nullable(true).label("Kota/Cabang"),
    // nomorrek: yup.string().required().label("No. Rekening"),
    nomorrek: yup.number().required().positive().integer().label("No. Rekening / IBAN").typeError("No. Rekening / IBAN must be a number type"),
    // namadalamrek: yup.string().required().label("Nama Dalam Rekening"),
    namapemilikrek: yup.string().required().label("Nama Pemilik Rekening"),
    matauang: yup.string().required().label("Mata Uang"),
    top: yup.string().required().label("TOP"),
    swiftcode: yup.string().required().label("Swift Code"),
    alamatrek: yup.string().required().label("Alamat Pemilik Rekening"),
});

const getRekeningBank = async () => {
    try {
        $q.loading.show();
        const res = await axios.get("getRekeningBank", {
            params: {
                ...pagination.value,
                code: route.params.code,
            },
        });

        listRekeningBank.value = res.data.data;
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
    tmpData.namadalamrek = res.data.regis_name;
}

const addRekeningBank = async () => {
    updateForm.value = false;
    dialogForm.value = true;
    getBank();
    getKotaCabang();
    reset();
};

const editRekeningBank = async (value) => {
    updateForm.value = true;
    dialogForm.value = true;
    tmpData.id = value.sup_dtl_id;
    tmpData.namabank = value.details_content_1;
    // console.log(value.details_content_1);
    tmpData.kotacab = value.details_content_8;
    tmpData.nomorrek = value.details_content_3;
    tmpData.namadalamrek = value.details_content_9;
    tmpData.namapemilikrek = value.details_content_4;
    tmpData.matauang = value.details_content_5;
    tmpData.top = value.details_content_11;
    tmpData.swiftcode = value.sup_code;
    tmpData.file_view = value.details_content_10;
    tmpData.alamatrek = value.details_content_2+value.details_content_6+value.details_content_7;
};

const saveRekeningBank = async () => {
    if (updateForm.value) {
        try {
            $q.loading.show();
            if(tmpData.namadalamrek != tmpData.namapemilikrek && tmpData.file == '' && tmpData.file_view == ''){
                $q.notify({
                    type: "negative",
                    message: "File upload surat pernyataan wajib diisi",
                });          
            }
            else{
                const res = await axios.put("saveRekeningBank/" + tmpData.id, tmpData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                tmpData.file = []; 
                dialogForm.value = false;
                reset();
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
            if(tmpData.namadalamrek != tmpData.namapemilikrek && tmpData.file == ''){               
                $q.notify({
                    type: "negative",
                    message: "File upload surat pernyataan wajib diisi",
                });          
            }
            else{
                const res = await axios.post("saveRekeningBank", tmpData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                tmpData.file = [];  
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

const deleteRekeningBank = (value) => {
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
            await axios.delete("delRekeningBank/" + value.sup_dtl_id);
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

const listBank = ref([]);
const getBank = async () => {
    try {
        const res = await axios.get('getBank', {
            params: {
                bu_id: tmpData.bu_id
            }
        })
        listBank.value = res.data;
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
            getBank();  
        })
    }

    update(() => {
        const neddle = val.toLowerCase();
        listBank.value = listBank.value.filter(option => {
            return option.kodemstr.toLowerCase().includes(neddle)
        }) 
    })
}

const listKotaCab = ref([]);
const getKotaCabang = async () => {
    try {
        const res = await axios.get("getKotaCabang", {
            params: {
                bu_id: tmpData.bu_id,
            },
        });  
        listKotaCab.value = res.data;
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }
};

const filterFn2 = async (val, update) => {
    if (val === '') {
        update(() => {
            getKotaCabang();  
        })
    }

    update(() => {
        const neddle = val.toLowerCase();
        listKotaCab.value = listKotaCab.value.filter(option => {
            return option.kodemstr.toLowerCase().includes(neddle)
        }) 
    })
}

const getDataFile = async () => {
    try {
        const res = await axios.get("getfileRekeningBank", {
            params: {
                code: route.params.code,
            },
        });

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
            const res = await axios.post("savefileRekeningBank", tmpData, {
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
            await axios.delete("delfileRekeningBank/" + value.upload_id);
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

const onRequest = (props) => {
    const { page, rowsPerPage, sortBy, descending, filter } = props.pagination;
    pagination.value.filter = filter;
    pagination.value.page = page;
    pagination.value.rowsPerPage = rowsPerPage;
    pagination.value.sortBy = sortBy;
    pagination.value.descending = descending;
    getRekeningBank();
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
    tmpData.namabank = "";
    tmpData.kotacab = "";
    tmpData.nomorrek = "";
    // tmpData.namadalamrek = "";
    tmpData.namapemilikrek = "";
    tmpData.matauang = "";
    tmpData.top = "";
    tmpData.swiftcode = "";
    tmpData.alamatrek = "";
    tmpData.file = [];
    tmpData.file_view = "";
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