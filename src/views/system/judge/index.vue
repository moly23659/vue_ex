<template>
  <div class="box-top" >

    <!-- <el-button @click="testAdd">添加</el-button> -->
    <div class="box-1" v-show="!clickPage" style="height: 80%;width: 100%;">
       <el-table :gutter="16"
    :data="tableActivityData"
    
    stripe
    border
    style="height: 80%;width: 100%;">
    <el-table-column
      prop="id"
      label="序号"
      width="120"
      align="center">
    </el-table-column>
    <el-table-column
      prop="task"
      :span="8" :offset="2"
      label="活动名称"
    
      align="center">
    </el-table-column>
    <el-table-column
      prop="status"
      label="状态"
      width="120"
      align="center">
      <template slot-scope="scope">
    <!-- 单元格内容根据status的值来显示不同的文本 -->
    <span v-if="scope.row.status === 1">可评分</span>
    <span v-else-if="scope.row.status ===0">不可评分</span>
   
  </template>
    </el-table-column>
    <el-table-column
      label="开关"
      width="120"
      align="center">
      <template #default="{row}">
      <!-- <el-switch
      v-model=row.status
      active-color="#13ce66"
      inactive-color="#ff4949"
      @change="openStatus(row)">
    </el-switch> -->
    <el-button class="button_color"   size="medium" @click="openStatus(row)">开关</el-button>
      </template>
      
    </el-table-column>
    <el-table-column
      label="操作" align="center" >
      <template slot-scope="scope">
      <el-button  class="button_color"  size="medium" @click="editorSrootJudge(scope)" >编辑</el-button>
      
      <!-- <el-button class="button_color"   size="medium" @click="switchStatus">开关</el-button> -->
    </template>
    </el-table-column>
  </el-table>
    </div>

    <div class="box-2" v-show="clickPage" style="height: 80%;width: 100%;">
      <div style="height: 15%;">
   <el-button class="button_add"  type="text" size="medium" style="color: red;" @click="addJudgeName">新增评委账号</el-button>
</div>
      <el-table 
    :data="filteredData"
    v-loading="loading"
    stripe
    border
    style="height: 70%;width: 100%;"
   :gutter="16"
      align="center"
    >
    <el-table-column
      prop="nickname"
      label="评委姓名"
      width="200"
      align="center">
    </el-table-column>
    <el-table-column
      prop="name"
      label="账号"
      width="200"
      align="center">
    </el-table-column>
    <el-table-column  
      label="类别"
   width="400"
      align="center"
      prop="session"
    >
    <template #default="{ row }">
          <!-- 确保在最后一个session后不加空格，避免表格错位 -->
          <span v-for="(session, index) in row.session" :key="index">
            {{ session }}
            <br v-if="index < row.session.length - 1"/>
            <!-- <span v-if="index < row.session.length - 1">&nbsp;</span> -->
          </span>
        </template>
    </el-table-column>

    <el-table-column
      label="操作"
      width="350"
      align="center">
      <template #default="scope">
        
      <el-button class="button_color"  size="medium" @click="editJudge(scope.row)" >编辑 </el-button>
      <el-button  class="button_color"  size="medium" @click="delJudge(scope.row)">删除</el-button>
    </template>
      
    </el-table-column>
  </el-table>

 
<!-- 新增账号方式 对话框-->
    <el-dialog
      v-if="clickAddJudge"
      title="新增账号"
      :visible.sync="clickAddJudge"
      width="500px"
      @close="closeAddJudge"
      append-to-body
    >
<el-form  ref="form" :model="form" :rules="addrules" label-width="80px"   >
  <!-- <el-form-item label="姓名">
    <el-input v-model="form.usernamec"></el-input>
  </el-form-item> -->
  <el-form-item label="姓名" prop="nickname" >
    <el-input v-model="form.nickname" placeholder="请输入姓名"></el-input>
  </el-form-item>
  <el-form-item label="账号" prop="username">
    <el-input v-model="form.username" placeholder="请输入账号"></el-input>
  </el-form-item>
  
  <el-form-item label="密码" prop="password" v-if="clickEditJudge===0">
    <el-input v-model="form.password" placeholder="请输入密码"></el-input>
  </el-form-item>
  <el-form-item label="分配类别">
    <el-checkbox-group v-model="form.session">

      <el-checkbox
      v-for="session in formsession"
      :key="session.id"
      :label="session.id"
      style="display: block;width: 100%;height: 40px;font-size:50px ;">
        {{ session.session }}
      </el-checkbox>
   
    </el-checkbox-group>
  </el-form-item>
 
  <el-form-item align="center" style="margin: 0px 80px 0px 0px;">
    <el-button class="button_color"  @click="onSubmitAdd" v-if="clickEditJudge===0">新增</el-button>
    <el-button  class="button_color"  @click="onSubmitEdit" v-if="clickEditJudge===1">修改</el-button>
    <el-button   class="button_color"  @click="closeAddJudge" >取消</el-button>
  </el-form-item>
