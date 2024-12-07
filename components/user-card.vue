<template>
    <ProfileForm v-model:dialog="profileDialog" ></ProfileForm>
    <PasswordForm v-model:dialog="passwordDialog" ></PasswordForm>
    <div class="text-center">
        <v-menu v-model="menu" :close-on-content-click="false" location="end">
          <template v-slot:activator="{ props }">
            <v-avatar
                class="hidden-sm-and-down"
                color="grey-darken-1"
                size="32"
                icon="mdi-account"
                v-bind="props"
                >  </v-avatar>
          </template>

          <v-card min-width="300">
            <v-list>
              <v-list-item icon="mdi-account"
                :title="data.getFullName">
                <template v-slot:prepend >
                  <v-avatar
                class="hidden-sm-and-down"
                color="grey-darken-1"
                size="32"
                icon="mdi-account"
                >  </v-avatar>
              </template>
              </v-list-item>
            </v-list>
            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn color="primary" @click="editProfile">
                Editar Perfil
              </v-btn>
              <v-btn color="primary" variant="text" @click="updatePassword">
                Alterar Senha
              </v-btn>

              <v-btn color="primary" variant="text" @click="logout">
                Sair
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </div>
</template>

<script setup lang="ts">
import ProfileForm from '~/form/user/profile-form.vue';
import PasswordForm from '~/form/user/password-form.vue';


  const menu = ref(false)
  const data = useDataStore()

  const profileDialog = ref(false)
  const passwordDialog = ref(false) 



  const editProfile = () => {
    menu.value = false
    profileDialog.value = true
  }

  const updatePassword = () => {
    menu.value = false
    passwordDialog.value = true
  }

  const logout = () => {
    menu.value = false
    useDataStore().resetData
    useCookie('token').value = ''
    navigateTo('/')
  }

</script>