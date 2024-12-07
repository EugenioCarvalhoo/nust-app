<template>
  <DataTableServerApp
    :headers="headers"
    :fetch-url="'/order-canceled/page'"
    :transform="transformPagination"
    ref="dataTable"
    >
      <template #top>
        <v-toolbar class="bg-white" flat>
          <v-toolbar-title>Cancelados</v-toolbar-title>
          <v-btn
            variant="tonal"
            class="mt-2 bg-red-darken-3"
            @click="useFormModal?.createItem()"
          >
            ADICIONAR
          </v-btn>
          <OrderCanceledFormModel
            @save="dataTable?.findItems({ page: 1})"
            @edit="dataTable?.findItems({ page: 1})"
            @delete="dataTable?.findItems({ page: 1})"
            ref="useFormModal"
          />
        </v-toolbar>
      </template>

      <template v-slot:item.orderCanceledDate="{ item }">
        <div>{{ dateFormat.formatDate((item as any).orderCanceledDate) }}</div>
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


import OrderCanceledFormModel from "./order-canceled-form-model.vue";
import type { DataTableServerApp } from "#build/components";

const dateFormat = useDateFormatter()
const numberFormat = useNumberFormatter()

const useFormModal = ref<InstanceType<typeof OrderCanceledFormModel>>();

const dataTable = ref<InstanceType<typeof DataTableServerApp>>();

const headers: any = [
{
    title: "Código",
    align: "start",
    sortable: true,
    key: "id",
  },
  {
    title: "Quantidade",
    align: "start",
    sortable: false,
    key: "quantity",
  },
  {
    title: "Dt. Cancelamento",
    align: "start",
    sortable: true,
    key: "orderCanceledDate",
  },
  {
    title: "Ações",
    align: "start",
    sortable: false,
    key: "actions",
  },
];

const transformPagination = (_data: any) => {
      const _content: { id: number | string, quantity: number, orderCanceledDate: string }[]  = _data.content
      return _content
}

</script>

<style scoped></style>
