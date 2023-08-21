import { tableProps } from 'ant-design-vue/es/table/Table'
import {
  anyType,
  arrayType,
  booleanType,
  eventType,
  functionType,
  numberType,
  objectType,
  someType,
  stringType
} from '@v-c/utils'
import type { CSSProperties, ExtractPropTypes, VNodeChild } from 'vue'
import type { ColumnType } from 'ant-design-vue/es/table'
import type {
  ColumnFilterItem,
  CompareFn
} from 'ant-design-vue/es/table/interface'
import type {
  ProSchema,
  ProSchemaComponentTypes,
  ProTableEditableFnType,
  SearchTransformKeyFn
} from '@ant-design-vue/pro-utils'
import type { SearchConfig } from './components/form/form-render'

export type ExtraProColumnType<T> = Omit<
  ColumnType<T>,
  'render' | 'children' | 'title' | 'filters' | 'onFilter' | 'sorter'
> & {
  sorter?:
    | string
    | boolean
    | CompareFn<T>
    | {
        compare?: CompareFn<T>
        /** Config multiple sorter order priority */
        multiple?: number
      }
}
export type ProColumnType<T = unknown, ValueType = 'text'> = ProSchema<
  T,
  ExtraProColumnType<T> & {
    index?: number
    /**
     * 每个表单占据的格子大小
     *
     * @param 总宽度 = span* colSize
     * @param 默认为 1
     */
    colSize?: number

    /** 搜索表单的默认值 */
    initialValue?: any

    /** @name 是否缩略 */
    ellipsis?: ColumnType<T>['ellipsis']
    /** @name 是否拷贝 */
    copyable?: boolean

    /** @deprecated Use `search=false` instead 在查询表单中隐藏 */
    hideInSearch?: boolean

    /** 在查询表单中隐藏 */
    search?:
      | false
      | {
          /**
           * Transform: (value: any) => ({ startTime: value[0], endTime: value[1] }),
           *
           * @name 转化值的key, 一般用于事件区间的转化
           */
          transform: SearchTransformKeyFn
        }

    /** @name 在 table 中隐藏 */
    hideInTable?: boolean

    /** @name 在新建表单中删除 */
    hideInForm?: boolean

    /** @name 不在配置工具中显示 */
    hideInSetting?: boolean

    /** @name 表头的筛选菜单项 */
    filters?: boolean | ColumnFilterItem[]

    /** @name 筛选的函数，设置为 false 会关闭自带的本地筛选 */
    onFilter?: boolean | ColumnType<T>['onFilter']

    /** @name Form 的排序 */
    order?: number

    /** @name 可编辑表格是否可编辑 */
    editable?: boolean | ProTableEditableFnType<T>

    /** @private */
    listKey?: string

    /** @name 只读 */
    readonly?: boolean

    /** @name 列设置的 disabled */
    disable?:
      | boolean
      | {
          checkbox: boolean
        }
  },
  ProSchemaComponentTypes,
  ValueType,
  {
    lightProps?: any
  }
>

export type ProColumnGroupType<RecordType, ValueType> = {
  children: ProColumns<RecordType>[]
} & ProColumnType<RecordType, ValueType>

export type ProColumns<T = any, ValueType = 'text'> =
  | ProColumnGroupType<T, ValueType>
  | ProColumnType<T, ValueType>

export type ActionType = any

export interface OptionSearchProps {}
export type OptionsType =
  | ((e: MouseEvent, action?: ActionType) => void)
  | boolean

export interface OptionConfig {
  density?: boolean
  fullScreen?: OptionsType
  reload?: OptionsType
  setting?: boolean | SettingOptionType
  search?: (OptionSearchProps & { name?: string }) | boolean
}

export interface SettingOptionType {
  draggable?: boolean
  checkable?: boolean
  checkedReset?: boolean
  listsHeight?: number
  extra?: VNodeChild
  children?: VNodeChild
}

export type ProTableRequestResult = (
  params?: {
    pageSize: number
    current?: number
  },
  sort?: any,
  filter?: any
) => { data: any[]; total: number; success?: boolean }

export const proTableProps = {
  ...tableProps(),
  columns: arrayType<ProColumns[]>(),
  request: functionType<ProTableRequestResult>(),
  params: objectType(),
  postData: functionType<(data: any[]) => any[]>(),
  defaultData: arrayType(),
  dataSource: arrayType(),
  onDataSourceChange: eventType<(data: any[]) => any[]>(),
  'onUpdate:dataSource': eventType<(data: any[]) => any[]>(),
  toolBarRender: someType<(() => VNodeChild) | false>([Function, Boolean]),
  onLoad: eventType<(data: any[]) => void>(),
  onLoadingChange: eventType<(loading: boolean) => void>(),
  onRequestError: eventType<(e: Error) => void>(),
  tableClassName: stringType(),
  tableStyle: objectType<CSSProperties>(),
  options: objectType<{
    density?: boolean
    fullScreen: boolean | Function
    reload: boolean | Function
    setting: boolean | SettingOptionType
  }>({ fullScreen: false, reload: true, setting: true }),
  search: someType<false | SearchConfig>([Boolean, Object]),
  size: stringType('middle'),
  onSizeChange: eventType<(size: string) => void>(),
  dateFormatter: anyType(),
  beforeSearchSubmit: functionType<(params: any) => any>(),
  type: stringType<string>(),
  form: objectType(),
  onSubmit: eventType<(params: any) => void>(),
  onReset: eventType(),
  columnEmptyText: someType([Boolean, String], false),
  tableRender:
    functionType<(props: any, dom: any, domList: any) => VNodeChild>(),
  toolbar: someType([Object]),
  tableExtraRender:
    functionType<(props: any, dataSource: any[]) => VNodeChild>(),
  manualRequest: booleanType<boolean>(false),
  editable: objectType(),
  cardBordered: someType([Boolean, Object], false),
  ghost: booleanType<boolean>(false),
  debounceTime: numberType<number>(10),
  revalidateOnFocus: booleanType<boolean>(true),
  defaultClassName: stringType('ant-pro-table')
}

export type ProTableProps = ExtractPropTypes<typeof proTableProps>

export interface ProTableSlots {
  bodyCell: {
    text: any
    value: any
    record: Record<string, any>
    index: number
    column: ProColumnType
  }
  expandIcon: any
  emptyText: any
  footer: any
  summary: any
  expandedRowRender: any
  headerCell: {
    title: any
    column: ColumnType
  }
  customFilterIcon: any
  customFilterDropdown: any
  default: any
}

export type BorderedType = 'search' | 'table'

export type Bordered =
  | boolean
  | {
      search?: boolean
      table?: boolean
    }
