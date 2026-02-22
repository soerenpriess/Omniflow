import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { useColorMode } from '@vueuse/core'
import router from './router/_index'

// Load Google AdSense
const adsenseClientId = import.meta.env.VITE_ADSENSE_CLIENT_ID
if (adsenseClientId) {
  const script = document.createElement('script')
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`
  script.async = true
  script.crossOrigin = 'anonymous'
  document.head.appendChild(script)
}

const app = createApp(App)

app.use(router)

useColorMode({ initialValue: 'dark', emitAuto: true })

app.mount('#app')
