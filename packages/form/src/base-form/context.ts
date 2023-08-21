import type { ComputedRef, InjectionKey, Ref } from 'vue'
import { computed, inject, provide, ref } from 'vue'
import type { FormInstance } from 'ant-design-vue/es/form'
import type { NamePath } from '@ant-design-vue/pro-utils'
import type { ColProps, RowProps } from 'ant-design-vue'
import type { BaseFormProps } from './typing'

export interface BaseFormContextValuesType {
  formRef: Ref<FormInstance | undefined>
  modelValue: Ref<Record<string, any>>
  onChangeValue: (namePath: NamePath, value: any) => void
}

export interface BaseFormContextType extends BaseFormContextValuesType {
  mode: ComputedRef<'edit' | 'read'>
  grid: ComputedRef<boolean>
  rowProps: ComputedRef<RowProps>
  colProps: ComputedRef<ColProps>
  form: ComputedRef<FormInstance & { getFieldValue: (path: NamePath) => any }>
}

export const BaseFormContextKey: InjectionKey<BaseFormContextType> =
  Symbol('BaseFormContext')

export const useFormContextProvide = (
  values: BaseFormContextValuesType,
  props: BaseFormProps
) => {
  provide(BaseFormContextKey, {
    ...values,
    mode: computed(() => (props?.readonly ? 'read' : 'edit')),
    grid: computed(() => props?.grid || false),
    rowProps: computed(() => props?.rowProps as RowProps),
    colProps: computed(() => props?.colProps as ColProps),
    form: computed<FormInstance & { getFieldValue: (path: NamePath) => any }>(
      () => {
        return {
          ...values.formRef.value,
          getFieldValue: (path: NamePath) => {
            const obj = values.formRef.value?.getFieldsValue([path] as any)
            if (!obj) return
            const key = Object.keys(obj)[0]
            return obj[key]
          }
        } as FormInstance & { getFieldValue: (path: NamePath) => any }
      }
    )
  })
  return values
}

export const useFormContextInject = () => {
  return inject(BaseFormContextKey, {
    formRef: ref<any>(),
    mode: computed<'edit' | 'read'>(() => 'edit'),
    modelValue: ref(),
    onChangeValue: () => {}
  } as any) as BaseFormContextType
}
