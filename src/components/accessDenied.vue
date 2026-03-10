<template>
    <!--Basic Component to inform user page is restricted, including a button to login-->
    <div class="container" id="content">
        <h3>
          Access to this page is restricted, please login to proceed!  
        </h3>
        <button class="returnButton" @click="returnToLogin()">Login</button>
    </div>
    
</template>
  
<script setup>
import router from "../router"

// function to return the user to the login page using the router
const returnToLogin = () => {
    router.push({ path: '/Login'})
}

</script>

<style scoped>
#content{
    margin-top: 50px;;
}
.returnButton{
    justify-self: right;
    background-color: var(--light-blue-primary);
    color:  white;
    border-style: hidden;
    
}
</style>

