<template>
  <v-container>
  <v-card
    class="mx-auto my-12"
    max-width="600"
    elevation="0"
  >

    <v-card-title>Update your contact info</v-card-title>
    <v-card-text class="px-7">
      <v-form
        ref="form"
        lazy-validation
        v-model="valid"
      >
        <v-text-field label="Athlete's email" v-model="email" :rules="[...validation.required, ...validation.email]" required/>
        <v-text-field label="Guardian's name" v-model="guardianName" :rules="[...validation.required]" required/>
        <v-text-field label="Guardians's email" v-model="guardiaEmail" :rules="[...validation.required, ...validation.email]" required/>

      </v-form>
      <v-alert class="login-error-msg" dismissible v-if="this.$store.getters.login.error" color="error" outlined>{{this.$store.getters.login.message}}</v-alert>
    </v-card-text>

    <v-footer>
        <v-btn class="do-login-button mb-4 mt-4" color="success" @click="validate()">Save Changes</v-btn>
    </v-footer>
  </v-card>
  <snackbar :show="snackbar" :message="snackbarMessage" :color="snackbarColor"/>
  </v-container>
</template>

<script lang="ts">
  //@ts-ignore
  import Vue from "vue";
  import axios from "axios";
  import router from '@/router';
  import validation from "@/lib/validation.rules";
  import Snackbar from "@/components/Snackbar.vue";
  
  export default Vue.extend({
    name: "Reset",
    components: {
      Snackbar
    },
    data(){
      return {
        snackbar: false, 
        snackbarMessage: "",
        snackbarColor: "",
        value: true,
        passwordMatch: "",
        valid: true,
        validation: validation
      }
    },
    methods: {
     async validate() {
        // @ts-ignore
        this.valid = this.$refs.form.validate();
        if (this.valid) {
          await this.$store.dispatch('updateUser', {
            user:{email: this.email, guardianName: this.guardiaEmail, guardiaEmail: this.guardiaEmail}, 
            token: this.$store.getters.getToken
          }) 
          .then((res)=>{
            if (res.data.status == 'success'){
              this.snackbar = true;
              this.snackbarColor = "green";
              this.snackbarMessage = `saved!`;
            }else{
              this.snackbar = true;
              this.snackbarColor = "red";
              this.snackbarMessage = `not saved!`;

            }
        });  
        }
      },      
    },
    computed: {
      email: {
        set(val){
          this.$store.commit("setUserInfo",{email: val});
        },
        get(){
          return this.$store.state.user.email;
        }
      },
      guardianName: {
        set(val){
          this.$store.commit("setUserInfo",{guardianName: val});
        },
        get(){
          return this.$store.state.user.guardianName;
        }
      },
      guardiaEmail: {
        set(val){
          this.$store.commit("setUserInfo",{guardiaEmail: val});
        },
        get(){
          return this.$store.state.user.guardiaEmail;
        }
      },
      
    },
  });
</script>

<style lang="scss">
  
</style>
