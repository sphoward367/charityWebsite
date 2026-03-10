<template>
    <div class="container mt-4">
        <h2 class="text-center mb-4">Send Bulk Email</h2>
        <div class="text-center mb-3">
            <small class="text-muted">To be implemented</small>
        </div>
        <div class="card p-4 shadow-sm">
            <div class="mb-3">
                <h5>Select Users:</h5>
                <div class="form-check" v-for="user in users" :key="user.userId">
                    <input class="form-check-input" type="checkbox" v-model="selectedUsers" :value="user.email" id="user-{{ user.userId }}" />
                    <label class="form-check-label" :for="'user-' + user.userId"> {{ user.email }} ({{ user.isAdmin ? "Admin" : "User" }})</label>
                </div>
            </div>
            <div class="mb-3">
                <input class="form-control" v-model="emailSubject" placeholder="Email Subject" />
            </div>
            <div class="mb-3">
                <textarea class="form-control" v-model="emailContent" placeholder="Write your email content here..." rows="5"></textarea>
            </div>
            <button class="btn btn-primary" @click="sendBulkEmail">Send Email</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const users = computed(() => store.getters.getAllUsers);
const selectedUsers = ref([]);
const emailContent = ref('');
const emailSubject = ref('');

onMounted(async () => {
    await store.dispatch('fetchAllUsers');
});

/*
const sendBulkEmail = async () => {
    // Bulk email functionality removed to avoid external provider costs.
    // Inform the user and clear the form locally.
    alert('Bulk email feature is currently disabled.');
    clearForm();
};
*/

// Placeholder UI handler — commented original implementation above so it can be
// restored later. Shows a short "to be implemented" notice for now.
const sendBulkEmail = async () => {
    alert('To be implemented');
};

</script>