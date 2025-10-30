<template>
  <div class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h6">Kontrak User</div>
      </q-card-section>
      <q-separator />

      <q-separator />

      <q-card-section>
        <q-table
          title="List Approver Procurement"
          :rows="listDomain"
          :columns="columns"
          row-key="id"
          v-model:pagination="pagination"
          :loading="loading"
          :filter="pagination.filter"
          :rows-per-page-options="[0]"
          @request="onRequest"
          binary-state-sort
        >
          <template v-slot:top-left>
            <div class="row q-col-gutter-sm">
              <div class="col-12">
                <q-select
                  borderless
                  dense
                  debounce="300"
                  v-model="pagination.rowsPerPage"
                  :options="[5, 10, 25, 50, 100, 200]"
                  @update:modelValue="updateTable"
                >
                  <template v-slot:before>
                    <q-icon name="reorder">
                      <q-tooltip :class="'tw-bg-black/90'">
                        Rows per page
                      </q-tooltip>
                    </q-icon>
                  </template>
                </q-select>
              </div>
            </div>
          </template>
          <template v-slot:top-right>
            <q-input
              dense
              debounce="300"
              v-model="pagination.filter"
              placeholder="Search"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
          <template v-slot:body-cell-No="props">
            <q-td :props="props">
              {{ props.rowIndex + 1 }}
            </q-td>
          </template>
          <template v-slot:body-cell-trn_date_start="props">
            <q-td :props="props">
              {{ formattedDate(props.row.trn_date_start) }} -
              {{ formattedDate(props.row.trn_date_end) }}
            </q-td>
          </template>
          <template v-slot:body-cell-trn_file_draft_contract="props">
            <q-td :props="props">
              <p
                @click="
                  props.row.trn_flag === '8'
                    ? download(props.row.trn_file_draft_contract)
                    : download(props.row.trn_file_draft_contract)
                "
                class="tw-font-semibold tw-text-blue-500 tw-cursor-pointer"
              >
                {{
                  new Date() >= new Date(props.row.trn_date_start) &&
                  new Date() <= new Date(props.row.trn_date_end)
                    ? "Open"
                    : "Close"
                }}
              </p>
            </q-td>
          </template>
          <template v-slot:body-cell-aksi="props">
            <q-td :props="props">
              <q-btn
                v-if="['13'].includes(props.row.trn_flag)"
                push
                color="positive"
                icon="feed"
                size="sm"
                :to="`/econtract-kontrakvendor/detail/${props.row.trn_code}`"
                ><q-tooltip class="bg-positive text-body2" :offset="[10, 10]">
                  Detail
                </q-tooltip></q-btn
              >
              <q-btn
                v-if="['8'].includes(props.row.trn_flag)"
                push
                color="info"
                icon="feed"
                size="sm"
                @click="addAplikasi(props.row.trn_code)"
                ><q-tooltip class="bg-info text-body2" :offset="[10, 10]">
                  Approve
                </q-tooltip></q-btn
              >
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <q-dialog v-model="dialogForm">
      <q-card style="width: 800px; max-width: 80vw">
        <q-card-section>
          <div class="text-h6">Approval Kontrak</div>
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 50vh" class="scroll">
          <div class="row q-col-gutter-sm">
            <div class="col-12">
              <div class="row">
                <div class="col-12" style="margin-bottom: 10px">
                  <label>Note <span style="color: red">*</span> :</label>
                  <q-input
                    v-model="tmpForm.trn_note_vendor"
                    dense
                    outlined
                    label="Note"
                    :rules="[(val) => !!val || 'Field is required']"
                    counter
                    maxlength="250"
                    rows="3"
                    type="textarea"
                  />
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-separator />
        <q-card-actions align="right">
          <q-btn
            push
            color="primary"
            v-b-tooltip.hover
            title="Cancel"
            icon="cancel"
            v-close-popup
          />
          <q-btn
            push
            color="negative"
            v-b-tooltip.hover
            title="Reject"
            icon="save"
            @click="saveAplikasi('reject')"
          />
          <q-btn
            push
            color="positive"
            v-b-tooltip.hover
            title="Save"
            icon="save"
            @click="saveAplikasi('approve')"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogVisible" persistent>
      <q-card style="width: 900px; max-width: 80vw">
        <q-card-section class="row items-center">
          <q-uploader
            accept=".xlsx"
            @added="processFile"
            label="Select the Excel file"
          />
        </q-card-section>
        <q-card-section v-if="importedData">
          <q-table
            :rows="importedData"
            row-key="index"
            :columns="columnsImport"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Import" color="primary" @click="importExcel" />
          <q-btn label="Tutup" color="warning" @click="closeDialog" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import axios from "axios";
