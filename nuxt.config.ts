// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      baseUrl: process.env.API_URL || 'http://localhost:8080',
    }
  },
  ssr: false,
  plugins: [
    '~/plugins/i18n.js'    
  ],
  css: [
    'vuetify/lib/styles/main.css',
    '@mdi/font/css/materialdesignicons.css',
    '@/assets/style/goblal.css'
  ],
  build: {
    transpile: ['vuetify']
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false }
})
