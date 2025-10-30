<template>
    <q-layout view="lHh Lpr lff" ref="el">
        <q-header elevated class="bg-blue-grey-10">
            <q-toolbar>
                <q-btn flat @click="left = !left" round dense icon="menu" />
                <q-toolbar-title class="tw-text-lg">FORM REGISTRASI VENDOR</q-toolbar-title>
            </q-toolbar>
        </q-header>
        <q-drawer 
            v-model="left" 
            show-if-above 
            side="left" 
            elevated   
            :width="295"
        >
        <div class="absolute-top text-center" style="">
            <q-img class="rounded-borders q-mt-xs" src="logo.png" width="100px" />
            </div>
            <!-- <div class="absolute-top" style="background:beige;height: 150px">
                <div style="padding:5px 10px;text-align: center;">
                <q-circular-progress
                    show-value
                    font-size="13px"
                    :value="progress"
                    size="55px"
                    :thickness="0.22"
                    color="secondary"
                    track-color="grey-5"
                    class="q-ma-xs"
                >
                {{ progress }}%
                </q-circular-progress>
                <p v-if="labelfull" class="q-mt-xs tw-text-xs">Data Registrasi Anda Sudah Lengkap. <br>Klik tombol agar form terkirim ke Purchasing.</p>
                <p v-if="labelnotfull" class="q-mt-xs tw-text-xs">Data Registrasi Anda Belum Lengkap. Lengkapi dahulu data registrasi.</p>
                <q-btn v-if="btnfull" unelevated rounded size="11px" color="red" class="q-mt-sm" label="Kirim Registrasi" @click="kirimRegistrasi(tmpHeader.code)" />
                <q-btn v-if="btnnotfull" unelevated rounded size="11px" color="red" disabled class="q-mt-sm" label="Kirim Registrasi" />
                </div>
            </div> -->

            <!-- <q-scroll-area style="height: calc(100% - 50px); margin-top: 50px; border-right: 1px solid #ddd"> -->
            <q-scroll-area class="bg-blue-grey-10" style="height: calc(100% - 60px); margin-top: 60px; border-right: 1px solid #2f4050">
                <q-list padding>
                    <q-item :to="link1">
                        <!-- <q-item-section avatar>
                            <q-icon name="double_arrow" />
                        </q-item-section> -->
                        <q-item-section><p>Syarat & Ketentuan</p></q-item-section>
                    </q-item>
                    <q-item :to="link2" clickable v-ripple>
                        <!-- <q-item-section avatar>
                            <q-icon name="double_arrow" />
                        </q-item-section> -->
                        <q-item-section><p>Profile <span class="text-red tw-text-sm">*</span></p></q-item-section>
                    </q-item>
                    <q-item :to="link3" clickable v-ripple>
                        <!-- <q-item-section avatar>
                            <q-icon name="double_arrow" />
                        </q-item-section> -->
                        <q-item-section><p>Kontak Person <span class="text-red tw-text-sm">*</span></p></q-item-section>
                    </q-item>
                    <q-item :to="link4" clickable v-ripple>
                        <!-- <q-item-section avatar>
                            <q-icon name="double_arrow" />
                        </q-item-section> -->
                        <q-item-section><p>Daftar Dewan Direksi <span class="text-red tw-text-sm">*</span></p></q-item-section>
                    </q-item>
                    <q-item :to="link15" clickable v-ripple>
                        <!-- <q-item-section avatar>
                            <q-icon name="double_arrow" />
                        </q-item-section> -->
                        <q-item-section><p>Penandatangan Kontrak</p></q-item-section>
                    </q-item>
                    <q-item :to="link5" clickable v-ripple>
                        <!-- <q-item-section avatar>
                            <q-icon name="double_arrow" />
                        </q-item-section> -->
                        <q-item-section><p>Kelengkapan Administrasi Umum <span class="text-red tw-text-sm">*</span></p></q-item-section>
                    </q-item>
                    <q-item :to="link6" clickable v-ripple>
                        <!-- <q-item-section avatar>
                            <q-icon name="double_arrow" />
                        </q-item-section> -->
                        <q-item-section><p>Kelengkapan tambahan untuk vendor Transporter</p></q-item-section>
                    </q-item>
                    <q-item :to="link7" clickable v-ripple>
                        <!-- <q-item-section avatar>
                            <q-icon name="double_arrow" />
                        </q-item-section> -->
                        <q-item-section><p>Kelengkapan tambahan untuk Vendor Keagenan Resmi <span v-if="tmpHeader.type_company == 'Keagenan Resmi'" class="text-red tw-text-sm">*</span></p></q-item-section>
                    </q-item>
                    <q-item :to="link8" clickable v-ripple>
                        <!-- <q-item-section avatar>
                            <q-icon name="double_arrow" />
                        </q-item-section> -->
                        <q-item-section><p>Kelengkapan tambahan untuk Kontraktor Sipil/Elektrikal</p></q-item-section>
                    </q-item>
                    <q-item :to="link9" clickable v-ripple>
                        <!-- <q-item-section avatar>
                            <q-icon name="double_arrow" />
                        </q-item-section> -->
                        <q-item-section><p>Rekening Bank <span class="text-red tw-text-sm">*</span></p></q-item-section>
                    </q-item>
                    <q-item :to="link10" clickable v-ripple>
                        <!-- <q-item-section avatar>
                            <q-icon name="double_arrow" />
                        </q-item-section> -->
                        <q-item-section><p>Group / Anak Perusahaan</p></q-item-section>
                    </q-item>
                    <q-item :to="link11" clickable v-ripple>
                        <!-- <q-item-section avatar>
                            <q-icon name="double_arrow" />
                        </q-item-section> -->
                        <q-item-section><p>Nama Pejabat/Kuasa Penandatangan Faktur Pajak</p></q-item-section>
                    </q-item>
                    <q-item :to="link12" clickable v-ripple>
                        <!-- <q-item-section avatar>
                            <q-icon name="double_arrow" />
                        </q-item-section> -->
                        <q-item-section><p>Quality dan Environment <span class="text-red tw-text-sm">*</span></p></q-item-section>
                    </q-item>
                    <q-item :to="link13" clickable v-ripple>
                        <!-- <q-item-section avatar>
                            <q-icon name="double_arrow" />
                        </q-item-section> -->
                        <q-item-section><p>Pakta Integritas <span class="text-red tw-text-sm">*</span></p></q-item-section>
                    </q-item>
                    <q-item :to="link14" clickable v-ripple>
                        <!-- <q-item-section avatar>
                            <q-icon name="double_arrow" />
                        </q-item-section> -->
                        <q-item-section><p>Pengalaman Perusahaan</p></q-item-section>
                    </q-item>
                    <q-item :to="link16" clickable v-ripple>
                        <!-- <q-item-section avatar>
                            <q-icon name="double_arrow" />
                        </q-item-section> -->
                        <q-item-section><p>Company Profile</p></q-item-section>
                    </q-item>
                    <q-item :to="link17" clickable v-ripple>
                        <!-- <q-item-section avatar>
                            <q-icon name="double_arrow" />
                        </q-item-section> -->
                        <q-item-section><p>Scope Kerja</p></q-item-section>
                    </q-item>
                </q-list>
            </q-scroll-area>
        </q-drawer>
        <q-page-container>
            
            <q-card class="my-card q-mx-lg" style="margin-top:30px;margin-bottom:-10px;">
                <div class="q-gutter-y-md">
                    <q-card class="tw-p-4" style="background:#FFF5EE;">
                        <div class="q-ml-md q-mt-xs" >
                            <p class="tw-text-xl text-bold q-mb-xs">{{ progress }}%</p>
                            <q-linear-progress stripe class="q-mb-xs" size="14px" :value="progress2" color="secondary"></q-linear-progress>
                            <div v-if="labelfull"><span class="tw-text-xs">Kelengkapan Data Registrasi Anda Sudah Lengkap, Silahkan Klik tombol "KIRIM REGISTRASI" agar form terkirim ke Purchasing.</span></div>
                            <div v-if="labelnotfull"><span class="tw-text-xs">Data Registrasi Anda Belum Lengkap. Lengkapi dahulu Data Registrasi.</span></div>
                            <q-select
                                style="width:30%; display: inline-block;"
                                class="q-mt-xs q-py-sm q-mr-sm" 
                                dense
                                outlined
                                v-model="tmpHeader.bu_id"
                                emit-value
                                map-options
                                input-debounce="0"
                                option-value="bu_id"
                                option-label="bu_name"
                                label="Nama Bisnis Unit"
                                :options="listBu"
                            >
                                <template v-slot:no-option>
                                    <q-item>
                                        <q-item-section class="text-grey">
                                        No results
                                        </q-item-section>
                                    </q-item>
                                </template>
                            </q-select>
                            <q-btn v-if="btnfull" unelevated size="11px" color="red" class="q-mb-md" label="Kirim Registrasi" @click="kirimRegistrasi(tmpHeader.code)" />
                            <q-btn v-if="btnnotfull" unelevated size="11px" color="red" disabled class="q-mb-md" label="Kirim Registrasid" />
                        </div>
                    </q-card>
                </div>      
            </q-card>

            <router-view />
        </q-page-container>
        <q-footer elevated dense>
            <q-toolbar class="bg-black">
                <q-toolbar-title class="tw-text-xs text-center">Copyright &#169; 2023 IT DBC</q-toolbar-title>
            </q-toolbar>
        </q-footer>
    </q-layout>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import * as yup from "yup";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";
