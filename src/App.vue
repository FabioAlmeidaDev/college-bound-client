<template>
  <v-app>
    <v-app-bar app color="rgb(120, 170, 1)" dark>
      <div class="d-flex align-center app-header">
        <div class="app-name-and-logo">
          <v-img alt="Vuetify Logo" class="shrink mr-2" contain :src="require('@/assets/apexlogo.png')" transition="scale-transition" width="40" />
          <h2 class="main-title">College Bound</h2>
        </div>

        <div class="app-action-button-group">
          <v-btn outlined dark v-if="!$store.getters.getToken" @click="$router.push('/login')"> Login </v-btn>
          <v-btn outlined dark v-if="$store.getters.getToken" @click="$store.dispatch('logout')"> Logout </v-btn>
        </div>
      </div>

      <v-spacer></v-spacer>

      <!-- <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release </span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn> -->
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts">
  import Vue from "vue";
  import HelloWorld from "./components/HelloWorld.vue";

  export default Vue.extend({
    name: "App",

    components: {
    },

    data: () => ({
      //
    }),
  });
</script>
<style lang="scss">
  @media screen and (max-width: 527px) {
    .main-title {
      font-size: 1rem;
    }
  }
  .app-header{
    width:100%;
  }
  .app-name-and-logo, .app-action-button-group{
    flex: 1;
    display: flex;
  }
  .app-action-button-group{
    justify-content: flex-end;
  }
</style>
