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


// 手机适配
const showDiyElement = ref(true)
const isMobile = ref(false)
const toggleDiyElement = () => {
  showDiyElement.value = !showDiyElement.value;
  checkScreenWidth()
}
const hideDiyElement = () => {
  showDiyElement.value = false;
  checkScreenWidth()
}
const checkScreenWidth = () => {
  if (window.innerWidth <= 600) {
    settingStore.isCollapse = false
    isMobile.value = true
  } else {
    isMobile.value = false
  }
}
const clickCrumb = (flag) => {
  if (window.innerWidth <= 600) {
    showDiyElement.value = true
  }
  settingStore.isCollapse = flag
  checkScreenWidth()
}

onMounted(() => {
  checkScreenWidth()
  showDiyElement.value = false
  window.addEventListener('resize', checkScreenWidth);
})



// 其他
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
    breadcrumbList = ['首页']

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
    <el-aside v-if="!isMobile" ref="myLeft" :width="settingStore.isCollapse ? '65px' : '200px'">
      <!-- 左侧菜单 -->
      <div class="left-logo" v-show="!settingStore.isCollapse">繁星</div>
      <el-scrollbar :style="{ height: (settingStore.isCollapse ? 'calc(100vh)' : 'calc(100vh - 70px)') }">
        <el-menu :collapse-transition="false" active-text-color="#ffd04b" background-color="#2f3e52"
          :default-active="$route.path" text-color="#fff" router :collapse="settingStore.isCollapse">
          <MenuItemContainer :data="userStore.menu"></MenuItemContainer>
        </el-menu>
      </el-scrollbar>
    </el-aside>
    <div v-if="isMobile && showDiyElement">
      <!-- 左侧菜单(手机) -->
      <el-scrollbar class="overlay-body">
        <el-menu :collapse-transition="false" active-text-color="#ffd04b" background-color="#2f3e52"
          :default-active="$route.path" text-color="#fff" router :collapse="settingStore.isCollapse">
          <MenuItemContainer :data="userStore.menu"></MenuItemContainer>
        </el-menu>
      </el-scrollbar>
      <!-- 遮罩层 -->
      <div v-if="showDiyElement" class="diy-element">
        <div class="overlay" @click="hideDiyElement"></div>
      </div>
    </div>
    <el-container>
      <!-- 顶部 -->
      <el-header class="el-header-one">
        <div class="header-top">
          <div>
            <!-- 面包屑 -->
            <el-scrollbar>
              <div class="header-left">
                <el-icon ref="mySwitch" class="header-item header-switch" v-if="settingStore.isCollapse"
                  @click="clickCrumb(false)">
                  <Expand />
                </el-icon>
                <el-icon ref="mySwitch" class="header-item header-switch" v-if="!settingStore.isCollapse"
                  @click="clickCrumb(true)">
                  <Fold />
                </el-icon>
                <el-breadcrumb separator="/" class="header-item">
                  <el-breadcrumb-item v-for="(item, index) in getBreadcrumb(router.currentRoute)" :key="index"><span
                      class="header-nav-title">{{ item }}</span></el-breadcrumb-item>

                </el-breadcrumb>
              </div>
            </el-scrollbar>
          </div>
          <div>
            <!-- 个人设置 -->
            <el-dropdown placement="bottom-end">
              <span class="el-dropdown__box">
                <el-avatar :src="avatar" />
                <el-icon>
                  <CaretBottom />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item :icon="User" v-on:click="handleCommand('profile', '基本资料')">基本资料</el-dropdown-item>
                  <el-dropdown-item :icon="Crop" v-on:click="handleCommand('avatar', '更换头像')">更换头像</el-dropdown-item>
                  <el-dropdown-item :icon="EditPen" v-on:click="handleCommand('password', '重置密码')">重置密码</el-dropdown-item>
                  <el-dropdown-item :icon="SwitchButton"
                    v-on:click="handleCommand('logout', '退出登录')">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-header>
      <el-header class="el-header-two">
        <div class="tags">
          <!-- 窗口列表 -->
          <el-scrollbar>
            <div class="tags-left">
              <span :class="{ 'active': tag.active, 'tags-item': true }" v-for="(tag, index) in userStore.tagsList"
                :key="tag.path" @click="userStore.setOneActiveTag(tag, index)" class="tags-view-item">
                {{ tag.title }}
                <el-icon class="el-icon-close" @click.prevent.stop="userStore.removeOneTag(tag)">
                  <Close />
                </el-icon>
              </span>
            </div>
          </el-scrollbar>
          <!-- 关闭按钮 -->
          <div style="margin-left: 5px;margin-top: 3px;">
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
      </el-header>
      <el-main style="border: 1px solid #f0f0f0;  margin: 5px;  padding: 10px;box-sizing:border-box;">
        <router-view></router-view>
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

    .left-logo {
      height: 70px;
      // background: url('@/assets/img/default2.png') no-repeat center / 120px auto;

      line-height: 70px;
      text-align: center;
      color: #666;
    }

    .el-menu {
      border-right: none;
    }
  }

  .el-header-one {
    background-color: #2f3e52;
    border-left: 1px #606266 solid;
    align-items: center;
    justify-content: space-between;
  }

  .el-header-two {
    padding: 0px;
    margin: 0px;
    height: 40px;
  }

  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
  }

  .header-top {
    display: flex;
    justify-content: space-between;
    padding-top: 10px;

    .header-left {
      display: flex;

      .header-switch {
        color: #fff;
        font-size: 25px;
        margin-top: 8px;
        margin-right: 5px;
        cursor: pointer;
      }

      .header-item {

        line-height: 40px;

        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;

      }
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

.tags {
  .tags-left {
    display: flex;

    .tags-item {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

.diy-element {
  position: fixed;
  top: 0;
  left: 0;
  transform: translate(-50%, -50%);
  z-index: 9999;
  /* 其他样式 */
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}

.overlay-body {
  position: fixed;
  z-index: 10000;
  top: 0;
  left: 0;
  width: 200px;
  height: 100vh;
}
</style>