import { useQuasar } from "quasar";
import { ParseError } from "./../utils";

const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const progress = ref(0);
const progress2 = ref(0);
const listBu = ref([]);

const tmpHeader = reactive({
    npwp: "",
    code: "",
    type_company: "",
    bu_id: "",
});

const getData = async () => {
    const res = await axios.get("getDataProfile", {
        params: {
            enkrip: route.params.enkrip,
            code: route.params.code,
        },
    });    

    tmpHeader.npwp = res.data.data.sup_npwp;
    tmpHeader.code = res.data.data.sup_code_app;
    tmpHeader.type_company = res.data.data.sup_type_company;
}

const getBuCur = async () => {
    const res = await axios.get("getBuRegVend", {
        params: {
            code: route.params.code,
        },
    });    

    tmpHeader.bu_id = res.data;
}

const getBu = async () => {
    try {
        const res = await axios.get('getBu');
        listBu.value = res.data;
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }
};

const cekLink = async () => {
    try {
        const current_link = window.location.href.split('/');
        const res = await axios.get("cekLinkRegisVendor", {
            params: {
                link_encrypt: current_link[5],
                link_code: current_link[6]
            },
        });

        if(res.data == 0){
            // router.push("/"); 
            location.href = '/';
        }
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }
}

const setProgress = async () => {
    if(window.localStorage.getItem("progresReg")){
        // console.log(window.localStorage.getItem("progresReg"));
        if(window.localStorage.getItem("progresReg") == 0){
            progress.value = 0;
            progress2.value = 0;
        }
        else{
            // progress.value = window.localStorage.getItem("progresReg");
            const res = await axios.get("getProgressReg", {
                params: {
                    enkrip: route.params.enkrip,
                    code: route.params.code,
                },
            }); 
            progress.value = res.data.data;
            progress2.value = res.data.data / 100;
        }   
    }
    else{
        const res = await axios.get("getProgressReg", {
            params: {
                enkrip: route.params.enkrip,
                code: route.params.code,
            },
        }); 
        progress.value = res.data.data;
        progress2.value = res.data.data / 100;
    }

    if(progress.value == 100){
        labelfull.value = true;
        btnfull.value = true;
        labelnotfull.value = false;
        btnnotfull.value = false;
    }
    else{
        labelfull.value = false;
        btnfull.value = false;
        labelnotfull.value = true;
        btnnotfull.value = true;
    }
};

