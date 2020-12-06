import firebase from 'firebase/app'

import 'firebase/auth'

export default{
    actions:{
        async fetchRaws(){
           const raws = (await firebase.database().ref('/raws').once('value')).val() || {}
           
           return Object.keys(raws).map(key=> ({
               ...raws[key],
               uid:key
           }))
        },
        async fetchRawsNames(){
            const raws = (await firebase.database().ref('/raws').once('value')).val() || {}
            
            return Object.keys(raws).map(key=> (
                raws[key].name
            ))
         },
         async updateRaw(_,raw){
             console.log(raw);
             var name = raw.name
             var supplier_id = raw.supplier_id
             var supplier_name = raw.supplier_name
             var balance = raw.balance
             var price = raw.price
            await firebase.database().ref('/raws/'+raw.uid).update({
                name,
                supplier_name,
                supplier_id,
                balance,
                price
            })
         }
    },

}