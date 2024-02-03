<script setup>
import { onMounted, ref, watch } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import {
  getRoleListPage,
} from '@/api/role.js'
import {
  getPermissionTree,
  getPermissionIds,
  addRolePermission
} from '@/api/assign.js'



//加载数据
onMounted(() => {
  HandleSearch()
})


const roles = ref([])
const data = ref([])
const data5 = ref([])
const assigns = ref([])
const assignBtns = ref([])
const treeRef = ref()
const roleid = ref('')
const isLoad = ref(false)
// 搜索
const HandleSearch = () => {
  GetRoles()
  GetPermissions()
}
// 获取角色列表
const GetRoles = () => {
  getRoleListPage({ size: 9999 }).then(res => {
    roles.value = res.data.response.data;
  });
}
// 获取菜单树
const GetPermissions = () => {
  let para = { needbtn: false }
  getPermissionTree(para).then((res) => {
    data.value = res.data.response.children;
    data5.value = JSON.parse(JSON.stringify(data.value));
  });
}
// 通过角色id 获取菜单Id
const GetPermissionIds = (rid) => {
  isLoad.value = false
  roleid.value = rid
  assigns.value = [];
  assignBtns.value = [];
  let para = { rid: rid }
  getPermissionIds(para).then((res) => {
    treeRef.value.setCheckedKeys(res.data.response.permissionids);
    assignBtns.value = res.data.response.assignbtns;
    isLoad.value = true
  });
}
// 保存权限
const SaveAssign = () => {

  ElMessageBox.confirm('确定提交么?')
    .then(() => {
      let pids = treeRef.value.getCheckedKeys();
      for (let i = 0; i < assignBtns.value.length; i++) {
        let assginbtn = assignBtns.value[i];
        if (assginbtn && assginbtn > 0) {
          pids.push(assginbtn);
        }
      }
      let para = { pids: pids, rid: roleid.value }
      addRolePermission(para).then((res) => {

        getPermissionIds({ rid: roleid.value }).then((res2) => {
          treeRef.value.setCheckedKeys(res2.data.response.permissionids);
          assignBtns.value = res2.data.response.assignbtns;
          ElMessage.success(res.data.msg || '更新成功')
        });
      })
    })
    .catch((err) => {
      console.info(err)
    })

}
//反选
const reverse = (ls) => {
  console.log(data5.value);
  console.log(ls);
  if (ls && ls.length) {
    for (let i = 0; i < ls.length; i++) {
      let btn = ls[i];
      let findBtnIndex = assignBtns.value.findIndex(t => t == btn.value);
      if (findBtnIndex > -1) {
        assignBtns.value.splice(findBtnIndex, 1);
      } else {
        assignBtns.value.push("" + btn.value);
      }
    }
  }
}
</script>
<template>
  <div style="display: flex;flex-wrap: wrap;">
    <!-- 左边 -->
    <el-card style="width: 375px;margin-right: 5px;margin-bottom: 5px;">
      <template #header>
        <div class="card-header">
          <span>角色</span>
          <el-link @click="GetRoles" style="float: right; padding: 3px 0" type="primary">刷新</el-link>
        </div>
      </template>
      <div style="font-size: 14px; line-height: 32px; cursor: pointer;" v-for="o in roles" :key="o.Id"
        @click="GetPermissionIds(o.Id)" :class="o.Id == roleid ? 'active' : ''">
        {{ o.Name }}
      </div>
    </el-card>
    <!-- 右边 -->
    <el-card style="min-width: 400px;flex: 1;margin-bottom: 5px;">
      <template #header>
        <div class="card-header">
          <span>菜单</span>
          <el-link v-if="isLoad" @click="SaveAssign" style="float: right; padding: 3px 0" type="primary">保存</el-link>
          <el-link v-else type="primary">请选中一个要操作的角色</el-link>
        </div>
      </template>
      <div>
        <div class="morechildren">
          <el-tree ref="treeRef" :data="data5" show-checkbox default-expand-all node-key="value" highlight-current
            :check-strictly="true">
            <template #default="{ node, data }">
              <el-scrollbar class="custom-tree-node-right">
                <div style="display: flex; justify-content: space-between; /* 左右分布 */">
                  <span style=" margin-right: 10px; ">{{ node.label }}<el-button @click.prevent="reverse(data.btns)"
                      v-if="(data.btns && data.btns.length > 1)" style="padding:5px 8px;margin-left:5px;" size="small"
                      plain type="primary">反选</el-button>
                  </span>
                  <el-checkbox-group style=" margin-right: 10px;" v-model="assignBtns">
                    <el-checkbox style="padding: 0px; margin-right: 5px;" v-for="btn in data.btns" :key="btn.value"
                      :label="btn.value.toString()">
                      {{ btn.label }}
                    </el-checkbox>
                  </el-checkbox-group>
                </div>

              </el-scrollbar>
            </template>
          </el-tree>
        </div>
      </div>
    </el-card>
  </div>
</template> 
<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.active {
  background: #ebf5ff;
}


.custom-tree-node {
  flex: 1;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.custom-tree-node-right {
  // flex: 1;
  justify-content: space-between;
  // display: flex;
  // overflow-x: auto;
  /* 允许水平滚动 */
  // flex-wrap: nowrap;

  /* 防止元素换行 */
}
</style>