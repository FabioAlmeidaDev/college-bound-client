<template>
<div>
  <!-- Already logged in -->
  <v-card
      class="mx-auto my-12"
      max-width="374"
      v-if="this.$store.state.user.token"
    >
    <v-card-text>
      <div>You are already logged in</div>
      <div> {{this.$store.getters.getToken}} </div>
      <v-btn @click="$store.dispatch('logout')"> Click here to log out </v-btn>
    </v-card-text>
  </v-card>

<!-- Not yet logged in -->
  <v-card 
    elevation="0"
    class="mx-auto my-12"
    max-width="374"
  >
    New User? <a href="/register"> Click here to Register </a>
  </v-card>

  <v-card
    class="mx-auto my-12"
    max-width="374"
    v-if="!this.$store.state.user.token"
  >
    <v-card-title>Hello There!</v-card-title>
    <v-card-text class="px-7">
      <v-form
        ref="form"
        lazy-validation
        @submit="()=>console.log('submitted')"
      >
      <v-text-field
          v-model="email"
          :rules="emailRules"
          label="E-mail"
          required
          type="email"
        ></v-text-field>

        <v-text-field
          v-model="password"
          :rules="pwdRules"
          label="Password"
          required
          type="password"
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions class="d-flex">
      <v-btn class="do-login-button mb-7" color="success" @click="$store.dispatch('signin', $route.query.redirect)">Login</v-btn>
    </v-card-actions>
    <v-footer>
        Having trouble logging in? <a href="/reset"> Click here to Reset your password </a>
    </v-footer>
  </v-card>

</div>
</template>

<script>
  // @ is an alias to /src
  //@ts-ignore
  import api from "@/api/server-api";
  export default {
    name: "List",
    data: () => ({
      pwdRules: [],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
    }),
    components: {},
    methods: {
    },
    computed: {
      email: {
        set(val){
          this.$store.commit("setEmail",val);
        },
        get(){
          return this.$store.state.user.email;
        }
      },
      password: {
        set(val){
          this.$store.commit("setPassword",val);
        },
        get(){
          return this.$store.state.user.password;
        }
      }
    }
    
  };
</script>

<style lang="scss">
  .do-login-button {
    flex:1;
  }
</style>