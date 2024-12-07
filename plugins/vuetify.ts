import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { VDateInput } from 'vuetify/labs/VDateInput'
import { pt } from 'vuetify/locale';

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    locale: {
      locale: 'pt',
      fallback: 'pt',
      messages: {
        pt 
      }
    },
    components: {
      ...components,
      VDateInput
    },
    directives,
    icons: {
      defaultSet: "mdi",
    },
  });
  nuxtApp.vueApp.use(vuetify);
});
