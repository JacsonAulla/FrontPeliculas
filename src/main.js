import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import vue3GoogleLogin from 'vue3-google-login'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Tu Client ID del backend
app.use(vue3GoogleLogin, {
    clientId: '974653905360-vncatehtmvtlt2uda266jdao9l5hthsb.apps.googleusercontent.com'
})

app.mount('#app')