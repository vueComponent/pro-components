import { defineComponent } from 'vue'
import { proFormFieldItemProps } from '../../typing'
import ProField from '../field'
import { useFieldContextInject } from '../../field-context'

const valueType = 'dateQuarter' as const
/**
 * 周选择组件
 *
 * @param
 */
const ProFormDatePickerQuarter = defineComponent({
  name: 'ProFormDatePickerQuarter',
  inheritAttrs: false,
  props: {
    ...proFormFieldItemProps
  },
  setup(props) {
    const context = useFieldContextInject()
    return () => {
      const { fieldProps, fieldConfig, ...rest } = props
      return (
        <ProField
          valueType={valueType}
          fieldProps={{
            getPopupContainer: context.value.getPopupContainer,
            ...fieldProps
          }}
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
export default ProFormDatePickerQuarter
