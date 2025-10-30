<template>
<!-- dialogDetailForm -->
    <q-dialog
      v-model="propsDetail.dialog"
      persistent
      :maximized="false"
      transition-show="slide-up"
      transition-hide="slide-down"
      full-width
      full-height
    >
     <q-card>
         <q-card-section :class="`row items-center q-pb-none bg-primary tw-text-white tw-top-0`">
          <div class="text-h6">{{isCreate?'Checklist':isUpdate?'Checklist':'View Checklist'}}</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="close" />
        </q-card-section>
        <q-separator></q-separator>
        <q-card-section> 
            <div class="tw-bg-emerald-200 tw-text-slate-800 py-4 tw-border tw-rounded-md">
                <div class="tw-container tw-mx-auto">
                    <p class="tw-text-lg tw-font-bold tw-px-4">Info</p>
                    <p class="tw-text-sm tw-px-4">1. Gunakan save secara berkala untuk menghindari data tidak tersimpan sempurna</p>
                    <p class="tw-text-sm tw-px-4">2. Double klik pada table untuk melakukan input</p>
                    <p class="tw-text-sm tw-px-4">3. Klik pada judul table kolom <b>Check</b> untuk melakukan <b>check all</b></p>
                </div>
            </div>
            <Form 
            :validation-schema="isCreate||isUpdate?schema:''"
            @submit="onSubmit"
            class="q-mt-md">
                <div class="row q-col-gutter-sm tw-px-3 tw-pb-3">
                    <div class="col-6">
                          
                        <p class="tw-text-xs tw-font-semibold">Logo Vendor
                            <q-btn
                                dense color="light-blue-9"
                                class="text-weight-regular text-caption tw-mr-1"
                                @click="viewImage(tmpForm.filesdb)"
                                push icon="visibility">
                                <q-tooltip :class="'tw-bg-black/90'">
                                    view
                                </q-tooltip>
                            </q-btn>
                        </p>
                    </div>
                    <div class="col-6">
                    </div>
                    <div class="col-6">
                        <Field v-model="tmpForm.project" name="project" v-slot="{ errorMessage, value, field }">
                            <q-input dense outlined label="Project *" :model-value="value" v-bind="field" :readonly="true"
                                :error-message="errorMessage" :error="!!errorMessage" />
                        </Field>
                    </div>
                    <div class="col-6"></div>
                    <div class="col-6">
                        <Field v-model="tmpForm.lokasi" name="lokasi" v-slot="{ errorMessage, value, field }">
                        <q-input dense outlined label="Area" :model-value="value" v-bind="field" 
                         :readonly="true"/>
                        </Field>
                    </div>
                    <div class="col-6"></div>
                    <div class="col-6">
                        <Field v-model="tmpForm.name_tnd" name="name_tnd" v-slot="{ errorMessage, value, field }">
                        <q-input dense outlined label="PIC TND" :model-value="value" v-bind="field" 
                         :readonly="true"/>
                        </Field>
                    </div>
                    <div class="col-6"></div>
                </div>
                <div class="row q-col-gutter-sm tw-px-3 tw-pb-3">
                        <div class="col-12">
                            <table>
                                <thead>
                                    <tr class="tw-text-slate-700 tw-text-xs">
                                        <th class="tw-bg-gray-200 tw-border tw-border-neutral-50 tw-py-2 tw-px-3 tw-text-center tw-w-[50px]">
                                            No
                                        </th>
                                        <th class="tw-bg-gray-200 tw-border tw-border-neutral-50 tw-py-2 tw-px-3 tw-text-center tw-w-[400px]">
                                            Item Check
                                        </th>
                                        <th class="tw-bg-gray-200 tw-border tw-border-neutral-50 tw-py-2 tw-px-3 tw-text-center tw-w-[200px]">
                                            Tanggal Check
                                        </th>
                                        <th class="tw-bg-gray-200 tw-border tw-border-neutral-50 tw-py-2 tw-px-3 tw-text-center tw-w-[400px]">
                                            Keterangan Before
                                        </th>
                                        <th class="tw-bg-gray-200 tw-border tw-border-neutral-50 tw-py-2 tw-px-3 tw-text-center">
                                            Before
                                        </th>
                                        <th class="tw-bg-gray-200 tw-border tw-border-neutral-50 tw-py-2 tw-px-3 tw-text-center tw-w-[400px]">
                                            Keterangan After
                                        </th>
                                        <th class="tw-bg-gray-200 tw-border tw-border-neutral-50 tw-py-2 tw-px-3 tw-text-center tw-w-[400px]">
                                            After
                                        </th>
                                        <th class="tw-bg-gray-200 tw-border tw-border-neutral-50 tw-py-2 tw-px-3 tw-text-center"
                                        @click="checkAll">
                                            Check
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(el,index) in listChecklist">
                                        <td class="tw-text-xs tw-font-semibold tw-border tw-border-neutral-200 tw-p-2" align="right">
                                            {{index+1}}
                                        </td>
                                        <td class="tw-text-xs tw-font-semibold tw-border tw-border-neutral-200 tw-p-2">
                                            {{el.item_check}}
                                        </td>
                                        <td class="tw-text-xs tw-font-semibold tw-border tw-border-neutral-200 tw-p-2">
                                            {{el.tanggal}}
                                        </td>
                                        <td class="tw-text-xs tw-font-semibold tw-border tw-border-neutral-200 tw-p-2">
                                            {{el.keterangan}}
                                        </td>
                                        <td class="tw-text-xs tw-font-semibold tw-border tw-border-neutral-200 tw-p-2">
                                            <q-btn
                                                dense color="light-blue-9"
                                                class="text-weight-regular text-caption tw-mr-1"
                                                @click="viewImage(el.before)"
                                                push icon="visibility"
                                                >
                                                <q-tooltip :class="'tw-bg-black/90'">
                                                    view
                                                </q-tooltip>
                                            </q-btn>
                                        </td>
                                        <td class="tw-text-xs tw-font-semibold tw-border tw-border-neutral-200 tw-p-2"
                                        v-if="!editingCell || editingCell.row !== index || editingCell.column !== 1"
                                        @dblclick="startEditing(index, 1)">
                                            {{el.keterangan_after}}
                                        </td>
                                        <td class="tw-text-xs tw-font-semibold tw-border tw-border-neutral-200 tw-p-2"
                                        v-else
                                        @blur="stopEditing(index, 1)"
                                        @keyup.enter="stopEditing(index, 1)"
                                        >
                                        <q-input dense outlined v-model="el.keterangan_after"/>
                                        </td>
                                        <td class="tw-text-xs tw-font-semibold tw-border tw-border-neutral-200 tw-p-2"
                                        v-if="!editingCell || editingCell.row !== index || editingCell.column !== 2"
                                        @dblclick="isCreate||isUpdate?startEditing(index, 2):''">
                                        <q-btn  v-if="el.after_db!=null"
                                                dense color="light-blue-9"
                                                class="text-weight-regular text-caption tw-mr-1"
                                                @click="viewImage(el.after_db)"
                                                push icon="visibility"
                                                >
                                                <q-tooltip :class="'tw-bg-black/90'">
                                                    view
                                                </q-tooltip>
                                            </q-btn>
                                            {{el.after != null?el.after.name:el.after_db==null?'':el.after_db}}
                                        </td>
                                        <td class="tw-text-xs tw-font-semibold tw-border tw-border-neutral-200 tw-p-2"
                                        v-else
                                        @blur="stopEditing(index, 2)"
                                        @keyup.enter="stopEditing(index, 2)"
                                        >
                                            <q-file v-model="el.after" 
                                                outlined dense 
                                                :accept="`image/*`"
                                                max-file-size="1048576"
                                                @rejected="onRejected"
                                                label="Select Image (Max 1MB)">
                                                    <template v-slot:prepend>
                                                        <q-icon name="cloud_upload" />
                                                    </template>
                                            </q-file>
                                        </td>
                                        <td class="tw-text-xs tw-font-semibold tw-border tw-border-neutral-200 tw-p-2">
                                            <q-checkbox 
                                                dense outlined
                                                v-model="el.check.selected" >
                                            </q-checkbox>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="row q-col-gutter-sm tw-px-3 tw-pb-3">
                        <div class="col-12">
                            <div class="q-pa-md q-gutter-sm" align="right">
                                    <q-btn  label="Back" color="red-7" @click="close" />
                                    <q-btn v-if="isCreate||isUpdate" label="Save" color="blue-6"  type="submit" />
                            </div>
                        </div>
                    </div>
                </Form>
               
        </q-card-section> 
      </q-card>

      <!-- dialog image datatable -->
        <q-dialog v-model="dialogImage">
        <q-card>
            <q-card-section>
                <div class="row q-col-gutter-sm">
                    <div class="col-12">
                            <q-img
                                :src="imageSrc"
                                width="400px"
                                heigth="400px"
                            />
                    </div>
                </div>
            </q-card-section>
            </q-card>
        </q-dialog>
        <!-- dialog image datatable end -->
    </q-dialog>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import axios from "axios";
