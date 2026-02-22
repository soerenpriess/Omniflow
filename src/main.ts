import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { useColorMode } from '@vueuse/core'
import router from './router/_index'

const app = createApp(App)

app.use(router)

useColorMode({ initialValue: 'dark', emitAuto: true })

app.mount('#app')
