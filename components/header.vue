<template>
    <v-app-bar class="px-3 bg-blue-grey-darken-3" density="compact" flat :border="true">
        <v-avatar class="hidden-md-and-up" color="grey-darken-1" size="32"></v-avatar>

        <v-spacer></v-spacer>

        <v-tabs color="red-darken-4" centered>
            <!-- <v-tab v-for="link in links" :key="link" :text="link"></v-tab> -->
        </v-tabs>
        <v-spacer></v-spacer>

        <!-- <v-avatar class="hidden-sm-and-down" color="grey-darken-1" size="32"></v-avatar> -->
        <user-icon v-if="userButton"></user-icon>
    </v-app-bar>

</template>

<script lang="ts" setup>
    const props = defineProps({
        userButton: {
            type: Boolean,
            default: true
        }
    })

</script>

<style></style>