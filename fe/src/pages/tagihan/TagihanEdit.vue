<template>
  <div class="q-pa-md">
    <q-card>
      <q-separator />
      <h3 align="center" v-if=" listTagihan.trans_revisi > 0 && listTagihan.trans_revisi != '' && listTagihan.trans_revisi != '' "><b>Data Tagihan (Revisi : {{ listTagihan.trans_revisi }})</b></h3>
      <h3 align="center" v-else><b>Data Tagihan</b></h3>
      <hr/>

      <q-card-section v-if="listHistoryTagihan.length > 0">
        History Revisi
      <q-list v-for="(data, i) in listHistoryTagihan" :key="i">
        <!-- Inset separator example -->
        <q-list-header>&#9900;   &nbsp; Revisi {{i+1}}</q-list-header>
        <q-item>Tanggal Revisi : {{ data.history_date }} <br/> Bisnis Unit : {{  data.bu_name  }} <br/> PIC FA : {{  data.Name_User }} <br/> Catatan Revisi : {{ data.history_desc }} <br/></q-item>
        <q-item-separator />
      </q-list>
      </q-card-section>
      <hr/>

      <q-card-section>
        <div class="row q-col-gutter-md tw-mb-5">
          <div class="col-12 col-md-12">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-input type="text" v-model="listTagihan.trans_code" dense outlined label="No. Tagihan" readonly/>
              </div>
              <div class="col-12 col-md-4">
                <q-input type="text" v-model="listTagihan.created_date" dense outlined label="Tanggal Buat" readonly/>
              </div>
              <div class="col-12 col-md-4">
                <q-input type="text" v-model="listTagihan.bu_name" dense outlined label="Perusahaan" readonly/>
              </div>
            </div>
          </div>
        </div>
        <q-btn v-if="listTagihan.trans_flag_desc !== 'Check Finance' && listTagihan.trans_flag_desc !== 'Approve Finance' && listTagihan.trans_flag_desc !== 'Revisi AP'" label="Proses Tagihan"  color="primary"  @click="prosesTagihan(listTagihan.trans_code)"/>
      </q-card-section>


      <q-card-section>
        <q-table title="List PO" :columns="columns" :rows="listPO" row-key="id"
          v-model:paginationpo="paginationpo" :loading="loading" :filter="paginationpo.filter" @request="onRequest"
          binary-state-sort>
          <template v-slot:top-right>
            <q-input borderless dense debounce="300" v-model="paginationpo.filter" placeholder="Search">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
          <template v-slot:body-cell-aksi="props">
            <q-td :props="props">
              <!-- {{ props }} -->
              <!-- {{props.row.status }} -->
              <q-btn-group v-if="listTagihan.trans_flag_desc === 'Revisi Finance' && props.row.dtl_flag !== null" push>
                <q-btn dense color="info" class="text-weight-regular text-caption" 
                  @click="redirect(props.row)" push label="Detail" icon="visibility" />
                <q-btn dense color="negative" class="text-weight-regular text-caption"
                  @click="deletePO(props.row)" push label="Hapus" icon="delete" />
              </q-btn-group>

              <q-btn-group v-if="listTagihan.trans_flag_desc === 'Revisi Finance' && props.row.dtl_flag === null" push>
                <q-btn dense color="info" class="text-weight-regular text-caption" 
                @click="redirect(props.row)" push label="Detail" icon="visibility" />
                <q-btn dense color="negative" class="text-weight-regular text-caption"
                @click="deletePO(props.row)" push label="Hapus" icon="delete" />
              </q-btn-group>

              <q-btn-group v-if="listTagihan.trans_flag_desc === 'Check Finance' || listTagihan.trans_flag_desc === 'Approve Finance' || listTagihan.trans_flag_desc === 'Revisi AP'" push>
                <q-btn dense color="info" class="text-weight-regular text-caption" 
                @click="redirect(props.row)" push label="Detail" icon="visibility" />
              </q-btn-group>

              <q-btn-group v-if="listTagihan.trans_flag_desc === 'Tagihan Pending'" push>
                <q-btn dense color="info" class="text-weight-regular text-caption"
                  @click="redirect(props.row)" push label="View" icon="visibility" />
                <q-btn dense color="negative" class="text-weight-regular text-caption"
                  @click="deletePO(props.row)" push label="Hapus" icon="delete" />
              </q-btn-group>
            </q-td>
          </template>
          <template v-slot:body-cell-print="props">
            <q-td :props="props">
              <q-btn-group v-if="props.row.trans_flag_desc === 'Approve Finance'" push>
                <q-btn dense color="warning" class="text-weight-regular text-caption"
                  @click="viewPengajuanHarga(props.row)" push label="Print" icon="print" />
              </q-btn-group>
            </q-td>
          </template>
        </q-table>
        <br/>
        <div class="col-12" align="center">
                <q-btn-group push>
                  <q-btn v-if="listTagihan.trans_flag_desc !== 'Check Finance' && listTagihan.trans_flag_desc !== 'Approve Finance' && listTagihan.trans_flag_desc !== 'Revisi AP'" push color="green" label="Tambah Data PO" @click="addPO(listTagihan)" />
                </q-btn-group>
        </div>
      </q-card-section>

      <q-card-section>
        <q-table title="List Invoice" :columns="columnsinv" :rows="listInv" row-key="id"
          v-model:paginationinv="paginationinv" :loading="loading" :filter="paginationinv.filter" @request="onRequest"
          binary-state-sort>
          <template v-slot:top-right>
            <q-input borderless dense debounce="300" v-model="paginationinv.filter" placeholder="Search">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
          <template v-slot:body-cell-aksi="props">
            <q-td :props="props">
              <!-- {{ props }} -->
              <!-- {{props.row.status }} -->
              <q-btn-group v-if="listTagihan.trans_flag_desc === 'Check Finance' || listTagihan.trans_flag_desc === 'Approve Finance' || listTagihan.trans_flag_desc === 'Revisi AP'" push>
                <q-btn dense color="info" class="text-weight-regular text-caption"
                  @click="previewInv(props.row)" push label="Preview" icon="visibility" />
              </q-btn-group>

              <q-btn-group v-if="listTagihan.trans_flag_desc === 'Revisi Finance' && props.row.dtl_flag === null" push>
                <q-btn dense color="grey" class="text-weight-regular text-caption"  @click="editInv(props.row)" push label="Edit"
                  icon="edit" />
                <q-btn dense color="negative" class="text-weight-regular text-caption"
                  @click="deleteInv(props.row)" push label="Hapus" icon="delete" />
              </q-btn-group>

              <q-btn-group v-if="listTagihan.trans_flag_desc === 'Revisi Finance' && props.row.dtl_flag === 1" push>
                <q-btn dense color="grey" class="text-weight-regular text-caption"  @click="editInv(props.row)" push label="Edit"
                  icon="edit" />
                <q-btn dense color="negative" class="text-weight-regular text-caption"
                  @click="deleteInv(props.row)" push label="Hapus" icon="delete" />
              </q-btn-group>

              <q-btn-group v-if="listTagihan.trans_flag_desc === 'Tagihan Pending'" push>
                <q-btn dense color="grey" class="text-weight-regular text-caption" @click="editInv(props.row)" push label="Edit"
                icon="edit" />
                <q-btn dense color="negative" class="text-weight-regular text-caption"
                  @click="deleteInv(props.row)" push label="Hapus" icon="delete" />
              </q-btn-group>
            </q-td>
          </template>
        </q-table>
        <br/>
        <div class="col-12" align="center">
                <q-btn-group push>
                  <q-btn v-if="listTagihan.trans_flag_desc !== 'Check Finance' && listTagihan.trans_flag_desc !== 'Approve Finance' && listTagihan.trans_flag_desc !== 'Revisi AP'" push color="green" label="Tambah Data Invoice" @click="addInv" />
                </q-btn-group>
        </div>
      </q-card-section>
    </q-card>

    <q-dialog v-model="dialogForm" persistent :maximized="maximizedToggle" transition-show="slide-up"
      transition-hide="slide-down">
      <q-card>
        <q-card-section>
          <div class="text-h6">Tambah PO</div>
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 80vh" class="scroll">
          <Form :validation-schema="schema1" @submit="savePICApproval" class="q-mt-md">
            <div class="row q-col-gutter-sm">
              <div class="col-6">
                <!-- <Field v-model="tmpPO.po_number" name="po_number"
                  v-slot="{ errorMessage, value, field }">
                  <q-select dense outlined emit-value map-options
                    input-debounce="0" option-value="po_number" option-label="desc_text" label="Pilih PO"
                    :options="listPO2" :error-message="errorMessage" :error="!!errorMessage" :model-value="value" v-bind="field" 
                    @update:model-value="getPOMrr(listTagihan)">
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No results
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </Field> -->

                <q-select dense outlined v-model="tmpPO.po_number" clearable emit-value map-options input-debounce="0" use-input 
                  option-value="po_number" option-label="desc_text" label="Pilih PO" :options="listPO2"
                  @filter="filterFnPO" @update:model-value="getPOMrr(listTagihan)">
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No results
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>

              <div class="col-12" hidden>
                <q-input v-model="tmpForm.DOUser" label="User" />
              </div>
              <!-- <q-btn unelevated rounded color="warning" label="Add Detail" @click="saveTmp" /> -->

            </div>

            <div class="col-12 tw-mt-3">
              <q-table title="List PO" :columns="columnspo" :rows="listMrrPO2" row-key="no_mrr"
                v-model:paginationpo="paginationpo2" :loading="loading" :filter="paginationpo2.filter" @request="onRequest"
                :selected-rows-label="getSelectedString"
                selection="multiple"
                v-model:selected="selected"
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
              <!-- {{ props }} -->
              <!-- {{props.row.status }} -->
              <q-btn-group push>
                <q-btn dense color="info" class="text-weight-regular text-caption" 
                  @click="redirect2(props.row)" push label="Detail" icon="visibility" />
              </q-btn-group>
            </q-td>
          </template>
        </q-table>
            </div>

          </Form>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn dense push label="Batal" color="red" v-close-popup @clisk="resetPO" /> 
          <q-btn dense push  label="Simpan" color="primary" @click="savePO" />
        </q-card-actions>

      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogForm_Inv" persistent :maximized="maximizedToggle" transition-show="slide-up"
      transition-hide="slide-down">
      <q-card>
        <q-card-section>
          <div class="text-h6">Tambah Invoice</div>
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 80vh" class="scroll">
            <div class="row q-col-gutter-sm">
              <div class="col-6">
                <Field v-model="tmpInv.po_number" name="po_number"
                  v-slot="{ errorMessage, value, field }">
                  <q-select dense outlined emit-value map-options
                    input-debounce="0" option-value="dtl_po" option-label="dtl_po" label="Pilih PO"
                    :options="listInvPO" :error-message="errorMessage" :error="!!errorMessage" :model-value="value" v-bind="field" multiple
                    @update:model-value="getdetailPO">
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

              <div class="col-6">
                <Field v-model="tmpInv.ppn" name="ppn"
                  v-slot="{ errorMessage, value, field }">
                  <q-select dense outlined emit-value map-options
                    input-debounce="0" option-value="value" option-label="label" label="PPN (Persen)"
                    :options="listPPN" :error-message="errorMessage" :error="!!errorMessage" :model-value="value" v-bind="field"
                    @update:model-value="calc_ppnn">
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

              <div class="col-6">
                <Field v-model="tmpInv.mrr" name="mrr"
                  v-slot="{ errorMessage, value, field }">
                  <q-select dense outlined emit-value map-options
                    input-debounce="0" option-value="trans_dtl_po" option-label="desc_text" label="No. MRR"
                    :options="listMrrPO" :error-message="errorMessage" :error="!!errorMessage" :model-value="value" v-bind="field" multiple
                    @update:model-value="getdppPO" :rules="[val => !!val || 'No. MRR harus diisi']" ref="mrrRef">
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
              
              <div class="col-6">
                <q-input label="Tgl Invoice" outlined dense v-model="tmpInv.tgl_inv" ref="tglRef"  :rules="[val => !!val || 'Tgl. Invoice harus diisi']">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="tmpInv.tgl_inv" mask="YYYY-MM-DD"  ref="tglRef"  :rules="[val => !!val || 'Tgl. Invoice harus diisi']">
                          <div class="row items-center justify-end q-gutter-sm">
                            <q-btn label="Cancel" color="primary" flat v-close-popup />
                            <q-btn label="OK" color="primary" flat v-close-popup />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              
              <div class="col-6" hidden>
                <q-input type="number" v-model="tmpForm.id" dense outlined label="ID" />
              </div>

              <div class="col-6">
                <q-input type="text" v-model="tmpInv.no_inv" ref="invRef"  :rules="[val => !!val || 'No. Invoice harus diisi']" dense outlined label="No. Invoice"/>
              </div>
            
              <div class="col-6">
                <q-input type="text" v-model="tmpInv.curr" dense outlined label="Currency" readonly/>
              </div>
              <div class="col-6">
                <q-input type="text" v-model="tmpInv.no_faktur" dense outlined label="No. Faktur Pajak" />
              </div>
              <div class="col-6">
              </div>
              <div class="col-6">
                <q-input type="text" v-model="tmpInv.dpp" @blur="calc_dpp" dense outlined label="DPP Amount"/>
              </div>
              <div class="col-6">
                <q-input type="text" v-model="tmpInv.ppn_amt" @blur="calc_ppn" dense outlined label="PPN Amount" />
              </div>
              <div class="col-6">
                <q-input type="text" v-model="tmpInv.subtotal" dense outlined label="Subtotal" readonly/>
              </div>
              <div class="col-6">
              </div>

              <!-- <div class="col-12">
                <div class="tw-w-full tw-border-b-2 tw-border-black"></div>
              </div> -->
              <div class="col-12">
                <divider title="Detail" />
              </div>
              
              <div class="col-6">
                <!-- <Field v-model="tmpInv.pph" name="pph"
                v-slot="{ errorMessage, value, field }">
                <q-select dense outlined emit-value map-options
                input-debounce="0" option-value="pajak_jenis_id" option-label="desc_text" label="PPH Kriteria" ref="createriaRef"  :rules="[val => !!val || 'PPH Kriteria harus diisi']"
                :options="listPPHCreateria" :error-message="errorMessage" :error="!!errorMessage" :model-value="value" v-bind="field" use-input @filter="filterFn"
                @update:model-value="getPajakJenis">
                <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No results
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </Field> -->
                <q-select dense outlined v-model="tmpInv.pph" clearable emit-value map-options input-debounce="0" use-input ref="createriaRef"  :rules="[val => !!val || 'PPH Kriteria harus diisi']"
                  option-value="pajak_jenis_id" option-label="desc_text" label="PPH Kriteria" :options="listPPHCreateria"
                  @filter="filterFn" @update:model-value="getPajakJenis">
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No results
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              
              <div class="col-6">
                <q-input type="text" v-model="tmpInv.pph_amt" @blur="calc_pph" dense outlined label="PPh Amount" />
              </div>

              <div class="col-6">
                <q-input type="text" v-model="tmpInv.final_amt" dense outlined label="Final Amount" readonly/>
              </div>

              <div class="col-6">
              </div>
              
              <div class="col-12">
                <q-input type="text" v-model="tmpInv.keterangan" ref="ketRef"  :rules="[val => !!val || 'Keterangan harus diisi']" dense outlined label="Keterangan" />
              </div>

                <div class="col-12">
                  <div class="tw-w-full tw-border-b-2 tw-border-black"></div>
                  <br/>
                  Upload Kelengkapan
                </div>
                
                
                
                <div class="col-6">
                  <Field name="files_po">
                    <div style="height: -20em;">
                      <q-file
                      v-model="files1"
                        label="PO Fully Approved by Vendor"
                        filled
                        counter
                        dense
                        outlined
                        :counter-label="counterLabelFn"
                        max-files="3"
                        multiple
                        >
                        <template v-slot:prepend>
                          <q-icon name="attach_file" />
                        </template>
                      </q-file>
                    </div>
                </Field>
              </div>

              <div class="col-3"></div>

              <div class="col-6">
                <Field name="files_po">
                  <div style="height: -20em;">
                    <q-file
                    v-model="files2"
                    label="Invoice & Kwitansi"
                    filled
                    counter
                    dense
                    outlined
                    :counter-label="counterLabelFn"
                    max-files="3"
                    multiple
                    >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                      </q-file>
                    </div>
                </Field>
              </div>

              <div class="col-3">
              </div>

              <div class="col-6">
                <Field name="files_fp">
                  <div style="height: -20em;">
                    <q-file
                    v-model="files3"
                    label="Faktur Pajak (Otomatis apabila PPN)"
                    filled
                    counter
                    dense
                    outlined
                    :counter-label="counterLabelFn"
                    max-files="3"
                    multiple
                    >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                      </q-file>
                    </div>
                </Field>
              </div>

              <div class="col-3"></div>

              <div class="col-6">
                <Field name="files_sj">
                  <div style="height: -20em;">
                    <q-file
                    v-model="files4"
                    label="Surat Jalan / Berita Acara"
                    filled
                    counter
                    dense
                    outlined
                    :counter-label="counterLabelFn"
                    max-files="3"
                    multiple
                    >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                      </q-file>
                    </div>
                </Field>
              </div>

              <div class="col-3"></div>

              <div class="col-6">
                <Field name="files_mrr">
                  <div style="height: -20em;">
                    <q-file
                    v-model="files5"
                    label="MRR Pink"
                    filled
                    counter
                    dense
                    outlined
                    :counter-label="counterLabelFn"
                    max-files="3"
                    multiple
                    >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                      </q-file>
                    </div>
                </Field>
              </div>

              <div class="col-12" hidden>
                <q-input v-model="tmpInv.DOUser" label="User" />
              </div>
              
            
            </div>

           

        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <!-- <q-btn flat label="Batal" color="primary" v-close-popup />
          <q-btn flat label="Simpan" color="primary" @click="saveedit" /> -->
          <form @submit.prevent.stop="onSubmit" @reset.prevent.stop="onReset">
              <div>
                <q-btn dense push  label="Batal" color="red" v-close-popup/> &nbsp;
                <q-btn dense push  label="Simpan" type="submit" color="primary" />
              </div>
            </form>
        </q-card-actions>

      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogForm_InvEdit" persistent :maximized="maximizedToggle" transition-show="slide-up"
      transition-hide="slide-down">
      <q-card>
        <q-card-section>
          <div class="text-h6">Edit Invoice</div>
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 80vh" class="scroll">
            <div class="row q-col-gutter-sm">
              <div class="col-6">
                <Field v-model="tmpInv.po_number" name="po_number"
                  v-slot="{ errorMessage, value, field }">
                  <q-select dense outlined emit-value map-options
                    input-debounce="0" option-value="dtl_po" option-label="dtl_po" label="Pilih PO"
                    :options="listInvPO" :error-message="errorMessage" :error="!!errorMessage" :model-value="value" v-bind="field" multiple
                    @update:model-value="getdetailPOEdit">
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

              <div class="col-6">
                <Field v-model="tmpInv.ppn" name="ppn"
                  v-slot="{ errorMessage, value, field }">
                  <q-select dense outlined emit-value map-options
                    input-debounce="0" option-value="value" option-label="label" label="PPN (Persen)"
                    :options="listPPN" :error-message="errorMessage" :error="!!errorMessage" :model-value="value" v-bind="field"
                    @update:model-value="calc_ppnn">
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

              <div class="col-6">
                <Field v-model="tmpInv.mrr" name="mrr"
                  v-slot="{ errorMessage, value, field }">
                  <q-select dense outlined emit-value map-options
                    input-debounce="0" option-value="trans_dtl_po" option-label="desc_text" label="No. MRR"
                    :options="listMrrPO" :error-message="errorMessage" :error="!!errorMessage" :model-value="value" v-bind="field" multiple
                    @update:model-value="getdppPO" :rules="[val => !!val || 'No. MRR harus diisi']" ref="mrrRef">
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
              
              <div class="col-6">
                <q-input label="Tgl Invoice" outlined dense v-model="tmpInv.tgl_inv" ref="tglRef"  :rules="[val => !!val || 'Tgl. Invoice harus diisi']">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="tmpInv.tgl_inv" mask="YYYY-MM-DD"  ref="tglRef"  :rules="[val => !!val || 'Tgl. Invoice harus diisi']">
                          <div class="row items-center justify-end q-gutter-sm">
                            <q-btn label="Cancel" color="primary" flat v-close-popup />
                            <q-btn label="OK" color="primary" flat v-close-popup />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              
              <div class="col-6" hidden>
                <q-input type="number" v-model="tmpForm.id" dense outlined label="ID" />
              </div>

              <div class="col-6">
                <q-input type="text" v-model="tmpInv.no_inv" ref="invRef"  :rules="[val => !!val || 'No. Invoice harus diisi']" dense outlined label="No. Invoice"/>
              </div>
            
              <div class="col-6">
                <q-input type="text" v-model="tmpInv.curr" dense outlined label="Currency" readonly/>
              </div>
              <div class="col-6">
                <q-input type="text" v-model="tmpInv.no_faktur" dense outlined label="No. Faktur Pajak" />
              </div>
              <div class="col-6">
              </div>
              <div class="col-6">
                <q-input type="text" v-model="tmpInv.dpp" @blur="calc_dpp" dense outlined label="DPP Amount"/>
              </div>
              <div class="col-6">
                <q-input type="text" v-model="tmpInv.ppn_amt" @blur="calc_ppn" dense outlined label="PPN Amount" />
              </div>
              <div class="col-6">
                <q-input type="text" v-model="tmpInv.subtotal" dense outlined label="Subtotal" readonly/>
              </div>
              <div class="col-6">
              </div>

              <!-- <div class="col-12">
                <div class="tw-w-full tw-border-b-2 tw-border-black"></div>
              </div> -->
              <div class="col-12">
                <divider title="Detail" />
              </div>
              
              <div class="col-6">
                <!-- <Field v-model="tmpInv.pph" name="pph"
                v-slot="{ errorMessage, value, field }">
                <q-select dense outlined emit-value map-options use-input
                input-debounce="0" option-value="pajak_jenis_id" option-label="desc_text" label="PPH Kriteria" ref="createriaRef"  :rules="[val => !!val || 'PPH Kriteria harus diisi']"
                :options="listPPHCreateria" :error-message="errorMessage" :error="!!errorMessage" :model-value="value" v-bind="field" 
                @update:model-value="getPajakJenis">
                <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No results
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </Field> -->
                <q-select dense outlined v-model="tmpInv.pph" clearable emit-value map-options input-debounce="0" use-input ref="createriaRef"  :rules="[val => !!val || 'PPH Kriteria harus diisi']"
                  option-value="pajak_jenis_id" option-label="desc_text" label="PPH Kriteria" :options="listPPHCreateria"
                  @filter="filterFn" @update:model-value="getPajakJenis">
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No results
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              
              <div class="col-6">
                <q-input type="text" v-model="tmpInv.pph_amt" @blur="calc_pph" dense outlined label="PPh Amount" />
              </div>

              <div class="col-6">
                <q-input type="text" v-model="tmpInv.final_amt" dense outlined label="Final Amount" readonly/>
              </div>

              <div class="col-6">
              </div>
              
              <div class="col-12">
                <q-input type="text" v-model="tmpInv.keterangan" ref="ketRef"  :rules="[val => !!val || 'Keterangan harus diisi']" dense outlined label="Keterangan" />
              </div>

                <div class="col-12">
                  <div class="tw-w-full tw-border-b-2 tw-border-black"></div>
                  <br/>
                  Upload Kelengkapan
                </div>
                
                
                
                <div class="col-6">
                  <Field name="files_po">
                    <div style="height: -20em;">
                      <q-file
                      v-model="files1"
                        label="PO Fully Approved by Vendor"
                        filled
                        counter
                        dense
                        outlined
                        :counter-label="counterLabelFn"
                        max-files="3"
                        multiple
                        >
                        <template v-slot:prepend>
                          <q-icon name="attach_file" />
                        </template>
                      </q-file>
                    </div>
                </Field>
              </div>

              <div class="col-3">
              <q-btn flat label="Details" type="submit" color="primary" @click="openfiles('PO Fully Aprroved by Vendor')" />
              </div>


              <div class="col-6">
                <Field name="files_po">
                  <div style="height: -20em;">
                    <q-file
                    v-model="files2"
                    label="Invoice & Kwitansi"
                    filled
                    counter
                    dense
                    outlined
                    :counter-label="counterLabelFn"
                    max-files="3"
                    multiple
                    >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                      </q-file>
                    </div>
                </Field>
              </div>

              <div class="col-3">
              <q-btn flat label="Details" type="submit" color="primary" @click="openfiles('Invoice & Kwitansi')" />
              </div>

              <div class="col-6">
                <Field name="files_fp">
                  <div style="height: -20em;">
                    <q-file
                    v-model="files3"
                    label="Faktur Pajak (Otomatis apabila PPN)"
                    filled
                    counter
                    dense
                    outlined
                    :counter-label="counterLabelFn"
                    max-files="3"
                    multiple
                    >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                      </q-file>
                    </div>
                </Field>
              </div>

              <div class="col-3">
              <q-btn flat label="Details" type="submit" color="primary" @click="openfiles('Faktur Pajak (Otomatis apabila PPN)')" />
              </div>

              <div class="col-6">
                <Field name="files_sj">
                  <div style="height: -20em;">
                    <q-file
                    v-model="files4"
                    label="Surat Jalan / Berita Acara"
                    filled
                    counter
                    dense
                    outlined
                    :counter-label="counterLabelFn"
                    max-files="3"
                    multiple
                    >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                      </q-file>
                    </div>
                </Field>
              </div>

              <div class="col-3">
              <q-btn flat label="Details" type="submit" color="primary" @click="openfiles('Surat Jalan / Berita Acara')" />
              </div>

              <div class="col-6">
                <Field name="files_mrr">
                  <div style="height: -20em;">
                    <q-file
                    v-model="files5"
                    label="MRR Pink"
                    filled
                    counter
                    dense
                    outlined
                    :counter-label="counterLabelFn"
                    max-files="3"
                    multiple
                    >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                      </q-file>
                    </div>
                </Field>
              </div>

              <div class="col-3">
              <q-btn flat label="Details" type="submit" color="primary" @click="openfiles('MRR Pink')" />
              </div>

              <div class="col-12" hidden>
                <q-input v-model="tmpInv.DOUser" label="User" />
              </div>
              
            
            </div>

           

        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <!-- <q-btn flat label="Batal" color="primary" v-close-popup />
          <q-btn flat label="Simpan" color="primary" @click="saveedit" /> -->
          <form @submit.prevent.stop="onSubmit" @reset.prevent.stop="onReset">
              <div>
                <q-btn dense push  label="Batal" color="red" v-close-popup/> &nbsp;
                <q-btn dense push  label="Simpan" type="submit" color="primary" />
              </div>
            </form>
        </q-card-actions>

      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogForm_InvPreview" persistent :maximized="maximizedToggle" transition-show="slide-up"
      transition-hide="slide-down">
      <q-card>
        <q-card-section>
          <div class="text-h6">Edit Invoice</div>
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 80vh" class="scroll">
            <div class="row q-col-gutter-sm">
              <div class="col-6">
                <Field v-model="tmpInv.po_number" name="po_number"
                  v-slot="{ errorMessage, value, field }">
                  <q-select dense outlined emit-value map-options
                    input-debounce="0" option-value="dtl_po" option-label="dtl_po" label="Pilih PO"
                    :options="listInvPO" :error-message="errorMessage" :error="!!errorMessage" :model-value="value" v-bind="field" multiple
                    @update:model-value="getdetailPOEdit">
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

              <div class="col-6">
                <Field v-model="tmpInv.ppn" name="ppn"
                  v-slot="{ errorMessage, value, field }">
                  <q-select dense outlined emit-value map-options
                    input-debounce="0" option-value="value" option-label="label" label="PPN (Persen)"
                    :options="listPPN" :error-message="errorMessage" :error="!!errorMessage" :model-value="value" v-bind="field"
                    @update:model-value="calc_ppnn">
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

              <div class="col-6">
                <Field v-model="tmpInv.mrr" name="mrr"
                  v-slot="{ errorMessage, value, field }">
                  <q-select dense outlined emit-value map-options
                    input-debounce="0" option-value="trans_dtl_po" option-label="desc_text" label="No. MRR"
                    :options="listMrrPO" :error-message="errorMessage" :error="!!errorMessage" :model-value="value" v-bind="field" multiple
                    @update:model-value="getdppPO" :rules="[val => !!val || 'No. MRR harus diisi']" ref="mrrRef">
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
              
              <div class="col-6">
                <q-input label="Tgl Invoice" outlined dense v-model="tmpInv.tgl_inv" ref="tglRef"  :rules="[val => !!val || 'Tgl. Invoice harus diisi']">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="tmpInv.tgl_inv" mask="YYYY-MM-DD"  ref="tglRef"  :rules="[val => !!val || 'Tgl. Invoice harus diisi']">
                          <div class="row items-center justify-end q-gutter-sm">
                            <q-btn label="Cancel" color="primary" flat v-close-popup />
                            <q-btn label="OK" color="primary" flat v-close-popup />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              
              <div class="col-6" hidden>
                <q-input type="number" v-model="tmpForm.id" dense outlined label="ID" />
              </div>

              <div class="col-6">
                <q-input type="text" v-model="tmpInv.no_inv" ref="invRef"  :rules="[val => !!val || 'No. Invoice harus diisi']" dense outlined label="No. Invoice"/>
              </div>
            
              <div class="col-6">
                <q-input type="text" v-model="tmpInv.curr" dense outlined label="Currency" readonly/>
              </div>
              <div class="col-6">
                <q-input type="text" v-model="tmpInv.no_faktur" dense outlined label="No. Faktur Pajak" />
              </div>
              <div class="col-6">
              </div>
              <div class="col-6">
                <q-input type="text" v-model="tmpInv.dpp" @blur="calc_dpp" dense outlined label="DPP Amount"/>
              </div>
              <div class="col-6">
                <q-input type="text" v-model="tmpInv.ppn_amt" @blur="calc_ppn" dense outlined label="PPN Amount" />
              </div>
              <div class="col-6">
                <q-input type="text" v-model="tmpInv.subtotal" dense outlined label="Subtotal" readonly/>
              </div>
              <div class="col-6">
              </div>

              <!-- <div class="col-12">
                <div class="tw-w-full tw-border-b-2 tw-border-black"></div>
              </div> -->
              <div class="col-12">
                <divider title="Detail" />
              </div>
              
              <div class="col-6">
                <Field v-model="tmpInv.pph" name="pph"
                v-slot="{ errorMessage, value, field }">
                <q-select dense outlined emit-value map-options
                input-debounce="0" option-value="pajak_jenis_id" option-label="desc_text" label="PPH Createria"
                :options="listPPHCreateria" :error-message="errorMessage" :error="!!errorMessage" :model-value="value" v-bind="field" 
                @update:model-value="getPajakJenis">
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
              
              <div class="col-6">
                <q-input type="text" v-model="tmpInv.pph_amt" @blur="calc_pph" dense outlined label="PPh Amount" />
              </div>

              <div class="col-6">
                <q-input type="text" v-model="tmpInv.final_amt" dense outlined label="Final Amount" readonly/>
              </div>

              <div class="col-6">
              </div>
              
              <div class="col-12">
                <q-input type="text" v-model="tmpInv.keterangan" ref="ketRef"  :rules="[val => !!val || 'Keterangan harus diisi']" dense outlined label="Keterangan" />
              </div>

                <div class="col-12">
                  <div class="tw-w-full tw-border-b-2 tw-border-black"></div>
                  <br/>
                  Upload Kelengkapan
                </div>
                
                
                
                <div class="col-6">
                  <Field name="files_po">
                    <div style="height: -20em;">
                      <q-file
                      v-model="files1"
                        label="PO Fully Approved by Vendor"
                        filled
                        counter
                        dense
                        outlined
                        :counter-label="counterLabelFn"
                        max-files="3"
                        multiple
                        >
                        <template v-slot:prepend>
                          <q-icon name="attach_file" />
                        </template>
                      </q-file>
                    </div>
                </Field>
              </div>

              <div class="col-3">
              <q-btn flat label="Details" type="submit" color="primary" @click="openfiles('PO Fully Aprroved by Vendor')" />
              </div>


              <div class="col-6">
                <Field name="files_po">
                  <div style="height: -20em;">
                    <q-file
                    v-model="files2"
                    label="Invoice & Kwitansi"
                    filled
                    counter
                    dense
                    outlined
                    :counter-label="counterLabelFn"
                    max-files="3"
                    multiple
                    >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                      </q-file>
                    </div>
                </Field>
              </div>

              <div class="col-3">
              <q-btn flat label="Details" type="submit" color="primary" @click="openfiles('Invoice & Kwitansi')" />
              </div>

              <div class="col-6">
                <Field name="files_fp">
                  <div style="height: -20em;">
                    <q-file
                    v-model="files3"
                    label="Faktur Pajak (Otomatis apabila PPN)"
                    filled
                    counter
                    dense
                    outlined
                    :counter-label="counterLabelFn"
                    max-files="3"
                    multiple
                    >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                      </q-file>
                    </div>
                </Field>
              </div>

              <div class="col-3">
              <q-btn flat label="Details" type="submit" color="primary" @click="openfiles('Faktur Pajak (Otomatis apabila PPN)')" />
              </div>

              <div class="col-6">
                <Field name="files_sj">
                  <div style="height: -20em;">
                    <q-file
                    v-model="files4"
                    label="Surat Jalan / Berita Acara"
                    filled
                    counter
                    dense
                    outlined
                    :counter-label="counterLabelFn"
                    max-files="3"
                    multiple
                    >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                      </q-file>
                    </div>
                </Field>
              </div>

              <div class="col-3">
              <q-btn flat label="Details" type="submit" color="primary" @click="openfiles('Surat Jalan / Berita Acara')" />
              </div>

              <div class="col-6">
                <Field name="files_mrr">
                  <div style="height: -20em;">
                    <q-file
                    v-model="files5"
                    label="MRR Pink"
                    filled
                    counter
                    dense
                    outlined
                    :counter-label="counterLabelFn"
                    max-files="3"
                    multiple
                    >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                      </q-file>
                    </div>
                </Field>
              </div>

              <div class="col-3">
              <q-btn flat label="Details" type="submit" color="primary" @click="openfiles('MRR Pink')" />
              </div>

              <div class="col-12" hidden>
                <q-input v-model="tmpInv.DOUser" label="User" />
              </div>
              
            
            </div>

           

        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <!-- <q-btn flat label="Batal" color="primary" v-close-popup />
          <q-btn flat label="Simpan" color="primary" @click="saveedit" /> -->
          <form @submit.prevent.stop="onSubmit" @reset.prevent.stop="onReset">
              <div>
                <q-btn dense push label="Kembali" color="blue" v-close-popup/>
                <!-- <q-btn flat label="Simpan" type="submit" color="primary" /> -->
              </div>
            </form>
        </q-card-actions>

      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogFormFiles" persistent :maximized="maximizedToggle" transition-show="slide-up"
      transition-hide="slide-down">
      <q-card>
        <q-card-section>
          <div class="text-h6">List File {{label_files}}</div>
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 80vh" class="scroll">
          <Form :validation-schema="schema1" @submit="savePICApproval" class="q-mt-md">
            <div class="row q-col-gutter-sm">
            </div>

            <div class="col-12 tw-mt-3">
              <q-markup-table>
                <thead>
                  <tr>
                    <!-- <th class="text-left">No</th> -->
                    <th class="text-left">Nama File</th>
                    <th class="text-left">Tipe File</th>
                    <th class="text-center">View</th>
                    <th class="text-center">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(data, i) in listFiles" :key="i">
                      <!-- <td class="text-left">{{ i + 1 }}</td> -->
                      <td class="text-left">{{ data.files_name }}</td>
                      <td class="text-left">{{ data.files_type }}</td>
                      <td class="text-center">
                        <q-btn-group>
                          <q-btn square dense color="info" icon="visibility" @click="viewFiles(data.files_name)" />
                        </q-btn-group>
                      </td>
                      <td class="text-center">
                        <q-btn-group>
                          <q-btn square dense color="negative" icon="delete" @click="deleteFiles(data.files_name)" />
                        </q-btn-group>
                      </td>

                  </tr>
                </tbody>
              </q-markup-table>
            </div>

          </Form>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn dense push label="KEMBALI" color="info" v-close-popup />
        </q-card-actions>

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
import { IMaskDirective } from 'vue-imask';
import { VMoney } from 'v-money';
import { useRouter, useRoute } from "vue-router";
import dayjs from "dayjs";


