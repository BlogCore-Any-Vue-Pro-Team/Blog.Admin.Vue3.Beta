<script setup>
import { onMounted, ref, watch } from 'vue'
import {
  getWeChatAccount,
  getWeChatKeyword,
  removeWeChatKeyword,
  addWeWeChatKeyword,
  updateWeChatKeyword,
  batchDeleteWeChatKeyword,
  UpdateWeChatFile,
  GetWeChatMediaList
} from '@/api/wechat.js'

import { ElMessageBox, ElMessage } from 'element-plus'

const wechats = ref([])
const selectWeChat = ref(null)
const tableData = ref([])
const tableTotal = ref(0)
const filters = ref({ page: 1, size: 10, key: '' })
const currentRow = ref()
const selectRows = ref([])

const dialogVisible = ref(false)
const formData = ref({})
const isAdd = ref(false)
const refForm = ref()
const ruleForm = {
  key: [
    { required: true, message: '触发关键词不能为空', trigger: 'change' },
  ],
  media_type: [
    { required: true, message: '关键词类型不能为空', trigger: 'change' },
  ],
  media_desc: [
    { required: true, message: '关键词回复不能为空', trigger: 'change' },
  ],
  title: [
    { required: true, message: '视频标题不能为空', trigger: 'change' },
  ],
  description: [
    { required: true, message: '视频描述不能为空', trigger: 'change' },
  ],
  url: [
    { required: true, message: '媒体地址不能为空', trigger: 'change' },
  ],
  media_id: [
    { required: true, message: '媒体id不能为空', trigger: 'change' },
  ]
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
const HandleSearch = (val) => {
  if (val) {
    filters.value.page = val
  }
  HandleClearTable()


  if (!selectWeChat.value) {
    ElMessage.error('请选要操作的公众号')
    return;
  }

  filters.value.strOrderByFileds = "Id desc"

  filters.value.conditions = 'publicAccount = ' + selectWeChat.value;

  if (filters.value.key) {
    filters.value.conditions = filters.value.conditions + ' & key contains ' + filters.value.key
  } 


  getWeChatKeyword(filters.value)
    .then(res => {
      tableData.value = res.data.response.data;
      tableTotal.value = res.data.response.dataCount;
    })
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
      removeWeChatKeyword({ id: row.Id }).then((res) => {
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
      let ids = rows.map(t => t.Id)
      batchDeleteWeChatKeyword(ids).then((res) => {
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
        formData.value.publicAccount = selectWeChat.value
        if (!isAdd.value) {
          //编辑
          updateWeChatKeyword(formData.value).then((res) => {
            HandleSearch()
            dialogVisible.value = false
            ElMessage.success(res.data.msg || '编辑成功')
          })
        } else {
          //新增
          addWeWeChatKeyword(formData.value).then((res) => {
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


const HandleChangeFocus = () => {
  formData.value.title = ''
  formData.value.description = ''
  formData.value.media_desc = ''
  formData.value.media_id = ''
  formData.value.url = ''
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
  GetWeChatMediaList({ id: formData.value.publicAccount, type: formData.value.media_type, page: mediaPage.value })
    .then(res => {
      mediaTotal.value = res.data.response.total_count
      mediaList.value = res.data.response.item
      visibleMedia.value = true
    })
}
const HandleSubmitMedia = (row) => {
  formData.value.media_id = row.media_id
  formData.value.url = row.url
  if (formData.value.replyType == 'video') {
    formData.value.title = row.name
    formData.value.description = row.description
  }
  visibleMedia.value = false
}




//加载数据
onMounted(() => {
  GetWeChats()
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
          <el-input clearable v-model.trim="filters.key" placeholder="请输入关键词"></el-input>
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
      </el-form>

    </el-col>
  </el-row>
  <!-- 内容 -->
  <el-table ref="refTable" :data="tableData" highlight-current-row @selection-change="HandleSelectChange"
    @row-click="HandleClickRow" border>
    <el-table-column type="selection" width="50"></el-table-column>
    <el-table-column prop="key" label="触发关键词" width="200"></el-table-column>
    <el-table-column prop="media_type" label="关键词类型" width="200" show-overflow-tooltip></el-table-column>
    <el-table-column prop="media_desc" label="关键词回复-文本" min-width="250" show-overflow-tooltip></el-table-column>
    <el-table-column prop="title" label="视频标题" width="180" show-overflow-tooltip> </el-table-column>
    <el-table-column prop="description" label="视频描述" width="180" show-overflow-tooltip> </el-table-column>
    <el-table-column prop="url" label="关键词回复-媒体地址" width="180" show-overflow-tooltip></el-table-column>
    <el-table-column prop="media_id" label="关键词回复-媒体id" width="200" show-overflow-tooltip></el-table-column>
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
  <!-- 编辑关注 -->
  <el-dialog v-model="dialogVisible" title="编辑关注" width="550px" :before-close="handleClose">
    <el-form @submit.prevent ref="refForm" :model="formData" :rules="ruleForm" label-width="150px" status-icon
      label-position="top">

      <el-form-item label="触发关键词" prop="key">
        <el-input v-model="formData.key" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="回复类型" prop="media_type">
        <el-select clearable v-model="formData.media_type" placeholder="请选择" @change="HandleChangeFocus">
          <el-option label="文本" value="text"></el-option>
          <el-option label="图片" value="image"></el-option>
          <el-option label="语音" value="voice"></el-option>
          <el-option label="视频" value="video"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if="formData.media_type && formData.media_type != 'text'" label="" prop="replyID">
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
      <el-form-item v-if="formData.media_type != 'text' && formData.media_type == 'video'" label="视频标题" prop="title">
        <el-input style="width:calc(100% - 100px);margin-left: 5px;" v-model="formData.title"
          auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item v-if="formData.media_type != 'text' && formData.media_type == 'video'" label="视频描述"
        prop="description">
        <el-input style="width:calc(100% - 100px);margin-left: 5px;" v-model="formData.description"
          auto-complete="off"></el-input>
      </el-form-item>

      <el-form-item v-if="formData.media_type && formData.media_type != 'text'" label="回复媒体ID" prop="media_id">
        <el-input v-model="formData.media_id" type="text" :rows="5" auto-complete="off" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item v-if="formData.media_type && formData.media_type != 'text'" label="回复url" prop="url">
        <el-input v-model="formData.url" type="text" :rows="5" auto-complete="off" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item v-if="formData.media_type == 'text'" label="回复文字" prop="media_desc">
        <el-input type="textarea" :rows="5" v-model="formData.media_desc" auto-complete="off"></el-input>
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