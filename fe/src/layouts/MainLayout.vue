<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar style="height: 70px" :class="$q.dark.mode ? 'bg-dark text-white' : 'bg-grey1 text-white'">
        <q-btn v-if="menuType == false" flat @click="drawer = !drawer" round dense icon="menu" />
        <!-- <img src="dbc-bg-white.png" alt="Logo" class="img-logo" /> -->
        <div class="tw-bg-white tw-h-[71px]  tw-p-2  tw-w-[130px] tw-m-auto tw-hidden md:tw-block"
          :class="menuType ? 'tw-ml-[-12px]' : 'tw-ml-2'">
          <img src="logo.png" alt="Logo" class="img-logo  tw-m-auto  tw-hidden md:tw-block" />
        </div>
        <q-toolbar-title> Vendor Portal </q-toolbar-title>

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <!-- <q-btn round dense flat :icon="$q.dark.mode == true ? 'light_mode' : 'dark_mode'" v-if="$q.screen.gt.sm"
            @click="setMode">
            <q-tooltip v-if="$q.dark.mode == true">Mode Terang</q-tooltip>
            <q-tooltip v-if="$q.dark.mode == false">Mode Gelap</q-tooltip>
          </q-btn> -->

          <div v-if="Domain != 'null'">{{ Domain }}</div>
          <q-btn v-if="Domain != 'null'" round dense flat icon="apps">
            <q-menu>
              <q-list style="min-width: 120px">
                <q-item clickable v-close-popup>
                  <q-item-section>Pilih Domain</q-item-section>
                </q-item>
                <q-separator />
                <q-item v-for="(data, i) in listDomain" :key="i" clickable v-close-popup @click="setDomain(data)">
                  <q-item-section>{{ data.domain }}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
          <q-btn round flat>
            <q-avatar size="26px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar>
            <q-menu>
              <div class="row no-wrap q-pa-md">
                <div class="column">
                  <div class="text-h6 q-mb-md">Settings</div>
                  <!-- <q-toggle v-model="mode" @click="setMode" label="Dark Mode" /> -->
                  <q-toggle v-model="menuType" @click="setModeMenu" label="Top Menu" />
                </div>

                <q-separator vertical inset class="q-mx-lg" />

                <div class="column items-center">
                  <q-avatar size="72px">
                    <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
                  </q-avatar>
                  <div class="text-body2 q-mt-md">{{ nama() }}</div>
                  <div class="text-body2 q-mb-xs">{{ nik() }}</div>
                  <q-btn color="primary" label="Logout" push size="sm" @click="logoutUser" />
                </div>
              </div>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>

      <q-toolbar v-if="$q.screen.gt.sm && menuType == true" inset class="bg-grey-3">
        <div class="
              GL__toolbar-link
              q-ml-xs q-gutter-md
              text-body2 text-weight-light
              row
              items-center
              no-wrap
            ">
          <template v-for="(menuItem, index) in listMenu" :key="index">
            <div v-if="menuItem.children.length == 0">
              <router-link :to="menuItem.link">
                <a href="javascript:void(0)" class="text-black">
                  <!-- <q-icon size="18px" class="icon-menu" :name="fasBook" /> -->
                  <q-icon size="18px" :name="menuItem.icon" />
                  {{ menuItem.nama_aplikasi }}
                </a>
              </router-link>
            </div>
            <div v-else>
              <a href="javascript:void(0)" class="text-black">
                <q-icon size="18px" :name="menuItem.icon" />
                {{ menuItem.nama_aplikasi }}
                <q-icon name="arrow_drop_down" size="16px" />
                <q-menu auto-close class="q-menu-navbar">
                  <q-list dense>
                    <q-item v-for="(menuItemChild, index) in menuItem.children" :key="index" clickable
                      :to="menuItemChild.link">
                      <q-item-section>
                        {{ menuItemChild.nama_aplikasi }}</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </a>
            </div>
          </template>
        </div>
      </q-toolbar>
    </q-header>

    <q-footer elevated dense>
      <q-toolbar :class="$q.dark.mode ? 'bg-dark text-white' : 'bg-grey1 text-white'">
        <q-toolbar-title class="text-subtitle2">Copyright &#169;2023 IT DBC
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

    <q-drawer v-if="menuType == false" v-model="drawer" show-if-above :width="250" :breakpoint="500" bordered
      :class="$q.dark.mode ? 'bg-dark text-white' : 'bg-grey1 text-black'">
      <q-scroll-area class="fit">
        <q-img src="https://cdn.quasar.dev/img/material.png" style="height: 150px">
          <div class="absolute-bottom bg-transparent">
            <q-avatar size="56px" class="q-mb-sm">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar>
            <div class="text-weight-bold">{{ nama() }}</div>
            <div>{{ nik() }}</div>
          </div>
        </q-img>
        <q-list class="q-mt-md">
          <template v-for="(menuItem, index) in listMenu" :key="index">
            <div v-if="menuItem.children.length == 0">
              <q-item :to="menuItem.link" class="tw-text-gray-600 tw-font-semibold">
                <q-item-section avatar>
                  <q-icon :name="menuItem.icon" />
                </q-item-section>
                <q-item-section>
                  <span>{{ menuItem.nama_aplikasi }}</span>
                </q-item-section>
              </q-item>
            </div>
            <div v-else>
              <q-expansion-item :content-inset-level="0.5" expand-separator :icon="menuItem.icon"
                :label="menuItem.nama_aplikasi" class="tw-text-gray-600 tw-font-semibold">
                <template v-for="(menuItemChild, index) in menuItem.children" :key="index">
                  <q-item clickable :to="menuItemChild.link" class="tw-text-gray-600 tw-font-semibold">
                    <q-item-section avatar>
                      <q-icon :name="menuItemChild.icon" />
                    </q-item-section>
                    <q-item-section>
                      <span>{{ menuItemChild.nama_aplikasi }}</span>
                    </q-item-section>
                  </q-item>
                </template>
              </q-expansion-item>
            </div>
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <!-- <q-page padding> -->
      <router-view />
      <!-- </q-page> -->
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import axios from "axios";
import { empid, nama, nik, ParseError, domains, domain } from "./../utils";
import { useTimeoutFn } from '@vueuse/core'

