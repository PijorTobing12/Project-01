<template>
  <div class="q-pa-md">
    <q-card>
      <q-separator />

      <q-card-section>
        <div class="row q-col-gutter-md tw-mb-5">
          <div class="col-12 col-md-12">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input type="text" v-model="dataSupplier.sup_code" dense outlined label="Kode Ekspedisi" readonly />
              </div>
              <div class="col-12 col-md-6">
                <q-input type="text" v-model="dataSupplier.sup_name" dense outlined label="Nama Ekspedisi" readonly />
              </div>
              <div class="col-12 col-md-6">
                <q-input type="text" v-model="dataSupplier.sup_office_address" dense outlined label="Alamat Ekspedisi" readonly />
              </div>
              <div class="col-12 col-md-6">
                <q-input type="text" v-model="dataSupplier.sup_office_phone" dense outlined label="Telp. Ekspedisi" readonly />
              </div>
              <div class="col-12 col-md-12">
                <q-input type="text" v-model="pagination.kode_kirim" dense outlined label="Kode Kirim" />
              </div>
              <div class="col-12 col-md-6">
                <q-input label="Tgl. Kedatangan Awal" outlined dense v-model="pagination.date_start">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="pagination.date_start" mask="YYYY-MM-DD" @update:model-value="hideDate">
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-md-6">
                <q-input label="Tgl. Kedatangan Akhir" outlined dense v-model="pagination.date_end">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="pagination.date_end" mask="YYYY-MM-DD" @update:model-value="hideDate">
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>

              <div class="col-12">
                <q-btn-group push>
                  <q-btn push color="primary" label="Filter Data" @click="getShipmentMonitor" />
                </q-btn-group>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <q-table title="Monitor Pengiriman" :columns="columns" :rows="listDataHeader" row-key="id"
          v-model:paginationpo="pagination" :loading="loading" :filter="pagination.filter" @request="onRequest"
          binary-state-sort>
          <template v-slot:top-right>
            <q-input borderless dense debounce="300" v-model="pagination.filter" placeholder="Search">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
          <template v-slot:body-cell-no_pol="props">
            <q-td :props="props">
              <a style="color: blue; cursor: pointer;" target="_blank" @click="openDialogNoPol(props.row.armada, props.row.no_pol, props.row.nama_sopir, props.row.telp_sopir, props.row.no_seal, props.row.no_container, props.row.keterangan)">{{ props.row.no_pol }}</a>
            </q-td>
          </template>
          <template v-slot:body-cell-kode_ekspedisi="props">
            <q-td :props="props">
              <a style="color: blue; cursor: pointer;" target="_blank" @click="openDialogEkspedisi(props.row.kode_ekspedisi, props.row.nama_ekspedisi, props.row.alamat_ekspedisi, props.row.telp_ekspedisi)">{{ props.row.kode_ekspedisi }}</a>
            </q-td>
          </template>
          <template v-slot:body-cell-truk_masuk="props">
            <q-td :props="props">
              <img v-if="props.row.truk_masuk === null" :src="props.row.truk_red">
              <img v-if="props.row.truk_masuk !== null" :src="props.row.truk_green">
              <div style="position: absolute; top: 45%; left: 39%; transform: translate(-50%, -50%);">{{ (props.row.truk_masuk === null ? '' : formatHourMinuteOnly(props.row.truk_masuk)) }}</div>
            </q-td>
          </template>
          <template v-slot:body-cell-serah_spm="props">
            <q-td :props="props">
              <img v-if="props.row.serah_spm === null" :src="props.row.truk_red">
              <img v-if="props.row.serah_spm !== null" :src="props.row.truk_green">
              <a v-if="props.row.site === 'Ngoro'" style="color: blue; cursor: pointer; position: absolute; top: 45%; left: 39%; transform: translate(-50%, -50%);" target="_blank" @click="openDialogAdminMuatNgoro(props.row.no_urut_pesan)">{{ (props.row.serah_spm === null ? '' : formatHourMinuteOnly(props.row.serah_spm)) }}</a>
              <a v-if="props.row.site !== 'Ngoro'" style="color: blue; cursor: pointer; position: absolute; top: 45%; left: 39%; transform: translate(-50%, -50%);" target="_blank" @click="openDialogAdminMuat(props.row.no_urut_pesan)">{{ (props.row.serah_spm === null ? '' : formatHourMinuteOnly(props.row.serah_spm)) }}</a>
            </q-td>
          </template>
          <template v-slot:body-cell-start_muat="props">
            <q-td :props="props">
              <img v-if="props.row.start_muat === null" :src="props.row.truk_red">
              <img v-if="props.row.start_muat !== null" :src="props.row.truk_green">
              <div style="position: absolute; top: 45%; left: 36%; transform: translate(-50%, -50%);">{{ (props.row.start_muat === null ? '' : formatHourMinuteOnly(props.row.start_muat)) }}</div>
            </q-td>
          </template>
          <template v-slot:body-cell-end_muat="props">
            <q-td :props="props">
              <img v-if="props.row.end_muat === null" :src="props.row.truk_red">
              <img v-if="props.row.end_muat !== null" :src="props.row.truk_green">
              <div style="position: absolute; top: 45%; left: 33%; transform: translate(-50%, -50%);">{{ (props.row.end_muat === null ? '' : formatHourMinuteOnly(props.row.end_muat)) }}</div>
            </q-td>
          </template>
          <template v-slot:body-cell-final_checker="props">
            <q-td :props="props">
              <img v-if="props.row.final_checker === null" :src="props.row.truk_red">
              <img v-if="props.row.final_checker !== null" :src="props.row.truk_green">
              <div style="position: absolute; top: 45%; left: 36%; transform: translate(-50%, -50%);">{{ (props.row.final_checker === null ? '' : formatHourMinuteOnly(props.row.final_checker)) }}</div>
            </q-td>
          </template>
          <template v-slot:body-cell-admin_sj="props">
            <q-td :props="props">
              <img v-if="props.row.admin_sj === null" :src="props.row.truk_red">
              <img v-if="props.row.admin_sj !== null" :src="props.row.truk_green">
              <a style="color: blue; cursor: pointer; position: absolute; top: 45%; left: 48%; transform: translate(-50%, -50%);" target="_blank" @click="openDialogAdminSJ(props.row.no_pol, props.row.tanggal_target, props.row.kode_kirim)">{{ (props.row.admin_sj === null ? '' : formatHourMinuteOnly(props.row.admin_sj)) }}</a>
            </q-td>
          </template>
          <template v-slot:body-cell-truk_keluar="props">
            <q-td :props="props">
              <img v-if="props.row.truk_keluar === null" :src="props.row.truk_red">
              <img v-if="props.row.truk_keluar !== null" :src="props.row.truk_green">
              <div style="position: absolute; top: 45%; left: 40%; transform: translate(-50%, -50%);">{{ (props.row.truk_keluar === null ? '' : formatHourMinuteOnly(props.row.truk_keluar)) }}</div>
            </q-td>
          </template>
          <template v-slot:body-cell-lat="props">
            <q-td :props="props">
              <a v-if="props.row.lat !== ''" style="color: blue; cursor: pointer;" @click="redirectLocation()">ADA</a>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <q-dialog v-model="dialogNoPol" persistent :minimized="minimizedToggle" transition-show="slide-up"
      transition-hide="slide-down">
      <q-card>
        <q-card-section>
          <div class="text-h6">Detail Nopol</div>
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 80vh" class="scroll">
          <Form :validation-schema="schema1" @submit="savePICApproval" class="q-mt-md">

            <div class="row q-col-gutter-sm">
              <div class="col-12 col-md-6">
                <q-input type="text" v-model="dataNoPol.armada" dense outlined label="Armada" readonly />
              </div>
              <div class="col-12 col-md-6">
                <q-input type="text" v-model="dataNoPol.no_pol" dense outlined label="No. Polisi" readonly />
              </div>
              <div class="col-12 col-md-6">
                <q-input type="text" v-model="dataNoPol.nama_sopir" dense outlined label="Nama Sopir" readonly />
              </div>
              <div class="col-12 col-md-6">
                <q-input type="text" v-model="dataNoPol.telp_sopir" dense outlined label="Telp. Sopir" readonly />
              </div>
              <div class="col-12 col-md-6">
                <q-input type="text" v-model="dataNoPol.no_seal" dense outlined label="No. Seal" readonly />
              </div>
              <div class="col-12 col-md-6">
                <q-input type="text" v-model="dataNoPol.no_container" dense outlined label="No. Container" readonly />
              </div>
              <div class="col-12 col-md-6">
                <q-input type="text" v-model="dataNoPol.keterangan" dense outlined label="Keterangan" readonly />
              </div>
            </div>

          </Form>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn dense label="Close" color="red" v-close-popup push  @click="reset" />
        </q-card-actions>

      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogEkspedisi" persistent :minimized="minimizedToggle" transition-show="slide-up"
      transition-hide="slide-down">
      <q-card>
        <q-card-section>
          <div class="text-h6">Detail Ekspedisi</div>
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 80vh;" class="scroll">
          <Form :validation-schema="schema1" @submit="savePICApproval" class="q-mt-md">

            <div class="row q-col-gutter-sm">
              <div class="col-12 col-md-6">
                <q-input type="text" v-model="dataEkspedisi.kode_ekspedisi" dense outlined label="Kode Ekspedisi" readonly />
              </div>
              <div class="col-12 col-md-6">
                <q-input type="text" v-model="dataEkspedisi.nama_ekspedisi" dense outlined label="Nama Ekspedisi" readonly />
              </div>
              <div class="col-12 col-md-6">
                <q-input type="text" v-model="dataEkspedisi.alamat_ekspedisi" dense outlined label="Alamat Ekspedisi" readonly />
              </div>
              <div class="col-12 col-md-6">
                <q-input type="text" v-model="dataEkspedisi.telp_ekspedisi" dense outlined label="Telp. Ekspedisi" readonly />
              </div>
            </div>

          </Form>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn  dense label="Close" color="red" v-close-popup push  @click="reset" />
        </q-card-actions>

      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogAdminSJ" persistent :maximized="maximizedToggle" transition-show="slide-up"
      transition-hide="slide-down">
      <q-card>
        <q-card-section>
          <div class="text-h6">List Surat Jalan</div>
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 80vh" class="scroll">
          <Form :validation-schema="schema1" @submit="savePICApproval" class="q-mt-md">
            <div class="row q-col-gutter-sm">

              <div class="col-12 col-md-6">
                <q-input type="text" v-model="dataAdminSJ.tanggal_target" dense outlined label="Tgl. target" readonly />
              </div>
              <div class="col-12 col-md-6">
                <q-input type="text" v-model="dataAdminSJ.no_pol" dense outlined label="No. Polisi" readonly />
              </div>
              <div class="col-12 col-md-12">
                <q-input type="text" v-model="dataAdminSJ.kode_kirim" dense outlined label="Kode Kirim" readonly />
              </div>

              <div class="col-12">
                <ul>
                  <li>Klik <b>Nomor SJ</b> Untuk Melihat Detail Isi Surat Jalan</li>
                  <li>Klik <a style="font-weight: bold; color: blue; cursor: pointer;" target="_blank" @click="openDialogAdminSJDetail('')">Disini</a> Untuk Melihat Semua Daftar Barang Muatan</li>
                </ul>
              </div>

              <div class="col-12 tw-mt-3">
              <q-table title="List Surat Jalan" :columns="columnsAdminSJ" :rows="listDataAdminSJ" row-key="no_mrr"
                v-model:paginationpo="paginationpo2" :loading="loading" :filter="paginationpo2.filter" @request="onRequest"
                binary-state-sort>
                <template v-slot:top-right>
                  <q-input borderless dense debounce="300" v-model="paginationpo2.filter" placeholder="Search">
                    <template v-slot:append>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </template>
                <template v-slot:body-cell-action="props">
                  <q-td :props="props">
                    <q-btn-group push>
                      <q-btn dense color="info" class="text-weight-regular text-caption" 
                        @click="redirect2(props.row)" push label="Detail" icon="visibility" />
                    </q-btn-group>
                  </q-td>
                </template>
                <template v-slot:body-cell-no_sj="props">
                  <q-td :props="props">
                    <a style="color: blue; cursor: pointer;" target="_blank" @click="openDialogAdminSJDetail(props.row.no_sj)">{{ props.row.no_sj }}</a>
                  </q-td>
                </template>
              </q-table>
            </div>

            </div>

          </Form>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn dense label="Close" color="red" v-close-popup push  @click="reset" />
        </q-card-actions>

      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogAdminSJDetail" persistent :maximized="maximizedToggle" transition-show="slide-up"
      transition-hide="slide-down">
      <q-card>
        <q-card-section>
          <div class="text-h6">Detail Surat Jalan {{ (dataAdminSJDetail.no_sj == '' ? '' : ' Untuk No. ' + dataAdminSJDetail.no_sj) }}</div>
        </q-card-section>
        <q-separator />

        <q-card-section style="max-height: 80vh" class="scroll">
          <Form :validation-schema="schema1" @submit="savePICApproval" class="q-mt-md">
            <div class="row q-col-gutter-sm">

              <div class="col-12 col-md-6">
                <q-input type="text" v-model="dataAdminSJDetail.tanggal_target" dense outlined label="Tgl. target" readonly />
              </div>
              <div class="col-12 col-md-6">
                <q-input type="text" v-model="dataAdminSJDetail.no_pol" dense outlined label="No. Polisi" readonly />
              </div>
              <div class="col-12 col-md-12">
                <q-input type="text" v-model="dataAdminSJDetail.kode_kirim" dense outlined label="Kode Kirim" readonly />
              </div>

              <div class="col-12 tw-mt-3">
              <q-table title="Detail Surat Jalan" :columns="columnsAdminSJDetail" :rows="listDataAdminSJDetail" row-key="no_mrr"
                v-model:paginationpo="paginationpo2" :loading="loading" :filter="paginationpo2.filter" @request="onRequest"
                binary-state-sort>
                <template v-slot:top-right>
                  <q-input borderless dense debounce="300" v-model="paginationpo2.filter" placeholder="Search">
                    <template v-slot:append>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </template>
                <template v-slot:body-cell-action="props">
                  <q-td :props="props">
                    <q-btn-group push>
                      <q-btn dense color="info" class="text-weight-regular text-caption" 
                        @click="redirect2(props.row)" push label="Detail" icon="visibility" />
                    </q-btn-group>
                  </q-td>
                </template>
                <template #bottom-row>
                  <q-tr class="bg-green-1">
                    <q-td /><q-td />
                    <q-td class="text-right text-bold">
                      {{ new Intl.NumberFormat('id-ID').format(sumBy(listDataAdminSJDetail, 'qty')) }}
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </div>

            </div>

          </Form>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn dense label="Close" color="red" v-close-popup push />
        </q-card-actions>

      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogAdminMuat" persistent :maximized="maximizedToggle" transition-show="slide-up"
      transition-hide="slide-down">
      <q-card>
        <q-card-section>
          <div class="text-h6">Detail Rencana Muat Untuk No. {{ dataAdminMuat.visual_no }}</div>
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 80vh" class="scroll">
          <Form :validation-schema="schema1" @submit="savePICApproval" class="q-mt-md">
            <div class="row q-col-gutter-sm">

              <div class="col-12 tw-mt-3">
              <q-table title="Detail Rencana Muat" :columns="columnsAdminMuat" :rows="listDataAdminMuat" row-key="no_mrr"
                v-model:paginationpo="paginationpo2" :loading="loading" :filter="paginationpo2.filter" @request="onRequest"
                binary-state-sort>
                <template v-slot:top-right>
                  <q-input borderless dense debounce="300" v-model="paginationpo2.filter" placeholder="Search">
                    <template v-slot:append>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </template>
                <template v-slot:body-cell-action="props">
                  <q-td :props="props">
                    <q-btn-group push>
                      <q-btn dense color="info" class="text-weight-regular text-caption" 
                        @click="redirect2(props.row)" push label="Detail" icon="visibility" />
                    </q-btn-group>
                  </q-td>
                </template>
                <template #bottom-row>
                  <q-tr class="bg-green-1">
                    <q-td /><q-td /><q-td /><q-td /><q-td /><q-td />
                    <q-td class="text-right text-bold">
                      {{ new Intl.NumberFormat('id-ID').format(sumBy(listDataAdminMuat, 'qty')) }}
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </div>

            </div>

          </Form>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn dense label="Close" color="red" v-close-popup push />
        </q-card-actions>

      </q-card>
    </q-dialog>
    
    <q-dialog v-model="dialogAdminMuatNgoro" persistent :maximized="maximizedToggle" transition-show="slide-up"
      transition-hide="slide-down">
      <q-card>
        <q-card-section>
          <div class="text-h6">Detail Rencana Muat Untuk No. {{ dataAdminMuatNgoro.visual_no }}</div>
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 80vh" class="scroll">
          <Form :validation-schema="schema1" @submit="savePICApproval" class="q-mt-md">
            <div class="row q-col-gutter-sm">

              <div class="col-12 tw-mt-3">
              <q-table title="Detail Rencana Muat" :columns="columnsAdminMuatNgoro" :rows="listDataAdminMuatNgoro" row-key="no_mrr"
                v-model:paginationpo="paginationpo2" :loading="loading" :filter="paginationpo2.filter" @request="onRequest"
                binary-state-sort>
                <template v-slot:top-right>
                  <q-input borderless dense debounce="300" v-model="paginationpo2.filter" placeholder="Search">
                    <template v-slot:append>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </template>
                <template v-slot:body-cell-action="props">
                  <q-td :props="props">
                    <q-btn-group push>
                      <q-btn dense color="info" class="text-weight-regular text-caption" 
                        @click="redirect2(props.row)" push label="Detail" icon="visibility" />
                    </q-btn-group>
                  </q-td>
                </template>
                <template #bottom-row>
                  <q-tr class="bg-green-1">
                    <q-td /><q-td /><q-td /><q-td /><q-td /><q-td />
                    <q-td class="text-right text-bold">
                      {{ new Intl.NumberFormat('id-ID').format(sumBy(listDataAdminMuatNgoro, 'qty')) }}
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </div>

            </div>

          </Form>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn dense label="Close" color="red" v-close-popup push />
        </q-card-actions>

      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import axios from "axios";
