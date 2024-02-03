<script setup>
import { onMounted, ref } from 'vue'
import {
  getWeChatSubUser
  , getWeChatAccount
} from '@/api/wechat.js'

import { ElMessageBox } from 'element-plus'

const wechats = ref([])
const selectWeChat = ref(null)
const tableData = ref([])
const tableTotal = ref(0)
const filters = ref({ page: 1, size: 9999999999, key: '' })
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
const GetWeChats = () => {
  getWeChatAccount().then(res => {
    wechats.value = res.data.response.data;
  });
}
const GetTemplate = (id) => {
  HandleClearTable()
  filters.value.id = id
  getWeChatSubUser(filters.value)
    .then(res => {
      tableData.value = res.data.response.data.openid;
      tableTotal.value = res.data.response.total;
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
})



</script>
<template>
  <!-- 搜索 -->
  <el-row>
    <el-col>
      <el-form @submit.prevent :inline="true" class="flexBox">
        <el-form-item class="flexItem">
          <el-select @change="GetTemplate" v-model="selectWeChat" placeholder="请选择要操作的公众号" style="width: 350px;">
            <el-option class="flexItem" v-for="item in wechats" :key="item.publicAccount" :label="item.publicNick"
              :value="item.publicAccount">
              <span>{{ item.publicNick }}</span>(<span>{{ item.publicAccount }}</span>)
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="flexItem">
          <el-button type="primary" plain @click="GetTemplate(selectWeChat)">刷新数据</el-button>
        </el-form-item>
      </el-form>

    </el-col>
  </el-row>
  <!-- 内容 -->
  <el-table ref="refTable" :data="tableData" highlight-current-row @selection-change="HandleSelectChange"
    @row-click="HandleClickRow" border>
    <el-table-column type="selection" width="50"></el-table-column>
    <el-table-column prop="openid" label="OpenID" width="300">
      <template #default="{ row }">
        {{ row }}
      </template>
    </el-table-column>
    <el-table-column prop="nickname" label="昵称" min-width="100" show-overflow-tooltip></el-table-column>
    <el-table-column prop="country" label="国家" min-width="100" show-overflow-tooltip></el-table-column>
    <el-table-column prop="province" label="省份" width="100" show-overflow-tooltip></el-table-column>
    <el-table-column prop="city" label="城市" width="100" show-overflow-tooltip></el-table-column>
    <el-table-column prop="headimgurl" label="头像" width="100" show-overflow-tooltip>
      <template #default="{ row }">
        {{ row.headimgurl }}
      </template>
    </el-table-column>
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