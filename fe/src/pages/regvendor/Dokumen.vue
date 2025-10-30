<template>
    <div class="q-pa-md">
        <q-card>
            <q-card-section>
                <div class="tw-text-lg tw-font-semibold">
                    KELENGKAPAN DOKUMEN
                </div>
            </q-card-section>

            <q-separator />

            <q-card-section>
                <q-list bordered class="rounded-borders">
                        <q-expansion-item
                            switch-toggle-side
                            expand-separator
                            group="somegroup"
                            icon="view_list" 
                            label="Kontak Person"       
                            header-class="bg-grey-2 text-blue-grey-7"
                        >
                            <q-card>
                                <q-card-section>
                                    <q-table
                                        dense
                                        title="List Data"
                                        row-key="name"  
                                        :rows="listKontak"
                                        :columns="columnKontak"
                                        :filter="filterKontak"
                                    >
                                        <template v-slot:top-right>
                                            <q-input borderless dense debounce="300" v-model="filterKontak" placeholder="Search">
                                                <template v-slot:append>
                                                    <q-icon name="search" />
                                                </template>
                                            </q-input>
                                        </template>
                                        <template v-slot:body-cell-no="props">
                                            <q-td :props="props">
                                                {{ props.rowIndex+1 }}
                                            </q-td>
                                        </template>
                                    </q-table>
                                </q-card-section>
                            </q-card>
                        </q-expansion-item>

                        <q-separator />

                        <q-expansion-item 
                            switch-toggle-side
                            expand-separator
                            group="somegroup" 
                            icon="view_list" 
                            label="Daftar Dewan Direksi" 
                            header-class="bg-grey-2 text-blue-grey-7"
                        >
                            <q-card>
                                <q-card-section>
                                    <q-table
                                        dense
                                        title="List Data"
                                        row-key="name"
                                        :rows="listDireksi"
                                        :columns="columnDireksi"
                                        :filter="filterDireksi"
                                    >
                                        <template v-slot:top-right>
                                            <q-input borderless dense debounce="300" v-model="filterDireksi" placeholder="Search">
                                                <template v-slot:append>
                                                    <q-icon name="search" />
                                                </template>
                                            </q-input>
                                        </template>
                                        <template v-slot:body-cell-no="props">
                                            <q-td :props="props">
                                                {{ props.rowIndex+1 }}
                                            </q-td>
                                        </template>
                                    </q-table>
                                </q-card-section>
                            </q-card>
                        </q-expansion-item>

                        <q-separator />
                        
                        <q-expansion-item 
                            switch-toggle-side
                            expand-separator
                            group="somegroup" 
                            icon="view_list" 
                            label="Penandatangan Kontrak" 
                            header-class="bg-grey-2 text-blue-grey-7"
                        >
                            <q-card>
                                <q-card-section>
                                    <q-table
                                        dense
                                        title="List Data"
                                        row-key="sup_dtl_id"
                                        :rows="listPenandaKontrak"
                                        :columns="columnPenandaKontrak"
                                        :filter="filterKontrak"
                                    >
                                        <template v-slot:top-right>
                                            <q-input borderless dense debounce="300" v-model="filterKontrak" placeholder="Search">
                                                <template v-slot:append>
                                                    <q-icon name="search" />
                                                </template>
                                            </q-input>
                                        </template>
                                        <template v-slot:body-cell-no="props">
                                            <q-td :props="props">
                                                {{ props.rowIndex+1 }}
                                            </q-td>
                                        </template>
                                        <template v-slot:body-cell-details_content_7="props">
                                            <q-td :props="props">
                                                <a :href="`${ftp_link}`+props.row.details_content_7+'.pdf'" target="_blank"><span style="color: blue;">{{ props.row.details_content_7 }}</span></a>
                                            </q-td>
                                        </template>
                                    </q-table>
                                </q-card-section>
                            </q-card>
                        </q-expansion-item>

                        <q-separator />

                        <q-expansion-item 
                            switch-toggle-side
                            expand-separator
                            group="somegroup" 
                            icon="view_list" 
                            label="Kelengkapan Administrasi Umum" 
                            header-class="bg-grey-2 text-blue-grey-7"
                        >
                            <q-card>
                                <q-card-section>
                                    <div class="row q-col-gutter-md q-px-sm q-mb-md">
                                        <div class="col-12 col-md-3">                        
                                            <p class="">Akte Pendirian Perusahaan + SK Kemenkumham</p>
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input stack-label dense outlined label="Nomor Dokumen" :model-value="tmpData.nodok_1" readonly />
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input
                                                stack-label
                                                dense
                                                outlined
                                                label="Tgl. Dikeluarkan"
                                                :model-value="tmpData.tglkeluar_1"
                                                readonly
                                            >
                                                <template v-slot:append>
                                                    <q-icon name="event" />
                                                </template>
                                            </q-input>
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input
                                                stack-label
                                                dense
                                                outlined
                                                label="Tgl. Berakhir"
                                                :model-value="tmpData.tglakhir_1"
                                                readonly
                                            >
                                                <template v-slot:append>
                                                    <q-icon name="event" />
                                                </template>
                                            </q-input>
                                        </div>
                                        <!-- <div class="col-12 col-md-2">
                                            <p class="tw-text-xs">File Attachment :</p> <a :href="`${ftp_link}`+tmpData.file_1_view" v-if="tmpData.file_1_view != null" class="tw-text-xs text-italic text-light-blue-10" target="_blank">{{ tmpData.file_1_view }}</a>
                                        </div> -->
                                        <div class="col-12 col-md-3"></div>
                                        <div class="col-12 col-md-9">                        
                                            <div v-if="tmpData.file_1_view != ''">
                                                <p class="">File : <a :href="`${ftp_link}`+tmpData.file_1_view" v-if="tmpData.file_1_view != null" class="tw-text-xs text-italic text-light-blue-10" target="_blank">{{ tmpData.file_1_view }}</a></p>
                                            </div>
                                        </div>
                                    </div>
                                    <q-separator />
                                    <div class="row q-col-gutter-md q-px-sm q-mt-xs q-mb-md">
                                        <div class="col-12 col-md-3">                        
                                            <p class="">Akte Perubahan Terakhir + SK Kemenkumham</p>
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input dense outlined label="Nomor Dokumen" :model-value="tmpData.nodok_2" readonly />
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input
                                                stack-label
                                                dense
                                                outlined
                                                label="Tgl. Dikeluarkan"
                                                :model-value="tmpData.tglkeluar_2"
                                                readonly
                                            >
                                                <template v-slot:append>
                                                    <q-icon name="event" />
                                                </template>
                                            </q-input>
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input
                                                stack-label
                                                dense
                                                outlined
                                                label="Tgl. Berakhir"
                                                :model-value="tmpData.tglakhir_2"
                                                readonly
                                            >
                                                <template v-slot:append>
                                                    <q-icon name="event" />
                                                </template>
                                            </q-input>
                                        </div>
                                        <!-- <div class="col-12 col-md-2">
                                            <p class="tw-text-xs">File Attachment :</p> <a :href="`${ftp_link}`+tmpData.file_2_view" v-if="tmpData.file_2_view != null" class="tw-text-xs text-italic text-light-blue-10" target="_blank">{{ tmpData.file_2_view }}</a>
                                        </div> -->
                                        <div class="col-12 col-md-3"></div>
                                        <div class="col-12 col-md-9">                        
                                            <div v-if="tmpData.file_2_view != ''">
                                                <p class="">File : <a :href="`${ftp_link}`+tmpData.file_2_view" v-if="tmpData.file_2_view != null" class="tw-text-xs text-italic text-light-blue-10" target="_blank">{{ tmpData.file_2_view }}</a></p>
                                            </div>
                                        </div>
                                    </div>
                                    <q-separator />
                                    <div class="row q-col-gutter-md q-px-sm q-mt-xs q-mb-md">
                                        <div class="col-12 col-md-3">                        
                                            <p class="">Izin Usaha (Sesuai NIB)</p>
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input dense outlined label="Nomor Dokumen" :model-value="tmpData.nodok_3" readonly />
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input
                                                stack-label
                                                dense
                                                outlined
                                                label="Tgl. Dikeluarkan"
                                                :model-value="tmpData.tglkeluar_3"
                                                readonly
                                            >
                                                <template v-slot:append>
                                                    <q-icon name="event" />
                                                </template>
                                            </q-input>
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input
                                                stack-label
                                                dense
                                                outlined
                                                label="Tgl. Berakhir"
                                                :model-value="tmpData.tglakhir_3"
                                                readonly
                                            >
                                                <template v-slot:append>
                                                    <q-icon name="event" />
                                                </template>
                                            </q-input>
                                        </div>
                                        <!-- <div class="col-12 col-md-2">
                                            <p class="tw-text-xs">File Attachment :</p> <a :href="`${ftp_link}`+tmpData.file_3_view" v-if="tmpData.file_3_view != null" class="tw-text-xs text-italic text-light-blue-10" target="_blank">{{ tmpData.file_3_view }}</a>
                                        </div> -->
                                        <div class="col-12 col-md-3"></div>
                                        <div class="col-12 col-md-9">                        
                                            <div v-if="tmpData.file_1_view != ''">
                                                <p class="">File : <a :href="`${ftp_link}`+tmpData.file_3_view" v-if="tmpData.file_3_view != null" class="tw-text-xs text-italic text-light-blue-10" target="_blank">{{ tmpData.file_3_view }}</a></p>
                                            </div>
                                        </div>
                                    </div>
                                    <q-separator />
                                    <div class="row q-col-gutter-md q-px-sm q-mt-xs q-mb-md">
                                        <div class="col-12 col-md-3">                        
                                            <p class="">NIB Berbasis Resiko</p>
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input stack-label dense outlined label="Nomor Dokumen" :model-value="tmpData.nodok_4" readonly />
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input
                                                stack-label
                                                dense
                                                outlined
                                                label="Tgl. Dikeluarkan"
                                                :model-value="tmpData.tglkeluar_4"
                                                readonly
                                            >
                                                <template v-slot:append>
                                                    <q-icon name="event" />
                                                </template>
                                            </q-input>
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input
                                                stack-label
                                                dense
                                                outlined
                                                label="Tgl. Berakhir"
                                                :model-value="tmpData.tglakhir_4"
                                                readonly
                                            >
                                                <template v-slot:append>
                                                    <q-icon name="event" />
                                                </template>
                                            </q-input>
                                        </div>
                                        <!-- <div class="col-12 col-md-2">
                                            <p class="tw-text-xs">File Attachment :</p> <a :href="`${ftp_link}`+tmpData.file_4_view" v-if="tmpData.file_4_view != null" class="tw-text-xs text-italic text-light-blue-10" target="_blank">{{ tmpData.file_4_view }}</a>
                                        </div> -->
                                        <div class="col-12 col-md-3"></div>
                                        <div class="col-12 col-md-9">                        
                                            <div v-if="tmpData.file_4_view != ''">
                                                <p class="">File : <a :href="`${ftp_link}`+tmpData.file_4_view" v-if="tmpData.file_4_view != null" class="tw-text-xs text-italic text-light-blue-10" target="_blank">{{ tmpData.file_4_view }}</a></p>
                                            </div>
                                        </div>
                                    </div>
                                    <q-separator />
                                    <div class="row q-col-gutter-md q-px-sm q-mt-xs q-mb-md">
                                        <div class="col-12 col-md-3">                        
                                            <p class="">Sertifikat Standard (Sesuai NIB)</p>
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input stack-label dense outlined label="Nomor Dokumen" :model-value="tmpData.nodok_5" readonly />
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input
                                                stack-label
                                                dense
                                                outlined
                                                label="Tgl. Dikeluarkan"
                                                :model-value="tmpData.tglkeluar_5"
                                                readonly
                                            >
                                                <template v-slot:append>
                                                    <q-icon name="event" />
                                                </template>
                                            </q-input>
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input
                                                stack-label
                                                dense
                                                outlined
                                                label="Tgl. Berakhir"
                                                :model-value="tmpData.tglakhir_5"
                                                readonly
                                            >
                                                <template v-slot:append>
                                                    <q-icon name="event" />
                                                </template>
                                            </q-input>
                                        </div>
                                        <!-- <div class="col-12 col-md-2">
                                            <p class="tw-text-xs">File Attachment :</p> <a :href="`${ftp_link}`+tmpData.file_5_view" v-if="tmpData.file_5_view != null" class="tw-text-xs text-italic text-light-blue-10" target="_blank">{{ tmpData.file_5_view }}</a>
                                        </div> -->
                                        <div class="col-12 col-md-3"></div>
                                        <div class="col-12 col-md-9">                        
                                            <div v-if="tmpData.file_5_view != ''">
                                                <p class="">File : <a :href="`${ftp_link}`+tmpData.file_5_view" v-if="tmpData.file_5_view != null" class="tw-text-xs text-italic text-light-blue-10" target="_blank">{{ tmpData.file_5_view }}</a></p>
                                            </div>
                                        </div>
                                    </div>
                                    <q-separator />
                                    <div class="row q-col-gutter-md q-px-sm q-mt-xs q-mb-md">
                                        <div class="col-12 col-md-3">                        
                                            <p class="">Surat Keterangan Domisili Perusahaan (SKDP)</p>
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input stack-label dense outlined label="Nomor Dokumen" :model-value="tmpData.nodok_6" readonly />
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input
                                                stack-label
                                                dense
                                                outlined
                                                label="Tgl. Dikeluarkan"
                                                :model-value="tmpData.tglkeluar_6"
                                                readonly
                                            >
                                                <template v-slot:append>
                                                    <q-icon name="event" />
                                                </template>
                                            </q-input>
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input
                                                stack-label
                                                dense
                                                outlined
                                                label="Tgl. Berakhir"
                                                :model-value="tmpData.tglakhir_6"
                                                readonly
                                            >
                                                <template v-slot:append>
                                                    <q-icon name="event" />
                                                </template>
                                            </q-input>
                                        </div>
                                        <!-- <div class="col-12 col-md-2">
                                            <p class="tw-text-xs">File Attachment :</p> <a :href="`${ftp_link}`+tmpData.file_6_view" v-if="tmpData.file_6_view != null" class="tw-text-xs text-italic text-light-blue-10" target="_blank">{{ tmpData.file_6_view }}</a>
                                        </div> -->
                                        <div class="col-12 col-md-3"></div>
                                        <div class="col-12 col-md-9">                        
                                            <div v-if="tmpData.file_6_view != ''">
                                                <p class="">File : <a :href="`${ftp_link}`+tmpData.file_6_view" v-if="tmpData.file_6_view != null" class="tw-text-xs text-italic text-light-blue-10" target="_blank">{{ tmpData.file_6_view }}</a></p>
                                            </div>
                                        </div>
                                    </div>
                                    <q-separator />
                                    <div class="row q-col-gutter-md q-px-sm q-mt-xs q-mb-md">
                                        <div class="col-12 col-md-3">                        
                                            <p class="">Nomor Pokok Wajib Pajak (NPWP)</p>
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input stack-label dense outlined label="Nomor Dokumen" :model-value="tmpData.nodok_7" readonly />
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input
                                                stack-label
                                                dense
                                                outlined
                                                label="Tgl. Dikeluarkan"
                                                :model-value="tmpData.tglkeluar_7"
                                                readonly
                                            >
                                                <template v-slot:append>
                                                    <q-icon name="event" />
                                                </template>
                                            </q-input>
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input
                                                stack-label
                                                dense
                                                outlined
                                                label="Tgl. Berakhir"
                                                :model-value="tmpData.tglakhir_7"
                                                readonly
                                            >
                                                <template v-slot:append>
                                                    <q-icon name="event" />
                                                </template>
                                            </q-input>
                                        </div>
                                        <!-- <div class="col-12 col-md-2">
                                            <p class="tw-text-xs">File Attachment :</p> <a :href="`${ftp_link}`+tmpData.file_7_view" v-if="tmpData.file_7_view != null" class="tw-text-xs text-italic text-light-blue-10" target="_blank">{{ tmpData.file_7_view }}</a>
                                        </div> -->
                                        <div class="col-12 col-md-3"></div>
                                        <div class="col-12 col-md-9">                        
                                            <div v-if="tmpData.file_7_view != ''">
                                                <p class="">File : <a :href="`${ftp_link}`+tmpData.file_7_view" v-if="tmpData.file_7_view != null" class="tw-text-xs text-italic text-light-blue-10" target="_blank">{{ tmpData.file_7_view }}</a></p>
                                            </div>
                                        </div>
                                    </div>
                                    <q-separator />
                                    <div class="row q-col-gutter-md q-px-sm q-mt-xs q-mb-md">
                                        <div class="col-12 col-md-3">                        
                                            <p class="">Surat Keterangan Terdaftar (SKT)</p>
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input stack-label dense outlined label="Nomor Dokumen" :model-value="tmpData.nodok_8" readonly />
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input
                                                stack-label
                                                dense
                                                outlined
                                                label="Tgl. Dikeluarkan"
                                                :model-value="tmpData.tglkeluar_8"
                                                readonly
                                            >
                                                <template v-slot:append>
                                                    <q-icon name="event" />
                                                </template>
                                            </q-input>
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input
                                                stack-label
                                                dense
                                                outlined
                                                label="Tgl. Berakhir"
                                                :model-value="tmpData.tglakhir_8"
                                                readonly
                                            >
                                                <template v-slot:append>
                                                    <q-icon name="event" />
                                                </template>
                                            </q-input>
                                        </div>
                                        <!-- <div class="col-12 col-md-2">
                                            <p class="tw-text-xs">File Attachment :</p> <a :href="`${ftp_link}`+tmpData.file_8_view" v-if="tmpData.file_8_view != null" class="tw-text-xs text-italic text-light-blue-10" target="_blank">{{ tmpData.file_8_view }}</a>
                                        </div> -->
                                        <div class="col-12 col-md-3"></div>
                                        <div class="col-12 col-md-9">                        
                                            <div v-if="tmpData.file_8_view != ''">
                                                <p class="">File : <a :href="`${ftp_link}`+tmpData.file_8_view" v-if="tmpData.file_8_view != null" class="tw-text-xs text-italic text-light-blue-10" target="_blank">{{ tmpData.file_8_view }}</a></p>
                                            </div>
                                        </div>
                                    </div>
                                    <q-separator />
                                    <div class="row q-col-gutter-md q-px-sm q-mt-xs q-mb-md">
                                        <div class="col-12 col-md-3">                        
                                            <p class="">Surat Pengukuhan Pengusaha Kena Pajak (PKP)</p>
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input stack-label dense outlined label="Nomor Dokumen" :model-value="tmpData.nodok_9" readonly />
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input
                                                stack-label
                                                dense
                                                outlined
                                                label="Tgl. Dikeluarkan"
                                                :model-value="tmpData.tglkeluar_9"
                                                readonly
                                            >
                                                <template v-slot:append>
                                                    <q-icon name="event" />
                                                </template>
                                            </q-input>
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input
                                                stack-label
                                                dense
                                                outlined
                                                label="Tgl. Berakhir"
                                                :model-value="tmpData.tglakhir_9"
                                                readonly
                                            >
                                                <template v-slot:append>
                                                    <q-icon name="event" />
                                                </template>
                                            </q-input>
                                        </div>
                                        <!-- <div class="col-12 col-md-2">
                                            <p class="tw-text-xs">File Attachment :</p> <a :href="`${ftp_link}`+tmpData.file_9_view" v-if="tmpData.file_9_view != null" class="tw-text-xs text-italic text-light-blue-10" target="_blank">{{ tmpData.file_9_view }}</a>
                                        </div> -->
                                        <div class="col-12 col-md-3"></div>
                                        <div class="col-12 col-md-9">                        
                                            <div v-if="tmpData.file_9_view != ''">
                                                <p class="">File : <a :href="`${ftp_link}`+tmpData.file_9_view" v-if="tmpData.file_9_view != null" class="tw-text-xs text-italic text-light-blue-10" target="_blank">{{ tmpData.file_9_view }}</a></p>
                                            </div>
                                        </div>
                                    </div>
                                    <q-separator />
                                    <div class="row q-col-gutter-md q-px-sm q-mt-xs q-mb-md">
                                        <div class="col-12 col-md-3">                        
                                            <p class="">Daftar Pemilik Saham</p>
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input stack-label dense outlined label="Nomor Dokumen" :model-value="tmpData.nodok_10" readonly />
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input
                                                stack-label
                                                dense
                                                outlined
                                                label="Tgl. Dikeluarkan"
                                                :model-value="tmpData.tglkeluar_10"
                                                readonly
                                            >
                                                <template v-slot:append>
                                                    <q-icon name="event" />
                                                </template>
                                            </q-input>
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input
                                                stack-label
                                                dense
                                                outlined
                                                label="Tgl. Berakhir"
                                                :model-value="tmpData.tglakhir_10"
                                                readonly
                                            >
                                                <template v-slot:append>
                                                    <q-icon name="event" />
                                                </template>
                                            </q-input>
                                        </div>
                                        <!-- <div class="col-12 col-md-2">
                                            <p class="tw-text-xs">File Attachment :</p> <a :href="`${ftp_link}`+tmpData.file_10_view" v-if="tmpData.file_10_view != null" class="tw-text-xs text-italic text-light-blue-10" target="_blank">{{ tmpData.file_10_view }}</a>
                                        </div> -->
                                        <div class="col-12 col-md-3"></div>
                                        <div class="col-12 col-md-9">                        
                                            <div v-if="tmpData.file_10_view != ''">
                                                <p class="">File : <a :href="`${ftp_link}`+tmpData.file_10_view" v-if="tmpData.file_10_view != null" class="tw-text-xs text-italic text-light-blue-10" target="_blank">{{ tmpData.file_10_view }}</a></p>
                                            </div>
                                        </div>
                                    </div>
                                    <q-separator />
                                    <div class="row q-col-gutter-md q-px-sm q-mt-xs q-mb-md">
                                        <div class="col-12 col-md-3">                        
                                            <p class="">Struktur Organisasi</p>
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input stack-label dense outlined label="Nomor Dokumen" :model-value="tmpData.nodok_11" readonly />
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input
                                                stack-label
                                                dense
                                                outlined
                                                label="Tgl. Dikeluarkan"
                                                :model-value="tmpData.tglkeluar_11"
                                                readonly
                                            >
                                                <template v-slot:append>
                                                    <q-icon name="event" />
                                                </template>
                                            </q-input>
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input
                                                stack-label
                                                dense
                                                outlined
                                                label="Tgl. Berakhir"
                                                :model-value="tmpData.tglakhir_11"
                                                readonly
                                            >
                                                <template v-slot:append>
                                                    <q-icon name="event" />
                                                </template>
                                            </q-input>
                                        </div>
                                        <!-- <div class="col-12 col-md-2">
                                            <p class="tw-text-xs">File Attachment :</p> <a :href="`${ftp_link}`+tmpData.file_11_view" v-if="tmpData.file_11_view != null" class="tw-text-xs text-italic text-light-blue-10" target="_blank">{{ tmpData.file_11_view }}</a>
                                        </div> -->
                                        <div class="col-12 col-md-3"></div>
                                        <div class="col-12 col-md-9">                        
                                            <div v-if="tmpData.file_11_view != ''">
                                                <p class="">File : <a :href="`${ftp_link}`+tmpData.file_11_view" v-if="tmpData.file_11_view != null" class="tw-text-xs text-italic text-light-blue-10" target="_blank">{{ tmpData.file_11_view }}</a></p>
                                            </div>
                                        </div>
                                    </div>
                                </q-card-section>
                            </q-card>
                        </q-expansion-item>

                        <q-separator />

                        <q-expansion-item
                            switch-toggle-side
                            expand-separator
                            group="somegroup"
                            icon="view_list"
                            label="Kelengkapan tambahan untuk vendor Transporter"
                            header-class="bg-grey-2 text-blue-grey-7"
                        >
                            <q-card>
                                <q-card-section>
                                    <q-table
                                        dense
                                        title="List Data"
                                        row-key="name"
                                        :rows="listVendorTransporter"
                                        :columns="columnVendorTransporter"
                                        :filter="filterVendorTransporter"                 
                                    >
                                        <template v-slot:top-right>
                                            <q-input borderless dense debounce="300" v-model="filterVendorTransporter" placeholder="Search">
                                                <template v-slot:append>
                                                    <q-icon name="search" />
                                                </template>
                                            </q-input>
                                        </template>
                                        <template v-slot:body-cell-no="props">
                                            <q-td :props="props">
                                                {{ props.rowIndex+1 }}
                                            </q-td>
                                        </template>
                                        <template v-slot:body-cell-details_upload="props">
                                            <q-td :props="props">
                                                <a :href="`${ftp_link}`+props.row.details_upload_app+'.pdf'" class="tw-text-xs text-light-blue-10" target="_blank">{{ props.row.details_upload }}</a>
                                            </q-td>
                                        </template>
                                    </q-table>
                                </q-card-section>
                            </q-card>
                        </q-expansion-item>

                        <q-separator />

                        <q-expansion-item
                            switch-toggle-side
                            expand-separator
                            group="somegroup"
                            icon="view_list"
                            label="Kelengkapan tambahan untuk Vendor Keagenan Resmi"       
                            header-class="bg-grey-2 text-blue-grey-7"
                        >
                            <q-card>
                                <q-card-section>
                                    <div class="row q-col-gutter-md q-px-sm">
                                        <div class="col-12 col-md-3">                        
                                            <p class="">Surat Penunjukan Keagenan Resmi</p>
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input stack-label dense outlined :model-value="tmpData.nodok_1_agen" label="Nomor Dokumen" readonly />
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input
                                                stack-label
                                                dense
                                                outlined
                                                label="Tgl. Dikeluarkan"
                                                :model-value="tmpData.tglkeluar_1_agen"
                                                readonly
                                            >
                                                <template v-slot:append>
                                                    <q-icon name="event" />
                                                </template>
                                            </q-input>
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input
                                                stack-label
                                                dense
                                                outlined
                                                label="Tgl. Berakhir"
                                                :model-value="tmpData.tglakhir_1_agen"
                                                readonly
                                            >
                                                <template v-slot:append>
                                                    <q-icon name="event" />
                                                </template>
                                            </q-input>
                                        </div>                        
                                    </div>
                                </q-card-section>
                                <q-card-section>
                                    <q-table
                                        dense
                                        title="List Upload Data"
                                        row-key="name"
                                        :rows="listFileVendorAgenResmi"
                                        :columns="columnFileVendorAgenResmi"
                                        :filter="filterFileVendorAgenResmi"                 
                                    >
                                        <template v-slot:top-right>
                                            <q-input borderless dense debounce="300" v-model="filterFileVendorAgenResmi" placeholder="Search">
                                                <template v-slot:append>
                                                    <q-icon name="search" />
                                                </template>
                                            </q-input>
                                        </template>
                                        <template v-slot:body-cell-no="props">
                                            <q-td :props="props">
                                                {{ props.rowIndex+1 }}
                                            </q-td>
                                        </template>
                                        <template v-slot:body-cell-details_upload="props">
                                            <q-td :props="props">
                                                <a :href="`${ftp_link}`+props.row.details_upload_app+'.pdf'" class="tw-text-xs text-light-blue-10" target="_blank">{{ props.row.details_upload }}</a>
                                            </q-td>
                                        </template>
                                    </q-table>
                                </q-card-section>
                            </q-card>
                        </q-expansion-item>

                        <q-separator />

                        <q-expansion-item 
                            switch-toggle-side
                            expand-separator
                            group="somegroup" 
                            icon="view_list" 
                            label="Kelengkapan tambahan untuk Kontraktor Sipil/Elektrikal" 
                            header-class="bg-grey-2 text-blue-grey-7"
                        >
                            <q-card>
                                <q-card-section>
                                    <div class="row q-col-gutter-md q-px-sm q-mb-lg">
                                        <div class="col-12 col-md-3">                        
                                            <p class="">Sertifikat Ijin Usaha Jasa Kelistrikan dari PLN</p>
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input stack-label dense outlined :model-value="tmpData.nodok_1_kontraktor" label="Nomor Dokumen" readonly />
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input
                                                stack-label
                                                dense
                                                outlined
                                                label="Tgl. Dikeluarkan"
                                                :model-value="tmpData.tglkeluar_1_kontraktor"
                                                readonly
                                            >
                                                <template v-slot:append>
                                                    <q-icon name="event" />
                                                </template>
                                            </q-input>
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input
                                                stack-label
                                                dense
                                                outlined
                                                label="Tgl. Berakhir"
                                                :model-value="tmpData.tglakhir_1_kontraktor"
                                                readonly
                                            >
                                                <template v-slot:append>
                                                    <q-icon name="event" />
                                                </template>
                                            </q-input>
                                        </div>                        
                                    </div>
                                    <q-separator />
                                    <div class="row q-col-gutter-md q-pl-sm q-mt-sm">
                                        <div class="col-12 col-md-3">                        
                                            <p class="">Surat Ijin Usaha (SIUJK/LPJK)</p>
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input stack-label dense outlined label="Nomor Dokumen" :model-value="tmpData.nodok_2_kontraktor" readonly />
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input
                                                stack-label
                                                dense
                                                outlined
                                                label="Tgl. Dikeluarkan"
                                                :model-value="tmpData.tglkeluar_2_kontraktor"
                                                readonly
                                            >
                                                <template v-slot:append>
                                                    <q-icon name="event" />
                                                </template>
                                            </q-input>
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input
                                                stack-label
                                                dense
                                                outlined
                                                label="Tgl. Berakhir"
                                                :model-value="tmpData.tglakhir_2_kontraktor"
                                                readonly
                                            >
                                                <template v-slot:append>
                                                    <q-icon name="event" />
                                                </template>
                                            </q-input>
                                        </div>                        
                                    </div>
                                </q-card-section>
                                <q-card-section>
                                    <q-table
                                        dense
                                        title="List Upload Data"
                                        row-key="name"
                                        :rows="listFileKontraktorSipil"
                                        :columns="columnFileKontraktorSipil"
                                        :filter="filterFileKontraktorSipil"                 
                                    >
                                        <template v-slot:top-right>
                                            <q-input borderless dense debounce="300" v-model="filterFileKontraktorSipil" placeholder="Search">
                                                <template v-slot:append>
                                                    <q-icon name="search" />
                                                </template>
                                            </q-input>
                                        </template>
                                        <template v-slot:body-cell-no="props">
                                            <q-td :props="props">
                                                {{ props.rowIndex+1 }}
                                            </q-td>
                                        </template>
                                        <template v-slot:body-cell-details_upload="props">
                                            <q-td :props="props">
                                                <a :href="`${ftp_link}`+props.row.details_upload_app+'.pdf'" class="tw-text-xs text-light-blue-10" target="_blank">{{ props.row.details_upload }}</a>
                                            </q-td>
                                        </template>
                                    </q-table>
                                </q-card-section>
                            </q-card>
                        </q-expansion-item>

                        <q-separator />

                        <q-expansion-item 
                            switch-toggle-side
                            expand-separator
                            group="somegroup" 
                            icon="view_list" 
                            label="Rekening Bank" 
                            header-class="bg-grey-2 text-blue-grey-7"
                        >
                            <q-card>
                                <q-card-section>
                                    <q-table
                                        dense
                                        title="List Data"
                                        row-key="name"
                                        :rows="listRekeningBank"
                                        :columns="columnRekeningBank"
                                        :filter="filterRekeningBank"
                                    >
                                        <template v-slot:top-right>
                                            <q-input borderless dense debounce="300" v-model="filterRekeningBank" placeholder="Search">
                                                <template v-slot:append>
                                                    <q-icon name="search" />
                                                </template>
                                            </q-input>
                                        </template>
                                        <template v-slot:body-cell-no="props">
                                            <q-td :props="props">
                                                {{ props.rowIndex+1 }}
                                            </q-td>
                                        </template>
                                    </q-table>
                                </q-card-section>
                                <q-card-section>
                                    <q-table
                                        dense
                                        title="List Upload Data"
                                        row-key="name"
                                        :rows="listFileRekeningBank"
                                        :columns="columnFileRekeningBank"
                                        :filter="filterFileRekeningBank"                 
                                    >
                                        <template v-slot:top-right>
                                            <q-input borderless dense debounce="300" v-model="filterFileRekeningBank" placeholder="Search">
                                                <template v-slot:append>
                                                    <q-icon name="search" />
                                                </template>
                                            </q-input>
                                        </template>
                                        <template v-slot:body-cell-no="props">
                                            <q-td :props="props">
                                                {{ props.rowIndex+1 }}
                                            </q-td>
                                        </template>
                                        <template v-slot:body-cell-details_upload="props">
                                            <q-td :props="props">
                                                <a :href="`${ftp_link}`+props.row.details_upload_app+'.pdf'" class="tw-text-xs text-light-blue-10" target="_blank">{{ props.row.details_upload }}</a>
                                            </q-td>
                                        </template>
                                    </q-table>
                                </q-card-section>
                            </q-card>
                        </q-expansion-item>

                        <q-separator />

                        <q-expansion-item 
                            switch-toggle-side
                            expand-separator
                            group="somegroup" 
                            icon="view_list" 
                            label="Group / Anak Perusahaan" 
                            header-class="bg-grey-2 text-blue-grey-7"
                        >
                            <q-card>
                                <q-card-section>
                                    <q-table
                                        dense
                                        title="List Data"
                                        row-key="name"
                                        :rows="listGroupPers"
                                        :columns="columnGroupPers"
                                        :filter="filterGroupPers"                      
                                    >
                                        <template v-slot:top-right>
                                            <q-input borderless dense debounce="300" v-model="filterGroupPers" placeholder="Search">
                                                <template v-slot:append>
                                                    <q-icon name="search" />
                                                </template>
                                            </q-input>
                                        </template>
                                        <template v-slot:body-cell-no="props">
                                            <q-td :props="props">
                                                {{ props.rowIndex+1 }}
                                            </q-td>
                                        </template>
                                    </q-table>
                                </q-card-section>
                            </q-card>
                        </q-expansion-item>

                        <q-separator />

                        <q-expansion-item 
                            switch-toggle-side
                            expand-separator
                            group="somegroup" 
                            icon="view_list" 
                            label="Nama Pejabat/Kuasa Penandatangan Faktur Pajak" 
                            header-class="bg-grey-2 text-blue-grey-7"
                        >
                            <q-card>
                                <q-card-section>
                                    <q-table
                                        dense
                                        title="List Data"
                                        row-key="name"
                                        :rows="listNamaPejabat"
                                        :columns="columnNamaPejabat"
                                        :filter="filterNamaPejabat"                                                             
                                    >
                                        <template v-slot:top-right>
                                            <q-input borderless dense debounce="300" v-model="filterNamaPejabat" placeholder="Search">
                                                <template v-slot:append>
                                                    <q-icon name="search" />
                                                </template>
                                            </q-input>
                                        </template>
                                        <template v-slot:body-cell-no="props">
                                            <q-td :props="props">
                                                {{ props.rowIndex+1 }}
                                            </q-td>
                                        </template>
                                    </q-table>
                                </q-card-section>
                                <q-card-section>
                                    <q-table
                                        dense
                                        title="List Upload Data"
                                        row-key="name"
                                        :rows="listFileNamaPejabat"
                                        :columns="columnFileNamaPejabat"
                                        :filter="filterFileNamaPejabat"                 
                                    >
                                        <template v-slot:top-right>
                                            <q-input borderless dense debounce="300" v-model="filterFileNamaPejabat" placeholder="Search">
                                                <template v-slot:append>
                                                    <q-icon name="search" />
                                                </template>
                                            </q-input>
                                        </template>
                                        <template v-slot:body-cell-no="props">
                                            <q-td :props="props">
                                                {{ props.rowIndex+1 }}
                                            </q-td>
                                        </template>
                                        <template v-slot:body-cell-details_upload="props">
                                            <q-td :props="props">
                                                <a :href="`${ftp_link}`+props.row.details_upload_app+'.pdf'" class="tw-text-xs text-light-blue-10" target="_blank">{{ props.row.details_upload }}</a>
                                            </q-td>
                                        </template>
                                    </q-table>
                                </q-card-section>
                            </q-card>
                        </q-expansion-item>

                        <q-separator />

                        <q-expansion-item 
                            switch-toggle-side
                            expand-separator
                            group="somegroup" 
                            icon="view_list" 
                            label="Quality dan Environment" 
                            header-class="bg-grey-2 text-blue-grey-7"
                        >
                            <q-card>
                                <q-card-section>
                                    <div class="row q-col-gutter-md q-px-sm q-mb-xs">
                                        <div class="col-12 col-md-3">                        
                                            <p class="text-bold">Syarat</p>
                                            <p class="q-pt-sm">ISO 9001</p>
                                        </div>    
                                        <div class="col-12 col-md-4 text-center"> 
                                            <p class="text-bold">Status</p>
                                            <div class="q-mb-xs">
                                                <q-radio class="q-mr-sm" size="xs" val="Yes" label="Ya" :model-value="tmpData.status_1" color="blue" />
                                                <q-radio size="xs" val="No" label="Tidak" :model-value="tmpData.status_1" color="blue" />                              
                                            </div>
                                        </div>   
                                        <div class="col-12 col-md-4 text-center"> 
                                            <p class="text-bold">Versi</p>
                                            <div class="q-mb-xs">
                                                <q-radio class="q-mr-sm" size="xs" val="2008" label="2008" :model-value="tmpData.versi_1" color="blue" />
                                                <q-radio size="xs" val="2015" label="2015" :model-value="tmpData.versi_1" color="blue" />                              
                                            </div>
                                        </div>                  
                                    </div>
                                    <q-separator />
                                    <div class="row q-col-gutter-md q-px-sm q-my-xs">
                                        <div class="col-12 col-md-3">                        
                                            <p class="text-bold">Syarat</p>
                                            <p class="q-pt-sm">ISO 14001</p>
                                        </div>    
                                        <div class="col-12 col-md-4 text-center"> 
                                            <p class="text-bold">Status</p>
                                            <div class="q-mb-xs">
                                                <q-radio class="q-mr-sm" size="xs" val="Yes" label="Ya" :model-value="tmpData.status_2" color="blue" />
                                                <q-radio size="xs" val="No" label="Tidak" :model-value="tmpData.status_2" color="blue" />                              
                                            </div>
                                        </div>   
                                        <div class="col-12 col-md-4 text-center"> 
                                            <p class="text-bold">Versi</p>
                                            <div class="q-mb-xs">
                                                <q-radio class="q-mr-sm" size="xs" val="2008" label="2008" :model-value="tmpData.versi_2" color="blue" />
                                                <q-radio class="q-mr-sm" size="xs" val="2015" label="2015" :model-value="tmpData.versi_2" color="blue" /> 
                                                <q-radio class="q-mr-sm" size="xs" val="Emas" label="Emas" :model-value="tmpData.versi_2" color="blue" /> 
                                                <q-radio size="xs" val="Lainnya" label="Lainnya" :model-value="tmpData.versi_2" color="blue" />                              
                                            </div>
                                        </div>                  
                                    </div>
                                    <q-separator />
                                    <div class="row q-col-gutter-md q-px-sm q-my-xs">
                                        <div class="col-12 col-md-3">                        
                                            <p class="text-bold">Syarat</p>
                                            <p class="q-pt-sm">OHSAS 18001</p>
                                        </div>    
                                        <div class="col-12 col-md-4 text-center"> 
                                            <p class="text-bold">Status</p>
                                            <div class="q-mb-xs">
                                                <q-radio class="q-mr-sm" size="xs" val="Yes" label="Ya" :model-value="tmpData.status_3" color="blue" />
                                                <q-radio size="xs" val="No" label="Tidak" :model-value="tmpData.status_3" color="blue" />                              
                                            </div>
                                        </div>   
                                        <div class="col-12 col-md-4 text-center"> 
                                            <p class="text-bold">Versi</p>
                                            <div class="q-mb-xs">
                                                <q-radio class="q-mr-sm" size="xs" val="2008" label="2008" :model-value="tmpData.versi_3" color="blue" />
                                                <q-radio class="q-mr-sm" size="xs" val="2015" label="2015" :model-value="tmpData.versi_3" color="blue" /> 
                                                <q-radio size="xs" val="Emas" label="Emas" :model-value="tmpData.versi_3" color="blue" />                              
                                            </div>
                                        </div>                  
                                    </div>
                                    <q-separator />
                                    <div class="row q-col-gutter-md q-px-sm q-my-xs">
                                        <div class="col-12 col-md-3">                        
                                            <p class="text-bold">Syarat</p>
                                            <p class="q-pt-sm">Customer Audit</p>
                                        </div>    
                                        <div class="col-12 col-md-4 text-center"> 
                                            <p class="text-bold">Status</p>
                                            <div class="q-mb-xs">
                                                <q-radio class="q-mr-sm" size="xs" val="Yes" label="Ya" :model-value="tmpData.status_4" color="blue" />
                                                <q-radio size="xs" val="No" label="Tidak" :model-value="tmpData.status_4" color="blue" />                              
                                            </div>
                                        </div>              
                                    </div>
                                    <q-separator />
                                    <div class="row q-col-gutter-md q-px-sm q-mt-xs">
                                        <div class="col-12 col-md-3">                        
                                            <p class="text-bold">Syarat</p>
                                            <p class="q-pt-sm">Standard Lainnya</p>
                                        </div>    
                                        <div class="col-12 col-md-4 text-center"> 
                                            <p class="text-bold">Status</p>
                                            <div class="q-mb-xs">
                                                <q-radio class="q-mr-sm" size="xs" val="Yes" label="Ya" :model-value="tmpData.status_5" color="blue" />
                                                <q-radio size="xs" val="No" label="Tidak" :model-value="tmpData.status_5" color="blue" />                              
                                            </div>
                                        </div>                  
                                    </div>
                                </q-card-section>
                                    <q-card-section>
                                        <q-table
                                            dense
                                            title="List Upload Data"
                                            row-key="name"
                                            :rows="listFileQualityEnvironment"
                                            :columns="columnFileQualityEnvironment"
                                            :filter="filterFileQualityEnvironment"                 
                                        >
                                            <template v-slot:top-right>
                                                <q-input borderless dense debounce="300" v-model="filterFileQualityEnvironment" placeholder="Search">
                                                    <template v-slot:append>
                                                        <q-icon name="search" />
                                                    </template>
                                                </q-input>
                                            </template>
                                            <template v-slot:body-cell-no="props">
                                                <q-td :props="props">
                                                    {{ props.rowIndex+1 }}
                                                </q-td>
                                            </template>
                                            <template v-slot:body-cell-details_upload="props">
                                                <q-td :props="props">
                                                    <a :href="`${ftp_link}`+props.row.details_upload_app+'.pdf'" class="tw-text-xs text-light-blue-10" target="_blank">{{ props.row.details_upload }}</a>
                                                </q-td>
                                            </template>
                                        </q-table>
                                    </q-card-section>
                            </q-card>
                        </q-expansion-item>
                        
                        <q-separator />

                        <q-expansion-item 
                            switch-toggle-side
                            expand-separator
                            group="somegroup" 
                            icon="view_list" 
                            label="Pakta Integritas" 
                            header-class="bg-grey-2 text-blue-grey-7"
                        >
                            <q-card>
                                <q-card-section>
                                    <q-table
                                        dense
                                        title="List Data"
                                        row-key="name"
                                        :rows="listPaktaIntegritas"
                                        :columns="columnPaktaIntegritas"  
                                        :filter="filterPaktaIntegritas"                 
                                    >
                                        <template v-slot:top-right>
                                            <q-input borderless dense debounce="300" v-model="filterPaktaIntegritas" placeholder="Search">
                                                <template v-slot:append>
                                                    <q-icon name="search" />
                                                </template>
                                            </q-input>
                                        </template>
                                        <template v-slot:no-option>
                                            <q-item>
                                                <q-item-section class="text-grey">
                                                No results
                                                </q-item-section>
                                            </q-item>
                                        </template>
                                        <template v-slot:body-cell-no="props">
                                            <q-td :props="props">
                                                {{ props.rowIndex+1 }}
                                            </q-td>
                                        </template>
                                        <template v-slot:body-cell-details_upload="props">
                                            <q-td :props="props">
                                                <a :href="`${ftp_link}`+props.row.details_upload_app+'.pdf'" class="tw-text-xs text-light-blue-10" target="_blank">{{ props.row.details_upload }}</a>
                                            </q-td>
                                        </template>
                                    </q-table>
                                </q-card-section>
                            </q-card>
                        </q-expansion-item>

                        <q-separator />

                        <q-expansion-item 
                            switch-toggle-side
                            expand-separator
                            group="somegroup" 
                            icon="view_list" 
                            label="Pengalaman Perusahaan" 
                            header-class="bg-grey-2 text-blue-grey-7"
                        >
                            <q-card>
                                <q-card-section>
                                    <q-table
                                        dense
                                        title="List Data"
                                        row-key="name"
                                        :rows="listPengalamanPers"
                                        :columns="columnPengalamanPers"
                                        :filter="filterPengalamanPers"                
                                    >
                                        <template v-slot:top-right>
                                            <q-input borderless dense debounce="300" v-model="filterPengalamanPers" placeholder="Search">
                                                <template v-slot:append>
                                                    <q-icon name="search" />
                                                </template>
                                            </q-input>
                                        </template>
                                        <template v-slot:body-cell-no="props">
                                            <q-td :props="props">
                                                {{ props.rowIndex+1 }}
                                            </q-td>
                                        </template>
                                    </q-table>
                                </q-card-section>
                                <q-card-section>
                                    <q-table
                                        dense
                                        title="List Upload Data"
                                        row-key="name"
                                        :rows="listFilePengalamanPers"
                                        :columns="columnFilePengalamanPers"
                                        :filter="filterFilePengalamanPers"                 
                                    >
                                        <template v-slot:top-right>
                                            <q-input borderless dense debounce="300" v-model="filterFilePengalamanPers" placeholder="Search">
                                                <template v-slot:append>
                                                    <q-icon name="search" />
                                                </template>
                                            </q-input>
                                        </template>
                                        <template v-slot:body-cell-no="props">
                                            <q-td :props="props">
                                                {{ props.rowIndex+1 }}
                                            </q-td>
                                        </template>
                                        <template v-slot:body-cell-details_upload="props">
                                            <q-td :props="props">
                                                <a :href="`${ftp_link}`+props.row.details_upload_app+'.pdf'" class="tw-text-xs text-light-blue-10" target="_blank">{{ props.row.details_upload }}</a>
                                            </q-td>
                                        </template>
                                    </q-table>
                                </q-card-section>
                            </q-card>
                        </q-expansion-item>
                        
                        <q-separator />

                        <q-expansion-item 
                            switch-toggle-side
                            expand-separator
                            group="somegroup" 
                            icon="view_list" 
                            label="Company Profile" 
                            header-class="bg-grey-2 text-blue-grey-7"
                        >
                            <q-card>
                                <q-card-section>
                                    <q-table
                                        dense
                                        title="List Data"
                                        row-key="upload_id"
                                        :rows="listCompro"
                                        :columns="columnsComPro"
                                        :filter="filterCompro"                 
                                    >
                                        <template v-slot:top-right>
                                            <q-input borderless dense debounce="300" v-model="filterCompro" placeholder="Search">
                                                <template v-slot:append>
                                                    <q-icon name="search" />
                                                </template>
                                            </q-input>
                                        </template>
                                        <template v-slot:body-cell-no="props">
                                            <q-td :props="props">
                                                {{ props.rowIndex+1 }}
                                            </q-td>
                                        </template>
                                        <template v-slot:body-cell-details_upload="props">
                                            <q-td :props="props">
                                                <a :href="`${ftp_link}`+props.row.details_upload_app+'.pdf'" class="tw-text-xs text-light-blue-10" target="_blank">{{ props.row.details_upload }}</a>
                                            </q-td>
                                        </template>
                                    </q-table>
                                </q-card-section>
                            </q-card>
                        </q-expansion-item>
                        
                        <q-separator />

                        <q-expansion-item 
                            switch-toggle-side
                            expand-separator
                            group="somegroup" 
                            icon="view_list" 
                            label="Scope Kerja" 
                            header-class="bg-grey-2 text-blue-grey-7"
                        >
                            <q-card>
                                <q-card-section>
                                    <div class="row q-gutter-sm">
                                        <div class="col-12 col-md-12">
                                            <span class="text-indigo-10 tw-text-xl text-bold">SCOPE KERJA</span>
                                        </div>
                                        <div class="col-12 col-md-12">
                                            <q-input dense outlined type="textarea" color="blue" :model-value="scopeKerja" readonly />
                                        </div>
                                    </div>
                                </q-card-section>
                            </q-card>
                        </q-expansion-item>
                    </q-list>
            </q-card-section>
        </q-card>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import axios from "axios";
