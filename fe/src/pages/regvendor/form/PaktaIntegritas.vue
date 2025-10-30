<template>
    <q-page class="q-pa-lg">
        <q-card class="my-card">
            <div class="q-gutter-y-md">
            <q-card-section class="q-mx-xs">
                <div class="q-mt-sm q-mb-sm q-mb-md">
                    <span class="text-indigo-10 tw-text-xl text-bold">FORM PAKTA INTEGRITAS</span>
                </div>

                <!-- <div class="q-gutter-sm tw-mb-4"> -->
                <Form @submit="saveFile">
                <div class="row q-gutter-sm tw-mb-4">
                    <div class="col-12 col-md-12 q-mb-xs">
                        <p><a href="template/PAKTA INTEGRITAS.docx" class="text-italic text-bold text-light-blue-10">Klik</a> untuk mendowload Form Pakta Integritas.</p>
                        <!-- <q-btn size="10px" class="q-py-sm" color="purple" label="Tambah Data" icon="add" @click="addFile"/> -->
                    </div>
                    <div class="col-12 col-md-12">
                        <p class="">Cari File PDF :</p>
                    </div>
                    <div class="col-12 col-md-8">
                        <q-file 
                            outlined 
                            dense 
                            bottom-slots
                            label="Choose File" 
                            v-model="tmpData.file"
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
                    title="List Data"
                    :rows="listFile"
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
            </div>  
        </q-card>

        <!-- <q-dialog v-model="dialogForm">
            <q-card>
                <q-card-section>
                    <div class="text-h6">Form File</div>
                </q-card-section>
                <q-separator />
                <Form @submit="saveFile" class="q-mt-md">
                    <q-card-section style="max-height: 50vh" class="scroll">
                        <div class="row q-col-gutter-sm">
                            <div class="col-12">
                                <q-file outlined dense bottom-slots v-model="tmpData.file" label="Upload File" :max-file-size="10000000" accept=".pdf" color="blue" @rejected="rejectFile" counter :model-value="tmpData.file">
                                    <template v-slot:prepend>
                                        <q-icon name="cloud_upload" @click.stop />
                                    </template>
                                    <template v-slot:append>
                                        <q-icon name="close" @click.stop="model = null" class="cursor-pointer" />
                                    </template>
                                    <template v-slot:hint> Field hint </template>
                                </q-file>
                            </div>
                        </div>
                    </q-card-section>
                    <q-separator />
                    <q-card-actions align="right">
                        <q-btn size="12px" label="Batal" class="q-px-xs q-py-xs" color="negative" v-close-popup />
                        <q-btn size="12px" label="Simpan" class="q-px-xs q-py-xs" color="primary" type="submit" />
                    </q-card-actions>
                </Form>
            </q-card>
        </q-dialog>       -->
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
// const router = useRouter();
const route = useRoute();
const listFile = ref([]);
const dialogForm = ref(false);

const pagination = ref({
    sortBy: "upload_id",
    descending: true,
    page: 1,
    rowsPerPage: 5,
    rowsNumber: 5,
    filter: null,
    from: 0,
});

const tmpData = reactive({
    code: route.params.code,
    file: []
});

const getFile = async () => {
    try {
        $q.loading.show();
        const res = await axios.get("getPaktaIntegritas", {
            params: {
                ...pagination.value,
                code: route.params.code,
            },
        });

        listFile.value = res.data.data;
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

const addFile = async () => {
    dialogForm.value = true;
};

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
            const res = await axios.post("savePaktaIntegritas", tmpData, {
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
            dialogForm.value = false;
            
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
            await axios.delete("delPaktaIntegritas/" + value.upload_id);
            $q.notify({
                type: "positive",
                message: `File berhasil dihapus`,
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
    getFile();
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
    onRequest({
        pagination: pagination.value,
    });   
});

window.localStorage.clear();
</script>