import { ParseError, excelDownload,suppCode } from "./../../utils";
import { useQuasar,date,Loading,QSpinnerCube,QSpinnerDots} from "quasar";
import dayjs from 'dayjs';
import { Field, Form } from "vee-validate";
import * as yup from "yup";
//import TemplateTimeline from "./../../components/tnd/TemplateTimeline.vue";

const schema = yup.object({
    project:    yup.string()
                .required("Project wajib diisi").label('project'),
});

const $q = useQuasar();
const propsDetail = defineProps(['dialog', 'data'])
const emit = defineEmits(['close', 'setData'])
const loadingDetail = ref(false);
const isUpdate = ref(false);
const isCreate = ref(false);
const isApprove = ref(false);
const isClose = ref(false);
const isView = ref(false);
const dialogImage = ref (false);
const checkStatus = ref (false);
const listChecklist = ref([]);
const editingCell = ref (null);
const imageSrc = ref(null);

const tmpForm = reactive({
  id: null,
  nodoc: null,
  domain:null,
  status:null,
  project:null,
  tanggal:null,
  vendor:null,
  vendor_name:null,
  lokasi:null,
  pic_tnd:null,
  name_tnd:null,
  creator:suppCode(),
  empid:suppCode(),
  reason:null,
  filesupload:null,
  filesdb:null,
  status:null,
  jenis: 'Berita Acara',
  update:false,
  key:null,
});

