<template>
  <div class="q-pa-md">
    <q-card>
      <q-card-section>
        <q-btn-group push>
          <q-btn push color="primary" label="Tambah Data" @click="addPengajuanHarga" />
        </q-btn-group>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          title="Pengajuan Harga Transporter"
          
          :columns="columns"
          :rows="listDataHeader"
          row-key="id"
          v-model:pagination="pagination"
          :loading="loading"
          :filter="pagination.filter"
          @request="onRequest"
          binary-state-sort
        >
          <template v-slot:top-right>
            <q-input
              borderless
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
          <template v-slot:body-cell-aksi="props">              
            <q-td :props="props">
              <!-- {{ props }} -->
              <!-- {{props.row.status }} -->
              <q-btn-group v-if="props.row.status === 'Draf' || props.row.status === 'Reject'" push>
                 <q-btn
                  dense
                  color="secondary"
                  class="text-weight-regular text-caption"
                  @click="sendPengajuanHarga(props.row)"
                  push
                  label="Send"
                  icon="send"
                />
                <q-btn
                  dense
                  color="warning"
                  class="text-weight-regular text-caption"
                  @click="editPengajuanHarga(props.row)"
                  push
                  label="Edit"
                  icon="edit"
                />
                <q-btn
                  dense
                  color="negative"
                  class="text-weight-regular text-caption"
                  @click="deletePengajuanHarga(props.row)"
                  push
                  label="Hapus"
                  icon="delete"
                />
                <q-btn
                  dense
                  color="info"
                  class="text-weight-regular text-caption"
                  @click="viewPengajuanHarga(props.row)"
                  push
                  label="View"
                  icon="visibility"
                />
              </q-btn-group>

              <q-btn-group v-if="props.row.status === 'Send' || props.row.status === 'Full_Approve'" push>                 
                <q-btn
                  dense
                  color="grey"
                  class="text-weight-regular text-caption"
                  @click=""
                  push
                  label="Send"
                  icon="send"
                />
                <q-btn
                  dense
                  color="grey"
                  class="text-weight-regular text-caption"
                  @click=""
                  push
                  label="Edit"
                  icon="edit"
                />
                <q-btn
                  dense
                  color="grey"
                  class="text-weight-regular text-caption"
                  @click=""
                  push
                  label="Hapus"
                  icon="delete"
                />
                <q-btn
                  dense
                  color="info"
                  class="text-weight-regular text-caption"
                  @click="viewPengajuanHarga(props.row)"
                  push
                  label="View"
                  icon="visibility"
                />
              </q-btn-group>
              
              <q-btn-group v-if="props.row.status === 'DetailERR'" push>                 
                <q-btn
                  dense
                  color="grey"
                  class="text-weight-regular text-caption"
                  @click=""
                  push
                  label="Send"
                  icon="send"
                />
                <q-btn
                  dense
                  color="warning"
                  class="text-weight-regular text-caption"
                  @click="editPengajuanHarga(props.row)"
                  push
                  label="Edit"
                  icon="edit"
                />
                <q-btn
                  dense
                  color="negative"
                  class="text-weight-regular text-caption"
                  @click="deletePengajuanHarga(props.row)"
                  push
                  label="Hapus"
                  icon="delete"
                />
                <q-btn
                  dense
                  color="info"
                  class="text-weight-regular text-caption"
                  @click="viewPengajuanHarga(props.row)"
                  push
                  label="View"
                  icon="visibility"
                />
              </q-btn-group>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <q-dialog v-model="dialogForm" persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down">
      <q-card>
        <q-card-section>
          <div class="text-h6">Form Pengajuan Harga</div>
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 80vh" class="scroll"> 
        <Form
        :validation-schema="schema1"
        @submit="savePICApproval"
        class="q-mt-md"
        >             
          <div class="row q-col-gutter-sm">
            <div class="col-6">    
              <Field
                  v-model="tmpForm.bussinessunit"
                  name="bussinessunit"
                  v-slot="{ errorMessage, handleChange, value }"
              >           
                <q-select
                  @update:modelValue="handleChange"
                  dense
                  outlined                
                  use-input
                  emit-value
                  map-options
                  input-debounce="0"
                  option-value="bu_code_qad"
                  option-label="bu_name"
                  label="Pilih Business Unit"
                  :options="listBU"     
                  :error-message="errorMessage"
                  :error="!!errorMessage"    
                  :model-value="value"  
                  @blur="getLokasiMuat"
                  :readonly="GiveitDisable"     
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

            <div class="col-6">    
              <Field
                  v-model="tmpForm.region"
                  name="region"
                  v-slot="{ errorMessage, handleChange, value }"
              >           
                <q-select
                  @update:modelValue="handleChange"
                  dense
                  outlined                
                  use-input
                  emit-value
                  map-options
                  input-debounce="0"
                  option-value="kodemstr"
                  option-label="descmstr"
                  label="Pilih Region"
                  :options="listRegion"     
                  :error-message="errorMessage"
                  :error="!!errorMessage"    
                  :model-value="value"  
                  :readonly="GiveitDisable"                                  
                  @filter="filterFunctionRegion"       
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

            <div class="col-6">    
              <Field
                  v-model="tmpForm.kategori"
                  name="kategori"
                  v-slot="{ errorMessage, handleChange, value }"
              >           
                <q-select
                  @update:modelValue="handleChange"
                  dense
                  outlined                
                  use-input
                  emit-value
                  map-options
                  input-debounce="0"
                  option-value="desc"
                  option-label="desc"
                  label="Darat/Laut"
                  :options="listDaratLaut"     
                  :error-message="errorMessage"
                  :error="!!errorMessage"    
                  :model-value="value"   
                  :readonly="GiveitDisable"    
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

             <div class="col-6">
                <q-input label="Tgl Pengajuan" outlined dense v-model="tmpForm.tgl_berlaku" :readonly="GiveitDisable">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="tmpForm.tgl_berlaku" mask="YYYY-MM-DD" @update:model-value="hideDate">
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

            <div class="col-12">
              <div class="tw-w-full tw-border-b-2 tw-border-black"></div>
            </div>
            <div class="col-12">
              <divider title="Detail" />
            </div>

            <div class="col-12">
              <q-input type="number" @blur="setLokasiMuat2"  v-model="tmpForm.jumlahlokasimuat" dense outlined label="Jumlah Lokasi Muat" />
            </div>

            <div class="col-6">    
              <Field
                  v-model="tmpForm.lokasimuat"
                  name="lokasimuat"
                  v-slot="{ errorMessage, handleChange, value }"
              >           
                <q-select
                  @update:modelValue="handleChange"
                  dense
                  outlined                
                  use-input
                  emit-value
                  map-options
                  input-debounce="0"
                  option-value="kodemstr"
                  option-label="kodemstr"
                  label="Lokasi Muat"
                  :options="listLokasiMuat"     
                  :error-message="errorMessage"
                  :error="!!errorMessage"    
                  :model-value="value"  
                  @blur="getKotaTujuan"    
                  @filter="filterFunction"                   
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

            <div class="col-6">    
              <Field
                  v-model="tmpForm.lokasimuat2"
                  name="lokasimuat2"
                  v-slot="{ errorMessage, handleChange, value }"
              >           
                <q-select
                  @update:modelValue="handleChange"
                  dense
                  outlined                
                  use-input
                  emit-value
                  map-options
                  input-debounce="0"
                  option-value="kodemstr"
                  option-label="kodemstr"
                  label="Lokasi Muat 2"
                  :options="listLokasiMuat"     
                  :error-message="errorMessage"
                  :error="!!errorMessage"    
                  :model-value="value"  
                  @blur="getKotaTujuan"    
                  @filter="filterFunction"  
                  :readonly="(tmpForm.jumlahlokasimuat == '1' || tmpForm.jumlahlokasimuat == 0 ) ? true : false"                 
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

            <div class="col-6">    
              <Field
                  v-model="tmpForm.kotatujuan"
                  name="kotatujuan"
                  v-slot="{ errorMessage, handleChange, value }"
              >           
                <!-- <q-select
                  @update:modelValue="handleChange"
                  dense
                  outlined                
                  use-input
                  emit-value
                  map-options
                  input-debounce="0"
                  option-value="mkota_nama"
                  option-label="mkota_nama"
                  label="Kota Tujuan"
                  :options="listKotaTujuan"     
                  :error-message="errorMessage"
                  :error="!!errorMessage"    
                  :model-value="value"   
                  @filter="filterFunctionKotaTujuan" 
                  @blur="getJnsKendaraan"     
                > -->
                <q-select                  
                  @update:modelValue="handleChange"
                  dense
                  outlined                
                  use-input
                  emit-value
                  map-options
                  input-debounce="0"
                  option-value="kota_region"
                  option-label="kota_region"
                  label="Kota Tujuan"
                  :options="listKotaTujuan"     
                  :error-message="errorMessage"
                  :error="!!errorMessage"    
                  :model-value="value"
                  @blur="getJnsKendaraan"         
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

            <div class="col-6">    
              <Field
                  v-model="tmpForm.jeniskendaraan"
                  name="jeniskendaraan"
                  v-slot="{ errorMessage, handleChange, value }"
              >           
                <!-- <q-select
                  @update:modelValue="handleChange"
                  dense
                  outlined                
                  use-input
                  emit-value
                  map-options
                  input-debounce="0"
                  option-value="mkend_nama"
                  option-label="mkend_nama"
                  label="Jenis Kendaraan"
                  :options="listJenisKendaraan"     
                  :error-message="errorMessage"
                  :error="!!errorMessage"    
                  :model-value="value"   
                > -->
                <q-select                  
                  @update:modelValue="handleChange"
                  dense
                  outlined                
                  use-input
                  emit-value
                  map-options
                  input-debounce="0"
                  option-value="kodemstr"
                  option-label="kodemstr"
                  label="Jenis Kendaraan"
                  :options="listJenisKendaraan"     
                  :error-message="errorMessage"
                  :error="!!errorMessage"    
                  :model-value="value"       
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

            <div class="col-6">
              <q-input type="number" :readonly="(tmpForm.lokasimuat == 'Ngoro' || tmpForm.lokasimuat == 'Gresik') ? true : false" v-model="tmpForm.jumlaharah" dense outlined label="Jumlah Arah" />
            </div>

            <div class="col-6">
              <q-input type="number" @blur="setLokasiMuat2" :readonly="(tmpForm.lokasimuat == 'Ngoro' || tmpForm.lokasimuat == 'Gresik') ? true : false" v-model="tmpForm.jumlahtujuan" dense outlined label="Jumlah Tujuan" />
            </div>

            <div class="col-6">    
              <Field                                    
                  name="fixnonfix"
                  v-slot="{ errorMessage, handleChange, value }"
              >           
                <q-select
                  @update:modelValue="handleChange"
                  dense
                  outlined                
                  use-input
                  emit-value
                  map-options
                  input-debounce="0"
                  option-value="desc"
                  option-label="desc"
                  label="Fixed/Non Fixeds"
                  v-model="tmpForm.fixnonfix"
                  :options="listFixNonFix"     
                  :error-message="errorMessage"
                  :error="!!errorMessage"                        
                  :readonly="(tmpForm.lokasimuat == 'Ngoro' || tmpForm.lokasimuat == 'Gresik') ? false : true"
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

            <div class="col-6">
              <!-- <q-input type="number"  mask="###/##" v-model="tmpForm.harga" dense outlined label="Harga" /> -->
              <!-- <q-input v-model="tmpForm.harga" mask="###,###,###,###" dense outlined label="Harga"/> -->
              <q-input v-model="tmpForm.harga" v-money="money" dense outlined label="Harga (Rp)"/>
            </div>

            <div class="col-12" hidden>
                <q-input v-model="tmpForm.DOUser" label="User" />
            </div>
            <q-btn unelevated rounded color="warning" label="Add Detail" @click="saveTmp"/>

          </div>

          <div class="col-12 tw-mt-3">
            <q-markup-table>
              <thead>
                <tr>
                  <th class="text-left">No</th>
                  <th class="text-right">Jumlah Lokasi Muat</th>
                  <th class="text-left">Lokasi Muat</th>
                  <th class="text-left">Lokasi Muat 2</th>
                  <th class="text-left">Kota Tujuan</th>
                  <th class="text-left">Jenis Kendaraan</th>
                  <th class="text-left">Fixed/Non Fixed Truck</th>
                  <th class="text-right">Jumlah Arah</th>
                  <th class="text-right">Jumlah Lokasi Muat</th>
                  <th class="text-right">Harga Pengajuan</th>
                  <th class="text-right">Harga Deal</th>
                  <th class="text-left">Tanggal Berlaku</th>
                  <th class="text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(data, i) in tmpData" :key="i">
                  <template v-if="data.flag != 1">
                    <td class="text-left">{{ i + 1 }}</td>
                    <td class="text-right">{{ data.jumlahlokasimuat }}</td>
                    <td class="text-left">{{ data.lokasimuat }}</td>
                    <td class="text-left">{{ data.lokasimuat2 }}</td>
                    <td class="text-left">{{ data.kotatujuan }}</td>
                    <td class="text-left">{{ data.jeniskendaraan }}</td>
                    <td class="text-left">{{ data.fixnonfix }}</td>
                    <td class="text-right">{{ data.jumlaharah }}</td>
                    <td class="text-right">{{ data.jumlahtujuan }}</td>
                    <td class="text-right">{{ data.harga }}</td>
                    <td class="text-right">{{ data.harga_deal }}</td>
                    <td class="text-left">{{ data.tglberlakupengajuan }}</td>
                    <td class="text-right">
                      <q-btn-group>
                        <q-btn square dense color="negative" icon="delete" @click="deleteTmp(data, i)" />
                        <!-- <q-btn square dense color="info" icon="edit" @click="editTmp(data, i)" /> -->
                      </q-btn-group>
                    </td>
                  </template>

                </tr>
              </tbody>
            </q-markup-table>
          </div>

        </Form>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn flat label="Batal" color="primary" v-close-popup />          
          <q-btn flat label="Simpan" color="primary" @click="save" />
        </q-card-actions>      
        
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogForm_EDIT" persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down">
      <q-card>
        <q-card-section>
          <div class="text-h6">Form Edit Pengajuan Harga</div>
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 80vh" class="scroll"> 
        <Form
        :validation-schema="schema1"
        @submit="savePICApproval"
        class="q-mt-md"
        >             
          <div class="row q-col-gutter-sm">
            <div class="col-6">    
              <Field
                  v-model="tmpForm.bussinessunit"
                  name="bussinessunit"
                  v-slot="{ errorMessage, handleChange, value }"
              >           
                <q-select
                  @update:modelValue="handleChange"
                  dense
                  outlined                
                  use-input
                  emit-value
                  map-options
                  input-debounce="0"
                  option-value="bu_code_qad"
                  option-label="bu_name"
                  label="Pilih Business Unit"
                  :options="listBU"     
                  :error-message="errorMessage"
                  :error="!!errorMessage"    
                  :model-value="value"  
                  @blur="getLokasiMuat" 
                  readonly    
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

            <div class="col-6">    
              <Field
                  v-model="tmpForm.region"
                  name="region"
                  v-slot="{ errorMessage, handleChange, value }"
              >           
                <q-select
                  @update:modelValue="handleChange"                  
                  dense
                  outlined                
                  use-input
                  emit-value
                  map-options
                  input-debounce="0"
                  option-value="kodemstr"
                  option-label="descmstr"
                  label="Pilih Region"
                  :options="listRegion"     
                  :error-message="errorMessage"
                  :error="!!errorMessage"    
                  :model-value="value"
                  @filter="filterFunctionRegion"  
                  readonly      
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

            <div class="col-6">    
              <Field
                  v-model="tmpForm.kategori"
                  name="kategori"
                  v-slot="{ errorMessage, handleChange, value }"
              >           
                <q-select
                  @update:modelValue="handleChange"
                  dense
                  outlined                
                  use-input
                  emit-value
                  map-options
                  input-debounce="0"
                  option-value="desc"
                  option-label="desc"
                  label="Darat/Laut"
                  :options="listDaratLaut"     
                  :error-message="errorMessage"
                  :error="!!errorMessage"    
                  :model-value="value"     
                  readonly   
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

             <div class="col-6">
                <q-input label="Tgl Pengajuan" outlined dense v-model="tmpForm.tgl_berlaku" readonly>
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="tmpForm.tgl_berlaku" mask="YYYY-MM-DD">
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
            

            <div class="col-12">
              <div class="tw-w-full tw-border-b-2 tw-border-black"></div>
            </div>
            <div class="col-12">
              <divider title="Detail" />
            </div>

            <div class="col-12">
              <q-input type="number" @blur="setLokasiMuat2"  v-model="tmpForm.jumlahlokasimuat" dense outlined label="Jumlah Lokasi Muat" />
            </div>

            <div class="col-6">    
              <Field
                  v-model="tmpForm.lokasimuat"
                  name="lokasimuat"
                  v-slot="{ errorMessage, handleChange, value }"
              >           
                <q-select
                  @update:modelValue="handleChange"
                  dense
                  outlined                
                  use-input
                  emit-value
                  map-options
                  input-debounce="0"
                  option-value="kodemstr"
                  option-label="kodemstr"
                  label="Lokasi Muat"
                  :options="listLokasiMuat"     
                  :error-message="errorMessage"
                  :error="!!errorMessage"    
                  :model-value="value" 
                  @filter="filterFunction"                      
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

            <div class="col-6">    
              <Field
                  v-model="tmpForm.lokasimuat2"
                  name="lokasimuat2"
                  v-slot="{ errorMessage, handleChange, value }"
              >           
                <q-select
                  @update:modelValue="handleChange"
                  dense
                  outlined                
                  use-input
                  emit-value
                  map-options
                  input-debounce="0"
                  option-value="kodemstr"
                  option-label="kodemstr"
                  label="Lokasi Muat 2"
                  :options="listLokasiMuat"     
                  :error-message="errorMessage"
                  :error="!!errorMessage"    
                  :model-value="value"    
                  @filter="filterFunction"  
                  :readonly="(tmpForm.jumlahlokasimuat == '1' || tmpForm.jumlahlokasimuat == 0 ) ? true : false"                 
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

            <div class="col-6">    
              <Field
                  v-model="tmpForm.kotatujuan"
                  name="kotatujuan"
                  v-slot="{ errorMessage, handleChange, value }"
              >           
                <!-- <q-select
                  @update:modelValue="handleChange"
                  dense
                  outlined                
                  use-input
                  emit-value
                  map-options
                  input-debounce="0"
                  option-value="mkota_nama"
                  option-label="mkota_nama"
                  label="Kota Tujuan"
                  :options="listKotaTujuan"     
                  :error-message="errorMessage"
                  :error="!!errorMessage"    
                  :model-value="value"   
                  @filter="filterFunctionKotaTujuan"  
                > -->
                <q-select                  
                  @update:modelValue="handleChange"
                  dense
                  outlined                
                  use-input
                  emit-value
                  map-options
                  input-debounce="0"
                  option-value="kota_region"
                  option-label="kota_region"
                  label="Kota Tujuan"
                  :options="listKotaTujuan"     
                  :error-message="errorMessage"
                  :error="!!errorMessage"    
                  :model-value="value"       
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

            <div class="col-6">    
              <Field
                  v-model="tmpForm.jeniskendaraan"
                  name="jeniskendaraan"
                  v-slot="{ errorMessage, handleChange, value }"
              >           
                <!-- <q-select
                  @update:modelValue="handleChange"
                  dense
                  outlined                
                  use-input
                  emit-value
                  map-options
                  input-debounce="0"
                  option-value="mkend_nama"
                  option-label="mkend_nama"
                  label="Jenis Kendaraan"
                  :options="listJenisKendaraan"     
                  :error-message="errorMessage"
                  :error="!!errorMessage"    
                  :model-value="value"   
                > -->
                <q-select                  
                  @update:modelValue="handleChange"
                  dense
                  outlined                
                  use-input
                  emit-value
                  map-options
                  input-debounce="0"
                  option-value="kodemstr"
                  option-label="kodemstr"
                  label="Jenis Kendaraan"
                  :options="listJenisKendaraan"     
                  :error-message="errorMessage"
                  :error="!!errorMessage"    
                  :model-value="value"       
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

            <div class="col-6">
              <q-input type="number" :readonly="(tmpForm.lokasimuat == 'Ngoro' || tmpForm.lokasimuat == 'Gresik') ? false : true" v-model="tmpForm.jumlaharah" dense outlined label="Jumlah Arah" />
            </div>

            <div class="col-6">
              <q-input type="number" :readonly="(tmpForm.lokasimuat == 'Ngoro' || tmpForm.lokasimuat == 'Gresik') ? false : true" v-model="tmpForm.jumlahtujuan" dense outlined label="Jumlah Tujuan" />
            </div>
           

            <div class="col-6">    
              <Field
                  
                  name="fixnonfix"
                  v-slot="{ errorMessage, handleChange, value }"
              >      
                <q-select
                  @update:modelValue="handleChange"
                  dense
                  outlined                
                  use-input
                  emit-value
                  map-options
                  input-debounce="0"
                  option-value="desc"
                  option-label="desc"
                  label="Fixed/Non Fixed"
                  :options="listFixNonFix"     
                  :error-message="errorMessage"
                  :error="!!errorMessage"    
                  :readonly="(tmpForm.lokasimuat == 'Ngoro' || tmpForm.lokasimuat == 'Gresik') ? false : true"
                  v-model="tmpForm.fixnonfix"
                  
                  
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

            <div class="col-6">
              <!-- <q-input type="number" v-model="tmpForm.harga" dense outlined label="Harga" /> -->
              <!-- <q-input v-model="tmpForm.harga" mask="###,###,###,###" dense outlined label="Harga"/> -->
              <q-input v-model="tmpForm.harga" v-money="money" dense outlined label="Harga (Rp)"/>
            </div>

            <div class="col-12" hidden>
                <q-input v-model="tmpForm.DOUser" label="User" />
            </div>
            <q-btn unelevated rounded color="warning" label="Add Detail" @click="saveTmp"/>

          </div>

          <div class="col-12 tw-mt-3">
            <q-markup-table>
              <thead>
                <tr>
                  <th class="text-left">No</th>
                  <th class="text-left">Lokasi Muat</th>
                  <th class="text-left">Lokasi Muat 2</th>
                  <th class="text-left">Kota Tujuan</th>
                  <th class="text-left">Jenis Kendaraan</th>
                  <th class="text-left">Fixed/Non Fixed Truck</th>
                  <th class="text-right">Jumlah Arah</th>
                  <th class="text-right">Jumlah Tujuan</th>
                  <th class="text-right">Harga Pengajuan</th>
                  <th class="text-right">Harga Deal</th>
                  <th class="text-left">Tanggal Berlaku</th>
                  <th class="text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(data, i) in tmpData" :key="i">
                  <template v-if="data.flag != 1">
                    <td class="text-left">{{ i + 1 }}</td>
                    <td class="text-left">{{ data.lokasimuat }}</td>
                    <td class="text-left">{{ data.lokasimuat2 }}</td>
                    <td class="text-left">{{ data.kotatujuan }}</td>
                    <td class="text-left">{{ data.jeniskendaraan }}</td>
                    <td class="text-left">{{ data.fixnonfix }}</td>
                    <td class="text-right">{{ data.jumlaharah }}</td>
                    <td class="text-right">{{ data.jumlahtujuan }}</td>
                    <td class="text-right">{{ data.harga }}</td>
                    <td class="text-right">{{ data.harga_deal }}</td>
                    <td class="text-left">{{ data.tglberlakupengajuan }}</td>
                    <td class="text-right">
                      <q-btn-group>
                        <q-btn square dense color="negative" icon="delete" @click="deleteTmp(data, i)" />
                        <!-- <q-btn square dense color="info" icon="edit" @click="editTmp(data, i)" /> -->
                      </q-btn-group>
                    </td>
                  </template>

                </tr>
              </tbody>
            </q-markup-table>
          </div>

        </Form>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn flat label="Batal" color="primary" v-close-popup />          
          <q-btn flat label="Simpan" color="primary" @click="saveedit" />
        </q-card-actions>      
        
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogForm_VIEW" persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down">
      <q-card>
        <q-card-section>
          <div class="text-h6">[VIEW] Form Pengajuan Harga</div>
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 80vh" class="scroll"> 
        <Form
        :validation-schema="schema1"
        @submit="savePICApproval"
        class="q-mt-md"
        >             
          <div class="row q-col-gutter-sm">
            <div class="col-6">    
              <Field
                  v-model="tmpForm.bussinessunit"
                  name="bussinessunit"
                  v-slot="{ errorMessage, handleChange, value }"
              >           
                <q-select
                  @update:modelValue="handleChange"
                  dense
                  outlined                
                  use-input
                  emit-value
                  map-options
                  input-debounce="0"
                  option-value="bu_code_qad"
                  option-label="bu_name"
                  label="Pilih Business Unit"
                  :options="listBU"     
                  :error-message="errorMessage"
                  :error="!!errorMessage"    
                  :model-value="value"  
                  @blur="getLokasiMuat" 
                  readonly    
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

            <div class="col-6">    
              <Field
                  v-model="tmpForm.region"
                  name="region"
                  v-slot="{ errorMessage, handleChange, value }"
              >           
                <q-select
                  @update:modelValue="handleChange"
                  dense
                  outlined                
                  use-input
                  emit-value
                  map-options
                  input-debounce="0"
                  option-value="kodemstr"
                  option-label="descmstr"
                  label="Pilih Region"
                  :options="listRegion"     
                  :error-message="errorMessage"
                  :error="!!errorMessage"    
                  :model-value="value"  
                  @blur="getKotaTujuan" 
                  readonly      
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

            <div class="col-6">    
              <Field
                  v-model="tmpForm.kategori"
                  name="kategori"
                  v-slot="{ errorMessage, handleChange, value }"
              >           
                <q-select
                  @update:modelValue="handleChange"
                  dense
                  outlined                
                  use-input
                  emit-value
                  map-options
                  input-debounce="0"
                  option-value="desc"
                  option-label="desc"
                  label="Darat/Laut"
                  :options="listDaratLaut"     
                  :error-message="errorMessage"
                  :error="!!errorMessage"    
                  :model-value="value"     
                  readonly   
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

             <div class="col-6">
                <q-input label="Tgl Pengajuan" outlined dense v-model="tmpForm.tgl_berlaku" readonly>
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="tmpForm.tgl_berlaku" mask="YYYY-MM-DD">
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
            

            <div class="col-12">
              <div class="tw-w-full tw-border-b-2 tw-border-black"></div>
            </div>
            <div class="col-12">
              <divider title="Detail" />
            </div>

            <div class="col-6" hidden>    
              <Field
                  v-model="tmpForm.lokasimuat"
                  name="lokasimuat"
                  v-slot="{ errorMessage, handleChange, value }"
              >           
                <q-select                  
                  @update:modelValue="handleChange"
                  dense
                  outlined                
                  use-input
                  emit-value
                  map-options
                  input-debounce="0"
                  option-value="kodemstr"
                  option-label="kodemstr"
                  label="Lokasi Muat"
                  :options="listLokasiMuat"     
                  :error-message="errorMessage"
                  :error="!!errorMessage"    
                  :model-value="value"                       
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

            <div class="col-6" hidden>    
              <Field
                  v-model="tmpForm.kotatujuan"
                  name="kotatujuan"
                  v-slot="{ errorMessage, handleChange, value }"
              >           
                <q-select                  
                  @update:modelValue="handleChange"
                  dense
                  outlined                
                  use-input
                  emit-value
                  map-options
                  input-debounce="0"
                  option-value="kota_region"
                  option-label="kota_region"
                  label="Kota Tujuan"
                  :options="listKotaTujuan"     
                  :error-message="errorMessage"
                  :error="!!errorMessage"    
                  :model-value="value"       
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

            <div class="col-12" hidden>    
              <Field
                  v-model="tmpForm.jeniskendaraan"
                  name="jeniskendaraan"
                  v-slot="{ errorMessage, handleChange, value }"
              >           
                <q-select                  
                  @update:modelValue="handleChange"
                  dense
                  outlined                
                  use-input
                  emit-value
                  map-options
                  input-debounce="0"
                  option-value="kodemstr"
                  option-label="kodemstr"
                  label="Jenis Kendaraan"
                  :options="listJenisKendaraan"     
                  :error-message="errorMessage"
                  :error="!!errorMessage"    
                  :model-value="value"       
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

            <div class="col-6" hidden>
              <q-input hidden type="number" :readonly="(tmpForm.lokasimuat == 'Ngoro' || tmpForm.lokasimuat == 'Gresik') ? true : false" v-model="tmpForm.jumlaharah" dense outlined label="Jumlah Arah" />
            </div>

            <div class="col-6" hidden>
              <q-input type="number" :readonly="(tmpForm.lokasimuat == 'Ngoro' || tmpForm.lokasimuat == 'Gresik') ? true : false" v-model="tmpForm.jumlahtujuan" dense outlined label="Jumlah Tujuan" />
            </div>
           

            <div class="col-6" hidden>    
              <Field
                  
                  name="fixnonfix"
                  v-slot="{ errorMessage, handleChange, value }"
              >      
                <q-select
                  @update:modelValue="handleChange"
                  dense
                  outlined                
                  use-input
                  emit-value
                  map-options
                  input-debounce="0"
                  option-value="desc"
                  option-label="desc"
                  label="Fixed/Non Fixed"
                  :options="listFixNonFix"     
                  :error-message="errorMessage"
                  :error="!!errorMessage"    
                  :readonly="(tmpForm.lokasimuat == 'Ngoro' || tmpForm.lokasimuat == 'Gresik') ? false : true"
                  v-model="tmpForm.fixnonfix"
                  
                  
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

            <div class="col-6" hidden>              
              <!-- <q-input v-model="tmpForm.harga" mask="###,###,###,###" dense outlined label="Harga"/> -->
              <q-input hidden v-model="tmpForm.harga" v-money="money" dense outlined label="Harga (Rp)"/>
            </div>

            <div class="col-12" hidden>
                <q-input v-model="tmpForm.DOUser" label="User" />
            </div>
            <!-- <q-btn unelevated rounded color="warning" label="Add Detail" @click="saveTmp"/> -->

          </div>

          <div class="col-12 tw-mt-3">
            <q-markup-table>
              <thead>
                <tr>
                  <th class="text-left">No</th>
                  <th class="text-left">Lokasi Muat</th>
                  <th class="text-left">Lokasi Muat 2</th>
                  <th class="text-left">Kota Tujuan</th>
                  <th class="text-left">Jenis Kendaraan</th>
                  <th class="text-left">Fixed/Non Fixed Truck</th>
                  <th class="text-left">Jumlah Arah</th>
                  <th class="text-left">Jumlah Tujuan</th>
                  <th class="text-right">Harga Pengajuan</th>
                  <th class="text-right">Harga Deal</th>
                  <th class="text-left">Tanggal Berlaku</th>
                  <th class="text-left">Kode Tujuan</th>
                  <!-- <th class="text-right">Aksi</th> -->
                </tr>
              </thead>
              <tbody>
                <tr v-for="(data, i) in tmpData" :key="i">
                  <template v-if="data.flag != 1">
                    <td class="text-left">{{ i + 1 }}</td>
                    <td class="text-left">{{ data.lokasimuat }}</td>
                    <td class="text-left">{{ data.lokasimuat2 }}</td>
                    <td class="text-left">{{ data.kotatujuan }}</td>
                    <td class="text-left">{{ data.jeniskendaraan }}</td>
                    <td class="text-left">{{ data.fixnonfix }}</td>
                    <td class="text-right">{{ data.jumlaharah }}</td>
                    <td class="text-right">{{ data.jumlahtujuan }}</td>
                    <td class="text-right">{{ data.harga }}</td>
                    <td class="text-right">{{ data.harga_deal }}</td>
                    <td class="text-left">{{ data.tglberlakupengajuan }}</td>
                    <td class="text-left">{{ data.kodetujuan }}</td>
                    <td class="text-left">
                      <!-- <q-btn-group>
                        <q-btn square dense color="negative" icon="delete" @click="deleteTmp(data, i)" />
                        <q-btn square dense color="info" icon="edit" @click="editTmp(data, i)" />
                      </q-btn-group> -->
                    </td>
                  </template>

                </tr>
              </tbody>
            </q-markup-table>
          </div>

        </Form>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn flat label="Batal" color="primary" v-close-popup />          
          <!-- <q-btn flat label="Simpan" color="primary" @click="saveedit" /> -->
        </q-card-actions>      
        
      </q-card>
    </q-dialog>

    
    
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import axios from "axios";
import { ParseError, excelDownload, domain, role, empid } from "/src/utils";
import { useQuasar } from "quasar";
import { Field, Form } from "vee-validate";
import * as yup from "yup";

