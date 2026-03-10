<template>
    <div class="container-fluid">
        <div class="row col-12" id="pageTitle"> 
            <h2 class="col-12">Available Resources</h2>
        </div>
        <div class="row col-12">
            <DataTable v-model:filters="filters" 
                :value="resources" 
                paginator 
                :rows="10" 
                dataKey="id" 
                filterDisplay="row" 
                :loading="loading"
                :globalFilterFields="['name', 'link' ,'category', 'averageRating']">
                
                <template #header>
                    <div class="flex justify-end">
                        <IconField>
                            <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                        </IconField>
                    </div>
                </template>
                
                <template #empty> No resources found. </template>
                <template #loading> Loading resources data. Please wait. </template>
                
                <Column field="name" header="Name" style="min-width: 12rem" sortable>
                    <template #body="{ data }">
                        {{ data.name }}
                    </template>
                    <template #filter="{ filterModel, filterCallback }">
                        <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by name" />
                    </template>
                </Column>

                <Column field="link" header="Link" style="min-width: 12rem" sortable>
                    <template #body="{ data }">
                        {{ data.link }}
                    </template>
                    <template #filter="{ filterModel, filterCallback }">
                        <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by link" />
                    </template>
                </Column>
                
                <Column field="category" header="Category" style="min-width: 12rem" sortable>
                    <template #body="{ data }">
                        {{ data.category }}
                    </template>
                    <template #filter="{ filterModel, filterCallback }">
                        <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by category" />
                    </template>
                </Column>
                
                <Column field="averageRating" header="Rating" style="min-width: 6rem" sortable>
                    <template #body="{ data }">
                        {{ data.averageRating }}
                    </template>
                    <template #filter="{ filterModel, filterCallback }">
                        <InputText v-model="filterModel.value" type="number" @input="filterCallback()" placeholder="Min rating" />
                    </template>
                </Column>
                
                <Column header="Actions" style="min-width: 6rem">
                    <template #body="{ data }">
                        <Button @click="openRatingModal(data)" type="button" class="button" style="margin-right: .5em">
                            Rate
                        </Button>
                    </template>
                </Column> 
                
                <template #footer> 
                    <Button v-if="user.isAdmin" @click="addResourceVisible = !addResourceVisible" type="button" class="col-12 col-md-2 addResourceButton mb-2"> Add Resource </Button>
                    <Dialog v-model:visible="addResourceVisible" modal header="Add Resource" class="col-12" :style="{ width: '25rem' }">
                        <div class="container mb-5" id="modal-container">
                            <form @submit.prevent="submitForm">
                                <div class="flex items-center gap-4 mb-4">
                                    <label for="name" class="form-label">Name:</label>
                                    <input type="text" class="form-control" id="name" v-model="newResourceForm.name">
                                </div>
                                <div class="flex items-center gap-4 mb-4">
                                    <label for="link" class="form-label">Link:</label>
                                    <input type="text" class="form-control" id="link" v-model="newResourceForm.link">
                                </div>
                                <div class="flex items-center gap-4 mb-4">
                                    <label for="category" class="form-label">Category:</label>
                                    <select class="form-control" id="category" v-model="newResourceForm.category">
                                        <option disabled value="">Please select one</option>
                                        <option value="Anxiety">Anxiety</option>
                                        <option value="Depression">Depression</option>
                                        <option value="Stress">Stress</option>
                                        <option value="Sleep">Sleep</option>
                                        <option value="Mindfulness">Mindfulness</option>
                                    </select>
                                </div>
                                <div class="flex items-center gap-4 mb-4">
                                    <label for="rating" class="form-label">Rating:</label>
                                    <input type="number" class="form-control" id="rating" v-model="newResourceForm.averageRating">
                                </div>
                                <div class="flex justify-end gap-2">
                                    <Button class="button" type="submit" @click="saveNewResource()">Save</Button>
                                </div>
                            </form>
                        </div>
                    </Dialog>
                </template>   
            </DataTable> 
            <ratingModal v-model:visible="ratingModalVisible" 
            v-bind="selectedResource"
            @closeModal="ratingModalVisible = false"/>
        </div>
    </div>
</template>
 
<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { ref, computed, onMounted } from 'vue';
import ratingModal from '../components/ratingModal.vue';
import Dialog from 'primevue/dialog';
import { useStore } from 'vuex';
import { FilterMatchMode } from '@primevue/core/api';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

const store = useStore();
const user = computed(() => store.getters.getUser);
const resources = computed(() => store.getters.getResources);

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    link: { value: null, matchMode: FilterMatchMode.CONTAINS },
    category: { value: null, matchMode: FilterMatchMode.CONTAINS },
    averageRating: { value: null, matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO }
});

const ratingModalVisible = ref(false); 
const addResourceVisible = ref(false);
const selectedResource = ref(null);
const loading = ref(true);

onMounted(async () => {
    await store.dispatch('fetchResources');
    loading.value = false; // Set loading to false after fetching resources
});

const newResourceForm = ref({
    name: null,
    link: null,
    category: null,
    rating: [],
    averageRating: null
});

const saveNewResource = async () => {
    if (!newResourceForm.value.name|| !newResourceForm.value.link || !newResourceForm.value.category || !newResourceForm.value.averageRating || newResourceForm.value.averageRating > 5) {
        alert("Please enter all fields before submitting or make sure rating is 5 or smaller");
    } else {
        const newResource = { ...newResourceForm.value };
        const success = await store.dispatch('addResource', newResource);
        if (success) {
            newResourceForm.value = { name: '', link: '' , category: '', rating: [] }; 
            await store.dispatch('fetchResources');
            addResourceVisible.value = false; 
        } else {
            alert("Resource already exists, please choose another username or fields are left empty");
        }
    }
};

const openRatingModal = (resource) => {
    console.log(resource);
    selectedResource.value = resource;
    ratingModalVisible.value = !ratingModalVisible.value;
};
</script>

<style scoped>
#pageTitle {
    margin-top: 20px;
    margin-left: 20px;
}

#modal-container {
    background-color: #f0f4f8; 
    color: #212529; 
    padding: 1.5rem; 
    border-radius: 8px; 
}

.resourceDataTable {
    padding-left: 30px;
    padding-right: 30px;
    padding-top: 10px;
}

.button {
    justify-self: left;
    color: var(--light-blue-primary);
    background-color: white;
    font-weight: bold;
    border-style: hidden;
    width: 100%;
}

.addResourceButton {
    justify-self: left;
    color: black;
    background-color: var(--p-surface-300);
    font-weight: bold;
    border-style: hidden;
    width: 100%;
}

</style>
