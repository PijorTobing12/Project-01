<template>
  <q-page class="q-pa-md">
    <!-- <q-card class="my-card" style="width: 100%">
      <q-card-section>
        <div class="text-h6 text-center">Total Dokumen Per Departemen</div>
        <div class="text-subtitle2 text-center">DBC GROUP</div>
      </q-card-section>
      <VueApexCharts
        v-if="display"
        type="bar"
        class="tes"
        height="400"
        :options="chartOptions"
        :series="series"
      ></VueApexCharts>
    </q-card> -->
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";

const $q = useQuasar();
const chartOptions = ref({
  chart: {
    id: "mychart",
    width: "100%",
    type: "bar",
    stacked: true,
    toolbar: {
      show: true,
    },
    zoom: {
      enabled: true,
    },
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        legend: {
          position: "bottom",
          offsetX: -10,
          offsetY: 0,
        },
      },
    },
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 10,
    },
  },
  xaxis: {
    categories: [],
    labels: {
      style: {
        colors: [],
        fontSize: "14px",
      },
    },
  },
  yaxis: {
    axisBorder: {
      show: true,
      color: "#78909C",
      offsetX: 0,
      offsetY: 0,
    },
  },
  legend: {
    position: "right",
    offsetY: 40,
  },
  fill: {
    opacity: 1,
  },
  theme: {
    mode: "light",
  },
});
const series = ref([]);
const display = ref(false);

const getDashboard = async () => {
  try {
    $q.loading.show();
    // const res = await api.get("getDashboard");
    // series.value = res.data.data;
    chartOptions.value.xaxis.categories = [
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
    ];

    series.value = [
      {
        name: "Net Profit",
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
      },
      {
        name: "Revenue",
        data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
      },
      {
        name: "Free Cash Flow",
        data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
      },
    ];

    display.value = true;
    $q.loading.hide();
  } catch (error) {
    $q.loading.hide();
  }
};

const setColorChart = () => {
  if ($q.dark.mode) {
    chartOptions.value = {
      theme: {
        mode: "dark",
        palette: 'palette1', 
      },
    };
  } else {
    // chartOptions.value.theme.mode = 'light'
    chartOptions.value = {
      theme: {
        mode: "light",
        palette: 'palette1', 
      },
    };
  }
};

document.addEventListener("swDark", () => {
  setColorChart();
});

getDashboard();

setTimeout(() => {
  setColorChart();
}, 1000);
</script>
