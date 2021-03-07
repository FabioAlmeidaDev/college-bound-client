<template>
    <div class="skill-group">
        <div class="skill-group-header purple--text text-darken-1">{{this.groupTitle}}</div>
        <v-col cols="12">
            <v-row>
                <todo-list
                    title="Skills in current routine"
                    :skill-list="skillList"
                    :event="this.event"
                    :my-skills="this.inRoutine"
                    mastery="inRoutine"
                />

                <todo-list
                    title="Skills ready to compete"
                    :skill-list="skillList"
                    :event="this.event"
                    :my-skills="this.canCompete"
                    mastery="canCompete"
                />

                <todo-list
                    title="Skills I am working on"
                    :skill-list="skillList"
                    :event="this.event"
                    :my-skills="this.workingOn"
                    mastery="workingOn"
                />
            </v-row>
        </v-col>
    </div>
</template>

<script lang="ts">
import TodoList from "@/components/TodoList";

export default {
    name: "SkillGroup",
    components: {
        TodoList
    },
    data(){
        return {
            search: {},
            skill: {} ,
            skills: {
                vault: [
                    {
                        name:'',
                        group: '',
                        vp: '',
                        event: '',
                        tags: '',
                        type: ''
                    }

                ]
            },
            searchVault: null
        }
    },
    methods: {
        addSkillToMyProfile(mastery: string) {
            this.$store.dispatch("addUserSkill", {
                event: this.event,
                mastery, 
                skillId: this.skill[mastery]
            }).then(()=>{
                this.skill[mastery] = '';
            })
        }
    },
    props: {
        groupTitle: {
            type: String,
            default: "Required but empty",
        },
        skillList: {
            type: Array,
            default: ()=>[]
        },
        event: {
            type: String,
            default: null
        }
    },
    watch: {
      searchVault(val: any){
        this.skills.vault = this.skills.vault.filter(item => item.type !== "user-added")
        const found = this.skills.vault.find(element => element.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
        if (!found) {
            const newItem = {
                name: val,
                group: '',
                event: 'vault',
                vp: '',
                tags: '',
                type: "user-added"
            }
            this.skills.vault.push(newItem)
        }
        }
      
    },
    computed: {
        inRoutine() {
            return this.$store.getters.userSkills[this.event].inRoutine;
        },
        canCompete() {
            return this.$store.getters.userSkills[this.event].canCompete;
        },
        workingOn() {
            return this.$store.getters.userSkills[this.event].workingOn;
        },
    },
    mounted() {
        this.$store.dispatch("getUserSkills", this.event);
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