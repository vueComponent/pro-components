import { someType, stringType } from '@v-c/utils'
import { Radio, type RadioGroupProps } from 'ant-design-vue'
import { defineComponent } from 'vue'
import { runFunction } from '@ant-design-vue/pro-utils'
import { proFormFieldItemProps, proFormFieldRemoteProps } from '../../typing'
import ProField from '../field'
import { createField } from '../../base-form/create-field'
import type { ProFormItemProps } from '../form-item'

export const proFormRadioGroupProps = {
  ...proFormFieldItemProps,
  ...proFormFieldRemoteProps,
  layout: stringType<'horizontal' | 'vertical'>(),
  radioType: stringType<'button' | 'radio'>(),
  options: someType<RadioGroupProps['options']>([Array])
}
const RadioGroup = defineComponent({
  name: 'ProFormRadioGroup',
  inheritAttrs: false,
  props: {
    ...proFormRadioGroupProps
  },
  setup(props) {
    return () => {
      const {
        fieldProps,
        options,
        radioType,
        layout,
        proFieldProps,
        valueEnum,
        fieldConfig,
        ...rest
      } = props
      return (
        <ProField
          valueType={radioType === 'button' ? 'radioButton' : 'radio'}
          valueEnum={runFunction<[any]>(valueEnum, undefined)}
          {...rest}
          fieldProps={{
            options,
            layout,
            ...fieldProps
          }}
          proFieldProps={proFieldProps}
          fieldConfig={{
            customLightMode: true,
            ...fieldConfig
          }}
        />
      )
    }
  }
})

/**
 * Radio
 *
 * @param
 */
const ProFormRadioComponents = defineComponent({
  name: 'ProFormRadio',
  inheritAttrs: false,
  props: {
    ...proFormFieldItemProps
  },
  setup(props, { slots }) {
    return () => {
      const children = slots.default?.()
      const { fieldProps } = props
      return <Radio {...fieldProps}> {children}</Radio>
    }
  }
})

const ProFormRadio = createField<ProFormItemProps>(
  ProFormRadioComponents as any,
  {},
  {
    valuePropName: 'checked',
    ignoreWidth: true
  }
)

ProFormRadio.Group = RadioGroup
ProFormRadio.Button = Radio.Button
export const ProFormRadioGroup = RadioGroup
export default ProFormRadio
