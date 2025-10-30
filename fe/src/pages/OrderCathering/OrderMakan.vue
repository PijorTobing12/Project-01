<template>
    <div class="q-pa-md">
        <q-card>
          <q-separator />
          <q-card-section style="max-height: 50vh" class="scroll">
            <div class="row q-col-gutter-sm">
                <div class="col-4">
                    <q-input v-model="tmpForm.nomororderfilter" dense outlined label="Nomor Order" />
                </div> 
                <div class="col-4">
                    <q-input type="text" v-model="tmpForm.vendorfilter" dense outlined label="Kode Vendor" readonly/>
                </div>
                <div class="col-4">
                    <q-select dense outlined v-model="tmpForm.kedatanganfilter" use-input emit-value map-options input-debounce="0"
                        option-value="arrive_id" 
                        :option-label="option => `${option.arrive_title}`"
                        label="Pilih Kedatangan" :options="listKedatangan">
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
                    <q-input label="Periode Mulai" outlined dense v-model="tmpForm.periodeawalfilter">
                        <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="tmpForm.periodeawalfilter" mask="DD-MM-YYYY" @update:model-value="hideDate()">
                            </q-date>
                            </q-popup-proxy>
                        </q-icon>
                        </template>
                    </q-input>
                </div>
                <div class="col-4">
                    <q-input label="Periode Akhir" outlined dense v-model="tmpForm.periodeakhirfilter">
                        <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="tmpForm.periodeakhirfilter" mask="DD-MM-YYYY" @update:model-value="hideDate()">
                            </q-date>
                            </q-popup-proxy>
                        </q-icon>
                        </template>
                    </q-input>
                </div> 
                <div class="col-4">
                    <q-select dense outlined v-model="tmpForm.siteFilter" use-input emit-value map-options input-debounce="0"                      
                            option-value="ste_code" :option-label="option => `${option.ste_code} - ${option.ste_name}`"
                            label="Site" :options="listSite"                        
                            >
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
                <q-btn push icon="search" color="blue" label="Tampilkan" @click="getReportListOrderCatheringWithFilter" />
                <q-btn push icon="picture_as_pdf" color="red" label="PDF" @click="downloadPdf" />
                <q-btn push icon="superscript" color="green" label="Excel" @click="downloadexcel" />
            </q-btn-group>
          </q-card-actions>
        </q-card>
    

      <q-card>
        <q-separator />
        <q-card-section>
            <div class="col-12" v-if="vwtable == true">
                <div style="overflow-x:auto;">
                    <!-- {{ listTanggal }} -->
                    <table  class="styled-table" style="overflow-x:auto;">
                        <thead>
                            <tr style="background-color: #FFFFFF; color:black; border:hidden">
                                <th colspan="7">
                                REKAPITULASI MAKAN KARYAWAN {{  buname }}                               
                                </th>                                
                            </tr>
                            <tr style="background-color: #FFFFFF; color:black; border:hidden">
                                <th colspan="7">
                                PT. RUCIKA PLANT  {{  siteName }}                               
                                </th>                                
                            </tr>
                            <tr style="background-color: #FFFFFF; color:black; border:hidden">
                                <th colspan="7">
                                    Periode {{  dayjs(qperiodeawal).format('DD MMMM YYYY') }} - {{  dayjs(qperiodeakhir).format('DD MMMM YYYY') }}
                                </th>                                
                            </tr>
                           
                            <tr>
                                <th rowspan="2">DAY</th>
                                <th rowspan="2">DATE</th>                                
                                <th colspan="3">MAKAN  (@ {{ hargaSatuan }})</th>                                
                                <th rowspan="2">ORDER MAKAN</th>
                                <th rowspan="2">DAILY SUB TOTAL</th>
                            </tr>
                            <tr>
                                <th>SHIFT 1</th>
                                <th>SHIFT 2</th>
                                <th>SHIFT 3</th>
                            </tr>                   
                        </thead>
                        <tbody>                            
                            <tr v-for="(data, i) in listDataOrderCathering" :key="i">
                                <td>{{ data.hari }} </td>
                                <td>{{ data.tanggal }} </td>                                
                                <td>{{ data.shift1 }} </td>
                                <td>{{ data.shift2 }} </td>
                                <td>{{ data.shift3 }} </td>
                                <td>{{ data.total }} </td>
                                <td>Rp{{ formatRupiahWithFixed(data.total * hargaSatuan) }} </td>                                                            
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="2"><b><i>Total</i></b></td>
                                <td><b><i>{{ grandtotal1 }}</i></b></td>
                                <td><b><i>{{ grandtotal2 }}</i></b></td>
                                <td><b><i>{{ grandtotal3 }}</i></b></td>
                                <td><b><i>{{ grandtotalall }}</i></b></td>
                                <td><b><i>Rp{{ formatRupiahWithFixed(grandtotalall * hargaSatuan) }}</i></b></td>
                            </tr> 
                            <tr style="background-color: #FFFFFF; color:black; border:hidden; text-align: right;">
                                <td colspan="7">{{  dayjs().format('DD MMMM YYYY') }}</td>                                
                            </tr>
                            <tr style="background-color: #FFFFFF; color:black; border:hidden; text-align: right;">
                                <td colspan="7">{{  vendorName }}</td>                                
                            </tr>                  
                        </tfoot>                     
                    </table>                   
                </div>
            </div>

            <template v-if="hidtab == 'show'">
                <table>
                    <table border="1px" width="100%" id="pdf">      
                        <div>                          
                                <thead>
                                    <th colspan="7">
                                        REKAPITULASI MAKAN KARYAWAN {{  buname }}                               
                                    </th>  
                                    <tr style="background-color: #FFFFFF; color:black; border:hidden">
                                        <th colspan="7">
                                        PT. RUCIKA PLANT  {{  siteName }}                               
                                        </th>                                
                                    </tr>
                                    <tr style="background-color: #FFFFFF; color:black; border:hidden">
                                        <th colspan="7">Periode {{  dayjs(qperiodeawal).format('DD MMMM YYYY') }} - {{  dayjs(qperiodeakhir).format('DD MMMM YYYY') }}</th>                                
                                    </tr>
                                    <tr>
                                        <th style="text-align: center;" rowspan="2">DAY</th>
                                        <th rowspan="2">DATE</th>
                                        <th colspan="3">MAKAN (@ {{ hargaSatuan }})</th>                                
                                        <th rowspan="2">ORDER MAKAN</th>
                                        <th rowspan="2">DAILY SUB TOTAL</th>
                                    </tr>
                                    <tr>
                                        <th>SHIFT 1</th>
                                        <th>SHIFT 2</th>
                                        <th>SHIFT 3</th>
                                    </tr>                   
                                </thead>
                                <tbody>                            
                                    <tr v-for="(data, i) in listDataOrderCathering" :key="i">
                                        <td>{{ data.hari }} </td>
                                        <td>{{ data.tanggal }} </td>                                        
                                        <td style="text-align: center; vertical-align: text-top;">{{ data.shift1 }} </td>
                                        <td style="text-align: center;">{{ data.shift2 }} </td>
                                        <td style="text-align: center;">{{ data.shift3 }} </td>
                                        <td style="text-align: center;">{{ data.total }} </td>
                                        <td style="text-align: center;">Rp{{ formatRupiahWithFixed(data.total * hargaSatuan) }} </td>                                                         
                                    </tr>
                                    <tr>
                                        <td style="text-align: right; top:10%;" colspan="2"><b><i>Total</i></b></td>
                                        <td style="vertical-align: top;"><b><i>{{ grandtotal1 }}</i></b></td>
                                        <td style="text-align: center;"><b><i>{{ grandtotal2 }}</i></b></td>
                                        <td style="text-align: center;"><b><i>{{ grandtotal3 }}</i></b></td>
                                        <td style="text-align: center;"><b><i>{{ grandtotalall }}</i></b></td>
                                        <td style="text-align: center;"><b><i>Rp{{ formatRupiahWithFixed(grandtotalall * hargaSatuan) }}</i></b></td>
                                    </tr>
                                    <tr style="background-color: #FFFFFF; color:black; border:hidden; text-align: right;">
                                        <td colspan="7">{{  dayjs().format('DD MMMM YYYY') }}</td>                                
                                    </tr>
                                    <tr style="background-color: #FFFFFF; color:black; border:hidden; text-align: right;">
                                        <td colspan="7">{{  vendorName }}</td>                                
                                    </tr>                    
                                </tbody>                              
                        </div>
                    </table>  
                </table>                                                           
            </template>

            <div class="col-12" v-if="vwpdf == 'show'">
                <div style="overflow-x:auto;">
                    <table  id="table" class="styled-table" style="overflow-x:auto;">
                        <thead>
                            <tr style="background-color: #FFFFFF; color:black; border:hidden">
                                <th colspan="7">
                                    REKAPITULASI MAKAN KARYAWAN {{  buname }}                               
                                </th>                                
                            </tr>
                            <tr style="background-color: #FFFFFF; color:black; border:hidden">
                                <th colspan="7">
                                PT. RUCIKA PLANT  {{  siteName }}                               
                                </th>                                
                            </tr>
                            <tr style="background-color: #FFFFFF; color:black; border:hidden">
                                <th colspan="7">
                                    Periode {{  dayjs(qperiodeawal).format('DD MMMM YYYY') }} - {{  dayjs(qperiodeakhir).format('DD MMMM YYYY') }}
                                </th>                                
                            </tr>
                           
                            <tr>
                                <th style="text-align: center;" rowspan="2">DAY</th>
                                <th rowspan="2">DATE</th>
                                <th colspan="3">MAKAN (@ {{ hargaSatuan }})</th>                                
                                <th rowspan="2">ORDER MAKAN</th>
                                <th rowspan="2">DAILY SUB TOTAL</th>
                            </tr>
                            <tr>
                                <th>SHIFT 1</th>
                                <th>SHIFT 2</th>
                                <th>SHIFT 3</th>
                            </tr>                         
                        </thead>
                        <tbody>                            
                            <tr v-for="(data, i) in listDataOrderCathering" :key="i">
                                <td>{{ data.hari }} </td>
                                <td>{{ data.tanggal }} </td>                                
                                <td>{{ data.shift1 }} </td>
                                <td>{{ data.shift2 }} </td>
                                <td>{{ data.shift3 }} </td>
                                <td>{{ data.total }} </td>
                                <td style="text-align: center;">Rp{{ formatRupiahWithFixed(data.total * hargaSatuan) }} </td>                                                             
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="2"><b><i>Total</i></b></td>
                                <td><b><i>{{ grandtotal1 }}</i></b></td>
                                <td><b><i>{{ grandtotal2 }}</i></b></td>
                                <td><b><i>{{ grandtotal3 }}</i></b></td>
                                <td><b><i>{{ grandtotalall }}</i></b></td>
                                <td style="text-align: center;"><b><i>Rp{{ formatRupiahWithFixed(grandtotalall * hargaSatuan) }}</i></b></td>
                            </tr>
                            <tr style="background-color: #FFFFFF; color:black; border:hidden; text-align: right;">
                                <td colspan="7">{{  dayjs().format('DD MMMM YYYY') }}</td>                                
                            </tr>
                            <tr style="background-color: #FFFFFF; color:black; border:hidden; text-align: right;">
                                <td colspan="7">{{  vendorName }}</td>                                
                            </tr>                         
                        </tfoot>
                    </table>
                </div>
            </div>
            
        </q-card-section>
      </q-card>
    </div>
  </template>
  
  <script setup>
    import { ref, onMounted, reactive } from "vue";
    import axios from "axios";
    import { ParseError, excelDownload, domain, role, empid, dateOnly, dateOnlyMDY, formatRupiah, formatRupiahWithFixed , formatRupiahFixed2  } from "./../../utils";
    import { useQuasar, QSpinnerCube, Loading } from "quasar";
    import * as XLSX from "xlsx";
    import dayjs from "dayjs";
    const qDateProxy = ref(null);
    const vwtable = ref(false);

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
            format: val=> dayjs(`${val}`).format("YYYY-MM-DD"),
            field: "trh_start",
            sortable: true,
        },
        {
            name: "trh_end",
            required: true,
            label: "Periode Akhir",
            align: "left",
            format: val=> dayjs(`${val}`).format("YYYY-MM-DD"),
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
    const listSite = ref([]);
    const listVendor = ref([]);
    const listKedatangan = ref([]);
    const loading = ref(false);

    const pagination = ref({
        sortBy: "trh_order_code",
        descending: true,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10,
        filter: null,
        domain: domain(),
    });
    const tmpForm = reactive({
        id: null,
        bisnisunit: null,
        vendor: null,

        nomororderfilter: null,
        siteFilter: null,
        typefilter: null,
        statusfilter: null,
        vendorfilter: empid(),
        kedatanganfilter: null,
        periodeawalfilter: dateOnlyMDY(),
        periodeakhirfilter: dateOnlyMDY(),
        // periodeawal: null,

        domain: domain(),
        empid: empid(),
    });
    
    let grandtotal1 = ref(0);
    let grandtotal2 = ref(0);
    let grandtotal3 = ref(0);
    let grandtotalall = ref(0);
    let buname = ref(null);
    let siteName = ref(null);
    let hargaSatuan = ref(0);
    let vendorName = ref(null);
    let qperiodeawal = ref(null);
    let qperiodeakhir = ref(null);
    const getReportListOrderCatheringWithFilter = async () => {
        try {
            loading.value = true;
            Loading.show({spinner: QSpinnerCube});
            const res = await axios.post(`${import.meta.env.VITE_API_OC}getReportListOrderCatheringWithFilter_Vendor`, tmpForm);
            if(res.data.data.length > 0){
                vwtable.value = true;
            }
            // console.log(res.data);
            // console.log('sfd');
            listDataOrderCathering.value = res.data.data;
            
            buname.value = res.data.buname;
            siteName.value = res.data.siteName;
            hargaSatuan.value = res.data.hargaSatuan;
            vendorName.value  = res.data.vendorName;
            grandtotal1.value = res.data.grandtotal1;
            grandtotal2.value = res.data.grandtotal2;
            grandtotal3.value = res.data.grandtotal3;
            grandtotalall.value = res.data.grandtotalall;
            qperiodeawal.value = res.data.periodeawal;
            qperiodeakhir.value = res.data.periodeakhir;
            loading.value = false;
            Loading.hide()
        } catch (error) {
            loading.value = false;
            Loading.hide()
        }
    };

    import { jsPDF } from "jspdf";
    import autoTable from 'jspdf-autotable';
    const downloadPdf = async() => {
        const res = await axios.post(`${import.meta.env.VITE_API_OC}getReportListOrderCatheringWithFilter_Vendor`, tmpForm);
        
        listDataOrderCathering.value = res.data.data;
        grandtotal1.value = res.data.grandtotal1;
        grandtotal2.value = res.data.grandtotal2;
        grandtotal3.value = res.data.grandtotal3;
        grandtotalall.value = res.data.grandtotalall;
        qperiodeawal.value = res.data.periodeawal;
        qperiodeakhir.value = res.data.periodeakhir;
        buname.value = res.data.buname;
        siteName.value = res.data.siteName;
        hargaSatuan.value = res.data.hargaSatuan;
        vendorName.value  = res.data.vendorName;
        
        await munculpdf();

        const name = 'Order Cathering';
        var doc = new jsPDF({
            orientation: 'landscape'
        });
        var totalPagesExp = '{total_pages_count_string}'
        doc.autoTable({
            html: '#table',
            didDrawCell: function (data) {
            },
            headStyles:{
                halign: 'center', lineWidth: 0.2, cellPadding:1, lineColor:1,
            },
            bodyStyles: {
                halign: 'center', lineWidth: 0.2, cellPadding:1, lineColor:1,
            },
            footStyles: {
                halign: 'center', lineWidth: 0.2, cellPadding:1, lineColor:1,
            },
            theme:'striped',
        });

        if (typeof doc.putTotalPages === 'function') {
            doc.putTotalPages(totalPagesExp)
        }
        
        doc.save(`${name}-${date.formatDate(Date.now(), "YYYY-MM-DD-HH:mm:ss")}.pdf`);
        await hiddenpdf();
    }   


    const hidtab = ref("");
    const muncul = async () => {
        hidtab.value = 'show';
    }
    
    const hidden = async () => {
        hidtab.value = 'hidden';
    }

    const vwpdf = ref("");
    const munculpdf = async () => {
        vwpdf.value = 'show';
    }
    
    const hiddenpdf = async () => {
        vwpdf.value = 'hidden';
    }

    import { utils, writeFileXLSX } from 'xlsx';
    import { date } from "quasar";
    const downloadexcel = async(value) => {
                
        const res = await axios.post(`${import.meta.env.VITE_API_OC}getReportListOrderCatheringWithFilter_Vendor`, tmpForm);
        
        listDataOrderCathering.value = res.data.data;
        grandtotal1.value = res.data.grandtotal1;
        grandtotal2.value = res.data.grandtotal2;
        grandtotal3.value = res.data.grandtotal3;
        grandtotalall.value = res.data.grandtotalall;
        qperiodeawal.value = res.data.periodeawal;
        qperiodeakhir.value = res.data.periodeakhir;
        buname.value = res.data.buname;
        siteName.value = res.data.siteName;
        hargaSatuan.value = res.data.hargaSatuan;
        vendorName.value  = res.data.vendorName;
        
        await muncul();
        const wb = XLSX.utils.table_to_book(document.getElementsByTagName("TABLE")[0])
        // XLSX.writeFile(wb, "OrderCathering.xlsx");

        const name = 'Order Cathering';
        XLSX.writeFile(wb,`${name}-${date.formatDate(Date.now(), "YYYY-MM-DD-HH:mm:ss")}.xlsx`);
        await hidden();
    }



    const hideDate = () => {
        qDateProxy.value.hide()
    }

    const resetFilter = async () => {
        reset();
        getReportListOrderCatheringWithFilter();
    };

    const getReportPerhitunganMakanKaryawan = async () => {
        try {
            loading.value = true;
            const res = await axios.post(`${import.meta.env.VITE_API_OC}getReportPerhitunganMakanKaryawan_Vendor`, tmpForm);

            listVendor.value = res.data.dataVendor;
            listKedatangan.value = res.data.dataKedatangan;
            listSite.value  = res.data.dataSite;
            
            loading.value = false;
        } catch (error) {
            loading.value = false;
        }
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
            // const resvend = await axios.post("getVendorByDomain", tmpForm);
            const resvend = await axios.post(`${import.meta.env.VITE_API_OC}getVendorByDomain_Vendor`, tmpForm);

            listVendor.value = resvend.data.dataVendor;
        } catch (error) {
        }
    };
 

    const reset = () => {
        tmpForm.vendor = null;
        tmpForm.bisnisunit = null;
        tmpForm.status = null;
        tmpForm.id = null;

        tmpForm.nomororder = null;
        tmpForm.sitefilter = null;
        tmpForm.typefilter = [];
        tmpForm.statusfilter = [];
        tmpForm.periodeawalfilter = dateOnly();
        tmpForm.periodeakhirfilter = dateOnly();
     
    };
    
    const onRequest = (props) => {
        const { page, rowsPerPage, sortBy, descending, filter } = props.pagination;
        pagination.value.filter = filter;
        pagination.value.page = page;
        pagination.value.rowsPerPage = rowsPerPage;
        pagination.value.sortBy = sortBy;
        pagination.value.descending = descending;
        getReportPerhitunganMakanKaryawan();
        
    };
    
    onMounted(() => {
        onRequest({
            pagination: pagination.value,
        });
    });
    
    document.addEventListener("etrasn_setdomain", () => {
        pagination.value.domain = domain();
        getReportListOrderCatheringWithFilter();
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

.styled-table tfoot tr {
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

.center {
  text-align: center;
  margin-top: 500px;
}


</style>

