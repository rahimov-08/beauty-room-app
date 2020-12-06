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
    :items="invoices"
    :search="search"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title> <h3>Приходные накладные</h3></v-toolbar-title>
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
              Выберите сырье
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                    <v-col cols="8">
                       <v-autocomplete
                            v-model="editedItem.name"
                            :items="raws"
                            item-text="name"
                            label="Сырье"
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
      </v-toolbar>
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
        positions: ['Менеджер','Заведующий складом','Консультант'],
        dialogDelete: false,
        generatedPassword: '',
        defaultInvoice: {
            uid: '',
            name: '',
            date:'',
            quantity: 0,
            supplier: '',
            price: 0,
            total:0
        },
        editedItem: {
            uid: '',
            name: '',
            date:'',
            quantity: 0,
            supplier: '',
            price: 0,
            total: 0
        },
        search:'',
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
          { text: 'Поставщик', value: 'supplier' },
          { text: 'Дата', value: 'date' },
          { text: 'Количество', value: 'quantity' },
          { text: 'Цена/шт.', value: 'price' },
          { text: 'Сумма', value: 'total' },
        ],
        invoices: [],
        raws:[],
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
      this.initialize()
    },
    methods:{
        async initialize(){
            this.raws = await this.$store.dispatch('fetchRaws')
            this.invoices = await this.$store.dispatch('fetchPurchaseInvoices')
            this.loading = false
        },
        async addingNewItem(){
            this.adding = true
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

      async save () {
        
        try{
            var today = new Date();

            var date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();

            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

            var fullDate = date+' '+time;
            let raw = this.raws[this.raws.findIndex(it=>it.name === this.editedItem.name)]
            var total = this.editedItem.quantity * raw.price
            this.editedItem.total = total
            this.editedItem.price = raw.price
            this.editedItem.supplier = raw.supplier_name
            this.editedItem.date = fullDate
            
            this.invoices.push(this.editedItem)
            await this.$store.dispatch('addPurchaseInvoice',this.editedItem)

            raw.balance = +raw.balance + +this.editedItem.quantity
            
            await this.$store.dispatch('updateRaw',raw)


            var formData2 = {
              type:'Покупка сырья',
              date: fullDate,
              composition:this.editedItem.name+', Кол-во:'+this.editedItem.quantity,
              total: total
            }

            await this.$store.dispatch('addBill',formData2)
          
          this.close()
        }catch(e){
          console.log(e);
        }
        
      },
    }
  }
</script>