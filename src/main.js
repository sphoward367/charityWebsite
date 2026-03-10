import 'bootstrap/dist/css/bootstrap.min.css'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store';
import { onAuthStateChangedListener } from './firebase/index.js'


onAuthStateChangedListener(store);
const app = createApp(App)
app.use(PrimeVue, {
    theme: {
        preset: Aura,
    }
 })
app.use(router)
app.use(store);
app.mount('#app')
