import { defineComponent } from 'vue'
import ProField from '../field'
import { proFormFieldItemProps } from '../../typing'
import { useFieldContextInject } from '../../field-context'

const valueType = 'dateTime' as const

/**
 * 时间日期选择组件
 *
 * @param
 */
const ProFormDateTimePicker = defineComponent({
  name: 'ProFormDateTimePicker',
  inheritAttrs: false,
  props: {
    ...proFormFieldItemProps
  },
  setup(props) {
    const context = useFieldContextInject()
    return () => {
      const { fieldProps, proFieldProps, fieldConfig, ...rest } = props
      return (
        <ProField
          fieldProps={{
            getPopupContainer: context.value.getPopupContainer,
            ...fieldProps
          }}
          valueType={valueType}
          proFieldProps={proFieldProps}
          fieldConfig={{
            valueType,
            customLightMode: true,
            ...fieldConfig
          }}
          {...rest}
        />
      )
    }
  }
})
export default ProFormDateTimePicker
