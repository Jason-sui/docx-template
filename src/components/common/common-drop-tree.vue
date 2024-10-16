<script setup lang="ts">
import { ElTree } from 'element-plus'
import type { FilterNodeMethodFunction } from 'element-plus/es/components/tree/src/tree.type'
import type Node from 'element-plus/es/components/tree/src/model/node'
import type { AllowDropType, TreeNodeData } from 'element-plus/es/components/tree/src/tree.type'
defineOptions({
  name: 'drop-tree'
})

const props = defineProps({
  treeData: {
    type: Array,
    default: () => []
  },
  filterText: {
    type: String,
    default: ''
  },
  filterNodeMethod: {
    type: Function as PropType<FilterNodeMethodFunction>,
    default: (value: string, data: TreeNodeData, child: Node): boolean => {
      if (!value) return true
      return data.label.includes(value)
    }
  }
})
const emit = defineEmits(['node-drop'])
const treeTemplate = useTemplateRef<InstanceType<typeof ElTree>>('treeRef')
watch(
  () => props.filterText,
  (val) => {
    treeTemplate.value!.filter(val)
  }
)

// 拖拽控制
const allowDrop = (draggingNode: Node, dropNode: Node, type: AllowDropType) => {
  // 同级之间相互拖拽 排序
  if (draggingNode.level === dropNode.level) {
    return type === 'prev' || type === 'next'
  } else if (type === 'inner') {
    return !draggingNode.data.children && dropNode.data.children
  } else {
    return false
  }
}

function onNodeDrop(draggingNode: Node, dropNode: Node, type: AllowDropType) {
  emit('node-drop', { dropNode, draggingNode, type })
}
</script>
<template>
  <div class="h-full w-full overflow-hidden flex flex-col">
    <div class="flex-1 mt-1 overflow-y-hidden relative">
      <el-scrollbar height="100%">
        <el-tree
          ref="treeRef"
          :allow-drop="allowDrop"
          :data="treeData"
          draggable
          default-expand-all
          node-key="key"
          empty-text="没有匹配的内容/暂无数据"
          @node-drop="onNodeDrop"
          :filter-node-method="filterNodeMethod">
          <template #default="{ node, data }">
            <slot
              :node="node"
              :data="data"></slot>
          </template>
        </el-tree>
      </el-scrollbar>
    </div>
  </div>
</template>
<style>
.el-drawer.btt {
  overflow: hidden;
  height: fit-content !important;
  width: 350px;
}
.el-tree-node__content {
  height: fit-content;
  display: flex;
  align-items: center;
  width: 100%;
}
.el-tree-node__expand-icon {
  display: none !important;
}
</style>
