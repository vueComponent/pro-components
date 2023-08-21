import { defineComponent } from 'vue'
import ProField from '../field'
import { proFormFieldItemProps } from '../../typing'
import { useFieldContextInject } from '../../field-context'

const valueType = 'dateMonth' as const
/**
 * 周选择组件
 *
 * @param
 */
const ProFormDatePickerMonth = defineComponent({
  name: 'ProFormDatePickerMonth',
  inheritAttrs: false,
  props: {
    ...proFormFieldItemProps
  },
  setup(props) {
    const context = useFieldContextInject()
    return () => {
      const { proFieldProps, fieldProps, fieldConfig, ...rest } = props
      return (
        <ProField
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

export default ProFormDatePickerMonth
