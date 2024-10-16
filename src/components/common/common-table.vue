<script lang="ts" setup>
const emit = defineEmits(['pageChange'])
const tableProps = defineProps<{
  props: TableColumnProp[]
  pageInfo: TablePageInfo
}>()
const attrs = useAttrs()
const showPagination = computed(() => {
  return tableProps.pageInfo.pageNum && attrs.data && (attrs.data as any[]).length && tableProps.pageInfo.total
})
function pageChange({ pageNum, limit = tableProps.pageInfo.limit }: { pageNum: number; limit: number }) {
  emit('pageChange', { pageNum, limit })
}
</script>
<template>
  <div class="flex flex-col h-full flex-1 overflow-hidden">
    <div class="flex-1 overflow-hidden">
      <el-table
        v-bind="$attrs"
        height="100%">
        <slot name="start"></slot>
        <template v-for="prop in props">
          <common-table-column :prop="prop">
            <template
              v-if="prop.slotName"
              v-slot="scope">
              <slot
                :name="prop.slotName"
                :row="scope.row"
                :index="scope.index"></slot>
            </template>
          </common-table-column>
        </template>
        <slot></slot>
      </el-table>
    </div>
    <div
      v-if="showPagination"
      class="mt-3 flex justify-end">
      <common-pagination
        :pageInfo="pageInfo"
        @pageChange="pageChange"></common-pagination>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