const money = {
  decimal: ',',
  thousands: '.',
  // prefix: 'Rp ',
  precision: 2,
  precision: 0,
  allowBlank: true,
  masked: false /* doesn't work with directive */
}

const columns = [
  {
    name: "dtl_po",
    required: true,
    label: "PO Number",
    align: "left",
    field: "dtl_po",
    sortable: true,
  },
  {
    name: "dtl_site",
    required: true,
    label: "PO Site",
    align: "left",
    field: "dtl_site",
    sortable: true,
  },
  {
    name: "dtl_po_date",
    required: true,
    label: "Order Date",
    align: "left",
    field: "dtl_po_date",
    format: val => dayjs(`${val}`).format("YYYY-MM-DD"),
    sortable: true,
  },
  {
    name: "dtl_po_amount",
    required: true,
    label: "Amount PO",
    align: "right",
    field: "dtl_po_amount",
    format: val => parseFloat(val).toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    sortable: true,
  },
  {  
    name: "dtl_no_mrr",
    required: true,
    label: "No. MRR",
    align: "left",
    field: "dtl_no_mrr",
    sortable: true,
  },
  {
    name: "dtl_date_mrr",
    required: true,
    label: "Tgl MRR",
    align: "left",
    field: "dtl_date_mrr",
    format: val => dayjs(`${val}`).format("YYYY-MM-DD"),
    sortable: true,
  },
  {
    name: "dtl_ttl_mrr",
    required: true,
    label: "Ttl Amount MRR",
    align: "right",
    field: "dtl_ttl_mrr",
    format: val => parseFloat(val).toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    sortable: true,
  },
  {
    name: "aksi",
    required: true,
    label: "Action",
    align: "left",
    field: "aksi",
  },
];

