<script lang="ts" setup>
import Layout from '@/layout/index.vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
</script>

<template>
  <el-config-provider :locale="zhCn">
    <Layout />
  </el-config-provider>
</template>

<style lang="scss" scoped></style>
