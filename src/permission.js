/**
  权限效验:
    vue router中的 前置钩子函数 beforeEach()
    当进行路由跳转之前,进行判断 是否已经登陆过 登陆过则访问非登录页面 
    否则回到登录页
    **/
import router from './router'
import {getUserInfo} from './api/login'
/*
  to:即将要进入的路由对象
  from:即将要离开的路由对象
  next:可以指定路由地址,进行路由跳转
*/
router.beforeEach((to,from,next)=>{
  /*获取token
    如果没有获取到,要访问非登录页,则不让访问 回到登录页面
    获取到token, 
      1.请求路由 /login 那就去目标路由
      2.请求的路由非登录页,就通过token去获取用户信息,如果获取到用户信息,则进入非登录页面,否则回到登录页
  */
 const token = localStorage.getItem('mxg-msm-token');
  if(!token){
    // 如果没有获取到,要访问非登录页,则不让访问 回到登录页面
    if(to.path !== '/login'){
      next({
        path:"/login"
      })
    }else{
      next()
    }
  }else{
    // 获取到token, 
    // 请求路由 /login 那就去目标路由
    if(to.path ==='/login'){
      next()
    }else{
      
      //现在本地查看是否有用户信息,
      const userInfo = localStorage.getItem('mxg-msm-user');
      if(userInfo){
        //本地获取到 则直接去目标路由
        next()
      }else{
        // 请求的路由非登录页,就通过token去获取用户信息,
        getUserInfo(token).then(Response=>{
          const resp = Response.data;
          if(resp.flag){
            //如果获取到用户信息,则进入非登录页面,否则回到登录页
            //保存到本地
            localStorage.setItem('mxg-msm-user', JSON.stringify(resp.data));
            next()
          }else{
            //未获取到用户信息,则重新登录
            next({path:"/login"})
          }
        })

      }
    }
  }
})