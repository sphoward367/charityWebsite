<template>
    <!-- Popup Rating Modal Component (used to rate a resource and called from resourceView.vue) -->
    <Dialog class="ratingModal" modal header="Rate Resource" :style="{ width: '80rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <div class="container-fluid" id="modal-container">
            <div class="row">
                <!-- Rating Categories Column -->
                <!-- Row for each cateogry two coloumns, cateogry heading, and rating shown in stars -->
                <div class="col-12 col-md-6 mb-4">
                    <div class="row mb-3 align-items-center">
                        <div class="col-8 d-flex align-items-center">
                            <h6>Easy to Understand:</h6>
                        </div>
                        <div class="col-4"> 
                            <Rating v-model="ratings.understand" @input="ratings.value.understand = modelValue" />
                        </div>
                    </div>
                    <div class="row mb-3 align-items-center">
                        <div class="col-8 d-flex align-items-center">
                            <h6>Quick:</h6>
                        </div>
                        <div class="col-4"> 
                            <Rating v-model="ratings.quick" @input="ratings.value.quick = modelValue" />
                        </div>
                    </div>
                    <div class="row mb-3 align-items-center">
                        <div class="col-8 d-flex align-items-center">
                            <h6>Information Relevancy:</h6>
                        </div>
                        <div class="col-4"> 
                            <Rating v-model="ratings.relevancy" @input="ratings.value.relevancy = modelValue" />
                        </div>
                    </div>
                    <div class="row mb-3 align-items-center">
                        <div class="col-8 d-flex align-items-center">
                            <h6>Helpfulness:</h6>
                        </div>
                        <div class="col-4"> 
                            <Rating v-model="ratings.helpfulness" @input="ratings.value.helpfulness = modelValue" />
                        </div>
                    </div>
                    <div class="row mb-3 align-items-center">
                        <div class="col-8">
                            <h6>Overall Rating: </h6>
                        </div>
                        <div class="col-4"> 
                            <Rating v-model="ratings.overall" readonly />
                        </div>
                    </div>
                </div>
                
                <!-- Action Buttons -->
                <div class="col-12 col-md-6">
                    <div class="d-flex justify-content-end gap-2">
                        <Button type="button" label="Calculate" class="btn btn-secondary" @click="calcOverallRating()"> Calculate</Button>
                        <Button type="button" label="Save" class="btn btn-primary" @click="saveRating()"> Save </Button>
                    </div>
                </div>
            </div>
        </div>
    </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog';
import Rating from 'primevue/rating';
import Button from 'primevue/button';
import { ref } from 'vue';
import { useStore } from 'vuex';
import { sanitizeInput } from '@/utils/sanitizer';

//props passed in from resource table
const props = defineProps({
    resourceId: String,
    name: String,
    link: String,
    category: String,
    rating: Array,
    averageRating: Number,
});

//default ratings initialisation 
const ratings = ref({
    understand: null,
    quick: null,
    relevancy: null,
    helpfulness: null,
    overall: null,
});

const emit = defineEmits(['closeModal']);
const store = useStore();

//status flag to make sure the new rating is calculated before user tries to save 
// made into a status ref so it can be extend with other flags potenially needed in the future
const status = ref({
    newRatingCalculated: null
});

// function to calculate the overall rating based of the user inputs of the 4 rating categories 
const calcOverallRating = () => {
    let total = ratings.value.understand + ratings.value.quick + ratings.value.relevancy + ratings.value.helpfulness;
    ratings.value.overall = Math.round(total / 4);
    status.value.newRatingCalculated = true;
};

//save ratign function, adds rating to array of past ratings and then calculates the overall avg rating from all ratings before saving
//The rating displayed on the resource table is the avg of all ratings the resource has been given
//After the ratings are set, utilises store update function 
const saveRating = async () => {
    //ensures the user has rated the resource before trying to submit
    if (!status.value.newRatingCalculated) {
        alert("Please calculate the new rating first.");
    } else {
        const newResource = {
            name: sanitizeInput(props.name),
            link: sanitizeInput(props.link),
            category: sanitizeInput(props.category),
            rating: [...props.rating, ratings.value.overall],
            averageRating: 0
        };
        

        //calc avg of all ratings resource contains
        for (let i = 0; i < newResource.rating.length; i++) {
            newResource.averageRating += newResource.rating[i];
        }
        newResource.averageRating = Math.round(newResource.averageRating / newResource.rating.length);

        // Update resource in Firestore via Vuex store
        try {
            const success = await store.dispatch('updateResource', { resourceId: props.resourceId, newResource });
            if (success) {
                emit('closeModal');
            } else {
                alert("Failed to update the resource.");
            }
        } catch (error) {
            console.error("Error updating resource:", error);
            alert("An error occurred while updating the resource.");
        }
    }
    
};

</script>

<style scoped>
#modal-container {
    background-color: #f0f4f8; 
    color: #212529; 
    padding: 1.5rem; 
    border-radius: 8px; 
}

@media (max-width: 768px) {
    #modal-container {
        padding: 1rem; 
    }
}
</style>