interface CommonObject {
  [key: string]: any
}

type TableColumnAlign = 'left' | 'center' | 'right'
interface TableColumnProp {
  label: string
  key: string
  minWidth?: number
  prop?: TableColumnProp
  sortable?: boolean
  width?: string
  align?: TableColumnAlign
  fixed?: boolean
  labelTooltip?: string
  copytext?: boolean
  slotName?: string
  children?: TableColumnProp[]
  filterName?: string
  filterParams?: any[]
}
interface TablePageInfo {
  pageNum: number
  limit: number
  total: number
}

interface SelectDataItem extends CommonObject {
  label: 'string'
  value: any
}

interface AdditionalFormProp {
  toolTip?: string
}
type FormPropType = 'input' | 'textarea' | 'number' | 'select' | 'cascader' | 'date' | 'daterange' | 'switch' | 'icon' | 'markdown'
type FormProp = {
  label: string
  key: string
  type: FormPropType
  width?: string | number
  placeholder?: string
  clearable?: boolean
  multiple?: boolean
  maxlength?: number
  props?: any
  labelFormat?: string
  valueFormat?: string
  disabled?: boolean
  dataRangeType?: 'year' | 'month' | 'date' | 'datetime' | 'week' | 'datetimerange' | 'daterange'
  selectData?: SelectDataItem[]
  selectLabelKey?: string
  selectValueKey?: string
  itemClass?: string
} & AdditionalFormProp
interface ConfigBody {
  configKey: string
  data: any
}
