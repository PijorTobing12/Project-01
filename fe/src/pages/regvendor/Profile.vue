<template>
    <div class="q-pa-md">
        <q-card>
            <q-card-section>
                <div class="tw-text-lg tw-font-semibold">
                    PROFILE
                </div>
            </q-card-section>

            <q-separator />

            <q-card-section>
                <div class="row q-col-gutter-md q-px-xs q-mb-md">
                    <div class="col-12 col-md-6">
                        <q-input dense label="NPWP Perusahaan" outlined readonly type="tel" :model-value="tmpData.npwp" />
                    </div>
                    <div class="col-12 col-md-6">
                        <q-input dense label="Nama Perusahaan" outlined readonly type="tel" :model-value="tmpData.namavend" />
                    </div>
                    <div class="col-12 col-md-6">
                        <q-select
                            dense
                            outlined  
                            readonly
                            label="Kategori Vendor"
                            v-model="tmpData.katVend"
                            :model-value="tmpData.katVend"
                            input-debounce="0"
                            option-value="kat_vend_name"
                            option-label="kat_vend_name"
                            :options="listKat"
                        />
                    </div>
                    <div class="col-12 col-md-6">
                        <q-select
                            dense
                            outlined  
                            readonly
                            label="Sub Kategori Vendor"
                            v-model="tmpData.katsubVend"
                            :model-value="tmpData.katsubVend"
                            input-debounce="0"
                            option-value="katsub_vend_name"
                            option-label="katsub_vend_name"
                            :options="listKatSub"
                        />
                    </div>
                    <div class="col-12 col-md-6">
                        <q-input dense label="Email 1 (untuk Registrasi & PO)" outlined readonly type="tel" :model-value="tmpData.emailpers" />
                    </div>
                    <div class="col-12 col-md-6">
                        <q-input dense label="Website Perusahaan" outlined readonly type="tel" :model-value="tmpData.webpers" />
                    </div>
                    <div class="col-12 col-md-6">
                        <q-input dense label="Email ke-2 (untuk Tanda Terima Faktur)" outlined readonly type="tel" :model-value="tmpData.emailpers2" />
                    </div>
                    <div class="col-12 col-md-6">
                        <q-input dense label="Email ke-3" outlined readonly type="tel" :model-value="tmpData.emailpers3" />
                    </div>
                    <div class="col-12 col-md-6">
                        <div class="q-mb-sm">
                            <span class="">Bentuk Perusahaan :</span>
                            <div class="q-ml-xs q-mt-sm">
                                <q-radio class="q-mr-sm" size="xs" disable val="Tbk" label="Tbk" :model-value="tmpData.bentukPers" color="blue" />
                                <q-radio class="q-mr-sm" size="xs" disable val="PT" label="PT" :model-value="tmpData.bentukPers" color="blue" />
                                <q-radio class="q-mr-sm" size="xs" disable val="CV" label="CV" :model-value="tmpData.bentukPers" color="blue" />
                                <q-radio class="q-mr-sm" size="xs" disable val="UD" label="UD" :model-value="tmpData.bentukPers" color="blue" />
                                <q-radio class="q-mr-sm" size="xs" disable val="Pribadi" label="Pribadi" :model-value="tmpData.bentukPers" color="blue" />
                                <q-radio class="q-mr-sm" size="xs" disable val="Lainnya" label="Lainnya" :model-value="tmpData.bentukPers" color="blue" />
                                <q-input v-if="benLainnya" style="width:13%; display: inline-block;" dense outlined readonly v-model="tmpData.bentukPersLain" />
                            </div>                      
                        </div>
                    </div>
                    <div class="col-12 col-md-6">
                        <div class="q-mb-sm">
                            <span class="">Jenis Perusahaan :</span>
                            <div class="q-ml-xs q-mt-sm">
                                <q-radio class="q-mr-sm" size="xs" disable val="Manufacture" label="Manufacture" :model-value="tmpData.jenisPers" color="blue" />
                                <q-radio class="q-mr-sm" size="xs" disable val="Trading" label="Trading" :model-value="tmpData.jenisPers" color="blue" />
                                <q-radio class="q-mr-sm" size="xs" disable val="Keagenan Resmi" label="Keagenan Resmi" :model-value="tmpData.jenisPers" color="blue" />
                                <q-radio class="q-mr-sm" size="xs" disable val="Lainnya" label="Lainnya" :model-value="tmpData.jenisPers" color="blue" />         
                            </div>                    
                        </div>
                    </div>
                </div>
                <div class="row q-col-gutter-md q-px-xs">
                    <div class="col-12 col-md-6">
                        <p class="q-mb-sm">Kantor Pusat :</p>
                        <q-input class="q-mb-md" dense label="Alamat" outlined readonly type="textarea" :model-value="tmpData.alamatkantor" />
                        <q-input class="q-mb-md" dense label="No. Telepon" outlined readonly type="tel" :model-value="tmpData.noteleponkantor" />
                        <q-input class="q-mb-md" dense label="No. Fax" outlined readonly type="tel" :model-value="tmpData.nofaxkantor" />
                    </div>
                    <div class="col-12 col-md-6">
                        <p class="q-mb-sm">Workshop / Pabrik :</p>
                        <q-input class="q-mb-md" dense label="Alamat" outlined readonly type="textarea" :model-value="tmpData.alamatpabrik" />
                        <q-input class="q-mb-md" dense label="No. Telepon" outlined readonly type="tel" :model-value="tmpData.noteleponpabrik" />
                        <q-input class="q-mb-md" dense label="No. Fax" outlined readonly type="tel" :model-value="tmpData.nofaxpabrik" />
                    </div>
                </div>
            </q-card-section>
        </q-card>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from "vue";
import axios from "axios"
import { ParseError, domain, empid } from "./../../utils";
import { useRouter, useRoute } from "vue-router";
import { useQuasar } from "quasar";

const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const benLainnya = ref(false);
const listKat = ref([]);
const listKatSub = ref([]);

const tmpData = reactive({
    npwp: empid(),
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

const getData = async () => {
    const res = await axios.get("getVendProfile", {
        params: {
            npwp: tmpData.npwp,
        },
    });

    tmpData.katVend = res.data.data1.sup_cat;
    tmpData.katsubVend = res.data.data1.sup_type;

    tmpData.bentukPers = res.data.data1.sup_form_company;
    if (res.data.data1.sup_form_company == "Lainnya") {
        benLainnya.value = true;
        tmpData.bentukPersLain = res.data.data1.sup_comp_other;
    } else {
        benLainnya.value = false;    
    }
    tmpData.jenisPers = res.data.data1.sup_type_company;

    // tmpData.npwp = res.data.data1.sup_npwp;
    tmpData.namavend = res.data.data1.sup_name;
    tmpData.emailpers = res.data.data1.sup_email;
    tmpData.emailpers2 = res.data.data1.sup_email2;
    tmpData.emailpers3 = res.data.data1.sup_email3;
    tmpData.alamatkantor = res.data.data1.sup_office_address;
    tmpData.noteleponkantor = res.data.data1.sup_office_phone;
    tmpData.nofaxkantor = res.data.data1.sup_office_fax;
    tmpData.webpers = res.data.data1.sup_website;
    tmpData.alamatpabrik = res.data.data1.sup_warehouse_address;
    tmpData.noteleponpabrik = res.data.data1.sup_warehouse_phone;
    tmpData.nofaxpabrik = res.data.data1.sup_warehouse_fax;
}

onMounted(() => {
    getData();
});
</script>