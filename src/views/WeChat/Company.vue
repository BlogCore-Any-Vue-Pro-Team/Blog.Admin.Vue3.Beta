<script setup>
import { onMounted, ref, watch } from 'vue'
import {
  getWeChatCompany,
  removeWeChatCompany,
  addWeWeChatCompany,
  updateWeChatCompany,
  batchDeleteWeChatCompany,
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
const isAdd = ref(false)
const dialogVisible = ref(false)
const formData = ref({})
const refForm = ref()
const ruleForm = {
  CompanyID: [
    { required: true, message: '链客户代码不能为空', trigger: 'change' },
  ],
  CompanyName: [
    { required: true, message: '客户名称不能为空', trigger: 'change' },
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
      removeWeChatCompany({ id: row.CompanyID }).then((res) => {
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
      let ids = rows.map(t => t.CompanyID)
      batchDeleteWeChatCompany(ids).then((res) => {
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
          updateWeChatCompany(formData.value).then((res) => {
            HandleSearch()
            dialogVisible.value = false
            ElMessage.success(res.data.msg || '编辑成功')
          })
        } else {
          //新增
          addWeWeChatCompany(formData.value).then((res) => {
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

  getWeChatCompany(filters.value).then(res => {
    tableData.value = res.data.response.data;
    tableTotal.value = res.data.response.dataCount;
  });
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
      </el-form>

    </el-col>
  </el-row>
  <!-- 内容 -->
  <el-table ref="refTable" :data="tableData" highlight-current-row @selection-change="HandleSelectChange"
    @row-click="HandleClickRow" border>
    <el-table-column type="selection" width="50"></el-table-column>
    <el-table-column prop="CompanyID" label="客户代码" width="150"></el-table-column>
    <el-table-column prop="CompanyName" label="客户名称" min-width="200"></el-table-column>
    <el-table-column prop="CompanyIP" label="客户IP" min-width="200"></el-table-column>
    <el-table-column prop="CompanyAPI" label="客户API" width="100"></el-table-column>
    <el-table-column prop="CompanyRemark" label="备注" width="100"></el-table-column>

    <el-table-column prop="serverenable" label="是否启用" width="100">
      <template #default="{ row }">
        <el-tag v-if="row.Enabled" type="success">启用</el-tag>
        <el-tag v-else type="danger">禁用</el-tag>
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
  <el-dialog v-model="dialogVisible" :title="isAdd ? '添加' : '编辑'" width="450px" :before-close="handleClose">
    <el-form @submit.prevent ref="refForm" :model="formData" :rules="ruleForm" label-width="120px" status-icon label-position="top">
      <el-form-item label="客户代码" prop="CompanyID">
        <el-input v-model="formData.CompanyID" auto-complete="off" :disabled="!isAdd"></el-input>
      </el-form-item>
      <el-form-item label="客户名称" prop="CompanyName">
        <el-input v-model="formData.CompanyName" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="客户IP" prop="CompanyIP">
        <el-input v-model="formData.CompanyIP" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="客户API" prop="CompanyAPI">
        <el-input v-model="formData.CompanyAPI" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="Enabled">
        <el-switch v-model="formData.Enabled" active-text="启用" inactive-text="禁用" />
      </el-form-item>
      <el-form-item label="备注" prop="CompanyRemark">
        <el-input v-model="formData.CompanyRemark" auto-complete="off"></el-input>
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