<template>
  <v-container>
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline">
          Would you like to save these changes?
        </v-card-title>

        <v-card-text>
          You will be able to change this later
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="gray darken-1" text @click="dialog = false">
            Cancel
          </v-btn>

          <v-btn color="primary darken-1" @click="saveChanges()">
            Save Changes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <v-dialog v-model="dialog_delete" max-width="290">
      <v-card>
        <v-card-title class="headline">
          Are you sure you want to delete this athlete?
        </v-card-title>

        <v-card-text>
          You will not be able to change this later
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="gray darken-1" text @click="dialog_delete = false">
            Cancel
          </v-btn>

          <v-btn color="pink darken-1 " dark @click="deleteAthlete()">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row> 
      <v-chip class="ml-5" outlined color="blue" @click="()=> this.$router.go('-1')"> 
        <v-icon left>mdi-arrow-left</v-icon>
        Back
      </v-chip>
    </v-row>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-row class="section">
        <v-col cols="12" class="mb-4 main-container">
          <h3 class="section-header">Edit Athlete</h3>
          <div class="image-preview-container">
            <v-text-field v-model="athlete_number" class="athlete-number" label="Athlete Number" clearable/>
            <v-img :src="url" class="image-preview"></v-img>
            <!-- <v-file-input v-model="photo" truncate-length="25" label="Gymnast's Photo" @change="Preview_image" @click:clear="resetPhoto()" required :rules="noEmpty"></v-file-input> -->
          </div>
          <v-text-field v-model="name" :rules="nameRules" label="Full Name (Gymnast's name)" required></v-text-field>
          <v-text-field v-model="clubname" :rules="noEmpty" label="Club/Gym name" required></v-text-field>
          <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>
          <v-select :items="graduatingYears" label="Graduating year" v-model="grad_year" required></v-select>

          <v-text-field v-model="gpa" :rules="gpaRules" label="Current GPA" required></v-text-field>

          <v-text-field v-model="youtube" label="Youtube Channel URL"></v-text-field>

          <v-text-field v-model="instagram" label="Instagram URL"></v-text-field>
        </v-col>
      </v-row>

      <v-row class="section">
        <v-col cols="12" class="mb-4 main-container">
          <h3 class="section-header">About your gymnastics</h3>
          <h4 class="section-sub-header">
            Describe the skills you are currently competing and the skills you are working on
          </h4>
          <br />

          <v-textarea class="text-area-skill" clearable :rules="noEmpty" clear-icon="mdi-close-circle" label="Vault (VT) - Currently Competing" v-model="vt_current" no-resize rows="4" required></v-textarea>
          <v-textarea class="text-area-skill" clearable :rules="noEmpty" clear-icon="mdi-close-circle" label="Vault (VT) - Working on" v-model="vt_working" no-resize rows="4" required></v-textarea>

          <v-textarea class="text-area-skill" clearable :rules="noEmpty" clear-icon="mdi-close-circle" label="Uneven Bars (UB) - Currently Competing" v-model="ub_current" no-resize rows="4" required></v-textarea>
          <v-textarea class="text-area-skill" clearable :rules="noEmpty" clear-icon="mdi-close-circle" label="Uneven Bars (UB) - Working on" v-model="ub_working" no-resize rows="4" required></v-textarea>

          <v-textarea class="text-area-skill" clearable :rules="noEmpty" clear-icon="mdi-close-circle" label="Balance Beam (BB) - Currently Competing" v-model="bb_current" no-resize rows="4" required></v-textarea>
          <v-textarea class="text-area-skill" clearable :rules="noEmpty" clear-icon="mdi-close-circle" label="Balance Beam (BB) - Working on" v-model="bb_working" no-resize rows="4" required></v-textarea>

          <v-textarea class="text-area-skill" clearable :rules="noEmpty" clear-icon="mdi-close-circle" label="Floor Exercise (Fx) - Currently Competing" v-model="fx_current" no-resize rows="4" required></v-textarea>
          <v-textarea class="text-area-skill" clearable :rules="noEmpty" clear-icon="mdi-close-circle" label="Floor Exercise (Fx) - Working on" v-model="fx_working" no-resize rows="4" required></v-textarea>
        </v-col>
      </v-row>

      <v-row class="section" justify="center">
        <v-btn color="red" outlined  @click="validate_delete" x-large class="mr-5 mb-5" >
          Delete this Athlete
        </v-btn>
        <v-btn :disabled="!valid" color="success" class="" @click="validate" x-large>
          Save Changes
        </v-btn>
      </v-row>
    </v-form>
    <v-snackbar v-model="snackbar" :multiline="true" :timeout="this.snackbar_timeout">
      {{ this.snackbar_text }}

      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
  import Vue from "vue";
  //@ts-ignore
  import api from "@/api/covid-server-api";

  export default Vue.extend({
    name: "Register",

    data: () => ({
      id: 0,
      snackbar: false,
      snackbar_text: "",
      snackbar_timeout: 5000,
      dialog: false,
      dialog_delete: false,
      url: "/fem-placeholder.png",
      base64: "",
      photo: null,
      valid: true,
      athlete_number: "",
      name: "",
      clubname: "",
      gpa: "",
      email: "",
      grad_year: "",
      youtube: "",
      instagram: "",
      vt_current: "",
      vt_working: "",
      ub_current: "",
      ub_working: "",
      bb_current: "",
      bb_working: "",
      fx_current: "",
      fx_working: "",

      nameRules: [(v: any) => !!v || "Name is required", (v: any) => (v && v.length <= 200) || "Name must be less than 200 characters"],
      emailRules: [(v: any) => !!v || "E-mail is required", (v: any) => /.+@.+\..+/.test(v) || "E-mail must be valid"],
      noEmpty: [(v: any) => !!v || "Required"],
      gpaRules: [(v: any) => !!v || "Current GPA is required", (v: any) => /[0-9]{1}\.[0-9]{1}/.test(v) || "GPA must be in the format 4.0"],
      urlRulesYT: [(v: any) => /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(v) || "https://www.youtube.com/channel/YourChannelUniqueId"],
      urlRulesINSTA: [(v: any) => /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(v) || "https://www.instagram.com/YourInstagramName/"],
    }),
    methods: {
      validate() {
        // @ts-ignore
        this.valid = this.$refs.form.validate();
        if (this.valid) {
          this.dialog = true;
        }
      },
      validate_delete() {
        // @ts-ignore
          this.dialog_delete = true;
      },
      Preview_image() {
        if (this.photo) {
          this.url = URL.createObjectURL(this.photo);
          this.tobase64(this.photo);
        }
      },
      resetPhoto() {
        this.url = "/fem-placeholder.png";
      },
      async tobase64(img: Blob | null) {
        if (img) {
          let base64data: string | ArrayBuffer | null = "";
          const reader = new FileReader();
          await reader.readAsDataURL(img);
          reader.onloadend = () => {
            base64data = reader.result;
            this.base64 = base64data ? base64data.toString() : "";
            return base64data ? base64data.toString() : "";
          };
        }
        return img;
      },

      async saveChanges() {
        const response = await api
          .post("/save_athlete", {
            // @ts-ignore
            id: this.id,
            athlete_number: this.athlete_number,
            name: this.name,
            clubname: this.clubname,
            email: this.email,
            gpa: this.gpa,
            grad_year: this.grad_year,
            youtube: this.youtube,
            instagram: this.instagram,
            vt_current: this.vt_current,
            vt_working: this.vt_working,
            ub_current: this.ub_current,
            ub_working: this.ub_working,
            bb_current: this.bb_current,
            bb_working: this.bb_working,
            fx_current: this.fx_current,
            fx_working: this.fx_working,
          })
          .then(() => {
            this.$router.push("/list");
          })
          .catch(() => {
            this.snackbar_timeout = 7000;
            this.snackbar_text = "Something went wrong! We could not register you at this time, please try again later";
            this.snackbar = true;
            this.dialog = false;
            this.$router.push("/list");
            return { success: false };
          });
        this.dialog = false;
        this.$router.push("/list");
        return { success: "not_sure" };
      },
    
      async deleteAthlete() {
        const response = await api
          .post("/delete_athlete", {id: this.id}).then( (res: any) => {
            this.$router.push("/list");
          }).catch(() => {
            this.$router.push("/list");
          })
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
    async mounted(){
        const { id } = this.$route.params;
        const response = await api
          .post("/athletes/find", {id}).then((res: any) => {
            this.id = res.data._id;
            this.url= "https://apexcollegeshowcase-server.herokuapp.com/get_file/"+res.data.photo;
            this.athlete_number= res.data.athlete_number;
            this.name= res.data.name;
            this.clubname= res.data.clubname;
            this.email= res.data.email;
            this.gpa= res.data.gpa.toFixed(1);
            this.grad_year= res.data.grad_year;
            this.youtube= res.data.youtube;
            this.instagram= res.data.instagram;
            this.vt_current= res.data.vt_current;
            this.vt_working= res.data.vt_working;
            this.ub_current= res.data.ub_current;
            this.ub_working= res.data.ub_working;
            this.bb_current= res.data.bb_current;
            this.bb_working= res.data.bb_working;
            this.fx_current= res.data.fx_current;
            this.fx_working= res.data.fx_working;
          });
    }
  });
</script>

<style lang="scss">
.athlete-number{
  input{
    font-size:1.8rem;
    text-align: center;
        padding: 0px;
    line-height: 2.5rem;
  }
  .v-text-field__slot{
    height: 2.5rem !important;
  }
}
  .text-area-skill {
    textarea {
      padding-top: 0.5rem;
    }
  }
  .register-btn {
    width: 90%;
    margin-left: auto;
    margin-right: auto;
  }
  .section {
  }
  .section-header {
    color: #78aa01;
    text-align: left;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #78aa01;
    margin-bottom: 2rem;
  }
  .section-sub-header {
    color: #666;
  }
  .main-container {
    padding: 2rem !important;
  }
  .image-preview-container {
    width: 280px;
    margin-left: auto;
    margin-right: auto;
    border: 1px solid #ccc;
    padding: 1rem;
    background-color: white;
    box-shadow: 2px 2px 5px #ccc;
    margin-bottom: 1.5rem;
  }
  .image-preview {
    height: 250px;
  }
</style>
