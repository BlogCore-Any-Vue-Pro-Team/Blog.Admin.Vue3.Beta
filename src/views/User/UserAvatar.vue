<script setup>
import { ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'

import { useUserStore } from '@/stores'
const userStore = useUserStore()
import {
    RefreshMyLogo,
    getInfoByToken
} from '@/api/user.js'
import 'vue-cropper/dist/index.css'
import { VueCropper } from "vue-cropper";
const cropper = ref()
const loading = ref(false)
const click = () => {
    loading.value = true;
    cropper.value.getCropData(data => {
        showImg(data)
    })
    loading.value = false;
}

const showImg = (img) => {
    option.value.catImg = img;
}

const handleUpload = () => {
    if (!option.value.catImg) {
        ElMessage.error('请先截取头像')
        return;
    }
    ElMessageBox.confirm('确定提交么?')
        .then(() => {
            RefreshMyLogo({ logo: option.value.catImg }).then((res) => {
                // 获取用户信息
                getInfoByToken({ token: userStore.token }).then((userInfo) => {
                    userStore.setUserInfo(userInfo.data.response)
                })
                ElMessage.success(res.data.msg || '更新成功')
            })

        })
        .catch((err) => {
            console.info(err)
        })
}

const handleChange = data => {
    option.value.img = URL.createObjectURL(data.raw)

}
// https://vue-cropper.vercel.app/#/props
const option = ref({
    img: '',
    outputSize: 1, // 剪切后的图片质量（0.1-1）
    full: false, // 输出原图比例截图 props名full
    outputType: 'png',
    canMove: true,
    original: false,
    canMoveBox: true,
    autoCrop: true,
    autoCropWidth: 200,
    autoCropHeight: 200,
    fixedBox: true,
    fixed: true,
    maxImgSize: 1000, // 图片最大像素
    fixedNumber: [200, 200],
    catImg: ''
})
</script>

<template>
    <el-row :gutter="5">
        <el-col :span="1.5" class="flexBox">
            <el-upload class="flexItem" :auto-upload="false" action="" @change="handleChange" :show-file-list="false">
                <template #trigger>
                    <el-button type="primary">选择图片</el-button>
                </template>
            </el-upload>
            <el-button class="flexItem" type="primary" :loading="loading" @click="click">获取截图</el-button>
            <el-button class="flexItem" type="primary" @click="handleUpload">上传头像</el-button>
        </el-col>
    </el-row>
    <div style="width: 300px;height: 300px;margin-top: 5px;">
        <vue-cropper ref="cropper" :img="option.img" :outputSize="option.size" :outputType="option.outputType" :info="true"
            :full="option.full" :canMove="option.canMove" :canMoveBox="option.canMoveBox" :original="option.original"
            :autoCrop="option.autoCrop" :autoCropWidth="option.autoCropWidth" :autoCropHeight="option.autoCropHeight"
            :fixedBox="option.fixedBox" :fixed="option.fixed" :fixedNumber="option.fixedNumber">
        </vue-cropper>
        <el-image style="width: 200px; height: 200px;margin-top: 5px;" :src="option.catImg">
            <template #error>
                <div class="image-slot">
                    头像预览
                </div>
            </template>
        </el-image>




    </div>
</template>
<style lang="scss" scoped>
.flexBox {
    display: flex;
    flex-wrap: wrap;

    .flexItem {
        color: #fff;
        margin-top: 8px;
        margin-right: 5px;
        flex-wrap: wrap;
    }

    .flexContent {
        width: 200px;
    }
}
</style>