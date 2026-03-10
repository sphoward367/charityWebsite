<template>
    <!-- Page Content -->
    <div class="container">
        <div class="row justify-content-center align-items-center mt-5">
            <!-- Login form  -->
            <div class="col-12 col-md-8 col-lg-6" id="loginForm">
                <h1 class="text-center">Login</h1>
                <h6 class="text-center mb-4">If you don't have an account, please register first!</h6>
                <form @submit.prevent="signin">
                    <!-- Email and password fields (validated on submit) -->
                    <div class="mb-3">
                        <label for="email" class="form-label">Email:</label>
                        <input type="text" class="form-control" id="emailInput" v-model="email">
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label">Password:</label>
                        <input type="password" class="form-control" id="passwordInput" v-model="password">
                    </div>
                    <!-- Submit button -->
                    <div class="d-grid gap-2">
                        <button type="submit" class="btn btn-primary" id="submit">Login</button>
                    </div>
                </form>
                <!-- Register button if user hasnt got a login -->
                <div class="d-grid gap-2 mt-3">
                    <button type="button" class="btn btn-secondary" id="registerButton" @click="openRegisterModal()">Register</button>
                </div>
                <div v-if="loginError" class="text-danger"> {{ loginError }}</div>
            </div>
        </div>
        
        <!-- Component to appear after the user presses the button to register  -->
        <registerModal v-model:visible="registerModalVisible" @closeModal="registerModalVisible = false" />
    </div>
</template>

<script setup>
import registerModal from '../components/registerModal.vue';
import { sanitizeInput } from '@/utils/sanitizer';
import { ref } from "vue";
import { useStore } from 'vuex';
import router from "../router"

const store = useStore();
const email = ref("");
const password = ref("");
const loginError = ref("");
const registerModalVisible = ref(false);

//function to open the register modal 
const openRegisterModal = () => {
    registerModalVisible.value = !registerModalVisible.value;
};

//submit login function 
//validation inside the store login functionality, wont allow login if feilds are wrong
const signin = async () => {
    const sanitizedEmail = sanitizeInput(email.value);
    const sanitizedPassword = sanitizeInput(password.value);
    const success = await store.dispatch('login', {
        email: sanitizedEmail,
        password: sanitizedPassword,
    });

    if (success) {
        router.push({ path: '/' });
    } else {
        alert('Invalid email or password. Please try again.');
    }
};

</script>

<style scoped>
#loginForm {
    background-color: #f8f9fa;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
    #loginForm {
        padding: 1.5rem;
    }
}
</style>


                