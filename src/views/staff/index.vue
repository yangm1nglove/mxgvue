<template>
   <div>
      <!-- 搜索框 -->
      <el-form :inline="true" :model="searchMap" class="demo-form-inline" ref='searchForm'>
         <el-form-item prop="username">
            <el-input v-model="searchMap.username" placeholder="账号"></el-input>
         </el-form-item>
         <el-form-item prop="name">
            <el-input v-model="searchMap.name" placeholder="姓名"></el-input>
         </el-form-item>
         <el-form-item>
            <el-button type="primary" @click='fetchData'>查询</el-button>
            <el-button type="primary" @click='handAdd'>新增</el-button>
            <el-button @click="$refs['searchForm'].resetFields()">重置</el-button>
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
         <el-table-column prop="username" label="账号"></el-table-column>
         <el-table-column prop="name" label="姓名" width="90px"></el-table-column>
         <el-table-column prop="age" label="年龄"></el-table-column>
         <el-table-column prop="mobile" label="电话"></el-table-column>
         <el-table-column prop="salary" label="薪酬"></el-table-column>
         <el-table-column prop="entryDate" label="入职时间"></el-table-column>
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
      <!-- 分页插件 -->
      <el-pagination
         @size-change="handleSizeChange"
         @current-change="handleCurrentChange"
         :current-page="currentPage"
         :page-sizes="[10,20,50]"
         :page-size="pageSize"
         layout="total, sizes, prev, pager, next, jumper"
         :total="total">
      </el-pagination>
      <!-- 弹出框 -->
      <el-dialog title="编辑商品" :visible.sync="dialogFormVisible" width='500px'>
         <el-form 
         ref="pojoForm"
         :rules="rules"
         label-position="right"
         style='width:400px;'
         label-width="100px"
         :model="pojo">
            <el-form-item label="账号" prop="username">
               <el-input v-model="pojo.username" ></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="name">
               <el-input v-model="pojo.name" ></el-input>
            </el-form-item>
            <el-form-item label="年龄" prop="age">
               <el-input v-model="pojo.age" ></el-input>
            </el-form-item> 
            <el-form-item label="电话" prop="mobile">
               <el-input v-model="pojo.mobile" ></el-input>
            </el-form-item>
            <el-form-item label="薪酬" prop="salary">
               <el-input v-model="pojo.salary" ></el-input>
            </el-form-item>
            <el-form-item label="入职时间" prop="entryDate">
               <el-input v-model="pojo.entryDate" ></el-input>
            </el-form-item>
         </el-form>
         <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="pojo.id===null?addData('pojoForm'):updateData('pojoForm')">确 定</el-button>
         </div>
      </el-dialog>
   </div>
</template>
<script>
   import staffApi from '@/api/staff';
   export default{
      data(){
         return{
            //数据集合
            list:[],
            //总数量
            total:0,
            //初始页码
            currentPage:1,
            //每页显示条数
            pageSize:10,
            searchMap:{
               username:"",
               name:"",
            },
            //默认窗口关闭
            dialogFormVisible:false,
            //正则验证
            rules:{
            username:[
               {
                  required:true,message:"账号不能为空",trigger:"blur"
               }
            ],
            name:[
               {
                  required:true,message:"姓名不能为空",trigger:"blur"
               }
            ],
            },
            pojo:{
               id:null,
               username:"",
               name:"",
               age:"",
               mobile:"",
               salary:"",
               entryDate:""
            }
         }
      },
      created(){
         this.fetchData();
      },
      methods:{
         //数据请求
         fetchData(){
            staffApi.search(this.currentPage,this.pageSize,this.searchMap).then(res=>{
               const resp = res.data.data.rows;
               this.list = resp;
               this.total = res.data.data.total;
            })
         },
         //每页显示条数
         handleSizeChange(val){
            this.pageSize=val;
            this.fetchData();
         },
         //共计多少页
         handleCurrentChange(val){
            this.currentPage=val;
            this.fetchData();
         },
         //新增按钮
         handAdd(){
            this.dialogFormVisible=true
            this.$nextTick(()=>{
               this.$refs['searchForm'].resetFields();
            })
         },
         //新增提交按钮
         addData(forName){
            this.$refs[forName].validate(valid=>{
               if(valid){
                  staffApi.add(this.pojo).then(res=>{
                     const resp =res.data;
                     if(resp.flag){
                        this.fetchData();
                        //初始密码0000
                        this.$message({
                           message:"初始密码为0000",
                           type:"warning"
                           })
                        this.dialogFormVisible =false;
                     }else{
                        this.$message({
                           message:resp.message,
                           type:"warning"
                        })
                     }
                  })
               }else{
                  return false;
               }
            })
         },
         //编辑商品
         handleEdit(id){
            this.handAdd();
            staffApi.getById(id).then(Response=>{
               const resp = Response.data;
               if(resp.flag){
                  this.pojo=resp.data.rows[0];
               }
            })
         },
         //提交表单
         updateData(forName){
            this.$refs[forName].validate(valid=>{
               if(valid){
                  staffApi.update(this.pojo).then(res=>{
                     if(res.data.flag){
                        this.fetchData();
                        this.dialogFormVisible =false;
                     }else{
                        this.$message({
                           message:resp.message,
                           type:"warning"
                        })
                     };
                  })
               }else{
                  return false;
               }
            })
         },
         //删除
         handleDelete(id){
             this.$confirm('确认删除这条数据吗?','提示',{
               confirmButtonText: '确定',
               cancelButtonText: '取消',
               type: 'warning'
            }).then(()=>{
               staffApi.deleteById(id).then(res=>{
                  const resp =res.data;
                  this.$message({
                  message:resp.message,
                  type:resp.flag?"success":"error"
                  })
                   if(resp.flag){
                  //删除成功刷新数据
                  this.fetchData()
               }
               })
            }).catch(()=>{
               //取消删除
            })
         }
      }
   }
</script>
<style lang="scss" scoped>
   .demo-form-inline{
      margin-top:25px;
   }
</style>