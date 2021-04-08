import Vue from 'vue'
import VueRouter from 'vue-router'
//默认会导入index页面
import Login from '../views/login'
import Layout from '@/components/layout'
import Home from '@/views/home'
import Goods from '@/views/goods'
import MemBer from '@/views/member'
import Staff from '@/views/staff'
import Supplier from '@/views/supplier'
Vue.use(VueRouter)
const routes = [
      //登录
      {
        path:'/login',
        name:"login",//路由名称
        component:Login//组件对象
      },
    //布局
    {
      path:"/",
      name:"layout",
      component:Layout,
      redirect:"/home",
      //子路由
      children:[
        {
          path: '/home',
          component: Home,
          meta: {title: "首页"}
        }
      ]
    },
    {
      path:"/member",
      component:Layout,
      //子路由
      children:[
        {
          path: '/member/',
          component: MemBer,
          meta: {title: "会员管理"}
        }
      ]
    },
    {
      path:"/supplier",
      component:Layout,
      //子路由
      children:[
        {
          path: '/supplier/',
          component: Supplier,
          meta: {title: "供应商管理"}
        }
      ]
    },
    {
      path:"/goods",
      component:Layout,
      //子路由
      children:[
        {
          path: '/goods/',
          component: Goods,
          meta: {title: "商品管理"}
        }
      ]
    },
    {
      path:"/staff",
      component:Layout,
      //子路由
      children:[
        {
          path: '/staff/',
          component: Staff,
          meta: {title: "员工管理"}
        }
      ]
    },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router