const columnsinv = [
  {
    name: "dtl_inv_po",
    required: true,
    label: "PO Number",
    align: "left",
    field: "dtl_inv_po",
    sortable: true,
  },
  {
    name: "dtl_inv_no",
    required: true,
    label: "No. Invoice",
    align: "left",
    field: "dtl_inv_no",
    sortable: true,
  },
  {
    name: "dtl_inv_faktur",
    required: true,
    label: "No. Faktur",
    align: "left",
    field: "dtl_inv_faktur",
    sortable: true,
  },
  {
    name: "dtl_inv_finaltotal",
    required: true,
    label: "Final Amount",
    align: "right",
    field: "dtl_inv_finaltotal",
    format: val => parseFloat(val).toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    sortable: true,
  },
  {
    name: "aksi",
    required: true,
    label: "Action",
    align: "left",
    field: "aksi",
  },
];

const columnspo = [
  {
    name: "po_number",
    required: true,
    label: "PO Number",
    align: "left",
    field: "po_number",
    sortable: true,
  },
  {
    name: "po_date",
    required: true,
    label: "Order Date",
    align: "left",
    field: "po_date",
    sortable: true,
  },
  {
    name: "ppn",
    required: true,
    label: "PPN",
    align: "left",
    field: "ppn",
    sortable: true,
  },
  {
    name: "po_amount",
    required: true,
    label: "PO Amount",
    align: "right",
    field: "po_amount",
    format: val => parseFloat(val).toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    sortable: true,
  },
  {
    name: "no_mrr",
    required: true,
    label: "No. MRR",
    align: "left",
    field: "no_mrr",
    sortable: true,
  },
  {
    name: "tgl_mrr",
    required: true,
    label: "Tgl. Mrr",
    align: "left",
    field: "tgl_mrr",
    sortable: true,
  },
  {
    name: "mrr_amount",
    required: true,
    label: "Ttl Mrr Amount",
    align: "right",
    field: "mrr_amount",
    format: val => parseFloat(val).toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    sortable: true,
  },
  {
    name: "no_sj",
    required: true,
    label: "No. SJ",
    align: "left",
    field: "no_sj",
    sortable: true,
  },
  {
    name: "action",
    required: true,
    label: "Action",
    align: "left",
    field: "action",
  },
];

