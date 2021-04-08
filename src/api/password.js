import request from '@/utils/request';
export default{
  //效验密码(旧密码)
  checkPass(userId,password){
    return request({
      url:"/user/pwd",
      method:"post",
      data:{
        userId,
        password
      }
    })
  },
  //修改密码(新密码)
  updatePwd(userId,password){
    return request({
      url:"/user/pwd",
      method:"put",
      data:{
        userId,
        password,
      }
    })
  }
}