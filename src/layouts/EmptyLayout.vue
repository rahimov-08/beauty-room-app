<template>
    <div>
        <v-snackbar
            v-model="snackbar"
            :timeout="timeout"
            >
            {{ text }}

            <template v-slot:action="{ attrs }">
                <v-btn
                color="blue"
                text
                v-bind="attrs"
                @click="snackbar = false"
                >
                Закрыть
                </v-btn>
            </template>
        </v-snackbar>
        <router-view/>
    </div>
</template>

<script>
import messages from '@/utils/messages'

export default {
    data(){
        return{
            snackbar: false,
            text: '',
            timeout: 2500,
        }
    },
    computed:{
        error(){
            return this.$store.getters.error
        }
    },
    watch:{
        error(fbError){
            this.snackbar = true
            console.log(fbError);
            this.text = (messages[fbError.code] || 'Что-то пошло не так(')
        }
    },
    mounted(){
        console.log(Object.keys(this.$store.getters.info).length)
        if(Object.keys(this.$store.getters.info).length){
            this.$router.push('/')
        }
    }
}
</script>