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
    :items="companies"
    :search="search"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title> <h3>Транспортные компании</h3></v-toolbar-title>
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
        v-if="userPosition === 'Менеджер'"
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
                    <v-col cols="12">
                        <v-text-field
                        v-model="editedItem.name"
                        label='Название'
                        :rules="rules.required"/>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-text-field
                            v-model="editedItem.address"
                            label='Адрес'
                            :rules="rules.required"/>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-text-field
                            v-model="editedItem.phone"
                            label="Телефон"
                            :rules="rules.phone"/>   
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
            <v-card-title class="headline">Вы действительно хотите удалить компанию?</v-card-title>
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
        :disabled="userPosition != 'Менеджер'"
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        :disabled="userPosition != 'Менеджер'"
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
        defaultCompany: {
            uid: '',
            name: '',
            phone: '',
            address: '',
        },
        editedItem: {
            uid: '',
            name: '',
            phone: '+7',
            address: '',
        },
        search:'',
        userPosition: null,
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
          { text: 'Адрес', value: 'address' },
          { text: 'Телефон', value: 'phone', sortable:false },
          { text: 'Действие', value: 'actions', sortable: false, align: 'end' },
        ],
        companies: [],
      }
    },
    computed: {
      formTitle () {
        return this.adding ? 'Добавление компании' : 'Редактирование компании'
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
      this.initialize()
    },
    methods:{
        async initialize(){
            this.companies = await this.$store.dispatch('fetchTpCompanies')
            this.loading = false
        },
        async addingNewItem(){
            this.adding = true
          },
        async editItem (item) {
        this.editedIndex = this.companies.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },


      deleteItem (item) {
        this.editedIndex = this.companies.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      async deleteItemConfirm () {
        this.companies.splice(this.editedIndex, 1)
        this.$store.dispatch('deleteTpCompany',this.editedItem.uid)
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
            Object.assign(this.companies[this.editedIndex], this.editedItem)
            
            await this.$store.dispatch('updateTpCompany',this.editedItem)
          } else {
            this.companies.push(this.editedItem)
            await this.$store.dispatch('addTpCompany',this.editedItem)
          }
          this.close()
        }catch(e){
          console.log(e);
        }
        
      },
    }
  }
</script>