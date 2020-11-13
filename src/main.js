import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import firebase from 'firebase/app'

import "firebase/database"

Vue.config.productionTip = false



firebase.initializeApp({
  apiKey: "AIzaSyDtGxn2uRncrNWHIE7xXNzMjiBGDE4dp6Q",
  authDomain: "beauty-room-658b0.firebaseapp.com",
  databaseURL: "https://beauty-room-658b0.firebaseio.com",
  projectId: "beauty-room-658b0",
  storageBucket: "beauty-room-658b0.appspot.com",
  messagingSenderId: "582249516788",
  appId: "1:582249516788:web:a53f21607f9d651b0598a1"
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