</el-form>
    </el-dialog>

    <div class="box-bottom"   align="center"> 
    <el-button class="button_color"  style="font-size: 20px; margin-right: 10vw;" @click="returnPage">返回</el-button> 
    <!-- <el-button type="danger" size="medium" @click="bottomPage" style="margin-left: 5vw;">下一页</el-button> -->
  </div>

    </div>
  

   

  </div>
     

    
</template>
<script>
import {
  getid,
  upmessage,
  upmodel,
  listSroot,
  test,
  getsubid,
  upsub,
  init,
  getSroot,
  updatechild,
  delSroot,
  delchild,
  addSroot,
  updateSroot,
  session,
  sessionid,
  submitp,
  allsession,
  getpstatus,
  addchild,
} from "@/api/system/sroot";
import { getUserbyid } from "@/api/system/user";
import { getjudge ,findjudge,updatejudge,selectjudge,getjudgeall,addjudge,setrole,getalljudge,getstatus,controlstatus} from "@/api/system/role";

export default{
    data(){
        return{
          formAdd:{},
          // 新增页面开启
        clickAddJudge:false,
        // 编辑要求
        clickEditJudge:0,
        // 点击大活动编辑，返回的按钮
        clickPage:false,
        // 提取所有子活动的数据
        session:"",
        // 更新
        sroot:'',
        // 表单子活动显示
        formsession:{},
        // 更新评委信息
        updateEditJudge:{},
        // 开关参数
        value:true,
        // 评分状态
        status:'',
             // 表单参数
      form: {
        nickname:'',
        username: '',
        password: '',
        session:[],
      },
      // 新增评委表单验证
      addrules: {
        nickname: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        username: [{ required: true, message: "账号不能为空", trigger: "blur" }],
        password: [{ required: true, message: "密码不能为空", trigger: "blur" }],
      },
    //  活动表格数据
      tableActivityData:[],
      // 记录父级活动表格参数
      ativityData:{    
        id:"",
        task:"",
        status:"",
       
      },
     // 评委表格数据
      judgeData:{
        judgeuid:"",
        nickname:"",
        name:"",
        sessionid:[],
        session:[""],
      },
     filteredData:{
      nickname:"",
        name:"",
        sessionid:[],
        session:[""],
     },
      formData:{
         username:12356,
           password:123456
      },
      loading:true,
        };
    },
    created(){
      getalljudge().then(res=>{
        console.log(res)
      })
      this.getList();
      allsession().then((response) => {
      this.session = response;});

      getalljudge().then(response=>{console.log(response)})
    },
    computed:{
      
    },
    mouted(){
      this.updateJudgeData();
    },
    methods:{
     getStatus(row){
      getstatus(row.id).then(res=>{
        console.log(res)
      })
     },
      // 刷新页面
      getList() {
        // 列出父级活动列表
        listSroot( this.ativityData).then(response => 
        {
          console.log(response.rows)
          this.tableActivityData=response.rows;
        }).catch(error => {
  // 处理错误情况
  console.error('获取 活动 列表失败:', error);
});
    // 初始化子活动
    // this.judgeData=[];
    // 获取所有的评委表格
    getalljudge().then(response=>{
      console.log(response)
            const judgeDataArray = [];

  // 遍历返回的评委数组
  response.forEach(judge => {
    // 提取评委的昵称和姓名
    const nickname = judge.role[0] ? judge.role[0].nickname : "";
    const name = judge.role[0] ? judge.role[0].name : "";

    // 提取评委的所有srole值
    const sessionid = judge.role.map(role => role.srole);

    // 创建一个评委数据对象
    const judgeD = {
      judgeuid:judge.judgeuid,
      nickname: nickname,
      name: name,
      sessionid: sessionid
    };

    // 将评委数据对象添加到数组中
    judgeDataArray.push(judgeD);

  });
 this.judgeData=judgeDataArray
  // 打印存储在数组中的评委数据
  console.log("评委数据表格:", judgeDataArray);
          })
      
    }, 

      // 打开编辑子活动的判断
      editorSrootJudge(row){       
        this.sroot=row;
        this.clickPage=true;
       this.loading=false    
        session(row.row.id).then(response=>{
            console.log(response);
            // 获取表单中的session
            this.formsession=response
            console.log( this.formsession)
            if (Array.isArray(response)) {
            // 使用 map 方法提取所有对象的 id       
           const sessionIds =  response.map(item => item.id );
    //           getjudgeall().then(allJudges => {
    //        // 打印所有评委的详细信息
    //         // 过滤出与 session 中提取的 id 相同的评委
    //         console.log(sessionIds)
    //         this.judgeData=allJudges.filter(judge => sessionIds.includes(judge.srole));
    // })
    // 筛选表格情况
    const filteredJudges = this.judgeData.filter(judge =>
        judge.sessionid.some(id => sessionIds.includes(id)));
          
        filteredJudges.map(item=>{
          item.session=[];
          item.sessionid.forEach(id=>{
            if(sessionIds.includes(id)){
           const session=this.session.find(r=>r.id===id)
           if(session)
           item.session.push(session.session)
            }
          
          })
          return {...item};
        })

          this.filteredData=filteredJudges

        
            // 在这里，您可以根据提取的 ids 执行其他操作
        } else {
            console.error('返回的数据不是一个数组');
        }
    }).catch(error => {
        // 打印错误信息
        console.error('请求失败:', error);
    }) 
      },
      // 获取相对应的活动名称
      // getSessionName(sessionid){
      // const session = this.session.find((item) => item.id === sessionid);
      // return session ? session.session : "";
      // },
      
      // 开关功能
      openStatus(row){
        console.log(row)
        this.tableActivityData.map
        const data={
          id:'',
          sessionid:row.id,
          status:1,
        }
       const status=controlstatus(data).then(response=>{
        console.log(response)
       })
       
       
      },
      // 添加新账户的方法
        addJudgeName(){
            this.clickAddJudge=true;
            this.clickEditJudge=0;
            this.form={
              nickname:"",
              username:"",
              password:"",
              session:[]
            };
            // this.form.session=[]
           
            
        },
        // 编辑评委权限的方法
        editJudge(row){
          console.log(row)
          this.updateEditJudge=row;
          this.clickAddJudge=true;
          this.clickEditJudge=1;
          let newItem = {
            nickname:row.nickname,
            username:row.name,
            passwprd: "",
            session:row.sessionid,
          }
          // this.form.username=row.name;
          // this.form.nickname=row.nickname;
          this.form = { ...newItem }
          // console.log('row', row)
          // console.log('this.form',this.form)
          // 以上是展示已经存在的数据
          // 现在开始修改
        },
        delJudge(row)
        {
          const sessionid=[];
          // console.log(row)
          const uid=row.judgeuid;
          const role=sessionid;
          const params = new URLSearchParams();
      params.append('role', role); // 将数组转换为字符串
      params.append('uid', uid);
      setrole(params).then(response=>console.log(response))
      this.reset();
      // this.$forceUpdate();
      // this.editJudge(this.sroot)
        },
        reset(){
          this.form={
              nickname:"",
              username:"",
              password:"",
              session:[]
            };
        },
    //     testAdd(){
    //  const formRole={
    //   role:['100','1'],
    //   uid:""
    //  }
    //  setRole().then(response=>{console.log(response)})
    //     },
    // 新增或者编辑的方法
    onSubmitEdit(){
      // 修改用户提交
      // console.log(this.form.session)
      
      const sessionid = [...this.form.session];
      console.log(sessionid)
     
       const role=sessionid;
       const uid=this.updateEditJudge.judgeuid;
      
      const params = new URLSearchParams();
      params.append('role', role); // 将数组转换为字符串
      params.append('uid', uid);
      setrole(params).then(response=>console.log(response))

        this.clickAddJudge=false;
        this.reset();
        // console.log(this.updateEditJudge)
    
    },
    onSubmitAdd(){
     console.log(this.form)
      if(this.form.judgeuid==null){
     const username=this.form.username || '';
     const nickName=this.form.nickname || '';
     const password=this.form.password || '';
     let data={
      username: String(username) ,
      password: String(password),
      nickName: String(nickName),
      }

  console.log(data)
     addjudge(data).then(res=>{
      console.log(res)
      const test=res;
      console.log(test)
      if(Object.keys(res)==0)
      {
        this.$message({
          message:"账号已存在，请修改密码或者账号",
          type:'warning',
        })
      }

      else{
        const uid=res.judge.userId;
        const sessionid =  [...this.form.session];
        const role=sessionid;
        const params = new URLSearchParams();
      params.append('role', role); // 将数组转换为字符串
      params.append('uid', uid);
      setrole(params).then(response=>console.log(response))
      this.$message({
          message:"添加成功",
          type:'success',
        })
      this.clickAddJudge=false;
      this.reset();
      }
     })
     }
 
    },
      // 关闭新增评委名单界面
        closeAddJudge(){
          this.clickAddJudge=false;
          this.form={};
          // this.form.session=[]
          this.formsession=this.formsession
          console.log(this.formsession)
        },
        //返回进入页面
        returnPage()
        {
          this.clickPage=false;
          this.getList();

        },


    }
}
</script>


<style>
.box-top{
  width: 90vw;
  height: 100vh;
}

.box-bottom{
  width: 100vw;
  height: 20%;
  margin-bottom: 10px;

}
.button_add {
  margin: 20px 5px 0 0; /* 靠近下一个盒子，移除底部外边距 */
  padding-left:10px;
  width: 8vw;
  height: 80%;
  display: inline-block; /* 内联块级元素 */
  text-decoration: none; /* 确保没有默认的下划线 */
  cursor: pointer; /* 鼠标悬停时显示指针手势 */
  transition: text-decoration 0.3s ease; /* 平滑过渡效果 */
  font-size: 20px;
}

.button_add:hover {
  text-decoration: underline; /* 鼠标悬停时添加下划线 */
}

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