import { ParseError, domain, empid, formatDate, formatHourMinuteOnly, formatDateOnly } from "../../utils";
import { useQuasar } from "quasar";
import { Field, Form } from "vee-validate";
import * as yup from "yup";
import { IMaskDirective } from 'vue-imask';
import { VMoney } from 'v-money';
import { useRouter, useRoute } from "vue-router";
import { date } from 'quasar';
import { sumBy, meanBy } from 'lodash-es'

const columns = [
  {
    name: "tanggal_target",
    required: true,
    label: "Tanggal",
    align: "center",
    field: "tanggal_target",
    format: val => formatDateOnly(val),
    sortable: true,
  },
  {
    name: "ship",
    required: true,
    label: "Kode Kirim",
    align: "left",
    field: "ship",
    sortable: true,
  },
  {
    name: "no_pol",
    required: true,
    label: "No. Polisi",
    align: "center",
    field: "no_pol",
    sortable: true,
  },
  {
    name: "kode_ekspedisi",
    required: true,
    label: "Kode Ekspedisi",
    align: "center",
    field: "kode_ekspedisi",
    sortable: true,
    classes: 'hidden',
    headerClasses: 'hidden',
  },
  {
    name: "produk",
    required: true,
    label: "Produk",
    align: "center",
    field: "produk",
    sortable: true,
  },
  {
    name: "no_urut_visual",
    required: true,
    label: "No. Urut Visual",
    align: "center",
    field: "no_urut_visual",
    sortable: true,
  },
  {
    name: "truk_masuk",
    required: true,
    label: "Truk Masuk",
    align: "center",
    field: "truk_masuk",
    sortable: true,
    format: val => formatHourMinuteOnly(val),
  },
  {
    name: "serah_spm",
    required: true,
    label: "Adm. Muat",
    align: "center",
    field: "serah_spm",
    sortable: true,
    format: val => formatHourMinuteOnly(val),
  },
  {
    name: "start_muat",
    required: true,
    label: "Mulai Loading",
    align: "center",
    field: "start_muat",
    sortable: true,
    format: val => formatHourMinuteOnly(val),
  },
  {
    name: "end_muat",
    required: true,
    label: "Selesai Loading",
    align: "center",
    field: "end_muat",
    sortable: true,
    format: val => formatHourMinuteOnly(val),
  },
  {
    name: "final_checker",
    required: true,
    label: "Final Checker",
    align: "center",
    field: "final_checker",
    sortable: true,
    format: val => formatHourMinuteOnly(val),
  },
  {
    name: "admin_sj",
    required: true,
    label: "Adm. SJ",
    align: "center",
    field: "admin_sj",
    sortable: true,
    format: val => formatHourMinuteOnly(val),
  },
  {
    name: "truk_keluar",
    required: true,
    label: "Truk Keluar",
    align: "center",
    field: "truk_keluar",
    sortable: true,
    format: val => formatHourMinuteOnly(val),
  },
  {
    name: "lat",
    required: true,
    label: "Posisi Truk",
    align: "center",
    field: "lat",
    sortable: true,
    classes: 'hidden',
    headerClasses: 'hidden',
  },
  {
    name: "keterangan",
    required: true,
    label: "Keterangan",
    align: "left",
    field: "keterangan",
    sortable: true,
  },
  {
    name: "site",
    required: true,
    label: "Site",
    align: "center",
    field: "site",
    sortable: true,
  },
  {
    name: "tgl_konfirmasi_driver_src",
    required: true,
    label: "Ketibaan Truk",
    align: "center",
    field: "tgl_konfirmasi_driver_src",
    sortable: true,
  },
];

