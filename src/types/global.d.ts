import type { TableColumnCtx } from 'element-plus'
export {}

type ProSchemaValueEnumObj = ''
type ProSchemaValueEnumMap = ''
type ProFieldValueType =
  | 'select'
  | 'input'
  | 'calendar'
  | 'radio'
  | 'checkbox'
  | 'datePicker'

declare global {
  namespace Table {
    interface Column<T = unknown> extends Partial<TableColumnCtx<T>> {
      type?: 'default' | 'index' | 'selection' | 'expand' | 'slot'
      name?: string
      clickEvent?: string | ((item) => void)
      valueEnum?: unknown
      valueType?: ProFieldValueType
      format?: string
      hideInSearch?: boolean
      hideInTable?: boolean
      defaultValue?: unknown
      options?: { label: string; value: string | number }[]
    }
    type Columns = Column[]
    type Option = Partial<ProSchemaValueEnumType>
    type EnumMap = ProFieldValueEnumType | undefined | null
  }
}
