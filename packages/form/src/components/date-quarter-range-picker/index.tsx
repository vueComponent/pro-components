import { defineComponent } from 'vue'
import { dateArrayFormatter } from '@ant-design-vue/pro-utils'
import ProField from '../field'
import { proFormFieldItemProps } from '../../typing'
import { useFieldContextInject } from '../../field-context'

const valueType = 'dateQuarterRange' as const

/**
 * 月份区间选择组件
 *
 * @param
 */
const DateMonthRangePicker = defineComponent({
  name: 'ProFormDateMonthRangePicker',
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
            lightFilterLabelFormatter: (value: any) =>
              dateArrayFormatter(
                value,
                (fieldProps as any)?.format || 'YYYY-MM'
              ),
            ...fieldConfig
          }}
          {...rest}
        />
      )
    }
  }
})
export default DateMonthRangePicker
