<template>
    <div class="q-pa-md">
        <q-card>
            <q-card-section>
                <div class="tw-text-lg tw-font-semibold">
                    UPDATE KELENGKAPAN DOKUMEN
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
                                    <div class="row q-col-gutter-md">    
                                        <div class="col-12 col-md-12">
                                            <q-btn
                                                unelevated
                                                size="md"
                                                color="secondary"
                                                label="Tambah"
                                                type="button"
                                                @click="addKontak"
                                                class="tw-mr-2"
                                            />
                                        </div>
                                        <div class="col-12 col-md-12">
                                            <q-table
                                                dense
                                                hide-bottom
                                                :rows-per-page-options="[0]"
                                                title="List Data"
                                                row-key="sup_dtl_id"  
                                                :rows="listKontak"
                                                :columns="columnKontak"
                                            >
                                                <template v-slot:body-cell-no="props">
                                                    <q-td :props="props">
                                                        {{ props.rowIndex+1 }}
                                                    </q-td>
                                                </template>
                                                <template v-slot:body-cell-status_update="props">
                                                <q-td :props="props">
                                                    <span v-if="props.row.active === 'true'" style="color : green; font-weight: bold;">{{ props.row.status_update === 'true' ? 'New' : '' }}</span> 
                                                </q-td>
                                                </template>
                                                <template v-slot:body-cell-aksi="props">
                                                    <q-td :props="props">
                                                    <q-btn-group push v-if="props.row.active === 'true'">
                                                        <q-btn
                                                            dense
                                                            color="negative"
                                                            class="text-weight-regular text-caption"
                                                            @click="nonActive(props.row)"
                                                            push
                                                            label="Non-Active"
                                                            size="sm"
                                                        />
                                                    </q-btn-group>
                                                    </q-td>
                                                </template>
                                            </q-table>
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
                            label="Daftar Dewan Direksi" 
                            header-class="bg-grey-2 text-blue-grey-7"
                        >
                            <q-card>
                                <q-card-section>
                                    <div class="row q-col-gutter-md">    
                                        <div class="col-12 col-md-12">
                                            <q-btn
                                                unelevated
                                                size="md"
                                                color="secondary"
                                                label="Tambah"
                                                type="button"
                                                @click="addDewan"
                                                class="tw-mr-2"
                                            />
                                        </div>
                                        <div class="col-12 col-md-12">
                                            <q-table
                                                dense
                                                hide-bottom
                                                :rows-per-page-options="[0]"
                                                title="List Data"
                                                row-key="sup_dtl_id"
                                                :rows="listDireksi"
                                                :columns="columnDireksi"                
                                            >
                                                <template v-slot:body-cell-no="props">
                                                    <q-td :props="props">
                                                        {{ props.rowIndex+1 }}
                                                    </q-td>
                                                </template>
                                                <template v-slot:body-cell-status_update="props">
                                                <q-td :props="props">
                                                    <span v-if="props.row.active === 'true'" style="color : green; font-weight: bold;">{{ props.row.status_update === 'true' ? 'New' : '' }}</span> 
                                                </q-td>
                                                </template>
                                                <template v-slot:body-cell-aksi="props">
                                                    <q-td :props="props">
                                                    <q-btn-group push v-if="props.row.active === 'true'">
                                                        <q-btn
                                                            dense
                                                            color="negative"
                                                            class="text-weight-regular text-caption"
                                                            @click="nonActive(props.row)"
                                                            push
                                                            label="Non-Active"
                                                            size="sm"
                                                        />
                                                    </q-btn-group>
                                                    </q-td>
                                                </template>
                                            </q-table>
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
                            label="Penandatangan Kontrak" 
                            header-class="bg-grey-2 text-blue-grey-7"
                        >
                            <q-card>
                                <q-card-section>
                                    <div class="row q-col-gutter-md q-pl-sm q-mb-md">
                                        <div class="col-12 col-md-12">
                                            <q-table
                                                dense
                                                hide-bottom
                                                :rows-per-page-options="[0]"
                                                title="Dokumen Penandatangan Kontrak"
                                                row-key="sup_dtl_id"
                                                :rows="listPenandaKontrak"
                                                :columns="columnPenandaKontrak"
                                            >
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
                                                <template v-slot:body-cell-status_update="props">
                                                    <q-td :props="props">
                                                        <span v-if="props.row.active === 'true'" style="color : green; font-weight: bold;">{{ props.row.status_update === 'true' ? 'New' : '' }}</span> 
                                                    </q-td>
                                                </template>
                                                <template v-slot:body-cell-aksi="props">
                                                    <q-td :props="props">
                                                    <q-btn-group push v-if="props.row.active === 'true'">
                                                        <q-btn
                                                            dense
                                                            color="negative"
                                                            class="text-weight-regular text-caption"
                                                            @click="nonActive(props.row)"
                                                            push
                                                            label="Non-Active"
                                                            size="sm"
                                                        />
                                                    </q-btn-group>
                                                    </q-td>
                                                </template>
                                            </q-table>
                                        </div>
                                    </div>
                                    <div class="row q-col-gutter-md q-px-sm q-mb-md">
                                        <div class="col-12 col-md-4">
                                            <q-btn color="secondary" label="Tambah Data" @click="addPenandaKontrak" class="tw-mr-2"/>
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
                            label="Kelengkapan Administrasi Umum" 
                            header-class="bg-grey-2 text-blue-grey-7"
                        >
                            <q-card>
                                <q-card-section>
                                    <div class="row q-col-gutter-md q-px-sm q-mb-md">
                                        <div class="col-12 col-md-3">                        
                                            <p class="">Akte Pendirian Perusahaan + SK Kemenkumham</p>
                                        </div>
                                        <div class="col-12 col-md-2">
                                            <q-input stack-label dense outlined label="Nomor Dokumen" :model-value="tmpData.nodok_1" readonly />
                                        </div>
                                        <div class="col-12 col-md-2">
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
                                        <div class="col-12 col-md-2">
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
                                        <div class="col-12 col-md-2">
                                            <p class="tw-text-xs">File Attachment :</p> <a :href="`${ftp_link}`+tmpData.file_1_view" v-if="tmpData.file_1_view != null" class="tw-text-xs text-italic text-light-blue-10" target="_blank">{{ tmpData.file_1_view }}</a>
                                        </div>
                                        <div class="col-12 col-md-1">
                                            <q-btn
                                                dense
                                                color="secondary"
                                                class="text-weight-regular text-caption"
                                                @click="updateKD(1)"
                                                push
                                                label="Update"
                                                size="sm"
                                            />   
                                        </div>
                                    </div>
                                    <q-separator />
                                    <div class="row q-col-gutter-md q-px-sm q-mt-xs q-mb-md">
                                        <div class="col-12 col-md-3">                        
                                            <p class="">Akte Perubahan Terakhir + SK Kemenkumham</p>
                                        </div>
                                        <div class="col-12 col-md-2">
                                            <q-input dense outlined label="Nomor Dokumen" :model-value="tmpData.nodok_2" readonly />
                                        </div>
                                        <div class="col-12 col-md-2">
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
                                        <div class="col-12 col-md-2">
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
                                        <div class="col-12 col-md-2">
                                            <p class="tw-text-xs">File Attachment :</p> <a :href="`${ftp_link}`+tmpData.file_2_view" v-if="tmpData.file_2_view != null" class="tw-text-xs text-italic text-light-blue-10" target="_blank">{{ tmpData.file_2_view }}</a>
                                        </div>
                                        <div class="col-12 col-md-1">
                                            <q-btn
                                                dense
                                                color="secondary"
                                                class="text-weight-regular text-caption"
                                                @click="updateKD(2)"
                                                push
                                                label="Update"
                                                size="sm"
                                            />   
                                        </div>
                                    </div>
                                    <q-separator />
                                    <div class="row q-col-gutter-md q-px-sm q-mt-xs q-mb-md">
                                        <div class="col-12 col-md-3">                        
                                            <p class="">Izin Usaha (Sesuai NIB)</p>
                                        </div>
                                        <div class="col-12 col-md-2">
                                            <q-input dense outlined label="Nomor Dokumen" :model-value="tmpData.nodok_3" readonly />
                                        </div>
                                        <div class="col-12 col-md-2">
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
                                        <div class="col-12 col-md-2">
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
                                        <div class="col-12 col-md-2">
                                            <p class="tw-text-xs">File Attachment :</p> <a :href="`${ftp_link}`+tmpData.file_3_view" v-if="tmpData.file_3_view != null" class="tw-text-xs text-italic text-light-blue-10" target="_blank">{{ tmpData.file_3_view }}</a>
                                        </div>
                                        <div class="col-12 col-md-1">
                                            <q-btn
                                                dense
                                                color="secondary"
                                                class="text-weight-regular text-caption"
                                                @click="updateKD(3)"
                                                push
                                                label="Update"
                                                size="sm"
                                            />   
                                        </div>
                                    </div>
                                    <q-separator />
                                    <div class="row q-col-gutter-md q-px-sm q-mt-xs q-mb-md">
                                        <div class="col-12 col-md-3">                        
                                            <p class="">NIB Berbasis Resiko</p>
                                        </div>
                                        <div class="col-12 col-md-2">
                                            <q-input stack-label dense outlined label="Nomor Dokumen" :model-value="tmpData.nodok_4" readonly />
                                        </div>
                                        <div class="col-12 col-md-2">
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
                                        <div class="col-12 col-md-2">
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
                                        <div class="col-12 col-md-2">
                                            <p class="tw-text-xs">File Attachment :</p> <a :href="`${ftp_link}`+tmpData.file_4_view" v-if="tmpData.file_4_view != null" class="tw-text-xs text-italic text-light-blue-10" target="_blank">{{ tmpData.file_4_view }}</a>
                                        </div>
                                        <div class="col-12 col-md-1">
                                            <q-btn
                                                dense
                                                color="secondary"
                                                class="text-weight-regular text-caption"
                                                @click="updateKD(4)"
                                                push
                                                label="Update"
                                                size="sm"
                                            />   
                                        </div>
                                    </div>
                                    <q-separator />
                                    <div class="row q-col-gutter-md q-px-sm q-mt-xs q-mb-md">
                                        <div class="col-12 col-md-3">                        
                                            <p class="">Sertifikat Standard (Sesuai NIB)</p>
                                        </div>
                                        <div class="col-12 col-md-2">
                                            <q-input stack-label dense outlined label="Nomor Dokumen" :model-value="tmpData.nodok_5" readonly />
                                        </div>
                                        <div class="col-12 col-md-2">
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
                                        <div class="col-12 col-md-2">
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
                                        <div class="col-12 col-md-2">
                                            <p class="tw-text-xs">File Attachment :</p> <a :href="`${ftp_link}`+tmpData.file_5_view" v-if="tmpData.file_5_view != null" class="tw-text-xs text-italic text-light-blue-10" target="_blank">{{ tmpData.file_5_view }}</a>
                                        </div>
                                        <div class="col-12 col-md-1">
                                            <q-btn
                                                dense
                                                color="secondary"
                                                class="text-weight-regular text-caption"
                                                @click="updateKD(5)"
                                                push
                                                label="Update"
                                                size="sm"
                                            />   
                                        </div>
                                    </div>
                                    <q-separator />
                                    <div class="row q-col-gutter-md q-px-sm q-mt-xs q-mb-md">
                                        <div class="col-12 col-md-3">                        
                                            <p class="">Surat Keterangan Domisili Perusahaan (SKDP)</p>
                                        </div>
                                        <div class="col-12 col-md-2">
                                            <q-input stack-label dense outlined label="Nomor Dokumen" :model-value="tmpData.nodok_6" readonly />
                                        </div>
                                        <div class="col-12 col-md-2">
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
                                        <div class="col-12 col-md-2">
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
                                        <div class="col-12 col-md-2">
                                            <p class="tw-text-xs">File Attachment :</p> <a :href="`${ftp_link}`+tmpData.file_6_view" v-if="tmpData.file_6_view != null" class="tw-text-xs text-italic text-light-blue-10" target="_blank">{{ tmpData.file_6_view }}</a>
                                        </div>
                                        <div class="col-12 col-md-1">
                                            <q-btn
                                                dense
                                                color="secondary"
                                                class="text-weight-regular text-caption"
                                                @click="updateKD(6)"
                                                push
                                                label="Update"
                                                size="sm"
                                            />   
                                        </div>
                                    </div>
                                    <q-separator />
                                    <div class="row q-col-gutter-md q-px-sm q-mt-xs q-mb-md">
                                        <div class="col-12 col-md-3">                        
                                            <p class="">Nomor Pokok Wajib Pajak (NPWP)</p>
                                        </div>
                                        <div class="col-12 col-md-2">
                                            <q-input stack-label dense outlined label="Nomor Dokumen" :model-value="tmpData.nodok_7" readonly />
                                        </div>
                                        <div class="col-12 col-md-2">
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
                                        <div class="col-12 col-md-2">
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
                                        <div class="col-12 col-md-2">
                                            <p class="tw-text-xs">File Attachment :</p> <a :href="`${ftp_link}`+tmpData.file_7_view" v-if="tmpData.file_7_view != null" class="tw-text-xs text-italic text-light-blue-10" target="_blank">{{ tmpData.file_7_view }}</a>
                                        </div>
                                        <div class="col-12 col-md-1">
                                            <q-btn
                                                dense
                                                color="secondary"
                                                class="text-weight-regular text-caption"
                                                @click="updateKD(7)"
                                                push
                                                label="Update"
                                                size="sm"
                                            />   
                                        </div>
                                    </div>
                                    <q-separator />
                                    <div class="row q-col-gutter-md q-px-sm q-mt-xs q-mb-md">
                                        <div class="col-12 col-md-3">                        
                                            <p class="">Surat Keterangan Terdaftar (SKT)</p>
                                        </div>
                                        <div class="col-12 col-md-2">
                                            <q-input stack-label dense outlined label="Nomor Dokumen" :model-value="tmpData.nodok_8" readonly />
                                        </div>
                                        <div class="col-12 col-md-2">
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
                                        <div class="col-12 col-md-2">
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
                                        <div class="col-12 col-md-2">
                                            <p class="tw-text-xs">File Attachment :</p> <a :href="`${ftp_link}`+tmpData.file_8_view" v-if="tmpData.file_8_view != null" class="tw-text-xs text-italic text-light-blue-10" target="_blank">{{ tmpData.file_8_view }}</a>
                                        </div>
                                        <div class="col-12 col-md-1">
                                            <q-btn
                                                dense
                                                color="secondary"
                                                class="text-weight-regular text-caption"
                                                @click="updateKD(8)"
                                                push
                                                label="Update"
                                                size="sm"
                                            />   
                                        </div>
                                    </div>
                                    <q-separator />
                                    <div class="row q-col-gutter-md q-px-sm q-mt-xs q-mb-md">
                                        <div class="col-12 col-md-3">                        
                                            <p class="">Surat Pengukuhan Pengusaha Kena Pajak (PKP)</p>
                                        </div>
                                        <div class="col-12 col-md-2">
                                            <q-input stack-label dense outlined label="Nomor Dokumen" :model-value="tmpData.nodok_9" readonly />
                                        </div>
                                        <div class="col-12 col-md-2">
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
                                        <div class="col-12 col-md-2">
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
                                        <div class="col-12 col-md-2">
                                            <p class="tw-text-xs">File Attachment :</p> <a :href="`${ftp_link}`+tmpData.file_9_view" v-if="tmpData.file_9_view != null" class="tw-text-xs text-italic text-light-blue-10" target="_blank">{{ tmpData.file_9_view }}</a>
                                        </div>
                                        <div class="col-12 col-md-1">
                                            <q-btn
                                                dense
                                                color="secondary"
                                                class="text-weight-regular text-caption"
                                                @click="updateKD(9)"
                                                push
                                                label="Update"
                                                size="sm"
                                            />   
                                        </div>
                                    </div>
                                    <q-separator />
                                    <div class="row q-col-gutter-md q-px-sm q-mt-xs q-mb-md">
                                        <div class="col-12 col-md-3">                        
                                            <p class="">Daftar Pemilik Saham</p>
                                        </div>
                                        <div class="col-12 col-md-2">
                                            <q-input stack-label dense outlined label="Nomor Dokumen" :model-value="tmpData.nodok_10" readonly />
                                        </div>
                                        <div class="col-12 col-md-2">
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
                                        <div class="col-12 col-md-2">
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
                                        <div class="col-12 col-md-2">
                                            <p class="tw-text-xs">File Attachment :</p> <a :href="`${ftp_link}`+tmpData.file_10_view" v-if="tmpData.file_10_view != null" class="tw-text-xs text-italic text-light-blue-10" target="_blank">{{ tmpData.file_10_view }}</a>
                                        </div>
                                        <div class="col-12 col-md-1">
                                            <q-btn
                                                dense
                                                color="secondary"
                                                class="text-weight-regular text-caption"
                                                @click="updateKD(10)"
                                                push
                                                label="Update"
                                                size="sm"
                                            />   
                                        </div>
                                    </div>
                                    <q-separator />
                                    <div class="row q-col-gutter-md q-px-sm q-mt-xs q-mb-md">
                                        <div class="col-12 col-md-3">                        
                                            <p class="">Struktur Organisasi</p>
                                        </div>
                                        <div class="col-12 col-md-2">
                                            <q-input stack-label dense outlined label="Nomor Dokumen" :model-value="tmpData.nodok_11" readonly />
                                        </div>
                                        <div class="col-12 col-md-2">
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
                                        <div class="col-12 col-md-2">
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
                                        <div class="col-12 col-md-2">
                                            <p class="tw-text-xs">File Attachment :</p> <a :href="`${ftp_link}`+tmpData.file_11_view" v-if="tmpData.file_11_view != null" class="tw-text-xs text-italic text-light-blue-10" target="_blank">{{ tmpData.file_11_view }}</a>
                                        </div>
                                        <div class="col-12 col-md-1">
                                            <q-btn
                                                dense
                                                color="secondary"
                                                class="text-weight-regular text-caption"
                                                @click="updateKD(11)"
                                                push
                                                label="Update"
                                                size="sm"
                                            />   
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
                                    <div class="row q-col-gutter-md q-mb-sm">
                                        <div class="col-12 col-md-12">
                                            <p>Cari File PDF :</p>
                                        </div>
                                    </div>
                                    <div class="row q-col-gutter-md q-mb-md">
                                        <div class="col-12 col-md-8">
                                            <q-file dense outlined v-model="lamp_file" label="Lampiran File" :max-file-size="10000000" accept=".pdf">
                                                <template v-slot:prepend>
                                                <q-icon name="attach_file" />
                                                </template>
                                            </q-file> 
                                        </div>
                                        <div class="col-12 col-md-4">
                                            <q-btn color="secondary" label="Simpan" @click="saveTransporter(11)"/>
                                        </div>
                                    </div>
                                    <div class="row q-col-gutter-md q-mb-md">
                                        <div class="col-12 col-md-12">
                                            <q-table
                                                dense
                                                hide-bottom
                                                :rows-per-page-options="[0]"
                                                row-key="upload_id"
                                                :rows="listVendorTransporter"
                                                :columns="columnVendorTransporter"               
                                            >
                                                <template v-slot:body-cell-no="props">
                                                    <q-td :props="props">
                                                        {{ props.rowIndex+1 }}
                                                    </q-td>
                                                </template>
                                                
                                                <template v-slot:body-cell-aksi="props">
                                                    <q-td :props="props">
                                                    <q-btn-group push>
                                                        <q-btn
                                                            dense
                                                            color="negative"
                                                            class="text-weight-regular text-caption"
                                                            @click="delTransporter(props.row)"
                                                            push
                                                            label="Hapus"
                                                            size="sm"
                                                        />
                                                    </q-btn-group>
                                                    </q-td>
                                                </template>
                                            </q-table>
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
                            label="Kelengkapan tambahan untuk Vendor Keagenan Resmi"       
                            header-class="bg-grey-2 text-blue-grey-7"
                        >
                            <q-card>
                                <q-card-section>
                                    <div class="row q-col-gutter-md q-px-sm q-mb-lg">
                                        <div class="col-12 col-md-3">                        
                                            <p class="">Surat Penunjukan Keagenan Resmi</p>
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input stack-label dense outlined v-model="tmpData.nodok_1_agen" label="Nomor Dokumen" :model-value="tmpData.nodok_1_agen" />
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input
                                                v-model="tmpData.tglkeluar_1_agen"
                                                dense
                                                outlined
                                                autocomplete="off" 
                                                color="blue"
                                                label="Tgl. Dikeluarkan"
                                                mask="##/##/####"
                                                fill-mask="-"
                                                :model-value="tmpData.tglkeluar_1_agen"
                                            >
                                                <template v-slot:append>
                                                    <q-icon name="event" class="cursor-pointer">
                                                        <q-popup-proxy ref="datePopup" cover transition-show="scale" transition-hide="scale">
                                                            <q-date v-model="tmpData.tglkeluar_1_agen" mask="DD/MM/YYYY" color="blue" :model-value="tmpData.tglkeluar_1_agen" minimal>
                                                                <div class="row items-center justify-end">
                                                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                                                </div>
                                                            </q-date>
                                                        </q-popup-proxy>
                                                    </q-icon>
                                                </template>
                                            </q-input>
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input
                                                v-model="tmpData.tglakhir_1_agen"
                                                dense
                                                outlined
                                                autocomplete="off" 
                                                color="blue"
                                                label="Tgl. Berakhir"
                                                mask="##/##/####"
                                                fill-mask="-"
                                                :model-value="tmpData.tglakhir_1_agen"
                                            >
                                                <template v-slot:append>
                                                    <q-icon name="event" class="cursor-pointer">
                                                        <q-popup-proxy ref="datePopup" cover transition-show="scale" transition-hide="scale">
                                                            <q-date v-model="tmpData.tglakhir_1_agen" mask="DD/MM/YYYY" color="blue" :model-value="tmpData.tglakhir_1_agen" minimal>
                                                                <div class="row items-center justify-end">
                                                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                                                </div>
                                                            </q-date>
                                                        </q-popup-proxy>
                                                    </q-icon>
                                                </template>
                                            </q-input>
                                        </div>                        
                                    </div>
                                    <div class="row q-col-gutter-md q-px-sm q-mb-md">
                                        <div class="col-12 col-md-4">
                                            <q-btn color="secondary" label="Simpan" @click="saveAgen" class="tw-mr-2"/>
                                            <q-btn color="blue" label="Upload File" @click="uploadVend(12)" class="tw-mr-2"/>
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
                                            <q-input stack-label dense outlined v-model="tmpData.nodok_1_kontraktor"  :model-value="tmpData.nodok_1_kontraktor" label="Nomor Dokumen" />
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input
                                                v-model="tmpData.tglkeluar_1_kontraktor"
                                                dense
                                                outlined
                                                autocomplete="off" 
                                                color="blue"
                                                label="Tgl. Dikeluarkan"
                                                mask="##/##/####"
                                                fill-mask="-"
                                                :model-value="tmpData.tglkeluar_1_kontraktor"
                                            >
                                                <template v-slot:append>
                                                    <q-icon name="event" class="cursor-pointer">
                                                        <q-popup-proxy ref="datePopup" cover transition-show="scale" transition-hide="scale">
                                                            <q-date v-model="tmpData.tglkeluar_1_kontraktor" mask="DD/MM/YYYY" color="blue" :model-value="tmpData.tglkeluar_1_kontraktor" minimal>
                                                                <div class="row items-center justify-end">
                                                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                                                </div>
                                                            </q-date>
                                                        </q-popup-proxy>
                                                    </q-icon>
                                                </template>
                                            </q-input>
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input
                                                v-model="tmpData.tglakhir_1_kontraktor"
                                                dense
                                                outlined
                                                autocomplete="off" 
                                                color="blue"
                                                label="Tgl. Berakhir"
                                                mask="##/##/####"
                                                fill-mask="-"
                                                :model-value="tmpData.tglakhir_1_kontraktor"
                                            >
                                                <template v-slot:append>
                                                    <q-icon name="event" class="cursor-pointer">
                                                        <q-popup-proxy ref="datePopup" cover transition-show="scale" transition-hide="scale">
                                                            <q-date v-model="tmpData.tglakhir_1_kontraktor" mask="DD/MM/YYYY" color="blue" :model-value="tmpData.tglakhir_1_kontraktor" minimal>
                                                                <div class="row items-center justify-end">
                                                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                                                </div>
                                                            </q-date>
                                                        </q-popup-proxy>
                                                    </q-icon>
                                                </template>
                                            </q-input>
                                        </div>                        
                                    </div>
                                    <q-separator />
                                    <div class="row q-col-gutter-md q-pl-sm q-mt-sm q-mb-lg">
                                        <div class="col-12 col-md-3">
                                            <p class="">Surat Ijin Usaha (SIUJK/LPJK)</p>
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input stack-label dense outlined v-model="tmpData.nodok_2_kontraktor" label="Nomor Dokumen" :model-value="tmpData.nodok_2_kontraktor" />
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input
                                                v-model="tmpData.tglkeluar_2_kontraktor"
                                                dense
                                                outlined
                                                autocomplete="off" 
                                                color="blue"
                                                label="Tgl. Dikeluarkan"
                                                mask="##/##/####"
                                                fill-mask="-"
                                                :model-value="tmpData.tglkeluar_2_kontraktor"
                                            >
                                                <template v-slot:append>
                                                    <q-icon name="event" class="cursor-pointer">
                                                        <q-popup-proxy ref="datePopup" cover transition-show="scale" transition-hide="scale">
                                                            <q-date v-model="tmpData.tglkeluar_2_kontraktor" mask="DD/MM/YYYY" color="blue" :model-value="tmpData.tglkeluar_2_kontraktor" minimal>
                                                                <div class="row items-center justify-end">
                                                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                                                </div>
                                                            </q-date>
                                                        </q-popup-proxy>
                                                    </q-icon>
                                                </template>
                                            </q-input>
                                        </div>
                                        <div class="col-12 col-md-3">
                                            <q-input
                                                v-model="tmpData.tglakhir_2_kontraktor"
                                                dense
                                                outlined
                                                autocomplete="off" 
                                                color="blue"
                                                label="Tgl. Berakhir"
                                                mask="##/##/####"
                                                fill-mask="-"
                                                :model-value="tmpData.tglakhir_2_kontraktor"
                                            >
                                                <template v-slot:append>
                                                    <q-icon name="event" class="cursor-pointer">
                                                        <q-popup-proxy ref="datePopup" cover transition-show="scale" transition-hide="scale">
                                                            <q-date v-model="tmpData.tglakhir_2_kontraktor" mask="DD/MM/YYYY" color="blue" :model-value="tmpData.tglakhir_2_kontraktor" minimal>
                                                                <div class="row items-center justify-end">
                                                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                                                </div>
                                                            </q-date>
                                                        </q-popup-proxy>
                                                    </q-icon>
                                                </template>
                                            </q-input>
                                        </div>                        
                                    </div>
                                    <div class="row q-col-gutter-md q-px-sm q-mb-md">
                                        <div class="col-12 col-md-4">
                                            <q-btn color="secondary" label="Simpan" @click="saveElektrikal" class="tw-mr-2"/>
                                            <q-btn color="blue" label="Upload File" @click="uploadVend(13)" class="tw-mr-2"/>
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
                            label="Rekening Bank" 
                            header-class="bg-grey-2 text-blue-grey-7"
                        >
                            <q-card>
                                <q-card-section>
                                    <div class="row q-col-gutter-md q-pl-sm q-mb-md">
                                        <div class="col-12 col-md-12">
                                            <q-table
                                                dense
                                                hide-bottom
                                                :rows-per-page-options="[0]"
                                                title="List Data"
                                                row-key="sup_dtl_id"
                                                :rows="listRekeningBank"
                                                :columns="columnRekeningBank"
                                            >
                                                <template v-slot:body-cell-no="props">
                                                    <q-td :props="props">
                                                        {{ props.rowIndex+1 }}
                                                    </q-td>
                                                </template>
                                                <template v-slot:body-cell-status_update="props">
                                                    <q-td :props="props">
                                                        <span v-if="props.row.active === 'true'" style="color : green; font-weight: bold;">{{ props.row.status_update === 'true' ? 'New' : '' }}</span> 
                                                    </q-td>
                                                </template>
                                            </q-table>
                                        </div>
                                    </div>
                                    <div class="row q-col-gutter-md q-px-sm q-mb-md">
                                        <div class="col-12 col-md-4">
                                            <q-btn color="secondary" label="Tambah Data" @click="addBank" class="tw-mr-2"/>
                                            <q-btn color="blue" label="Upload File" @click="uploadVend(14)" class="tw-mr-2"/>
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
                            label="Group / Anak Perusahaan" 
                            header-class="bg-grey-2 text-blue-grey-7"
                        >
                            <q-card>
                                <q-card-section>
                                    <div class="row q-col-gutter-md q-pl-sm q-mb-md">
                                        <div class="col-12 col-md-12">
                                            <q-table
                                                dense
                                                hide-bottom
                                                :rows-per-page-options="[0]"
                                                title="List Data"
                                                row-key="sup_dtl_id"
                                                :rows="listGroupPers"
                                                :columns="columnGroupPers"                    
                                            >
                                                <template v-slot:body-cell-no="props">
                                                    <q-td :props="props">
                                                        {{ props.rowIndex+1 }}
                                                    </q-td>
                                                </template>
                                                <template v-slot:body-cell-status_update="props">
                                                    <q-td :props="props">
                                                        <span v-if="props.row.active === 'true'" style="color : green; font-weight: bold;">{{ props.row.status_update === 'true' ? 'New' : '' }}</span> 
                                                    </q-td>
                                                </template>
                                                <template v-slot:body-cell-aksi="props">
                                                    <q-td :props="props">
                                                    <q-btn-group push v-if="props.row.active === 'true'">
                                                        <q-btn
                                                            dense
                                                            color="negative"
                                                            class="text-weight-regular text-caption"
                                                            @click="nonActive(props.row)"
                                                            push
                                                            label="Non-Active"
                                                            size="sm"
                                                        />
                                                    </q-btn-group>
                                                    </q-td>
                                                </template>
                                            </q-table>
                                        </div>
                                    </div>
                                    <div class="row q-col-gutter-md q-px-sm q-mb-md">
                                        <div class="col-12 col-md-4">
                                            <q-btn color="secondary" label="Tambah Data" @click="addGroup" class="tw-mr-2"/>
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
                            label="Nama Pejabat/Kuasa Penandatangan Faktur Pajak" 
                            header-class="bg-grey-2 text-blue-grey-7"
                        >
                            <q-card>
                                <q-card-section>
                                    <div class="row q-col-gutter-md q-pl-sm q-mb-md">
                                        <div class="col-12 col-md-12">
                                            <q-table
                                                dense
                                                hide-bottom
                                                :rows-per-page-options="[0]"
                                                title="List Data"
                                                row-key="sup_dtl_id"
                                                :rows="listNamaPejabat"
                                                :columns="columnNamaPejabat"                                                         
                                            >
                                               <template v-slot:body-cell-no="props">
                                                    <q-td :props="props">
                                                        {{ props.rowIndex+1 }}
                                                    </q-td>
                                                </template>
                                                <template v-slot:body-cell-status_update="props">
                                                    <q-td :props="props">
                                                        <span v-if="props.row.active === 'true'" style="color : green; font-weight: bold;">{{ props.row.status_update === 'true' ? 'New' : '' }}</span> 
                                                    </q-td>
                                                </template>
                                                <template v-slot:body-cell-aksi="props">
                                                    <q-td :props="props">
                                                    <q-btn-group push v-if="props.row.active === 'true'">
                                                        <q-btn
                                                            dense
                                                            color="negative"
                                                            class="text-weight-regular text-caption"
                                                            @click="nonActive(props.row)"
                                                            push
                                                            label="Non-Active"
                                                            size="sm"
                                                        />
                                                    </q-btn-group>
                                                    </q-td>
                                                </template>
                                            </q-table>
                                        </div>
                                    </div>
                                    <div class="row q-col-gutter-md q-px-sm q-mb-md">
                                        <div class="col-12 col-md-4">
                                            <q-btn color="secondary" label="Tambah Data" @click="addPejabat" class="tw-mr-2"/>
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
                            label="Quality dan Environment" 
                            header-class="bg-grey-2 text-blue-grey-7"
                        >
                            <q-card>
                                <q-card-section>
                                    <div class="row q-col-gutter-lg q-px-xs">
                                        <div class="col-12 col-md-6">
                                            <p class="tw-text-md q-mb-md text-bold text-center">Current Data</p>
                                            <div class="row q-col-gutter-md q-px-sm q-mb-xs">
                                                <div class="col-12 col-md-3">                        
                                                    <p class="text-bold">Syarat</p>
                                                    <p class="q-pt-sm">ISO 9001</p>
                                                </div>    
                                                <div class="col-12 col-md-4 text-center"> 
                                                    <p class="text-bold">Status</p>
                                                    <div class="q-mb-xs">
                                                        <q-radio class="q-mr-sm" size="xs" val="Yes" label="Ya" v-model="tmpData.status_1" :model-value="tmpData.status_1" readonly color="blue" disable />
                                                        <q-radio size="xs" val="No" label="Tidak" v-model="tmpData.status_1" :model-value="tmpData.status_1" readonly color="blue" disable />                              
                                                    </div>
                                                </div>   
                                                <div class="col-12 col-md-4 text-center"> 
                                                    <p class="text-bold">Versi</p>
                                                    <div class="q-mb-xs">
                                                        <q-radio class="q-mr-sm" size="xs" val="2008" label="2008" v-model="tmpData.versi_1" :model-value="tmpData.versi_1" color="blue" disable />
                                                        <q-radio size="xs" val="2015" label="2015" v-model="tmpData.versi_1" :model-value="tmpData.versi_1" color="blue" disable />                              
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
                                                        <q-radio class="q-mr-sm" size="xs" val="Yes" label="Ya" v-model="tmpData.status_2" :model-value="tmpData.status_2" color="blue" disable />
                                                        <q-radio size="xs" val="No" label="Tidak" v-model="tmpData.status_2" :model-value="tmpData.status_2" color="blue" disable />                              
                                                    </div>
                                                </div>   
                                                <div class="col-12 col-md-4 text-center"> 
                                                    <p class="text-bold">Versi</p>
                                                    <div class="q-mb-xs">
                                                        <q-radio class="q-mr-sm" size="xs" val="2008" label="2008" v-model="tmpData.versi_2" :model-value="tmpData.versi_2" color="blue" disable />
                                                        <q-radio class="q-mr-sm" size="xs" val="2015" label="2015" v-model="tmpData.versi_2" :model-value="tmpData.versi_2" color="blue" disable /> 
                                                        <q-radio class="q-mr-sm" size="xs" val="Emas" label="Emas" v-model="tmpData.versi_2" :model-value="tmpData.versi_2" color="blue" disable /> 
                                                        <q-radio size="xs" val="Lainnya" label="Lainnya" v-model="tmpData.versi_2" :model-value="tmpData.versi_2" color="blue" disable />                              
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
                                                        <q-radio class="q-mr-sm" size="xs" val="Yes" label="Ya" v-model="tmpData.status_3" :model-value="tmpData.status_3" color="blue" disable />
                                                        <q-radio size="xs" val="No" label="Tidak" v-model="tmpData.status_3" :model-value="tmpData.status_3" color="blue" disable />                              
                                                    </div>
                                                </div>   
                                                <div class="col-12 col-md-4 text-center"> 
                                                    <p class="text-bold">Versi</p>
                                                    <div class="q-mb-xs">
                                                        <q-radio class="q-mr-sm" size="xs" val="2008" label="2008" v-model="tmpData.versi_3" :model-value="tmpData.versi_3" color="blue" disable />
                                                        <q-radio class="q-mr-sm" size="xs" val="2015" label="2015" v-model="tmpData.versi_3" :model-value="tmpData.versi_3" color="blue" disable /> 
                                                        <q-radio size="xs" val="Emas" label="Emas" v-model="tmpData.versi_3" :model-value="tmpData.versi_3" color="blue" disable />                              
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
                                                        <q-radio class="q-mr-sm" size="xs" val="Yes" label="Ya" v-model="tmpData.status_4" :model-value="tmpData.status_4" color="blue" disable />
                                                        <q-radio size="xs" val="No" label="Tidak" v-model="tmpData.status_4" :model-value="tmpData.status_4" color="blue" disable />                              
                                                    </div>
                                                </div>              
                                            </div>
                                            <q-separator />
                                            <div class="row q-col-gutter-md q-px-sm q-my-xs">
                                                <div class="col-12 col-md-3">                        
                                                    <p class="text-bold">Syarat</p>
                                                    <p class="q-pt-sm">Standard Lainnya</p>
                                                </div>    
                                                <div class="col-12 col-md-4 text-center"> 
                                                    <p class="text-bold">Status</p>
                                                    <div class="q-mb-xs">
                                                        <q-radio class="q-mr-sm" size="xs" val="Yes" label="Ya" :v-model="tmpData.status_5 == 'Yes' ? true : false" :model-value="tmpData.status_5" color="blue" disable />
                                                        <q-radio size="xs" val="No" label="Tidak" v-model="tmpData.status_5" :model-value="tmpData.status_5" color="blue" disable />                              
                                                    </div>
                                                </div>                  
                                            </div>
                                        </div>
                                        <div class="col-12 col-md-6">
                                            <p class="q-mb-md text-bold text-center">New Data</p>
                                            <div class="row q-col-gutter-md q-px-sm q-mb-xs">
                                                <div class="col-12 col-md-3">                        
                                                    <p class="text-bold">Syarat</p>
                                                    <p class="q-pt-sm">ISO 9001</p>
                                                </div>    
                                                <div class="col-12 col-md-4 text-center"> 
                                                    <p class="text-bold">Status</p>
                                                    <div class="q-mb-xs">
                                                        <q-radio class="q-mr-sm" size="xs" val="Yes" label="Ya" v-model="tmpDataQA.status_1" :model-value="tmpDataQA.status_1" color="blue" />
                                                        <q-radio size="xs" val="No" label="Tidak" v-model="tmpDataQA.status_1" :model-value="tmpDataQA.status_1" color="blue" />                              
                                                    </div>
                                                </div>   
                                                <div class="col-12 col-md-4 text-center"> 
                                                    <p class="text-bold">Versi</p>
                                                    <div class="q-mb-xs">
                                                        <q-radio class="q-mr-sm" size="xs" val="2008" label="2008" v-model="tmpDataQA.versi_1" :model-value="tmpDataQA.versi_1" color="blue" />
                                                        <q-radio size="xs" val="2015" label="2015" v-model="tmpDataQA.versi_1" :model-value="tmpDataQA.versi_1" color="blue" />                              
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
                                                        <q-radio class="q-mr-sm" size="xs" val="Yes" label="Ya" v-model="tmpDataQA.status_2" :model-value="tmpDataQA.status_2" color="blue" />
                                                        <q-radio size="xs" val="No" label="Tidak" v-model="tmpDataQA.status_2" :model-value="tmpDataQA.status_2" color="blue" />                              
                                                    </div>
                                                </div>   
                                                <div class="col-12 col-md-4 text-center"> 
                                                    <p class="text-bold">Versi</p>
                                                    <div class="q-mb-xs">
                                                        <q-radio class="q-mr-sm" size="xs" val="2008" label="2008" v-model="tmpDataQA.versi_2" :model-value="tmpDataQA.versi_2" color="blue" />
                                                        <q-radio class="q-mr-sm" size="xs" val="2015" label="2015" v-model="tmpDataQA.versi_2" :model-value="tmpDataQA.versi_2" color="blue" /> 
                                                        <q-radio class="q-mr-sm" size="xs" val="Emas" label="Emas" v-model="tmpDataQA.versi_2" :model-value="tmpDataQA.versi_2" color="blue" /> 
                                                        <q-radio size="xs" val="Lainnya" label="Lainnya" v-model="tmpDataQA.versi_2" :model-value="tmpDataQA.versi_2" color="blue" />                              
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
                                                        <q-radio class="q-mr-sm" size="xs" val="Yes" label="Ya" v-model="tmpDataQA.status_3" :model-value="tmpDataQA.status_3" color="blue" />
                                                        <q-radio size="xs" val="No" label="Tidak" v-model="tmpDataQA.status_3" :model-value="tmpDataQA.status_3" color="blue" />                              
                                                    </div>
                                                </div>   
                                                <div class="col-12 col-md-4 text-center"> 
                                                    <p class="text-bold">Versi</p>
                                                    <div class="q-mb-xs">
                                                        <q-radio class="q-mr-sm" size="xs" val="2008" label="2008" v-model="tmpDataQA.versi_3" :model-value="tmpDataQA.versi_3" color="blue" />
                                                        <q-radio class="q-mr-sm" size="xs" val="2015" label="2015" v-model="tmpDataQA.versi_3" :model-value="tmpDataQA.versi_3" color="blue" /> 
                                                        <q-radio size="xs" val="Emas" label="Emas" v-model="tmpDataQA.versi_3" :model-value="tmpDataQA.versi_3" color="blue" />                              
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
                                                        <q-radio class="q-mr-sm" size="xs" val="Yes" label="Ya" v-model="tmpDataQA.status_4" :model-value="tmpDataQA.status_4" color="blue" />
                                                        <q-radio size="xs" val="No" label="Tidak" v-model="tmpDataQA.status_4" :model-value="tmpDataQA.status_4" color="blue" />                              
                                                    </div>
                                                </div>              
                                            </div>
                                            <q-separator />
                                            <div class="row q-col-gutter-md q-px-sm q-my-xs">
                                                <div class="col-12 col-md-3">                        
                                                    <p class="text-bold">Syarat</p>
                                                    <p class="q-pt-sm">Standard Lainnya</p>
                                                </div>    
                                                <div class="col-12 col-md-4 text-center"> 
                                                    <p class="text-bold">Status</p>
                                                    <div class="q-mb-xs">
                                                        <q-radio class="q-mr-sm" size="xs" val="Yes" label="Ya" v-model="tmpDataQA.status_5" :model-value="tmpDataQA.status_5" color="blue" />
                                                        <q-radio size="xs" val="No" label="Tidak" v-model="tmpDataQA.status_5" :model-value="tmpDataQA.status_5" color="blue" />                              
                                                    </div>
                                                </div>                  
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row q-col-gutter-md q-px-sm q-mt-md">
                                        <div class="col-12 col-md-4">
                                            <q-btn color="secondary" label="Simpan" @click="saveQuality" class="tw-mr-2"/>
                                            <q-btn color="blue" label="Upload File" @click="uploadVend(17)" class="tw-mr-2"/>
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
                            label="Pakta Integritas" 
                            header-class="bg-grey-2 text-blue-grey-7"
                        >
                            <q-card>
                                <q-card-section>
                                    <div class="row q-col-gutter-md q-mb-sm">
                                        <div class="col-12 col-md-12">
                                            <p>Cari File PDF :</p>
                                        </div>
                                    </div>
                                    <div class="row q-col-gutter-md q-mb-md">
                                        <div class="col-12 col-md-8">
                                            <q-file dense outlined v-model="lamp_file" label="Lampiran File" :max-file-size="10000000" accept=".pdf">
                                                <template v-slot:prepend>
                                                <q-icon name="attach_file" />
                                                </template>
                                            </q-file> 
                                        </div>
                                        <div class="col-12 col-md-4">
                                            <q-btn color="secondary" label="Simpan" @click="saveTransporter(20)"/>
                                        </div>
                                    </div>
                                    <div class="row q-col-gutter-md q-mb-md">
                                        <div class="col-12 col-md-12">
                                            <q-table
                                                dense
                                                hide-bottom
                                                :rows-per-page-options="[0]"
                                                row-key="upload_id"
                                                :rows="listPaktaIntegritas"
                                                :columns="columnPaktaIntegritas"                
                                            >
                                                <template v-slot:body-cell-no="props">
                                                    <q-td :props="props">
                                                        {{ props.rowIndex+1 }}
                                                    </q-td>
                                                </template>
                                                
                                                <template v-slot:body-cell-aksi="props">
                                                    <q-td :props="props">
                                                    <q-btn-group push>
                                                        <q-btn
                                                            dense
                                                            color="negative"
                                                            class="text-weight-regular text-caption"
                                                            @click="delTransporter(props.row)"
                                                            push
                                                            label="Hapus"
                                                            size="sm"
                                                        />
                                                    </q-btn-group>
                                                    </q-td>
                                                </template>
                                            </q-table>
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
                            label="Pengalaman Perusahaan" 
                            header-class="bg-grey-2 text-blue-grey-7"
                        >
                            <q-card>
                                <q-card-section>
                                    <div class="row q-col-gutter-md q-pl-sm q-mb-md">
                                        <div class="col-12 col-md-12">
                                            <q-table
                                                densedense
                                                hide-bottom
                                                :rows-per-page-options="[0]"
                                                title="List Data"
                                                row-key="sup_dtl_id"
                                                :rows="listPengalamanPers"
                                                :columns="columnPengalamanPers"            
                                            >
                                                <template v-slot:body-cell-no="props">
                                                    <q-td :props="props">
                                                        {{ props.rowIndex+1 }}
                                                    </q-td>
                                                </template>
                                                <template v-slot:body-cell-status_update="props">
                                                    <q-td :props="props">
                                                        <span v-if="props.row.active === 'true'" style="color : green; font-weight: bold;">{{ props.row.status_update === 'true' ? 'New' : '' }}</span> 
                                                    </q-td>
                                                </template>
                                                <template v-slot:body-cell-aksi="props">
                                                    <q-td :props="props">
                                                    <q-btn-group push v-if="props.row.active === 'true'">
                                                        <q-btn
                                                            dense
                                                            color="negative"
                                                            class="text-weight-regular text-caption"
                                                            @click="nonActive(props.row)"
                                                            push
                                                            label="Non-Active"
                                                            size="sm"
                                                        />
                                                    </q-btn-group>
                                                    </q-td>
                                                </template>
                                            </q-table>
                                        </div>
                                    </div>
                                    <div class="row q-col-gutter-md q-px-sm q-mb-md">
                                        <div class="col-12 col-md-4">
                                            <q-btn color="secondary" label="Tambah Data" @click="addPengPers" class="tw-mr-2"/>
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
                            label="Company Profile" 
                            header-class="bg-grey-2 text-blue-grey-7"
                        >
                            <q-card>
                                <q-card-section>
                                    <div class="row q-col-gutter-md q-mb-sm">
                                        <div class="col-12 col-md-12">
                                            <p>Cari File PDF :</p>
                                        </div>
                                    </div>
                                    <div class="row q-col-gutter-md q-mb-md">
                                        <div class="col-12 col-md-8">
                                            <q-file dense outlined v-model="lampcom_file" label="Lampiran File" :max-file-size="2097152" accept=".pdf"  @rejected="rejectFileCP">
                                                <template v-slot:prepend>
                                                <q-icon name="attach_file" />
                                                </template>
                                            </q-file> 
                                        </div>
                                        <div class="col-12 col-md-4">
                                            <q-btn color="secondary" label="Simpan" @click="saveComPro"/>
                                        </div>
                                    </div>
                                    <div class="row q-col-gutter-md q-mb-md">
                                        <div class="col-12 col-md-12">
                                            <q-table
                                                dense
                                                hide-bottom
                                                :rows-per-page-options="[0]"
                                                row-key="upload_id"
                                                :rows="listCompro"
                                                :columns="columnsComPro"                
                                            >
                                                <template v-slot:body-cell-no="props">
                                                    <q-td :props="props">
                                                        {{ props.rowIndex+1 }}
                                                    </q-td>
                                                </template>
                                                
                                                <template v-slot:body-cell-aksi="props">
                                                    <q-td :props="props">
                                                        <div class="q-gutter-xs">
                                                            <q-btn
                                                                size="9px"
                                                                round
                                                                color="negative"
                                                                icon="delete"
                                                                label=""
                                                                title="Hapus File"
                                                                @click="deleteFile(props.row)"
                                                            />
                                                            <q-btn
                                                                size="9px"
                                                                round
                                                                color="deep-orange"
                                                                icon="open_in_new"
                                                                label=""
                                                                title="Tampilkan File"
                                                                @click="openFile(props.row)"
                                                            />
                                                        </div>
                                                    </q-td>
                                                </template>
                                            </q-table>
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
                            label="Scope Kerja" 
                            header-class="bg-grey-2 text-blue-grey-7"
                        >
                            <q-card>
                                <q-card-section>
                                    <div class="row q-col-gutter-md q-mb-md">
                                        <div class="col-12 col-md-12">
                                            <Form :validation-schema="schemaScope" @submit="saveScope">
                                            <div class="row q-gutter-sm tw-mb-4">
                                                <div class="col-12 col-md-12">
                                                    <span class="text-indigo-10 tw-text-xl text-bold">SCOPE KERJA</span>
                                                </div>
                                                <div class="col-12 col-md-12">
                                                    <Field v-model="tmpDataScope.scope" name="scope" v-slot="{ errorMessage, value, field }">
                                                        <q-input dense maxlength="255" outlined type="textarea" autocomplete="off" color="blue" :model-value="value" v-bind="field"
                                                        :error-message="errorMessage" :error="!!errorMessage" />
                                                    </Field>
                                                </div>
                                                <div class="col-12 col-md-12">
                                                    <q-btn label="Simpan" color="secondary" type="submit"/>
                                                </div>
                                            </div>
                                            </Form>
                                        </div>
                                    </div>
                                </q-card-section>
                            </q-card>
                        </q-expansion-item>
                    </q-list>
            </q-card-section>
        </q-card>
        
        <q-dialog v-model="dlFormKP">
            <q-card style="width: 700px; max-width: 80vw;">
                <q-card-section class="text-center">
                    <div class="text-h6">Form Input Data</div>
                    <p>Kontak Person</p>
                </q-card-section>
            <q-separator />
            <Form :validation-schema="schemaKP" @submit="saveKontak" class="q-mt-md">
                <q-card-section style="max-height: 50vh" class="scroll">
                    <div class="row q-col-gutter-md">
                        <div class="col-12 col-md-6">
                            <Field v-model="tmpDataKP.npwp" name="npwp" v-slot="{ errorMessage, value, field }">
                                <q-input dense label="NPWP Perusahaan" autocomplete="off" maxlength="50" readonly outlined type="tel" color="blue" :model-value="value" v-bind="field"
                                :error-message="errorMessage" :error="!!errorMessage" />
                            </Field>
                        </div>
                        <div class="col-12 col-md-6">
                            <Field v-model="tmpDataKP.nama" name="nama" v-slot="{ errorMessage, value, field }">
                                <q-input dense label="Nama Lengkap" autocomplete="off" maxlength="50" outlined type="tel" color="blue" :model-value="value" v-bind="field"
                                :error-message="errorMessage" :error="!!errorMessage" />
                            </Field>
                        </div>
                        <div class="col-12 col-md-6">
                            <Field v-model="tmpDataKP.jabatan" name="jabatan" v-slot="{ errorMessage, value, field }">
                                <q-input dense label="Jabatan" autocomplete="off" maxlength="50" outlined type="tel" color="blue" :model-value="value" v-bind="field"
                                :error-message="errorMessage" :error="!!errorMessage" />
                            </Field>
                        </div>
                        <div class="col-12 col-md-6">
                            <Field
                                v-model="tmpDataKP.jeniskel"
                                name="jeniskel"
                                v-slot="{ errorMessage, handleChange, value }">
                                <q-select 
                                    dense
                                    outlined
                                    emit-value
                                    map-options
                                    label="Jenis Kelamin"
                                    :model-value="value"
                                    @update:modelValue="handleChange"
                                    input-debounce="0"
                                    color="blue"
                                    option-value="value"
                                    option-label="label"
                                    :options="listJenisKel"
                                    :error-message="errorMessage"
                                    :error="!!errorMessage" 
                                >
                                    <template v-slot:no-option>
                                    <q-item>
                                        <q-item-section class="text-grey">
                                        No results
                                        </q-item-section>
                                    </q-item>
                                    </template>
                                </q-select>
                            </Field> 
                        </div>
                        <div class="col-12 col-md-6">
                            <Field v-model="tmpDataKP.notelepon" name="notelepon" v-slot="{ errorMessage, value, field }">
                                <q-input dense label="No. Telepon" autocomplete="off" maxlength="50" outlined type="tel" color="blue" :model-value="value" v-bind="field"
                                :error-message="errorMessage" :error="!!errorMessage" />
                            </Field>
                        </div>
                        <div class="col-12 col-md-6">
                            <Field v-model="tmpDataKP.nohp" name="nohp" v-slot="{ errorMessage, value, field }">
                                <q-input dense label="No. HP" autocomplete="off" maxlength="50" outlined type="tel" color="blue" :model-value="value" v-bind="field"
                                :error-message="errorMessage" :error="!!errorMessage" />
                            </Field>
                        </div>
                        <div class="col-12 col-md-6">
                            <Field v-model="tmpDataKP.email" name="email" v-slot="{ errorMessage, value, field }">
                                <q-input dense label="Email" autocomplete="off" maxlength="50" outlined type="tel" color="blue" :model-value="value" v-bind="field"
                                :error-message="errorMessage" :error="!!errorMessage" />
                            </Field>
                        </div>
                    </div>
                </q-card-section>
                <q-separator />
                <q-card-actions align="right">
                    <q-btn size="12px" label="Batal" color="secondary" icon="cancel" v-close-popup />
                    <q-btn size="12px" label="Simpan" color="blue" icon="save" type="submit" />
                </q-card-actions>
            </Form>
            </q-card>
        </q-dialog>
        
        <q-dialog v-model="dlFormDD">
            <q-card style="width: 700px; max-width: 80vw;">
                <q-card-section class="text-center">
                    <div class="text-h6">Form Input Data</div>
                    <p>Dewan Direksi</p>
                </q-card-section>
                <q-separator />
                <Form :validation-schema="schemaDD" @submit="saveDewanDireksi" class="q-mt-md">
                    <q-card-section style="max-height: 50vh" class="scroll">
                        <div class="row q-col-gutter-sm">
                            <div class="col-12 col-md-6">
                                <Field v-model="tmpDataDD.npwp" name="npwp" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="NPWP Perusahaan" autocomplete="off" maxlength="50" readonly outlined type="tel" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <Field v-model="tmpDataDD.nama" name="nama" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="Nama Lengkap" autocomplete="off" maxlength="50" outlined type="tel" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <Field v-model="tmpDataDD.nik" name="nik" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="NIK" autocomplete="off" maxlength="50" outlined type="tel" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <Field v-model="tmpDataDD.jabatan" name="jabatan" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="Jabatan" autocomplete="off" maxlength="50" outlined type="tel" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <Field v-model="tmpDataDD.email" name="email" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="Email" autocomplete="off" maxlength="50" outlined type="tel" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                        </div>
                    </q-card-section>
                    <q-separator />
                    <q-card-actions align="right">
                        <q-btn size="12px" label="Batal" class="q-px-xs q-py-xs" color="negative" v-close-popup />
                        <q-btn size="12px" label="Simpan" class="q-px-xs q-py-xs" color="primary" type="submit" />
                    </q-card-actions>
                </Form>
            </q-card>
        </q-dialog>

        <q-dialog v-model="dlFormDok">
            <q-card style="width: 1000px; max-width: 80vw;">
                <q-card-section class="text-center">
                    <div class="text-h6">Form Input Data</div>
                    <p>Kelengkapan Administrasi Umum</p>
                </q-card-section>
                <q-separator />
                <q-card-section style="max-height: 50vh" class="scroll">
                    <div class="row q-col-gutter-md q-px-sm q-mb-md">
                        <div class="col-12 col-md-3">
                            <q-input dense outlined v-model="tmpDataKD.nodok" name="nodok" label="Nomor Dokumen" maxlength="50" autocomplete="off" color="blue" :model-value="tmpDataKD.nodok" />
                        </div>
                        <div class="col-12 col-md-3">
                            <q-input
                                v-model="tmpDataKD.tglkeluar"
                                name="tglkeluar"
                                dense
                                outlined
                                autocomplete="off" 
                                color="blue"
                                label="Tgl. Dikeluarkan"
                                mask="##/##/####"
                                fill-mask="-"
                                :model-value="tmpDataKD.tglkeluar"
                            >
                                <template v-slot:append>
                                    <q-icon name="event" class="cursor-pointer">
                                        <q-popup-proxy ref="datePopup" cover transition-show="scale" transition-hide="scale">
                                            <q-date v-model="tmpDataKD.tglkeluar" mask="DD/MM/YYYY" color="blue" :model-value="tmpDataKD.tglkeluar" minimal>
                                                <div class="row items-center justify-end">
                                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                                </div>
                                            </q-date>
                                        </q-popup-proxy>
                                    </q-icon>
                                </template>
                            </q-input>
                        </div>
                        <div class="col-12 col-md-3">
                            <q-input
                                v-model="tmpDataKD.tglakhir"
                                name="tglakhir"
                                dense
                                outlined
                                autocomplete="off" 
                                color="blue"
                                label="Tgl. Berakhir"
                                mask="##/##/####"
                                fill-mask="-"
                                :model-value="tmpDataKD.tglakhir"
                            >
                                <template v-slot:append>
                                    <q-icon name="event" class="cursor-pointer">
                                        <q-popup-proxy ref="datePopup" cover transition-show="scale" transition-hide="scale">
                                            <q-date v-model="tmpDataKD.tglakhir" mask="DD/MM/YYYY" color="blue" :model-value="tmpDataKD.tglakhir" minimal>
                                                <div class="row items-center justify-end">
                                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                                </div>
                                            </q-date>
                                        </q-popup-proxy>
                                    </q-icon>
                                </template>
                            </q-input>
                        </div>
                        <div class="col-12 col-md-3">
                            <q-file dense outlined v-model="lamp_file" label="Lampiran File" :max-file-size="10000000" accept=".pdf">
                                <template v-slot:prepend>
                                <q-icon name="attach_file" />
                                </template>
                            </q-file> 
                        </div>
                    </div>
                    <div class="row q-col-gutter-md q-px-sm q-mb-md">
                        <div class="col-12 col-md-12">
                            <p>List File yang sudah diupload :</p>
                        </div>
                        <div class="col-12 col-md-12">
                        <q-table
                          :rows-per-page-options="[0]"
                          hide-bottom
                          dense
                          :rows="listAdmUmum"
                          :columns="columnAdmUmum"
                        >
                            <template v-slot:body-cell-nomor="props">
                                <q-td :props="props">
                                {{ props.rowIndex + 1 }}
                                </q-td>
                            </template>
                            <template v-slot:body-cell-file="props">
                            <q-td :props="props">
                                <a :href="`${ftp_link}`+props.row.file" target="_blank"><span style="color: blue;">{{ props.row.file }}</span></a>
                            </q-td>
                            </template>
                            <template v-slot:body-cell-status_update="props">
                                <q-td :props="props">
                                    <span v-if="props.row.active === 'true'" style="color : green; font-weight: bold;">{{ props.row.statusUpdate === 'true' ? 'New' : '' }}</span> 
                                </q-td>
                            </template>
                        </q-table>
                      </div>
                    </div>
                </q-card-section>
                <q-separator />
                <q-card-actions align="right">
                    <q-btn size="12px" label="Batal" class="q-px-xs q-py-xs" color="negative" v-close-popup />
                    <q-btn size="12px" label="Simpan" class="q-px-xs q-py-xs" color="primary" @click="saveDokumen" />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <q-dialog v-model="dlFormUpload">
            <q-card style="width: 1000px; max-width: 80vw;">
                <q-card-section class="text-center">
                    <div class="text-h6">Form Input Data</div>
                    <p>{{ headUpload }}</p>
                </q-card-section>
                <q-separator />
                <q-card-section style="max-height: 50vh" class="scroll">
                    <div class="row q-col-gutter-md q-mb-sm">
                        <div class="col-12 col-md-12">
                            <p>Cari File PDF :</p>
                        </div>
                    </div>
                    <div class="row q-col-gutter-md q-mb-md">
                        <div class="col-12 col-md-12">
                            <q-file dense outlined v-model="lamp_file" label="Lampiran File" :max-file-size="10000000" accept=".pdf">
                                <template v-slot:prepend>
                                <q-icon name="attach_file" />
                                </template>
                            </q-file> 
                        </div>
                    </div>
                    <div class="row q-col-gutter-md q-mb-md">
                        <div class="col-12 col-md-12">
                            <q-table
                                dense
                                hide-bottom
                                :rows-per-page-options="[0]"
                                row-key="upload_id"
                                :rows="listVendorUpload"
                                :columns="columnVendorTransporter"               
                            >
                                <template v-slot:body-cell-no="props">
                                    <q-td :props="props">
                                        {{ props.rowIndex+1 }}
                                    </q-td>
                                </template>
                                <template v-slot:body-cell-details_upload="props">
                                    <q-td :props="props">
                                        <a :href="`${ftp_link}`+props.row.details_upload_app+'.pdf'" target="_blank"><span style="color: blue;">{{ props.row.details_upload }}</span></a>
                                    </q-td>
                                </template>
                                <template v-slot:body-cell-aksi="props">
                                    <q-td :props="props">
                                    <q-btn-group push>
                                        <q-btn
                                            dense
                                            color="negative"
                                            class="text-weight-regular text-caption"
                                            @click="delTransporter(props.row)"
                                            push
                                            label="Hapus"
                                            size="sm"
                                        />
                                    </q-btn-group>
                                    </q-td>
                                </template>
                            </q-table>
                        </div>    
                    </div>   
                </q-card-section>
                <q-separator />
                <q-card-actions align="right">
                    <q-btn size="12px" label="Batal" class="q-px-xs q-py-xs" color="negative" v-close-popup />
                    <q-btn size="12px" label="Simpan" class="q-px-xs q-py-xs" color="primary" @click="saveUpload" />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <q-dialog v-model="dlFormBank">
            <q-card style="width: 700px; max-width: 80vw;">
                <q-card-section class="text-center">
                    <div class="text-h6">Form Input Data</div>
                    <p>Rekening Bank</p>
                </q-card-section>
                <q-separator />
                <Form :validation-schema="schemaBank" @submit="saveRekeningBank" class="q-mt-md">
                    <q-card-section style="max-height: 65vh" class="scroll">
                        <div class="row q-col-gutter-sm">
                            <div class="col-12 col-md-12">
                                <Field v-model="tmpDataBank.npwp" name="npwp" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="NPWP Perusahaan" autocomplete="off" maxlength="50" readonly outlined type="tel" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <Field
                                    v-model="tmpDataBank.namabank"
                                    name="namabank"
                                    v-slot="{ errorMessage, handleChange, value }"
                                >
                                    <q-select 
                                        dense
                                        outlined
                                        clearable
                                        use-input 
                                        emit-value
                                        map-options
                                        label="Nama Bank"
                                        :model-value="value"
                                        @update:modelValue="handleChange"
                                        input-debounce="0"
                                        color="blue"
                                        option-value="kodemstr"
                                        option-label="kodemstr"
                                        :options="listBank"   
                                        :display-value="value ? value.label : ''"
                                        :error-message="errorMessage"
                                        :error="!!errorMessage"
                                        @filter="filterFn"
                                    >
                                        <template v-slot:no-option>
                                            <q-item>
                                                <q-item-section class="text-grey">
                                                    No results
                                                </q-item-section>
                                            </q-item>
                                        </template>
                                    </q-select>
                                </Field> 
                            </div>
                            <div class="col-12 col-md-6">
                                <Field
                                    v-model="tmpDataBank.kotacab"
                                    name="kotacab"
                                    v-slot="{ errorMessage, handleChange, value }"
                                >
                                    <q-select 
                                        dense
                                        outlined
                                        clearable
                                        use-input 
                                        emit-value
                                        map-options
                                        label="Kota/Cabang"
                                        :model-value="value"
                                        @update:modelValue="handleChange"
                                        input-debounce="0"
                                        color="blue"
                                        option-value="kodemstr"
                                        option-label="kodemstr"
                                        :options="listKotaCab"   
                                        :display-value="value ? value.label : ''"
                                        :error-message="errorMessage"
                                        :error="!!errorMessage"
                                        @filter="filterFn2"
                                    >
                                        <template v-slot:no-option>
                                            <q-item>
                                                <q-item-section class="text-grey">
                                                    No results
                                                </q-item-section>
                                            </q-item>
                                        </template>
                                    </q-select>
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <Field v-model="tmpDataBank.nomorrek" name="nomorrek" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="No. Rekening / IBAN" maxlength="15" outlined type="tel" autocomplete="off" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <Field v-model="tmpDataBank.namadalamrek" name="namadalamrek" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="Nama Dalam Rekening" readonly outlined type="tel" autocomplete="off" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <Field v-model="tmpDataBank.namapemilikrek" name="namapemilikrek" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="Nama Pemilik Rekening" maxlength="50" outlined type="tel" autocomplete="off" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <Field v-model="tmpDataBank.matauang" name="matauang" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="Mata Uang" maxlength="5" outlined type="tel" autocomplete="off" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <Field v-model="tmpDataBank.top" name="top" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="Term of Payment" maxlength="40" outlined autocomplete="off" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <Field v-model="tmpDataBank.swiftcode" name="swiftcode" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="Swift Code" maxlength="40" outlined autocomplete="off" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <span class="text-red tw-text-xs">* Jika nama dalam Rek. berbeda dengan Pemilik</span>
                                <q-file outlined dense bottom-slots v-model="tmpDataBank.file" label="Upload Surat Pernyataan" :max-file-size="10000000" accept=".pdf" color="blue" @rejected="rejectFile" counter :model-value="tmpDataBank.file">
                                    <template v-slot:prepend>
                                        <q-icon name="cloud_upload" @click.stop />
                                    </template>
                                    <template v-slot:append>
                                        <q-icon name="close" @click.stop="model = null" class="cursor-pointer" />
                                    </template>
                                    <template v-slot:hint> Field hint </template>
                                </q-file>
                            </div>
                            <div class="col-12 col-md-6">
                                <div class="q-ml-xs q-pt-sm q-pb-xs">
                                    <p v-if="tmpDataBank.file_view">Link File : <a :href="`${ftp_link}`+tmpDataBank.file_view" class="tw-text-xs text-light-blue-10 text-italic" target="_blank">{{ tmpDataBank.file_view }}</a></p>
                                </div>
                            </div>
                            <div class="col-12 col-md-12">
                                <Field v-model="tmpDataBank.alamatrek" name="alamatrek" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="Alamat Pemilik Rekening" maxlength="150" outlined type="textarea" autocomplete="off" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                        </div>
                    </q-card-section>
                    <q-separator />
                    <q-card-actions align="right">
                        <q-btn size="12px" label="Batal" class="q-px-xs q-py-xs" color="negative" v-close-popup />
                        <q-btn size="12px" label="Simpan" class="q-px-xs q-py-xs" color="primary" type="submit" />
                    </q-card-actions>
                </Form>
            </q-card>
        </q-dialog>

        <q-dialog v-model="dlFormPenandaKontrak">
            <q-card style="width: 700px; max-width: 80vw;">
                <q-card-section class="text-center">
                    <div class="text-h6">Form Input Data</div>
                    <p>Penandatangan Kontrak</p>
                </q-card-section>
                <q-separator />
                <Form :validation-schema="schemaKontrak" @submit="savePenandaKontrak" class="q-mt-md">
                    <q-card-section style="max-height: 70vh" class="scroll">
                        <div class="row q-col-gutter-sm">
                            <div class="col-12 col-md-12">
                                <Field v-model="tmpDataKontrak.npwp" name="npwp" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="NPWP Perusahaan" autocomplete="off" maxlength="50" readonly outlined type="tel" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <Field v-model="tmpDataKontrak.namaLengkap" name="namaLengkap" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="Nama Lengkap" outlined autocomplete="off" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <Field v-model="tmpDataKontrak.nik" name="nik" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="NIK" outlined autocomplete="off" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <Field v-model="tmpDataKontrak.jabatan" name="jabatan" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="Jabatan" outlined autocomplete="off" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <Field v-model="tmpDataKontrak.email" name="email" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="Email" outlined type="email" autocomplete="off" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <Field
                                    v-model="tmpDataKontrak.tglBuat"
                                    name="tglBuat"
                                    v-slot="{ errorMessage, value, field }"
                                >
                                    <q-input                                      
                                        dense
                                        outlined
                                        label="Tanggal Buat"
                                        :model-value="value"
                                        v-bind="field"
                                        :error-message="errorMessage"
                                        :error="!!errorMessage"
                                        mask="####-##-##"
                                        fill-mask="#"
                                    >
                                    <template v-slot:append>
                                        <q-icon name="event" class="cursor-pointer">
                                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                        <q-date v-model="tmpDataKontrak.tglBuat" mask="YYYY-MM-DD" minimal>
                                            <div class="row items-center justify-end">
                                                <q-btn v-close-popup label="Close" color="primary" flat />
                                            </div>
                                        </q-date>
                                        </q-popup-proxy>
                                        </q-icon>
                                    </template>
                                    </q-input>
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <Field
                                    v-model="tmpDataKontrak.direksi"
                                    name="direksi"
                                    v-slot="{ errorMessage, handleChange, value }"
                                >
                                    <q-select
                                        style="padding: 0px;"
                                        dense
                                        outlined
                                        label="Direksi"
                                        :model-value="value"
                                        @update:modelValue="handleChange"
                                        emit-value
                                        map-options
                                        input-debounce="0"
                                        option-value="name"
                                        option-label="name"
                                        :options="listDireksiKon"
                                        :error-message="errorMessage"
                                        :error="!!errorMessage"
                                    >
                                    <template v-slot:no-option>
                                        <q-item>
                                        <q-item-section class="text-grey">
                                            No results
                                        </q-item-section>
                                        </q-item>
                                    </template>
                                    </q-select>
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <span class="text-red tw-text-xs">* Jika bukan Direksi wajib melampirkan Surat Kuasa Direktur.</span>
                                <q-file outlined dense bottom-slots v-model="tmpDataKontrak.file" label="Upload Surat Kuasa" :max-file-size="10000000" accept=".pdf" color="blue" @rejected="rejectFile" counter :model-value="tmpDataKontrak.file">
                                    <template v-slot:prepend>
                                        <q-icon name="cloud_upload" @click.stop />
                                    </template>
                                    <template v-slot:append>
                                        <q-icon name="close" @click.stop="model = null" class="cursor-pointer" />
                                    </template>
                                    <template v-slot:hint> Field hint </template>
                                </q-file>
                            </div>
                        </div>
                    </q-card-section>
                    <q-separator />
                    <q-card-actions align="right">
                        <q-btn size="12px" label="Batal" class="q-px-xs q-py-xs" color="negative" v-close-popup />
                        <q-btn size="12px" label="Simpan" class="q-px-xs q-py-xs" color="orange" type="submit" />
                    </q-card-actions>
                </Form>
            </q-card>
        </q-dialog> 

        <q-dialog v-model="dlFormGroup">
            <q-card style="width: 700px; max-width: 80vw;">
                <q-card-section>
                    <div class="text-h6 text-center">Form Input Data</div>
                    <p class="text-center">Group / Anak Perusahaan</p>
                </q-card-section>
                <q-separator />
                <Form :validation-schema="schemaGroup" @submit="saveGroupPers" class="q-mt-md">
                    <q-card-section style="max-height: 50vh" class="scroll">
                        <div class="row q-col-gutter-sm">
                            <div class="col-12 col-md-6">
                                <Field v-model="tmpDataGroup.npwp" name="npwp" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="NPWP Perusahaan" readonly outlined type="tel" autocomplete="off" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <Field v-model="tmpDataGroup.nama" name="nama" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="Nama Perusahaan" maxlength="50" outlined type="tel" autocomplete="off" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <Field v-model="tmpDataGroup.sektorbisnis" name="sektorbisnis" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="Sektor Bisnis" maxlength="50" outlined type="tel" autocomplete="off" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <Field v-model="tmpDataGroup.kontakperson" name="kontakperson" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="Kontak Person" maxlength="50" outlined type="tel" autocomplete="off" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <Field v-model="tmpDataGroup.telepon" name="telepon" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="Telepon" maxlength="15" outlined type="tel" autocomplete="off" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <Field v-model="tmpDataGroup.fax" name="fax" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="Fax" maxlength="15" outlined type="tel" autocomplete="off" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-12">
                                <Field v-model="tmpDataGroup.alamat" name="alamat" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="Alamat" maxlength="150" outlined type="textarea" autocomplete="off" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                        </div>
                    </q-card-section>
                    <q-separator />
                    <q-card-actions align="right">
                        <q-btn size="12px" label="Batal" class="q-px-xs q-py-xs" color="negative" v-close-popup />
                        <q-btn size="12px" label="Simpan" class="q-px-xs q-py-xs" color="primary" type="submit" />
                    </q-card-actions>
                </Form>
            </q-card>
        </q-dialog>

        <q-dialog v-model="dlFormPejabat">
            <q-card style="width: 700px; max-width: 80vw;">
                <q-card-section>
                    <div class="text-h6 text-center">Form Tambah Data</div>
                    <p class="text-center">Nama Pejabat / Kuasa Penandatangan Faktur Pajak</p>
                </q-card-section>
                <q-separator />
                <Form :validation-schema="schemaPej" @submit="saveNamaPejabat" class="q-mt-md">
                    <q-card-section style="max-height: 50vh" class="scroll">
                        <div class="row q-col-gutter-sm">
                            <div class="col-12 col-md-6">
                                <Field v-model="tmpDataPej.npwp" name="npwp" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="NPWP Perusahaan" maxlength="15" readonly outlined type="tel" autocomplete="off" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <Field v-model="tmpDataPej.nama" name="nama" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="Nama Lengkap" maxlength="50" outlined type="tel" autocomplete="off" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <Field v-model="tmpDataPej.npwppejabat" name="npwppejabat" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="NPWP" maxlength="15" outlined type="tel" autocomplete="off" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <Field v-model="tmpDataPej.jabatan" name="jabatan" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="Jabatan" maxlength="50" outlined type="tel" autocomplete="off" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                            <Field
                                v-model="tmpDataPej.tglberlaku"
                                name="tglberlaku"
                                v-slot="{ errorMessage, value, field }"
                            >                           
                                <q-input
                                    dense
                                    outlined
                                    autocomplete="off" 
                                    color="blue"
                                    label="Tanggal Berlaku"
                                    v-bind="field"
                                    :error-message="errorMessage"
                                    :error="!!errorMessage"
                                    mask="##/##/####" 
                                    fill-mask="_"
                                    :model-value="value"
                                >
                                    <template v-slot:append>
                                    <q-icon name="event" class="cursor-pointer">
                                        <q-popup-proxy ref="datePopup" cover transition-show="scale" transition-hide="scale">
                                            <q-date v-model="tmpDataPej.tglberlaku" mask="DD/MM/YYYY" color="blue" :model-value="tmpDataPej.tglberlaku" minimal>
                                                <div class="row items-center justify-end">
                                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                                </div>
                                            </q-date>
                                        </q-popup-proxy>
                                    </q-icon>
                                </template>                                
                                </q-input>
                            </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <Field v-model="tmpDataPej.lokasikerja" name="lokasikerja" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="Lokasi Kerja" maxlength="50" outlined type="tel" autocomplete="off" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-12">
                                <Field v-model="tmpDataPej.catatan" name="catatan" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="Catatan" maxlength="" outlined type="textarea" autocomplete="off" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                        </div>
                    </q-card-section>
                    <q-separator />
                    <q-card-actions align="right">
                        <q-btn size="12px" label="Batal" class="q-px-xs q-py-xs" color="negative" v-close-popup />
                        <q-btn size="12px" label="Simpan" class="q-px-xs q-py-xs" color="primary" type="submit" />
                    </q-card-actions>
                </Form>
            </q-card>
        </q-dialog>

        <q-dialog v-model="dlFormPengPers">
            <q-card style="width: 700px; max-width: 80vw;">
                <q-card-section>
                    <div class="text-h6 text-center">Form Tambah Data</div>
                    <p class="text-center">Pengalaman Perusahaan</p>
                </q-card-section>
                <q-separator />
                <Form :validation-schema="schemaExPers" @submit="savePengalamanPers" class="q-mt-md">
                    <q-card-section style="max-height: 50vh" class="scroll">
                        <div class="row q-col-gutter-sm">
                            <div class="col-12 col-md-6">
                                <Field v-model="tmpDataExPers.npwp" name="npwp" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="NPWP Perusahaan" maxlength="15" readonly outlined type="tel" autocomplete="off" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <Field v-model="tmpDataExPers.ketpekerjaan" name="ketpekerjaan" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="Keterangan Pekerjaan" maxlength="50" outlined type="tel" autocomplete="off" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <Field v-model="tmpDataExPers.lokasi" name="lokasi" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="Lokasi" maxlength="15" outlined type="tel" autocomplete="off" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <Field v-model="tmpDataExPers.namapelanggan" name="namapelanggan" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="Nama Pelanggan" maxlength="50" outlined type="tel" autocomplete="off" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                            <div class="col-12 col-md-6">
                                <Field v-model="tmpDataExPers.nilaikontrak" name="nilaikontrak" v-slot="{ errorMessage, value, field }">
                                    <q-input dense label="Nilai Kontrak" maxlength="50" outlined type="tel" autocomplete="off" color="blue" :model-value="value" v-bind="field"
                                    :error-message="errorMessage" :error="!!errorMessage" />
                                </Field>
                            </div>
                        </div>
                    </q-card-section>
                    <q-separator />
                    <q-card-actions align="right">
                        <q-btn size="12px" label="Batal" class="q-px-xs q-py-xs" color="negative" v-close-popup />
                        <q-btn size="12px" label="Simpan" class="q-px-xs q-py-xs" color="primary" type="submit" />
                    </q-card-actions>
                </Form>
            </q-card>
        </q-dialog>
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

