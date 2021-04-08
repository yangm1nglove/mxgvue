<template>
  <div class="navbar">
    <el-row class="tac">
      <el-col>
        <el-menu
          :router="true"
          default-active="/"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-menu-item index="/">
            <i class="el-icon-s-home"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-menu-item index="/member/">
            <i class="el-icon-user-solid"></i>
            <span slot="title">会员管理</span>
          </el-menu-item>
          <el-menu-item index="/supplier/">
            <i class="el-icon-s-cooperation"></i>
            <span slot="title">供应商管理</span>
          </el-menu-item>
          <el-menu-item index="/goods/">
            <i class="el-icon-s-goods"></i>
            <span slot="title">商品管理</span>
          </el-menu-item>
          <el-menu-item index="/staff/">
            <i class="el-icon-user"></i>
            <span slot="title">员工管理</span>
          </el-menu-item>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
     name: "index",
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
    .navbar{
    position: absolute;
    width: 230px;
    background:#545c64;
    top:49px;
    left:0;
    bottom:0;
    overflow-y:auto;
    .el-menu{
      border-right:none;
    }
  }
</style>
