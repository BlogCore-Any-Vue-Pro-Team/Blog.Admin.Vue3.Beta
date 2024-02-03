<script setup>
import { onMounted, ref, watch } from 'vue'
import {
  getWeChatAccount
  , getWeChatCompany
  , pushTestMsg
} from '@/api/wechat.js'



const wechats = ref([])
const companys = ref([])
const operate = ref([{ value: "one", label: "单个用户" }, { value: "all", label: "所有用户" }])
const bindOrSub = ref([{ value: "sub", label: "订阅用户" }, { value: "bind", label: "绑定用户" }])
const msgTypes = ref([{ value: "text", label: "文本消息" }, { value: "image", label: "图片消息" }, { value: "voice", label: "语音消息" }, { value: "mpvideo", label: "视频消息" }])


const selectWeChat = ref(null)
const selectOperate = ref(null)
const selectBindOrSub = ref(null)
const selectCompany = ref(null)
const selectMsgType = ref(null)
const selectUser = ref(null)


const textContent = ref({
  text: ''
})
const pictureContent = ref({
  pictureMediaID: ''
})
const voiceContent = ref({
  voiceMediaID: ''
})
const videoContent = ref({
  title: '',
  pictureMediaID: '',
  videoMediaID: ''
})
const linkMsgContent = ref({
  title: '',
  description: '',
  viewUrl: '',
  pictureUrl: ''
})

// 微信列表
const GetWeChats = () => {
  getWeChatAccount().then(res => {
    wechats.value = res.data.response.data;
  });
}

// 公司列表

const GetWeCompanys = () => {
  getWeChatCompany().then(res => {
    companys.value = res.data.response.data
  });
}
// 发送消息
const HandleMsg = () => {
  if (!checkIsOk) {
    ElMessage.error('请填写完整信息!')
    return
  }
  ElMessageBox.confirm('确定发送么?')
    .then(() => {
      pushTestMsg(
        {
          selectWeChat: selectWeChat.value,
          selectOperate: selectOperate.value,
          selectBindOrSub: selectBindOrSub.value,
          selectCompany: selectCompany.value,
          selectMsgType: selectMsgType.value,
          selectUser: selectUser.value,
          textContent: textContent.value,
          pictureContent: pictureContent.value,
          voiceContent: voiceContent.value,
          videoContent: videoContent.value,
          linkMsgContent: linkMsgContent.value
        }
      ).then(res => {
        ElMessage.success(res.data.msg || '发送成功')
      })
    })
    .catch((err) => {
      console.info(err)
    })

}

const checkIsOk = () => {
  if (selectWeChat.value == '' || selectOperate.value == '' || selectBindOrSub.value == '' || selectMsgType.value == '')
    return false
  if (selectOperate.value == 'one' && selectBindOrSub.value == 'sub' && selectUser.value != '')
    return true
  if (selectOperate.value == 'one' && selectBindOrSub.value == 'bind' && selectCompany.value != '' && selectUser.value != '')
    return true
  if (selectOperate.value == 'all' && selectBindOrSub.value == 'sub')
    return true
  if (selectOperate.value == 'all' && selectBindOrSub.value == 'bind' && selectCompany.value != '')
    return true
  return false
}


//加载数据
onMounted(() => {
  GetWeChats()
  GetWeCompanys()
})


import { ElMessageBox, ElMessage } from 'element-plus'
</script>
<template>
  <!-- 搜索 -->
  <el-row>
    <el-col>
      <el-form @submit.prevent :inline="true" class="flexBox">
        <el-form-item class="flexItem">
          <el-select v-model="selectWeChat" placeholder="请选择要操作的公众号" style="width: 350px;">
            <el-option class="flexItem" v-for="item in wechats" :key="item.publicAccount" :label="item.publicNick"
              :value="item.publicAccount">
              <span>{{ item.publicNick }}</span>(<span>{{ item.publicAccount }}</span>)
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="flexItem">
          <el-select v-model="selectOperate" placeholder="请选择要发送的集合" style="width: 180px;">
            <el-option v-for="item in operate" :key="item.value" :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="flexItem">
          <el-select v-model="selectBindOrSub" placeholder="请选择要发送的对象" style="width: 180px;">
            <el-option v-for="item in bindOrSub" :key="item.value" :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="selectBindOrSub == 'bind'" class="flexItem">
          <el-select v-model="selectCompany" placeholder="请选择要操作的客户" style="width: 180px;">
            <el-option v-for="item in companys" :key="item.CompanyID" :label="item.CompanyName" :value="item.CompanyID">
              <span style="float: left">{{ item.CompanyName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.CompanyID }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="flexItem">
          <el-select v-model="selectMsgType" placeholder="请选择消息类型" style="width: 180px;">
            <el-option v-for="item in msgTypes" :key="item.value" :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="selectOperate == 'one'" class="flexItem">
          <el-input v-model="selectUser" placeholder="请输入要发送的用户"></el-input>
        </el-form-item>

        <el-form-item class="flexItem">
          <el-button type="primary" plain @click="HandleMsg">发送消息</el-button>
        </el-form-item>





      </el-form>
      <div><el-tag class="ml-2" type="warning">温馨提示:发送的用户必须要在24小时内有互动</el-tag></div>
      <el-card class="box-card" v-if="selectMsgType == 'text'">
        <template #header>
          <span>推送文本</span>
        </template>
        <el-form-item label="文本内容">
          <el-input v-model="textContent.text"></el-input>
        </el-form-item>
      </el-card>
      <el-card class="box-card" v-if="selectMsgType == 'image'">
        <template #header>
          <span>推送图片</span>
        </template>
        <el-form-item label="图片mediaID">
          <el-input v-model="pictureContent.pictureMediaID"></el-input>
        </el-form-item>
      </el-card>
      <el-card class="box-card" v-if="selectMsgType == 'voice'">
        <template #header>
          <span>推送语音</span>
        </template>
        <el-form-item label="语音mediaID">
          <el-input v-model="voiceContent.voiceMediaID"></el-input>
        </el-form-item>
      </el-card>
      <el-card class="box-card" v-if="selectMsgType == 'mpvideo'">
        <template #header>
          <span>推送视频</span>
        </template>
        <el-form-item label="视频mediaID">
          <el-input v-model="videoContent.videoMediaID"></el-input>
        </el-form-item>
      </el-card>

    </el-col>
  </el-row>
  <!-- 内容 -->


  <!-- 弹窗 -->
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
</style>