const money = {
        decimal: ',',
        thousands: '.',
        // prefix: 'Rp ',
        precision: 0,
        masked: false /* doesn't work with directive */
}

const columns = [
    {
      name: "id_pengajuan_header",
      required: true,
      label: "ID",
      align: "left",
      field: "id_pengajuan_header",
      sortable: true,
    },
    {
      name: "bu_header",
      required: true,
      label: "Business Unit",
      align: "left",
      field: "bu_name",
      sortable: true,
    },
    {
      name: "tanggal_berlaku_pengajuan",
      required: true,
      label: "Tanggal Pengajuan",
      align: "left",
      field: "tanggal_berlaku_pengajuan",
      sortable: true,
    },
    // {
    //   name: "tanggal_berlaku",
    //   required: true,
    //   label: "Tanggal Berlaku",
    //   align: "left",
    //   field: "tanggal_berlaku",
    //   sortable: true,
    // },
    {
      name: "region_header",
      required: true,
      label: "Region",
      align: "left",
      field: "region_name",
      sortable: true,
    },
    {
      name: "kategori_header",
      required: true,
      label: "Kategori (Darat/Laut)",
      align: "left",
      field: "kategori_header",
      sortable: true,
    },
    // {
    //   name: "nama_approve_harga",
    //   required: true,
    //   label: "Status",
    //   align: "left",
    //   field: "nama_approve_harga",
    //   sortable: true,
    // },    
    {
      name: "aksi",
      required: true,
      label: "Aksi",
      align: "left",
      field: "aksi",
    },
];
const $q = useQuasar();
const listDataHeader = ref([]);
const listDataDetail = ref([]);
const listBU = ref([]);
const listDaratLaut = ref(["Darat","Laut"]);
const listFixNonFix = ref(["Non Fixed","Fixed"]);
const listRegion = ref([]);
const listLokasiMuat = ref([]);
const listUser = ref([]);
const listKotaTujuan = ref([]);
const listJenisKendaraan = ref([]);
const tmpData = ref([]);

