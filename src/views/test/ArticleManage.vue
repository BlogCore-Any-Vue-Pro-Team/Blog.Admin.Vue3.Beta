<script setup>
import { ref } from 'vue'
// 导入组件,如果是放在src下面的组件会自动导入,其他地方需要手动导入
import ArticleChannelDialog from './components/ArticleChannelDialog.vue'
import ArticleTypeSelect from './components/ArticleTypeSelect.vue'

import { ArrowDown } from '@element-plus/icons-vue'

const tableData = ref([
  {
    date: '2022-01-01',
    name: '张三',
    address: '中华人民共和国新疆维吾尔自治区伊犁哈萨克自治州塔城地区和布克赛尔蒙古自治县和什托洛盖镇西特木恩哈布其克村'
  },
  {
    date: '2022-01-01',
    name: '张三',
    address: '中华人民共和国新疆维吾尔自治区伊犁哈萨克自治州塔城地区和布克赛尔蒙古自治县和什托洛盖镇西特木恩哈布其克村'
  },
  {
    date: '2022-01-01',
    name: '张三',
    address: '中华人民共和国新疆维吾尔自治区伊犁哈萨克自治州塔城地区和布克赛尔蒙古自治县和什托洛盖镇西特木恩哈布其克村'
  },
  {
    date: '2022-01-01',
    name: '张三',
    address: '中华人民共和国新疆维吾尔自治区伊犁哈萨克自治州塔城地区和布克赛尔蒙古自治县和什托洛盖镇西特木恩哈布其克村'
  },
  {
    date: '2022-01-01',
    name: '张三',
    address: '中华人民共和国新疆维吾尔自治区伊犁哈萨克自治州塔城地区和布克赛尔蒙古自治县和什托洛盖镇西特木恩哈布其克村'
  },
  {
    date: '2022-01-01',
    name: '张三',
    address: '中华人民共和国新疆维吾尔自治区伊犁哈萨克自治州塔城地区和布克赛尔蒙古自治县和什托洛盖镇西特木恩哈布其克村'
  },
  {
    date: '2022-01-01',
    name: '张三',
    address: '中华人民共和国新疆维吾尔自治区伊犁哈萨克自治州塔城地区和布克赛尔蒙古自治县和什托洛盖镇西特木恩哈布其克村'
  },
  {
    date: '2022-01-01',
    name: '张三',
    address: '中华人民共和国新疆维吾尔自治区伊犁哈萨克自治州塔城地区和布克赛尔蒙古自治县和什托洛盖镇西特木恩哈布其克村'
  },
  {
    date: '2022-01-01',
    name: '张三',
    address: '中华人民共和国新疆维吾尔自治区伊犁哈萨克自治州塔城地区和布克赛尔蒙古自治县和什托洛盖镇西特木恩哈布其克村'
  },
  {
    date: '2022-01-01',
    name: '张三',
    address: '中华人民共和国新疆维吾尔自治区伊犁哈萨克自治州塔城地区和布克赛尔蒙古自治县和什托洛盖镇西特木恩哈布其克村'
  },
  {
    date: '2022-01-01',
    name: '张三',
    address: '中华人民共和国新疆维吾尔自治区伊犁哈萨克自治州塔城地区和布克赛尔蒙古自治县和什托洛盖镇西特木恩哈布其克村'
  },
])
const formData = ref({
  key: '',
  type: '1'
})
const dialog = ref()

const addArticle = () => {
  dialog.value.open()
}
const editArticle = () => {
  var data = { id: 1, name: 'name', pass: 'pass' }
  dialog.value.open(data)
}
const delArticle = () => {

  ElMessageBox.confirm('确定删除么?')
    .then(() => {
      ElMessage.success('删除成功')
    })
    .catch((err) => {
      console.info(err)
    })

}
const searchData = () => {
  ElMessage.success('搜索数据')
  console.info("formData.type", formData.value.type)
}
</script>
<template>
    <el-row>
      <el-col :span="1.5">
        <el-form @submit.prevent :inline="true" :model="formData">
          <el-form-item label="关键词">
            <el-input style="width: 200px;" v-model="formData.key" placeholder="请输入搜索关键词" clearable />
          </el-form-item>
          <el-form-item label="类型">
            <article-type-select v-model="formData.type"></article-type-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain @click="searchData">查询</el-button>
            <el-button type="primary" plain @click="addArticle">添加</el-button>
            <el-button type="primary" plain @click="editArticle">修改</el-button>
            <el-button type="danger" plain @click="delArticle">删除</el-button>
          </el-form-item>
          <el-form-item>

          </el-form-item>
          <el-form-item>

          </el-form-item>
          <el-form-item>

          </el-form-item>
        </el-form>

      </el-col>
    </el-row>
    <el-table ref="singleTableRef" :data="tableData" highlight-current-row style="width: 100%">
      <el-table-column type="index" width="80" label="序号" />
      <el-table-column property="date" label="日期" width="120">
        <template #default="{ row }">
          {{ row.date }}
        </template>
      </el-table-column>
      <el-table-column property="name" label="名称" width="120" />
      <el-table-column property="address" label="地址" />
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-dropdown>
            <span class="el-dropdown-link">

              <el-button type="primary" link>操作
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </el-button>

            </span>

            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>{{ row.name }}</el-dropdown-item>
                <el-dropdown-item>{{ row.date }}</el-dropdown-item>
                <el-dropdown-item disabled divided>操作3</el-dropdown-item>
                <el-dropdown-item disabled>操作4</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>
    <el-pagination style="margin-top: 10px;" small background layout="total, prev, pager, next" :total="50" />
  <article-channel-dialog ref="dialog" @success="searchData"></article-channel-dialog>
</template> 
<style lang="scss" scoped></style>