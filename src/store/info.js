import firebase from 'firebase/app'

export default{
    state:{
        info: {}
    },
    mutations:{
        setInfo(state, info){
            state.info = info
        },
        clearInfo(state){
            state.info = {}
        }
    },
    actions:{
        async fetchInfo({dispatch,commit}){
            try{
                const uid = await dispatch('getUid') 
                const info = (await firebase.database().ref('/users/'+uid).once('value')).val()
                commit('setInfo', info)
                return info.position
            } catch(e){
                undefined
            }
        }
    },
    getters:{
        info: s=> s.info
    }
}