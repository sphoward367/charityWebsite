<template>
    <div>
      <canvas ref="barChartCanvas"></canvas>
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
  
  const barChartCanvas = ref(null);
  let barChart = null;
  
  onMounted(() => {
    // Initialize the chart when the component is mounted
    createChart();
  });
  
  watch(
    () => props.chartData,
    (newValue) => {
      if (barChart) {
        barChart.destroy(); // Destroy the previous chart instance
      }
      createChart(); // Create a new chart with the updated data
    }
  );
  
  function createChart() {
    if (!barChartCanvas.value || !props.chartData) return;
  
    barChart = new Chart(barChartCanvas.value, {
      type: 'bar',
      data: props.chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Resource'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Average Rating'
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
  