const listJenisKel = ref([
{
    label:'Male',
    value:'Male'
},
{
    label:'Female',
    value:'Female'
}  
]);

const listDireksiKon = ref([
    {
        name: "Yes",
    },
    {
        name: "No",
    },
]);

const columnAdmUmum = [
  {
    name: "nomor",
    required: true,
    label: "#",
    align: "left",
    // field: "details_content_1",
  },  
  {
    name: "namadok",
    required: true,
    label: "Nama Dokumen",
    align: "left",
    field: "namaDok",
  },
  {
    name: "nodok",
    required: true,
    label: "Nomor Dokumen",
    align: "left",
    field: "dok",
  },
  {
    name: "tglKeluar",
    required: true,
    label: "Tgl dikerluarkan",
    align: "left",
    field: "tglkeluar",
  },
  {
    name: "tglBerakhir",
    required: true,
    label: "Tgl Berakhir",
    align: "left",
    field: "tglakhir",
  },
  {
    name: "file",
    required: true,
    label: "File",
    align: "left",
    field: "file",
  },
  {
    name: "status_update",
    required: true,
    label: "Keterangan",
    align: "left",
    field: "statusUpdate",
  },
];

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
    {
        name: "status_update",
        required: true,
        label: "Flag",
        align: "left",
        field: "status_update",
        // format: val => val === 'true'  ? 'New' : '',
        sortable: true,
    },
    {
        name: "aksi",
        required: true,
        label: "Aksi",
        align: "left",
        field: "aksi",
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
    {
        name: "status_update",
        required: true,
        label: "Flag",
        align: "left",
        field: "status_update",
        // format: val => val === 'true'  ? 'New' : '',
        sortable: true,
    },
    {
        name: "aksi",
        required: true,
        label: "Aksi",
        align: "left",
        field: "aksi",
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
    {
        name: "aksi",
        required: true,
        label: "Aksi",
        align: "left",
        field: "aksi",
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
        name: "status_update",
        required: true,
        label: "Flag",
        align: "left",
        field: "status_update",
        // format: val => val === 'true'  ? 'New' : '',
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
    {
        name: "status_update",
        required: true,
        label: "Flag",
        align: "left",
        field: "status_update",
        // format: val => val === 'true'  ? 'New' : '',
        sortable: true,
    },
    {
        name: "aksi",
        required: true,
        label: "Aksi",
        align: "left",
        field: "aksi",
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
    {
        name: "status_update",
        required: true,
        label: "Flag",
        align: "left",
        field: "status_update",
        // format: val => val === 'true'  ? 'New' : '',
        sortable: true,
    },
    {
        name: "aksi",
        required: true,
        label: "Aksi",
        align: "left",
        field: "aksi",
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
    {
        name: "status_update",
        required: true,
        label: "Flag",
        align: "left",
        field: "status_update",
        // format: val => val === 'true'  ? 'New' : '',
        sortable: true,
    },
    {
        name: "aksi",
        required: true,
        label: "Aksi",
        align: "left",
        field: "aksi",
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
    {
        name: "aksi",
        required: true,
        label: "Aksi",
        align: "left",
        field: "aksi",
    },
]

const columnsComPro = [ 
{
    name: "no",
    required: true,
    label: "No",
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
{
    name: "aksi",
    required: true,
    label: "Aksi",
    align: "left",
    field: "aksi",
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
    {
        name: "status_update",
        required: true,
        label: "Flag",
        align: "left",
        field: "status_update",
        // format: val => val === 'true'  ? 'New' : '',
        sortable: true,
    },
    {
        name: "aksi",
        required: true,
        label: "Aksi",
        align: "left",
        field: "aksi",
    },
]

const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const listAdmUmum = ref([]);
const listKontak = ref([]);
const listDireksi = ref([]);
const listVendorTransporter = ref([]);
const listVendorUpload = ref([]);
const listRekeningBank = ref([]);
const listPenandaKontrak = ref([]);
const listGroupPers = ref([]);
const listNamaPejabat = ref([]);
const listPaktaIntegritas = ref([]);
const listCompro = ref([]);
const listPengalamanPers = ref([]);
const ftp_link = import.meta.env.VITE_FTP_LINK;
const kodeDokumen = ref(null);
const headUpload = ref('');
const dlFormKP = ref(false);
const dlFormDD = ref(false);
const dlFormDok = ref(false);
const dlFormUpload = ref(false);
const dlFormBank = ref(false);
const dlFormPenandaKontrak = ref(false);
const dlFormGroup = ref(false);
const dlFormPejabat= ref(false);
const dlFormPengPers= ref(false);

const lamp_file = ref(null);
const lampcom_file = ref(null);
const listBank = ref([]);
const listKotaCab = ref([]);

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

const tmpDataQA = reactive({
    status_1: "",
    status_2: "",
    status_3: "",
    status_4: "",
    status_5: "",
    versi_1: "",
    versi_2: "",
    versi_3: "",
});

const tmpDataExPers = reactive({
    id: "",
    npwp: "",
    ketpekerjaan: "",
    lokasi: "",
    namapelanggan: "",
    nilaikontrak: "",
});

const tmpDataPej = reactive({
    id: "",
    npwp: "",
    nama: "",
    npwppejabat: "",
    jabatan: "",
    tglberlaku: "",
    lokasikerja: "",
    catatan: "",
    file: [],
});

const tmpDataKontrak = reactive({
    npwp: "",
    id: "",
    namaLengkap: "",
    nik: "",
    jabatan: "",
    email: "",
    tglBuat: "",
    direksi: "",
    file: [],
});

const tmpDataBank = reactive({
    npwp: "",
    id: "",
    namabank: "",
    kotacab: "",
    nomorrek: "",
    namadalamrek: "",
    namapemilikrek: "",
    matauang: "",
    top: "",
    swiftcode: "",
    alamatrek: "",
    file: [],
    file_view: "",
});

const tmpDataGroup = reactive({
    id: "",
    npwp: "",
    nama: "",
    sektorbisnis: "",
    kontakperson: "",
    telepon: "",
    fax: "",
    alamat: ""
});

const tmpDataKD = reactive({
    bagian: null,
    npwp: "",
    nodok: "",
    tglkeluar: "",
    tglakhir: "",
    file: null
});

const tmpDataKP = reactive({
    code: "",
    id: "",
    npwp: "",
    nama: "",
    jabatan: "",
    jeniskel: "",
    notelepon: "",
    nohp: "",
    email: ""
});

const tmpDataDD = reactive({
    code: "",
    id: "",
    npwp: "",
    nama: "",
    nik: "",
    jabatan: "",
    email: ""
});

const tmpDataScope = reactive({
    id: "",
    npwp: "",
    scope: "",
});

const schemaKP = yup.object({
    nama: yup.string().required().label("Nama Lengkap"),
    jabatan: yup.string().required().label("Jabatan"),
    jeniskel: yup.string().required().label("Jenis Kelamin"),
    notelepon: yup.string().required().label("No. Telepon"),
    nohp: yup.string().required().label("No. HP"),
    email: yup.string().required().email().label("Email"),
});

const schemaDD = yup.object({
    nama: yup.string().required().label("Nama Lengkap"),
    nik: yup.string().required().label("NIK"),
    jabatan: yup.string().required().label("Jabatan"),
    email: yup.string().required().email().label("Email"),
});

const schemaPej = yup.object({
    nama: yup.string().required().label("Nama Lengkap"),
    npwppejabat: yup.number().required().positive().integer().label("NPWP").typeError("NPWP must be a number type"),
    jabatan: yup.string().required().label("Jabatan"),
    tglberlaku: yup.string().required().label("Tanggal Berlaku"),
    lokasikerja: yup.string().required().label("Lokasi Kerja"),
    catatan: yup.string().required().label("Catatan"),
});

const schemaExPers = yup.object({
    ketpekerjaan: yup.string().required().label("Keterangan Pekerjaan"),
    lokasi: yup.string().required().label("Lokasi"),
    namapelanggan: yup.string().required().label("Nama Pelanggan"),
    nilaikontrak: yup.number().required().positive().integer().label("Nilai Kontrak").typeError("Nilai Kontrak must be a number type"),
});

const schemaBank = yup.object({
    // namabank: yup.string().required().label("Nama Bank"),
    namabank: yup.string().required().nullable(true).label("Nama Bank"),
    // kotacab: yup.string().required().label("Kota/Cabang"),
    kotacab: yup.string().required().nullable(true).label("Kota/Cabang"),
    // nomorrek: yup.string().required().label("No. Rekening"),
    nomorrek: yup.number().required().positive().integer().label("No. Rekening / IBAN").typeError("No. Rekening / IBAN must be a number type"),
    // namadalamrek: yup.string().required().label("Nama Dalam Rekening"),
    namapemilikrek: yup.string().required().label("Nama Pemilik Rekening"),
    matauang: yup.string().required().label("Mata Uang"),
    top: yup.string().required().label("TOP"),
    swiftcode: yup.string().required().label("Swift Code"),
    alamatrek: yup.string().required().label("Alamat Pemilik Rekening"),
});

const schemaGroup = yup.object({
    nama: yup.string().required().label("Nama Perusahaan"),
    sektorbisnis: yup.string().required().label("Sektor Bisnis"),
    kontakperson: yup.string().required().label("Kontak Person"),
    telepon: yup.string().required().label("Telepon"),
    fax: yup.string().required().label("Fax"),
    alamat: yup.string().required().label("Alamat"),
});

const schemaKontrak = yup.object({
    namaLengkap: yup.string().required().nullable(true).label("Nama Lengkap"),
    nik: yup.string().required().nullable(true).label("NIK"),
    jabatan: yup.string().required().nullable(true).label("Jabatan"),
    email: yup.string().required().email().label("Email").typeError("Email is a required field"),
    tglBuat: yup.string().required().label("Tanggal Buat"),
    direksi: yup.string().required().nullable(true).label("Direksi"),
});

const schemaScope = yup.object({
    scope: yup.string().required().nullable(true).label("Scope Pekerjaan"),
});

const nonActive = async (value) => {
    if (value.details_column_desc == 'Kontak Person') {
        const res = await axios.get("getCountKonPerson", {
            params: {
                sup_code_app: value.sup_code_app,
            },
        });

        if (res.data <= 6) {
            $q.notify({
                type: "negative",
                message: "Kontak Person tidak bisa di nonactive, minimal 6 Kontak Person",
            });    
        } else {
            try {
                $q.loading.show();
                const res = await axios.post("nonActive", {
                    sup_code_app : value.sup_code_app,
                    sup_dtl_id : value.sup_dtl_id
                });
                getKontak();
                getDireksi();
                getGroupPers();
                getNamaPejabat();
                getPenandaKontrak();
                getPengalamanPers();
                $q.notify({
                type: "positive",
                message: "Data berhasil dinon-active",
                });
                $q.loading.hide();
            } catch (error) {
                $q.notify({
                    type: "negative",
                    message: ParseError(error),
                });
            }    
        }
    } else {
        try {
            $q.loading.show();
            const res = await axios.post("nonActive", {
                sup_code_app : value.sup_code_app,
                sup_dtl_id : value.sup_dtl_id
            });
            getKontak();
            getDireksi();
            getGroupPers();
            getNamaPejabat();
            getPenandaKontrak();
            getPengalamanPers();
            $q.notify({
              type: "positive",
              message: "Data berhasil dinon-active",
            });
            $q.loading.hide();
        } catch (error) {
            $q.notify({
                type: "negative",
                message: ParseError(error),
            });
        }    
    }    
};

const addKontak = async (values, actions) => {
    tmpDataKP.npwp = empid();
    dlFormKP.value = true;
    resetKP();
};


const savePenandaKontrak = async () => {
    try {
        $q.loading.show();          
        if(tmpDataKontrak.direksi == "No" && tmpDataKontrak.file == ''){               
            $q.notify({
                type: "negative",
                message: "File upload surat penandatangan kontrak wajib diisi",
            });          
        }
        else{
            const res = await axios.post("savePenandaKontrakUpd", tmpDataKontrak, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            tmpDataKontrak.file = [];  
            dlFormPenandaKontrak.value = false;
            resetKontrak();
            getPenandaKontrak();
            $q.notify({
                type: "positive",
                message: "Data berhasil disimpan",
            });
        }
        $q.loading.hide();
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }
};

const saveKontak = async () => {
    try {
        $q.loading.show();
        const res = await axios.post("saveKontakPersonUpd", tmpDataKP);
        getKontak();
        dlFormKP.value = false;
        resetKP();
        $q.notify({
            type: "positive",
            message: "Kontak Person berhasil disimpan",
        });
        $q.loading.hide();
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }
};

const addDewan = async (values, actions) => {
    tmpDataDD.npwp = empid();
    dlFormDD.value = true;
    resetDD();
};

const uploadVend = async (value) => {
    switch (parseInt(value)) {
        case 12:
            headUpload.value = 'Kelengkapan Tambahan untuk Vendor Keagenan Resmi';
            break;
        case 13:
            headUpload.value = 'Kelengkapan Tambahan untuk Kontraktor Sipil/Elektrikal';
            break;
        case 14:
            headUpload.value = 'Rekening Bank';
            break;
        case 17:
            headUpload.value = 'Quality dan Environment';
            break;
    }
    kodeDokumen.value = value;
    dlFormUpload.value = true;
    // // tmpDataKD.npwp = empid();
    getVendorUpload();
};

const addBank = async (value) => {
    getNamaRek();
    dlFormBank.value = true;
};

const addPenandaKontrak = async (value) => {
    tmpDataKontrak.npwp = empid();
    dlFormPenandaKontrak.value = true;
};

const addPejabat = async (value) => {
    tmpDataPej.npwp = empid();
    dlFormPejabat.value = true;
};

const addPengPers = async (value) => {
    tmpDataExPers.npwp = empid();
    dlFormPengPers.value = true;
};

const addGroup = async (value) => {
    tmpDataGroup.npwp = empid();
    dlFormGroup.value = true;
};

const updateKD = async (value) => {
    dlFormDok.value = true;
    resetKD();
    tmpDataKD.npwp = empid();
    tmpDataKD.bagian = value;
    getAdmUmum();
};

const saveDewanDireksi = async () => {
    try {
        $q.loading.show();
        const res = await axios.post("saveDewanDireksiUpd", tmpDataDD);
        getDireksi();
        dlFormDD.value = false;
        resetDD();
        $q.notify({
            type: "positive",
            message: "Dewan Direksi berhasil disimpan",
        });
        $q.loading.hide();
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }
};

const saveDokumen = async () => {
    try {
        if (lamp_file.value == null || lamp_file.value == "") {
            $q.notify({
                type: "negative",
                message: "Lampiran File tidak boleh kosong",
            });    
        } else {
            $q.loading.show();
            var dataForm = new FormData();
            dataForm.append("file", lamp_file.value);
            dataForm.append("npwp", tmpDataKD.npwp);
            dataForm.append("nodok", tmpDataKD.nodok);
            dataForm.append("tglkeluar", tmpDataKD.tglkeluar);
            dataForm.append("tglakhir", tmpDataKD.tglakhir);
            dataForm.append("bagian", tmpDataKD.bagian);
            const res = await axios.post("saveAdminUmumUpd", dataForm);
            getAdminUmum();
            dlFormDok.value = false;
            resetKD();
            $q.notify({
                type: "positive",
                message: "Administrasi Umum berhasil disimpan",
            });
            $q.loading.hide();   
        }        
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }
};

const saveElektrikal = async () => {
    try {
        $q.loading.show();
        tmpData.npwp = empid();
        const res = await axios.post("saveElekUpd", tmpData);
        getKontraktorSipil();
        reset();
        $q.notify({
            type: "positive",
            message: "Data tambahan untuk vendor Kontraktor Sipil/Elektrikal berhasil disimpan",
        });
        $q.loading.hide(); 
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }
};

const saveAgen = async () => {
    try {
        $q.loading.show();
        tmpData.npwp = empid();
        const res = await axios.post("saveAgenUpd", tmpData);
        getVendorAgenResmi();
        reset();
        $q.notify({
            type: "positive",
            message: "Data tambahan untuk vendor Keagenan Resmi berhasil disimpan",
        });
        $q.loading.hide(); 
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }
};

const saveComPro = async (details_column) => {
    try {
        if (lampcom_file.value == null || lampcom_file.value == "") {
            $q.notify({
                type: "negative",
                message: "Lampiran File tidak boleh kosong",
            });    
        } else {
            $q.loading.show();
            var dataForm = new FormData();
            dataForm.append("file", lampcom_file.value);
            dataForm.append("npwp", empid());
            const res = await axios.post("saveComProUpd", dataForm);
            getCompro();
            lampcom_file.value = null;
            $q.notify({
                type: "positive",
                message: "Data berhasil disimpan",
            });
            $q.loading.hide();  
        }        
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }
};

const deleteFile = (value) => {
    $q.dialog({
        title: "Konfirmasi",
        message: `Apakah anda yakin hapus file ini ?`,
        html: true,
        ok: {
            push: true,
            size: "12px",
            color: "orange",
        },
        cancel: {
            push: true,
            size: "12px",
            color: "negative",
        },
        persistent: true,
    }).onOk(async () => {
        try {
            $q.loading.show();
            await axios.delete("delCompanyProfile/" + value.upload_id);
            $q.notify({
                type: "positive",
                message: `File berhasil dihapus`,
                html: true,
            });
            getCompro();
            $q.loading.hide();
            
        } catch (error) {
            $q.notify({
                type: "negative",
                message: ParseError(error),
            });
        }
    });
};

const openFile = async (value) => {
    window.open(`${import.meta.env.VITE_FTP_LINK}`+value.details_upload_app+'.pdf', '_blank')
};

const saveTransporter = async (details_column) => {
    try {
        if (lamp_file.value == null || lamp_file.value == "") {
            $q.notify({
                type: "negative",
                message: "Lampiran File tidak boleh kosong",
            });    
        } else {
            $q.loading.show();
            var dataForm = new FormData();
            dataForm.append("file", lamp_file.value);
            dataForm.append("npwp", empid());
            dataForm.append("details_column", details_column);
            const res = await axios.post("saveTranspUpd", dataForm);
            getVendorTransporter();
            getPaktaIntegritas();
            lamp_file.value = null;
            resetKD();
            $q.notify({
                type: "positive",
                message: "Data berhasil disimpan",
            });
            $q.loading.hide();  
        }        
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }
};

const saveUpload = async () => {
    try {
        if (lamp_file.value == null || lamp_file.value == "") {
            $q.notify({
                type: "negative",
                message: "Lampiran File tidak boleh kosong",
            });
        } else {
            $q.loading.show();
            var dataForm = new FormData();
            dataForm.append("file", lamp_file.value);
            dataForm.append("npwp", empid());
            dataForm.append("details_column", kodeDokumen.value);
            const res = await axios.post("saveUploadVend", dataForm);
            getVendorUpload();
            dlFormUpload.value = false;
            kodeDokumen.value = null;
            lamp_file.value = null;
            $q.notify({
                type: "positive",
                message: "File Upload berhasil disimpan",
            });
            $q.loading.hide();  
        }        
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }
};

const delTransporter = async (value) => {
  $q.dialog({
    title: "Konfirmasi",
    message: `Apakah anda yakin ingin menghapus data <span class="tw-font-bold">${value.details_upload}</span>`,
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
      await axios.delete("delVendorTransporterUpd/" + value.upload_id);
      getVendorTransporter();
      getPaktaIntegritas();
      getVendorUpload();
      dlFormUpload.value = false;
      $q.notify({
        type: "positive",
        message: `Data <span class="tw-font-bold">${value.details_upload}</span> berhasil dihapus`,
        html: true,
      });
    } catch (error) {
      $q.notify({
        type: "negative",
        message: ParseError(error),
      });
    }
  });
};

const reset = () => {
    tmpData.npwp = "";
    tmpData.nodok_1_agen = "";
    tmpData.tglkeluar_1_agen = "";
    tmpData.tglakhir_1_agen = "";
    
    tmpData.nodok_1_kontraktor = "";
    tmpData.tglkeluar_1_kontraktor = "";
    tmpData.tglakhir_1_kontraktor = "";

    tmpData.nodok_2_kontraktor = "";
    tmpData.tglkeluar_2_kontraktor = "";
    tmpData.tglakhir_2_kontraktor = "";
};

const resetKontrak = () => {
    tmpDataKontrak.id = "";
    tmpDataKontrak.id = "";
    tmpDataKontrak.namaLengkap = "";
    tmpDataKontrak.nik = "";
    tmpDataKontrak.jabatan = "";
    tmpDataKontrak.email = "";
    tmpDataKontrak.tglBuat = "";
    tmpDataKontrak.direksi = "";
    tmpDataKontrak.file = [];
};

const resetQA = () => {
    tmpDataQA.status_1 = "";
    tmpDataQA.status_2 = "";
    tmpDataQA.status_3 = "";
    tmpDataQA.status_4 = "";
    tmpDataQA.status_5 = "";
    tmpDataQA.versi_1 = "";
    tmpDataQA.versi_2 = "";
    tmpDataQA.versi_3 = "";
};

const resetPengPers = () => {
    tmpDataExPers.id = "";
    tmpDataExPers.npwp = "";
    tmpDataExPers.ketpekerjaan = "";
    tmpDataExPers.lokasi = "";
    tmpDataExPers.namapelanggan = "";
    tmpDataExPers.nilaikontrak = "";
};

const resetPej = () => {
    tmpDataPej.id = "";
    tmpDataPej.nama = "";
    tmpDataPej.npwppejabat = "";
    tmpDataPej.jabatan = "";
    tmpDataPej.tglberlaku = "";
    tmpDataPej.lokasikerja = "";
    tmpDataPej.catatan = "";
};

const resetBank = () => {
    tmpDataBank.id = "";
    tmpDataBank.namabank = "";
    tmpDataBank.kotacab = "";
    tmpDataBank.nomorrek = "";
    // tmpDataBank.namadalamrek = "";
    tmpDataBank.namapemilikrek = "";
    tmpDataBank.matauang = "";
    tmpDataBank.top = "";
    tmpDataBank.swiftcode = "";
    tmpDataBank.alamatrek = "";
    tmpDataBank.file = [];
    tmpDataBank.file_view = "";
};

const resetKP = () => {
    tmpDataKP.id = "";
    tmpDataKP.nama = "";
    tmpDataKP.jabatan = "";
    tmpDataKP.jeniskel = "";
    tmpDataKP.notelepon = "";
    tmpDataKP.nohp = "";
    tmpDataKP.email = "";
};

const resetDD = () => {
    tmpDataDD.id = "";
    tmpDataDD.nama = "";
    tmpDataDD.nik = "";
    tmpDataDD.jabatan = "";
    tmpDataDD.email = "";
};

const resetKD = () => {
    tmpDataKD.bagian = null;
    tmpDataKD.npwp = "";
    tmpDataKD.nodok = "";
    tmpDataKD.tglkeluar = "";
    tmpDataKD.tglakhir = "";
    tmpDataKD.file = null;
    lamp_file.value = null;
};

const resetGroup = () => {
    tmpData.id = "";
    tmpData.nama = "";
    tmpData.sektorbisnis = "";
    tmpData.kontakperson = "";
    tmpData.telepon = "";
    tmpData.fax = "";
    tmpData.alamat = "";    
};

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

const getAdmUmum = async () => {
    try {
        // $q.loading.show();
        const res = await axios.get("getVendAdmUmum", {
            params: {
                npwp: empid(),
                bagian: tmpDataKD.bagian,
            },
        });
        console.log(res.data);
        listAdmUmum.value = res.data;
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
        const res = await axios.get("getVendAdminUmumUpd", {
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

const getVendorUpload = async () => {
    if (kodeDokumen.value) {
        try {
            // $q.loading.show();
            const res = await axios.get("getVendDataUpload", {
                params: {
                    npwp: empid(),
                    details_column: kodeDokumen.value,
                },
            });
            
            listVendorUpload.value = res.data;
            // $q.loading.hide();
        } catch (error) {
            $q.notify({
                type: "negative",
                message: ParseError(error),
            });
        }    
    }
}

const getVendorTransporter = async () => {
    try {
        // $q.loading.show();
        const res = await axios.get("getVendTransporter", {
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

const saveRekeningBank = async () => {
    try {
        $q.loading.show();
        if(tmpDataBank.namadalamrek !== tmpDataBank.namapemilikrek){
            if(tmpDataBank.file == ''){
                $q.notify({
                    type: "negative",
                    message: "File belum dipilih",
                });          
            }
            else{
                const res = await axios.post("saveRekeningBankUpd", tmpDataBank, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                tmpDataBank.file = [];  
                dlFormBank.value = false;
                getRekeningBank();
                resetBank();
                $q.notify({
                    type: "positive",
                    message: "Data berhasil disimpan",
                });
            }         
        }
        else{
            const res = await axios.post("saveRekeningBankUpd", tmpDataBank, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            tmpDataBank.file = [];  
            dlFormBank.value = false;
            getRekeningBank();
            resetBank();
            $q.notify({
                type: "positive",
                message: "Data berhasil disimpan",
            });
        }
        $q.loading.hide();
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }
};

const saveScope = async () => {
    try {
        tmpDataScope.npwp = empid();
        $q.loading.show();
        const res = await axios.post("saveScopeKerjaUpd", tmpDataScope);      

        $q.notify({
            type: "positive",
            message: res.data.message,
        });

        // tmpDataScope.id = "";
        // tmpDataScope.npwp = "";
        // tmpDataScope.scope = "";
        $q.loading.hide();
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }
};

const saveGroupPers = async () => {
    try {
        $q.loading.show();
        const res = await axios.post("saveGroupPersUpd", tmpDataGroup);
        dlFormGroup.value = false;
        resetGroup();
        $q.notify({
            type: "positive",
            message: "Data berhasil disimpan",
        });
        getGroupPers();
        $q.loading.hide();
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }
};

const saveNamaPejabat = async () => {
    try {
        $q.loading.show();
        const res = await axios.post("saveNamaPejabatUpd", tmpDataPej);
        dlFormPejabat.value = false;
        resetPej();
        $q.notify({
            type: "positive",
            message: "Data berhasil disimpan",
        });
        getNamaPejabat();
        $q.loading.hide();
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }
};

const savePengalamanPers = async () => {
    try {
        $q.loading.show();
        const res = await axios.post("savePengPerUpd", tmpDataExPers);
        dlFormPengPers.value = false;
        resetPengPers();
        $q.notify({
            type: "positive",
            message: "Data berhasil disimpan",
        });
        getPengalamanPers();
        $q.loading.hide();
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }
};

const getScopeKerja = async () => {
    try {
        $q.loading.show();
        const res = await axios.get("getScopeKerjaUpd", {
            params: {
                npwp: empid(),
            },
        });
        
        tmpDataScope.scope = res.data;
        $q.loading.hide();
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }
};

const getBank = async () => {
    try {
        const res = await axios.get('getBankUpd', {
            params: {
                npwp: empid(),
            }
        })
        listBank.value = res.data;
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }
};

const filterFn = async (val, update) => {
    if (val === '') {
        update(() => {
            getBank();  
        })
    }

    update(() => {
        const neddle = val.toLowerCase();
        listBank.value = listBank.value.filter(option => {
            return option.kodemstr.toLowerCase().includes(neddle)
        }) 
    })
}

const getKotaCabang = async () => {
    try {
        const res = await axios.get("getKotaCabangUpd", {
            params: {
                npwp: empid(),
            },
        });  
        listKotaCab.value = res.data;
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }
};

const filterFn2 = async (val, update) => {
    if (val === '') {
        update(() => {
            getKotaCabang();  
        })
    }

    update(() => {
        const neddle = val.toLowerCase();
        listKotaCab.value = listKotaCab.value.filter(option => {
            return option.kodemstr.toLowerCase().includes(neddle)
        }) 
    })
}

const getNamaRek = async () => {
    const res = await axios.get("getRegisVend", {
        params: {
            npwp: empid(),
        },
    });

    tmpDataBank.npwp = res.data.regis_npwp;
    tmpDataBank.namadalamrek = res.data.regis_name;
}

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
        const res = await axios.get("getVendQualityEnvironmentUpd", {
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

const saveQuality = async () => {
    try{
        $q.loading.show();
        const res = await axios.post("saveQualityEnvUpd", tmpDataQA, {
            params: {
                npwp: empid(),
            },
        });
        console.log(res.data);
        $q.notify({
            type: "positive",
            message: res.data.message,
        });        
        getQualityEnvUpd();
        $q.loading.hide();
    } catch (error) {
        $q.notify({
            type: "negative",
            message: ParseError(error),
        });
    }
};

const getQualityEnvUpd = async () => {
    try {
        const res = await axios.get("getQualityEnvUpd", {
            params: {
                npwp: empid(),
            },
        });  
        
        if(res.data){
            tmpDataQA.status_1 = res.data.data1[0];
            tmpDataQA.status_2 = res.data.data2[0];
            tmpDataQA.status_3 = res.data.data3[0];
            tmpDataQA.status_4 = res.data.data4[0];
            tmpDataQA.status_5 = res.data.data5[0];
            tmpDataQA.versi_1 = res.data.data1[1];
            tmpDataQA.versi_2 = res.data.data2[1];
            tmpDataQA.versi_3 = res.data.data3[1];
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

        // console.log(res);
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
        $q.loading.show();
        const res = await axios.get("getCompanyProfileUpd", {
            params: {
                npwp: empid(),
            },
        });

        listCompro.value = res.data;
        $q.loading.hide();
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

const rejectFileCP = (err) => {
    console.log(err[0].file);
    if(err[0].file.type != 'application/pdf'){
        $q.notify({
            type: 'negative',
            message: 'Format file upload harus PDF'
        })
    }
    if(err[0].file.size > 2097152){
        $q.notify({
            type: 'negative',
            message: 'Ukuran file maksimal 2 MB'
        })  
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
    getQualityEnvUpd();
    getPaktaIntegritas();
    getCompro();
    getPengalamanPers();
    getScopeKerja();
});

// window.localStorage.clear();
</script>