<template>
  <div class="app-container" style="width: 100%;">
  
    <!-- <iframe :src=this.url frameborder="0"></iframe> -->
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="活动" prop="task">
        <el-input
          v-model="queryParams.task"
          placeholder="请输入活动"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <el-row :gutter="20" class="mb8">
      <el-col :span="1.5" :offset="18">
        <el-button
          type="success"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:sroot:export']"
          >新增活动</el-button
        >
        <!-- <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:sroot:export']"
          >导出</el-button
        > -->

        <right-toolbar
          :showSearch.sync="showSearch"
          @queryTable="getList"
        ></right-toolbar>
      </el-col>
    </el-row>

    <!-- 表格数据区 -->
    <el-table :data="deptList" :gutter="24"  v-loading="listLoading" class="table" border >
      <!-- 父树的列 -->
      <el-table-column type="expand" :span="4">
        <template #default="scope">
          <el-button
            class="expand-btn"
            size="medium"
            icon="el-icon-arrow-right"
            @click="toggleExpanded(scope.row)"
          > </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="编号" width="50"  align="center"> </el-table-column>
      <el-table-column :span="8" label="活动名称" align="center">
        <template slot-scope="scope">
          <a class="link" href="javascript:void(0);" @click="openDialog(scope.row.message)">{{ scope.row.task }}</a>
        </template>
      </el-table-column>
      <el-table-column
        prop="starttime"
        label="开始时间"
        :span="5"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="endtime"
        label="结束时间"
        :span="5"
        align="center"
      ></el-table-column>
      <!-- 操作列 -->
      <el-table-column  :span="5" label="上传汇总表" align="center">
        <template slot-scope="scope" class="btn">

  <el-button v-if="admin!=1" @click="upsub(scope.row)"    class="link" type="text"
  v-hasPermi="['submit']">上传汇总表</el-button>
  &nbsp;
        <a class="link" v-if="admin!=1" 
            :href="scope.row.model"
            v-hasPermi="['submit']"

            >下载模版</a>
        </template>
      </el-table-column>

      <el-table-column :span="5" label="操作" align="center" >
        <template #default="scope"  class="btn">
          
          <el-button
            type="text"
            size="medium"
           class="link"
            @click="UpdateSroot(scope.row)"
            v-hasPermi="['system:sroot:edit']"
            >编辑</el-button>
          <!-- <el-button
            type="text"
            size="medium"
           class="link"
            @click="deletsroot(scope.row)"
            v-hasPermi="['system:sroot:edit']"
            >删除</el-button
          > -->
        </template>
      </el-table-column>

      <!-- 子树的扩展列 -->
      <el-table-column type="expand">
        <template #default="scope">
          <el-collapse-transition>
            <div class="transition-box">
              <el-table
                :data="scope.row.session"
                v-loading="scope.row.loading"
                class="child-table"
                :gutter="24"
              >
                <el-table-column label="编号" :span="2" align="center">
                  <template #default="scope">
                    <span>{{ scope.$index + 1 }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="session"
                  label="项目名称"
                  :span="5"
                  align="center"
                ></el-table-column>
                <el-table-column label="操作" :span="5" align="center">
                  <template #default="scope">
                    <el-button
                      type="text"
                      size="medium"
                      @click="Addproject(scope.row)"
                      v-hasPermi="['submit']"
                       v-if="admin!=1"
                      >填报</el-button
                    >
                    <el-button
                    v-if="admin!=1"
                      type="text"
                      size="medium"
                      @click="Score(scope.row)"
                      v-hasPermi="['judge']"
                      >评审</el-button>

                    <el-button
                      type="text"
                      size="medium"
                      @click="deletechild(scope.row)"
                      v-hasPermi="['system:sroot:edit']"
                      >删除</el-button
                    >
                    <el-button
                      type="text"
                      size="medium"
                      @click="editchild(scope.row)"
                      v-hasPermi="['system:sroot:edit']"
                      >修改</el-button
                    >
                  </template>
                </el-table-column>

                <!-- <el-table-column
                v-if="admin === 1"
                label="评委选定"
                align="center"
                wight="200px"
                > -->
               <!-- <el-button type="primary" round @click=""> 评委 </el-button> -->
               
               <!--  -->
              <!-- </el-table-column> -->

              <!-- <el-table-column
                v-if="admin === 1"
                label="评委人选"
                align="center"
                wight="200px"
                
                
                >
               
              </el-table-column> -->

                <el-table-column
                  v-if="admin === 1"
                  prop="sub"
                  label="投递情况"
                  align="center"
                  :span="4"
                  
                ></el-table-column>
                <el-table-column
                  v-if="admin === 1"
                  prop="fin"
                  label="填报情况"
                  align="center"
                  :span="4"
                ></el-table-column>

                <el-table-column
                  v-if="admin === 1"
                  label="作品详情"
                  align="center"
                  :span="4"
                >
                
                <template #default="scope">
                  <el-button
                  type="text"
                 size="medium"
                class="link"
                @click="ToSroot(scope.row)"
                 v-hasPermi="['system:sroot:edit']"
                   >查看</el-button>
                </template>
              </el-table-column>

              </el-table>
            </div>
          </el-collapse-transition>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <el-dialog :visible.sync="subvisiable">
      <el-upload
  class="upload-demo"
  ref="upload"

 action="http://120.27.192.197:8000/szw/upsub"
  :auto-upload="true">
  <el-button slot="trigger" class="link" type="text">选取文件</el-button>
</el-upload>
    </el-dialog>


    <!-- 添加或修改对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="show0"
      width="500px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="项目" prop="task">
          <el-input v-model="form.task" placeholder="请输入项目" />
        </el-form-item>
        <el-form-item label="开始时间">
          <div class="block">
            <span class="demonstration"></span>
            <el-date-picker
              v-model="form.starttime"
              type="datetime"
              placeholder="选择开始日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
              <i class="el-icon-date"></i>
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="结束时间">
          <div class="block">
            <span class="demonstration"></span>
            <el-date-picker
              v-model="form.endtime"
              type="datetime"
              placeholder="选择截止日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item v-if="edit === 1" label="补填开关" v-model="form.status">
          <el-switch
            v-model="form.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </el-form-item>

        <el-form-item v-if="edit === 1" label="子活动">
          <el-button
            type="text"
            size="small"
           class="link"
            @click="addSession()"
            v-hasPermi="['system:sroot:edit']"
            >新增子活动</el-button
          >
        </el-form-item>

        <el-form-item v-if="edit === 1" label="活动通知">
          <el-upload
  class="upload-demo"
  ref="upload"
 action="http://120.27.192.197:8000/szw/addmessage"
  :auto-upload="true"
  :file-list="form.fileMessageList"
  >
  <!-- 加入file-list绑定存储文件地址 -->
  <el-button slot="trigger" class="link" type="text">选取文件</el-button>
</el-upload>

      <el-button v-if="form.fileMessageList!=null" type="text" >
          <a class="link" href="javascript:void(0);" @click="openDialog(form.fileMessageList)">查看已选定的通知</a>
          <!-- 需要重新写一个 -->
        </el-button>
        </el-form-item>

        <el-form-item  v-if="edit === 1" label="模版">
          <el-upload
  class="upload-demo"
  ref="upload"
 action="http://120.27.192.197:8000/szw/addmodel"
  :auto-upload="true">
  <el-button slot="trigger" class="link" type="text">选取文件</el-button>
</el-upload>
<el-button v-if="form.fileModelList!=null" type="text" >
          <a class="link" href="javascript:void(0);" @click="openDialog(form.fileModelList)">查看已选定的模板</a>
          <!-- 需要重新写一个 -->
        </el-button>
        </el-form-item>

<!-- 
        <el-form-item v-if="edit === 1" label="评委">
          <el-select v-model="selectedjudge0" multiple placeholder="请选择评委" @change="handleJudgeChange">
            <el-option
              v-for="judge in this.judge"
              :key="judge.index"
              :label="judge.name"
              :value="judge.userid"
            >
              <span>{{ judge.name }} ({{ judge.nickname }})</span>
            </el-option>
          </el-select>

          <el-select v-model="selectedjudges" multiple placeholder="取消授权" @change="handleJudgeChange">
            <el-option
              v-for="judge in this.selectedjudge"
              :key="judge.index"
              :label="judge.name"
              :value="judge.userid"
            >
              <span>{{ judge.name }} ({{ judge.nickname }})</span>
            </el-option>
          </el-select>
          <br>
评委名单
          <el-dropdown>
            <span class="el-dropdown-link">
           参与评委名单 <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown" v-model="selectedjudges" >
            <el-dropdown-item  v-for="judge in this.selectedjudge"
              :key="judge.index"> {{ judge.name }}</el-dropdown-item>
    
          </el-dropdown-menu>
</el-dropdown>

        </el-form-item> -->





        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible" width="80%">
      <h1>test</h1>
      <iframe :src="dialogUrl" width="100%" height="600px" frameborder="0"></iframe>
    </el-dialog>
    <!-- 新增子活动 -->
    <el-dialog
      title="childtitle"
      :visible.sync="childvisiable"
      width="650px"
      @close="closechild"
      append-to-body
    >

    <div  style=" display: flex;
  justify-content: center;
  align-items: center;"
  
  >

    
      <el-form ref="form" :model="child" :rules="childrules" label-width="80px" label-position="left">
        <el-form-item label="活动" prop="session">
          <el-input v-model="child.session" placeholder="请输入活动" />
        </el-form-item>
       
        <el-form-item>以下控制要素的需要，0表示不需要</el-form-item>
        <el-form-item label="作者信息" >
          <el-input-number
            v-model="child.auinfo"
            :min="0"
            :max="1"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="正文" >
          <el-input-number
            v-model="child.text"
            :min="0"
            :max="1"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="副标题">
          <el-input-number
            v-model="child.subtitle"
            :min="0"
            :max="1"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="封面">
     <el-input-number
            v-model="child.cover"
            :min="0"
            :max="1"
          ></el-input-number>
       
        </el-form-item>
       
        <el-form-item label="文档">
          <div>
               <el-input-number v-model="child.doc" :min="0"></el-input-number> <span  style="margin: 0 20px 0 5px;">个</span>
          <el-input-number v-model="child.docmax"></el-input-number><span  style="margin-left:5px;">MB</span>
          </div>
       
          <!-- 文档大小 -->
        </el-form-item>
        <el-form-item label="视频">
          <el-input-number v-model="child.vedio" :min="0"></el-input-number><span style="margin: 0 20px 0 5px;">个</span>
          <el-input-number v-model="child.vediomax" ></el-input-number><span style="margin-left:5px;">MB</span>
          <!-- 视频大小 -->
        </el-form-item>
        <el-form-item label="图片">
          <el-input-number v-model="child.pic" :min="0">
          </el-input-number><span style="margin: 0 20px 0 5px;">个</span>
          <el-input-number v-model="child.picmax" ></el-input-number> <span style="margin-left:0px;">MB</span>
          <!-- //图片大小 -->
        </el-form-item>
        <el-form-item label="音频">
          <el-input-number v-model="child.media" :min="0"></el-input-number><span style="margin: 0 20px 0 5px;">个</span>
          <el-input-number v-model="child.mediamax" ></el-input-number><span style="margin-left:5px;">MB</span>
          <!-- 音频大小 -->
        </el-form-item>
        <el-form-item label="附件">
          <el-input-number v-model="child.app" :min="0"></el-input-number><span style="margin: 0 20px 0 5px;">个</span>
          <el-input-number v-model="child.appmax" ></el-input-number><span style="margin-left:5px;">MB</span>
        <!-- 附件大小 -->
        </el-form-item>
       
      </el-form>
    </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormchild">提交</el-button>
        <el-button type="primary" @click="closechild">关闭</el-button>
      </span>
    </el-dialog>
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
import { getjudge ,findjudge,updatejudge,selectjudge} from "@/api/system/role";

export default {
  name: "Sroot",
  data() {
    return {
      //新增或修改
      edit: "",
      //评委
      judge: [],
      selectedjudge: [],
      selectedjudge0:[],
      // 控制表格是否刷新
      refreshTable: true,
      // 控制表格加载状态
      listLoading: true,
      // 控制是否默认展开所有行
      isExpandAll: false,
      // 表格树数据
      deptList: [],
      // 遮罩层
      docvisiable: false,
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      url: "https://li2ang.oss-cn-wuhan-lr.aliyuncs.com/add/%E4%BF%A1%E6%81%AF.docx",
      //填报状况
      pstatus: [
        {
          sessionid: "",
          finfish: "",
          all: "",
        },
      ],
      selectedjudges:[],
      //子活动
      childtitile: "",
      child: {
        id: "",
        root: "",
        session: "",
        text: 0,
        doc: 0,
        vedio: 0,
        media: 0,
        pic: 0,
        app: 0,
        subtitle: 0,
        auinfo: 0,
        cover: 0,
        picmax:0,
        docmax:0,
        mediamax:0,
        vediomax:0,
        appmax:0,
      
      },
      childrules: {
        session: [{ required: true, message: "活动不能为空", trigger: "blur" }],
        // 新增验证方式
       
      },
      // 【请填写功能名称】表格数据
      srootList: [
        {
          id: "",
          task: "",
          starttime: "",
          endtime: "",
          status: "",
          message:"",
          model:"",
        },
      ],
      session: [
        {
          id: "",
          root: "",
          session: "",
          text: "",
          doc: "",
          vedio: "",
          media: "",
          pic: "",
          app: "",
          status: "",
          subtitle: "",
          auinfo: "",
          cover: "",
        },
      ],
      //子活动
      root: "",
      childvisiable: false,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      //修改的控制
      show0: false,
      //活动详情页
      show: false,
      activity: "",
      time1: "",
      time2: "",
      //填报
      Visible: false,
      //粗略填报
      addproject: false,
      //预览word
      dialogVisible: false,
      dialogUrl: '',
      //活动修改
      choice: [{}],
      shows: false,
      //活动需求
      selectedOptions: [],
      subvisiable:false,
      url:"https://li2ang.oss-cn-wuhan-lr.aliyuncs.com/add/信息.docx",
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        task: null,
        starttime: null,
        endtime: null,
        status: null,

      },
      // 表单参数
      form: {
        id: "",
        task: "",
        starttime: "",
        endtime: "",
        status: false,
        fileMessageList:[ {}],//绑定url
        fileModelList:[{}],
      },
      // 表单校验
      rules: {
        task: [{ required: true, message: "活动不能为空", trigger: "blur" }],
      },
      project: {
        sessionid: "",
        title: "",
        author: "",
        school: "",
        userid: "",
      },
      projectRules: {
        title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
        author: [{ required: true, message: "作者不能为空", trigger: "blur" }],
      },
    };
  },
  created() {
    // window.open("http://view.officeapps.live.com/op/view.aspx?src="+this.url)
    this.admin = this.$store.state.user.id;
    this.getList();
    //填报状况

    getjudge().then((response) => {
      this.judge=response;
    // console.log(this.judge)
    });
    

    // getpstatus().then((response) => {
    //   this.pstatus = response;
    // });

    // 获取用户信息
    getUserbyid(this.$store.state.user.id).then((response) => {
      this.project.school = response.school;
      //  console.log("传过来的responserrrrrrrrrrrrr",response)
    });

    this.project.userid = this.$store.state.user.id;
  },
  methods: {
    handleJudgeChange(SelectedJudge) {

},

  
    
    /** 查询【请填写功能名称】列表 */
    getList() {
      this.loading = true;
      this.listLoading = true;
      // 定义两个异步请求
      const requestSroot = listSroot(this.queryParams);
      const requestSession = allsession();
      // 使用 Promise.all() 同时处理这两个异步请求
      Promise.all([requestSroot, requestSession])
        .then(([responseSroot, responseSession]) => {
          this.srootList = responseSroot.rows;
          this.total = responseSroot.total;
          this.session = responseSession;
          console.log(this.srootList)
        })
        .catch((error) => {
        })
        .finally(() => {
          this.loading = false;
          // 构造树形结构
          this.deptList = this.srootList.map((item) => {
            const children = this.session.filter(
              (sess) => sess.root === item.id
            );
            return {
              ...item,
              session: children,
              loading: false,
              expanded: false,
            };
          });

          this.listLoading = false;
          // 在数据加载完成后输出日志
        });
      init();
    }, 
    openDialog(url) {
      // 构造URL编码
      
      const url1=decodeURIComponent(url);
      // this.dialogUrl = `https://api.idocv.com/view/url?url=${url1}`;
      window.open("http://view.officeapps.live.com/op/view.aspx?src="+url)

      // this.dialogVisible = false;
    },
    //评审
    Score(row) {
        if(this.admin!=1)
        {
          const foundItem = this.srootList.find((item) => item.id === row.root);
          // 传的是小活动的数据
          findjudge(row.id).then((response) => {
            if(response===false){
            this.$modal.msgError("当前没有权限评审");
              return;
          }
          else{
            this.$router.push({
        path: "/score",
        query: { pid: row.id, session: row.session },
      });
          }
        });
         
          }
        
    },

    // 取消按钮
    cancel() {
      this.show0 = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        task: null,
        starttime: null,
        endtime: null,
        status: null,
      };
      this.show = false;
      this.show0 = false;
      this.show2 = false;
      this.Visible = false;
      init();
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
      init();
    },
   
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.show0 = true;
      this.title = "添加";
      this.edit = 0;
    },
    getCurrentTime() {
      const date = new Date();
      return date;
    },
    /** 修改按钮操作 */
    UpdateSroot(row) {
      // const date = this.getCurrentTime();
      // if (date > row.endtime && row.status != 1) {
      //   this.$modal.msgError("活动已经结束，无法修改");
      //   // return;
      // }
      selectjudge(row.id).then((response) => {
        this.selectedjudge = response;
        console.log(this.selectedjudge);
    
      });
   
      this.clearchild();
      getid(row.id);
      this.form.id = row.id;
      this.root = row.id;
      this.form.task = row.task;
      this.form.status = true ? row.status == 1 : row.status == 0;
      this.form.starttime = row.starttime;
      this.form.endtime = row.endtime;

      this.form.fileMessageList=row.message;//获取的url绑定row.message
      this.form.fileModelList=row.model;
      // console.log(row)

      this.show0 = true;
      this.title = "编辑";
      this.edit = 1;
      this.getList();
    },

    handleto(row) {
      this.show = true;
      this.activity = row.task;
      session(row.id)
        .then((response) => {
          if (response) {
            this.session = response;
          } else {
            // 如果返回值为空或者为 undefined，给出相应的提示
          }
        })
        .catch((error) => {
          // 处理请求失败的情况
        });
    },

    handleClose() {
      if (this.session) {
        this.session = [];
      }
      this.show = false;
    },

    /** 提交按钮 */
    submitForm() {

      // this.child.session=this.child.name;

      this.selectedjudge0.map((item) => {
 updatejudge(this.root,item).then((response) => {
 });
});
this.selectedjudges.map((item) => {
 updatejudge(0,item).then((response) => {
 });
});
this.selectedOptions=null;
this.selectedjudge0=null;

      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.starttime > this.form.endtime) {
            this.$modal.msgError("开始时间不能大于结束时间");
            return;
          } else if (
            this.form.starttime === null ||
            this.form.endtime === null
          ) {
            this.$modal.msgError("时间不能为空");
            return;
          }

          if (this.form.id != null) {
            this.form.status === false
              ? (this.form.status = 0)
              : (this.form.status = 1);

              const handleTask=this.srootList.some(item=>item.task===this.form.task)
              console.log(handleTask)
              if(handleTask)
              {
                this.$message({message:"项目名称重复,无法修改",type:'warning'})
              }
              else{
                updateSroot(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
            });
            this.show0 = false;
              this.getList();
           
              }
            
          } else {
            this.form.status === false
              ? (this.form.status = 0)
              : (this.form.status = 1);
              const handleTask=this.srootList.some(item=>item.task===this.form.task)
              console.log(handleTask)
              if(handleTask)
              {
                this.$message({message:"项目名称重复，无法添加",type:'warning'})
              }
              else{
                addSroot(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              
            });
             this.show0 = false;
              this.getList();
              }
            
          }
        }
      });

      this.show0 = false;
              this.getList();
    },
    //汇总表
    upsub(row){
        getsubid(row.id);
        this.subvisiable=true;
    },
    ToSroot(row){
        console.log(row)
      // alert(row.task);
        this.$router.push({
          path: "activity/prolist",
          // 传入id和task
          query: { sessionid: row.id ,srootid:row.root},
        });
        return;
      
    },
    //填报按钮
    Addproject(row) {
      const foundItem = this.srootList.find((item) => item.id === row.root);

      const date = this.getCurrentTime();

      const date2 = new Date(date).getTime();
      const endtime = foundItem.endtime;
      const date1 = new Date(endtime).getTime();
      const date3 = new Date(foundItem.starttime).getTime();

   
      if (date2 > date1) {
        this.$message.error("活动已经结束，无法填报");
        return;
      }
      if (date2 < date3) {
        this.$message.error("活动还未开始，无法填报");
        return;
      }

      this.$router.push({
        path: "/projects",
        query: { id: row.id },
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除编号为"' + ids + '"的数据项？')
        .then(function () {
          return delSroot(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "system/sroot/export",
        {
          ...this.queryParams,
          // ...this.deptList,
        },
        `sroot_${new Date().getTime()}.xlsx`
      );
    },

    //关闭
    close2() {
      this.reset();
    },
    //具体项目
    form1(id) {
      this.Visible = true;
    },
    //修改活动
    handleUpdate2(row) {
      this.shows = true;
      this.choice = row;
    },

    //构造树形
    constructTreeData() {
      this.deptList = this.srootList.map((item) => {
        const children = this.session.filter(
          (sessionItem) => sessionItem.root === item.id
        );
        return { ...item, children };
      });
    },
    //新增子活动
    addSession() {
      this.childvisiable = true;
    },
    //修改子活动
    editchild(row) {
      sessionid(row.id).then((response) => {
        this.child = response;

        // this.child.id = response.id;
        // this.child.root = response.root;
        // this.child.session = response.session;
        // this.child.text = response.text;
        // this.child.doc = response.doc;
        // this.child.vedio = response.vedio;
        // this.child.media = response.media;
        // this.child.pic = response.pic;
        // this.child.app = response.app;
        // this.child.subtitle = response.subtitle;
        // this.child.auinfo = response.auinfo;
        // this.child.cover = response.cover;

      });
      this.childvisiable = true;
    },
    //提交子活动
    // 验证子活动表单
   
    submitFormchild() {
      
      
    if(this.child.doc!=0)
    {
      if(this.child.docmax==0)
      {
        this.$message({message:"需要填写文档大小",type:'warning'})
        return;
        
      }
    }  else{
      if(this.child.docmax!=0)
      {
        this.$message({message:"需要填写文档个数",type:'warning'})
        return;
      }
      
    }
//  console.log(this.child.docmax)
    if(this.child.vedio!=0)
    {
      if(this.child.vediomax==0)
      {
        this.$message({message:"需要填写视频大小",type:'warning'})
        return;
      }
    }  else{
      if(this.child.vediomax!=0)
      {
        this.$message({message:"需要填写视频个数",type:'warning'})
        return;
      }
      
    }
    if(this.child.pic!=0)
    {
      if(this.child.picmax==0)
      {
        this.$message({message:"需要填写图片大小",type:'warning'})
        return;
      }
    }  else{
      if(this.child.picmax!=0)
      {
        this.$message({message:"需要填写图片个数",type:'warning'})
        return;
      }
    }
    if(this.child.media!=null)
    {
      if(this.child.mediamax==null)
      {
        this.$message({message:"需要填写音频大小",type:'warning'})
        return;
      }
    }  else{
      if(this.child.mediamax!=null)
      {
        this.$message({message:"需要填写音频个数",type:'warning'})
        return;
      }
    }
    if(this.child.app!=null)
    {
      if(this.child.appmax==null)
      {
        this.$message({message:"需要填写附件大小",type:'warning'})
        return;
      }
    }  else{
      if(this.child.appmax!=null)
      {
        this.$message({message:"需要填写附件个数",type:'warning'})
        return;
      }
    }

      if (this.child.id) {
        updatechild(this.child)
          .then((response) => {
            this.$modal.msgSuccess("修改成功");
            this.reset();
            this.childvisiable = false;
            this.getList();
          })
          .catch((error) => {
            this.$modal.msgError("提交失败，请重试");
          });
      } else {
        if(this.child.session=="")
       {
        this.$message({message:"活动名称必须填写",type:'warning'})
        return;
       }
      
        this.child.root = this.root;
      
        addchild(this.child)
          .then((response) => {
            this.$modal.msgSuccess("新增成功");
            // this.reset();
            this.resetForm("form");
            // 重置表单
            this.childvisiable = false;
          })
          .catch((error) => {
            // 处理提交失败的情况
            this.$modal.msgError("提交失败，请重试");
          });
      }
      // this.reset();这个很多余
    
      // this.getList();
      this.resetQuery();
    },
    //删除父活动
    deletsroot(row) {


    },
    //删除子活动
    deletechild(row) {
      delchild(row.id)
        .then((response) => {
          if(response===1)
        {  this.$modal.msgSuccess("删除成功");
          this.getList();
          // init();
        }
          else{
            this.$modal.msgError("删除失败，活动下存在填报项目");
            this.getList();
          }
        })
        .catch((error) => {
          // 处理提交失败的情况
          this.$modal.msgError("提交失败，请重试");
        });
    },

    //关闭子活动
    closechild() {
      // this.clearchild();
      this.childvisiable = false;
    },
    clearchild() {
      this.child.text = 0;
      this.child.doc = 0;
      this.child.vedio = 0;
      this.child.media = 0;
      this.child.pic = 0;
      this.child.app = 0;
      this.child.subtitle = 0;
      this.child.auinfo = 0;
      this.child.cover = 0;
      this.child.session = "";
      this.root = "";
      this.child.id = "";
    },
    toggleExpanded(row) {
      // 切换展开状态
      this.$set(row, "expanded", !row.expanded);
    },
    //信息展示
    showinfo() {
      let resultNew = encodeURIComponent(this.url);
      this.url =
        "https://docs.google.com/viewer?url=" + resultNew + "&embedded=true";
      window.open(this.url, "_target");
    },
    //上传通知
    changemessage(file)  {
      if(file!=null)
{      upmessage(file);
}      return false;
    },
  }
};
</script>

<style scoped>
.child-table {
  background-color: white; /* 子树表格背景色 */
  border: 1px solid #ddd; /* 子树表格边框 */
  margin-top: 10px; /* 子树表格上边距 */
  border-radius: 4px; /* 子树表格圆角 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 子树表格阴影 */
}
.control-element {
  font-weight: bold;
  margin-bottom: 10px;
}
.el-form-item {
  margin-bottom: 15px;
}

.link {
  color: black;
  text-decoration: none;
  font-size: 18px;
}

.link:hover {
  color: rgb(255, 17, 0);
  text-decoration: underline;
}
.table {
  font-size: 18px;
  width: 100%;
}
.btn {
  font-size: 20px;
  color: black;
}
.btn_up {
  font-size: 20px;
  color: rgb(9, 9, 9);
}
</style>
