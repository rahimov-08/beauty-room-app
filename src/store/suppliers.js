import firebase from 'firebase/app'

import 'firebase/auth'

export default{
    actions:{
        async fetchSuppliers(){
           const suppliers = (await firebase.database().ref('/suppliers').once('value')).val() || {}

           
           return Object.keys(suppliers).map(key=> ({
               ...suppliers[key],
               uid:key
           }))
        },
        async updateSupplier(_,{uid,name,address,phone,raw_type}){
            await firebase.database().ref('/suppliers/'+uid).update({name,phone,address,raw_type})
        },
        async addSupplier({commit},{name,address,phone,raw_type,price}){
            var newSupplierKey = (await firebase.database().ref().child('suppliers').push()).key
            var newRawKey = (await firebase.database().ref().child('raws').push()).key

            try{
                await firebase.database().ref('/suppliers/'+newSupplierKey+'/').set({
                    name,
                    phone,
                    address,
                    raw_type,
                    price
                })
                var raw ={
                    name: raw_type,
                    supplier_id: newSupplierKey,
                    supplier_name:name,
                    balance: 0,
                    price
                }
                await firebase.database().ref('/raws/'+newRawKey+'/').set(raw
                    
                )
                
            }catch(e){
                commit('setError',e)
                throw e
            }




        },
        async deleteSupplier(_,uid){
            console.log(uid);
            await firebase.database().ref('/suppliers/'+uid).remove()
        }

    },

}