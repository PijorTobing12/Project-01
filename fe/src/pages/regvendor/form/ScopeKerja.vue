<template>
    <q-page class="q-pa-lg">
        <q-card class="my-card">
            <div class="q-gutter-y-md">
            <q-card-section class="q-mx-xs">
                <div class="q-mt-sm q-mb-sm q-mb-md">
                    <span class="text-indigo-10 tw-text-xl text-bold">FORM SCOPE KERJA</span>
                </div>

                <!-- <div class="q-gutter-sm tw-mb-4"> -->
                <Form :validation-schema="schema" @submit="saveScope">
                <div class="row q-gutter-sm tw-mb-4">
                    <div class="col-12 col-md-12">
                        <p>Scope Pekerjaan :</p>
                    </div>
                    <div class="col-12 col-md-12">
                        <Field v-model="tmpData.scope" name="scope" v-slot="{ errorMessage, value, field }">
                            <q-input dense maxlength="255" outlined type="textarea" autocomplete="off" color="blue" :model-value="value" v-bind="field"
                            :error-message="errorMessage" :error="!!errorMessage" />
                        </Field>
                    </div>
                    <div class="col-12 col-md-12">
                        <q-btn size="10px" label="Hapus" class="q-mt-xs q-py-sm q-mr-sm" icon="delete" color="negative" @click="delScope" />
                        <q-btn size="10px" label="Simpan" class="q-mt-xs q-py-sm" icon="save" color="purple" type="submit" />
                    </div>
                </div>
                </Form>
            </q-card-section>   
            </div>  
        </q-card>
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

const $q = useQuasar();
// const router = useRouter();
const route = useRoute();

const tmpData = reactive({
    code: route.params.code,
    scope: "",
});

const schema = yup.object({
    scope: yup.string().required().nullable(true).label("Scope Pekerjaan"),
});

const getScopeKerja = async () => {
    try {
        $q.loading.show();
        const res = await axios.get("getScopeKerja", {
            params: {
                code: route.params.code,
            },
        });
        
        tmpData.scope = res.data;
        $q.loading.hide();
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }
};

const saveScope = async () => {
    try {
        $q.loading.show();
        const res = await axios.post("saveScopeKerja", tmpData, {
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

        setProgress();
        $q.loading.hide();
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }
};

const delScope = async () => {
    try {
        $q.loading.show();
        const res = await axios.post("delScopeKerja", tmpData, {
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

        getScopeKerja();
        setProgress();
        $q.loading.hide();
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }
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
    getScopeKerja();       
});

window.localStorage.clear();
</script>