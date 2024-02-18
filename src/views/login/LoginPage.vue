<script setup>
// 登录接口
import { userLogin, GetNavigationBar, getInfoByToken } from '@/api/user.js'
// 图标
import { User, Lock } from '@element-plus/icons-vue'

import { ElMessage } from 'element-plus'
// 响应式
import { ref, watch } from 'vue'
// 记住我
import { useUserStore } from '@/stores';
//路由
import router from '@/router'
import { addDynamicRoutes } from '@/router'
import { onMounted } from 'vue';




// 登录信息
const formData = ref({
  name: '',
  pass: ''
})
const userStore = useUserStore()
// mounted生命周期
onMounted(() => {
  console.info('进入onMounted生命周期')
  // 记住我
  if (userStore.isRemember) {
    formData.value.name = userStore.name
    formData.value.pass = userStore.pass
  }
})
// 监听变量
watch(() => userStore.isRemember, () => {
  userStore.setName('')
  userStore.setPass('')
})
// 校验信息
const formRules = {
  name: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  pass: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}
const refForm = ref()
const login = () => {
  refForm.value
    .validate()
    .then((res) => {
      console.info('表单验证成功', res)
      userLogin(formData.value)
        .then((resUser) => {

          ElMessage.success('登录成功')
          console.info("登录信息", resUser)

          userStore.setToken(resUser.data.response.token)
          userStore.setTokenType(resUser.data.response.token_type)
          // 记住我
          if (userStore.isRemember) {
            userStore.setName(formData.value.name)
            userStore.setPass(formData.value.pass)
          }
          // 获取用户信息
          getInfoByToken({ token: userStore.token }).then((userInfo) => {
            userStore.setUid(userInfo.data.response.Id)
            userStore.setUserInfo(userInfo.data.response)

            // 获取菜单
            GetNavigationBar({ uid: userStore.uid }).then((menuInfo) => {
              userStore.setMenu(menuInfo.data.response.children)

              // 添加vue router路由
              addDynamicRoutes(userStore.menu)
              if (userStore.curPage.path && userStore.curPage.path != '/login') {
                console.info("跳转:", userStore.curPage.path)
                router.replace(userStore.curPage.path)
                // userStore.setOneActiveTag(userStore.curPage.path)
              } else {
                // 跳转路由
                console.info("跳转:", "/")
                router.replace('/')
              }
            })
          })



        })
        .catch((errUser) => {

          // 在这里处理登录失败的额外操作
          console.info('登录失败', errUser) 
        })
    })
    .catch((err) => {
      ElMessage.error('请填写信息');
      console.info('表单验证失败', err)
    })
}
// 注册
const reg = () => {
  ElMessage.error('别乱点');
}


// 测试信息
const inputDemoAccount = (name, pass) => {
  formData.value.name = name
  formData.value.pass = pass
}
</script>
<template>
  <div class="login-box">
    <el-form @submit.prevent ref="refForm" :rules="formRules" :model="formData" label-position="left" label-width="0px"
      class="login-container">
      <h3 class="title">系统登录</h3>
      <el-form-item prop="name">
        <el-input v-model="formData.name" :prefix-icon="User" type="text" auto-complete="off" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="pass">
        <el-input @keyup.enter="login" v-model="formData.pass" :prefix-icon="Lock" auto-complete="off" show-password
          placeholder="密码"></el-input>
      </el-form-item>
      <el-checkbox class="remember" v-model="userStore.isRemember">记住我</el-checkbox>

      <div style="margin-bottom: 20px" class="count-test">
        <el-radio-group>
          <el-radio-button label="账号1" @click="inputDemoAccount('test', 'test')"></el-radio-button>
          <el-radio-button label="账号2" @click="inputDemoAccount('test2', 'test2')"></el-radio-button>
          <el-radio-button label="管理员" @click="inputDemoAccount('admin', 'admin')"></el-radio-button>
        </el-radio-group>
      </div>
      <el-form-item style="width: 100%">
        <el-button type="primary" style="width: 100%" @click="login">
          登录
        </el-button>
      </el-form-item>
      <el-form-item style="width: 100%">
        <el-button style="width: 100%" @click="reg">注册 </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style lang="scss" scoped>
.login-box {
  /* flex布局 */
  display: flex;
  /* 垂直居中 */
  justify-content: center;
  align-items: center;
  min-height: 100%;
  width: 100%;
  background-color: #2d3a4b;
  overflow: hidden;
}

/* 登录框样式 */
.login-container {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
  margin-top: 20px;
  margin-bottom: 20px;
}

// 标题
.login-container .title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}

// 记住我
.login-container .remember {
  margin: 0px 0px 15px 0px;
}
</style>
