<template>
  <div class="tw-p-4">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <div class="row q-col-gutter-md">
          <div class="col-6">
            <q-input dense outlined v-model="tmpForm.date1" stack-label label="Periode" type="date" />
          </div>
          <div class="col-6">
            <q-input dense outlined v-model="tmpForm.date2" stack-label label="s/d" type="date" />
          </div>
          <div class="col-12">
            <q-select outlined dense v-model="tmpForm.report" :options="listReport" clearable
              :label="tmpForm.report == null ? 'All' : 'Report'" option-label="rpt_name" option-value="id" emit-value
              map-options />
          </div>
          <div class="col-12">
            <q-btn-group push>
              <q-btn color="primary" label="Search" @click="search" />
              <q-btn color="primary" label="Download" @click="download" />
            </q-btn-group>
          </div>
        </div>
      </div>
    </div>
    <div
      class="tw-inline-block tw-mt-5 tw-min-w-full tw-overflow-hidden tw-align-middle tw-border-b tw-border-gray-200 tw-shadow sm:tw-rounded-lg">
      <table class="tw-min-w-full">
        <thead>
          <tr>
            <th
              class="tw-px-6 tw-py-4 tw-text-xs tw-font-semibold tw-leading-4 tw-tracking-wider tw-text-left tw-text-gray-500 tw-uppercase tw-border-b tw-border-gray-200 tw-bg-gray-50">
              No</th>
            <th
              class="tw-px-6 tw-py-4 tw-text-xs tw-font-semibold tw-leading-4 tw-tracking-wider tw-text-left tw-text-gray-500 tw-uppercase tw-border-b tw-border-gray-200 tw-bg-gray-50">
              Dashboard</th>
            <th
              class="tw-px-6 tw-py-4 tw-text-xs tw-font-semibold tw-leading-4 tw-tracking-wider tw-text-left tw-text-gray-500 tw-uppercase tw-border-b tw-border-gray-200 tw-bg-gray-50">
              NIK</th>
            <th
              class="tw-px-6 tw-py-4 tw-text-xs tw-font-semibold tw-leading-4 tw-tracking-wider tw-text-left tw-text-gray-500 tw-uppercase tw-border-b tw-border-gray-200 tw-bg-gray-50">
              Nama</th>
            <th
              class="tw-px-6 tw-py-4 tw-text-xs tw-font-semibold tw-leading-4 tw-tracking-wider tw-text-left tw-text-gray-500 tw-uppercase tw-border-b tw-border-gray-200 tw-bg-gray-50">
              BU</th>
            <th
              class="tw-px-6 tw-py-4 tw-text-xs tw-font-semibold tw-leading-4 tw-tracking-wider tw-text-gray-500 tw-uppercase tw-border-b tw-border-gray-200 tw-bg-gray-50 tw-text-right">
              Total</th>
          </tr>
        </thead>

        <tbody class="tw-bg-white">
          <tr>
            <td class="tw-px-6 tw-py-2 tw-whitespace-no-wrap tw-border-b tw-border-gray-200">
              <div class="tw-text-sm tw-leading-5 tw-text-gray-500">TEST</div>
            </td>
            <td class="tw-px-6 tw-py-2 tw-whitespace-no-wrap tw-border-b tw-border-gray-200">
              <div class="tw-text-sm tw-leading-5 tw-text-gray-500">TEST</div>
            </td>
            <td class="tw-px-6 tw-py-2 tw-whitespace-no-wrap tw-border-b tw-border-gray-200">
              <div class="tw-text-sm tw-leading-5 tw-text-gray-500">TEST</div>
            </td>
            <td
              class="tw-px-6 tw-py-2 tw-text-sm tw-leading-5 tw-text-gray-500 tw-whitespace-no-wrap tw-border-b tw-border-gray-200">
              <div class="tw-text-sm tw-leading-5 tw-text-gray-500">TEST</div>
            </td>
            <td
              class="tw-px-6 tw-py-2 tw-text-sm tw-leading-5 tw-text-gray-500 tw-whitespace-no-wrap tw-border-b tw-border-gray-200">
              <div class="tw-text-sm tw-leading-5 tw-text-gray-500">TEST</div>
            </td>
            <td
              class="tw-px-6 tw-py-2 tw-text-sm tw-leading-5 tw-text-gray-500 tw-whitespace-no-wrap tw-border-b tw-border-gray-200 tw-text-right">
              <div class="tw-text-sm tw-leading-5 tw-text-gray-500">TEST</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import axios from "axios"
import { reactive, ref } from "vue";
import { useQuasar } from "quasar";
var XLSX = require("xlsx");

const $q = useQuasar()
const tmpForm = reactive({
  report: null,
})
const listReport = ref([])
const listData = ref([])


const search = async () => {
  $q.loading.show();
  const res = await axios.get('reportSummary', {
    params: tmpForm
  })
  listData.value = res.data.data
  $q.loading.hide();
}

const download = () => {
  const wb = XLSX.utils.table_to_book(document.getElementsByTagName("TABLE")[0])
  XLSX.writeFile(wb, "SheetJSMultiTablexport.xlsx");
  console.log(wb);
//   writeFileXLSX(wb, "laporanRekap.xlsx");
}
</script>