import { ParseError, domain, empid } from "./../../utils";
import { useQuasar } from "quasar";
import { Field, Form } from "vee-validate";
import * as yup from "yup";
import { useRouter, useRoute } from "vue-router";

const columnKontak = [ 
{
    name: "no",
    required: true,
    label: "#",
    align: "left",
    field: "sup_dtl_id",
    sortable: true,
},
{
    name: "details_content_1",
    required: true,
    label: "Nama Lengkap",
    align: "left",
    field: "details_content_1",
    sortable: true,
},
{
    name: "details_content_2",
    required: true,
    label: "Jabatan",
    align: "left",
    field: "details_content_2",
    sortable: true,
},
{
    name: "details_content_6",
    required: true,
    label: "Jenis Kelamin",
    align: "left",
    field: "details_content_6",
    sortable: true,
},
{
    name: "details_content_3",
    required: true,
    label: "No. Telepon",
    align: "left",
    field: "details_content_3",
    sortable: true,
},
{
    name: "details_content_4",
    required: true,
    label: "No. HP",
    align: "left",
    field: "details_content_4",
    sortable: true,
},
{
    name: "details_content_5",
    required: true,
    label: "Email",
    align: "left",
    field: "details_content_5",
    sortable: true,
},
]

const columnDireksi = [ 
{
    name: "no",
    required: true,
    label: "#",
    align: "left",
    field: "sup_dtl_id",
    sortable: true,
},
{
    name: "details_content_1",
    required: true,
    label: "Nama Lengkap",
    align: "left",
    field: "details_content_1",
    sortable: true,
},
{
    name: "details_content_2",
    required: true,
    label: "NIK",
    align: "left",
    field: "details_content_2",
    sortable: true,
},
{
    name: "details_content_3",
    required: true,
    label: "Jabatan",
    align: "left",
    field: "details_content_3",
    sortable: true,
},
{
    name: "details_content_4",
    required: true,
    label: "Email",
    align: "left",
    field: "details_content_4",
    sortable: true,
},
]

