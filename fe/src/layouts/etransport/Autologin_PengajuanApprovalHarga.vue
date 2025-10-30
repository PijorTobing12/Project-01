<template>
  <div class="q-pa-md">
    <div class="col-12">
      <q-input v-model="tmpForm.nik" dense outlined label="NIK" />
    </div>
    <q-btn unelevated rounded color="warning" class="full-width btn-login" label="LOGIN" type="submit" />
  </div>
</template>


<script setup>
import { ref, onMounted, reactive } from "vue";
import { ParseError, domain, } from "./../../utils";
import { useQuasar } from "quasar";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const columns = [
  {
    name: "nama_aplikasi",
    required: true,
    label: "Nama Aplikasi",
    align: "left",
    field: "nama_aplikasi",
    sortable: true,
  },
  {
    name: "icon",
    required: true,
    label: "Icon",
    align: "left",
    field: "icon",
    sortable: true,
  },
  {
    name: "aksi",
    required: true,
    label: "Aksi",
    align: "left",
    field: "aksi",
  },
];
const $q = useQuasar();
const loading = ref(false);
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
  aplikasi: null,
  icon: null,
});

const reset = () => {
  tmpForm.aplikasi = null;
  tmpForm.icon = null;
  tmpForm.id = null;
};

onMounted(() => {
  onRequest({
    pagination: pagination.value,
  });
});

const onRequest = (props) => {
  const { page, rowsPerPage, sortBy, descending, filter } = props.pagination;
  pagination.value.filter = filter;
  pagination.value.page = page;
  pagination.value.rowsPerPage = rowsPerPage;
  pagination.value.sortBy = sortBy;
  pagination.value.descending = descending;
  tmpForm.nik = route.params.id
  getAplikasi();
};

const getAplikasi = async () => {
  try {
    $q.loading.show();

    var token = localStorage.getItem("token");
    var nik = localStorage.getItem("nik");
    if (nik != tmpForm.nik) {
      location.replace('https://app.dbc.co.id/');
    } else {
      $q.loading.hide();
      router.push("/PengajuanApprovalHarga");
    }
    return;
  } catch (error) {
    $q.loading.hide();

    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
    router.push("/login");
  }
};

document.addEventListener("etrasn_setdomain", () => {
  pagination.value.domain = domain();
  getAplikasi();
});
</script>