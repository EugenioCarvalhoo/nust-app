<template>
    <v-text-field v-bind="attrs" :variant="variant" @input="updateValue" :value="maskedValue"
        :persistent-placeholder="persistentPlaceholder">
    </v-text-field>

</template>

<script setup lang="ts">
import { useAttrs, computed } from 'vue';

const persistentPlaceholder = ref(false);

const emit = defineEmits()

const props = defineProps({
    modelValue: {
        type: String,
        default: '',
    },
    variant: {
        type: String,
        default: 'underlined',
    },
    min: {
        type: Number,
        default: 0,
    },
    max: {
        type: Number,
        default: Infinity, // Não há limite máximo por padrão
    },
});

const localValue  = ref(props.modelValue)

onMounted(() => {
    if (props.modelValue) {
        persistentPlaceholder.value = true
    }
})

const maskedValue = (valueParam: string) => {
    let value = String(valueParam).replace(/\D/g, '')

    if (!value) {
        persistentPlaceholder.value = false
        return ''
    }

    const valueFormat = Number(value) / 100
    if (valueFormat >= props.max) {
        value = value.slice(0, value.length - 1)
    }
    if (valueFormat <= props.min) {
        value = String(props.min)
    }

    const newValue = parseFloat(value) / 100;


    return isNaN(newValue) ? '' : new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(newValue);
}


watch(localValue,  (newValue) => {
    if (localValue.value == newValue) return
    newValue = maskedValue(newValue)
    localValue.value = newValue
})

const updateValue = (event: InputEvent) => {
    const value = (event.target as HTMLInputElement).value; // Acessa o valor
    emit('update:modelValue', value); // Emite o valor

};



const attrs = useAttrs()
</script>
