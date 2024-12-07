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
                <v-col cols="12" class="pa-2">
                  <v-text-field
                    label="Quantidade"
                    variant="underlined"
                    type="number"
                    v-model="formValue.quantity"
                    :rules="[ruleRequired]"
                  >
                  </v-text-field>
                </v-col>
  
  
                <v-col cols="12" class="pa-2">
                  <v-date-input
                    prepend-icon=""
                    prepend-inner-icon="$calendar"
                    placeholder="dd/mm/aaaa"
                    variant="underlined"
                    v-model="formValue.orderCanceledDate"
                    :rules="[ruleRequired]"
                    label="Data da Receita"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
  
          <v-card-actions>
            <v-spacer></v-spacer>
  
            <v-btn
              variant="outlined"
              class="mt-2 text-red-darken-3"
              @click="close"
            >
              CANCELAR
            </v-btn>
  
            <v-btn variant="tonal" type="submit" class="mt-2 bg-red-darken-3">
              SALVAR
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    
  
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="text-h6"
          >Tem certeza que você deseja excluir o item?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="text-red-darken-3"
            variant="outlined"
            @click="closeDelete()"
            >Cancelar</v-btn
          >
          <v-btn
            class="bg-red-darken-3"
            variant="tonal"
            @click="deleteItemConfirm()"
            >Deletar</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script lang="ts" setup>
  import { ref } from "vue";

  import { useToast } from "~/composables/toast";

  const fetchAuth = useFetchAuth()
  
  const toast = useToast()
    
  const emit = defineEmits(["edit", "save", "delete"]);

  
  const form = ref(false)

  const defaultValueForm = {
    quantity: "",
    orderCanceledDate: new Date()
  }

  const formValue = ref(defaultValueForm);

  const resetForm = () => {
    formValue.value = {
    quantity: "",
    orderCanceledDate: new Date()
    }
  }

  const ruleRequired = (value: any) => !!value || "Campo obrigatório";


  const onSubmit = async () => {
    if (!form.value) return
    const values = formValue.value
    if (idFromEdit.value) {
      fetchAuth.put	(`/order-canceled/${idFromEdit.value}`, {
          quantity: values.quantity,
          orderCanceledDate: values.orderCanceledDate
        }).then(() => {
        toast?.sucess("Item editado com sucesso!");
        dialog.value = false;
        resetForm();
        emit('edit');
      }).catch(() => {
        toast?.error("Erro ao editar item!");
      })    
      return;
    }
  
  fetchAuth.post("/order-canceled",  {
          quantity: values.quantity,
          orderCanceledDate: values.orderCanceledDate
      }).then(() => {
      toast?.sucess("Item criado com sucesso!");
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
      quantity: item.quantity,
      orderCanceledDate: item.orderCanceledDate
    }
  
    dialog.value = true;
  };
  
  // Função para deletar um item
  const deleteItem = (item: any) => {
    idFormDelete.value = item.id;
    dialogDelete.value = true;
  };
  
  const createItem = () => {
    resetForm();
    idFromEdit.value = null;
    dialog.value = true;
  };
  
  // Função para confirmar a exclusão
  const deleteItemConfirm = () => {
    fetchAuth.delete(`/order-canceled/${idFormDelete.value}`).then(() => {
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
  