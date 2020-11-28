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
      <v-card-text>
        <v-text-field label="Name" />
        <v-text-field label="DOB" />
        <v-text-field label="Graduating year" />
        <v-text-field label="Email" />
        <v-text-field label="Parent or guardian's e-mail" />
        <v-checkbox label="Accepted Verbal Offer" />
        <v-checkbox label="Accepted Written Offer" />
        <v-text-field v-if="!autocomplete" label="Enter Your Gym Name" />
        <v-autocomplete 
          v-if="autocomplete" 
          label="Gym" 
          v-model="gym" 
          full-width  
          :items="gyms" 
          item-text="name" 
          item-value="name" 
          no-data-text=""
          :search-input.sync="search"
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
        <v-text-field label="Coach's e-mail" />
        <v-text-field label="Youtube channel" />
        <v-text-field label="Instagram Account" />

        
      </v-card-text>
      <v-footer>
        <v-card-actions></v-card-actions>
      </v-footer>
      <v-form>

      </v-form>
    </v-card>
  </v-container>
</template>

<script lang="ts">
  import Vue from "vue";
  import axios from "axios";
  //@ts-ignore
  import api from "@/api/server-api";

  export default Vue.extend({
    name: "Register",

    data: () => ({
      autocomplete: true,
      search: null, 
      addGym: [],
      gym:"",
      gyms: [
        {name:'Port Jefferson Gymnastics', type: "from-server"}, 
        {name:'Apex Athletics'}, 
        ],
    }),
    methods: {
 
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
      
    },
  });
</script>

<style lang="scss">
  
</style>
