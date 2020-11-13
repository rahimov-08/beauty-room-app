<template>
 <v-app>
        <v-dialog v-model="dialog" persistent max-width="600px" min-width="360px">
            <v-card class="px-4" shaped >
              <v-card-title>Beauty Room ZL</v-card-title>
              <v-card-subtitle>Введите данные для входа</v-card-subtitle>
                <v-card-text>
                    <v-form ref="loginForm" v-model="valid" lazy-validation>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field v-model="loginUsername" :rules="[rules.required, rules.min]" label="Имя пользователя" required></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field v-model="loginPassword" :append-icon="show1?'eye':'eye-off'" :rules="[rules.required, rules.min]" :type="show1 ? 'text' : 'password'" name="input-10-1" label="Пароль" @click:append="show1 = !show1"></v-text-field>
                             </v-col>
                            <v-col class="d-flex" cols="12" sm="6" xsm="12">
                            </v-col>
                             <v-spacer></v-spacer>
                             <v-col class="d-flex" cols="12" sm="3" xsm="12" align-end>
                                 <v-btn x-large block :disabled="!valid" color="success" @click="validate"> Войти </v-btn>
                              </v-col>
                         </v-row>
                     </v-form>
                 </v-card-text>
            </v-card>
        </v-dialog>
    </v-app>
</template>
<script>

export default {

  methods: {
    validate() {
      if (this.$refs.loginForm.validate()) {
        // submit form to server/API here...
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    }
  },
  data: () => ({
    dialog: true,
    valid: true,
    
    loginPassword: "",
    loginUsername: "",

    show1: false,
    rules: {
      required: value => !!value || "Объязательное поле"
    }
  })
      
}
</script>