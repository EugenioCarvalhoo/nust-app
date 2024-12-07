<template>
    <div>
        <v-table>
            <thead>
                <tr>
                    <th v-for="header in headers" :key="header.key" class="font-weight-bold">
                        {{ header.label }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in items" :key="item.id">
                    <td v-for="header in headers" :key="header.key">
                        <p>{{ getValue(header, item) }}</p>
                        <slot v-if="header.key == 'actions'" name="actions" :item="item"></slot>
                    </td>
                </tr>
            </tbody>
        </v-table>
        <slot name="footer"></slot>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import Decimal from 'decimal.js';
import { format } from 'date-fns';

interface TableHeader {
    label: string;
    key: string;
    type?: "currency" | 'date';
}

interface Props {
    headers: TableHeader[];
    items: any[];
    rules?: { [key: string]: ((value: any) => string | null | boolean)[] };
    showTotal?: boolean;
    totalField?: string;
    canEdit?: boolean;
    canDelete?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    rules: () => ({}),
    canEdit: true,
    canDelete: true
});

const numberFormat = useNumberFormatter();

const getValue = (header: TableHeader, item: any) => {
    if (!header.type) return item[header.key];
    
    if (header.type === 'currency') {
        return numberFormat.formatCurrencyBr(String(item[header.key]));
    }

    if (header.type == 'date') {
        return format(new Date(item[header.key]), 'dd/MM/yyyy');
    }

    return item[header.key];
}

</script>
