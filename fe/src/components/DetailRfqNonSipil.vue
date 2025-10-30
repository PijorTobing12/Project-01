<template>
  <q-dialog v-model="props.dialog" persistent>
    <q-card style="width: 100%; max-width: 100vw;">
      <q-card-section>
        <div class="tw-text-center tw-font-bold tw-text-xl tw-mt-5">REQUEST FOR QUOTATION (RFQ) DETAILS (NON SIPIL)
        </div>
        <div class="tw-flex flex-nowrap tw-mt-5 tw-content-start">
          <table class="tw-w-1/2">
            <tr>
              <td>No.RFQ</td>
              <td>:</td>
              <td>{{ props.data.rfqh_code }}</td>
            </tr>
            <tr>
              <td>Tanggal Buat</td>
              <td>:</td>
              <td>{{ formatDate(props.data.tgl_buat) }}</td>
            </tr>
            <tr>
              <td>Type</td>
              <td>:</td>
              <td>{{ props.data.rfqh_type }}</td>
            </tr>
          </table>
          <table class="tw-w-1/2">
            <tr>
              <td>Status</td>
              <td>:</td>
              <td>{{ props.data.rfqh_status }}</td>
            </tr>
            <tr>
              <td>PIC Princing</td>
              <td>:</td>
              <td>{{ props.data.pic_pricing_name }}</td>
            </tr>
            <tr>
              <td></td>
              <td>&nbsp;</td>
              <td></td>
            </tr>
          </table>
        </div>
        <div class="tw-overflow-x-auto tw-relative">
          <table v-if="props.data.rfqs_status != 3" class="tw-w-full tw-text-sm  tw-text-gray-500  tw-mt-5">
            <thead class="tw-text-xs tw-text-gray-700 tw-uppercase  t-gray-400">
              <tr>
                <th scope="col" class="tw-py-3 tw-px-3 tw-bg-cyan-400 tw-text-left">
                  No
                </th>
                <th scope="col" class="tw-py-3 tw-px-3 tw-bg-cyan-400 tw-text-left">
                  Kode Barang
                </th>
                <th scope="col" class="tw-py-3 tw-px-3 tw-bg-cyan-400 tw-text-left">
                  Nama Barang
                </th>
                <th scope="col" class="tw-py-3 tw-px-3 tw-bg-cyan-400 tw-text-left">
                  Ket. RO
                </th>
                <th scope="col" class="tw-py-3 tw-px-3 tw-bg-cyan-400 tw-text-right">
                  Qty
                </th>
                <th scope="col" class="tw-py-3 tw-px-3 tw-bg-cyan-400 tw-text-left">
                  UM
                </th>
                <th scope="col" class="tw-py-3 tw-px-3  tw-bg-amber-400 tw-text-right">
                  Harga
                </th>
                <th scope="col" class="tw-py-3 tw-px-3 tw-bg-amber-400 tw-text-right">
                  Total
                </th>
                <th scope="col" class="tw-py-3 tw-px-3 tw-bg-amber-400 tw-text-left">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              <slot v-for="(data, i) in listData" :key="i">
                <tr class="tw-bg-white tw-border-b dark:tw-bg-gray-800 dark:tw-border-gray-700 tw-text-xs">
                  <td scope="row" :rowspan="data.detailSub.length + 1" class="tw-py-2 tw-px-3 tw-text-left">
                    {{ i + 1 }}
                  </td>
                  <td scope="row" :rowspan="data.detailSub.length + 1" class="tw-py-2 tw-px-3 tw-text-left">
                    {{ data.rfqd_item }}
                  </td>
                  <td class="tw-py-2 tw-px-3 tw-text-left">
                    {{ data.nmprod }}
                  </td>
                  <td class="tw-py-2 tw-px-3 tw-text-left">
                    {{ data.rfqd_ro_desc }}
                  </td>
                  <td class="tw-py-2 tw-px-3 tw-text-right">
                    {{ data.rfqd_qty }}
                  </td>
                  <td class="tw-py-2 tw-px-3">
                    {{ data.satuan }}
                  </td>
                  <td class="tw-py-2 tw-px-3 tw-text-right">
                    <input v-model="listData[i].harga" type="text" v-money="money"
                      class="tw-w-20 tw-p-1 tw-text-right tw-border tw-border-gray-300" />
                  </td>
                  <td class="tw-py-2 tw-px-3 tw-text-right">
                    {{
                      listData[i].harga != '0' ? formatRupiah(parseFloat(listData[i].harga.toString().replace(/\./g, "")) *
                        data.rfqd_qty) : '0'
                    }}
                  </td>
                  <td class="tw-py-2 tw-px-3">
                    <p class="tw-font-semibold tw-cursor-pointer tw-text-orange-400" @click="addDetails(data)">Tambah
                      Details</p>
                  </td>

                </tr>
                <tr v-for="(data, ii) in data.detailSub" :key="ii"
                  class="tw-border-b tw-bg-red-200 dark:tw-bg-gray-800 dark:tw-border-gray-700 tw-text-xs">
                  <td class="tw-py-2 tw-px-3 tw-text-left">
                    {{ data.nama }}
                  </td>
                  <td class="tw-py-2 tw-px-3 tw-text-right">
                    {{ data.qty }}
                  </td>
                  <td class="tw-py-2 tw-px-3">
                    {{ data.um }}
                  </td>
                  <td class="tw-py-2 tw-px-3 tw-text-right">
                    {{ formatRupiah(data.harga) }}
                  </td>
                  <td class="tw-py-2 tw-px-3 tw-text-right">
                    <!-- {{ formatRupiah(data.qty * data.harga) }} -->
                  </td>
                  <td class="tw-py-2 tw-px-3">
                  </td>
                </tr>
              </slot>

            </tbody>
          </table>

          <table v-else-if="props.data.rfqs_status == 3 && props.data.rfqs_flag == '1'"
            class="tw-w-full tw-text-sm  tw-text-gray-500  tw-mt-5">
            <thead class="tw-text-xs tw-text-gray-700 tw-uppercase  t-gray-400">
              <tr>
                <th scope="col" class="tw-py-3 tw-px-3 tw-bg-cyan-400 tw-text-left">
                  No
                </th>
                <th scope="col" class="tw-py-3 tw-px-3 tw-bg-cyan-400 tw-text-left">
                  Kode Barang
                </th>
                <th scope="col" class="tw-py-3 tw-px-3 tw-bg-cyan-400 tw-text-left">
                  Nama Barang
                </th>
                <th scope="col" class="tw-py-3 tw-px-3 tw-bg-cyan-400 tw-text-left">
                  Ket. RO
                </th>
                <th scope="col" class="tw-py-3 tw-px-3 tw-bg-cyan-400 tw-text-right">
                  Qty
                </th>
                <th scope="col" class="tw-py-3 tw-px-3 tw-bg-cyan-400 tw-text-left">
                  UM
                </th>
                <th scope="col" class="tw-py-3 tw-px-3  tw-bg-amber-400 tw-text-right">
                  Harga
                </th>
                <th scope="col" class="tw-py-3 tw-px-3  tw-bg-amber-400 tw-text-right">
                  Harga Nego
                </th>
                <th scope="col" class="tw-py-3 tw-px-3 tw-bg-amber-400 tw-text-left">
                  Total
                </th>
                <th scope="col" class="tw-py-3 tw-px-3 tw-bg-amber-400 tw-text-left">
                  Catatan Purchasing
                </th>
              </tr>
            </thead>
            <tbody>
              <slot v-for="(data, i) in listData" :key="i">
                <tr class="tw-bg-white tw-border-b dark:tw-bg-gray-800 dark:tw-border-gray-700 tw-text-xs">
                  <th scope="row" :rowspan="data.detailSub.length + 1" class="tw-py-2 tw-px-3 tw-text-left">
                    {{ i + 1 }}
                  </th>
                  <th scope="row" :rowspan="data.detailSub.length + 1" class="tw-py-2 tw-px-3 tw-text-left">
                    {{ data.rfqd_item }}
                  </th>
                  <td class="tw-py-2 tw-px-3 tw-text-left">
                    {{ data.nmprod }}
                  </td>
                  <td class="tw-py-2 tw-px-3 tw-text-left">
                    {{ data.rfqd_ro_desc }}
                  </td>
                  <td class="tw-py-2 tw-px-3 tw-text-right">
                    {{ data.rfqd_qty }}
                  </td>
                  <td class="tw-py-2 tw-px-3">
                    {{ data.satuan }}
                  </td>
                  <td class="tw-py-2 tw-px-3 tw-text-right">
                    <input v-model="listData[i].harga" type="text" v-money="money" class="tw-w-20 tw-p-1 tw-text-right"
                      disabled />
                  </td>
                  <td class="tw-py-2 tw-px-3 tw-text-right">
                    <input v-model="listData[i].harga_nego" type="text" v-money="money"
                      class="tw-w-20 tw-p-1 tw-text-right tw-border tw-border-gray-300" />
                  </td>
                  <td class="tw-py-2 tw-px-3">
                    <span v-if="parseInt(listData[i].harga_nego) > 0">{{
                      formatRupiah(listData[i].harga_nego.toString().replace(/\./g, "") *
                        data.rfqd_qty)
                    }}</span>
                  </td>
                  <td class="tw-py-2 tw-px-3">
                    {{ data.catatan_nego }}
                  </td>
                </tr>
                <tr v-for="(data, ii) in data.detailSub" :key="ii"
                  class="tw-border-b tw-bg-red-200 dark:tw-bg-gray-800 dark:tw-border-gray-700 tw-text-xs">
                  <td class="tw-py-2 tw-px-3 tw-text-left">
                    {{ data.nama }}
                  </td>
                  <td class="tw-py-2 tw-px-3 tw-text-right">
                    {{ data.qty }}
                  </td>
                  <td class="tw-py-2 tw-px-3">
                    {{ data.um }}
                  </td>
                  <td class="tw-py-2 tw-px-3 tw-text-right">
                    <input v-model="data.harga" type="text" v-money="money"
                      class="tw-w-20 tw-p-1 tw-text-right tw-border tw-border-gray-300" />
                  </td>
                  <td class="tw-py-2 tw-px-3 tw-text-right">
                  </td>
                  <td class="tw-py-2 tw-px-3">
                  </td>
                  <td class="tw-py-2 tw-px-3">
                  </td>
                </tr>
              </slot>
            </tbody>
          </table>

          <table v-else class="tw-w-full tw-text-sm  tw-text-gray-500  tw-mt-5">
            <thead class="tw-text-xs tw-text-gray-700 tw-uppercase  t-gray-400">
              <tr>
                <th scope="col" class="tw-py-3 tw-px-3 tw-bg-cyan-400 tw-text-left">
                  No
                </th>
                <th scope="col" class="tw-py-3 tw-px-3 tw-bg-cyan-400 tw-text-left">
                  Kode Barang
                </th>
                <th scope="col" class="tw-py-3 tw-px-3 tw-bg-cyan-400 tw-text-left">
                  Nama Barang
                </th>
                <th scope="col" class="tw-py-3 tw-px-3 tw-bg-cyan-400 tw-text-left">
                  Ket. RO
                </th>
                <th scope="col" class="tw-py-3 tw-px-3 tw-bg-cyan-400 tw-text-right">
                  Qty
                </th>
                <th scope="col" class="tw-py-3 tw-px-3 tw-bg-cyan-400 tw-text-left">
                  UM
                </th>
                <th scope="col" class="tw-py-3 tw-px-3  tw-bg-amber-400 tw-text-right">
                  Harga
                </th>
                <th scope="col" class="tw-py-3 tw-px-3  tw-bg-amber-400 tw-text-right">
                  Harga Nego
                </th>
                <th scope="col" class="tw-py-3 tw-px-3 tw-bg-amber-400 tw-text-left">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              <slot v-for="(data, i) in listData" :key="i">
                <tr class="tw-bg-white tw-border-b dark:tw-bg-gray-800 dark:tw-border-gray-700 tw-text-xs">
                  <th scope="row" :rowspan="data.detailSub.length + 1" class="tw-py-2 tw-px-3 tw-text-left">
                    {{ i + 1 }}
                  </th>
                  <th scope="row" :rowspan="data.detailSub.length + 1" class="tw-py-2 tw-px-3 tw-text-left">
                    {{ data.rfqd_item }}
                  </th>
                  <td class="tw-py-2 tw-px-3 tw-text-left">
                    {{ data.nmprod }}
                  </td>
                  <td class="tw-py-2 tw-px-3 tw-text-left">
                    {{ data.rfqd_ro_desc }}
                  </td>
                  <td class="tw-py-2 tw-px-3 tw-text-right">
                    {{ data.rfqd_qty }}
                  </td>
                  <td class="tw-py-2 tw-px-3">
                    {{ data.satuan }}
                  </td>
                  <td class="tw-py-2 tw-px-3 tw-text-right">
                    {{ listData[i].harga }}
                  </td>
                  <td class="tw-py-2 tw-px-3 tw-text-right">
                    {{ listData[i].harga_nego }}
                  </td>
                  <td class="tw-py-2 tw-px-3">
                    <span v-if="parseInt(listData[i].harga_nego) > 0">{{
                      formatRupiah(listData[i].harga_nego.toString().replace(/\./g, "") *
                        data.rfqd_qty)
                    }}</span>
                  </td>
                </tr>
                <tr v-for="(data, ii) in data.detailSub" :key="ii"
                  class="tw-border-b tw-bg-red-200 dark:tw-bg-gray-800 dark:tw-border-gray-700 tw-text-xs">
                  <td class="tw-py-2 tw-px-3 tw-text-left">
                    {{ data.nama }}
                  </td>
                  <td class="tw-py-2 tw-px-3 tw-text-right">
                    {{ data.qty }}
                  </td>
                  <td class="tw-py-2 tw-px-3">
                    {{ data.um }}
                  </td>
                  <td class="tw-py-2 tw-px-3 tw-text-right">
                    {{ formatRupiah(data.harga) }}
                  </td>
                  <td class="tw-py-2 tw-px-3 tw-text-right">
                  </td>
                  <td class="tw-py-2 tw-px-3">
                  </td>
                </tr>
              </slot>
            </tbody>
          </table>

          <div class="tw-mt-5">
            <button type="button" @click="close"
              class="tw-text-white tw-bg-gradient-to-r tw-from-slate-500 tw-via-slate-600 tw-to-slate-700 hover:tw-bg-gradient-to-br focus:tw-ring-4 focus:tw-outline-none focus:tw-ring-blue-300 dark:tw-focus:ring-blue-800 tw-font-medium tw-rounded-lg tw-text-sm tw-px-5 tw-py-2.5 tw-text-center tw-mr-2 tw-mb-2">Kembali</button>
            <button v-if="vendStatus != 2 && props.data.rfqs_flag == '1' && props.data.rfqh_flag != '4'" type="button" @click="showDialogFile"
              class="tw-text-white tw-bg-gradient-to-r tw-from-blue-500 tw-via-blue-600 tw-to-blue-700 hover:tw-bg-gradient-to-br focus:tw-ring-4 focus:tw-outline-none focus:tw-ring-blue-300 dark:tw-focus:ring-blue-800 tw-font-medium tw-rounded-lg tw-text-sm tw-px-5 tw-py-2.5 tw-text-center tw-mr-2 tw-mb-2">Upload
              Penawaran</button>
            <button v-if="vendStatus != 2 && props.data.rfqs_flag == '1' && props.data.rfqh_flag != '4'" type="button" @click="save('2')"
              class="tw-text-white tw-bg-gradient-to-r tw-from-lime-500 tw-via-lime-600 tw-to-lime-700 hover:tw-bg-gradient-to-br focus:tw-ring-4 focus:tw-outline-none focus:tw-ring-blue-300 dark:tw-focus:ring-blue-800 tw-font-medium tw-rounded-lg tw-text-sm tw-px-5 tw-py-2.5 tw-text-center tw-mr-2 tw-mb-2">Proses</button>
            <button v-if="vendStatus != 2 && props.data.rfqs_flag == '1' && props.data.rfqh_flag != '4'" type="button" @click="save('1')"
              class="tw-text-white tw-bg-gradient-to-r tw-from-amber-500 tw-via-amber-600 tw-to-amber-700 hover:tw-bg-gradient-to-br focus:tw-ring-4 focus:tw-outline-none focus:tw-ring-blue-300 dark:tw-focus:ring-blue-800 tw-font-medium tw-rounded-lg tw-text-sm tw-px-5 tw-py-2.5 tw-text-center tw-mr-2 tw-mb-2">Simpan</button>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog v-model="dialogAddDetail" persistent>
    <q-card style="width: 500px; max-width: 80vw;">
      <Form :initial-values="{
        terms: false,
        subscribed: false,
      }" :validation-schema="schema" @submit="saveDetails" class="q-mt-md">
        <q-card-section>
          <div class="tw-text-center tw-font-bold tw-text-xl tw-mb-5">Tambah Detail Barang</div>
          <div class="row q-col-gutter-sm">
            <div class="col-12">

              <q-input outlined dense label="Kode Barang" :model-value="tmpDetails.kode_nama" readonly />
            </div>
            <div class="col-12 col-md-6">
              <Field v-model="tmpDetails.nama" name="nama_barang" v-slot="{ errorMessage, value, field }">
                <q-input outlined dense label="Nama Barang" :model-value="value" v-bind="field"
                  :error-message="errorMessage" :error="!!errorMessage" :hide-bottom-space="true" />
              </Field>
            </div>
            <div class="col-12 col-md-6">
              <Field v-model="tmpDetails.qty" name="qty" v-slot="{ errorMessage, value, field }">
                <q-input outlined dense label="Qty" type="number" :model-value="value" v-bind="field"
                  :error-message="errorMessage" :error="!!errorMessage" :hide-bottom-space="true" />
              </Field>
            </div>
            <div class="col-12 col-md-6">
              <Field v-model="tmpDetails.harga" name="harga" v-slot="{ errorMessage, value, field }">
                <q-input outlined dense label="Harga" :model-value="value" v-bind="field" :error-message="errorMessage"
                  :error="!!errorMessage" :hide-bottom-space="true" />
              </Field>
            </div>
            <div class="col-12 col-md-6">
              <Field v-model="tmpDetails.um" name="um" v-slot="{ errorMessage, value, field }">
                <q-select outlined dense :options="listUm" option-value="qu_name" option-label="qu_desc" emit-value
                  map-options label="UM" :model-value="value" v-bind="field" :error-message="errorMessage"
                  :error="!!errorMessage" :hide-bottom-space="true" />
              </Field>
            </div>

          </div>
        </q-card-section>
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="Close" @click="dialogAddDetail = false" />

          <button type="submit"
            class="tw-text-white tw-bg-gradient-to-r tw-from-lime-500 tw-via-lime-600 tw-to-lime-700 hover:tw-bg-gradient-to-br focus:tw-ring-4 focus:tw-outline-none focus:tw-ring-blue-300 dark:tw-focus:ring-blue-800 tw-font-medium tw-rounded-lg tw-text-sm tw-px-4 tw-py-2 tw-text-center tw-mr-2 tw-ml-1 tw-mb-2">Proses</button>
        </q-card-actions>
      </Form>
    </q-card>
  </q-dialog>

  <UploadFilePenawaran v-if="dialogFile" :dialog="dialogFile" :data="props.data" @close="dialogFile = false">
  </UploadFilePenawaran>
