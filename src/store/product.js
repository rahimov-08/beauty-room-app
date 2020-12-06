import firebase from 'firebase/app'

import 'firebase/auth'

export default{
    actions:{
        async fetchProducts(){
           const products = (await firebase.database().ref('/products').once('value')).val() || {}
           
           return Object.keys(products).map(key=> ({
               ...products[key],
               uid:key
           }))
        },
        async updateProduct(_,{uid,name,balance,price,composition}){
            await firebase.database().ref('/products/'+uid).update({name,balance,price,composition})
        },
        async fetchProductsNames(){
            const products = (await firebase.database().ref('/products').once('value')).val() || {}
            
            return Object.keys(products).map(key=> (
                products[key].name
            ))
         },
         async addProduct(_,{name,balance,price,composition}){
             var newProductKey = (await firebase.database().ref().child('products').push()).key
             await firebase.database().ref('/products/'+newProductKey+'/').set({
                 name,
                 balance,
                 price,
                 composition
             })
         },
         async deleteProduct(_,uid){
            console.log(uid);
            await firebase.database().ref('/products/'+uid).remove()
        }
    },

}