<template>
    <q-page class="q-pa-lg">
        <q-card class="my-card">
            <div class="q-gutter-y-md">
                <q-card class="tw-p-4">
                    <div class="q-mx-xs q-mt-sm q-mb-lg">
                        <!-- <divider title="FORM QUALITY DAN ENVIRONMENT" /> -->
                        <span class="text-indigo-10 tw-text-xl text-bold">FORM QUALITY DAN ENVIRONMENT</span>
                    </div>
                    <!-- <q-separator /> -->

                    <Form @submit="onSubmit">
                        <div class="row q-col-gutter-md q-px-sm q-mb-xs">
                            <div class="col-12 col-md-3">                        
                                <p class="text-bold">Syarat</p>
                                <p class="q-pt-sm">ISO 9001</p>
                            </div>    
                            <div class="col-12 col-md-4 text-center"> 
                                <p class="text-bold">Status</p>
                                <div class="q-mb-xs">
                                    <q-radio class="q-mr-sm" size="xs" val="Yes" label="Ya" v-model="tmpData.status_1" :model-value="tmpData.status_1" color="blue" />
                                    <q-radio size="xs" val="No" label="Tidak" v-model="tmpData.status_1" :model-value="tmpData.status_1" color="blue" />                              
                                </div>
                            </div>   
                            <div class="col-12 col-md-4 text-center"> 
                                <p class="text-bold">Versi</p>
                                <div class="q-mb-xs">
                                    <q-radio class="q-mr-sm" size="xs" val="2008" label="2008" v-model="tmpData.versi_1" :model-value="tmpData.versi_1" color="blue" />
                                    <q-radio size="xs" val="2015" label="2015" v-model="tmpData.versi_1" :model-value="tmpData.versi_1" color="blue" />                              
                                </div>
                            </div>                  
                        </div>
                        <q-separator />
                        <div class="row q-col-gutter-md q-px-sm q-my-xs">
                            <div class="col-12 col-md-3">                        
                                <p class="text-bold">Syarat</p>
                                <p class="q-pt-sm">ISO 14001</p>
                            </div>    
                            <div class="col-12 col-md-4 text-center"> 
                                <p class="text-bold">Status</p>
                                <div class="q-mb-xs">
                                    <q-radio class="q-mr-sm" size="xs" val="Yes" label="Ya" v-model="tmpData.status_2" :model-value="tmpData.status_2" color="blue" />
                                    <q-radio size="xs" val="No" label="Tidak" v-model="tmpData.status_2" :model-value="tmpData.status_2" color="blue" />                              
                                </div>
                            </div>   
                            <div class="col-12 col-md-4 text-center"> 
                                <p class="text-bold">Versi</p>
                                <div class="q-mb-xs">
                                    <q-radio class="q-mr-sm" size="xs" val="2008" label="2008" v-model="tmpData.versi_2" :model-value="tmpData.versi_2" color="blue" />
                                    <q-radio class="q-mr-sm" size="xs" val="2015" label="2015" v-model="tmpData.versi_2" :model-value="tmpData.versi_2" color="blue" /> 
                                    <q-radio class="q-mr-sm" size="xs" val="Emas" label="Emas" v-model="tmpData.versi_2" :model-value="tmpData.versi_2" color="blue" /> 
                                    <q-radio size="xs" val="Lainnya" label="Lainnya" v-model="tmpData.versi_2" :model-value="tmpData.versi_2" color="blue" />                              
                                </div>
                            </div>                  
                        </div>
                        <q-separator />
                        <div class="row q-col-gutter-md q-px-sm q-my-xs">
                            <div class="col-12 col-md-3">                        
                                <p class="text-bold">Syarat</p>
                                <p class="q-pt-sm">OHSAS 18001</p>
                            </div>    
                            <div class="col-12 col-md-4 text-center"> 
                                <p class="text-bold">Status</p>
                                <div class="q-mb-xs">
                                    <q-radio class="q-mr-sm" size="xs" val="Yes" label="Ya" v-model="tmpData.status_3" :model-value="tmpData.status_3" color="blue" />
                                    <q-radio size="xs" val="No" label="Tidak" v-model="tmpData.status_3" :model-value="tmpData.status_3" color="blue" />                              
                                </div>
                            </div>   
                            <div class="col-12 col-md-4 text-center"> 
                                <p class="text-bold">Versi</p>
                                <div class="q-mb-xs">
                                    <q-radio class="q-mr-sm" size="xs" val="2008" label="2008" v-model="tmpData.versi_3" :model-value="tmpData.versi_3" color="blue" />
                                    <q-radio class="q-mr-sm" size="xs" val="2015" label="2015" v-model="tmpData.versi_3" :model-value="tmpData.versi_3" color="blue" /> 
                                    <q-radio size="xs" val="Emas" label="Emas" v-model="tmpData.versi_3" :model-value="tmpData.versi_3" color="blue" />                              
                                </div>
                            </div>                  
                        </div>
                        <q-separator />
                        <div class="row q-col-gutter-md q-px-sm q-my-xs">
                            <div class="col-12 col-md-3">                        
                                <p class="text-bold">Syarat</p>
                                <p class="q-pt-sm">Customer Audit</p>
                            </div>    
                            <div class="col-12 col-md-4 text-center"> 
                                <p class="text-bold">Status</p>
                                <div class="q-mb-xs">
                                    <q-radio class="q-mr-sm" size="xs" val="Yes" label="Ya" v-model="tmpData.status_4" :model-value="tmpData.status_4" color="blue" />
                                    <q-radio size="xs" val="No" label="Tidak" v-model="tmpData.status_4" :model-value="tmpData.status_4" color="blue" />                              
                                </div>
                            </div>              
                        </div>
                        <q-separator />
                        <div class="row q-col-gutter-md q-px-sm q-my-xs">
                            <div class="col-12 col-md-3">                        
                                <p class="text-bold">Syarat</p>
                                <p class="q-pt-sm">Standard Lainnya</p>
                            </div>    
                            <div class="col-12 col-md-4 text-center"> 
                                <p class="text-bold">Status</p>
                                <div class="q-mb-xs">
                                    <q-radio class="q-mr-sm" size="xs" val="Yes" label="Ya" v-model="tmpData.status_5" :model-value="tmpData.status_5" color="blue" />
                                    <q-radio size="xs" val="No" label="Tidak" v-model="tmpData.status_5" :model-value="tmpData.status_5" color="blue" />                              
                                </div>
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
                    <p class="text-center">Quality and Environment</p>
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
    status_1: "",
    status_2: "",
    status_3: "",
    status_4: "",
    status_5: "",
    versi_1: "",
    versi_2: "",
    versi_3: "",
    file: [],
});

