import { defineComponent } from 'vue'
import ProField from '../field'
import { proFormFieldItemProps } from '../../typing'

const valueType = 'text' as const
/**
 * 文本组件
 *
 * @param
 */
const ProFormText = defineComponent({
  name: 'ProFormText',
  inheritAttrs: false,
  props: {
    ...proFormFieldItemProps
  },
  setup(props, { slots }) {
    return () => {
      const { fieldProps, proFieldProps, fieldConfig, ...rest } = props

      return (
        <ProField
          valueType={valueType}
          fieldProps={fieldProps}
          fieldConfig={
            {
              valueType,
              ...fieldConfig
            } as const
          }
          proFieldProps={proFieldProps}
          {...rest}
          v-slots={slots}
        />
      )
    }
  }
})

const Password = defineComponent({
  name: 'ProFormPassword',
  inheritAttrs: false,
  props: {
    ...proFormFieldItemProps
  },
  setup(props, { slots }) {
    return () => {
      const { fieldProps, proFieldProps, fieldConfig, ...rest } = props

      return (
        <ProField
          valueType={'password'}
          fieldProps={fieldProps}
          fieldConfig={
            {
              valueType,
              ...fieldConfig
            } as const
          }
          proFieldProps={proFieldProps}
          {...rest}
          v-slots={slots}
        />
      )
    }
  }
})

const WrappedProFormText = ProFormText
WrappedProFormText.Password = Password
export const ProFormPassword = Password
export default WrappedProFormText
