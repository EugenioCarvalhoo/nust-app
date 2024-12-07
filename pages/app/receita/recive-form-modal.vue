<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card class="pt-4">
      <v-form fast-fail v-model="form" @submit.prevent="onSubmit">
        <v-card-title>
          <span class="text-h5">{{
            idFromEdit ? "Editar receita" : "Criar receita"
          }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <!-- <v-col cols="12" class="pa-2">
                <v-select
                  label="Tipo"
                  variant="underlined"
                  v-model="description"
                  v-bind:="descriptionProps"
                  :items="descriptionTypeList"
                  
                >
                </v-select>
              </v-col> -->

              <v-col cols="12" class="pa-2">
                <v-select label="Categoria" variant="underlined" v-model="formValue.category" :rules="[ruleRequired]"
                  :items="categoryList">
                </v-select>
              </v-col>

              <v-col cols="12" class="pa-2">
                <InputDate v-model="formValue.entryDate" :rules="[ruleRequired]" label="Data da Receita" />
              </v-col>

              <v-col cols="12" class="pa-2">
                <v-text-field type="number" variant="underlined" v-model="formValue.orderQuantity"
                  label="Quantidade"></v-text-field>
              </v-col>

              <v-col cols="12" class="pa-2">
                <InputCurrency readonly :max="100000" variant="underlined" v-model="formValue.amount" :rules="[ruleRequired]"
                  label="Valor"></InputCurrency>
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
import { ref, watch } from "vue";
import { useToast } from "~/composables/toast";

const numberFormat = useNumberFormatter()
const fetchAuth = useFetchAuth()

const toast = useToast()
const dialog = ref(false);
const dialogDelete = ref(false);
const idFromEdit = ref<number | null>();
const idFormDelete = ref<number | null>();
const emit = defineEmits(["edit", "save", "delete"]);

const ruleRequired = (v: any) => {
  return !!v || 'Este campo é obrigatório'
}

const formValue = ref({
  description: "",
  category: null,
  amount: "",
  entryDate: "",
  orderQuantity: "",
})
const form = ref(false)


const resetForm = () => {
  formValue.value = {
    description: "",
    category: null,
    amount: "",
    entryDate: "",
    orderQuantity: "",
  }
}

const paymentTypesList = ref([]);
const categoryList = ref([]);

watch(dialog, async () => {
  if (!dialog.value) {
    resetForm()
    idFromEdit.value = null
    return
  }
  const paymentTypesFetch: any = await fetchAuth.get(
    "/refcodes/type/ReceiveEntity/code/paymentType",);

  const categoryFetch: any = await fetchAuth.get(
    "/refcodes/type/ReceiveEntity/code/inputCategory");

  const mapName = (arr: any[]) => arr.map(item => item.name)

  categoryList.value = (mapName(categoryFetch) as any) || [];
  paymentTypesList.value = (mapName(paymentTypesFetch) as any) || [];
})


const onSubmit = () => {
  if (!form.value) return
  const values = formValue.value
  if (idFromEdit.value) {

    fetchAuth.put(`/receive/${idFromEdit.value}`,
      {
        description: values.description,
        category: values.category,
        amount: values.amount
          .replace(/\D/g, "")
          .replace(/(\d{2})$/, ".$1"),
        entryDate: values.entryDate,
        orderQuantity: values.orderQuantity
      }).then(() => {
        toast?.sucess("Item editado com sucesso!");
        dialog.value = false;
        resetForm()
        emit('edit');
      }).catch(() => {
        toast?.error("Erro ao editar item!");
      })
    return;
  }

  fetchAuth.post("/receive",
    {
      description: values.description,
      category: values.category,
      amount: values.amount
        .replace(/\D/g, "")
        .replace(/(\d{2})$/, ".$1"),
      entryDate: values.entryDate,
      orderQuantity: values.orderQuantity
    }).then(() => {
      toast?.sucess("Item criado com sucesso!");
      dialog.value = false;
      emit('save')
    }).catch(() => {
      toast?.error("Erro ao criar item!");
    })
}

const editItem = (item: any) => {
  idFromEdit.value = item.id;
  formValue.value = {
    description: item.description,
    category: item.category,
    amount: numberFormat.formatCurrencyBr(String(item.amount)),
    entryDate: item.entryDate,
    orderQuantity: String(item.orderQuantity),
  }

  dialog.value = true;
};

// Função para deletar um item
const deleteItem = (item: any) => {
  idFormDelete.value = item.id;
  dialogDelete.value = true;
};

const createItem = () => {
  resetForm()
  idFromEdit.value = null;
  dialog.value = true;
};

// Função para confirmar a exclusão
const deleteItemConfirm = () => {
  fetchAuth.delete(`/receive/${idFormDelete.value}`).then(() => {
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
}

defineExpose({
  createItem,
  editItem,
  deleteItem,
})

</script>
