<script lang="ts" setup>
import { dayjs } from 'element-plus'
const tableColumnProps = withDefaults(
  defineProps<{
    prop: TableColumnProp
    emptyVal?: string
  }>(),
  {
    emptyVal: '--'
  }
)
function filterValue(row: any, prop: TableColumnProp): string {
  if (prop.filterName) {
    const filterParams = (prop.filterParams && prop.filterParams.map((i) => (i.key && row[i.key]) || i)) || []
    return filter[prop.filterName](row[prop.key], ...filterParams)
  }
  return row[prop.key] || tableColumnProps.emptyVal
}

const filter: {
  [key: string]: any
} = {
  formateTime(val: string, format = 'YYYY/MM/DD HH:mm'): string {
    return dayjs(val).format(format)
  },
  formateStringNumberTime(val: string, format = 'YYYY/MM/DD HH:mm') {
    return dayjs(+val).format(format)
  },
  formateListLabel(val: string, list: any[], value_key = 'value', label_key = 'label') {
    if (!list.length) return val
    let item = list.find((i) => i[value_key] === val)
    if (item) return item[label_key]
    return val
  },
  formatObject(val: object) {
    return JSON.stringify(val || {}, null, 2)
  }
}
</script>
<template>
  <el-table-column
    :prop="prop.key"
    :label="prop.label"
    :sortable="prop.sortable"
    :width="prop.width"
    :min-width="prop.minWidth"
    :align="prop.align || 'center'"
    :fixed="prop.fixed">
    <template v-if="prop.children">
      <template v-for="item in prop.children">
        <common-table-column :prop="item"></common-table-column>
      </template>
    </template>
    <template
      v-if="prop.labelTooltip"
      #header>
      <span class="flex items-center justify-center">
        <span>
          {{ prop.label }}
        </span>
      </span>
    </template>
    <template
      v-if="prop.key"
      v-slot="scope">
      <slot
        v-if="prop.slot_name"
        :row="scope.row"
        :index="scope.$index"></slot>
      <template v-else>
        <template v-if="prop.copytext">
          <el-tooltip
            class="item"
            effect="dark"
            placement="top">
            <div
              slot="content"
              style="white-space: pre-line !important; max-height: 60vh; overflow-y: scroll">
              {{ filterValue(scope.row, prop) }}
            </div>
            <div
              class="text-overflow3"
              style="max-width: 100%">
              {{ filterValue(scope.row, prop) }}
            </div>
          </el-tooltip>
        </template>
        <template v-else>
          {{ filterValue(scope.row, prop) }}
        </template>
      </template>
    </template>
  </el-table-column>
</template>

<style lang="scss" scoped></style>
