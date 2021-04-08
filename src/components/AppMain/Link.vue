<template>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item class='left' :to="{ path: $route.path }">{{$route.meta.title}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>
<script>
export default {
     name: "Link",
components:{
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
  .el-breadcrumb{
    height:10px;
    padding:20px;
    border-radius:4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  .left{
    border-left: 3px solid #31c17b;
    padding-left: 10px;
  }
</style>
