<template>
    <canvas ref="canvasRef"></canvas>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)
const canvasRef = ref(null)


const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'] // вместо Utils.months просто пример
const data = {
  labels: labels,
  datasets: [{
    label: 'BITCOIN PRICE',
    data: [65, 59, 80, 81, 56, 55, 40],
    fill: false,
    borderColor: 'rgb(100, 1, 255)',
  }]
}

const config = {
  type: 'line',
  data: data,
  options: {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true
      },
    },
  }
}

onMounted(() => {
  if (!canvasRef.value) return

  new Chart(canvasRef.value, config)
})
</script>