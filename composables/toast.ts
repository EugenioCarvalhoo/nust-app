type ToastInfoType = {
  show: boolean;
  timeout?: number;
  color: string;
  message: string;
};



export const useToast = () => {
  const toastInfo = useState<ToastInfoType>('toastInfo', () => ({
    show: false,
    timeout: undefined,
    color: "primary",
    message: "",
  }));

  const sucess = (message: string) => {
    toastInfo.value = {
      show: true,
      color: "success",
      message: message,
    };
  };

  const error = (message: string) => {
    toastInfo.value = {
      show: true,
      color: "error",
      message: message,
    };
  }

  const alert = (message: string) => {
    toastInfo.value = {
      show: true,
      color: "alert",
      message: message,
    }
  }

  return {
    toastInfo: toastInfo,
    sucess,
    error,
    alert
  };
};


export const useToast2 = () => {
 return useState('toastInfo', () => false);

}