const columnsAdminSJ = [
  {
    name: "tgl_sj",
    required: true,
    label: "Tgl. PPS ",
    align: "center",
    field: "tgl_sj",
    format: val => formatDateOnly(val),
    sortable: true,
  },
  {
    name: "tgl_sj",
    required: true,
    label: "Tgl. SJ ",
    align: "center",
    field: "tgl_sj",
    format: val => formatDateOnly(val),
    sortable: true,
  },
  {
    name: "no_so",
    required: true,
    label: "No. SO",
    align: "center",
    field: "no_so",
    sortable: true,
  },
  {
    name: "no_sj",
    required: true,
    label: "No. SJ",
    align: "center",
    field: "no_sj",
    sortable: true,
  },
];

const columnsAdminSJDetail = [
  {
    name: "kode_barang",
    required: true,
    label: "Kode Barang",
    align: "center",
    field: "kode_barang",
    sortable: true,
  },
  {
    name: "nama_barang",
    required: true,
    label: "Nama Barang",
    align: "left",
    field: "nama_barang",
    sortable: true,
  },
  {
    name: "qty",
    required: true,
    label: "Jumlah",
    align: "right",
    field: "qty",
    sortable: true,
    format: val => new Intl.NumberFormat('id-ID').format(val),
  },
];

