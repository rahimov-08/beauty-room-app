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
    :items="users"
    :search="search"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title><h3>Пользователи</h3></v-toolbar-title>
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
              {{formTitle}}
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                    <v-col cols="12">
                        <v-text-field
                        v-model="editedItem.name"
                        label='ФИО'
                        :rules="rules.required"/>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-autocomplete
                            v-model="editedItem.position"
                            :items="positions"
                            label="Должность"
                            :rules="rules.required"/>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-text-field
                            v-model="editedItem.address"
                            label="Адрес"
                            :rules="rules.required"/>
                            
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-text-field
                            :disabled="!adding"
                            v-model="editedItem.email"
                            label="E-mail"
                            :rules="rules.email"/>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="8">
                        <v-text-field
                        v-model="editedItem.phone"
                        label='Номер телефона'
                        :rules="rules.phone"/>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field
                        v-model="editedItem.working_hours"
                        label='Кол-во раб. ч/мес.'/>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" v-if="adding">
                        <v-text-field
                        :disabled="adding"
                        v-model="editedItem.password"
                        label='Пароль'/>
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
        defaultUser: {
            uid: '',
            name: '',
            position: '',
            phone: '',
            email: '',
            address: '',
            working_hours: 0,
        },
        editedItem: {
            uid: '',
            name: '',
            position: '',
            phone: '+7',
            email: '',
            address: '',
            working_hours: 0,
        },
        search:'',
        rules: {
          email: [val => val.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/) || 'Некорректный адрес!'],
          required: [val => (val || '').length > 0 || 'Объязательное поле!'],
          phone: [val => val.match(/\d/g).length == 11 || 'Неверный номер телефона']
        },
        headers: [
          {
            text: 'ФИО',
            align: 'start',
            value: 'name',
          },
          { text: 'Должность', value: 'position' },
          { text: 'Телефон', value: 'phone', sortable:false },
          { text: 'E-mail', value: 'email', sortable:false },
          { text: 'Адрес', value: 'address', sortable:false },
          { text: 'Кол-во раб. часов/мес', value: 'working_hours', align: 'center' },
          { text: 'Действие', value: 'actions', sortable: false, align: 'end' },
        ],
        users: [],
      }
    },
    computed: {
      formTitle () {
        return this.adding ? 'Создание пользователя' : 'Редактирование пользователя'
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
            this.users = await this.$store.dispatch('fetchUsers')
            this.loading = false
        },
        async addingNewItem(){
            this.adding = true
            await this.axios.get("https://helloacm.com/api/random/?n=8").then((response) =>this.generatedPassword = response.data);
            this.editedItem.password = this.generatedPassword
            
          },
        async editItem (item) {
        this.editedIndex = this.users.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },


      deleteItem (item) {
        this.editedIndex = this.users.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      async deleteItemConfirm () {
        this.users.splice(this.editedIndex, 1)
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
            Object.assign(this.users[this.editedIndex], this.editedItem)
            await this.$store.dispatch('updateUser',this.editedItem)
          } else {
            this.users.push(this.editedItem)
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