
const runtimeConfig = useRuntimeConfig()

const getToken = () => {
    const token = useCookie('token').value;

    if (!token) {
        navigateTo('/app')
    }

    return token
}

const handleFetchError = (error: any) => {
    if (error.response?.status === 401) {
        navigateTo('/');
        return
    } 
    
    if (error.response?.status === 403) {
        navigateTo('/');
        return
    }
    throw error;
};

const post = <I, O>(url: string, body: I, options?: any) => {
    return $fetch<O>(`${runtimeConfig.public.baseUrl}${url}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getToken()
        },
        ...options,
        body: body as any
    }).catch(handleFetchError)
}

const get = <T>(url: string, options?: any) => {
    return $fetch<T>(`${runtimeConfig.public.baseUrl}${url}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getToken()
        },
        ...options,
    }).catch(handleFetchError)
}

const put = <I, O>(url: string, body: I, options?: any) => {
    return $fetch<O>(`${runtimeConfig.public.baseUrl}${url}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getToken()
        },
        ...options,
        body: body as any
    }).catch(handleFetchError)
}

const _delete = <T>(url: string, options?: any) => {
    return $fetch<T>(`${runtimeConfig.public.baseUrl}${url}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getToken()
        },
        ...options,
    }).catch(handleFetchError)
}

export const useFetchAuth = () => {
    return { post, get, put, delete: _delete };

}