<template>
<div>
  <v-row justify="center" v-if="loading">
    <v-progress-circular
      indeterminate
      color="red"
    />
  </v-row>
  <v-data-table
     v-else
    :headers="headers"
    :items="ordProd"
    :search="search"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title> <h3>Заказ клиента "{{order.customer}}" от {{order.date}}</h3></v-toolbar-title>
        <v-divider
          class="mx-2"
          inset
          vertical/>
        <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Поиск"
                single-line
                hide-details
                class="mx-2"/>

        <v-dialog
          v-model="dialog"
          max-width="500px"
          v-if="order.tpCompany == 'Обрабатывается...'"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
              v-on:click="addingNewItem()"
            >
              Отправить
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              Выберите транспортную компанию
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                    <v-col cols="12">
                       <v-autocomplete
                            v-model="editedItem.name"
                            :items="tpCompanies"
                            item-text="name"
                            label="Транспортная компания"
                        />
                    </v-col>
                </v-row>
                
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="red darken-1"
                text
                @click="close"
              >
                Отмена
              </v-btn>
              <v-btn
                color="green darken-1"
                text
                @click="save"
              >
                Отправить
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-card-title v-else style="color:green">Отправлен</v-card-title>
      </v-toolbar>
    </template>
    <template v-slot:no-data>
      <v-btn
        color="primary"
        @click="initialize"
      >
        Повторить
      </v-btn>
    </template>
  </v-data-table>
</div>
</template>

<script>
  export default {
    data () {
      return {
        dialog:false,
        uid:'',
        rawsLoading:false,
        adding: false,
        loading: true,
        positions: ['Менеджер','Заведующий складом','Консультант'],
        dialogDelete: false,
        generatedPassword: '',
        defaultOrderProduct: {
            name:'',
            quantity:'',
            price:0,
            totalPrice:0,
        },
        editedItem: {
            name:'',
            quantity:'',
            price:0,
            totalPrice:0,
        },
        search:'',
        rawSearch:'',
        rules: {
          email: [val => val.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/) || 'Некорректный адрес!'],
          required: [val => (val || '').length > 0 || 'Объязательное поле!'],
          phone: [val => val.match(/\d/g).length == 11 || 'Неверный номер телефона']
        },
        headers: [
          {
            text: 'Название',
            align: 'start',
            value: 'name',
          },
          { text: 'Количество', value: 'quantity' },
          { text: 'Цена/шт.', value: 'price' },
          { text: 'Сумма', value: 'totalPrice' },
        ],
        tpCompanies: [],
        ordProd:[],
        raws:[],
        order: null,
        orderUid:0,
      }
    },
    computed: {
      orderTpCompany(){
          return this.order.tpCompany
      }
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },
    async mounted(){
      this.uid = await this.$store.dispatch('getUid')
      this.orderUid = this.$route.params.uid
        
      this.initialize()
    },
    methods:{
        async initialize(){
            this.tpCompanies = await this.$store.dispatch('fetchTpCompanies')
            this.order = await this.$store.dispatch('fetchOrder',this.orderUid)
            this.ordProd = await this.$store.dispatch('fetchOrderProducts',this.orderUid)
            this.loading = false
        },
        async addingNewItem(){
            this.adding = true
            
        },
        async editItem (item) {
        this.editedIndex = this.ordProd.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },


      deleteItem (item) {
        this.editedIndex = this.ordProd.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      async deleteItemConfirm () {
        this.ordProd.splice(this.editedIndex, 1)
        var formData ={
          uid: this.orderUid,
          compositionUid: this.editedItem.uid
        }
        this.$store.dispatch('deleteOrderProduct',formData)
        this.closeDelete()
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
        if(this.adding){
          this.adding = false
        }
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      async save () {
          this.order.tpCompany = this.editedItem.name
          let formData = {uid: this.orderUid,status:'Отправлен',tpCompany:this.editedItem.name}
          var orderComposition = this.order.composition
          var composition = ''
          var i = 0
          var totalPrice = 0
          for(var key in orderComposition){
            i++
            composition += i+ '. ' + orderComposition[key].name + ', Сумма:'+orderComposition[key].totalPrice+' руб.\n'
            totalPrice += +orderComposition[key].totalPrice
          }

          var today = new Date();

          var date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();

          var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

          var fullDate = date+' '+time;

          var formData2 = {
            type:'Продажа продукта',
            date: fullDate,
            composition:composition,
            total: totalPrice
          }

          await this.$store.dispatch('addBill',formData2)
          await this.$store.dispatch('setTpCompany',formData)
          await this.$store.dispatch('setStatus',formData)
          this.close()
        
        
      },
    }
  }
</script>