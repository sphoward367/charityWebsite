<template>
    <!-- Dailog component to show a popup modal containing register form -->
    <Dialog 
        class="addSupportGroupModal" 
        modal 
        header="Support Group Registration" 
        :style="{ width: '50rem' }" 
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" 
        v-model:visible="visible"
    >
        <!--Register form-->
        <div class="container mb-5" id="modal-container">
            <div class="row d-flex justify-content-center">
                <div class="col-12 col-lg-10">
                    <form @submit.prevent="addSupportGroup">
                        <div class="row mb-3">
                          <div class="col-12 col-md-6">
                              <label for="name" class="form-label">Name:</label>
                              <input type="text" class="form-control" id="name" @blur="() => validateName(true)" v-model="formData.name">
                              <div v-if="errors.name" class="text-danger">{{ errors.name }}</div>
                          </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-12 col-md-6">
                                <label for="description" class="form-label">Description:</label>
                                <input type="text" class="form-control" id="description" @blur="() => validateDescription(true)" v-model="formData.description">
                                <div v-if="errors.description" class="text-danger">{{ errors.description }}</div>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label for="location" class="form-label">Location:</label>
                            <div class="col-12">
                                <small class="form-text text-muted">Tip: Melbourne's approximate longitude is 144.9631 and latitude is -37.8136</small>
                            </div>
                            <div class="col-12 col-md-6">
                                <label for="longitude" class="form-label">Longitude:</label>
                                <input type="number" step="0.0001" class="form-control" id="longitude" @blur="() => validateLongitude(true)" v-model="formData.location.long">
                                <div v-if="errors.location.long" class="text-danger">{{ errors.location.long }}</div>
                            </div>
                            <div class="col-12 col-md-6">
                                <label for="latitude" class="form-label">Latitude:</label>
                                <input type="number" step="0.0001" class="form-control" id="latitude" @blur="() => validateLatitude(true)" v-model="formData.location.lat">
                                <div v-if="errors.location.lat" class="text-danger">{{ errors.location.lat }}</div>
                            </div>
                        </div>
                        <!-- Action Buttons -->
                        <div class="text-center">
                            <button type="submit" class="btn btn-primary me-2" id="register">Submit</button>
                            <button type="button" class="btn btn-secondary" id="clear" @click="clearForm">Clear</button>
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


const store = useStore();
const emit = defineEmits(['closeModal']); 

//default form data
const formData = ref({
  name: '',
  description: '',
  location: {
    long: 0,
    lat: 0
  }
});

//erros default data for validation 
const errors = ref({
    name: '',
  description: '',
  location: {
    long: 0,
    lat: 0
  },
  register: null
});


const addSupportGroup = () => {
    // Validate form data
    validateName(true);
    validateDescription(true);
    validateLongitude(true);
    validateLatitude(true);

    if (!errors.value.name && !errors.value.description && !errors.value.location.long && !errors.value.location.lat) {
        // Add a new support group
        const newGroup = {
        name: formData.value.name, 
        description: formData.value.description,
        coordinates: [formData.value.location.long, formData.value.location.lat] 
        };
        
        const result = store.dispatch('addSupportGroup', newGroup);
        if (result){ 
        clearForm();
        emit('closeModal');
        } else {
        errors.value.register = "Could not register via Firebase"
        }
    }
};

//function to clear the form of the values entered. Called when form submitted
const clearForm = () => {
  formData.value = {
    name: '',
    description: '',
    location: {
        long: 0,
        lat: 0
    }
  }
};

const validateName = (blur) => {
    if (!formData.value.name) {
        errors.value.name = 'Name is required';
    } else {
        errors.value.name = null;
    }
};

const validateDescription = (blur) => {
    if (formData.value.description.length < 10) {
        if (blur) errors.value.description = 'Email must be at least 10 characters long';
    } else {
    errors.value.description = null;
    }
};

const validateLongitude = (blur) => {
    if (formData.value.location.long < -180 || formData.value.location.long > 180) {
        if (blur) errors.value.location.long = 'Longitude must be between -180 and 180';
    } else {
        errors.value.location.long = null;
    }
};

const validateLatitude = (blur) => {
    if (formData.value.location.lat < -90 || formData.value.location.lat > 90) {
        if (blur) errors.value.location.lat = 'Latitude must be between -90 and 90';
    } else {
        errors.value.location.lat = null;
    }
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
