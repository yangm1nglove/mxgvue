<template>
    <div>
       <!-- 搜索框 -->
      <el-form :inline="true" :model="searchMap" class="demo-form-inline" ref='searchForm'>
         <el-form-item prop="name">
            <el-input v-model="searchMap.name" placeholder="商品名称"></el-input>
         </el-form-item>
         <el-form-item prop="code">
            <el-input v-model="searchMap.code" placeholder="商品编码"></el-input>
         </el-form-item>
         <el-form-item prop="supplierName">
            <!-- 必须添加上native -->
            <el-input readonly @click.native="dialogSupplierVisible=true" v-model="searchMap.supplierName" placeholder="选择供应商"></el-input>
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
         <el-table-column prop="name" label="商品名称"></el-table-column>
         <el-table-column prop="code" label="商品编码" width="90px"></el-table-column>
         <el-table-column prop="spec" label="商品规格"></el-table-column>
         <el-table-column prop="retailPrice" label="零售价"></el-table-column>
         <el-table-column prop="purchasePrice" label="进货价"></el-table-column>
         <el-table-column prop="storageNum" label="库存数量"></el-table-column>
         <el-table-column prop="supplierName" label="进货商"></el-table-column>
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
         @size-change="handleSizeChange"
         @current-change="handleCurrentChange"
         :current-page="currentPage"
         :page-sizes="[10,20,50]"
         :page-size="pageSize"
         layout="total, sizes, prev, pager, next, jumper"
         :total="total">
      </el-pagination>
      <!-- 选择供应商对话框 -->
      <el-dialog title='选择供应商' :visible.sync="dialogSupplierVisible" width='500px'>
         <!-- 自定义事件接收数据 -->
         <supplier @option-supplier="optionSupplier" :isDialog='true'></supplier>
      </el-dialog>
      <el-dialog title="编辑商品" :visible.sync="dialogFormVisible" width='500px'>
         <el-form 
         ref="pojoForm"
         :rules="rules"
         label-position="right"
         style='width:400px;'
         label-width="100px"
         :model="pojo">
            <el-form-item label="商品名称" prop="name">
               <el-input v-model="pojo.name" ></el-input>
            </el-form-item>
            <el-form-item label="商品编码" prop="code">
               <el-input v-model="pojo.code" ></el-input>
            </el-form-item>
            <el-form-item label="商品规格" prop="spec">
               <el-input v-model="pojo.spec" ></el-input>
            </el-form-item> 
            <el-form-item label="零售价" prop="retailPrice">
               <el-input v-model="pojo.retailPrice" ></el-input>
            </el-form-item>
            <el-form-item label="进货价" prop="purchasePrice">
               <el-input v-model="pojo.purchasePrice" ></el-input>
            </el-form-item>
            <el-form-item label="库存数量" prop="storageNum">
               <el-input v-model="pojo.storageNum" ></el-input>
            </el-form-item>
            <el-form-item label="供应商" prop="supplierName">
               <el-input readonly @click.native="editOptionSupplier" v-model="pojo.supplierName" placeholder="选择供应商"></el-input>
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
import goodsApi from '@/api/goods'
import Supplier from '@/views/supplier'
export default {
   components:{
      Supplier
   },
   data(){
      return{
         list:[],
         //每页10条
         pageSize:10,
         // 默认第一页
         currentPage:1,
         total:0,
         searchMap:{
            name:"",
            code:"",
            supplierName:""
         },
         //选择供应商对话框
         dialogSupplierVisible:false,
         //编辑窗口
         dialogFormVisible:false,
         rules:{
            name:[
               {
                  required:true,message:"商品名称不能为空",trigger:"blur"
               }
            ],
            code:[
               {
                  required:true,message:"商品编码不能为空",trigger:"blur"
               }
            ],
            retailPrice:[
               {
                  required:true,message:"商品零售价不能为空",trigger:"blur"
               }
            ]
         },
         pojo:{
            id:null,
            name:"",
            code:"",
            spec:"",
            retailPrice:0.0,
            purchasePrice:0.0,
            storageNum:0,
            supplierName:"",
            supplierId:null
         },
         isEdit:false //是否为编辑窗口
      }
   },
   created(){
      this.fetchData();
   },
   methods:{
      fetchData(){
         goodsApi.search(this.currentPage,this.pageSize,this.searchMap).then(res=>{
            const resp = res.data.data.rows;
            const tota = res.data;
            this.total=res.data.data.total
            this.list = resp;
         })
      },
      handleSizeChange(val){
         //条数改变
         this.pageSize=val;
         this.fetchData();
      },
      handleCurrentChange(val){
         //页码改变
         this.currentPage =val;
         this.fetchData();
      },
      optionSupplier(currentRow){
         if(this.isEdit){
            //是编辑窗口打开的选择供应商
            this.pojo.supplierName = currentRow.name;
            this.pojo.supplierId=currentRow.id;//供应商id
         }else{
            //搜索区域打开的编辑供应商
            this.searchMap.supplierName=currentRow.name;//供应商名称
            this.searchMap.supplierId=currentRow.id;//供应商id
         }
         this.isEdit = false;
         this.dialogSupplierVisible=false;//关闭窗口
      },
      handAdd(){
         this.dialogFormVisible=true
         this.$nextTick(()=>{
            this.$refs['searchForm'].resetFields();
         })
      },
      //提交新增数据
      addData(formName){
            this.$refs[formName].validate(valid=>{
               
               if(valid){
                  //提交表单  
                  goodsApi.add(this.pojo).then(Response=>{
                     const resp =Response.data;
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
      editOptionSupplier(){
         this.isEdit =true //当前是通过编辑窗口供应商打开的窗口
         this.dialogSupplierVisible = true
      },
      //编辑商品 打开编辑窗口
      handleEdit(id){
         this.handAdd();
         goodsApi.getById(id).then(Response=>{
            const resp=Response.data
            if(resp.flag){
               console.log(resp.data);
               this.pojo = resp.data;
            }
         })
      },
      //提交更新数据
      updateData(forName){
         this.$refs[forName].validate(valid=>{
            if(valid){
               //效验通过
               goodsApi.update(this.pojo).then(Response=>{
                  const resp = Response.data;
                  if(resp.flag){
                     //修改成功,刷新数据,关闭窗口
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
      //删除功能
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
      }
   }
}
</script>
<style lang="scss" scoped>
      .demo-form-inline{
      margin-top:25px;
   }
</style>