const columnVendorTransporter = [ 
{
    name: "no",
    required: true,
    label: "#",
    align: "left",
    field: "upload_id",
    sortable: true,
},
{
    name: "details_upload",
    required: true,
    label: "File",
    align: "left",
    field: "details_upload",
    sortable: true,
},
]

const columnPenandaKontrak = [ 
    {
        name: "no",
        required: true,
        label: "#",
        align: "left",
        field: "sup_dtl_id",
        sortable: true,
    },
    {
        name: "details_content_1",
        required: true,
        label: "Nama Lengkap",
        align: "left",
        field: "details_content_1",
        sortable: true,
    },
    {
        name: "details_content_2",
        required: true,
        label: "NIK",
        align: "left",
        field: "details_content_2",
        sortable: true,
    },
    {
        name: "details_content_3",
        required: true,
        label: "Jabatan",
        align: "left",
        field: "details_content_3",
        sortable: true,
    },
    {
        name: "details_content_4",
        required: true,
        label: "Email",
        align: "left",
        field: "details_content_4",
        sortable: true,
    },
    {
        name: "details_content_5",
        required: true,
        label: "Tgl. Buat",
        align: "left",
        field: "details_content_5",
        sortable: true,
    },
    {
        name: "details_content_6",
        required: true,
        label: "Direksi",
        align: "left",
        field: "details_content_6",
        sortable: true,
    },
    {
        name: "details_content_7",
        required: true,
        label: "Surat Kuasa",
        align: "left",
        field: "details_content_7",
        sortable: true,
    },
]

