<template>
  <div class="page-container">
    <slot></slot>
  </div>
</template>
<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;
  border: 1px solid #f0f0f0;
  padding: 10px;
}
</style>