const $q = useQuasar();
const drawer = ref(false);
const listMenu = ref(false);
const mode = ref(false);
const menuType = ref(false); /*false untuk sidemenu & true untuk topmenu*/
const listDomain = ref([]);
const Domain = ref(domain());

const timeout = 1800000

const logoutUser = async () => {
  // await axios.post(`${import.meta.env.VITE_API_ETENDER}saveLogLogout`, {
  //   nik: nik(),
  //   ip: '',
  //   note: 'user',
  // })

  const base_url = window.location.origin;
  fetch('https://api.ipify.org').then((res) => res.text()).then(async (ip) => {
    const res = await axios.post("saveLog", {
            // params: {
              nik: nik(),
              empid: empid(),
              status: 'logout',
              remark: 'user',
              ip: ip,
              nama_url: base_url,
            // },
      });  
      window.localStorage.clear();
      // window.location.replace("https://app.dbc.co.id");
      window.location.replace(base_url);
  }).catch(err => console.log(err));
}
const logoutSystem = async () => {
  // await axios.post(`${import.meta.env.VITE_API_ETENDER}saveLogLogout`, {
  //   nik: nik(),
  //   ip: '',
  //   note: 'system',
  // })

  const base_url = window.location.origin;
  fetch('https://api.ipify.org').then((res) => res.text()).then(async (ip) => {
    const res = await axios.post("saveLog", {
            // params: {
              nik: nik(),
              empid: empid(),
              status: 'logout',
              remark: 'system',
              ip: ip,
              nama_url: base_url,
            // },
      });
      window.localStorage.clear();
      // window.location.replace("https://app.dbc.co.id");
      window.location.replace(base_url);
  }).catch(err => console.log(err));
}