const columnRekeningBank = [ 
{
    name: "no",
    required: true,
    label: "#",
    align: "left",
    field: "sup_dtl_id",
    sortable: true,
},
{
    name: "details_content_1",
    required: true,
    label: "Nama Bank",
    align: "left",
    field: "details_content_1",
    sortable: true,
},
{
    name: "details_content_2",
    required: true,
    label: "Alamat",
    align: "left",
    field: row => row.details_content_2+row.details_content_6+row.details_content_7,
    sortable: true,
},
{
    name: "details_content_3",
    required: true,
    label: "No. Rekening / IBAN",
    align: "left",
    field: "details_content_3",
    sortable: true,
},
{
    name: "details_content_4",
    required: true,
    label: "Nama Pemilik",
    align: "left",
    field: "details_content_4",
    sortable: true,
},
{
    name: "details_content_5",
    required: true,
    label: "Mata Uang",
    align: "left",
    field: "details_content_5",
    sortable: true,
},
{
    name: "details_content_11",
    required: true,
    label: "Top",
    align: "left",
    field: "details_content_11",
    sortable: true,
},
{
    name: "sup_code",
    required: true,
    label: "Swift Code",
    align: "left",
    field: "sup_code",
    sortable: true,
},
]

const columnGroupPers = [ 
{
    name: "no",
    required: true,
    label: "#",
    align: "left",
    field: "sup_dtl_id",
    sortable: true,
},
{
    name: "details_content_1",
    required: true,
    label: "Nama Perusahaan",
    align: "left",
    field: "details_content_1",
    sortable: true,
},
{
    name: "details_content_2",
    required: true,
    label: "Sektor Bisnis",
    align: "left",
    field: "details_content_2",
    sortable: true,
},
{
    name: "details_content_3",
    required: true,
    label: "Kontak Person",
    align: "left",
    field: "details_content_3",
    sortable: true,
},
{
    name: "details_content_4",
    required: true,
    label: "Telepon",
    align: "left",
    field: "details_content_4",
    sortable: true,
},
{
    name: "details_content_5",
    required: true,
    label: "Fax",
    align: "left",
    field: "details_content_5",
    sortable: true,
},
{
    name: "details_content_6",
    required: true,
    label: "Alamat",
    align: "left",
    field: row => row.details_content_6+row.details_content_7+row.details_content_8,
    sortable: true,
}, 
]