const $q = useQuasar();
const files1 = ref(null)
const files2 = ref(null)
const files3 = ref(null)
const files4 = ref(null)
const files5 = ref(null)
const listPO = ref([]);
const listPO2 = ref([]);
const listInv = ref([]);
const listInvPO = ref([]);
const listPPHCreateria = ref([]);
const listMrrPO = ref([]);
const listMrrPO2 = ref([]);
const selected = ref([]);
const listFiles = ref([]);
const listBU = ref([]);
const listTagihan = ref([]);
const listHistoryTagihan = ref([]);
const invRef = ref(null)
const mrrRef = ref(null)
const tglRef = ref(null)
const ketRef = ref(null)
const createriaRef = ref(null)
const listPPN = ref([{label:'10%', value: '0.1'},{label: '11%', value: '0.11'}]);
const tmpData = ref([]);
const router = useRouter();
let label_files = null;
const search = ref(null)

const right = ref(false);

const loading = ref(false);
const dialogForm = ref(false);
const dialogFormFiles = ref(false);
const dialogForm_Inv = ref(false);
const dialogForm_InvEdit = ref(false);
const dialogForm_InvPreview = ref(false);
const maximizedToggle = ref(true);
function counterLabelFn ({ totalSize, filesNumber, maxFiles }) {
        return `${filesNumber} files of ${maxFiles} | ${totalSize}`
      }
