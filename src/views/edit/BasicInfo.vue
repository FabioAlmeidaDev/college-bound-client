<template>
  <v-container>
  <v-card
    class="mx-auto my-12"
    max-width="374"
  >
    <v-card-title>Update your basic info</v-card-title>
    <v-card-text class="px-7">
      <v-form
        ref="form"
        lazy-validation
        v-model="valid"
      >
        <v-text-field label="Full name" v-model="fullName" required />
        <v-text-field label="DOB"  v-mask="'####/##/##'" v-model="dob" required/>
        <v-select :items="graduatingYears" label="Grad year"  v-model="gradYear" required></v-select>

      </v-form>
      <v-alert class="login-error-msg" dismissible v-if="this.$store.getters.login.error" color="error" outlined>{{this.$store.getters.login.message}}</v-alert>
    </v-card-text>

    <v-footer>
        <v-btn class="do-login-button mb-4 mt-4" color="success" @click="validate()">Save Changes</v-btn>
    </v-footer>
  </v-card>

  <v-snackbar 
    v-model="snackbar"
    color="red"
  >
    {{this.snackbarMessage}}
  </v-snackbar>

  </v-container>
</template>

<script lang="ts">
  //@ts-ignore
  import Vue from "vue";
  import axios from "axios";
  import router from '@/router';

  export default Vue.extend({
    name: "Reset",

    data(){
      return {
        snackbar: false, 
        snackbarMessage: "",
        value: true,
        passwordMatch: "",
        valid: true,
        emailRules: [
          (v: any) => !!v || 'E-mail is required',
          (v: any) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        ],   
        pwdRules: [
          (v: any) => !!v || 'Password is required',
        ],
        pwdMatchesRules: [
          (v: any) => {
            return v == this.$store.state.user.password || 'Password does not match'
          },
        ]
      }
    },
    methods: {
     async validate() {
        // @ts-ignore
        this.valid = this.$refs.form.validate();
        if (this.valid) {
          await this.$store.dispatch('updateUser', {
            user:{fullName: this.fullName, dob: this.dob, gradYear: this.gradYear}, 
            token: this.$store.getters.getToken
          }) 
          .then((res)=>{
            if (res.data.status == 'success'){
              router.push("/")
            }else{
              this.snackbar = true;
              this.snackbarMessage = `The token you are trying to use was not issue for the email ${this.$store.getters.getEmail}`;

            }
        });  
        }
      },      
    },
    computed: {
      fullName: {
        set(val){
          this.$store.commit("setUserInfo",{fullName: val});
        },
        get(){
          return this.$store.state.user.fullName;
        }
      },
      dob: {
        set(val){
          this.$store.commit("setUserInfo",{dob: val});
        },
        get(){
          return this.$store.state.user.dob;
        }
      },
      gradYear: {
        set(val){
          this.$store.commit("setUserInfo",{gradYear: val});
        },
        get(){
          return this.$store.state.user.gradYear;
        }
      },
      graduatingYears() {
        const years = [];
        const num_of_years = 20;
        const first_year = 2020;
        for (let i = first_year; i <= first_year + num_of_years; i++) {
          years.push(i);
        }
        return years;
      },
    },
  });
</script>

<style lang="scss">
  
</style>
