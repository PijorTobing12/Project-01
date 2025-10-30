<template>
  <q-dialog v-model="props.dialog" persistent>
    <q-card style="width: 100%; max-width: 100vw;">
      <q-card-section>
        <div class="tw-text-center tw-font-bold tw-text-xl tw-mt-5">REQUEST FOR QUOTATION (RFQ) DETAILS</div>
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
            <thead class="tw-text-xs tw-text-gray-700 tw-uppercase">
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
                  Keterangan
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
                  <input v-model="listData[i].harga" type="text" v-money="money"
                    class="tw-w-20 tw-p-1 tw-text-right tw-border tw-border-gray-300" />
                </td>
                <td class="tw-py-2 tw-px-3 tw-text-right">
                  <span v-if="parseInt(listData[i].harga) > 0">
                    {{ formatRupiah(reformarPrice(listData[i].harga) * data.rfqd_qty) }}
                  </span>
                </td>
                <td class="tw-py-2 tw-px-3">
                  <input type="text" class="tw-w-[200px] tw-p-1 tw-border tw-border-gray-300"
                    v-model="listData[i].note" />
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="7" class="tw-py-3 tw-px-3 tw-bg-cyan-300 tw-font-extrabold tw-text-gray-700">Total</td>
                <td class="tw-py-3 tw-px-3 tw-bg-cyan-300 tw-text-right tw-font-extrabold tw-text-gray-700">{{
                  formatRupiah(totalPrice()) }}</td>
                <td class="tw-py-3 tw-px-3 tw-bg-cyan-300 "></td>
              </tr>
            </tfoot>
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
                  Keterangan
                </th>
                <th scope="col" class="tw-py-3 tw-px-3 tw-bg-amber-400 tw-text-left">
                  Catatan Purchasing
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
                  <span v-if="parseInt(listData[i].harga_nego) > 0">
                    {{ formatRupiah(reformarPrice(listData[i].harga_nego) * data.rfqd_qty) }}
                  </span>
                </td>
                <td class="tw-py-2 tw-px-3">
                  <input type="text" class="tw-w-[200px] tw-p-1 tw-border tw-border-gray-300"
                    v-model="listData[i].note" />
                </td>
                <td class="tw-py-2 tw-px-3">
                  {{ data.catatan_nego }}
                </td>
              </tr>
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
                <th scope="col" class="tw-py-3 tw-px-3 tw-bg-amber-400 tw-text-right">
                  Total
                </th>
                <th scope="col" class="tw-py-3 tw-px-3 tw-bg-amber-400 tw-text-left">
                  Keterangan
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
                  {{ formatRupiah(data.harga) }}
                </td>
                <td class="tw-py-2 tw-px-3 tw-text-right">
                  {{ data.harga_nego }}
                </td>
                <td class="tw-py-2 tw-px-3 tw-text-right">
                  <span v-if="parseInt(data.harga_nego) > 0">
                    {{ formatRupiah(reformarPrice(data.harga_nego) * data.rfqd_qty) }}
                  </span>
                  <span v-else>
                    {{ formatRupiah(reformarPrice(data.harga) * data.rfqd_qty) }}
                  </span>
                </td>
                <td class="tw-py-2 tw-px-3">
                  {{ listData[i].note }}
                </td>
              </tr>
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
  <UploadFilePenawaran v-if="dialogFile" :dialog="dialogFile" :data="props.data" @close="dialogFile = false">
  </UploadFilePenawaran>
</template>

<script setup>
import axios from 'axios';
import { reactive, ref } from 'vue';
import { domain, formatRupiah, nik, suppCode, formatDate } from '../utils';
import { VMoney } from 'v-money'
import { useQuasar } from 'quasar';
import UploadFilePenawaran from "./UploadFilePenawaran.vue";

const $q = useQuasar();
const props = defineProps(['dialog', 'data'])
const emit = defineEmits(['close', 'setData'])
const dialogFile = ref(false)
const listData = ref([])
const vendStatus = ref(0)
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

const save = async (value) => {
  let cekHarga = 0;
  let cekHargaNego = 0;
  for (const iterator of listData.value) {
    if (parseInt(iterator.harga.toString().replace(/\./g, "")) <= 0) {
      cekHarga = cekHarga + 1;
    }

    if (parseFloat(iterator.harga_nego.toString().replace(/\./g, "")) > parseFloat(iterator.harga.toString().replace(/\./g, ""))) {
      cekHargaNego = cekHargaNego + 1;
    }
  }

  if (cekHarga > 0) {
    $q.notify({
      type: "negative",
      message: 'Terdapat data yang belum di set harganya',
    });
    return;
  }

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
    await axios.post(`${import.meta.env.VITE_API_ETENDER}saveRQbyVendorSipil`, { code: props.data.rfqh_code, data: listData.value, vend: suppCode(), flag: value })

    if (value == '1') {
      $q.notify({
        type: "positive",
        message: `Simpan data berhasil`,
      });
    }
    else {
      $q.notify({
        type: "positive",
        message: `Proses data berhasil`,
      });
    }

    $q.loading.hide()
    setData(listData.value)
  })
}

const close = () => {
  emit('close')
}

const setData = (value) => {
  emit('setData', value)
}

const showDialogFile = () => {
  dialogFile.value = true
}

const reformarPrice = (value) => {
  return value.toString().replace(/\./g, "");
}

const totalPrice = () => {
  let total = 0;
  for (const iterator of listData.value) {
    total = total + (iterator.rfqd_qty * iterator.harga.toString().replace(/\./g, ""))
  }
  return total;
}


getData()

</script>