<template>
  <v-row class="w-100 pb-10" align="center" justify="center">
    <div class="w-100 px-2" style="max-width: 1124px;">
      <v-tabs class="w-100" color="basil" grow>
        <v-tab @click="changeBalance('weekBalance')" value="2">Balanço Semanal</v-tab>
        <v-tab @click="changeBalance('monthBalance')" value="1">Balanço Mensal</v-tab>
        <v-tab @click="changeBalance('customBalance')" value="3">Intervalo Customizado</v-tab>
      </v-tabs>

      <div>
        <v-tabs-window>
          <!-- <v-tabs-window-item value="1"> -->

            <div class="mt-4 d-flex align-center" style="gap: 20px;">
              <v-card v-if="tableAction == 'monthBalance'" class="bg-white  px-3 py-2" style="width: 100px">
                <v-select  @update:modelValue="changeDatesInMonth" v-model="infoDatesInMonth.startOfMonthDate"
                  :items="dataSelectDatesInMonthInitial" variant="underlined" label="Data do início"></v-select>
              </v-card>

              <v-card v-if="tableAction == 'weekBalance'" class="bg-white px-3 py-2" style="width: 180px">
                <v-select  @update:modelValue="changetDatesweek" v-model="infoDatesweek.startOfWeek"
                  :items="dataSelectDatesweekInitial" variant="underlined" label="Dia do início"></v-select>
              </v-card>

              <v-card  class="bg-white px-3 py-2" style="width: 250px">
                <v-text-field v-if="tableAction != 'customBalance'" :persistent-placeholder="true" prepend-inner-icon="$calendar" variant="underlined"
                  v-model="textIntervalDate" label="Intervalo" readonly>
                </v-text-field>
                <v-date-input multiple="range" v-else prepend-icon="" prepend-inner-icon="$calendar" placeholder=""
                  variant="underlined" v-model="inputIntervalDate" :rules="[(v) => !!v || 'Campo obrigatorio']">
                </v-date-input>
              </v-card>
            </div>


            <v-row class="mt-2">
              <v-col  v-for="resumeItem in resume" cols="4">
                <v-card class="pa-3">
                  <div class="d-flex">
                    <v-icon  color="blue-grey-darken-2" size="30" >mdi-arrow-top-right-thick </v-icon>
                    <p class="font-weight-bold">{{ resumeItem.title }}:</p>
                  </div>
                  <div class="d-flex">
                    <p :class="resumeItem.labelType + ' pl-3 font-weight-bold text-subtitle-1'">
                      {{ resumeItem.value }}
                    </p>
                  </div>
                  
                </v-card>

              </v-col>
            </v-row>

            <v-row>
              <v-col v-for="item in especificationCard">
                <v-card class="mt-2 pa-2">
                  <v-card-title class="text-subtitle-1 font-weight-bold">
                    <v-icon color="blue-grey-darken-2" size="24">mdi-information</v-icon> {{ item.title }}:</v-card-title>
                  <v-row class="pl-2 my-1">
                    <v-timeline dot-color="blue-grey-darken-2" fill-dot side="end" truncate-line="both">
                      <v-timeline-item v-for="recive in item.items" size="10">
                        <div class="">
                          <p class=" text-subtitle-1">{{ recive.type }}: </p>
                          <span :class="item.labelType +' font-weight-bold text-subtitle-1'">{{
                            numberFormat.formatCurrencyBr(recive.total) }}</span>
                          <span class="pl-1 text-subtitle-2">{{
                            recive.percent }}</span>
                            
                        </div>
                      </v-timeline-item>
                    </v-timeline>
                  </v-row>
                </v-card>
              </v-col>



              <v-col cols="12" v-if="orderes.length > 0" > 
                <v-card class="mt-2 pa-2" elevation="5">
                  <v-card-title class="text-subtitle-1 font-weight-bold">
                    <v-icon color="blue-grey-darken-2" size="24">mdi-check-circle-outline</v-icon> Pedidos:</v-card-title>
                  <v-card-text class="mt-2">
                    <v-row>
                      <v-col cols="4" v-for="order in orderes" justify="space-between" class="pl-4 py-1">
                        <span class="text-subtitle-1">{{ order.label }}: </span>
                        <span class="text-yellow-darken-1 font-weight-bold">{{ order.value }}</span>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>

            </v-row>
        </v-tabs-window>

      <v-tabs-window v-if="resume.length == 0" >
        <v-card  class="pa-3 mt-10">
          <v-card-title class="text-center">
            <v-icon icon="mdi-information"></v-icon> Sem informação para exibir
          </v-card-title>
        </v-card>
      </v-tabs-window>

      </div>
    </div>
  </v-row>
</template>

<script lang="ts" setup>
import { Decimal } from 'decimal.js';
import { startOfMonth, eachDayOfInterval, format, startOfWeek, addDays, addMonths, subDays } from 'date-fns';


const orderes = ref<{ label: string, value: number | string }[]>([])


type EspecificationCardType = {
  title: string,
  labelType: string,
  items: {
    type: string,
    total: number
    percent: number | string,
  }[]
}

const especificationCard = ref<EspecificationCardType[]>([])

type ResumeType = {
  title: string,
  value: number | string,
  labelType: string
}

const resume = ref<ResumeType[]>([])

const numberFormat = useNumberFormatter()
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

