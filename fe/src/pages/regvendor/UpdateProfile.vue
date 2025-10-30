<template>
    <div class="q-pa-md">
        <q-card>
            <q-card-section>
                <div class="tw-text-lg tw-font-semibold">
                    UPDATE PROFILE
                </div>
            </q-card-section>

            <q-separator />

            <q-card-section>
                <Form :validation-schema="schema" @submit="onSubmit">
                <div class="row q-col-gutter-lg q-px-xs">
                    <div class="col-12 col-md-6">
                        <p class="tw-text-md q-mb-md text-bold text-center">Current Data</p>
                        <q-input class="q-mb-md" dense label="NPWP Perusahaan" outlined readonly type="tel" :model-value="tmpData.npwp" />
                        <Field name="" v-slot="{ errorMessage }">
                            <q-input dense label="Nama Perusahaan" outlined readonly :model-value="tmpData.namavend_view" :error="!!errorMessage" />
                        </Field>
                        <Field name="" v-slot="{ errorMessage }">
                            <q-select
                                dense
                                outlined  
                                readonly
                                label="Kategori Vendor"
                                :model-value="tmpData.katVend_view"
                                :error="!!errorMessage"
                            />
                        </Field>
                        <Field name="" v-slot="{ errorMessage }">
                            <q-select
                                dense
                                outlined  
                                readonly
                                label="Sub Kategori Vendor"
                                :model-value="tmpData.katsubVend_view"
                                :error="!!errorMessage"
                            />
                        </Field>
                        <div class="q-mb-sm">
                            <span class="">Bentuk Perusahaan :</span>
                            <div class="q-ml-md q-mt-xs">
                                <q-radio class="q-mr-sm" size="xs" disable val="Tbk" label="Tbk" :model-value="tmpData.bentukPers_view" color="blue" />
                                <q-radio class="q-mr-sm" size="xs" disable val="PT" label="PT" :model-value="tmpData.bentukPers_view" color="blue" />
                                <q-radio class="q-mr-sm" size="xs" disable val="CV" label="CV" :model-value="tmpData.bentukPers_view" color="blue" />
                                <q-radio class="q-mr-sm" size="xs" disable val="UD" label="UD" :model-value="tmpData.bentukPers_view" color="blue" />
                                <q-radio class="q-mr-sm" size="xs" disable val="Pribadi" label="Pribadi" :model-value="tmpData.bentukPers_view" color="blue" />
                                <q-radio size="xs" disable val="Lainnya" label="Lainnya" :model-value="tmpData.bentukPers_view" color="blue" />
                                <q-input v-if="benLainnya_view" class="q-ml-sm" style="width:13%; display: inline-block;" dense outlined readonly v-model="tmpData.bentukPersLain_view" />
                            </div>                               
                        </div>
                        <div class="q-mb-md">
                            <span class="">Jenis Perusahaan :</span>
                            <div class="q-ml-md q-mt-xs">
                                <q-radio class="q-mr-sm" size="xs" disable val="Manufacture" label="Manufacture" :model-value="tmpData.jenisPers_view" color="blue" />
                                <q-radio class="q-mr-sm" size="xs" disable val="Trading" label="Trading" :model-value="tmpData.jenisPers_view" color="blue" />
                                <q-radio class="q-mr-sm" size="xs" disable val="Keagenan Resmi" label="Keagenan Resmi" :model-value="tmpData.jenisPers_view" color="blue" />
                                <q-radio size="xs" disable val="Lainnya" label="Lainnya" :model-value="tmpData.jenisPers_view" color="blue" />  
                            </div>                           
                        </div>
                        <Field name="" v-slot="{ errorMessage }">
                            <q-input dense label="Email 1 (untuk Registrasi & PO)" outlined readonly type="tel" :model-value="tmpData.emailpers_view" :error="!!errorMessage" />
                        </Field>
                        <Field name="" v-slot="{ errorMessage }">
                            <q-input dense label="Email ke-2 (untuk Tanda Terima Faktur)" outlined readonly type="tel" :model-value="tmpData.emailpers2_view" :error="!!errorMessage" />
                        </Field>
                        <Field name="" v-slot="{ errorMessage }">
                            <q-input dense label="Email ke-3" outlined readonly type="tel" :model-value="tmpData.emailpers3_view" :error="!!errorMessage" />
                        </Field>
                        <Field name="" v-slot="{ errorMessage }">
                            <q-input dense label="Website Perusahaan" outlined readonly type="tel" :model-value="tmpData.webpers_view" :error="!!errorMessage" />
                        </Field>
                        <p class="q-mb-sm">Kantor Pusat</p>
                        <Field name="" v-slot="{ errorMessage }">
                            <q-input dense label="Alamat" outlined readonly type="textarea" :model-value="tmpData.alamatkantor_view" :error="!!errorMessage" />
                        </Field>
                        <Field name="" v-slot="{ errorMessage }">
                            <q-input dense label="No. Telepon" outlined readonly type="tel" :model-value="tmpData.noteleponkantor_view" :error="!!errorMessage" />
                        </Field>
                        <Field name="" v-slot="{ errorMessage }">
                            <q-input dense label="No. Fax" outlined readonly type="tel" :model-value="tmpData.nofaxkantor_view" :error="!!errorMessage" />
                        </Field>

                        <p class="q-mb-sm">Workshop / Pabrik</p>
                        <Field name="" v-slot="{ errorMessage }">
                            <q-input dense label="Alamat" outlined readonly type="textarea" :model-value="tmpData.alamatpabrik_view" :error="!!errorMessage" />
                        </Field>
                        <Field name="" v-slot="{ errorMessage }">
                            <q-input dense label="No. Telepon" outlined readonly type="tel" :model-value="tmpData.noteleponpabrik_view" :error="!!errorMessage" />
                        </Field>
                        <Field name="" v-slot="{ errorMessage }">
                            <q-input dense label="No. Fax" outlined readonly type="tel" :model-value="tmpData.nofaxpabrik_view" :error="!!errorMessage" />
                        </Field>
                    </div>
                    <div class="col-12 col-md-6">
                        <p class="q-mb-md text-bold text-center">New Data</p>
                        <q-input class="q-mb-md" dense label="NPWP Perusahaan" outlined readonly v-model="tmpData.npwp" type="tel" :model-value="tmpData.npwp" />
                        <Field v-model="tmpData.namavend" name="namaVend" v-slot="{ errorMessage, value, field }">
                            <q-input dense label="Nama Perusahaan" autocomplete="off" maxlength="50" outlined type="tel" :model-value="value" v-bind="field"
                                :error-message="errorMessage" :error="!!errorMessage" />
                        </Field>
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
                        <div class="q-mb-sm">
                            <span class="">Bentuk Perusahaan :</span>
                            <div class="q-ml-md q-mt-xs">
                                <q-radio class="q-mr-sm" size="xs" v-model="tmpData.bentukPers" val="Tbk" label="Tbk" :model-value="tmpData.bentukPers" color="blue" @update:model-value="benPer" />
                                <q-radio class="q-mr-sm" size="xs" v-model="tmpData.bentukPers" val="PT" label="PT" :model-value="tmpData.bentukPers" color="blue" @update:model-value="benPer" />
                                <q-radio class="q-mr-sm" size="xs" v-model="tmpData.bentukPers" val="CV" label="CV" :model-value="tmpData.bentukPers" color="blue" @update:model-value="benPer" />
                                <q-radio class="q-mr-sm" size="xs" v-model="tmpData.bentukPers" val="UD" label="UD" :model-value="tmpData.bentukPers" color="blue" @update:model-value="benPer" />
                                <q-radio class="q-mr-sm" size="xs" v-model="tmpData.bentukPers" val="Pribadi" label="Pribadi" :model-value="tmpData.bentukPers" color="blue" @update:model-value="benPer" />
                                <q-radio size="xs" v-model="tmpData.bentukPers" val="Lainnya" label="Lainnya" :model-value="tmpData.bentukPers" color="blue" @update:model-value="benPer" />
                                <q-input v-if="benLainnya" class="q-ml-sm" style="width:13%; display: inline-block;" dense outlined v-model="tmpData.bentukPersLain" :autofocus="benLainnya" />
                            </div>                               
                        </div>
                        <div class="q-mb-md">
                            <span class="">Jenis Perusahaan :</span>    
                            <div class="q-ml-md q-mt-xs">
                                <q-radio class="q-mr-sm" size="xs" v-model="tmpData.jenisPers" val="Manufacture" label="Manufacture" :model-value="tmpData.jenisPers" color="blue" />
                                <q-radio class="q-mr-sm" size="xs" v-model="tmpData.jenisPers" val="Trading" label="Trading" :model-value="tmpData.jenisPers" color="blue" />
                                <q-radio class="q-mr-sm" size="xs" v-model="tmpData.jenisPers" val="Keagenan Resmi" label="Keagenan Resmi" :model-value="tmpData.jenisPers" color="blue" />
                                <q-radio size="xs" v-model="tmpData.jenisPers" val="Lainnya" label="Lainnya" :model-value="tmpData.jenisPers" color="blue" />  
                            </div>                           
                        </div>
                        <Field v-model="tmpData.emailpers" name="emailpers" v-slot="{ errorMessage, value, field }">
                            <q-input dense label="Email 1 (untuk Registrasi & PO)" autocomplete="off" maxlength="50" outlined type="tel" :model-value="value" v-bind="field"
                                :error-message="errorMessage" :error="!!errorMessage" />
                        </Field>
                        <Field v-model="tmpData.emailpers2" name="emailpers2" v-slot="{ errorMessage, value, field }">
                            <q-input dense label="Email ke-2 (untuk Tanda Terima Faktur)" autocomplete="off" maxlength="50" outlined type="tel" :model-value="value" v-bind="field"
                                :error-message="errorMessage" :error="!!errorMessage" />
                        </Field>
                        <Field v-model="tmpData.emailpers3" name="emailpers3" v-slot="{ errorMessage, value, field }">
                            <q-input dense label="Email ke-3" autocomplete="off" maxlength="50" outlined type="tel" :model-value="value" v-bind="field"
                                :error-message="errorMessage" :error="!!errorMessage" />
                        </Field>
                        <Field v-model="tmpData.webpers" name="webpers" v-slot="{ errorMessage, value, field }">
                            <q-input dense label="Website Perusahaan" autocomplete="off" maxlength="50" outlined type="tel" :model-value="value" v-bind="field"
                                :error-message="errorMessage" :error="!!errorMessage" />
                        </Field>

                        <p class="q-mb-sm">Kantor Pusat</p>
                        <Field v-model="tmpData.alamatkantor" name="alamatkantor" v-slot="{ errorMessage, value, field }">
                            <q-input dense label="Alamat (* Sesuai dengan NPWP)" autocomplete="off" maxlength="120" outlined type="textarea" :model-value="value" v-bind="field"
                                :error-message="errorMessage" :error="!!errorMessage" />
                        </Field>
                        <Field v-model="tmpData.noteleponkantor" name="noteleponkantor" v-slot="{ errorMessage, value, field }">
                            <q-input dense label="No. Telepon" autocomplete="off" maxlength="50" outlined type="tel" :model-value="value" v-bind="field"
                                :error-message="errorMessage" :error="!!errorMessage" />
                        </Field>
                        <Field v-model="tmpData.nofaxkantor" name="nofaxkantor" v-slot="{ errorMessage, value, field }">
                            <q-input dense label="No. Fax" autocomplete="off" maxlength="50" outlined type="tel" :model-value="value" v-bind="field"
                                :error-message="errorMessage" :error="!!errorMessage" />
                        </Field>

                        <p class="q-mb-sm">Workshop / Pabrik</p>
                        <Field v-model="tmpData.alamatpabrik" name="alamatpabrik" v-slot="{ errorMessage, value, field }">
                            <q-input dense label="Alamat" autocomplete="off" maxlength="120" outlined type="textarea" :model-value="value" v-bind="field"
                                :error-message="errorMessage" :error="!!errorMessage" />
                        </Field>
                        <Field v-model="tmpData.noteleponpabrik" name="noteleponpabrik" v-slot="{ errorMessage, value, field }">
                            <q-input dense label="No. Telepon" autocomplete="off" maxlength="50" outlined type="tel" :model-value="value" v-bind="field"
                                :error-message="errorMessage" :error="!!errorMessage" />
                        </Field>
                        <Field v-model="tmpData.nofaxpabrik" name="nofaxpabrik" v-slot="{ errorMessage, value, field }">
                            <q-input dense label="No. Fax" autocomplete="off" maxlength="50" outlined type="tel" :model-value="value" v-bind="field"
                                :error-message="errorMessage" :error="!!errorMessage" />
                        </Field>
                    </div>
                </div>
                <div class="q-pa-xs q-gutter-sm q-px-xs text-center">
                    <q-btn size="11px" class="q-py-sm" color="blue" label="Simpan" type="submit" icon="save" />
                </div>
                </Form>
            </q-card-section>
        </q-card>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from "vue";
