<template>
  <div>
    <!-- 筛选框 -->
    <el-select v-model="selectedSroot" placeholder="选择父级活动" clearable @clear="handleSrootClear" style="height: 50px;">
      <el-option
        v-for="item in sroot"
        :key="item.id"
        :label="item.task"
        :value="item.id"
      ></el-option>
    </el-select>
    
    <!-- 活动筛选框 -->
    <el-select v-model="selectedSession" placeholder="选择活动" clearable @change="handleSessionChange" style="height: 50px;">
      <el-option
        v-for="item in filteredSession"
        :key="item.id"
        :label="item.session"
        :value="item.id"
      ></el-option>
    </el-select>

    <!-- 学校 作者 作品名称搜索框 -->

    <el-form :inline="true" :data="filterchange" 
  style="display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  height: 100px; /* 容器高度设为视口高度 */"
  >
      <el-form-item label="学校" prop="school">
        <el-input
          v-model="filterchange.school"
          placeholder="请输入学校"
          clearable
          @clear="handleClearSchool"
          @keyup.enter.native="handleQueryschool"
        />
      </el-form-item>
      <el-form-item label="作者" prop="author">
        <el-input
          v-model="filterchange.author"
          placeholder="请输入作者姓名"
          clearable
          @clear="handleClearAuthor"
          @keyup.enter.native="handleQueryauthor"
        />
      </el-form-item>
      <el-form-item label="作品名称" prop="title">
        <el-input
          v-model="filterchange.title"
          placeholder="请输入作品名称"
          clearable
          @clear="handleClearTitle"
          @keyup.enter.native="handleQuerytitle"
        />
      </el-form-item>
      <el-form-item> <el-button icon="el-icon-refresh" size="mini" @click="handlechangeclear"
          >
          重置</el-button
        >
      </el-form-item>
     
    </el-form>

    <!-- 表格展示项目信息 -->
    <el-table :data="filteredProject" ref="projectData" style="width: 100%" label="项目列表" align="center" border >

      <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
      <el-table-column prop="school" label="学校" width="200" align="center"></el-table-column>
      <el-table-column prop="author" label="作者" width="150" align="center"></el-table-column>
      <el-table-column prop="title" label="作品名称" width="250px" align="center"></el-table-column>
      <el-table-column label="活动名称" width="200" align="center">
        <template #default="{ row }">
          <span>{{ getSessionName(row.sessionid) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="score"  label="分数" width="250px" align="center" sortable   >
        <template #default="{row}">
          <span> {{ isScore(row) }}</span>
          <!-- <span>{{ row.score }}</span> -->
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250" align="center">
        <template #default="{ row }">
          <el-button @click="handleView(row)" class="button_color" size="small">查看</el-button>
          <el-button @click="handleScoreView(row)" class="button_color"  size="small">分数详情</el-button>
        </template>
      </el-table-column>
      
    </el-table>

    <!-- 分数详情对话框 -->
    <el-dialog title="评分详情" :visible.sync="scoreDialogVisible" width="30%">

      <el-table
    :data="scoreData"
    border
    v-if="selectedScore"
    style="width: 100%"
    :gutter="9"
    >
    <el-table-column
      prop="nickname"
      label="评委"
      
      :span="3">
    </el-table-column>
    <el-table-column
      prop="name"
      label="账号"
      
      :span="3">
    </el-table-column>
    <el-table-column
      label="分数"
      prop="score"
      :span="3">
    <!-- <template #default="{row}">
    <span>{{showScore(row)}}</span>
    </template> -->
    </el-table-column>
  </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { getp, allsession, listSroot } from "@/api/system/sroot";
import { getjudgeall, score } from "@/api/system/role";
import { getUser } from "@/api/system/user";

export default {
  data() {
    return {
      score: [],             // 存储所有的分数信息
      judge: [],             // 存储所有的评委信息
      session: [],           // 存储所有的活动信息
      project: [],           // 存储项目信息的数组
      sroot: [],             // 存储所有的sroot信息
      selectedSession: '',   // 选择的活动名称
      selectedSroot: '',     // 选择的sroot名称
      filteredProject: [],   // 筛选后的项目信息
      showPid:'',           //记录项目pid
      scoreDialogVisible: false, // 分数详情对话框的显示状态
      selectedScore: [{
        nickname:"",
        name:"",
        score:"",
      }],   
      scoreData:[],// 选中的评分信息表
      // 根据学校用户作品搜索储存内容
      filterchange:{
        school:"",
        author:"",
        title:""
      }
    };
  },
  created() {

    
  // handleSessionChange()
    // 获取所有评分信息
    score().then((response) => {
      this.score = response;
    });

    // 获取所有评委信息
    getjudgeall().then((response) => {
      this.judge = response;
    });

    // 获取所有sroot信息
    listSroot().then((response) => {
      this.sroot = response.rows;
      if(Object.keys(this.$route.query).length!=0)
      {
        const sroot1=this.sroot.find(item=>item.id==this.$route.query.srootid)
      this.selectedSroot=sroot1.task;
      }
      
    });

    // 获取所有活动信息，并获取当前用户参与的所有项目信息
    allsession().then((response) => {
      this.session = response;
      if(Object.keys(this.$route.query).length!=0)
      {
         const session1=this.session.find(item=>item.id==this.$route.query.sessionid)
      this.selectedSession=session1.session;
      }
     
      getp(this.$store.state.user.id).then((response) => {
        this.project = response;
      console.log(this.project)
        // this.filteredProject = this.project; 
        if(Object.keys(this.$route.query).length==0)
         {
          this.filteredProject = this.project; // 初始化筛选后的项目信息
   
        }
       
        else 
        {
          const id=this.$route.query.sessionid;
          this.filteredProject = this.project.filter(item =>item.sessionid==id); 
         
        }
       

      });
    });

 
  
    // console.log(this.selectedSroot)
  //  this.selectedSroot.key=this.$route.query.id
  // this.session=this.session.filter((item) => {item.task=selectedSroot})
  },
// 计算属性

  methods: {
    
    // 筛选条件跳转路由
    filterRoute(){

    },
    
    // 显示分数
    isScore(row){
      
      const sum = this.score.filter((item) => item.pid === row.id).reduce((accumulator, scoreItem) => accumulator + Number(scoreItem.score), 0);
      const num = this.score.filter((item) => item.pid === row.id).length;
      const scoredata=parseFloat(sum/num) ;
        // console.log(row)
      row.score= num==0 ? 0 : sum/num;
      console.log(row)
      if(num==0)
      return num;
      else
      return scoredata;
   
      
    },
    handleView(row) {
      console.log("查看项目详情", row.id);
      this.$router.push({
        path: "/protest",
        query: { id: row.id },
      });
    },
    // 显示评委及其打分情况
    handleScoreView(row) {

      this.showPid=row.id;
      // 找到对应项目的评分信息
      // const scoreSum =0;
      const projectScore = this.score.filter((item) => item.pid === row.id);
      const judgeInfo = this.judge.filter((item) => {
        for(const score of projectScore)
        {
          if(item.userid===score.uid)
          return item;
        }
        
      }
      );
      this.scoreData=judgeInfo

      this.scoreDialogVisible = true;
      
    },
    // 分数情况
    showScore(row)
    {
  
      const projectScore = this.score.filter((item) => item.pid === this.showPid);
      // console.log(this.showPid)
      const score1=projectScore.find((item)=> item.uid===row.userid)
      // this.showPid='';
      return score1.score;
      
    },

    getSessionName(sessionid) {
      const session = this.session.find((item) => item.id === sessionid);
      return session ? session.session : "";
    },
    // 另一种方式筛选
    handleQueryschool(){
      this.filteredProject = this.project.filter(item => item.school === this.filterchange.school);

    },
    handleQueryauthor(){
      this.filteredProject = this.project.filter(item => item.author === this.filterchange.author);

    },
  handleQuerytitle(){

    this.filteredProject = this.project.filter(item => item.title === this.filterchange.title);
  },

// 清除学校、作者、作品的搜索
handleClearSchool(){
  this.filterchange.school="";
  if(this.filterchange.title||this.filterchange.author)
  this.filteredProject = this.project.filter(item => item.title === this.filterchange.title && item.author === this.filterchange.author);
  else
  {
    this.filteredSession = this.session;
  this.filteredProject = this.project;
  }
},
handleClearAuthor(){
  this.filterchange.author="";
  if(this.filterchange.title||this.filterchange.school)
  this.project.filter(item => item.title === this.filterchange.title && item.school === this.filterchange.school);
  else
  {
    this.filteredSession = this.session;
  this.filteredProject = this.project;
  }
},
handleClearTitle(){
  this.filterchange.title="";
  if(this.filterchange.author||this.filterchange.school)
  this.filteredProject = this.project.filter(item => item.author === this.filterchange.author && item.school === this.filterchange.school);
  else
  {
    this.filteredSession = this.session;
  this.filteredProject = this.project;
  }
  
},
  handlechangeclear(){
    // 需要判断一下传参前后的效果
    this.selectedSession="";
    this.selectedSroot="";
 this.filterchange.school="";
 this.filterchange.author="";
 this.filterchange.title="";
 this.filteredSession = this.session;
  this.filteredProject = this.project;
  },
    handleSessionChange() {
      // 筛选项目信息
      this.filteredProject = this.project.filter(item => item.sessionid === this.selectedSession);
      
    },
    handleSrootClear() {
      // 清除当前选择的sroot
      this.selectedSroot = '';
      // 重置活动选择
      this.selectedSession = '';
      // 重新显示所有活动
      this.filteredSession = this.session;
      this.filteredProject = this.project;
    },
  },
  computed: {
    
    filteredSession() {
      if (this.selectedSroot) {
        return this.session.filter(item => item.root === this.selectedSroot);
      } else {
        return this.session;
      }
    }
  }
};
</script>

<style scoped>
/* Add your scoped styles here */
.button_color{
 background-color:rgb(251,167, 170);
 color:rgb(94,94,94);
 font-weight: bold;
} 
.button_color:hover{
 background-color: pink;
 color: grey;
 font-weight: bold;
} 
.button_color:active{
 background-color: pink;
 color: grey;
 font-weight: bold;
} 
</style>
