import axios from 'axios';
//懒加载 
import { Loading,Message } from 'element-ui';


const loading = {
    loadingInstance:null,
    // 打开加载
    open:function(){
        // 创建实例 而且打开加载窗口
        if(this.loadingInstance === null){
            console.log('创建实例加载中....');
            this.loadingInstance =Loading.service({target:'.main',text:"拼命加载中..."});
        }
    },
    // 关闭加载
    close:function(){
        // 不能为空 则关闭加载窗口
        if(this.loadingInstance !==null){
            this.loadingInstance.close();
        }
        this.loadingInstance = null
    }
}

const request = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,//基础路径
    timeout: 5000, //请求超时 5000毫秒
    
})
//请求拦截器
request.interceptors.request.use(config=>{
    //懒加载
    loading.open();
    //请求拦截
    return config
},error=>{
    //请求失败,关闭懒加载
    loading.close();
    return Promise.reject(error);
})

//响应拦截器
request.interceptors.response.use(response=>{
    //响应成功
    loading.close();
    const resp = response.data;
    if(resp.code !==2000){
        Message({
            message:resp.message ||"系统异常",
            type:"warning",
            duration:5*1000
        })
    }
    return response
},error=>{
    //响应失败
    loading.close();
    Message({
        message:error.message,
        type:"error",
        duration:5*1000  
    })
    return Promise.reject(error);
})
export default request  //导出自定义axios对象