<template>
    <div class="q-pa-md">
        <q-card>
          <q-separator />
          <q-card-section style="max-height: 50vh" class="scroll">
            <div class="row q-col-gutter-sm">
                <div class="col-6">
                    <q-input v-model="tmpForm.nomororderfilter" dense outlined label="Nomor Order" />
                </div>
                <div class="col-6">
                    <q-select dense outlined v-model="tmpForm.sitefilter" use-input emit-value map-options input-debounce="0"
                        option-value="id" 
                        :option-label="option => `${option.name}`"
                        label="Pilih Site" :options="listSite">
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
                    <q-input label="Periode Awal" outlined dense v-model="tmpForm.periodeawalfilter">
                        <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="tmpForm.periodeawalfilter" mask="DD-MM-YYYY" @update:model-value="hideDate">
                            </q-date>
                            </q-popup-proxy>
                        </q-icon>
                        </template>
                    </q-input>
                </div>
                <div class="col-6">
                    <q-input label="Periode Akhir" outlined dense v-model="tmpForm.periodeakhirfilter">
                        <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="tmpForm.periodeakhirfilter" mask="DD-MM-YYYY" @update:model-value="hideDate">
                            </q-date>
                            </q-popup-proxy>
                        </q-icon>
                        </template>
                    </q-input>
                </div>
                <div class="col-4">
                    <q-select dense outlined v-model="tmpForm.typefilter" use-input emit-value map-options input-debounce="0"
                        option-value="value" option-label="desc" label="Pilih Type" :options="listType">
                        <template v-slot:no-option>
                        <q-item>
                            <q-item-section class="text-grey">
                            No results
                            </q-item-section>
                        </q-item>
                        </template>
                    </q-select>
                </div>
                <div class="col-4">
                    <q-select dense outlined v-model="tmpForm.statusfilter" use-input emit-value map-options input-debounce="0"
                        option-value="value" option-label="desc" label="Pilih Status" :options="listStatus">
                        <template v-slot:no-option>
                        <q-item>
                            <q-item-section class="text-grey">
                            No results
                            </q-item-section>
                        </q-item>
                        </template>
                    </q-select>
                </div>
                <div class="col-4">
                    <q-select dense outlined v-model="tmpForm.bisnisunitfilter" use-input emit-value map-options input-debounce="0"
                        option-value="bu_domain" option-label="bu_name" label="Pilih Bisnis Unit" :options="listBisnisUnit">
                        <template v-slot:no-option>
                        <q-item>
                            <q-item-section class="text-grey">
                            No results
                            </q-item-section>
                        </q-item>
                        </template>
                    </q-select>
                </div>
            </div>
          </q-card-section>
          <!-- <q-separator /> -->
          <q-card-actions align="center">
            <q-btn-group push>
                <q-btn push icon="search" color="blue" label="Filter" @click="getListOrderCatheringWithFilter_Vendor" />
                <q-btn push icon="close" color="red" label="Reset" @click="resetFilter" />
            </q-btn-group>
          </q-card-actions>
        </q-card>

        <q-card>
        <q-card-section>          
          <q-table title="List Order Cathering" :rows="listDataOrderCathering" :columns="columns" row-key="id" v-model:pagination="pagination"
            :loading="loading" :filter="pagination.filter" @request="onRequest" binary-state-sort>
            <q-btn-group push>
                <q-btn push color="primary" label="Tambah Data" @click="addBahanBaku" />
            </q-btn-group>
            <template v-slot:top-right>
              <q-input borderless dense debounce="300" v-model="pagination.filter" placeholder="Search">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>
            <template v-slot:body-cell-aksi="props">
              <q-td :props="props">
                <!-- {{ props.row.trh_flag }} -->
                <q-btn-group push>
                    <q-btn v-if="props.row.trh_flag_desc === 'Vendor Input Menu' || props.row.trh_flag_desc === 'Revisi List Menu'"  
                        dense color="blue" class="text-weight-regular text-caption" @click="editDataCathering(props.row)" push label="" icon="edit" />
                    <q-btn v-if="props.row.trh_flag_desc == 'Order Approve GA' || props.row.trh_flag_desc === 'Kirim Order'" dense color="blue" class="text-weight-regular text-caption" @click="prosesDataCathering(props.row)" push
                        label="" icon="airport_shuttle" />
                    <q-btn v-if="props.row.trh_flag_desc != 'Close'" dense color="green" class="text-weight-regular text-caption" @click="viewDataCathering(props.row)" push
                        label="" icon="visibility" />
                    <q-btn v-if="props.row.trh_flag_desc == 'Close'" dense color="green" class="text-weight-regular text-caption" @click="prosesDataCathering(props.row)" push
                        label="" icon="download_done" />
                    
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
            <q-card-section class="scroll">                    
                <q-card>
                <q-card-section>
                    <div class="tw-text-lg tw-font-semibold">
                    Order Cathering
                    </div>
                </q-card-section>

                <q-stepper v-model="step" ref="stepper" color="primary" animated>
                    <q-step :name="1" title="View Order Cathering" icon="visibility" :done="step > 1">
                    <Form                    
                        @submit="onSubmit1"
                        class="q-mt-md"
                    >
                    <div class="row q-col-gutter-sm tw-px-3 tw-pb-3">
                            <div class="col-12" hidden>
                                <q-input v-model="tmpForm.id" hidden dense outlined label="ID" />
                            </div>
                            <div class="col-12">
                                <q-select dense outlined v-model="tmpForm.vendor" use-input emit-value map-options input-debounce="0"
                                    option-value="vendor_code" 
                                    :option-label="option => `${option.vendor_name}`"
                                    label="Pilih Vendor" :options="listVendor"
                                    @filter="filterFunction" readonly="">
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
                                <q-input label="Periode Mulai" outlined dense v-model="tmpForm.periodeawal" readonly="">
                                    <template v-slot:append>
                                    <q-icon name="event" class="cursor-pointer">
                                        <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                                        <q-date v-model="tmpForm.periodeawal" mask="DD-MM-YYYY" @update:model-value="hideDate">
                                        </q-date>
                                        </q-popup-proxy>
                                    </q-icon>
                                    </template>
                                </q-input>
                            </div>
                            <div class="col-6">
                                <q-input label="Periode Akhir" outlined dense v-model="tmpForm.periodeakhir" readonly="">
                                    <template v-slot:append>
                                    <q-icon name="event" class="cursor-pointer">
                                        <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                                        <q-date v-model="tmpForm.periodeakhir" mask="DD-MM-YYYY" @update:model-value="hideDate">
                                        </q-date>
                                        </q-popup-proxy>
                                    </q-icon>
                                    </template>
                                </q-input>
                            </div>

                            <div class="col-6">
                                <q-select dense outlined v-model="tmpForm.site" use-input emit-value map-options input-debounce="0"
                                    option-value="id" 
                                    :option-label="option => `${option.name}`"
                                    label="Pilih Site" :options="listSite" readonly="">
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
                                <q-select dense outlined v-model="tmpForm.mingguke" use-input emit-value map-options input-debounce="0"
                                    option-value="value" option-label="desc" label="Minggu Ke-" :options="listMinggu" readonly="">
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
                                <q-select dense outlined v-model="tmpForm.type" use-input emit-value map-options input-debounce="0"
                                    option-value="value" option-label="desc" label="Pilih Type" :options="listType" readonly="">
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
                                <q-select dense outlined v-model="tmpForm.kedatangan" use-input emit-value map-options input-debounce="0"
                                    option-value="arrive_id" 
                                    :option-label="option => `${option.arrive_title}`"
                                    label="Pilih Kedatangan" :options="listKedatangan" readonly="">
                                    <template v-slot:no-option>
                                    <q-item>
                                        <q-item-section class="text-grey">
                                        No results
                                        </q-item-section>
                                    </q-item>
                                    </template>
                                </q-select>
                            </div>                 


                            <div class="col-12">
                                <q-input type="textarea" autogrow dense outlined label="Catatan" v-model="tmpForm.catatan" readonly=""/>
                            </div>

                            <div class="col-12">
                                <div style="overflow-x:auto;">
                                    <!-- {{ listTanggal }} -->
                                    <table class="styled-table" style="overflow-x:auto;">
                                        <thead>
                                            <tr>
                                                <th>Tanggal</th>
                                                <th>Shift 1</th>
                                                <th>Shift 2</th>
                                                <th>Shift 3</th>
                                            </tr>                 
                                        </thead>
                                        <tbody>
                                            <!-- {{ tmpDetail }} -->
                                            <tr v-for="(data, i) in tmpDetail" :key="i">
                                                <td>{{ dayjs(data.tanggal).format('DD-MM-YYYY') }}</td>
                                                <td>
                                                    <q-input type="number" readonly=""  v-model="data.shift1" dense outlined />
                                                </td>
                                                <td>
                                                    <q-input type="number" readonly="" v-model="data.shift2" dense outlined />
                                                </td>
                                                <td>
                                                    <q-input type="number" readonly="" v-model="data.shift3" dense outlined />
                                                </td>                                              
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 tw-pt-5" align="center">
                            <q-btn icon="arrow_right_alt" color="green" label="Next" type="submit" />  
                        </div>
                    </Form>
                    </q-step>

                    <q-step :name="2" title="Input Daftar Menu Makanan" icon="fact_check" :done="step > 4">
                    <Form                    
                        @submit="onSubmit2"
                        class="q-mt-md"
                    >
                        <div class="row q-col-gutter-sm tw-px-3 tw-pb-3">
                            <div class="col-12">
                                <div style="overflow-x:auto;">
                                    <!-- {{ listTanggal }} -->
                                    <table class="styled-table" style="overflow-x:auto;">
                                        <thead>
                                            <tr>
                                                <th>Tanggal</th>
                                                <th>Nasi</th>
                                                <th>Lauk</th>
                                                <th>Sayur</th>
                                                <th>Buah</th>
                                                <th>Sambal</th>
                                                <th>Kerupuk</th>
                                                <th>Pendamping</th>
                                                <th>Lain-lain</th>
                                            </tr>                 
                                        </thead>
                                        <tbody>
                                            <tr v-for="(data, i) in tmpDetailMakanan" :key="i">
                                                <td>{{ dayjs(data.tanggal).format('DD-MM-YYYY') }}</td>
                                                <td>
                                                    <q-input type="text" v-model="data.nasi" dense outlined />
                                                </td>
                                                <td>
                                                    <q-input type="text" v-model="data.lauk" dense outlined />
                                                </td>
                                                <td>
                                                    <q-input type="text" v-model="data.sayur" dense outlined />
                                                </td>                                              
                                                <td>
                                                    <q-input type="text" v-model="data.buah" dense outlined />
                                                </td>   
                                                <td>
                                                    <q-input type="text" v-model="data.sambal" dense outlined />
                                                </td>   
                                                <td>
                                                    <q-input type="text" v-model="data.kerupuk" dense outlined />
                                                </td>   
                                                <td>
                                                    <q-input type="text" v-model="data.pendamping" dense outlined />
                                                </td>   
                                                <td>
                                                    <q-input type="text" v-model="data.lainlain" dense outlined />
                                                </td>   
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        <div class="col-12 tw-pt-5" align="center">
                            <q-btn-group push >
                                <q-btn icon="close"  color="orange" label="Back" @click="$refs.stepper.previous()" />
                                <q-btn icon="save" color="blue" label="Simpan" type="submit"/>
                                <q-btn icon="outgoing_mail" color="purple" label="Send Daftar Menu" @click="sendDataCathering_Vendor" />
                            </q-btn-group>
                        </div>                        
                        </div>
                    </Form>
                    </q-step>
            
                </q-stepper>
                <q-separator />
                <q-card-section> </q-card-section>
                </q-card>          
            </q-card-section>
            <q-separator />
            <q-card-actions align="right">
            <q-btn flat label="Batal" color="primary" v-close-popup />
            </q-card-actions>
        </q-card>
        </q-dialog>

        <q-dialog v-model="dialogFormView" persistent
        :maximized="maximizedToggle"
        transition-show="slide-up"
        transition-hide="slide-down">    
        <q-card>
            <q-card-section class="scroll">                    
                <q-card>
                <q-card-section>
                    <div class="tw-text-lg tw-font-semibold">
                    Order Cathering
                    </div>
                </q-card-section>

                <q-stepper v-model="step" ref="stepper" color="primary" animated>
                    <q-step :name="1" title="View Order Cathering" icon="visibility" :done="step > 1">
                    <Form                    
                        @submit="onSubmit1"
                        class="q-mt-md"
                    >
                    <div class="row q-col-gutter-sm tw-px-3 tw-pb-3">
                            <div class="col-12" hidden>
                                <q-input v-model="tmpForm.id" hidden dense outlined label="ID" />
                            </div>
                            <div class="col-12">
                                <q-select dense outlined v-model="tmpForm.vendor" use-input emit-value map-options input-debounce="0"
                                    option-value="vendor_code" 
                                    :option-label="option => `${option.vendor_name}`"
                                    label="Pilih Vendor" :options="listVendor"
                                    @filter="filterFunction" readonly="">
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
                                <q-input label="Periode Mulai" outlined dense v-model="tmpForm.periodeawal" readonly="">
                                    <template v-slot:append>
                                        <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                                        <q-date v-model="tmpForm.periodeawal" mask="DD-MM-YYYY" @update:model-value="hideDate">
                                        </q-date>
                                        </q-popup-proxy>
                                    </template>
                                </q-input>
                            </div>
                            <div class="col-6">
                                <q-input label="Periode Akhir" outlined dense v-model="tmpForm.periodeakhir" readonly="">
                                    <template v-slot:append>
                                        <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                                        <q-date v-model="tmpForm.periodeakhir" mask="DD-MM-YYYY" @update:model-value="hideDate">
                                        </q-date>
                                        </q-popup-proxy>
                                    </template>
                                </q-input>
                            </div>

                            <div class="col-6">
                                <q-select dense outlined v-model="tmpForm.site" use-input emit-value map-options input-debounce="0"
                                    option-value="id" 
                                    :option-label="option => `${option.name}`"
                                    label="Pilih Site" :options="listSite" readonly="">
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
                                <q-select dense outlined v-model="tmpForm.mingguke" use-input emit-value map-options input-debounce="0"
                                    option-value="value" option-label="desc" label="Minggu Ke-" :options="listMinggu" readonly="">
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
                                <q-select dense outlined v-model="tmpForm.type" use-input emit-value map-options input-debounce="0"
                                    option-value="value" option-label="desc" label="Pilih Type" :options="listType" readonly="">
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
                                <q-select dense outlined v-model="tmpForm.kedatangan" use-input emit-value map-options input-debounce="0"
                                    option-value="arrive_id" 
                                    :option-label="option => `${option.arrive_title}`"
                                    label="Pilih Kedatangan" :options="listKedatangan" readonly="">
                                    <template v-slot:no-option>
                                    <q-item>
                                        <q-item-section class="text-grey">
                                        No results
                                        </q-item-section>
                                    </q-item>
                                    </template>
                                </q-select>
                            </div>                 


                            <div class="col-12">
                                <q-input type="textarea" autogrow dense outlined label="Catatan" v-model="tmpForm.catatan" readonly=""/>
                            </div>

                            <div class="col-12">
                                <div style="overflow-x:auto;">
                                    <!-- {{ listTanggal }} -->
                                    <table class="styled-table" style="overflow-x:auto;">
                                        <thead>
                                            <tr>
                                                <th>Tanggal</th>
                                                <th>Shift 1</th>
                                                <th>Shift 2</th>
                                                <th>Shift 3</th>
                                            </tr>                 
                                        </thead>
                                        <tbody>
                                            <!-- {{ tmpDetail }} -->
                                            <tr v-for="(data, i) in tmpDetail" :key="i">
                                                <td>{{ dayjs(data.tanggal).format('DD-MM-YYYY') }}</td>
                                                <td>
                                                    <q-input type="number" readonly=""  v-model="data.shift1" dense outlined />
                                                </td>
                                                <td>
                                                    <q-input type="number" readonly="" v-model="data.shift2" dense outlined />
                                                </td>
                                                <td>
                                                    <q-input type="number" readonly="" v-model="data.shift3" dense outlined />
                                                </td>                                              
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 tw-pt-5" align="center">
                            <q-btn icon="arrow_right_alt" color="green" label="Next" type="submit" />  
                        </div>
                    </Form>
                    </q-step>

                    <q-step :name="2" title="Input Daftar Menu Makanan" icon="fact_check" :done="step > 4">
                    <Form                    
                        @submit="onSubmit2"
                        class="q-mt-md"
                    >
                        <div class="row q-col-gutter-sm tw-px-3 tw-pb-3">
                            <div class="col-12">
                                <div style="overflow-x:auto;">
                                    <!-- {{ listTanggal }} -->
                                    <table class="styled-table" style="overflow-x:auto;">
                                        <thead>
                                            <tr>
                                                <th>Tanggal</th>
                                                <th>Nasi</th>
                                                <th>Lauk</th>
                                                <th>Sayur</th>
                                                <th>Buah</th>
                                                <th>Sambal</th>
                                                <th>Kerupuk</th>
                                                <th>Pendamping</th>
                                                <th>Lain-lain</th>
                                            </tr>                 
                                        </thead>
                                        <tbody>
                                            <tr v-for="(data, i) in tmpDetailMakanan" :key="i">
                                                <td>{{ dayjs(data.tanggal).format('DD-MM-YYYY') }}</td>
                                                <td>
                                                    <q-input type="text" v-model="data.nasi" dense outlined readonly=""/>
                                                </td>
                                                <td>
                                                    <q-input type="text" v-model="data.lauk" dense outlined readonly="" />
                                                </td>
                                                <td>
                                                    <q-input type="text" v-model="data.sayur" dense outlined readonly="" />
                                                </td>                                              
                                                <td>
                                                    <q-input type="text" v-model="data.buah" dense outlined readonly="" />
                                                </td>   
                                                <td>
                                                    <q-input type="text" v-model="data.sambal" dense outlined readonly=""/>
                                                </td>   
                                                <td>
                                                    <q-input type="text" v-model="data.kerupuk" dense outlined readonly="" />
                                                </td>   
                                                <td>
                                                    <q-input type="text" v-model="data.pendamping" dense outlined readonly="" />
                                                </td>   
                                                <td>
                                                    <q-input type="text" v-model="data.lainlain" dense outlined readonly="" />
                                                </td>   
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        <div class="col-12 tw-pt-5" align="center">
                            <q-btn-group push >
                                <q-btn icon="arrow_left" color="orange" label="Back" @click="$refs.stepper.previous()" />
                                <!-- <q-btn icon="save" color="blue" label="Simpan" type="submit"/> -->
                                <!-- <q-btn icon="outgoing_mail" color="purple" label="Send Daftar Menu" @click="sendDataCathering_Vendor" /> -->
                            </q-btn-group>
                        </div>                        
                        </div>
                    </Form>
                    </q-step>
            
                </q-stepper>
                <q-separator />
                <q-card-section> </q-card-section>
                </q-card>          
            </q-card-section>
            <q-separator />
            <q-card-actions align="right">
            <q-btn flat label="Batal" color="primary" v-close-popup />
            </q-card-actions>
        </q-card>
        </q-dialog>

        <q-dialog v-model="dialogFormProses" persistent
        :maximized="maximizedToggle"
        transition-show="slide-up"
        transition-hide="slide-down">    
        <q-card>
            <q-card-section class="scroll">                    
                <q-card>
                <q-card-section>
                    <div class="tw-text-lg tw-font-semibold">
                    Order Cathering
                    </div>
                </q-card-section>

                <q-stepper v-model="step" ref="stepper" color="primary" animated>
                    <q-step :name="1" title="View Order Cathering" icon="visibility" :done="step > 1">
                    <Form                    
                        @submit="onSubmit1"
                        class="q-mt-md"
                    >
                    <div class="row q-col-gutter-sm tw-px-3 tw-pb-3">
                            <div class="col-12" hidden>
                                <q-input v-model="tmpForm.id" hidden dense outlined label="ID" />
                            </div>
                            <div class="col-12">
                                <q-select dense outlined v-model="tmpForm.vendor" use-input emit-value map-options input-debounce="0"
                                    option-value="vendor_code" 
                                    :option-label="option => `${option.vendor_name}`"
                                    label="Pilih Vendor" :options="listVendor"
                                    @filter="filterFunction" readonly="">
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
                                <q-input label="Periode Mulai" outlined dense v-model="tmpForm.periodeawal" readonly="">
                                    <template v-slot:append>
                                        <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                                        <q-date v-model="tmpForm.periodeawal" mask="DD-MM-YYYY" @update:model-value="hideDate">
                                        </q-date>
                                        </q-popup-proxy>
                                    </template>
                                </q-input>
                            </div>
                            <div class="col-6">
                                <q-input label="Periode Akhir" outlined dense v-model="tmpForm.periodeakhir" readonly="">
                                    <template v-slot:append>
                                        <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                                        <q-date v-model="tmpForm.periodeakhir" mask="DD-MM-YYYY" @update:model-value="hideDate">
                                        </q-date>
                                        </q-popup-proxy>
                                    </template>
                                </q-input>
                            </div>

                            <div class="col-6">
                                <q-select dense outlined v-model="tmpForm.site" use-input emit-value map-options input-debounce="0"
                                    option-value="id" 
                                    :option-label="option => `${option.name}`"
                                    label="Pilih Site" :options="listSite" readonly="">
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
                                <q-select dense outlined v-model="tmpForm.mingguke" use-input emit-value map-options input-debounce="0"
                                    option-value="value" option-label="desc" label="Minggu Ke-" :options="listMinggu" readonly="">
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
                                <q-select dense outlined v-model="tmpForm.type" use-input emit-value map-options input-debounce="0"
                                    option-value="value" option-label="desc" label="Pilih Type" :options="listType" readonly="">
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
                                <q-select dense outlined v-model="tmpForm.kedatangan" use-input emit-value map-options input-debounce="0"
                                    option-value="arrive_id" 
                                    :option-label="option => `${option.arrive_title}`"
                                    label="Pilih Kedatangan" :options="listKedatangan" readonly="">
                                    <template v-slot:no-option>
                                    <q-item>
                                        <q-item-section class="text-grey">
                                        No results
                                        </q-item-section>
                                    </q-item>
                                    </template>
                                </q-select>
                            </div>                 


                            <div class="col-12">
                                <q-input type="textarea" autogrow dense outlined label="Catatan" v-model="tmpForm.catatan" readonly=""/>
                            </div>

                            <div class="col-12">
                                <div style="overflow-x:auto;">
                                    <!-- {{ listTanggal }} -->
                                    <table class="styled-table" style="overflow-x:auto;">
                                        <thead>
                                            <tr>
                                                <th>Tanggal</th>
                                                <th>Shift 1</th>
                                                <th>Shift 2</th>
                                                <th>Shift 3</th>
                                            </tr>                 
                                        </thead>
                                        <tbody>
                                            <!-- {{ tmpDetail }} -->
                                            <tr v-for="(data, i) in tmpDetail" :key="i">
                                                <td>{{ dayjs(data.tanggal).format('DD-MM-YYYY') }}</td>
                                                <td>
                                                    <q-input type="number" readonly=""  v-model="data.shift1" dense outlined />
                                                </td>
                                                <td>
                                                    <q-input type="number" readonly="" v-model="data.shift2" dense outlined />
                                                </td>
                                                <td>
                                                    <q-input type="number" readonly="" v-model="data.shift3" dense outlined />
                                                </td>                                              
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 tw-pt-5" align="center">
                            <q-btn icon="arrow_right_alt" color="green" label="Next" type="submit" />  
                        </div>
                    </Form>
                    </q-step>

                    <q-step :name="2" title="View Daftar Menu Makanan" icon="visibility" :done="step > 4">
                    <Form                    
                        @submit="onSubmit2"
                        class="q-mt-md"
                    >
                        <div class="row q-col-gutter-sm tw-px-3 tw-pb-3">
                            <div class="col-12">
                                <div style="overflow-x:auto;">
                                    <!-- {{ listTanggal }} -->
                                    <table class="styled-table" style="overflow-x:auto;">
                                        <thead>
                                            <tr>    
                                                <th>#</th>
                                                <th>Tanggal</th>
                                                <th>Nasi</th>
                                                <th>Lauk</th>
                                                <th>Sayur</th>
                                                <th>Buah</th>
                                                <th>Sambal</th>
                                                <th>Kerupuk</th>
                                                <th>Pendampin</th>
                                                <th>Lain-lain</th>
                                            </tr>              
                                        </thead>
                                        <tbody>
                                            
                                            <tr v-for="(data, i) in tmpDetailMakananSlide2" :key="i">
                                                <td>
                                                    <!-- {{ data }} -->
                                                    <!-- {{ data.tanggal }} -->
                                                    <template v-if="data.flagdelivery ==  10">
                                                        <q-btn dense color="green" label="Approve GA"  class="text-weight-regular text-caption" @click="viewDetailDataCathering(i)" push icon="check_circle" />
                                                    </template>
                                                    <template v-if="data.flagdelivery ==  5">
                                                        <q-btn dense color="cyan" label="Sebagian Terkirim"  class="text-weight-regular text-caption" @click="prosesDetailDataCathering_Vendor(i)" push icon="check_circle" />
                                                    </template>
                                                    <template v-if="data.flagdelivery ==  1 && data.tanggal != dateOnly()">
                                                        <q-btn dense color="cyan" label="Sudah Kirim"  class="text-weight-regular text-caption" @click="viewDetailDataCathering(i)" push icon="check_circle" />
                                                    </template>      
                                                    <template v-if="data.flagdelivery ==  0 && data.tanggal < dateOnly()" >
                                                        <q-btn dense color="red" label="Tidak Kirim"  class="text-weight-regular text-caption" @click="viewDetailDataCathering(i)" push icon="close" />
                                                    </template>   
                                                    <template v-if="data.flagdelivery ==  0 && data.tanggal === dateOnly()" >
                                                        <q-btn dense color="purple" label="Kirim Cathering"  class="text-weight-regular text-caption" @click="prosesDetailDataCathering_Vendor(i)" push icon="airport_shuttle" />
                                                    </template>    
                                                    <template v-if="data.flagdelivery ==  1 && data.tanggal === dateOnly()">
                                                        <q-btn dense color="purple" label="Kirim Cathering"  class="text-weight-regular text-caption" @click="prosesDetailDataCathering_Vendor(i)" push icon="airport_shuttle" />
                                                    </template>                                                    
                                                </td>
                                                <td>
                                                    {{ dayjs(data.tanggal).format('DD-MM-YYYY') }}
                                                </td>
                                                <td>
                                                    <q-input type="text" v-model="data.nasi" dense outlined readonly=""/>
                                                </td>
                                                <td>
                                                    <q-input type="text" v-model="data.lauk" dense outlined readonly="" />
                                                </td>
                                                <td>
                                                    <q-input type="text" v-model="data.sayur" dense outlined readonly="" />
                                                </td>                                              
                                                <td>
                                                    <q-input type="text" v-model="data.buah" dense outlined readonly="" />
                                                </td>   
                                                <td>
                                                    <q-input type="text" v-model="data.sambal" dense outlined readonly=""/>
                                                </td>   
                                                <td>
                                                    <q-input type="text" v-model="data.kerupuk" dense outlined readonly="" />
                                                </td>   
                                                <td>
                                                    <q-input type="text" v-model="data.pendamping" dense outlined readonly="" />
                                                </td>   
                                                <td>
                                                    <q-input type="text" v-model="data.lainlain" dense outlined readonly="" />
                                                </td>   
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        <div class="col-12 tw-pt-5" align="center">
                            <q-btn-group push >
                                <q-btn icon="arrow_left" color="orange" label="Back" @click="$refs.stepper.previous()" />
                                <!-- <q-btn icon="save" color="blue" label="Simpan" type="submit"/> -->
                                <!-- <q-btn icon="outgoing_mail" color="purple" label="Send Daftar Menu" @click="sendDataCathering_Vendor" /> -->
                            </q-btn-group>
                        </div>                        
                        </div>
                    </Form>
                    </q-step>
            
                </q-stepper>
                <q-separator />
                <q-card-section> </q-card-section>
                </q-card>          
            </q-card-section>
            <q-separator />
            <q-card-actions align="right">
            <q-btn flat label="Batal" color="primary" v-close-popup />
            </q-card-actions>
        </q-card>
        </q-dialog>

        <q-dialog v-model="dialogFormProsesDetail" persistent>    
        <q-card>
            <q-card-section class="scroll">                    
                <q-card-section>
                    <div class="tw-text-lg tw-font-semibold">
                    Order Cathering
                    </div>
                </q-card-section>

                    <template v-for="(data, i) in tmpProsesDetail" :key="i">
                        <Form class="q-mt-md">
                            <div>
                                <div class="row q-col-gutter-sm tw-px-12 tw-pb-6">

                                    <div class="md-6">
                                        <q-input v-model="data.shift" dense outlined label="Shift" readonly/>
                                    </div>
                                    <!-- {{ data }} -->
                                    <template v-if="data.flag != 1 && data.flag != 3 && data.flag != 4">
                                        <div class="md-6">
                                            <q-input v-model="data.pickirim" dense outlined label="PIC Kirim" />
                                        </div> 
                                        <div class="md-6">
                                            <q-input v-model="data.qtyorder" dense outlined label="Qty Order" readonly/>
                                        </div>
                                        <div class="md-6">
                                            <q-input v-model="data.qtykirim" dense outlined label="Qty Kirim" />
                                        </div>
                                        <div class="col-12">
                                            <q-file outlined required dense bottom-slots v-model="data.uploadsj" label="Upload Surat Jalan" counter>
                                            <template v-slot:prepend>
                                                <q-icon name="cloud_upload" @click.stop />
                                            </template>
                                            <template v-slot:append>
                                                <q-icon name="close" @click.stop="model = null" class="cursor-pointer" />
                                            </template>
                                            </q-file>
                                        </div>
                                    </template>    
                                    <template v-if="data.flag == 1 || data.flag == 3 || data.flag == 4" >
                                        <div class="md-6">
                                            <q-input v-model="data.pickirim" dense outlined label="PIC Kirim" readonly/>
                                        </div> 
                                        <div class="md-6">
                                            <q-input v-model="data.qtyorder" dense outlined label="Qty Order" readonly/>
                                        </div>
                                        <div class="md-6">
                                            <q-input v-model="data.qtykirim" dense outlined label="Qty Kirim" readonly/>
                                        </div>
                                        <div class="md-12">
                                            <q-input v-model="data.uploadsj" dense outlined label="Upload Surat Jalan" readonly/>
                                        </div>

                                        <div class="md-12">
                                            <q-btn icon="done" color="green" label="Sudah Kirim" disabled/>
                                        </div>
                                        
                                    </template>                                   
                                    <template v-if="data.flag === 0" >
                                        <div class="col-12">
                                            <q-btn icon="arrow_right_alt" color="blue" label="Kirim" type="submit"
                                            @click="prosesKirimDetailDataCathering_Vendor(data)"
                                            />
                                        </div>                                        
                                    </template>                           
                                </div>                                
                            </div>
                            <q-separator />
                        </Form>
                    </template> 
                <q-card-section> </q-card-section>
            </q-card-section>
            <q-separator />
            <q-card-actions align="right">
            <q-btn flat label="Batal" color="primary" v-close-popup />
            </q-card-actions>
        </q-card>
        </q-dialog>

        <q-dialog v-model="dialogFormViewProsesDetail" persistent>    
        <q-card>
            <q-card-section class="scroll">                    
                <q-card-section>
                    <div class="tw-text-lg tw-font-semibold">
                    Order Cathering
                    </div>
                </q-card-section>

                    <template v-for="(data, i) in tmpProsesDetail" :key="i">
                        <Form class="q-mt-md">
                            <div>
                                <div class="row q-col-gutter-sm tw-px-12 tw-pb-12">

                                    <div class="md-6">
                                        <q-input v-model="data.shift" dense outlined label="Shift" readonly/>
                                    </div>
                                    <div class="md-6">
                                        <q-input v-model="data.pickirim" dense outlined label="PIC Kirim" readonly/>
                                    </div> 
                                    <div class="md-6">
                                        <q-input v-model="data.qtyorder" dense outlined label="Qty Order" readonly/>
                                    </div>
                                    <div class="md-6">
                                        <q-input v-model="data.qtykirim" dense outlined label="Qty Kirim" readonly/>
                                    </div>
                                    <div class="col-12 md-12">
                                        <q-input v-model="data.uploadsj" dense outlined label="Upload Surat Jalan" readonly/>
                                    </div>                                                                                           
                                </div>                                
                            </div>
                            <template v-if="data.shift != 'Shift 3'" >
                                <q-separator />
                            </template>                            
                        </Form>
                    </template> 
                <q-card-section> </q-card-section>
            </q-card-section>
            <q-separator />
            <q-card-actions align="right">
            <q-btn flat label="Batal" color="primary" v-close-popup />
            </q-card-actions>
        </q-card>
        </q-dialog>

    </div>
  </template>
  
  <script setup>
    import { ref, onMounted, reactive } from "vue";
    import axios from "axios";
    import { ParseError, excelDownload, domain, role, empid, dateOnlyDMY, dateOnly } from "./../../utils";
    import { useQuasar } from "quasar";
    import * as XLSX from "xlsx";
    import dayjs from "dayjs";
    const qDateProxy = ref(null);
    const step = ref(1);
    const maximizedToggle = ref(true);


    const listStatus = ref([
        { value: "Order Pending", desc: "Order Pending" },
        { value: "Vendor Input Menu", desc: "Vendor Input Menu" },
        { value: "Checklist Menu", desc: "Checklist Menu" },
        { value: "Revisi List Menu", desc: "Revisi List Menu" },
        { value: "Order Approve GA", desc: "Order Approve GA" },
        { value: "Proses Makan", desc: "Proses Makan" },
        { value: "Close", desc: "Close" },
        { value: "Batal Order", desc: "Batal Order" },
    ]);

    const listType = ref([
        { value: "Normal", desc: "Normal" },
        { value: "Event", desc: "Event" },
        { value: "Lainnya", desc: "Lainnya" },
    ]);

    const listMinggu = ref([
        { value: "1", desc: "1" },
        { value: "2", desc: "2" },
        { value: "3", desc: "3" },
        { value: "4", desc: "4" },
    ]);

    const columns = [
        {
            name: "aksi",
            required: true,
            label: "Aksi",
            align: "center",
            field: "aksi",
        },
        {
            name: "trh_order_code",
            required: true,
            label: "Nomor Order",
            align: "left",
            field: "trh_order_code",
            sortable: true,
        },
        {
            name: "trh_vendor_name",
            required: true,
            label: "Vendor",
            align: "left",
            field: "trh_vendor_name",
            sortable: true,
        },
        {
            name: "trh_site_name",
            required: true,
            label: "Site",
            align: "left",
            field: "trh_site_name",
            sortable: true,
        },
        {
            name: "trh_start",
            required: true,
            label: "Periode Awal",
            align: "left",
            format: val=> dayjs(`${val}`).format("DD-MM-YYYY"),
            field: "trh_start",
            sortable: true,
        },
        {
            name: "trh_end",
            required: true,
            label: "Periode Akhir",
            align: "left",
            format: val=> dayjs(`${val}`).format("DD-MM-YYYY"),
            field: "trh_end",
            sortable: true,
        },
        {
            name: "trh_week",
            required: true,
            label: "Minggu Ke-",
            align: "left",
            
            field: "trh_week",
            sortable: true,
        },
        {
            name: "trh_type",
            required: true,
            label: "Type",
            align: "left",
            field: "trh_type",
            sortable: true,
        },
        {
            name: "trh_flag_desc",
            required: true,
            label: "Status",
            align: "left",
            field: "trh_flag_desc",
            sortable: true,
        },        
    ];
  
    const listDataOrderCathering = ref([]);
    const $q = useQuasar();
    const listDataVendor = ref([]);
    const listVendor = ref([]);
    const listBisnisUnit = ref([]);
    const listSite = ref([]);
    const listKedatangan = ref([]);
    const listTanggal       = ref([]);

    
    const loading = ref(false);
    const dialogForm = ref(false);
    const dialogFormEdit = ref(false);
    const dialogFormView = ref(false);
    const dialogFormProses = ref(false);
    const dialogFormProsesDetail = ref(false);
    const dialogFormViewProsesDetail = ref(false);

    const pagination = ref({
        sortBy: "trh_order_code",
        descending: true,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10,
        filter: null,
        domain: domain(),
        empid: empid(),
    });
    const tmpForm = reactive({
        id: null,
        bisnisunit: null,
        vendor: null,

        periodeawal: dateOnlyDMY(),
        periodeakhir: dateOnlyDMY(),
        site: null,
        mingguke: null,
        type: null,
        kedatangan: null,
        catatan: null,

        nomororderfilter: null,
        sitefilter: null,
        typefilter: null,
        statusfilter: null,
        bisnisunitfilter: null,
        periodeawalfilter: dateOnlyDMY(),
        periodeakhirfilter: dateOnlyDMY(),

        domain: domain(),
        empid: empid(),
    });
  
    const getListOrderCathering = async () => {
        try {
            loading.value = true;
            const res = await axios.get(`${import.meta.env.VITE_API_OC}getListOrderCathering_Vendor`, {
                params: pagination.value,
            });

            // console.log(res.data.data.data);
            listDataOrderCathering.value = res.data.data.data;
            listSite.value          = res.data.dataSite;
            listVendor.value        = res.data.dataVendor;
            listKedatangan.value    = res.data.dataKedatangan;
            listBisnisUnit.value    = res.data.dataBU;
            pagination.value.rowsNumber = res.data.data.pagination.total;
            loading.value = false;
        } catch (error) {
            loading.value = false;
        }
    };

    const totalWaktu = null;
    const waktu1 = ref(0);
    const waktu2 = ref(0);
    const waktu3 = ref(0);
    const tmpDetail = ref([]);
    const tmpDetailMakanan = ref([]);
    const tmpDetailMakananSlide2 = ref([]);
    const tmpProsesDetail = ref([]);
    const onSubmit1 = async (values, actions) => {
        event.preventDefault();
        try {
            if(tmpForm.vendor == null){
                $q.notify({
                    type: "negative",
                    message: 'Vendor Belum Dipilih',
                });
                return;
            }

            if(tmpForm.periodeawal == null){
                $q.notify({
                    type: "negative",
                    message: 'Periode Awal Belum Dipilih',
                });
                return;
            }
            if(tmpForm.periodeakhir == null){
                $q.notify({
                    type: "negative",
                    message: 'Periode Akhir Belum Dipilih',
                });
                return;
            }

            if(tmpForm.site == null){
                $q.notify({
                    type: "negative",
                    message: 'Site Belum Dipilih',
                });
                return;
            }

            if(tmpForm.mingguke == null){
                $q.notify({
                    type: "negative",
                    message: 'Minggu Ke- Belum Dipilih',
                });
                return;
            }

            if(tmpForm.type == null){
                $q.notify({
                    type: "negative",
                    message: 'Type Belum Dipilih',
                });
                return;
            }

            if(tmpForm.kedatangan == null){
                $q.notify({
                    type: "negative",
                    message: 'Waktu Kedatangan Belum Dipilih',
                });
                return;
            }

            if(tmpForm.catatan == null){
                $q.notify({
                    type: "negative",
                    message: 'Catatan Tidak Boleh Kosong',
                });
                return;
            }

            const res = await axios.post(`${import.meta.env.VITE_API_OC}getUrutanTanggal_Vendor`, tmpForm);
            listTanggal.value = res.data.dataTanggal;
            // console.log('DISINI');
            // console.log('sfd');
            // console.log(tmpDetailMakanan.value.length);
            // console.log(tmpDetailMakanan);
            tmpDetailMakanan.value = [];
            if(tmpDetailMakanan.value.length == 0){
                res.data.dataTanggal.forEach(element => {
                    tmpDetailMakanan.value.push({
                        tanggal: element.tanggal,
                        flag: element.flag,
                        nasi: null,
                        sayur: null,  
                        lauk: null,
                        sambal: null,
                        buah: null,
                        kerupuk: null,
                        pendamping: null,
                        lainlain: null,
                    })
                });
            }
           
            // console.log(res.data.dataTanggal);
            waktu1.value = res.data.waktu1;
            waktu2.value = res.data.waktu2;
            waktu3.value = res.data.waktu3;

            $q.loading.show();
            step.value = 2;
            $q.loading.hide();
        } catch (error) {
            console.log(error);
            $q.loading.hide();
            $q.notify({
            type: "negative",
            message: ParseError(error),
            });
        }
    };
    
    const onSubmit2 = async (values, actions) => {
        event.preventDefault();
        tmpForm.detail = tmpDetail.value;
        tmpForm.detailMakanan = tmpDetailMakanan.value;   
        saveMenuOrder_Vendor();
    };

    const saveMenuOrder_Vendor = async () => {
        try {   

            $q.loading.show();
            const res = await axios.post(`${import.meta.env.VITE_API_OC}saveMenuOrder_Vendor`, tmpForm);
            reset();
            dialogForm.value = false;
            $q.loading.hide();
            $q.notify({
                type: "positive",
                message: "Data berhasil disimpan",
            });
            await onRequest({
                pagination: pagination.value,
            });
        } catch (error) {
            $q.loading.hide();
        }
    };

    const editDataCathering  = async (value) => {
        // console.log('shendy');
        // alert(step.value);
        const res = await axios.post(`${import.meta.env.VITE_API_OC}getUrutanTanggal_Vendor`, tmpForm);
        listTanggal.value = res.data.dataTanggal;
        step.value = 1;
        waktu1.value = res.data.waktu1;
        waktu2.value = res.data.waktu2;
        waktu3.value = res.data.waktu3;

        tmpDetail.value = [];
        for (const iterator of value.detail) {
            tmpDetail.value.push({
                tanggal: dayjs(`${iterator.trd_date}`).format("YYYY-MM-DD"),
                shift1: iterator.trd_qty_shift_1,
                shift2: iterator.trd_qty_shift_2,    
                shift3: iterator.trd_qty_shift_3,
            })  
        }

        tmpDetailMakanan.value = [];
        console.log('EDIIIIIIITTT');
        for (const iterator2 of value.detailMakanan) {
            tmpDetailMakanan.value.push({            
                tanggal: dayjs(`${iterator2.trdm_date}`).format("YYYY-MM-DD"),
                nasi: iterator2.trdm_menu_nasi,
                sayur: iterator2.trdm_menu_sayur,  
                lauk: iterator2.trdm_menu_lauk,
                sambal: iterator2.trdm_menu_sambal,
                buah: iterator2.trdm_menu_buah,
                kerupuk: iterator2.trdm_menu_kerupuk,
                pendamping: iterator2.trdm_menu_pendamping,
                lainlain: iterator2.trdm_menu_lainlain,
            })  
        }

        dialogForm.value = true;
        tmpForm.vendor      = value.trh_vendor_code;
        tmpForm.periodeawal = dayjs(value.trh_start).format("DD-MM-YYYY");
        tmpForm.periodeakhir= dayjs(value.trh_end).format("DD-MM-YYYY");
        tmpForm.site        = value.trh_site;
        tmpForm.mingguke    = value.trh_week;
        tmpForm.kedatangan  = parseInt(value.arrive_id);
        tmpForm.type        = value.trh_type;
        tmpForm.catatan     = value.trh_notes;
        tmpForm.id          = value.rowid;
    };

    const sendDataCathering_Vendor = async () => {
        try {   

            tmpForm.detail = tmpDetail.value;
            tmpForm.detailMakanan = tmpDetailMakanan.value;
            if(tmpDetailMakanan.value.length == 0){
                $q.notify({
                    type: "negative",
                    message: 'Menu Makanan Belum Diinput',
                });
                return;
            }
            // console.log(tmpForm);

            $q.loading.show();
            const res = await axios.post(`${import.meta.env.VITE_API_OC}sendDataCathering_Vendor`, tmpForm);
            dialogForm.value = false;
            $q.loading.hide();
            $q.notify({
                type: "positive",
                message: "Data Berhasil Dikirim Ke Requestor",
            });
            reset();
            await onRequest({
                pagination: pagination.value,
            });
        } catch (error) {
            $q.loading.hide();
        }
    };

    const viewDataCathering  = async (value) => {
        const res = await axios.post(`${import.meta.env.VITE_API_OC}getUrutanTanggal_Vendor`, tmpForm);
        listTanggal.value = res.data.dataTanggal;
        step.value = 1;
        waktu1.value = res.data.waktu1;
        waktu2.value = res.data.waktu2;
        waktu3.value = res.data.waktu3;

        tmpDetail.value = [];
        for (const iterator of value.detail) {
            tmpDetail.value.push({
                tanggal: dayjs(`${iterator.trd_date}`).format("YYYY-MM-DD"),
                shift1: iterator.trd_qty_shift_1,
                shift2: iterator.trd_qty_shift_2,    
                shift3: iterator.trd_qty_shift_3,
            })  
        }

        tmpDetailMakanan.value = [];
        console.log('VIEEEEEEEEEEWWW');
        for (const iterator2 of value.detailMakanan) {
            tmpDetailMakanan.value.push({            
                tanggal: dayjs(`${iterator2.trdm_date}`).format("YYYY-MM-DD"),
                nasi: iterator2.trdm_menu_nasi,
                sayur: iterator2.trdm_menu_sayur,  
                lauk: iterator2.trdm_menu_lauk,
                sambal: iterator2.trdm_menu_sambal,
                buah: iterator2.trdm_menu_buah,
                kerupuk: iterator2.trdm_menu_kerupuk,
                pendamping: iterator2.trdm_menu_pendamping,
                lainlain: iterator2.trdm_menu_lainlain,
            })  
        }

        dialogFormView.value = true;
        tmpForm.vendor      = value.trh_vendor_code;
        tmpForm.periodeawal = dayjs(value.trh_start).format("DD-MM-YYYY");
        tmpForm.periodeakhir= dayjs(value.trh_end).format("DD-MM-YYYY");
        tmpForm.site        = value.trh_site;
        tmpForm.mingguke    = value.trh_week;
        tmpForm.kedatangan  = parseInt(value.arrive_id);
        tmpForm.type        = value.trh_type;
        tmpForm.catatan     = value.trh_notes;
        tmpForm.id          = value.rowid;
    };

    const prosesDataCathering  = async (value) => {
        // const res = [];
        const res = await axios.post(`${import.meta.env.VITE_API_OC}getUrutanTanggal_Vendor`, tmpForm);
        // console.log('sfd');
        // console.log(value);
        listTanggal.value = res.data.dataTanggal;
        step.value = 1;
        waktu1.value = res.data.waktu1;
        waktu2.value = res.data.waktu2;
        waktu3.value = res.data.waktu3;

        tmpDetail.value = [];
        for (const iterator of value.detail) {
            tmpDetail.value.push({
                id: iterator.trd_qty_id,
                tanggal: dayjs(`${iterator.trd_date}`).format("YYYY-MM-DD"),
                shift1: iterator.trd_qty_shift_1,
                shift2: iterator.trd_qty_shift_2,    
                shift3: iterator.trd_qty_shift_3,
            })  
        }

        tmpDetailMakanan.value = [];
        tmpDetailMakananSlide2.value = [];
        console.log('Prosess');
        for (const iterator2 of value.detailMakanan) {
            tmpDetailMakanan.value.push({       
                idtemp: iterator2.rowid,
                flagdelivery: iterator2.flagdelivery,     
                tanggal: dayjs(`${iterator2.trdm_date}`).format("YYYY-MM-DD"),
                nasi: iterator2.trdm_menu_nasi,
                sayur: iterator2.trdm_menu_sayur,  
                lauk: iterator2.trdm_menu_lauk,
                sambal: iterator2.trdm_menu_sambal,
                buah: iterator2.trdm_menu_buah,
                kerupuk: iterator2.trdm_menu_kerupuk,
                pendamping: iterator2.trdm_menu_pendamping,
                lainlain: iterator2.trdm_menu_lainlain,
            })  
            tmpDetailMakananSlide2.value.push({       
                idtemp: iterator2.rowid,
                flagdelivery: iterator2.flagdelivery,     
                tanggal: dayjs(`${iterator2.trdm_date}`).format("YYYY-MM-DD"),
                nasi: iterator2.trdm_menu_nasi,
                sayur: iterator2.trdm_menu_sayur,  
                lauk: iterator2.trdm_menu_lauk,
                sambal: iterator2.trdm_menu_sambal,
                buah: iterator2.trdm_menu_buah,
                kerupuk: iterator2.trdm_menu_kerupuk,
                pendamping: iterator2.trdm_menu_pendamping,
                lainlain: iterator2.trdm_menu_lainlain,
            })  
        }

        // console.log(tmpDetailMakanan.value);

        dialogFormProses.value = true;
        tmpForm.vendor      = value.trh_vendor_code;
        tmpForm.periodeawal = dayjs(`${value.trh_start}`).format("DD-MM-YYYY");
        tmpForm.periodeakhir= dayjs(`${value.trh_end}`).format("DD-MM-YYYY");
        tmpForm.site        = value.trh_site;
        tmpForm.mingguke    = value.trh_week;
        tmpForm.kedatangan  = parseInt(value.arrive_id);
        tmpForm.type        = value.trh_type;
        tmpForm.catatan     = value.trh_notes;
        tmpForm.id          = value.rowid;
    };

    const prosesDetailDataCathering_Vendor = async (val) => {
        tmpProsesDetail.value = [];
        tmpForm.detail = tmpDetail.value;
        tmpForm.valdetail = val;

        // const res = await axios.post(`${import.meta.env.VITE_API_OC}prosesDetailDataCathering_Vendor`, tmpForm);
        // console.log(res.data.data);
        // console.log(tmpDetail);
        let shift = null;
        let flagbefore = null;
        let xflag = null;
        // console.log(tmpDetail.value[val].tanggal);
        // tmpDetail.value.forEach(async(element) => {
            for (let i = 1; i <= 3; i++) {
                
                if(i == 1){ 
                    tmpForm.shift = 'Shift 1';
                    const res = await axios.post(`${import.meta.env.VITE_API_OC}prosesDetailDataCathering_Vendor`, tmpForm);
                    // console.log(res.data.data);
                    if(res.data.data){
                        tmpProsesDetail.value.push({
                            idorder: tmpForm.id,
                            tanggal: res.data.data.trd_delv_date,
                            shift: 'Shift 1',
                            qtyorder: res.data.data.trd_delv_qty_order,  
                            qtykirim : res.data.data.trd_delv_qty_kirim,
                            pickirim: res.data.data.trd_delv_pic,
                            uploadsj : res.data.data.trd_deliv_file_sj_ori,
                            flag:res.data.data.trd_delv_flag,
                        })
                    }else{                       
                        tmpProsesDetail.value.push({
                            idorder: tmpForm.id,
                            tanggal: tmpDetail.value[val].tanggal,
                            shift: 'Shift 1',
                            qtyorder: tmpDetail.value[val].shift1,  
                            qtykirim : 0,
                            pickirim: null,
                            uploadsj : [],
                            flag:0,
                        }) 
                    }
                }
                if(i == 2){
                    tmpForm.shift = 'Shift 2';
                    const res = await axios.post(`${import.meta.env.VITE_API_OC}prosesDetailDataCathering_Vendor`, tmpForm);
                    flagbefore = tmpProsesDetail.value[0].flag;
                    console.log(flagbefore);
                    if(res.data.data){
                        tmpProsesDetail.value.push({
                            idorder: tmpForm.id,
                            tanggal: res.data.data.trd_delv_date,
                            shift: 'Shift 2',
                            qtyorder: res.data.data.trd_delv_qty_order,  
                            qtykirim : res.data.data.trd_delv_qty_kirim,
                            pickirim: res.data.data.trd_delv_pic,
                            uploadsj : res.data.data.trd_deliv_file_sj_ori,
                            flag:res.data.data.trd_delv_flag,
                        })
                    }else{
                        if(flagbefore == '1' || flagbefore == '3' || flagbefore == '4'){
                            xflag = 0;
                        }else{
                            xflag = null;
                        }
                        tmpProsesDetail.value.push({
                            idorder: tmpForm.id,
                            tanggal: tmpDetail.value[val].tanggal,
                            shift: 'Shift 2',
                            qtyorder: tmpDetail.value[val].shift2,  
                            qtykirim : 0,
                            pickirim: null,
                            uploadsj : [],
                            flag:xflag,
                        }) 
                    }                   
                }
                if(i == 3){
                    tmpForm.shift = 'Shift 3';
                    const res = await axios.post(`${import.meta.env.VITE_API_OC}prosesDetailDataCathering_Vendor`, tmpForm);
                    flagbefore = tmpProsesDetail.value[1].flag;
                    console.log(flagbefore);
                    if(res.data.data){
                        tmpProsesDetail.value.push({
                            idorder: tmpForm.id,
                            tanggal: res.data.data.trd_delv_date,
                            shift: 'Shift 3',
                            qtyorder: res.data.data.trd_delv_qty_order,  
                            qtykirim : res.data.data.trd_delv_qty_kirim,
                            pickirim: res.data.data.trd_delv_pic,
                            uploadsj : res.data.data.trd_deliv_file_sj_ori,
                            flag:res.data.data.trd_delv_flag,
                        })
                    }else{
                        if(flagbefore == '1' || flagbefore == '3' || flagbefore == '4'){
                            xflag = 0;
                        }else{
                            xflag = null;
                        }
                        tmpProsesDetail.value.push({
                            idorder: tmpForm.id,
                            tanggal: tmpDetail.value[val].tanggal,
                            shift: 'Shift 3',
                            qtyorder: tmpDetail.value[val].shift3,  
                            qtykirim : 0,
                            pickirim: null,
                            uploadsj : [],
                            flag:xflag,
                        }) 
                    }
                    
                }

                
            }           
        // });

        console.log(tmpProsesDetail);

        // const res = await axios.post(`${import.meta.env.VITE_API_OC}getDetailCathering`, tmpForm);
        dialogFormProsesDetail.value = true;
    };

    const viewDetailDataCathering = async (val) => {
        tmpProsesDetail.value = [];
        tmpForm.detail = tmpDetail.value;
        tmpForm.valdetail = val;

        let shift = null;
        let flagbefore = null;
        let xflag = null;
        // console.log(val);
        // tmpDetail.value.forEach(async(element) => {
            for (let i = 1; i <= 3; i++) {                
                if(i == 1){ 
                    tmpForm.shift = 'Shift 1';                    
                    // console.log(tmpForm);
                    const res = await axios.post(`${import.meta.env.VITE_API_OC}prosesDetailDataCathering_Vendor`, tmpForm);
                    // console.log(res.data.data);
                    if(res.data.data){
                        tmpProsesDetail.value.push({
                            idorder: tmpForm.id,
                            tanggal: res.data.data.trd_delv_date,
                            shift: 'Shift 1',
                            qtyorder: res.data.data.trd_delv_qty_order,  
                            qtykirim : res.data.data.trd_delv_qty_kirim,
                            pickirim: res.data.data.trd_delv_pic,
                            uploadsj : res.data.data.trd_deliv_file_sj_ori,
                            flag:res.data.data.trd_delv_flag,
                        })
                    }else{                       
                        tmpProsesDetail.value.push({
                            idorder: tmpForm.id,
                            tanggal: tmpDetail.value[val].tanggal,
                            shift: 'Shift 1',
                            qtyorder: tmpDetail.value[val].shift1,  
                            qtykirim : 0,
                            pickirim: null,
                            uploadsj : [],
                            flag:0,
                        }) 
                    }
                }
                if(i == 2){
                    tmpForm.shift = 'Shift 2';
                    const res = await axios.post(`${import.meta.env.VITE_API_OC}prosesDetailDataCathering_Vendor`, tmpForm);
                    flagbefore = tmpProsesDetail.value[0].flag;
                    // console.log(flagbefore);
                    if(res.data.data){
                        tmpProsesDetail.value.push({
                            idorder: tmpForm.id,
                            tanggal: res.data.data.trd_delv_date,
                            shift: 'Shift 2',
                            qtyorder: res.data.data.trd_delv_qty_order,  
                            qtykirim : res.data.data.trd_delv_qty_kirim,
                            pickirim: res.data.data.pic,
                            uploadsj : res.data.data.trd_deliv_file_sj_ori,
                            flag:res.data.data.trd_delv_flag,
                        })
                    }else{
                        if(flagbefore == '1' || flagbefore == '3'){
                            xflag = 0;
                        }else{
                            xflag = null;
                        }
                        tmpProsesDetail.value.push({
                            idorder: tmpForm.id,
                            tanggal: tmpDetail.value[val].tanggal,
                            shift: 'Shift 2',
                            qtyorder: tmpDetail.value[val].shift2,  
                            qtykirim : 0,
                            pickirim: null,
                            uploadsj : [],
                            flag:xflag,
                        }) 
                    }                   
                }
                if(i == 3){
                    tmpForm.shift = 'Shift 3';
                    const res = await axios.post(`${import.meta.env.VITE_API_OC}prosesDetailDataCathering_Vendor`, tmpForm);
                    flagbefore = tmpProsesDetail.value[1].flag;
                    
                    if(res.data.data){
                        tmpProsesDetail.value.push({
                            idorder: tmpForm.id,
                            tanggal: res.data.data.trd_delv_date,
                            shift: 'Shift 3',
                            qtyorder: res.data.data.trd_delv_qty_order,  
                            qtykirim : res.data.data.trd_delv_qty_kirim,
                            pickirim: res.data.data.pic,
                            uploadsj : res.data.data.trd_deliv_file_sj_ori,
                            flag:res.data.data.trd_delv_flag,
                        })
                    }else{
                        if(flagbefore == '1'){
                            xflag = 0;
                        }else{
                            xflag = null;
                        }
                        tmpProsesDetail.value.push({
                            idorder: tmpForm.id,
                            tanggal: tmpDetail.value[val].tanggal,
                            shift: 'Shift 3',
                            qtyorder: tmpDetail.value[val].shift3,  
                            qtykirim : 0,
                            pickirim: null,
                            uploadsj : [],
                            flag:xflag,
                        }) 
                    }
                    
                }

                
            }           
        dialogFormViewProsesDetail.value = true;
    };

    const prosesKirimDetailDataCathering_Vendor = async (value) => {
        $q.loading.show();
        let formData = new FormData();    
        for (let key in value) {  
            formData.append(key, value[key]);
        } 
        formData.append('empid',empid())

        // console.log(formData);
        const res = await axios.post(`${import.meta.env.VITE_API_OC}prosesKirimDetailDataCathering_Vendor`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        dialogFormProsesDetail.value = false;
        $q.loading.hide();
        $q.notify({
            type: "positive",
            message: "Data Berhasil Dikirim",
        });
    };









    const deleteDataCathering_Vendor = async (value) => {
        // console.log(value);
        $q.dialog({
            title: "Konfirmasi",
            message: `Apakah anda yakin ingin menghapus Data Order Nomor <span class="tw-font-bold">${value.trh_order_code}</span>`,
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
                await axios.post("deleteDataCathering_Vendor", value);
                $q.notify({
                    type: "positive",
                    message: `Data Order Nomor <span class="tw-font-bold">${value.trh_order_code}</span> berhasil dihapus`,
                    html: true,
                });
                await getListOrderCathering();
            } catch (error) {
                // $q.notify({
                //     type: "negative",
                //     message: ParseError(error),
                // });
            }
        });
    };

    const filterFunction = async (val, update) => {
        if (val === '') {
            update(() => {
                getVendor();  
            })
        }
        update(() => {         
            const neddle = val.toLowerCase();
            listVendor.value = listVendor.value.filter(option => {
                return option.vendor_name.toLowerCase().includes(neddle)
            }) 
        })
    }

    const getVendor = async () => {
        try {
            tmpForm.domain = domain();
            const resvend = await axios.post("getVendorByDomain", tmpForm);

            listVendor.value = resvend.data.dataVendor;
        } catch (error) {
        }
    };


    const filterFunctionBU = async (val, update) => {
        if (val === '') {
            update(() => {
                getBU();  
            })
        }
        // console.log(val);
        update(() => {
            // console.log(val);
            const neddle = val.toLowerCase();
            listBisnisUnit.value = listBisnisUnit.value.filter(option => {
                return option.bu_name.toLowerCase().includes(neddle)
            }) 
        })
    }


    const getBU = async () => {
        try {
            const resBU = await axios.get("getBU");
            listBisnisUnit.value = resBU.data.dataBU;
        } catch (error) {
        }
    };

    const addOrderCathering = async () => {
        reset();
        tmpDetail.value = [];
        dialogForm.value = true;
    };

    const onSubmit1EDIT = async (values, actions) => {
        event.preventDefault();
        try {
            if(tmpForm.vendor == null){
                $q.notify({
                    type: "negative",
                    message: 'Vendor Belum Dipilih',
                });
                return;
            }

            if(tmpForm.periodeawal == null){
                $q.notify({
                    type: "negative",
                    message: 'Periode Awal Belum Dipilih',
                });
                return;
            }
            if(tmpForm.periodeakhir == null){
                $q.notify({
                    type: "negative",
                    message: 'Periode Akhir Belum Dipilih',
                });
                return;
            }

            if(tmpForm.site == null){
                $q.notify({
                    type: "negative",
                    message: 'Site Belum Dipilih',
                });
                return;
            }

            if(tmpForm.mingguke == null){
                $q.notify({
                    type: "negative",
                    message: 'Minggu Ke- Belum Dipilih',
                });
                return;
            }

            if(tmpForm.type == null){
                $q.notify({
                    type: "negative",
                    message: 'Type Belum Dipilih',
                });
                return;
            }

            if(tmpForm.kedatangan == null){
                $q.notify({
                    type: "negative",
                    message: 'Waktu Kedatangan Belum Dipilih',
                });
                return;
            }

            if(tmpForm.catatan == null){
                $q.notify({
                    type: "negative",
                    message: 'Catatan Tidak Boleh Kosong',
                });
                return;
            }

            const res = await axios.post(`${import.meta.env.VITE_API_OC}getUrutanTanggal_Vendor`, tmpForm);
            listTanggal.value = res.data.dataTanggal;           

            waktu1.value = res.data.waktu1;
            waktu2.value = res.data.waktu2;
            waktu3.value = res.data.waktu3;

            $q.loading.show();
            step.value = 2;
            $q.loading.hide();
        } catch (error) {
            $q.loading.hide();
            $q.notify({
            type: "negative",
            message: ParseError(error),
            });
        }
    };

    const onSubmit2EDIT = async (values, actions) => {
        event.preventDefault();
        tmpForm.detail = tmpDetail.value;   
        saveEditOrder_Vendor();
    }

    const saveEditOrder_Vendor = async () => {
        try {   

            $q.loading.show();
            const res = await axios.post(`${import.meta.env.VITE_API_OC}saveEditOrder_Vendor`, tmpForm);
            dialogFormEdit.value = false;
            $q.loading.hide();
            $q.notify({
                type: "positive",
                message: "Data Berhasil Diupdate",
            });
            reset();
            await onRequest({
                pagination: pagination.value,
            });
        } catch (error) {
            $q.loading.hide();
        }
    };



    const sendOrderCatheringFromEdit_Vendor = async () => {
        try {   

            tmpForm.detail = tmpDetail.value;
            $q.loading.show();
            const res = await axios.post(`${import.meta.env.VITE_API_OC}sendOrderCatheringFromEdit_Vendor`, tmpForm);
            dialogFormEdit.value = false;
            $q.loading.hide();
            $q.notify({
                type: "positive",
                message: "Data Berhasil Dikirim Ke Vendor",
            });
            reset();
            await onRequest({
                pagination: pagination.value,
            });
        } catch (error) {
            $q.loading.hide();
        }
    };

    const getListOrderCatheringWithFilter_Vendor = async () => {
        try {
            
            const res = await axios.post(`${import.meta.env.VITE_API_OC}getListOrderCatheringWithFilter_Vendor`, tmpForm);
            listDataOrderCathering.value = res.data.data;
            pagination.value.rowsNumber = res.data.jumdata;

        } catch (error) {
            loading.value = false;           
        }
    };

    const hideDate = () => {
        qDateProxy.value.hide()
    }

    const resetFilter = async () => {
        reset();
        getListOrderCathering();
    };

    
    const reset = () => {
        tmpForm.vendor = null;
        tmpForm.bisnisunit = null;
        tmpForm.status = null;
        tmpForm.id = null;

        tmpForm.nomororderfilter = null;
        tmpForm.sitefilter = null;
        tmpForm.typefilter = null;
        tmpForm.statusfilter = null;
        tmpForm.bisnisunitfilter = null;
        tmpForm.periodeawalfilter = dateOnlyDMY();
        tmpForm.periodeakhirfilter = dateOnlyDMY();

        tmpForm.periodeawal = dateOnlyDMY();
        tmpForm.periodeakhir = dateOnlyDMY();
        tmpForm.site = null;
        tmpForm.mingguke = null;
        tmpForm.type = null;
        tmpForm.kedatangan = null;
        tmpForm.catatan = null;
        step.value = 1;
    };
    
    const onRequest = (props) => {
        const { page, rowsPerPage, sortBy, descending, filter } = props.pagination;
        pagination.value.filter = filter;
        pagination.value.page = page;
        pagination.value.rowsPerPage = rowsPerPage;
        pagination.value.sortBy = sortBy;
        pagination.value.descending = descending;
        getListOrderCathering();
    };
    
    onMounted(() => {
        onRequest({
        pagination: pagination.value,
        });
    });
    
    document.addEventListener("etrasn_setdomain", () => {
        pagination.value.domain = domain();
        getListOrderCathering();
    });
  </script>

<style>
.tablemain, th, td {
    border: 1px solid black;
    border-collapse: collapse;
}

.styled-table {
    border-collapse: collapse;
    margin: 25px 0;
    font-size: 0.9em;
    font-family: sans-serif;
    min-width: 100%;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
    overflow-x:auto;
}

.styled-table thead tr {
  background-color: #286cff;
  color: #ffffff;
  text-align: center;
}

.styled-table th,
.styled-table td {
  padding: 12px 15px;
}

.styled-table tbody tr {
  border-bottom: 1px solid #dddddd; text-align: center;
}

.styled-table tbody tr:nth-of-type(even) {
  background-color: #f1eaea; text-align: center;
}

.styled-table tbody tr:last-of-type {
  border-bottom: 2px solid #009879; text-align: center;
}

.styled-table tbody tr.active-row {
  font-weight: bold;
  color: #009879;
  text-align: center;
}


</style>

