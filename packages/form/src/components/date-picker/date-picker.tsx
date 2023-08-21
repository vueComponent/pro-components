import { defineComponent } from 'vue'
import ProFormField from '../field'
import { proFormFieldItemProps } from '../../typing'
import { useFieldContextInject } from '../../field-context'

const valueType = 'date' as const

/**
 * 日期选择组件
 *
 * @param
 */

const ProFormDatePicker = defineComponent({
  name: 'ProFormDatePicker',
  inheritAttrs: false,
  props: {
    ...proFormFieldItemProps
  },
  setup(props) {
    const context = useFieldContextInject()
    return () => {
      const { proFieldProps, fieldProps, fieldConfig, ...rest } = props
      return (
        <ProFormField
          valueType={valueType}
          fieldProps={{
            getPopupContainer: context.value.getPopupContainer,
            ...fieldProps
          }}
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

export default ProFormDatePicker