const columnNamaPejabat = [ 
{
    name: "no",
    required: true,
    label: "#",
    align: "left",
    field: "sup_dtl_id",
    sortable: true,
},
{
    name: "details_content_1",
    required: true,
    label: "Nama Lengkap",
    align: "left",
    field: "details_content_1",
    sortable: true,
},
{
    name: "details_content_2",
    required: true,
    label: "NPWP",
    align: "left",
    field: "details_content_2",
    sortable: true,
},
{
    name: "details_content_3",
    required: true,
    label: "Jabatan",
    align: "left",
    field: "details_content_3",
    sortable: true,
},
{
    name: "details_content_4",
    required: true,
    label: "Tgl. Berlaku",
    align: "left",
    field: "details_content_4",
    sortable: true,
},
{
    name: "details_content_5",
    required: true,
    label: "Lokasi Kerja",
    align: "left",
    field: "details_content_5",
    sortable: true,
},
]

const columnPaktaIntegritas = [ 
{
    name: "no",
    required: true,
    label: "#",
    align: "left",
    field: "upload_id",
    sortable: true,
},
{
    name: "details_upload",
    required: true,
    label: "File",
    align: "left",
    field: "details_upload",
    sortable: true,
},
]

const columnsComPro = [ 
{
    name: "no",
    required: true,
    label: "#",
    align: "left",
    field: "upload_id",
    sortable: true,
},
{
    name: "details_upload",
    required: true,
    label: "File",
    align: "left",
    field: "details_upload",
    sortable: true,
},
]

