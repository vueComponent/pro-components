import { someType, stringType } from '@v-c/utils'
import { Checkbox, type CheckboxGroupProps } from 'ant-design-vue'
import { type ExtractPropTypes, defineComponent } from 'vue'
import { runFunction } from '@ant-design-vue/pro-utils'
import { proFormFieldItemProps, proFormFieldRemoteProps } from '../../typing'
import ProFormField from '../field'
import { createField } from '../../base-form/create-field'
export const proFormCheckboxGroupProps = {
  ...proFormFieldItemProps,
  ...proFormFieldRemoteProps,
  layout: stringType<'horizontal' | 'vertical'>(),
  options: someType<CheckboxGroupProps['options']>([Array])
}
export type ProFormCheckboxGroupProps = ExtractPropTypes<
  typeof proFormCheckboxGroupProps
>
export const CheckboxGroup = defineComponent({
  name: 'ProFormCheckboxGroup',
  inheritAttrs: false,
  props: {
    ...proFormCheckboxGroupProps
  },
  setup(props, { slots, attrs }) {
    return () => {
      const { options, fieldProps, proFieldProps, valueEnum, ...rest } = props
      return (
        <ProFormField
          {...attrs}
          valueType="checkbox"
          valueEnum={runFunction<[any]>(valueEnum, undefined)}
          fieldProps={
            {
              options,
              ...fieldProps
            } as any
          }
          proFieldProps={proFieldProps}
          {...rest}
          v-slots={slots}
        />
      )
    }
  }
})

/**
 * 多选框的
 *
 * @param
 */
const ProFormCheckboxComponents = defineComponent({
  name: 'ProFormCheckboxComponents',
  inheritAttrs: false,
  props: {
    ...proFormFieldItemProps
  },
  setup(props, { slots }) {
    return () => {
      return <Checkbox {...props.fieldProps} v-slots={slots} />
    }
  }
})

const ProFormCheckbox = createField(
  ProFormCheckboxComponents as any,
  proFormCheckboxGroupProps,
  {
    valuePropName: 'checked'
  }
)

ProFormCheckbox.Group = CheckboxGroup

export default ProFormCheckbox

export const ProFormCheckboxGroup = CheckboxGroup