const paginationpo = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10,
  filter: null,
  domain: domain(),
  trans_flag: null,
  trans_code: router.currentRoute.value.params.notagihan,
});

const paginationinv = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10,
  filter: null,
  domain: domain(),
  trans_code: router.currentRoute.value.params.notagihan,
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
  trans_code: router.currentRoute.value.params.notagihan,
});

const GiveitDisable = ref(false);

const getSelectedString = () => {
        return selected.value.length === 0 ? '' : `${selected.value.length} record${selected.value.length > 1 ? 's' : ''} selected`
}

const prosesTagihan = async (value) => {
  $q.dialog({
    title: "Konfirmasi",
    // message: `Apakah anda yakin ingin menghapus  <span class="tw-font-bold">${value.kota_region}</span>`,
    message: `Apakah anda yakin ingin memproses data tagihan ini?`,
    html: true,
    ok: {
      push: true,
      label:"Proses"
    },
    cancel: {
      push: true,
      color: "negative",
    },
    persistent: true,
  }).onOk(async () => {
    try {
      const result = await axios.post("prosestagihan", {'trans_code' : value, 'empid' : tmpInv.DOUser});

      console.log(result.data)
      if(result.data === 'Silahkan mengisi data invoice terlebih dahulu') {
          $q.notify({
            type: "negative",
            // message: `Menu <span class="tw-font-bold">${value.kota_region}</span> berhasil dihapus`,
            message: result.data,
            html: true,
          });
      } else {
        $q.notify({
          type: "positive",
          // message: `Menu <span class="tw-font-bold">${value.kota_region}</span> berhasil dihapus`,
          message: result.data,
          html: true,
        });
        router.push('/Tagihan')

      }
    } catch (error) {
      $q.notify({
        type: "negative",
        message: "Proses Tagihan Gagal",
      });
    }
  });
};

