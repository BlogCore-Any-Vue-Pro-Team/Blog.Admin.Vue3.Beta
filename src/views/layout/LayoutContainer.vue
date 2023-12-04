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
  Fold,
  Close,
  ArrowDown
} from '@element-plus/icons-vue'
import avatar from '@/assets/img/default.png'
import { useUserStore, useSettingStore } from '@/stores'
import { onMounted, ref } from 'vue'
import router from '@/router'
import MenuItemContainer from '@/views/layout/components/MenuItemContainer.vue'

const userStore = useUserStore()
const settingStore = useSettingStore()

onMounted(() => { })


const handleCommand = async (key, name) => {
  if (key === 'logout') {
    // 退出操作
    await ElMessageBox.confirm('你确认要进行退出么?', '温馨提示', {
      type: 'warning',
      confirmButtonText: '确认',
      cancelButtonText: '取消'
    })

    // 清除本地的数据 (token + user信息)
    userStore.logout()
    router.push('/login')

  } else {
    // 跳转操作
    userStore.setOneActiveTag({
      path: `/user/${key}`,
      title: name
    })
  }
}

const handleNavCommand = async (key) => {
  if (key === 'other') {
    // 退出操作
    await ElMessageBox.confirm('你确定要关闭其他页面?', '温馨提示', {
      type: 'warning',
      confirmButtonText: '确认',
      cancelButtonText: '取消'
    })
    userStore.closeOtherPage()

  } else if (key === 'all') {
    // 退出操作
    await ElMessageBox.confirm('你确定要关闭所有页面?', '温馨提示', {
      type: 'warning',
      confirmButtonText: '确认',
      cancelButtonText: '取消'
    })
    userStore.closeAllPage()
  }
}

// 获取导航面包屑
const getBreadcrumb = (curRoute, isDeep, breadcrumbList) => {
  if (!isDeep && curRoute.value.path === '/') return ['首页']

  if (!breadcrumbList)
    breadcrumbList = []

  if (!isDeep) {
    if (curRoute.value.meta.parent) {
      getBreadcrumb(curRoute.value.meta.parent, true, breadcrumbList)
    }
    breadcrumbList.push(curRoute.value.meta.title)
  }
  else {
    if (curRoute.meta.parent) {
      getBreadcrumb(curRoute.meta.parent, true, breadcrumbList)
    }
    breadcrumbList.push(curRoute.meta.title)
  }

  return breadcrumbList;
}
</script>

<template>
  <el-container class="layout-container">
    <el-aside :width="settingStore.isCollapse ? '65px' : '200px'">
      <el-scrollbar height="100%">
        <div class="el-aside__logo" v-show="!settingStore.isCollapse"></div>

        <el-scrollbar height="calc(100vh - 70px)">
          <el-menu :collapse-transition="false" active-text-color="#ffd04b" background-color="#2f3e52"
            :default-active="$route.path" text-color="#fff" router :collapse="settingStore.isCollapse">

            <MenuItemContainer :data="userStore.menu"></MenuItemContainer>

          </el-menu>
        </el-scrollbar>

      </el-scrollbar>
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
            <el-col :span="1.5">
              <el-breadcrumb separator="/" class="header-nav-box">
                <el-breadcrumb-item v-for="(item, index) in getBreadcrumb(router.currentRoute)" :key="index"><span
                    class="header-nav-title">{{ item }}</span></el-breadcrumb-item>

              </el-breadcrumb>
            </el-col>
          </el-row>

        </div>
        <el-dropdown placement="bottom-end">
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
              <el-dropdown-item :icon="User" v-on:click="handleCommand('profile', '基本资料')">基本资料</el-dropdown-item>
              <el-dropdown-item :icon="Crop" v-on:click="handleCommand('avatar', '更换头像')">更换头像</el-dropdown-item>
              <el-dropdown-item :icon="EditPen" v-on:click="handleCommand('password', '重置密码')">重置密码</el-dropdown-item>
              <el-dropdown-item :icon="SwitchButton" v-on:click="handleCommand('logout', '退出登录')">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main style="padding: 0px;">
        <div class="tags">
          <!-- 左 -->
          <div>
            <span :class="{ 'active': tag.active }" v-for="(tag, index) in userStore.tagsList" :key="tag.path"
              @click="userStore.setOneActiveTag(tag, index)" class="tags-view-item">
              {{ tag.title }}
              <el-icon class="el-icon-close" @click.prevent.stop="userStore.removeOneTag(tag)">
                <Close />
              </el-icon>
            </span>
          </div>
          <!-- 右 -->
          <div>
            <el-dropdown @command="handleNavCommand">
              <el-button type="primary" plain><el-icon class="el-icon--right"><arrow-down /></el-icon></el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="other">关闭其他</el-dropdown-item>
                  <el-dropdown-item command="all">关闭所有</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
        <el-scrollbar style="height: calc(100% - 40px);">
          <router-view></router-view>
        </el-scrollbar>
      </el-main>
      <el-footer>BCVP PRO ©2023 Create By 繁星 & Power By Vue3 & BCVP develop together</el-footer>
    </el-container>
  </el-container>
</template>
<style>
.fa {
  vertical-align: baseline;
  margin-right: 10px;
}

.el-menu--collapse i {
  font-size: 20px !important;
}

.el-menu--collapse span,
.el-menu--collapse .el-sub-menu__icon-arrow {
  display: none !important;
}
</style>
<style lang="scss" scoped>
.layout-container {
  height: 100vh;

  .el-aside {
    background-color: #2f3e52;

    &__logo {
      height: 70px;
      background: url('@/assets/img/default2.png') no-repeat center / 120px auto;
    }

    .el-menu {
      border-right: none;
    }
  }

  .el-header {
    background-color: #2f3e52;
    border-left: 1px #606266 solid;

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

    .header-nav-box {
      margin-top: 15px;
      margin-left: 10px;
    }

    .header-nav-title {
      color: #606266;
      font-size: 14px;
    }
  }
}

.tags {
  height: 40px;
  line-height: 40px;
  border: 1px solid #f0f0f0;
  background: #f0f0f0;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
}


.tags .tags-view-item {
  border: 1px solid #d8dce5;
  color: #495060;
  background: #fff;
  display: inline-block;
  height: 26px;
  line-height: 26px;
  padding: 0 8px;
  font-size: 12px;
  margin-left: 5px;
  margin-top: 4px;
  cursor: pointer;
}

.tags .tags-view-item.active::before {
  content: "";
  background: #2d8cf0;
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  position: relative;
  margin-right: 2px;
}

.tags .tags-view-item .el-icon-close {
  font-size: 10px;
}

.tags .tags-view-item .el-icon-close:hover {
  background-color: #ef2b74;
  color: #fff;
  border-radius: 20px;
}
</style>
