import firebase from 'firebase/app'

import 'firebase/auth'

export default{
    actions:{
        async fetchCustomers(){
           const customers = (await firebase.database().ref('/customers').once('value')).val() || {}

           
           return Object.keys(customers).map(key=> ({
               ...customers[key],
               uid:key
           }))
        },
        async fetchCustomersNames(){
            const customers = (await firebase.database().ref('/customers').once('value')).val() || {}
            
            return Object.keys(customers).map(key=> (
                customers[key].name
            ))
         },
        async updateCustomer(_,{uid,name,address,phone}){
            await firebase.database().ref('/customers/'+uid).update({name,phone,address})
        },
        async addCustomer({commit},{name,address,phone}){
            var newSupplierKey = (await firebase.database().ref().child('customers').push()).key

            try{
                await firebase.database().ref('/customers/'+newSupplierKey+'/').set({
                    name,
                    phone,
                    address,
                })
                
            }catch(e){
                commit('setError',e)
                throw e
            }
        },
        async deleteCustomer(_,uid){
            console.log(uid);
            await firebase.database().ref('/customers/'+uid).remove()
        }

    },

}