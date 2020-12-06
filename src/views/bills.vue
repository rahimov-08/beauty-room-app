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
    :items="bills"
    :search="search"
    @click:row="openOrder"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title><h3>Счета</h3></v-toolbar-title>
        <v-spacer/>
        <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Поиск"
                single-line
                hide-details/>
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
        adding: false,
        loading: true,
        dialogDelete: false,
        generatedPassword: '',
        defaultBill: {
            uid: '',
            type:'',
            date: '',
            composition:'',
            total:0
        },
        editedItem: {
            uid: '',
            type:'',
            date: '',
            composition:'',
            total:0
        },
        search:'',
        rules: {
          email: [val => val.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/) || 'Некорректный адрес!'],
          required: [val => (val || '').length > 0 || 'Объязательное поле!'],
          phone: [val => val.match(/\d/g).length == 11 || 'Неверный номер телефона']
        },
        headers: [
          {
            text: 'Тип счета',
            align: 'start',
            value: 'type',
          },
          { text: 'Дата', value: 'date' },
          { text: 'Список продуктов', value: 'composition' },
          { text: 'Сумма', value: 'total', align: 'end' },
        ],
        bills: [],
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
            this.bills = await this.$store.dispatch('fetchBills')
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
      openOrder(item){
          this.$router.push('/sales-invoice/'+item.uid)
      },
    }
  }
</script>