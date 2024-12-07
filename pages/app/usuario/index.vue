<template>
  <DataTableServerApp
    :headers="headers"
    :fetch-url="'/user/page'"
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
          <UserFormModel
            @save="dataTable?.findItems({ page: 1})"
            @edit="dataTable?.findItems({ page: 1})"
            @delete="dataTable?.findItems({ page: 1})"
            ref="useFormModal"
          />
        </v-toolbar>
      </template>


      <template v-slot:item.fullName="{ item }">
        <div>{{ (item as any).firstName }} {{ (item as any).lastName || '' }}</div>
      </template>      

      <template v-slot:item.activeFlag="{ item }">
        <div>{{ (item as any).activeFlag ? 'Sim' : 'Não' }}</div>
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
import UserFormModel from "./user-form-model.vue";

const dateFormat = useDateFormatter()
const numberFormat = useNumberFormatter()

const useFormModal = ref<InstanceType<typeof UserFormModel>>();

const dataTable = ref<InstanceType<typeof DataTableServerApp>>();

const headers: any = [
{
    title: "Código",
    align: "start",
    sortable: true,
    key: "id",
  },
  {
    title: "Nm. Usuário",
    align: "start",
    sortable: false,
    key: "fullName",
  },
  {
    title: "Login",
    align: "start",
    sortable: false,
    key: "login",
  },
  {
    title: "Ativo",
    align: "start",
    sortable: true,
    key: "activeFlag",
  },
  {
    title: "Ações",
    align: "start",
    sortable: false,
    key: "actions",
  },
];

const transformPagination = (_data: any) => {
      const _content: { id: number | string, username: number, activeFlag: string }[]  = _data.content
      return _content
}

</script>

<style scoped></style>
