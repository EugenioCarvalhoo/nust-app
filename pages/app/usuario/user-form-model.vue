<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card class="pt-4">
      <v-form fast-fail v-model="form" @submit.prevent="onSubmit">
        <v-card-title>
          <span class="text-h5">{{
            idFromEdit ? "Editar" : "Criar"
          }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" class="px-2 py-1">
                <v-text-field label="Nome" variant="underlined" v-model="formValue.firstName" :rules="[ruleRequired]">
                </v-text-field>
              </v-col>

              <v-col cols="12" class="px-2 py-1">
                <v-text-field label="Sobrenome" variant="underlined" v-model="formValue.lastName"
                  :rules="[ruleRequired]">
                </v-text-field>
              </v-col>

              <v-col cols="12" class="px-2 py-1">
                <v-text-field label="Login" variant="underlined" v-model="formValue.login" :rules="[ruleRequired]">
                </v-text-field>
              </v-col>

              <v-col cols="12" class="px-2 py-1">
                <v-text-field label="Senha" @focus="handleType" @blur="handleType" :type="fieldTypePassword.password"
                  autocomplete="off" variant="underlined" v-model="formValue.temporaryPassword" :rules="[ruleRequired]">
                </v-text-field>
              </v-col>
              <v-col cols="12" class="px-2 py-1">
                <v-select label="Perfil" variant="underlined" v-model="formValue.role" item-text="text"
                  item-value="value" :rules="[ruleRequired]" :items="itemsProfile">
                </v-select>
              </v-col>

              <v-col cols="12" class="px-2 py-1">
                <v-select label="Status" variant="underlined" v-model="formValue.activeFlag" item-text="text"
                  item-value="value" :rules="[ruleRequired]" :items="['Ativo', 'Inativo']">
                </v-select>
              </v-col>

              <v-col v-if="formValue.temporaryPassword && !!idFromEdit" cols="12" class="pa-2 pt-0">
                <div class="d-flex align-center flex-column">
                  <v-icon icon="mdi-alert" class="pb-4"></v-icon>
                  <p class="pl-2 text-center"> Este usuário ainda não possui acesso ao sistema. A URL abaixo deve ser utilizada pelo usuário, que
                    deverá utilizar seu login e senha temporária para obter acesso.</p>
                </div>

                <div class="text-center pt-2">
                  <a :href="getActiveUserUrl(formValue.login) " target="_blank">{{ getActiveUserUrl(formValue.login) }}</a>
                </div>
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

  <v-dialog v-model="activeUser.dialog" max-width="500px">
    <v-card>
      <v-card-text>
        <div class="d-flex align-center pt-2">
          <v-icon icon="mdi-alert"></v-icon>
          <p class="ml-2">
            Para acessar o sistema, o usuário deve utilizar a URL abaixo, juntamente com seu login e senha temporária.
          </p>
        </div>
        <div class="text-center pt-2">
          <a :href="getActiveUserUrl(formValue.login)" target="_blank">{{ activeUser.url }}</a>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="bg-red-darken-3" variant="tonal" @click="activeUser.dialog = false">OK</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogDelete" max-width="500px">
    <v-card>
      <v-card-title class="text-h6">Tem certeza que você deseja excluir o item?</v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="text-red-darken-3" variant="outlined" @click="closeDelete()">Cancelar</v-btn>
        <v-btn class="bg-red-darken-3" variant="tonal" @click="deleteItemConfirm()">Deletar</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import { useToast } from "~/composables/toast";

const fetchAuth = useFetchAuth()

const dataStorage = useDataStore()

const toast = useToast()

const emit = defineEmits(["edit", "save", "delete"]);

const itemsProfile = ref(['Adiministrador', 'Operacional'])

const activeUser = ref({
  dialog: false,
  url: ''

})

const getActiveUserUrl = (login: string) => {
  // return location.origin + `/app/usuario/ativar/${login}`
  return location.origin + `/app/usuario/ativar`
}

const fieldTypePassword = ref({ password: 'text' })
const handleType = (event: any) => {
  const { srcElement, type } = event;
  const { name, value } = srcElement;

  if (type === 'blur' && !value) {
    (fieldTypePassword.value as any)[name] = 'text'
    return
  }

  (fieldTypePassword.value as any)[name] = 'password'
}

const form = ref(false)

const defaultValueForm = {
  firstName: "",
  lastName: "",
  login: "",
  temporaryPassword: "",
  activeFlag: "Ativo",
  role: 'Operacional'

}

const formValue = ref({ ...defaultValueForm });

const resetForm = () => {
  formValue.value = { ...defaultValueForm }
}

const ruleRequired = (value: any) => !!value || "Campo obrigatório";

const onSubmit = async () => {
  if (!form.value) return
  const values = formValue.value
  const role = formValue.value.role == 'ASSISTANT_ADMIN' ? '' : 'OPERATIONAL'
  if (idFromEdit.value) {
    fetchAuth.put(`/user/${idFromEdit.value}`, {
      firstName: values.firstName,
      lastName: values.lastName,
      login: values.login,
      temporaryPassword: values.temporaryPassword,
      activeFlag: values.activeFlag == 'Ativo',
      role
    }).then((response: any) => {
      toast?.sucess("Item editado com sucesso!");
      dialog.value = false;
      resetForm();
      emit('edit');
    }).catch(() => {
      toast?.error("Erro ao editar item!");
    })
    return;
  }

  fetchAuth.post("/user", {
    firstName: values.firstName,
    lastName: values.lastName,
    login: values.login,
    temporaryPassword: values.temporaryPassword,
    activeFlag: values.activeFlag == 'Ativo',
    role
  }).then((result: any) => {
    toast?.sucess(`Item criado com sucesso!`);
    activeUser.value.url = getActiveUserUrl(result.login)
    activeUser.value.dialog = true
    dialog.value = false;
    emit('save')
  }).catch(() => {
    toast?.error("Erro ao criar item!");
  })
}

const dialog = ref(false);
const dialogDelete = ref(false);
const idFromEdit = ref<number | null>();
const idFormDelete = ref<number | null>();

const editItem = (item: any) => {
  idFromEdit.value = item.id;
  formValue.value = {
    firstName: item.firstName,
    lastName: item.lastName,
    login: item.login,
    temporaryPassword: item.temporaryPassword,
    activeFlag: item.activeFlag ? 'Ativo' : 'Inativo',
    role: item.role == 'ASSISTANT_ADMIN' ? 'Administrador' : 'Operacional'
  }

  itemsProfile.value = dataStorage.isAdiministrator ? ['Adiministrador', 'Operacional'] : ['Operacional']

  dialog.value = true;
};

const deleteItem = (item: any) => {
  idFormDelete.value = item.id;
  dialogDelete.value = true;
};

const createItem = () => {
  resetForm();
  if (dataStorage.isAdiministrator) {
    itemsProfile.value = ['Adiministrador', 'Operacional']
  } else {
    itemsProfile.value = ['Operacional']
  }

  idFromEdit.value = null;
  dialog.value = true;
};

const deleteItemConfirm = () => {
  fetchAuth.delete(`/user/${idFormDelete.value}`).then(() => {
    emit('delete')
    toast.sucess("Item deletado com sucesso!");
  }).catch(() => {
    toast.error("Erro ao deletar item!");
  }).finally(() => {
    closeDelete();
  });
};

// Fechar o diálogo
const close = () => {
  dialog.value = false;
};

// Fechar o diálogo de exclusão
const closeDelete = () => {
  dialogDelete.value = false;
};

defineExpose({
  createItem,
  editItem,
  deleteItem,
});

</script>