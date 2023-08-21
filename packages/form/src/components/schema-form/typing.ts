import { anyType, arrayType, omit, someType, stringType } from '@v-c/utils'
import { formProps } from 'ant-design-vue/es/form'
import type {
  ProSchema,
  ProSchemaComponentTypes,
  SearchConvertKeyFn,
  SearchTransformKeyFn
} from '@ant-design-vue/pro-utils'
import type { NamePath } from 'ant-design-vue/es/form/interface'
import type { ExtractPropTypes, Ref, VNodeChild } from 'vue'
import { queryFilterProps } from '../../layouts/query-filter'
import type { ProFormGridConfig } from '../../typing'
import { commonFormProps } from '../../base-form'
export type Key = string | number
export type ExtraProColumnType = {
  tooltip?: VNodeChild
  key?: Key
  className?: string
  /**
   * @type auto 使用组件默认的宽度
   * @type xs=104px 适用于短数字、短文本或选项。
   * @type sm=216px 适用于较短字段录入、如姓名、电话、ID 等。
   * @type md=328px 标准宽度，适用于大部分字段长度。
   * @type lg=440px 适用于较长字段录入，如长网址、标签组、文件路径等。
   * @type xl=552px 适用于长文本录入，如长链接、描述、备注等，通常搭配自适应多行输入框或定高文本域使用。
   */
  width?: string | number

  name?: NamePath | NamePath[]
  defaultKeyWords?: string
} & Pick<ProFormGridConfig, 'rowProps' | 'colProps'>

export type FormFieldType =
  | 'group'
  | 'formList'
  | 'formSet'
  | 'divider'
  | 'dependency'

export type ProFormColumnsType<T = any, ValueType = 'text'> = ProSchema<
  T,
  ExtraProColumnType & {
    index?: number
    /**
     * 每个表单占据的格子大小
     *
     * @param 总宽度 = span* colSize
     * @param 默认为 1
     */
    colSize?: number
    /** 是否只读模式 */
    readonly?: boolean
    /** 搜索表单的默认值 */
    initialValue?: any
    /**
     * @name 获取时转化值，一般用于将数据格式化为组件接收的格式
     * @param value 字段的值
     * @param namePath 字段的name
     * @returns 字段新的值
     *
     *
     * @example a,b => [a,b]     convertValue: (value,namePath)=> value.split(",")
     * @example string => json   convertValue: (value,namePath)=> JSON.parse(value)
     * @example number => date   convertValue: (value,namePath)=> Dayjs(value)
     * @example YYYY-MM-DD => date   convertValue: (value,namePath)=> Dayjs(value,"YYYY-MM-DD")
     * @example  string => object   convertValue: (value,namePath)=> { return {value,label:value} }
     */
    convertValue?: SearchConvertKeyFn
    /**
     * @name 提交时转化值，一般用于将值转化为提交的数据
     * @param value 字段的值
     * @param namePath 字段的name
     * @param allValues 所有的字段
     * @returns 字段新的值，如果返回对象，会和所有值 merge 一次
     *
     * @example {name:[a,b] => {name:a,b }    transform: (value,namePath,allValues)=> value.join(",")
     * @example {name: string => { newName:string }    transform: (value,namePath,allValues)=> { newName:value }
     * @example {name:dayjs} => {name:string transform: (value,namePath,allValues)=> value.format("YYYY-MM-DD")
     * @example {name:dayjs}=> {name:时间戳} transform: (value,namePath,allValues)=> value.valueOf()
     * @example {name:{value,label}} => { name:string} transform: (value,namePath,allValues)=> value.value
     * @example {name:{value,label}} => { valueName,labelName  } transform: (value,namePath,allValues)=> { valueName:value.value, labelName:value.name }
     */
    transform?: SearchTransformKeyFn
    /** Form 的排序 */
    order?: number
    /** 嵌套子项 */
    columns?:
      | ProFormColumnsType<T, ValueType | FormFieldType>[]
      | ((values: any) => ProFormColumnsType<T, ValueType | FormFieldType>[])
  },
  ProSchemaComponentTypes,
  ValueType | FormFieldType
>
export const proFormPropsType = {
  layoutType: stringType(),
  ...queryFilterProps,
  columns: arrayType<ProFormColumnsType[]>()
}

export const formSchema = {
  ...omit(formProps(), ['onFinish']),
  ...proFormPropsType,
  ...commonFormProps,
  title: anyType(),
  description: anyType(),
  steps: anyType(),
  type: anyType(),
  action: anyType(),
  /**
   * @default true
   * Fine-grained control over when to update
   */
  shouldUpdate: someType<
    boolean | ((newValues: any, oldValues?: any) => boolean)
  >([Boolean, Function], true)
}

export type FormSchema = ExtractPropTypes<typeof formSchema>

export type ProFormRenderValueTypeItem<T, ValueType> = {
  label: any
  getFieldProps?: () => any
  getFormItemProps?: () => any
} & ProFormColumnsType<T, ValueType>

export type ProFormRenderValueTypeHelpers<T, ValueType> = {
  originItem: ProFormColumnsType<T, ValueType>
  type: ProSchemaComponentTypes
  formRef: Ref
  genItems: (items: ProFormColumnsType<T, ValueType>[]) => VNodeChild[]
} & Pick<FormSchema, 'action'>

export type ItemType<T, ValueType> = Omit<
  ProFormRenderValueTypeItem<T, ValueType>,
  'key'
> & {
  key?: Key | Key[]
}

export type ProSchemaRenderValueTypeFunction<T = any, ValueType = any> = (
  item: ItemType<T, ValueType>,
  helpers: ProFormRenderValueTypeHelpers<T, ValueType>
) => VNodeChild
