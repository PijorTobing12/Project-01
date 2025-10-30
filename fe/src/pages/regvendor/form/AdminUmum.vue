<template>
    <q-page class="q-pa-lg">
        <q-card class="my-card">
            <div class="q-gutter-y-md">
                <q-card class="tw-p-4">
                    <div class="q-mx-xs q-mt-sm q-mb-lg">
                        <!-- <divider title="FORM KELENGKAPAN ADMINISTRASI UMUM" /> -->
                        <span class="text-indigo-10 tw-text-xl text-bold">FORM KELENGKAPAN ADMINISTRASI UMUM</span>
                    </div>

                    <Form @submit="onSubmit">
                        <div class="row q-col-gutter-md q-px-sm q-mb-md">
                            <div class="col-12 col-md-3">                        
                                <p class="">Akte Pendirian Perusahaan + SK Kemenkumham</p>
                            </div>
                            <div class="col-12 col-md-3">
                                <q-input dense outlined v-model="tmpData.nodok_1" name="nodok_1" label="Nomor Dokumen" maxlength="50" autocomplete="off" color="blue" :model-value="tmpData.nodok_1" />
                            </div>
                            <div class="col-12 col-md-2">
                                <q-input
                                    v-model="tmpData.tglkeluar_1"
                                    name="tglkeluar_1"
                                    dense
                                    outlined
                                    autocomplete="off" 
                                    color="blue"
                                    label="Tgl. Dikeluarkan"
                                    mask="##/##/####"
                                    fill-mask="-"
                                    :model-value="tmpData.tglkeluar_1"
                                >
                                    <template v-slot:append>
                                        <q-icon name="event" class="cursor-pointer">
                                            <q-popup-proxy ref="datePopup" cover transition-show="scale" transition-hide="scale">
                                                <q-date v-model="tmpData.tglkeluar_1" mask="DD/MM/YYYY" color="blue" :model-value="tmpData.tglkeluar_1" @update:model-value="hideDate" />
                                            </q-popup-proxy>
                                        </q-icon>
                                    </template>
                                </q-input>
                            </div>
                            <div class="col-12 col-md-2">
                                <q-input
                                    v-model="tmpData.tglakhir_1"
                                    name="tglakhir_1"
                                    dense
                                    outlined
                                    autocomplete="off" 
                                    color="blue"
                                    label="Tgl. Berakhir"
                                    mask="##/##/####"
                                    fill-mask="-"
                                    :model-value="tmpData.tglakhir_1"
                                >
                                    <template v-slot:append>
                                        <q-icon name="event" class="cursor-pointer">
                                            <q-popup-proxy ref="datePopup" cover transition-show="scale" transition-hide="scale">
                                                <q-date v-model="tmpData.tglakhir_1" mask="DD/MM/YYYY" color="blue" :model-value="tmpData.tglakhir_1" @update:model-value="hideDate" />
                                            </q-popup-proxy>
                                        </q-icon>
                                    </template>
                                </q-input>
                            </div>
                            <div class="col-12 col-md-2">
                                <q-file outlined dense bottom-slots v-model="tmpData.file_1" label="Upload File" :max-file-size="10000000" accept=".pdf" color="blue" :model-value="tmpData.file_1" @rejected="rejectFile" counter>
                                    <template v-slot:prepend>
                                        <q-icon name="cloud_upload" @click.stop />
                                    </template>
                                    <template v-slot:append>
                                        <q-icon name="close" @click.stop="model = null" class="cursor-pointer" />
                                    </template>
                                    <template v-slot:hint> Field hint </template>
                                </q-file>
                            </div>
                            <div class="col-12 col-md-3"></div>
                            <div class="col-12 col-md-9">                        
                                <div v-if="tmpData.file_1_view != ''">
                                    <p class="">File : <a :href="`${ftp_link}`+tmpData.file_1_view" v-if="tmpData.file_1_view != null" class="tw-text-xs text-italic text-light-blue-10" target="_blank">{{ tmpData.file_1_view }}</a></p>
                                </div>
                            </div>
                        </div>
                        <q-separator />
                        <div class="row q-col-gutter-md q-px-sm q-mt-sm q-mb-md">
                            <div class="col-12 col-md-3">                        
                                <p class="">Akte Perubahan Terakhir + SK Kemenkumham</p>
                            </div>
                            <div class="col-12 col-md-3">
                                <q-input dense outlined v-model="tmpData.nodok_2" name="nodok_2" label="Nomor Dokumen" maxlength="50" autocomplete="off" color="blue" :model-value="tmpData.nodok_2" />
                            </div>
                            <div class="col-12 col-md-2">
                                <q-input
                                    v-model="tmpData.tglkeluar_2"
                                    name="tglkeluar_2"
                                    dense
                                    outlined
                                    autocomplete="off" 
                                    color="blue"
                                    label="Tgl. Dikeluarkan"
                                    mask="##/##/####"
                                    fill-mask="-"
                                    :model-value="tmpData.tglkeluar_2"
                                >
                                    <template v-slot:append>
                                        <q-icon name="event" class="cursor-pointer">
                                            <q-popup-proxy ref="datePopup" cover transition-show="scale" transition-hide="scale">
                                                <q-date v-model="tmpData.tglkeluar_2" mask="DD/MM/YYYY" color="blue" :model-value="tmpData.tglkeluar_2" @update:model-value="hideDate" />
                                            </q-popup-proxy>
                                        </q-icon>
                                    </template>
                                </q-input>
                            </div>
                            <div class="col-12 col-md-2">
                                <q-input
                                    v-model="tmpData.tglakhir_2"
                                    name="tglakhir_2"
                                    dense
                                    outlined
                                    autocomplete="off" 
                                    color="blue"
                                    label="Tgl. Berakhir"
                                    mask="##/##/####"
                                    fill-mask="-"
                                    :model-value="tmpData.tglakhir_2"
                                >
                                    <template v-slot:append>
                                        <q-icon name="event" class="cursor-pointer">
                                            <q-popup-proxy ref="datePopup" cover transition-show="scale" transition-hide="scale">
                                                <q-date v-model="tmpData.tglakhir_2" mask="DD/MM/YYYY" color="blue" :model-value="tmpData.tglakhir_2" @update:model-value="hideDate" />
                                            </q-popup-proxy>
                                        </q-icon>
                                    </template>
                                </q-input>
                            </div>
                            <div class="col-12 col-md-2">
                                <q-file outlined dense bottom-slots v-model="tmpData.file_2" label="Upload File" :max-file-size="10000000" accept=".pdf" color="blue" :model-value="tmpData.file_2" @rejected="rejectFile" counter>
                                    <template v-slot:prepend>
                                        <q-icon name="cloud_upload" @click.stop />
                                    </template>
                                    <template v-slot:append>
                                        <q-icon name="close" @click.stop="model = null" class="cursor-pointer" />
                                    </template>
                                    <template v-slot:hint> Field hint </template>
                                </q-file>
                            </div>
                            <div class="col-12 col-md-3"></div>
                            <div class="col-12 col-md-9">                        
                                <div v-if="tmpData.file_2_view != ''">
                                    <p class="">File : <a :href="`${ftp_link}`+tmpData.file_2_view" v-if="tmpData.file_2_view != null" class="tw-text-xs text-italic text-light-blue-10" target="_blank">{{ tmpData.file_2_view }}</a></p>
                                </div>
                            </div>
                        </div>
                        <q-separator />
                        <div class="row q-col-gutter-md q-px-sm q-mt-sm q-mb-md">
                            <div class="col-12 col-md-3">                        
                                <p class="">Izin Usaha (Sesuai NIB)</p>
                            </div>
                            <div class="col-12 col-md-3">
                                <q-input dense outlined v-model="tmpData.nodok_3" name="nodok_3" label="Nomor Dokumen" maxlength="50" autocomplete="off" color="blue" :model-value="tmpData.nodok_3" />
                            </div>
                            <div class="col-12 col-md-2">
                                <q-input
                                    v-model="tmpData.tglkeluar_3"
                                    name="tglkeluar_3"
                                    dense
                                    outlined
                                    autocomplete="off" 
                                    color="blue"
                                    label="Tgl. Dikeluarkan"
                                    mask="##/##/####"
                                    fill-mask="-"
                                    :model-value="tmpData.tglkeluar_3"
                                >
                                    <template v-slot:append>
                                        <q-icon name="event" class="cursor-pointer">
                                            <q-popup-proxy ref="datePopup" cover transition-show="scale" transition-hide="scale">
                                                <q-date v-model="tmpData.tglkeluar_3" mask="DD/MM/YYYY" color="blue" :model-value="tmpData.tglkeluar_3" @update:model-value="hideDate" />
                                            </q-popup-proxy>
                                        </q-icon>
                                    </template>
                                </q-input>
                            </div>
                            <div class="col-12 col-md-2">
                                <q-input
                                    v-model="tmpData.tglakhir_3"
                                    name="tglakhir_3"
                                    dense
                                    outlined
                                    autocomplete="off" 
                                    color="blue"
                                    label="Tgl. Berakhir"
                                    mask="##/##/####"
                                    fill-mask="-"
                                    :model-value="tmpData.tglakhir_3"
                                >
                                    <template v-slot:append>
                                        <q-icon name="event" class="cursor-pointer">
                                            <q-popup-proxy ref="datePopup" cover transition-show="scale" transition-hide="scale">
                                                <q-date v-model="tmpData.tglakhir_3" mask="DD/MM/YYYY" color="blue" :model-value="tmpData.tglakhir_3" @update:model-value="hideDate" />
                                            </q-popup-proxy>
                                        </q-icon>
                                    </template>
                                </q-input>
                            </div>
                            <div class="col-12 col-md-2">
                                <q-file outlined dense bottom-slots v-model="tmpData.file_3" label="Upload File" :max-file-size="10000000" accept=".pdf" color="blue" :model-value="tmpData.file_3" @rejected="rejectFile" counter>
                                    <template v-slot:prepend>
                                        <q-icon name="cloud_upload" @click.stop />
                                    </template>
                                    <template v-slot:append>
                                        <q-icon name="close" @click.stop="model = null" class="cursor-pointer" />
                                    </template>
                                    <template v-slot:hint> Field hint </template>
                                </q-file>
                            </div>
                            <div class="col-12 col-md-3"></div>
                            <div class="col-12 col-md-9">                        
                                <div v-if="tmpData.file_3_view != ''">
                                    <p class="">File : <a :href="`${ftp_link}`+tmpData.file_3_view" v-if="tmpData.file_3_view != null" class="tw-text-xs text-italic text-light-blue-10" target="_blank">{{ tmpData.file_3_view }}</a></p>
                                </div>
                            </div>
                        </div>
                        <q-separator />
                        <div class="row q-col-gutter-md q-px-sm q-mt-sm q-mb-md">
                            <div class="col-12 col-md-3">                        
                                <p class="">NIB Berbasis Resiko</p>
                            </div>
                            <div class="col-12 col-md-3">
                                <q-input dense outlined v-model="tmpData.nodok_4" name="nodok_4" label="Nomor Dokumen" maxlength="50" autocomplete="off" color="blue" :model-value="tmpData.nodok_4" />
                            </div>
                            <div class="col-12 col-md-2">
                                <q-input
                                    v-model="tmpData.tglkeluar_4"
                                    name="tglkeluar_4"
                                    dense
                                    outlined
                                    autocomplete="off" 
                                    color="blue"
                                    label="Tgl. Dikeluarkan"
                                    mask="##/##/####"
                                    fill-mask="-"
                                    :model-value="tmpData.tglkeluar_4"
                                >
                                    <template v-slot:append>
                                        <q-icon name="event" class="cursor-pointer">
                                            <q-popup-proxy ref="datePopup" cover transition-show="scale" transition-hide="scale">
                                                <q-date v-model="tmpData.tglkeluar_4" mask="DD/MM/YYYY" color="blue" :model-value="tmpData.tglkeluar_4" @update:model-value="hideDate" />
                                            </q-popup-proxy>
                                        </q-icon>
                                    </template>
                                </q-input>
                            </div>
                            <div class="col-12 col-md-2">
                                <q-input
                                    v-model="tmpData.tglakhir_4"
                                    name="tglakhir_4"
                                    dense
                                    outlined
                                    autocomplete="off" 
                                    color="blue"
                                    label="Tgl. Berakhir"
                                    mask="##/##/####"
                                    fill-mask="-"
                                    :model-value="tmpData.tglakhir_4"
                                >
                                    <template v-slot:append>
                                        <q-icon name="event" class="cursor-pointer">
                                            <q-popup-proxy ref="datePopup" cover transition-show="scale" transition-hide="scale">
                                                <q-date v-model="tmpData.tglakhir_4" mask="DD/MM/YYYY" color="blue" :model-value="tmpData.tglakhir_4" @update:model-value="hideDate" />
                                            </q-popup-proxy>
                                        </q-icon>
                                    </template>
                                </q-input>
                            </div>
                            <div class="col-12 col-md-2">
                                <q-file outlined dense bottom-slots v-model="tmpData.file_4" label="Upload File" :max-file-size="10000000" accept=".pdf" color="blue" :model-value="tmpData.file_4" @rejected="rejectFile" counter>
                                    <template v-slot:prepend>
                                        <q-icon name="cloud_upload" @click.stop />
                                    </template>
                                    <template v-slot:append>
                                        <q-icon name="close" @click.stop="model = null" class="cursor-pointer" />
                                    </template>
                                    <template v-slot:hint> Field hint </template>
                                </q-file>
                                <!-- <div class="text-center q-pt-sm">
                                    <a :href="`${ftp_link}`+tmpData.file_4_view" v-if="tmpData.file_4_view != null" class="tw-text-xs text-light-blue-10" target="_blank">{{ tmpData.file_4_view }}</a>
                                </div> -->
                            </div>
                            <div class="col-12 col-md-3"></div>
                            <div class="col-12 col-md-9">                        
                                <div v-if="tmpData.file_4_view != ''">
                                    <p class="">File : <a :href="`${ftp_link}`+tmpData.file_4_view" v-if="tmpData.file_4_view != null" class="tw-text-xs text-italic text-light-blue-10" target="_blank">{{ tmpData.file_4_view }}</a></p>
                                </div>
                            </div>
                        </div>
                        <q-separator />
                        <div class="row q-col-gutter-md q-px-sm q-mt-sm q-mb-md">
                            <div class="col-12 col-md-3">                        
                                <p class="">Sertifikat Standard (Sesuai NIB)</p>
                            </div>
                            <div class="col-12 col-md-3">
                                <q-input dense outlined v-model="tmpData.nodok_5" name="nodok_5" label="Nomor Dokumen" maxlength="50" autocomplete="off" color="blue" :model-value="tmpData.nodok_5" />
                            </div>
                            <div class="col-12 col-md-2">
                                <q-input
                                    v-model="tmpData.tglkeluar_5"
                                    name="tglkeluar_5"
                                    dense
                                    outlined
                                    autocomplete="off" 
                                    color="blue"
                                    label="Tgl. Dikeluarkan"
                                    mask="##/##/####"
                                    fill-mask="-"
                                    :model-value="tmpData.tglkeluar_5"
                                >
                                    <template v-slot:append>
                                        <q-icon name="event" class="cursor-pointer">
                                            <q-popup-proxy ref="datePopup" cover transition-show="scale" transition-hide="scale">
                                                <q-date v-model="tmpData.tglkeluar_5" mask="DD/MM/YYYY" color="blue" :model-value="tmpData.tglkeluar_5" @update:model-value="hideDate" />
                                            </q-popup-proxy>
                                        </q-icon>
                                    </template>
                                </q-input>
                            </div>
                            <div class="col-12 col-md-2">
                                <q-input
                                    v-model="tmpData.tglakhir_5"
                                    name="tglakhir_5"
                                    dense
                                    outlined
                                    autocomplete="off" 
                                    color="blue"
                                    label="Tgl. Berakhir"
                                    mask="##/##/####"
                                    fill-mask="-"
                                    :model-value="tmpData.tglakhir_5"
                                >
                                    <template v-slot:append>
                                        <q-icon name="event" class="cursor-pointer">
                                            <q-popup-proxy ref="datePopup" cover transition-show="scale" transition-hide="scale">
                                                <q-date v-model="tmpData.tglakhir_5" mask="DD/MM/YYYY" color="blue" :model-value="tmpData.tglakhir_5" @update:model-value="hideDate" />
                                            </q-popup-proxy>
                                        </q-icon>
                                    </template>
                                </q-input>
                            </div>
                            <div class="col-12 col-md-2">
                                <q-file outlined dense bottom-slots v-model="tmpData.file_5" label="Upload File" :max-file-size="10000000" accept=".pdf" color="blue" :model-value="tmpData.file_5" @rejected="rejectFile" counter>
                                    <template v-slot:prepend>
                                        <q-icon name="cloud_upload" @click.stop />
                                    </template>
                                    <template v-slot:append>
                                        <q-icon name="close" @click.stop="model = null" class="cursor-pointer" />
                                    </template>
                                    <template v-slot:hint> Field hint </template>
                                </q-file>
                                <!-- <div class="text-center q-pt-sm">
                                    <a :href="`${ftp_link}`+tmpData.file_5_view" v-if="tmpData.file_5_view != null" class="tw-text-xs text-light-blue-10" target="_blank">{{ tmpData.file_5_view }}</a>
                                </div> -->
                            </div>
                            <div class="col-12 col-md-3"></div>
                            <div class="col-12 col-md-9">                        
                                <div v-if="tmpData.file_5_view != ''">
                                    <p class="">File : <a :href="`${ftp_link}`+tmpData.file_5_view" v-if="tmpData.file_5_view != null" class="tw-text-xs text-italic text-light-blue-10" target="_blank">{{ tmpData.file_5_view }}</a></p>
                                </div>
                            </div>
                        </div>
                        <q-separator />
                        <div class="row q-col-gutter-md q-px-sm q-mt-sm q-mb-md">
                            <div class="col-12 col-md-3">                        
                                <p class="">Surat Keterangan Domisili Perusahaan (SKDP)</p>
                            </div>
                            <div class="col-12 col-md-3">
                                <q-input dense outlined v-model="tmpData.nodok_6" name="nodok_6" label="Nomor Dokumen" maxlength="50" autocomplete="off" color="blue" :model-value="tmpData.nodok_6" />
                            </div>
                            <div class="col-12 col-md-2">
                                <q-input
                                    v-model="tmpData.tglkeluar_6"
                                    name="tglkeluar_6"
                                    dense
                                    outlined
                                    autocomplete="off" 
                                    color="blue"
                                    label="Tgl. Dikeluarkan"
                                    mask="##/##/####"
                                    fill-mask="-"
                                    :model-value="tmpData.tglkeluar_6"
                                >
                                    <template v-slot:append>
                                        <q-icon name="event" class="cursor-pointer">
                                            <q-popup-proxy ref="datePopup" cover transition-show="scale" transition-hide="scale">
                                                <q-date v-model="tmpData.tglkeluar_6" mask="DD/MM/YYYY" color="blue" :model-value="tmpData.tglkeluar_6" @update:model-value="hideDate" />
                                            </q-popup-proxy>
                                        </q-icon>
                                    </template>
                                </q-input>
                            </div>
                            <div class="col-12 col-md-2">
                                <q-input
                                    v-model="tmpData.tglakhir_6"
                                    name="tglakhir_6"
                                    dense
                                    outlined
                                    autocomplete="off" 
                                    color="blue"
                                    label="Tgl. Berakhir"
                                    mask="##/##/####"
                                    fill-mask="-"
                                    :model-value="tmpData.tglakhir_6"
                                >
                                    <template v-slot:append>
                                        <q-icon name="event" class="cursor-pointer">
                                            <q-popup-proxy ref="datePopup" cover transition-show="scale" transition-hide="scale">
                                                <q-date v-model="tmpData.tglakhir_6" mask="DD/MM/YYYY" color="blue" :model-value="tmpData.tglakhir_6" @update:model-value="hideDate" />
                                            </q-popup-proxy>
                                        </q-icon>
                                    </template>
                                </q-input>
                            </div>
                            <div class="col-12 col-md-2">
                                <q-file outlined dense bottom-slots v-model="tmpData.file_6" label="Upload File" :max-file-size="10000000" accept=".pdf" color="blue" :model-value="tmpData.file_6" @rejected="rejectFile" counter>
                                    <template v-slot:prepend>
                                        <q-icon name="cloud_upload" @click.stop />
                                    </template>
                                    <template v-slot:append>
                                        <q-icon name="close" @click.stop="model = null" class="cursor-pointer" />
                                    </template>
                                    <template v-slot:hint> Field hint </template>
                                </q-file>
                                <!-- <div class="text-center q-pt-sm">
                                    <a :href="`${ftp_link}`+tmpData.file_6_view" v-if="tmpData.file_6_view != null" class="tw-text-xs text-light-blue-10" target="_blank">{{ tmpData.file_6_view }}</a>
                                </div> -->
                            </div>
                            <div class="col-12 col-md-3"></div>
                            <div class="col-12 col-md-9">                        
                                <div v-if="tmpData.file_6_view != ''">
                                    <p class="">File : <a :href="`${ftp_link}`+tmpData.file_6_view" v-if="tmpData.file_6_view != null" class="tw-text-xs text-italic text-light-blue-10" target="_blank">{{ tmpData.file_6_view }}</a></p>
                                </div>
                            </div>
                        </div>
                        <q-separator />
                        <div class="row q-col-gutter-md q-px-sm q-mt-sm q-mb-md">
                            <div class="col-12 col-md-3">                        
                                <p class="">Nomor Pokok Wajib Pajak (NPWP)</p>
                            </div>
                            <div class="col-12 col-md-3">
                                <q-input dense outlined v-model="tmpData.nodok_7" name="nodok_7" label="Nomor Dokumen" maxlength="50" autocomplete="off" color="blue" :model-value="tmpData.nodok_7" />
                            </div>
                            <div class="col-12 col-md-2">
                                <q-input
                                    v-model="tmpData.tglkeluar_7"
                                    name="tglkeluar_7"
                                    dense
                                    outlined
                                    autocomplete="off" 
                                    color="blue"
                                    label="Tgl. Dikeluarkan"
                                    mask="##/##/####"
                                    fill-mask="-"
                                    :model-value="tmpData.tglkeluar_7"
                                >
                                    <template v-slot:append>
                                        <q-icon name="event" class="cursor-pointer">
                                            <q-popup-proxy ref="datePopup" cover transition-show="scale" transition-hide="scale">
                                                <q-date v-model="tmpData.tglkeluar_7" mask="DD/MM/YYYY" color="blue" :model-value="tmpData.tglkeluar_7" @update:model-value="hideDate" />
                                            </q-popup-proxy>
                                        </q-icon>
                                        </template>
                                </q-input>
                            </div>
                            <div class="col-12 col-md-2">
                                <q-input
                                    v-model="tmpData.tglakhir_7"
                                    name="tglakhir_7"
                                    dense
                                    outlined
                                    autocomplete="off" 
                                    color="blue"
                                    label="Tgl. Berakhir"
                                    mask="##/##/####"
                                    fill-mask="-"
                                    :model-value="tmpData.tglakhir_7"
                                >
                                    <template v-slot:append>
                                        <q-icon name="event" class="cursor-pointer">
                                            <q-popup-proxy ref="datePopup" cover transition-show="scale" transition-hide="scale">
                                                <q-date v-model="tmpData.tglakhir_7" mask="DD/MM/YYYY" color="blue" :model-value="tmpData.tglakhir_7" @update:model-value="hideDate" />
                                            </q-popup-proxy>
                                        </q-icon>
                                    </template>
                                </q-input>
                            </div>
                            <div class="col-12 col-md-2">
                                <q-file outlined dense bottom-slots v-model="tmpData.file_7" label="Upload File" :max-file-size="10000000" accept=".pdf" color="blue" :model-value="tmpData.file_7" @rejected="rejectFile" counter>
                                    <template v-slot:prepend>
                                        <q-icon name="cloud_upload" @click.stop />
                                    </template>
                                    <template v-slot:append>
                                        <q-icon name="close" @click.stop="model = null" class="cursor-pointer" />
                                    </template>
                                    <template v-slot:hint> Field hint </template>
                                </q-file>
                                <!-- <div class="text-center q-pt-sm">
                                    <a :href="`${ftp_link}`+tmpData.file_7_view" v-if="tmpData.file_7_view != null" class="tw-text-xs text-light-blue-10" target="_blank">{{ tmpData.file_7_view }}</a>
                                </div> -->
                            </div>
                            <div class="col-12 col-md-3"></div>
                            <div class="col-12 col-md-9">                        
                                <div v-if="tmpData.file_7_view != ''">
                                    <p class="">File : <a :href="`${ftp_link}`+tmpData.file_7_view" v-if="tmpData.file_7_view != null" class="tw-text-xs text-italic text-light-blue-10" target="_blank">{{ tmpData.file_7_view }}</a></p>
                                </div>
                            </div>
                        </div>
                        <q-separator />
                        <div class="row q-col-gutter-md q-px-sm q-mt-sm q-mb-md">
                            <div class="col-12 col-md-3">                        
                                <p class="">Surat Keterangan Terdaftar (SKT)</p>
                            </div>
                            <div class="col-12 col-md-3">
                                <q-input dense outlined v-model="tmpData.nodok_8" name="nodok_8" label="Nomor Dokumen" maxlength="50" autocomplete="off" color="blue" :model-value="tmpData.nodok_8" />
                            </div>
                            <div class="col-12 col-md-2">
                                <q-input
                                    v-model="tmpData.tglkeluar_8"
                                    name="tglkeluar_8"
                                    dense
                                    outlined
                                    autocomplete="off" 
                                    color="blue"
                                    label="Tgl. Dikeluarkan"
                                    mask="##/##/####"
                                    fill-mask="-"
                                    :model-value="tmpData.tglkeluar_8"
                                >
                                    <template v-slot:append>
                                        <q-icon name="event" class="cursor-pointer">
                                            <q-popup-proxy ref="datePopup" cover transition-show="scale" transition-hide="scale">
                                                <q-date v-model="tmpData.tglkeluar_8" mask="DD/MM/YYYY" color="blue" :model-value="tmpData.tglkeluar_8" @update:model-value="hideDate" />
                                            </q-popup-proxy>
                                        </q-icon>
                                    </template>
                                </q-input>
                            </div>
                            <div class="col-12 col-md-2">
                                <q-input
                                    v-model="tmpData.tglakhir_8"
                                    name="tglakhir_8"
                                    dense
                                    outlined
                                    autocomplete="off" 
                                    color="blue"
                                    label="Tgl. Berakhir"
                                    mask="##/##/####"
                                    fill-mask="-"
                                    :model-value="tmpData.tglakhir_8"
                                >
                                    <template v-slot:append>
                                        <q-icon name="event" class="cursor-pointer">
                                            <q-popup-proxy ref="datePopup" cover transition-show="scale" transition-hide="scale">
                                                <q-date v-model="tmpData.tglakhir_8" mask="DD/MM/YYYY" color="blue" :model-value="tmpData.tglakhir_8" @update:model-value="hideDate" />
                                            </q-popup-proxy>
                                        </q-icon>
                                    </template>
                                </q-input>
                            </div>
                            <div class="col-12 col-md-2">
                                <q-file outlined dense bottom-slots v-model="tmpData.file_8" label="Upload File" :max-file-size="10000000" accept=".pdf" color="blue" :model-value="tmpData.file_8" @rejected="rejectFile" counter>
                                    <template v-slot:prepend>
                                        <q-icon name="cloud_upload" @click.stop />
                                    </template>
                                    <template v-slot:append>
                                        <q-icon name="close" @click.stop="model = null" class="cursor-pointer" />
                                    </template>
                                    <template v-slot:hint> Field hint </template>
                                </q-file>
                                <!-- <div class="text-center q-pt-sm">
                                    <a :href="`${ftp_link}`+tmpData.file_8_view" v-if="tmpData.file_8_view != null" class="tw-text-xs text-light-blue-10" target="_blank">{{ tmpData.file_8_view }}</a>
                                </div> -->
                            </div>
                            <div class="col-12 col-md-3"></div>
                            <div class="col-12 col-md-9">                        
                                <div v-if="tmpData.file_8_view != ''">
                                    <p class="">File : <a :href="`${ftp_link}`+tmpData.file_8_view" v-if="tmpData.file_8_view != null" class="tw-text-xs text-italic text-light-blue-10" target="_blank">{{ tmpData.file_8_view }}</a></p>
                                </div>
                            </div>
                        </div>
                        <q-separator />
                        <div class="row q-col-gutter-md q-px-sm q-mt-sm q-mb-md">
                            <div class="col-12 col-md-3">                        
                                <p class="">Surat Pengukuhan Pengusaha Kena Pajak (PKP)</p>
                            </div>
                            <div class="col-12 col-md-3">
                                <q-input dense outlined v-model="tmpData.nodok_9" name="nodok_9" label="Nomor Dokumen" maxlength="50" autocomplete="off" color="blue" :model-value="tmpData.nodok_9" />
                            </div>
                            <div class="col-12 col-md-2">
                                <q-input
                                    v-model="tmpData.tglkeluar_9"
                                    name="tglkeluar_9"
                                    dense
                                    outlined
                                    autocomplete="off" 
                                    color="blue"
                                    label="Tgl. Dikeluarkan"
                                    mask="##/##/####"
                                    fill-mask="-"
                                    :model-value="tmpData.tglkeluar_9"
                                >
                                    <template v-slot:append>
                                        <q-icon name="event" class="cursor-pointer">
                                            <q-popup-proxy ref="datePopup" cover transition-show="scale" transition-hide="scale">
                                                <q-date v-model="tmpData.tglkeluar_9" mask="DD/MM/YYYY" color="blue" :model-value="tmpData.tglkeluar_9" @update:model-value="hideDate" />
                                            </q-popup-proxy>
                                        </q-icon>
                                    </template>
                                </q-input>
                            </div>
                            <div class="col-12 col-md-2">
                                <q-input
                                    v-model="tmpData.tglakhir_9"
                                    name="tglakhir_9"
                                    dense
                                    outlined
                                    autocomplete="off" 
                                    color="blue"
                                    label="Tgl. Berakhir"
                                    mask="##/##/####"
                                    fill-mask="-"
                                    :model-value="tmpData.tglakhir_9"
                                >
                                    <template v-slot:append>
                                        <q-icon name="event" class="cursor-pointer">
                                            <q-popup-proxy ref="datePopup" cover transition-show="scale" transition-hide="scale">
                                                <q-date v-model="tmpData.tglakhir_9" mask="DD/MM/YYYY" color="blue" :model-value="tmpData.tglakhir_9" @update:model-value="hideDate" />
                                            </q-popup-proxy>
                                        </q-icon>
                                    </template>
                                </q-input>
                            </div>
                            <div class="col-12 col-md-2">
                                <q-file outlined dense bottom-slots v-model="tmpData.file_9" label="Upload File" :max-file-size="10000000" accept=".pdf" color="blue" :model-value="tmpData.file_9" @rejected="rejectFile" counter>
                                    <template v-slot:prepend>
                                        <q-icon name="cloud_upload" @click.stop />
                                    </template>
                                    <template v-slot:append>
                                        <q-icon name="close" @click.stop="model = null" class="cursor-pointer" />
                                    </template>
                                    <template v-slot:hint> Field hint </template>
                                </q-file>
                                <!-- <div class="text-center q-pt-sm">
                                    <a :href="`${ftp_link}`+tmpData.file_9_view" v-if="tmpData.file_9_view != null" class="tw-text-xs text-light-blue-10" target="_blank">{{ tmpData.file_9_view }}</a>
                                </div> -->
                            </div>
                            <div class="col-12 col-md-3"></div>
                            <div class="col-12 col-md-9">                        
                                <div v-if="tmpData.file_9_view != ''">
                                    <p class="">File : <a :href="`${ftp_link}`+tmpData.file_9_view" v-if="tmpData.file_9_view != null" class="tw-text-xs text-italic text-light-blue-10" target="_blank">{{ tmpData.file_9_view }}</a></p>
                                </div>
                            </div>
                        </div>
                        <q-separator />
                        <div class="row q-col-gutter-md q-px-sm q-mt-sm q-mb-md">
                            <div class="col-12 col-md-3">                        
                                <p class="">Daftar Pemilik Saham</p>
                            </div>
                            <div class="col-12 col-md-3">
                                <q-input dense outlined v-model="tmpData.nodok_10" name="nodok_10" label="Nomor Dokumen" maxlength="50" autocomplete="off" color="blue" :model-value="tmpData.nodok_10" />
                            </div>
                            <div class="col-12 col-md-2">
                                <q-input
                                    v-model="tmpData.tglkeluar_10"
                                    name="tglkeluar_10"
                                    dense
                                    outlined
                                    autocomplete="off" 
                                    color="blue"
                                    label="Tgl. Dikeluarkan"
                                    mask="##/##/####"
                                    fill-mask="-"
                                    :model-value="tmpData.tglkeluar_10"
                                >
                                    <template v-slot:append>
                                        <q-icon name="event" class="cursor-pointer">
                                            <q-popup-proxy ref="datePopup" cover transition-show="scale" transition-hide="scale">
                                                <q-date v-model="tmpData.tglkeluar_10" mask="DD/MM/YYYY" color="blue" :model-value="tmpData.tglkeluar_10" @update:model-value="hideDate" />
                                            </q-popup-proxy>
                                        </q-icon>
                                    </template>
                                </q-input>
                            </div>
                            <div class="col-12 col-md-2">
                                <q-input
                                    v-model="tmpData.tglakhir_10"
                                    name="tglakhir_10"
                                    dense
                                    outlined
                                    autocomplete="off" 
                                    color="blue"
                                    label="Tgl. Berakhir"
                                    mask="##/##/####"
                                    fill-mask="-"
                                    :model-value="tmpData.tglakhir_10"
                                >
                                    <template v-slot:append>
                                        <q-icon name="event" class="cursor-pointer">
                                            <q-popup-proxy ref="datePopup" cover transition-show="scale" transition-hide="scale">
                                                <q-date v-model="tmpData.tglakhir_10" mask="DD/MM/YYYY" color="blue" :model-value="tmpData.tglakhir_10" @update:model-value="hideDate" />
                                            </q-popup-proxy>
                                        </q-icon>
                                    </template>
                                </q-input>
                            </div>
                            <div class="col-12 col-md-2">
                                <q-file outlined dense bottom-slots v-model="tmpData.file_10" label="Upload File" :max-file-size="10000000" accept=".pdf" color="blue" :model-value="tmpData.file_10" @rejected="rejectFile" counter>
                                    <template v-slot:prepend>
                                        <q-icon name="cloud_upload" @click.stop />
                                    </template>
                                    <template v-slot:append>
                                        <q-icon name="close" @click.stop="model = null" class="cursor-pointer" />
                                    </template>
                                    <template v-slot:hint> Field hint </template>
                                </q-file>
                                <!-- <div class="text-center q-pt-sm">
                                    <a :href="`${ftp_link}`+tmpData.file_10_view" v-if="tmpData.file_10_view != null" class="tw-text-xs text-light-blue-10" target="_blank">{{ tmpData.file_10_view }}</a>
                                </div> -->
                            </div>
                            <div class="col-12 col-md-3"></div>
                            <div class="col-12 col-md-9">                        
                                <div v-if="tmpData.file_10_view != ''">
                                    <p class="">File : <a :href="`${ftp_link}`+tmpData.file_10_view" v-if="tmpData.file_10_view != null" class="tw-text-xs text-italic text-light-blue-10" target="_blank">{{ tmpData.file_10_view }}</a></p>
                                </div>
                            </div>
                        </div>
                        <q-separator />
                        <div class="row q-col-gutter-md q-px-sm q-mt-sm q-mb-md">
                            <div class="col-12 col-md-3">                        
                                <p class="">Struktur Organisasi</p>
                            </div>
                            <div class="col-12 col-md-3">
                                <q-input dense outlined v-model="tmpData.nodok_11" name="nodok_11" label="Nomor Dokumen" maxlength="50" autocomplete="off" color="blue" :model-value="tmpData.nodok_11" />
                            </div>
                            <div class="col-12 col-md-2">
                                <q-input
                                    v-model="tmpData.tglkeluar_11"
                                    name="tglkeluar_11"
                                    dense
                                    outlined
                                    autocomplete="off" 
                                    color="blue"
                                    label="Tgl. Dikeluarkan"
                                    mask="##/##/####"
                                    fill-mask="-"
                                    :model-value="tmpData.tglkeluar_11"
                                >
                                    <template v-slot:append>
                                        <q-icon name="event" class="cursor-pointer">
                                            <q-popup-proxy ref="datePopup" cover transition-show="scale" transition-hide="scale">
                                                <q-date v-model="tmpData.tglkeluar_11" mask="DD/MM/YYYY" color="blue" :model-value="tmpData.tglkeluar_11" @update:model-value="hideDate" />
                                            </q-popup-proxy>
                                        </q-icon>
                                    </template>
                                </q-input>
                            </div>
                            <div class="col-12 col-md-2">
                                <q-input
                                    v-model="tmpData.tglakhir_11"
                                    name="tglakhir_11"
                                    dense
                                    outlined
                                    autocomplete="off" 
                                    color="blue"
                                    label="Tgl. Berakhir"
                                    mask="##/##/####"
                                    fill-mask="-"
                                    :model-value="tmpData.tglakhir_11"
                                >
                                    <template v-slot:append>
                                        <q-icon name="event" class="cursor-pointer">
                                            <q-popup-proxy ref="datePopup" cover transition-show="scale" transition-hide="scale">
                                                <q-date v-model="tmpData.tglakhir_11" mask="DD/MM/YYYY" color="blue" :model-value="tmpData.tglakhir_11" @update:model-value="hideDate" />
                                            </q-popup-proxy>
                                        </q-icon>
                                    </template>
                                </q-input>
                            </div>
                            <div class="col-12 col-md-2">
                                <q-file outlined dense bottom-slots v-model="tmpData.file_11" label="Upload File" :max-file-size="10000000" accept=".pdf" color="blue" :model-value="tmpData.file_11" @rejected="rejectFile" counter>
                                    <template v-slot:prepend>
                                        <q-icon name="cloud_upload" @click.stop />
                                    </template>
                                    <template v-slot:append>
                                        <q-icon name="close" @click.stop="model = null" class="cursor-pointer" />
                                    </template>
                                    <template v-slot:hint> Field hint </template>
                                </q-file>
                                <!-- <div class="text-center q-pt-sm">
                                    <a :href="`${ftp_link}`+tmpData.file_11_view" v-if="tmpData.file_11_view != null" class="tw-text-xs text-light-blue-10" target="_blank">{{ tmpData.file_11_view }}</a>
                                </div> -->
                            </div>
                            <div class="col-12 col-md-9">                        
                                <div v-if="tmpData.file_11_view != ''">
                                    <p class="">File : <a :href="`${ftp_link}`+tmpData.file_11_view" v-if="tmpData.file_11_view != null" class="tw-text-xs text-italic text-light-blue-10" target="_blank">{{ tmpData.file_11_view }}</a></p>
                                </div>
                            </div>
                        </div>
                        <q-separator />
                        <div class="q-pa-xs q-gutter-sm q-mt-sm">
                            <q-btn size="11px" class="q-py-sm" color="blue" label="Simpan" type="submit" icon="save" />
                        </div>
                    </Form>
                </q-card>
            </div>
        </q-card>
    </q-page>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { Field, Form } from "vee-validate";
