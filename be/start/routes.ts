/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from "@ioc:Adonis/Core/Route";

Route.get("/", async () => {
  return { hello: "world" };
});

// Route.post("/login", async () => {
//   return { hello: "world" };
// });

Route.post("refresh_token", "master/UserController.refresh_token");
Route.post("login", "master/UserController.login");
Route.post("loginvendor", "etransport/VendorController.loginvendor");
Route.post("forgotPassword", "etransport/VendorController.forgotPassword");
Route.post("get_security_control", "etransport/VendorController.get_security_control");
Route.post("updatePassword", "etransport/VendorController.updatePassword");


Route.get("getMenuAplikasiByUser",  "master/OtherController.getMenuAplikasiByUser");
Route.get("getMenuAplikasi",  "master/OtherController.getMenuAplikasi");
Route.post("saveAkses",  "master/OtherController.saveAkses");

Route.group(() =>
{
  Route.get("getUser", "master/UserController.getUser");
}).middleware('auth')

Route.get("getPengajuanHarga", "etransport/PengajuanHargaController.getPengajuanHarga");
Route.get("getLokasiMuat", "etransport/PengajuanHargaController.getLokasiMuat");
Route.get("getLokasiMuatEDIT", "etransport/PengajuanHargaController.getLokasiMuatEDIT");
Route.get("getJnsKendaraan", "etransport/PengajuanHargaController.getJnsKendaraan");
Route.get("getLokasiTujuan", "etransport/PengajuanHargaController.getLokasiTujuan");
Route.get("getLokasiTujuanEdit", "etransport/PengajuanHargaController.getLokasiTujuanEdit");
Route.post("savePengajuanHarga", "etransport/PengajuanHargaController.savePengajuanHarga");
Route.post("sendPengajuanHarga", "etransport/PengajuanHargaController.sendPengajuanHarga");
Route.post("saveEditPengajuanHarga", "etransport/PengajuanHargaController.saveEditPengajuanHarga");
Route.post("deletePengajuanHarga", "etransport/PengajuanHargaController.deletePengajuanHarga");
Route.get("getDetailPengajuan", "etransport/PengajuanHargaController.getDetailPengajuan");

Route.get("getListTagihan", "tagihan/TagihanController.getListTagihan");
Route.post("deleteTagihan", "tagihan/TagihanController.deleteTagihan");
Route.get("getTagihan", "tagihan/TagihanController.getTagihan");
Route.get("getListPO", "tagihan/TagihanController.getTagihanPO");
Route.get("getListInv", "tagihan/TagihanController.getTagihanInv");
Route.get("getInvPO", "tagihan/TagihanController.getInvPO");
Route.get("getPO", "tagihan/TagihanController.getPO");
Route.get("getPOFilter", "tagihan/TagihanController.getPOFilter");
Route.get("getPOMrr", "tagihan/TagihanController.getPOMrr");
Route.get("getdetailPO", "tagihan/TagihanController.getdetailPO");
Route.get("getdetailPOEdit", "tagihan/TagihanController.getdetailPOEdit");
Route.get("getdppPO", "tagihan/TagihanController.getdppPO");
Route.get("getPajakJenis", "tagihan/TagihanController.getPajakJenis");
Route.get("getPajakJenisFilter","tagihan/TagihanController.getPajakJenisFilter")

Route.post("tambahinvoicesimpan", "tagihan/TagihanController.tambahinvoicesimpan");
Route.post("tambahtagihansimpan", "tagihan/TagihanController.tambahtagihansimpan");
Route.post("prosestagihan", "tagihan/TagihanController.prosestagihan");
Route.post("tambahposimpan", "tagihan/TagihanController.tambahposimpan");
Route.get("getDetailInv", "tagihan/TagihanController.getDetailInv");
Route.post("deletePO", "tagihan/TagihanController.deletePO");
Route.post("deleteInvoice", "tagihan/TagihanController.deleteInvoice");
Route.get("getFiles", "tagihan/TagihanController.getFiles");
Route.get("downloadFiles", "tagihan/TagihanController.downloadFiles");
Route.get("deleteFiles", "tagihan/TagihanController.deleteFiles");


Route.post("autologin", "master/UserController.autologin");

Route.get("getReminder", "master/OtherController.getReminder");