const onSubmit = async (value) => {
    try{
        $q.loading.show();

        // cek jika status Ya, maka versi harus diisi
        if(tmpData.status_1 == 'Yes' && tmpData.versi_1 == ''){
            $q.notify({
                type: "negative",
                message: "Versi ISO 9001 belum dicentang",
            }); 
        }
        else if(tmpData.status_2 == 'Yes' && tmpData.versi_2 == ''){
            $q.notify({
                type: "negative",
                message: "Versi ISO 14001 belum dicentang",
            }); 
        }
        else if(tmpData.status_3 == 'Yes' && tmpData.versi_3 == ''){
            $q.notify({
                type: "negative",
                message: "Versi OHSAS 18001 belum dicentang",
            }); 
        }
        else{
            const res = await axios.post("saveQualityEnvironment", tmpData, {
                params: {
                    code: route.params.code,
                },
            });

            $q.notify({
                type: "positive",
                message: res.data.message,
            });        
            getData();
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

const getData = async () => {
    try {
        const res = await axios.put("getQualityEnvironment/" + route.params.code + "/17");
        if(res.data){
            tmpData.status_1 = res.data.data1[0];
            tmpData.status_2 = res.data.data2[0];
            tmpData.status_3 = res.data.data3[0];
            tmpData.status_4 = res.data.data4[0];
            tmpData.status_5 = res.data.data5[0];
            tmpData.versi_1 = res.data.data1[1];
            tmpData.versi_2 = res.data.data2[1];
            tmpData.versi_3 = res.data.data3[1];
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
        const res = await axios.get("getfileQualityEnvironment", {
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
            const res = await axios.post("savefileQualityEnvironment", tmpData, {
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
            await axios.delete("delfileQualityEnvironment/" + value.upload_id);
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
    getDataFile();
});

window.localStorage.clear();
</script>