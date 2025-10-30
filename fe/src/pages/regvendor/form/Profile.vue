<template>
    <q-page class="q-pa-lg">
        <q-card class="my-card">
            <div class="q-gutter-y-md">
                <q-card class="tw-p-4">
                    <div class="q-mx-xs q-mt-sm q-mb-md">
                        <span class="text-indigo-10 tw-text-xl text-bold">FORM PROFILE</span>
                    </div>

                    <Form :validation-schema="schema" @submit="onSubmit">
                        <div class="row q-col-gutter-sm q-px-xs">
                            <div class="col-12 col-md-12">
                                <Field v-model="tmpData.npwp" name="npwp" v-slot="{ errorMessage, value, field }">
                                <q-input dense label="NPWP Perusahaan" autocomplete="off" maxlength="50" outlined readonly type="tel" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-12">
                                <Field v-model="tmpData.namavend" name="namaVend" v-slot="{ errorMessage, value, field }">
                                <q-input dense label="Nama Perusahaan (* Tidak perlu menyertakan Title Perusahaan)" autocomplete="off" maxlength="50" outlined type="tel" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-12">
                                <Field
                                    v-model="tmpData.katVend"
                                    name="katVend"
                                    v-slot="{ errorMessage, handleChange, value }"
                                >
                                    <q-select
                                        dense
                                        outlined  
                                        emit-value
                                        map-options
                                        label="Kategori Vendor"
                                        :model-value="value"
                                        @update:modelValue="handleChange"
                                        input-debounce="0"
                                        color="blue"
                                        option-value="kat_vend_name"
                                        option-label="kat_vend_name"
                                        :options="listKat"   
                                        :error-message="errorMessage"
                                        :error="!!errorMessage"
                                        @update:model-value="valueKat"
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
                            <div class="col-12 col-md-12">
                                <Field
                                    v-model="tmpData.katsubVend"
                                    name="katsubVend"
                                    v-slot="{ errorMessage, handleChange, value }"
                                >
                                    <q-select
                                        dense
                                        outlined
                                        emit-value
                                        map-options
                                        label="Sub Kategori Vendor"
                                        :model-value="value"
                                        @update:modelValue="handleChange"
                                        input-debounce="0"
                                        color="blue"
                                        option-value="katsub_vend_name"
                                        option-label="katsub_vend_name"
                                        :options="listKatSub"
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
                                <div class="q-mb-md">
                                    <span class="tw-ml-1 text-bold">Bentuk Perusahaan :</span>
                                    <div>
                                        <q-radio class="q-mr-sm" size="xs" val="Tbk" label="Tbk" v-model="tmpData.bentukPers" :model-value="tmpData.bentukPers" color="blue" @update:model-value="benPer" />
                                        <q-radio class="q-mr-sm" size="xs" val="PT" label="PT" v-model="tmpData.bentukPers" :model-value="tmpData.bentukPers" color="blue" @update:model-value="benPer" />
                                        <q-radio class="q-mr-sm" size="xs" val="CV" label="CV" v-model="tmpData.bentukPers" :model-value="tmpData.bentukPers" color="blue" @update:model-value="benPer" />
                                        <q-radio class="q-mr-sm" size="xs" val="UD" label="UD" v-model="tmpData.bentukPers" :model-value="tmpData.bentukPers" color="blue" @update:model-value="benPer" />
                                        <q-radio class="q-mr-sm" size="xs" val="Pribadi" label="Pribadi" v-model="tmpData.bentukPers" :model-value="tmpData.bentukPers" color="blue" @update:model-value="benPer" />
                                        <q-radio class="q-mr-sm" size="xs" val="Lainnya" label="Lainnya" v-model="tmpData.bentukPers" :model-value="tmpData.bentukPers" color="blue" @update:model-value="benPer" />
                                        <q-input v-if="benLainnya" style="width:13%; display: inline-block;" dense outlined v-model="tmpData.bentukPersLain" :autofocus="benLainnya" />
                                    </div>
                                </div>
                            </div>
                            <div class="col-12 col-md-6">
                                <div class="q-mb-md">
                                    <span class="tw-ml-1 text-bold">Jenis Perusahaan :</span>
                                    <div>
                                        <q-radio class="q-mr-sm" size="xs" val="Manufacture" label="Manufacture" v-model="tmpData.jenisPers" :model-value="tmpData.jenisPers" color="blue" />
                                        <q-radio class="q-mr-sm" size="xs" val="Trading" label="Trading" v-model="tmpData.jenisPers" :model-value="tmpData.jenisPers" color="blue" />
                                        <q-radio class="q-mr-sm" size="xs" val="Keagenan Resmi" label="Keagenan Resmi" v-model="tmpData.jenisPers" :model-value="tmpData.jenisPers" color="blue" />
                                        <q-radio class="q-mr-sm" size="xs" val="Lainnya" label="Lainnya" v-model="tmpData.jenisPers" :model-value="tmpData.jenisPers" color="blue" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- <div v-if="benLainnya" class="row q-col-gutter-md q-px-xs">
                            <div class="col-12 col-md-6">
                                <div class="q-mb-md">
                                    <q-input dense outlined label="Bentuk Perusahaan Lainnya" v-model="tmpData.bentukPersLain" />
                                </div>
                            </div>
                            <div class="col-12 col-md-6">
                                <div class="q-mb-xs"></div>
                            </div>
                        </div> -->

                        <div class="row q-col-gutter-md q-px-xs">
                            <div class="col-12 col-md-6">
                                <Field v-model="tmpData.emailpers" name="emailpers" v-slot="{ errorMessage, value, field }">
                                <q-input dense label="Email 1 (untuk Registrasi & PO)" autocomplete="off" maxlength="50" outlined type="tel" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                                <Field v-model="tmpData.emailpers2" name="emailpers2" v-slot="{ errorMessage, value, field }">
                                <q-input dense label="Email ke-2 (untuk Tanda Terima Faktur)" autocomplete="off" maxlength="50" outlined type="tel" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                                <p class="tw-ml-1 q-mb-sm text-bold">Kantor Pusat :</p>
                                <Field v-model="tmpData.alamatkantor" name="alamatkantor" v-slot="{ errorMessage, value, field }" >
                                <q-input dense label="Alamat (* Sesuai dengan NPWP)" autocomplete="off" maxlength="120" outlined type="textarea" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                                <Field v-model="tmpData.noteleponkantor" name="noteleponkantor" v-slot="{ errorMessage, value, field }">
                                <q-input class="q-mt-sm" dense label="No. Telepon" autocomplete="off" maxlength="50" outlined type="tel" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                                <Field v-model="tmpData.nofaxkantor" name="nofaxkantor" v-slot="{ errorMessage, value, field }">
                                <q-input class="q-mt-sm" dense label="No. Fax" autocomplete="off" maxlength="50" outlined type="tel" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <Field v-model="tmpData.webpers" name="webpers" v-slot="{ errorMessage, value, field }">
                                <q-input dense label="Website Perusahaan" autocomplete="off" maxlength="50" outlined type="tel" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                                <Field v-model="tmpData.emailpers3" name="emailpers3" v-slot="{ errorMessage, value, field }">
                                <q-input dense label="Email ke-3" autocomplete="off" maxlength="50" outlined type="tel" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                                <p class="tw-ml-1 q-mb-sm text-bold">Workshop / Pabrik :</p>
                                <Field v-model="tmpData.alamatpabrik" name="alamatpabrik" v-slot="{ errorMessage, value, field }">
                                <q-input dense label="Alamat (* Sesuai dengan NPWP)" autocomplete="off" maxlength="120" outlined type="textarea" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                                <Field v-model="tmpData.noteleponpabrik" name="noteleponpabrik" v-slot="{ errorMessage, value, field }">
                                <q-input class="q-mt-sm" dense label="No. Telepon" autocomplete="off" maxlength="50" outlined type="tel" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                                <Field v-model="tmpData.nofaxpabrik" name="nofaxpabrik" v-slot="{ errorMessage, value, field }">
                                <q-input class="q-mt-sm" dense label="No. Fax" autocomplete="off" maxlength="50" outlined type="tel" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>               
                            </div>
                        </div>

                        <div class="q-pa-xs q-gutter-sm q-px-xs">
                            <q-btn size="11px" class="q-py-sm" color="blue" label="Simpan" type="submit" icon="save" />
                        </div>
                    </Form>  
                </q-card>
            </div>                    
        </q-card>
    </q-page>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from "vue";