import {
  ParseError,
  excelDownload,
  domain,
  role,
  nik,
  empid,
} from "./../../../../utils";
import { useQuasar } from "quasar";
import { api, apiEC, apiProc } from "../../../../../src/boot/axios";
import XLSX from "xlsx";

const downloadExcel = () => {
  window.location.href = "/exporttemplate/appoverpengajuan.xlsx";
};

const listType = ref([
  {
    type: "Vendor",
  },
  {
    type: "Internal",
  },
  {
    type: "All",
  },
]);

const listApprover = ref(["Pricing", "CMSS", "Approval", "SuperiorCMSS"]);
const listStatus = ref(["Aktif", "Tidak Aktif"]);
const listUrutan = ref([
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25,
]);
const listKategori = ref(["Baru", "Renewal"]);
const listKategoriLama = ref([
  "Vendor Pengadaan Barang",
  "Vendor Penyewaan",
  "Vendor Transporter",
  "Vendor Kontruksi",
  "Vendor Jasa",
]);
const listJenis = ref([
  "Perseroan Terbatas (PT)",
  "Persyaratan Vendor Persekutuan Komanditer (CV)- Persekutuan Perdata (PP)",
  "Persyaratan Vendor Perusahaan Perorangan (PO)",
]);
const listStatusCari = ref([
  { name: "Draft", val: 1 },
  { name: "Approval", val: 2 },
  { name: "Revisi Approval", val: 3 },
  { name: "Approval Procurement", val: 4 },
  { name: "Revisi Approval Procurement", val: 5 },
  { name: "Proses HDS Legal", val: 6 },
  { name: "Revisi Proses Legal", val: 7 },
  { name: "Proses Vendor", val: 8 },
  { name: "Revisi Vendor", val: 9 },
  { name: "Proses Create No. Kontrak", val: 10 },
  { name: "Proses Approval Dokument", val: 11 },
  { name: "Full Approve", val: 12 },
]);
const columnsImport = [
  {
    name: "No",
    required: true,
    label: "No",
    align: "left",
    field: "no",
    sortable: true,
  },
  {
    name: "site",
    required: true,
    label: "Site",
    align: "left",
    field: "site",
    sortable: true,
  },
  {
    name: "approver",
    required: true,
    label: "Approver Procurement",
    align: "left",
    field: "approver",
    sortable: true,
  },
  {
    name: "nik",
    required: true,
    label: "Nik",
    align: "left",
    field: "nik",
    sortable: true,
  },
  {
    name: "nama",
    required: true,
    label: "Nama",
    align: "left",
    field: "nama",
    sortable: true,
  },
  {
    name: "jabatan",
    required: true,
    label: "Jabatan",
    align: "left",
    field: "jabatan",
    sortable: true,
  },
  {
    name: "email",
    required: true,
    label: "Email",
    align: "left",
    field: "email",
    sortable: true,
  },
  {
    name: "aksi",
    required: true,
    label: "Actions",
    align: "left",
    field: "aksi",
  },
];

const columns = [
  {
    name: "aksi",
    required: true,
    label: "Actions",
    align: "left",
    field: "aksi",
  },
  {
    name: "No",
    required: true,
    label: "No",
    align: "left",
    field: "no",
    sortable: true,
  },
  {
    name: "trn_kategori",
    required: true,
    label: "Kategori",
    align: "left",
    field: "trn_kategori",
    sortable: true,
  },
  {
    name: "trn_date_start",
    required: true,
    label: "Masa Berlaku",
    align: "left",
    field: "trn_date_start",
    sortable: true,
  },
  {
    name: "trn_file_draft_contract",
    required: true,
    label: "File",
    align: "left",
    field: "trn_file_draft_contract",
    sortable: true,
  },
  {
    name: "trn_vendor_pendatangan_name",
    required: true,
    label: "Nama Pendatanganan",
    align: "left",
    field: "trn_vendor_pendatangan_name",
    sortable: true,
  },
];

const getToken = () => {
  return localStorage.getItem("tokenSelvend");
};
const token = "Bearer " + getToken();
const cardSectionStyle = () => {
  return localStorage.getItem("card");
};

