<template>
    <div class="form-container" >
      <el-form :model="form" :rules="rules" ref="form" label-width="80px">
        <el-form-item label="姓名" prop="nickName">
          <el-input v-model="form.nickName"></el-input>
        </el-form-item>
        <el-form-item label="学校" prop="school">
      <el-select v-model="form.school" placeholder="请选择学校" filterable style="width: 320px;">
        <el-option
          v-for="school in hschool"
          :key="school.id"
          :label="school.hschool"
          :value="school.hschool"
        ></el-option>
      </el-select>
    </el-form-item>
        <el-form-item label="联系电话" prop="phonenumber">
          <el-input v-model="form.phonenumber"></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="邮寄地址" prop="address">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveForm">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </template>
  
  <script>
  import { otherinfo } from "@/api/system/user";
  import { hschool } from "@/api/system/sroot";
  export default {
    data() {
      const validateEmail = (rule, value, callback) => {
        const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        if (!value) {
          return callback(new Error('电子邮箱不能为空'));
        } else if (!emailRegex.test(value)) {
          return callback(new Error('请输入有效的电子邮箱'));
        } else {
          callback();
        }
      };
  
      const validatePhone = (rule, value, callback) => {
        const phoneRegex = /^[0-9]{10,15}$/;
        if (!value) {
          return callback(new Error('联系电话不能为空'));
        } else if (!phoneRegex.test(value)) {
          return callback(new Error('请输入有效的联系电话'));
        } else {
          callback();
        }
      };
  
      return {
        hschool: [],
        form: {
          nickName: '',
          school: '',
          phonenumber: '',
          email: '',
          address: ''
        },
        rules: {
          nickName: [
            { required: true, message: '姓名不能为空', trigger: 'blur' }
          ],
          school: [
            { required: true, message: '学校不能为空', trigger: 'blur' }
          ],
          phonenumber: [
            { required: true, validator: validatePhone, trigger: 'blur' }
          ],
          email: [
            { required: true, validator: validateEmail, trigger: 'blur' }
          ],
          address: [
            { required: true, message: '邮寄地址不能为空', trigger: 'blur' }
          ]
        }
      };
    },
    created() {
      hschool().then(response => {
        this.hschool = response;
        console.log(this.hschool);
      });
    },
    methods: {
      saveForm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            otherinfo(this.form).then(response => {
              console.log(this.form);
              this.$message({
                message: '保存成功',
                type: 'success'
              });
            
            }).catch(error => {
              this.$message({
                message: '保存失败',
                type: 'error'
              });
            });
          } else {
            console.error('表单验证失败');
            return false;
          }
        });
      }
    }
  };
  </script>
  
  <style>
  .form-container {
    width: 400px;
    margin: 0 auto;
  }
  .form-container {
  margin-top: 50px; /* 设置上边距为 20px，根据需要调整 */
}
  </style>
  