const setMode = () => {
  $q.dark.set($q.dark.mode ? false : true);
  document.dispatchEvent(new CustomEvent("swDark"));
  window.localStorage.setItem("dark", $q.dark.mode);
};

const setModeMenu = () => {
  window.localStorage.setItem("menu", menuType.value);
};

const refreshToken = async () => {
  try {
    const res = await axios.post("refresh_token", { nik: nik(), empid: empid() });
    return res;
    axios.defaults.headers.common["Authorization"] = res.data;
    window.localStorage.setItem("token", res.data);
  } catch (error) {
    $q.notify({
      type: "negative",
      message: ParseError(error),
    });
  }
};

const setListDomain = () => {
  console.log(domains());
  listDomain.value = domains();
};

const setDomain = (value) => {
  window.localStorage.setItem("domain", value.domain);
  document.dispatchEvent(new CustomEvent("etrasn_setdomain"));
  Domain.value = value.domain;
};

const logout = async () => {
  const base_url = window.location.origin;
  fetch('https://api.ipify.org').then((res) => res.text()).then(async (ip) => {
    const res = await axios.post("saveLog", {
            // params: {
              nik: nik(),
              empid: empid(),
              status: 'logout',
              remark: 'system',
              ip: ip,
              nama_url: base_url,
            // },
      });
      window.localStorage.clear();
      // window.location.replace("https://app.dbc.co.id");
      window.location.replace(base_url);
  }).catch(err => console.log(err));  
}

const { start, stop } = useTimeoutFn(logoutSystem, timeout)
const resetTimer = () => {
  stop()
  start()
}

window.addEventListener('mousemove', resetTimer)
window.addEventListener('keypress', resetTimer)

const getMenuAksesAplikasi = async () => {
  try {
    const res = await axios.get("getMenuAplikasiByUser", {
      params: {
        // empid: window.localStorage.getItem("menu"),
        empid: empid(),
        // empid: 'Shendy',
      },
    });

    listMenu.value = res.data;
  } catch (error) { }
};

if (window.localStorage.getItem("menu")) {
  if (window.localStorage.getItem("menu") == "true") {
    menuType.value = true;
  } else {
    menuType.value = false;
  }
}

if (window.localStorage.getItem("dark")) {
  if (window.localStorage.getItem("dark") == "true") {
    menuType.value = true;

    $q.dark.set(true);
  } else {
    $q.dark.set(false);
  }
}

if (window.localStorage.getItem("token")) {
  axios.defaults.headers.common["Authorization"] = 'Bearer ' + window.localStorage.getItem("token");
  axios.defaults.headers.common["AuthorizationEtender"] = window.localStorage.getItem("token1");
  axios.defaults.headers.common["AuthorizationVTND"] = window.localStorage.getItem("token_tnd");
}

setListDomain();
getMenuAksesAplikasi();
</script>

<style lang="sass">
.GL
  &__select-GL__menu-link
    .default-type
      visibility: hidden
    &:hover
      background: #0366d6
      color: white
      .q-item__section--side
        color: white
      .default-type
        visibility: visible
  &__toolbar-link
    a
      text-decoration: none
      &:hover
        opacity: 0.7
  &__menu-link:hover
    background: #0366d6
    color: white
  &__menu-link-signed-in,
  &__menu-link-status
    &:hover
      & > div
        background: white !important
  &__menu-link-status
    color: $blue-grey-6
    &:hover
      color: $light-blue-9
  &__toolbar-select.q-field--focused
    width: 450px !important
    .q-field__append
      display: none

.q-menu-navbar
  margin-top: 10px !important
.q-icon.icon-menu
  margin-bottom: 3px
  margin-right: 3px
</style>
