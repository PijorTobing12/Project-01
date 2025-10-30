<template>
  <router-view />
</template>
<script setup>
import axios from "axios";
import { useQuasar } from "quasar";
import { ref } from "vue";
import { ParseError } from "./utils";
const $q = useQuasar();

axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  $q.loading.hide();
  if (error.response.status == 422) {
    for (const key in error.response.data.errors) {
      let values = Object.values(error.response.data.errors[key])[0]
      $q.notify({
        type: 'negative',
        message: `${values}`
      })
    }
  }
  else {
    $q.notify({
      type: 'negative',
      message: ParseError(error),
      timeout: 10000
    })
  }
  return Promise.reject(error);
});
</script>
