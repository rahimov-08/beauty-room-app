import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import info from './info'
import user from './user'
import suppliers from './suppliers'
import raw from './raw'
import product from './product'
import tpCompany from './tp-company'
import customers from './customers'
import orders from './orders'
import purchaseInvoice from './purchase-invoice'
import bills from './bills'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    error: null
  },
  mutations: {
    setError(state,error){
      state.error = error
    },
    clearError(state){
      state.error = null
    }
  },
  getters:{
    error: s=> s.error
  },
  modules: {
    auth,info,user,suppliers,raw,product,tpCompany,customers,orders,purchaseInvoice,bills
  }
})