const columnsAdminMuat = [
  {
    name: "no_nesting",
    required: true,
    label: "No. Nesting",
    align: "center",
    field: "no_nesting",
    sortable: true,
  },
  {
    name: "nopps",
    required: true,
    label: "No. PPS",
    align: "center",
    field: "nopps",
    sortable: true,
  },
  {
    name: "line",
    required: true,
    label: "Line",
    align: "center",
    field: "line",
    sortable: true,
  },
  {
    name: "no_so",
    required: true,
    label: "No. SO",
    align: "center",
    field: "no_so",
    sortable: true,
  },
  {
    name: "kode_barang",
    required: true,
    label: "Kode Barang",
    align: "center",
    field: "kode_barang",
    sortable: true,
  },
  {
    name: "nama_barang",
    required: true,
    label: "Nama Barang",
    align: "left",
    field: "nama_barang",
    sortable: true,
  },
  {
    name: "qty",
    required: true,
    label: "Jumlah",
    align: "right",
    field: "qty",
    sortable: true,
    format: val => new Intl.NumberFormat('id-ID').format(val),
  },
  {
    name: "kode_kirim",
    required: true,
    label: "Kode Kirim",
    align: "center",
    field: "kode_kirim",
    sortable: true,
  },
];

const columnsAdminMuatNgoro = [
  {
    name: "kode_kirim",
    required: true,
    label: "Kode Kirim",
    align: "center",
    field: "kode_kirim",
    sortable: true,
  },
  {
    name: "nomor_so",
    required: true,
    label: "No. SO",
    align: "center",
    field: "nomor_so",
    sortable: true,
  },
  {
    name: "line",
    required: true,
    label: "Line",
    align: "center",
    field: "line",
    sortable: true,
  },
  {
    name: "kode_item",
    required: true,
    label: "Kode Barang",
    align: "center",
    field: "kode_item",
    sortable: true,
  },
  {
    name: "nama_barang",
    required: true,
    label: "Nama Barang",
    align: "left",
    field: "nama_barang",
    sortable: true,
  },
  {
    name: "jumlah",
    required: true,
    label: "Jumlah",
    align: "right",
    field: "jumlah",
    sortable: true,
    format: val => new Intl.NumberFormat('id-ID').format(val),
  },
];

