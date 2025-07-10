<script setup>
import Navbar from './components/Navbar.vue'
import { useUserStore } from './stores/user'

const userStore = useUserStore()
</script>

<template>
  <div>
    <Navbar v-if="userStore.isLoggedIn" />
    <router-view />
  </div>
</template>

<style>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}
</style>
