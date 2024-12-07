<template>
    <v-dialog v-model="dialog" max-width="800px">
        <v-card class="pt-4">

            <v-card-title>
                <span class="text-h5">Detalhes da receita</span>
            </v-card-title>

            <v-card-text>
                <v-container>
                    <v-form v-model="form" @submit.prevent="saveItem">
                        <v-table>
                            <thead>
                                <tr>
                                    <th v-for="header in headers" :key="header.key" class="font-weight-bold">
                                        {{ header.label }}
                                    </th>
                                    <th class="font-weight-bold">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in items " :key="item.id">
                                    <td v-if="!item.edit" class="cursor-pointer" v-for="header in headers"
                                        :key="header.key">
                                        <p>{{ getValueType(header, item) }}</p>

                                    </td>

                                    <td v-else v-for="header in headers">
                                        
                                        <InputCurrency v-if="header.type === 'currency'" :rules="(rules[header.key] as any)"
                                            v-model="updateItem[header.key]" variant="underlined"></InputCurrency>

                                            <v-select v-else-if="header.type === 'select'" :rules="(rules[header.key] as any)"
                                            v-model="updateItem[header.key]" variant="underlined" :items="header.items"></v-select>
                                        
                                            <v-text-field v-else :rules="(rules[header.key] as any)"
                                            v-model="updateItem[header.key]" variant="underlined"></v-text-field>

                                    </td>

                                    <td v-if="!item.edit">
                                        <v-btn icon="mdi-pencil" @click="editItem(item)" variant="flat" class="me-2"
                                            size="small"></v-btn>
                                        <v-btn @click="deleteItem(item)" size="small" icon="mdi-delete" variant="flat">

                                        </v-btn>
                                    </td>
                                    <td v-else>
                                        <v-btn @click="cancelEditItem(index)" icon="mdi-cancel" variant="flat"
                                            v-tooltip="'Cancelar'" class="me-2" size="small">

                                        </v-btn>
                                        <v-btn @click="saveItem" type="submit" variant="flat" icon="mdi-check"
                                            :disabled="!form" v-tooltip="'Salvar'" size="small">
                                        </v-btn>
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                        <v-row v-if="items.length > 0" justify="center" class="mt-2 pa-2">
                            <span class="mr-2">Total:</span>
                            <span class="text-success font-weight-bold">{{
                                numberFormat.formatCurrencyBr(totalAmountItems) }}</span>
                        </v-row>
                    </v-form>
                </v-container>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import Decimal from 'decimal.js';
import { ref } from 'vue';
const dialog = ref(false);
const totalAmountItems = ref()
const emit = defineEmits(["save", 'delete']);
const receiveId = ref()

const fetchAuth = useFetchAuth()

const toast = useToast()

const numberFormat = useNumberFormatter()

const form = ref(false)

const updateItem = ref()

const editItem = (item: any) => {
    items.value.forEach(el => {
        el.edit = false
    })
    updateItem.value = { ...item }
    item.edit = true
}

const deleteItem = (item: any) => {
    fetchAuth.delete(`/receive/item/id/${item.id}`).then(() => {
        findAll()
        toast.sucess('Item deletado com sucesso!')
        emit('delete')
    }).catch(err => {
        toast.error("Erro ao deletar item!")
    })
}

const cancelEditItem = (index: number) => {
    items.value[index].edit = false
}


const getValueType = (header: HeadersType, item: any) => {
    if (header.type) return item[header.key]

    if (header.type === 'currency') {
        return numberFormat.formatCurrencyBr(item[header.key])
    }
    return item[header.key]

}

const saveItem = () => {
    if (!form) return
    form.value = false
    fetchAuth.put(`/receive/item/id/${updateItem.value.id}`, {
            ...updateItem.value,
            amount: updateItem.value.amount.replace(/\D/g, '').replace(/(\d{2})$/, ".$1"),
        }).then(() => {
        findAll()
        toast.sucess("Item editado com sucesso!")
        emit('save')
    }).catch(err => {
        form.value = true
        toast.error("Erro ao editar item!")
    })
}


const rules: { [ruleName: string]: ((value: any) => string | null | boolean)[] } = {
    name: [(v) => !!v || "Campo obrigatorio"],
}

type ReportItemType = {
    id: number
    paymentType: string
    amount: number | string
    receiveId: number
}

type HeadersType = { id: number, items?: string[], label: string; key: string, type?: "currency" | 'select' }

const headers = ref<HeadersType[]>([
    {
        id: 1,
        label: "Tipo de pagamento",
        key: "paymentType",
        type: "select",
        items: []
    },
    {   
        id: 2,
        label: "Valor",
        key: "amount",
        type: "currency"
    }
])


const findPaymentTypeReciveItem = async () => {
    const paymentTypesFetch: any = await fetchAuth.get(
        "/refcodes/type/ReceiveItemEntity/code/paymentType",);
    headers.value[0].items = paymentTypesFetch.map((item: any) => item.name)
}

type ItemListType = {
    id: number | string,
    edit?: boolean
}

type ItemListTypeExtends = ItemListType & {
    [key: string]: string | number
}

const items = ref<ItemListTypeExtends[]>([])

const findAll = () => {
    fetchAuth.get('/receive/items-by-receive-id', { params: { receiveId: receiveId.value } } ).then((res: any) => {
        const value = res as ReportItemType[]
        items.value = value.map((item: ReportItemType) => {
            item.amount =  Number(item.amount).toFixed(2)
            return item
        })
        totalAmountItems.value = value.reduce((acc, item) => acc.plus(item.amount), new Decimal(0))
    }).catch((err) => {
    })
}

watch(dialog, () => {
    if (dialog.value) {
        findPaymentTypeReciveItem()
        findAll()
        return
    }
    setTimeout(() => {
        items.value = []
        updateItem.value = undefined
        receiveId.value = undefined
    }, 300);
})

const open = (item: { receiveId: number }) => {
    dialog.value = true
    receiveId.value = item.receiveId
}


defineExpose({ open })

</script>