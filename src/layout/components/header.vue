<template>
  <div class="layout-header">
    <div class="layout-header-right">头部</div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'LayoutHeader'
})
</script>

<style lang="scss" scoped>
.layout-header {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: space-between;
  padding: var(--el-header-padding);

  &-right {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
}
</style>