/*================================= START eRegistrasi =================================*/
Route.get("getBu", "regvendor/RegisterController.getBu");
Route.get("getKategori", "regvendor/RegisterController.getKategori");
Route.get("getKategoriSub", "regvendor/RegisterController.getKategoriSub");
Route.get("getBank", "regvendor/RegisterController.getBank");
Route.get("getKotaCabang", "regvendor/RegisterController.getKotaCabang");
Route.post("savedataRegisVendor", "regvendor/RegisterController.validationdata");
Route.post("savecodeRegisVendor", "regvendor/RegisterController.validationcode");
Route.post("resendcodeRegisVendor", "regvendor/RegisterController.resendmailcode");
Route.get("cekLinkRegisVendor", "regvendor/RegisterController.cekLinkRegisVendor");
Route.get("getProgressReg", "regvendor/RegisterController.getProgress");
Route.post("saveRegistrasiFinal", "regvendor/RegisterController.saveRegistrasi");

/* Profile */
Route.get("getDataProfile", "regvendor/RegisterController.getDataProfile");
Route.put("saveProfile/:code/:npwp", "regvendor/RegisterController.saveProfile");

/* Kontak Person */
Route.get("getKontakPerson", "regvendor/RegisterController.getKontakPerson");
Route.get("getDataKontakPerson", "regvendor/RegisterController.getDataKontakPerson");
Route.post("saveKontakPerson", "regvendor/RegisterController.saveaddKontakPerson");
Route.put("saveKontakPerson/:id", "regvendor/RegisterController.saveupdateKontakPerson");
Route.delete("delKontakPerson/:id", "regvendor/RegisterController.delKontakPerson");

/* Dewan Direksi */
Route.get("getDewanDireksi", "regvendor/RegisterController.getDewanDireksi");
Route.get("getDataDewanDireksi", "regvendor/RegisterController.getDataDewanDireksi");
Route.post("saveDewanDireksi", "regvendor/RegisterController.saveaddDewanDireksi");
Route.put("saveDewanDireksi/:id", "regvendor/RegisterController.saveupdateDewanDireksi");
Route.delete("delDewanDireksi/:id", "regvendor/RegisterController.delDewanDireksi");

/* Kelengkapan Administrasi Umum */
Route.post("saveAdminUmum", "regvendor/RegisterController.saveAdminUmum");
Route.put("getAdminUmum/:code/:column", "regvendor/RegisterController.getAdminUmum");

/* Kelengkapan tambahan untuk vendor Transporter */
Route.get("getVendorTransporter", "regvendor/RegisterController.getVendorTransporter");
Route.post("saveVendorTransporter", "regvendor/RegisterController.saveVendorTransporter");
Route.delete("delVendorTransporter/:id", "regvendor/RegisterController.delVendorTransporter");

/* Kelengkapan Tambahan untuk Vendor Keagenan Resmi */
Route.post("saveVendorAgenResmi", "regvendor/RegisterController.saveVendorAgenResmi");
Route.put("getVendorAgenResmi/:code/:column", "regvendor/RegisterController.getVendorAgenResmi");
Route.post("savefileVendorAgenResmi", "regvendor/RegisterController.savefileVendorAgenResmi");
Route.get("getfileVendorAgenResmi", "regvendor/RegisterController.getfileVendorAgenResmi");
Route.delete("delfileVendorAgenResmi/:id", "regvendor/RegisterController.delfileVendorAgenResmi");

/* Kelengkapan Tambahan Untuk Kontraktor Sipil / Elektrikal */ 
Route.post("saveKontraktorSipil", "regvendor/RegisterController.saveKontraktorSipil");
Route.put("getKontraktorSipil/:code/:column", "regvendor/RegisterController.getKontraktorSipil");
Route.post("savefileKontraktorSipil", "regvendor/RegisterController.savefileKontraktorSipil");
Route.get("getfileKontraktorSipil", "regvendor/RegisterController.getfileKontraktorSipil");
Route.delete("delfileKontraktorSipil/:id", "regvendor/RegisterController.delfileKontraktorSipil");

/* Rekening Bank */
Route.get("getRekeningBank", "regvendor/RegisterController.getRekeningBank");
Route.get("getDataRekeningBank", "regvendor/RegisterController.getDataRekeningBank");
Route.post("saveRekeningBank", "regvendor/RegisterController.saveaddRekeningBank");
Route.put("saveRekeningBank/:id", "regvendor/RegisterController.saveupdateRekeningBank");
Route.delete("delRekeningBank/:id", "regvendor/RegisterController.delRekeningBank");
Route.post("savefileRekeningBank", "regvendor/RegisterController.savefileRekeningBank");
Route.get("getfileRekeningBank", "regvendor/RegisterController.getfileRekeningBank");
Route.delete("delfileRekeningBank/:id", "regvendor/RegisterController.delfileRekeningBank");

