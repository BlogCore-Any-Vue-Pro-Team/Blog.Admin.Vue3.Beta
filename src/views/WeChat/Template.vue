<script setup>
import { onMounted, ref, watch } from 'vue'
import {
  getWeChatTemplate,
  getWeChatAccount,
  getWeChatCompany,
  pushCardMsg
} from '@/api/wechat.js'



const wechats = ref([])
const selectWeChat = ref(null)
const tableData = ref([])
const currentRow = ref()
const selectRows = ref([])
const dialogVisible = ref(false)
const formData = ref(
  {
    info: {
      id: '',
      companyCode: '',
      userID: ''
    },
    cardMsg: {
      template_id: '',
      first: '',
      colorFirst: '',
      keyword1: '',
      color1: '',
      keyword2: '',
      color2: '',
      keyword3: '',
      color3: '',
      keyword4: '',
      color4: '',
      keyword5: '',
      color5: '',
      remark: '',
      colorRemark: '',
      url: ''
    },
    isNewVersion: false
  }
)
const newVersionData = ref([
  {
    key: 'thing1',
    val: ''
  },

  {
    key: 'time2',
    val: ''
  }
])
//添加参数
const addPars = () => {
  newVersionData.value.push({ key: '', val: '' })
}
//删除参数
const delPars = (index) => {
  newVersionData.value.splice(index, 1)
}
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
  getWeChatTemplate({ id: id })
    .then(res => {
      tableData.value = res.data.response.template_list;
    })
}
const HandleTemplate = () => {
  if (!currentRow.value) {
    ElMessage.error('请选择要操作的数据!')
    return;
  }
  formData.value.info.id = selectWeChat.value
  formData.value.cardMsg.template_id = currentRow.value.template_id
  dialogVisible.value = true

}
const HandleSubmit = () => {
  ElMessageBox.confirm('确定发送么?')
    .then(() => {

      if (formData.value.isNewVersion) {
        formData.value.newMsg = {}
        for (let idx = 0; idx < newVersionData.value.length; idx++) {
          const newData = newVersionData.value[idx];
          formData.value.newMsg[newData.key] = { value: newData.val }
        }
      } else {
        formData.value.newMsg = {}
      }
      
      pushCardMsg(formData.value)
        .then(res => {
          ElMessage.success(res.data.msg || '推送成功')
        });

    })
    .catch((err) => {
      console.info(err)
    })
}



// 公司列表
const companys = ref([])
const GetWeCompanys = () => {
  getWeChatCompany().then(res => {
    companys.value = res.data.response.data
  });
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



</script>
<template>
  <!-- 搜索 -->
  <el-row>
    <el-col>
      <el-form :inline="true" class="flexBox">
        <el-form-item class="flexItem">
          <el-select @change="GetTemplate" v-model="selectWeChat" placeholder="请选择要操作的公众号" style="width: 350px;">
            <el-option class="flexItem" v-for="item in wechats" :key="item.publicAccount" :label="item.publicNick"
              :value="item.publicAccount">
              <span>{{ item.publicNick }}</span>(<span>{{ item.publicAccount }}</span>)
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="flexItem">
          <el-button type="primary" plain @click="GetTemplate(selectWeChat)">刷新模板</el-button>
        </el-form-item>
        <el-form-item class="flexItem">
          <el-button type="primary" plain @click="HandleTemplate">模拟消息</el-button>
        </el-form-item>
      </el-form>

    </el-col>
  </el-row>
  <!-- 内容 -->
  <el-table ref="refTable" :data="tableData" highlight-current-row @selection-change="HandleSelectChange"
    @row-click="HandleClickRow" border>
    <el-table-column type="selection" width="50"></el-table-column>
    <el-table-column prop="title" label="标题" width="150"></el-table-column>
    <el-table-column prop="template_id" label="模板ID" min-width="200" show-overflow-tooltip></el-table-column>
    <el-table-column prop="content" label="示例" min-width="200" show-overflow-tooltip></el-table-column>
    <el-table-column prop="example" label="格式" width="100" show-overflow-tooltip></el-table-column>

    <template #empty>
      <el-empty description="没有数据"></el-empty>
    </template>
  </el-table>

  <!-- 弹窗 -->
  <el-dialog v-model="dialogVisible" title="模拟消息" width="550px" :before-close="handleClose">
    <el-form ref="refForm" :model="formData" label-width="120px" status-icon>

      <el-form-item label="公众号" prop="id">
        <el-select v-model="formData.info.id" placeholder="请选择要操作的公众号">
          <el-option v-for="item in wechats" :key="item.publicAccount" :label="item.publicNick"
            :value="item.publicAccount">
            <span style="float: left">{{ item.publicNick }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.publicAccount }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择客户" prop="companyCode">
        <el-select v-model="formData.info.companyCode" placeholder="请选择要操作的客户">
          <el-option v-for="item in companys" :key="item.CompanyID" :label="item.CompanyName" :value="item.CompanyID">
            <span style="float: left">{{ item.CompanyName }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.CompanyID }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="员工id" prop="userID">
        <el-input v-model="formData.info.userID" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="模板ID" prop="template_id">
        <el-input v-model="formData.cardMsg.template_id" auto-complete="off"></el-input>
      </el-form-item>

      <el-form-item label="消息版本" prop="template_id">
        <el-radio v-model="formData.isNewVersion" :label="true">新版本</el-radio>
        <el-radio v-model="formData.isNewVersion" :label="false">老版本</el-radio>
      </el-form-item>

      <div v-show="formData.isNewVersion == true">
        <el-button type="primary" plain @click="addPars">添加</el-button>
        <el-row :gutter="10" :key="index" v-for="(item, index) in newVersionData"
          style="margin-top: 5px;margin-bottom: 5px;text-align: center;">
          <el-col :span="1.5"><el-input v-model="item.key" auto-complete="off"></el-input></el-col>
          <el-col :span="1.5"><el-input v-model="item.val" auto-complete="off"></el-input></el-col>
          <el-col :span="1.5"> <el-button type="danger" plain @click="delPars(index)">删除</el-button></el-col>
        </el-row>
      </div>

      <div v-show="formData.isNewVersion == false">
        <el-form-item label="first" prop="first">
          <el-input v-model="formData.cardMsg.first" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="keyword1" prop="keyword1">
          <el-input v-model="formData.cardMsg.keyword1" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="keyword2" prop="keyword2">
          <el-input v-model="formData.cardMsg.keyword2" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="keyword3" prop="keyword3">
          <el-input v-model="formData.cardMsg.keyword3" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="keyword4" prop="keyword4">
          <el-input v-model="formData.cardMsg.keyword4" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="keyword5" prop="keyword5">
          <el-input v-model="formData.cardMsg.keyword5" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="remark" prop="remark">
          <el-input v-model="formData.cardMsg.remark" auto-complete="off"></el-input>
        </el-form-item>
      </div>
      <el-form-item label="url" prop="url">
        <el-input v-model="formData.cardMsg.url" auto-complete="off"></el-input>
      </el-form-item>



    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="HandleSubmit">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
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