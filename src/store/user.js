import firebase from 'firebase/app'

import 'firebase/auth'

export default{
    actions:{
        async fetchUsers(){
           const users = (await firebase.database().ref('/users').once('value')).val() || {}
           
           return Object.keys(users).map(key=> ({
               ...users[key],
               uid:key
           }))
        },
        async updateUser(_,{uid,name,email,address,working_hours,phone,position}){
            await firebase.database().ref('/users/'+uid).update({name,email,phone,position,address,working_hours})
        },
        async deleteUser(_,uid){
            console.log(uid);
            await firebase.database().ref('/users/'+uid).remove()
        }

    },

}