</template>

<script setup>
import axios from 'axios';
import { reactive, ref } from 'vue';
import { Field, Form } from "vee-validate";
import * as yup from "yup";
import { domain, formatRupiah, suppCode, formatDate } from '../utils';
import { VMoney } from 'v-money'
import { useQuasar } from 'quasar';
import UploadFilePenawaran from "./UploadFilePenawaran.vue";

const $q = useQuasar();
const props = defineProps(['dialog', 'data'])
const emit = defineEmits(['close', 'setData'])
const dialogFile = ref(false)
const dialogAddDetail = ref(false)
const vendStatus = ref(0)
const listData = ref([])
const listUm = ref([])
const schema = yup.object({
  nama_barang: yup.string().required().label("Nama Barang"),
  um: yup.string().required().label("UM"),
  qty: yup.number().required().label("Qty"),
  harga: yup.number().min(1).
    required().label("Harga"),
});
const tmpDetails = reactive({
  id: '',
  id_det: '',
  kode_nama: '',
  kode: '',
  nama: '',
  qty: '',
  harga: '',
  um: '',
})
const money = reactive({
  decimal: ',',
  thousands: '.',
  prefix: '',
  suffix: '',
  precision: 0,
  masked: true
})

const getData = async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_ETENDER}listDetMonitoringRfqVend`, {
    params: { ...props.data, ...{ vend: suppCode() } }
  })
  listData.value = res.data
  vendStatus.value = res.data[0].vend_status
}

const getListUm = async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_ETENDER}listUm`)
  listUm.value = res.data
}

