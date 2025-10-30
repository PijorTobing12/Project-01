<template>
  <div class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="tw-text-lg tw-font-semibold">
          PURCHASE ORDER MAINTENANCE
        </div>
      </q-card-section>

      <q-stepper v-model="step" ref="stepper" color="primary" animated>
        <q-step :name="1" title="Header" icon="settings" :done="step > 1">
          <Form
            :validation-schema="schema1"
            @submit="onSubmit1"
            class="q-mt-md"
          >
            <div class="row q-col-gutter-sm tw-px-3 tw-pb-3">
              <div class="col-12">
                <divider title="Header" />
              </div>
              <div class="col-3">
                <Field
                  v-model="tmpForm.nopo"
                  name="nopo"
                  v-slot="{ errorMessage, value, field }"
                >
                  <q-input
                    dense
                    outlined
                    label="Purchase Order"
                    :model-value="value"
                    v-bind="field"
                    :error-message="errorMessage"
                    :error="!!errorMessage"
                  />
                </Field>
              </div>
              <div class="col-3">
                <Field
                  v-model="tmpForm.supplier"
                  name="supplier"
                  v-slot="{ errorMessage, value, field }"
                  ><q-input
                    dense
                    outlined
                    label="Supplier"
                    :model-value="value"
                    v-bind="field"
                    :error-message="errorMessage"
                    :error="!!errorMessage"
                  />
                </Field>
              </div>
              <div class="col-3">
                <Field
                  v-model="tmpForm.shipto"
                  name="shipto"
                  v-slot="{ errorMessage, value, field }"
                  ><q-input
                    dense
                    outlined
                    label=" Ship-To"
                    :model-value="value"
                    v-bind="field"
                    :error-message="errorMessage"
                    :error="!!errorMessage"
                  />
                </Field>
              </div>
            </div>

            <div class="row q-col-gutter-sm tw-px-3 tw-pb-3">
              <div class="col-12">
                <divider title="Detail" />
              </div>
              <div class="col-3">
                <Field
                  v-model="tmpForm.orderdate"
                  name="orderdate"
                  v-slot="{ errorMessage, value, field }"
                >
                  <q-input
                    dense
                    outlined
                    label="Order Date"
                    :model-value="value"
                    v-bind="field"
                    :error-message="errorMessage"
                    :error="!!errorMessage"
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          ref="qDateProxy"
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            v-model="tmpForm.orderdate"
                            mask="YYYY-MM-DD"
                            v-close-popup
                          >
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </Field>
              </div>
              <div class="col-3">
                <Field
                  v-model="tmpForm.duedate"
                  name="duedate"
                  v-slot="{ errorMessage, value, field }"
                >
                  <q-input
                    dense
                    outlined
                    label="Due Date"
                    :model-value="value"
                    v-bind="field"
                    :error-message="errorMessage"
                    :error="!!errorMessage"
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          ref="qDateProxy"
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            v-model="tmpForm.duedate"
                            mask="YYYY-MM-DD"
                            v-close-popup
                          >
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </Field>
              </div>
              <div class="col-3">
                <Field
                  v-model="tmpForm.buyer"
                  name="buyer"
                  v-slot="{ errorMessage, value, field }"
                  ><q-input
                    dense
                    outlined
                    label="Buyer"
                    :model-value="value"
                    v-bind="field"
                    :error-message="errorMessage"
                    :error="!!errorMessage"
                /></Field>
              </div>
              <div class="col-3">
                <Field
                  v-model="tmpForm.billto"
                  name="billto"
                  v-slot="{ errorMessage, value, field }"
                  ><q-input
                    dense
                    outlined
                    label="Bill To"
                    :model-value="value"
                    v-bind="field"
                    :error-message="errorMessage"
                    :error="!!errorMessage"
                  />
                </Field>
              </div>
              <div class="col-3">
                <Field
                  v-model="tmpForm.salesjob"
                  name="salesjob"
                  v-slot="{ errorMessage, value, field }"
                >
                  <q-input
                    dense
                    outlined
                    :model-value="value"
                    v-bind="field"
                    :error-message="errorMessage"
                    :error="!!errorMessage"
                    label="Sales/Job"
                  />
                </Field>
              </div>
              <div class="col-3">
                <Field
                  v-model="tmpForm.currency"
                  name="currency"
                  v-slot="{ errorMessage, value, field }"
                >
                  <q-input
                    dense
                    outlined
                    label="Currency"
                    :model-value="value"
                    v-bind="field"
                    :error-message="errorMessage"
                    :error="!!errorMessage"
                  />
                </Field>
              </div>
              <div class="col-3">
                <Field
                  v-model="tmpForm.creditterm"
                  name="creditterm"
                  v-slot="{ errorMessage, value, field }"
                >
                  <q-input
                    dense
                    outlined
                    label="Credit Terms"
                    :model-value="value"
                    v-bind="field"
                    :error-message="errorMessage"
                    :error="!!errorMessage"
                  />
                </Field>
              </div>
              <div class="col-3">
                <Field
                  v-model="tmpForm.project"
                  name="project"
                  v-slot="{ errorMessage, value, field }"
                >
                  <q-input
                    dense
                    outlined
                    label="Project"
                    :model-value="value"
                    v-bind="field"
                    :error-message="errorMessage"
                    :error="!!errorMessage"
                  />
                </Field>
              </div>
              <div class="col-3">
                <Field
                  v-model="tmpForm.site"
                  name="site"
                  v-slot="{ errorMessage, value, field }"
                  ><q-input
                    dense
                    outlined
                    label="Site"
                    :model-value="value"
                    v-bind="field"
                    :error-message="errorMessage"
                    :error="!!errorMessage"
                /></Field>
              </div>
              <div class="col-3">
                <q-input
                  dense
                  outlined
                  label="Remarks"
                  v-model="tmpForm.remark"
                />
              </div>
              <div class="col-12 tw-pt-5">
                <q-btn
                  unelevated
                  rounded
                  color="primary"
                  label="Next"
                  type="submit"
                />
              </div>
            </div>
          </Form>
        </q-step>

        <q-step
          :name="2"
          title="Detail Item"
          icon="create_new_folder"
          :done="step > 2"
        >
          <div class="row q-col-gutter-sm tw-px-3 tw-pb-3">
            <div class="col-12">
              <divider title="Header" />
            </div>
            <div class="col-3">
              <q-input
                dense
                outlined
                label="Purchase Order"
                v-model="tmpForm.nopo"
                readonly
              />
            </div>
            <div class="col-3">
              <q-input
                dense
                outlined
                label="Supplier"
                v-model="tmpForm.supplier"
                readonly
              />
            </div>
            <div class="col-3">
              <q-input
                dense
                outlined
                label=" Ship-To"
                v-model="tmpForm.shipto"
                readonly
              />
            </div>
          </div>
          <Form
            :validation-schema="schema2"
            @submit="onSubmit2"
            class="q-mt-md"
          >
            <div class="row q-col-gutter-sm tw-px-3 tw-pb-3">
              <div class="col-12">
                <divider title="Detail Item" />
              </div>
              <div class="col-1">
                <Field
                  v-model="tmpFormDet.line"
                  name="line"
                  v-slot="{ errorMessage, value, field }"
                >
                  <q-input
                    dense
                    outlined
                    label="Line"
                    type="number"
                    :model-value="value"
                    v-bind="field"
                    :error-message="errorMessage"
                    :error="!!errorMessage"
                    @blur="cekLinePo"
                  />
                </Field>
              </div>
              <div class="col-1">
                <Field
                  v-model="tmpFormDet.site"
                  name="site"
                  v-slot="{ errorMessage, value, field }"
                  ><q-input
                    dense
                    outlined
                    label="Site"
                    :model-value="value"
                    v-bind="field"
                    :error-message="errorMessage"
                    :error="!!errorMessage"
                /></Field>
              </div>
              <div class="col-2">
                <Field
                  v-model="tmpFormDet.req"
                  name="req"
                  v-slot="{ errorMessage, value, field }"
                  ><q-input
                    dense
                    outlined
                    label="Req"
                    :model-value="value"
                    v-bind="field"
                    :error-message="errorMessage"
                    :error="!!errorMessage"
                  >
                    <template v-slot:append>
                      <q-icon
                        name="search"
                        @click="dialogRo = true"
                        class="tw-cursor-pointer"
                      />
                    </template>
                  </q-input>
                </Field>
              </div>
              <div class="col-2">
                <Field
                  v-model="tmpFormDet.item"
                  name="item"
                  v-slot="{ errorMessage, value, field }"
                  ><q-input
                    dense
                    outlined
                    label="Item"
                    :model-value="value"
                    v-bind="field"
                    :error-message="errorMessage"
                    :error="!!errorMessage"
                  >
                    <template v-slot:append>
                      <q-icon
                        name="search"
                        @click="dialogItem = true"
                        class="tw-cursor-pointer"
                      />
                    </template>
                  </q-input>
                </Field>
              </div>
              <div class="col-2">
                <Field
                  v-model="tmpFormDet.qtyord"
                  name="qtyord"
                  v-slot="{ errorMessage, value, field }"
                >
                  <q-input
                    dense
                    outlined
                    label="Qty Ordered"
                    :model-value="value"
                    v-bind="field"
                    :error-message="errorMessage"
                    :error="!!errorMessage"
                  />
                </Field>
              </div>
              <div class="col-1">
                <q-input
                  dense
                  outlined
                  label="UM"
                  v-model="tmpFormDet.um"
                  readonly
                />
              </div>
              <div class="col-2">
                <Field
                  v-model="tmpFormDet.unitcost"
                  name="unitcost"
                  v-slot="{ errorMessage, value, field }"
                  ><q-input
                    dense
                    outlined
                    label="Unit Cost"
                    :model-value="value"
                    v-bind="field"
                    :error-message="errorMessage"
                    :error="!!errorMessage"
                    @blur="setExtCost"
                  />
                </Field>
              </div>
              <div class="col-1">
                <Field
                  v-model="tmpFormDet.dicspct"
                  name="dicspct"
                  v-slot="{ errorMessage, value, field }"
                >
                  <q-input
                    dense
                    outlined
                    label="Dist Pct"
                    :model-value="value"
                    v-bind="field"
                    :error-message="errorMessage"
                    :error="!!errorMessage"
                  />
                </Field>
              </div>

              <div class="col-12">
                <divider title="" />
              </div>
              <div class="col-3">
                <Field
                  v-model="tmpFormDet.location"
                  name="location"
                  v-slot="{ errorMessage, value, field }"
                >
                  <q-input
                    dense
                    outlined
                    label="Location"
                    :model-value="value"
                    v-bind="field"
                    :error-message="errorMessage"
                    :error="!!errorMessage"
                  />
                </Field>
              </div>
              <div class="col-3">
                <Field
                  v-model="tmpFormDet.duedate"
                  name="duedate"
                  v-slot="{ errorMessage, value, field }"
                >
                  <q-input
                    dense
                    outlined
                    label="Due Date"
                    :model-value="value"
                    v-bind="field"
                    :error-message="errorMessage"
                    :error="!!errorMessage"
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          ref="qDateProxy"
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            v-model="tmpFormDet.duedate"
                            mask="YYYY-MM-DD"
                            v-close-popup
                          >
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </Field>
              </div>
              <div class="col-3">
                <Field
                  v-model="tmpFormDet.taxable"
                  name="taxable"
                  v-slot="{ errorMessage, value, field }"
                >
                  <q-input
                    dense
                    outlined
                    label="Taxable"
                    :model-value="value"
                    v-bind="field"
                    :error-message="errorMessage"
                    :error="!!errorMessage"
                  />
                </Field>
              </div>
              <div class="col-3">
                <Field
                  v-model="tmpFormDet.extcost"
                  name="extcost"
                  v-slot="{ errorMessage, value, field }"
                >
                  <q-input
                    dense
                    outlined
                    label="Extended Net Cost"
                    :model-value="value"
                    v-bind="field"
                    :error-message="errorMessage"
                    :error="!!errorMessage"
                  />
                </Field>
              </div>
              <div class="col-3">
                <q-input dense outlined label="Remarks" />
              </div>
              <div class="col-12 tw-pt-5">
                <q-markup-table dense>
                  <thead>
                    <tr>
                      <th class="text-left">Line</th>
                      <th class="text-left">Site</th>
                      <th class="text-left">RO Number</th>
                      <th class="text-left">RO Line</th>
                      <th class="text-left">Item</th>
                      <th class="text-left">Item Desc</th>
                      <th class="text-right">Qty Ordered</th>
                      <th class="text-left">UM</th>
                      <th class="text-right">Unit Cost</th>
                      <th class="text-right">Dist Pct</th>
                      <th class="text-left">Location</th>
                      <th class="text-left">Due Date</th>
                      <th class="text-left">Taxable</th>
                      <th class="text-right">Extended Cost</th>
                      <th class="text-left">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(data, i) of tmpForm.detailItem"
                      :key="i"
                      @dblclick="setItem(data)"
                    >
                      <td>{{ data.line }}</td>
                      <td>{{ data.site }}</td>
                      <td>{{ data.req }}</td>
                      <td>{{ data.reqline }}</td>
                      <td>{{ data.item }}</td>
                      <td>{{ data.itemdesc }}</td>
                      <td class="text-right">{{ data.qtyord }}</td>
                      <td>{{ data.um }}</td>
                      <td class="text-right">{{ data.unitcost }}</td>
                      <td class="text-right">{{ data.dicspct }}</td>
                      <td>{{ data.location }}</td>
                      <td>{{ data.duedate }}</td>
                      <td>{{ data.taxable }}</td>
                      <td class="text-right">{{ data.extcost }}</td>
                      <td>{{ data.remark }}</td>
                    </tr>
                  </tbody>
                </q-markup-table>
              </div>
              <div class="col-12 tw-pt-5">
                <q-btn
                  unelevated
                  rounded
                  color="warning"
                  label="Simpan Detail"
                  type="submit"
                />
              </div>
              <div class="col-12 tw-pt-5">
                <q-btn
                  unelevated
                  rounded
                  color="primary"
                  label="Back"
                  @click="$refs.stepper.previous()"
                  class="tw-mr-1"
                />
                <q-btn
                  unelevated
                  rounded
                  color="primary"
                  label="Next"
                  @click="onSubmit3"
                />
              </div>
            </div>
          </Form>
        </q-step>

        <q-step :name="3" title="Preview" icon="assignment">
          <div class="row q-col-gutter-sm tw-px-3 tw-pb-3">
            <div class="col-12">
              <divider title="Header" />
            </div>
            <div class="col-3">
              <q-input
                dense
                outlined
                label="Purchase Order"
                v-model="tmpForm.nopo"
                readonly
              />
            </div>
            <div class="col-3">
              <q-input
                dense
                outlined
                label="Supplier"
                v-model="tmpForm.supplier"
                readonly
              />
            </div>
            <div class="col-3">
              <q-input
                dense
                outlined
                label=" Ship-To"
                v-model="tmpForm.shipto"
                readonly
              />
            </div>
          </div>

          <div class="row q-col-gutter-sm tw-px-3 tw-pb-3">
            <div class="col-12">
              <divider title="Detail" />
            </div>
            <div class="col-3">
              <q-input
                dense
                outlined
                label="Order Date"
                v-model="tmpForm.orderdate"
                readonly
              >
              </q-input>
            </div>
            <div class="col-3">
              <q-input
                dense
                outlined
                label="Due Date"
                v-model="tmpForm.duedate"
                readonly
              >
              </q-input>
            </div>
            <div class="col-3">
              <q-input
                dense
                outlined
                label="Buyer"
                v-model="tmpForm.buyer"
                readonly
              />
            </div>
            <div class="col-3">
              <q-input
                dense
                outlined
                label="Bill To"
                v-model="tmpForm.billto"
                readonly
              />
            </div>
            <div class="col-3">
              <q-input
                dense
                outlined
                label="Sales Job"
                v-model="tmpForm.salesjob"
                readonly
              />
            </div>
            <div class="col-3">
              <q-input
                dense
                outlined
                label="Currency"
                v-model="tmpForm.currency"
                readonly
              />
            </div>
            <div class="col-3">
              <q-input
                dense
                outlined
                label="Credit Terms"
                v-model="tmpForm.creditterm"
                readonly
              />
            </div>
            <div class="col-3">
              <q-input
                dense
                outlined
                label="Project"
                v-model="tmpForm.project"
                readonly
              />
            </div>
            <div class="col-3">
              <q-input
                dense
                outlined
                label="Site"
                v-model="tmpForm.site"
                readonly
              />
            </div>
            <div class="col-3">
              <q-input
                dense
                outlined
                label="Remarks"
                v-model="tmpForm.remark"
                readonly
              />
            </div>
            <div class="col-12">
              <divider title="Detail Item" />
            </div>
            <div class="col-12 tw-pt-10">
              <q-markup-table dense>
                <thead>
                  <tr>
                    <th class="text-left">Line</th>
                    <th class="text-left">Site</th>
                    <th class="text-left">RO Number</th>
                    <th class="text-left">RO Line</th>
                    <th class="text-left">Item</th>
                    <th class="text-left">Item Desc</th>
                    <th class="text-right">Qty Ordered</th>
                    <th class="text-left">UM</th>
                    <th class="text-right">Unit Cost</th>
                    <th class="text-right">Dist Pct</th>
                    <th class="text-left">Location</th>
                    <th class="text-left">Due Date</th>
                    <th class="text-left">Taxable</th>
                    <th class="text-right">Extended Cost</th>
                    <th class="text-left">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(data, i) of tmpForm.detailItem"
                    :key="i"
                    @dblclick="setItem(data)"
                  >
                    <td>{{ data.line }}</td>
                    <td>{{ data.site }}</td>
                    <td>{{ data.req }}</td>
                    <td>{{ data.reqline }}</td>
                    <td>{{ data.item }}</td>
                    <td>{{ data.itemdesc }}</td>
                    <td class="text-right">{{ data.qtyord }}</td>
                    <td>{{ data.um }}</td>
                    <td class="text-right">{{ data.unitcost }}</td>
                    <td class="text-right">{{ data.dicspct }}</td>
                    <td>{{ data.location }}</td>
                    <td>{{ data.duedate }}</td>
                    <td>{{ data.taxable }}</td>
                    <td class="text-right">{{ data.extcost }}</td>
                    <td>{{ data.remark }}</td>
                  </tr>
                </tbody>
              </q-markup-table>
            </div>
            <div class="col-12 tw-pt-5">
              <q-btn
                unelevated
                rounded
                color="primary"
                label="Back"
                @click="$refs.stepper.previous()"
                class="tw-mr-1"
              />

              <q-btn
                unelevated
                rounded
                color="primary"
                label="Next"
                @click="save"
              />
            </div>
          </div>
        </q-step>

        <!-- <template v-slot:navigation>
          <q-stepper-navigation>
            <q-btn
              @click="$refs.stepper.next()"
              color="primary"
              :label="step === 4 ? 'Finish' : 'Continue'"
            />
            <q-btn
              v-if="step > 1"
              flat
              color="primary"
              @click="$refs.stepper.previous()"
              label="Back"
              class="q-ml-sm"
            />
          </q-stepper-navigation>
        </template> -->
      </q-stepper>

      <q-separator />

      <q-card-section> </q-card-section>
    </q-card>

    <item-browse
      v-if="dialogItem"
      :dialog="dialogItem"
      @getValue="setValueItem"
    />
    <ro-browse v-if="dialogRo" :dialog="dialogRo" @getValue="setValueRo" />
  </div>
