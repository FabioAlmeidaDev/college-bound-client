<template>
  <v-container>
  <v-card
    class="mx-auto my-12"
    max-width="600"
    elevation="0"
  >

    <v-card-title>Update your social media info</v-card-title>
    <v-card-text class="px-7">
      <v-form
        ref="form"
        lazy-validation
        v-model="valid"
      >
        <v-text-field label="Youtube Channel full URL" v-model="youtubeChannel" />
        <v-text-field label="Instagram account" v-model="instagramAccount" />

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
            user:{youtubeChannel: this.youtubeChannel, instagramAccount: this.instagramAccount}, 
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
      youtubeChannel: {
        set(val){
          this.$store.commit("setUserInfo",{youtubeChannel: val});
        },
        get(){
          return this.$store.state.user.youtubeChannel;
        }
      },
      instagramAccount: {
        set(val){
          this.$store.commit("setUserInfo",{instagramAccount: val});
        },
        get(){
          return this.$store.state.user.instagramAccount;
        }
      },
      
    },
  });
</script>

<style lang="scss">
  
</style>
