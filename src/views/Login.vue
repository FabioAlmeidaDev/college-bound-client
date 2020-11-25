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
    class="mx-auto my-12"
    max-width="374"
    v-if="!this.$store.state.user.token"
  >
    <v-card-title>Login</v-card-title>
    <v-card-text>
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
    <v-card-actions>
      <v-btn color="info" @click="$store.dispatch('signin')">Login</v-btn>
    </v-card-actions>
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
      async getList() {
        await api
          .get("/athletes/all", {})
          .then((response) => {
            this.athletes = response.data;
          })
          .catch((err) => {
            console.log(err);
          });
      },
      goto(id) {
        this.$router.push(`edit/${id}`);
      },
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