/* Group/Anak Perusahaan */
Route.get("getGroupPers", "regvendor/RegisterController.getGroupPers");
Route.get("getDataGroupPers", "regvendor/RegisterController.getDataGroupPers");
Route.post("saveGroupPers", "regvendor/RegisterController.saveaddGroupPers");
Route.put("saveGroupPers/:id", "regvendor/RegisterController.saveupdateGroupPers");
Route.delete("delGroupPers/:id", "regvendor/RegisterController.delGroupPers");

/* Nama Pejabat / Kuasa Penandatanganan Faktur Pajak */
Route.get("getNamaPejabat", "regvendor/RegisterController.getNamaPejabat");
Route.get("getDataNamaPejabat", "regvendor/RegisterController.getDataNamaPejabat");
Route.post("saveNamaPejabat", "regvendor/RegisterController.saveaddNamaPejabat");
Route.put("saveNamaPejabat/:id", "regvendor/RegisterController.saveupdateNamaPejabat");
Route.delete("delNamaPejabat/:id", "regvendor/RegisterController.delNamaPejabat");
Route.post("savefileNamaPejabat", "regvendor/RegisterController.savefileNamaPejabat");
Route.get("getfileNamaPejabat", "regvendor/RegisterController.getfileNamaPejabat");
Route.delete("delfileNamaPejabat/:id", "regvendor/RegisterController.delfileNamaPejabat");

/* Quality dan Environment */
Route.put("getQualityEnvironment/:code/:column", "regvendor/RegisterController.getQualityEnvironment");
Route.get("getDataQualityEnvironment", "regvendor/RegisterController.getDataQualityEnvironment");
Route.post("saveQualityEnvironment", "regvendor/RegisterController.saveQualityEnvironment");
Route.post("savefileQualityEnvironment", "regvendor/RegisterController.savefileQualityEnvironment");
Route.get("getfileQualityEnvironment", "regvendor/RegisterController.getfileQualityEnvironment");
Route.delete("delfileQualityEnvironment/:id", "regvendor/RegisterController.delfileQualityEnvironment");

/* Pakta Integritas */
Route.get("getPaktaIntegritas", "regvendor/RegisterController.getPaktaIntegritas");
Route.post("savePaktaIntegritas", "regvendor/RegisterController.savePaktaIntegritas");
Route.delete("delPaktaIntegritas/:id", "regvendor/RegisterController.delPaktaIntegritas");

/* Pengalaman Perusahaan */
Route.get("getPengalamanPerusahaan", "regvendor/RegisterController.getPengalamanPerusahaan");
Route.get("getDataPengalamanPerusahaan", "regvendor/RegisterController.getDataPengalamanPerusahaan");
Route.post("savePengalamanPerusahaan", "regvendor/RegisterController.saveaddPengalamanPerusahaan");
Route.put("savePengalamanPerusahaan/:id", "regvendor/RegisterController.saveupdatePengalamanPerusahaan");
Route.delete("delPengalamanPerusahaan/:id", "regvendor/RegisterController.delPengalamanPerusahaan");
Route.post("savefilePengalamanPerusahaan", "regvendor/RegisterController.savefilePengalamanPerusahaan");
Route.get("getfilePengalamanPerusahaan", "regvendor/RegisterController.getfilePengalamanPerusahaan");
Route.delete("delfilePengalamanPerusahaan/:id", "regvendor/RegisterController.delfilePengalamanPerusahaan");

