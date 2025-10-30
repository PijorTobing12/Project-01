<template>
  <div class="q-pa-md">
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
// import { api } from "src/boot/axios";
import axios from "axios";
import { ParseError, excelDownload, domain, role, empid } from "/src/utils";
import { useQuasar } from "quasar";

const $q = useQuasar();
const listMappingRegion = ref([]);
// const listKota = ref(["Kota1","Kota2","Kota3"]);
// const listRegion = ref(["Region1","Region2","Region3"]);
const listKota = ref([]);
const listRegion = ref([]);
const listSite = ref([]);

const right = ref(false);

const loading = ref(false);
const dialogForm = ref(false);
const dialogForm_EDIT = ref(false);
const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10,
  filter: null,
  domain: domain(),
});

const tmpForm = reactive({
  id: null,
  kotatujuan: null,
  region: null,
  aktif: null,
  site:null,
  DOUser: empid(), 
  domain: domain(), 
});

const getReminder = async () => {
  try {
    $q.loading.show();
    const res = await api.get("getReminder", {
      params: pagination.value,      
    });   

    $q.notify({
      type: "positive",
      message: res.data.message,
    });

    pagination.value.rowsNumber = res.data.total;
    $q.loading.hide();
  } catch (error) {
    $q.loading.hide();
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const reset = () => {
  tmpForm.kotatujuan = null;
  tmpForm.region = null;
  tmpForm.aktif = null;
  tmpForm.id = null;
  tmpForm.site = null;
};

const onRequest = (props) => {
  const { page, rowsPerPage, sortBy, descending, filter } = props.pagination;
  pagination.value.filter = filter;
  pagination.value.page = page;
  pagination.value.rowsPerPage = rowsPerPage;
  pagination.value.sortBy = sortBy;
  pagination.value.descending = descending;
  pagination.value.empid = empid();
  pagination.value.domain = domain();
  getReminder();
};

onMounted(() => {
  onRequest({
    pagination: pagination.value,
  });
});

document.addEventListener("etrasn_setdomain",() =>{     
  pagination.value.domain = domain();
  getReminder();  
});
</script>