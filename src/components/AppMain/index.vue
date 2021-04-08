<template>
  <div class="main">
    <!-- 导航栏 -->
    <main-link v-show="$route.path !=='/home'"></main-link>
    <router-view />
  </div>
</template>
<script>
import MainLink from './Link'
export default {
     name: "index",
components:{
  MainLink
},
   data() {
      return {
      }
   },
   created(){
   },
   mounted(){
   },
   computed:{
   },
   methods:{
   },
}
</script>
<style lang="scss" scoped>
     .main{
    position: absolute;
    top:49px;
    left:230px;
    padding:10px;
    overflow-x:auto;
    right:0;
    bottom:0;
  }
</style>
