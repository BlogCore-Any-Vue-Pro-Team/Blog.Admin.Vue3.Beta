<script setup>
import { onMounted, ref } from 'vue';
import {
    PutMyInfo,
    getInfoByToken
} from '@/api/user.js'
import {
    getRoleListPage
} from '@/api/role.js'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useUserStore } from '@/stores';
const userStore = useUserStore()
const formData = ref({})
const refForm = ref()
const roles = ref([])
const ruleForm = {
    RealName: [
        { required: true, message: '昵称不能为空', trigger: 'change' },
    ],
    LoginName: [
        { required: true, message: '登录名不能为空', trigger: 'change' },
    ]
}
onMounted(() => {
    formData.value = JSON.parse(JSON.stringify(userStore.userInfo))
    //加载角色
    getRoleListPage({ size: 9999 }).then((res) => {
        roles.value = res.data.response.data;
    });
})

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
                PutMyInfo(formData.value).then((res) => {

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

    })

}
const getRoleName = (item) => {
    let find = roles.value.find(t => t.Id == item)
    if (find) {
        return find.Name
    } else {
        return item
    }
}
</script>
<template>
    <el-form style="width: 550px;" class="mobile-box" @submit.prevent ref="refForm" :model="formData" :rules="ruleForm"
        label-width="80px" status-icon label-position="top">

        <el-form-item label="昵称" prop="RealName">
            <el-input v-model="formData.RealName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="登录名" prop="LoginName">
            <el-input v-model="formData.LoginName" auto-complete="off"></el-input>
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
        <el-form-item label="拥有角色" prop="RIDs">
            <el-row :gutter="5">
                <el-col :span="1.5" v-for="item in formData.RIDs"><el-tag>{{ getRoleName(item) }}</el-tag></el-col>
            </el-row>
        </el-form-item>
        <el-form-item>
            <el-affix position="bottom" :offset="80">
                <el-button type="primary" @click="HandleSubmit">保存</el-button>
            </el-affix>
        </el-form-item>

    </el-form>
</template>
