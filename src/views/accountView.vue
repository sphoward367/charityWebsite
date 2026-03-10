<template>
    <div v-if="user.isAdmin">
        <adminDashbase></adminDashbase>
    </div>
    <div v-else>
        <userAccountDash></userAccountDash>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import userAccountDash from '../components/userAccountDash.vue';
import adminDashbase from '../components/adminDashBase.vue';
//get current user from the store
const store = useStore();
const user = computed(() =>store.getters.getUser);

</script>

<style scoped>
#accountRow {
    align-items: center;
}
</style>