const $q = useQuasar();
const listDataHeader = ref([]);
const listDataAdminSJ = ref([]);
const listDataAdminSJDetail = ref([]);
const listDataAdminMuat = ref([]);
const listDataAdminMuatNgoro = ref([]);
const listDataSupplier = ref([]);

const right = ref(false);

const loading = ref(false);
const dialogNoPol = ref(false);
const dialogEkspedisi = ref(false);
const dialogAdminSJ = ref(false);
const dialogAdminSJDetail = ref(false);
const dialogAdminMuat = ref(false);
const dialogAdminMuatNgoro = ref(false);
const maximizedToggle = ref(true);
const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10,
  filter: null,
  domain: domain(),
  trans_flag: null,
  trans_code: null,
  po_no: null,
  inv_no: null,
  tt_no: null,
  date_start: date.formatDate(new Date(), 'YYYY-MM-01'),
  date_end: date.formatDate(date.endOfDate(new Date(), 'month'), 'YYYY-MM-DD'),
});

const dataNoPol = ref({
  armada: null,
  no_pol: null,
  nama_sopir: null,
  telp_sopir: null,
  no_seal: null,
  no_container: null,
  keterangan: null,
});

const dataEkspedisi = ref({
  kode_ekspedisi: null,
  nama_ekspedisi: null,
  alamat_ekspedisi: null,
  telp_ekspedisi: null,
});