import * as yup from "yup";
import axios from "axios"
import { useRouter, useRoute } from "vue-router";
import { useQuasar } from "quasar";
import * as dayjs from "dayjs";

const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const datePopup = ref(null);
const ftp_link = import.meta.env.VITE_FTP_LINK;

const tmpData = reactive({
    npwp: "",
    nodok_1: "",
    tglkeluar_1: "",
    tglakhir_1: "",
    file_1: [],
    file_1_view: "",

    nodok_2: "",
    tglkeluar_2: "",
    tglakhir_2: "",
    file_2: [],
    file_2_view: "",

    nodok_3: "",
    tglkeluar_3: "",
    tglakhir_3: "",
    file_3: [],
    file_3_view: "",

    nodok_4: "",
    tglkeluar_4: "",
    tglakhir_4: "",
    file_4: [],
    file_4_view: "",

    nodok_5: "",
    tglkeluar_5: "",
    tglakhir_5: "",
    file_5: [],
    file_5_view: "",

    nodok_6: "",
    tglkeluar_6: "",
    tglakhir_6: "",
    file_6: [],
    file_6_view: "",

    nodok_7: "",
    tglkeluar_7: "",
    tglakhir_7: "",
    file_7: [],
    file_7_view: "",

    nodok_8: "",
    tglkeluar_8: "",
    tglakhir_8: "",
    file_8: [],
    file_8_view: "",

    nodok_9: "",
    tglkeluar_9: "",
    tglakhir_9: "",
    file_9: [],
    file_9_view: "",

    nodok_10: "",
    tglkeluar_10: "",
    tglakhir_10: "",
    file_10: [],
    file_10_view: "",

    nodok_11: "",
    tglkeluar_11: "",
    tglakhir_11: "",
    file_11: [],
    file_11_view: "",
});

