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
                console.log(uid);    
                const info = (await firebase.database().ref('/users/'+uid).once('value')).val()
                console.log(info);
                commit('setInfo', info)
            } catch(e){
                console.log(e);
            }
        }
    },
    getters:{
        info: s=> s.info
    }
}