const $q = useQuasar();
const listDomainAll = ref([]);
const listUserHrisAll = ref([]);
const listUserHrisAllOriginal = ref([]);
const listSiteAll = ref([]);
const listDomain = ref([]);
const listUserByNik = ref([]);
const loading = ref(false);
const dialogForm = ref(false);
const dialogVisible = ref(false);
const importedData = ref([]);
const uploadData = ref([]);
const dialogAkses = ref(false);
const listDept = ref([]);
const listDeptOriginal = ref([]);
const listVenE = ref([]);
const listVenEOriginal = ref([]);
const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10,
  filter: null,
  domain: domain(),
});
const tmpFormCari = reactive({
  id: null,
  trn_domain: domain(),
  trn_noreg: null,
  trn_kategori: null,
  trn_vendor_code: null,
  trn_jenis_vendor: null,
  trn_flag: null,
});

const tmpForm = reactive({
  id: null,
  trn_domain: domain(),
  trn_note_vendor: null,
  trn_code: null,
  status: null,
  nik: nik(),
});

const validationRules = [
  { field: "trn_domain", message: "Please select domain" },
  { field: "kelengkapan_urutan", message: "Please select urutan" },
  { field: "kelengkapan_desc", message: "Please input keterangan" },
  { field: "kelengkapan_status", message: "Please select status" },
];

