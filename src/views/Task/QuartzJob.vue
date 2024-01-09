<script setup>
import {
  Search
} from '@element-plus/icons-vue'
import { nextTick, onMounted, ref, watch } from 'vue'
import {
  getTaskListPage,
  removeTask,
  editTask,
  addTask,
  startJob,
  stopJob,
  reCovery,
  pauseJob,
  resumeJob,
  getTaskNameSpace,
  GetTaskLogs,
  GetTaskOverview,
  ExecuteJob
} from '@/api/task.js'


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
const refForm = ref()
const ruleForm = {
  JobGroup: [{ required: true, message: "请输入组名", trigger: "change" }],
  Name: [{ required: true, message: "请输入Job名", trigger: "change" }],
  BeginTime: [
    { required: true, message: "请选择开始时间", trigger: "change" },
  ],
  EndTime: [
    { required: true, message: "请选择结束时间", trigger: "change" },
  ],
  AssemblyName: [
    { required: true, message: "请输入程序集名", trigger: "change" },
  ],
  ClassName: [
    { required: true, message: "请输入执行的Job类名", trigger: "change" },
  ],
}
//新增
const HandleAdd = () => {
  formData.value = { Enabled: true }
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
      removeTask({ jobId: row.Id }).then((res) => {
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
      removeTask(ids).then((res) => {
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
          editTask(formData.value).then((res) => {
            HandleSearch()
            dialogVisible.value = false
            ElMessage.success(res.data.msg || '添加成功')
          })
        } else {
          //新增
          addTask(formData.value).then((res) => {
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


// 选择命名空间
const visibleNamespace = ref(false)
const tableNamespace = ref([])
const HandleNamespace = (row) => {
  visibleNamespace.value = false
  formData.value.AssemblyName = row.nameSpace;
  formData.value.ClassName = row.nameClass;
}
const GetTaskNameSpace = () => {
  getTaskNameSpace({}).then((res) => {
    tableNamespace.value = res.data.response;
  });
}


// 按钮等事件
//开启job
const HandleStartJob = (row) => {
  if (!row) {
    ElMessage.error('请选择要操作的数据!')
    return;
  }
  ElMessageBox.confirm('确认启动该Job吗?')
    .then(() => {
      let para = { jobId: row.Id };
      startJob(para).then((res) => {
        HandleSearch()
        ElMessage.success(res.data.msg || '操作成功')
      });
    })
    .catch((err) => {
      console.info(err)
    })
}
// 停止任务
const HandleStopJob = (row) => {
  if (!row) {
    ElMessage.error('请选择要操作的数据!')
    return;
  }
  ElMessageBox.confirm('确认停止该Job吗?')
    .then(() => {
      let para = { jobId: row.Id };
      stopJob(para).then((res) => {
        HandleSearch()
        ElMessage.success(res.data.msg || '操作成功')
      });
    })
    .catch((err) => {
      console.info(err)
    })
}
// 重启任务
const HandleReCoveryJob = (row) => {
  if (!row) {
    ElMessage.error('请选择要操作的数据!')
    return;
  }
  ElMessageBox.confirm('确认重启该Job吗?')
    .then(() => {
      let para = { jobId: row.Id };
      reCovery(para).then((res) => {
        HandleSearch()
        ElMessage.success(res.data.msg || '操作成功')
      });
    })
    .catch((err) => {
      console.info(err)
    })
}
// 暂停任务
const HandlePauseJob = (row) => {
  if (!row) {
    ElMessage.error('请选择要操作的数据!')
    return;
  }
  ElMessageBox.confirm('确认暂停该Job吗?')
    .then(() => {
      let para = { jobId: row.Id };
      pauseJob(para).then((res) => {
        HandleSearch()
        ElMessage.success(res.data.msg || '操作成功')
      });
    })
    .catch((err) => {
      console.info(err)
    })
}
// 恢复任务
const HandleResumeJob = (row) => {
  if (!row) {
    ElMessage.error('请选择要操作的数据!')
    return;
  }
  ElMessageBox.confirm('确认暂停该Job吗?')
    .then(() => {
      let para = { jobId: row.Id };
      resumeJob(para).then((res) => {
        HandleSearch()
        ElMessage.success(res.data.msg || '操作成功')
      });
    })
    .catch((err) => {
      console.info(err)
    })
}
// 立即执行
const HandleExecuteJob = (row) => {
  if (!row) {
    ElMessage.error('请选择要操作的数据!')
    return;
  }
  ElMessageBox.confirm('确认暂停该Job吗?')
    .then(() => {
      let para = { jobId: row.Id };
      ExecuteJob(para).then((res) => {
        HandleSearch()
        ElMessage.success(res.data.msg || '操作成功')
      });
    })
    .catch((err) => {
      console.info(err)
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

  getTaskListPage(filters.value).then(res => {
    tableData.value = res.data.response.data;
    tableTotal.value = res.data.response.dataCount;
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
        <!-- <el-form-item class="flexItem">
          <el-button type="danger" plain @click="HandleBatchDel(selectRows)">批量删除</el-button>
        </el-form-item> -->
        <el-form-item class="flexItem">
          <el-button type="primary" plain @click="HandleStartJob(currentRow)">开启</el-button>
        </el-form-item>
        <el-form-item class="flexItem">
          <el-button type="danger" plain @click="HandleStopJob(currentRow)">停止</el-button>
        </el-form-item>
        <el-form-item class="flexItem">
          <el-button type="primary" plain @click="HandleReCoveryJob(currentRow)">重启</el-button>
        </el-form-item>
        <el-form-item class="flexItem">
          <el-button type="primary" plain @click="HandlePauseJob(currentRow)">暂停</el-button>
        </el-form-item>
        <el-form-item class="flexItem">
          <el-button type="primary" plain @click="HandleResumeJob(currentRow)">恢复</el-button>
        </el-form-item>
        <el-form-item class="flexItem">
          <el-button type="primary" plain @click="HandleExecuteJob(currentRow)">立即执行</el-button>
        </el-form-item>
      </el-form>

    </el-col>
  </el-row>
  <!-- 内容 -->
  <el-table ref="refTable" :data="tableData" highlight-current-row @selection-change="HandleSelectChange"
    @row-click="HandleClickRow" border>
    <el-table-column type="selection" width="50"></el-table-column>
    <el-table-column prop="JobGroup" label="任务组" width="200" show-overflow-tooltip></el-table-column>
    <el-table-column prop="Name" label="任务名称" width="200" show-overflow-tooltip></el-table-column>

    <el-table-column prop="TriggerType" label="任务类型" width="90" align="center">
      <template #default="{ row }">
        <el-tag :type="row.TriggerType == 1 ? 'success' : ''" disable-transitions>{{ row.TriggerType == 1 ?
          "Cron" : "Simple" }}</el-tag>
      </template>
    </el-table-column>

    <el-table-column prop="triggerStatus" label="内存状态" width="90" align="center">
      <template #default="{ row }">
        <el-tag :type="row.Triggers[0].triggerStatus == '正常'
          ? 'success'
          : 'danger'
          " disable-transitions>{{ row.Triggers[0].triggerStatus }}</el-tag>
      </template>
    </el-table-column>

    <el-table-column prop="IsStart" label="数据库状态" width="100" align="center">
      <template #default="{ row }">
        <el-tag :type="row.IsStart ? 'success' : 'danger'" disable-transitions>{{ row.IsStart ? "运行中" : "停止"
        }}</el-tag>
      </template>
    </el-table-column>

    <el-table-column prop="Cron" label="Cron表达式" width="200" show-overflow-tooltip></el-table-column>
    <el-table-column prop="AssemblyName" label="程序集" width="150" show-overflow-tooltip></el-table-column>
    <el-table-column prop="ClassName" label="执行类" width="150" show-overflow-tooltip></el-table-column>
    <el-table-column prop="RunTimes" label="累计运行(次)" width="150" show-overflow-tooltip></el-table-column>
    <el-table-column prop="IntervalSecond" label="循环周期(秒)" width="150" show-overflow-tooltip></el-table-column>
    <el-table-column prop="CycleRunTimes" label="循环(次)" width="150" show-overflow-tooltip></el-table-column>
    <el-table-column prop="CycleHasRunTimes" label="已循环(次)" width="150" show-overflow-tooltip></el-table-column>
    <el-table-column prop="BeginTime" label="开始时间" width="200" show-overflow-tooltip></el-table-column>
    <el-table-column prop="EndTime" label="结束时间" width="200" show-overflow-tooltip></el-table-column>

    <el-table-column label="日志" fixed="right">
      <template #default="{ row }">

        <el-tooltip effect="dark" placement="top">

          <template #content> <span v-html="row.Remark"></span> </template>
          <el-tag>Log</el-tag>
        </el-tooltip>
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
    <el-form ref="refForm" :model="formData" :rules="ruleForm" label-width="90px" status-icon>
      <el-form-item label="任务组" prop="JobGroup">
        <el-input v-model="formData.JobGroup" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="Name">
        <el-input v-model="formData.Name" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="程序集" prop="AssemblyName">
        <el-input v-model="formData.AssemblyName" auto-complete="off">
          <template #append>
            <el-popover v-model="visibleNamespace" placement="right" :width="400" trigger="click">
              <template #reference>
                <el-button :icon="Search" @click="GetTaskNameSpace"></el-button>
              </template>
              <el-table @cell-dblclick="HandleNamespace" :data="tableNamespace" highlight-current-row style="width: 100%">
                <el-table-column type="index" width="50"> </el-table-column>
                <el-table-column property="nameClass" label="类名" min-width="350">
                </el-table-column>
                <el-table-column property="nameSpace" label="命名空间" width="300">
                </el-table-column>
                <el-table-column property="remark" width="100" label="备注"> </el-table-column>
              </el-table>
            </el-popover>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="执行类名" prop="ClassName">
        <el-input v-model="formData.ClassName" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="执行参数" prop="JobParams">
        <el-input class="textarea" type="textarea" :rows="6" v-model="formData.JobParams"></el-input>
      </el-form-item>
      <el-form-item prop="TriggerType" label="是否Cron">
        <el-switch v-model="formData.TriggerType"> </el-switch>
        <span style="margin-left: 5px; color: #aaa">(1：Cron模式，0：Simple模式)</span>
      </el-form-item>
      <el-form-item label="Cron表达式" v-if="formData.TriggerType" prop="Cron">
        <el-tooltip placement="top">
          <template #content>
            每隔5秒执行一次：*/5 * * * * ?<br />
            每隔1分钟执行一次：0 */1 * * * ?<br />
            每天23点执行一次：0 0 23 * * ?<br />
            每天凌晨1点执行一次：0 0 1 * * ?<br />
            每月1号凌晨1点执行一次：0 0 1 1 * ?<br />
            每月最后一天23点执行一次：0 0 23 L * ?<br />
            每周星期天凌晨1点实行一次：0 0 1 ? * L<br />
            在26分、29分、33分执行一次：0 26,29,33 * * * ?<br />
            每天的0点、13点、18点、21点都执行一次：0 0 0,13,18,21 * * ?<br />
          </template>
          <el-input v-model="formData.Cron" auto-complete="off">
            <template #append>
              <el-popover v-model="visibleNamespace" placement="right" :width="400" trigger="click">
                <template #reference>
                  <el-button :icon="Search"></el-button>
                </template>
                还未实现
              </el-popover>
            </template>
          </el-input>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="循环周期" v-else prop="IntervalSecond">
        <el-input-number v-model="formData.IntervalSecond" :min="1" style="width: 200px"
          auto-complete="off"></el-input-number>
        <span>(单位：秒)</span>
      </el-form-item>
      <el-form-item label="循环次数" v-if="!formData.TriggerType" prop="CycleRunTimes">
        <el-tooltip placement="top">
          <template #content>
            设置成0时,就意味着无限制次数运行
          </template>
          <el-input-number v-model="formData.CycleRunTimes" :min="0" style="width: 200px"
            auto-complete="off"></el-input-number>
        </el-tooltip>
        <span>(单位：次)</span>
      </el-form-item>
      <el-form-item label="已循环次数" v-if="!formData.TriggerType" prop="CycleRunTimes">
        <el-input-number v-model="formData.CycleHasRunTimes" :min="0" style="width: 200px"
          auto-complete="off"></el-input-number>
        <span>(单位：次)</span>
      </el-form-item>
      <el-form-item label="是否激活" prop="IsStart">
        <el-switch v-model="formData.IsStart"> </el-switch>
      </el-form-item>

      <el-form-item label="开始时间" prop="BeginTime">
        <el-date-picker type="datetime" placeholder="选择日期" v-model="formData.BeginTime"
          value-format="YYYY-MM-DD HH:mm:ss"></el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="EndTime">
        <el-date-picker type="datetime" placeholder="选择日期" v-model="formData.EndTime"
          value-format="YYYY-MM-DD HH:mm:ss"></el-date-picker>
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