const save = async (value) => {
  try {
    let cekHarga = 0;
    let cekHarga1 = 0;
    let cekHargaNego = 0;
    for (const iterator of listData.value) {
      if (parseFloat(iterator.harga.toString().replace(/\./g, "")) <= 0) {
        cekHarga = cekHarga + 1;
      }
    }

    if (props.data.rfqh_flag == 3) {
      for (const iterator of listData.value) {
        if (parseFloat(iterator.harga.toString().replace(/\./g, "")) <= 0) {
          cekHarga = cekHarga + 1;
        }

        if (parseFloat(iterator.harga_nego.toString().replace(/\./g, "")) > parseFloat(iterator.harga.toString().replace(/\./g, ""))) {
          cekHargaNego = cekHargaNego + 1;
        }
      }
    }


    if (cekHarga > 0) {
      $q.notify({
        type: "negative",
        message: 'Terdapat data yang belum di set harganya',
      });
      return;
    }

    // if (cekHarga1 > 0) {
    //   $q.notify({
    //     type: "negative",
    //     message: 'Terdapat harga sub item yang lebih besar dari item utamanya',
    //   });
    //   return;
    // }

    if (cekHargaNego > 0) {
      $q.notify({
        type: "negative",
        message: 'Terdapat harga nego yang lebih besar dari harga awal',
      });
      return;
    }
    let notif = value == '1' ? 'simpan' : 'proses'
    $q.dialog({
      title: 'Konfirmasi',
      message: `Apakah anda yakin ingin ${notif} data ini, dan pastikan data yang di input sudah benar ?`,
      cancel: true,
      persistent: true
    }).onOk(async () => {
      $q.loading.show()
      await axios.post(`${import.meta.env.VITE_API_ETENDER}saveRQbyVendorNonSipil`, { code: props.data.rfqh_code, data: listData.value, vend: suppCode(), flag: value })
      $q.loading.hide()
      setData(listData.value)
    })
  } catch (error) {
    $q.loading.hide()
  }
}