import { Field, Form } from "vee-validate";
import * as yup from "yup";
import axios from "axios"
import { ParseError, domain, empid } from "./../../utils";
import { useRouter, useRoute } from "vue-router";
import { useQuasar } from "quasar";

const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const benLainnya_view = ref(false);
const benLainnya = ref(false);
const listKat = ref([]);
const listKatSub = ref([]);

const tmpData = reactive({
    npwp: empid(),
    code: "",
    namavend_view: "",
    katVend_view: "",
    katsubVend_view: "",
    bentukPers_view: "",
    bentukPersLain_view: "",
    jenisPers_view: "",
    emailpers_view: "",
    emailpers2_view: "",
    emailpers3_view: "",
    alamatkantor_view: "",
    noteleponkantor_view: "",
    nofaxkantor_view: "",
    webpers_view: "",
    alamatpabrik_view: "",
    noteleponpabrik_view: "",
    nofaxpabrik_view: "",

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
});

const schema = yup.object({
    namaVend: yup.string().required().label("Nama Perusahaan"),
    katVend: yup.string().required().nullable().label("Kategori Vendor"),
    katsubVend: yup.string().required().nullable().label("Sub Kategori Vendor"),
    alamatkantor: yup.string().required().label("Alamat"),
    noteleponkantor: yup.string().required().label("No. Telepon"),
    emailpers: yup.string().required().email().label("Email Perusahaan"),
    // emailpers2: yup.string().nullable().required().email().label("Email ke-2"),
    // emailpers3: yup.string().nullable().required().email().label("Email ke-3"),
});

