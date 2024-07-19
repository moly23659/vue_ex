<template>

  <div style=" min-height:90vh ;  flex-direction: column;margin-bottom: 0;width: 100%; ">
    <div style="height: 10vh; margin-bottom: 0;" >
      <el-button class="button_color" @click="goBack" size="medium" style=" padding: ; margin-top: 5vh; margin-bottom: 0;" >上一页</el-button>
    </div>
    <div style="height: 80%;">

    <el-table :data="tableData" style="width: 100%;height: 100%;" border>
      <!-- <el-table-column prop="id" label="序号" width="80"></el-table-column> -->
      <el-table-column  label="序号" width="80"  align="center" >
        <template slot-scope="scope">
        {{ scope.$index + 1 }}
      </template>
      </el-table-column>
      <el-table-column prop="school" label="学校" width="200px" align="center" ></el-table-column>
      <el-table-column prop="author" label="作者" width="90px" align="center" ></el-table-column>
      <el-table-column label="活动类型" width="220px" align="center" >
        <template slot-scope="scope">
          <span>{{ session }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="作品名称" align="center" ></el-table-column>
      <el-table-column label="评分" width="100" align="center" >
        <template slot-scope="scope">
          <span v-if="scope.row.userScore !== null">{{ scope.row.userScore.score }}</span>
          <span v-else>未评分</span>
        </template>
      </el-table-column>
      <el-table-column label="项目信息" width="150" align="center" >
        <template slot-scope="scope">
          <span :class="getStatusClass(scope.row)">
            <span v-if="scope.row.userScore !== null">
              <span v-if="scope.row.status > scope.row.userScore.status">有更新</span>
              <span v-else>已填报</span>
            </span>
            <span v-else>
              <span v-if="scope.row.status === 0">未填报</span>
              <span v-else>已填报</span>
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" >
        <template slot-scope="scope">
          <el-button class="button_color"  @click="Score(scope.row)" size="mini">评分</el-button>
          <el-button class="button_color"  @click="Look(scope.row)" size="mini">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 对话框 -->
    <el-dialog title="评分" :visible.sync="scorevisiable" width="30%">
      <el-form :model="score" :rules="rules" ref="scoreForm">
        <el-form-item label="评分" prop="score">
          <el-input v-model="score.score" placeholder="请输入评分" type="number" style="margin-bottom: 10px;"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="mes">
          <el-input type="textarea" v-model="score.mes" :rows="4" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="button_color" @click="scorevisiable = false, resetScore()">取消</el-button>
        <el-button class="button_color"  @click="saveData">确认</el-button>
      </span>
    </el-dialog>
  </div>
   

  </div>
  
</template>

<script>
import { getbyid, getscore, addscore, editscore } from "@/api/system/project";

export default {
  data() {
    return {
      update: '',
      session: '',
      tableData: [],
      projectid: '',
      scorevisiable: false,
      score: {
        id: null,
        pid: '',
        score: "",
        mes: '',
        uid: '',
        status: ''
      },
      rules: {
        score: [
          { required: true, message: '请输入评分', trigger: 'blur' }
        ],
      }
    };
  },
  created() {
    this.session = this.$route.query.session;
    this.projectid = this.$route.query.pid;
    this.getTable();
    
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },

    getTable(){
      getbyid(this.projectid).then(response => {
      const promises = response.map(item => {
        return getscore(item.id).then(scoreResponse => {
          item.userScore = scoreResponse.id !== 0 ? scoreResponse : null;
          return item;
        });
      });

      Promise.all(promises).then(results => {
        this.tableData = results;
      });
    });
    },
    Score(row) {
      this.update = row.status;
      // console.log(row)
      getscore(row.id).then(response => {
        // console.log(response)
        if (response && response.id != 0) {
          this.score = response;
        } else {
          this.score.uid = this.$store.state.user.id;
          this.score.status = this.update;
          this.score.pid = row.id;
        }
       
      })
      .catch(error=>{
        console.log("获取评分失败")
        this.score.uid = this.$store.state.user.id;
          this.score.status = this.update;
          this.score.pid = row.id;
      });
  
      this.scorevisiable = true;
    },
    Look(row) {
      this.$router.push({
        path: '/protest',
        query: { id: row.id }
      });
    },
    saveData() {
      console.log(this.score)
      this.$refs.scoreForm.validate(valid => {
        console.log(valid)
        if (valid==false) {
          this.$message("评分未输入")
         
        }
      });
      if (this.score.id === null) {
            addscore(this.score).then(() => {
              this.$message.success("添加成功");
              this.reset();
            });
          } else {
            editscore(this.score).then(() => {
              this.$message.success("修改成功");
              this.reset();
            });
          }
          this.getTable();
           this.scorevisiable=false;
    },
    reset() {
      this.score = {
        id: null,
        pid: '',
        score: "",
        mes: '',
        uid: '',
        status: ''
      };
      this.scorevisiable = false;
    },
    getStatusClass(row) {
      if (row.userScore !== null) {
        return row.status > row.userScore.status ? 'status-update' : 'status-filled';
      }
      return row.status === 0 ? 'status-unfilled' : 'status-filled';
    }
  }
};
</script>

<style scoped>
.el-table {
  margin-top: 10px;
}
.status-unfilled {
  color: rgb(255, 89, 0);
}
.status-filled {
  color: green;
}
.status-update {
  color: blue;
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
