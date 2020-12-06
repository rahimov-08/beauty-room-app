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
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Поиск"
                single-line
                hide-details/>
                <v-spacer></v-spacer>
        <v-dialog
          v-if="userPosition === 'Консультант'"
          v-model="dialog"
          max-width="500px"
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
              Добавить
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              {{formTitle}}
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                    <v-col cols="8">
                       <v-autocomplete
                            v-model="editedItem.name"
                            :items="products"
                            item-text="name"
                            label="Продукт"
                        />
                    </v-col>
                    <v-col cols="4">
                        <v-text-field
                            v-model="editedItem.quantity"
                            label='Количество'
                            :rules="rules.required"/>
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
                Сохранить
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="657px">
          <v-card>
            <v-card-title class="headline">Вы уверены, что хотите удалить этого пользователя?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red darken-1" text @click="closeDelete">Отмена</v-btn>
              <v-btn color="green darken-1" text @click="deleteItemConfirm">Удалить</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon
      :disabled="userPosition != 'Консультант'"
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        :disabled="userPosition != 'Консультант'"
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
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
         userPosition: null,
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
          { text: 'Действие', value: 'actions', sortable: false, align: 'end' },
        ],
        products: [],
        ordProd:[],
        raws:[],
        order: null,
        orderUid:0,
      }
    },
    computed: {
      formTitle () {
        return this.adding ? 'Добавьте продукт к заказу' : 'Редактирование продукта'
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
      this.$store.dispatch('fetchInfo').then(val=>
      this.userPosition = val)
      this.orderUid = this.$route.params.uid
        
      this.initialize()
    },
    methods:{
        async initialize(){
            this.products = await this.$store.dispatch('fetchProducts')
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
        try{
          if (this.editedIndex > -1) {
            Object.assign(this.ordProd[this.editedIndex], this.editedItem)
            let product = this.products[this.products.findIndex(it=>it.name === this.editedItem.name)]
            let price = product.price * this.editedItem.quantity
            this.editedItem.price = product.price
            this.editedItem.totalPrice = price
            let formData = {
              uid: this.orderUid,
              compositionUid: this.editedItem.uid,
              name: this.editedItem.name,
              quantity: this.editedItem.quantity,
              price: this.editedItem.price,
              totalPrice: this.editedItem.totalPrice,
            }
            console.log(this.editedItem);
            await this.$store.dispatch('updateOrderProduct',formData)
          } else {
            console.log(this.ordProd);
            if(this.ordProd.length === 0){
              let formData = {orderUid: this.orderUid, status:'Обрабатывается'}
              await this.$store.dispatch('updateOrderStatus',formData)
            }
            let product = this.products[this.products.findIndex(it=>it.name === this.editedItem.name)]
            let price = product.price * this.editedItem.quantity
            this.editedItem.price = product.price
            this.editedItem.totalPrice = price
            let formData = {orderUid:this.orderUid,composition:this.editedItem}
            var compositionKey = await this.$store.dispatch('addProductToOrder',formData)
            this.editedItem.uid = compositionKey
            this.ordProd.push(this.editedItem)
          }
          this.close()
        }catch(e){
          console.log(e);
        }
        
      },
    }
  }
</script>