<template>
    <div class="container-fluid">
        <div class="row" id="about-content">
            <!-- Sidebar for easy navigation to parts of the page -->
            <div class="col-12 col-md-2" id="sideBar">
               <Button class="sideBarButton" id="webUsage" @click="currentPage = 'webUsage'"> 
                   Website Usage 
               </Button>
               <Button class="sideBarButton" id="userInfo" @click="currentPage = 'userInfo'"> 
                   User Info 
               </Button>
               <Button class="sideBarButton" id="bulkEmail" @click="currentPage = 'bulkEmail'"> 
                   Email Users 
               </Button>
            </div>
            
            <!-- Page Content -->
            <div class="col-12 col-md-10">
                <!-- Conditionally render based on current page -->
                <div v-if="currentPage === 'webUsage'">
                    <webUsageContent></webUsageContent>
                </div>
                <div v-else-if="currentPage === 'userInfo'">
                    <adminUserInfoContent></adminUserInfoContent>
                </div>
                <div v-else-if="currentPage === 'bulkEmail'">
                    <bulkEmail></bulkEmail>
                </div>
            </div> 
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import webUsageContent from './webUsageContent.vue';
import adminUserInfoContent from './adminUserInfoContent.vue'
import bulkEmail from './bulkEmail.vue';
// State to track the currently active page
const currentPage = ref('webUsage');
</script>

<style>
.sideBarButton {
   justify-self: left;
   background-color: white;
   color: var(--light-blue-primary);
   border-style: hidden;
   padding: 20px;
   width: 100%;
}
</style>
