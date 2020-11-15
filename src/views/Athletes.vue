<template>
  <v-container>
    <h2>Athletes</h2>
    <div>
      <v-row class="text-center">
        <v-col sm="12" md="4" v-for="(item, index) in athletes" :key="index">
          <v-card>
            <v-card-title>{{item.name}}</v-card-title>
            <v-img :src="`https://apexcollegeshowcase-server.herokuapp.com/headshot/${item.photo}`"/>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
// @ is an alias to /src
  //@ts-ignore
  import api from "@/api/covid-server-api";
export default {
  name: 'Athletes',
  data: ()=>({
    search:'',
    athletes:[],
    headers:[
          {
            text: '#',
            align: 'start',
            value: '"athlete_number"',
          },
          {
            text: 'Athlete Name',
            align: 'start',
            value: 'name',
          },
          {
            text: 'Gym',
            align: 'start',
            value: 'clubname',
          },
          {
            text: 'Grad',
            value: 'grad_year',
             align: ' d-none'
          },
          {
            text: 'Action',
            align: 'start',
          },
        ],
  }),
  components: {
  }
  ,
  methods:{
    async getList(){
        await api
          .get("/athletes/all", {})
          .then((response) => {
            console.log("RESPONSE: ",response)
            this.athletes = response.data;
          })
          .catch((err) => {
            console.log(err);
          });

      },
      goto(id){
      this.$router.push(`edit/${id}`);
    }
    },
    created(){
      console.log("TEST", this.getList())
    },
}
</script>
