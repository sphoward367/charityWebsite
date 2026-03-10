<template>
    <!-- Dailog component to show a popup modal containing register form -->
    <Dialog 
        class="registerModal" 
        modal 
        header="User Registration" 
        :style="{ width: '50rem' }" 
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" 
        v-model:visible="visible"
    >
        <!--Register form-->
        <div class="container mb-5" id="modal-container">
            <div class="row d-flex justify-content-center">
                <div class="col-12 col-lg-10">
                    <form @submit.prevent="register">
                        <!-- Labels and inputs for email, password, confirm password and validation messages appear when needed -->
                        <!-- Rows and coloums to separate inputs and resemble a grid (becomes a completely veritcal form when screen smaller)-->
                        <div class="row mb-3">
                          <div class="col-12 col-md-6">
                              <label for="email" class="form-label">Email:</label>
                              <input type="text" class="form-control" id="email" @blur="() => validateEmail(true)" @input="() => validateEmail(false)" v-model="formData.email">
                              <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
                          </div>
                          <div class="col-12 col-md-6">
                            <label class="form-check-label" for="IsAdmin">Is Admin?</label>
                            <div class="form-check">
                              <div class="form-check form-check-inline">
                                  <input class="form-check-input" type="radio" name="IsAdmin" id="IsAdmin1" value="true" v-model="formData.isAdmin">
                                  <label class="form-check-label" for="IsAustralian1">Yes</label>
                              </div>
                              <div class="form-check form-check-inline">
                                  <input class="form-check-input" type="radio" name="IsAdmin" id="IsAdmin2" value="false" v-model="formData.isAdmin">
                                  <label class="form-check-label" for="IsAustralian2">No</label>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-12 col-md-6">
                                <label for="password" class="form-label">Password:</label>
                                <input type="password" class="form-control" id="password" @blur="() => validatePassword(true)" @input="() => validatePassword(false)" v-model="formData.password">
                                <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
                            </div>
                            <div class="col-12 col-md-6">
                                <label for="confirm-password" class="form-label">Confirm Password:</label>
                                <input type="password" class="form-control" id="confirm-password" v-model="formData.confirmPassword" @blur="() => validateConfirmPassword(true)" />
                                <div v-if="errors.confirmPassword" class="text-danger">{{ errors.confirmPassword }}</div>
                            </div>
                        </div>
                        <!-- Action Buttons -->
                        <div class="text-center">
                            <button type="submit" class="btn btn-primary me-2" id="register">Submit</button>
                            <button type="button" class="btn btn-secondary" id="clear" @click="clearForm">Clear</button>
                        </div>
            <div class="text-center mt-2">
              <small class="text-muted">Welcome email: To be implemented</small>
            </div>
                        <div v-if="errors.register" class="text-danger">{{ errors.register }}</div>
                    </form>
                </div>
            </div>
        </div>
    </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog';
import { ref } from 'vue';
import { useStore } from 'vuex';
import { sanitizeInput } from '@/utils/sanitizer';

//initalise store for saving registration details, emit close modal to the parent page (login)
const store = useStore();
const emit = defineEmits(['closeModal']); 

//default form data
const formData = ref({
  email: '',
  password: '',
  confirmPassword: '',
  isAdmin: false,
});

//erros default data for validation 
const errors = ref({
  email: null,
  password: null,
  confirmPassword: null,
  register: null
});


//register user function 
//first checks fields are valid through calling separte validation fucntions
//then utilises calls store function to register which uses firebase auth to add a user with email and password. 

const register = async () => {

  validateEmail(true);
  validatePassword(true);
  validateConfirmPassword(true);

  if (!errors.value.email && !errors.value.password && !errors.value.confirmPassword) {
    const newUser = {
      email: sanitizeInput(formData.value.email),
      password: sanitizeInput(formData.value.password),
      isAdmin: formData.value.isAdmin == "true"
    };

    const result = await store.dispatch('registerUser', newUser)
    // Welcome email sending has been disabled to avoid third-party costs.
    if (result){ 
      clearForm();
      emit('closeModal');
    } else {
      errors.value.register = "Could not register via Firebase"
    }
  }

  
};

// Welcome email sending removed to avoid external provider costs.


//email validation function 
//checks email is more then 3 characters, also therefore stops nothing being entered
const validateEmail = (blur) => {
  if (formData.value.email.length < 3) {
    if (blur) errors.value.email = 'Email must be at least 3 characters long';
  } else {
    errors.value.email = null;
  }
};

//password validation function 
// password must be 8 characters long and contain a capital, lowercase, number and special character
const validatePassword = (blur) => {
  const password = formData.value.password;
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    if (blur) errors.value.password = `Password must be at least ${minLength} characters long.`;
  } else if (!hasUppercase) {
    if (blur) errors.value.password = 'Password must contain at least one uppercase character.';
  } else if (!hasLowercase) {
    if (blur) errors.value.password = 'Password must contain at least one lowercase character.';
  } else if (!hasNumber) {
    if (blur) errors.value.password = 'Password must contain at least one numerical character.';
  } else if (!hasSpecialChar) {
    if (blur) errors.value.password = 'Password must contain at least one special character.';
  } else {
    errors.value.password = null;
  }
};

//confirm password to ensure they enter the same thing twice 
//ensures less chance of typo and the user thing there password is Password1! but instead its Paswsrod!1 (both meet the password criteria)
const validateConfirmPassword = (blur) => {
  if (formData.value.password !== formData.value.confirmPassword) {
    if (blur) errors.value.confirmPassword = 'Passwords do not match.';
  } else {
    errors.value.confirmPassword = null;
  }
};

//function to clear the form of the values entered. Called when form submitted
const clearForm = () => {
  formData.value = {
    email: '',
    password: '',
    confirmPassword: '',
    isAdmin: false
  };
};
</script>

<style scoped>
.registerModal {
    max-width: 100%;
}

#modal-container {
    background-color: #f0f4f8; 
    color: #212529; 
    padding: 1.5rem; 
    border-radius: 8px; 
}

@media (max-width: 768px) {
    .registerModal {
        padding: 1rem;
    }
}
</style>
