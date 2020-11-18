<template>
    <div>
        <v-app-bar app color="red" dark>
          <router-link to="/" style="margin-left: 10px" ><v-app-bar-nav-icon ><v-img contain width="60px" height="60px" src="../assets/logo.png"/></v-app-bar-nav-icon></router-link>
      <v-spacer/>
      <v-toolbar-title>{{name}}</v-toolbar-title>
      <v-btn icon @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
    <router-view/>
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
    </v-container>
    </v-main>
    </div>
</template>

<script>
import messages from '@/utils/messages'

export default {
 methods:{
   async logout(){
      await this.$store.dispatch('logout')
      this.$router.push('/login')
   }
 },
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
        },
        name(){
          return this.$store.getters.info.name
        }
    },
    watch:{
        error(fbError){
            this.snackbar = true
            console.log(fbError);
            this.text = (messages[fbError.code] || 'Что-то пошло не так(')
        }
    },
    async mounted(){
      if (!Object.keys(this.$store.getters.info).length) {
        await this.$store.dispatch('fetchInfo')
      }
    }
}
</script>