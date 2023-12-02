/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'prettier/prettier': [
      'warn',
      {
        singleQuote: true, //单引号
        semi: false, //无分号
        printWidth: 150, //每行宽度至多80字符
        trailingComma: 'none', //不加对象|数组最后逗号
        endOfLine: 'auto' //换行符号不限制(win mac不一致)
      }
    ],
    'vue/multi-word-component-names': [
      'warn',
      {
        ignores: ['index'] //vue组件名称多单词(忽略index.vue)
      }
    ],
    'vue/no-setup-props-destructure': ['off'], //关闭props结构的校验
    'no-undef': 'error'
  },
  global: {
    ElMessage: 'readonly',
    ElMessageBox: 'readonly',
    ElLoading: 'readonly'
  }
}
