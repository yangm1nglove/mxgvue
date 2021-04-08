<template>
  <div class="header">
    <a href="#">
      <img  class='logo' src="@/assets/img/logo1.png" alt="">
      <span class='company'>梦学谷会员管理系统</span>
    </a>
    <el-dropdown  @command="handleCommand">
      <span class="el-dropdown-link">
        {{user.name}}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="el-icon-edit" command='a'>修改密码</el-dropdown-item>
        <el-dropdown-item icon="el-icon-s-fold" command='b'>退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!-- 修改密码弹出框 -->
    <el-dialog  title="修改密码" :visible.sync="dialogFormVisible" width="400px">
      <el-form :model="ruleForm"  status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="原密码" prop="oldPass">
          <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="$refs['ruleForm'].resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  import {logout} from '@/api/login'
  import passwordApi from '@/api/password'
export default {
     name: "index",
components:{
},
   data() {
     //在return上面声明自定义效验
      const validateOldPass =(rule,value,callback)=>{
        passwordApi.checkPass(this.user.id,value).then(Response=>{
          const resp = Response.data;
          if(resp.flag){
            //验证通过
            callback();
          }else{
            callback(new Error(resp.message));
          }
        })
      }
      //效验确认密码是否一致
      const validatePass=(rule,value,callback)=>{
        if(value !==this.ruleForm.pass){
          callback(new Error('两次输入的密码不一致'))
        }else{
          //相等情况
          callback();
        }
      }
      //在return上面不允许使用,
      return {
        user:JSON.parse(localStorage.getItem('mxg-msm-user')),
        dialogFormVisible:false,
        ruleForm:{ 
          oldPass:"",
          pass:"",
          checkPass:""
        },
        rules:{
          oldPass:[
              { required:true,message:"原密码不能为空",trigger:"blur"},
              { validator: validateOldPass, trigger: 'blur'}
          ],
          pass:[
              {
                required:true,message:"新密码不能为空",trigger:"blur"
              }
          ],
          checkPass:[
              {required:true,message:"确认密码不能为空",trigger:"blur"},
              {validator:validatePass, trigger: "change"} 
          ]
        }
      }
   },
   created(){
   },
   mounted(){
   },
   computed:{
   },
   methods:{
      handleCommand(command) {
        switch (command) {
          case 'a':
            this.handlePwd();
            break;
          case 'b':
            this.handleLogout();
            break;
          default:
            break;
        }
      },
      //退出登录
      handleLogout(){
          logout(localStorage.getItem('mgx-msm-token')).then(Response=>{
                const resp = Response.data
              if(resp.flag){
                //退出成功
                //清除本地数据
                localStorage.removeItem('mgx-msm-token')
                localStorage.removeItem('mxg-msm-user')
                //回到登录页面
                this.$router.push('/login')
              }else{
                this.$message({
                  message:resp.message,
                  type:"warning",
                  duration: 500 //弹出停留时间
                })
              }
          })
      },
      //修改密码
      handlePwd(){
        this.dialogFormVisible=true;
        this.$nextTick(()=>{
          //清空
          this.$refs['ruleForm'].resetFields();
        })
        
      },
      //提交 修改密码
      submitForm(id){
        this.$refs[id].validate(valid=>{
          if(valid){
            passwordApi.updatePwd(this.user.id,this.ruleForm.checkPass).then(Response=>{
              const resp = Response.data;
              //不管失败或者成功,都进行提醒
              this.$message({
                message:resp.message,
                type:resp.flag?"success":"warning"
              })
              if(resp.flag){
                //更新成功,退出系统,回到登录页
                this.handleLogout();
                this.dialogFormVisible =false;
              }
            })
          }else{
            return false;
          }
        })
      }
   },
}
</script>
<style lang="scss" scoped>
  .header{
    position: absolute;
    line-height:50px;
    top:0;
    left:0;
    right:0;
    background: #2d3a4b;
    a{
      img{
        width: 25px;
        vertical-align:middle;
        padding:0px 10px 0px 40px;
      }
      .company{
        color:white;
        position: absolute;
        font-size:20px;
        font-family:"微软雅黑";
      }
    }
    //下拉菜单
    .el-dropdown{
      float: right;
      margin-right:40px;
      cursor: pointer;
      .el-dropdown-link{
        color:white;
      }
    }
  }
</style>
