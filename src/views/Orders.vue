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
    :items="orders"
    :search="search"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title><h3>Заказы</h3></v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical/>
        <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Поиск"
                single-line
                hide-details/>
        <v-spacer/>
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
              Добавление заказа
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                    <v-col cols="12">
                        <v-autocomplete
                            v-model="editedItem.customer"
                            :items="customers"
                            label="Клиент"
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
                Сохранить
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="657px">
          <v-card>
            <v-card-title class="headline">Вы действительно хотите удалить клиента?</v-card-title>
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
      class="mx-5"
        small
        @click="openOrder(item)"
      >
        mdi-arrow-right
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
        adding: false,
        loading: true,
        dialogDelete: false,
        generatedPassword: '',
        defaultOrder: {
            uid: '',
            customer: '',
            date: '',
            status: '',
            composition:[],
            tpCompany:'',
        },
        editedItem: {
             uid: '',
            customer: '',
            date: '',
            status: '',
            composition:[],
            tpCompany:'',
            userPosition: null
        },
        search:'',
        rules: {
          email: [val => val.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/) || 'Некорректный адрес!'],
          required: [val => (val || '').length > 0 || 'Объязательное поле!'],
          phone: [val => val.match(/\d/g).length == 11 || 'Неверный номер телефона']
        },
        headers: [
          {
            text: 'Клиент',
            align: 'start',
            value: 'customer',
          },
          { text: 'Дата заказа', value: 'date' },
          { text: 'Статус', value: 'status', sortable:false },
          { text: 'Действие', value: 'actions', sortable: false, align: 'end' },
        ],
        customers: [],
        orders:[],
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
      this.customers = await this.$store.dispatch('fetchCustomersNames')
      this.initialize()
    },
    methods:{
        async initialize(){
            this.orders = await this.$store.dispatch('fetchOrders')
            this.loading = false
        },
        async addingNewItem(){
            this.adding = true
          },
        async editItem (item) {
        this.editedIndex = this.orders.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      deleteItem (item) {
        this.editedIndex = this.orders.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      async deleteItemConfirm () {
        this.orders.splice(this.editedIndex, 1)
        this.$store.dispatch('deleteOrder',this.editedItem.uid)
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
            console.log(this.editedItem);
            Object.assign(this.orders[this.editedIndex], this.editedItem)
            
            await this.$store.dispatch('updateOrder',this.editedItem)
          } else {

            var today = new Date();

            var date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();

            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

            this.editedItem.date = date+' '+time;
            this.editedItem.status = 'Принят'
            this.editedItem.tpCompany = 'Обрабатывается...'
            this.editedItem.composition = new Array(0)
            console.log(this.editedItem);
            
            var newOrderKey = await this.$store.dispatch('addOrder',this.editedItem)

            this.editedItem.uid = newOrderKey
            this.orders.push(this.editedItem)
          }
          this.close()
        }catch(e){
          console.log(e);
        }
        
      },
      openOrder(item){
          this.$router.push('/order/'+item.uid)
      },
    }
  }
</script>