<template>
    <v-col> 
        <div class="skill-col-header">{{this.title}}</div>
        <div class="autocomplete-container">
            <v-autocomplete 
                label="Type your Skill" 
                v-model="skill" 
                full-width  
                :items="skillList" 
                item-text="name" 
                item-value="_id" 
                no-data-text=""
                :search-input.sync="search"
                hide-no-data
                @keyup="checkForMatches"
                >
                    <template v-slot:item="data">
                    <template v-if="typeof data.item !== 'object'">
                    </template>
                    <template v-else>
                        <v-avatar size="30" :color="color(data.item.vp)" class="mr-3" small>
                            <span class="white--text small">{{data.item.vp}}</span>
                        </v-avatar>
                        <v-list-item-content>
                        <v-list-item-title v-html="data.item.name"></v-list-item-title>
                        <v-list-item-subtitle v-html="data.item.group"></v-list-item-subtitle>
                        </v-list-item-content>
                    </template>
                    </template>
            </v-autocomplete>
            <v-btn
                outlined
                @click="addSkillToMyProfile('inRoutine')"
            >
                Add
            </v-btn>
        </div>
        <v-alert type="info" text dense v-if="this.showNotInTheList"> This skill is not <b>yet</b> in our databases, but dont worry! Go ahead and click the ADD button and we'll take care of the rest </v-alert>
        <div class="skill-list">
            <div class="skill-item" v-for="(skill, index) in this.mySkills" :key="index"> 
                <v-avatar size="30" :color="color(skill.vp)" class="mr-3" small>
                    <span class="white--text small">{{skill.vp}}</span>
                </v-avatar>
                <div class="skill-name"> {{skill.name}}</div>
                <v-icon small color="red" @click="()=>deleteSkillFromMyProfile(skill._id)"> mdi-delete </v-icon>
            </div>
        </div>
    </v-col>
</template>

<script lang="ts">
import {color} from "@/lib/colors";

export default {
    name: "TodoList",
    data(){
        return {
            search: '',
            skill: '' ,
            showNotInTheList: false
        }
    },
    methods: {
        addSkillToMyProfile() {
            this.$store.dispatch("addUserSkill", {
                event: this.event,
                mastery: this.mastery, 
                skillId: this.skill,
                skillName: this.search
            }).then(()=>{
                this.skill = '';
                this.showNotInTheList = false;
            })
        },
        deleteSkillFromMyProfile(skillId: string) {
            this.$store.dispatch("deleteUserSkill", {
                event: this.event,
                mastery: this.mastery, 
                skillId,
            })
        },
        checkForMatches() {
            const found = this.skillList.find(element => element.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1);

            if (!found) {
                this.showNotInTheList = true;
            }else{
                this.showNotInTheList = false;
            }
        },
        color: (vp) => {
            return color(vp)
        },
    },
    props: {
        title: {
            type: String,
            default: "Required but empty",
        },
        skillList: {
            type: Array,
            default: ()=>[]
        },
        mySkills: {
            type: Array,
            default: ()=>[]
        },
        event: {
            type: String,
            default: null
        },
        mastery: {
            type: String,
            default: ''
        }
    },
    computed: {
    }
}
</script>

<style lang="scss">
.skill-group {
    .autocomplete-container {
        display: flex;
        align-items: center;
    }
    .skill-group-header {
        font-weight: bold;
        font-size: 1.2rem;
        margin-top: 2rem;
    }
    .skill-col {
        border-left: 1px dotted #666;
    }
    .skill-col-header{
        font-weight: bold;
    }
    .skill-item {
        padding: 0.5rem;
        border: 1px solid #AAA;
        border-radius: 0.25rem;
        margin: 0.5rem;
        display: flex;

        .skill-name {
            flex-grow: 1;
        }

        .skill-difficulty-value {
            padding: 0 0.375rem;
            border-right: 0.125rem solid #666;
            margin-right: 0.375rem;
        }
    }
}
</style>