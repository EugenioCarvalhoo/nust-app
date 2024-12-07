<template>
  <v-dialog :model-value="props.dialog" max-width="600px" @click:outside="toggleDialog">
    <v-card class="pt-4">
      <v-form fast-fail v-model="form" @submit.prevent="onSubmit">
        <v-card-title>
          <v-row justify="space-between" class="pa-2">
            <span class="text-h5">
              Dados
            </span>
            <v-icon @click="close" class="ms-2" size="28" color="grey-darken-1" icon="mdi-close"></v-icon>
          </v-row>

        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" class="pa-2">
                <v-text-field label="Nome" variant="underlined" v-model="formValue.firstName" :rules="[ruleRequired]">
                </v-text-field>
              </v-col>

              <v-col cols="12" class="pa-2">
                <v-text-field label="Sobrenome" variant="underlined" v-model="formValue.lastName"
                  :rules="[ruleRequired]">
                </v-text-field>
              </v-col>

              <v-col v-if="!dataStorage.isAdiministrator" cols="12" class="pa-2">
                <v-text-field label="Login" variant="underlined" v-model="formValue.login" :rules="[ruleRequired]">
                </v-text-field>
              </v-col>

              <v-col v-if="dataStorage.isAdiministrator" cols="12" class="pa-2">
                <v-text-field label="E-mail" variant="underlined" v-model="formValue.email" :rules="emailRules">
                </v-text-field>
              </v-col>

              <v-col v-if="dataStorage.isAdmins" cols="12" class="pa-2">
                <v-text-field label="Nome da Empresa" variant="underlined" v-model="formValue.bussinessName"
                  :rules="[ruleRequired]">
                </v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn variant="outlined" class="mt-2 text-red-darken-3" @click="close">
            CANCELAR
          </v-btn>

          <v-btn variant="tonal" type="submit" class="mt-2 bg-red-darken-3">
            SALVAR
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import { useToast } from "~/composables/toast";

const fetchAuth = useFetchAuth()

const dataStorage = useDataStore()

const toast = useToast()

const emit = defineEmits(['update:dialog', "edit", "save", "delete"]);

const form = ref(false)

const defaultValueForm = {
  firstName: "",
  lastName: "",
  login: "",
  email: "",
  bussinessName: "",
}

const fnFormValueStore = () => {
  return {
  firstName: dataStorage.data.firstName,
  lastName: dataStorage.data.lastName,
  login: dataStorage.data.login,
  email: dataStorage.data.email,
  bussinessName: dataStorage.data.bussinessName
}
}

const formValue = ref(fnFormValueStore());

const resetForm = () => {
  formValue.value = { ...defaultValueForm }
}

const ruleRequired = (value: any) => !!value || "Campo obrigatório";

const emailRules = [
  (v: any) => !!v || "E-mail obrigatório",
  (v: any) => /.+@.+\..+/.test(v) || "E-mail inválido",
];

const onSubmit = async () => {
  if (!form.value) return
  const values = formValue.value
    fetchAuth.put(`/user/profile`, {
      firstName: values.firstName,
      lastName: values.lastName,
      login: values.login || values.email || null,
      email: values.email || null,
      bussinessName: values.bussinessName
    }).then((response: any) => {

      dataStorage.setData({
        ...dataStorage.data,
        firstName: response.firstName,
        lastName: response.lastName,
        login: response.login,
        email: response.email,
        bussinessName: response.bussinessName
      })
      toast?.sucess("Item editado com sucesso!");
    }).catch(() => {
      toast?.error("Erro ao editar item!");
    })
    return;
}

const close = () => {
  emit('update:dialog', !props.dialog)
  resetForm()
}

const props = defineProps({
  dialog: {
    type: Boolean,
    default: false
  },
})

watch(() => props.dialog, (newValue) => {
  if (newValue) {
    formValue.value = fnFormValueStore()
  }
})

const toggleDialog = () => {
  emit('update:dialog', !props.dialog)
}


</script>