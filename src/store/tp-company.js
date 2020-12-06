import firebase from 'firebase/app'

import 'firebase/auth'

export default{
    actions:{
        async fetchTpCompanies(){
           const companies = (await firebase.database().ref('/tp-companies').once('value')).val() || {}

           
           return Object.keys(companies).map(key=> ({
               ...companies[key],
               uid:key
           }))
        },
        async updateTpCompany(_,{uid,name,address,phone}){
            await firebase.database().ref('/tp-companies/'+uid).update({name,phone,address})
        },
        async addTpCompany({commit},{name,address,phone}){
            var newCompanyKey = (await firebase.database().ref().child('tp-companies').push()).key

            try{
                await firebase.database().ref('/tp-companies/'+newCompanyKey+'/').set({
                    name,
                    phone,
                    address,
                })
                
            }catch(e){
                commit('setError',e)
                throw e
            }

        },
        async deleteTpCompany(_,uid){
            console.log(uid);
            await firebase.database().ref('/tp-companies/'+uid).remove()
        }

    },

}