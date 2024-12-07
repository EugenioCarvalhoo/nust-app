<template>
  <v-dialog :model-value="props.dialog"  max-width="600px" @click:outside="toggleDialog">
    <v-card class="pt-4">
      <v-form fast-fail v-model="form" @submit.prevent="onSubmit">
        <v-card-title>
          <span class="text-h5">
            Alterar Senha
          </span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" class="pa-2">
                <InputPassword 
                  label="Senha antiga" 
                  variant="underlined"
                  v-model="formValue.oldPassword" :rules="rules.oldPassword"
                >
                </InputPassword>
              </v-col>

              <v-col cols="12" class="pa-2">
                <InputPassword 
                label="Nova Senha"
                 type="password" variant="underlined" v-model="formValue.newPassword"
                  :rules="rules.newPassword">
                </InputPassword>
              </v-col>

              <v-col cols="12" class="pa-2">
                <InputPassword label="Confirmar nova senha" type="password" variant="underlined" 
                v-model="formValue.confirmNewPassword" :rules="rules.confirmNewPassword">
                </InputPassword>
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
import InputPassword from "~/components/input-password.vue";

import { useToast } from "~/composables/toast";

const fetchAuth = useFetchAuth()

const toast = useToast()

const form = ref(false)

const defaultValueForm = {
  oldPassword: "",
  newPassword: "",
  confirmNewPassword: "",
}

const formValue = ref({ ...defaultValueForm });
const ruleRequired = (value: any) => !!value || "Campo obrigatório";
const passwordNotEquals = (getValueCompare: () => string) => (value: any) => {
  const compare = getValueCompare()
  if (!compare || !value) return true
  if (value == getValueCompare()) return true
  return "A senha não confere"
  }
const rules = {
  oldPassword: [ruleRequired],
  newPassword: [ruleRequired, passwordNotEquals(() => formValue.value.confirmNewPassword)],
  confirmNewPassword: [ruleRequired, passwordNotEquals(() => formValue.value.newPassword)],
}

watch(() => formValue.value.newPassword, (newValue) => {
  if (!newValue) return
  formValue.value.confirmNewPassword = ""
})


const resetForm = () => {
  formValue.value = { ...defaultValueForm }
}

const onSubmit = async () => {
  if (!form.value) return
  const values = formValue.value
    fetchAuth.put(`/user/change-password`, {
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
      confirmNewPassword: values.confirmNewPassword
    }).then(() => {
      toast?.sucess("Senha alterada com sucesso!");
      setTimeout(() => {
        navigateTo("/")
      }, 1000);
    }).catch(() => {
      toast?.error("Erro ao editar item!");
    })
    return;
}

const emit = defineEmits(['update:dialog'])
const close = () => {
  emit('update:dialog', false)
  resetForm()
};


const props = defineProps({
  dialog: {
    type: Boolean,
    default: false
  },
})

const toggleDialog = () => {
  emit('update:dialog', !props.dialog)
}


</script>