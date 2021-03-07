<template>
  <v-container>
  <v-card
    class="mx-auto my-12"
    max-width="600"
    elevation="0"
  >
    <v-card-title>Update your gym info</v-card-title>
    <v-card-text class="px-7">
      <v-form
        ref="form"
        lazy-validation
        v-model="valid"
      >
          <v-autocomplete 
            label="Gym" 
            v-model="gym" 
            full-width  
            :items="this.$store.getters.gymsList" 
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

        <v-text-field label="Head coach" v-model="headCoach" :rules="[...validation.required]" required/>
        <v-text-field label="Head coach's email" v-model="headCoachEmail" :rules="[...validation.required, ...validation.email]" required/>
      </v-form>
      <v-alert class="login-error-msg" dismissible v-if="this.$store.getters.login.error" color="error" outlined>{{this.$store.getters.login.message}}</v-alert>
    </v-card-text>

    <v-footer>
        <v-btn class="do-login-button mb-4 mt-4" color="success" @click="validate()">Save Changes</v-btn>
    </v-footer>
  </v-card>

  <snackbar :show="snackbarshow" :message="snackbarMessage" :color="snackbarColor"/>

  </v-container>
</template>

<script lang="ts">
  //@ts-ignore
  import Vue from "vue";
  import validation from "@/lib/validation.rules";
  import Snackbar from "@/components/Snackbar.vue";
  
  export default Vue.extend({
    name: "Gym",
    components: {
      Snackbar
    },
    data(){
      return {
        snackbarshow: false, 
        snackbarMessage: "",
        snackbarColor: "",
        value: true,
        passwordMatch: "",
        valid: true,
        validation: validation,
        search: null, 
      }
    },
    methods: {
     async validate() {
        // @ts-ignore
        this.valid = this.$refs.form.validate();
        if (this.valid) {
          this.$store.dispatch('addGym', {
            name: this.gym,
            addedFrom: "ClubGymPage"
          });

          await this.$store.dispatch('updateUser', {
            user:{gym: this.gym, coacheshName: this.headCoach, coachEmail: this.headCoachEmail}, 
            token: this.$store.getters.getToken
          }) 
          .then((res)=>{
            if (res.data.status == 'success'){
              this.snackbarshow = true;
              this.snackbarColor = "green";
              this.snackbarMessage = `saved!`;
            }else{
              this.snackbarshow = true;
              this.snackbarColor = "red";
              this.snackbarMessage = `not saved!`;

            }
        });  
        }
      },      
    },
    watch: {
      search(val: any){
        this.$store.commit("setGymList", this.$store.getters.gymsList.filter(item => item.type !== "user-added"));
        const found = this.$store.getters.gymsList.find(element => element.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
        if (!found) {
          const newItem = {
            name: val,
            type: "user-added"
          }
          this.$store.commit("addToGymList", newItem)
        }
      }
    },
    computed: {
      gym: {
        set(val){
          this.$store.commit("setUserInfo",{gym: val});
        },
        get(){
          return this.$store.state.user.gym;
        }
      },
      headCoach: {
        set(val){
          this.$store.commit("setUserInfo",{coachesName: val});
        },
        get(){
          return this.$store.state.user.coachesName;
        }
      },
      headCoachEmail: {
        set(val){
          this.$store.commit("setUserInfo",{coachEmail: val});
        },
        get(){
          return this.$store.state.user.coachEmail;
        }
      },
    },
    mounted() {
      this.$store.dispatch("getGyms");
    }
  });
</script>

<style lang="scss">
  
</style>