const columnPengalamanPers = [ 
{
    name: "no",
    required: true,
    label: "#",
    align: "left",
    field: "sup_dtl_id",
    sortable: true,
},
{
    name: "details_content_1",
    required: true,
    label: "Keterangan Pekerjaan",
    align: "left",
    field: "details_content_1",
    sortable: true,
},
{
    name: "details_content_2",
    required: true,
    label: "Lokasi",
    align: "left",
    field: "details_content_2",
    sortable: true,
},
{
    name: "details_content_3",
    required: true,
    label: "Nama Pelanggan",
    align: "left",
    field: "details_content_3",
    sortable: true,
},
{
    name: "details_content_4",
    required: true,
    label: "Nilai Kontrak",
    align: "left",
    field: "details_content_4",
    sortable: true,
},
]

const columnFileVendorAgenResmi = [ 
{
    name: "no",
    required: true,
    label: "#",
    align: "left",
    field: "upload_id",
    sortable: true,
},
{
    name: "details_upload",
    required: true,
    label: "File",
    align: "left",
    field: "details_upload",
    sortable: true,
}, 
]

const columnFileKontraktorSipil = [ 
{
    name: "no",
    required: true,
    label: "#",
    align: "left",
    field: "upload_id",
    sortable: true,
},
{
    name: "details_upload",
    required: true,
    label: "File",
    align: "left",
    field: "details_upload",
    sortable: true,
}, 
]

