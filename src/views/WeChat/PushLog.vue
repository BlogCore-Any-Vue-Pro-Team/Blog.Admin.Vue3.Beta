<script setup>
import { onMounted, ref, watch } from 'vue'
import {
  getWeChatPushLog
  , getWeChatAccount
  , getWeChatCompany
} from '@/api/wechat.js'


import { ElMessageBox } from 'element-plus'
const wechats = ref([])
const selectWeChat = ref(null)
const selectCompany = ref(null)
const selectUser = ref(null)
const tableData = ref([])
const tableTotal = ref(0)
const filters = ref({ page: 1, size: 10, key: '' })
const currentRow = ref()
const selectRows = ref([])

const HandleSelectChange = (selection) => {
  selectRows.value = selection
}
const HandleClickRow = (val) => {
  currentRow.value = val
}
const HandleClearTable = () => {
  //当前表格数据
  // tableData.value = []
  //统计总数(不要手动重置 否则会出现翻页问题 找了好半天)
  // tableTotal.value = 0
  //当前选中行
  currentRow.value = null
  //当前选择多行
  selectRows.value = []
}

// 公司列表
const companys = ref([])
const GetWeCompanys = () => {
  getWeChatCompany().then(res => {
    companys.value = res.data.response.data
  });
}
const GetWeChats = () => {
  getWeChatAccount().then(res => {
    wechats.value = res.data.response.data;
  });
}
const HandleSearch = (val) => {
  if (val) {
    filters.value.page = val
  }
  HandleClearTable()

  filters.value.strOrderByFileds = "Id desc"
  filters.value.conditions = "PushLogPublicAccount = " + selectWeChat.value

  if (selectCompany.value) {
    filters.value.conditions += " & PushLogCompanyID = " + selectCompany.value
  }
  if (selectUser.value) {
    filters.value.conditions += " & PushLogToUserID = " + selectUser.value
  }

  getWeChatPushLog(filters.value)
    .then(res => {
      tableData.value = res.data.response.data;
      tableTotal.value = res.data.response.dataCount;
    })
}

//窗口关闭
const handleClose = (done) => {
  ElMessageBox.confirm('确定关闭么?')
    .then(() => {
      done()
    })
    .catch((err) => {
      console.info(err)
    })
}




//加载数据
onMounted(() => {
  GetWeChats()
  GetWeCompanys()
})
// 翻页
watch(() => filters.value.page, () => {
  HandleSearch()
})
watch(() => filters.value.size, () => {
  filters.value.page = 1
  HandleSearch()
})



</script>
<template>
  <!-- 搜索 -->
  <el-row>
    <el-col>
      <el-form @submit.prevent :inline="true" class="flexBox">
        <el-form-item class="flexItem">
          <el-select @change="HandleSearch(1)" v-model="selectWeChat" placeholder="请选择要操作的公众号" style="width: 350px;">
            <el-option class="flexItem" v-for="item in wechats" :key="item.publicAccount" :label="item.publicNick"
              :value="item.publicAccount">
              <span>{{ item.publicNick }}</span>(<span>{{ item.publicAccount }}</span>)
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="flexItem">
          <el-select v-model="selectCompany" placeholder="请选择要操作的客户" style="width: 180px;">
            <el-option v-for="item in companys" :key="item.CompanyID" :label="item.CompanyName" :value="item.CompanyID">
              <span style="float: left">{{ item.CompanyName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.CompanyID }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="flexItem">
          <el-input clearable v-model="selectUser" placeholder="请输入要查询的用户"></el-input>
        </el-form-item>
        <el-form-item class="flexItem">
          <el-button type="primary" plain @click="HandleSearch(1)">刷新数据</el-button>
        </el-form-item>
      </el-form>

    </el-col>
  </el-row>
  <!-- 内容 -->
  <el-table ref="refTable" :data="tableData" highlight-current-row @selection-change="HandleSelectChange"
    @row-click="HandleClickRow" border>
    <el-table-column type="selection" width="50"></el-table-column>
    <el-table-column prop="PushLogPublicAccount" label="微信公众号" width="200"></el-table-column>
    <el-table-column prop="PushLogCompanyID" label="客户" width="200" show-overflow-tooltip></el-table-column>
    <el-table-column prop="PushLogToUserID" label="员工ID" min-width="250" show-overflow-tooltip></el-table-column>
    <el-table-column prop="PushLogStatus" label="推送状态" width="180" show-overflow-tooltip> </el-table-column>
    <el-table-column prop="PushLogContent" label="推送内容" width="180" show-overflow-tooltip> </el-table-column>
    <el-table-column prop="PushLogTime" label="推送时间" width="180" show-overflow-tooltip></el-table-column>
    <el-table-column prop="PushLogOpenid" label="微信ID" width="200" show-overflow-tooltip></el-table-column>
    <el-table-column prop="PushLogRemark" label="信息" width="180" show-overflow-tooltip> </el-table-column>
    <el-table-column prop="PushLogIP" label="推送IP" width="180" show-overflow-tooltip> </el-table-column>
    <el-table-column prop="PushLogTemplateID" label="推送模板ID" width="180" show-overflow-tooltip> </el-table-column>
    <template #empty>
      <el-empty description="没有数据"></el-empty>
    </template>
  </el-table>

  <!-- 分页 -->
  <el-row>
    <el-col class="flexBox">
      <el-pagination class="flexItem" small background layout="total, prev, pager, next, sizes, jumper"
        :total="tableTotal" v-model:current-page="filters.page" v-model:page-size="filters.size" />
    </el-col>
  </el-row>

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