const savePO = async () => {
  try {
    $q.loading.show();
    const res = await axios.post("tambahposimpan", {
          trans_code : router.currentRoute.value.params.notagihan,
          po_table : selected.value
    });
    dialogForm.value = false;
    getListPO();
    tmpPO.po_number = null;
    listMrrPO2.value = [];

    // reset();    

    $q.notify({
      type: "positive",
      message: "Data PO Berhasil Disimpan",
    });

    // await onRequest({
    //   pagination: pagination.value,
    // });
    $q.loading.hide();
  } catch (error) {
    $q.loading.hide();
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
}

const deletePO = async (value) => {
  $q.dialog({
    title: "Konfirmasi",
    // message: `Apakah anda yakin ingin menghapus  <span class="tw-font-bold">${value.kota_region}</span>`,
    message: `Apakah anda yakin ingin menghapus data ini?`,
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
      const result = await axios.post("deletePO", { dtl_po: value, trans_code : router.currentRoute.value.params.notagihan})

      console.log(result)
      if(result.data[0].res === 'warning') {
        $q.notify({
          type: "negative",
          // message: `Menu <span class="tw-font-bold">${value.kota_region}</span> berhasil dihapus`,
          message: result.data[0].msg,
          html: true,
        });
      } else {
        $q.notify({
          type: "positive",
          // message: `Menu <span class="tw-font-bold">${value.kota_region}</span> berhasil dihapus`,
          message: `Data PO Berhasil Dihapus`,
          html: true,
        });
        getListPO();
      }

    } catch (error) {
      $q.notify({
        type: "negative",
        message: ParseError(error),
      });
    }
  });
};

const deleteInv = async (value) => {
  $q.dialog({
    title: "Konfirmasi",
    // message: `Apakah anda yakin ingin menghapus  <span class="tw-font-bold">${value.kota_region}</span>`,
    message: `Apakah anda yakin ingin menghapus data ini?`,
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
      await axios.post("deleteInvoice", value);
      $q.notify({
        type: "positive",
        // message: `Menu <span class="tw-font-bold">${value.kota_region}</span> berhasil dihapus`,
        message: `Data Invoice Berhasil Dihapus`,
        html: true,
      });
      getListInv();

    } catch (error) {
      $q.notify({
        type: "negative",
        message: ParseError(error),
      });
    }
  });
};

const redirect = (data) => {
  let routeData = import.meta.env.VITE_EPO_LINK+'#/podetail_pdf/'+data.bu_domain+'/'+data.dtl_po
  window.open(routeData, '_blank', 'noreferrer');
};

const redirect2 = (data) => {
  let routeData = import.meta.env.VITE_EPO_LINK+'#/podetail_pdf/'+data.domain+'/'+data.po_number
  window.open(routeData, '_blank', 'noreferrer');
};

const viewFiles = (data) => {
  let routeData = import.meta.env.VITE_LAMPIRAN+data
  window.open(routeData, '_blank', 'noreferrer');
};

const addPO = async (data) => {
  dialogForm.value = true;
  // tmpPO.po_number = '';
  // listMrrPO2.value = [];
  selected.value = [];
  reset();
  getPO(data);
};

const addInv = async () => {
  dialogForm_Inv.value = true;
  listMrrPO.value = [];
  tmpInv.action = 'invoicetambah'
  reset();
  getInvPO();
};

const editInv = async (data) => {
  dialogForm_InvEdit.value = true;
  tmpInv.action = 'invoiceubah'
  reset();
  getDetailInv(data);
  getInvPO();
};

const previewInv = async (data) => {
  dialogForm_InvPreview.value = true;
  reset();
  getDetailInv(data);
  getInvPO();
};

const openfiles = async (data) => {
  dialogFormFiles.value = true;
  label_files = data
  getFiles(data)
};

const tmpForm = reactive({
  bussinessunit: null,
  region: null,
  kategori: null,
  tgl_berlaku: null,
  lokasimuat: null,
  kotatujuan: null,
  jeniskendaraan: null,
  jumlaharah: ref('1'),
  jumlahtujuan: ref('1'),
  fixnonfix: ref('Non Fixed'),
  harga: 0,
  DOUser: empid(),
});

const tmpInv = reactive({
  po_number: null,
  ppn: '0.1',
  mrr: null,
  tgl_inv: `${new Date().toJSON().slice(0, 10).replace(/-/g, '-')}`,
  no_inv: null,
  no_inv_old: null,
  no_faktur: null,
  dpp: null,
  curr: null,
  ppn_amt: null,
  subtotal: null,
  pph: null,
  pph_amt: 0,
  keterangan: null,
  final_amt: null,
  tarif_npwp: 0,
  DOUser: empid(),
  trans_code: router.currentRoute.value.params.notagihan
});

const tmpPO = reactive({
  po_number: null,
  DOUser: empid(),
  trans_code: router.currentRoute.value.params.notagihan
});


const reset = () => {
  tmpInv.po_number= null,
  tmpInv.ppn= '0.1',
  tmpInv.mrr= null,
  tmpInv.tgl_inv= `${new Date().toJSON().slice(0, 10).replace(/-/g, '-')}`,
  tmpInv.no_inv= null,
  tmpInv.trans_dtl_inv = null,
  tmpInv.no_inv_old= null,
  tmpInv.no_faktur= null,
  tmpInv.dpp= null,
  tmpInv.curr= null,
  tmpInv.ppn_amt= null,
  tmpInv.subtotal= null,
  tmpInv.pph= null,
  tmpInv.pph_amt= 0,
  tmpInv.keterangan= null,
  tmpInv.final_amt= null,
  tmpInv.tarif_npwp= 0,
  tmpInv.DOUser= empid(),
  files1.value = null,
  files2.value = null,
  files3.value = null,
  files4.value = null,
  files5.value = null
};

const resetPO = () => {
  listMrrPO2.value = [],
  tmpInv.po_number= null
}

