import Vuex from 'vuex';
import Vue from 'vue';
import axios from 'axios';
import router from '@/router/index';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        test: "this is test",
        user: {
            email: "",
            password: "",
            token: "",
        },
        login: {
            error: false,
            status: false,
            message: ""
        },
        skillList: {
            vault: [],
            bars: [],
            beam: [],
            floor: [],
            all: []
        },
        gymsList: [],
        userSkills: {
            vault: {
                inRoutine: [],
                canCompete: [],
                workingOn: []
            },
            bars: {
                inRoutine: [],
                canCompete: [],
                workingOn: []
            },
            beam: {
                inRoutine: [],
                canCompete: [],
                workingOn: []
            },
            floor: {
                inRoutine: [],
                canCompete: [],
                workingOn: []
            },                                    
        }
    },
    mutations: {
        setUserInfo(state: any, payload) {
            delete payload["password"];
            const keys= Object.keys(payload);
            for (const key of keys) {
                if (key in state.user){
                    state.user[key] = payload[key];
                }
            }
        },
        setEmail(state, payload) {
            state.user.email = payload;
        },
        setPassword(state, payload) {
            state.user.password = payload;
        },
        setToken(state, payload) {
            state.user.token = payload;
        },
        setLogin(state, payload) {
            const {status, message, error} = payload;
            state.login.status = status;
            state.login.message = message;
            state.login.error = error;

        },
        setUser(state: any, payload) {
            delete payload["password"];
            state.user = payload;
        },
        setSkillList(state: any, payload) {
            state.skillList[payload.event] = payload.data.data;
        },
        setGymList(state: any, payload) {
            state.gymsList = payload;
        },
        addToGymList(state: any, payload) {
            state.gymsList.push(payload);
        },
        setUserSkills(state: any, payload) {
            state.userSkills[payload.event] = payload.data;
        },
    },
    actions: {
        async signin(state, route = ""){
            this.commit("setLogin",{status: false, error: false, message: ""})
            await axios.post("http://localhost:3001/signin",{email:this.state.user.email, password:this.state.user.password })
            .then((result)=>{
                if(result.data?.data?.token){
                    const token = result.data.data.token;
                    const user = result.data.data.user;
                    this.commit("setToken",token);
                    router.push(`/${route}`);
                    this.commit("setLogin",{status: true, error: false, message: ""});
                    this.commit("setUser", {...user,token});
                    this.commit("setPassword","");
                } else {
                    this.commit("setLogin",{status: false, error: true, message: "We are having some problems logging you in, please check your user name and password and try again."})
                }
            });
        },
        async logout(){
            await axios.get("http://localhost:3001/signout")
            .then((result)=>{
                const token = result.data.token;
                this.commit("setToken",token);
                router.push("/");
            }).finally(()=>{
                this.commit("setPassword","")
            })
        },
        async reset(state){
            return await axios.post("http://localhost:3001/forgot",{email:this.state.user.email, baseURL: window.location.host })
            .then((result)=>{
                return result;
            });
        },
        async changePassword(state, t= ""){
            const user= {
                email:this.state.user.email, password: this.state.user.password
            };
            return await axios.post("http://localhost:3001/update",{user, token: t})
            .then((result)=>{
                return result;
            });
        },
        async updateUser(state, data){
            const { token, user} = data;
            return await axios.post("http://localhost:3001/update",{user, token})
            .then((result)=>{
                return result;
            });
        },
        async register(state, user){
            return await axios.post("http://localhost:3001/signup",user)
            .then((result)=>{
                return result;
            });
        },
        async getSkills(state, event) {
            return await axios.post("http://localhost:3001/skills",{event})
            .then((result)=>{
                this.commit("setSkillList", {event, data:result});
                return result;
            });           
        },
        async addSkill(state, data) {
            return await axios.post("http://localhost:3001/skills/add", {...data})
            .then((result) => {
                this.commit("setSkillList", {event:"all", data:result});
            })
        },
        async deleteSkill(state, id) {
            return await axios.post("http://localhost:3001/skills/delete", id)
            .then((result) => {
                this.commit("setSkillList", {event:"all", data:result});
            })
        },
        async saveEditedSkill(state, data) {
            return await axios.post("http://localhost:3001/skills/edit", {...data})
            .then((result) => {
                this.commit("setSkillList", {event:"all", data:result});
            })
        },
        async addGym(state, payload){
            const p = {
                token: this.getters.getToken,
                name: payload.name,
                addedFrom: payload.addedFrom
            }
            return await axios.post("http://localhost:3001/gym/add", p)
            .then((result)=>{
                return result;
            });
        },
        async getGyms(state, event) {
            return await axios.get("http://localhost:3001/gym/list")
            .then((result)=>{
                this.commit("setGymList", result.data);
                return result.data;
            });           
        },
        async getUserSkills(state, event) {
            return await axios.post("http://localhost:3001/skills/user/list", {token: this.getters.getToken, event})
            .then((result)=>{
                this.commit("setUserSkills", {event: event, data: result.data});
                return result.data;
            });           
        },
        async addUserSkill(state, payload) {
            return await axios.post("http://localhost:3001/skills/user/add", {token: this.getters.getToken, event: payload.event, mastery: payload.mastery, skillId: payload.skillId, skillName: payload.skillName})
            .then((result)=>{
                this.commit("setUserSkills", {event: payload.event, data: result.data});
                this.dispatch("getSkills", payload.event);
                return result.data;
            });           
        },
        async deleteUserSkill(state, payload) {
            return await axios.post("http://localhost:3001/skills/user/delete", {token: this.getters.getToken, event: payload.event, mastery: payload.mastery, skillId: payload.skillId, skillName: payload.skillName})
            .then((result)=>{
                this.commit("setUserSkills", {event: payload.event, data: result.data});
                return result.data;
            });           
        },
    },
    getters: {
        getEmail:(state)=>state.user.email,
        getToken:(state)=>state.user.token,
        login:(state)=>state.login,
        getSkillList: (state) => {
            return (event: string) => {
                return state.skillList[event];
            }
        },
        gymsList: (state) => state.gymsList,
        userSkills: (state) => state.userSkills
    },
    modules: {
        user_test: {
            state: {},
            mutations: {},
            actions: {},
            getters: {},
        }
    }
})