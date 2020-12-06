import firebase from 'firebase/app'

import 'firebase/auth'

export default{
    actions:{
        async fetchBills(){
           const bills = (await firebase.database().ref('/bills').once('value')).val() || {}
           
           return Object.keys(bills).map(key=> ({
               ...bills[key],
               uid:key
           }))
        },
         async addBill(_,{type,date,composition,total}){
             var newBillKey = (await firebase.database().ref().child('bills').push()).key
             await firebase.database().ref('/bills/'+newBillKey+'/').set({
                 type,
                 date,
                 composition,
                 total
             })
         },
    },

}