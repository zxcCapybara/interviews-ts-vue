import './assets/main.css'
import 'primeicons/primeicons.css'
import InputMask from 'primevue/inputmask';
import { FloatLabel } from 'primevue';

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { initializeApp } from 'firebase/app'

import PrimeVue from 'primevue/config'

import App from './App.vue'
import router from './router'

const firebaseConfig = {
  apiKey: 'AIzaSyBnqOhD5eiK_wQzVtsx0T71ETUfnXlHNig',
  authDomain: 'interviews-f1d0d.firebaseapp.com',
  projectId: 'interviews-f1d0d',
  storageBucket: 'interviews-f1d0d.firebasestorage.app',
  messagingSenderId: '1030342233826',
  appId: '1:1030342233826:web:f2c4614f1c9cf751c098bb',
}

initializeApp(firebaseConfig)

const app = createApp(App)

app.use(createPinia())
app.use(PrimeVue)
app.use(router)
app.component('InputMask', InputMask)
app.component('FloatLabel', FloatLabel)

app.mount('#app')
