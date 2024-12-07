<template>

  <v-row class="mt-3 mx-1 w-100">
    <v-btn :readonly="!refrashData.active" variant="tonal" class="my-3 bg-red-darken-3" @click="refrash"> {{
      refrashData.active ? 'ATUALIZAR' : "AGUARDE" + (refrashData as any).countDown + "s" }} </v-btn>
  </v-row>
  <v-row>
    <v-col cols="12" class="d-flex justify-center bg-white w-100 shadow"
      v-if="!infoDatesInMonth.reportItem || !infoDatesweek.reportItem">
      <p> Ainda não possui dados! </p>
    </v-col>
    <v-row v-if="infoDatesInMonth.reportItem && infoDatesweek.reportItem" style="max-width: 800px;">
      <v-col cols="12">
        <BalanceCard :item="infoDatesInMonth.reportItem">
          <v-row class="pa-2" align="center" justify="space-between">
            <v-col>
              <p class="text-h6">Balanço Mensal</p>
            </v-col>
            <v-col cols="4">
              <v-select @update:modelValue="changeDatesInMonth" v-model="infoDatesInMonth.startOfMonthDate"
                :items="dataSelectDatesInMonthInitial" variant="underlined" label="Dia do inicio"></v-select>
            </v-col>
            <v-col cols="4">
              <v-text-field :persistent-placeholder="true" prepend-inner-icon="$calendar" variant="underlined"
                v-model="inputDateMonth" label="Intervalo" readonly>
              </v-text-field>
            </v-col>
          </v-row>
        </BalanceCard>
      </v-col>

      <v-col cols="12">
        <BalanceCard :item="infoDatesweek.reportItem">
          <v-row class="pa-2" align="center" justify="space-between">
            <v-col>
              <p class="text-h6">Balanço Semanal</p>
            </v-col>
            <v-col cols="4">
              <v-select @update:modelValue="changetDatesweek" variant="underlined" label="Dia do inicio"
                :items="dataSelectDatesweekInitial" v-model="infoDatesweek.startOfWeek"></v-select>
            </v-col>
            <v-col cols="4">
              <v-text-field :persistent-placeholder="true" prepend-inner-icon="$calendar" variant="underlined"
                v-model="inputDateWeek" label="Intervalo" readonly>
              </v-text-field>
            </v-col>
          </v-row>
        </BalanceCard>
      </v-col>
    </v-row>

    <!-- <v-col>
      <v-card class="mx-auto w-100">
        <v-card-title>Despesas Futuras</v-card-title>
        <SimpleTable :headers="headers" :items="expenceFuture">
          <template v-slot:actions="{ item }">
              <v-btn variant="flat" icon="mdi-chevron-down-circle-outline" v-tooltip="'Mais detalhes'" size="small"
                @click=""></v-btn>
          </template>
          <template v-slot:footer>
            <v-row class="pa-2" align="center" justify="space-between">
              <v-col>
                <p class="text-subtitle-1 text-center font-weight-bold">Total: {{ numberFormat.formatCurrencyBr(totalExpenceFuture) }} </p>
              </v-col>
            </v-row>
          </template>
        </SimpleTable>
      </v-card>
    </v-col> -->

  </v-row>
</template>

<script lang="ts" setup>
import BalanceCard from "./balance-card.vue";
import SimpleTable from "~/components/simple-table.vue";
import { Decimal } from 'decimal.js';
import { startOfMonth, eachDayOfInterval, format, startOfWeek, addDays, addMonths, subDays } from 'date-fns';

const numberFormat = useNumberFormatter()
const totalExpenceFuture = ref(0)
const fetchAuth = useFetchAuth()


const headers = [
  { label: "Data", key: "dueDate", type: "date" },
  { label: "Valor", key: "amount", type: "currency" },
  { label: "Categoria", key: "category" },
  { label: "Ações", key: "actions" }
]




const now = new Date();

const fnDatesweek = (days: number = 1) => {
  const startOfInterval = days ? addDays(startOfWeek(now), days) : startOfWeek(now);

  const endOfInterval = addDays(startOfInterval, 6);

  const datesweek = eachDayOfInterval({
    start: startOfInterval,
    end: endOfInterval,
  })

  return {
    startOfInterval,
    endOfInterval,
    datesweek
  }
}

const fndatesInMonth = (day: number = 1) => {
  const startEl = startOfMonth(now)
  day = day - 1
  const startOfMonthDate = day ? addDays(startEl, day) : startEl
  const endOfMonthDate = subDays(addMonths(startOfMonthDate, 1), 1)

  const datesInMonth = eachDayOfInterval({
    start: startOfMonthDate,
    end: endOfMonthDate,
  });

  return {
    datesInMonth,
    startOfMonthDate,
    endOfMonthDate
  }
}

