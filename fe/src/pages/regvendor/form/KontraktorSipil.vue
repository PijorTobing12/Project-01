<template>
    <q-page class="q-pa-lg">
      <q-card class="my-card">
        <div class="q-gutter-y-md">
            <q-card class="tw-p-4">
                <div class="q-mx-xs q-mt-sm q-mb-lg">
                        <!-- <divider title="FORM KELENGKAPAN TAMBAHAN UNTUK KONTRAKTOR SIPIL / ELEKTRIKAL" /> -->
                        <span class="text-indigo-10 tw-text-xl text-bold">FORM KELENGKAPAN TAMBAHAN UNTUK KONTRAKTOR SIPIL / ELEKTRIKAL</span>
                    </div>
                
                <!-- <q-separator /> -->

                <Form @submit="onSubmit" class="q-mt-md">
                    <div class="row q-col-gutter-md q-px-sm q-mb-lg">
                        <div class="col-12 col-md-3">                        
                            <p class="">Sertifikat Ijin Usaha Jasa Kelistrikan dari PLN</p>
                        </div>
                        <div class="col-12 col-md-3">
                            <q-input dense outlined v-model="tmpData.nodok_1" name="nodok_1" autocomplete="off" color="blue" label="Nomor Dokumen" :model-value="tmpData.nodok_1" />
                        </div>
                        <div class="col-12 col-md-3">
                            <q-input
                                v-model="tmpData.tglkeluar_1"
                                name="tglkeluar_1"
                                dense
                                outlined
                                autocomplete="off"
                                color="blue"
                                label="Tgl. Dikeluarkan"
                                mask="##/##/####"
                                fill-mask="-"
                                :model-value="tmpData.tglkeluar_1"
                            >
                            <template v-slot:append>
                                <q-icon name="event" class="cursor-pointer">
                                    <q-popup-proxy ref="datePopup" cover transition-show="scale" transition-hide="scale">
                                        <q-date v-model="tmpData.tglkeluar_1" mask="DD/MM/YYYY" color="blue" @update:model-value="hideDate" :model-value="tmpData.tglkeluar_1">
                                        </q-date>
                                    </q-popup-proxy>
                                </q-icon>
                            </template>
                            </q-input>
                        </div>
                        <div class="col-12 col-md-3">
                            <q-input
                                v-model="tmpData.tglakhir_1"
                                name="tglakhir_1"
                                dense
                                outlined
                                autocomplete="off"
                                color="blue"
                                label="Tgl. Berakhir"
                                mask="##/##/####"
                                fill-mask="-"
                                :model-value="tmpData.tglakhir_1"
                            >
                            <template v-slot:append>
                                <q-icon name="event" class="cursor-pointer">
                                    <q-popup-proxy ref="datePopup" cover transition-show="scale" transition-hide="scale">
                                        <q-date v-model="tmpData.tglakhir_1" mask="DD/MM/YYYY" color="blue" @update:model-value="hideDate" :model-value="tmpData.tglakhir_1">
                                        </q-date>
                                    </q-popup-proxy>
                                </q-icon>
                            </template>
                            </q-input>
                        </div>                        
                    </div>
                    <q-separator />
                    <div class="row q-col-gutter-md q-pl-sm q-mt-sm q-mb-lg">
                        <div class="col-12 col-md-3">                        
                            <p class="">Surat Ijin Usaha (SIUJK/LPJK)</p>
                        </div>
                        <div class="col-12 col-md-3">
                            <q-input v-model="tmpData.nodok_2" name="nodok_2" dense outlined autocomplete="off" color="blue" label="Nomor Dokumen" :model-value="tmpData.nodok_2" />
                        </div>
                        <div class="col-12 col-md-3">
                            <q-input
                                v-model="tmpData.tglkeluar_2"
                                name="tglkeluar_2"
                                dense
                                outlined
                                autocomplete="off"
                                color="blue"
                                label="Tgl. Dikeluarkan"
                                mask="##/##/####"
                                fill-mask="-" 
                                :model-value="tmpData.tglkeluar_2"
                            >
                            <template v-slot:append>
                                <q-icon name="event" class="cursor-pointer">
                                    <q-popup-proxy ref="datePopup" cover transition-show="scale" transition-hide="scale">
                                        <q-date v-model="tmpData.tglkeluar_2" mask="DD/MM/YYYY" color="blue" @update:model-value="hideDate" :model-value="tmpData.tglkeluar_2">
                                        </q-date>
                                    </q-popup-proxy>
                                </q-icon>
                            </template>
                            </q-input>
                        </div>
                        <div class="col-12 col-md-3">
                            <q-input
                                v-model="tmpData.tglakhir_2"
                                name="tglakhir_2"
                                dense
                                outlined
                                autocomplete="off"
                                color="blue"
                                label="Tgl. Berakhir"
                                mask="##/##/####"
                                fill-mask="-" 
                                :model-value="tmpData.tglakhir_2"
                            >
                            <template v-slot:append>
                                <q-icon name="event" class="cursor-pointer">
                                    <q-popup-proxy ref="datePopup" cover transition-show="scale" transition-hide="scale">
                                        <q-date v-model="tmpData.tglakhir_2" mask="DD/MM/YYYY" color="blue" @update:model-value="hideDate" :model-value="tmpData.tglakhir_2">
                                        </q-date>
                                    </q-popup-proxy>
                                </q-icon>
                            </template>
                            </q-input>
                        </div>                        
                    </div>
                    <q-separator />
                    <div class="q-pa-xs q-gutter-sm q-mt-sm">
                        <q-btn size="11px" class="q-py-sm" color="blue" label="Simpan" type="submit" icon="save" />
                        <q-btn size="11px" class="q-py-sm" color="secondary" label="Upload File" icon="list" @click="uploadFile" />
                    </div>
                </Form>
            </q-card>
        </div>
      </q-card>

      <q-dialog v-model="dialogForm">
            <q-card style="width: 700px; max-width: 80vw;">
                <q-card-section>
                    <div class="text-h6 text-center">Form List Upload Data</div>
                    <p class="text-center">Kelengkapan Tambahan untuk Vendor Trading</p>
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
                        :columns="columns"
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
import { Field, Form } from "vee-validate";
import * as yup from "yup";
import axios from "axios"
import { useRouter, useRoute } from "vue-router";
import { useQuasar } from "quasar";
import * as dayjs from "dayjs";

