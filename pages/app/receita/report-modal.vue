<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card class="pt-4">
      <v-form v-model="form" @submit.prevent="submit">
      <v-card-title>
        <span class="text-h5">Criar</span>
      </v-card-title>

      <v-card-text>
        <v-container>
            <v-row>
              <v-textarea @input="changeTextArea" v-model="formValue.report" auto-grow label="Relatório" variant="underlined"></v-textarea>
            </v-row>
            <p class="text-error" v-for="err in labelError"> {{ err }} </p>
            <v-row class="mt-2">
                <v-text-field  type="number" :rules="[orderCanceledRules]" variant="underlined" v-model="formValue.orderCanceled" label="Pedidos cancelados"></v-text-field>
            </v-row>
          
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn variant="outlined" class="mt-2 text-red-darken-3" @click="close">
          CANCELAR
        </v-btn>

        <v-btn type="submit" variant="tonal" :disabled="labelError.length > 0 || !form"
          class="mt-2 bg-red-darken-3">
          SALVAR
        </v-btn>
      </v-card-actions>
    </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import Decimal from "decimal.js";
import { ref, watch } from "vue";
import { useToast } from "~/composables/toast";

const fetchAuth = useFetchAuth()

const toast = useToast();

const dialog = ref(false);
const emit = defineEmits(["save"]);
const form = ref(false);

const orderCanceledRules = (value: any) => {
  if (!value) return true
  value = Number(value)
  // if (isNaN(value)) return "Campo obrigatório!"  
  if (value <= 0) return "Quantidade inválida!"
  return true
};


const labelError = ref<string[]>([])

const formValue = ref({
  report: '',
  orderCanceled: ''
});
const reportData = ref<any>()


const  changeTextArea = (event: InputEvent ) => {
  const newVal = formValue.value.report

  const result = getReportModel(newVal || '')

  if (result.errors && result.errors.length > 0) {
    labelError.value = result.errors
    reportData.value = null
    return
  }

  labelError.value = []
  reportData.value = result.reportModel
}

watch(dialog, (newValue) => {
  if (!newValue) {
    labelError.value = []
    reportData.value = undefined
    formValue.value = {
      report: '',
      orderCanceled: ''
    }
  }
})

const getReportModel = (reportText: string) => {

  const errors: string[] = []

  if (!reportText) return { errors: ["Campo obrigatório!"] }
  function removerAcentos(texto: string) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  let report = removerAcentos(
    reportText.replace(/\n\n/g, "|").replace(/\n/g, "|").replaceAll(" ", "")
  );

  function validCurrency(valor: string) {
    const regex = /^\d{1,3}(\.\d{3})*,\d{2}$/;
    return regex.test(valor);
  }

  function parseCurrency(value: string) {
    return value.replace(".", "").replace(",", ".");
  }

  const reportModel: { receives: any[]; dateReport: string; expense?: any } = {
    receives: [],
    dateReport: "",
  };


  let totalReceive = '0'

  const receiveRegex = /\(\s*(\d+)\s*\)\s*(\w+):([\d.,]+)/;

  const receiveItemRegex = /(\w+):([\d.,]+)/;


  report.split("|").forEach((item: string) => {

    if (item.includes("Relatorio")) {
      const date = new Date();
      const monthDay  = item.split(":")[1].split("/").reverse().join("-");
      reportModel.dateReport = date.getFullYear() + '-' + monthDay  +  'T00:00:00.000Z';
      if (!reportModel.dateReport || !monthDay) {
        errors.push("Data do Relatório inválida");
      }
    }

    const matchReceive = receiveRegex.exec(item);
    if (matchReceive) {
      const amount = matchReceive[3]
      const receive = {
        orderQuantity: matchReceive[1],
        category: matchReceive[2],
        amount: parseCurrency(amount),
        entryDate: reportModel.dateReport,
        receiveItems: [],
      };

      if (!validCurrency(amount)) {
        errors.push(`Valo de ${amount} inválida!`);
      }

      if (!receive.orderQuantity) {
        errors.push("Quantidade de pedidos inválida");
      }

      reportModel.receives.push(receive);
      return;
    }

    const matchReceiveItem = receiveItemRegex.exec(item);
    if (matchReceiveItem) {
      const name = matchReceiveItem[1];
      const amount = matchReceiveItem[2]

      if (name.toUpperCase() == "SAIDA") {
        const expenseItem = {
          description: "Relatório",
          paymentType: "DINHEIRO",
          amount: parseCurrency(amount),
          status: "PAGO",
          dueDate: reportModel.dateReport,
          category: "NOTAS-VALES",
        };

        if (!validCurrency(amount)) {
          errors.push(`Valor ${amount} inválida!`);
        }
        reportModel.expense = expenseItem;
        return;
      }

      if (name.toUpperCase() == "TOTAL") {

        totalReceive = parseCurrency(amount);
        if (!validCurrency(amount)) {
          errors.push(`Valor ${amount} inválida!`);
        }
        return;

      }

      if (name.toUpperCase() == "BEBIDAS") return;

      const receiveItem = {
        paymentType: name,
        amount: parseCurrency(amount),
      };

      const currentReceive =
        reportModel.receives[reportModel.receives.length - 1];
      if (currentReceive) {
        if (!validCurrency(amount)) {
          errors.push(`Valor ${amount} inválida!`);
        }
        currentReceive.receiveItems.push(receiveItem);
      }
    }
  });

  if (reportModel.receives.length == 0) {
    errors.push("Relatório inválido");
  }


  reportModel.receives.forEach((receive) => {
    const item = (receive.receiveItems as any[]).reduce((a, c) => a.plus(c.amount.replace(".", '').replace(",", ".")) , new Decimal(0))
    if ( !new Decimal(receive.amount.replace(".", '').replace(",", ".")).eq(item) ) {
      errors.push(`Receita inválida ${receive.category}: ${receive.amount} `);
    }
  });

  const  totalReceiveModel = reportModel.receives.reduce((a, c) => a.plus(c.amount.replace(".", '').replace(",", ".")) , new Decimal(0))

  if ( !new Decimal(totalReceive.replace(".", '').replace(",", ".")).eq(totalReceiveModel) ) {
      errors.push(`TOTAL da receita no inválida ${totalReceive} `);
  }  


  return { reportModel, errors }
}

const submit = () => {
  if (!form.value) return

  if (!reportData.value) {
    labelError.value = ["Relatório inválido"]
    return
  }
  

  const body = {
      receives: reportData.value.receives,
      expense: reportData.value.expense,
      orderCanceled: !!formValue.value.orderCanceled ? {
        orderCanceledDate: reportData.value.dateReport,
        quantity: formValue.value.orderCanceled
      } : null
    }

    fetchAuth.post("/report", body)
    .then(() => {
      toast.sucess("Relatório criado com sucesso!");
      dialog.value = false;
      emit("save");
      labelError.value = []
    })
    .catch(() => {
      toast.error("Erro ao criar relatório!");
    });

}

const close = () => {
  dialog.value = false;
};

const create = () => {
  dialog.value = true;
}



defineExpose({
  create,
});
</script>
