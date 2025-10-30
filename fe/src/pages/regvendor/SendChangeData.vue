<template>
    <div class="q-pa-md">
    </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from "vue";
import * as yup from "yup";
import axios from "axios"
import { ParseError, domain, empid } from "./../../utils";
import { useRouter, useRoute } from "vue-router";
import { useQuasar } from "quasar";

const $q = useQuasar();
const router = useRouter();
const route = useRoute();


const sendChangeData = async () => {
  $q.dialog({
    title: "Yakin ingin dilanjutkan..?",
    message: `Data sudah tersimpan, sudah tidak bisa dikembalikan!`,
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
        const res = await axios.post("sendChangeDataEreg", null, {
            params: {
                npwp: empid(),
            },
        });
        console.log(res.data);
        router.push(`/`);
        $q.notify({
        type: "positive",
        message: `Perubahan Data Berhasil Dikirim`,
        html: true,
        });
    } catch (error) {
      $q.notify({
        type: "negative",
        message: ParseError(error),
      });
    }
  }).onCancel(async () => {
      router.push(`/`);
  });
};

onMounted(() => {
    sendChangeData();    
});

</script>