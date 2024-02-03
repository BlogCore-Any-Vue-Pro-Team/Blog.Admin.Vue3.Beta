<script setup>
import { ref } from 'vue'

const dialogVisible = ref(false)
const formModel = ref({})
const refForm = ref()
const ruleForm = {
  name: [
    { required: true, message: 'name不能为空', trigger: 'blur' },
  ],
  pass: [
    { required: true, message: 'pass不能为空', trigger: 'blur' },
  ]
}

const handleClose = (done) => {
  ElMessageBox.confirm('确定关闭么?')
    .then(() => {
      done()
    })
    .catch((err) => {
      console.info(err)
    })
}
const onSubmit = () => {
  // 发起请求
  refForm.value.validate().then(() => {
    const isEdit = formModel.value.id
    if (isEdit) {
      ElMessage.success('编辑成功')
    } else {
      ElMessage.success('添加成功')
    }
    dialogVisible.value = false
    emit('success')
  })

}

const open = (row) => {
  dialogVisible.value = true
  // 回显数据
  formModel.value = { ...row }
  imgUrl.value = ''
}

// 暴露方法(子传父)
defineExpose({
  open
})
// 获取父组件的success事件(父传子)
const emit = defineEmits(['success'])



//上传相关
import { Plus } from '@element-plus/icons-vue'
const imgUrl = ref('')
const onSelectFile = (uploadFile) => {
  // 预览图片
  imgUrl.value = URL.createObjectURL(uploadFile.raw)
  // 存放图片数据到form表单
  formModel.value.img = uploadFile.raw
}
</script>
<template>
  <el-dialog v-model="dialogVisible" :title="formModel.id ? '编辑' : '添加'" width="30%" :before-close="handleClose">



    <el-form @submit.prevent ref="refForm" :model="formModel" :rules="ruleForm" label-width="120px" status-icon label-position="top">
      <el-form-item label="账号" prop="name">
        <el-input v-model="formModel.name" />
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input v-model="formModel.pass" />
      </el-form-item>

      <el-form-item label="上传" prop="pass">
        <el-upload class="avatar-uploader" :show-file-list="false" :auto-upload="false" :on-change="onSelectFile">
          <img v-if="imgUrl" :src="imgUrl||formModel.value.imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }

    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }

    .el-upload:hover {
      border-color: var(--el-color-primary);
    }

    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
</style>