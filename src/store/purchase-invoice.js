import firebase from 'firebase/app'

import 'firebase/auth'

export default{
    actions:{
        async fetchPurchaseInvoices(){
           const invoices = (await firebase.database().ref('/purchase-invoices').once('value')).val() || {}

           
           return Object.keys(invoices).map(key=> ({
               ...invoices[key],
               uid:key
           }))
        },
        async addPurchaseInvoice(_,{name,quantity,supplier,date,price,total}){
            var newInvoiceKey = (await firebase.database().ref().child('purchase-invoices').push()).key

            try{
                await firebase.database().ref('/purchase-invoices/'+newInvoiceKey+'/').set({
                    name,
                    quantity,
                    date,
                    supplier,
                    price,
                    total,
                })
                
            }catch(e){
                console.log(e);
            }
        },
    },
}