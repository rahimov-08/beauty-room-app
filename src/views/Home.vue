<template>
        <v-row align="center" justify="center">
          <v-col cols="3">
            <v-hover v-slot="{hover}">
              <v-card  :elevation="hover ? 16 : 4" height="300" width="300" class="text-center" to="/users" style="padding-top: 30px" :disabled="false">
              <v-img height="170" contain src="../assets/users-logo.png"/>
              <v-card-title class="font-weight-bold" v-text="'Пользователи'"/>
            </v-card>
            </v-hover>
          </v-col>
          <v-col cols="3">
            <v-hover v-slot="{hover}">
              <v-card  :elevation="hover ? 16 : 4" height="300" width="300" class="text-center" to="/" style="padding-top: 30px" :disabled="false">
                <v-img height="170" contain src="../assets/raw.jpg"/>
              <v-card-title class="font-weight-bold" v-text="'Сырье'"/>
            </v-card>
            </v-hover>
          </v-col>
          <v-col cols="3">
            <v-hover v-slot="{hover}">
              <v-card  :elevation="hover ? 16 : 4" height="300" width="300" class="text-center" to="/" style="padding-top: 30px" :disabled="false">
              <v-img height="170" contain src="../assets/cosmetics.png"/>
              <v-card-title class="font-weight-bold" v-text="'Продукты'"/>
            </v-card>
            </v-hover>
          </v-col>
          <v-col cols="3">
            <v-hover v-slot="{hover}">
              <v-card  :elevation="hover ? 16 : 4" height="300" width="300" class="text-center" to="/" style="padding-top: 30px" :disabled="false">
              <v-img height="170" contain src="../assets/supplier.png"/>
              <v-card-title class="font-weight-bold" v-text="'Поставщики'"/>
           </v-card>
            </v-hover>
          </v-col>
          <v-col cols="3">
            <v-hover v-slot="{hover}">
              <v-card  :elevation="hover ? 16 : 4" height="300" width="300" class="text-center" to="/" style="padding-top: 30px" :disabled="false">
              <v-img height="170" contain src="../assets/customer.svg"/>
              <v-card-title class="font-weight-bold" v-text="'Клиенты'"/>
            </v-card>
            </v-hover>
          </v-col>
         <v-col cols="3">
            <v-hover v-slot="{hover}">
              <v-card  :elevation="hover ? 16 : 4" height="300" width="300" class="text-center" to="/" style="padding-top: 30px" :disabled="false">
            <v-img height="170" contain src="../assets/orders.png"/>
              <v-card-title class="font-weight-bold" v-text="'Заказы'"/>
            </v-card>
            </v-hover>
          </v-col>
          <v-col cols="3">
            <v-hover v-slot="{hover}">
              <v-card  :elevation="hover ? 16 : 4" height="300" width="300" class="text-center" to="/" style="padding-top: 30px" :disabled="false">
              <v-img height="170" contain src="../assets/transport-company.png"/>
              <v-card-title class="font-weight-bold px-3" v-text="'Транспортные компании'"/>
            </v-card>
            </v-hover>
          </v-col>
        </v-row>

</template>

<script>
  export default {
    //
  }
</script>

<style scoped>

</style>