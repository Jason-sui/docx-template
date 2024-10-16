<template>
  <el-container v-if="$route.meta.layout" class="common-layout">
    <el-aside width="200px">
      <!-- logo titile -->
      <Menu />
    </el-aside>
    <el-container>
      <el-header class="common-header">
        <Header />
      </el-header>
      <el-main class="flex-1 overflow-hidden">
        <RouterView v-slot="{ Component }">
          <template v-if="Component">
            <Transition mode="out-in" v-if="$route.meta.keepAlive">
              <KeepAlive>
                <component :is="Component" class="layout" />
              </KeepAlive>
            </Transition>
            <Transition mode="out-in" v-if="!$route.meta.keepAlive">
              <component :is="Component" class="layout" />
            </Transition>
          </template>
        </RouterView>
      </el-main>
    </el-container>
  </el-container>

  <template v-else>
    <RouterView />
  </template>
</template>

<script setup lang="ts">
import Menu from './components/menu.vue'
import Header from './components/header.vue'
defineOptions({
  name: 'LayoutIndex',
})
</script>

<style lang="scss" scoped>
.common-layout {
  height: 100%;

  .el-main {
    padding: 0;
  }

  .common-header {
    width: 100%;
    padding: 0;
    border-bottom: solid 1px var(--el-menu-border-color);
  }

  .el-skeleton {
    padding: var(--el-main-padding);
  }
}
</style>
