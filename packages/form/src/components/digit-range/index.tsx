import { numberType, stringType } from '@v-c/utils'
import { defineComponent } from 'vue'
import { proFormFieldItemProps } from '../../typing'
import ProFormField from '../field'
export type Value = string | number | undefined

export type ValuePair = Value[]

export const proFormDigitRangeProps = {
  ...proFormFieldItemProps,
  separator: stringType(),
  separatorWidth: numberType()
}
/**
 * 数字范围选择组件
 *
 * @param
 */
const ProFormDigit = defineComponent({
  name: 'ProFormDigitRange',
  inheritAttrs: false,
  props: {
    ...proFormDigitRangeProps
  },
  setup(props) {
    return () => {
      const { fieldProps, proFieldProps, fieldConfig, ...rest } = props
      return (
        <ProFormField
          valueType="digitRange"
          fieldProps={{
            ...fieldProps
          }}
          fieldConfig={{
            defaultProps: {
              width: '100%'
            },
            ...fieldConfig
          }}
          proFieldProps={proFieldProps}
          {...rest}
        />
      )
    }
  }
})

export default ProFormDigit
