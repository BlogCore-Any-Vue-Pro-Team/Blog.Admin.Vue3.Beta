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
  Close
} from '@element-plus/icons-vue'
import avatar from '@/assets/img/default.png'
import { useUserStore, useSettingStore } from '@/stores'
import { onMounted, ref } from 'vue'
import router from '@/router'
import MenuItemContainer from '@/views/layout/components/MenuItemContainer.vue'

const userStore = useUserStore()
const settingStore = useSettingStore()

onMounted(() => { })

const handleCommand = async (key) => {
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
    router.push(`/user/${key}`)
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

// 内容顶部 
const handleClickTag = (tag, curIndex) => {
  for (let index = 0; index < userStore.tagsList.length; index++) {
    const element = userStore.tagsList[index];
    if (tag === element) {
      element.active = true
    } else {
      element.active = false
    }
  }
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
      <el-main style="padding: 0px;">
        <div class="tags">
          <span :class="{ 'active': tag.active }" v-for="(tag, index) in userStore.tagsList" :key="tag.path"
            @click="userStore.setOneActiveTag(tag, index)"  class="tags-view-item">
            {{ tag.title }}
            <el-icon class="el-icon-close" @click.prevent.stop="userStore.removeOneTag(tag)">
              <Close />
            </el-icon>
          </span>
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
  cursor:pointer;
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