const close = () => {
  emit('close')
}

const setData = (value) => {
  emit('setData', value)
}

const addDetails = async (value) => {
  if (value.harga.toString().replace(/\./g, "") == 0) {
    $q.notify({
      type: "negative",
      message: 'Silakan set harga terlebih dahulu.',
    });
    return;
  }
  await getListUm()
  tmpDetails.id_det = value.id
  tmpDetails.kode_nama = value.rfqd_item + ' - ' + value.nmprod
  tmpDetails.kode = value.rfqd_item
  dialogAddDetail.value = true
}

const saveDetails = (values, actions) => {
  let idx = listData.value.findIndex(data => data.id == tmpDetails.id_det)

  let totalHeader = listData.value[idx].rfqd_qty * parseFloat(listData.value[idx].harga.replace(/\./g, ""))
  let totalSub = 0;
  for (const iterator of listData.value[idx].detailSub) {
    totalSub = totalSub + (iterator.qty * iterator.harga)
  }
  totalSub = totalSub + (tmpDetails.qty * tmpDetails.harga)

  if (totalSub > totalHeader) {
    $q.notify({
      type: "negative",
      message: 'Total Sub lebih besar dari Total Item',
    });
    return;
  }

  // if (tmpDetails.harga > parseFloat(listData.value[idx].harga.replace(/\./g, ""))) {
  //   $q.notify({
  //     type: "negative",
  //     message: 'Harga Sub lebih besar dari Harga Item',
  //   });
  //   return;
  // }


  listData.value[idx].detailSub.push({ ...tmpDetails })
  dialogAddDetail.value = false

  // listData.value.push({
  //   "rfqd_item": tmpDetails.kode,
  //   "rfqd_qty": tmpDetails.qty,
  //   "nmprod": tmpDetails.nama,
  //   "satuan": tmpDetails.um,
  //   "id": 0,
  //   "harga_nego": 0,
  //   "harga": tmpDetails.harga,
  //   "status": "READY",
  //   "note": "",
  //   "detailSub": []
  // })
  // console.log(tmpDetails);
}

const showDialogFile = () => {
  dialogFile.value = true
}


getData()

</script>