<template>
    <div>
      <canvas ref="lineChartCanvas"></canvas>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted } from 'vue';
  import { Chart, registerables } from 'chart.js';
  
  Chart.register(...registerables);
  
  const props = defineProps({
    chartData: {
      type: Object,
      required: true
    }
  });
  
  const lineChartCanvas = ref(null);
  let lineChart = null;
  
  onMounted(() => {
    // Initialize the chart when the component is mounted
    createChart();
  });
  
  watch(
    () => props.chartData,
    (newValue) => {
      if (lineChart) {
        lineChart.destroy(); // Destroy the previous chart instance
      }
      createChart(); // Create a new chart with the updated data
    }
  );
  
  function createChart() {
    if (!lineChartCanvas.value || !props.chartData) return;
  
    lineChart = new Chart(lineChartCanvas.value, {
      type: 'line',
      data: props.chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Number of Users'
            }
          }
        }
      }
    });
  }
  </script>
  
  <style scoped>
  canvas {
    height: 400px; /* Adjust height as necessary */
  }
  </style>
  