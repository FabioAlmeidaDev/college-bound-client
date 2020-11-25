import Vuex from 'vuex';
import Vue from 'vue';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        test: "this is test",
        user: {
            email: "",
            password: "",
            token: "",
        }
    },
    mutations: {
        setEmail(state, payload) {
            state.user.email = payload;
        },
        setPassword(state, payload) {
            state.user.password = payload;
        },
        setToken(state, payload) {
            state.user.token = payload;
        }
    },
    actions: {
        async signin(){
            await axios.post("http://localhost:3001/signin",{email:this.state.user.email, password:this.state.user.password })
            .then((result)=>{
                const token = result.data.token;
                this.commit("setToken",token);
            }).finally(()=>{
                this.commit("setPassword","")
            })
        },
        async logout(){
            await axios.get("http://localhost:3001/signout")
            .then((result)=>{
                const token = result.data.token;
                this.commit("setToken",token);
            }).finally(()=>{
                this.commit("setPassword","")
            })
        }

    },
    getters: {
        getEmail:(state)=>state.user.email,
        getToken:(state)=>state.user.token
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