const kirimRegistrasi = () => {
    $q.dialog({
        title: "Konfirmasi",
        message: `Yakin ingin dilanjutkan ? <br>Proses selanjutnya, data akan diverifikasi oleh Purchasing.`,
        html: true,
        ok: {
            push: true,
        },
        cancel: {
            push: true,
            color: "negative",
        },
        persistent: true,
    }).onOk(async () => {
        try {
            $q.loading.show();
            const res = await axios.post("saveRegistrasiFinal", tmpHeader);

            $q.notify({
                type: "positive",
                message: res.data.message,
            });  

            router.push("/");   
            $q.loading.hide();
        } catch (error) {
            $q.notify({
                type: "negative",
                message: ParseError(error),
            });
        }
    });
};

const var_enkrip = route.params.enkrip;
const var_code = route.params.code;
const left = ref(false);
const labelfull = ref(false);
const btnfull = ref(false);
const labelnotfull = ref(true);
const btnnotfull = ref(true);

const link1 = `/register_form/${var_enkrip}/${var_code}/form1`;
const link2 = `/register_form/${var_enkrip}/${var_code}/form2`;
const link3 = `/register_form/${var_enkrip}/${var_code}/form3`;
const link4 = `/register_form/${var_enkrip}/${var_code}/form4`;
const link5 = `/register_form/${var_enkrip}/${var_code}/form5`;
const link6 = `/register_form/${var_enkrip}/${var_code}/form6`;
const link7 = `/register_form/${var_enkrip}/${var_code}/form7`;
const link8 = `/register_form/${var_enkrip}/${var_code}/form8`;
const link9 = `/register_form/${var_enkrip}/${var_code}/form9`;
const link10 = `/register_form/${var_enkrip}/${var_code}/form10`;
const link11 = `/register_form/${var_enkrip}/${var_code}/form11`;
const link12 = `/register_form/${var_enkrip}/${var_code}/form12`;
const link13 = `/register_form/${var_enkrip}/${var_code}/form13`;
const link14 = `/register_form/${var_enkrip}/${var_code}/form14`;
const link15 = `/register_form/${var_enkrip}/${var_code}/form15`;
const link16 = `/register_form/${var_enkrip}/${var_code}/form16`;
const link17 = `/register_form/${var_enkrip}/${var_code}/form17`;

onMounted(() => {
    cekLink();
    getData();
    setProgress();
    getBu();
    getBuCur();
});

// setInterval(() => {
//   setProgress();
// }, 1000);

document.addEventListener("updateProgress", () => {
    setProgress();
});
</script>

<style lang="scss">
.q-list--padding {
    padding: 5px 0;
}
.q-item {
    font-size: 13px;
    // color: #A7B1C2;
    min-height: 30px;
    padding:7.8px 23px;
}

.q-list .q-item  {
    color: #A7B1C2;
}

// q-item__section column q-item__section--main justify-center
// .q-item.q-item-type row no-wrap q-item--clickable q-link cursor-pointer q-focusable q-hoverable {}
.q-item-type.q-item--clickable {
    // color: #A7B1C2;
}

.q-item__section--avatar {
    min-width: 40px;
}
.q-item__section--side > .q-icon {
    font-size: 18px;
}
.my-menu-link {
    color: white;
    background: #F2C037;
}
.q-item.q-router-link--active, .q-item--active {
    // background: #F0FFFF;
    background: rgba(255, 255, 255, 0.1);
    color: #A7B1C2;
}

.q-header {
    height: 60px;
    background: #6b6f82;
    padding-top:5px;
}
</style>