const getData = async () => {
  try {
    $q.loading.show();
    const res = await apiEC.get("getKontrakUserVendor", {
      params: {
        ...pagination.value,
        nik: nik(),
        trn_domain: tmpFormCari.trn_domain,
      },
    });
    console.log("getKontrakUserVendor", res.data.data);

    listDomain.value = res.data.data;
    pagination.value.rowsNumber = res.data.pagination.total;
    $q.loading.hide();
  } catch (error) {
    $q.loading.hide();
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getListVendorEreg = async () => {
  try {
    $q.loading.show();

    // http://127.0.0.1:2240/mstVendors?page=1&rowsPerPage=10&sortBy=vend_code&descending=false&rowsNumber=0&domain=100
    const res = await apiProc.get("mstVendors");
    console.log("mstVendors", res);

    listVenE.value = res.data;
    listVenEOriginal.value = res.data;
    $q.loading.hide();
  } catch (error) {
    $q.loading.hide();
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getHakakses = async () => {
  try {
    loading.value = true;
    const res = await apiEC.get("getHakAksesApproval", {
      params: {
        hakakses_domain: domain(),
        hakakses_nik: nik(),
      },
    });
    console.log("getHakAksesApproval", res.data.data);
    let approval = res.data.data.filter(
      (item) => item.hakakses_rules === "Approval"
    );
    tmpForm.approval = approval[0].hakakses_rules;

    loading.value = false;
  } catch (error) {
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getUserPortalProc = async () => {
  try {
    loading.value = true;
    const res = await apiEC.get("getUserPortalProc", {
      params: pagination.value,
    });
    console.log("getUserPortalProc", res.data.data);

    listUserHrisAll.value = res.data.data;
    listUserHrisAllOriginal.value = [...listUserHrisAll.value];
    loading.value = false;
  } catch (error) {
    listUserHrisAll.value = null;
    listUserHrisAllOriginal.value = null;
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const DomainAllData = async () => {
  try {
    const res = await apiEC.get("getDomainAll", {
      headers: {
        Authorization: token,
      },
    });
    console.log("res.data.data=>>>>:zzzzzzzzzz", res.data.data);
    listDomainAll.value = res.data.data;
  } catch (error) {
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const UserHRISAll = async () => {
  try {
    const res = await apiEC.get("getUserApprovalHrisAll", {
      params: {
        domain: domain(),
      },
      headers: {
        Authorization: token,
      },
    });
    listUserHrisAll.value = res.data.data;
    listUserHrisAllOriginal.value = [...listUserHrisAll.value];
  } catch (error) {
    listUserHrisAll.value = null;
    listUserHrisAllOriginal.value = null;
    tmpForm.nik = null;
    tmpForm.nama = null;
    tmpForm.jabatan = null;
    tmpForm.email = null;
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getDept = async () => {
  try {
    loading.value = true;
    const res = await apiEC.get("getDept");
    console.log("getDept", res.data.data);

    listDept.value = res.data.data;
    listDeptOriginal.value = [...listDept.value];
    loading.value = false;
  } catch (error) {
    loading.value = false;
    listDept.value = null;
    listDeptOriginal.value = null;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getSiteByDomain = async () => {
  try {
    const res = await apiEC.get("getSiteByDomain", {
      params: {
        domain: domain(),
      },
      headers: {
        Authorization: token,
      },
    });
    console.log("getSiteByDomain", res.data.data);
    listSiteAll.value = res.data.data;
  } catch (error) {
    listSiteAll.value = null;
    tmpForm.site = null;
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getUserApprovalHris = async (empid) => {
  try {
    const res = await api.get("getUserApprovalHris", {
      params: {
        empid: empid,
      },
      headers: {
        Authorization: token,
      },
    });
    console.log("getUserApprovalHris", res.data.data[0].nik);
    tmpForm.nama = res.data.data[0].nama;
    tmpForm.jabatan = res.data.data[0].jabatan;
    tmpForm.email = res.data.data[0].email;
    listUserByNik.value = res.data.data;
  } catch (error) {
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const addAplikasi = async (trn_code) => {
  dialogForm.value = true;
  tmpForm.trn_code = trn_code;
};

const importData = async () => {
  dialogForm.value = true;
  reset();
};

const editAplikasi = (value) => {
  dialogForm.value = true;
  tmpForm.id = value.id;
  tmpForm.trn_domain = value.trn_domain;
  tmpForm.kelengkapan_urutan = value.kelengkapan_urutan;
  tmpForm.kelengkapan_desc = value.kelengkapan_desc;
  tmpForm.kelengkapan_status = value.kelengkapan_status;
  getSiteByDomain(value.domain);
  getUserPortalProc(value.domain);
};

const deleteAplikasi = async (value) => {
  console.log(value);
  $q.dialog({
    title: "Konfirmasi",
    message: `Are you sure you want to delete data <span class="tw-font-bold">${value.kelengkapan_urutan}</span>?`,
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
      await apiEC.post("deleteRule", value, {
        headers: {
          Authorization: token,
        },
      });
      $q.notify({
        type: "positive",
        message: `Data <span class="tw-font-bold">${value.kelengkapan_urutan}</span> deleted successfully`,
        html: true,
      });
      await getData();
    } catch (error) {
      $q.notify({
        type: "negative",
        message: ParseError(error),
      });
    }
  });
};

const saveAplikasi = async (status) => {
  try {
    if (tmpForm.trn_code == null || tmpForm.trn_code === "") {
      $q.notify({
        type: "negative",
        message: "Code is empty",
      });
      return;
    }
    if (tmpForm.trn_note_vendor == null || tmpForm.trn_note_vendor === "") {
      $q.notify({
        type: "negative",
        message: "please input note vendor",
      });
      return;
    }
    tmpForm.status = status;
    $q.loading.show();
    await apiEC.post("approveVendor", tmpForm);
    dialogForm.value = false;
    reset();
    getData();
    $q.notify({
      type: "positive",
      message: "Data saved successfully",
    });
    await onRequest({
      pagination: pagination.value,
    });
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
  tmpForm.id = null;
  tmpForm.trn_domain = domain();
  tmpForm.trn_note_vendor = null;
  tmpForm.trn_code = null;
  tmpForm.status = null;
};

const onRequest = (props) => {
  const { page, rowsPerPage, sortBy, descending, filter } = props.pagination;
  pagination.value.filter = filter;
  pagination.value.page = page;
  pagination.value.rowsPerPage = rowsPerPage;
  pagination.value.sortBy = sortBy;
  pagination.value.descending = descending;
  getData();
  getHakakses();
  // getDept();
  getSiteByDomain();
  getUserPortalProc();
  getListVendorEreg();
  // UserHRISAll();
};

onMounted(() => {
  onRequest({
    pagination: pagination.value,
  });
});

const showImportDialog = () => {
  dialogVisible.value = true;
};

const processFile = (files) => {
  const file = files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // Ambil baris header untuk mendapatkan nama kolom
    const headerRow = rawData[0];
    // Temukan indeks kolom domain dan Approver Procurement
    const domainIndex = headerRow.indexOf("Domain");
    const siteIndex = headerRow.indexOf("Site");
    const approverIndex = headerRow.indexOf("Approver");
    const nikIndex = headerRow.indexOf("Nik");
    const namaIndex = headerRow.indexOf("Nama");
    const jabatanIndex = headerRow.indexOf("Jabatan");
    const emailIndex = headerRow.indexOf("Email");

    // Filter header dari data
    const dataRows = rawData.slice(1);

    // Ubah data sesuai format yang diharapkan oleh q-table
    importedData.value = dataRows.map((row, index) => ({
      index: index + 1,
      domain: row[domainIndex],
      site: row[siteIndex],
      approver: row[approverIndex],
      nik: row[nikIndex],
      nama: row[namaIndex],
      jabatan: row[jabatanIndex],
      email: row[emailIndex],
    }));

    uploadData.value = dataRows.map((row, index) => ({
      index: index + 1,
      domain: row[domainIndex],
      site: row[siteIndex],
      approver: row[approverIndex],
      nik: row[nikIndex],
      nama: row[namaIndex],
      jabatan: row[jabatanIndex],
      email: row[emailIndex],
    }));

    columnsImport.value = [
      { name: "domain", label: "Domain", align: "left" },
      { name: "site", label: "Site", align: "left" },
      { name: "approver", label: "Approver", align: "left" },
      { name: "nik", label: "Nik", align: "left" },
      { name: "nama", label: "Nama", align: "left" },
      { name: "jabatan", label: "Jabatan", align: "left" },
      { name: "site", label: "Email", align: "left" },
    ];
  };
  reader.readAsArrayBuffer(file);
};

const formattedDate = (dateTime) => {
  const date = new Date(dateTime);
  const day = ("0" + date.getDate()).slice(-2);
  const monthIndex = date.getMonth();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear().toString();
  const hours = ("0" + date.getUTCHours()).slice(-2);
  const minutes = ("0" + date.getUTCMinutes()).slice(-2);
  const seconds = ("0" + date.getUTCSeconds()).slice(-2);
  return `${day}/${month}/${year}`;
};

const closeDialog = () => {
  dialogVisible.value = false;
  importedData.value = [];
};

const importExcel = async () => {
  console.log(uploadData._rawValue);
  try {
    if (
      uploadData._rawValue === "" ||
      uploadData._rawValue === null ||
      uploadData._rawValue.length < 1
    ) {
      $q.notify({
        type: "negative",
        message: "Please upload excel",
      });
    } else {
      $q.loading.show();
      await apiEC.post("saveApproverPengajuanExcel", uploadData._rawValue, {
        headers: {
          Authorization: token,
        },
      });
      dialogVisible.value = false;
      reset();
      $q.notify({
        type: "positive",
        message: "Import successfully",
      });
      await onRequest({
        pagination: pagination.value,
      });
      $q.loading.hide();
    }
  } catch (error) {
    $q.loading.hide();
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const handleSelect = async (selectedOption) => {
  console.log("Selected option:", selectedOption);
  getSiteByDomain(selectedOption);
  UserHRISAll(selectedOption);
};

const handleSelectUser = async (selectedOption) => {
  console.log("Selected handleSelectUser:", selectedOption);
  const data = listUserHrisAll._rawValue.find(
    (item) => item.nik === selectedOption
  );
  console.log(data);
  tmpForm.hakakses_nama = data.nama;
};

document.addEventListener("etrasn_setdomain", () => {
  pagination.value.domain = domain();
  tmpFormCari.trn_domain = domain();
  getData();
});

const updateTable = async () => {
  onRequest({
    pagination: pagination.value,
  });
};
const handleSelectForm = async (selectedOption) => {
  getData();
};
const handleSelectDept = async (selectedOption) => {
  const data = listDept._rawValue.find(
    (item) => item.DepartmentCode === selectedOption
  );
  tmpForm.deptName = data.DepartmentName;
};

const filterFnVendor = (val, update) => {
  if (val === "") {
    update(() => {
      listVenEOriginal.value = [...listVenE.value];
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    listVenEOriginal.value = listVenE.value.filter((option) => {
      return option.sup_name.toLowerCase().includes(needle);
    });
  });
};

const filterFn = (val, update) => {
  if (val === "") {
    update(() => {
      listDeptOriginal.value = [...listDept.value];
    });
    return;
  }
  console.log("=======>", update);

  update(() => {
    const needle = val.toLowerCase();
    listDeptOriginal.value = listDept.value.filter((option) => {
      return option.DepartmentName.toLowerCase().includes(needle);
    });
  });
};

const download = async (value) => {
  $q.loading.show();
  let res = await apiEC.get("downloadKontakLampiran", {
    params: {
      file: value,
    },
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", value);
  document.body.appendChild(link);
  link.click();
  $q.loading.hide();
};
</script>
