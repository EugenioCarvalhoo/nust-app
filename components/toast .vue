<template>
    <v-snackbar
      v-model="toastRef.toastInfo.value.show"
      :timeout="toastRef.toastInfo.value.timeout || 3000"
      class="text-black"
      :color="toastRef.toastInfo.value.color"
      elevation="10"
    >
      {{ toastRef.toastInfo.value.message }}
    </v-snackbar>
    <!-- <v-snackbar model-value="isEl"  color="primary"  elevation="10" >Ola mundo</v-snackbar> -->
</template>

<script lang="ts" setup>
import { useToast } from '~/composables/toast';

const toastRef = useToast();


</script>
