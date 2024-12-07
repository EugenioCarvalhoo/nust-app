
 const formatDate = (val: any) => {
  const date = new Date(val);
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
};

export function useDateFormatter() {

    return {
      formatDate
    };
  }