const getListPO = async () => {
  try {
    loading.value = true;
    // console.log(router.currentRoute.value.params.notagihan)
    const res = await axios.get("getListPO", {
      params: paginationpo.value,
    });
    listPO.value = res.data.data1;
    paginationpo.value.rowsNumber = res.data.total;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getListInv = async () => {
  try {
    loading.value = true;
    const res = await axios.get("getListInv", {
      params: paginationinv.value,
    });
    listInv.value = res.data.data1;
    paginationinv.value.rowsNumber = res.data.total;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getTagihan = async () => {
  try {
    loading.value = true;
    // console.log(router.currentRoute.value.params.notagihan)
    const res = await axios.get("getTagihan", {
        params: {
          trans_code : router.currentRoute.value.params.notagihan,
        },
    });
    listTagihan.value = res.data.data1[0];
    listHistoryTagihan.value = res.data.data2;
    // console.log(listTagihan.value.bu_domain);
    loading.value = false;
  } catch (error) {
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const filterFnPO = async (val, update, abort) => {
  update(async () => {
    search.value = val;
    await getPOFilter();
  });
};

const getPOFilter = async (data) => {
  try {
    loading.value = true;
    // console.log(listTagihan.value.bu_domain)
    const res = await axios.get("getPOFilter", {
        params: {
          trans_code : router.currentRoute.value.params.notagihan,
          site : 'single',
          domain : listTagihan.value.bu_domain,
          empid :  tmpInv.DOUser,
          search : search.value
        },
    });
    listPO2.value = res.data.data
    loading.value = false;
  } catch (error) {
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getPO = async (data) => {
  try {
    loading.value = true;
    // console.log(router.currentRoute.value.params.notagihan)
    const res = await axios.get("getPO", {
        params: {
          trans_code : router.currentRoute.value.params.notagihan,
          site : 'single',
          domain : data.bu_domain,
          empid : tmpInv.DOUser,
        },
    });
    listPO2.value = res.data.data
    loading.value = false;
  } catch (error) {
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getFiles = async (data) => {
  try {
    loading.value = true;
    // console.log(router.currentRoute.value.params.notagihan)
    const res = await axios.get("getFiles", {
        params: {
          trans_code : router.currentRoute.value.params.notagihan,
          files_support : data,
          no_inv : tmpInv.no_inv,
          trans_dtl_inv : tmpInv.trans_dtl_inv
        },
    });
    listFiles.value = res.data.data1;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const deleteFiles = async (data) => {
  $q.dialog({
    title: "Konfirmasi",
    message: `Apakah anda yakin ingin menghapus data ini?`,
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
      const res = await axios.get("deleteFiles", {
        params: {
          nama_file : data,
          files_support : label_files,
          trans_code : router.currentRoute.value.params.notagihan,
          no_inv : tmpInv.no_inv
        },
      });

      $q.notify({
        type: "positive",
        message: `Data Removed Successfully`,
        html: true,
      });
      getFiles(label_files);

    } catch (error) {
      $q.notify({
        type: "negative",
        message: ParseError(error),
      });
    }
  });
};

const downloadFiles = async (data) => {
  try {
    loading.value = true;
    // console.log(router.currentRoute.value.params.notagihan)
    const res = await axios.get("downloadFiles", {
        params: {
          nama_file : data,
        },
    });
    loading.value = false;
  } catch (error) {
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getInvPO = async () => {
  try {
    loading.value = true;
    const res = await axios.get("getInvPO", {
        params: {
          trans_code: router.currentRoute.value.params.notagihan,
        },
    });
    listInvPO.value = res.data.data1;
    listPPHCreateria.value = res.data.data2;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getDetailInv = async (data) => {
  try {
    loading.value = true;
    console.log(data)
    const res = await axios.get("getDetailInv", {
        params: {
          no_inv: data.dtl_inv_no,
          trans_code: router.currentRoute.value.params.notagihan,
        },
    });

    tmpInv.po_number = []
    for (var i = 0; i < res.data.data3.length; i++ ){
      tmpInv.po_number.push(res.data.data3[i].dtl_inv_po)
    }

    tmpInv.mrr = []
    for (var i = 0; i < res.data.data2.length; i++ ){
      tmpInv.mrr.push(res.data.data2[i].trans_dtl_po)
    }

    listMrrPO.value = res.data.data2;

    tmpInv.no_inv = res.data.data1[0].dtl_inv_no
    tmpInv.trans_dtl_inv = res.data.data1[0].trans_dtl_inv
    tmpInv.no_inv_old = res.data.data1[0].dtl_inv_no
    tmpInv.curr = res.data.data1[0].dtl_inv_currency
    tmpInv.no_faktur = res.data.data1[0].dtl_inv_faktur
    tmpInv.tgl_inv = res.data.data1[0].dtl_inv_date
    tmpInv.ppn = res.data.data1[0].dtl_inv_ppn_pct
    tmpInv.dpp = new Intl.NumberFormat('id-ID').format(res.data.data1[0].dtl_inv_dpp)
    tmpInv.ppn_amt = new Intl.NumberFormat('id-ID').format(res.data.data1[0].dtl_inv_ppn)
    tmpInv.subtotal = new Intl.NumberFormat('id-ID').format(res.data.data1[0].dtl_inv_subtotal)
    tmpInv.pph_amt = new Intl.NumberFormat('id-ID').format(res.data.data1[0].dtl_inv_pph)
    tmpInv.keterangan = res.data.data1[0].dtl_inv_desc
    tmpInv.pph = parseInt(res.data.data1[0].dtl_inv_createria)
    tmpInv.final_amt = new Intl.NumberFormat('id-ID').format(res.data.data1[0].dtl_inv_finaltotal)
    loading.value = false;
  } catch (error) {
    loading.value = false;
    tmpInv.mrr = null
    tmpInv.dpp = 0
    tmpInv.curr = null
    tmpInv.curr = null
    tmpInv.ppn_amt = 0
    tmpInv.pph = null
    tmpInv.pph_amt = 0
    tmpInv.final_amt = 0
    tmpInv.subtotal = 0
    listMrrPO.value = null
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getdetailPO = async () => {
  try {
    loading.value = true;
    const res = await axios.get("getdetailPO", {
        params: {
          po_number: tmpInv.po_number,
          trans_code: router.currentRoute.value.params.notagihan,
        },
    });
    listMrrPO.value = res.data.data1;
    tmpInv.mrr = null
    tmpInv.dpp = 0
    tmpInv.curr = null
    tmpInv.curr = null
    tmpInv.ppn_amt = 0
    tmpInv.pph = null
    tmpInv.pph_amt = 0
    tmpInv.final_amt = 0
    tmpInv.subtotal = 0
    loading.value = false;
  } catch (error) {
    loading.value = false;
    tmpInv.mrr = null
    tmpInv.dpp = 0
    tmpInv.curr = null
    tmpInv.curr = null
    tmpInv.ppn_amt = 0
    tmpInv.pph = null
    tmpInv.pph_amt = 0
    tmpInv.final_amt = 0
    tmpInv.subtotal = 0
    listMrrPO.value = null
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getPOMrr = async (data) => {
  try {
    loading.value = true;
    const res = await axios.get("getPOMrr", {
        params: {
          po_number: tmpPO.po_number,
          trans_code: router.currentRoute.value.params.notagihan,
          empid : tmpInv.DOUser,
          domain : data.bu_domain
        },
    });
    listMrrPO2.value = res.data.data;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    listMrrPO.value = null
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getdetailPOEdit = async () => {
  try {
    loading.value = true;
    const res = await axios.get("getdetailPOEdit", {
        params: {
          po_number: tmpInv.po_number,
          trans_code: router.currentRoute.value.params.notagihan,
        },
    });
    listMrrPO.value = res.data.data1;
    tmpInv.mrr = null
    tmpInv.dpp = 0
    tmpInv.curr = null
    tmpInv.curr = null
    tmpInv.ppn_amt = 0
    tmpInv.pph = null
    tmpInv.pph_amt = 0
    tmpInv.final_amt = 0
    tmpInv.subtotal = 0
    loading.value = false;
  } catch (error) {
    loading.value = false;
    tmpInv.mrr = null
    tmpInv.dpp = 0
    tmpInv.curr = null
    tmpInv.curr = null
    tmpInv.ppn_amt = 0
    tmpInv.pph = null
    tmpInv.pph_amt = 0
    tmpInv.final_amt = 0
    tmpInv.subtotal = 0
    listMrrPO.value = null
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getdppPO = async () => {
  try {
    loading.value = true;
    const res = await axios.get("getdppPO", {
        params: {
          po_number: tmpInv.po_number,
          trans_code: router.currentRoute.value.params.notagihan,
          trans_dtl_po: tmpInv.mrr
        },
    });
    tmpInv.curr = res.data.data1[0].dtl_po_curr;
    tmpInv.dpp = res.data.data1[0].dtl_ttl_mrr;
    tmpInv.ppn_amt = tmpInv.dpp * tmpInv.ppn;
    tmpInv.subtotal = tmpInv.dpp + tmpInv.ppn_amt;
    if(tmpInv.pph_amt === 0) {
      tmpInv.final_amt = tmpInv.subtotal - tmpInv.pph_amt;
    } else {
      tmpInv.final_amt = tmpInv.subtotal - unformat(tmpInv.pph_amt);
    }

    tmpInv.dpp = new Intl.NumberFormat('id-ID').format(tmpInv.dpp)
    tmpInv.ppn_amt = new Intl.NumberFormat('id-ID').format(tmpInv.ppn_amt)
    tmpInv.subtotal = new Intl.NumberFormat('id-ID').format(tmpInv.subtotal)
    tmpInv.final_amt =  new Intl.NumberFormat('id-ID').format(tmpInv.final_amt)
    loading.value = false;
  } catch (error) {
    tmpInv.curr = null;
    tmpInv.dpp = 0
    tmpInv.ppn_amt = 0
    tmpInv.subtotal = 0
    tmpInv.final_amt =  0
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const filterFn = async (val, update, abort) => {
  update(async () => {
    search.value = val;
    await getPajakJenisFilter();
  });
};

const getPajakJenisFilter = async () => {
  try {
    loading.value = true;
    const res = await axios.get('getPajakJenisFilter', {
      params: {
        search: search.value
      }
    })
    listPPHCreateria.value = res.data.data

    loading.value = false
  } catch (error) {
    loading.value = false
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};



const getPajakJenis = async () => {
  try {
    loading.value = true;
    const res = await axios.get("getPajakJenis", {
        params: {
          pajak_jenis_id: tmpInv.pph
        },
    });

    tmpInv.tarif_npwp = res.data.data1[0].pajak_jenis_tarif_npwp
    tmpInv.pph_amt = unformat(tmpInv.dpp) * tmpInv.tarif_npwp
    tmpInv.final_amt =  new Intl.NumberFormat('id-ID').format(unformat(tmpInv.subtotal) - tmpInv.pph_amt)
    tmpInv.pph_amt = new Intl.NumberFormat('id-ID').format(tmpInv.pph_amt)
    loading.value = false
  } catch (error) {
    loading.value = false
    tmpInv.tarif_npwp = 0
    tmpInv.pph_amt = unformat(tmpInv.dpp) * tmpInv.tarif_npwp
    tmpInv.final_amt =  new Intl.NumberFormat('id-ID').format(unformat(tmpInv.subtotal) - tmpInv.pph_amt)
    tmpInv.pph_amt = new Intl.NumberFormat('id-ID').format(tmpInv.pph_amt)
    $q.notify({
      type: "negative",
      message: "Harap Pilih PPH Kriteria yang sesuai",
    });
  }
};

const calc_dpp = async () => {
  tmpInv.dpp = parseFloat(unformat(tmpInv.dpp))
  tmpInv.ppn_amt   =  tmpInv.dpp * tmpInv.ppn
  tmpInv.subtotal  =  tmpInv.dpp + tmpInv.ppn_amt
  tmpInv.pph_amt   =  tmpInv.tarif_npwp * tmpInv.dpp
  tmpInv.final_amt =  tmpInv.subtotal - tmpInv.pph_amt

  tmpInv.dpp = new Intl.NumberFormat('id-ID').format(tmpInv.dpp)
  tmpInv.ppn_amt = new Intl.NumberFormat('id-ID').format(tmpInv.ppn_amt)
  tmpInv.subtotal = new Intl.NumberFormat('id-ID').format(tmpInv.subtotal)
  tmpInv.pph_amt = new Intl.NumberFormat('id-ID').format(tmpInv.pph_amt)
  tmpInv.final_amt = new Intl.NumberFormat('id-ID').format(tmpInv.final_amt)
};

const calc_ppn = async () => {
  tmpInv.ppn_amt = parseFloat(unformat(tmpInv.ppn_amt))
  tmpInv.subtotal = parseFloat(unformat(tmpInv.dpp)) + tmpInv.ppn_amt
  tmpInv.pph_amt = tmpInv.tarif_npwp * unformat(tmpInv.dpp)
  tmpInv.final_amt = parseFloat(tmpInv.subtotal) - tmpInv.pph_amt

  tmpInv.ppn_amt = new Intl.NumberFormat('id-ID').format(tmpInv.ppn_amt)
  tmpInv.subtotal = new Intl.NumberFormat('id-ID').format(tmpInv.subtotal)
  tmpInv.pph_amt = new Intl.NumberFormat('id-ID').format(tmpInv.pph_amt)
  tmpInv.final_amt = new Intl.NumberFormat('id-ID').format(tmpInv.final_amt)
};

const calc_pph = async () => {
  tmpInv.final_amt = unformat(tmpInv.subtotal) - unformat(tmpInv.pph_amt)
  tmpInv.final_amt = new Intl.NumberFormat('id-ID').format(tmpInv.final_amt)
  tmpInv.pph_amt = new Intl.NumberFormat('id-ID').format(unformat(tmpInv.pph_amt))
};

const calc_ppnn = async () => {
  tmpInv.dpp = parseFloat(unformat(tmpInv.dpp))
  tmpInv.pph_amt = tmpInv.pph_amt == 0 ? 0 : parseFloat(unformat(tmpInv.pph_amt))
  tmpInv.ppn_amt = tmpInv.dpp * tmpInv.ppn 
  tmpInv.subtotal = tmpInv.dpp + tmpInv.ppn_amt
  tmpInv.final_amt = tmpInv.subtotal - tmpInv.pph_amt

  tmpInv.dpp = new Intl.NumberFormat('id-ID').format(tmpInv.dpp)
  tmpInv.ppn_amt = new Intl.NumberFormat('id-ID').format(tmpInv.ppn_amt)
  tmpInv.pph_amt = new Intl.NumberFormat('id-ID').format(tmpInv.pph_amt)
  tmpInv.subtotal = new Intl.NumberFormat('id-ID').format(tmpInv.subtotal)
  tmpInv.final_amt = new Intl.NumberFormat('id-ID').format(tmpInv.final_amt)


};

function unformat(val) {
    var unformatted = val.split('.').join("");
    return unformatted.replace(/,/g, ".");
}

const onRequest = (props) => {
  const { page, rowsPerPage, sortBy, descending, filter } = props.paginationpo;
  paginationpo.value.filter = filter;
  paginationpo.value.page = page;
  paginationpo.value.rowsPerPage = rowsPerPage;
  paginationpo.value.sortBy = sortBy;
  paginationpo.value.descending = descending;
  paginationpo.value.empid = empid();
  getListPO();
  getListInv();
  getTagihan();
};

onMounted(() => {
  onRequest({
    paginationpo: paginationpo.value,
    paginationinv: paginationinv.value,
  });
});


const onSubmit = async (values, actions) => {
        invRef.value.validate()
        mrrRef.value.validate()
        tglRef.value.validate()
        ketRef.value.validate()
        createriaRef.value.validate()

        if (invRef.value.hasError || mrrRef.value.hasError || tglRef.value.hasError || ketRef.value.hasError || createriaRef.value.hasError) {
          // form has error
        }
        else {
          try {
              $q.loading.show();

              var dataForm = new FormData();
              if(files1.value !== null) {
                for (var i = 0; i < files1.value.length; i++ ){
                    let file = files1.value[i];
                    dataForm.append('file_po_' + i + '', file);
                }
              }

              if(files2.value !== null) {
                for (var i = 0; i < files2.value.length; i++ ){
                    let file = files2.value[i];
                    dataForm.append('file_inv_' + i + '', file);
                }
              }

              if(files3.value !== null) {
                for (var i = 0; i < files3.value.length; i++ ){
                    let file = files3.value[i];
                    dataForm.append('file_fp_' + i + '', file);
                }
              }

              if(files4.value !== null) {
                for (var i = 0; i < files4.value.length; i++ ){
                    let file = files4.value[i];
                    dataForm.append('file_sj_' + i + '', file);
                }
              }

              if(files5.value !== null) {
                for (var i = 0; i < files5.value.length; i++ ){
                    let file = files5.value[i];
                    dataForm.append('file_mrr_' + i + '', file);
                }
              }

              dataForm.append("no_po", tmpInv.po_number)
              dataForm.append("ppn", tmpInv.ppn)
              dataForm.append("trans_code", tmpInv.trans_code)
              dataForm.append("no_inv", tmpInv.no_inv)
              dataForm.append("trans_dtl_inv", tmpInv.trans_dtl_inv)
              dataForm.append("no_inv_old", tmpInv.no_inv_old)
              dataForm.append("tgl_inv", tmpInv.tgl_inv)
              dataForm.append("no_faktur", tmpInv.no_faktur)
              dataForm.append("mrr", tmpInv.mrr)
              dataForm.append("dpp", tmpInv.dpp)
              dataForm.append("curr", tmpInv.curr)
              dataForm.append("ppn_amt", tmpInv.ppn_amt)
              dataForm.append("subtotal", tmpInv.subtotal)
              dataForm.append("pajak_jenis", tmpInv.pph)
              dataForm.append("pph_amt", tmpInv.pph_amt)
              dataForm.append("keterangan", tmpInv.keterangan)
              dataForm.append("final_amt", tmpInv.final_amt)
              dataForm.append("tarif_npwp", tmpInv.tarif_npwp)
              dataForm.append("user", tmpInv.DOUser)
              dataForm.append("action", tmpInv.action)
              
              const res = await axios.post("tambahinvoicesimpan", dataForm, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
              $q.loading.hide();
              if(res.data === 'Data Saved Succesfully') {
                $q.notify({
                  type: "positive",
                  message: "Data Invoice Berhasil Disimpan",
                });

                getListInv()
                getListPO()
                dialogForm_Inv.value = false
                dialogForm_InvEdit.value = false
                reset()
              } else {
                $q.notify({
                  type: "negative",
                  message: res.data,
              });
              }
              
            } catch (error) {
                $q.loading.hide();
                $q.notify({
                    type: "negative",
                    message: ParseError(error),
                });
            }
        }
      }
</script>