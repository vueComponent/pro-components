import {
  anyType,
  booleanType,
  eventType,
  functionType,
  objectType,
  someType,
  stringType
} from '@v-c/utils'
import type { FormInstance } from 'ant-design-vue/es/form'
import { formProps } from 'ant-design-vue/es/form'
import type { ProFieldProps, ProRequestData } from '@ant-design-vue/pro-utils'
import type { ExtractPropTypes, VNodeChild } from 'vue'
import type dayjs from 'dayjs'
import type { FormItemProps } from 'ant-design-vue'
import type { SubmitterProps } from '../components'
import type { FieldProps, GroupProps, ProFormGridConfig } from '../typing'
// import { proFormGridConfig } from '../typing'
const proFormGridConfig = {
  grid: booleanType(),
  colProps: someType<ProFormGridConfig['colProps']>([Object]),
  rowProps: someType<ProFormGridConfig['rowProps']>([Object])
}
export const commonBaseFormProps = {
  ...proFormGridConfig,
  /**
   * @name 自定义提交的配置
   *
   * @example 不展示提交按钮和重置按钮
   * submitter={false}
   * @example 修改重置按钮的样式，并且隐藏提交按钮
   * submitter={{resetButtonProps: { type: 'dashed'},submitButtonProps: { style: { display: 'none', }}}}
   *
   * @example 修改提交按钮和重置按钮的顺序
   * submitter={{ render:(props,dom)=> [...dom.reverse()]}}
   *
   * @example 修改提交和重置按钮文字
   * submitter={{ searchConfig: { submitText: '提交2',restText: '重置2'}}}
   */
  submitter: someType<
    | SubmitterProps<{
        form?: FormInstance
      }>
    | false
  >([Object, Boolean]),
  readonly: booleanType(),
  loading: booleanType(),
  'onUpdate:loading': eventType<(bool: boolean) => void>(),
  onLoadingChange: eventType<(bool: boolean) => void>(),
  onInit:
    functionType<
      (values: Record<string, any>, form: FormInstance | undefined) => void
    >(),
  formItemProps: objectType<FormItemProps>(),
  request: functionType<ProRequestData<any, any> | undefined>(),
  params: objectType(),
  onReset: eventType(),
  /**
   * @name自动选中第一项
   * @description 只对有input的类型有效
   */
  autoFocusFirstInput: booleanType(),
  contentRender:
    functionType<
      (
        items: VNodeChild,
        submitter: VNodeChild,
        form: FormInstance
      ) => VNodeChild
    >(),
  fieldProps: objectType<FieldProps>(),
  proFieldProps: objectType<ProFieldProps>(),
  groupProps: objectType<GroupProps>(),
  /** 是否回车提交 */
  isKeyPressSubmit: booleanType(),
  /** Form 组件的类型，内部使用 */
  formComponentType: stringType<'DrawerForm' | 'ModalForm' | 'QueryFilter'>(),
  /**
   * 如果为 false,会原样保存。
   *
   * @default true
   * @param 要不要值中的 Null 和 undefined
   */
  omitNil: booleanType(),
  /**
   * 格式化 Date 的方式，默认转化为 string
   *
   * @example  dateFormatter="string" : Moment -> YYYY-MM-DD
   * @example  dateFormatter="YYYY-MM-DD  HH:mm:SS" Moment -> YYYY-MM-DD  HH:mm:SS
   * @example  dateFormatter="HH:mm:SS" Moment -> HH:mm:SS
   * @example  dateFormatter="number" Moment -> timestamp
   * @example  dateFormatter=false Moment -> Moment
   * @example  dateFormatter={(value)=>value.format("YYYY-MM-DD")}
   */
  dateFormatter: anyType<
    | 'string'
    | 'number'
    | ((value: dayjs.Dayjs, valueType: string) => string | number)
    | false
  >('string')
}

export const commonFormProps = {
  ...formProps(),
  ...commonBaseFormProps
}

export const baseFormProps = {
  ...commonFormProps
}

export type BaseFormProps = ExtractPropTypes<typeof baseFormProps>
