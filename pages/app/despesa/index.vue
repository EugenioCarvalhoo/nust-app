<template>
  <DataTableServerApp
    :headers="headers"
    :fetch-url="'/expense/page'"
    :transform="transformPagination"
    ref="dataTable"
    >
      <template #top>
        <v-toolbar class="bg-white" flat>
          <v-toolbar-title>Despesa</v-toolbar-title>
          <v-btn
            variant="tonal"
            class="mt-2 bg-red-darken-3"
            @click="useFormModal?.createItem()"
          >
            ADICIONAR
          </v-btn>
          <OutputFormModel
            @save="dataTable?.findItems({ page: 1})"
            @edit="dataTable?.findItems({ page: 1})"
            @delete="dataTable?.findItems({ page: 1})"
            ref="useFormModal"
          />
        </v-toolbar>
      </template>

      <template v-slot:item.amount="{ item }">
        <div>{{ numberFormat.formatCurrencyBr((item as any).amount as string) }}</div>
      </template>
      
      <template v-slot:item.description="{ item }">
        <div>{{ item.description || '-' }}</div>
      </template>

      <template v-slot:item.dueDate="{ item }">
        <div>{{ dateFormat.formatDate((item as any).dueDate) }}</div>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon
          class="me-2"
          size="small"
          @click="useFormModal?.editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon size="small" @click="useFormModal?.deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>

    </DataTableServerApp>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import type { DataTableServerApp } from "#build/components";
import OutputFormModel from "./output-form-model.vue";

const dateFormat = useDateFormatter()
const numberFormat = useNumberFormatter()

const useFormModal = ref<InstanceType<typeof OutputFormModel>>();
const dataTable = ref<InstanceType<typeof DataTableServerApp>>();

const headers: any = [
{
    title: "Código",
    align: "start",
    sortable: true,
    key: "id",
  },
  {
    title: "Descrição/Tipo",
    align: "start",
    sortable: false,
    key: "description",
  },
  {
    title: "Valor R$",
    align: "start",
    sortable: false,
    key: "amount",
  },
  {
    title: "Tipo Pagamento",
    align: "start",
    sortable: false,
    key: "paymentType",
  },
  {
    title: "Categoria",
    align: "start",
    sortable: false,
    key: "category",
  },
  {
    title: "Dt. Saida",
    align: "start",
    sortable: true,
    key: "dueDate",
  },
  {
    title: "Status",
    align: "start",
    sortable: false,
    key: "status",
  },
  {
    title: "Ações",
    align: "start",
    sortable: false,
    key: "actions",
  },
];

const transformPagination = (_data: any) => {
      return _data.content.map((item: any) => {
        const entryDate = item.entryDate;
        let inputValue = String(item.inputValue).includes(".")
          ? item.inputValue
          : String(item.inputValue) + ".00";
        return { ...item, entryDate, inputValue };
      });
}

</script>

<style scoped></style>