const columnFileRekeningBank = [ 
{
    name: "no",
    required: true,
    label: "#",
    align: "left",
    field: "upload_id",
    sortable: true,
},
{
    name: "details_upload",
    required: true,
    label: "File",
    align: "left",
    field: "details_upload",
    sortable: true,
}, 
]

const columnFileNamaPejabat = [ 
{
    name: "no",
    required: true,
    label: "#",
    align: "left",
    field: "upload_id",
    sortable: true,
},
{
    name: "details_upload",
    required: true,
    label: "File",
    align: "left",
    field: "details_upload",
    sortable: true,
}, 
]

const columnFileQualityEnvironment = [ 
{
    name: "no",
    required: true,
    label: "#",
    align: "left",
    field: "upload_id",
    sortable: true,
},
{
    name: "details_upload",
    required: true,
    label: "File",
    align: "left",
    field: "details_upload",
    sortable: true,
}, 
]

const columnFilePengalamanPers = [ 
{
    name: "no",
    required: true,
    label: "#",
    align: "left",
    field: "upload_id",
    sortable: true,
},
{
    name: "details_upload",
    required: true,
    label: "File",
    align: "left",
    field: "details_upload",
    sortable: true,
}, 
]

const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const listKontak = ref([]);
const listDireksi = ref([]);
const listVendorTransporter = ref([]);
const listRekeningBank = ref([]);
const listPenandaKontrak = ref([]);
const listGroupPers = ref([]);
const listNamaPejabat = ref([]);
const listPaktaIntegritas = ref([]);
const listCompro = ref([]);
const listPengalamanPers = ref([]);

const listFileVendorAgenResmi = ref([]);
const listFileKontraktorSipil = ref([]);
const listFileRekeningBank = ref([]);
const listFileNamaPejabat = ref([]);
const listFileQualityEnvironment = ref([]);
const listFilePengalamanPers = ref([]);

