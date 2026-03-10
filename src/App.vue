<script setup>
import navHeader from "./components/navHeader.vue"
import './assets/base.css'
</script>

<template>
  <div class="main-container">
    <!-- Header component called outside all the pages so it appears on all -->
    <header>
      <navHeader/>
    </header>

    <!-- Page content from router, defaulted to home page at '/' route -->
    <main class="main-box">
      <router-view></router-view>
    </main>

  </div>  
</template>

<style scoped>


</style>
