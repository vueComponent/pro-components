import { anyType } from '@v-c/utils'
import { defineComponent } from 'vue'
import { proFormFieldItemProps } from '../../typing'
import ProFormField from '../field'

const proFormDigitProps = {
  ...proFormFieldItemProps,
  min: anyType(),
  max: anyType()
}
/**
 * 数组选择组件
 *
 * @param
 */
const ProFormDigit = defineComponent({
  name: 'ProFormDigit',
  inheritAttrs: false,
  props: {
    ...proFormDigitProps
  },
  setup(props) {
    return () => {
      const { fieldProps, min, proFieldProps, max, fieldConfig, ...rest } =
        props
      return (
        <ProFormField
          valueType="digit"
          fieldProps={{
            min,
            max,
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
