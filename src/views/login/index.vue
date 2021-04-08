<template>
    <div class='login-container'>
        <el-form ref="form" :model="form"  :rules="rules" label-width="80px" class='login-form'>
            <h2 class='login-title'>梦学谷会员管理系统</h2>
            <el-form-item label="账号" class='login-username' prop="username">
                <el-input v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop='password'>
                <el-input v-model="form.password" type="password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('form')">确认</el-button>
            </el-form-item>
        </el-form>   
    </div>
</template>
<script>
  //导入方法
  import {login,getUserInfo} from '@/api/login'
  export default {
    data() {
      return {
        form: {
            username:"",
            password:""
        },
        rules:{
          username:[
            { required: true, message: '请输入账号', trigger: 'blur' },
            { min: 3, max: 5, message: '账号长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          password:[
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 3, max: 5, message: '密码长度在 3 到 5 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      //提交按钮

      /*
        操作思路,点击提交按钮 判断是否过了正则验证,如果过了执行
        提交表单给狗太验证是否正确,接收返回值 如果验证成功获取token信息
        保存token并且跳转到首页 
      */
      submitForm(formName) {
              this.$refs[formName].validate((valid) => {
                if (valid) {
                  // 提交表单给后台验证是否正确 
                  login(this.form.username,this.form.password).then(Response=>{
                    const resp = Response.data;
                    if(resp.flag){
                      //验证成功,通过token获取用户信息
                      getUserInfo(resp.data.token).then(Response=>{
                        const respUser =Response.data;
                        if(respUser.flag){
                                                  //获取到用户信息
                        console.log(respUser.data);
                        //保存token
                        localStorage.setItem('mxg-msm-user',JSON.stringify(respUser.data));
                        localStorage.setItem('mxg-msm-token',resp.data.token);
                        //前往首页
                        this.$router.push('/');
                        }else{
                          //获取失败
                          this.$message({
                            message: respUser.message,
                            type: 'warning'
                          });
                        }
                      })
                    }else{
                        this.$message({
                          message: resp.message,
                          type: 'warning'
                        });
                    }
                  })
                } else {
                  //直接后台返回 不提交
                  console.log('验证失败,请检查用户名密码是否符合规则');
                  return false;
                }
              });
            },
    }
  }
</script>
<style scoped>
    .login-form{
        width: 350px;
        margin:160px auto;
        background: rgb(255, 255, 255,0.8);
        padding:28px;
        border-radius:20px;
    }
    .login-form .login-title{
        text-align:center;
        color:#303133;
        font-size:25px;
        font-family:"微软雅黑";
    }
    .login-username{
        margin-top:20px;
    }
    .login-container{
        position: absolute;
        width: 100%;    
        height: 100%;
        background:url('../../assets/img/login.jpg') no-repeat;
        background-size:100% 100%;
    }
</style>