const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const datePopup = ref(null);
const listFile = ref([]);
const dialogForm = ref(false);

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
    npwp: "",
    nodok_1: "",
    tglkeluar_1: "",
    tglakhir_1: "",
    nodok_2: "",
    tglkeluar_2: "",
    tglakhir_2: "",
    file: [],
});

const onSubmit = async (value) => {
    try{
        $q.loading.show();
        const res = await axios.post("saveKontraktorSipil", tmpData, {
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
        console.log(res.data);
        getData();
        setProgress();
        $q.loading.hide();
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }
};

const getData = async () => {
    try {
        const res = await axios.put("getKontraktorSipil/" + route.params.code + "/13");
        if(res.data){
            tmpData.nodok_1 = res.data.data1[0].dok;
            tmpData.tglkeluar_1 = res.data.data1[1].tglkeluar;
            tmpData.tglakhir_1 = res.data.data1[2].tglakhir;

            tmpData.nodok_2 = res.data.data2[0].dok;
            tmpData.tglkeluar_2 = res.data.data2[1].tglkeluar;
            tmpData.tglakhir_2 = res.data.data2[2].tglakhir;
        }
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }    
}

const getDataFile = async () => {
    try {
        const res = await axios.get("getfileKontraktorSipil", {
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
    dialogForm.value = true;
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
            const res = await axios.post("savefileKontraktorSipil", tmpData, {
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
            await axios.delete("delfileKontraktorSipil/" + value.upload_id);
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

const hideDate = () => {
    datePopup.value.hide()
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
    getData();
    getDataFile();
});

window.localStorage.clear();
</script>