import { Field, Form } from "vee-validate";
import * as yup from "yup";
import axios from "axios"
import { ParseError } from "./../../../utils";
import { useRouter, useRoute } from "vue-router";
import { useQuasar } from "quasar";

const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const benLainnya = ref(false);
const listKat = ref([]);
const listKatSub = ref([]);

const tmpData = reactive({
    npwp: "",
    namavend: "",
    katVend: "",
    katsubVend: "",
    bentukPers: "",
    bentukPersLain: "",
    jenisPers: "",
    emailpers: "",
    emailpers2: "",
    emailpers3: "",
    alamatkantor: "",
    noteleponkantor: "",
    nofaxkantor: "",
    webpers: "",
    alamatpabrik: "",
    noteleponpabrik: "",
    nofaxpabrik: "",
    progress: 0,
});

const schema = yup.object({
    namaVend: yup.string().required().label("Nama Perusahaan").typeError("Nama Perusahaan is a required field"),
    katVend: yup.string().required().label("Kategori Vendor").typeError("Kategori Vendor is a required field"),
    katsubVend: yup.string().required().label("Sub Kategori Vendor").typeError("Sub Kategori Vendor is a required field"),
    alamatkantor: yup.string().required().label("Alamat").typeError("Alamat is a required field"),
    noteleponkantor: yup.string().required().label("No. Telepon").typeError("No. Telepon is a required field"),
    emailpers: yup.string().required().email().label("Email Perusahaan").typeError("Email Perusahaan is a required field"),
    // emailpers2: yup.string().required().email().label("Email Perusahaan").typeError("Email ke-2 is a required field"),
    // emailpers3: yup.string().required().email().label("Email Perusahaan").typeError("Email ke-3 is a required field"),
});

