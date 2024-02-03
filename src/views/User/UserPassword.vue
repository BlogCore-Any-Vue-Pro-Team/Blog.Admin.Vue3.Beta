<script setup>
import { onMounted, ref, watch } from 'vue'
import {
  ResetMyPass
} from '@/api/user.js'
import { ElMessageBox, ElMessage } from 'element-plus'
import router from '@/router'
import { useUserStore } from '@/stores';
const userStore = useUserStore()
// 重置密码
const resetFormData = ref({})
const dialogResetVisible = ref(false)
const resetForm = ref()
const resetFormRule = {
  LoginPWD: [
    { required: true, message: '密码不能为空', trigger: 'change' },
  ],
  LoginPWD2: [
    { required: true, message: '密码不能为空', trigger: 'change' },
  ]
}

const SubmitReset = () => {

  resetForm.value.validate((valid, fields) => {
    if (!valid && fields) {
      for (let key in fields)
        ElMessage.error(fields[key][0].message)
      return;
    }
    if (resetFormData.value.LoginPWD != resetFormData.value.LoginPWD2) {
      ElMessage.error('确认密码不一致!')
      return;
    }
    ElMessageBox.confirm('确定重置么?')
      .then(() => {
        ResetMyPass(resetFormData.value).then((res) => {
          ElMessage.success(res.data.msg || '重置成功')
          dialogResetVisible.value = false
          // 清除本地的数据 (token + user信息)
          userStore.logout()
          router.push('/login')
        })
      })
  })


}
</script>
<template>
  <el-form style="width: 550px;" class="mobile-box" @submit.prevent ref="resetForm" :model="resetFormData"
    :rules="resetFormRule" label-width="80px" status-icon label-position="top">
    <el-form-item label="昵称" prop="RealName">
      <el-input v-model="userStore.userInfo.RealName" auto-complete="off" disabled></el-input>
    </el-form-item>
    <el-form-item label="新密码" prop="LoginPWD">
      <el-input v-model="resetFormData.LoginPWD" show-password auto-complete="off" clearable></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="LoginPWD2">
      <el-input v-model="resetFormData.LoginPWD2" show-password auto-complete="off" clearable></el-input>
    </el-form-item>
  </el-form>
  <el-button type="primary" @click="SubmitReset">
    确定
  </el-button>
</template>

