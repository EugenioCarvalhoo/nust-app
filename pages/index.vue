<template>
    <div>
        <v-conainer>

            <v-sheet class="mx-auto mt-16 pa-6" width="600" elevation="1" rounded>
                <v-row class="py-2 text-center" justify="center">
                    <div>
                        <v-img rounded="lg" :width="150" aspect-ratio="16/9" cover src="/icons/Carvalho.png"></v-img>
                    </div>
                </v-row>
                <v-form fast-fail @submit.prevent>
                    <v-text-field variant="underlined" v-model="firstName" :rules="firstNameRules"
                        label="Login ou Email"></v-text-field>

                    <v-text-field variant="underlined" v-model="lastName" :rules="lastNameRules"
                        label="Senha"></v-text-field>

                    <v-btn variant="tonal" class="mt-2 bg-red-darken-3" type="submit" block>Enviar</v-btn>
                </v-form>
            </v-sheet>
        </v-conainer>
    </div>
</template>

<script setup >
definePageMeta({
    layout: 'login',
})

 

const firstName = ""
const firstNameRules = [
            value => {
                if (value) return true

                return 'First name must be at least 3 characters.'
            },
        ]

const lastName = ''
const lastNameRules = [
            value => {
                if (value) return true 


                return 'Last name can not contain digits.'
            },
        ]

</script>