/* Menu eRegistrasi Supplier */
Route.get("getVendProfile", "regvendor/ProfileController.getProfile");
Route.get("getVendDokumen", "regvendor/DokumenController.getDokumen");
Route.get("getVendKontakPerson", "regvendor/DokumenController.getKontakPerson");
Route.get("getVendDewanDireksi", "regvendor/DokumenController.getDewanDireksi");
Route.get("getVendAdminUmum", "regvendor/DokumenController.getAdminUmum");
Route.get("getVendVendorTransporter", "regvendor/DokumenController.getVendorTransporter");
Route.get("getVendVendorAgenResmi", "regvendor/DokumenController.getVendorAgenResmi");
Route.get("getVendKontraktorSipil", "regvendor/DokumenController.getKontraktorSipil");
Route.get("getVendRekeningBank", "regvendor/DokumenController.getRekeningBank");
Route.get("getVendGroupPerusahaan", "regvendor/DokumenController.getGroupPerusahaan");
Route.get("getVendNamaPejabat", "regvendor/DokumenController.getNamaPejabat");
Route.get("getVendQualityEnvironment", "regvendor/DokumenController.getQualityEnvironment");
Route.get("getVendPaktaIntegritas", "regvendor/DokumenController.getPaktaIntegritas");
Route.get("getVendPengalamanPers", "regvendor/DokumenController.getPengalamanPers");
Route.get("getVendFileVendorAgenResmi", "regvendor/DokumenController.getFileVendorAgenResmi");
Route.get("getBankUpd", "regvendor/DokumenController.getBank");
Route.get("getKotaCabangUpd", "regvendor/DokumenController.getKotaCabang");

Route.get("getVendFileKontraktorSipil", "regvendor/DokumenController.getFileKontraktorSipil");
Route.get("getVendFileRekeningBank", "regvendor/DokumenController.getFileRekeningBank");
Route.get("getVendFileNamaPejabat", "regvendor/DokumenController.getFileNamaPejabat");
Route.get("getVendFileQualityEnvironment", "regvendor/DokumenController.getFileQualityEnvironment");
Route.get("getVendFilePengalamanPers", "regvendor/DokumenController.getFilePengalamanPers");
Route.post("saveUpdateProfile", "regvendor/ProfileController.saveUpdateProfile");
Route.post("saveKontakPersonUpd", "regvendor/RegisterController.saveaddKontakPersonUpd");
Route.post("saveDewanDireksiUpd", "regvendor/RegisterController.saveaddDewanDireksiUpd");
Route.post("saveAdminUmumUpd", "regvendor/RegisterController.saveAdminUmumUpd");
Route.post("saveTranspUpd", "regvendor/RegisterController.saveTranspUpd");
Route.post("saveComProUpd", "regvendor/RegisterController.saveComProUpd");
Route.post("saveUploadVend", "regvendor/RegisterController.saveUploadVend");
Route.post("saveAgenUpd", "regvendor/RegisterController.saveAgenUpd");
Route.post("saveElekUpd", "regvendor/RegisterController.saveElekUpd");
Route.delete("delVendorTransporterUpd/:id", "regvendor/RegisterController.delVendorTransporterUpd");
Route.get("getRegisVend", "regvendor/RegisterController.getRegisVend");
Route.post("saveRekeningBankUpd", "regvendor/RegisterController.saveaddRekeningBankUpd");
Route.post("saveGroupPersUpd", "regvendor/RegisterController.saveaddGroupPersUpd");
Route.post("saveNamaPejabatUpd", "regvendor/RegisterController.saveaddNamaPejabatUpd");
Route.post("saveQualityEnvUpd", "regvendor/RegisterController.saveQualityEnvUpd");
Route.post("sendChangeDataEreg", "regvendor/RegisterController.sendChangeDataEreg");
Route.post("savePengPerUpd", "regvendor/RegisterController.savePengPerUpd");
Route.get("getVendAdminUmumUpd", "regvendor/DokumenController.getAdminUmumUpd");
Route.get("getVendAdmUmum", "regvendor/DokumenController.getVendAdmUmum");
Route.get("getVendTransporter", "regvendor/DokumenController.getVendorTransporter");
Route.get("getVendDataUpload", "regvendor/DokumenController.getVendDataUpload");
Route.get("getVendQualityEnvironmentUpd", "regvendor/DokumenController.getQualityEnvironmentUpd");
Route.get("getQualityEnvUpd", "regvendor/DokumenController.getQualityEnvUpd");
Route.post("nonActive", "regvendor/DokumenController.nonActive");


/* added by zulvi */
Route.get("getEMRR", "regvendor/EregController.index");
Route.get("getEPO", "regvendor/EregController.getEPO");
Route.get("getFilEMRR", "regvendor/EregController.getFilEMRR");
Route.get("getExEMRR", "regvendor/EregController.getExEMRR");
Route.get("getFilEPO", "regvendor/EregController.getFilEPO");
Route.get("getExEPO", "regvendor/EregController.getExEPO");
Route.get("getAppBu", "regvendor/EregController.getAppBu");
Route.get("getPoMrr", "regvendor/EregController.getPoMrr");
Route.get("getPoMst", "regvendor/EregController.getPoMst");

/*================================= FINISH eRegistrasi =================================*/