const getKategori = async () => {
    try {
        const res = await axios.get("getKategori");
        
        listKat.value = res.data;
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }
};

const getData = async () => {
    const res = await axios.get("getDataProfile", {
        params: {
            enkrip: route.params.enkrip,
            code: route.params.code,
        },
    });

    tmpData.katVend = res.data.data.sup_cat;
    tmpData.katsubVend = res.data.data.sup_type;

    tmpData.bentukPers = res.data.data.sup_form_company;

    if (res.data.data.sup_form_company == "Lainnya") {
        benLainnya.value = true;   
    } else {
        benLainnya.value = false;    
    }

    tmpData.bentukPersLain = res.data.data.sup_comp_other;
    tmpData.jenisPers = res.data.data.sup_type_company;

    tmpData.npwp = res.data.data.sup_npwp;
    tmpData.namavend = res.data.data.sup_name;
    tmpData.emailpers = res.data.data.sup_email;
    tmpData.emailpers2 = res.data.data.sup_email2;
    tmpData.emailpers3 = res.data.data.sup_email3;
    tmpData.alamatkantor = res.data.data.sup_office_address;
    tmpData.noteleponkantor = res.data.data.sup_office_phone;
    tmpData.nofaxkantor = res.data.data.sup_office_fax;
    tmpData.webpers = res.data.data.sup_website;
    tmpData.alamatpabrik = res.data.data.sup_warehouse_address;
    tmpData.noteleponpabrik = res.data.data.sup_warehouse_phone;
    tmpData.nofaxpabrik = res.data.data.sup_warehouse_fax;

    if(tmpData.katVend){
        const res1 = await axios.get("getKategoriSub", {
            params: {
                name: tmpData.katVend,
            },
        });
        listKatSub.value = res1.data; 
    }
}

const onSubmit = async (value) => {
    try {
        $q.loading.show();
        if ((tmpData.bentukPers == null || tmpData.bentukPers == "") || (tmpData.jenisPers == null || tmpData.jenisPers == "")) {
            $q.notify({
                type: "negative",
                message: "Isian Bentuk / Jenis Perusahaan masih kosong",
            });
        } /* else if (tmpData.bentukPers == "Lainnya" && (tmpData.bentukPersLain == null || tmpData.bentukPersLain == "")) {
            $q.notify({
                type: "negative",
                message: "Isian Bentuk Perusahaan lainnya masih kosong",
            });
        } */ else {
            const res = await axios.put("saveProfile/" + route.params.code + "/" + tmpData.npwp, tmpData);
            $q.notify({
                type: "positive",
                message: "Data berhasil diubah",
            });
            // getData();
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

const valueKat = async (value) => {
    try {
        const res = await axios.get("getKategoriSub", {
            params: {
                name: value,
            },
        });  
        tmpData.katsubVend = '';
        listKatSub.value = res.data;    
    } catch (error) {
        $q.notify({
            type: "negative",
         message: ParseError(error),
        });
    }
}

const benPer = async (value, evt) => {
    if (value == "Lainnya") {
        benLainnya.value = true;   
    } else {
        benLainnya.value = false;    
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
    getData();
    getKategori();
});

window.localStorage.clear();
</script>