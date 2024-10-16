<template>
  <el-menu
    unique-opened
    router
    :default-active="menu_index"
    mode="vertical"
  >
    <template v-for="(item, key) in menu_list" :key="key">
      <el-menu-item v-if="item.children?.length === 0" :index="String(key)">
        {{ item.name }}
      </el-menu-item>
      <el-sub-menu v-else :index="String(key)">
        <template v-slot:title>{{ item.name }}</template>
        <el-menu-item
          v-for="(sub, index) in item.children"
          :key="index"
          :route="{ path: sub.path, query: Object.assign({}, sub.query) }"
          :index="`${key}-${index}`"
        >
          {{ sub.name }}
        </el-menu-item>
      </el-sub-menu>
    </template>
  </el-menu>
</template>

<script setup lang="ts">
defineOptions({
  name: 'LayoutMenu',
})
interface MenuItem {
  name: string
  path?: string
  query?: { [key: string]: any }
  children?: MenuItem[]
}
const menu_list = ref<MenuItem[]>([
  {
    name: '系统管理',
    children: [
      {
        name: '首页',
        path: '/',
      },
      {
        name: '模版页面',
        path: '/template',
      },
    ],
  },
])
let menu_index = ref<string>('')
// 根据path获取menu_index
const router = useRouter()
onMounted(() => {
  menu_index.value = getMenuIndex(menu_list.value, router.currentRoute.value.path)
})

function getMenuIndex(list: MenuItem[], path: string): string {
  for (let i = 0; i < list.length; i++) {
    const item = list[i]
    if (item.path === path) {
      return `${i}`
    } else if (item.children) {
      const child_index = getMenuIndex(item.children, path)
      if (child_index !== '') {
        return `${i}-${child_index}`
      }
    }
  }
  return ''
}
</script>

<style lang="scss">
.el-menu {
  height: 100%;
}
</style>
