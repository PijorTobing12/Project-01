<template>
    <div class="q-pa-md">
        <q-card>
            <q-separator />
            <q-card-section>
                <q-table 
                    :title="title" 
                    :columns="columns"
                    :rows="listDataTable" 
                    row-key="no"
                    v-model:pagination="pagination"
                    :loading="loading"
                    :filter="pagination.filter"
                    @request="onRequest"
                    binary-state-sort>
                    
                    <!-- 
                    selection="multiple" 
                    v-model:selected="selected" -->
                    <template v-slot:top-right>
                        <q-input borderless dense debounce="300" v-model="pagination.filter" placeholder="Search">
                            <template v-slot:append>
                            <q-icon name="search" />
                            </template>
                        </q-input>
                    </template>
                    <!-- <template v-slot:body-cell-aksi="props">
                        <q-td :props="props">
                            <q-btn-group push>
                                <q-btn dense color="info" class="text-weight-regular text-caption"
                                @click="router.push(`/shipment/details/${props.row.domain}/${props.row.nopol}/${props.row.tgl}`)" push icon="add" />
                            </q-btn-group>
                        </q-td>
                    </template> -->
                    <!-- <template v-slot:body-cell-print="props">
                        <q-td :props="props">
                            <q-btn-group v-if="props.row.trans_flag_desc === 'Approve Finance'" push>
                            <q-btn dense color="warning" class="text-weight-regular text-caption"
                                @click="redirect(props.row)" push label="Print" icon="print" />
                            </q-btn-group>
                        </q-td>
                    </template> -->
                </q-table>
            </q-card-section>
        </q-card>
    </div>
</template>

<script setup>
    import { ref, onMounted, reactive } from "vue";
    import axios from "axios";
    import { ParseError, domain, empid } from "./../../utils";
    import { useQuasar } from "quasar";
    import { useRouter, useRoute } from "vue-router";

    const env = import.meta.env;
    const route = useRoute()

    const $q = useQuasar();
    const listDataTable = ref([])
    const loading = ref(false);
    
    const tempForm = reactive({
        // bu: route.params.domain,
        nopol: route.params.nopol,
        // tgl: route.params.tgl
        param: route.params.params
    });

    const title = "List Detail Surat Jalan : "+route.params.nopol
    const columns = [
        {
            name: "no",
            required: true,
            label: "No",
            align: "left",
            field: "no",
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
            name: "nama_barang",
            required: true,
            label: "Item",
            align: "left",
            field: "nama_barang",
            sortable: true,
        },
        {
            name: "qty",
            required: true,
            label: "Qty",
            align: "left",
            field: "qty",
            sortable: true,
        },
        {
            name: "satuan",
            required: true,
            label: "Satuan",
            align: "center",
            field: "satuan",
            sortable: true,
        },
        {
            name: "tonase",
            required: true,
            label: "Tonase",
            align: "right",
            field: "tonase",
            // format: val => dayjs(`${val}`).format("YYYY-MM-DD"),
            sortable: true,
        },    
        {
            name: "jenis_komplain",
            required: true,
            label: "Keterangan",
            align: "left",
            field: "jenis_komplain",
            // format: val => dayjs(`${val}`).format("YYYY-MM-DD"),
            sortable: true,
        },
        {
            name: "path_foto",
            required: true,
            label: "Foto",
            align: "right",
            field: "path_foto",
            sortable: true,
        },
    ];

    const pagination = ref({
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10,
        filter: null,
        domain: domain(),
        bu: tempForm.bu,
        nopol: tempForm.nopol,
        tgl: tempForm.tgl,
        param: tempForm.param
    });

    onMounted(() => {
        getListDetailSuratJalan()
        onRequest({
            pagination: pagination.value,
        });
    });
    const onRequest = (props) => {
        const { page, rowsPerPage, sortBy, descending, filter } = props.pagination;
        pagination.value.filter = filter;
        pagination.value.page = page;
        pagination.value.rowsPerPage = rowsPerPage;
        pagination.value.sortBy = sortBy;
        pagination.value.descending = descending;
        pagination.value.empid = empid();
        // getListSuratJalan()
    };

    const getListDetailSuratJalan = async () => {
        try {
            loading.value = true;
            // pagination.value.ekspedisi = tempForm.ekspedisi;
            // pagination.value.bu = tempForm.bu;
            // pagination.value.fromDate = tempForm.fromDate;
            // pagination.value.toDate = tempForm.toDate;
            const res = await axios.get("getListDetailSuratJalan", {
            params: pagination.value,
            //   params: {
            //     params: pagination.value,
            //     empid: empid(),
            //   },
            });
            listDataTable.value = res.data
            pagination.value.rowsNumber = undefined

            loading.value = false;
        } catch (error) {
            loading.value = false;
            $q.notify({
            type: "negative",
            message: ParseError(error),
            });
        }
    };
</script>