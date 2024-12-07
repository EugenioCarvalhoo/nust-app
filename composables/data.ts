

import { defineStore } from 'pinia';

type TypeUseData = {
    role: string,
    bussinessName: string,
    firstName: string
    lastName: string
    login: string
    email: string
}

export const useDataStore = defineStore('data', {
    state: () => ({
        data: {
            appStart: false,
            role: '', 
            bussinessName: '',
            firstName: '',
            lastName: '',
            login: '',
            email: ''
        },
    }),
    actions: {
        setData(newData: TypeUseData) {
            this.data = {
                ...newData, appStart: true};
        },
        resetData() {
            this.data = {
                appStart: false,
                role: '', 
                bussinessName: '',
                firstName: '',
                lastName: '',
                login: '',
                email: '' 
            };
        },
    },
    getters: {
       isAdmins: (state) => {
            return  state.data.role.toUpperCase() === 'ADMIN' || 
            state.data.role.toUpperCase() === 'ASSISTANT_ADMIN' ;
        },
        isAdiministrator: (state) => {
            return  state.data.role.toUpperCase() === 'ADMIN'
        },

        isSubAdmin: (state) => {
            return state.data.role.toUpperCase() === 'ASSISTANT_ADMIN' ;
        },

        getFullName: (state) => {
            if (state.data.lastName) {
                return state.data.firstName + ' ' + state.data.lastName
            }

            return state.data.firstName
        }
    },
});