<template>
  <div>
    <div v-if="!loaded" style="height: 500px; background-color: white"></div>
    <!-- 占位元素 -->
    <div
      v-else
      :style="{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }"
    >
    

      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
      <el-button @click="$router.go(-1)" size="small">上一页</el-button>
        <!-- <el-form-item>
        <el-select v-model="value" placeholder="请选择" @change="change()">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.session"
            :value="item.session"
          >
          </el-option>
        </el-select>
      </el-form-item> -->
        <el-form-item label="项目标题:" prop="title">
          <el-input
            v-model="ruleForm.title"
            :style="{ width: '800px' }"
            placeholder="请输入项目标题"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="session.subtitle === 1"
          label="副标题:"
          placeholder="请输入副标题"
          prop="subtitle"
        >
          <el-input
            v-model="ruleForm.subtitle"
            :style="{ width: '800px' }"
          ></el-input>
        </el-form-item>

        <el-form-item v-if="session.cover > 0" label="封面:" prop="cover">
          <el-upload
          v-model="ruleForm.cover"
            ref="cover"
            :autoUpload="true"
            list-type="picture-card"
            :on-preview="picPreview"
            :multiple="false"
            :on-success="updatecover"
            action="http://120.27.192.197:8000/szw/uploadcover"
            :file-list="coverlist"
          >
            <i slot="default" class="el-icon-plus" />
          </el-upload>
        </el-form-item>

        <el-form-item label="作者:" prop="author">
          <el-input
            v-model="ruleForm.author"
            :style="{ width: '800px' }"
            placeholder="请输入作者姓名"
          ></el-input>
        </el-form-item>

        <el-form-item
          v-if="session.auinfo === 1"
          label="作者信息:"
          placeholder="请输入作者信息"
          prop="auinfo"
        >
          <el-input
            v-model="ruleForm.auinfo"
            :style="{ width: '800px' }"
          ></el-input>
        </el-form-item>

        <el-form-item label="作品简介:" prop="proinfo">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 100 }"
            placeholder="请输入作品简介"
            v-model="ruleForm.proinfo"
          >
          </el-input>
        </el-form-item>

        <el-form-item  prop="protxt" label="正文:" v-if="session.text === 1">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 100 }"
            placeholder="请输入正文"
            v-model="ruleForm.protxt"
          >
          </el-input>
        </el-form-item>

        <el-form-item v-if="session.pic > 0" prop="propic" :label="`图片上传:`">
          <el-upload
            ref="pic"
            list-type="picture-card"
            action="http://120.27.192.197:8000/szw/uploadpic"
            :autoUpload="true"
            :on-preview="picPreview"
            :on-remove="handleRemove"
            :on-change="handleChange1"
            :before-upload="picjudge"
            :multiple="false"
            :file-list="piclist"
            :on-success="updatepic"
            :limit="this.session.pic"
          >
            <i slot="default" class="el-icon-plus" />
          </el-upload>
        </el-form-item>

 

        <el-form-item v-if="session.vedio > 0" prop="provideo" :label="`视频上传:`">
          <el-upload
            ref="upload"
            action="http://120.27.192.197:8000/szw/uploadmp4"
            list-type="text"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-change="handleChange"
            :multiple="true"
            :file-list="videoList"
            :on-success="updatevideo"
            :before-upload="videojudge"
            :limit="this.session.vedio"
          >
            <el-button type="primary" icon="el-icon-video-camera" size="sma">
              上传视频
            </el-button>
          
          </el-upload>
         <h3>数量:{{session.vedio}}大小:{{ session.vediomax}}MB</h3> 
          <el-dialog :visible.sync="dialogVisible" @close="handleDialogClose">
            <video
              :src="dialogUrl"
              ref="videoPlayer"
              style="max-width: 100%; max-height: 100%"
              controls
            ></video>
          </el-dialog>
        </el-form-item>

        <el-form-item v-if="session.media > 0" prop="promedia" :label="`音频上传:`">
          <el-upload
            ref="upload"
            list-type="text"
            action="http://120.27.192.197:8000/szw/uploadmp3"
            :multiple="true"
            :file-list="audiolist"
            :on-change="handleChange2"
            :on-preview="handlePreview2"
            :on-remove="handleRemove"
            :before-upload="mediajudge"
            :on-success="updateaudio"
            :limit="this.session.media"
          >
            <el-button type="primary" icon="el-icon-headset" size="sma">
              上传音频
            </el-button>
          </el-upload>
          <h3>数量:{{session.media}}大小:{{ session.mediamax}}MB</h3> 

          <audio v-if="audioSrc" :src="audioSrc" controls></audio>
        </el-form-item>

        <el-form-item v-if="session.doc > 0"   prop="prodoc" :label=" `文档上传  :`">
          <el-upload
            ref="upload"
            list-type="text"
            :multiple="true"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            action="http://120.27.192.197:8000/szw/uploaddoc"
            :file-list="doclist"
            :on-success="updatedoc"
            :before-upload="docjudge"
            :limit="this.session.doc"
          >
            <el-button type="primary" icon="el-icon-document" size="sma">
              上传文档
            </el-button>
          </el-upload>
          <h3>数量:{{session.doc}}大小:{{ session.docmax}}MB</h3> 

        </el-form-item>

        <el-dialog
          :visible.sync="dialogVisibled"
          width="60%"
          :before-close="handleClose"
        >
          <span slot="title">文档预览</span>
          <div>
            <div
              v-if="previewContent"
              v-html="previewContent"
              class="preview-container"
            ></div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisibled = false">关闭</el-button>
          </span>
        </el-dialog>

        <el-form-item v-if="session.app> 0" prop="proapp"  :label="`附件上传:`">
          <el-upload
            ref="upload"
            list-type="none"
            :autoUpload="true"
            :multiple="true"
            :on-change="handleChangea"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            action="http://120.27.192.197:8000/szw/uploadapp"
            :file-list="applist"
            :limit="this.session.app"
            :before-upload="appjudge"
            :on-success="updateapp"
          >
            <el-button type="primary" icon="el-icon-folder" size="sma">
              上传附件 
            </el-button>
          </el-upload>
          <h3>数量:{{session.app}}大小:{{ session.appmax}}MB</h3> 

        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >保存提交</el-button
          >
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {
  session,
  upload,
  geturl,
  sessionid,
  getpbyid,
  sendid,
  updatep,
} from "@/api/system/sroot";
import mammoth from "mammoth";

