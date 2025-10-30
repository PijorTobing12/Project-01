<template>
    <q-page class="q-pa-lg">
        <q-card class="my-card">
            <div class="q-gutter-y-md">
            <q-card-section class="q-mx-xs">
                <div class="q-mt-sm q-mb-sm q-mb-md">
                    <!-- <divider title="FORM DEWAN DIREKSI" /> -->
                    <span class="text-indigo-10 tw-text-xl text-bold">FORM DEWAN DIREKSI</span>
                </div>
                <!-- <q-btn-group> -->
                    <!-- <q-btn push size="12px" class="q-px-md q-py-xs" color="purple" label="Tambah Data" icon="add" @click="addDewanDireksi"/> -->
                <!-- </q-btn-group> -->
            <!-- </q-card-section> -->
            <!-- <q-separator /> -->
            <!-- <q-card-section> -->
                <div class="q-gutter-sm tw-mb-4">
                    <q-btn size="10px" class="q-py-sm" color="purple" label="Tambah Data" icon="add" @click="addDewanDireksi"/>
                </div>
                <q-table
                    dense
                    title="List Data"
                    :rows="listDewanDireksi"
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
                                    title="Edit Dewan Direksi"
                                    @click="editDewanDireksi(props.row)"
                                />
                                <q-btn
                                    size="9px"
                                    round
                                    color="negative"
                                    icon="delete"
                                    label=""
                                    title="Hapus Dewan Direksi"
                                    @click="deleteDewanDireksi(props.row)"
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
                <q-card-section class="text-center">
                    <div class="text-h6">Form Input Data</div>
                    <p>Dewan Direksi</p>
                </q-card-section>
                <q-separator />
                <Form :validation-schema="schema" @submit="saveDewanDireksi" class="q-mt-md">
                    <q-card-section style="max-height: 50vh" class="scroll">
                        <div class="row q-col-gutter-sm">
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
                                <Field v-model="tmpData.nik" name="nik" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="NIK" autocomplete="off" maxlength="50" outlined type="tel" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <Field v-model="tmpData.jabatan" name="jabatan" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="Jabatan" autocomplete="off" maxlength="50" outlined type="tel" color="blue" :model-value="value" v-bind="field"
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
const listDewanDireksi = ref([]);
const updateForm = ref(false);
const dialogForm = ref(false);

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
    nik: "",
    jabatan: "",
    email: ""
});

const schema = yup.object({
    nama: yup.string().required().label("Nama Lengkap"),
    nik: yup.string().required().label("NIK"),
    jabatan: yup.string().required().label("Jabatan"),
    email: yup.string().required().email().label("Email"),
});

const getDewanDireksi = async () => {
    try {
        $q.loading.show();
        const res = await axios.get("getDewanDireksi", {
            params: {
                ...pagination.value,
                code: route.params.code,
            },
        });

        listDewanDireksi.value = res.data.data;
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
    const res = await axios.get("getDataDewanDireksi", {
        params: {
            enkrip: route.params.enkrip,
            code: route.params.code,
        },
    });

    tmpData.npwp = res.data.regis_npwp;
}

const addDewanDireksi = async () => {
    updateForm.value = false;
    dialogForm.value = true;
    reset();
};

const editDewanDireksi = async (value) => {
    updateForm.value = true;
    dialogForm.value = true;
    tmpData.id = value.sup_dtl_id;
    tmpData.nama = value.details_content_1;
    tmpData.nik = value.details_content_2;
    tmpData.jabatan = value.details_content_3;
    tmpData.email = value.details_content_4;
};

const saveDewanDireksi = async () => {
    if (updateForm.value) {
        try {
            $q.loading.show();
            await axios.put("saveDewanDireksi/" + tmpData.id, tmpData);
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
            const res = await axios.post("saveDewanDireksi", tmpData);
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

const deleteDewanDireksi = (value) => {
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
            await axios.delete("delDewanDireksi/" + value.sup_dtl_id);
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
    tmpData.nik = "";
    tmpData.jabatan = "";
    tmpData.email = "";
};

const onRequest = (props) => {
    const { page, rowsPerPage, sortBy, descending, filter } = props.pagination;
    pagination.value.filter = filter;
    pagination.value.page = page;
    pagination.value.rowsPerPage = rowsPerPage;
    pagination.value.sortBy = sortBy;
    pagination.value.descending = descending;
    getDewanDireksi();
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