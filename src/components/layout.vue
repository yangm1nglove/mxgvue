<template>
    <div>
      <app-header></app-header>
      <app-navbar></app-navbar>
      <app-main></app-main>
    </div>
</template>
<script>
import AppHeader from './AppHeader'
import AppMain from './AppMain'
import AppNavbar from './AppNavbar'
export default {
components:{
  AppHeader,
  AppMain,
  AppNavbar
}
}
</script>
<style lang="scss" scoped>
</style>
