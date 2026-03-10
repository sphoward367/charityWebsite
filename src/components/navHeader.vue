<template>
    <!--Header Component to be displayed on every page-->
    <div class="container-fluid">
        <header>
            <!--Banner displaying helpline number if user needs urgent help-->
            <div class="row justify-content-center" id="urgentHelpBanner">
                <h6 class="urgentHelpText">If in need of urgent help please call XXXXXXXX</h6>
            </div>
            <!--Nav Bar using router to allow user to navigate through the pages-->
            <div class="row mt-2 align-items-center">
                <div class="col-12 col-md-3 text-center text-md-left">
                    <h2 class="charityName">Wellbeing Matters</h2>
                </div>
                <div class="col-12 col-md-6">
                    <ul class="nav nav-pills justify-content-center" id="navButtons">
                        <li class="nav-item">
                            <router-link to="/" class="nav-link" active-class="active" aria-current="page">Home</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/about" class="nav-link" active-class="active">About Us</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/resources" class="nav-link" active-class="active">Resources</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/support" class="nav-link" active-class="active">Support</router-link>
                        </li>
                    </ul>
                </div>
                <!--Login/Logout Buttons and a account button when logged in-->
                <div class="col-12 col-md-3 d-flex justify-content-center justify-content-md-end" id="loginButtonContainer">
                    <Button v-if="!loggedInUser.uid" class="loginButton" @click="toLogin()">Login</Button> 
                    <Button v-else class="loginButton" @click="logout()">Logout</Button> 
                    <Button  v-if="loggedInUser.uid" class="accountButton" @click="openAccountPage()">Account</Button>
                </div>
            </div>
        </header>
    </div>
</template>

<script setup>
import router from "../router"
import { useStore } from 'vuex';
import { computed} from 'vue';

const store = useStore();

//create empty logged in user to be filled on state change
const loggedInUser = computed(() => store.getters.getUser);

//logout function, calls the store logout function and pushs the router path back to home page
const logout = async () => {
    const success = await store.dispatch('logout');
    if (success) {
        router.push({ path: '/login'})
    } else {
        alert('Error logging out')
    }
}
    

//log in function, uses router to send user to login page
const toLogin = () => {
    router.push({ path: '/login'})
}

//function to send user to account page when button is clicked
const openAccountPage = () => {
    router.push({ path: '/account'})
}
</script>

<style scoped>
.charityName {
    align-items: center;
    color: var(--light-blue-primary);
    font-size: 1.8rem;
}

.nav-item {
    --bs-nav-pills-link-active-bg: var(--light-blue-primary);
    --bs-nav-link-color: var(--light-blue-primary);
    --bs-nav-link-hover-color: #6596f9;
    padding-left: 2%;
    padding-right: 2%;
}

.urgentHelpText {
    margin-top: 4px;
    text-align: center;
    width: 100%;
    font-size: 1rem;
}

#urgentHelpBanner {
    background-color: var(--light-blue-primary);
    display: flex; 
    justify-content: center;
    padding: 5px 0;
}

#navButtons {
    width: 100%;
    justify-content: center;
}

#loginButtonContainer {
    display: flex;
    gap: 10px;
}

.loginButton, .accountButton {
    background-color: white;
    color: var(--light-blue-primary);
    border-style: hidden;
    margin: 5px;
}

.loginButton:hover, .accountButton:hover {
    color: #6596f9;
}

@media (max-width: 768px) {
    .charityName {
        font-size: 1.5rem;
    }

    .urgentHelpText {
        font-size: 0.875rem;
    }

    #loginButtonContainer {
        justify-content: center;
    }
}
</style>