const onSubmit = async (value) => {
    try{
        $q.loading.show();
        const res = await axios.post("saveAdminUmum", tmpData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            params: {
                code: route.params.code,
            },
        });

        $q.notify({
            type: "positive",
            message: res.data.message,
        });        

        // console.log(res.data);
        tmpData.file_1 = [];
        tmpData.file_2 = [];
        tmpData.file_3 = [];
        tmpData.file_4 = [];
        tmpData.file_5 = [];
        tmpData.file_6 = [];
        tmpData.file_7 = [];
        tmpData.file_8 = [];
        tmpData.file_9 = [];
        tmpData.file_10 = [];
        tmpData.file_11 = [];
        getData();
        setProgress();
        $q.loading.hide();
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }
};

const rejectFile = (err) => {
    console.log(err[0].file);
    if(err[0].file.type != 'application/pdf'){
        $q.notify({
            type: 'negative',
            message: 'Format file upload harus PDF'
        })
    }
    if(err[0].file.size > 10000000){
        $q.notify({
            type: 'negative',
            message: 'Ukuran file maksimal 10 MB'
        })  
    }
}

const getData = async () => {
    try {
        const res = await axios.put("getAdminUmum/" + route.params.code + "/10");
        if(res.data){
            tmpData.nodok_1 = res.data.data1[0].dok;
            tmpData.tglkeluar_1 = res.data.data1[1].tglkeluar;
            tmpData.tglakhir_1 = res.data.data1[2].tglakhir;
            if(res.data.data1[3].file != ''){
                tmpData.file_1_view = res.data.data1[3].file;
            }

            tmpData.nodok_2 = res.data.data2[0].dok;
            tmpData.tglkeluar_2 = res.data.data2[1].tglkeluar;
            tmpData.tglakhir_2 = res.data.data2[2].tglakhir;
            if(res.data.data2[3].file != ''){
                tmpData.file_2_view = res.data.data2[3].file;
            }

            tmpData.nodok_3 = res.data.data3[0].dok;
            tmpData.tglkeluar_3 = res.data.data3[1].tglkeluar;
            tmpData.tglakhir_3 = res.data.data3[2].tglakhir;
            if(res.data.data3[3].file != ''){
                tmpData.file_3_view = res.data.data3[3].file;
            }

            tmpData.nodok_4 = res.data.data4[0].dok;
            tmpData.tglkeluar_4 = res.data.data4[1].tglkeluar;
            tmpData.tglakhir_4 = res.data.data4[2].tglakhir;
            if(res.data.data4[3].file != ''){
                tmpData.file_4_view = res.data.data4[3].file;
            }

            tmpData.nodok_5 = res.data.data5[0].dok;
            tmpData.tglkeluar_5 = res.data.data5[1].tglkeluar;
            tmpData.tglakhir_5 = res.data.data5[2].tglakhir;
            if(res.data.data5[3].file != ''){
                tmpData.file_5_view = res.data.data5[3].file;
            }

            tmpData.nodok_6 = res.data.data6[0].dok;
            tmpData.tglkeluar_6 = res.data.data6[1].tglkeluar;
            tmpData.tglakhir_6 = res.data.data6[2].tglakhir;
            if(res.data.data6[3].file != ''){
                tmpData.file_6_view = res.data.data6[3].file;
            }

            tmpData.nodok_7 = res.data.data7[0].dok;
            tmpData.tglkeluar_7 = res.data.data7[1].tglkeluar;
            tmpData.tglakhir_7 = res.data.data7[2].tglakhir;
            if(res.data.data7[3].file != ''){
                tmpData.file_7_view = res.data.data7[3].file;
            }

            tmpData.nodok_8 = res.data.data8[0].dok;
            tmpData.tglkeluar_8 = res.data.data8[1].tglkeluar;
            tmpData.tglakhir_8 = res.data.data8[2].tglakhir;
            if(res.data.data8[3].file != ''){
                tmpData.file_8_view = res.data.data8[3].file;
            }

            tmpData.nodok_9 = res.data.data9[0].dok;
            tmpData.tglkeluar_9 = res.data.data9[1].tglkeluar;
            tmpData.tglakhir_9 = res.data.data9[2].tglakhir;
            if(res.data.data9[3].file != ''){
                tmpData.file_9_view = res.data.data9[3].file;
            }

            tmpData.nodok_10 = res.data.data10[0].dok;
            tmpData.tglkeluar_10 = res.data.data10[1].tglkeluar;
            tmpData.tglakhir_10 = res.data.data10[2].tglakhir;
            if(res.data.data10[3].file != ''){
                tmpData.file_10_view = res.data.data10[3].file;
            }

            tmpData.nodok_11 = res.data.data11[0].dok;
            tmpData.tglkeluar_11 = res.data.data11[1].tglkeluar;
            tmpData.tglakhir_11 = res.data.data11[2].tglakhir;
            if(res.data.data11[3].file != ''){
                tmpData.file_11_view = res.data.data11[3].file;
            }
        }
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }    
}

const setProgress = async () => {
    const res = await axios.get("getProgressReg", {
        params: {
            code: route.params.code,
        },
    });  

    window.localStorage.setItem("progresReg", res.data.data);
    document.dispatchEvent(new CustomEvent("updateProgress"));
};

onMounted(() => {
    getData();
});

const hideDate = () => {
    datePopup.value.hide()
}

window.localStorage.clear();
</script>