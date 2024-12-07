export const fetchWithAuth = async (url: string, options: any = {}) => {
    const token = sessionStorage.getItem('token');
  
    if (!options.headers) {
      options.headers = {};
    }
  
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }
  
    return useFetch(url, options);
  };