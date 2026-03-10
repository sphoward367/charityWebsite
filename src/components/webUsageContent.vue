<template>
    <h2>Website Usage</h2>
    <p>Here you can see the statistics and analytics of website usage.</p>
  
    <div class="dashboard">
      <div class="card">
        <h3>User Growth Over Time</h3>
        <p>
          This graph displays the cumulative number of users who registered over time.
          It helps us understand the growth trajectory of our platform and evaluate 
          the effectiveness of our user acquisition strategies.
        </p>
        <div class="chart-container">
          <LineChart v-if="lineChartData" :chart-data="lineChartData" />
        </div>
      </div>
  
      <div class="card">
        <h3>Average Resource Ratings</h3>
        <p>
          This bar chart shows the average ratings of resources available on our platform.
          It assists us in identifying which resources are performing well and which ones 
          may need improvement based on user feedback.
        </p>
        <div class="chart-container">
          <BarChart v-if="barChartData" :chart-data="barChartData" />
        </div>
      </div>
      <button class="exportButton" @click="exportUserData">Export User Data</button>
      <button class="exportButton" @click="exportResourceData">Export Resource Data</button>
    </div>
</template>
  
<script setup>
  import { ref, onMounted, computed } from 'vue';
  import { useStore } from 'vuex';
  import LineChart from './lineChart.vue';
  import BarChart from './barChart.vue';
  
  const store = useStore();
  const lineChartData = ref(null);
  const barChartData = ref(null);
  const groupedData = ref(null);
  const resources = computed(() => store.getters.getResources);
  
  function groupByDate(users) {
    const dateCounts = {};
    let totalUsers = 0;
  
    users.sort((a, b) => a.createdAt - b.createdAt);
  
    users.forEach(user => {
      const date = user.createdAt.toISOString().split('T')[0];
      totalUsers++;
      dateCounts[date] = totalUsers;
    });
    
    return dateCounts;
  }
  
  function prepareResourceData(resources) {
    if (!resources || !Array.isArray(resources)) {
      console.warn('Resources are not available or not an array.');
      return {
        labels: [],
        datasets: [],
      };
    }
  
    return {
      labels: resources.map(resource => resource.name),
      datasets: [
        {
          label: 'Average Ratings',
          data: resources.map(resource => resource.averageRating || 0),
          backgroundColor: '#42A5F5',
          borderColor: '#1E88E5',
          borderWidth: 1,
        }
      ]
    };
  }
  
  onMounted(async () => {
    const users = await store.dispatch('fetchUserRegistrations');
    await store.dispatch('fetchResources');
    
    barChartData.value = prepareResourceData(resources.value);
    
    groupedData.value = groupByDate(users);
    lineChartData.value = {
      labels: Object.keys(groupedData.value),
      datasets: [
        {
          label: 'User Growth Over Time',
          data: Object.values(groupedData.value),
          fill: true,
          borderColor: '#42A5F5',
          tension: 0.1,
        }
      ]
    };
  });

    function exportUserData() {
        const csvData = [];
        const userGrowthLabels = Object.keys(groupedData.value);
        const userGrowthData = Object.values(lineChartData.value.datasets[0].data);
        csvData.push(['Date', 'Cumulative Users']);
        userGrowthLabels.forEach((label, index) => {
            csvData.push([label, userGrowthData[index]]);
        });

        const csvContent = "data:text/csv;charset=utf-8," + csvData.map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "user_growth_data.csv");
        document.body.appendChild(link);
        link.click();
  }


    function exportResourceData() {
        const csvData = [];
        const resourceLabels = resources.value.map(resource => resource.name)
        const resourceData = Object.values(resources.value.map(resource => resource.averageRating || 0));
        csvData.push(['Resource', 'Average Rating']);
        resourceLabels.forEach((label, index) => {
            csvData.push([label, resourceData[index]]);
        });

        const csvContent = "data:text/csv;charset=utf-8," + csvData.map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "resource_data.csv");
        document.body.appendChild(link);
        link.click();
    }

</script>

<style scoped>
  .dashboard {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 20px;
  }
  
  .card {
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow: hidden; /* Prevent overflow */
  }
  
  .chart-container {
    max-width: 100%; /* Ensure chart doesn't exceed card width */
    max-height: 400px; /* Set a max height for charts */
    overflow: auto; /* Enable scrolling if necessary */
  }

  .exportButton {
   justify-self: left;
   background-color:var(--light-blue-primary);
   color: white;
   border-style: hidden;
   padding: 20px;
   width: 100%;
}
  </style>