const right = ref(false);

const loading = ref(false);
const dialogForm = ref(false);
const dialogForm_EDIT = ref(false);
const dialogForm_VIEW = ref(false);
const maximizedToggle = ref(true);
const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10,
  filter: null,
  domain: domain(),
});
const GiveitDisable = ref(false);


const saveTmp = () => {
  if(tmpForm.region != null){        
    GiveitDisable.value = true;
  }
  let ceklokasimuat;
  let cekkotatujuan;
  let cekjeniskendaraan;
  let cekfixnonfix;
  let cekjumarah;
  let cekjumtujuan;

  let i = 0;
  let hasil = 0;
  tmpData.value.forEach(element => {
    if(tmpData.value[i].jumlahlokasimuat == tmpForm.jumlahlokasimuat &&
       tmpData.value[i].lokasimuat == tmpForm.lokasimuat &&
       tmpData.value[i].lokasimuat2 == tmpForm.lokasimuat2 &&
       tmpData.value[i].kotatujuan == tmpForm.kotatujuan &&
       tmpData.value[i].jeniskendaraan == tmpForm.jeniskendaraan &&
       tmpData.value[i].fixnonfix == tmpForm.fixnonfix &&
       tmpData.value[i].jumlaharah == tmpForm.jumlaharah &&
       tmpData.value[i].jumlahtujuan == tmpForm.jumlahtujuan
    ){
      alert('Data Detail Sudah ada');
      hasil = 1;
      return;
    }
    // ceklokasimuat     = tmpData.value[i].filter(value => value.lokasimuat == tmpForm.lokasimuat)
    // cekkotatujuan     = tmpData.value[i].filter(value => value.kotatujuan == tmpForm.kotatujuan)
    // cekjeniskendaraan = tmpData.value[i].filter(value => value.jeniskendaraan == tmpForm.jeniskendaraan)
    // cekfixnonfix      = tmpData.value[i].filter(value => value.fixnonfix == tmpForm.fixnonfix)
    // cekjumarah        = tmpData.value[i].filter(value => value.jumlaharah == tmpForm.jumlaharah)
    // cekjumtujuan      = tmpData.value[i].filter(value => value.jumlahtujuan == tmpForm.jumlahtujuan)

    // if(ceklokasimuat.length > 0 && 
    //   cekkotatujuan.length > 0 && 
    //   cekjeniskendaraan.length > 0 && 
    //   cekfixnonfix.length > 0 &&
    //   cekjumarah.length > 0 &&
    //   cekjumtujuan.length > 0
    //   ){

    //     console.log(ceklokasimuat.length);
    //     console.log(cekkotatujuan.length);
    //     console.log(cekjeniskendaraan.length);
    //     console.log(cekfixnonfix.length);
    //     console.log(cekjumarah.length);
    //     console.log(cekjumtujuan.length);
    //     alert('Data Detail Sudah ada');
    //     return;
    // }
    i++;
  });
  
  if(tmpForm.jumlahlokasimuat == 1){
    tmpForm.lokasimuat2 = tmpForm.lokasimuat;
  }
  
  if(hasil != 1){
    if (tmpForm.index == null) {  
      tmpData.value.push({
        id          : null,
        flag        : 0,
        jumlahlokasimuat: tmpForm.jumlahlokasimuat,
        lokasimuat  : tmpForm.lokasimuat,
        lokasimuat2  : tmpForm.lokasimuat2,
        kotatujuan  : tmpForm.kotatujuan,
        jeniskendaraan: tmpForm.jeniskendaraan,
        jumlaharah  : tmpForm.jumlaharah,
        jumlahtujuan: tmpForm.jumlahtujuan,
        fixnonfix   : tmpForm.fixnonfix,
        harga       : tmpForm.harga,
      })
    }
    else {
      tmpData.value[tmpForm.index].jumlahlokasimuat   = tmpForm.jumlahlokasimuat
      tmpData.value[tmpForm.index].lokasimuat   = tmpForm.lokasimuat
      tmpData.value[tmpForm.index].lokasimuat2  = tmpForm.lokasimuat2
      tmpData.value[tmpForm.index].kotatujuan   = tmpForm.kotatujuan
      tmpData.value[tmpForm.index].jeniskendaraan   = tmpForm.jeniskendaraan
      tmpData.value[tmpForm.index].jumlaharah   = tmpForm.jumlaharah
      tmpData.value[tmpForm.index].jumlahtujuan = tmpForm.jumlahtujuan
      tmpData.value[tmpForm.index].fixnonfix    = tmpForm.fixnonfix
      tmpData.value[tmpForm.index].harga        = tmpForm.harga
      tmpData.value[tmpForm.index].flag         = 2
    }
  }

  tmpForm.jumlahlokasimuat = null;
  tmpForm.lokasimuat    = null
  tmpForm.lokasimuat2   = null
  tmpForm.kotatujuan    = null
  tmpForm.jeniskendaraan= null
  tmpForm.jumlaharah    = 1
  tmpForm.jumlahtujuan  = 1
  tmpForm.fixnonfix     = 'Non Fixed'
  tmpForm.harga         = null
  tmpForm.index         = null

}

