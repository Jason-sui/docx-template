<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
const emit = defineEmits(['submitForm', 'resetForm'])
defineOptions({
  name: 'CommonForm'
})
withDefaults(
  defineProps<{
    props: FormProp[]
    showButton?: boolean
    confirmButtonText?: string
    cancelButtonText?: string
  }>(),
  {
    showButton: true,
    confirmButtonText: '确定',
    cancelButtonText: '清空'
  }
)
const defaultTime: [Date, Date] = [new Date(2000, 1, 1, 8, 0, 0), new Date(2000, 1, 1, 12, 0, 0)]
const attrs = useAttrs()
let searchForm = attrs.model as CommonObject
const formTemplate = useTemplateRef<FormInstance>('formTemplate')
const submitForm = async () => {
  await (formTemplate.value as FormInstance).validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
      emit('submitForm')
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = () => {
  console.log(formTemplate.value)
  formTemplate.value?.resetFields()
  for (let key in searchForm) {
    searchForm[key] = onResetValue(searchForm[key])
  }
  emit('resetForm')
  return Promise.resolve()
}

function onResetValue(data: any) {
  const type = data.constructor.name
  switch (type) {
    case 'Object':
      return {}
    case 'Array':
      return []
    case 'String':
      return ''
    case 'Number':
      return 0
    case 'Date':
      return new Date()
    default:
      return ''
  }
}
watch(
  () => attrs.model,
  (val) => {
    searchForm = val as CommonObject
  }
)
defineExpose({
  resetForm
})
</script>
<template>
  <div class="w-full">
    <el-form
      ref="formTemplate"
      v-bind="$attrs">
      <slot name="start"></slot>
      <template v-for="prop in props">
        <el-form-item
          v-if="!prop.disabled"
          :label="prop.label"
          :prop="prop.key"
          :disabled="prop.disabled"
          :class="prop.itemClass ? prop.itemClass : ''">
          <template
            v-if="prop.toolTip"
            #label>
            <el-tooltip>
              <div class="flex items-center">
                <span class="mr-1">{{ prop.label }}</span>
              </div>
              <template #content>
                <div v-html="prop.toolTip"></div>
              </template>
            </el-tooltip>
          </template>
          <!-- 选择框 -->
          <el-select
            v-if="prop.type === 'select'"
            v-model="searchForm[prop.key]"
            :style="{ width: (prop.width || '180') + 'px' }"
            :placeholder="prop.placeholder || '请选择'"
            filterable
            :clearable="prop.clearable !== undefined ? prop.clearable : true"
            :multiple="prop.multiple"
            :collapse-tags="prop.multiple">
            <el-option
              v-for="(option, select_index) in prop.selectData"
              :key="select_index"
              :label="option[prop.selectLabelKey || 'label']"
              :value="option[prop.selectValueKey || 'value']"></el-option>
          </el-select>
          <!-- 输入框 -->
          <el-input
            v-if="prop.type === 'input'"
            v-model="searchForm[prop.key]"
            :placeholder="prop.placeholder || '请输入' + prop.label"
            :maxlength="prop.maxlength"
            :clearable="prop.clearable !== undefined ? prop.clearable : true"
            :style="{ width: (prop.width || '180') + 'px' }"
            @keyup.enter.native="submitForm"></el-input>
          <!-- 输入框数字 -->
          <el-input
            v-if="prop.type === 'number'"
            v-model.number="searchForm[prop.key]"
            :placeholder="prop.placeholder || '请输入'"
            :maxlength="prop.maxlength"
            :clearable="prop.clearable !== undefined ? prop.clearable : true"
            :style="{ width: (prop.width || '180') + 'px' }"
            @keyup.enter.native="submitForm"></el-input>
          <el-input
            v-if="prop.type === 'textarea'"
            v-model="searchForm[prop.key]"
            type="textarea"
            :autosize="{ minRows: 1, maxRows: 2 }"
            :placeholder="prop.placeholder || '请输入'"
            :maxlength="prop.maxlength"
            :clearable="prop.clearable !== undefined ? prop.clearable : true"
            :style="{ width: (prop.width || '180') + 'px' }"></el-input>
          <el-switch
            v-if="prop.type === 'switch'"
            v-model="searchForm[prop.key]"
            active-color="#13ce66"
            inactive-color="#ff4949"></el-switch>
          <!-- 级联选择器 -->
          <el-cascader
            v-if="prop.type === 'cascader'"
            v-model="searchForm[prop.key]"
            :placeholder="prop.placeholder || '请选择'"
            :options="prop.selectData"
            :props="prop.props"
            clearable></el-cascader>
          <!-- 日期选择框 -->
          <el-date-picker
            v-if="prop.type === 'date'"
            v-model="searchForm[prop.key]"
            type="date"
            :placeholder="prop.placeholder || '请选择'"
            :format="prop.labelFormat || 'yyyy-MM-dd'"
            :value-format="prop.valueFormat || 'timestamp'"></el-date-picker>
          <!-- 日期范围选择框 -->
          <el-date-picker
            v-if="prop.type === 'daterange'"
            v-model="searchForm[prop.key]"
            :type="prop.dataRangeType || 'daterange'"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :format="prop.labelFormat || 'yyyy-MM-dd'"
            :default-time="defaultTime"
            :value-format="prop.valueFormat || 'timestamp'"></el-date-picker>
        </el-form-item>
      </template>
      <slot></slot>
      <el-form-item v-if="showButton && attrs.inline">
        <el-button
          v-if="confirmButtonText"
          type="primary"
          @click="submitForm">
          {{ confirmButtonText }}
        </el-button>
        <el-button
          v-if="cancelButtonText"
          @click="resetForm">
          {{ cancelButtonText }}
        </el-button>
      </el-form-item>
    </el-form>
    <div
      v-if="showButton && !attrs.inline"
      class="flex items-center justify-center">
      <el-button
        v-if="confirmButtonText"
        type="primary"
        @click="submitForm">
        {{ confirmButtonText }}
      </el-button>
      <el-button
        v-if="cancelButtonText"
        @click="resetForm">
        {{ cancelButtonText }}
      </el-button>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
