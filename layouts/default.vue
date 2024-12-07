<template>
  <v-app id="inspire" class="border-bottom">
    <v-app-bar  class="px-3 bg-blue-grey-darken-3" flat :border="true">
      <v-app-bar-nav-icon v-if="route.fullPath != '/'" variant="text" @click.stop="drawerClick()"></v-app-bar-nav-icon>
      <v-avatar class="hidden-md-and-up" color="grey-darken-1" size="32"></v-avatar>

      <v-spacer></v-spacer>

      <v-tabs color="red-darken-4" centered>
      </v-tabs>
      <v-spacer></v-spacer>
      <userCard v-if="showItemns" ></userCard>
    </v-app-bar>
    <v-main class="bg-grey-lighten-5">
      <v-navigation-drawer v-if="showItemns" class="bg-blue-grey-darken-3" :width="274" v-model="drawer" :mobile-breakpoint="869">
        <v-list-item height="50" :title="dataStorage.data.bussinessName"></v-list-item>
        <v-divider></v-divider>
        <v-list-item v-for="item of items" height="50" link :title="item.title" :to="item.to">
          <template #prepend>
            <v-icon size="28" class="text-white opacity-100">
              {{ item.icon }}
            </v-icon>
          </template>
        </v-list-item>
      </v-navigation-drawer>

      <v-container>
        <Toast></Toast>
        <slot></slot>
      </v-container>
    </v-main>
  </v-app>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import Toast from '~/components/toast .vue';
import { useRoute } from 'vue-router';

const showItemns = computed(() => {
  if (route.fullPath == '/app/usuario/ativar') {
    return false
  } 
  return route.fullPath != '/'
})

const route = useRoute()




const drawer = ref(false)

const dataStorage = useDataStore()

const skiptUrls = ['/app/usuario/ativar']

const verfifyAcessRota = (newPath: string) => {
    if (!dataStorage.data.appStart && newPath !== '/' && !skiptUrls.includes(newPath)) {
      navigateTo('/')
    }
}

verfifyAcessRota(route.fullPath)

watch(
  () => route.fullPath,
  verfifyAcessRota
);

const getItems = () => {
  let _items = [
    { id: 3, title: 'Receitas', icon: 'mdi-cash-plus', to: '/app/receita' },
    { id: 4, title: 'Despesas', icon: 'mdi-cash-minus', to: '/app/despesa' },
    { id: 5, title: 'Cancelados', icon: 'mdi-sync-off', to: '/app/cancelado' },
  ]

  if (dataStorage.isAdmins) {
    const adminItems = [
      { id: 1, title: 'Dashboard', icon: 'mdi-view-dashboard-outline', to: '/app/dashboard' },
      { id: 2, title: 'Usuários', icon: 'mdi-account-group', to: '/app/usuario' },
    ]
    _items.push(...adminItems)
    _items = _items.sort((a, b) => a.id - b.id)
  }

  return _items
}

const items = ref(getItems())

dataStorage.$subscribe((mutation, state) => {
  items.value = getItems()
})

const drawerClick = () => {
  drawer.value = !drawer.value
}
</script>