const dataAdminSJ = ref({
  tanggal_target: null,
  no_pol: null,
  kode_kirim: null,
});

const dataAdminSJDetail = ref({
  tanggal_target: null,
  no_pol: null,
  kode_kirim: null,
  no_sj: null
});

const dataAdminMuat = ref({
  visual_no: null,
});

const dataAdminMuatNgoro = ref({
  visual_no: null,
});

const dataSupplier = ref({
  sup_code: null,
  sup_name: null,
  sup_office_address: null,
  sup_office_phone: null,
});

const paginationpo2 = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10,
  filter: null,
  domain: domain(),
  trans_flag: null,
});

const GiveitDisable = ref(false);

const getSelectedString = () => {
  return selected.value.length === 0 ? '' : `${selected.value.length} record${selected.value.length > 1 ? 's' : ''} selected`
}

const redirectLocation = (data) => {
  window.open('/#/Location', '_blank', 'noreferrer');
};

const tmpForm = reactive({
  bussinessunit: null,
  po_number: null,
  DOUser: empid(),
});

const getMSupplier = async () => {
  try {
    loading.value = true;
    const res = await axios.get("getMSupplier", {
      params: pagination.value,
    });
    listDataSupplier.value = res.data.m_supplier;
    dataSupplier.value.sup_code = listDataSupplier.value[0].sup_code;
    dataSupplier.value.sup_name = listDataSupplier.value[0].sup_name;
    dataSupplier.value.sup_office_address = listDataSupplier.value[0].sup_office_address;
    dataSupplier.value.sup_office_phone = listDataSupplier.value[0].sup_office_phone;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getShipmentMonitor = async () => {
  try {
    loading.value = true;
    const res = await axios.get("getShipmentMonitor", {
      params: pagination.value,
    });
    listDataHeader.value = res.data.viscon;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getAdminSJ = async () => {
  try {
    loading.value = true;
    const res = await axios.get("getAdminSJ", {
      params: dataAdminSJ.value,
    });
    listDataAdminSJ.value = res.data.admin;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getAdminSJDetail = async () => {
  try {
    loading.value = true;
    const res = await axios.get("getAdminSJDetail", {
      params: dataAdminSJDetail.value,
    });
    listDataAdminSJDetail.value = res.data.SJDetail;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getAdminMuat = async () => {
  try {
    loading.value = true;
    const res = await axios.get("getAdminMuat", {
      params: dataAdminMuat.value,
    });
    listDataAdminMuat.value = res.data.adminMuat;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getAdminMuatNgoro = async () => {
  try {
    loading.value = true;
    const res = await axios.get("getAdminMuatNgoro", {
      params: dataAdminMuatNgoro.value,
    });
    listDataAdminMuatNgoro.value = res.data.adminMuatNgoro;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const openDialogNoPol = (armada, no_pol, nama_sopir, telp_sopir, no_seal, no_container, keterangan) => {
  dialogNoPol.value = true;
  dataNoPol.value.armada = (armada === '' ? '-' : armada);
  dataNoPol.value.no_pol = (no_pol === '' ? '-' : no_pol);
  dataNoPol.value.nama_sopir = (nama_sopir === '' ? '-' : nama_sopir);
  dataNoPol.value.telp_sopir = (telp_sopir === '' ? '-' : telp_sopir);
  dataNoPol.value.no_seal = (no_seal === '' ? '-' : no_seal);
  dataNoPol.value.no_container = (no_container === '' ? '-' : no_container);
  dataNoPol.value.keterangan = (keterangan === '' ? '-' : keterangan);
};

const openDialogEkspedisi = (kode_ekspedisi, nama_ekspedisi, alamat_ekspedisi, telp_ekspedisi) => {
  dialogEkspedisi.value = true;
  dataEkspedisi.value.kode_ekspedisi = (kode_ekspedisi === '' ? '-' : kode_ekspedisi);
  dataEkspedisi.value.nama_ekspedisi = (nama_ekspedisi === '' ? '-' : nama_ekspedisi);
  dataEkspedisi.value.alamat_ekspedisi = (alamat_ekspedisi === '' ? '-' : alamat_ekspedisi);
  dataEkspedisi.value.telp_ekspedisi = (telp_ekspedisi === '' ? '-' : telp_ekspedisi);
};

const openDialogAdminSJ = (no_pol, tanggal_target, kode_kirim) => {
  dialogAdminSJ.value = true;
  dataAdminSJ.value.tanggal_target = dayjs(`${tanggal_target}`).format("YYYY-MM-DD");
  dataAdminSJ.value.no_pol = no_pol;
  dataAdminSJ.value.kode_kirim = kode_kirim;
  getAdminSJ();
};

const openDialogAdminSJDetail = (no_sj) => {
  dialogAdminSJDetail.value = true;
  dataAdminSJDetail.value.tanggal_target = dayjs(`${dataAdminSJ.value.tanggal_target}`).format("YYYY-MM-DD");
  dataAdminSJDetail.value.no_pol = dataAdminSJ.value.no_pol;
  dataAdminSJDetail.value.kode_kirim = dataAdminSJ.value.kode_kirim;
  dataAdminSJDetail.value.no_sj = no_sj;
  getAdminSJDetail();
};

const openDialogAdminMuat = (visual_no) => {
  dialogAdminMuat.value = true;
  dataAdminMuat.value.visual_no = visual_no;
  getAdminMuat();
};

const openDialogAdminMuatNgoro = (visual_no) => {
  dialogAdminMuatNgoro.value = true;
  dataAdminMuatNgoro.value.visual_no = visual_no;
  getAdminMuatNgoro();
};

const reset = () => {
  tmpForm.bussinessunit = null;
  tmpForm.DOUser = empid();
  GiveitDisable.value = false;
  tmpForm.po_number = null;
  listMrrPO2.value = []
};

const onRequest = (props) => {
  const { page, rowsPerPage, sortBy, descending, filter } = props.pagination;
  pagination.value.filter = filter;
  pagination.value.page = page;
  pagination.value.rowsPerPage = rowsPerPage;
  pagination.value.sortBy = sortBy;
  pagination.value.descending = descending;
  pagination.value.empid = empid();
  getShipmentMonitor();
  getMSupplier();
};

onMounted(() => {
  onRequest({
    pagination: pagination.value,
  });
});

document.addEventListener("etrasn_setdomain", () => {
  pagination.value.domain = domain();
  getShipmentMonitor();
});

</script>