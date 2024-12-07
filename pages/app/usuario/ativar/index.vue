<template>
    <div>
        <v-container>
            <v-sheet class="mx-auto mt-16 pa-6" max-width="600" elevation="1" rounded>
                <v-row class="py-3 text-center" justify="center">
                    <!-- <div>
                        <v-img rounded="lg" :width="150" aspect-ratio="16/9" cover src="/icons/Carvalho.png"></v-img>
                    </div> -->
                </v-row>
                <v-form v-model="form" @submit.prevent="onSubmit">
                    <v-text-field variant="underlined" v-model="formValue.login"
                        :rules="emailOrLoginRules" 
                        label="Login"></v-text-field>

                    <v-text-field variant="underlined" v-model="formValue.oldPassword" 
                        label="Senha Temporária" type="password" :rules="passwordRules"></v-text-field>

                        <v-text-field variant="underlined" v-model="formValue.newPassword" 
                        label="Digite sua senha" type="password" :rules="passwordRules"></v-text-field>
                    
                        <v-text-field variant="underlined" v-model="formValue.confirmNewPassword" 
                        label="Confirme sua senha" type="password" :rules="passwordRules"></v-text-field>
                    
                    <v-row class="pa-3">
                        <span v-if="loginError" class="text-red-darken-3">Login ou senha inválido!</span>
                    </v-row>

                    <v-btn :loading="loading" variant="tonal" class="mt-2 bg-red-darken-3" type="submit" block>Enviar</v-btn>
                </v-form>
            </v-sheet>
        </v-container>
    </div>
</template>

<script lang="ts" setup  >
import { useDataStore } from '~/composables/data';

 type ActiveUserType = {
      login: string
      oldPassword: string
      newPassword: string
      confirmNewPassword: string
}


const form = ref(false)
const loading = ref(false)

const formValue = ref<ActiveUserType>({
    login: '',
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
})

const ruleRequired = (value: string) => !!value || 'Required.'

const passwordRules = [
    ruleRequired
]
const emailOrLoginRules = [
    ruleRequired
]

const loginError = ref(false)
const onSubmit = async () => {
    loading.value = true
const runtimeConfig = useRuntimeConfig()

$fetch(`${runtimeConfig.public.baseUrl}/auth/active-user`, {
    method: 'PUT',
    body: formValue.value
  }).then((data) => {
    navigateTo('/')   
  }).catch((error) => {
      if (error)  {
        loading.value = false
        loginError.value = true
        setTimeout(() => {
            loginError.value = false;
          }, 6000);
          return
      }
  })

}

</script>