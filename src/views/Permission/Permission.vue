<script setup>
import { onMounted, ref, watch } from 'vue'
import {
  getPermissionTable,
  removePermission,
  editPermission,
  addPermission,
  getPermissionTree,

} from '@/api/assign.js'
import {
  getModuleListPage
} from '@/api/module.js'


// 表格初始化
const tableData = ref([])
const tableTotal = ref(0)
const refTable = ref()
const currentRow = ref({})
const selectRows = ref([])
const filters = ref({ page: 1, size: 10, key: '' })
const modules = ref([])
const menuTrees = ref([])
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
  GetModuleListPage()
  GetPermissionTree()
})



// 获取接口列表
const GetModuleListPage = () => {
  getModuleListPage({ size: 9999 }).then((res) => {
    modules.value = res.data.response.data;
  });
}
// 获取菜单列表(不含接口按钮)
const GetPermissionTree = () => {
  let para = { needbtn: false }
  getPermissionTree(para).then((res) => {
    menuTrees.value = [res.data.response];
  });
}





//新增&编辑操作
const dialogVisible = ref(false)
const formData = ref({})
const refForm = ref()
const ruleForm = {
  Name: [
    { required: true, message: '菜单名称不能为空', trigger: 'change' },
  ],
  
  Pid: [
    { required: true, message: '父级菜单不能为空', trigger: 'change' },
  ]
}
const clkTypeEdit = () => {
  formData.value.IsButton = false;
  if (formData.value.MenuType == "页面") {
    formData.value.Code = "";
  } else if (formData.value.MenuType == "目录") {
    formData.value.Code = "-";
  } else if (formData.value.MenuType == "按钮") {
    formData.value.Code = " ";
    formData.value.IsButton = true;
  }
}
//新增
const HandleAdd = () => {
  formData.value = { Enabled: true, Pid: "0" }
  dialogVisible.value = true
}
//编辑
const HandleEdit = (row) => {
  if (!row) {
    ElMessage.error('请选择要操作的数据!')
    return;
  }
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
      removePermission({ id: row.Id }).then((res) => {
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
      removePermission(ids).then((res) => {
        HandleSearch()
        ElMessage.success('删除成功')
        GetPermissionTree()
      })
    })
    .catch((err) => {
      console.info(err)
    })

}
//提交
const HandleSubmit = () => {
  console.info("formData.Pid", formData.value.Pid)
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
          editPermission(formData.value).then((res) => {
            HandleSearch()
            dialogVisible.value = false
            ElMessage.success(res.data.msg || '添加成功')
            GetPermissionTree()
          })
        } else {
          //新增
          addPermission(formData.value).then((res) => {
            HandleSearch()
            dialogVisible.value = false
            ElMessage.success(res.data.msg || '编辑成功')
            GetPermissionTree()
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

  getPermissionTable(filters.value).then(res => {
    tableData.value = res.data.response;
  });
}



</script>
<template>
  <!-- 搜索 -->
  <el-row>
    <el-col>
      <el-form :inline="true" :model="filters" class="flexBox">
        <el-form-item label="关键词" class="flexItem" label-width="90">
          <el-input class="flexContent" v-model="filters.key" placeholder="请输入搜索关键词" clearable />
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
    @row-click="HandleClickRow" border row-key="Id">
    <el-table-column type="selection" width="50"></el-table-column>
    <el-table-column prop="Name" label="菜单/按钮" width="200">
      <template #default="{ row }">
        <i class="fa" :class="row.Icon"></i>
        {{ row.Name }}
      </template>
    </el-table-column>
    <el-table-column prop="Code" label="路由地址" width="200"></el-table-column>
    <el-table-column prop="MName" label="API接口" width="200"></el-table-column>
    <el-table-column prop="OrderSort" label="序号" width="80"></el-table-column>
    <el-table-column prop="IsButton" label="是否按钮" width="100">
      <template #default="{ row }">
        <el-tag :type="!row.IsButton ? 'success' : 'danger'" disable-transitions>{{ !row.IsButton ? "否" : "是" }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="Func" label="按钮事件" width="200"></el-table-column>
    <el-table-column prop="IsHide" label="是否隐藏" width="100">
      <template #default="{ row }">
        <el-tag :type="!row.IsHide ? 'success' : 'danger'" disable-transitions>{{ !row.IsHide ? "否" : "是"
        }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="IskeepAlive" label="keepAlive" width="100">
      <template #default="{ row }">
        <el-tag :type="!row.IskeepAlive ? 'success' : 'danger'" disable-transitions>{{ !row.IskeepAlive ? "否"
          : "是" }}</el-tag>
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
  <el-dialog v-model="dialogVisible" :title="formData.Id ? '编辑' : '添加'" width="550px" :before-close="handleClose">
    <el-form ref="refForm" :model="formData" :rules="ruleForm" label-width="80px" status-icon>

      <el-form-item label="菜单名称" prop="Name">
        <el-input v-model="formData.Name" auto-complete="off"></el-input>
      </el-form-item>

      <el-form-item label="菜单类型">
        <el-radio-group @change="clkTypeEdit" v-model="formData.MenuType">
          <el-radio label="目录"></el-radio>
          <el-radio label="页面"></el-radio>
          <el-radio label="按钮"></el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="路由地址" prop="Code">
        <el-tooltip placement="top">
          <template #content>
            如果是目录，请填‘-’字符
            <br />如果是按钮，请输入空格即可
            <br />如果是外链，请带上协议，比如 https://www.baidu.com
            <br />
          </template>
          <el-input v-model="formData.Code" auto-complete="off"></el-input>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="图标" prop="Icon">
        <el-input v-model="formData.Icon" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="Enabled">
        <el-select v-model="formData.Enabled" placeholder="请选择状态">
          <el-option label="激活" :value="true"></el-option>
          <el-option label="禁用" :value="false"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序" prop="OrderSort">
        <el-input v-model.number="formData.OrderSort" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item prop="IsButton" label="是否按钮">
        <el-switch v-model="formData.IsButton"></el-switch>
      </el-form-item>
      <el-form-item label="按钮事件" prop="Func">
        <el-input v-model="formData.Func" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item prop="IsHide" label="隐藏菜单" width>
        <el-switch v-model="formData.IsHide"></el-switch>
      </el-form-item>

      <el-form-item prop="Pid" label="父级菜单" >
        <el-tree-select v-model="formData.Pid" :data="menuTrees" filterable clearable check-strictly=true />
      </el-form-item>
      <el-form-item prop="Mid" label="API接口">
        <el-select style="width: 100%" v-model="formData.Mid" placeholder="请选择API" filterable>
          <el-option :key="0" :value="0" :label="'无需api'"></el-option>
          <el-option v-for="item in modules" :key="item.Id" :value="item.Id" :label="item.LinkUrl">
            <span style="float: left">{{ item.LinkUrl }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{
              item.Name
            }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="IskeepAlive" label="keepAlive" width sortable>
        <el-switch v-model="formData.IskeepAlive"></el-switch>
      </el-form-item>
      <el-form-item label="描述" prop="Description">
        <el-input v-model="formData.Description" auto-complete="off"></el-input>
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