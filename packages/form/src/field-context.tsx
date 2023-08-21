import { functionType, objectType, pick, stringType } from '@v-c/utils'
import type { ComputedRef, ExtractPropTypes, InjectionKey, Ref } from 'vue'
import { computed, defineComponent, inject, provide } from 'vue'
import type {
  NamePath,
  ProFieldProps,
  ProFieldValueType,
  SearchTransformKeyFn
} from '@ant-design-vue/pro-utils'
import type { FormInstance, FormItemProps } from 'ant-design-vue'
import type { FieldProps, GroupProps } from './typing'
import { commonFormProps } from './base-form'

export const fieldPropsContext = {
  ...pick(commonFormProps, ['grid']),
  fieldProps: objectType<FieldProps>(),
  proFieldProps: objectType<ProFieldProps>(),
  formItemProps: objectType<FormItemProps>(),
  groupProps: objectType<GroupProps>(),
  setFieldValueType: functionType<
    (
      name: NamePath,
      obj: {
        valueType?: ProFieldValueType
        dateFormat?: string
        /** 数据转化的地方 */
        transform?: SearchTransformKeyFn
      }
    ) => void
  >(),
  /** Form 组件的类型 */
  formComponentType: stringType(),
  /** 获取表单实例计数器 */
  formKey: stringType(),
  /** 表单的 getPopupContainer 控制 */
  getPopupContainer: functionType<(e: HTMLElement) => ParentNode>(),
  formRef: objectType<Ref<FormInstance | undefined>>()
}

export type FieldPropsContext = Partial<
  ExtractPropTypes<typeof fieldPropsContext>
>

export const FieldContextKey: InjectionKey<{ value: FieldPropsContext }> =
  Symbol('FieldContext')

export const useFieldContextInject = () => {
  const props = inject(FieldContextKey, { value: {} })
  return computed(() => props.value) as ComputedRef<FieldPropsContext>
}

const FieldContext = defineComponent({
  name: 'FieldContext',
  inheritAttrs: false,
  props: {
    value: objectType<FieldPropsContext>()
  },
  setup(props, { slots }) {
    provide(FieldContextKey, props)
    return () => {
      return slots.default?.()
    }
  }
})

export { FieldContext }

export default FieldContext

export const exposeFormInstance = (formRef: Ref<FormInstance | undefined>) => {
  return {
    resetFields: (namePath?: NamePath) => formRef.value?.resetFields(namePath),
    clearValidate: (namePath?: NamePath) =>
      formRef.value?.clearValidate(namePath),
    validateFields: (nameList?: string | NamePath[], options?: any) =>
      formRef.value?.validateFields(nameList, options),
    getFieldsValue: (nameList?: any) => formRef.value?.getFieldsValue(nameList),
    validate: (namePath?: any, options?: any) =>
      formRef.value?.validate(namePath, options),
    scrollToField: (namePath?: any, options?: any) =>
      formRef.value?.scrollToField(namePath, options)
  }
}

export const exposeBaseFormInstance = (baseFormRef: Ref) => {
  return {
    getFieldsFormatValue: (allData?: true) =>
      baseFormRef.value?.getFieldsFormatValue?.(allData),
    getFieldFormatValue: (paramsNameList: NamePath = []) =>
      baseFormRef.value?.getFieldFormatValue?.(paramsNameList),
    getFieldFormatValueObject: (paramsNameList?: NamePath) =>
      baseFormRef.value?.getFieldFormatValueObject?.(paramsNameList),
    validateFieldsReturnFormatValue: (nameList?: NamePath[]) =>
      baseFormRef.value?.validateFieldsReturnFormatValue?.(nameList)
  }
}
