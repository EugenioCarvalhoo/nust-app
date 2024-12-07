<template>
  <v-card class="mt-3" >
    <v-card-title><slot></slot> </v-card-title>
    <v-card-text>
      <v-row>
        <v-col>
          <p>Receita</p>
          <p
            class="text-success font-weight-bold text-subtitle-2"
          >
            {{ numberFormat.formatCurrencyBr(item.recive) }}
        </p>
        </v-col>
        <v-col>
          <p>Despesa</p>
          <p class="text-error font-weight-bold text-subtitle-2">
            {{ numberFormat.formatCurrencyBr(item.spend) }}
          </p>
        </v-col>
        <v-col>
          <p>Saldo</p>
          <p class="font-weight-bold text-subtitle-2">
            {{ numberFormat.formatCurrencyBr(item.balance) }}
          </p>
        </v-col>
      </v-row>

        <v-row >
            <v-divider></v-divider>
          <v-col style="max-width: 300px;" class="px-1">
            <v-card variant="text">
              <v-card-title class="text-subtitle-2 font-weight-bold"
                >Detalhe receita:</v-card-title
              >
              <v-card-text class="mt-2">
                <v-row v-for="recive in item.inputsByPaymentType" justify="space-between" class="pl-4 py-1">
                  <span class="text-subtitle-2">{{ recive.type }}: </span>
                  <div class="d-flex flex-column">
                    <span class="text-success font-weight-bold text-subtitle-2">{{ numberFormat.formatCurrencyBr(recive.total) }}</span>
                    
                    <span class="text-success font-weight-bold text-subtitle-2">{{ calcPercent(item.recive, recive.total)  }}</span>
                  </div>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col style="max-width: 300px;" class="px-1">
            <v-card variant="text">
              <v-card-title class="text-subtitle-2 font-weight-bold"
                >Detalhe despesa:</v-card-title
              >
              <v-card-text class="mt-2">
                <v-row v-for="spend in item.outputsByCategory" justify="space-between" class="pl-4 py-1">
                  <span class="text-subtitle-2">{{ spend.type }}: </span>
                  <span class="text-error font-weight-bold text-subtitle-2">{{ numberFormat.formatCurrencyBr(spend.total) + " (" + calcPercent(item.spend, spend.total)  + ")" }}</span>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col style="max-width: 300px;" class="px-1">
            <v-card variant="text">
              <v-card-title class="text-subtitle-2 font-weight-bold"
                >Pedidos:</v-card-title
              >
              <v-card-text class="mt-2">
                  <v-row justify="space-between" class="pl-4 py-1">
                    <span>Concluído: </span>
                    <span class="text-yellow-darken-2 font-weight-bold">{{ item.orderQuantity }}</span>
                  </v-row>
                <v-row justify="space-between" class="pl-4 py-1">
                  <span>Ticket médio: </span>
                  <span class="text-yellow-darken-2 font-weight-bold">{{ calcDiv(item.recive, item.orderQuantity)  }}</span>
                </v-row>
                <v-row justify="space-between" class="pl-4 py-1">
                  <span>Cancelados: </span>
                  <span class="text-yellow-darken-2 font-weight-bold">{{ item.orderCanceled }}</span>
                </v-row>
                <v-row justify="space-between" class="pl-4 py-1">
                  <span>Cancelados por dia(Média) </span>
                  <span class="text-yellow-darken-2 font-weight-bold">{{ calcDiv(item.orderCanceled, item.reportDaysQuantity)  }}</span>
                </v-row>
                <v-row justify="space-between" class="pl-4 py-1">
                  <span>Concluído/Cancelados(%): </span>
                  <span class="text-yellow-darken-2 font-weight-bold">{{ calcPercent(item.orderQuantity, item.orderCanceled) }}</span>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import Decimal from 'decimal.js';

const numberFormat = useNumberFormatter()
type BalanceCardType = {
  reportDaysQuantity: number;
  title: string;
  recive: string;
  spend: string;
  balance: string;
  orderCanceled: number;
  orderQuantity: number
  outputsByCategory: { type: string; total: number }[];
  inputsByPaymentType: { type: string; total: number }[];
};

const calcPercent = (totalRef: string | number, value: string | number) => {
  if (!totalRef || !value) return '' 
  return new Decimal(value).div(new Decimal(totalRef)).times(100).toFixed(2) + '%';
}

const calcDiv = (total: number | string, value: number | string) => {
  if (!total || !value) return '' 

  return new Decimal(total).div(new Decimal(value)).toFixed(2)
}

defineProps({
  item: {
    type: Object as () => BalanceCardType,
    required: true,
  },
});
</script>
