<template>
  <v-app id="inspire" class="border-bottom">
    <Header :userButton=false ></Header>
    <v-main class="bg-grey-lighten-5">

      <v-container>
        <slot></slot>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
const links = [
  'Dashboard',
  'Messages',
  'Profile',
  'Updates',
]
</script>

<script>
export default {
  data: () => ({
    links: [
      'Dashboard',
      'Messages',
      'Profile',
      'Updates',
    ],
  }),
}
</script>