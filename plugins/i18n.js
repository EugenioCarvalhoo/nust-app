import { createI18n } from 'vue-i18n';

const i18n = createI18n({
  locale: 'pt-BR', // Defina o idioma padrão
  messages: {
    'pt-BR': {
      $vuetify: {
        date: {
          picker: {
            months: [
              'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
              'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
            ],
            days: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
          }
        }
      }
    }
  }
});

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(i18n);  // Adiciona o Vue I18n ao aplicativo Nuxt
});