const generateVar = async () => {
    //console.log(propsDetail.data);
    isUpdate.value = propsDetail.data.update;
    isCreate.value = propsDetail.data.add;
    isView.value = propsDetail.data.view;
    isApprove.value = propsDetail.data.approve;
    isClose.value = propsDetail.data.close;
    tmpForm.id = propsDetail.data.id;
    tmpForm.nodoc = propsDetail.data.nodoc;
    if (tmpForm.id != null){
        tmpForm.key = propsDetail.data.key;
        await getBAChecklist();
    }
}

const getBAChecklist = async () => {
  try {
    Loading.show({
        spinner: QSpinnerCube,
        color:"primary"
        // other props
    });

    const res = await axios.get(`${import.meta.env.VITE_TND}tnd_single_ba_checklist`,{
    params: {
        id:tmpForm.id,
        key:tmpForm.key,
        }
    });
    tmpForm.status = res.data.header.tch_status; 
    tmpForm.nodoc = res.data.header.tch_nodoc;
    tmpForm.domain = res.data.header.tch_domain;
    tmpForm.creator = res.data.header.created_by;
    tmpForm.pic_tnd = res.data.header.tch_pic_tnd;
    tmpForm.name_tnd = res.data.header.tnd;
    tmpForm.vendor = res.data.header.tch_pic_vend;
    tmpForm.vendor_name = res.data.header.tch_vend_name;
    tmpForm.filesdb = res.data.header.tch_vend_logo;
    tmpForm.project = res.data.header.tch_project;
    tmpForm.lokasi = res.data.header.tma_code;
    listChecklist.value = [];
    await res.data.detail.forEach((el,index) => {
         listChecklist.value.push({
            nomor:index,
            real_nomor:el.tcd_id,
            item_check:el.tcd_item_check,
            tanggal:dayjs(el.tcd_tanggal_check).format('DD-MM-YYYY'),
            keterangan:el.tcd_ket_before,
            before:el.tcd_img_before,
            keterangan_after:el.tcd_ket_after,
            keterangan_after_db:el.tcd_ket_after,
            keterangan_update:false,
            after:null,
            after_db:el.tcd_img_after,
            after_update:false,
            check:{selected:el.tcd_vend_check==1?true:false,label:el.tcd_id},
         })
     });
     editingCell.value = null;
     Loading.hide();
  } catch (error) {
    Loading.hide();
    console.log(error);
    /* $q.notify({
      type: "negative",
      message: ParseError(error),
    }); */
  } 
};