const ftp_link = import.meta.env.VITE_FTP_LINK;

const filterKontak = ref();
const filterDireksi = ref();
const filterKontrak = ref();
const filterVendorTransporter = ref();
const filterRekeningBank = ref();
const filterGroupPers = ref();
const filterNamaPejabat = ref();
const filterPaktaIntegritas = ref();
const filterCompro = ref();
const filterPengalamanPers = ref();

const filterFileVendorAgenResmi = ref();
const filterFileKontraktorSipil = ref();
const filterFileRekeningBank = ref();
const filterFileNamaPejabat = ref();
const filterFileQualityEnvironment = ref();
const filterFilePengalamanPers = ref();

const scopeKerja = ref();

// const pagination = ref({
//     sortBy: "details_content_1",
//     descending: true,
//     page: 1,
//     rowsPerPage: 5,
//     rowsNumber: 5,
//     filter: null,
//     from: 0,
// });

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

    nodok_1_agen: "",
    tglkeluar_1_agen: "",
    tglakhir_1_agen: "",

    nodok_1_kontraktor: "",
    tglkeluar_1_kontraktor: "",
    tglakhir_1_kontraktor: "",

    nodok_2_kontraktor: "",
    tglkeluar_2_kontraktor: "",
    tglakhir_2_kontraktor: "",

    status_1: "",
    status_2: "",
    status_3: "",
    status_4: "",
    status_5: "",
    versi_1: "",
    versi_2: "",
    versi_3: "",
});

const getKontak = async () => {
    try {
        // $q.loading.show();
        const res = await axios.get("getVendKontakPerson", {
            params: {
                npwp: empid(),
            },
        });

        listKontak.value = res.data;
        // $q.loading.hide();
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }
};

const getDireksi = async () => {
    try {
        // $q.loading.show();
        const res = await axios.get("getVendDewanDireksi", {
            params: {
                npwp: empid(),
            },
        });

        listDireksi.value = res.data;
        // $q.loading.hide();
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }
};

const getAdminUmum = async () => {
    try {
        // $q.loading.show();
        const res = await axios.get("getVendAdminUmum", {
            params: {
                npwp: empid(),
            },
        });

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

        // listDireksi.value = res.data;
        // $q.loading.hide();
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }
};

const getVendorTransporter = async () => {
    try {
        // $q.loading.show();
        const res = await axios.get("getVendVendorTransporter", {
            params: {
                npwp: empid(),
            },
        });

        // console.log(res);
        listVendorTransporter.value = res.data;
        // listVendorTransporter.value = res.data.data;
        // $q.loading.hide();
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }
}

const getVendorAgenResmi = async () => {
    try {
        const res = await axios.get("getVendVendorAgenResmi", {
            params: {
                npwp: empid(),
            },
        });

        if(res.data){
            tmpData.nodok_1_agen = res.data.data1[0].dok;
            tmpData.tglkeluar_1_agen = res.data.data1[1].tglkeluar;
            tmpData.tglakhir_1_agen = res.data.data1[2].tglakhir;
        }
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }    
}

const getKontraktorSipil = async () => {
    try {
        const res = await axios.get("getVendKontraktorSipil", {
            params: {
                npwp: empid(),
            },
        });

        if(res.data){
            tmpData.nodok_1_kontraktor = res.data.data1[0].dok;
            tmpData.tglkeluar_1_kontraktor = res.data.data1[1].tglkeluar;
            tmpData.tglakhir_1_kontraktor = res.data.data1[2].tglakhir;

            tmpData.nodok_2_kontraktor = res.data.data2[0].dok;
            tmpData.tglkeluar_2_kontraktor = res.data.data2[1].tglkeluar;
            tmpData.tglakhir_2_kontraktor = res.data.data2[2].tglakhir;
        }
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }    
}

const getRekeningBank = async () => {
    try {
        // $q.loading.show();
        const res = await axios.get("getVendRekeningBank", {
            params: {
                npwp: empid(),
            },
        });

        listRekeningBank.value = res.data;
        // $q.loading.hide();
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }
};

const getPenandaKontrak = async () => {
    try {
        // $q.loading.show();
        const res = await axios.get("getVendPenandaKontrak", {
            params: {
                npwp: empid(),
            },
        });
        listPenandaKontrak.value = res.data;
        // $q.loading.hide();
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }
};

const getGroupPers = async () => {
    try {
        // $q.loading.show();
        const res = await axios.get("getVendGroupPerusahaan", {
            params: {
                npwp: empid(),
            },
        });

        listGroupPers.value = res.data;
        // $q.loading.hide();
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }
};

const getNamaPejabat = async () => {
    try {
        // $q.loading.show();
        const res = await axios.get("getVendNamaPejabat", {
            params: {
                npwp: empid(),
            },
        });

        listNamaPejabat.value = res.data;
        // $q.loading.hide();
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }
};

const getQualityEnvironment = async () => {
    try {
        const res = await axios.get("getVendQualityEnvironment", {
            params: {
                npwp: empid(),
            },
        });  

        if(res.data){
            tmpData.status_1 = res.data.data1[0];
            tmpData.status_2 = res.data.data2[0];
            tmpData.status_3 = res.data.data3[0];
            tmpData.status_4 = res.data.data4[0];
            tmpData.status_5 = res.data.data5[0];
            tmpData.versi_1 = res.data.data1[1];
            tmpData.versi_2 = res.data.data2[1];
            tmpData.versi_3 = res.data.data3[1];
        }
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }    
}

const getPaktaIntegritas = async () => {
    try {
        // $q.loading.show();
        const res = await axios.get("getVendPaktaIntegritas", {
            params: {
                npwp: empid(),
            },
        });

        listPaktaIntegritas.value = res.data;
        // listVendorTransporter.value = res.data.data;
        // $q.loading.hide();
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }
}

const getCompro = async () => {
    try {
        // $q.loading.show();
        const res = await axios.get("getCompanyProfileUpd", {
            params: {
                npwp: empid(),
            },
        });

        listCompro.value = res.data;
        // $q.loading.hide();
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }
};

const getScopeKerja = async () => {
    try {
        // $q.loading.show();
        const res = await axios.get("getScopeKerjaDok", {
            params: {
                npwp: empid(),
            },
        });
        
        scopeKerja.value = res.data;
        // $q.loading.hide();
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }
};

const getPengalamanPers = async () => {
    try {
        // $q.loading.show();
        const res = await axios.get("getVendPengalamanPers", {
            params: {
                npwp: empid(),
            },
        });

        listPengalamanPers.value = res.data;
        // $q.loading.hide();
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }
};

const getFileVendorAgenResmi = async () => {
    try {
        const res = await axios.get("getVendFileVendorAgenResmi", {
            params: {
                npwp: empid(),
            },
        });

        listFileVendorAgenResmi.value = res.data;
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }    
}

const getFileKontraktorSipil = async () => {
    try {
        const res = await axios.get("getVendFileKontraktorSipil", {
            params: {
                npwp: empid(),
            },
        });

        listFileKontraktorSipil.value = res.data;
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }    
}

const getFileRekeningBank = async () => {
    try {
        const res = await axios.get("getVendFileRekeningBank", {
            params: {
                npwp: empid(),
            },
        });

        listFileRekeningBank.value = res.data;
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }    
}

const getFileNamaPejabat = async () => {
    try {
        const res = await axios.get("getVendFileNamaPejabat", {
            params: {
                npwp: empid(),
            },
        });

        listFileNamaPejabat.value = res.data;
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }    
}

const getFileQualityEnvironment = async () => {
    try {
        const res = await axios.get("getVendFileQualityEnvironment", {
            params: {
                npwp: empid(),
            },
        });

        listFileQualityEnvironment.value = res.data;
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }    
}

const getFilePengalamanPers = async () => {
    try {
        const res = await axios.get("getVendFilePengalamanPers", {
            params: {
                npwp: empid(),
            },
        });

        listFilePengalamanPers.value = res.data;
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }    
}

onMounted(() => {
    getKontak();
    getDireksi();
    getAdminUmum();
    getVendorTransporter();
    getVendorAgenResmi();
    getKontraktorSipil();
    getRekeningBank();
    getPenandaKontrak();
    getGroupPers();
    getNamaPejabat();
    getQualityEnvironment();
    getPaktaIntegritas();
    getCompro();
    getScopeKerja();
    getPengalamanPers();

    getFileVendorAgenResmi();

    getFileKontraktorSipil();
    getFileRekeningBank();
    getFileNamaPejabat();
    getFileQualityEnvironment();
    getFilePengalamanPers();
});

// window.localStorage.clear();
</script>