// Bukti Potong
Route.post("saveUploadBuPot", "BuPot/BuktiPotongController.saveUploadBuPot");
Route.get("getBuktiPotong", "BuPot/BuktiPotongController.getBuktiPotong");
Route.get("getBuktiPotong2", "BuPot/BuktiPotongController.getBuktiPotong2");
Route.get("downloadbupot", "BuPot/BuktiPotongController.downloadbupot");
Route.post("deleteBuktiPotong", "BuPot/BuktiPotongController.deleteBuktiPotong");
Route.post("getBuktiPotongWithFilter", "BuPot/BuktiPotongController.getBuktiPotongWithFilter");

Route.get("getBorongan", "Borongan/BoronganController.getBorongan");
Route.get("getDetailListBorongan", "Borongan/BoronganController.getDetailListBorongan");
Route.post("getBoronganWithFilter", "Borongan/BoronganController.getBoronganWithFilter");
Route.post("saveListBorongan", "Borongan/BoronganController.saveListBorongan");
Route.post("revisiListBorongan", "Borongan/BoronganController.revisiListBorongan");
Route.post("sendEmailRevBorongan", "Borongan/BoronganController.sendEmailRevBorongan");
Route.post("approveListBorongan", "Borongan/BoronganController.approveListBorongan");
Route.post("sendEmailApproveBorongan", "Borongan/BoronganController.sendEmailApproveBorongan");

// SURAT JALAN //
Route.get("getBisnisUnit", "SuratJalan/SuratJalanController.getBisnisUnit");
Route.get("getListSuratJalan", "SuratJalan/SuratJalanController.getListSuratJalan");
Route.get("getListDetailSuratJalan", "SuratJalan/SuratJalanController.getListDetailSuratJalan");
Route.get("printSJ", "SuratJalan/SuratJalanController.printSJ");
// Monitor Pengiriman
Route.get("getShipmentMonitor", "shipment/MonitorController.getMonitor");
Route.get("getAdminSJ", "shipment/MonitorController.getAdminSJ");
Route.get("getAdminSJDetail", "shipment/MonitorController.getAdminSJDetail");
Route.get("getAdminMuat", "shipment/MonitorController.getAdminMuat");
Route.get("getAdminMuatNgoro", "shipment/MonitorController.getAdminMuatNgoro");
Route.get("getMSupplier", "shipment/MonitorController.getMSupplier");

// Project Improvement e-Registrasi Vendor
Route.get("getScopeKerjaUpd", "regvendor/DokumenController.getScopeKerjaUpd");
Route.get("getScopeKerjaDok", "regvendor/DokumenController.getScopeKerjaDok");
Route.post("saveScopeKerjaUpd", "regvendor/RegisterController.saveScopeKerjaUpd");
Route.post("savePenandaKontrakUpd", "regvendor/RegisterController.saveaddPenandaKontrakUpd");
Route.get("getVendPenandaKontrak", "regvendor/DokumenController.getPenandaKontrak");
Route.get("getCompanyProfileUpd", "regvendor/DokumenController.getCompanyProfileUpd");
Route.get("getBuRegVend", "regvendor/RegisterController.getBuRegVend");
Route.post("savedKontakPerson", "regvendor/RegisterController.savedKontakPerson");
Route.post("/saveLog", "regvendor/EregController.saveLog");
Route.get("getCountKonPerson", "regvendor/DokumenController.getCountKonPerson");

/* Penandatangan Kontrak */
Route.post("savePenandaKontrak", "regvendor/RegisterController.saveaddPenandaKontrak");
Route.get("getPenandaKontrak", "regvendor/RegisterController.getPenandaKontrak");
Route.put("savePenandaKontrak/:id", "regvendor/RegisterController.saveupdatePenandaKontrak");
Route.delete("delPenandaKontrak/:id", "regvendor/RegisterController.delPenandaKontrak");

/* Company Profile */
Route.post("saveCompanyProfile", "regvendor/RegisterController.saveCompanyProfile");
Route.get("getCompanyProfile", "regvendor/RegisterController.getCompanyProfile");
Route.delete("delCompanyProfile/:id", "regvendor/RegisterController.delCompanyProfile");

/* Scope Kerjaan */
Route.post("saveScopeKerja", "regvendor/RegisterController.saveScopeKerja");
Route.post("delScopeKerja", "regvendor/RegisterController.delScopeKerja");
Route.get("getScopeKerja", "regvendor/RegisterController.getScopeKerja");