const dataSelectDatesInMonthInitial = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15']
const dataSelectDatesweekInitial = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sabado']

const { datesInMonth, startOfMonthDate } = fndatesInMonth()
const infoDatesInMonth = ref({
  datesInMonth,
  startOfMonthDate: startOfMonthDate.getDate().toString().padStart(2, '0'),
  reportItem: null
})

const changeDatesInMonth = (value: any) => {
  const { datesInMonth, startOfMonthDate } = fndatesInMonth(Number(value))
  infoDatesInMonth.value = {
    ...infoDatesInMonth.value,
    datesInMonth,
    startOfMonthDate: startOfMonthDate.getDate().toString().padStart(2, '0'),
  }
  findData(infoDatesInMonth.value.datesInMonth, infoDatesInMonth)

  return value
}

const { startOfInterval, datesweek } = fnDatesweek()
const infoDatesweek = ref({
  datesweek,
  startOfWeek: dataSelectDatesweekInitial[startOfInterval.getDay()],
  reportItem: null
})

const changetDatesweek = (value: any) => {
  const _startOfWeek = dataSelectDatesweekInitial.findIndex(el => el == value)
  const { datesweek } = fnDatesweek(_startOfWeek || 1)
  infoDatesweek.value = {
    ...infoDatesweek.value,
    datesweek,
    startOfWeek: dataSelectDatesweekInitial[_startOfWeek]
  }
  findData(infoDatesweek.value.datesweek, infoDatesweek)

  return value
}

const refrashData = ref({
  active: true,
  countDown: 15
})
const refrash = () => {
  refrashData.value = {
    active: false,
    countDown: 15
  }

  const interval = setInterval(() => {
    refrashData.value.countDown -= 1;

    if (refrashData.value.countDown <= 0) {
      clearInterval(interval);
      refrashData.value.active = true;
    }
  }, 1000);
}


const formattedDate = (date: any) => {
  const result = format(date, "yyyy-MM-dd")
  return result + "T00:00:00.000Z"
}


const findData = (rengeDate: any, recept: any) => {
  const params = {
    startDate: formattedDate(rengeDate[0]),
    endDate: formattedDate(rengeDate[rengeDate.length - 1]),
  }

  fetchAuth.get("/balance/total", {
    params,
  }).then((element: any) => {
    const el: {
      inputsByPaymentType: { type: string, total: number }[],
      outputsByCategory: { type: string, total: number }[]
    } = element

    if (el.inputsByPaymentType.length == 0) {
      recept.value.reportItem = null
      return
    }
    const recive = el.inputsByPaymentType.reduce((a, c) => a.plus(c.total), new Decimal(0))

    const spend = el.outputsByCategory.reduce((a, c) => a.plus(c.total), new Decimal(0))
    const item = {
      reportDaysQuantity: rengeDate.length,
      title: "",
      recive: recive.toString(),
      spend: spend.toString(),
      balance: recive.minus(spend).toString(),
      orderCanceled: element.orderCanceled,
      orderQuantity: element.orderQuantity,
      outputsByCategory: el.outputsByCategory,
      inputsByPaymentType: el.inputsByPaymentType,
    };

    recept.value.reportItem = item
  });
}

const dateIntervalFormat = (date: Date[]) => {
  const start = format(date[0], "dd/MM/yyyy")
  const end = format(date[date.length - 1], "dd/MM/yyyy")
  return `${start} - ${end}`
}

const inputDateMonth = computed(() => {
  return dateIntervalFormat(infoDatesInMonth.value.datesInMonth)
})

const inputDateWeek = computed(() => {
  return dateIntervalFormat(infoDatesweek.value.datesweek)
})


const expenceFuture = ref<any[]>([])

const findExpenseFomIntervalDate = () => {
  // fetchAuth.get<any[]>("/expense/interval-date", {
  //   params: {
  //     startDate: formattedDate(new Date()),
  //     endDate: formattedDate(infoDatesInMonth.value.datesInMonth[infoDatesInMonth.value.datesInMonth.length - 1]),
  //   }
  // }).then((element) => {
  //   expenceFuture.value = element as any[]
  //   totalExpenceFuture.value = expenceFuture.value.reduce((a, c) => a.plus(c.amount), new Decimal(0))
  // });
}

onMounted(() => {
  findData(datesInMonth, infoDatesInMonth)
  findData(datesweek, infoDatesweek)
  findExpenseFomIntervalDate()
});

</script>
