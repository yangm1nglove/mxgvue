<template>
    <div>
       <!-- 头部搜索 -->
         <el-form ref='searchMap' :inline="true" :model="searchMap" class="demo-form-inline">
         <!-- 重置会看el-form-item组件元素的prop上是否指定了字段名,制定了才会重置生效 -->
         <el-form-item prop="name">
            <el-input v-model="searchMap.name" placeholder="供应商名称"></el-input>
         </el-form-item>
         <el-form-item prop="linkman" v-if="!isDialog">
            <el-input v-model="searchMap.linkman" placeholder="联系人"></el-input>
         </el-form-item>
         <el-form-item prop="mobile" v-if="!isDialog">
            <el-input v-model="searchMap.mobile" placeholder="联系电话"></el-input>
         </el-form-item>
         <el-form-item>
            <el-button type="primary" @click="fetchData">查询</el-button>
            <el-button type="primary" v-if="!isDialog" @click="handleAdd">新增</el-button>
            <el-button @click="resetForm('searchMap')" v-if="!isDialog">重置</el-button>
         </el-form-item>
      </el-form>
      <!-- 内容组件 -->
            <!-- highlight-current-row激活单选行 
         @current-change当点击某一行后,会触发这个事件,从而调用相对应的函数
         handleCurrentChange 会接收两个参数 currentRow，oldCurrentRow
         -->
      <el-table
         :highlight-current-row="isDialog"
         @current-change="clickCurrentChange"
         :data="list"
         height="380"
         border
         style="width: 100%">
         <!-- type=index 获取所引值,从1开始 label:显示标题 prop:显示字段名  width:指定列宽-->
         <el-table-column type="index" label="序号" width='60px'></el-table-column>
         <el-table-column prop="name" label="供应商名称"></el-table-column>
         <el-table-column prop="linkman" label="联系人" width="90px"></el-table-column>
         <el-table-column v-if="!isDialog" prop="mobile" label="联系电话"></el-table-column>
         <el-table-column v-if="!isDialog" prop="remark" label="备注"></el-table-column>
         <el-table-column v-if="!isDialog" label="操作" width='150px'>
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
         :layout="!isDialog?'total, sizes, prev, pager, next, jumper':'prev, pager, next'"
         @size-change="handleSizeChange"
         @current-change="handleCurrentChange"
         :current-page="currentPage"
         :page-sizes="[10,20,50]"
         :page-size="pageSize"
         :total="total">
      </el-pagination>

            <!-- 弹出新增窗口 -->
      <el-dialog
      v-if="!isDialog"
       title="供应商编辑" :visible.sync="dialogFormVisible" width="500px">
         <el-form 
         ref="pojoForm"
         :rules="rules"
         label-position="right"
         style='width:400px;'
         label-width="100px"
         :model="pojo">
            <el-form-item label="供应商名称" prop="name">
               <el-input v-model="pojo.name" ></el-input>
            </el-form-item>
            <el-form-item label="联系人" prop="linkman">
               <el-input v-model="pojo.linkman" ></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="mobile">
               <el-input v-model="pojo.mobile" ></el-input>
            </el-form-item> 
            <el-form-item label="备注" prop="remark">
               <el-input v-model="pojo.remark" ></el-input>
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
   import SupplierApi  from "@/api/supplier";
   export default{
      props:{
         //接受父组件传递过来的数据,判断是否为弹窗 true弹窗 false取消弹框
         isDialog:Boolean
      },
      data(){
         return{
            //声明保存数据的空间
            list:[],
            pageSize:10,//每页显示条数
            currentPage:1,//默认第一页
            total:0,//总记录数
            searchMap:{
               name:"",
               linkman:"",
               mobile:""
            }, //条件查询的绑定字段值
            //默认弹出框隐藏
            dialogFormVisible:false,
            pojo:{
               name:"",
               linkman:"",
               mobile:"",
               remark:"",
               id:null
            },
            //效验规则
            rules:{
               name:[
                  {required:true,message:"供应商不能为空",trigger:"blur"},
               ],
               linkman:[
                  {required:true,message:"联系人不能为空",trigger:"blur"},
               ]
            },
         }
      },
      created(){
         //创建时获取数据
         this.fetchData();
      },
      methods:{
         //嵌入获取数据的方法
         fetchData(){
            SupplierApi.search(this.currentPage,this.pageSize,this.searchMap).then(Response=>{
               console.log(111)
               this.list = Response.data.data.rows;
               this.total = Response.data.data.total;
            })
         },
         //编辑
         handleEdit(id){
            console.log(id);
         },
         //删除
         handleDelete(id){
            console.log(id);
         },
         //当每页显示条数改变后,调用该方法,val是当前改变后的条数
         handleSizeChange(val){
            this.pageSize = val;
            this.fetchData();
         },
         //页码
         handleCurrentChange(val){
            this.currentPage = val;
            this.fetchData();
         },
         //重置
         resetForm(formName){
            this.$refs[formName].resetFileds();
         },
         //打开新增
         handleAdd(){
            this.dialogFormVisible = true
            this.$nextTick(()=>{
               //this.$nextTick它是一个异步事件
               //弹出窗口打开后,需要重新加载DOM
               this.$refs['pojoForm'].resetFields()
            })
         },
         //提交新增表单
         addData(formName){
            this.$refs[formName].validate(valid=>{
               if(valid){
                  //提交表单
                  SupplierApi.add(this.pojo).then(Response=>{
                     const resp = Response.data;
                     if(resp.flag){
                        this.fetchData();
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
         //编辑
         handleEdit(id){
            //清除表单数据和效验结果
            this.handleAdd();
            console.log(SupplierApi.getById(id));
            SupplierApi.getById(id).then(res=>{
               const resp =res.data;
               // console.log(resp);
               if(resp.falg){
                  //查询成功赋值
                  this.pojo = resp.data;
               }else{
                  //查询失败,报错
                  this.$message({
                     message:resp.message,
                     type:"warning"
                  })
               }
               
            });
         },
         updateData(forName){
            this.$refs[forName].validate(valid=>{
               if(valid){
                  //页面效验通过 才可以发送更新
                  SupplierApi.update(this.pojo).then(res=>{
                     const resp=res.data;
                     if(resp.flag){
                        //更新成功刷新数据
                        this.fetchData();
                        this.dialogFormVisible=false;
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
         //删除
         handleDelete(id){
            this.$confirm('确认删除这条数据吗?','提示',{
               confirmButtonText: '确定',
               cancelButtonText: '取消',
               type: 'warning'
            }).then(()=>{
               SupplierApi.deleteById(id).then(res=>{
               const resp = res.data
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
         },
         //当点击某一行时,会调用这个函数进行处理
         clickCurrentChange(currentRow){
            //点击后将点击后的数据传递到商品管理中
            this.$emit('option-supplier',currentRow);
         }
      }
   }
</script>
<style lang="scss" scoped>
      .demo-form-inline{
      margin-top:25px;
      margin-left:20px;
   }
</style>
