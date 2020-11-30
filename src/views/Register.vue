<template>
  <v-container>
    <v-card
      max-width="374"
      class="mx-auto"
      elevation="0"
      outlined
    >
      <v-card-title>
        Let's get you registered.
      </v-card-title>
  
      <v-form ref="form" lazy-validation v-model="valid">
        <v-card-text>
          <h4>Basic Info</h4>
            <v-text-field label="Full name" v-model="user.fullName" :rules="[...validation.required]" required />
            <v-row>
              <v-col md="8" sm="12" class="v-flex">
                <v-text-field label="DOB"  v-mask="'##/##/####'" v-model="user.dob" :rules="[...validation.required]" required/>
              </v-col>
              <v-col md="4" sm="12">
                <v-select v-model="user.gradYear" :items="graduatingYears" label="Grad year" required></v-select>
              </v-col>
            </v-row>
            <v-text-field v-model="user.email" label="Email" :rules="[...validation.required, ...validation.email]" />
          
          <h4>Parent or Guardian</h4>
            <v-text-field v-model="user.guardianName" label="Legal guardian's name" :rules="[...validation.required]"/>
            <v-text-field v-model="user.guardiaEmail" label="Legal guardian's e-mail" :rules="[...validation.required, ...validation.email]"/>

          <h4>Gym and coaches</h4>
            <v-autocomplete 
              label="Gym" 
              v-model="user.gym" 
              full-width  
              :items="gyms" 
              item-text="name" 
              item-value="name" 
              no-data-text=""
              :search-input.sync="search"
              :rules="[...validation.required]"
            >
            <!-- <template v-slot:no-data>
              <div>Your gym is not in the list?</div>
              <v-btn class="mx-5" text @click="addNewGym()">Click here to add it now</v-btn>
            </template> -->

            <template v-slot:item="data">
              <template v-if="typeof data.item !== 'object'">
              </template>
              <template v-else>
                <v-list-item-avatar>
                  <img :src="data.item.avatar">
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title v-html="data.item.name"></v-list-item-title>
                  <v-list-item-subtitle v-html="data.item.group"></v-list-item-subtitle>
                </v-list-item-content>
              </template>
            </template>
          </v-autocomplete>

            <v-text-field v-model="user.coachesName" label="Head Coachs full name" :rules="[...validation.required]"/>
            <v-text-field v-model="user.coachEmail" label="Head Coachs email" :rules="[...validation.required, ...validation.email]"/>

          <h4>Social Media</h4>
          <v-text-field v-model="user.youtubeChannel" label="Youtube channel" />
          <v-text-field v-model="user.instagramAccount" label="Instagram Account" />
          
          <h4>Intent</h4>
            <v-checkbox v-model="user.acceptedVerbalOffer" label="Accepted Verbal Offer" />
            <v-checkbox v-model="user.acceptedWrittenOffer" label="Accepted Written Offer" />

          <h4>Password</h4>
            <v-text-field 
              label="Password" 
              v-model="user.password" 
              :rules="[...validation.required, ...validation.passwordLength]"
              :type="revealPassword ? 'password' : 'text'"
            />
            <v-text-field
             label="Re enter your password"
              :rules="[...validation.required, ...validation.pwdMatchesRules]"
              :append-icon="revealPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append="() => (revealPassword = !revealPassword)"
              :type="revealPassword ? 'password' : 'text'"
            />
        </v-card-text>
        <v-footer>
          <v-card-actions >
            <v-btn color="info" width="100%" @click="validate()"> Register user </v-btn>
          </v-card-actions>
        </v-footer>
      </v-form>
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
  import Vue from "vue";
  import axios from "axios";
  //@ts-ignore
  import api from "@/api/server-api";
  import router from '@/router';

  export default Vue.extend({
    name: "Register",

    data(){
      return {
        revealPassword: true,
        valid: true ,
        snackbar: false,
        snackbarMessage: "",
        user: {
          fullName:"",
          accountType:"athlete",
          dob:"",
          gradYear:2020,
          email:"",
          guardianName:"",
          guardiaEmail:"",
          gym:"",
          coachesName:"",
          coachEmail:"",
          youtubeChannel:"",
          instagramAccount:"",
          acceptedVerbalOffer:false,
          acceptedWrittenOffer:false,
          password:"",
        },
        search: null, 
        gyms: [
          {name:'Port Jefferson Gymnastics', type: "from-server"}, 
          {name:'Apex Athletics'}, 
        ],
        validation: {
          required: [(v: any) => !!v || "Required"],
          email: [(v: any) => !!v || "E-mail is required", (v: any) => /.+@.+\..+/.test(v) || "E-mail must be valid"],
          passwordLength: [(v: any) => v.length >= 8 || "Password must be at least 8 characters long"],
          pwdMatchesRules: [(v: any) => v == this.$data.user.password || 'Password does not match'],
        }
      }
    },
    methods: {
      async validate() {
        // @ts-ignore
        this.valid = this.$refs.form.validate();
        
        if (this.valid) {
          await this.$store.dispatch('register', this.user) 
          .then((res)=>{
            if (res.data.status == 'success'){
              router.push("/login")
            }else{
              this.snackbar = true;
              this.snackbarMessage = `There was a problem trying to register you at this time. Please verify your information and try again.`;

            }
        });  
        }
      }, 
    },
    watch: {
      search(val: any){
        this.gyms = this.gyms.filter(item => item.type !== "user-added")
        const found = this.gyms.find(element => element.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
        if (!found) {
          const newItem = {
            name: val,
            type: "user-added"
          }
          this.gyms.push(newItem)
        }
      }
    },
    computed: {
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
  .v-flex{
    display: flex;
  }
  .dob-flex-fields >>> input{
    text-align: center;
  }
</style>