const onSubmit = async () => {
  try {
    let counter = 0;
     for(let i = 0; i < listChecklist.value.length;i++){
         if (listChecklist.value[i].keterangan_after == '' || listChecklist.value[i].keterangan_after == null){
            $q.notify({
            type: "negative",
            message: 'Keterangan After wajib diisi',
            });
            break;
         }

         if (listChecklist.value[i].after == null&&listChecklist.value[i].after_db == null){
            $q.notify({
            type: "negative",
            message: 'Gambar wajib dilampirkan',
            });
            break;
         }

         if (listChecklist.value[i].check.selected == false){
            $q.notify({
            type: "negative",
            message: 'Check semua list pada table',
            });
            break;
         }
         counter += 1;

     }
     if (counter == listChecklist.value.length)
        await saveDetail();
  } catch (error) {
    console.log(error);
    Loading.hide();
    $q.notify({
      type: "negative",
      message: ParseError(error),
    }); 
    //if (isClose.value) close();
  }
};

const saveDetail = async () => {
  try {
    Loading.show({
        spinner: QSpinnerCube,
        color:"primary"
        // other props
    }); 
    if (listChecklist.value.length > 0){
        for(let i = 0; i < listChecklist.value.length;i++){
                      
            if (listChecklist.value[i].keterangan_after != listChecklist.value[i].keterangan_after_db)
                listChecklist.value[i].keterangan_update = true;
               
            if (listChecklist.value[i].after != null)
                listChecklist.value[i].after_update = true;
               
          
            if(listChecklist.value[i].keterangan_update == false && listChecklist.value[i].after_update == false){
                    continue;
            }
                
          
            let formData = new FormData();
            formData.append('id', tmpForm.id);
            formData.append('domain', tmpForm.domain);
            formData.append('nomor', listChecklist.value[i].nomor);
            formData.append('real_nomor', listChecklist.value[i].real_nomor);
            formData.append('keterangan', listChecklist.value[i].keterangan_after);
            formData.append('filesupload', listChecklist.value[i].after);
            formData.append('creator', tmpForm.creator);
            formData.append('empid', tmpForm.empid);

            const res = await axios.post(`${import.meta.env.VITE_TND}tnd_ba_checklist_vendor_detail`, formData,
            {   headers: {
                "Content-Type": "multipart/form-data"
                    }
            }); 
        }
    }
    Loading.hide();
    $q.notify({
        type: "positive",
        message: "Data berhasil disimpan",
    });
    await getBAChecklist();
  } catch (error) {
    Loading.hide();
    console.log(error);
    /* $q.notify({
      type: "negative",
      message: ParseError(error),
    }); */
  }
};

const onRejected = async (index) => {
    $q.notify({
          type: 'negative',
          message: `File tidak sesuai`
    });
}

const checkAll = async () => {
    if (checkStatus.value == false) checkStatus.value = true;
    else checkStatus.value = false;
    
    await listChecklist.value.forEach((el,index) => {
         el.check.selected = checkStatus.value;
    });
}

const startEditing = (row, column) => {
    editingCell.value = { row:row, column:column };
}

const stopEditing = (row, column) => {
   editingCell.value = null;
}

const deleteData = async (row) => {
    if (listChecklist.value[row].real_nomor !=null){
        Loading.show({
        spinner: QSpinnerCube,
        color:"primary"
        // other props
        });
        let sendData= {
            real_nomor:listChecklist.value[row].real_nomor,
        };
        const res = await axios.post(`${import.meta.env.VITE_API}tnd_del_detail_ba_checklist`, sendData);
        listChecklist.value.splice(row,1);
        Loading.hide();
    }else{
        listChecklist.value.splice(row,1);
    }
    
}

const close = () => {
  emit('close')
}

const redirect = (data) => {
  window.open(`${import.meta.env.VITE_FTP_TND}${data}`, '_blank', 'noreferrer');
};

const viewImage = (data) => {
  imageSrc.value = `${import.meta.env.VITE_FTP_TND}${data}`;
  dialogImage.value = true;
};

generateVar();

</script>