export default {
  data() {
    return {
      ruleForm: {
        id: "",
        sessionid: "",
        title: "",
        subtitle: "",
        cover: "",
        author: "",
        auinfo: "",
        proinfo: "",
        protxt: "",
        prodoc: "",
        promedia: "",
        provideo: "",
        propic: "",
        proapp: "",
        school: "",
        userid: "",
        status:'',
      },
      rules: {
        title: [{ required: true, message: "请输入项目标题", trigger: "blur" }],
        subtitle: [
          { required: true, message: "请输入副标题", trigger: "blur" },
        ],
     
        author: [{ required: true, message: "请输入作者", trigger: "blur" }],
       
        protxt:[{required : true, message:"请输入正文", trigger:"blur"}],
      },
      videoList: [],
      doclist: [],
      applist: [],
      piclist: [],
      audiolist: [],
      coverlist: [],
      textarea2: "",
      textarea1: "",
      item: "",
      choice: "",
      flag: "",
      dialogVisible: false,
      dialogUrl: "",
      dialogVisible1: false, // 控制对话框的显示与隐藏
      dialogImageUrl1: "", // 存储预览图片的 URL
      value: "",
      id: "",
      audioSrc: "",
      previewContent: "", // 存储预览内容
      dialogVisibled: false,
      data: [],
      projectid: "",
      loaded: false,

      session: {
        id: "",
        root: "",
        subtitle: "",
        session: "",
        text: "",
        doc: "",
        vedio: "",
        media: "",
        pic: "",
        app: "",
        status: "",
        picmax:"",
        vediomax:"",
        mediamax:"",
        appmax:"",
        docmax:"",
      },
      max:2,
    };
  },
  mounted() {
    setTimeout(() => {
      this.loaded = true;
    }, 550);
  },
  created() {
    this.projectid = this.$route.query.id;
    this.id = this.$route.query.pid;
    axios.get("http://120.27.192.197:8000/szw/deal/" + this.projectid);
    console.log("这是flagprojid", this.projectid);
    console.log("这是flag", this.id);

    getpbyid(this.projectid).then((response) => {
      this.ruleForm = response;
      let listpic = response.propic ? response.propic.split("#resource#") : [];
let listdoc = response.prodoc ? response.prodoc.split("#resource#") : [];
let listvedio = response.provideo ? response.provideo.split("#resource#") : [];
let listmedia = response.promedia ? response.promedia.split("#resource#") : [];
let listapp = response.proapp ? response.proapp.split("#resource#") : [];
let listcover = response.cover ? response.cover.split("#resource#") : [];

this.piclist = listpic.length ? listpic.map((url) => ({
  url,
  name: url.split('/').pop(), // 设置文件名
})) : [];
this.doclist = listdoc.length ? listdoc.map((url) => ({
  url,
  name: url.split('/').pop(), // 设置文件名
})) : [];
this.videoList = listvedio.length ? listvedio.map((url) => ({
  url,
  name: url.split('/').pop(), // 设置文件名
})) : [];
this.audiolist = listmedia.length ? listmedia.map((url) => ({
  url,
  name: url.split('/').pop(), // 设置文件名
})) : [];
this.applist = listapp.length ? listapp.map((url) => ({
  url,
  name: url.split('/').pop(), // 设置文件名
})) : [];
this.coverlist = listcover.length ? listcover.map((url) => ({
  url,
  name: url.split('/').pop(), // 设置文件名
})) : [];


     
    });
    sessionid(this.id)
      .then((response) => {
        this.session = response;
        console.log("这是判断的session", this.session);

        this.flag = 1;
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });

   
  },

  methods: {
    submitForm(formName) {
console.log("this is rule form", this.ruleForm);
this.$refs[formName].validate(valid => {
        if (valid) {
          this.ruleForm.status++;
          // 表单验证通过，可以在这里提交表单数据或执行其他操作
          updatep(this.ruleForm)
          this.$message.success('上传成功');
          this.$router.go(-1);          // 在这里提交表单或执行其他操作

        } else {
          // 表单验证失败，可以在这里处理错误信息或其他逻辑
          this.$message.error('上传失败，有未选择的内容');
        }
      });

    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.fileList = [];
      this.doclist = [];
      this.applist = [];
      this.piclist = [];
      this.audiolist = [];
      this.coverlist = [];
      this.videoList = [];
      this.audioSrc = "";
    },
    // change(item) {
    //   console.log("选择的的", this.value);
    //   this.choice = this.options.find(
    //     (option) => option.session === this.value
    //   );
    // },

    handlePreview(file) {
      // 在此处处理视频预览
      console.log("Preview:", file);
      // this.dialogUrl = URL.createObjectURL(file.raw);
      if (file.url && file.url.includes && file.url.includes("aliyuncs.com")) {
        console.log("preview", file);
        this.dialogUrl = file.url;
        this.dialogVisible = true;
      } else {
        this.dialogUrl = URL.createObjectURL(file.raw);
        this.dialogVisible = true;
      }
    },
    handleRemove(file) {
     

      
    },
    handleChange(file, fileList) {
      // 处理文件改变时的逻辑
      this.fileList = fileList;
      console.log("Change:", this.fileList);
    },
//封面更新
updatecover(response)
{

this.ruleForm.cover="finish";
},
updatepic(response)
{

this.ruleForm.propic="finish";
},
updateaudio(response)
{

this.ruleForm.promedia="finish";
},
updatevideo(response)
{

this.ruleForm.provideo="finish";
},
updateapp(response)
{

this.ruleForm.proapp="finish";
},
updatedoc(response){
  this.ruleForm.prodoc="finish"
},
    handleDialogClose() {
      // 对话框关闭时停止视频播
      const videoPlayer = this.$refs.videoPlayer;
      if (videoPlayer != null) {
        console.log("Stopping video playback");
        videoPlayer.pause();
        videoPlayer.currentTime = 0;
      }
    },

    handleChange1(file, fileList) {
      console.log("选中的");

      this.piclist = fileList;
    },

    // 图片预览
    picPreview(file) {
      this.dialogImageUrl1 = file.url;
      this.dialogVisible1 = true;
    },

//图片判断  紧跟着是所有的判断
    picjudge(file){
      console.log("这是图片的判断",file.size);
   
      if(file.size/1024/1024>this.session.picmax){
            this.$message.error(`图片大小不能超过${this.session.picmax}MB`);
        return false;
      }
    },
    // 视频判断
    videojudge(file) {
      if (file.size/1024/1024> this.session.vediomax) {
        this.$message.error(`视频大小不能超过${this.session.vediomax}MB`);
        return false;
      }
    },
    // 音频判断
    mediajudge(file) {
      if (file.size/1024/1024> this.session.meidamax) {
        this.$message.error(`音频大小不能超过${this.session.mediamax}MB`);
        return false;
    }
  },
  // 文件判断
  docjudge(file) {
    if (file.size/1024/1024> this.session.docmax) {
        this.$message.error(`文件大小不能超过${this.session.docmax}MB`);
        return false;
    }
  },
  appjudge(file) {
    if (file.size/1024/1024> this.session.appmax) {
        this.$message.error(`文件大小不能超过${this.session.appmax}MB`);
        return false;
    }
  },

   
 

    handleChange2(file, fileList) {
      this.audiolist = fileList;
      if (file.status === "ready") {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.audioSrc = e.target.result;
        };
        reader.readAsDataURL(file.raw);
      }
    },
    handlePreview2(file) {
      console.log("Preview file:", file);
      this.audioSrc = URL.createObjectURL(file.raw);
    },
  

    handleChange3(file, fileList) {
      // 更新文件列表
      this.doclist = fileList;
    },
   
    async handlePreview3(file) {
      if (
        file.raw &&
        file.raw.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const arrayBuffer = event.target.result;
          const result = await mammoth.convertToHtml({
            arrayBuffer: arrayBuffer,
          });
          this.previewContent = result.value;

          this.dialogVisibled = true; // 打开对话框
        };
        reader.readAsArrayBuffer(file.raw);
      } else {
        this.previewContent = "预览仅支持 .docx 文件";
        this.downloadFile(file);
        this.dialogVisibled = true; // 打开对话框显示错误信息
      }
    },
    handleClose(done) {
      this.previewContent = ""; // 清除预览内容
      done();
    },

    handleChangea(file, fileList) {
      // 更新文件列表
      this.applist = fileList;
    },
  
    handlePrevie(file) {
      // 点击预览按钮时，触发文件下载
      this.downloadFile(file);
    },

    downloadFile(file) {
      // 判断文件是否来自阿里云仓库
      if (file.fromAliyun) {
        // 文件来自阿里云仓库，直接使用原始链接下载
        window.location.href = file.url;
      } else {
        // 创建一个下载链接，触发文件下载
        const url = window.URL.createObjectURL(file.raw);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    },

   
  },
};
</script>

<style scoped>
.center-form {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.preview-container {
  border: 1px solid #dcdcdc;
  padding: 10px;
  max-height: 500px;
  overflow-y: auto;
}
/* ::v-deep是vue3提供的深度选择器，.el-form-item__label是element-plus官方定义的类 */
::v-deep .el-form-item__label{

  font-size: 16px;
}

</style>
