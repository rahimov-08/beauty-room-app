<template>
        <v-row align="center" justify="center">
          <v-col cols="3" v-if="userPosition === 'Менеджер'">
            <v-hover v-slot="{hover}">
              <v-card  :elevation="hover ? 16 : 4" height="300" width="300" class="text-center" to="/users" style="padding-top: 30px" :disabled="false">
              <v-img height="170" contain src="../assets/users-logo.png"/>
              <v-card-title class="font-weight-bold" v-text="'Пользователи'"/>
            </v-card>
            </v-hover>
          </v-col>
          <v-col cols="3" v-if="userPosition === 'Заведующий складом'">
            <v-hover v-slot="{hover}">
              <v-card  :elevation="hover ? 16 : 4" height="300" width="300" class="text-center" to="/raws" style="padding-top: 30px" :disabled="false">
                <v-img height="170" contain src="../assets/raw.jpg"/>
              <v-card-title class="font-weight-bold" v-text="'Сырье'"/>
            </v-card>
            </v-hover>
          </v-col>
          <v-col cols="3" v-if="userPosition === 'Менеджер' || userPosition === 'Консультант'">
            <v-hover v-slot="{hover}">
              <v-card  :elevation="hover ? 16 : 4" height="300" width="300" class="text-center" to="/products" style="padding-top: 30px" :disabled="false">
              <v-img height="170" contain src="../assets/cosmetics.png"/>
              <v-card-title class="font-weight-bold" v-text="'Продукты'"/>
            </v-card>
            </v-hover>
          </v-col>
          <v-col cols="3" v-if="userPosition === 'Менеджер'">
            <v-hover v-slot="{hover}">
              <v-card  :elevation="hover ? 16 : 4" height="300" width="300" class="text-center" to="/suppliers" style="padding-top: 30px"  :disabled="false">
              <v-img height="170" contain src="../assets/supplier.png"/>
              <v-card-title class="font-weight-bold" v-text="'Поставщики'"/>
           </v-card>
            </v-hover>
          </v-col>
          <v-col cols="3" v-if="userPosition === 'Менеджер'">
            <v-hover v-slot="{hover}">
              <v-card  :elevation="hover ? 16 : 4" height="300" width="300" class="text-center" to="/customers" style="padding-top: 30px" :disabled="false">
              <v-img height="170" contain src="../assets/customer.svg"/>
              <v-card-title class="font-weight-bold" v-text="'Клиенты'"/>
            </v-card>
            </v-hover>
          </v-col>
         <v-col cols="3" v-if="userPosition === 'Заведующий складом' || userPosition === 'Консультант'">
            <v-hover v-slot="{hover}">
              <v-card  :elevation="hover ? 16 : 4" height="300" width="300" class="text-center" to="/orders" style="padding-top: 30px" :disabled="false">
            <v-img height="170" contain src="../assets/orders.png"/>
              <v-card-title class="font-weight-bold" v-text="'Заказы'"/>
            </v-card>
            </v-hover>
          </v-col>
          <v-col cols="3" v-if="userPosition === 'Менеджер' || userPosition === 'Консультант'">
            <v-hover v-slot="{hover}">
              <v-card  :elevation="hover ? 16 : 4" height="300" width="300" class="text-center" to="/tp-companies" style="padding-top: 30px" :disabled="false">
              <v-img height="170" contain src="../assets/transport-company.png"/>
              <v-card-title class="font-weight-bold px-3" v-text="'Транспортные компании'"/>
            </v-card>
            </v-hover>
          </v-col>
          <v-col cols="3" v-if="userPosition === 'Заведующий складом'">
            <v-hover v-slot="{hover}">
              <v-card  :elevation="hover ? 16 : 4" height="300" width="300" class="text-center" to="/purchase-invoice" style="padding-top: 30px" :disabled="false">
              <v-img height="170" contain src="../assets/purchase-order.svg"/>
              <v-card-title class="font-weight-bold px-3" v-text="'Приходные накладные'"/>
            </v-card>
            </v-hover>
          </v-col>
          <v-col cols="3" v-if="userPosition === 'Заведующий складом'">
            <v-hover v-slot="{hover}">
              <v-card  :elevation="hover ? 16 : 4" height="300" width="300" class="text-center" to="/sales-invoice" style="padding-top: 30px" :disabled="false">
              <v-img height="170" contain src="../assets/invoice_icon.png"/>
              <v-card-title class="font-weight-bold px-3" v-text="'Расходные накладные'"/>
            </v-card>
            </v-hover>
          </v-col>
          <v-col cols="3" v-if="userPosition === 'Менеджер'">
            <v-hover v-slot="{hover}">
              <v-card  :elevation="hover ? 16 : 4" height="300" width="300" class="text-center" to="/bills" style="padding-top: 30px" :disabled="false">
              <v-img height="170" contain src="../assets/pay-your-bill-icon.svg"/>
              <v-card-title class="font-weight-bold px-3" v-text="'Счета'"/>
            </v-card>
            </v-hover>
          </v-col>
        </v-row>

</template>

<script>
  export default {
    data () {
      return {
        userPosition: null
      }
    },
    mounted(){
      this.$store.dispatch('fetchInfo').then(val=>
      this.userPosition = val)
    }
  }
</script>

<style scoped>

</style>