<template>
  <div class="q-pa-lg">
    <q-card maximized>
      <q-card-section>
        <q-btn push color="primary" to="/econtract-kontrakclose" icon="undo"
          ><q-tooltip class="bg-primary text-body2" :offset="[10, 10]">
            Back
          </q-tooltip></q-btn
        >
        &nbsp;
        <q-btn
          push
          color="positive"
          icon="picture_as_pdf"
          @click="pdfDownload(tmpForm.trn_code, tmpForm.id)"
          ><q-tooltip class="bg-positive text-body2" :offset="[10, 10]">
            Download PDF
          </q-tooltip></q-btn
        >
      </q-card-section>

      <q-separator />

      <!-- <q-card-section> -->
      <q-card maximized>
        <q-card-section>
          <div class="text-h6">Detail Kontrak</div>
        </q-card-section>
        <q-separator />
        <!-- <q-card-section maximized class="scroll"> -->
        <q-card-section maximized id="pdf-content">
          <div class="row q-col-gutter" style="border: 1px solid">
            <div
              class="col-6"
              style="border-right: 1px solid; border-bottom: 1px solid"
            >
              <img
                src="./../../../../../public/dbc.jpeg"
                width="130"
                class="tw-m-auto"
                alt=""
              />
            </div>
            <div
              class="col-6"
              style="
                display: flex;
                border-right: 1px solid;
                border-bottom: 1px solid;
                align-items: center;
              "
            >
              <span style="text-align: center; width: 100%; font-size: 24px"
                >FORM PENGAJUAN PEMBUATAN DOKUMEN KERJASAMA DENGAN VENDOR</span
              >
            </div>
            <div
              class="col-6"
              style="
                display: flex;
                border-right: 1px solid;
                border-bottom: 1px solid;
                align-items: center;
              "
            >
              <span
                style="
                  text-align: center;
                  width: 100%;
                  font-size: 24px;
                  padding-bottom: 10px;
                "
                >PT. WAHANA DUTA JAYA RUCIKA</span
              >
            </div>
            <div
              class="col-6"
              style="
                border-right: 1px solid;
                border-bottom: 1px solid;
                align-items: center;
              "
            >
              &nbsp;
            </div>
            <div
              class="col-6"
              style="
                display: flex;
                border-right: 1px solid;
                border-bottom: 1px solid;
                align-items: center;
                padding-bottom: 10px;
              "
            >
              <span style="text-align: center; width: 100%; font-size: 24px"
                >Dok : F-PROC-03</span
              >
            </div>
            <div
              class="col-6"
              style="
                border-right: 1px solid;
                border-bottom: 1px solid;
                align-items: center;
              "
            >
              <div class="col-12">
                <div
                  class="row"
                  style="display: flex; align-items: center; height: 50px"
                >
                  <div
                    class="col-3"
                    style="
                      display: flex;
                      align-items: center;
                      border-bottom: 1px solid;
                      border: 1px solid;
                      height: 100%;
                    "
                  >
                    <span style="text-align: center; width: 100%"
                      >Revisi : 0</span
                    >
                  </div>
                  <div
                    class="col-5"
                    style="
                      display: flex;
                      align-items: center;
                      border-bottom: 1px solid;
                      border: 1px solid;
                      height: 100%;
                    "
                  >
                    <span style="text-align: center; width: 100%"
                      >Tgl Efektif : {{ formattedDate2(new Date()) }}</span
                    >
                  </div>
                  <div
                    class="col-4"
                    style="
                      display: flex;
                      align-items: center;
                      border-bottom: 1px solid;
                      border: 1px solid;
                      height: 100%;
                    "
                  >
                    <span style="text-align: center; width: 100%"
                      >Hal : 1 dari 1</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row" style="border: 1px solid; background-color: grey">
            <div
              class="col-12"
              style="
                padding-left: 5px;
                display: flex;
                align-items: center;
                padding-bottom: 10px;
              "
            >
              <span style="text-align: center; font-size: 16px"
                >Diajukan (Purchasing)</span
              >
            </div>
          </div>
          <div class="row q-col-gutter" style="border: 1px solid">
            <div
              class="col-1"
              style="
                padding-left: 5px;
                display: flex;
                align-items: center;
                border-right: 1px solid;
                padding-bottom: 10px;
              "
            >
              <span style="text-align: center; font-size: 16px">PIC</span>
            </div>
            <div
              class="col-4"
              style="
                padding-left: 5px;
                display: flex;
                align-items: center;
                border-right: 1px solid;
                padding-bottom: 10px;
              "
            >
              <span style="text-align: center; font-size: 16px">{{
                listempdmspic.employee_name
              }}</span>
            </div>
            <div
              class="col-1"
              style="
                padding-left: 5px;
                display: flex;
                align-items: center;
                border-right: 1px solid;
                padding-bottom: 10px;
              "
            >
              <span style="text-align: center; font-size: 16px"
                >Bisnis Unit</span
              >
            </div>
            <div
              class="col-4"
              style="
                padding-left: 5px;
                display: flex;
                align-items: center;
                border-right: 1px solid;
                padding-bottom: 10px;
              "
            >
              <span style="text-align: center; font-size: 16px">{{
                tmpForm.bucode
              }}</span>
            </div>
          </div>

          <div
            class="row q-col-gutter"
            style="border: 1px solid; background-color: grey"
          >
            <div
              class="col-3"
              style="
                padding-left: 5px;
                display: flex;
                align-items: center;
                border-right: 1px solid;
                padding-bottom: 10px;
              "
            >
              <span style="text-align: center; font-size: 16px">Kategori</span>
            </div>
            <div
              class="col-9"
              style="
                padding-left: 5px;
                display: flex;
                align-items: center;
                padding-bottom: 10px;
              "
            >
              <span style="text-align: center; font-size: 16px"
                >Mengajukan untuk pembuatan Dokumen Kontrak dengan detail:</span
              >
            </div>
          </div>

          <div class="row q-col-gutter" style="border: 1px solid">
            <div class="col-3" style="padding-left: 5px">
              <div class="col-12">
                <div class="row q-col-gutter">
                  <div
                    class="col-9"
                    style="
                      padding-left: 5px;
                      display: flex;
                      align-items: center;
                      border-right: 1px solid;
                      border-bottom: 1px solid;
                      padding-bottom: 10px;
                    "
                  >
                    <span style="text-align: center; font-size: 16px"
                      >Baru</span
                    >
                  </div>
                  <div
                    class="col-3"
                    style="
                      padding-left: 5px;
                      display: flex;
                      justify-content: center;
                      border-right: 1px solid;
                      border-bottom: 1px solid;
                      padding-bottom: 10px;
                    "
                  >
                    <span
                      v-if="tmpForm.trn_kategori === 'Baru'"
                      class="material-icons"
                      style="text-align: center; font-size: 16px"
                    >
                      done
                    </span>
                  </div>
                </div>
              </div>
              <div class="col-12">
                <div class="row q-col-gutter">
                  <div
                    class="col-9"
                    style="
                      padding-left: 5px;
                      display: flex;
                      align-items: center;
                      border-right: 1px solid;
                      border-bottom: 1px solid;
                      padding-bottom: 10px;
                    "
                  >
                    <span style="text-align: center; font-size: 16px"
                      >Renewal</span
                    >
                  </div>
                  <div
                    class="col-3"
                    style="
                      padding-left: 5px;
                      display: flex;
                      justify-content: center;
                      border-right: 1px solid;
                      border-bottom: 1px solid;
                      padding-bottom: 10px;
                    "
                  >
                    <span
                      v-if="tmpForm.trn_kategori === 'Renewal'"
                      class="material-icons"
                      style="text-align: center; font-size: 16px"
                    >
                      done
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="col-9"
              style="
                padding-left: 5px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-right: 1px solid;
                padding-bottom: 10px;
              "
            >
              <span style="text-align: center; font-size: 16px">{{
                tmpForm.trn_mengajukan
              }}</span>
            </div>
          </div>

          <div class="row q-col-gutter" style="border: 1px solid">
            <div
              class="col-3"
              style="
                padding-left: 5px;
                display: flex;
                align-items: center;
                border-right: 1px solid;
                padding-bottom: 10px;
                background-color: grey;
              "
            >
              <span style="text-align: center; font-size: 16px"
                >Masa Berlaku Kontrak</span
              >
            </div>
            <div
              class="col-1"
              style="
                padding-left: 5px;
                display: flex;
                align-items: center;
                padding-bottom: 10px;
                border-right: 1px solid;
              "
            >
              <span style="text-align: center; font-size: 16px">Dari</span>
            </div>
            <div
              class="col-3"
              style="
                padding-left: 5px;
                display: flex;
                align-items: center;
                padding-bottom: 10px;
                border-right: 1px solid;
              "
            >
              <span style="text-align: center; font-size: 16px">{{
                formattedDate2(tmpForm.trn_date_startreal)
              }}</span>
            </div>
            <div
              class="col-1"
              style="
                padding-left: 5px;
                display: flex;
                align-items: center;
                padding-bottom: 10px;
                border-right: 1px solid;
              "
            >
              <span style="text-align: center; font-size: 16px">Sampai</span>
            </div>
            <div
              class="col-4"
              style="
                padding-left: 5px;
                display: flex;
                align-items: center;
                padding-bottom: 10px;
              "
            >
              <span style="text-align: center; font-size: 16px">{{
                formattedDate2(tmpForm.trn_date_endreal)
              }}</span>
            </div>
          </div>

          <div
            class="row q-col-gutter"
            style="border: 1px solid; background-color: grey"
          >
            <div
              class="col-12"
              style="
                padding-left: 5px;
                display: flex;
                align-items: center;
                border-right: 1px solid;
                padding-bottom: 10px;
              "
            >
              <span style="text-align: center; font-size: 16px"
                >Kelengkapan data kontrak</span
              >
            </div>
          </div>

          <div class="row q-col-gutter" style="border: 1px solid">
            <div class="col-4" style="padding-left: 5px; margin-bottom: 10px">
              <span style="font-size: 16px; text-align: center"
                >Nama Vendor</span
              >
            </div>
            <div class="col-8">
              <div class="row">
                <div
                  class="col-12"
                  style="
                    font-size: 16px;
                    border-bottom: 1px solid;
                    padding-bottom: 10px;
                  "
                >
                  {{ tmpForm.trn_vendor_name }}
                </div>
              </div>
            </div>

            <div class="col-4" style="padding-left: 5px; margin-bottom: 10px">
              <span style="font-size: 16px; text-align: center"
                >Alamat Vendor</span
              >
            </div>
            <div class="col-8">
              <div class="row">
                <div
                  class="col-12"
                  style="
                    font-size: 16px;
                    border-bottom: 1px solid;
                    padding-bottom: 10px;
                  "
                >
                  {{ tmpForm.trn_vendor_address }}
                </div>
              </div>
            </div>

            <div class="col-4" style="padding-left: 5px; margin-bottom: 10px">
              <span style="font-size: 16px; text-align: center"
                >Nama Pendatanganan Kontrak</span
              >
            </div>
            <div class="col-8">
              <div class="row">
                <div
                  class="col-12"
                  style="
                    font-size: 16px;
                    border-bottom: 1px solid;
                    padding-bottom: 10px;
                  "
                >
                  {{
                    tmpForm.trn_vendor_pendatangan_name
                      ? tmpForm.trn_vendor_pendatangan_name
                      : "-"
                  }}
                </div>
              </div>
            </div>

            <div class="col-4" style="padding-left: 5px; margin-bottom: 10px">
              <span style="font-size: 16px; text-align: center"
                >Jabatan Pendatanganan Kontrak</span
              >
            </div>
            <div class="col-8">
              <div class="row">
                <div
                  class="col-12"
                  style="
                    font-size: 16px;
                    border-bottom: 1px solid;
                    padding-bottom: 10px;
                  "
                >
                  {{
                    tmpForm.trn_vendor_pendatangan_jabatan
                      ? tmpForm.trn_vendor_pendatangan_jabatan
                      : "-"
                  }}
                </div>
              </div>
            </div>

            <div class="col-4" style="padding-left: 5px; margin-bottom: 10px">
              <span style="font-size: 16px; text-align: center"
                >Email Pendatanganan Kontrak</span
              >
            </div>
            <div class="col-8">
              <div class="row">
                <div
                  class="col-12"
                  style="
                    font-size: 16px;
                    border-bottom: 1px solid;
                    padding-bottom: 10px;
                  "
                >
                  {{
                    tmpForm.trn_vendor_pendatangan_email
                      ? tmpForm.trn_vendor_pendatangan_email
                      : "-"
                  }}
                </div>
              </div>
            </div>

            <div class="col-4" style="padding-left: 5px; margin-bottom: 10px">
              <span style="font-size: 16px; text-align: center"
                >(penggunaan eMaterai)</span
              >
            </div>
            <div class="col-8">
              <div class="row">
                <div
                  class="col-12"
                  style="
                    font-size: 16px;
                    border-bottom: 1px solid;
                    padding-bottom: 10px;
                  "
                >
                  {{
                    tmpForm.trn_vendor_pendatangan_jabatan
                      ? tmpForm.trn_vendor_pendatangan_jabatan
                      : "-"
                  }}
                </div>
              </div>
            </div>

            <div class="col-4" style="padding-left: 5px; margin-bottom: 10px">
              <span style="font-size: 16px; text-align: center"
                >No. Rekening Perusahaan</span
              >
            </div>
            <div class="col-8">
              <div class="row">
                <div
                  class="col-12"
                  style="
                    font-size: 16px;
                    border-bottom: 1px solid;
                    padding-bottom: 10px;
                  "
                >
                  {{
                    tmpForm.trn_vendor_rekno ? tmpForm.trn_vendor_rekno : "-"
                  }}
                </div>
              </div>
            </div>

            <div class="col-4" style="padding-left: 5px; margin-bottom: 10px">
              <span style="font-size: 16px; text-align: center"
                >Nama Rekening Bank</span
              >
            </div>
            <div class="col-8">
              <div class="row">
                <div
                  class="col-12"
                  style="
                    font-size: 16px;
                    border-bottom: 1px solid;
                    padding-bottom: 10px;
                  "
                >
                  {{
                    tmpForm.trn_vendor_rekname
                      ? tmpForm.trn_vendor_rekname
                      : "-"
                  }}
                </div>
              </div>
            </div>

            <div class="col-4" style="padding-left: 5px; margin-bottom: 10px">
              <span style="font-size: 16px; text-align: center">Nama Bank</span>
            </div>
            <div class="col-8">
              <div class="row">
                <div
                  class="col-12"
                  style="
                    font-size: 16px;
                    border-bottom: 1px solid;
                    padding-bottom: 10px;
                  "
                >
                  {{
                    tmpForm.trn_vendor_rekbank
                      ? tmpForm.trn_vendor_rekbank
                      : "-"
                  }}
                </div>
              </div>
            </div>

            <div class="col-4" style="padding-left: 5px; margin-bottom: 10px">
              <span style="font-size: 16px; text-align: center"
                >Kantor Cabang Bank</span
              >
            </div>
            <div class="col-8">
              <div class="row">
                <div
                  class="col-12"
                  style="
                    font-size: 16px;
                    border-bottom: 1px solid;
                    padding-bottom: 10px;
                  "
                >
                  {{
                    tmpForm.trn_vendor_rekcabang
                      ? tmpForm.trn_vendor_rekcabang
                      : "-"
                  }}
                </div>
              </div>
            </div>
          </div>

          <div
            class="row q-col-gutter"
            style="border: 1px solid; background-color: grey"
          >
            <div
              class="col-12"
              style="
                padding-left: 5px;
                display: flex;
                align-items: center;
                border-right: 1px solid;
                padding-bottom: 10px;
              "
            >
              <span style="text-align: center; font-size: 16px"
                >PIC Vendor</span
              >
            </div>
          </div>

          <div class="row q-col-gutter" style="border: 1px solid">
            <div
              class="col-12"
              style="
                padding-left: 5px;
                display: flex;
                align-items: center;
                border-right: 1px solid;
                padding-bottom: 10px;
                width: 100%;
              "
            >
              <div class="q-pa-md" style="width: 100%">
                <q-table
                  :rows="listKontakVendor"
                  :columns="columnKontakVendor"
                  row-key="id"
                  v-model:pagination="pagination"
                  :loading="loading"
                  :filter="pagination.filter"
                  :rows-per-page-options="[0]"
                  @request="onRequest"
                  binary-state-sort
                  hide-bottom
                >
                  <template v-slot:body-cell-No="props">
                    <q-td :props="props">
                      {{ props.rowIndex + 1 }}
                    </q-td>
                  </template>
                  <template v-slot:body-cell-top_kategori="props">
                    <q-td :props="props">
                      <div
                        style="
                          max-height: 200px;
                          overflow-y: auto;
                          white-space: pre-line;
                        "
                      >
                        {{ props.row.top_kategori }}
                      </div>
                    </q-td>
                  </template>
                  <template v-slot:body-cell-top_desc="props">
                    <q-td :props="props">
                      <div
                        style="
                          max-height: 200px;
                          overflow-y: auto;
                          white-space: pre-line;
                        "
                      >
                        {{ props.row.top_desc }}
                      </div>
                    </q-td>
                  </template>
                  <template v-slot:body-cell-aksi="props">
                    <q-td :props="props">
                      <q-btn-group push>
                        <q-btn
                          dense
                          color="info"
                          class="text-weight-regular text-caption"
                          @click="editAplikasi(props.row)"
                          push
                          v-b-tooltip.hover
                          title="Edit"
                          icon="edit"
                        />
                        <q-btn
                          dense
                          color="negative"
                          class="text-weight-regular text-caption"
                          @click="deleteAplikasi(props.row)"
                          push
                          v-b-tooltip.hover
                          title="Delete"
                          icon="delete"
                        />
                      </q-btn-group>
                    </q-td>
                  </template>
                </q-table>
              </div>
            </div>
          </div>

          <div
            class="row q-col-gutter"
            style="border: 1px solid; background-color: grey"
          >
            <div
              class="col-12"
              style="
                padding-left: 5px;
                display: flex;
                align-items: center;
                border-right: 1px solid;
                padding-bottom: 10px;
              "
            >
              <span style="text-align: center; font-size: 16px">PIC User</span>
            </div>
          </div>

          <div class="row q-col-gutter" style="border: 1px solid">
            <div
              class="col-12"
              style="
                padding-left: 5px;
                display: flex;
                align-items: center;
                border-right: 1px solid;
                padding-bottom: 10px;
                width: 100%;
              "
            >
              <div class="q-pa-md" style="width: 100%">
                <q-table
                  :rows="listPicUser"
                  :columns="columnPicUser"
                  row-key="id"
                  v-model:pagination="pagination"
                  :loading="loading"
                  :filter="pagination.filter"
                  :rows-per-page-options="[0]"
                  @request="onRequest"
                  binary-state-sort
                  hide-bottom
                >
                  <template v-slot:body-cell-No="props">
                    <q-td :props="props">
                      {{ props.rowIndex + 1 }}
                    </q-td>
                  </template>
                  <template v-slot:body-cell-top_kategori="props">
                    <q-td :props="props">
                      <div
                        style="
                          max-height: 200px;
                          overflow-y: auto;
                          white-space: pre-line;
                        "
                      >
                        {{ props.row.top_kategori }}
                      </div>
                    </q-td>
                  </template>
                  <template v-slot:body-cell-top_desc="props">
                    <q-td :props="props">
                      <div
                        style="
                          max-height: 200px;
                          overflow-y: auto;
                          white-space: pre-line;
                        "
                      >
                        {{ props.row.top_desc }}
                      </div>
                    </q-td>
                  </template>
                  <template v-slot:body-cell-aksi="props">
                    <q-td :props="props">
                      <q-btn-group push>
                        <q-btn
                          dense
                          color="info"
                          class="text-weight-regular text-caption"
                          @click="editAplikasi(props.row)"
                          push
                          v-b-tooltip.hover
                          title="Edit"
                          icon="edit"
                        />
                        <q-btn
                          dense
                          color="negative"
                          class="text-weight-regular text-caption"
                          @click="deleteAplikasi(props.row)"
                          push
                          v-b-tooltip.hover
                          title="Delete"
                          icon="delete"
                        />
                      </q-btn-group>
                    </q-td>
                  </template>
                </q-table>
              </div>
            </div>
          </div>

          <div
            class="row q-col-gutter"
            style="border: 1px solid; background-color: grey"
          >
            <div
              class="col-12"
              style="
                padding-left: 5px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-right: 1px solid;
                padding-bottom: 10px;
              "
            >
              <span style="text-align: center; font-size: 16px"
                >Persetujuan</span
              >
            </div>
          </div>

          <div class="row q-col-gutter" style="border: 1px solid">
            <div
              class="col-12"
              style="
                padding-left: 5px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-right: 1px solid;
                padding-bottom: 10px;
                width: 100%;
              "
            >
              <div class="q-pa-md" style="width: 100%">
                <table
                  style="
                    width: 100%;
                    border: 1px solid black;
                    border-collapse: collapse;
                  "
                >
                  <thead>
                    <tr>
                      <th
                        class="text-center"
                        style="border: 1px solid black; padding-bottom: 10px"
                      >
                        Pricing Officer
                      </th>
                      <th
                        class="text-center"
                        style="border: 1px solid black; padding-bottom: 10px"
                      >
                        Section Head
                      </th>
                      <th
                        class="text-center"
                        style="border: 1px solid black; padding-bottom: 10px"
                      >
                        Departement Head
                      </th>
                      <th
                        class="text-center"
                        style="border: 1px solid black; padding-bottom: 10px"
                      >
                        Section Head
                      </th>
                      <th
                        class="text-center"
                        style="border: 1px solid black; padding-bottom: 10px"
                      >
                        Departement Head
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td
                        style="
                          text-align: center;
                          border: 1px solid black;
                          padding-bottom: 10px;
                        "
                      >
                        {{ listApprover[0]?.hist_approved_name }}
                      </td>
                      <td
                        style="
                          text-align: center;
                          border: 1px solid black;
                          padding-bottom: 10px;
                        "
                      >
                        {{ listApprover[1]?.hist_approved_name }}
                      </td>
                      <td
                        style="
                          text-align: center;
                          border: 1px solid black;
                          padding-bottom: 10px;
                        "
                      >
                        {{ listApprover[2]?.hist_approved_name }}
                      </td>
                      <td
                        style="
                          text-align: center;
                          border: 1px solid black;
                          padding-bottom: 10px;
                        "
                      >
                        {{ listApprover[3]?.hist_approved_name }}
                      </td>
                      <td
                        style="
                          text-align: center;
                          border: 1px solid black;
                          padding-bottom: 10px;
                        "
                      >
                        {{ listApprover[4]?.hist_approved_name }}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="
                          text-align: center;
                          border: 1px solid black;
                          padding-bottom: 10px;
                        "
                      >
                        {{ listApprover[0]?.hist_level_name }}
                      </td>
                      <td
                        style="
                          text-align: center;
                          border: 1px solid black;
                          padding-bottom: 10px;
                        "
                      >
                        {{ listApprover[1]?.hist_level_name }}
                      </td>
                      <td
                        style="
                          text-align: center;
                          border: 1px solid black;
                          padding-bottom: 10px;
                        "
                      >
                        {{ listApprover[2]?.hist_level_name }}
                      </td>
                      <td
                        style="
                          text-align: center;
                          border: 1px solid black;
                          padding-bottom: 10px;
                        "
                      >
                        {{ listApprover[3]?.hist_level_name }}
                      </td>
                      <td
                        style="
                          text-align: center;
                          border: 1px solid black;
                          padding-bottom: 10px;
                        "
                      >
                        {{ listApprover[4]?.hist_level_name }}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="
                          text-align: center;
                          border: 1px solid black;
                          padding-bottom: 10px;
                        "
                      >
                        {{
                          listApprover[0]?.hist_approved_date != ""
                            ? formattedDate(listApprover[0]?.hist_approved_date)
                            : ""
                        }}
                      </td>
                      <td
                        style="
                          text-align: center;
                          border: 1px solid black;
                          padding-bottom: 10px;
                        "
                      >
                        {{
                          listApprover[1]?.hist_approved_date != ""
                            ? formattedDate(listApprover[1]?.hist_approved_date)
                            : ""
                        }}
                      </td>
                      <td
                        style="
                          text-align: center;
                          border: 1px solid black;
                          padding-bottom: 10px;
                        "
                      >
                        {{
                          listApprover[2]?.hist_approved_date != ""
                            ? formattedDate(listApprover[2]?.hist_approved_date)
                            : ""
                        }}
                      </td>
                      <td
                        style="
                          text-align: center;
                          border: 1px solid black;
                          padding-bottom: 10px;
                        "
                      >
                        {{
                          listApprover[3]?.hist_approved_date != ""
                            ? formattedDate(listApprover[3]?.hist_approved_date)
                            : ""
                        }}
                      </td>
                      <td
                        style="
                          text-align: center;
                          border: 1px solid black;
                          padding-bottom: 10px;
                        "
                      >
                        {{
                          listApprover[4]?.hist_approved_date != ""
                            ? formattedDate(listApprover[4]?.hist_approved_date)
                            : ""
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="row q-col-gutter" style="border: 1px solid">
            <div
              class="col-3"
              style="
                padding-left: 5px;
                display: flex;
                align-items: center;
                border-right: 1px solid;
                padding-bottom: 10px;
                background-color: grey;
              "
            >
              <span style="text-align: center; font-size: 16px"
                >Nomor Kontrak</span
              >
            </div>
            <div
              class="col-9"
              style="
                padding-left: 5px;
                display: flex;
                align-items: center;
                padding-bottom: 10px;
              "
            >
              <span style="text-align: center; font-size: 16px">{{
                tmpForm.trn_nocontract
              }}</span>
            </div>
          </div>

          <div
            class="row q-col-gutter"
            style="border: 1px solid; background-color: grey"
          >
            <div
              class="col-12"
              style="
                padding-left: 5px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-right: 1px solid;
                padding-bottom: 10px;
              "
            >
              <span style="text-align: center; font-size: 16px"
                >Catatan Tambahan</span
              >
            </div>
          </div>

          <div class="row q-col-gutter" style="border: 1px solid">
            <div class="col-12" style="padding-left: 5px; margin-bottom: 10px">
              <span style="font-size: 16px; text-align: center"
                >ASPEK K3 : apakah pernah ada isu K3 sebelumnya dengan vendor?
                (Jika iya, mohon dijelaskan dinote alasan menggunakan vendor
                tersebut)</span
              >
            </div>
          </div>
          <div class="row q-col-gutter" style="border: 1px solid">
            <div class="col-3" style="padding-left: 5px">
              <div class="col-12">
                <div class="row q-col-gutter">
                  <div
                    class="col-4"
                    style="
                      padding-left: 5px;
                      display: flex;
                      align-items: center;
                      border-right: 1px solid;
                      border-bottom: 1px solid;
                      padding-bottom: 10px;
                    "
                  >
                    <span style="text-align: center; font-size: 16px">YA</span>
                  </div>
                  <div
                    class="col-1"
                    style="
                      padding-left: 5px;
                      display: flex;
                      justify-content: center;
                      border-right: 1px solid;
                      border-bottom: 1px solid;
                      padding-bottom: 10px;
                    "
                  >
                    <span
                      v-if="tmpForm.trn_aspek_k3 === 'Ya'"
                      class="material-icons"
                      style="text-align: center; font-size: 16px"
                    >
                      done
                    </span>
                  </div>
                </div>
              </div>
              <div class="col-12">
                <div class="row q-col-gutter">
                  <div
                    class="col-4"
                    style="
                      padding-left: 5px;
                      display: flex;
                      align-items: center;
                      border-right: 1px solid;
                      padding-bottom: 10px;
                    "
                  >
                    <span style="text-align: center; font-size: 16px"
                      >TIDAK</span
                    >
                  </div>
                  <div
                    class="col-1"
                    style="
                      padding-left: 5px;
                      display: flex;
                      justify-content: center;
                      border-right: 1px solid;
                      border-bottom: 1px solid;
                      padding-bottom: 10px;
                    "
                  >
                    <span
                      v-if="tmpForm.trn_aspek_k3 === 'Tidak'"
                      class="material-icons"
                      style="text-align: center; font-size: 16px"
                    >
                      done
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="row q-col-gutter" style="border: 1px solid">
            <div
              class="col-3"
              style="
                padding-left: 5px;
                display: flex;
                align-items: center;
                border-right: 1px solid;
                padding-bottom: 10px;
                background-color: grey;
              "
            >
              <span style="text-align: center; font-size: 16px">Note</span>
            </div>
          </div>
          <div class="row q-col-gutter" style="border: 1px solid">
            <div
              class="col-12"
              style="
                padding-left: 5px;
                display: flex;
                align-items: center;
                border-right: 1px solid;
                padding-bottom: 10px;
              "
            >
              <span style="text-align: center; font-size: 16px">{{
                tmpForm.trn_aspek_desc ? tmpForm.trn_aspek_desc : "&nbsp;"
              }}</span>
            </div>
          </div>

          <div class="row q-col-gutter" style="border: 1px solid">
            <div
              class="col-12"
              style="
                padding-left: 5px;
                border-right: 1px solid;
                padding-bottom: 10px;
              "
            >
              <q-card-section>
                <q-list>
                  <q-item
                    ><q-item-section class="col-5" style="font-size: 18px">
                      Rules :
                    </q-item-section>
                    <q-item-section class="col-2"> &nbsp; </q-item-section>
                    <q-item-section class="col-3"> &nbsp; </q-item-section>
                    <q-item-section class="col-1"> &nbsp; </q-item-section>
                  </q-item>
                  <q-item v-for="(item, index) in listRule" :key="item.id">
                    <q-item-section class="col-12">
                      {{ index + 1 }}. {{ item.kelengkapan_desc }}
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </div>
          </div>

          <div
            class="row q-col-gutter"
            style="border: 1px solid; background-color: grey"
          >
            <div
              class="col-12"
              style="
                padding-left: 5px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-right: 1px solid;
                padding-bottom: 10px;
              "
            >
              <span style="text-align: center; font-size: 16px"
                >Persyaratan Legalitas Vendor untuk Pengajuan Kontrak</span
              >
            </div>
          </div>
          <div class="row q-col-gutter" style="border: 1px solid">
            <div
              class="col-12"
              style="
                padding-left: 5px;
                display: flex;
                align-items: center;
                border-right: 1px solid;
                padding-bottom: 10px;
              "
            >
              <span style="text-align: center; font-size: 16px">{{
                tmpForm.trn_jenis_vendor
              }}</span>
            </div>
          </div>
          <div class="row q-col-gutter" style="border: 1px solid">
            <div
              class="col-12"
              style="
                padding-left: 5px;
                border-right: 1px solid;
                padding-bottom: 10px;
              "
            >
              <q-card-section>
                <q-list>
                  <q-item style="border: 1px solid"
                    ><q-item-section class="col-1 text-center">
                      No
                    </q-item-section>
                    <q-item-section class="col-3"> Dokumen </q-item-section>
                    <q-item-section class="col-4"> Keterangan </q-item-section>
                    <q-item-section class="col-4 text-center">
                      Cek
                    </q-item-section>
                  </q-item>
                  <q-item
                    style="border: 1px solid"
                    v-for="(item, index) in listJenisVendorDok"
                    :key="item.id"
                  >
                    <q-item-section class="col-1 text-center">
                      {{ index + 1 }}
                    </q-item-section>
                    <q-item-section class="col-3">
                      {{ item.jenven_dok_header }}
                    </q-item-section>
                    <q-item-section class="col-4">
                      {{ item.jenven_dok_details }}
                    </q-item-section>
                    <q-item-section class="col-4">
                      <span
                        v-if="item.nama_file_asli"
                        class="material-icons"
                        style="text-align: center; font-size: 16px"
                      >
                        done
                      </span>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </div>
          </div>

          <div>&nbsp;</div>
          <div class="row q-col-gutter" style="border: 1px solid">
            <div
              class="col-12"
              style="
                padding-left: 5px;
                display: flex;
                align-items: center;
                border-right: 1px solid;
                padding-bottom: 10px;
              "
            >
              <span style="text-align: center; font-size: 16px"
                >Lampiran Perjanjian</span
              >
            </div>
          </div>
          <div class="row q-col-gutter" style="border: 1px solid">
            <div
              class="col-12"
              style="
                padding-left: 5px;
                border-right: 1px solid;
                padding-bottom: 10px;
              "
            >
              <q-card-section>
                <q-list>
                  <q-item style="border: 1px solid"
                    ><q-item-section class="col-1 text-center">
                      No
                    </q-item-section>
                    <q-item-section class="col-3"> Dokumen </q-item-section>
                    <q-item-section class="col-4"> Keterangan </q-item-section>
                    <q-item-section class="col-4 text-center">
                      Cek
                    </q-item-section>
                  </q-item>
                  <q-item
                    style="border: 1px solid"
                    v-for="(item, index) in listLampPerjanjianDok"
                    :key="item.id"
                  >
                    <q-item-section class="col-1 text-center">
                      {{ index + 1 }}
                    </q-item-section>
                    <q-item-section class="col-3">
                      {{ item.jenperjanjian_cat }}
                    </q-item-section>
                    <q-item-section class="col-4">
                      {{ item.jenperjanjian_urutan }}.
                      {{ item.jenperjanjian_dtl_lampiran }}
                    </q-item-section>
                    <q-item-section class="col-4">
                      <span
                        v-if="item.perjanjian_file_asli"
                        class="material-icons"
                        style="text-align: center; font-size: 16px"
                      >
                        done
                      </span>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </div>
          </div>

          <div class="row q-col-gutter" style="border: 1px solid">
            <div
              class="col-12"
              style="
                padding-left: 5px;
                border-right: 1px solid;
                padding-bottom: 10px;
              "
            >
              <q-card-section>
                <q-list>
                  <q-item
                    ><q-item-section
                      class="col-2"
                      style="font-size: 18px; font-style: bold"
                    >
                      Guidance TOP :
                    </q-item-section>
                    <q-item-section class="col-1"> &nbsp; </q-item-section>
                    <q-item-section class="col-2"> &nbsp; </q-item-section>
                    <q-item-section class="col-3"> &nbsp; </q-item-section>
                    <q-item-section class="col-3"> &nbsp; </q-item-section>
                    <q-item-section class="col-1"> &nbsp; </q-item-section>
                  </q-item>
                  <q-item v-for="(item, index) in listTop" :key="item.id">
                    <q-item-section class="col-12">
                      <div
                        style="
                          display: flex;
                          flex-direction: row;
                          align-items: center;
                        "
                      >
                        <span
                          class="material-icons"
                          style="width: 10px; margin-right: 5px"
                          >adjust</span
                        >
                        <span style="width: 90%">{{ item.top_kategori }}</span>
                      </div>
                      <div
                        style="
                          display: flex;
                          flex-direction: row;
                          align-items: center;
                          padding-left: 10px;
                        "
                      >
                        <div
                          style="
                            max-height: 200px;
                            overflow-y: auto;
                            white-space: pre-line;
                          "
                        >
                          {{ item.top_desc }}
                        </div>
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-card>

    <q-dialog v-model="dialogFormTiket">
      <q-card style="width: 800px; max-width: 80vw">
        <q-card-section>
          <div class="text-h6">Cek Progres Tiket</div>
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 50vh" class="scroll">
          <q-table
            :rows="listTiket"
            :columns="columnsTiket"
            row-key="id"
            v-model:pagination="pagination3"
            :loading="loading"
            :filter="pagination3.filter"
            :rows-per-page-options="[0]"
            :rows-per-page="0"
            binary-state-sort
            hide-bottom
          >
            <!-- <template v-slot:top-left>
              <div class="row q-col-gutter-sm">
                <div class="col-12">
                  <q-select
                    borderless
                    dense
                    debounce="300"
                    v-model="pagination3.rowsPerPage"
                    :options="[5, 10, 25, 50, 100, 200]"
                  >
                    <template v-slot:before>
                      <q-icon name="reorder">
                        <q-tooltip :class="'tw-bg-black/90'">
                          Rows per page
                        </q-tooltip>
                      </q-icon>
                    </template>
                  </q-select>
                </div>
              </div>
            </template> -->
            <template v-slot:body-cell-No="props">
              <q-td :props="props">
                {{ props.rowIndex + 1 }}
              </q-td>
            </template>
            <template v-slot:body-cell-target_mulai="props">
              <q-td :props="props">
                {{ formattedDate(props.row.target_mulai) }}
              </q-td>
            </template>
            <template v-slot:body-cell-target_selesai="props">
              <q-td :props="props">
                {{ formattedDate(props.row.target_selesai) }}
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import axios from "axios";
import {
  ParseError,
  excelDownload,
  domain,
  role,
  nik,
  empid,
} from "../../../../utils";
import { useQuasar } from "quasar";
import {
  api,
  apiEC,
  apiHds,
  apiBeDMS,
  apiProc,
} from "../../../../../src/boot/axios";
import XLSX from "xlsx";
import { useRouter, useRoute } from "vue-router";
import html2pdf from "html2pdf.js";

const router = useRouter();
const routerParams = useRoute();

const $q = useQuasar();
const listDomainAll = ref([]);
const listUserHrisAll = ref([]);
const listUserHrisAllOriginal = ref([]);
const listNomorDokumen = ref(null);
const listSiteAll = ref([]);
const listTujuanAll = ref([]);
const listDeptAll = ref([]);
const listDeptAllOriginal = ref([]);
const listVendorAll = ref([]);
const listVendorAllOriginal = ref([]);
const listGroupAll = ref([]);
const listGroupId = ref([]);
const listDomain = ref([]);
const listKontakVendor = ref([]);
const listempdms = ref([]);
const listempdmspic = ref([]);
const listPicUser = ref([]);
const listJenisVendorDok = ref([]);
const listLampPerjanjianDok = ref([]);
const listRule = ref([]);
const listTiket = ref([]);
const listTop = ref([]);
const listUserByNik = ref([]);
const loading = ref(false);
const dialogForm = ref(false);
const dialogFormTiket = ref(false);
const dialogVisible = ref(false);
const importedData = ref([]);
const uploadData = ref([]);
const dialogAkses = ref(false);
const listbudms = ref([]);
const listdivdms = ref([]);
const listdivdmsOriginal = ref([]);
const listdeptdms = ref([]);
const listdeptdmsOriginal = ref([]);
const listworklokdms = ref([]);
const listworklokdmsOriginal = ref([]);
const listperjanjiandms = ref([]);
const listperjanjiandmsOriginal = ref([]);
const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 100,
  rowsNumber: 100,
  filter: null,
  domain: domain(),
});
const pagination2 = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10,
  filter: null,
  domain: domain(),
});
const pagination3 = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 100,
  rowsNumber: 100,
  filter: null,
  domain: domain(),
});
const tmpForm = reactive({
  id: null,
  trn_code: null,
  trn_noreg: null,
  trn_nocontract: null,
  trn_domain: domain(),
  trn_pengajuan: null,
  trn_kategori: null,
  trn_mengajukan: null,
  trn_date_start: null,
  trn_date_end: null,
  trn_date_startreal: null,
  trn_date_endreal: null,
  trn_vendor_code: null,
  trn_vendor_name: null,
  trn_vendor_address: null,
  trn_vendor_pendatangan_name: null,
  trn_vendor_pendatangan_email: null,
  trn_vendor_pendatangan_jabatan: null,
  trn_vendor_rekno: null,
  trn_vendor_rekname: null,
  trn_vendor_rekbank: null,
  trn_vendor_rekcabang: null,
  trn_garansi: null,
  trn_others: null,
  trn_notes_pricing: null,
  trn_jenis_vendor: null,
  trn_aspek_k3: null,
  trn_aspek_desc: null,
  trn_pembayaran_1: null,
  trn_pembayaran_2: null,
  trn_pembayaran_3: null,
  trn_pembayaran_4: null,
  trn_pembayaran_5: null,
  trn_notiket_hds: null,
  trn_file_draft_contract: null,
  trn_no_momofin: null,
  trn_file_fix_contract: null,
  trn_file_fix_contract_lama: null,
  trn_appr_user: null,
  trn_appr_user_level: null,
  trn_appr_cmss: null,
  trn_appr_cmss_dh: null,
  trn_flag: null,
  trn_flag_desc: null,
  trn_status: null,
  trn_note_vendor: null,
  trn_status_hds: null,
  trn_bu_dms: null,
  trn_bu_dms_name: null,
  trn_div_pk_dms: null,
  trn_div_dms: null,
  trn_div_dms_name: null,
  trn_dept_dms: null,
  trn_dept_dms_name: null,
  trn_worklok_id_dms: null,
  trn_worklok_dms: null,
  trn_worklok_dms_name: null,
  trn_perjanjian_dms: null,
  trn_perjanjian_dms_name: null,
  trn_status_hds: null,
  trn_judul_perjanjian: null,
  yearDok: null,
  monthDok: null,
  notes: null,
});