const getData = async () => {
    const res = await axios.get("getVendProfile", {
        params: {
            npwp: tmpData.npwp,
        },
    });

    tmpData.code = res.data.data1.sup_code_app;

    tmpData.katVend_view = res.data.data1.sup_cat;
    tmpData.katsubVend_view = res.data.data1.sup_type;

    tmpData.bentukPers_view = res.data.data1.sup_form_company;
    if (res.data.data1.sup_form_company == "Lainnya") {
        benLainnya_view.value = true;
        tmpData.bentukPersLain_view = res.data.data1.sup_comp_other;
    } else {
        benLainnya_view.value = false;    
    }
    tmpData.jenisPers_view = res.data.data1.sup_type_company;

    // tmpData.npwp = res.data.data.sup_npwp;
    tmpData.namavend_view = res.data.data1.sup_name;
    tmpData.emailpers_view = res.data.data1.sup_email;
    tmpData.emailpers2_view = res.data.data1.sup_email2;
    tmpData.emailpers3_view = res.data.data1.sup_email3;
    tmpData.alamatkantor_view = res.data.data1.sup_office_address;
    tmpData.noteleponkantor_view = res.data.data1.sup_office_phone;
    tmpData.nofaxkantor_view = res.data.data1.sup_office_fax;
    tmpData.webpers_view = res.data.data1.sup_website;
    tmpData.alamatpabrik_view = res.data.data1.sup_warehouse_address;
    tmpData.noteleponpabrik_view = res.data.data1.sup_warehouse_phone;
    tmpData.nofaxpabrik_view = res.data.data1.sup_warehouse_fax;

    tmpData.katVend = res.data.data2.sup_cat;
    tmpData.katsubVend = res.data.data2.sup_type;

    tmpData.bentukPers = res.data.data2.sup_form_company;
    if (res.data.data2.sup_form_company == "Lainnya") {
        benLainnya.value = true;
        tmpData.bentukPersLain = res.data.data2.sup_comp_other;
    } else {
        benLainnya.value = false;    
    }
    tmpData.jenisPers = res.data.data2.sup_type_company;

    // tmpData.npwp = res.data.data.sup_npwp;
    tmpData.namavend = res.data.data2.sup_name;
    tmpData.emailpers = res.data.data2.sup_email;
    tmpData.emailpers2 = res.data.data2.sup_email2;
    tmpData.emailpers3 = res.data.data2.sup_email3;
    tmpData.alamatkantor = res.data.data2.sup_office_address;
    tmpData.noteleponkantor = res.data.data2.sup_office_phone;
    tmpData.nofaxkantor = res.data.data2.sup_office_fax;
    tmpData.webpers = res.data.data2.sup_website;
    tmpData.alamatpabrik = res.data.data2.sup_warehouse_address;
    tmpData.noteleponpabrik = res.data.data2.sup_warehouse_phone;
    tmpData.nofaxpabrik = res.data.data2.sup_warehouse_fax;
    
    if (tmpData.katVend_view) {
        const res1 = await axios.get("getKategoriSub", {
            params: {
                name: tmpData.katVend_view,
            },
        });  
        listKatSub.value = res1.data;    
    }
}

