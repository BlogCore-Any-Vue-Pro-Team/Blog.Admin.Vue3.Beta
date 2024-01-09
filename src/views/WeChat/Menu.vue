<script setup>
import { onMounted, ref, watch } from 'vue'
import {
  getWeChatMenu,
  updateWeChatMenu,
  getWeChatAccount
} from '@/api/wechat.js'



const wechats = ref([])
const selectWeChat = ref(null)
const curItem = ref(null)
const menu = ref({
  button: [
    {
      type: "click",
      name: "菜单1",
      key: "menu1", // 关键词
      url: "", // 跳转链接
      media_id: "", // 素材名称--图文消息
      sub_button: [
        {
          type: "click",//media_id:素材内容; view:跳转链接
          name: "子菜单1",
          key: "cmenu1", // 关键词
          // url: "",//跳转链接
          // media_id:"",//素材名称--图文消息
        },
        {
          type: "click",//media_id:素材内容; view:跳转链接
          name: "子菜单2",
          key: "cmenu1", // 关键词
          // url: "",//跳转链接
          // media_id:"",//素材名称--图文消息
        },
        {
          type: "click",//media_id:素材内容; view:跳转链接
          name: "子菜单3",
          key: "cmenu1", // 关键词
          // url: "",//跳转链接
          // media_id:"",//素材名称--图文消息
        }
      ]
    },
    {
      type: "click",
      name: "菜单2",
      key: "menu1", // 关键词
      url: "", // 跳转链接
      media_id: "", // 素材名称--图文消息
      sub_button: [
        {
          type: "click",//media_id:素材内容; view:跳转链接
          name: "子菜单1",
          key: "cmenu1", // 关键词
          // url: "",//跳转链接
          // media_id:"",//素材名称--图文消息
        }
      ]
    },

  ]
})

const GetWeChats = () => {
  getWeChatAccount().then(res => {
    wechats.value = res.data.response.data;
  });
}
const GetWxMenu = (id) => {
  getWeChatMenu({ id: id }).then(res => {
    menu.value = res.data.response.menu
  })
}
const HandleWechatFocusItem = (row) => {
  curItem.value = row
  menu.value.button.forEach(t => {
    t.isActive = false
    if (t.sub_button && t.sub_button.length) {
      t.sub_button.forEach(c => {
        c.isActive = false
      })

    }
  })
  row.isActive = true
}
// 添加菜单
const HandleWechatAddItem = () => {
  let addItem = {
    type: "click",
    name: "菜单",
    key: "menu1", // 关键词
    url: "", // 跳转链接
    media_id: "", // 素材名称--图文消息
    sub_button: [
    ]
  }
  menu.value.button.push(addItem)
  HandleWechatFocusItem(addItem)
}
// 添加子菜单
const HandleWechatAddChild = (parent) => {
  if (!parent.sub_button) {
    parent.sub_button = []
  }
  let addChild = {
    type: "click",//media_id:素材内容; view:跳转链接
    name: "子菜单1",
    key: "cmenu1", // 关键词
    // url: "",//跳转链接
    // media_id:"",//素材名称--图文消息
  }
  parent.sub_button.push(addChild)
  HandleWechatFocusItem(addChild)
}
const HandleDeleteItem = () => {
  if (!curItem.value) {
    ElMessage.error('请选择要操作的菜单')
    return
  }
  ElMessageBox.confirm('确定删除么?')
    .then(() => {
      let rowIndex = menu.value.button.findIndex(t => t === curItem.value)
      console.info("rowIndex", rowIndex)
      if (rowIndex >= 0) {
        //找到
        menu.value.button.splice(rowIndex, 1)
      } else {
        //找子节点
        menu.value.button.forEach(child => {
          let cRowIndex = child.sub_button.findIndex(c => c === curItem.value)
          if (cRowIndex >= 0) {
            //找到子节点
            child.sub_button.splice(cRowIndex, 1)
          }
        })
      }

      curItem.value = null
    })
    .catch((err) => {
      console.info(err)
    })
}
// 更新菜单
const HandleSubmitMenu = () => {
  if (!selectWeChat.value) {
    ElMessage.error('请选择要操作的公众号')
    return
  }

  ElMessageBox.confirm('确定发布么?')
    .then(() => {
      updateWeChatMenu({ id: selectWeChat.value, menu: menu.value }).then(res => {
        ElMessage.success(res.data.msg || '发布成功')
      })
    })
    .catch((err) => {
      console.info(err)
    })




}

//加载数据
onMounted(() => {
  GetWeChats()
})



