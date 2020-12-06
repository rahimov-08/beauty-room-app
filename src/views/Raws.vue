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
    :items="raws"
    :search="search"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title><h3>Сырье</h3></v-toolbar-title>
        <v-spacer/>
        <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Поиск"
                single-line
                hide-details/>
                
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        :disabled="item.uid === uid"
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
        Reset
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
        positions: ['Менеджер','Заведующий складом','Консультант'],
        dialogDelete: false,
        generatedPassword: '',
        defaultRaw: {
            uid: '',
            name: '',
            balance:'',
            supplier_id:'',
            supplier_name:'',
            price:0,
        },
        editedItem: {
            uid: '',
            name: '',
            balance:'',
            supplier_id:'',
            supplier_name:'',
            price:0,
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
          { text: 'Остаток', value: 'balance' },
          { text: 'Цена/шт.', value: 'price' },
          { text: 'Поставщик', value: 'supplier_name'},
        ],
        raws: [],
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
            this.loading = false
        },
        async addingNewItem(){
            this.adding = true
            await this.axios.get("https://helloacm.com/api/random/?n=8").then((response) =>this.generatedPassword = response.data);
            this.editedItem.password = this.generatedPassword
            
          },
        async editItem (item) {
        this.editedIndex = this.raws.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },


      deleteItem (item) {
        this.editedIndex = this.raws.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      async deleteItemConfirm () {
        this.raws.splice(this.editedIndex, 1)
        this.$store.dispatch('deleteUser',this.editedItem.uid)
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
            Object.assign(this.raws[this.editedIndex], this.editedItem)
            await this.$store.dispatch('updateUser',this.editedItem)
          } else {
            this.raws.push(this.editedItem)
            await this.$store.dispatch('register',this.editedItem)
          }
          this.close()
        }catch(e){
          console.log(e);
        }
        
      },
    }
  }
</script>