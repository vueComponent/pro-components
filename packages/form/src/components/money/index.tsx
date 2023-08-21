import { anyType, stringType } from '@v-c/utils'
import { defineComponent } from 'vue'
import { proFormFieldItemProps } from '../../typing'
import ProFormField from '../field'

export const proFormMoneyProps = {
  ...proFormFieldItemProps,
  customSymbol: stringType(),
  locale: stringType(),
  min: anyType(),
  max: anyType()
}
/**
 * 金额输入框
 *
 * @param
 */
const ProFormMoney = defineComponent({
  name: 'ProFormMoney',
  inheritAttrs: false,
  props: {
    ...proFormMoneyProps
  },
  setup(props) {
    return () => {
      const {
        fieldProps,
        proFieldProps,
        locale,
        min,
        max,
        fieldConfig,
        ...rest
      } = props
      return (
        <ProFormField
          valueType={{
            type: 'money',
            locale
          }}
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

export default ProFormMoney
