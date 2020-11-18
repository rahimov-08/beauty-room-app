import firebase from 'firebase/app'

export default{
    actions:{
        async login({commit},{email,password}){
            try{
                await firebase.auth().signInWithEmailAndPassword(email,password)
            }catch(e){
                commit('setError',e)
                throw e
            }
        },
        async logout({commit}){
            await firebase.auth().signOut()
            commit('clearInfo')
        },
        async register({dispatch,commit},{address,email,name,password,phone,position,working_hours}){

            try{
                await firebase.auth().createUserWithEmailAndPassword(email,password)
                const uid = await dispatch('getUid')
                await firebase.database().ref('/users/'+uid+'/').set({
                    name,
                    position,
                    phone,
                    email,
                    address,
                    working_hours
                })
            }catch(e){
                commit('setError',e)
                throw e
            }
        },
        getUid(){
            const user = firebase.auth().currentUser
            return user? user.uid : null
        }
    }
}