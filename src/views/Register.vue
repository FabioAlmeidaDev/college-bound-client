<template>
  <v-container>
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline">
          Confirm Athlete's sign up?
        </v-card-title>

        <v-card-text>
          Once you submit this form you will no longer be able to change your information. Would you like to continue with form submission?
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="gray darken-1" text @click="dialog = false">
            Cancel
          </v-btn>

          <v-btn color="primary darken-1" @click="signup()">
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-row class="section">
        <v-col cols="12" class="mb-4 main-container">
          <h3 class="section-header">About you</h3>
          <div class="image-preview-container">
            <v-img :src="url" class="image-preview"></v-img>
            <v-file-input v-model="photo" truncate-length="25" label="Gymnast's Photo" @change="Preview_image" @click:clear="resetPhoto()" required :rules="noEmpty"></v-file-input>
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

      <v-row class="section">
        <v-btn :disabled="!valid" color="success" class="mr-4 register-btn" @click="validate" x-large>
          Register
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
  import axios from "axios";
  //@ts-ignore
  import api from "@/api/covid-server-api";

  export default Vue.extend({
    name: "Register",

    data: () => ({
      snackbar: false,
      snackbar_text: "",
      snackbar_timeout: 5000,
      dialog: false,
      url: "/fem-placeholder.png",
      base64: "",
      photo: null,
      valid: true,
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

      async signup() {
        const response = await api
          .post("/add_athlete", {
            // @ts-ignore
            photo: this.photo ? this.photo.name : "no_image",
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
            if (this.photo) {
              const bodyFormData = new FormData();
              //@ts-ignore
              bodyFormData.append("photo", this.photo);
              const uploadPhoto = axios({
                method: "post",
                // baseURL: "http://localhost:3001",
                baseURL: "https://apexcollegeshowcase-server.herokuapp.com",
                url: "/post_file",
                data: bodyFormData,
                headers: { "Content-Type": "multipart/form-data" },
              })
                .then((response) => {
                  //handle success
                  this.dialog = false;
                  this.snackbar_timeout = 5000;
                  this.snackbar_text = "Thank you! You have successfuly registered for the Apex College Showcase 2020";
                  this.snackbar = true;
                  //@ts-ignore
                  this.$refs.form.reset();
                  this.resetPhoto();
                  return { success: true };
                })
                .catch((response) => {
                  //handle error
                  this.snackbar_timeout = 7000;
                  this.snackbar_text = "Something went wrong while uploading your photo! We could not register you at this time, please try again later or try a different photo";
                  this.snackbar = true;
                  this.dialog = false;
                  return { success: false };
                });
            }
          })
          .catch(() => {
            this.snackbar_timeout = 7000;
            this.snackbar_text = "Something went wrong! We could not register you at this time, please try again later";
            this.snackbar = true;
            this.dialog = false;
            return { success: false };
          });
        this.dialog = false;
        return { success: "not_sure" };
      },
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
