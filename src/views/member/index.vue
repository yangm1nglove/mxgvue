<template>
    <div>
      <!-- 数据列表 
         :data 指定渲染的数据
         border 表格边框
         prop:字段名
       -->
      <!-- 头部组件   :inline="true"表单一行显示,行内表单 -->
      <el-form ref='searchMap' :inline="true" :model="searchMap" class="demo-form-inline">
         <!-- 重置会看el-form-item组件元素的prop上是否指定了字段名,制定了才会重置生效 -->
         <el-form-item prop="cardNum">
            <el-input v-model="searchMap.cardNum" placeholder="商品卡号"></el-input>
         </el-form-item>
         <el-form-item prop="name">
            <el-input v-model="searchMap.name" placeholder="会员名称"></el-input>
         </el-form-item>
         <el-form-item prop='payType'>
            <el-select v-model="searchMap.payType" placeholder="支付类型">
               <!-- 不要忘记将payTypeOptions绑定到data中 -->
               <el-option v-for="item in payTypeOptions" :key="item.type" :label="item.name" :value="item.type"></el-option>
            </el-select>
         </el-form-item>
         <el-form-item prop="birthday">
            <!-- value-format:指定绑定值的格式 -->
            <el-date-picker
               type="date"
               v-model="searchMap.birthday"
               value-format="yyyy-MM-dd"
               placeholder="出生日期">
            </el-date-picker>
         </el-form-item>
         <el-form-item>
            <el-button type="primary" @click="fetchData">查询</el-button>
            <el-button  @click="resetForm('searchMap')">重置</el-button>
            <!-- 新增给弹出框设置true弹出弹出框 -->
            <el-button  @click="handleAdd">新增</el-button>
         </el-form-item>
      </el-form>
      <!-- 内容组件 -->
      <el-table
         :data="list"
         height="380"
         border
         style="width: 100%">
         <!-- type=index 获取所引值,从1开始 label:显示标题 prop:显示字段名  width:指定列宽-->
         <el-table-column type="index" label="序号" width='60px'></el-table-column>
         <el-table-column prop="cardNum" label="会员卡号"></el-table-column>
         <el-table-column prop="name" label="会员姓名" width="90px"></el-table-column>
         <el-table-column prop="birthday" label="会员生日"></el-table-column>
         <el-table-column prop="phone" label="手机号码"></el-table-column>
         <el-table-column prop="integral" label="可用积分"></el-table-column>
         <el-table-column prop="momey" label="开卡金额"></el-table-column>
         <el-table-column prop="payType" label="支付类型" width='80px'>
            <template slot-scope="scope">
               <span>{{scope.row.payType | payTypeFilter}}</span>
            </template>
         </el-table-column>
         <el-table-column prop="address" label="会员地址"></el-table-column>
         <el-table-column label="操作" width='150px'>
            <template slot-scope="scope">
            <el-button
               size="mini"
               @click="handleEdit(scope.row.id)">编辑</el-button>
            <el-button
               size="mini"
               type="danger"
               @click="handleDelete(scope.row.id)">删除</el-button>
            </template>
         </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-pagination
         @size-change="fetchData"
         @current-change="fetchData"
         :current-page="currentPage"
         :page-sizes="[10,20,50]"
         :page-size="this.pageSize"
         layout="total, sizes, prev, pager, next, jumper"
         :total="total">
      </el-pagination>

      <!-- 弹出新增窗口 -->
      <el-dialog title="会员编辑" :visible.sync="dialogFormVisible" width="500px">
         <el-form 
         ref="pojoForm"
         :rules="rules"
         label-position="right"
         style='width:400px;'
         label-width="100px"
         :model="pojo">
            <el-form-item label="会员卡号" prop="cardNum">
               <el-input v-model="pojo.cardNum" ></el-input>
            </el-form-item>
            <el-form-item label="会员姓名" prop="name">
               <el-input v-model="pojo.name" ></el-input>
            </el-form-item>
            <el-form-item label="会员生日">
               <!-- value-format:指定绑定值的格式 -->
               <el-date-picker
                  type="date"
                  v-model="pojo.birthday"
                  value-format="yyyy-MM-dd"
                  placeholder="出生日期">
               </el-date-picker>
            </el-form-item>
            <el-form-item label="手机号码">
               <el-input v-model="pojo.phone" ></el-input>
            </el-form-item>
            <el-form-item label="开卡金额">
               <el-input v-model="pojo.money" ></el-input>
            </el-form-item>
            <el-form-item label="可用积分">
               <el-input v-model="pojo.integral" ></el-input>
            </el-form-item>
            <el-form-item label="支付类型" prop="payType">
               <el-select v-model="pojo.payType" placeholder="支付类型">
               <!-- 不要忘记将payTypeOptions绑定到data中 -->
                  <el-option v-for="item in payTypeOptions" :key="item.type" :label="item.name" :value="item.type"></el-option>
               </el-select>
            </el-form-item>   
            <el-form-item label="会员地址" prop="address">
               <el-input v-model="pojo.address" ></el-input>
            </el-form-item>
         </el-form>
         <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <!-- <el-button type="primary" @click="addData('pojoForm')">确 定</el-button> -->
            <el-button type="primary" @click="pojo.id===null?addData('pojoForm'):updateData('pojoForm')">确 定</el-button>
         </div>
      </el-dialog>
    </div>
