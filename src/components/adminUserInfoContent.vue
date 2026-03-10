<template>
    <div class="container-fluid">
        <div class="row col-12" id="pageTitle"> 
            <h2 class="col-12">All Users</h2>
        </div>
        <div class="row col-12">
            <DataTable v-model:filters="filters" 
                :value="allUsers" 
                paginator 
                :rows="10" 
                dataKey="id" 
                filterDisplay="row" 
                :globalFilterFields="['email','isAdmin']">
                
                <template #header>
                    <div class="flex justify-end">
                        <IconField>
                            <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                        </IconField>
                    </div>
                </template>
                
                <template #empty> No users found. </template>
                
                <Column field="email" header="Email" style="min-width: 12rem" sortable>
                    <template #body="{ data }">
                        {{ data.email }}
                    </template>
                    <template #filter="{ filterModel, filterCallback }">
                        <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by Email" />
                    </template>
                </Column>
                
                <Column field="isAdmin" header="Admin Status" style="min-width: 12rem" sortable>
                    <template #body="{ data }">
                        {{ data.isAdmin ? 'Admin' : 'User' }}
                    </template>
                    <template #filter="{ filterModel, filterCallback }">
                        <select v-model="filterModel.value" @change="filterCallback()" >
                            <option disabled value="">All</option>
                            <option value=true>Admin</option>
                            <option value=false>User</option>
                        </select>
                    </template>
                </Column>
                
                <Column header="Actions" style="min-width: 6rem">
                    <template #body="{ data }">
                        <Button v-if="!data.isAdmin" @click="promoteUser(data)" type="button" class="button" style="margin-right: .5em">
                            Promote
                        </Button>
                        <div v-else>
                            Account is already Admin
                        </div> 
                    </template>
                </Column> 
            </DataTable> 
        </div>
    </div>
</template>
    
<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { FilterMatchMode } from '@primevue/core/api';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

const store = useStore();
const allUsers = computed(() => store.getters.getAllUsers);

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    email: { value: null, matchMode: FilterMatchMode.CONTAINS },
    isAdmin: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

onMounted(async () => {
    await store.dispatch('fetchAllUsers');
    
});

const promoteUser = async (user) => {
   
    const updatedUser = {...user, isAdmin: true}
    
    try {
        const success = await store.dispatch('updateUsers', { updatedUser });
        if (success) {
            alert("User promoted to admin")
            await store.dispatch('fetchAllUsers');
        } else {
            alert("Promoting user to admin failed.");
        }
    } catch (error) {
        console.error("Error updating user:", error);
        alert("An error occurred while updating the user.");
        
    }

};


</script>
    
<style>

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