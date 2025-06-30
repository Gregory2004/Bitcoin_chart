<template>
  <CChart
    type="line"
    :data="chartData"
    :options="chartOptions"
    class="bg-[#1f1424] w-[70%] rounded-xl p-4"
  />
</template>

<script setup>
import { ref, watch } from 'vue'
import { CChart } from '@coreui/vue-chartjs'

const props = defineProps({
  labels: {
    type: Array,
    required: true
  },
  prices: {
    type: Array,
    required: true
  }
})

const chartData = ref({
  labels: props.labels,
  datasets: [
    {
      backgroundColor:'white',
      label: 'BITCOIN PRICE',
      data: props.prices,
      borderColor: 'rgb(100, 1, 255)',
      fill: false
    }
  ]
})

const chartOptions = ref({
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true }
  }
})


watch(
  () => [props.labels, props.prices],
  ([newLabels, newPrices]) => {
    chartData.value = {
      labels: newLabels,
      datasets: [
        {
          label: 'BITCOIN PRICE',
          data: newPrices,
          borderColor: 'rgb(100, 1, 255)',
          fill: false
        }
      ]
    }
  }
)
</script>
