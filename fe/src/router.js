import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      redirect: "/dashboard",
      component: () => import("./layouts/MainLayout.vue"),
      children: [
        { path: "dashboard", component: () => import("./pages/Index.vue") },
        {
          path: "pengajuanharga",
          component: () => import("./pages/etransport/PengajuanHarga.vue"),
        },
        {
          path: "surat-jalan/list-surat-jalan",
          component: () => import("./pages/SuratJalan/ListSuratJalan.vue"),
        },
        {
          // path: "SJ/shipment/details/:domain/:nopol/:tgl", component: () => import("./pages/SuratJalan/DetailSuratJalan.vue")
          path: "surat-jalan/list-surat-jalan/shipment/details/:nopol/:params",
          component: () => import("./pages/SuratJalan/DetailSuratJalan.vue"),
        },
        {
          path: "tagihan",
          component: () => import("./pages/tagihan/Tagihan.vue"),
        },
        {
          path: "tagihanedit/tagihan",
          component: () => import("./pages/tagihan/Tagihan.vue"),
        },
        {
          path: "tagihanedit/:notagihan",
          component: () => import("./pages/tagihan/TagihanEdit.vue"),
        },
        {
          path: "Monitor",
          component: () => import("./pages/Shipment/Monitor.vue"),
        },
        {
          path: "tnd_vendor",
          component: () => import("./pages/DigitalTND/Vendor.vue"),
        },
        {
          path: "tnd_vendor",
          component: () => import("./pages/DigitalTND/Vendor.vue"),
        },
      ],
      beforeEnter: (to, from, next) => {
        if (!window.localStorage.getItem("token")) {
          next({
            path: "/login",
          });
        } else {
          next();
        }
      },
    },
    {
      path: "/login",
      component: () => import("./layouts/MainLogin.vue"),
    },
    {
      path: "/loginvendor",
      component: () => import("./layouts/MainLoginVendor.vue"),
    },
    {
      path: "/forgotPassword",
      component: () => import("./layouts/MainForgotPassword.vue"),
    },
    {
      path: "/update_password/:npwp",
      component: () => import("./layouts/UpdatePassword.vue"),
    },
    {
      path: "/approve",
      component: () => import("./layouts/etransport/MainApprove.vue"),
    },
    {
      path: "/Autologin/PICApproval/:id",
      component: () => import("./layouts/etransport/Autologin.vue"),
    },
    {
      path: "/Autologin/ApprovalHargaTransporter/:id",
      component: () =>
        import("./layouts/etransport/Autologin_ApprovalHargaTransporter.vue"),
    },
    {
      path: "/reminder",
      component: () => import("./pages/etransport/Reminder.vue"),
    },
    {
      path: "/e-tender",
      component: () => import("./layouts/MainLayout.vue"),
      children: [
        {
          path: "list-monitoring-rfq",
          component: () => import("./pages/etender/ListMonitoringRfq.vue"),
        },
      ],
    },
    {
      path: "/bukti-potong",
      component: () => import("./layouts/MainLayout.vue"),
      children: [
        {
          path: "data-bukti-potong",
          component: () => import("./pages/BuktiPotong/DataBuPot.vue"),
        },
      ],
      beforeEnter: (to, from, next) => {
        if (!window.localStorage.getItem("token")) {
          next({
            path: "/login",
          });
        } else {
          next();
        }
      },
    },
    {
      path: "/borongan",
      component: () => import("./layouts/MainLayout.vue"),
      children: [
        {
          path: "list-borongan",
          component: () => import("./pages/Borongan/ListBorongan.vue"),
        },
      ],
      beforeEnter: (to, from, next) => {
        if (!window.localStorage.getItem("token")) {
          next({
            path: "/login",
          });
        } else {
          next();
        }
      },
    },
    {
      path: "/data-order-cathering",
      component: () => import("./layouts/MainLayout.vue"),
      children: [
        {
          path: "data-order-cathering",
          component: () =>
            import("./pages/OrderCathering/DataOrderCathering.vue"),
        },
        {
          path: "report-order-makan",
          component: () => import("./pages/OrderCathering/OrderMakan.vue"),
        },
      ],
      beforeEnter: (to, from, next) => {
        if (!window.localStorage.getItem("token")) {
          next({
            path: "/login",
          });
        } else {
          next();
        }
      },
    },
    // {
    //   path: "/forgotPassword",
    //   component: () => import("layouts/MainForgotPassword.vue"),
    // },

    // Always leave this as last one,
    // but you can also remove it
    {
      path: "/:catchAll(.*)*",
      component: () => import("./pages/Error404.vue"),
    },

    /* Start eReg Vendor */
    {
      path: "/register",
      component: () => import("./layouts/MainRegister.vue"),
    },
    {
      path: "/register_valid/:npwp",
      component: () => import("./layouts/MainRegisterValid.vue"),
    },
    {
      path: "/register_form/:enkrip/:code",
      component: () => import("./layouts/MainRegisterForm.vue"),
    },
    {
      path: "/register_form/:enkrip/:code/form",
      component: () => import("./layouts/MainRegisterForm.vue"),
      children: [
        {
          path: "/register_form/:enkrip/:code/form1",
          component: () => import("./pages/regvendor/form/Index.vue"),
        },
        {
          path: "/register_form/:enkrip/:code/form2",
          component: () => import("./pages/regvendor/form/Profile.vue"),
        },
        {
          path: "/register_form/:enkrip/:code/form3",
          component: () => import("./pages/regvendor/form/KontakPerson.vue"),
        },
        {
          path: "/register_form/:enkrip/:code/form4",
          component: () => import("./pages/regvendor/form/DewanDireksi.vue"),
        },
        {
          path: "/register_form/:enkrip/:code/form5",
          component: () => import("./pages/regvendor/form/AdminUmum.vue"),
        },
        {
          path: "/register_form/:enkrip/:code/form6",
          component: () =>
            import("./pages/regvendor/form/VendorTransporter.vue"),
        },
        {
          path: "/register_form/:enkrip/:code/form7",
          component: () => import("./pages/regvendor/form/VendorAgenResmi.vue"),
        },
        {
          path: "/register_form/:enkrip/:code/form8",
          component: () => import("./pages/regvendor/form/KontraktorSipil.vue"),
        },
        {
          path: "/register_form/:enkrip/:code/form9",
          component: () => import("./pages/regvendor/form/RekeningBank.vue"),
        },
        {
          path: "/register_form/:enkrip/:code/form10",
          component: () => import("./pages/regvendor/form/GroupPerusahaan.vue"),
        },
        {
          path: "/register_form/:enkrip/:code/form11",
          component: () => import("./pages/regvendor/form/NamaPejabat.vue"),
        },
        {
          path: "/register_form/:enkrip/:code/form12",
          component: () =>
            import("./pages/regvendor/form/QualityEnvironment.vue"),
        },
        {
          path: "/register_form/:enkrip/:code/form13",
          component: () => import("./pages/regvendor/form/PaktaIntegritas.vue"),
        },
        {
          path: "/register_form/:enkrip/:code/form14",
          component: () =>
            import("./pages/regvendor/form/PengalamanPerusahaan.vue"),
        },
        {
          path: "/register_form/:enkrip/:code/form15",
          component: () => import("./pages/regvendor/form/PenandaKontrak.vue"),
        },
        {
          path: "/register_form/:enkrip/:code/form16",
          component: () => import("./pages/regvendor/form/CompanyProfile.vue"),
        },
        {
          path: "/register_form/:enkrip/:code/form17",
          component: () => import("./pages/regvendor/form/ScopeKerja.vue"),
        },
      ],
    },
    {
      path: "/",
      redirect: "/dashboard",
      component: () => import("./layouts/MainLayout.vue"),
      children: [
        // { path: "dashboard", component: () => import("./pages/Index.vue") },
        {
          path: "Profile",
          component: () => import("./pages/regvendor/Profile.vue"),
        },
        {
          path: "Dokumen",
          component: () => import("./pages/regvendor/Dokumen.vue"),
        },
        {
          path: "UpdateProfile",
          component: () => import("./pages/regvendor/UpdateProfile.vue"),
        },
        {
          path: "UpdateDokumen",
          component: () => import("./pages/regvendor/UpdateDokumen.vue"),
        },
        {
          path: "SendChangeData",
          component: () => import("./pages/regvendor/SendChangeData.vue"),
        },
      ],
      beforeEnter: (to, from, next) => {
        if (!window.localStorage.getItem("token")) {
          next({
            path: "/login",
          });
        } else {
          next();
        }
      },
    },
    /* End eReg Vendor */

    /* 22-089-Improvement eReg Vendor (procsys) */
    {
      path: "/ereg",
      component: () => import("./layouts/MainLayout.vue"),
      children: [
        {
          path: "e-mrr",
          component: () => import("./pages/regvendor/eMRR.vue"),
        },
        { path: "e-po", component: () => import("./pages/regvendor/ePO.vue") },
      ],
      beforeEnter: (to, from, next) => {
        if (!window.localStorage.getItem("token")) {
          next({
            path: "/login",
          });
        } else {
          next();
        }
      },
    },
    /* End 22-089-Improvement eReg Vendor (procsys) */
  ],
});

export default router;
