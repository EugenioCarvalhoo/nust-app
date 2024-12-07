<template>
    <v-text-field 
    v-bind="attrs" 
    :variant="variant" 
    @input="updateValue" 
    :value="props.modelValue"
    :persistent-placeholder="persistentPlaceholder"
    :type="show ? 'text' : 'password'"
    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
    @click:append="show = !show"
    >
    </v-text-field>

</template>

<script setup lang="ts">
import { useAttrs, computed } from 'vue';

const persistentPlaceholder = ref(false);

const emit = defineEmits()

const fieldTypePassword = ref({ password: 'text' })
const handleType = (event: any) => {
  const { srcElement, type } = event;
  const { name, value } = srcElement;

  if (type === 'blur' && !value) {
    (fieldTypePassword.value as any)[name] = 'text'
    return
  }

  (fieldTypePassword.value as any)[name] = 'password'
}

const show = ref(false)

const props = defineProps({
    modelValue: {
        type: String,
        default: '',
    },
    variant: {
        type: String,
        default: 'underlined',
    },
});

const localValue  = ref(props.modelValue)

onMounted(() => {
    if (props.modelValue) {
        persistentPlaceholder.value = true
    }
})

watch(localValue,  (newValue) => {
    if (localValue.value == newValue) return
    localValue.value = newValue
})

const updateValue = (event: InputEvent) => {
    const value = (event.target as HTMLInputElement).value; // Acessa o valor
    emit('update:modelValue', value);
};



const attrs = useAttrs()
</script>
