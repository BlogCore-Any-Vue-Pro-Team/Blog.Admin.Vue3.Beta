<!-- 二次封装Select组件 -->
<script setup>
import { ref } from 'vue';
const selectList = ref([
  {
    id: '1',
    name: '类型1'
  },
  {
    id: '2',
    name: '类型2'
  },
  {
    id: '3',
    name: '类型3'
  }
])

defineProps({
  modelValue: {
    type: [Number, String]
  }
})
const emit = defineEmits(['update:modelValue'])
</script>
<template>
  <el-select placeholder="请选择" clearable :modelValue="modelValue" @update:modelValue="emit('update:modelValue', $event)">
    <el-option v-for="item in selectList" :key="item.id" :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>