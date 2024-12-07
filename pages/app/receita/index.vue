<template>
  <DataTableServerApp :headers="headers" :fetch-url="'/receive/page'"
    :transform="transformPagination" ref="dataTable">
    <template #top>
      <v-toolbar class="bg-white" flat>
        <v-toolbar-title>RECEITA</v-toolbar-title>
        <v-btn variant="tonal" class="mt-2 mr-2 bg-red-darken-3" @click="reportModal?.create()">
          ADICIONAR RELATÓRIO
        </v-btn>
        <UserFormModal @save="dataTable?.findItems({ page: 1 })" @edit="dataTable?.findItems({ page: 1 })"
          @delete="dataTable?.findItems({ page: 1 })" ref="userFormModal" />

        <ReportModal ref="reportModal" @save="dataTable?.findItems({ page: 1 })" />
        <ReportItemList @delete="dataTable?.findItems({ page: 1 })" @save="dataTable?.findItems({ page: 1 })"
          ref="reportItemList" />
      </v-toolbar>
    </template>

    <template v-slot:item.amount="{ item }">
      <div>{{ numberFormat.formatCurrencyBr((item as any).amount as string) }}</div>
    </template>

    <template v-slot:item.entryDate="{ item }">
      <div>{{ dateFormat.formatDate((item as any).entryDate) }}</div>
    </template>

    <template v-slot:item.actions="{ item }">
      <v-btn variant="flat" icon="mdi-pencil" class="me-2" size="small" @click="userFormModal?.editItem(item)">

      </v-btn>
      <v-btn variant="flat" icon="mdi-delete" class="me-2" size="small" @click="userFormModal?.deleteItem(item)">

      </v-btn>

      <v-btn variant="flat" icon="mdi-chevron-down-circle-outline" v-tooltip="'Mais detalhes'" size="small"
        @click="reportItemList?.open({ receiveId: (item as any).id })">

      </v-btn>
    </template>

  </DataTableServerApp>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import UserFormModal from "./recive-form-modal.vue";
import type { DataTableServerApp } from "#build/components";
import ReportModal from "./report-modal.vue";
import ReportItemList from "./report-item-list.vue";

const dateFormat = useDateFormatter()
const numberFormat = useNumberFormatter()

const userFormModal = ref<InstanceType<typeof UserFormModal>>();
const dataTable = ref<InstanceType<typeof DataTableServerApp>>();
const reportModal = ref<InstanceType<typeof ReportModal>>();
const reportItemList = ref<InstanceType<typeof ReportItemList>>();

const headers: any = [
  {
    title: "Código",
    align: "start",
    sortable: true,
    key: "id",
  },
  {
    title: "Valor R$",
    align: "start",
    sortable: false,
    key: "amount",
  },
  {
    title: "Categoria",
    align: "start",
    sortable: false,
    key: "category",
  },
  {
    title: "Dt. Receita",
    align: "start",
    sortable: true,
    key: "entryDate",
  },
  {
    title: "Quantidade",
    align: "start",
    sortable: false,
    key: "orderQuantity",
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
