<template>
    <!-- Page Content -->
    <div class="container mt-5 mb-5">
        <div class="row justify-content-center">
            <!-- Coloumn to list the account detials of the user -->
            <!-- Each details in a new row -->
            <div class="col-12 col-md-8">
                <div class="row mb-4">
                    <h3 class="text-center">Account Details</h3>
                </div>

                <div class="row mb-3" id="accountRow">
                    <div class="col-12 col-sm-4">
                        <label for="username" class="form-label">Username</label>
                    </div>
                    <div class="col-12 col-sm-8">
                        <input type="text" class="form-control" id="username" v-model="user.username" readonly />
                    </div>
                </div>

                <div class="row mb-3" id="accountRow">
                    <div class="col-12 col-sm-4">
                        <label for="password" class="form-label">Password</label>
                    </div>
                    <div class="col-12 col-sm-8">
                        <input type="password" class="form-control" id="password" v-model="user.password" readonly />
                    </div>
                </div>

                <div class="row mb-3" id="accountRow">
                    <div class="col-12 col-sm-4">
                        <label for="adminStatus" class="form-label">Admin Status</label>
                    </div>
                    <!-- Value depends on admin status  -->
                    <div class="col-12 col-sm-8">
                        <input type="text" class="form-control" id="adminStatus" :value="user.isAdmin ? 'Admin' : 'User'" readonly />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

//get current user from the store
const store = useStore();
const user = computed(() =>store.getters.getUser);

</script>

<style scoped>
#accountRow {
    align-items: center;
}
</style>