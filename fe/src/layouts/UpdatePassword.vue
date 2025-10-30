<template>
    <q-layout view="lHh Lpr lFf">
      <q-page-container>
        <q-page class="fit row wrap justify-center items-center content-center">
          <div class="q-pa-xl col-12 col-md-6 text-center login-page">
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
              <!-- <q-input outlined dense type="tel" label="Nik" /> -->
                <Field v-model="tmpData.npwp" name="nik" v-slot="{ errorMessage, value, field }" hidden>
                  <!-- <q-input dense label="NPWP" outlined type="tel" :model-value="value" v-bind="field" hidden/> -->
                </Field>

                <!-- <q-input v-model="valuetest" v-on:input="checkInput2()"/>
                 -->
                 <!-- <q-input v-model="valuetest" @keydown="checkInput2(val)"/> -->
                 <!-- <q-input v-model="valuetest" /> -->
                
                <!-- <q-btn unelevated rounded color="warning" class="full-width btn-login" label="Test" type="submit" @click=""/> -->

              <Field v-model="tmpData.pass1" name="pass1" v-slot="{ errorMessage, value, field }">
                <q-input dense label="Password Baru" outlined :model-value="value" v-bind="field"
                @update:model-value="checkInput()" 
                :type="isPwd ? 'password' : 'text'"
                :error-message="errorMessage" :error="!!errorMessage" />
              </Field>

              <!-- :rules="[ val => val.value != tmpData.pass1 || tmpData.pass1 ]" -->
              <Field v-model="tmpData.pass2" name="pass2" v-slot="{ errorMessage, value, field }">
                <q-input dense 
                  label="Konfimasi Password" 
                  outlined type="password" :model-value="value" v-bind="field"
                  :rules="[ (val) => (val && val === tmpData.pass1) || 'Konfirmasi Password tidak sesuai']"
                  @update:model-value="checkInput2()" 
                  :error-message="errorMessage"/>
              </Field>
                <table>
                    <thead>
                        <tr align="left">
                          <q-icon :name="min_pass ? 'check_circle' : 'cancel'" :color="min_pass ? 'positive' : 'negative'"></q-icon>
                          Password minimal {{minchar}} karakter
                          <!-- <p class="security-control" :class="min_pass ? 'valid' : 'invalid'">Password minimal {{minchar}} karakter </p> -->
                        </tr>
                        <tr align="left">
                          <q-icon :name="upper_pass ? 'check_circle' : 'cancel'" :color="upper_pass ? 'positive' : 'negative'"></q-icon>
                          Huruf Besar minimal {{minupchar}} karakter
                          <!-- <p class="security-control" :class="upper_pass ? 'valid' : 'invalid'">Huruf Besar minimal {{minupchar}} karakter </p> -->
                        </tr>
                        <tr align="left">
                          <q-icon :name="lower_pass ? 'check_circle' : 'cancel'" :color="lower_pass ? 'positive' : 'negative'"></q-icon>
                          Huruf Kecil minimal {{minlowchar}} karakter
                          <!-- <p class="security-control" :class="lower_pass ? 'valid' : 'invalid'">Huruf Kecil minimal {{minlowchar}} karakter </p> -->
                        </tr>
                        <tr align="left">
                          <q-icon :name="numeric_pass ? 'check_circle' : 'cancel'" :color="numeric_pass ? 'positive' : 'negative'" ></q-icon>
                            Numeric minimal {{minnumchar}} karakter
                          <!-- <p class="security-control" :class="numeric_pass ? 'valid' : 'invalid'">Numeric minimal {{minnumchar}} karakter </p> -->
                        </tr>
                        <tr align="left">
                          <q-icon :name="simbol_pass ? 'check_circle' : 'cancel'" :color="simbol_pass ? 'positive' : 'negative'" ></q-icon>
                          Simbol minimal {{minsymbchar}} karakter
                          <!-- <p class="security-control" :class="simbol_pass ? 'valid' : 'invalid'">Simbol minimal {{minsymbchar}} karakter </p> -->
                        </tr>
                        <tr align="left"> </tr>
                        <tr align="left">
                          <p>
                          Expired Password {{ minexpired }}  hari
                          </p>
                        </tr>
                        <tr align="left">
                          Re-use password {{ minreused }}  (Password dapat digunakan kembali jika sudah menggunakan password lain sebanyak
                                          {{ minreused}} kali )
                        </tr>                        
                    </thead>
                </table>
              <q-btn unelevated rounded                       
                      :color="butconfirm ? 'positive' : 'grey'" 
                      :disable="butconfirm? 'true':'disable'"
                      class="full-width btn-login" label="Konfirmasi"  type="submit" @click="updatePassword"/>
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
  import { ref, onMounted, reactive } from "vue";
  import { Field, Form } from "vee-validate";
  import * as yup from "yup";
  import axios from "axios"
  import { useRouter, useRoute } from "vue-router";
  import { useQuasar } from "quasar";
  import { ParseError } from "./../utils";
  
  const $q = useQuasar();
  const router = useRouter();
  const route = useRoute();
  const isPwd = ref(true);
  const tmpData = reactive({
    npwp: "",
    pass1: "",
    pass2: "",
  });

    const min_pass      = ref(false);
    const numeric_pass  = ref(false);
    const lower_pass    = ref(false);
    const upper_pass    = ref(false);
    const simbol_pass   = ref(false);
    const butconfirm    = ref(false);

    const minchar     = ref("");
    const minupchar   = ref("");
    const minlowchar  = ref("");
    const minnumchar  = ref("");
    const minsymbchar = ref("");
    const minexpired  = ref("");
    const minreused   = ref("");

    const checkInput = (val) => {

      if (tmpData.pass1.length >= minchar.value) {
        min_pass.value = true
      }else {
        min_pass.value = false
      }

      if (tmpData.pass1.replace(/[^0-9]/g, '').length >= minnumchar.value) {
        numeric_pass.value = true
      }
      else {
        numeric_pass.value = false
      }

      if (tmpData.pass1.replace(/[^A-Z]/g, '').length >= minupchar.value) {
        upper_pass.value = true
      }
      else {
        upper_pass.value = false
      }

      if (tmpData.pass1.replace(/[^a-z]/g, '').length >= minlowchar.value) {
        lower_pass.value = true
      }
      else {
        lower_pass.value = false
      }

      if (tmpData.pass1.replace(/[^@,!,&,#,*]/g, '').length >= minsymbchar.value) {
        simbol_pass.value = true
      }
      else {
        simbol_pass.value = false
      }
      // console.log(min_pass.value);
      // console.log(tmpData.pass1);
    };


    const checkInput2 = (val) => {
      // console.log(tmpData.pass1);
      // console.log(tmpData.pass2);
      // console.log(numeric_pass.value);
      if (tmpData.pass1 == tmpData.pass2 &&
          numeric_pass.value == true &&
          min_pass.value == true &&
          upper_pass.value == true &&
          lower_pass.value == true &&
          simbol_pass.value == true
          ) 
      {
        butconfirm.value = true;
      }else {
        butconfirm.value = false;
      }
    };

    onMounted(() => {
        tmpData.npwp = route.params.npwp
        getSecurityControl();
    });

    const getSecurityControl = async () => {
        try {
            // $q.loading.show();

            // const res = await axios.get('get_security_control', tmpData)
            const res = await axios.post("get_security_control", tmpData);
            // console.log(res.data[0]);
            minupchar.value   = res.data[0].min_uppercase
            minchar.value     = res.data[0].min_length_pass;
            minlowchar.value  = res.data[0].min_lowercase;
            minnumchar.value  = res.data[0].min_numeric;
            minsymbchar.value = res.data[0].min_symbol;
            minexpired.value  = res.data[0].expired_pass;
            minreused.value   = res.data[0].min_reuse_change_pass;
        } catch (error) {
            $q.loading.hide();
            $q.notify({
            type: "negative",
            message: ParseError(error),
            });
            router.push("/login");

        }
    };

  const schema = yup.object({
    nik: yup
      .number()
      .required()
      .positive()
      .integer()
      .label("NPWP")
      .typeError("NPWP must be a number type"),
    password: yup.string().required().label("Password"),
  });
  const initialValues = {
    terms: false,
    subscribed: false,
  };
  const updatePassword = async (values, actions) => {
    try {
      $q.loading.show();
      const res = await axios.post("updatePassword", tmpData);
      $q.notify({
          type: "positive",
          message: "Proses Update Password Berhasil, Silahkan login ulang",
      });
      $q.loading.hide();
      await router.push("/login");
    } catch (error) {
      $q.loading.hide();
      $q.notify({
        type: "negative",
        message: ParseError(error),
      });
    }
  };
  
//   013040100073001
  const forgotPassword = async () => {
    try {
        $q.loading.show();
        const res = await axios.post("forgotPassword", tmpData);
        $q.notify({
            type: "positive",
            message: "Permintaan update password berhasil kami kirimkan ke email Anda. Silahkan cek email untuk melakukan perubahan password",
        });
        $q.loading.hide();
    } catch (error) {
        $q.loading.hide();
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
        // console.log('shendy');
        // console.log(error);
    }
  };

  
  
  window.localStorage.clear();
  </script>
  
  <style lang="scss">
  .q-field__messages.col {
    margin-top: -3px;
  }
  </style>

<style scoped>
p.security-control {
  line-height: 10px;
  margin-top: 15px;
}

p.valid {
  color: green;
}
</style>
  
  