</template>

<script setup>
import * as dayjs from "dayjs";
import { ref, onMounted, reactive } from "vue";
import { api } from "src/boot/axios";
import { ParseError, domain, role, empid } from "src/utils";
import { useQuasar } from "quasar";
import { Field, Form } from "vee-validate";
import * as yup from "yup";

import Divider from "./../components/Divider.vue";
import ItemBrowse from "./../components/ItemBrowse.vue";
import RoBrowse from "./../components/RoBrowse.vue";

const columns = [
  {
    name: "domain",
    required: true,
    label: "Domain",
    align: "left",
    field: "domain",
    sortable: true,
  },
  {
    name: "code",
    required: true,
    label: "Site",
    align: "left",
    field: "code",
    sortable: true,
  },
  {
    name: "desc",
    required: true,
    label: "Deskripsi",
    align: "left",
    field: "desc",
    sortable: true,
  },
  {
    name: "aksi",
    required: true,
    label: "Aksi",
    align: "left",
    field: "aksi",
  },
];
const $q = useQuasar();
const step = ref(1);
const listSite = ref([]);
const listDomain = ref([]);
const loading = ref(false);
const dialogForm = ref(false);
const dialogItem = ref(false);
const dialogRo = ref(false);
const schema1 = yup.object({
  nopo: yup.string().required().label("nopo"),
  supplier: yup.string().required().label("supplier"),
  shipto: yup.string().required().label("shipto"),
  orderdate: yup.string().required().label("orderdate"),
  duedate: yup.string().required().label("duedate"),
  buyer: yup.string().required().label("buyer"),
  billto: yup.string().required().label("billto"),
  salesjob: yup.string().required().label("salesjob"),
  currency: yup.string().required().label("currency"),
  creditterm: yup.string().required().label("creditterm"),
  project: yup.string().required().label("project"),
  site: yup.string().required().label("site"),
});
const schema2 = yup.object({
  line: yup.string().required().label("line"),
  site: yup.number().required().integer().label("site"),
  req: yup.string().required().label("req"),
  item: yup.string().required().label("item"),
  qtyord: yup.number().integer().required().label("qtyord"),
  unitcost: yup.number().required().label("unitcost"),
  dicspct: yup.number().label("dicspct"),
  location: yup.string().required().label("location"),
  duedate: yup.date().required().label("duedate"),
  taxable: yup.string().required().label("taxable"),
  extcost: yup.string().required().label("extcost"),
});
const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10,
  filter: null,
  domain: domain(),
});
const tmpForm = reactive({
  domain: domain(),
  nopo: "",
  supplier: "",
  shipto: "",
  orderdate: dayjs(Date.now()).format("YYYY-MM-DD"),
  duedate: dayjs(Date.now()).format("YYYY-MM-DD"),
  buyer: "",
  billto: "",
  salesjob: "",
  currency: "",
  creditterm: "",
  project: "",
  site: "",
  remark: "",
  detailItem: [],
});

