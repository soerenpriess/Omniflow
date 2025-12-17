import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      vue(),
      tailwindcss(),
      {
        name: 'html-transform',
        transformIndexHtml(html) {
          const adsenseClientId = env.VITE_ADSENSE_CLIENT_ID
          const adsenseScript = adsenseClientId
            ? `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}" crossorigin="anonymous"></script>`
            : '<!-- AdSense not configured -->'
          return html.replace('<!--ADSENSE_SCRIPT_PLACEHOLDER-->', adsenseScript)
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
