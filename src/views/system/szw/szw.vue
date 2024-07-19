<template>
  <div class="content-display">
    <el-button v-if="this.$store.state.user.id===1" @click="dialogVisible = true">
      查看云端数据储存
    </el-button>
    <el-dialog  :visible.sync="dialogVisible" title="云端数据储存">
      <div>
        <h3>图片</h3>
        <ul>
          <li v-for="(item, index) in imageGallery" :key="index">
            <span class="link">{{ item }}</span>
            <el-button type="text" @click="copyToClipboard(item)">点击复制</el-button>
          </li>
        </ul>

        <h3>视频</h3>
        <ul>
          <li v-for="(item, index) in videoGallery" :key="index">
            <span class="link">{{ item }}</span>
            <el-button type="text" @click="copyToClipboard(item)">点击复制</el-button>
          </li>
        </ul>

        <h3>文档</h3>
        <ul>
          <li v-for="(item, index) in doclist" :key="index">
            <span class="link">{{ item }}</span>
            <el-button type="text" @click="copyToClipboard(item)">点击复制</el-button>
          </li>
        </ul>

        <h3>附件</h3>
        <ul>
          <li v-for="(item, index) in applist" :key="index">
            <span class="link">{{ item }}</span>
            <el-button type="text" @click="copyToClipboard(item)">点击复制</el-button>
          </li>
        </ul>

        <h3>MP3</h3>
        <ul>
          <li v-for="(item, index) in mp3list" :key="index">
            <span class="link">{{ item }}</span>
            <el-button type="text" @click="copyToClipboard(item)">点击复制</el-button>
          </li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>


    <el-button @click="goBack" size="small">上一页</el-button>

    <h1 class="main-title">{{ mainTitle }}</h1>
    <h2 class="sub-title" v-if="subTitle">{{ subTitle }}</h2>

    <div v-if="coverImageUrl" class="cover-image">
      <img :src="coverImageUrl" alt="封面">
    </div>

    <div class="author-info">
      <h3>作者: {{ author }}</h3>
      <p v-if="authorInfo">作者信息:{{ authorInfo }}</p>
    </div>



    <div class="work-summary">
      <h3 v-if="workSummary">作品简介</h3>
      <p><h3>{{ workSummary }}</h3></p>
      <h3 v-if="workSummary">正文</h3>
      <p><h3>{{ content }} </h3></p>
    </div>


    <div  v-if="imageGallery.length > 0" class="image-gallery">
      <h3>图片展示</h3>
      <div v-for="(image, index) in imageGallery" :key="index" class="gallery-item">
        <img :src="image" :alt="'Image ' + (index + 1)">
      </div>
    </div>


    <div v-if="videoGallery.length > 0" class="video-gallery">
      <h3>视频展示</h3>
      <div v-for="(video, index) in videoGallery" :key="index" class="gallery-item">
        <video controls :src="video"></video>
      </div>
    </div>

    <div v-if="mp3list.length > 0" class="video-gallery">
      <h3>音频展示</h3>
      <div v-for="(mp3, index) in mp3list" :key="index" class="gallery-item">

         <el-button type="text" size="medium" font-size="20px" @click="playAudio(mp3)">{{mp3}}</el-button>
      </div>

      <audio v-if="audioSrc" :src="audio" controls></audio>
    </div>

    <div v-if="doclist.length > 0" class="video-gallery">
      <h3>文档展示</h3>
      <div v-for="(doc, index) in doclist" :key="index" class="gallery-item">
        <a :href="doc"  class="link"  target="_blank">{{ doc}}</a>
      </div>
    </div>

    <div v-if="applist.length > 0" class="video-gallery">
      <h3>附件</h3>
      <div v-for="(app, index) in applist" :key="index" class="gallery-item">
        <a :href="app" class="link"   target="_blank">{{ app}}</a>
      </div>
    </div>

   
  </div>
</template>

<script>
import {
  
  getpbyid,

} from "@/api/system/sroot";

export default {
  data() {
    return {
      dialogVisible:false,
      id:"",
      audioSrc:"",
      audio:'',
      content:"",
      mainTitle: '',
      subTitle: '',
      coverImageUrl: '',
      author: '',
      authorInfo: '',
      workSummary: '',
      imageGallery: [
      ],
      videoGallery: [
      ],
      doclist:[
      ],
      applist:[],
      mp3list:[],
    }
  },
  created() {
    console.log("this is query id",this.$route.query.id)
    this.id=this.$route.query.id;
    getpbyid(this.id).then((response) => {
        console.log("详细信息",response)
      this.mainTitle = response.title;
      this.subTitle = response.subtitle;
      //picture
      this.author = response.author;
      console.log(response.author)
      this.authorInfo = response.auinfo;
      this.content=response.protxt;
      this.workSummary = response.proinfo;
      this.coverImageUrl = response.cover.split("#resource#");
   
      // console.log(response.author)
     
      this.videoGallery = response.provideo.split("#resource#");
      this.doclist = response.prodoc.split("#resource#");
      this.imageGallery = response.propic.split("#resource#");
        this.mp3list=response.promedia.split("#resource#");
        this.applist=response.proapp.split("#resource#");
    }).catch((err) => {
    });
  },
    methods: {
    showinfo(doc){
      let resultNew= encodeURIComponent(doc)
  console.log("docxdocx",resultNew)
this.url = 'https://view.officeapps.live.com/op/view.aspx?src=' + encodeURIComponent(resultNew);
window.open(this.url, '_target')
},
playAudio(mp3){
this.audioSrc=true;
this.audio=mp3;
},
goBack(){
  this.$router.go(-1);

},
copyToClipboard(text) {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      this.$message({
        message: '复制成功',
        type: 'success'
      });
    }
    }
  
};
</script>

<style scoped>
.content-display {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.main-title {
  font-size: 2.5em;
  margin-bottom: 10px;
}

.sub-title {
  font-size: 2em;
  margin-bottom: 20px;
}

.cover-image img {
  max-width: 100%;
  height: auto;
  margin-bottom: 20px;
}

.author-info {
  margin-bottom: 20px;
}

.work-summary {
  margin-bottom: 20px;
}

.image-gallery {
  margin-bottom: 20px;
}

.gallery-item {
  margin-bottom: 20px;
}

.gallery-item img {
  max-width: 100%;
  height: auto;
}

.video-gallery video {
  max-width: 100%;
  height: auto;
}
.link {
  color: black;
  text-decoration: none;
  font-size: 18px; 
}

.link:hover {
  color: blue;
  text-decoration: underline;
}
a::after {
  content: " (点击下载)";
  display: none; /* 初始时隐藏 */
}

a:hover::after {
  display: inline; /* 鼠标悬浮时显示 */
  color: blue;
}
h3 {
  margin-top: 20px;
  font-weight: bold;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 5px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}


</style>