const benPer = async (value, evt) => {
    if (value == "Lainnya") {
        benLainnya.value = true;   
    } else {
        benLainnya.value = false;    
    }
}

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

const valueKat = async (value) => {
    try {
        if (value) {
            const res = await axios.get("getKategoriSub", {
                params: {
                    name: value,
                },
            });  
            tmpData.katsubVend = '';
            listKatSub.value = res.data;
        }    
    } catch (error) {
        $q.notify({
            type: "negative",
         message: ParseError(error),
        });
    }
}

const onSubmit = async (value) => {
    try {
        $q.loading.show();
        // if (tmpData.bentukPers == "Lainnya" && (tmpData.bentukPersLain == null || tmpData.bentukPersLain == "")) {
        //     $q.notify({
        //         type: "negative",
        //         message: "Isian Bentuk Perusahaan lainnya masih kosong",
        //     });
        // } else {
            const res = await axios.post("saveUpdateProfile", tmpData);
            if(res.data == 'progress'){
                $q.notify({
                    type: "negative",
                    message: "Update kelengkapan dokumen sebelumnya sedang dalam proses approval",
                });
            }
            else if(res.data == 'sukses'){
                $q.notify({
                    type: "positive",
                    message: "Berhasil Update Profile",
                });
            }
            else if(res.data == 'gagal'){
                $q.notify({
                    type: "negative",
                    message: "Gagal Update Profile",
                });
            }
            else{
                $q.notify({
                    type: "negative",
                    message: "Invalid Data",
                });
            }
        // }       

        getData();
        $q.loading.hide();
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }
};

onMounted(() => {
    getData();
    getKategori();
});

</script>