const deleteTmp = (data, index) => {
  if (data.id != null) {
    tmpData.value[index].flag = 1
  }
  else {
    tmpData.value.splice(index, 1)
  }

}

const editTmp = (data, index) => {

  tmpForm.lokasimuat    = data.lokasimuat
  tmpForm.lokasimuat2   = data.lokasimuat2
  tmpForm.kotatujuan    = data.kotatujuan
  tmpForm.jeniskendaraan = data.jeniskendaraan
  tmpForm.jumlaharah    = data.jumlaharah
  tmpForm.jumlahtujuan  = data.jumlahtujuan
  tmpForm.fixnonfix     = data.fixnonfix
  tmpForm.harga         = data.harga
  tmpForm.index         = index

}

const save = async () => {  
  
  if (tmpData.value.length == 0) {
    alert('data detail belum di isi')
    return;
  }
  tmpForm.detail = tmpData.value

  try {
    $q.loading.show();
    const res = await axios.post("savePengajuanHarga", tmpForm);
    dialogForm.value = false;
    reset();    

    $q.notify({
      type: "positive",
      message: res.data.message,
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
}

const saveedit = async () => {  
  
  if (tmpData.value.length == 0) {
    alert('data detail belum di isi')
    return;
  }
  tmpForm.detail = tmpData.value

  try {
    $q.loading.show();
    const res = await axios.post("saveEditPengajuanHarga", tmpForm);
    // dialogForm.value = false;
    dialogForm_EDIT.value = false;
    reset();    

    $q.notify({
      type: "positive",
      message: res.data.message,
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
}

const schema1 = yup.object({
    site: yup.string().required().label("Site")
                 .typeError("Site Tidak Boleh Kosong"),
    level: yup.string().required().label("Level")
                 .typeError("Level Tidak Boleh Kosong"),
    nik: yup.string().required().label("NIK")
                 .typeError("NIK Tidak Boleh Kosong"),
});

const tmpForm = reactive({    
  bussinessunit : null,
  region        : null,
  kategori      : null,
  tgl_berlaku   : null,
  jumlahlokasimuat: null,
  lokasimuat    : null,
  lokasimuat2   : null,
  jumlahlokasimuat: null,
  kotatujuan    : null,
  jeniskendaraan: null,
  jumlaharah    : ref('1'),
  jumlahtujuan  : ref('1'),
  fixnonfix     : ref('Non Fixed'),
  harga         : 0,

  DOUser: empid(),  
});

const getPengajuanHarga = async () => {
  try {
    loading.value = true;    
    console.log(pagination.value);
    const res = await axios.get("getPengajuanHarga", {
      params: pagination.value,      
    });        
    listBU.value = res.data.data1;       
    listDataHeader.value = res.data.data2;  
    listDataDetail.value = res.data.data3;  

    pagination.value.rowsNumber = res.data.total;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getKotaTujuan = async () => {
  try {
    $q.loading.show();
    const res = await axios.get("getLokasiTujuan", {
      params: {
        bussinessunit: tmpForm.bussinessunit,  
        region: tmpForm.region,
        lokasimuat: tmpForm.lokasimuat,            
      },
    });    
    listKotaTujuan.value      = res.data.data1;          
    $q.loading.hide();
  } catch (error) {
    $q.loading.hide();
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getKotaTujuanEdit = async () => {
  try {
    $q.loading.show();
    const res = await axios.get("getLokasiTujuanEdit", {
      params: {
        bussinessunit: tmpForm.bussinessunit,  
        region: tmpForm.region,
        lokasimuat: tmpForm.lokasimuat,  
        id:tmpForm.id,            
      },
    });    
    listKotaTujuan.value      = res.data.data1;          
    $q.loading.hide();
  } catch (error) {
    $q.loading.hide();
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const filterFunctionKotaTujuan = async (val, update) => {
    if (val === '') {
        update(() => {
          // getKotaTujuan();  
        })
    }
    // console.log(val);
    update(() => {
        // console.log(val);
        const neddle = val.toLowerCase();
        listKotaTujuan.value = listKotaTujuan.value.filter(option => {
            return option.kota_region.toLowerCase().includes(neddle)
            // console.log(option.sup_name);
        }) 
    })
}

const filterFunction = async (val, update) => {
    if (val != '') {        
        update(() => {
          // getLokasiMuat();  
        })
    }
    // console.log(val);
    update(() => {
        // console.log(val);
        const neddle = val.toLowerCase();
        listLokasiMuat.value = listLokasiMuat.value.filter(option => {
            return option.kodemstr.toLowerCase().includes(neddle)
            // console.log(option.sup_name);
        }) 
    })
}

const filterFunctionRegion = async (val, update) => {
    if (val === '') {
        update(() => {
          getLokasiMuat();  
        })
    }
    // console.log(val);
    update(() => {
        // console.log(val);
        const neddle = val.toLowerCase();
        listRegion.value = listRegion.value.filter(option => {
            return option.descmstr.toLowerCase().includes(neddle)
            // console.log(option.sup_name);
        }) 
    })
}

const getLokasiMuat = async () => {  
  try {
    $q.loading.show();
    const res = await axios.get("getLokasiMuat", {
      params: {
        bussinessunit: tmpForm.bussinessunit,        
        region: tmpForm.region,
      },
    });    
    listLokasiMuat.value      = res.data.data1;    
    // listJenisKendaraan.value  = res.data.data2;      
    listRegion.value          = res.data.data3;  
    $q.loading.hide();
  } catch (error) {
    $q.loading.hide();
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getJnsKendaraan = async () => {
  try {
    $q.loading.show();
    const res = await axios.get("getJnsKendaraan", {
      params: {
        bussinessunit: tmpForm.bussinessunit,  
        region: tmpForm.region,
        lokasimuat: tmpForm.lokasimuat, 
        kotatujuan: tmpForm.kotatujuan,       
      },
    });
    // console.log(res.data.data)    
    listJenisKendaraan.value  = res.data.data;           
    $q.loading.hide();
  } catch (error) {
    $q.loading.hide();
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const setLokasiMuat2 = async () => {
  try {
    // console.log('OK');
    if(tmpForm.jumlahlokasimuat == 1){
      tmpForm.lokasimuat2 = tmpForm.lokasimuat;
    }    
  } catch (error) {
    
  }
};

const addPengajuanHarga = async () => {  
  dialogForm.value = true;
  reset();
};

const editPengajuanHarga = async (value) => {  
  reset()  
  await getPengajuanHarga()
  tmpForm.id = value.id_pengajuan_header
  tmpForm.bussinessunit = value.bu_name
  tmpForm.tgl_berlaku   = value.tanggal_berlaku  
  tmpForm.region        = value.region_name
  tmpForm.kategori      = value.kategori_header
  tmpForm.buheader      = value.bu_header

  await getDetailPengajuan()
  dialogForm_EDIT.value = true
}

const viewPengajuanHarga = async (value) => {  
  reset()  
  await getPengajuanHarga()
  tmpForm.id = value.id_pengajuan_header
  tmpForm.bussinessunit = value.bu_name
  tmpForm.tgl_berlaku   = value.tanggal_berlaku_pengajuan  
  tmpForm.region        = value.region_name
  tmpForm.kategori      = value.kategori_header
  tmpForm.buheader      = value.bu_header

  await getDetailPengajuan()
  dialogForm_VIEW.value = true
}

const getLokasiMuatEDIT = async () => {
  try {
    $q.loading.show();
    const res = await axios.get("getLokasiMuatEDIT", {
      params: {
        bussinessunit: tmpForm.bussinessunit,        
      },
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


const getDetailPengajuan = async () => {    
  const res2 = await axios.get("getLokasiMuatEDIT", {    
    params: {
      bussinessunit: tmpForm.buheader,        
      region: tmpForm.region,
    },
  }); 

  listLokasiMuat.value      = res2.data.data1;    
  listJenisKendaraan.value  = res2.data.data2;   
  listRegion.value          = res2.data.data3; 
  listKotaTujuan.value      = res2.data.data4; 

  const res = await axios.get("getDetailPengajuan", {  
    params: {
      id: tmpForm.id
    }
  })  
  // console.log(res);
  res.data.forEach(element => {
    tmpData.value.push({
      id: element.id,
      flag: 3,
      lokasimuat: element.lokasi_muat,
      lokasimuat2: element.lokasi_muat2,
      kotatujuan: element.kota_detail,
      jeniskendaraan: element.jns_kendaraan_detail,
      jumlaharah: element.jml_arah_detail,
      jumlahtujuan: element.jml_tempat_detail,
      harga: element.harga_detail,      
      harga_deal: element.harga_deal_detail,  
      fixnonfix: element.fixed_detail,
      kodetujuan:element.kode_tujuan,
      tglberlakupengajuan:element.tanggal_berlaku,
    })
  });
}

const sendPengajuanHarga = async (value) => {      
    try {

    $q.loading.show();
    const res = await axios.post("sendPengajuanHarga", value);
    dialogForm.value = false;
    reset();    
    $q.loading.hide();
    
    $q.notify({
      type: "positive",
      message: res.data.message,
    });

    await onRequest({
      pagination: pagination.value,
    });
  } catch (error) {
    $q.loading.hide();
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  } 
}

const deletePengajuanHarga = async (value) => {
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
      await axios.post("deletePengajuanHarga", value);
      $q.notify({
        type: "positive",
        // message: `Menu <span class="tw-font-bold">${value.kota_region}</span> berhasil dihapus`,
        message: `Data berhasil dihapus`,
        html: true,
      });
      await getPengajuanHarga();
    } catch (error) {
      $q.notify({
        type: "negative",
        message: ParseError(error),
      });
    }
  });
};

const savePICApproval = async () => {
  try {
    const res = await axios.post("savePICApproval", tmpForm);
    dialogForm.value = false;
    reset();    

    $q.notify({
      type: "positive",
      message: res.data.message,
    });

    await onRequest({
      pagination: pagination.value,
    });
  } catch (error) {
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const saveEditPICApproval = async () => {
  try {
    
    const res = await axios.post("saveEditPICApproval", tmpForm);
    dialogForm_EDIT.value = false;
    reset();
    $q.notify({
      type: "positive",
      message: res.data.message,
    });

    await onRequest({
      pagination: pagination.value,
    });
  } catch (error) {
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const reset = () => {
  tmpForm.bussinessunit   = null;
  tmpForm.region          = null;
  tmpForm.kategori        = null;
  tmpForm.tgl_berlaku     = null;
  tmpForm.jumlahlokasimuat= null;
  tmpForm.lokasimuat      = null;
  tmpForm.lokasimuat2     = null;
  tmpForm.kotatujuan      = null;
  tmpForm.jeniskendaraan  = null;
  tmpForm.jumlaharah      = 1;
  tmpForm.jumlahtujuan    = 1;
  tmpForm.fixnonfix       = 'Non Fixed';
  tmpForm.harga           = null;
  tmpForm.DOUser          = empid();
  GiveitDisable.value     = false;

  tmpForm.id = null;  
  tmpForm.index = null;
  tmpData.value = [];
};

const onRequest = (props) => {
  const { page, rowsPerPage, sortBy, descending, filter } = props.pagination;
  pagination.value.filter = filter;
  pagination.value.page = page;
  pagination.value.rowsPerPage = rowsPerPage;
  pagination.value.sortBy = sortBy;
  pagination.value.descending = descending;
  pagination.value.empid = empid();
  getPengajuanHarga();
  // console.log(empid());
};

onMounted(() => {
  onRequest({
    pagination: pagination.value,
  });
});

const hideDate = () => {
  qDateProxy.value.hide()
}

document.addEventListener("etrasn_setdomain",() =>{     
  pagination.value.domain = domain();
  getPengajuanHarga();  
});

</script>