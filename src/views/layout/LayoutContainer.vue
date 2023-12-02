<script setup>
import {
  Management,
  Promotion,
  UserFilled,
  User,
  Crop,
  EditPen,
  SwitchButton,
  CaretBottom,
  House,
  Expand,
  Fold
} from '@element-plus/icons-vue'
import avatar from '@/assets/img/default.png'
import { useUserStore, useSettingStore } from '@/stores'
import { onMounted } from 'vue'
import router from '@/router'
import MenuItemContainer from '@/views/layout/components/MenuItemContainer.vue'

const userStore = useUserStore()
const settingStore = useSettingStore()

onMounted(() => { })

const handleCommand = async (key) => {
  if (key === 'logout') {
    // 退出操作
    await ElMessageBox.confirm('你确认要进行退出么', '温馨提示', {
      type: 'warning',
      confirmButtonText: '确认',
      cancelButtonText: '取消'
    })

    // 清除本地的数据 (token + user信息)
    userStore.setToken('')
    router.push('/login')
  } else {
    // 跳转操作
    router.push(`/user/${key}`)
  }
}
</script>

<template>
  <el-container class="layout-container">
    <el-aside :width="settingStore.isCollapse ? '65px' : '200px'">
      <div class="el-aside__logo" v-show="!settingStore.isCollapse"></div>
      <el-menu active-text-color="#ffd04b" background-color="#2f3e52" :default-active="$route.path" text-color="#fff"
        router :collapse="settingStore.isCollapse">

        <MenuItemContainer :data="userStore.menu"></MenuItemContainer>
        
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div class="header-left">
          <el-row>
            <el-col :span="1.5">
              <el-icon class="collapse" v-if="settingStore.isCollapse"
                @click="settingStore.isCollapse = !settingStore.isCollapse">
                <Expand />
              </el-icon>
              <el-icon class="collapse" v-if="!settingStore.isCollapse"
                @click="settingStore.isCollapse = !settingStore.isCollapse">
                <Fold />
              </el-icon>
            </el-col>
            <el-col :span="1.5" class="header-nav-title"> 首页</el-col>
            <el-col :span="1.5"></el-col>
          </el-row>

        </div>
        <el-dropdown placement="bottom-end" @command="handleCommand">
          <!-- 展示给用户，默认看到的 -->
          <span class="el-dropdown__box">
            <el-avatar :src="avatar" />
            <el-icon>
              <CaretBottom />
            </el-icon>
          </span>

          <!-- 折叠的下拉部分 -->
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile" :icon="User">基本资料</el-dropdown-item>
              <el-dropdown-item command="avatar" :icon="Crop">更换头像</el-dropdown-item>
              <el-dropdown-item command="password" :icon="EditPen">重置密码</el-dropdown-item>
              <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer>我的UI框架 ©2023 Create By 繁星 & Power By Vue3</el-footer>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;

  .el-aside {
    background-color: #2f3e52;

    &__logo {
      height: 120px;
      background: url('@/assets/img/default.png') no-repeat center / 120px auto;
    }

    .el-menu {
      border-right: none;
    }
  }

  .el-header {
    background-color: #2f3e52;
    border-left: 1px #606266 solid;
    color: #606266;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .el-dropdown__box {
      display: flex;
      align-items: center;

      .el-icon {
        color: #999;
        margin-left: 10px;
      }

      &:active,
      &:focus {
        outline: none;
      }
    }
  }

  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
  }

  .header-left {
    .collapse {
      cursor: pointer;
      color: #fff;
      font-size: 25px;
      margin-top: 10px;
    }

    .header-nav-title {
      margin-left: 10px;
      line-height: 45px;
      font-size: 16px;
    }
  }
}
</style>