<template>
  <div>
      <div id="wordView" v-html="vHtml"></div>

  </div>
</template>

<script >
import { ref } from 'vue';
import mammoth from "mammoth";
export default {
  data() {
return {
  vHtml: "",
  wordURL:'https://li2ang.oss-cn-wuhan-lr.aliyuncs.com/add/%E4%BF%A1%E6%81%AF.docx' 
};
},
created(){
let resultNew= encodeURIComponent(this.wordURL)
let url = 'http://view.officeapps.live.com/op/view.aspx?src=' + resultNew
window.open(url, '_target')

}
}


</script>

<style scoped>
iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>