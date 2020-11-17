<template>
    <div>
        <v-app-bar app color="red" dark>
          <router-link to="/" style="margin-left: 10px" ><v-app-bar-nav-icon ><v-img contain width="60px" height="60px" src="../assets/logo.png"/></v-app-bar-nav-icon></router-link>
      <v-spacer/>
      <v-btn icon>
        <v-icon>mdi-account</v-icon>
      </v-btn>
      <v-btn icon to="/login">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
    <router-view/>
    </v-container>
    </v-main>
    </div>
</template>