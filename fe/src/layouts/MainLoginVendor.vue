<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="fit row wrap justify-center items-center content-center">
        <div class="q-pa-xl col-12 col-md-3 text-center login-page">
          <q-img class="rounded-borders" src="logo.png" width="150px" />

          <div class="q-mt-md tw-text-2xl tw-font-extrabold">
            <span class="
                tw-bg-clip-text
                tw-text-transparent
                tw-bg-gradient-to-r
                tw-from-gray-700
                tw-to-yellow-700
              ">Vendor Portal</span>
          </div>

          <!-- <q-form class="q-gutter-y-lg q-mt-md"> -->
          <Form :initial-values="initialValues" :validation-schema="schema" @submit="onSubmit" class="q-mt-md">
            <!-- <q-input outlined dense type="tel" label="npwp" /> -->

            <Field v-model="tmpData.npwp" name="npwp" v-slot="{ errorMessage, value, field }">
              <q-input dense label="NPWP" outlined type="tel" :model-value="value" v-bind="field"
                :error-message="errorMessage" :error="!!errorMessage" />
            </Field>
            <Field v-model="tmpData.pass" name="password" v-slot="{ errorMessage, value, field }">
              <q-input outlined dense :type="isPwd ? 'password' : 'text'" :model-value="value" label="Password"
                v-bind="field" :error-message="errorMessage" :error="!!errorMessage">
                <template v-slot:append>
                  <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                    @click="isPwd = !isPwd" />
                </template>
              </q-input>
            </Field>

            <q-btn unelevated rounded color="warning" class="full-width btn-login" label="Login" type="submit" />
            <!-- </q-form> -->
          </Form>
        </div>
      </q-page>
    </q-page-container>

    <div class="waves">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path fill="#ffb73b" fill-opacity="1"
          d="M0,256L17.1,245.3C34.3,235,69,213,103,208C137.1,203,171,213,206,213.3C240,213,274,203,309,208C342.9,213,377,235,411,229.3C445.7,224,480,192,514,197.3C548.6,203,583,245,617,256C651.4,267,686,245,720,234.7C754.3,224,789,224,823,224C857.1,224,891,224,926,229.3C960,235,994,245,1029,224C1062.9,203,1097,149,1131,160C1165.7,171,1200,245,1234,245.3C1268.6,245,1303,171,1337,165.3C1371.4,160,1406,224,1423,256L1440,288L1440,320L1422.9,320C1405.7,320,1371,320,1337,320C1302.9,320,1269,320,1234,320C1200,320,1166,320,1131,320C1097.1,320,1063,320,1029,320C994.3,320,960,320,926,320C891.4,320,857,320,823,320C788.6,320,754,320,720,320C685.7,320,651,320,617,320C582.9,320,549,320,514,320C480,320,446,320,411,320C377.1,320,343,320,309,320C274.3,320,240,320,206,320C171.4,320,137,320,103,320C68.6,320,34,320,17,320L0,320Z">
        </path>
      </svg>
    </div>
  </q-layout>
</template>

<script setup>
import { ref, reactive } from "vue";
import { Field, Form } from "vee-validate";
import * as yup from "yup";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";
import { useQuasar } from "quasar";

import { ParseError } from "./../utils";

const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const isPwd = ref(true);
const tmpData = reactive({
  npwp: "",
  pass: "",
});
const schema = yup.object({
  npwp: yup
    .number()
    .required()
    .positive()
    .integer()
    .label("npwp")
    .typeError("NPWP must be a number type"),
  password: yup.string().required().label("Password"),
});
const initialValues = {
  terms: false,
  subscribed: false,
};
const onSubmit = async (values, actions) => {
  try {
    $q.loading.show();
    const res = await axios.post("loginvendor", tmpData);
    actions.resetForm();
    window.localStorage.setItem("data", JSON.stringify(res.data));
    window.localStorage.setItem("token", res.data.token);
    window.localStorage.setItem("domain", res.data.data.domain);
    axios.defaults.headers.common["Authorization"] = res.data.token;
    router.push("/");
    $q.loading.hide();
  } catch (error) {
    $q.loading.hide();
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};


window.localStorage.clear();
</script>

<style lang="scss">
.q-field__messages.col {
  margin-top: -3px;
}
</style>

