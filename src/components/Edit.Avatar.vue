<template>
    <v-list dense>
        <v-list-item class="px-2">
            <v-list-item-avatar>
            <v-img src="https://randomuser.me/api/portraits/women/85.jpg"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
            <v-list-item-title class="title">
                {{this.$store.state.user.fullName}}
            </v-list-item-title>
            <v-list-item-subtitle>{{this.$store.state.user.email}}</v-list-item-subtitle>
            <v-list-item-action-text class="pt-2">Click to go to your profile</v-list-item-action-text>
            </v-list-item-content>
        </v-list-item>
    </v-list>
</template>

<script lang="ts">

export default {
    name: "EditAvatar",
    props: {
        icon: {
            type: String,
            default: ""
        },
        label: {
            type: String
        },
        route: {
            type: String,
            default: ""
        }
    }
}
</script>