</template>
<script>
//导出对象
import memberApi from '../../api/member'
//支付类型
const payTypeOptions = [
   {type:"1", name:"现金"},
   {type:"2", name:"微信"},
   {type:"3", name:"支付宝"},
   {type:"4", name:"银行卡"},
]
export default {
     name: "index",
components:{
},
   data() {
      return {
         list:[],
         total: 0, //总记录数
         currentPage:1,//默认选中第一页
         pageSize:10,//每一页显示10条数据
         searchMap:{
            cardNum:"",
            name:"",
            payType:"",
            birthday:""
         }, //条件查询绑定的条件值
         payTypeOptions,
         //控制对话框是否弹出
         dialogFormVisible:false,
         //提交的数据  
         pojo:{
            id:null,
            integral:"",
            cardNum:"",
            name:"",
            birthday:"",
            phone:"",
            money:0,
            integral:0,
            payType:"",
            address:"",
         },
         rules:{
            //不能为空效验
            cardNum:[
               {required:true,message:"卡号不能为空",trigger:'blur'},
            ],
            name:[
               {required:true,message:"姓名不能为空",trigger:'blur'},
            ],
            payType:[
               {required:true,message:"支付类型不能为空",trigger:'change'},
            ]
         }
      }
   },
   created(){
      //初始化获取列表数据
      this.fetchData();
   },
   mounted(){
   },
   computed:{
   },
   methods:{
      fetchData(){
         //导出方法

            // 调用分页查询数据
            memberApi.search(this.currentPage,this.pageSize,this.searchMap).then(Response=>{
               const resp = Response.data
               this.list = resp.data.rows
               this.total = resp.data.total
         })
      },
      //重置
      resetForm(formName){
         console.log('重置按钮',formName);
         this.$refs[formName].resetFields();
      },
      //提交数据
      addData(forName){
         this.$refs[forName].validate(valid =>{
            if(valid){
               //提交表单
               console.log('提交成功');
               memberApi.add(this.res).then(res => {
                  const resp =res.data
                  if(resp.flag){
                     //新增成功,刷新重新获取列表数据
                     this.fetchData();
                     this.dialogFormVisible = false
                  }else{
                     //失败提示信息
                     this.$message({
                        message:resp.message,
                        type:"warning",
                     })
                  }
               })
            }else{
               return false;
            }
         })
      },
      //弹出新增窗口
      handleAdd(){
         this.pojo = {}
         this.dialogFormVisible = true
         this.$nextTick(()=>{
            //this.$nextTick它是一个异步事件
            //弹出窗口打开后,需要重新加载DOM
             this.$refs['pojoForm'].resetFields()
         })
      },
      //编辑操作
      handleEdit(id){
         this.handleAdd();
         memberApi.getById(id).then(response=>{
          const resp = response.data;
          if(resp.flag){
             this.pojo=resp.data;
          }
         })
      },
      //删除操作
      handleDelete(id){
         this.$confirm('是否删除此项', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           memberApi.deleteById(id).then(response =>{
             const resp = response.data
             if(resp.flag){
               //刷新列表数据
               this.fetchData();                
             }
           })
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      //编辑
      updateData(formName){
         console.log('updateData');
         this.$refs[formName].validate(valid=>{
            if(valid){
               //提交更新
               memberApi.update(this.pojo).then(response=>{
                  const resp =response.data;
                  if(resp.flag){
                     //刷新列表
                     this.fetchData();
                     this.dialogFormVisible = false;
                  }else{
                     this.$message({
                        message:resp.message,
                        type:'warning',
                     })
                  }
               })
            }else{
                  return false;
            }
         })
      }
   },
   filters:{
      payTypeFilter(type){
         const payObj = payTypeOptions.find(obj => obj.type === type)
         return  payObj ? payObj.name:null
      }
   }
}
</script>
<style lang="scss" scoped>
   .demo-form-inline{
      margin-top:25px;
   }
</style>