</script>
<template>
  <!-- 搜索 -->
  <el-row>
    <el-col>
      <el-form :inline="true" class="flexBox">
        <el-form-item class="flexItem">
          <el-select @change="GetWxMenu" v-model="selectWeChat" placeholder="请选择要操作的公众号" style="width: 350px;">
            <el-option class="flexItem" v-for="item in wechats" :key="item.publicAccount" :label="item.publicNick"
              :value="item.publicAccount">
              <span>{{ item.publicNick }}</span>(<span>{{ item.publicAccount }}</span>)
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="flexItem">
          <el-button type="primary" plain @click="GetWxMenu(selectWeChat)">刷新菜单</el-button>
        </el-form-item>
      </el-form>

    </el-col>
  </el-row>
  <!-- 内容 -->
  <div style="display: flex;flex-wrap: wrap;">
    <!-- 左边 -->
    <el-card style="height: 550px;width: 375px;margin-right: 5px;margin-bottom: 5px;">
      <template #header>
        <div class="card-header">
          <span>菜单</span>
          <el-button style="float: right;" type="primary" plain @click="HandleSubmitMenu"> 发布 </el-button>
        </div>
      </template>

      <div class="wechatBox">
        <div class="wechatItem" :key="index" :class="{ isActive: item.isActive }" v-for="(item, index) in menu.button"
          @click="HandleWechatFocusItem(item)">{{
            item.name }}
          <div class="childBox">
            <div v-show="item.sub_button.length < 5" class="wechatItem childItem new"
              @click.stop="HandleWechatAddChild(item)">+</div>
            <div class="wechatItem childItem" :class="{ isActive: child.isActive }"
              @click.stop="HandleWechatFocusItem(child)" :key="cIndex" v-for="(child, cIndex) in item.sub_button">{{
                child.name }}</div>
          </div>
        </div>
        <div v-show="menu.button.length < 3" class="wechatItem new" @click="HandleWechatAddItem">+</div>
      </div>
    </el-card>
    <!-- 右边 -->
    <el-card style="min-width: 400px;flex: 1;margin-bottom: 5px;">
      <template #header>
        <div class="card-header">
          <span>当前节点配置</span>
          <el-button style="float: right;" type="danger" plain @click="HandleDeleteItem"> 删除当前节点 </el-button>
        </div>
      </template>

      <el-form v-if="curItem" :model="curItem" label-width="120px">
        <el-form-item label="菜单名称">
          <el-input v-model="curItem.name" />
        </el-form-item>
        <el-form-item label="菜单类型">
          <el-radio-group v-model="curItem.type">
            <!-- <el-radio :label="'media_id'">发送素材</el-radio> -->
            <el-radio :label="'click'">发送关键词</el-radio>
            <el-radio :label="'view'">跳转链接</el-radio>
            <el-radio :label="'miniprogram'">小程序</el-radio>
            <el-radio :label="'event'">事件功能</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="curItem.type == 'click'" label="关键词">
          <el-input v-model="curItem.key" />
        </el-form-item>

        <el-form-item v-if="curItem.type == 'view'" label="跳转链接">
          <el-input v-model="curItem.url" />
        </el-form-item>


        <el-form-item v-if="curItem.type == 'miniprogram'" label="小程序appid" placeholder="请输入小程序的appid">
          <el-input v-model="curItem.appid" />
        </el-form-item>
        <el-form-item v-if="curItem.type == 'miniprogram'" label="小程序网页路径" placeholder="请输入小程序的页面路径，如：pages/index">
          <el-input v-model="curItem.pagepath" />
        </el-form-item>

        <el-form-item v-if="curItem.type == 'event'" label="功能事件">
          <el-radio-group v-model="curItem.key">
            <el-radio :label="'pic_weixin'">微信相册</el-radio>
            <el-radio :label="'pic_sysphoto'">拍照发图</el-radio>
            <el-radio :label="'location_select'">位置选择</el-radio>
            <el-radio :label="'scancode_push'">微信扫码</el-radio>
          </el-radio-group>
        </el-form-item>

      </el-form>
      <div>{{ menu }}</div>

    </el-card>
  </div>
</template> 
<style lang="scss" scoped>
.flexBox {
  display: flex;
  flex-wrap: wrap;

  .flexItem {
    color: #fff;
    font-size: 25px;
    margin-top: 8px;
    margin-right: 5px;
    cursor: pointer;
    flex-wrap: wrap;
  }

  .flexContent {
    width: 200px;
  }
}

// 微信样式
.wechatBox {
  display: flex;

  .wechatItem {
    box-sizing: border-box;
    width: 85px;
    background-color: #e2e2e2;
    height: 45px;
    line-height: 45px;
    text-align: center;
    margin-right: 2px;
    cursor: pointer;
    border: 1px solid #e2e2e2;
  }

  .new {
    font-size: 21px;
    color: green;
  }

  .isActive {
    border: 1px solid #2bb673;
  }

  .childItem {
    margin-top: 1px;
  }
}
</style>