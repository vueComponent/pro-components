import { proSchemaProps } from '@ant-design-vue/pro-utils'
import {
  anyType,
  booleanType,
  eventType,
  functionType,
  objectType,
  stringType
} from '@v-c/utils'
import type { DefineComponent, ExtractPropTypes } from 'vue'
import { defineComponent } from 'vue'
import ProField from '@ant-design-vue/pro-field'
import { useFormContextInject } from '../../base-form/context'
import { proFormFieldItemProps } from '../../typing'
import { createField } from '../../base-form/create-field'

export const proFormFieldProps = {
  ...proSchemaProps({}, proFormFieldItemProps),
  mode: stringType<'edit' | 'read' | 'update'>(),
  // 用来判断是否被嵌套DOM渲染
  isDefaultDom: booleanType(),
  plain: booleanType(),
  text: anyType(),
  'onUpdate:text': eventType<(val: any) => void>(),
  value: anyType(),
  'onUpdate:value': eventType<(val: any) => void>(),
  getFieldProps: functionType<() => Record<string, any>>(),
  getFormItemProps: functionType<() => Record<string, any>>(),
  /**
   * dependencies value later
   */
  dependenciesValues: objectType(),
  originDependencies: objectType()
}

export type ProFormFieldProps = ExtractPropTypes<typeof proFormFieldProps>

const BaseFormItem = defineComponent({
  name: 'BaseFormItem',
  inheritAttrs: false,
  props: {
    ...proFormFieldProps
  },
  setup(props, { slots, attrs }) {
    const { mode } = useFormContextInject()
    return () => {
      return (
        <ProField
          {...attrs}
          {...(props as any)}
          {...props.proFieldProps}
          valueType={props.valueType ?? 'text'}
          render={props.render}
          text={props.text ?? props.value}
          mode={props.mode ?? mode.value}
          v-slots={slots}
        />
      )
    }
  }
})

export default createField<ProFormFieldProps>(
  BaseFormItem as DefineComponent<ProFormFieldProps>,
  proFormFieldProps
) as any
