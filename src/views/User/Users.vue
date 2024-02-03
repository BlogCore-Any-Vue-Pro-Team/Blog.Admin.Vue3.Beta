<script setup>
import { onMounted, ref, watch } from 'vue'
import {
  getUserListPage,
  removeUser,
  batchRemoveUser,
  editUser,
  addUser,
  ResetPass
} from '@/api/user.js'
import {
  getRoleListPage,
} from '@/api/role.js'
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
  //加载角色
  getRoleListPage({ size: 9999 }).then((res) => {
    roles.value = res.data.response.data;
  });
})


//新增&编辑操作
const dialogVisible = ref(false)
const formData = ref({})
const isAdd = ref(true)
const refForm = ref()
const roles = ref([])
const ruleForm = {
  RealName: [
    { required: true, message: '昵称不能为空', trigger: 'change' },
  ],
  LoginName: [
    { required: true, message: '登录名不能为空', trigger: 'change' },
  ],
  LoginPWD: [
    { required: true, message: '密码不能为空', trigger: 'change' },
  ]
}
//新增
const HandleAdd = () => {
  isAdd.value = true
  formData.value = { Status: 0 }
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
      removeUser({ id: row.Id }).then((res) => {
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
      batchRemoveUser(ids).then((res) => {
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
        if (formData.value.Id) {
          //编辑
          editUser(formData.value).then((res) => {
            HandleSearch()
            dialogVisible.value = false
            ElMessage.success(res.data.msg || '添加成功')
          })
        } else {
          //新增
          addUser(formData.value).then((res) => {
            HandleSearch()
            dialogVisible.value = false
            ElMessage.success(res.data.msg || '编辑成功')
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

  getUserListPage(filters.value).then(res => {
    tableData.value = res.data.response.data;
    tableTotal.value = res.data.response.dataCount;


  });
}
// 重置密码
const resetFormData = ref({})
const dialogResetVisible = ref(false)
const resetForm = ref()
const resetFormRule = {
  LoginPWD: [
    { required: true, message: '密码不能为空', trigger: 'change' },
  ],
  LoginPWD2: [
    { required: true, message: '密码不能为空', trigger: 'change' },
  ]
}
const HandleResetPass = (row) => {
  if (!row) {
    ElMessage.error('请选择要操作的数据!')
    return;
  }
  resetFormData.value = JSON.parse(JSON.stringify(row))
  resetFormData.value.LoginPWD = ''
  dialogResetVisible.value = true
}
const SubmitReset = () => {

  resetForm.value.validate((valid, fields) => {
    if (!valid && fields) {
      for (let key in fields)
        ElMessage.error(fields[key][0].message)
      return;
    }
    if (resetFormData.value.LoginPWD != resetFormData.value.LoginPWD2) {
      ElMessage.error('确认密码不一致!')
      return;
    }
    ElMessageBox.confirm('确定重置么?')
      .then(() => {
        ResetPass(resetFormData.value).then((res) => {
          ElMessage.success(res.data.msg || '重置成功')
          dialogResetVisible.value = false
        })
      })
  })


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
          <el-button type="primary" plain @click="HandleResetPass(currentRow)">重置密码</el-button>
        </el-form-item>
      </el-form>

    </el-col>
  </el-row>
  <!-- 内容 -->
  <el-table ref="refTable" :data="tableData" highlight-current-row @selection-change="HandleSelectChange"
    @row-click="HandleClickRow" border>
    <el-table-column type="selection" width="50"></el-table-column>
    <el-table-column prop="RealName" label="昵称" width="200"></el-table-column>
    <el-table-column prop="LoginName" label="登录名" width="200"></el-table-column>
    <el-table-column prop="RoleNames" label="角色" min-width="180" align="center">
      <template #default="{ row }">
        <el-row :gutter="5">
          <el-col :span="1.5" v-for="item in row.RoleNames" :key="item.Id">
            <el-tag>{{ item }}</el-tag>
          </el-col>
        </el-row>
      </template>
    </el-table-column>
    <el-table-column prop="Sex" label="性别" width="200"></el-table-column>
    <el-table-column prop="Age" label="年龄" width="200"></el-table-column>
    <el-table-column prop="Birth" label="生日" width="200"></el-table-column>
    <el-table-column prop="Status" label="状态" width="90" align="center">
      <template #default="{ row }">
        <el-tag :type="row.Status == 0 ? 'success' : 'danger'" disable-transitions>{{ row.Status == 0 ? "激活" :
          "禁用" }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="Address" label="地址" width="200"></el-table-column>
    <el-table-column prop="Remark" label="备注" width="200"></el-table-column>
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
    <el-form @submit.prevent ref="refForm" :model="formData" :rules="ruleForm" label-width="80px" status-icon
      label-position="top">

      <el-form-item label="昵称" prop="RealName">
        <el-input v-model="formData.RealName" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="登录名" prop="LoginName">
        <el-input v-model="formData.LoginName" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item v-if="isAdd" label="密码" prop="LoginPWD">
        <el-input v-model="formData.LoginPWD" show-password auto-complete="off" clearable></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="Status">
        <el-select v-model="formData.Status" placeholder="请选择角色状态">
          <el-option label="激活" :value="0"></el-option>
          <el-option label="禁用" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="角色" prop="RIDs">
        <el-select multiple v-model="formData.RIDs" placeholder="请选择角色">
          <el-option v-for="item in roles" :key="item.Id" :label="item.Name" :value="item.Id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="性别" prop="Sex">
        <el-radio-group v-model="formData.Sex">
          <el-radio class="radio" :label="1">男</el-radio>
          <el-radio class="radio" :label="0">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="年龄" prop="Age">
        <el-input-number v-model="formData.Age" :min="0" :max="200"></el-input-number>
      </el-form-item>
      <el-form-item label="生日" prop="Birth">
        <el-date-picker type="date" placeholder="选择日期" v-model="formData.Birth"></el-date-picker>
      </el-form-item>
      <el-form-item label="地址" prop="Address">
        <el-input type="textarea" v-model="formData.Address"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="Remark">
        <el-input type="textarea" v-model="formData.Remark"></el-input>
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

  <el-dialog v-model="dialogResetVisible" title="密码重置" width="450px" :before-close="handleClose">

    <el-form @submit.prevent ref="resetForm" :model="resetFormData" :rules="resetFormRule" label-width="80px" status-icon
      label-position="top">
      <el-form-item label="昵称" prop="RealName">
        <el-input v-model="resetFormData.RealName" auto-complete="off" disabled></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="LoginPWD">
        <el-input v-model="resetFormData.LoginPWD" show-password auto-complete="off" clearable></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="LoginPWD2">
        <el-input v-model="resetFormData.LoginPWD2" show-password auto-complete="off" clearable></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogResetVisible = false">取消</el-button>
        <el-button type="primary" @click="SubmitReset">
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