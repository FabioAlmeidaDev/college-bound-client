<template>
  <v-data-table
    :headers="headers"
    :items="athletes"
    :items-per-page="50"
    class="elevation-1"
  ></v-data-table>
</template>

<script>
// @ is an alias to /src
  //@ts-ignore
  import api from "@/api/covid-server-api";
export default {
  name: 'List',
  data: ()=>({
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
            align: 'start',
            value: 'grad_year',
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
            console.log(this.headers)
          })
          .catch((err) => {
            console.log(err);
          });

      },
    },
    created(){
      console.log("TEST", this.getList())
    }
}
</script>
