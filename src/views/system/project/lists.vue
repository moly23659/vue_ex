<template>
  <div>
    <el-button type="primary" @click="handleAdd">新增</el-button>


    <el-table :data="project" style="width: 100%" label="项目列表">
      <el-table-column label="序号" type="index" width="80"></el-table-column>
      <el-table-column prop="school" label="学校" width="200"></el-table-column>
      <el-table-column prop="author" label="作者" width="150"></el-table-column>
      <el-table-column prop="title" label="作品名称"></el-table-column>
      <el-table-column label="操作" width="350">
        <template v-slot="scope">
          <el-button  type="primary" size="small" @click="handleEdit(scope.row)"
            >编辑</el-button
          >
          <el-button @click="handleView(scope.row)" type="success" size="small">查看</el-button>
          <el-button  type="danger" size="small"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    
    <el-dialog :visible.sync="addproject"  width=500px>
      <el-form :model="project2" :rules="projectRules" ref="projectForm" label-width="80px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="project2.title" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="作者" prop="author">
        <el-input v-model="project2.author" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm2">提交</el-button>
      <el-button type="primary" @click="close2">关闭</el-button>
    </span>
    </el-dialog>


  </div>
</template>

<script>
import { getp,submitp } from "@/api/system/sroot";
import { getUser,getUserbyid } from "@/api/system/user";

export default {
  data() {
    return {
      project: [],
      addproject:false,
      project2: {
        sessionid: "",
        title: "",
        author: "",
        school: "",
        userid: "",
      },
      projectRules: {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" }],
        author: [
          { required: true, message: "请输入作者", trigger: "blur" }],
        },
sessionid:"",
    };
  },
  created() {
    getUserbyid(this.$store.state.user.id).then((response) => {
      this.project2.school = response.school;
    });
 
    this.sessionid = this.$route.query.id;

    getp(this.sessionid).then((response) => {
      this.project = response;
    });
  },
  mounted() {},
  methods: {
    //编辑

    handleEdit(row) {
      this.$router.push({
        path: "/project",
        query: { id: row.id, pid: row.sessionid },
      });
    },
    handleAdd(){
            if(this.project2.school==null){
                this.$message.error("请先完善个人信息");
                return;
            }
      this.project2.userid = this.$store.state.user.id;
      this.project2.sessionid =this.sessionid;
      this.addproject = true;
  
    },
    //个人的项目上传
submitForm2()
{

  this.$refs.projectForm.validate(valid => {

        if (valid) {
          // 表单验证通过，执行提交操作
          submitp(this.project2).then(response => {
            this.$modal.msgSuccess("上传成功");
            getp(this.sessionid).then((response) => {
      this.project = response;
    });
            this.close2();

          }).catch(error => {
            this.$modal.msgError("提交失败，请重试");
          });
        } else {
        }
      });
},
//关闭
close2(){
this.addproject=false;
this.project2.sessionid="";
this.project2.title="";
this.project2.author="";
this.project2.school="";
this.project2.userid="";
},


handleView(row){
  this.$router.push({
              path:'/protest',
            query:{id:row.id,
         
            }
            })

},
  },
};
</script>

<style scoped></style>
