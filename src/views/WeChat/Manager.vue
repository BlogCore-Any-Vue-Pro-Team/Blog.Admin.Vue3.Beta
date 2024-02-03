<script setup>
import { onMounted, ref, watch } from 'vue'
import {
  getWeChatAccount,
  removeWeChatAccount,
  addWeChatAccount,
  updateWeChatAccount,
  batchDeleteChatAccount,
  refreshWeChatToken,
  UpdateWeChatFile,
  GetWeChatMediaList,
  updateWeChatAccountFocus
} from '@/api/wechat.js'
import { ElMessageBox, ElMessage } from 'element-plus'

// 表格初始化
const tableData = ref([])
const tableTotal = ref(0)
const refTable = ref()
const currentRow = ref({})
const selectRows = ref([])
const filters = ref({ page: 1, size: 10, key: '' })

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
// 翻页
watch(() => filters.value.page, () => {
  HandleSearch()
})
watch(() => filters.value.size, () => {
  filters.value.page = 1
  HandleSearch()
})



//加载数据
onMounted(() => {
  HandleSearch()
})


//新增&编辑操作
const dialogVisible = ref(false)
const formData = ref({})
const isAdd = ref(false)
const refForm = ref()
const ruleForm = {
  servername: [
    { required: true, message: '服务器名称不能为空', trigger: 'change' },
  ],
  serveraddress: [
    { required: true, message: '服务器地址不能为空', trigger: 'change' },
  ],
  serverport: [
    { required: true, message: '服务器端口不能为空', trigger: 'change' },
  ]
}
//新增
const HandleAdd = () => {
  isAdd.value = true
  formData.value = { Enabled: true }
  dialogVisible.value = true
}
//编辑
const HandleEdit = (row) => {
  if (!row) {
    ElMessage.error('请选择要操作的数据!')
    return;
  }
  isAdd.value = false
  formData.value = JSON.parse(JSON.stringify(row))
  dialogVisible.value = true
}
//删除
const HandleDel = (row) => {
  if (!row) {
    ElMessage.error('请选择要操作的数据!')
    return;
  }
  ElMessageBox.confirm('确定删除么?')
    .then(() => {
      removeWeChatAccount({ id: row.publicAccount }).then((res) => {
        HandleSearch()
        ElMessage.success('删除成功')
      })
    })
    .catch((err) => {
      console.info(err)
    })
}
//批量删除
const HandleBatchDel = (rows) => {
  if (!rows || rows.length == 0) {
    ElMessage.error('请选择要操作的数据!')
    return;
  }
  ElMessageBox.confirm('确定删除么?')
    .then(() => {
      let ids = rows.map(t => t.publicAccount)
      batchDeleteChatAccount(ids).then((res) => {
        HandleSearch()
        ElMessage.success('删除成功')
      })
    })
    .catch((err) => {
      console.info(err)
    })

}
//提交
const HandleSubmit = () => {
  refForm.value.validate((valid, fields) => {
    if (!valid && fields) {
      for (let key in fields)
        ElMessage.error(fields[key][0].message)
      return;
    }
    ElMessageBox.confirm('确定提交么?')
      .then(() => {
        if (!isAdd.value) {
          //编辑
          updateWeChatAccount(formData.value).then((res) => {
            HandleSearch()
            dialogVisible.value = false
            ElMessage.success(res.data.msg || '编辑成功')
          })
        } else {
          //新增
          addWeChatAccount(formData.value).then((res) => {
            HandleSearch()
            dialogVisible.value = false
            ElMessage.success(res.data.msg || '添加成功')
          })
        }
      })
      .catch((err) => {
        console.info(err)
      })

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
//搜索
const HandleSearch = (page) => {

  if (page) filters.value.page = page

  HandleClearTable()   
  
  getWeChatAccount(filters.value).then(res => {
    tableData.value = res.data.response.data;
    tableTotal.value = res.data.response.dataCount;
  });
}

// 其他
const HandleRefreshWeChatToken = (row) => {
  if (!row) {
    ElMessage.error('请选择要操作的数据!')
    return;
  }
  ElMessageBox.confirm('确定刷新token?')
    .then(() => {
      refreshWeChatToken({ id: row.publicAccount }).then((res) => {
        HandleSearch()
        ElMessage.success('刷新成功')
      })
    })
    .catch((err) => {
      console.info(err)
    })
}
// 编辑关注
const visibleFocus = ref(false)
const refFocus = ref()
const ruleFocus = {
  isFocusReply: [
    { required: true, message: '是否关注回复不能为空', trigger: 'change' },
  ],
  replyType: [
    { required: true, message: '回复类型不能为空', trigger: 'change' },
  ],
  replyTitle: [
    { required: true, message: '视频标题不能为空', trigger: 'change' },
  ],
  replyDescription: [
    { required: true, message: '视频描述不能为空', trigger: 'change' },
  ],
  replyText: [
    { required: true, message: '回复文字不能为空', trigger: 'change' },
  ],
}
const HandleEditFocus = (row) => {
  if (!row) {
    ElMessage.error('请选择要操作的数据!')
    return;
  }
  formData.value = JSON.parse(JSON.stringify(row))
  visibleFocus.value = true
}
const HandleSubmitFocus = () => {
  refFocus.value.validate((valid, fields) => {
    if (!valid && fields) {
      for (let key in fields)
        ElMessage.error(fields[key][0].message)
      return;
    }
    ElMessageBox.confirm('确定提交么?')
      .then(() => {
        updateWeChatAccountFocus(formData.value).then((res) => {
          HandleSearch()
          visibleFocus.value = false
          ElMessage.success(res.data.msg || '编辑成功')
        })
      })
      .catch((err) => {
        console.info(err)
      })

  })
}
const HandleChangeFocus = () => {
  formData.value.replyTitle = ''
  formData.value.replyDescription = ''
  formData.value.replyText = ''
  formData.value.replyID = ''
}

const BeforeUpload = (file) => {
  console.info("formData.value", formData.value)
  console.info("file", file)
  if (!formData.value.replyType) {
    ElMessage.error('请选择媒体类型再上传')
    return false;
  }
  if (formData.value.replyType == 'video') {
    if (!formData.value.replyTitle || !formData.value.replyDescription) {
      ElMessage.error('请先填写视频的标题和描述')
      return false;
    }
  }

  // const isJPG = file.type === 'image/jpeg';
  // const isLt2M = file.size / 1024 / 1024 < 2;
  let BlodData = new FormData();
  BlodData.append("media", file);

  var des = { "title": formData.value.replyTitle, "introduction": formData.value.replyDescription }
  BlodData.append("description", JSON.stringify(des));
  UpdateWeChatFile(formData.value.publicAccount, formData.value.replyType, BlodData).then(res => {
    formData.value.replyID = res.data.response.media_id
    ElMessage.success(res.data.msg || '上上传成功')
  })
  return false;
}
//选择素材
const mediaList = ref([])
const mediaTotal = ref(0)
const mediaPage = ref(1)
const visibleMedia = ref(false)

const HandleMedia = () => {
  mediaList.value = []
  GetWeChatMediaList({ id: formData.value.publicAccount, type: formData.value.replyType, page: mediaPage.value })
    .then(res => {
      mediaTotal.value = res.data.response.total_count
      mediaList.value = res.data.response.item
      visibleMedia.value = true
    })
}
const HandleSubmitMedia = (row) => {
  formData.value.replyID = row.media_id
  if (formData.value.replyType == 'video') {
    formData.value.replyTitle = row.name
    formData.value.replyDescription = row.description
  }
  visibleMedia.value = false
}


</script>
<template>
  <!-- 搜索 -->
  <el-row>
    <el-col>
      <el-form @submit.prevent :inline="true" :model="filters" class="flexBox">
        <el-form-item label="关键词" class="flexItem" label-width="90">
          <el-input class="flexContent" v-model.trim="filters.key" placeholder="请输入搜索关键词" clearable />
        </el-form-item>
        <el-form-item class="flexItem">
          <el-button type="primary" plain @click="HandleSearch(1)">查询</el-button>
        </el-form-item>
        <el-form-item class="flexItem">
          <el-button type="primary" plain @click="HandleAdd">添加</el-button>
        </el-form-item>
        <el-form-item class="flexItem">
          <el-button type="primary" plain @click="HandleEdit(currentRow)">修改</el-button>
        </el-form-item>
        <el-form-item class="flexItem">
          <el-button type="danger" plain @click="HandleDel(currentRow)">删除</el-button>
        </el-form-item>
        <el-form-item class="flexItem">
          <el-button type="danger" plain @click="HandleBatchDel(selectRows)">批量删除</el-button>
        </el-form-item>
        <el-form-item class="flexItem">
          <el-button type="primary" plain @click="HandleRefreshWeChatToken(currentRow)">刷新token</el-button>
        </el-form-item>
        <el-form-item class="flexItem">
          <el-button type="primary" plain @click="HandleEditFocus(currentRow)">编辑关注</el-button>
        </el-form-item>
      </el-form>

    </el-col>
  </el-row>
  <!-- 内容 -->
  <el-table ref="refTable" :data="tableData" highlight-current-row @selection-change="HandleSelectChange"
    @row-click="HandleClickRow" border>
    <el-table-column type="selection" width="50"></el-table-column>
    <el-table-column prop="publicAccount" label="微信公众号ID" width="250"></el-table-column>
    <el-table-column prop="publicNick" label="微信公众名称" width="250"></el-table-column>
    <el-table-column prop="isFocusReply" label="是否关注回复" width="120">
      <template #default="{ row }">
        <el-tag> {{ (row.isFocusReply ? '是' : '否') }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="replyType" label="回复类型" width="100"></el-table-column>
    <el-table-column prop="replyText" label="回复文本" width="100" show-overflow-tooltip></el-table-column>
    <el-table-column prop="replyID" label="回复媒体ID" width="180" show-overflow-tooltip></el-table-column>
    <el-table-column prop="replyTitle" label="回复媒体标题" width="180" show-overflow-tooltip></el-table-column>
    <el-table-column prop="replyDescription" label="回复媒体描述" width="120" show-overflow-tooltip></el-table-column>
    <el-table-column prop="weChatNick" label="微信用户名称" width="120"></el-table-column>
    <el-table-column prop="tokenExpiration" label="token过期时间" width="180"></el-table-column>
    <el-table-column prop="Enabled" label="状态" width="" sortable>
      <template #default="{ row }">
        <el-tag :type="row.Enabled ? 'success' : 'danger'" disable-transitions>{{ row.Enabled ? "激活" : "禁用"
        }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="CreateTime" label="创建时间" width="180">
    </el-table-column>
    <el-table-column prop="ModifyTime" label="更新时间" width="180">
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
  <el-dialog v-model="dialogVisible" :title="!isAdd ? '编辑' : '添加'" width="550px" :before-close="handleClose">
    <el-form @submit.prevent ref="refForm" :model="formData" :rules="ruleForm" label-width="150px" status-icon label-position="top">

      <el-form-item label="微信公众号ID" prop="publicAccount">
        <el-input v-model="formData.publicAccount" auto-complete="off" :disabled="!isAdd"></el-input>
      </el-form-item>
      <el-form-item label="微信公众号名称" prop="publicNick">
        <el-input v-model="formData.publicNick" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="微信ID" prop="weChatAccount">
        <el-input v-model="formData.weChatAccount" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="微信名称" prop="weChatNick">
        <el-input v-model="formData.weChatNick" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="AppID(应用ID)" prop="appid">
        <el-input v-model="formData.appid" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="APPSecret(应用密钥)" prop="appsecret">
        <el-input v-model="formData.appsecret" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="Token(交互-认证用)" prop="interactiveToken">
        <el-input v-model="formData.interactiveToken" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="Token(令牌-推送用)" prop="token">
        <el-input v-model="formData.token" auto-complete="off" disabled></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="Enabled">
        <el-select v-model="formData.Enabled" placeholder="请选择状态">
          <el-option label="激活" :value="true"></el-option>
          <el-option label="禁用" :value="false"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="说明" prop="remark">
        <el-input v-model="formData.remark" auto-complete="off"></el-input>
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

  <!-- 编辑关注 -->
  <el-dialog v-model="visibleFocus" title="编辑关注" width="550px" :before-close="handleClose">
    <el-form @submit.prevent ref="refFocus" :model="formData" :rules="ruleFocus" label-width="150px" status-icon label-position="top">
      <el-form-item label="微信公众号ID" prop="publicAccount">
        <el-input v-model="formData.publicAccount" auto-complete="off" :disabled="!isAdd"></el-input>
      </el-form-item>
      <el-form-item label="微信公众号名称" prop="publicNick">
        <el-input v-model="formData.publicNick" auto-complete="off" :disabled="!isAdd"></el-input>
      </el-form-item>
      <el-form-item label="是否关注回复" prop="isFocusReply">
        <el-radio v-model="formData.isFocusReply" :label="true">是</el-radio>
        <el-radio v-model="formData.isFocusReply" :label="false">否</el-radio>
      </el-form-item>
      <el-form-item v-if="formData.isFocusReply" label="回复类型" prop="replyType">
        <el-select clearable v-model="formData.replyType" placeholder="请选择" @change="HandleChangeFocus">
          <el-option label="文本" value="text"></el-option>
          <el-option label="图片" value="image"></el-option>
          <el-option label="语音" value="voice"></el-option>
          <el-option label="视频" value="video"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if="formData.replyType && formData.replyType != 'text' && formData.isFocusReply" label=""
        prop="replyID">
        <el-row :gutter="10">
          <el-col :span="1.5">
            <el-link type="primary" @click="HandleMedia">选择</el-link>
          </el-col>
          <el-col :span="1.5">
            <el-upload class="upload-demo" action="#" :before-upload="BeforeUpload">
              <el-link type="primary">新上传</el-link>
            </el-upload>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item v-if="formData.replyType != 'text' && formData.isFocusReply && formData.replyType == 'video'"
        label="视频标题" prop="replyTitle">
        <el-input style="width:calc(100% - 100px);margin-left: 5px;" v-model="formData.replyTitle"
          auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item v-if="formData.replyType != 'text' && formData.isFocusReply && formData.replyType == 'video'"
        label="视频描述" prop="replyDescription">
        <el-input style="width:calc(100% - 100px);margin-left: 5px;" v-model="formData.replyDescription"
          auto-complete="off"></el-input>
      </el-form-item>

      <el-form-item v-if="formData.replyType && formData.replyType != 'text' && formData.isFocusReply" label="回复媒体ID"
        prop="replyID">
        <el-input v-model="formData.replyID" type="text" :rows="5" auto-complete="off" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item v-if="formData.replyType == 'text' && formData.isFocusReply" label="回复文字" prop="replyText">
        <el-input type="textarea" :rows="5" v-model="formData.replyText" auto-complete="off"></el-input>
      </el-form-item>

    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visibleFocus = false">取消</el-button>
        <el-button type="primary" @click="HandleSubmitFocus">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 素材选择 -->
  <el-dialog v-model="visibleMedia" title="编辑关注" width="550px" :before-close="handleClose">
    <el-table :data="mediaList" style="width: 100%" highlight-current-row>
      <el-table-column prop="name" label="名称" min-width="250" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="url" label="地址" width="150" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="description" label="描述" width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="media_id" label="媒体id" width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作" width="100" show-overflow-tooltip fixed="right">
        <template #default="{ row }">
          <el-button type="primary" plain @click="HandleSubmitMedia(row)">选择</el-button>
        </template>
      </el-table-column>

      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>

    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visibleMedia = false">取消</el-button>
        <el-button type="primary" @click="HandleSubmitMedia">
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