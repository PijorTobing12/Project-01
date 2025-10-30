<template>
  <q-dialog v-model="props.dialog" persistent>
    <q-card style="width: 500px; max-width: 80vw;">
      <q-card-section>
        <div class="tw-text-center tw-font-bold tw-text-xl tw-mt-5">Upload File Penawaran</div>
        <div class="">
          <div class="row  q-col-gutter-sm">
            <div class="col-12">
              <q-file color="teal" v-model="tmpData.file" filled label="Upload File" accept=".pdf">
                <template v-slot:prepend>
                  <q-icon name="cloud_upload" />
                </template>
              </q-file>
              <p class="tw-font-light tw-text-xs tw-mt-1">Jenis file hanya PDF dan ukuran file maksimal 10 MB</p>
            </div>
            <div class="col-12">
              <q-input v-model="tmpData.note" filled label="Keterangan" />
            </div>
            <div class="col-12">
              <div class="tw-mt-5">
                <button type="button" @click="close"
                  class="tw-text-white tw-bg-gradient-to-r tw-from-slate-500 tw-via-slate-600 tw-to-slate-700 hover:tw-bg-gradient-to-br focus:tw-ring-4 focus:tw-outline-none focus:tw-ring-blue-300 dark:tw-focus:ring-blue-800 tw-font-medium tw-rounded-lg tw-text-sm tw-px-5 tw-py-2.5 tw-text-center tw-mr-2 tw-mb-2">Kembali</button>
                <button type="button" @click="save"
                  class="tw-text-white tw-bg-gradient-to-r tw-from-amber-500 tw-via-amber-600 tw-to-amber-700 hover:tw-bg-gradient-to-br focus:tw-ring-4 focus:tw-outline-none focus:tw-ring-blue-300 dark:tw-focus:ring-blue-800 tw-font-medium tw-rounded-lg tw-text-sm tw-px-5 tw-py-2.5 tw-text-center tw-mr-2 tw-mb-2">Simpan</button>
              </div>
            </div>
          </div>
          <table class="tw-w-full tw-text-sm  tw-text-gray-500  tw-mt-5">
            <thead class="tw-text-xs tw-text-gray-700 tw-uppercase  t-gray-400">
              <tr>
                <th scope="col" class="tw-py-3 tw-px-3 tw-bg-cyan-400 tw-text-left">
                  No
                </th>
                <th scope="col" class="tw-py-3 tw-px-3 tw-bg-cyan-400 tw-text-left">
                  File
                </th>
                <th scope="col" class="tw-py-3 tw-px-3 tw-bg-cyan-400 tw-text-left">
                  Keterangan
                </th>
                <th scope="col" class="tw-py-3 tw-px-3 tw-bg-cyan-400 tw-text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(data, i) in listData" :key="i"
                class="tw-bg-white tw-border-b dark:tw-bg-gray-800 dark:tw-border-gray-700 tw-text-xs">
                <th scope="row" class="tw-py-2 tw-px-3 tw-text-left">
                  {{ i + 1 }}
                </th>
                <th scope="row" class="tw-py-2 tw-px-3 tw-text-left">
                  {{ data.rfqf_name }}
                </th>
                <td class="tw-py-2 tw-px-3 tw-text-left">
                  {{ data.rfqf_note }}
                </td>
                <td class="tw-py-2 tw-px-3 tw-text-right">
                  <p @click="remove(data)" class="tw-font-semibold tw-text-red-500 tw-cursor-pointer">Hapus</p>
                </td>
              </tr>
            </tbody>
          </table>


        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import axios from 'axios';
import { reactive, ref } from 'vue';
import { domain, npwp, suppCode } from '../utils';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const props = defineProps(['dialog', 'data'])
const emit = defineEmits(['close', 'setData'])
const search = ref(null)
const listData = ref([])
const tmpData = reactive({
  file: null,
  note: '',
  code: null,
  npwp: suppCode(),
})

const getData = async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_ETENDER}listFileRfqByCode`, {
    params: {
      code: tmpData.code,
      vend: tmpData.npwp,
    }
  })
  listData.value = res.data
}

const save = async () => {
  if (!tmpData.file) {
    $q.notify({
      type: "negative",
      message: 'file wajib di input',
    });
    return;
  }
  let formData = new FormData();
  for (let key in tmpData) {
    formData.append(key, tmpData[key]);
  }

  await axios.post(`${import.meta.env.VITE_API_ETENDER}saveFilePenawaran`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })

  $q.notify({
    type: "positive",
    message: 'Upload file berhasil',
  });

  emit('close')
}

const remove = async (value) => {
  await axios.post(`${import.meta.env.VITE_API_ETENDER}deleteFilePenawaran`, value)
  await getData()
}

const close = () => {
  emit('close')
}

const setData = (value) => {
  emit('setData', value)
}

tmpData.code = props.data.rfqh_code
getData()
</script>