const changeDatesInMonth = (value?: any ) => {
  if (!value) {
    value = infoDatesInMonth.value.startOfMonthDate
  }
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

const changetDatesweek = (value?: any) => {
  if (!value) {
    value = infoDatesweek.value.startOfWeek
  }
  const _startOfWeek = dataSelectDatesweekInitial.findIndex(el => el == value)
  const { datesweek } = fnDatesweek(_startOfWeek ?? 1)
  infoDatesweek.value = {
    ...infoDatesweek.value,
    datesweek,
    startOfWeek: dataSelectDatesweekInitial[_startOfWeek]
  }
  findData(infoDatesweek.value.datesweek, infoDatesweek)

  return value
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
      resume.value = []
      especificationCard.value = []
      orderes.value = []
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

    resume.value = [
      {
        title: 'Receita',
        value: numberFormat.formatCurrencyBr(item.recive),
        labelType: "text-success"
      },
      {
        title: 'Despesa',
        value: numberFormat.formatCurrencyBr(item.spend),
        labelType: "text-error"
      },
      {
        title: 'Saldo',
        value: numberFormat.formatCurrencyBr(item.balance),
        labelType: "text-info"
      }
    ]

    especificationCard.value = [
      {
        title: 'Detalhes da receita',
        items: item.inputsByPaymentType.map((el) => ({ ...el, percent: calcPercent(item.recive, el.total) })),
        labelType: "text-success"
      },
      {
        title: 'Detalhes da despesa',
        items: item.outputsByCategory.map((el) => ({ ...el, percent: calcPercent(item.spend, el.total) })),
        labelType: "text-error",

      }
    ]


    orderes.value = [
      {
        label: 'Concluído',
        value: item.orderQuantity
      },
      {
        label: 'Ticket médio',
        value: `R$ ${calcDiv(item.recive, item.orderQuantity)}`
      },
      {
        label: 'Cancelados',
        value: item.orderCanceled || 0
      },
      {
        label: 'Cancelados por dia(Média)',
        value: calcDiv(item.orderCanceled, item.reportDaysQuantity) || 0
      },
      {
        label: 'Concluído/Cancelados(%)',
        value: calcPercent(item.orderQuantity, item.orderCanceled) || 0
      },
    ]

    recept.value.reportItem = item
  });
}

const inputIntervalDate = ref()

const compareDatesEqual = (date1: Date, date2: Date) => {
  return date1.getTime() == date2.getTime()
}

watch(inputIntervalDate, () => {
  if (compareDatesEqual(inputIntervalDate.value[0], inputIntervalDate.value.datesInMonth[0])) return
  if (compareDatesEqual(inputIntervalDate.value[0], infoDatesweek.value.datesweek[0])) return
  findData(inputIntervalDate.value, infoDatesweek)
})


const monthBalance = () => {
  inputIntervalDate.value = infoDatesInMonth.value.datesInMonth
  changeDatesInMonth()
}

const weekBalance = () => {
  inputIntervalDate.value = infoDatesweek.value.datesweek
  changetDatesweek()
}

const customBalance = () => {}

const tableAction = ref<'monthBalance' | 'weekBalance' | 'customBalance'>('weekBalance')

const changeBalance =  (action: 'monthBalance' | 'weekBalance' | 'customBalance') => {
  
  tableAction.value = action
  const dispach = {
    monthBalance,
    weekBalance,
    customBalance
  }
  dispach[action]()
}

const calcPercent = (totalRef: string | number, value: string | number) => {
  if (!totalRef || !value) return ''
  return new Decimal(value).div(new Decimal(totalRef)).times(100).toFixed(2) + '%';
}

const calcDiv = (total: number | string, value: number | string) => {
  if (!total || !value) return ''

  return new Decimal(total).div(new Decimal(value)).toFixed(2)
}

const dateIntervalFormat = (date: Date[]) => {
  const start = format(date[0], "dd/MM/yyyy")
  const end = format(date[date.length - 1], "dd/MM/yyyy")
  return `${start} - ${end}`
}

const textIntervalDate = computed(() => {
  if (tableAction.value == 'monthBalance') return dateIntervalFormat(infoDatesInMonth.value.datesInMonth)
  return dateIntervalFormat(infoDatesweek.value.datesweek)
})

type RefCodesType = {
     id?: number
     type: string
     code: string
     name: string
     description: string 
}


const cahceChangeDate = ref<{
  item: RefCodesType,
  data: { initialDate: string, initialDay: string }
}>()


onMounted(() => {

  fetchAuth.get<RefCodesType[]>("/refcodes/type/balance/code/changeDate").then(el => {
    if (!el) return
      const data: {  initialDate: string, initialDay: string } = JSON.parse(el[0].name)
      cahceChangeDate.value = {
        item: el[0],
        data
      }
      if (tableAction.value == 'weekBalance') {
        changetDatesweek(data.initialDay)
        infoDatesInMonth.value.startOfMonthDate = data.initialDate
      }

      if (tableAction.value == 'monthBalance') {
        changeDatesInMonth(data.initialDate)
        infoDatesweek.value.startOfWeek = data.initialDay
      }
  })
});

onUnmounted(() => {
  if (!cahceChangeDate.value) return
  const { data, item }  = cahceChangeDate.value
  if (infoDatesInMonth.value.startOfMonthDate == data.initialDate && 
  infoDatesweek.value.startOfWeek == data.initialDay
  ) return
  fetchAuth.put(`/refcodes/${item.id}`, {
    ...item,
    whitTenantId: true,
    name: JSON.stringify({
      initialDate: infoDatesInMonth.value.startOfMonthDate,
      initialDay: infoDatesweek.value.startOfWeek
    })
  }).then(() => {})
})

</script>
