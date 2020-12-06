import firebase from 'firebase/app'

import 'firebase/auth'

export default{
    actions:{
        async fetchOrders(){
           const orders = (await firebase.database().ref('/orders').once('value')).val() || {}
           if(orders=== null||orders=== undefined){
               return []
           }
           return Object.keys(orders).map(key=> ({
               ...orders[key],
               uid:key
           }))
        },
        async fetchOrder(_,uid){
            const order = (await firebase.database().ref('/orders/'+uid).once('value')).val() || {}
            if(order=== null||order=== undefined){
                return []
            }
            return order
         },
         async fetchOrderProducts(_,uid){
            const order = (await firebase.database().ref('/orders/'+uid).once('value')).val() || {}
            var composition = order.composition
            if(composition=== undefined || composition === null){
                return []
            }
            return Object.keys(composition).map(key=>({
                ...composition[key],
                uid:key,
            }))
         },
        async updateOrder(_,{uid,name,balance,price,composition,tpCompany}){
            await firebase.database().ref('/orders/'+uid).update({name,balance,price,composition,tpCompany})
        },
        async setTpCompany(_,{uid,tpCompany}){
            await firebase.database().ref('/orders/'+uid).update({tpCompany})
        },
        async setStatus(_,{uid,status}){
            await firebase.database().ref('/orders/'+uid).update({status})
        },
        async updateOrderProduct(_,{uid,compositionUid,name,quantity,price,totalPrice}){
            await firebase.database().ref('/orders/'+uid+'/composition/'+compositionUid+'/').update({name,quantity,price,totalPrice})
        },
         async addOrder(_,{customer,date,status,composition,tpCompany}){
             var newOrderKey = (await firebase.database().ref().child('orders').push()).key

             console.log(customer,date,composition,tpCompany);

             await firebase.database().ref('/orders/'+newOrderKey+'/').set({
                 customer,
                 date,
                 status,
                 composition,
                 tpCompany
             })
             return newOrderKey
         },
         async deleteOrder(_,uid){
            await firebase.database().ref('/orders/'+uid).remove()
        },
        async deleteOrderProduct(_,{uid,compositionUid}){
            await firebase.database().ref('/orders/'+uid+'/composition/'+compositionUid).remove()
        },
        async updateOrderStatus(_,{orderUid,status}){
            await firebase.database().ref('/orders/'+orderUid+'/').update({
                status: status
            })
        },
        async addProductToOrder(_,{orderUid,composition}){
            var newCompositionKey = await firebase.database().ref('/orders/'+orderUid+'/composition/').push().key
            await firebase.database().ref('/orders/'+orderUid+'/composition/'+newCompositionKey+'/').set({
                name: composition.name,
                quantity: composition.quantity,
                price: composition.price,
                totalPrice: composition.totalPrice
            })
            return newCompositionKey
        }
    },

}