const listType = ref([
  {
    type: "Vendor",
  },
  {
    type: "Internal",
  },
  {
    type: "All",
  },
]);

const listAdaRekomendasi = ref([
  {
    id: 0,
    label: "Tidak",
  },
  {
    id: 1,
    label: "Ya",
  },
]);

const listAdaDimatikan = ref([
  {
    id: 0,
    label: "Tidak",
  },
  {
    id: 1,
    label: "Ya",
  },
]);

const listEntitas = ref([
  {
    label: "PT",
  },
  {
    label: "CV",
  },
  {
    label: "Perorangan",
  },
]);

const listForm = ref(["Transporter", "Trading", "Jasa,Fabrikasi,Machining"]);

const listItem = ref([
  "Management",
  "Operasional",
  "Kontrol Order",
  "Keselamatan dan Kesehatan Kerja",
  "Kontrol Lingkungan",
]);

const getToken = () => {
  return localStorage.getItem("tokenSelvend");
};
const token = "Bearer " + getToken();

const getDomain = () => {
  return localStorage.getItem("domain");
};
const domainUser = getDomain();

const vCompanyProfile = null;

let mandatoryList = ref([]);

let temporaryList = ref([]);

const updateChecked = (itemToUpdate, list) => {
  list.value.forEach((item) => {
    item.checked = item.id === itemToUpdate.id;
  });
};
const getRule = async (domain) => {
  try {
    loading.value = true;
    const res = await apiEC.get("getRuleByDomain", {
      params: {
        kelengkapan_domain: domain,
      },
    });
    console.log("getRuleByDomain", res.data.data);

    listRule.value = res.data.data;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const cekTiket = async (domain) => {
  try {
    $q.loading.show();
    const res = await apiHds.get("cekTiketLogDetail", {
      params: {
        tiket: tmpForm.trn_notiket_hds,
      },
    });
    console.log("cekTiketLogDetail", res.data.data);
    if (res.data.data.length < 1) {
      listTiket.value = null;
      $q.notify({
        type: "negative",
        message: "Progress tiket kosong",
      });
    } else {
      listTiket.value = res.data.data;
      dialogFormTiket.value = true;
    }
    $q.loading.hide();
  } catch (error) {
    listTiket.value = null;
    $q.loading.hide();
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getGuidanceTopAll = async (domain) => {
  try {
    loading.value = true;
    const res = await apiEC.get("getGuidanceTopAll", {
      params: {
        kelengkapan_domain: domain,
      },
    });
    console.log("getGuidanceTopAll", res.data.data);

    listTop.value = res.data.data;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};
const handleInputChange = (event) => {
  tmpForm.npwp = tmpForm.npwp.replace(/\D/g, "");
};

const columns = [
  {
    name: "No",
    required: true,
    label: "No",
    align: "left",
    field: "no",
    sortable: false,
  },
  {
    name: "domain",
    required: true,
    label: "Domain",
    align: "left",
    field: "domain",
    sortable: false,
  },
  {
    name: "group",
    required: true,
    label: "Group",
    align: "left",
    field: "group",
    sortable: false,
  },
  {
    name: "item",
    required: true,
    label: "Item",
    align: "left",
    field: "item",
    sortable: false,
  },
  {
    name: "pertanyaan",
    required: true,
    label: "Pertanyaan",
    align: "left",
    field: "pertanyaan",
    sortable: false,
  },
  {
    name: "acuan",
    required: true,
    label: "Acuan",
    align: "left",
    field: "acuan",
    sortable: false,
  },
  {
    name: "departemen",
    required: true,
    label: "Departemen",
    align: "left",
    field: "departemen",
    sortable: false,
  },
  {
    name: "nik",
    required: true,
    label: "Nik",
    align: "left",
    field: "nik",
    sortable: false,
  },
  {
    name: "aksi",
    required: true,
    label: "Actions",
    align: "left",
    field: "aksi",
  },
];

const columnsTiket = [
  {
    name: "No",
    required: true,
    label: "No",
    align: "left",
    field: "no",
    sortable: false,
  },
  {
    name: "no_spk",
    required: true,
    label: "No Tiket",
    align: "left",
    field: "no_spk",
    sortable: false,
  },
  {
    name: "nama_proses",
    required: true,
    label: "Progres",
    align: "left",
    field: "nama_proses",
    sortable: false,
  },
  {
    name: "status_detail",
    required: true,
    label: "Hasil Proses",
    align: "left",
    field: "status_detail",
    sortable: false,
  },
  {
    name: "nama",
    required: true,
    label: "PIC",
    align: "left",
    field: "nama",
    sortable: false,
  },
  {
    name: "target_mulai",
    required: true,
    label: "Tanggal",
    align: "left",
    field: "target_mulai",
    sortable: false,
  },
  {
    name: "target_selesai",
    required: true,
    label: "Target",
    align: "left",
    field: "target_selesai",
    sortable: false,
  },
];

const columnsImport = [
  {
    name: "domain",
    required: true,
    label: "Domain",
    align: "left",
    field: "domain",
    sortable: false,
  },
  {
    name: "group",
    required: true,
    label: "Group",
    align: "left",
    field: "group",
    sortable: false,
  },
  {
    name: "item",
    required: true,
    label: "Item",
    align: "left",
    field: "item",
    sortable: false,
  },
  {
    name: "pertanyaan",
    required: true,
    label: "Pertanyaan",
    align: "left",
    field: "pertanyaan",
    sortable: false,
  },
  {
    name: "acuan",
    required: true,
    label: "Acuan",
    align: "left",
    field: "acuan",
    sortable: false,
  },
  {
    name: "departemen",
    required: true,
    label: "Departemen",
    align: "left",
    field: "departemen",
    sortable: false,
  },
  {
    name: "nik",
    required: true,
    label: "Nik",
    align: "left",
    field: "nik",
    sortable: false,
  },
];

const listApprover = ref([]);
const listStatus = ref(["Aktif", "Tidak Aktif"]);
const listUrutan = ref([
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25,
]);
const listKontrak = ref(["Kontrak", "Adendum"]);
const listKategori = ref(["Baru", "Renewal"]);
const listJenisVendor = ref([
  "Perseroan Terbatas (PT)",
  "Persyaratan Vendor Persekutuan Komanditer (CV)- Persekutuan Perdata (PP)",
  "Persyaratan Vendor Perusahaan Perorangan (PO)",
]);
const listK3 = ref(["Ya", "Tidak"]);

const validationRules = [
  { field: "trn_code", message: "Code empty" },
  { field: "trn_domain", message: "Domain empty" },
  { field: "trn_pengajuan", message: "Please select pengajuan" },
  { field: "trn_kategori", message: "Please select kategori" },
  { field: "trn_mengajukan", message: "Please input mengajukan" },
  { field: "trn_date_start", message: "Please input tanggal mulai" },
  { field: "trn_date_end", message: "Please input tanggal akhir" },
  { field: "trn_vendor_code", message: "Code vendor empty" },
  { field: "trn_vendor_name", message: "Please select nama vendor" },
  { field: "trn_garansi", message: "Please input garansi" },
  { field: "trn_others", message: "Please input lain-lain" },
  { field: "trn_notes_pricing", message: "Please input catatan pricing" },
  { field: "trn_jenis_vendor", message: "Please select jenis vendor" },
  { field: "trn_aspek_k3", message: "Please select aspek K3" },
  { field: "trn_pembayaran_1", message: "Please input pembayaran 1" },
  { field: "trn_pembayaran_2", message: "Please input pembayaran 2" },
];

const columnKontakVendor = [
  {
    name: "No",
    required: true,
    label: "No",
    align: "left",
    field: "no",
    sortable: false,
  },
  {
    name: "trn_vendor_name",
    required: true,
    label: "Nama Pic",
    align: "left",
    field: "trn_vendor_name",
    sortable: false,
  },
  {
    name: "trn_vendor_level",
    required: true,
    label: "Jabatan Pic",
    align: "left",
    field: "trn_vendor_level",
    sortable: false,
  },
  {
    name: "trn_vendor_email",
    required: true,
    label: "Email Pic",
    align: "left",
    field: "trn_vendor_email",
    sortable: false,
  },
  {
    name: "trn_vendor_phone",
    required: true,
    label: "No Handphone",
    align: "left",
    field: "trn_vendor_phone",
    sortable: false,
  },
];

const columnPicUser = [
  {
    name: "No",
    required: true,
    label: "No",
    align: "left",
    field: "no",
    sortable: false,
  },
  {
    name: "user_domain",
    required: true,
    label: "Domain",
    align: "left",
    field: "user_domain",
    sortable: false,
  },
  {
    name: "sitedesc",
    required: true,
    label: "Site",
    align: "left",
    field: "sitedesc",
    sortable: false,
  },
  {
    name: "user_nik_name",
    required: true,
    label: "Nama Pic",
    align: "left",
    field: "user_nik_name",
    sortable: false,
  },
  {
    name: "user_jabatan",
    required: true,
    label: "Jabatan Pic",
    align: "left",
    field: "user_jabatan",
    sortable: false,
  },
  {
    name: "user_email",
    required: true,
    label: "Email Pic",
    align: "left",
    field: "user_email",
    sortable: false,
  },
  {
    name: "user_phone",
    required: true,
    label: "No Handphone",
    align: "left",
    field: "user_phone",
    sortable: false,
  },
];
const getPengajuanVendor = async () => {
  try {
    loading.value = true;
    const res = await api.get("getPengajuanVendor", {
      params: pagination.value,
      headers: {
        Authorization: token,
      },
    });
    console.log("getPengajuanVendor", res.data.data);

    listDomain.value = res.data.data;
    pagination.value.rowsNumber = res.data.pagination.total;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const DomainAllByCode = async (domainUser) => {
  try {
    const res = await apiEC.get("getDomainAllByCode", {
      params: {
        code: domainUser,
      },
      headers: {
        Authorization: token,
      },
    });
    console.log("res.data.data=>>>>:zzzzzzzzzz", res.data.data);
    tmpForm.domain = res.data.data.code;
    tmpForm.domainName = res.data.data.desk;
  } catch (error) {
    listDomainAll.value = null;
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getSiteByDomain = async (domain) => {
  try {
    const res = await apiEC.get("getSiteByDomain", {
      params: {
        domain: domain,
      },
      headers: {
        Authorization: token,
      },
    });
    console.log("getSiteByDomain", res.data.data);
    listSiteAll.value = res.data.data;
  } catch (error) {
    listSiteAll.value = null;
    tmpForm.site = null;
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getTujuanByDomain = async (domain) => {
  try {
    const res = await api.get("getTujuanByDomain", {
      params: {
        domain: domain,
      },
      headers: {
        Authorization: token,
      },
    });
    console.log("getTujuanByDomain", res.data.data);
    listTujuanAll.value = res.data.data;
  } catch (error) {
    listTujuanAll.value = null;
    tmpForm.tujuan_pengajuan = null;
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getKategori = async (domain) => {
  try {
    const res = await api.get("getKategori", {
      headers: {
        Authorization: token,
      },
    });
    console.log("getKategori", res.data.data);
    listKategori.value = res.data.data;
  } catch (error) {
    listKategori.value = null;
    tmpForm.tujuan_pengajuan = null;
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const DomainAllData = async () => {
  try {
    const res = await apiEC.get("getDomainAll", {
      headers: {
        Authorization: token,
      },
    });
    console.log("res.data.data=>>>>:zzzzzzzzzz", res.data.data);
    listDomainAll.value = res.data.data;
  } catch (error) {
    listDomainAll.value = null;
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const UserHRISDomDept = async (domain_name, id_dept) => {
  try {
    const res = await api.get("getUserApprovalHrisDomDept", {
      params: {
        domain_name: domain_name,
        id_dept: id_dept,
      },
      headers: {
        Authorization: token,
      },
    });
    listUserHrisAll.value = res.data.data;
    listUserHrisAllOriginal.value = [...listUserHrisAll.value];
  } catch (error) {
    listUserHrisAll.value = null;
    listUserHrisAllOriginal.value = null;
    tmpForm.nik = null;
    tmpForm.nama = null;
    tmpForm.email = null;
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getDept = async () => {
  try {
    const res = await apiEC.get("getDept", {
      headers: {
        Authorization: token,
      },
    });
    listDeptAll.value = res.data.data;
    listDeptAllOriginal.value = [...listDeptAll.value];
  } catch (error) {
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getListVendorEreg = async () => {
  try {
    $q.loading.show();
    const res = await apiEC.get("getListVendorEreg");
    listVendorAll.value = res.data.data;
    listVendorAllOriginal.value = [...listVendorAll.value];

    $q.loading.hide();
  } catch (error) {
    $q.loading.hide();
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getListpenandatangananKontrak = async (code) => {
  try {
    $q.loading.show();
    const res = await apiEC.get("getListpenandatangananKontrak", {
      params: {
        code: code,
      },
    });
    console.log(res.data.data);
    if (res.data.data === undefined) {
      $q.notify({
        type: "negative",
        message: "Penandatangan Kontrak not found",
      });
      return;
    }
    tmpForm.trn_vendor_pendatangan_name = res.data.data.details_content_1;
    tmpForm.trn_vendor_pendatangan_email = res.data.data.details_content_4;
    tmpForm.trn_vendor_pendatangan_jabatan = res.data.data.details_content_3;

    $q.loading.hide();
  } catch (error) {
    $q.loading.hide();
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getListRekeningBank = async (code) => {
  try {
    $q.loading.show();
    const res = await apiEC.get("getListRekeningBank", {
      params: {
        code: code,
      },
    });

    if (res.data.data === undefined) {
      $q.notify({
        type: "negative",
        message: "Rekening Bank not found",
      });
      return;
    }
    tmpForm.trn_vendor_rekno = res.data.data.details_content_3;
    tmpForm.trn_vendor_rekname = res.data.data.details_content_4;
    tmpForm.trn_vendor_rekbank = res.data.data.details_content_1;
    tmpForm.trn_vendor_rekcabang = res.data.data.details_content_2;

    $q.loading.hide();
  } catch (error) {
    $q.loading.hide();
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getDokumenRegulerPengajuanByDomain = async (domain) => {
  try {
    const res = await api.get("getDokumenRegulerPengajuanByDomain", {
      params: {
        domain: domain,
      },
      headers: {
        Authorization: token,
      },
    });
    mandatoryList.value = res.data.data;
  } catch (error) {
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getDokumenTemporaryPengajuanByDomain = async (domain) => {
  try {
    const res = await api.get("getDokumenTemporaryPengajuanByDomain", {
      params: {
        domain: domain,
      },
      headers: {
        Authorization: token,
      },
    });
    temporaryList.value = res.data.data;
  } catch (error) {
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getNomorDokumen = async () => {
  const trn_code = routerParams.params.no_code;
  try {
    const res = await apiEC.get("getKontrakUserByCode", {
      params: {
        trn_code,
      },
    });
    const dateStr = res.data.data.trn_date_start;
    const dateObj = new Date(dateStr);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();

    const dateStr2 = res.data.data.trn_date_end;
    const dateObj2 = new Date(dateStr2);
    const day2 = String(dateObj2.getDate()).padStart(2, "0");
    const month2 = String(dateObj2.getMonth() + 1).padStart(2, "0");
    const year2 = dateObj2.getFullYear();

    const tglstr = `${day}/${month}/${year}`;
    const tglend = `${day2}/${month2}/${year2}`;
    getRule(res.data.data.trn_domain);

    tmpForm.trn_code = res.data.data.trn_code;
    tmpForm.trn_noreg = res.data.data.trn_noreg;
    tmpForm.trn_nocontract = res.data.data.trn_nocontract;
    tmpForm.trn_domain = res.data.data.trn_domain;
    tmpForm.trn_pengajuan = res.data.data.trn_pengajuan;
    tmpForm.trn_kategori = res.data.data.trn_kategori;
    tmpForm.trn_mengajukan = res.data.data.trn_mengajukan;
    tmpForm.trn_date_start = tglstr;
    tmpForm.trn_date_end = tglend;
    tmpForm.trn_date_startreal = res.data.data.trn_date_start;
    tmpForm.trn_date_endreal = res.data.data.trn_date_end;
    tmpForm.trn_vendor_code = res.data.data.trn_vendor_code;
    tmpForm.trn_vendor_name = res.data.data.trn_vendor_name;
    tmpForm.trn_vendor_address = res.data.data.trn_vendor_address;
    tmpForm.trn_vendor_pendatangan_name =
      res.data.data.trn_vendor_pendatangan_name;
    tmpForm.trn_vendor_pendatangan_email =
      res.data.data.trn_vendor_pendatangan_email;
    tmpForm.trn_vendor_pendatangan_jabatan =
      res.data.data.trn_vendor_pendatangan_jabatan;
    tmpForm.trn_vendor_rekno = res.data.data.trn_vendor_rekno;
    tmpForm.trn_vendor_rekname = res.data.data.trn_vendor_rekname;
    tmpForm.trn_vendor_rekbank = res.data.data.trn_vendor_rekbank;
    tmpForm.trn_vendor_rekcabang = res.data.data.trn_vendor_rekcabang;
    tmpForm.trn_garansi = res.data.data.trn_garansi;
    tmpForm.trn_others = res.data.data.trn_others;
    tmpForm.trn_notes_pricing = res.data.data.trn_notes_pricing;
    tmpForm.trn_jenis_vendor = res.data.data.trn_jenis_vendor;
    tmpForm.trn_aspek_k3 = res.data.data.trn_aspek_k3;
    tmpForm.trn_aspek_desc = res.data.data.trn_aspek_desc;
    tmpForm.trn_pembayaran_1 = res.data.data.trn_pembayaran_1;
    tmpForm.trn_pembayaran_2 = res.data.data.trn_pembayaran_2;
    tmpForm.trn_pembayaran_3 = res.data.data.trn_pembayaran_3;
    tmpForm.trn_pembayaran_4 = res.data.data.trn_pembayaran_4;
    tmpForm.trn_pembayaran_5 = res.data.data.trn_pembayaran_5;
    tmpForm.trn_notiket_hds = res.data.data.trn_notiket_hds;
    tmpForm.trn_file_draft_contract = res.data.data.trn_file_draft_contract;
    tmpForm.trn_no_momofin = res.data.data.trn_no_momofin;
    tmpForm.trn_file_fix_contract = res.data.data.trn_file_fix_contract;
    tmpForm.trn_file_fix_contract_lama = res.data.data.trn_file_fix_contract;
    tmpForm.trn_appr_user = res.data.data.trn_appr_user;
    tmpForm.trn_appr_user_level = res.data.data.trn_appr_user_level;
    tmpForm.trn_appr_cmss = res.data.data.trn_appr_cmss;
    tmpForm.trn_appr_cmss_dh = res.data.data.trn_appr_cmss_dh;
    tmpForm.trn_flag = res.data.data.trn_flag;
    tmpForm.trn_flag_desc = res.data.data.trn_flag_desc;
    tmpForm.trn_status = res.data.data.trn_status;
    tmpForm.trn_note_vendor = res.data.data.trn_note_vendor;
    tmpForm.bucode = res.data.data.bucode;

    getEmpUserDMSPIC(res.data.data.created_by);
  } catch (error) {
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getEmpUserDMS = async (domain) => {
  try {
    const res = await apiBeDMS.get("getEmpUser", {
      params: {
        nik: nik(),
      },
    });
    console.log("getEmpUser", res.data.data);
    listempdms.value = res.data.data;
    tmpForm.trn_bu_dms = res.data.data.employee_bu_id;
    tmpForm.trn_bu_dms_name = res.data.data.employee_bu_id;
    tmpForm.trn_div_dms = res.data.data.map_div_id;
    tmpForm.trn_div_dms_name = res.data.data.div_nama;
    tmpForm.trn_dept_dms = res.data.data.map_dept_id;
    tmpForm.trn_dept_dms_name = res.data.data.dept_name;
    tmpForm.trn_worklok_id_dms = res.data.data.work_id;
    tmpForm.trn_worklok_dms = res.data.data.work_code;
    tmpForm.trn_worklok_dms_name = res.data.data.work_desc;
  } catch (error) {
    listempdms.value = null;
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getEmpUserDMSPIC = async (pic) => {
  try {
    const res = await apiBeDMS.get("getEmpUser", {
      params: {
        nik: pic,
      },
    });
    console.log("getEmpUser", res.data.data);
    listempdmspic.value = res.data.data;
  } catch (error) {
    listempdmspic.value = null;
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getHDS = async () => {
  const trn_code = routerParams.params.no_code;
  try {
    const res = await apiEC.get("getKontrakUserByCode", {
      params: {
        trn_code,
      },
    });
  } catch (error) {
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getKontakVendor = async () => {
  try {
    loading.value = true;
    const res = await apiEC.get("getKontakVendor", {
      params: {
        ...pagination.value,
        trn_code: routerParams.params.no_code,
      },
    });
    console.log("getKontakVendor", res.data.data);

    listKontakVendor.value = res.data.data;
    pagination.value.rowsNumber = res.data.pagination.total;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getPicVendor = async () => {
  try {
    loading.value = true;
    const res = await apiEC.get("getKontakPicUser", {
      params: {
        ...pagination2.value,
        trn_code: routerParams.params.no_code,
      },
    });
    console.log("getKontakPicUser", res.data.data);

    listPicUser.value = res.data.data;
    pagination2.value.rowsNumber = res.data.pagination.total;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getApprovalHist = async () => {
  try {
    loading.value = true;
    const res = await apiEC.get("getApprovalHist", {
      params: {
        trn_code: routerParams.params.no_code,
      },
    });
    console.log("getApprovalHist", res.data.data);

    listApprover.value = res.data.data;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getJenisVendorDok = async () => {
  try {
    loading.value = true;
    const res = await apiEC.get("getKontakJenisVendorDok", {
      params: {
        trn_code: routerParams.params.no_code,
      },
      headers: {
        Authorization: token,
      },
    });
    console.log("getKontakJenisVendorDok", res.data.data);

    listJenisVendorDok.value = res.data.data;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getLampiranPerjanjianDok = async () => {
  try {
    loading.value = true;
    const res = await apiEC.get("getKontakLampiranDok", {
      params: {
        trn_code: routerParams.params.no_code,
        domain: domain(),
      },
      headers: {
        Authorization: token,
      },
    });
    console.log("getKontakLampiranDok", res.data.data);

    listLampPerjanjianDok.value = res.data.data;
    pagination.value.rowsNumber = res.data.pagination.total;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getBobotPertanyaanDomain = async (domain) => {
  try {
    const res = await api.get("getBobotPertanyaanDomain", {
      params: {
        domain: domain,
      },
      headers: {
        Authorization: token,
      },
    });
    console.log("getBobotPertanyaanDomain", res.data.data);
    listGroupAll.value = res.data.data;
  } catch (error) {
    listGroupAll.value = null;
    tmpForm.group = null;
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getJenisVendorByDomain = async (domain) => {
  try {
    const res = await api.get("getJenisVendorByDomain", {
      params: {
        domain: domain,
      },
      headers: {
        Authorization: token,
      },
    });
    console.log("getJenisVendorByDomain", res.data.data);
    listJenisVendor.value = res.data.data;
  } catch (error) {
    listJenisVendor.value = null;
    tmpForm.group = null;
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getBuDMS = async (domain) => {
  try {
    const res = await apiBeDMS.get("getBU");
    console.log("getBU", res.data.data);
    listbudms.value = res.data.data;
  } catch (error) {
    listbudms.value = null;
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getDivDMS = async (domain) => {
  try {
    $q.loading.show();
    const res = await apiBeDMS.get("getdiv");
    console.log("getdiv", res.data.data);
    listdivdms.value = res.data.data;
    listdivdmsOriginal.value = res.data.data;
    $q.loading.hide();
  } catch (error) {
    $q.loading.hide();
    listdivdms.value = null;
    listdivdmsOriginal.value = null;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getDeptDMS = async (domain) => {
  try {
    $q.loading.show();
    const res = await apiBeDMS.get("getDept");
    console.log("getDept", res.data.data);
    listdeptdms.value = res.data.data;
    listdeptdmsOriginal.value = res.data.data;
    $q.loading.hide();
  } catch (error) {
    $q.loading.hide();
    listdeptdms.value = null;
    listdeptdmsOriginal.value = null;
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getWorkLokDMS = async (domain) => {
  try {
    $q.loading.show();
    const res = await apiBeDMS.get("WorkLoc");
    console.log("WorkLoc", res.data.data);
    listworklokdms.value = res.data.data;
    listworklokdmsOriginal.value = res.data.data;
    $q.loading.hide();
  } catch (error) {
    $q.loading.hide();
    listworklokdms.value = null;
    listworklokdmsOriginal.value = null;
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getPerjanjianDMS = async (domain) => {
  try {
    const res = await apiBeDMS.get("getperjanjian");
    console.log("getperjanjian", res.data.data);
    listperjanjiandmsOriginal.value = res.data.data;
    listperjanjiandms.value = res.data.data;
  } catch (error) {
    listperjanjiandms.value = null;
    listperjanjiandmsOriginal.value = null;
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getBobotPertanyaanById = async (id) => {
  try {
    console.log("bobotid", id);
    const res = await api.get("getBobotPertanyaanById", {
      params: {
        id: id,
      },
      headers: {
        Authorization: token,
      },
    });
    console.log("getBobotPertanyaanDomain", res.data.data);
    listGroupId.value = res.data.data;
  } catch (error) {
    listGroupId.value = null;
    tmpForm.site = null;
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const getUserApprovalHris = async (empid) => {
  try {
    const res = await api.get("getUserApprovalHris", {
      params: {
        empid: empid,
      },
      headers: {
        Authorization: token,
      },
    });
    console.log("getUserApprovalHris", res.data.data[0].nik);
    tmpForm.nama = res.data.data[0].nama;
    tmpForm.jabatan = res.data.data[0].jabatan;
    tmpForm.email = res.data.data[0].email;
    listUserByNik.value = res.data.data;
  } catch (error) {
    loading.value = false;
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const addAplikasi = async () => {
  $q.loading.show({
    message: "Upload file in progress. Hang on...",
  });
  try {
    const formData = new FormData();
    formData.append("trn_code", tmpForm.trn_code);
    formData.append("files", tmpForm.trn_file_fix_contract[0]);
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    const allowedTypes = [
      "application/pdf",
      // "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      // "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      // "image/jpeg",
      // "image/png",
    ];
    if (!allowedTypes.includes(tmpForm.trn_file_fix_contract[0].type)) {
      $q.notify({
        type: "negative",
        message:
          tmpForm.trn_file_fix_contract[0].name +
          " Invalid file type, file must be pdf, xlsx, docs, jpeg or png",
      });
      tmpForm.trn_file_fix_contract = null;
      $q.loading.hide();
      return;
    }

    if (tmpForm.trn_file_fix_contract[0].size > 20 * 1024 * 1024) {
      $q.notify({
        type: "negative",
        message:
          "File " +
          tmpForm.trn_file_fix_contract[0].name +
          " too large, max 20MB",
      });
      tmpForm.trn_file_fix_contract = null;
      $q.loading.hide();
      return;
    }
    await apiEC.post("updateFileFixKontrak", formData, {
      headers: {
        Authorization: token,
        "Content-Type": "multipart/form-data",
      },
    });

    router.push(`/econtract-kontrakclose/`);

    $q.notify({
      type: "positive",
      message: "Update file successfully",
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

const importData = async () => {
  dialogForm.value = true;
  reset();
};

const editAplikasi = (value) => {
  dialogForm.value = true;
  tmpForm.id = value.id;
  tmpForm.domain = value.domain;
  tmpForm.groupid = value.groupid;
  tmpForm.group = value.group;
  tmpForm.bobot = value.bobot;
  tmpForm.item = value.item;
  tmpForm.pertanyaan = value.pertanyaan;
  tmpForm.acuan = value.acuan;
  tmpForm.departemen = value.departemen;
  tmpForm.nik = value.nik;
  tmpForm.nama = value.nama;
  tmpForm.email = value.email;
  tmpForm.domainName = value.domainName;
  tmpForm.deptName = value.deptName;
  console.log("edit", value.domain);
  getBobotPertanyaanDomain(value.domain);

  console.log("tmpForm =>>>>>", tmpForm);
};

const deleteAplikasi = async (value) => {
  console.log(value);
  $q.dialog({
    title: "Konfirmasi",
    message: `Are you sure you want to delete Pengajuan Vendor <span class="tw-font-bold">${value.pertanyaan}</span>?`,
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
      await api.post("deletePengajuanVendor", value, {
        headers: {
          Authorization: token,
        },
      });
      $q.notify({
        type: "positive",
        message: `Aplikasi <span class="tw-font-bold">${value.jenis_vendor}</span> deleted successfully`,
        html: true,
      });
      await getPengajuanVendor();
    } catch (error) {
      $q.notify({
        type: "negative",
        message: ParseError(error),
      });
    }
  });
};

const saveAplikasi = async (status) => {
  try {
    if (tmpForm.trn_code == null || tmpForm.trn_bu_dms === "") {
      $q.notify({
        type: "negative",
        message: "code is empty",
      });
      return;
    }

    if (tmpForm.trn_code == null || tmpForm.trn_bu_dms === "") {
      $q.notify({
        type: "negative",
        message: "code is empty",
      });
      return;
    }

    if (
      tmpForm.trn_file_fix_contract_lama == null ||
      tmpForm.trn_file_fix_contract_lama === ""
    ) {
      $q.notify({
        type: "negative",
        message: "dokumen final is empty",
      });
      return;
    }

    $q.loading.show();
    await apiEC.post("savePerjanjianFinal", tmpForm, {
      headers: {
        Authorization: token,
      },
    });
    dialogForm.value = false;
    reset();
    $q.notify({
      type: "positive",
      message: "Data saved successfully",
    });
    router.push(`/econtract-kontrakclose/`);
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
};

const reset = () => {
  tmpForm.trn_code = null;
  tmpForm.trn_noreg = null;
  tmpForm.trn_nocontract = null;
  tmpForm.trn_domain = domain();
  tmpForm.trn_pengajuan = null;
  tmpForm.trn_kategori = null;
  tmpForm.trn_mengajukan = null;
  tmpForm.trn_date_start = null;
  tmpForm.trn_date_end = null;
  tmpForm.trn_vendor_code = null;
  tmpForm.trn_vendor_name = null;
  tmpForm.trn_vendor_address = null;
  tmpForm.trn_vendor_pendatangan_name = null;
  tmpForm.trn_vendor_pendatangan_email = null;
  tmpForm.trn_vendor_pendatangan_jabatan = null;
  tmpForm.trn_vendor_rekno = null;
  tmpForm.trn_vendor_rekname = null;
  tmpForm.trn_vendor_rekbank = null;
  tmpForm.trn_vendor_rekcabang = null;
  tmpForm.trn_garansi = null;
  tmpForm.trn_others = null;
  tmpForm.trn_notes_pricing = null;
  tmpForm.trn_jenis_vendor = null;
  tmpForm.trn_aspek_k3 = null;
  tmpForm.trn_aspek_desc = null;
  tmpForm.trn_pembayaran_1 = null;
  tmpForm.trn_pembayaran_2 = null;
  tmpForm.trn_pembayaran_3 = null;
  tmpForm.trn_pembayaran_4 = null;
  tmpForm.trn_pembayaran_5 = null;
};

const onRequest = (props) => {
  const { page, rowsPerPage, sortBy, descending, filter } = props.pagination;
  pagination.value.filter = filter;
  pagination.value.page = page;
  pagination.value.rowsPerPage = rowsPerPage;
  pagination.value.sortBy = sortBy;
  pagination.value.descending = descending;
  // getPengajuanVendor();
  DomainAllByCode(domainUser);
  getSiteByDomain(domainUser);
  // getTujuanByDomain(domainUser);
  // getKategori();
  // UserHRISAll();
  // getDept();
  getEmpUserDMS();
  getListVendorEreg();
  getNomorDokumen();
  getBuDMS();
  getDivDMS();
  getDeptDMS();
  getWorkLokDMS();
  getPerjanjianDMS();
  getGuidanceTopAll();
  getKontakVendor();
  getJenisVendorDok();
  getLampiranPerjanjianDok();
  getApprovalHist();
  // getJenisVendorByDomain(domainUser);
  // getDokumenRegulerPengajuanByDomain(domainUser);
  // getDokumenTemporaryPengajuanByDomain(domainUser);
};
const onRequest2 = (props) => {
  const { page, rowsPerPage, sortBy, descending, filter } = props.pagination;
  pagination2.value.filter = filter;
  pagination2.value.page = page;
  pagination2.value.rowsPerPage = rowsPerPage;
  pagination2.value.sortBy = sortBy;
  pagination2.value.descending = descending;
  // getPengajuanVendor();
  DomainAllByCode(domainUser);
  getSiteByDomain(domainUser);
  // getTujuanByDomain(domainUser);
  // getKategori();
  // UserHRISAll();
  // getDept();
  getListVendorEreg();
  getNomorDokumen();
  getPicVendor();
  // getJenisVendorByDomain(domainUser);
  // getDokumenRegulerPengajuanByDomain(domainUser);
  // getDokumenTemporaryPengajuanByDomain(domainUser);
};

onMounted(() => {
  tmpForm.trn_code = routerParams.params.no_code;
  onRequest({
    pagination: pagination.value,
  });
  onRequest2({
    pagination: pagination2.value,
  });
});

const showImportDialog = () => {
  dialogVisible.value = true;
};

const processFile = (files) => {
  const file = files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // Ambil baris header untuk mendapatkan nama kolom
    const headerRow = rawData[0];
    // Temukan indeks kolom domain dan Approver Procurement
    const domainIndex = headerRow.indexOf("Domain");
    const siteIndex = headerRow.indexOf("Site");
    const approverIndex = headerRow.indexOf("Approver");
    const nikIndex = headerRow.indexOf("Nik");
    const namaIndex = headerRow.indexOf("Nama");
    const jabatanIndex = headerRow.indexOf("Jabatan");
    const emailIndex = headerRow.indexOf("Email");

    // Filter header dari data
    const dataRows = rawData.slice(1);

    // Ubah data sesuai format yang diharapkan oleh q-table
    importedData.value = dataRows.map((row, index) => ({
      index: index + 1,
      domain: row[domainIndex],
      site: row[siteIndex],
      approver: row[approverIndex],
      nik: row[nikIndex],
      nama: row[namaIndex],
      jabatan: row[jabatanIndex],
      email: row[emailIndex],
    }));

    uploadData.value = dataRows.map((row, index) => ({
      index: index + 1,
      domain: row[domainIndex],
      site: row[siteIndex],
      approver: row[approverIndex],
      nik: row[nikIndex],
      nama: row[namaIndex],
      jabatan: row[jabatanIndex],
      email: row[emailIndex],
    }));

    columnsImport.value = [
      { name: "domain", label: "Domain", align: "left" },
      { name: "site", label: "Site", align: "left" },
      { name: "approver", label: "Approver", align: "left" },
      { name: "nik", label: "Nik", align: "left" },
      { name: "nama", label: "Nama", align: "left" },
      { name: "jabatan", label: "Jabatan", align: "left" },
      { name: "site", label: "Email", align: "left" },
    ];
  };
  reader.readAsArrayBuffer(file);
};

const closeDialog = () => {
  dialogVisible.value = false;
  importedData.value = [];
};

const importExcel = async () => {
  console.log(uploadData._rawValue);
  try {
    if (
      uploadData._rawValue === "" ||
      uploadData._rawValue === null ||
      uploadData._rawValue.length < 1
    ) {
      $q.notify({
        type: "negative",
        message: "Please upload excel",
      });
    } else {
      $q.loading.show();
      await api.post("savePengajuanVendorExcel", uploadData._rawValue, {
        headers: {
          Authorization: token,
        },
      });
      dialogVisible.value = false;
      reset();
      $q.notify({
        type: "positive",
        message: "Import successfully",
      });
      await onRequest({
        pagination: pagination.value,
      });
      $q.loading.hide();
    }
  } catch (error) {
    $q.loading.hide();
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const handleSelect = async (selectedOption) => {
  console.log("Selected option:", selectedOption);
  const data = listDomainAll._rawValue.find(
    (item) => item.code === selectedOption
  );
  tmpForm.domainName = data.name;
  console.log(data);
  getBobotPertanyaanDomain(selectedOption);
};

const handleSelectGroup = async (selectedOption) => {
  console.log("Selected option:", selectedOption);
  const data = listGroupAll._rawValue.find(
    (item) => item.id === selectedOption
  );
  tmpForm.groupid = data.id;
  tmpForm.bobot = data.bobot;
  console.log(data);
  getBobotPertanyaanById(selectedOption);
};

const handleSelectUser = async (selectedOption) => {
  console.log("Selected option:", selectedOption);
  const data = listUserHrisAll._rawValue.find(
    (item) => item.id === selectedOption
  );
  getUserApprovalHris(selectedOption);
};

const handleSelectPengganti = async (selectedOption) => {
  console.log("Selected option:", selectedOption);
  const data = listTujuanAll._rawValue.find(
    (item) => item.id === selectedOption
  );
  tmpForm.tujuan_pengajuan_nama = data.tujuan_pengajuan;
};

const handleSelectDept = async (selectedOption) => {
  console.log("Selected option:", selectedOption);
  const data = listDeptAll._rawValue.find(
    (item) => item.id_dept === selectedOption
  );
  console.log(tmpForm.domainName);
  if (tmpForm.domainName == "" || tmpForm.domainName == null) {
    tmpForm.departemen = null;
    $q.notify({
      type: "negative",
      message: "Please select domain to get list NIK",
    });
    return;
  }
  tmpForm.deptName = data.nama_dept;
  UserHRISDomDept(tmpForm.domainName, selectedOption);
};

const filterFnDept = (val, update) => {
  if (val === "") {
    update(() => {
      listDeptAllOriginal.value = [...listDeptAll.value];
    });
    return;
  }
  console.log(update);

  update(() => {
    const needle = val.toLowerCase();
    listDeptAllOriginal.value = listDeptAll.value.filter((option) => {
      return option.nama_dept.toLowerCase().includes(needle);
    });
  });
};

const filterFn = (val, update) => {
  if (val === "") {
    update(() => {
      listUserHrisAllOriginal.value = [...listUserHrisAll.value];
    });
    return;
  }
  console.log(update);

  update(() => {
    const needle = val.toLowerCase();
    listUserHrisAllOriginal.value = listUserHrisAll.value.filter((option) => {
      return option.nik.toLowerCase().includes(needle);
    });
  });
};

const handleSelectBUDMS = async (selectedOption) => {
  console.log("Selected option:", selectedOption);
  const data = listbudms._rawValue.find(
    (item) => item.bu_id === selectedOption
  );
  tmpForm.trn_bu_dms = data.bu_id;
  tmpForm.trn_bu_dms_name = data.bu_name;
};

const handleSelectPerjanjianDMS = async (selectedOption) => {
  console.log("Selected option:", selectedOption);
  const data = listperjanjiandms._rawValue.find(
    (item) => item.perj_id === selectedOption
  );
  tmpForm.trn_perjanjian_dms = data.perj_id;
  tmpForm.trn_perjanjian_dms_name = data.perj_desc;
};

const handleSelectDivDMS = async (selectedOption) => {
  console.log("Selected option:", selectedOption);
  const data = listdivdms._rawValue.find(
    (item) => item.div_pk === selectedOption
  );
  tmpForm.trn_div_pk_dms = data.div_pk;
  tmpForm.trn_div_dms = data.div_id;
  tmpForm.trn_div_dms_name = data.div_nama;
};

const handleSelectDeptDMS = async (selectedOption) => {
  console.log("Selected option:", selectedOption);
  const data = listdeptdms._rawValue.find(
    (item) => item.dept_id === selectedOption
  );
  tmpForm.trn_dept_dms = data.dept_id;
  tmpForm.trn_dept_dms_name = data.dept_name;
};

const handleSelectWorkLokDMS = async (selectedOption) => {
  console.log("Selected option:", selectedOption);
  const data = listworklokdms._rawValue.find(
    (item) => item.work_id === selectedOption
  );
  console.log(data);
  tmpForm.trn_worklok_id_dms = data.work_id;
  tmpForm.trn_worklok_dms = data.work_code;
  tmpForm.trn_worklok_dms_name = data.work_desc;
};

const handleSelectVendor = async (selectedOption) => {
  console.log("Selected option:", selectedOption);
  const data = listVendorAll._rawValue.find(
    (item) => item.sup_code_app === selectedOption
  );
  console.log(data.sup_code_app);
  tmpForm.trn_vendor_code = data.sup_code_app;
  tmpForm.trn_vendor_name = data.sup_name;
  tmpForm.trn_vendor_address = data.sup_office_address;
  getListpenandatangananKontrak(data.sup_code_app);
  getListRekeningBank(data.sup_code_app);
};

const filterFnVendor = (val, update) => {
  if (val === "") {
    update(() => {
      listVendorAllOriginal.value = [...listVendorAll.value];
    });
    return;
  }
  console.log("=======>", update);

  update(() => {
    const needle = val.toLowerCase();
    listVendorAllOriginal.value = listVendorAll.value.filter((option) => {
      return option.sup_name.toLowerCase().includes(needle);
    });
  });
};

const filterFnPerjanjianDMS = (val, update) => {
  if (val === "") {
    update(() => {
      listperjanjiandmsOriginal.value = [...listperjanjiandms.value];
    });
    return;
  }
  console.log("=======>", update);

  update(() => {
    const needle = val.toLowerCase();
    listperjanjiandmsOriginal.value = listperjanjiandms.value.filter(
      (option) => {
        return option.perj_desc.toLowerCase().includes(needle);
      }
    );
  });
};

const filterFnDivDMS = (val, update) => {
  if (val === "") {
    update(() => {
      listdivdmsOriginal.value = [...listdivdms.value];
    });
    return;
  }
  console.log("=======>", update);

  update(() => {
    const needle = val.toLowerCase();
    listdivdmsOriginal.value = listdivdms.value.filter((option) => {
      return option.desk.toLowerCase().includes(needle);
    });
  });
};

const filterFnDeptDMS = (val, update) => {
  if (val === "") {
    update(() => {
      listdeptdmsOriginal.value = [...listdeptdms.value];
    });
    return;
  }
  console.log("=======>", update);

  update(() => {
    const needle = val.toLowerCase();
    listdeptdmsOriginal.value = listdeptdms.value.filter((option) => {
      return option.dept_name.toLowerCase().includes(needle);
    });
  });
};

const filterFnWorkLokDMS = (val, update) => {
  if (val === "") {
    update(() => {
      listworklokdmsOriginal.value = [...listworklokdms.value];
    });
    return;
  }
  console.log("=======>", update);

  update(() => {
    const needle = val.toLowerCase();
    listworklokdmsOriginal.value = listworklokdms.value.filter((option) => {
      return option.work_desc.toLowerCase().includes(needle);
    });
  });
};

document.addEventListener("etrasn_setdomain", () => {
  pagination.value.domain = domain();
  pagination2.value.domain = domain();
  // getPengajuanVendor();
});

const updateTable = async () => {
  onRequest({
    pagination: pagination.value,
  });
};
const updateTable2 = async () => {
  onRequest2({
    pagination: pagination2.value,
  });
};

const approveAplikasi = async (trn_code, id) => {
  if (tmpForm.trn_notiket_hds == null || tmpForm.trn_notiket_hds === "") {
    $q.notify({
      type: "negative",
      message: "please input no tiket",
    });
    return;
  }
  if (tmpForm.notes == null || tmpForm.notes === "") {
    $q.notify({
      type: "negative",
      message: "please input notes",
    });
    return;
  }
  try {
    $q.loading.show();

    const resHds = await apiHds.get("cektiketbyspk", {
      params: {
        no_spk: tmpForm.trn_notiket_hds,
      },
    });
    if (resHds.data.data < 1 || resHds.data.data === undefined) {
      $q.loading.hide();
      return $q.notify({
        type: "negative",
        message: "No Tiket HDS not found!",
      });
    }
    if (resHds.data.data.status !== "Selesai") {
      $q.loading.hide();
      return $q.notify({
        type: "negative",
        message:
          "No Tiket HDS " +
          resHds.data.data.status +
          " karena " +
          resHds.data.data.alasan_penolakan,
      });
    }
    tmpForm.trn_status_hds = resHds.data.data.status;

    //002-DBO-2210
    const formData = new FormData();
    formData.append("trn_code", trn_code);
    formData.append("files", tmpForm.trn_file_draft_contract[0]);
    formData.append("trn_notiket_hds", tmpForm.trn_notiket_hds);
    formData.append("trn_status_hds", tmpForm.trn_status_hds);
    formData.append("catatan", tmpForm.notes);
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    const allowedTypes = [
      "application/pdf",
      // "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      // "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      // "image/jpeg",
      // "image/png",
    ];
    if (!allowedTypes.includes(tmpForm.trn_file_draft_contract[0].type)) {
      $q.notify({
        type: "negative",
        message:
          tmpForm.trn_file_draft_contract[0].name +
          " Invalid file type, file must be pdf, xlsx, docs, jpeg or png",
      });
      tmpForm.trn_file_draft_contract = null;
      $q.loading.hide();
      return;
    }
    if (tmpForm.trn_file_draft_contract[0].size > 20 * 1024 * 1024) {
      $q.notify({
        type: "negative",
        message:
          "File " +
          tmpForm.trn_file_draft_contract[0].name +
          " too large, max 20MB",
      });
      tmpForm.trn_file_draft_contract = null;
      $q.loading.hide();
      return;
    }
    await apiEC.post("saveHDS", formData, {
      headers: {
        Authorization: token,
        "Content-Type": "multipart/form-data",
      },
    });
    router.push(`/econtract-kontrakclose/`);

    $q.notify({
      type: "positive",
      message: "Update file successfully",
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

const rejectAplikasi = async (trn_code, id) => {
  const resHds = await apiHds.get("cektiketbyspk", {
    params: {
      no_spk: tmpForm.trn_notiket_hds,
    },
  });
  if (resHds.data.data < 1 || resHds.data.data === undefined) {
    $q.loading.hide();
    return $q.notify({
      type: "negative",
      message: "No Tiket HDS not found!",
    });
  }
  tmpForm.trn_status_hds = resHds.data.data.status;
  if (tmpForm.trn_notiket_hds == null || tmpForm.trn_notiket_hds === "") {
    $q.notify({
      type: "negative",
      message: "please input no tiket",
    });
    return;
  }
  if (tmpForm.notes == null || tmpForm.notes === "") {
    $q.notify({
      type: "negative",
      message: "please input notes approval",
    });
    return;
  }
  let data = {
    id: id,
    trn_code: tmpForm.trn_code,
    trn_notiket_hds: tmpForm.trn_notiket_hds,
    trn_status_hds: tmpForm.trn_status_hds,
    catatan: tmpForm.notes,
  };
  $q.dialog({
    title: "Konfirmasi",
    message: `Are you sure you want to reject No Transaksi <span class="tw-font-bold">${trn_code}</span>?`,
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
      $q.loading.show();
      await apiEC.put("rejectHDS", data, {
        headers: {
          Authorization: token,
        },
      });
      $q.loading.hide();
      $q.notify({
        type: "positive",
        message: `No dokumen <span class="tw-font-bold">${trn_code}</span> reject successfully`,
        html: true,
      });
      router.push(`/econtract-kontrakclose/`);
    } catch (error) {
      $q.loading.hide();
      $q.notify({
        type: "negative",
        message: ParseError(error),
      });
    }
  });
};

const download = async (value) => {
  $q.loading.show();
  let res = await apiEC.get("downloadKontakLampiran", {
    params: {
      file: value,
    },
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", value);
  document.body.appendChild(link);
  link.click();
  $q.loading.hide();
};

const updateFile = async (itemToUpdate, list) => {
  // alert("gantiii");
  $q.loading.show({
    message: "Upload file in progress. Hang on...",
  });
  try {
    const formData = new FormData();
    formData.append("trn_code", tmpForm.trn_code);
    formData.append("files", tmpForm.trn_file_fix_contract[0]);
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    const allowedTypes = [
      "application/pdf",
      // "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      // "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      // "image/jpeg",
      // "image/png",
    ];
    if (!allowedTypes.includes(tmpForm.trn_file_fix_contract[0].type)) {
      $q.notify({
        type: "negative",
        message:
          tmpForm.trn_file_fix_contract[0].name +
          " Invalid file type, file must be pdf, xlsx, docs, jpeg or png",
      });
      tmpForm.trn_file_fix_contract = null;
      $q.loading.hide();
      return;
    }

    if (tmpForm.trn_file_fix_contract[0].size > 20 * 1024 * 1024) {
      $q.notify({
        type: "negative",
        message:
          "File " +
          tmpForm.trn_file_fix_contract[0].name +
          " too large, max 20MB",
      });
      tmpForm.trn_file_fix_contract = null;
      $q.loading.hide();
      return;
    }
    await apiEC.post("updateFileFixKontrak", formData, {
      headers: {
        Authorization: token,
        "Content-Type": "multipart/form-data",
      },
    });
    getNomorDokumen();

    $q.notify({
      type: "positive",
      message: "Update file successfully",
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

const formattedDate = (dateTime) => {
  const date = new Date(dateTime);
  const day = ("0" + date.getDate()).slice(-2);
  const monthIndex = date.getMonth();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear().toString();
  const hours = ("0" + date.getUTCHours()).slice(-2);
  const minutes = ("0" + date.getUTCMinutes()).slice(-2);
  const seconds = ("0" + date.getUTCSeconds()).slice(-2);
  return `${day}/${month}/${year}`;
};

const formattedDate3 = (dateTime) => {
  const date = new Date(dateTime);
  const day = ("0" + date.getUTCDate()).slice(-2);
  const month = ("0" + (date.getUTCMonth() + 1)).slice(-2);
  const year = date.getUTCFullYear().toString();
  const hours = ("0" + date.getUTCHours()).slice(-2);
  const minutes = ("0" + date.getUTCMinutes()).slice(-2);
  const seconds = ("0" + date.getUTCSeconds()).slice(-2);
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

const formattedDate2 = (dateTime) => {
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const date = new Date(dateTime);
  const day = ("0" + date.getDate()).slice(-2);
  const monthIndex = date.getMonth();
  const month = months[monthIndex];
  const year = date.getFullYear().toString();

  return `${day} ${month} ${year}`;
};

const pdfDownload = () => {
  const element = document.getElementById("pdf-content");
  const opt = {
    margin: [0, 0, 0, 0],
    filename: "document_" + tmpForm.no_dokumen + ".pdf",
    image: { type: "jpeg", quality: 1 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: {
      unit: "px",
      format: [element.clientWidth, element.clientHeight],
      orientation: "portrait",
    },
  };

  // Buat pratinjau PDF
  html2pdf()
    .from(element)
    .set(opt)
    .outputPdf("datauristring")
    .then(function (pdfDataUri) {
      // Tampilkan pratinjau PDF dalam iframe
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = pdfDataUri;
      document.body.appendChild(iframe);

      // Konfirmasi pengguna untuk mengunduh atau tidak
      if (confirm("Apakah Anda ingin mengunduh PDF ini?")) {
        // Jika pengguna memilih untuk mengunduh, lakukan proses pengunduhan
        html2pdf().from(element).set(opt).save();
      }

      // Hapus iframe setelah pengunduhan atau ditutup
      iframe.onload = function () {
        document.body.removeChild(iframe);
      };
    });
};
</script>