const tmpFormDet = reactive({
  line: "",
  site: "",
  req: "",
  reqline: "",
  item: "",
  itemdesc: "",
  qtyord: "",
  um: "",
  unitcost: "",
  dicspct: 0,
  location: "",
  duedate: dayjs(Date.now()).format("YYYY-MM-DD"),
  taxable: "",
  extcost: "",
  remark: "",
});

const onSubmit1 = async (values, actions) => {
  try {
    console.log(values);
    console.log(actions);
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

const onSubmit2 = async (values, actions) => {
  try {
    let cek = tmpForm.detailItem.findIndex(
      (element) => element.line == tmpFormDet.line
    );
    if (cek >= 0) {
      for (const key in tmpFormDet) {
        tmpForm.detailItem[cek][key] = tmpFormDet[key];
      }

      $q.notify({
        type: "positive",
        message: `Data PO untuk line ${tmpFormDet.line} berhasil diupdate`,
      });
    } else {
      tmpForm.detailItem.push({ ...tmpFormDet });
      $q.notify({
        type: "positive",
        message: `Data PO untuk line ${tmpFormDet.line} berhasil disimpan`,
      });
    }
    tmpFormDet.line = "";
    resetDet();
    actions.resetForm();
    console.log(tmpFormDet);
  } catch (error) {
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const onSubmit3 = async () => {
  if (tmpForm.detailItem.length > 0) {
    step.value = 3;
  } else {
    $q.notify({
      type: "negative",
      message: "Data detail item belum tersedia",
    });
  }
};

const save = async () => {
  $q.dialog({
    title: "Konfirmasi",
    message: `Apakah anda yakin ingin proses data ini ?`,
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
      await api.post("savePo", value);
      $q.notify({
        type: "positive",
        message: `PO berhasil dihapus`,
        html: true,
      });
      await getSite();
    } catch (error) {
      $q.notify({
        type: "negative",
        message: ParseError(error),
      });
    }
  });
};

const setValueItem = (value) => {
  console.log(value);
  tmpFormDet.item = value.idqad;
  tmpFormDet.itemdesc = value.nmprod;
  tmpFormDet.um = value.satuan;
  dialogItem.value = false;
};

const setValueRo = (value) => {
  console.log(value);
  tmpFormDet.req = value.rqm_nbr;
  tmpFormDet.qtyord = value.rqd_req_qty;
  tmpFormDet.reqline = value.rqd_line;
  tmpFormDet.item = value.rqd_part;
  tmpFormDet.itemdesc = value.nmprod;
  tmpFormDet.um = value.satuan;
  tmpFormDet.location = value.rqd_loc;
  dialogRo.value = false;
};

const setExtCost = () => {
  tmpFormDet.extcost =
    parseFloat(tmpFormDet.qtyord) * parseFloat(tmpFormDet.unitcost);
};

const cekLinePo = () => {
  let cek = tmpForm.detailItem.findIndex(
    (element) => element.line == tmpFormDet.line
  );
  if (cek >= 0) {
    let data = tmpForm.detailItem[cek];
    for (const key in data) {
      tmpFormDet[key] = data[key];
    }
  } else {
    resetDet();
  }
};

const resetDet = () => {
  tmpFormDet.site = "";
  tmpFormDet.req = "";
  tmpFormDet.reqline = "";
  tmpFormDet.item = "";
  tmpFormDet.itemdesc = "";
  tmpFormDet.qtyord = "";
  tmpFormDet.um = "";
  tmpFormDet.unitcost = "";
  tmpFormDet.dicspct = 0;
  tmpFormDet.location = "";
  tmpFormDet.duedate = dayjs(Date.now()).format("YYYY-MM-DD");
  tmpFormDet.taxable = "";
  tmpFormDet.extcost = "";
  tmpFormDet.site = "";
  tmpFormDet.remark = "";
};
</script>