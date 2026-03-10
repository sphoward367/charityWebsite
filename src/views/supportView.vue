<template>
    <!-- Page Content -->
    <div class="container mt-4">
        <h1 class="text-center mb-4">Support Groups</h1>
        <!-- Card for each support group  -->
        
        <div class="row mb-4">
            <div class="col-12">
                <p class="text-center">
                    Discover support groups that can help you connect with others facing similar challenges. 
                    These groups offer a safe space to share experiences, get advice, and find comfort.
                </p>
            </div>
        </div>
        <supportGroupsMap></supportGroupsMap>
        
        <div class="row mt-4">
            <div class="col-12">
                <p class="text-center">
                    Interested in starting your own support group or need more information? Contact us at 
                    <a href="mailto:support@wellbeingmatters.org">support@wellbeingmatters.org.au</a>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import 'mapbox-gl/dist/mapbox-gl.css';
import supportGroupsMap from '../components/supportGroupsMap.vue';
</script>

<style scoped>
.container {
    max-width: 960px; 
}

.card {
    border: none; 
}

.card-title {
    color: var(--light-blue-primary); 
}

.text-center {
    color: var(--dark-blue-primary); 
}
</style>