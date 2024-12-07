<template>
  <v-sheet class="mx-auto mt-8 pa-6" elevation="1" rounded="lg">
    <v-data-table-server
      :headers="(props.headers as any)"
      :items="items"
      :items-length="pagination.totalElements"
      :items-per-page-options="[10, 20, 30]"
      :items-per-page-text="'Linhas por página'"
      :items-pre-page="pagination.size"
      :item-value="(value: any) => value.id"
      v-model:page="modelPage"
      :loading="loading"
      :page-count="pagination.totalPages"
      @update:options="findItems"
      :page-text="getPageText"
    >
      <template v-for="(_, name) in $slots" v-slot:[name]="slotProps">
        <slot v-if="slotProps" :name="name" v-bind="slotProps"></slot>
      </template>

      <template v-slot:no-data>
        <v-alert>Nenhuma registro encontardo!</v-alert>
      </template>

    </v-data-table-server>
  </v-sheet>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const modelPage = ref(1);

const loading = ref(false);

const pagination = ref({
  page: 1,
  size: 10,
  totalElements: 0,
  totalPages: 0,
});

const getPageText = computed(() => {
  const { page, size, totalElements } = pagination.value;
  const initialCount = Math.abs((page - 1) * size + 1);
  const elementInpageFromTotal = Math.min(totalElements, page * size);
  return `${initialCount} - ${elementInpageFromTotal} de ${totalElements}`;
});

type HeaderTable = {
  title: string;
  align: string;
  sortable: boolean;
  key: string;
};

const props = defineProps({
  headers: {
    type: Array as () => HeaderTable[],
    required: true,
  },
  fetchUrl: {
    type: String,
    required: true,
  },
  transform: {
    type: Function,
    required: true,
  },
});

const items: any = ref([]);

const findItems = (options?: {
  itemsPerPage?: number;
  page?: number;
  sortBy?: { key: string; order?: boolean }[];
}) => {
  const { page, size } = pagination.value;

  const sortOptions = options?.sortBy?.[0];

  const sort = sortOptions
    ? `${sortOptions.key},${sortOptions.order ? sortOptions.order : "desc"}`
    : "id,desc";

  loading.value = true;
  useFetchAuth().get(props.fetchUrl, {
    params: {
      page: options?.page ? options.page - 1 : page,
      size: options?.itemsPerPage || size,
      sort,
    },
    transform: props.transform,
  })
    .then((reciveList: any) => {
      pagination.value = {
        page: reciveList.pageable.pageNumber + 1,
        size: reciveList.pageable.pageSize,
        totalElements: reciveList.totalElements,
        totalPages: reciveList.totalPages,
      };

      items.value = reciveList.content;
    })
    .finally(() => (loading.value = false));
};

defineExpose({
  findItems,
});
</script>

<style scoped></style>
