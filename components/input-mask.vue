<template>
    <v-text-field v-bind="attrs" @input="updateValue" :value="maskedValue"  :persistent-placeholder="persistentPlaceholder" />
</template>

<script setup lang="ts">
import { useAttrs,computed } from 'vue';

const persistentPlaceholder = ref(false);


const emit = defineEmits();

const props = defineProps({
    modelValue: {
        type: String,
        default: '',
    },
    mask: {
        type: String
    }
});

const masks = {
    "NUMBER": (value: string) => value.replace(/\D/g, ''), 
}

onMounted(() => {
    if (props.modelValue) {
        persistentPlaceholder.value = true
    }
})

const maskedValue = computed(() => {
    if (!props.mask) return props.modelValue
    
    if (!props.modelValue) {
        persistentPlaceholder.value = false
        return props.modelValue
    }
    
    let value = (masks as any)[props.mask](props.modelValue);

    return value  
});


const updateValue = (event: InputEvent) => {
    const value = (event.target as HTMLInputElement).value; // Acessa o valor
    emit('update:modelValue', value); // Emite o valor
};

const attrs = useAttrs()

</script>
