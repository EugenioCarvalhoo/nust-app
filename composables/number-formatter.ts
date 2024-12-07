const formatCurrencyBr = (val: any) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
};

export function useNumberFormatter() {
    return {
        formatCurrencyBr
    };
  }