<script lang="ts" setup>
const emit = defineEmits(['pageChange'])
let currentPage = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)
let pager_count = 7
const tablePageInfoProps = defineProps<{
  pageInfo: TablePageInfo
}>()
let page_count = computed(() => {
  return Math.floor(total.value / pageSize.value)
})
let layout = computed(() => {
  let layout_string_list = ['sizes', 'prev', 'pager', 'next', 'total']
  if (page_count.value > pager_count) {
    layout_string_list.splice(4, 0, 'jumper')
  }
  return layout_string_list.join(',')
})

onMounted(() => {
  initData()
})

function initData() {
  currentPage.value = tablePageInfoProps.pageInfo.pageNum
  pageSize.value = tablePageInfoProps.pageInfo.limit || 10
  total.value = tablePageInfoProps.pageInfo.total
}
function handleSizeChange(val: number) {
  currentPage.value = 1
  emit('pageChange', { page_num: currentPage.value, limit: val })
}
function handleCurrentChange(val: number) {
  emit('pageChange', { page_num: val, limit: pageSize.value })
}
</script>
<template>
  <el-pagination
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :pager-count="pager_count"
    :page-sizes="[10, 20, 50, 100]"
    :total="total"
    :layout="layout"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange" />
</template>

<style lang="scss" scoped></style>
